// components/Feed.tsx
"use client";

import React, { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import type { Item } from "@/app/api/items/route";
import ProductCard from "@/components/ProductCard";

async function fetchItems({ pageParam = 0 }): Promise<{
  data: Item[];
  nextCursor?: number;
}> {
  const res = await fetch(`/api/items?cursor=${pageParam}&limit=6`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load items");
  return res.json() as Promise<{ data: Item[]; nextCursor?: number }>;
}

export default function Feed() {
  // 1. Set up useInfiniteQuery
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["items"],
    queryFn: fetchItems,
    getNextPageParam: (last) => last.nextCursor,
    initialPageParam: 0,
  });

  const { ref, inView } = useInView({ rootMargin: "200px", threshold: 0 });

  // When that sentinel scrolls into view, load the next page:

  useEffect(() => {
    console.log("sentinel inView?", inView, "hasNextPage?", hasNextPage);
    if (inView && hasNextPage) {
      void fetchNextPage(); // void to explicitly ignore the returned promise
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isLoading) {
    return <p>Loading items…</p>;
  }
  if (isError) {
    return <p className="text-red-500">Error: {error.message}</p>;
  }
  if (!data) {
    return null;
  }

  // Flatten and render
  const allItems = data.pages.flatMap((page) => page.data);

  return (
    <div className="grid grid-rows-1 gap-4 p-4 md:grid-cols-1">
      {allItems.map((item) => (
        <ProductCard key={item.asin} {...item} />
      ))}

      {/* 8. This div is the “sentinel” that triggers more loading */}
      <div ref={ref} className="col-span-full py-4 text-center">
        {isFetchingNextPage
          ? "Loading more…"
          : hasNextPage
            ? "Scroll to load more"
            : "— End of feed —"}
      </div>
    </div>
  );
}
