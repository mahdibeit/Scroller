"use client";

import { Suspense, useState } from "react";
import ExploreGrid from "@/components/exploreGrid";
import ExploreCategories from "@/components/exploreCategories";
import SearchProducts from "@/components/SearchProducts";
import { Loader2 } from "lucide-react";

export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  return (
    <>
      <main className="flex min-h-screen flex-col items-center pb-16 md:pb-0">
        <div className="mx-auto w-full max-w-7xl px-4 py-6">
          <div className="mb-8 flex flex-col-reverse md:flex-row md:items-start md:justify-between md:gap-4">
            <ExploreCategories
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />
            <SearchProducts search={search} setSearch={setSearch} />
          </div>

          <Suspense
            fallback={
              <div className="flex items-center justify-center py-20">
                <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
              </div>
            }
          >
            <ExploreGrid activeCategory={activeCategory} search={search} />
          </Suspense>
        </div>
      </main>
    </>
  );
}
