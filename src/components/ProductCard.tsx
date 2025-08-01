"use client";

import { useState, useTransition, useEffect } from "react";
import Image from "next/image";
import { Heart, ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useCart } from "@/context/cart-context";
import { track } from "@vercel/analytics";

export function addAssociateTag(originalUrl: string): string {
  const associateTag = process.env.NEXT_PUBLIC_AMZ_ASSOCIATE_TAG!;
  const url = new URL(originalUrl);
  url.searchParams.set("tag", associateTag);
  return url.toString();
}

export default function ProductCard(
  props: Product & { layout?: "influencer"; track_products?: boolean },
) {
  const { track_products = false } = props;
  const { layout, ...product } = props;
  const [liked, setLiked] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem, items } = useCart();

  const isInCart = items.some((item) => item.asin === product.asin);

  const handleLike = () => {
    setLiked(!liked);
    sendInteraction("liked");
  };
  const handleAddToCart = () => {
    setIsAdding(true);
    sendInteraction("added_to_cart");

    // Simulate a small delay for better UX
    setTimeout(() => {
      addItem(product);
      setIsAdding(false);

      toast.success("Added to cart", {
        description: product.title.slice(0, 50) + "...",
        position: window.innerWidth <= 768 ? "top-center" : "bottom-right",
      });
    }, 300);
  };

  // Track when the product card is viewed using Intersection Observer
  useEffect(() => {
    let hasSent = false;
    let viewStart: number | null = null;
    const card = document.getElementById(`product-card-${product.asin}`);
    if (!card) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!hasSent && viewStart === null) {
              viewStart = Date.now();
            }
          } else {
            if (!hasSent && viewStart !== null) {
              const timeSpent = Math.round((Date.now() - viewStart) / 1000); // seconds
              sendInteraction("viewed", timeSpent);
              hasSent = true;
              observer.disconnect();
            }
          }
        });
      },
      { threshold: 0.5 },
    );
    observer.observe(card);
    return () => {
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add tracking for user actions
  const [isPending, startTransition] = useTransition();

  const sendInteraction = (
    action: "liked" | "clicked" | "viewed" | "added_to_cart",
    time_spent?: number,
  ) => {
    if (track_products) {
      startTransition(async () => {
        let body: string;
        if (action === "viewed") {
          body = JSON.stringify({
            action: action,
            asin: product.asin,
            time_spent: time_spent,
          });
        } else {
          body = JSON.stringify({ action: action, asin: product.asin });
        }
        const res = await fetch("/api/track", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: body,
        });

        if (!res.ok) {
          console.error("Failed to track interaction");
        }
      });
    }
  };

  return (
    <div
      id={`product-card-${product.asin}`}
      className={cn(
        "mb-4 max-w-4xl snap-start overflow-hidden rounded-xl bg-white shadow-md",
        layout === "influencer" && "flex h-[500px] flex-col",
      )}
    >
      {/* Image */}
      <div
        className={cn(
          "w-full",
          layout === "influencer" && "relative h-[300px]",
        )}
      >
        <a
          href={addAssociateTag(product.page_url)}
          target="_blank"
          rel="noopener noreferrer"
          className={cn("block", layout === "influencer" && "h-full")}
          onClick={() => sendInteraction("clicked")}
        >
          <Image
            src={product.main_image_url}
            alt={product.title}
            {...(layout === "influencer"
              ? { fill: true, className: "object-contain p-2" }
              : {
                  width: 500,
                  height: 500,
                  className: "h-auto max-h-[450px] w-full object-contain",
                })}
            sizes="(max-width: 768px) 100vw, (max-width: 4000px) 300px, 33vw"
            priority
          />
        </a>
      </div>

      {/* price and rating */}
      <div
        className={cn(
          "p-4",
          layout === "influencer" && "flex h-[200px] flex-col",
        )}
      >
        <h3
          className={cn(
            "mb-1 line-clamp-2 text-sm font-medium text-black",
            layout === "influencer" && "h-[40px]",
          )}
        >
          {product.title}
        </h3>

        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-black">
              ${product.price}
            </span>
          </div>
          {product.rating && (
            <div className="flex items-center text-xs text-gray-500">
              <span className="mr-1 text-yellow-500">★</span>
              {product.rating} ({product.review_count})
            </div>
          )}
        </div>

        {/* Add to Cart Button */}
        <div
          className={cn(
            "flex items-center justify-between",
            layout === "influencer" && "mt-2",
          )}
        >
          <Button
            onClick={() => {
              handleAddToCart();
              track("added_to_cart_clicked", {
                asin: product.asin,
                price: product.price,
              });
            }}
            disabled={isAdding}
            className={cn(
              isInCart
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gradient-to-r from-cyan-900 to-teal-600 hover:from-cyan-800 hover:to-teal-400",
              "text-white",
            )}
          >
            {isAdding ? (
              "Adding..."
            ) : isInCart ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Added to Cart
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </>
            )}
          </Button>

          {/* Like */}
          <div className="flex gap-2">
            <button
              onClick={handleLike}
              className="rounded-full p-2 hover:bg-gray-100"
              aria-label="Like product"
            >
              <Heart
                className={cn(
                  "h-5 w-5",
                  liked ? "fill-pink-500 text-pink-500" : "text-gray-400",
                )}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
