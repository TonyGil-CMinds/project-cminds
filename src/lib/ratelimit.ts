import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

interface LimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

interface Limiter {
  limit(identifier: string): Promise<LimitResult>;
}

const hasUpstash = !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = hasUpstash ? Redis.fromEnv() : null;

// Sliding window: 5 requests per 60 seconds per client IP, shared across write endpoints.
export const writeLimiter: Limiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, "60 s"), prefix: "rl:write" })
  : {
      // No Upstash configured (e.g. local dev) — never block requests.
      limit: async (_identifier: string): Promise<LimitResult> => ({
        success: true,
        limit: 0,
        remaining: 0,
        reset: 0,
      }),
    };

export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return "unknown";
}
