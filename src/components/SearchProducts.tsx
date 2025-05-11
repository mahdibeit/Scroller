"use client";

import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function SearchProducts() {
  const [query, setQuery] = useState("");

  return (
    <div>
      <div className="relative py-2">
        <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          type="search"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
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
