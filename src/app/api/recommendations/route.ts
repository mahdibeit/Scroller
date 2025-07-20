import { NextResponse } from "next/server";
import {
  getUserKey,
  getOrInitUserHistory,
  getOrCreateUserId,
} from "@/lib/track";
import { TAGS, type Product } from "@/lib/types";
import fs from "node:fs/promises";
import path from "node:path";

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

export const GET = async () => {
  // Get userId from cookie or session (assume getUserKey/getOrInitUserHistory handles this)
  const userId = await getOrCreateUserId();
  const redisKey = getUserKey(userId);
  const userData = await getOrInitUserHistory(userId);

  // Build user vector
  const userVector = await createUserVector(userData);

  return NextResponse.json({ userVector }, { status: 200 });
};
