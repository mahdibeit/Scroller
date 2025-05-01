"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import type { Product } from "@/lib/types";

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const clearCart = () => {
    setItems([]);
  };

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart: unknown = JSON.parse(savedCart);
        console.log("parsed data:", parsedCart);
        if (
          Array.isArray(parsedCart) &&
          parsedCart.every(
            (item) =>
              typeof item === "object" &&
              item !== null &&
              "asin" in item &&
              "quantity" in item,
          )
        ) {
          setItems(parsedCart as CartItem[]);
        } else {
          clearCart();
          console.error("Invalid cart data in localStorage");
        }
      } catch (error) {
        console.error("Failed to parse saved cart:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.asin === product.asin);

      if (existingItem) {
        // If item already exists, increase quantity
        return prevItems.map((item) =>
          item.asin === product.asin
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        // Otherwise add new item with quantity 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeItem = (productAsin: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.asin !== productAsin),
    );
  };

  const updateQuantity = (productAsin: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productAsin);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.asin === productAsin ? { ...item, quantity } : item,
      ),
    );
  };

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const subtotal = items.reduce(
    (total, item) => total + parseFloat(item.price) * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
