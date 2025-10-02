import "@/styles/globals.css";
import { type Metadata } from "next";
import { Geist } from "next/font/google";
import ClientProviders from "@/components/client-providers";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Navbar from "@/components/navbar";
import { CartProvider } from "@/context/cart-context";
import { Toaster } from "@/components/ui/sonner";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "ScrollCart - Scroll. Discover. Shop.",
  description:
    "AI-curated Amazon shopping feed with one-tap checkout. Discover trending products recommended by top influencers and shop with ease.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  keywords: [
    "shopping",
    "amazon products",
    "influencer recommendations",
    "one-tap checkout",
    "AI shopping",
    "product discovery",
    "social shopping",
    "ecommerce",
    "online shopping",
  ],
  applicationName: "ScrollCart",
  authors: [{ name: "ScrollCart Team" }],
  creator: "ScrollCart",
  publisher: "ScrollCart",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  themeColor: "#ffffff",
  viewport: "width=device-width, initial-scale=1",
  openGraph: {
    title: "ScrollCart - Scroll. Discover. Shop.",
    description:
      "AI-curated Amazon shopping feed with one-tap checkout. Discover trending products recommended by top influencers and shop with ease.",
    url: "https://scrollcart.app",
    siteName: "ScrollCart",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ScrollCart - AI-powered shopping discovery",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ScrollCart - Scroll. Discover. Shop.",
    description: "AI-curated Amazon shopping feed with one-tap checkout",
    creator: "@scrollcart",
    images: ["/twitter-image.jpg"],
  },
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <JsonLd />
        <Toaster />
        <CartProvider>
          <Navbar />
          <ClientProviders>{children}</ClientProviders>
        </CartProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
