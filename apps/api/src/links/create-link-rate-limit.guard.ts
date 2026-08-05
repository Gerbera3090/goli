import { createHash } from "node:crypto";

import {
  type CanActivate,
  type ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { RedisService } from "../redis/redis.service.js";

interface LocalCounter {
  count: number;
  expiresAt: number;
}

interface RateLimitedRequest {
  ip?: string;
  socket?: { remoteAddress?: string };
}

interface RateLimitedResponse {
  setHeader(name: string, value: string): void;
}

export interface RateLimitDecision {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
}

@Injectable()
export class CreateLinkRateLimiter {
  private readonly localCounters = new Map<string, LocalCounter>();
  private readonly maxRequests: number;
  private readonly windowSeconds: number;

  constructor(
    @Inject(RedisService) private readonly redis: RedisService,
    @Inject(ConfigService) config: ConfigService,
  ) {
    this.maxRequests = Number(
      config.get<number>("LINK_CREATE_RATE_LIMIT_MAX") ?? 20,
    );
    this.windowSeconds = Number(
      config.get<number>("LINK_CREATE_RATE_LIMIT_WINDOW_SECONDS") ?? 60,
    );
  }

  async consume(clientId: string): Promise<RateLimitDecision> {
    const key = this.keyFor(clientId);
    const redisCount = await this.redis.incrementWithExpiry(
      key,
      this.windowSeconds,
    );
    const count = redisCount ?? this.incrementLocal(key);

    return {
      allowed: count <= this.maxRequests,
      limit: this.maxRequests,
      remaining: Math.max(this.maxRequests - count, 0),
      retryAfterSeconds: this.windowSeconds,
    };
  }

  private incrementLocal(key: string): number {
    const now = Date.now();
    const current = this.localCounters.get(key);

    if (!current || current.expiresAt <= now) {
      this.localCounters.set(key, {
        count: 1,
        expiresAt: now + this.windowSeconds * 1000,
      });
      this.removeExpiredLocalCounters(now);
      return 1;
    }

    current.count += 1;
    return current.count;
  }

  private removeExpiredLocalCounters(now: number): void {
    if (this.localCounters.size < 1_000) return;

    for (const [key, counter] of this.localCounters) {
      if (counter.expiresAt <= now) {
        this.localCounters.delete(key);
      }
    }
  }

  private keyFor(clientId: string): string {
    const clientHash = createHash("sha256")
      .update(clientId)
      .digest("hex")
      .slice(0, 32);
    return `rate-limit:create-link:${clientHash}`;
  }
}

@Injectable()
export class CreateLinkRateLimitGuard implements CanActivate {
  constructor(
    @Inject(CreateLinkRateLimiter)
    private readonly rateLimiter: CreateLinkRateLimiter,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const http = context.switchToHttp();
    const request = http.getRequest<RateLimitedRequest>();
    const response = http.getResponse<RateLimitedResponse>();
    const clientId = request.ip ?? request.socket?.remoteAddress ?? "unknown";
    const decision = await this.rateLimiter.consume(clientId);

    response.setHeader("X-RateLimit-Limit", String(decision.limit));
    response.setHeader("X-RateLimit-Remaining", String(decision.remaining));

    if (!decision.allowed) {
      response.setHeader("Retry-After", String(decision.retryAfterSeconds));
      throw new HttpException(
        "잠시 동안 너무 많은 고리를 만들었습니다. 잠시 후 다시 시도해 주세요.",
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}
