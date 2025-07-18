import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import type { Product } from "@/lib/types";

function getIfDigit(str: string): string | undefined {
  return /^\d+$/.test(str) ? str : undefined;
}

export async function GET(req: Request) {
  // Parse ?cursor=...&limit=... from URL
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") ?? "6", 10);
  const cursor = parseInt(searchParams.get("cursor") ?? "0", 10);
  const influencer = searchParams.get("influencer");

  const filePath = path.join(
    process.cwd(),
    "public",
    `influencers/${influencer}/items_1.json`,
  );
  // check if file does not exists return empty array
  try {
    await fs.access(filePath);
  } catch {
    return NextResponse.json(
      { data: [] },
      {
        status: 200,
      },
    );
  }

  const fileText = await fs.readFile(filePath, "utf-8");

  const all: Product[] = JSON.parse(fileText) as Product[];

  // Shuffle the data
  const shuffled = all.sort(() => Math.random() - 0.5);

  // Slice page, compute nextCursor
  const start = cursor;
  const data = shuffled.slice(start, start + limit);
  const nextCursor = data.length === limit ? start + data.length : undefined;

  return NextResponse.json(
    { data, nextCursor },
    {
      status: 200,
    },
  );
}
