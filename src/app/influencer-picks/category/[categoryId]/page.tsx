import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

// Mock data for influencers by category
const influencersByCategory = {
  tech: [
    {
      id: "linustechtips",
      name: "Linus Tech Tips",
      followers: "13.8M",
      productCount: 42,
    },
    {
      id: "ijustine",
      name: "iJustine",
      followers: "7.2M",
      productCount: 36,
    },
    {
      id: "mkbhd",
      name: "MKBHD",
      followers: "16.5M",
      productCount: 28,
    },
    {
      id: "unboxtherapy",
      name: "Unbox Therapy",
      followers: "18.2M",
      productCount: 45,
    },
    {
      id: "theverge",
      name: "The Verge",
      followers: "3.4M",
      productCount: 32,
    },
    {
      id: "techlinked",
      name: "TechLinked",
      followers: "1.8M",
      productCount: 24,
    },
  ],
  fitness: [
    {
      id: "fitnesswithpamela",
      name: "Fitness with Pamela",
      followers: "2.4M",
      productCount: 38,
    },
    {
      id: "athleanx",
      name: "AthleanX",
      followers: "12.7M",
      productCount: 42,
    },
    {
      id: "blogilates",
      name: "Blogilates",
      followers: "5.8M",
      productCount: 35,
    },
    {
      id: "jeffnippard",
      name: "Jeff Nippard",
      followers: "3.2M",
      productCount: 28,
    },
  ],
  beauty: [],
  home: [],
  fashion: [],
};

const categoryNames = {
  tech: "Tech",
  fitness: "Fitness",
  beauty: "Beauty",
  home: "Home",
  fashion: "Fashion",
};

export default function CategoryPage({
  params,
}: {
  params: { categoryId: string };
}) {
  const { categoryId } = params;
  const influencers =
    influencersByCategory[categoryId as keyof typeof influencersByCategory] ||
    [];
  const categoryName =
    categoryNames[categoryId as keyof typeof categoryNames] || categoryId;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/"
        className="text-primary mb-6 inline-flex items-center text-sm font-medium"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Categories
      </Link>

      <header className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">
          {categoryName} Influencers
        </h1>
        <p className="text-muted-foreground">
          Browse {influencers.length} influencers in the{" "}
          {categoryName.toLowerCase()} category
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {influencers.map((influencer) => (
          <Link key={influencer.id} href={`/influencer/${influencer.id}`}>
            <Card className="h-full transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
                    <Image
                      src="/placeholder.svg?height=64&width=64"
                      alt={influencer.name}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{influencer.name}</h3>
                    <p className="text-muted-foreground text-sm">
                      {influencer.followers} followers
                    </p>
                    <p className="text-sm">
                      {influencer.productCount} recommended products
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {influencers.length === 0 && (
        <div className="py-12 text-center">
          <h3 className="text-lg font-medium">
            No influencers found in this category
          </h3>
          <p className="text-muted-foreground mt-2">
            Check back soon for updates!
          </p>
        </div>
      )}
    </div>
  );
}
