import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Influencer Picks - ScrollCart",
  description:
    "Discover product recommendations from your favorite influencers. Shop directly from curated collections by top content creators.",
  openGraph: {
    title: "Influencer Picks - ScrollCart",
    description:
      "Discover product recommendations from your favorite influencers. Shop directly from curated collections.",
  },
};

export default function InfluencerPicksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
