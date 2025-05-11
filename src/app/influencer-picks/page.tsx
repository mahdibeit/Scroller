import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Mock data for categories
const categories = [
  {
    id: "tech",
    name: "Tech",
    description: "Technology gadgets and accessories",
    influencerCount: 12,
  },
  {
    id: "fitness",
    name: "Fitness",
    description: "Workout equipment and supplements",
    influencerCount: 8,
  },
  {
    id: "beauty",
    name: "Beauty",
    description: "Skincare, makeup, and beauty products",
    influencerCount: 15,
  },
  {
    id: "home",
    name: "Home",
    description: "Home decor and kitchen essentials",
    influencerCount: 10,
  },
  {
    id: "fashion",
    name: "Fashion",
    description: "Clothing, shoes, and accessories",
    influencerCount: 14,
  },
];

// Featured influencers configuration
const featuredInfluencers = [
  {
    id: "linustechtips",
    name: "Linus Tech Tips",
    category: "Tech",
    imageUrl: "/placeholder.svg?height=96&width=96",
  },
  {
    id: "ijustine",
    name: "iJustine",
    category: "Tech",
    imageUrl: "/placeholder.svg?height=96&width=96",
  },
  {
    id: "mkbhd",
    name: "MKBHD",
    category: "Tech",
    imageUrl: "/placeholder.svg?height=96&width=96",
  },
  {
    id: "fitnesswithpamela",
    name: "Fitness with Pamela",
    category: "Fitness",
    imageUrl: "/placeholder.svg?height=96&width=96",
  },
];

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">
          Influencer Picks
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl">
          Discover the best Amazon products recommended by your favorite
          influencers and YouTubers
        </p>
      </header>

      <section>
        <h2 className="mb-6 text-2xl font-semibold">Browse by Category</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`influencer-picks/category/${category.id}`}
              className="block"
            >
              <Card className="h-full transition-all hover:shadow-md">
                <CardHeader>
                  <CardTitle>{category.name}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    {category.influencerCount} Influencers
                  </span>
                  <ChevronRight className="text-muted-foreground h-5 w-5" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="mb-6 text-2xl font-semibold">Featured Influencers</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredInfluencers.map((influencer) => (
            <Link
              key={influencer.id}
              href={`influencer-picks/influencer/${influencer.id}`}
            >
              <Card className="h-full transition-all hover:shadow-md">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 h-24 w-24 overflow-hidden rounded-full bg-gray-200">
                      <Image
                        src={influencer.imageUrl}
                        width={100}
                        height={100}
                        alt={influencer.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <h3 className="text-lg font-semibold">{influencer.name}</h3>
                    <p className="text-muted-foreground text-sm">
                      {influencer.category}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
