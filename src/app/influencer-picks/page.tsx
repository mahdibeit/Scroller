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

import { categoryNames, influencersByCategory } from "@/lib/constants";

// Categories with descriptions
const categories = Object.entries(categoryNames).map(([id, name]) => ({
  id,
  name,
  description: getDescription(id),
  get influencerCount() {
    return influencersByCategory[id]?.length ?? 0;
  },
}));

// Define featured influencer IDs
const FEATURED_INFLUENCER_IDS = [
  "mkbhd", // Popular tech reviewer
  "linustechtips", // Large tech channel
  "ijustine", // Tech lifestyle
  "athleanx", // Popular fitness channel
];

// Get featured influencers by ID
const featuredInfluencers = Object.entries(influencersByCategory).flatMap(
  ([category, influencers]) =>
    influencers
      .filter((inf) => FEATURED_INFLUENCER_IDS.includes(inf.id))
      .map((inf) => ({
        ...inf,
        category: categoryNames[category as keyof typeof categoryNames],
      })),
);

function getDescription(category: string): string {
  switch (category) {
    case "tech":
      return "Technology gadgets and accessories";
    case "fitness":
      return "Workout equipment and supplements";
    case "beauty":
      return "Skincare, makeup, and beauty products";
    case "home":
      return "Home decor and kitchen essentials";
    case "fashion":
      return "Clothing, shoes, and accessories";
    default:
      return "";
  }
}

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

      {/* Categories section */}
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
      {/* Featured Influencers Section */}
      <section className="mt-12">
        <h2 className="mb-6 text-2xl font-semibold">Featured Influencers</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredInfluencers.map((influencer) => (
            <Link
              key={influencer.id}
              href={`influencer-picks/${influencer.id}`}
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
