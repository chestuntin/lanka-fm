import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();
const COUNTER_KEY = "visitor_count";

export async function GET(req: NextRequest) {
  // Atomically increment the counter and return the new value
  const count = await redis.incr(COUNTER_KEY);
  return NextResponse.json({ count });
}

export async function HEAD() {
  // Just return the current count without incrementing
  const count = await redis.get<number>(COUNTER_KEY);
  return new Response(count?.toString() ?? "0");
}
