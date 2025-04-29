import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ShoppingBag,
  Zap,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export default async function Home() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center bg-gray-50 pb-16 md:pb-0">
        {/* Hero Section */}
        <section className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white">
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
                    className="bg-white text-pink-600 hover:bg-gray-100"
                  >
                    <Link href="/feed">
                      Start Scrolling <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="relative hidden h-[400px] md:block">
                <div className="absolute top-0 right-0 h-[500px] w-[280px] translate-y-4 rotate-3 transform overflow-hidden rounded-lg bg-white shadow-xl">
                  <div className="h-full w-full animate-pulse bg-gray-200"></div>
                </div>
                <div className="absolute top-0 right-20 h-[500px] w-[280px] -rotate-6 transform overflow-hidden rounded-lg bg-white shadow-xl">
                  <div className="h-full w-full animate-pulse bg-gray-200"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full bg-white py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Why ScrollCart?
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center rounded-lg p-6 text-center">
                <div className="mb-4 rounded-full bg-pink-100 p-3">
                  <Zap className="h-6 w-6 text-pink-500" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  AI-Powered Curation
                </h3>
                <p className="text-gray-600">
                  Our AI analyzes millions of products to show you items you
                  will love, even before you know you want them.
                </p>
              </div>
              <div className="flex flex-col items-center rounded-lg p-6 text-center">
                <div className="mb-4 rounded-full bg-orange-100 p-3">
                  <ShoppingBag className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">One-Tap Checkout</h3>
                <p className="text-gray-600">
                  See something you like? Buy directly from Amazon with just one
                  tap. No redirects, no hassle.
                </p>
              </div>
              <div className="flex flex-col items-center rounded-lg p-6 text-center">
                <div className="mb-4 rounded-full bg-purple-100 p-3">
                  <Sparkles className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  Personalized Feed
                </h3>
                <p className="text-gray-600">
                  The more you scroll, the smarter we get. Your feed evolves
                  with your preferences.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trending Products Preview */}
        <section className="w-full bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Trending Now</h2>
              <div className="flex items-center text-pink-500">
                <TrendingUp className="mr-1 h-5 w-5" />
                <span className="font-medium">Popular items</span>
              </div>
            </div>
            <div className="mt-8 text-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-orange-500 text-white"
              >
                <Link href="/feed">
                  See More Products <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full border-t bg-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-between md:flex-row">
              <div className="mb-4 md:mb-0">
                <span className="bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-xl font-bold text-transparent">
                  ScrollCart
                </span>
                <p className="mt-1 text-sm text-gray-500">
                  Scroll. Shop. Smile.
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
              <p className="mt-1">
                Not affiliated with Amazon. Amazon and all related logos are
                trademarks of Amazon.com, Inc.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
