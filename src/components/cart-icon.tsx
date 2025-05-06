"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/cart-context";

export function CartIcon() {
  const { itemCount } = useCart();

  return (
    <div className="relative">
      <ShoppingBag className="h-5 w-5" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-teal-500 text-xs text-white">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
      <span className="sr-only">Cart with {itemCount} items</span>
    </div>
  );
}
