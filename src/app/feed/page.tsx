import ScrollFeed from "@/components/feed";

export default function FeedPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 text-white">
      <div className="mx-auto flex w-full flex-col items-center">
        <ScrollFeed />
      </div>
    </main>
  );
}
