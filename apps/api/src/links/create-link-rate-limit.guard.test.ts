import type { ConfigService } from "@nestjs/config";
import { describe, expect, it, vi } from "vitest";

import type { RedisService } from "../redis/redis.service.js";
import { CreateLinkRateLimiter } from "./create-link-rate-limit.guard.js";

function configWith(limit: number, windowSeconds = 60): ConfigService {
  return {
    get: vi.fn((key: string) => {
      if (key === "LINK_CREATE_RATE_LIMIT_MAX") return limit;
      if (key === "LINK_CREATE_RATE_LIMIT_WINDOW_SECONDS") {
        return windowSeconds;
      }
      return undefined;
    }),
  } as unknown as ConfigService;
}

describe("CreateLinkRateLimiter", () => {
  it("uses the shared Redis counter when Redis is available", async () => {
    const redis = {
      incrementWithExpiry: vi
        .fn()
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(2),
    } as unknown as RedisService;
    const limiter = new CreateLinkRateLimiter(redis, configWith(1));

    await expect(limiter.consume("127.0.0.1")).resolves.toMatchObject({
      allowed: true,
      remaining: 0,
    });
    await expect(limiter.consume("127.0.0.1")).resolves.toMatchObject({
      allowed: false,
      remaining: 0,
    });
  });

  it("still limits requests with a local fallback when Redis is down", async () => {
    const redis = {
      incrementWithExpiry: vi.fn().mockResolvedValue(null),
    } as unknown as RedisService;
    const limiter = new CreateLinkRateLimiter(redis, configWith(2));

    expect((await limiter.consume("client-a")).allowed).toBe(true);
    expect((await limiter.consume("client-a")).allowed).toBe(true);
    expect((await limiter.consume("client-a")).allowed).toBe(false);
    expect((await limiter.consume("client-b")).allowed).toBe(true);
  });
});
