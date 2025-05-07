"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useCart } from "@/context/cart-context";

export function addAssociateTag(originalUrl: string): string {
  const associateTag = process.env.NEXT_PUBLIC_AMZ_ASSOCIATE_TAG!;
  const url = new URL(originalUrl);
  url.searchParams.set("tag", associateTag);
  return url.toString();
}

export default function ProductCard(product: Product) {
  const [liked, setLiked] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem, items } = useCart();

  const isInCart = items.some((item) => item.asin === product.asin);

  const handleLike = () => {
    setLiked(!liked);
  };
  const handleAddToCart = () => {
    setIsAdding(true);

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

  return (
    <div className="mb-4 max-w-4xl snap-start overflow-hidden rounded-xl bg-white shadow-md">
      {/* Image */}
      <div className="w-full">
        <a
          href={addAssociateTag(product.page_url)}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Image
            src={product.main_image_url}
            alt={product.title}
            width={500} // base width for Next.js’s aspect‐ratio calc
            height={500} // base height for Next.js’s aspect‐ratio calc
            className="h-auto max-h-[450px] w-full object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 4000px) 300vw, 33vw"
            priority
          />
        </a>
      </div>

      {/* price and rating         */}
      <div className="p-4">
        <h3 className="mb-1 line-clamp-2 text-sm font-medium text-black">
          {product.title}
        </h3>

        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-black">
              ${product.price}
            </span>
            {/* {product.price && (
              <span className="text-sm text-gray-500 line-through">
                ${product.price}
              </span>
            )} */}
          </div>
          {product.rating && (
            <div className="flex items-center text-xs text-gray-500">
              <span className="mr-1 text-yellow-500">★</span>
              {product.rating} ({product.review_count})
            </div>
          )}
        </div>

        {/* Add to Cart Button */}
        <div className="flex items-center justify-between">
          <Button
            onClick={handleAddToCart}
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

          {/* Like          */}
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
