"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const categories = [
  { id: "all", name: "All" },
  { id: "electronics", name: "Electronics" },
  { id: "home", name: "Home & Kitchen" },
  { id: "fashion", name: "Fashion" },
  { id: "beauty", name: "Beauty" },
  { id: "sports", name: "Sports" },
  { id: "toys", name: "Toys" },
  { id: "books", name: "Books" },
];

export default function ExploreCategories() {
  const [activeCategory, setActiveCategory] = useState("all");

  return (
    <div className="scrollbar-hide mb-6 overflow-x-auto">
      <div className="flex space-x-2 pb-2">
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
  );
}
