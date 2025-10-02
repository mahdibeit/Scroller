import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ShoppingBag,
  Zap,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import HeroProducts from "@/components/HeroProducts";
import TrendingProducts from "@/components/TrendingProducts";
import EnhancedStatsSection from "@/components/statsSection";
import { StartScrollingButton } from "@/components/startScrollingButton";

export const metadata: Metadata = {
  title: "ScrollCart - AI-Powered Shopping Discovery Platform",
  description:
    "Experience a new way of shopping with AI-curated products and influencer recommendations. Discover trending items, get personalized suggestions, and enjoy one-tap checkout.",
  openGraph: {
    title: "ScrollCart - AI-Powered Shopping Discovery Platform",
    description:
      "Experience a new way of shopping with AI-curated products and influencer recommendations.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

export default async function Home() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center bg-gray-50 pb-16 md:pb-0">
        {/* Hero Section */}
        <section className="w-full bg-gradient-to-r from-teal-600 to-cyan-900 text-white">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
              <div>
                <h1 className="mb-4 text-4xl font-bold md:text-5xl">
                  Scroll. Discover. Shop.
                </h1>
                <p className="mb-6 text-lg opacity-90 md:text-xl">
                  AI-curated Amazon products in an endless shopping feed. Find
                  what you love without searching.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button
                    asChild
                    size="lg"
                    className="bg-white text-cyan-950 hover:bg-gray-100"
                  >
                    <StartScrollingButton />
                  </Button>
                </div>
              </div>
              <div className="relative hidden h-[600px] md:block">
                <HeroProducts />
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full bg-white py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">
              How It Works
            </h2>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
              <div className="flex flex-col items-center px-4 text-center">
                <div className="mb-4 rounded-full bg-cyan-100 p-4">
                  <Sparkles className="h-6 w-6 text-cyan-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  Scroll & Interact
                </h3>
                <p className="text-gray-600">
                  Browse your feed and tap or like the products you are
                  interested in. Every action helps us learn what you like.
                </p>
              </div>
              <div className="flex flex-col items-center px-4 text-center">
                <div className="mb-4 rounded-full bg-teal-100 p-4">
                  <Zap className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  AI Learns Your Taste
                </h3>
                <p className="text-gray-600">
                  Our AI builds a personal profile by analyzing product tags and
                  comparing them with your activity in real time.
                </p>
              </div>
              <div className="flex flex-col items-center px-4 text-center">
                <div className="mb-4 rounded-full bg-indigo-100 p-4">
                  <TrendingUp className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  Smart Recommendations
                </h3>
                <p className="text-gray-600">
                  Your feed blends personalized and trending items, helping you
                  discover new favorites effortlessly — no search needed.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trending Products Preview */}
        <section className="w-full bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Trending Now
            </h2>
            <div className="mt-8">
              <TrendingProducts />
            </div>
          </div>
        </section>

        <EnhancedStatsSection />

        {/* Features Section*/}
        <section className="bg-muted w-full py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-left text-3xl font-bold">
              Why ScrollCart?
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="bg-background rounded-xl border p-6 shadow-sm transition hover:shadow-md">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-teal-100">
                  <Zap className="h-5 w-5 text-teal-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">
                  AI-Powered Curation
                </h3>
                <p className="text-muted-foreground text-sm">
                  Our AI analyzes millions of Amazon products and learns your
                  interests to recommend items you&apos;ll love — even before
                  you search.
                </p>
              </div>
              <div className="bg-background rounded-xl border p-6 shadow-sm transition hover:shadow-md">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-orange-100">
                  <ShoppingBag className="h-5 w-5 text-orange-500" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">One-Tap Checkout</h3>
                <p className="text-muted-foreground text-sm">
                  Buy directly from Amazon with a single click. No distractions,
                  redirects, or confusion — just instant checkout.
                </p>
              </div>
              <div className="bg-background rounded-xl border p-6 shadow-sm transition hover:shadow-md">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-purple-100">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">
                  Personalized Feed
                </h3>
                <p className="text-muted-foreground text-sm">
                  Your recommendations evolve as you scroll. The more you
                  engage, the smarter and more relevant your feed becomes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full border-t bg-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-between md:flex-row">
              <div className="mb-4 md:mb-0">
                <span className="bg-gradient-to-r from-teal-600 to-cyan-900 bg-clip-text text-xl font-bold text-transparent">
                  ScrollCart
                </span>
                <p className="mt-1 text-sm text-gray-500">
                  Scroll. Discover. Shop.
                </p>
              </div>
              <div className="flex flex-col gap-4 text-sm md:flex-row md:gap-8">
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-gray-900"
                >
                  About
                </Link>
                <Link
                  href="/privacy"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Privacy
                </Link>
                <Link
                  href="/terms"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Terms
                </Link>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Contact
                </Link>
              </div>
            </div>
            <div className="mt-8 border-t pt-4 text-center text-xs text-gray-500">
              <p>
                © {new Date().getFullYear()} ScrollCart. All rights reserved.
              </p>
              <p className="mt-1">Not affiliated with Amazon.</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
