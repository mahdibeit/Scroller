import { NextResponse } from "next/server";
import {
  getOrInitUserHistory,
  getOrCreateUserId,
  type UserActivity,
} from "@/lib/track";
import { type Product } from "@/lib/types";
import fs from "node:fs/promises";
import path from "node:path";
import {
  EMBEDDING_DIM,
  EMBEDDINGS_URL,
  QWEN_EMBEDDING_SIZE_1B,
} from "@/lib/constants";

// Fetch binary file and return Float32Array
async function fetchBinaryFloat32Array(): Promise<Float32Array> {
  const filePath = path.join(process.cwd(), "public", "embeddings.bin");
  const fileBuffer = await fs.readFile(filePath); // Node Buffer
  const floatArray = new Float32Array(fileBuffer.length / 4);

  for (let i = 0; i < floatArray.length; i++) {
    floatArray[i] = fileBuffer.readFloatLE(i * 4); // readFloatBE if needed
  }

  return floatArray;
}

// Parse into array of Float32Array embeddings
function parseFloat32Embeddings(
  flatArray: Float32Array,
  dim: number,
): Float32Array[] {
  const embeddings: Float32Array[] = [];
  for (let i = 0; i < flatArray.length; i += dim) {
    embeddings.push(flatArray.subarray(i, i + dim));
  }
  return embeddings;
}

async function loadFloat32Embeddings(
  url: string,
  dim: number,
): Promise<Float32Array[]> {
  const floatArray = await fetchBinaryFloat32Array();
  return parseFloat32Embeddings(floatArray, dim);
}

type WeightedEmbedding = { emb: number[]; weight: number };

// Normalize timestamps across all interactions to [0,1]
function computeNormalizedDecayWeights(
  timestamps: string[],
): Map<string, number> {
  if (timestamps.length === 0) return new Map();
  const times = timestamps.map((ts) => new Date(ts).getTime());
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);
  const range = maxTime - minTime || 1; // prevent divide by zero

  const weights = new Map<string, number>();
  for (let i = 0; i < timestamps.length; i++) {
    const normWeight = (times[i]! - minTime) / range;
    weights.set(timestamps[i]!, normWeight);
  }
  return weights;
}

// Categorize view time into behavior
function categorizeViewTime(
  timeSpent: number,
): "ignore" | "negative" | "neutral" | "positive" {
  if (timeSpent < 2) return "ignore";
  if (timeSpent < 4) return "negative"; // 2–3 seconds
  if (timeSpent <= 5) return "neutral"; // 4–5 seconds
  return "positive"; // >5 seconds
}

// Get embedding vector for a product by ASIN
function getEmbedding(
  itemId: string,
  allProducts: Product[],
  bin_embeddings: Float32Array[],
): number[] | undefined {
  const embeddingIndex = allProducts.find(
    (p) => p.asin === itemId,
  )?.embedding_index;
  return embeddingIndex !== undefined
    ? Array.from(bin_embeddings[embeddingIndex]!)
    : undefined;
}

// Add weighted embedding to a list
function addWeightedEmbedding(
  embedding: number[],
  weight: number,
  list: WeightedEmbedding[],
) {
  list.push({ emb: embedding, weight });
}

// Combine weighted embeddings by weighted average
function combineEmbeddings(
  embeddings: WeightedEmbedding[],
  dim: number,
): number[] {
  if (embeddings.length === 0) return new Array(dim).fill(0) as number[];
  const result = new Float32Array(dim);

  for (const { emb, weight } of embeddings) {
    for (let i = 0; i < dim; i++) {
      result[i]! += emb[i]! * weight;
    }
  }

  const totalWeight = embeddings.reduce((sum, e) => sum + e.weight, 0);
  for (let i = 0; i < dim; i++) {
    result[i]! /= totalWeight;
  }

  return Array.from(result);
}

