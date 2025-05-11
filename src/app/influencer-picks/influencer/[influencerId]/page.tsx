import Link from "next/link";
import { ChevronLeft, ExternalLink, Star } from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Mock data for influencers and their recommended products
const influencers = {
  linustechtips: {
    name: "Linus Tech Tips",
    category: "Tech",
    followers: "13.8M",
    bio: "Tech reviews, guides, and unboxings from the LTT team",
    products: [
      {
        id: "p1",
        title: "Logitech MX Master 3S Wireless Mouse",
        image: "/placeholder.svg?height=200&width=200",
        price: 99.99,
        rating: 4.8,
        reviewCount: 12453,
        link: "https://amazon.com",
        description:
          "The perfect mouse for productivity with customizable buttons and ergonomic design.",
      },
      {
        id: "p2",
        title: "Keychron Q1 Pro Mechanical Keyboard",
        image: "/placeholder.svg?height=200&width=200",
        price: 199.99,
        rating: 4.7,
        reviewCount: 3245,
        link: "https://amazon.com",
        description:
          "Premium mechanical keyboard with hot-swappable switches and wireless connectivity.",
      },
      {
        id: "p3",
        title: "Samsung Odyssey G7 32-inch Gaming Monitor",
        image: "/placeholder.svg?height=200&width=200",
        price: 649.99,
        rating: 4.6,
        reviewCount: 5678,
        link: "https://amazon.com",
        description:
          "Curved gaming monitor with 240Hz refresh rate and 1ms response time.",
      },
      {
        id: "p4",
        title: "Anker 737 Power Bank (PowerCore 24K)",
        image: "/placeholder.svg?height=200&width=200",
        price: 149.99,
        rating: 4.9,
        reviewCount: 8765,
        link: "https://amazon.com",
        description:
          "24,000mAh power bank with 140W output and smart digital display.",
      },
      {
        id: "p5",
        title: "Elgato Stream Deck MK.2",
        image: "/placeholder.svg?height=200&width=200",
        price: 149.99,
        rating: 4.8,
        reviewCount: 4321,
        link: "https://amazon.com",
        description:
          "Customizable LCD keys for streamers and content creators.",
      },
    ],
  },
  ijustine: {
    name: "iJustine",
    category: "Tech",
    followers: "7.2M",
    bio: "Tech enthusiast covering Apple products, gadgets, and gaming",
    products: [
      {
        id: "p1",
        title: "Apple AirPods Pro (2nd Generation)",
        image: "/placeholder.svg?height=200&width=200",
        price: 249.99,
        rating: 4.7,
        reviewCount: 23456,
        link: "https://amazon.com",
        description:
          "Wireless earbuds with active noise cancellation and spatial audio.",
      },
      {
        id: "p2",
        title: "Sony Alpha a7 IV Mirrorless Camera",
        image: "/placeholder.svg?height=200&width=200",
        price: 2499.99,
        rating: 4.9,
        reviewCount: 1234,
        link: "https://amazon.com",
        description:
          "Full-frame mirrorless camera with 33MP sensor and 4K video recording.",
      },
      {
        id: "p3",
        title: "Twelve South BookArc for MacBook",
        image: "/placeholder.svg?height=200&width=200",
        price: 59.99,
        rating: 4.6,
        reviewCount: 3456,
        link: "https://amazon.com",
        description:
          "Space-saving vertical stand for MacBook with cable management.",
      },
      {
        id: "p4",
        title: "LG C2 OLED 4K TV (65-inch)",
        image: "/placeholder.svg?height=200&width=200",
        price: 1799.99,
        rating: 4.8,
        reviewCount: 5678,
        link: "https://amazon.com",
        description:
          "OLED TV with perfect blacks, vibrant colors, and gaming features.",
      },
    ],
  },
  fitnesswithpamela: {
    name: "Fitness with Pamela",
    category: "Fitness",
    followers: "2.4M",
    bio: "Home workouts, fitness tips, and healthy lifestyle recommendations",
    products: [
      {
        id: "p1",
        title: "Bowflex SelectTech 552 Adjustable Dumbbells",
        image: "/placeholder.svg?height=200&width=200",
        price: 429.99,
        rating: 4.8,
        reviewCount: 9876,
        link: "https://amazon.com",
        description:
          "Space-saving adjustable dumbbells that replace 15 sets of weights.",
      },
      {
        id: "p2",
        title: "Lululemon Align High-Rise Pants",
        image: "/placeholder.svg?height=200&width=200",
        price: 98.99,
        rating: 4.9,
        reviewCount: 12345,
        link: "https://amazon.com",
        description:
          "Buttery-soft yoga pants with four-way stretch and sweat-wicking fabric.",
      },
      {
        id: "p3",
        title: "Hydro Flask 32 oz Water Bottle",
        image: "/placeholder.svg?height=200&width=200",
        price: 44.95,
        rating: 4.7,
        reviewCount: 7654,
        link: "https://amazon.com",
        description:
          "Insulated stainless steel water bottle that keeps drinks cold for 24 hours.",
      },
      {
        id: "p4",
        title: "Bala Bangles Wrist and Ankle Weights",
        image: "/placeholder.svg?height=200&width=200",
        price: 49.99,
        rating: 4.6,
        reviewCount: 5432,
        link: "https://amazon.com",
        description:
          "Stylish and comfortable 1lb weights to add resistance to any workout.",
      },
      {
        id: "p5",
        title: "Manduka PRO Yoga Mat",
        image: "/placeholder.svg?height=200&width=200",
        price: 120.0,
        rating: 4.8,
        reviewCount: 3456,
        link: "https://amazon.com",
        description:
          "Premium 6mm thick yoga mat with lifetime guarantee and non-slip surface.",
      },
    ],
  },
};

export default function InfluencerPage({
  params,
}: {
  params: { influencerId: string };
}) {
  const { influencerId } = params;
  const influencer = influencers[influencerId as keyof typeof influencers];

  console.log(params);
  console.log(influencer);
  if (!influencer) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="mb-4 text-2xl font-bold">Influencer not found</h1>
        <p className="mb-6">
          The influencer you&apos;re looking for doesn&apos;t exist or
          hasn&apos;t been added yet.
        </p>
        <Link href="/">
          <Button>Return to Home</Button>
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {influencer.products.map((product) => (
            <Card key={product.id} className="flex h-full flex-col">
              <CardContent className="flex-grow p-6">
                <div className="mb-4 flex aspect-square items-center justify-center overflow-hidden rounded-md bg-gray-100">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    width={200}
                    height={200}
                    alt={product.title}
                    className="h-full w-full object-contain p-4"
                  />
                </div>
                <h3 className="mb-2 line-clamp-2 text-lg font-semibold">
                  {product.title}
                </h3>
                <div className="mb-2 flex items-center">
                  <div className="mr-2 flex items-center">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                  </div>
                  <span className="text-muted-foreground text-sm">
                    ({product.reviewCount.toLocaleString()})
                  </span>
                </div>
                <p className="mb-2 text-lg font-medium">
                  ${product.price.toFixed(2)}
                </p>
                <p className="text-muted-foreground line-clamp-3 text-sm">
                  {product.description}
                </p>
              </CardContent>
              <CardFooter className="px-6 pt-0 pb-6">
                <a
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button className="w-full">
                    View on Amazon
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
