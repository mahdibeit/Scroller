// app/api/items/route.ts
import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

// Define your Item type somewhere shared, e.g. src/types.ts
export interface Item {
  asin: string;
  title: string;
  image: string;
  price: string;
  link: string;
}

export async function GET(req: Request) {
  // 1. Parse ?cursor=...&limit=... from URL
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") ?? "2", 10);
  const cursor = parseInt(searchParams.get("cursor") ?? "0", 10);

  // 2. Load and parse JSON (avoid require())
  const filePath = path.join(process.cwd(), "public", "items-large.json");
  const fileText = await fs.readFile(filePath, "utf-8");
  const all: Item[] = JSON.parse(fileText) as Item[];

  // 3. Slice page, compute nextCursor
  const start = cursor;
  const data = all.slice(start, start + limit);
  const nextCursor = data.length === limit ? start + data.length : undefined;

  // 4. Return JSON
  return NextResponse.json({ data, nextCursor });
}
