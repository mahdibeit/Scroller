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
import { createUserVector } from "./uservector";

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

export async function loadFloat32Embeddings(
  url: string,
  dim: number,
): Promise<Float32Array[]> {
  const floatArray = await fetchBinaryFloat32Array();
  return parseFloat32Embeddings(floatArray, dim);
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
