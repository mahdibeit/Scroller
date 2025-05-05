"use client";

import { useEffect, useState, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";
import { Card } from "./ui/card";

async function fetchItems({ pageParam = 0 }): Promise<{
  data: Product[];
  nextCursor?: number;
}> {
  const res = await fetch(`/api/products?cursor=${pageParam}&limit=8`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to load items");
  }
  return res.json() as Promise<{ data: Product[]; nextCursor?: number }>;
}

export default function AnimatedProductScroll() {
  const [offset, setOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data } = useInfiniteQuery({
    queryKey: ["AnimatedProducts"],
    queryFn: fetchItems,
    getNextPageParam: (last) => last.nextCursor,
    initialPageParam: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => prev + 2);
    }, 30);

    return () => clearInterval(interval);
  }, []);

  // Handle continuous scroll
  useEffect(() => {
    if (!containerRef.current || !data?.pages[0]?.data.length) return;

    const container = containerRef.current;
    const containerHeight = container.clientHeight;
    const scrollHeight = container.scrollHeight;

    if (offset > scrollHeight) {
      setOffset(offset - containerHeight);
    }
  }, [offset, data]);

  if (!data?.pages[0]?.data.length) return null;

  const allItems = data.pages.flatMap((page) => page.data);
  if (allItems.length === 0) return null;

  // Create a continuous list by repeating items
  const displayItems = [...allItems, ...allItems];

  return (
    <Card className="relative h-[600px] w-[350px] overflow-hidden bg-white">
      <div
        ref={containerRef}
        className="absolute w-full transition-transform duration-300 ease-linear will-change-transform"
        style={{
          transform: `translateY(-${offset}px)`,
        }}
      >
        {displayItems.map((item, index) => (
          <div key={item.id + index} className="h-[600px]">
            <ProductCard {...item} />
          </div>
        ))}
      </div>
    </Card>
  );
}
