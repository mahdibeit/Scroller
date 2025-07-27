// components/Feed.tsx
"use client";

import React, { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

async function fetchItems({ pageParam = 0 }): Promise<{
  data: Product[];
  nextCursor?: number;
}> {
  const res = await fetch(
    `/api/recommendations?cursor=${pageParam}&limit=6`,
    {},
  );
  if (!res.ok) {
    throw new Error("Failed to load items");
  }
  return res.json() as Promise<{ data: Product[]; nextCursor?: number }>;
}

export default function Feed() {
  // On refresh (first mount), scroll to top
  useEffect(() => {
    const nav = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    if (nav?.type === "reload") {
      window.scrollTo(0, 0);
      sessionStorage.removeItem(STORAGE_KEY); // Clear saved scroll position
    }
  }, []);
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
    queryKey: ["Products"],
    refetchOnWindowFocus: false,
    queryFn: fetchItems,
    getNextPageParam: (last) => last.nextCursor,
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5,
    refetchOnMount: false, // Don't refetch on component mount
    refetchOnReconnect: false, // Don't refetch when reconnecting
  });

  const { ref, inView } = useInView({ rootMargin: "200px", threshold: 0 });

  // When that sentinel scrolls into view, load the next page
  useEffect(() => {
    console.log("sentinel inView?", inView, "hasNextPage?", hasNextPage);
    if (inView && hasNextPage) {
      void fetchNextPage(); // void to explicitly ignore the returned promise
    }
  }, [inView, hasNextPage, fetchNextPage]);

  // Save scroll position when scrolling
  const STORAGE_KEY = "feed-scroll-position";
  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      sessionStorage.setItem(STORAGE_KEY, position.toString());
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Restore scroll position after data loads
  useEffect(() => {
    if (data) {
      // Only restore after data is available
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        // Use setTimeout to ensure DOM has updated
        setTimeout(() => {
          window.scrollTo(0, parseInt(saved, 10));
        }, 0);
      }
    }
  }, [data]);

  if (isLoading) {
    return <p>Loading items…</p>;
  }
  if (isError) {
    return <p className="text-red-500">Error: {error.message}</p>;
  }
  if (!data) {
    return null;
  }

  // Flatten and remove duplicates
  const allItems = Array.from(
    new Map(
      data.pages.flatMap((page) => page.data).map((item) => [item.id, item]),
    ).values(),
  );

  return (
    <div className="grid grid-rows-1 items-center justify-center gap-4 p-4 md:grid-cols-1">
      <div className="grid grid-cols-1 items-center justify-center gap-4 p-4">
        {allItems.map((product, idx) => (
          <ProductCard
            key={product.id}
            {...product}
            track_products={idx !== 0}
          />
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
    </div>
  );
}
