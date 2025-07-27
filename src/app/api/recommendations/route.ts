import { NextResponse } from "next/server";
import { getOrInitUserHistory, getOrCreateUserId } from "@/lib/track";
import { type Product } from "@/lib/types";
import fs from "node:fs/promises";
import path from "node:path";
import {
  EMBEDDING_DIM,
  EMBEDDINGS_URL,
  QWEN_EMBEDDING_SIZE_1B,
} from "@/lib/constants";

// Fetch binary file and return ArrayBuffer
async function fetchBinaryFile(): Promise<ArrayBuffer> {
  const filePath = path.join(process.cwd(), "public", "embeddings.bin");
  const fileBuffer = await fs.readFile(filePath);
  return fileBuffer.buffer.slice(
    fileBuffer.byteOffset,
    fileBuffer.byteOffset + fileBuffer.byteLength,
  );
}

// Parse entire buffer into array of Float32Array embeddings
function parseFloat32Embeddings(
  buffer: ArrayBuffer,
  dim: number,
): Float32Array[] {
  const floatArray = new Float32Array(buffer);
  const embeddings: Float32Array[] = [];

  for (let i = 0; i < floatArray.length; i += dim) {
    embeddings.push(floatArray.subarray(i, i + dim));
  }

  return embeddings;
}

// Load embeddings from URL
async function loadFloat32Embeddings(
  url: string,
  dim: number,
): Promise<Float32Array[]> {
  const buffer = await fetchBinaryFile();
  return parseFloat32Embeddings(buffer, dim);
}

async function createUserVector(userData: {
  liked_item_keys: string[];
  clicked_item_keys: string[];
}): Promise<number[]> {
  const itemKeys = [...userData.liked_item_keys, ...userData.clicked_item_keys];

  const filePath = path.join(
    process.cwd(),
    "public",
    "combined_processed.json",
  );
  const fileText = await fs.readFile(filePath, "utf-8");
  const allProducts: Product[] = JSON.parse(fileText) as Product[];

  const embeddings: number[][] = [];

  // Load embeddings once outside the loop
  const bin_embeddings = await loadFloat32Embeddings(
    EMBEDDINGS_URL,
    EMBEDDING_DIM,
  );

  for (const itemId of itemKeys) {
    const embedding_index = allProducts.find(
      (p) => p.asin === itemId,
    )?.embedding_index;
    if (embedding_index === undefined) continue;

    const emb = bin_embeddings[embedding_index];
    if (emb) {
      embeddings.push(Array.from(emb));
    }
  }

  if (embeddings.length === 0) {
    return new Array(QWEN_EMBEDDING_SIZE_1B).fill(0) as number[];
  }

  const dim = embeddings[0]!.length;
  const avg = new Float32Array(dim);

  // Sum embeddings
  for (const emb of embeddings) {
    for (let i = 0; i < dim; i++) {
      // @ts-expect-error its ok
      avg[i] += emb[i];
    }
  }

  // Average
  const len = embeddings.length;
  for (let i = 0; i < dim; i++) {
    // @ts-expect-error its ok
    avg[i] /= len;
  }

  return Array.from(avg);
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

  const bin_embeddings = await loadFloat32Embeddings(
    EMBEDDINGS_URL,
    EMBEDDING_DIM,
  );

  const userVectorTyped = new Float32Array(userVector);
  const scored = unseenProducts.map((product) => {
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

  const shuffled = [...unseenProducts].sort(() => Math.random() - 0.5);
  const randomProducts = shuffled.slice(0, randomCount);

  const mixed = [...personalizedProducts, ...randomProducts].sort(
    () => Math.random() - 0.5,
  );

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
    ...userData.liked_item_keys,
    ...userData.clicked_item_keys,
    ...userData.viewed_item_keys,
  ];

  const { data, nextCursor } = await getTopProducts(
    userVector,
    interactedItems,
    limit,
    cursor,
  );

  return NextResponse.json({ data, nextCursor }, { status: 200 });
};
