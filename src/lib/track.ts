// app/api/track/route.ts
import { cookies } from "next/headers";
import { Redis } from "@upstash/redis";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";

export const redis = Redis.fromEnv();

export type UserActivity = {
  liked_item_keys: string[];
  clicked_item_keys: string[];
  viewed_item_keys: string[];
};

const DEFAULT_HISTORY: UserActivity = {
  liked_item_keys: [],
  clicked_item_keys: [],
  viewed_item_keys: [],
};

export function getUserKey(id: string) {
  return `user:${id}`;
}

export async function getOrCreateUserId(): Promise<string> {
  const cookieStore = await cookies();
  const userId = cookieStore.get("scroller_user_id")?.value;

  if (userId) {
    return userId;
  }

  const newUserId = uuidv4();
  cookieStore.set("scroller_user_id", newUserId, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });

  return newUserId;
}

export async function getOrInitUserHistory(
  userId: string,
): Promise<UserActivity> {
  const redisKey = getUserKey(userId);
  const existing = await redis.get<UserActivity>(redisKey);

  if (existing) return existing;

  await redis.set(redisKey, DEFAULT_HISTORY);
  return DEFAULT_HISTORY;
}
