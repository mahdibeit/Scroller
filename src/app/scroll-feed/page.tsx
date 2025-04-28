export const dynamic = "force-dynamic";

import ScrollFeed from "@/components/scroll-feed";

export default function Page1() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-800 text-white">
      <ScrollFeed />
    </main>
  );
}
