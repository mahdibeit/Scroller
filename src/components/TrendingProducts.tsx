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

export default function TrendingProducts() {
  const { data } = useInfiniteQuery({
    queryKey: ["TrendingProducts"],
    queryFn: fetchItems,
    getNextPageParam: (last) => last.nextCursor,
    refetchOnWindowFocus: false,
    initialPageParam: 0,
  });

  if (!data?.pages[0]?.data.length) return null;

  const products = data.pages[0].data.slice(0, 4);

  return (
    <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {products.map((item) => (
        <div
          key={item.id}
          className="w-full transform transition-all duration-500 hover:scale-105"
        >
          <ProductCard {...item} />
        </div>
      ))}
    </div>
  );
}
