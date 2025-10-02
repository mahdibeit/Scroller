import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Cart - ScrollCart",
  description:
    "Review your cart and checkout with ease. One-tap checkout for all your selected items on ScrollCart.",
  openGraph: {
    title: "Your Cart - ScrollCart",
    description:
      "Review your cart and checkout with ease. One-tap checkout for all your selected items.",
  },
  robots: "noindex, nofollow", // Cart pages should not be indexed
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
