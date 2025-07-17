"use client";

import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchProductsProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

export default function SearchProducts({
  search,
  setSearch,
}: SearchProductsProps) {
  return (
    <div>
      <div className="relative py-2">
        <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          type="search"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={cn(
            "pl-9",
            "bg-card dark:bg-card/30",
            "placeholder:text-muted-foreground/60",
            "w-full md:max-w-sm",
          )}
        />
      </div>
    </div>
  );
}
