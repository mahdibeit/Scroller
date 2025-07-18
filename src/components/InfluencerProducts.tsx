"use client";

import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

async function fetchItems({
  pageParam = 0,
  influencerId,
}: {
  pageParam?: number;
  influencerId: string;
}): Promise<{
  data: Product[];
  nextCursor?: number;
}> {
  const res = await fetch(
    `/api/influencer?cursor=${pageParam}&influencer=${influencerId}&limit=12`,
  );
  if (!res.ok) {
    throw new Error("Failed to load items");
  }
  return res.json() as Promise<{ data: Product[]; nextCursor?: number }>;
}

export default function InfluencerProducts({
  influencerId,
}: {
  influencerId: string;
}) {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["InfluencerProducts", influencerId],
    queryFn: ({ pageParam }) => fetchItems({ pageParam, influencerId }),
    getNextPageParam: (last) => last.nextCursor,
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const { ref, inView } = useInView({ rootMargin: "200px", threshold: 0 });

  // Load next page when sentinel comes into view
  useEffect(() => {
    if (inView && hasNextPage) {
      void fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  if (isError) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  if (!data?.pages[0]?.data.length) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">No items found</p>
      </div>
    );
  }

  // Flatten and remove duplicates
  const allItems = Array.from(
    new Map(
      data.pages.flatMap((page) => page.data).map((item) => [item.id, item]),
    ).values(),
  );

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {allItems.map((product) => (
          <ProductCard key={product.id} {...product} layout="influencer" />
        ))}
      </div>

      {/* Sentinel element for infinite scroll */}
      <div ref={ref} className="col-span-full py-4 text-center">
        {isFetchingNextPage
          ? "Loading more..."
          : hasNextPage
            ? "Scroll to load more"
            : ""}
      </div>
    </>
  );
}
