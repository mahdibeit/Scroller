export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import type { Product } from "@/lib/types";

export async function GET(req: Request) {
  // Parse ?cursor=...&limit=... from URL
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") ?? "6", 10);
  const cursor = parseInt(searchParams.get("cursor") ?? "0", 10);

  const filePath = path.join(process.cwd(), "public", "items-large.json");
  const fileText = await fs.readFile(filePath, "utf-8");
  const all: Product[] = JSON.parse(fileText) as Product[];

  // Slice page, compute nextCursor
  const start = cursor;
  const data = all.slice(start, start + limit);
  const nextCursor = data.length === limit ? start + data.length : undefined;

  return NextResponse.json(
    { data, nextCursor },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
      },
    },
  );
}
