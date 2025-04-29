"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, ShoppingCart, Bookmark, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Item } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function ProductCard({ asin, title, price, image, link }: Item) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const rating = 4.7;
  const reviewCount = 1243;

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleSave = () => {
    setSaved(!saved);
  };

  const handleBuyNow = () => {
    // In a real implementation, this would use Amazon's AddToCart form
  };

  return (
    <div className="mb-4 w-full snap-start overflow-hidden rounded-xl bg-white shadow-md">
      <div className="relative h-[300px] max-h-[450px] w-full">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Image
            src={image}
            alt={title}
            fill
            className="bg-white object-contain"
            sizes="(max-width: 768px) 100vw, 500px"
            priority
          />
        </a>
      </div>

      <div className="p-4">
        <h3 className="mb-1 line-clamp-2 text-sm font-medium">{title}</h3>

        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-black">${price}</span>
            {price && (
              <span className="text-sm text-gray-500 line-through">
                ${price}
              </span>
            )}
          </div>
          {rating && (
            <div className="flex items-center text-xs text-gray-500">
              <span className="mr-1 text-yellow-500">★</span>
              {rating} ({reviewCount})
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <Button
            onClick={handleBuyNow}
            className="bg-gradient-to-r from-pink-500 to-orange-500 px-6 text-white hover:from-pink-600 hover:to-orange-600"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to cart
          </Button>

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
            <button
              onClick={handleSave}
              className="rounded-full p-2 hover:bg-gray-100"
              aria-label="Save product"
            >
              <Bookmark
                className={cn(
                  "h-5 w-5",
                  saved ? "fill-orange-500 text-orange-500" : "text-gray-400",
                )}
              />
            </button>
            <button
              className="rounded-full p-2 hover:bg-gray-100"
              aria-label="Share product"
            >
              <Share2 className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
