import {
  getOrCreateUserId,
  getOrInitUserHistory,
  getUserKey,
  redis,
} from "@/lib/track";
import { z } from "zod";
import type { UserActivity } from "@/lib/track";
import { NextResponse } from "next/server";

const RecommendationSchema = z.object({
  action: z.enum(["liked", "clicked", "viewed"]),
  itemKey: z.string(),
});
export const POST = async (req: Request) => {
  const { action, itemKey } = RecommendationSchema.parse(await req.json());

  const userId = await getOrCreateUserId();
  const redisKey = getUserKey(userId);
  const userData = await getOrInitUserHistory(userId);

  // Update the appropriate list
  if (action === "liked" || action === "clicked" || action === "viewed") {
    const key = `${action}_item_keys` as keyof UserActivity;
    if (!userData[key].includes(itemKey)) {
      userData[key].push(itemKey);
    }

    await redis.set(redisKey, userData);
  }

  return new NextResponse(JSON.stringify({ message: "OK" }), { status: 200 });
};
