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
  const search = searchParams.get("search");
  console.log("se:", search);

  const filePath = path.join(
    process.cwd(),
    "public",
    "combined_processed.json",
  );
  const fileText = await fs.readFile(filePath, "utf-8");

  let all: Product[] = JSON.parse(fileText) as Product[];

  // Filter based on the description
  if (search) {
    const searchParts = search.split("-").map((s) => s.trim().toLowerCase());

    if (searchParts.some((part) => getIfDigit(part))) {
      // Filter if numbers are present
      const digits = searchParts.map(getIfDigit).filter(Boolean) as string[];
      all = all.filter(
        (item) => parseInt(item.price) < parseInt(digits.join(" "), 10),
      );
    } else {
      // Match whole words only (e.g., "dress" not "address" or "dresses")
      all = all.filter((item) => {
        const desc = Array.isArray(item.description)
          ? item.description.join(" ").toLowerCase()
          : "";
        const title = item.title.toLowerCase();

        return searchParts.every((part) => {
          const pattern = new RegExp(`\\b${part}\\b`, "i"); // whole word match
          return pattern.test(desc) || pattern.test(title);
        });
      });
    }
  }

  // // Shuffle the data
  // const shuffled = all.sort(() => Math.random() - 0.5);

  // Slice page, compute nextCursor
  const start = cursor;
  const data = all.slice(start, start + limit);
  const nextCursor = data.length === limit ? start + data.length : undefined;

  return NextResponse.json(
    { data, nextCursor },
    {
      status: 200,
    },
  );
}
