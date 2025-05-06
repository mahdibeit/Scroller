import "@/styles/globals.css";
import { type Metadata } from "next";
import { Geist } from "next/font/google";
import ClientProviders from "@/components/client-providers";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Navbar from "@/components/navbar";
import { CartProvider } from "@/context/cart-context";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "ScrollCart - Scroll. Discover. Shop.",
  description: "AI-curated Amazon shopping feed with one-tap checkout",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
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
