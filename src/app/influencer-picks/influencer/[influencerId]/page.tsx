import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import InfluencerProducts from "@/components/InfluencerProducts";

// Mock data for influencers profile info only
const influencers = {
  linustechtips: {
    name: "Linus Tech Tips",
    category: "Tech",
    followers: "13.8M",
    bio: "Tech reviews, guides, and unboxings from the LTT team",
  },
  ijustine: {
    name: "iJustine",
    category: "Tech",
    followers: "7.2M",
    bio: "Tech enthusiast covering Apple products, gadgets, and gaming",
  },
  fitnesswithpamela: {
    name: "Fitness with Pamela",
    category: "Fitness",
    followers: "2.4M",
    bio: "Home workouts, fitness tips, and healthy lifestyle recommendations",
  },
};

export default function InfluencerPage({
  params,
}: {
  params: { influencerId: string };
}) {
  const { influencerId } = params;
  const influencer = influencers[influencerId as keyof typeof influencers];

  if (!influencer) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="mb-4 text-2xl font-bold">Influencer not found</h1>
        <p className="mb-6">
          The influencer you&apos;re looking for doesn&apos;t exist or
          hasn&apos;t been added yet.
        </p>
        <Link href="/" className="text-primary font-medium">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href={`/category/${influencer.category.toLowerCase()}`}
        className="text-primary mb-6 inline-flex items-center text-sm font-medium"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to {influencer.category} Influencers
      </Link>

      <header className="mb-8">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
          <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
            <Image
              src="/placeholder.svg?height=128&width=128"
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
            <p className="max-w-2xl">{influencer.bio}</p>
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
