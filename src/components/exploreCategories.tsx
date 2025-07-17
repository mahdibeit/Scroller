"use client";

import { cn } from "@/lib/utils";

const categories = [
  { id: "all", name: "All" },
  { id: "under-100", name: "Under $100" },
  { id: "clothe", name: "Clothes" },
  { id: "under-50", name: "Under $50" },
  { id: "Unique", name: "Unique & Quirky" },
  { id: "gift", name: "Gift Ideas" },
  { id: "office", name: "Home & Office Essentials" },
  { id: "outdoor", name: "Outdoor Adventures" },
  { id: "travel", name: "Travel Essentials" },
  { id: "game", name: "Games" },
  { id: "electronics", name: "Electronics" },
  { id: "health-snacks", name: "Healthy Snacks" },
];

interface ExploreCategoriesProps {
  activeCategory: string;
  setActiveCategory: (id: string) => void;
}

export default function ExploreCategories({
  activeCategory,
  setActiveCategory,
}: ExploreCategoriesProps) {
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
