// components/ProductCard.tsx
"use client";

import React from "react";
import Image from "next/image";
import type { Item } from "@/app/api/items/route";

export default function ProductCard({ asin, title, price, image, link }: Item) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg bg-white shadow-md">
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <div className="relative h-48 w-full">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <div className="p-4">
          <h3 className="line-clamp-2 text-lg font-semibold text-gray-800">
            {title}
          </h3>
          <p className="mt-2 text-xl font-bold text-gray-900">${price}</p>
        </div>
      </a>
    </div>
  );
}
