"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart, type CartItem } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AmazonCheckoutPrompt } from "@/components/checkoutPrompt";

// Build the Amazon "Add to Cart" URL for multiple items
function buildAmazonCartUrl(items: CartItem[]) {
  const associateTag = process.env.NEXT_PUBLIC_AMZ_ASSOCIATE_TAG;
  const base = `https://www.amazon.ca/gp/aws/cart/add.html?AssociateTag=${associateTag}`;

  const params = items
    .map(
      ({ asin, quantity }, idx) =>
        `ASIN.${idx + 1}=${encodeURIComponent(asin)}&Quantity.${idx + 1}=${quantity}`,
    )
    .join("&");

  return `${base}&${params}`;
}

export default function CartPage() {
  const {
    items = [],
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
  } = useCart();

  // Open Amazon in a new tab with all items pre-loaded, mark checkout as pending
  function handleCheckout() {
    if (!items.length) return;

    const url = buildAmazonCartUrl(items);
    sessionStorage.setItem("amazonCheckout", "pending");
    window.open(url, "_blank", "noopener");
  }

  function handleClearCart() {
    sessionStorage.removeItem("amazonCheckout");
    clearCart();
  }

  return (
    <>
      <main className="flex min-h-screen flex-col bg-gray-50 pb-16 md:pb-0">
        <div className="container mx-auto px-4 py-8">
          {/* Continue shopping */}
          <div className="mb-6 flex items-center">
            <Link
              href="/feed"
              className="flex items-center text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
            <h1 className="ml-auto text-2xl font-bold">Your Cart</h1>
          </div>

          {/* No items */}
          {items.length === 0 ? (
            <div className="rounded-lg bg-white p-8 text-center shadow-sm">
              <div className="mb-4 flex justify-center">
                <ShoppingBag className="h-16 w-16 text-gray-300" />
              </div>
              <h2 className="mb-2 text-xl font-semibold">Your cart is empty</h2>
              <p className="mb-6 text-gray-500">
                Looks like you haven&apos;t added any products to your cart yet.
              </p>
              <Button asChild>
                <Link href="/feed">Start Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                  <div className="border-b p-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold">
                        Shopping Cart ({items.length} items)
                      </h2>
                      <button
                        onClick={handleClearCart}
                        className="flex items-center text-sm text-gray-500 hover:text-red-500"
                      >
                        <Trash2 className="mr-1 h-4 w-4" />
                        Clear Cart
                      </button>
                    </div>
                  </div>

                  {items.map((item) => (
                    <div
                      key={item.asin}
                      className="flex flex-col gap-4 border-b p-6 sm:flex-row"
                    >
                      <div className="relative mx-auto h-24 w-24 flex-shrink-0 sm:mx-0">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-1 text-sm font-medium">
                          {item.title}
                        </h3>

                        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center">
                            <button
                              onClick={() =>
                                updateQuantity(item.asin, item.quantity - 1)
                              }
                              className="rounded-full border p-1"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="mx-2 w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.asin, item.quantity + 1)
                              }
                              className="rounded-full border p-1"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-semibold">
                              $
                              {(parseFloat(item.price) * item.quantity).toFixed(
                                2,
                              )}
                            </span>
                            <button
                              onClick={() => removeItem(item.asin)}
                              className="text-gray-400 hover:text-red-500"
                              aria-label="Remove item"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-20 rounded-lg bg-white p-6 shadow-sm">
                  <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>

                  <div className="mb-6 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span>${(subtotal * 0.08).toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${(subtotal + subtotal * 0.08).toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
                  >
                    Checkout
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        <AmazonCheckoutPrompt clearCart={clearCart} />
      </main>
    </>
  );
}
