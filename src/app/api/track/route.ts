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
  action: z.enum(["liked", "clicked", "viewed", "added_to_cart"]),
  asin: z.string(),
  time_spent: z.number().min(0).optional(),
});
export const POST = async (req: Request) => {
  const { action, asin, time_spent } = RecommendationSchema.parse(
    await req.json(),
  );

  const userId = await getOrCreateUserId();
  const redisKey = getUserKey(userId);
  const userData = await getOrInitUserHistory(userId);

  // Update the appropriate list
  if (
    action === "liked" ||
    action === "clicked" ||
    action === "viewed" ||
    action === "added_to_cart"
  ) {
    const key = `${action}_item_keys` as keyof UserActivity;
    if (action === "viewed") {
      console.log(`time_spent: ${time_spent}`);
      userData[key][asin] ??= {
        timestamp: new Date().toISOString(),
        time_spent: time_spent,
      };
    } else {
      userData[key][asin] = {
        timestamp: new Date().toISOString(),
      };
    }

    await redis.set(redisKey, userData);

    return new NextResponse(JSON.stringify({ message: "OK" }), { status: 200 });
  }
};
