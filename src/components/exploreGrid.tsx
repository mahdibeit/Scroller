"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import type { Product } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { addAssociateTag } from "./ProductCard";
import { useInView } from "react-intersection-observer";

async function fetchItems({ pageParam = 0 }): Promise<{
  data: Product[];
  nextCursor?: number;
}> {
  const res = await fetch(`/api/products?cursor=${pageParam}&limit=24`, {});
  if (!res.ok) {
    throw new Error("Failed to load items");
  }
  return res.json() as Promise<{ data: Product[]; nextCursor?: number }>;
}

export default function ExploreGrid() {
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [activeProduct, setActiveProduct] = useState<string | null>(null);
  const { addItem } = useCart();

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["ExploreProducts"],
    queryFn: fetchItems,
    refetchOnWindowFocus: false,
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

  const products = allItems;

  const handleLike = (productId: string) => {
    setLiked((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const handleAddToCart = (product: Product) => {
    addItem(product);
    toast.success("Added to cart", {
      description: product.title.slice(0, 50) + "...",
      position: window.innerWidth <= 768 ? "top-center" : "bottom-right",
    });
  };

  // Function to determine grid span classes for variety
  const getGridSpan = (index: number) => {
    // Create a pattern that works with a 4-column grid
    // Make items at position 0 and 7 large (2x2)
    const pattern = index % 12;

    if (pattern === 0 || pattern === 7) {
      return "md:col-span-2 md:row-span-2"; // Large item
    }

    return "md:col-span-1 md:row-span-1"; // Standard item
  };

  return (
    <div className="grid grid-cols-2 gap-1 md:grid-cols-3 md:gap-2 lg:grid-cols-4">
      {products.map((product, index) => {
        const gridSpanClass = getGridSpan(index);
        const isActive = activeProduct === product.id;

        return (
          <div
            key={product.id}
            className={cn(
              "group bg-card relative overflow-hidden rounded-md border-4",
              gridSpanClass,
            )}
            onClick={() => setActiveProduct(isActive ? null : product.id)}
          >
            <a
              href={addAssociateTag(product.page_url)}
              target="_blank"
              rel="noopener noreferrer"
              className="relative block aspect-square h-full w-full"
              onClick={(e) => {
                // Prevent link navigation on first click on mobile
                if (
                  window.matchMedia("(max-width: 768px)").matches &&
                  !isActive
                ) {
                  e.preventDefault();
                }
              }}
            >
              <Image
                src={product.main_image_url}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes={
                  gridSpanClass.includes("col-span-2")
                    ? "(max-width: 768px) 100vw, 50vw"
                    : "(max-width: 768px) 50vw, 25vw"
                }
              />

              {/* Overlay on hover/click */}
              <div
                className={cn(
                  "absolute inset-0 flex flex-col justify-between bg-black/40 p-3 transition-opacity duration-300",
                  "md:opacity-0 md:group-hover:opacity-100", // Only use hover effect on desktop
                  isActive ? "opacity-100" : "opacity-0", // Show on mobile when active
                )}
              >
                <div className="flex justify-end">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleLike(product.id);
                    }}
                    className="rounded-full bg-black/30 p-2 backdrop-blur-sm hover:bg-black/50"
                    aria-label={
                      liked[product.id]
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  >
                    <Heart
                      className={cn(
                        "h-5 w-5",
                        liked[product.id]
                          ? "fill-primary text-primary"
                          : "text-white",
                      )}
                    />
                  </button>
                </div>

                <div className="space-y-2">
                  <h3 className="line-clamp-2 text-sm font-medium text-white">
                    {product.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">
                      ${product.price}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full p-2"
                      aria-label="Add to cart"
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </a>

            {/* Discount badge */}
            {product.price && (
              <div className="bg-primary text-primary-foreground absolute top-2 left-2 rounded-md px-2 py-1 text-xs font-bold">
                {Math.round(
                  ((parseFloat(product.price) - parseFloat(product.price)) /
                    parseFloat(product.price)) *
                    100,
                )}
                % OFF
              </div>
            )}
          </div>
        );
      })}
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
