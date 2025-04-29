import "@/styles/globals.css";
import { type Metadata } from "next";
import { Geist } from "next/font/google";
import ClientProviders from "@/components/client-providers";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "ScrollCart - Scroll. Shop. Smile.",
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
        <Navbar />
        <ClientProviders>{children}</ClientProviders>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
