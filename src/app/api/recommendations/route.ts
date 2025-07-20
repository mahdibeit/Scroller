import { NextResponse } from "next/server";
import {
  getUserKey,
  getOrInitUserHistory,
  getOrCreateUserId,
} from "@/lib/track";
import { type Product } from "@/lib/types";
import fs from "node:fs/promises";
import path from "node:path";
import { TAGS } from "@/lib/constants";

// Helper: fetch product by asin from combined_processed.json
async function getProductByAsin(asin: string): Promise<Product | undefined> {
  const filePath = path.join(
    process.cwd(),
    "public",
    "combined_processed.json",
  );
  const fileText = await fs.readFile(filePath, "utf-8");
  const all: Product[] = JSON.parse(fileText) as Product[];
  return all.find((p) => p.asin === asin);
}

async function createUserVector(userData: {
  liked_item_keys: string[];
  clicked_item_keys: string[];
}) {
  const itemKeys = [...userData.liked_item_keys, ...userData.clicked_item_keys];
  const tagCounts: Record<string, number> = {};

  for (const itemId of itemKeys) {
    const product = await getProductByAsin(itemId);
    if (product?.tags) {
      for (const tag of product.tags) {
        tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
      }
    }
  }

  // Create a vector based on the predefined tag list
  const vector = TAGS.map((tag) => tagCounts[tag] ?? 0);

  return vector;
}

function dotProduct(a: number[], b: number[]): number {
  return a.reduce((sum, val, i) => sum + val * (b[i] ?? 0), 0);
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

function productToVector(tags: string[]): number[] {
  const tagSet = new Set(tags);
  return TAGS.map((tag) => (tagSet.has(tag) ? 1 : 0));
}

async function getTopProducts(
  userVector: number[],
  itemKeysToExclude: string[],
  limit = 6,
  cursor = 0,
): Promise<{ data: Product[]; nextCursor?: number }> {
  const allProducts = await getAllProducts();
  const excludeSet = new Set(itemKeysToExclude);

  // 1. Filter out already liked/clicked items
  const unseenProducts = allProducts.filter((p) => !excludeSet.has(p.asin));

  // 2. Score remaining products
  const scored = unseenProducts.map((product) => {
    const productVector = productToVector(product.tags ?? []);
    const score = dotProduct(userVector, productVector);
    return { product, score };
  });

  // 3. Sort by score (desc)
  const sorted = [...scored].sort((a, b) => b.score - a.score);

  // 4. Decide how many random vs personalized to show
  const randomCount = Math.floor(limit * 0.4);
  const personalizedCount = limit - randomCount;

  // 5. Pick random items from the pool
  const shuffled = [...unseenProducts].sort(() => Math.random() - 0.5);
  const randomProducts = shuffled.slice(0, randomCount);

  // 6. Pick top personalized items
  const personalizedProducts = sorted
    .slice(cursor, cursor + personalizedCount)
    .map((s) => s.product);

  // 7. Merge and shuffle to interleave them
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
