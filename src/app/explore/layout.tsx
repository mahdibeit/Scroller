import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Products - ScrollCart",
  description:
    "Explore and discover curated products across different categories. Find trending items and the best deals handpicked for you.",
  openGraph: {
    title: "Explore Products - ScrollCart",
    description:
      "Explore and discover curated products across different categories. Find trending items and the best deals.",
  },
};

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