// Main function: create user vector with time-decayed weighted embeddings
export async function createUserVector(
  userData: UserActivity,
): Promise<number[]> {
  const filePath = path.join(
    process.cwd(),
    "public",
    "combined_processed.json",
  );
  const fileText = await fs.readFile(filePath, "utf-8");
  const allProducts: Product[] = JSON.parse(fileText) as Product[];

  const bin_embeddings = await loadFloat32Embeddings(
    EMBEDDINGS_URL,
    EMBEDDING_DIM,
  );

  // Collect all timestamps from all signals for normalized decay weights
  const allTimestamps: string[] = [
    ...Object.values(userData.liked_item_keys).map((v) => v.timestamp),
    ...Object.values(userData.clicked_item_keys).map((v) => v.timestamp),
    ...Object.values(userData.viewed_item_keys).map((v) => v.timestamp),
    ...Object.values(userData.added_to_cart).map((v) => v.timestamp),
  ];

  const normalizedWeights = computeNormalizedDecayWeights(allTimestamps);

  // Helper to get decay weight from normalized weights map
  function decayWeight(ts: string): number {
    return normalizedWeights.get(ts) ?? 0;
  }

  const embeddings: WeightedEmbedding[] = [];

  // Views
  for (const [asin, { timestamp, time_spent }] of Object.entries(
    userData.viewed_item_keys,
  )) {
    const behavior = categorizeViewTime(time_spent);
    if (behavior === "ignore" || behavior === "neutral") continue;

    const emb = getEmbedding(asin, allProducts, bin_embeddings);
    if (!emb) continue;

    const weight = decayWeight(timestamp);
    const baseWeight = 1;

    if (behavior === "positive") {
      addWeightedEmbedding(emb, baseWeight * weight, embeddings);
    } else if (behavior === "negative") {
      addWeightedEmbedding(
        emb.map((x) => -x),
        baseWeight * weight,
        embeddings,
      );
    }
  }

  // Likes
  for (const [asin, { timestamp }] of Object.entries(
    userData.liked_item_keys,
  )) {
    const emb = getEmbedding(asin, allProducts, bin_embeddings);
    if (!emb) continue;
    const weight = decayWeight(timestamp);
    addWeightedEmbedding(emb, 2 * weight, embeddings);
  }

  // Clicks
  for (const [asin, { timestamp }] of Object.entries(
    userData.clicked_item_keys,
  )) {
    const emb = getEmbedding(asin, allProducts, bin_embeddings);
    if (!emb) continue;
    const weight = decayWeight(timestamp);
    addWeightedEmbedding(emb, 3 * weight, embeddings);
  }

  // Added to Cart
  for (const [asin, { timestamp }] of Object.entries(userData.added_to_cart)) {
    const emb = getEmbedding(asin, allProducts, bin_embeddings);
    if (!emb) continue;
    const weight = decayWeight(timestamp);
    addWeightedEmbedding(emb, 4 * weight, embeddings);
  }

  const userVector = combineEmbeddings(embeddings, QWEN_EMBEDDING_SIZE_1B);
  return userVector;
}

function cosineSimilarity(a: Float32Array, b: Float32Array): number {
  let dot = 0;
  for (let i = 0; i < a.length; i++) {
    // @ts-expect-error its ok
    dot += a[i] * b[i];
  }
  return dot; // Assuming vectors are normalized
}

async function getAllProducts(): Promise<Product[]> {
  const filePath = path.join(
    process.cwd(),
    "public",
    "combined_processed.json",
  );
  const fileText = await fs.readFile(filePath, "utf-8");
  return JSON.parse(fileText) as Product[];
}

async function getTopProducts(
  userVector: number[],
  itemKeysToExclude: string[],
  limit = 6,
  cursor = 0,
): Promise<{ data: Product[]; nextCursor?: number }> {
  const allProducts = await getAllProducts();
  const excludeSet = new Set(itemKeysToExclude);

  const unseenProducts = allProducts.filter((p) => !excludeSet.has(p.asin));
  const shuffledunseenProducts = unseenProducts.sort(() => Math.random() - 0.5);

  const bin_embeddings = await loadFloat32Embeddings(
    EMBEDDINGS_URL,
    EMBEDDING_DIM,
  );

  const userVectorTyped = new Float32Array(userVector);
  const scored = shuffledunseenProducts.map((product) => {
    const emb = bin_embeddings[product.embedding_index];
    if (emb) {
      const productVector = new Float32Array(emb);
      const score = cosineSimilarity(userVectorTyped, productVector);
      return { product, score };
    } else {
      return { product, score: -Infinity };
    }
  });

  const sorted = [...scored].sort((a, b) => b.score - a.score);

  const randomCount = Math.floor(limit * 0.4);
  const personalizedCount = limit - randomCount;
  const personalizedProducts = sorted
    .slice(cursor, cursor + personalizedCount)
    .map((s) => s.product);

  const shuffled = [...shuffledunseenProducts].sort(() => Math.random() - 0.5);
  const randomProducts = shuffled.slice(0, randomCount);
  const mixed = [...personalizedProducts, ...randomProducts]
    .filter((p, i, arr) => arr.findIndex((x) => x.asin === p.asin) === i) // deduplicate by asin
    .sort(() => Math.random() - 0.5);

  const nextCursor =
    personalizedProducts.length === personalizedCount
      ? cursor + personalizedProducts.length
      : undefined;

  return { data: mixed, nextCursor };
}

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") ?? "6", 10);
  const cursor = parseInt(searchParams.get("cursor") ?? "0", 10);

  const userId = await getOrCreateUserId();

  const userData = await getOrInitUserHistory(userId);

  const userVector = await createUserVector(userData);

  if (userVector.length === 0) {
    return NextResponse.json(
      { data: [], nextCursor: undefined },
      { status: 200 },
    );
  }

  const interactedItems = [
    ...Object.keys(userData.liked_item_keys),
    ...Object.keys(userData.clicked_item_keys),
    ...Object.keys(userData.viewed_item_keys),
    ...Object.keys(userData.added_to_cart),
  ];

  const { data, nextCursor } = await getTopProducts(
    userVector,
    interactedItems,
    limit,
    cursor,
  );

  return NextResponse.json({ data, nextCursor }, { status: 200 });
};
