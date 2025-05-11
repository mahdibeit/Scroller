import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { categoryNames, influencersByCategory } from "@/lib/constants";

export default async function CategoryPage({
  params,
}: {
  // ← now a Promise
  params: Promise<{ categoryId: string }>;
}) {
  // await it to get the actual object
  const { categoryId } = await params;
  const influencers = influencersByCategory[categoryId] ?? [];
  const categoryName =
    categoryNames[categoryId as keyof typeof categoryNames] ?? categoryId;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/influencer-picks"
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
          Browse {influencers.length} influencers in the {categoryName} category
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {influencers.map((influencer) => (
          <Link key={influencer.id} href={`/influencer-picks/${influencer.id}`}>
            <Card className="h-full transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
                    <Image
                      src={influencer.imageUrl}
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
                    {influencer.bio && (
                      <p className="text-muted-foreground mt-1 text-sm">
                        {influencer.bio}
                      </p>
                    )}
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
