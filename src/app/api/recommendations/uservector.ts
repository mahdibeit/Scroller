import path from "path";
import fs from "fs/promises";
import {
  EMBEDDINGS_URL,
  EMBEDDING_DIM,
  QWEN_EMBEDDING_SIZE_1B,
} from "@/lib/constants";
import { type Product } from "@/lib/types";
import { type UserActivity } from "@/lib/track";
import { loadFloat32Embeddings } from "./route";

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
