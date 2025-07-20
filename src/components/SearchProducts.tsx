"use client";

import React from "react";
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
  const [inputValue, setInputValue] = React.useState(search);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearch(inputValue);
    }
  };

  React.useEffect(() => {
    setInputValue(search);
  }, [search]);

  return (
    <div>
      <div className="relative flex items-center gap-2 py-2">
        <div className="relative flex-1">
          <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            type="search"
            placeholder="Search products..."
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            className={cn(
              "pl-9",
              "bg-card dark:bg-card/30",
              "placeholder:text-muted-foreground/60",
              "w-full md:max-w-sm",
            )}
          />
        </div>
      </div>
    </div>
  );
}
