import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import InfluencerProducts from "@/components/InfluencerProducts";
import { categoryNames, influencersByCategory } from "@/lib/constants";

export async function generateMetadata({
  params,
}: {
  params: { influencerId: string };
}): Promise<Metadata> {
  const influencer = findInfluencer(params.influencerId);

  if (!influencer) {
    return {
      title: "Influencer Not Found - ScrollCart",
      description: "The requested influencer page could not be found.",
    };
  }

  return {
    title: `${influencer.name}'s Picks - ScrollCart`,
    description: `Shop ${influencer.name}'s curated collection of ${influencer.category.toLowerCase()} products. Discover their favorite items and recommendations.`,
    openGraph: {
      title: `${influencer.name}'s Product Picks on ScrollCart`,
      description: `Shop ${influencer.name}'s curated collection of ${influencer.category.toLowerCase()} products.`,
      images: [{ url: influencer.imageUrl, width: 800, height: 600 }],
    },
  };
}

// Find influencer in any category
function findInfluencer(id: string) {
  for (const [category, influencers] of Object.entries(influencersByCategory)) {
    const influencer = influencers.find((inf) => inf.id === id);
    if (influencer) {
      return {
        ...influencer,
        category: categoryNames[category as keyof typeof categoryNames],
      };
    }
  }
  return null;
}

export default async function InfluencerPage({
  params,
}: {
  // ← now a Promise
  params: Promise<{ influencerId: string }>;
}) {
  // await it to get the actual object
  const { influencerId } = await params;

  const influencer = findInfluencer(influencerId);

  if (!influencer) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="mb-4 text-2xl font-bold">Influencer not found</h1>
        <p className="mb-6">
          The influencer you&apos;re looking for doesn&apos;t exist or
          hasn&apos;t been added yet.
        </p>
        <Link href="/influencer-picks" className="text-primary font-medium">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href={`/influencer-picks/category/${Object.entries(categoryNames).find(([_, value]) => value === influencer.category)?.[0]}`}
        className="text-primary mb-6 inline-flex items-center text-sm font-medium"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to {influencer.category} Influencers
      </Link>

      <header className="mb-8">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
          <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
            <Image
              src={influencer.imageUrl}
              width={128}
              height={128}
              alt={influencer.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="text-center md:text-left">
            <div className="mb-2 flex flex-col gap-2 md:flex-row md:items-center">
              <h1 className="text-3xl font-bold tracking-tight">
                {influencer.name}
              </h1>
              <Badge variant="outline" className="md:ml-2">
                {influencer.category}
              </Badge>
            </div>
            <p className="text-muted-foreground mb-2">
              {influencer.followers} followers
            </p>
            <p className="max-w-2xl">
              {influencer.bio ??
                `${influencer.name} shares their favorite products and recommendations`}
            </p>
          </div>
        </div>
      </header>

      <section>
        <h2 className="mb-6 text-2xl font-semibold">Recommended Products</h2>
        <InfluencerProducts influencerId={influencerId} />
      </section>
    </div>
  );
}
