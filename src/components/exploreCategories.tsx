"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const categories = [
  { id: "all", name: "All" },
  { id: "under-100", name: "Under $100" },
  { id: "healthy-snacks", name: "Healthy Snacks" },
  { id: "daily-deals", name: "Daily Deals" },
  { id: "staff-picks", name: "Staff Picks" },
  { id: "under-50", name: "Under $50" },
  { id: "quirky-finds", name: "Unique & Quirky" },
  { id: "trending-now", name: "Trending Now" },
  { id: "life-hacks", name: "Life Hacks" },
  { id: "gift-ideas", name: "Gift Ideas" },
  { id: "office-essentials", name: "Home & Office Essentials" },
  { id: "outdoor-adventures", name: "Outdoor Adventures" },
  { id: "travel-essentials", name: "Travel Essentials" },
];

export default function ExploreCategories() {
  const [activeCategory, setActiveCategory] = useState("all");

  return (
    <div className="md:max-w-[70%]">
      <div className="scrollbar-hide relative flex overflow-x-auto">
        <div className="flex space-x-2 py-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "rounded-full px-4 py-2 text-sm whitespace-nowrap transition-colors",
                activeCategory === category.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
