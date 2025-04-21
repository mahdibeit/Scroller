import RedditPostStack from "@/components/reddit-post-stack";
import { api, HydrateClient } from "@/trpc/server";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });

  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <p className="text-2xl text-white">
          {hello ? hello.greeting : "Loading tRPC query..."}
        </p>
        <RedditPostStack />
      </main>
    </HydrateClient>
  );
}
