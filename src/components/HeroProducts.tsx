"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

async function fetchItems({ pageParam = 0 }): Promise<{
  data: Product[];
  nextCursor?: number;
}> {
  const res = await fetch(`/api/products?cursor=${pageParam}&limit=4`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to load items");
  }
  return res.json() as Promise<{ data: Product[]; nextCursor?: number }>;
}

export default function HeroProducts() {
  const { data } = useInfiniteQuery({
    queryKey: ["HeroProducts"],
    queryFn: fetchItems,
    getNextPageParam: (last) => last.nextCursor,
    initialPageParam: 0,
  });

  if (!data?.pages[0]?.data.length) return null;

  const products = data.pages[0].data.slice(0, 4);

  return (
    <div className="relative grid min-h-[600px] w-full grid-cols-4 gap-4">
      {products.map((item, index) => (
        <div
          key={item.id}
          className={`w-[280px] transform transition-all duration-500 hover:scale-105 ${
            index === 0
              ? "translate-y-0"
              : index === 1
                ? "translate-y-16"
                : index === 2
                  ? "translate-y-8"
                  : "translate-y-24"
          }`}
        >
          <ProductCard {...item} />
        </div>
      ))}
    </div>
  );
}
