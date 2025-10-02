import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feed - Discover Products on ScrollCart",
  description:
    "Experience an endless feed of AI-curated products. Scroll through personalized recommendations and discover items you'll love.",
  openGraph: {
    title: "Feed - Discover Products on ScrollCart",
    description:
      "Experience an endless feed of AI-curated products. Scroll through personalized recommendations.",
  },
};

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
