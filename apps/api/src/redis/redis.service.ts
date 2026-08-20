import {
  Inject,
  Injectable,
  Logger,
  type OnModuleDestroy,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Redis } from "ioredis";

@Injectable()
export class RedisService implements OnModuleDestroy {
  private static readonly incrementWithExpiryScript = `
    local count = redis.call("INCR", KEYS[1])
    if count == 1 then
      redis.call("EXPIRE", KEYS[1], ARGV[1])
    end
    return count
  `;

  private readonly client: Redis;
  private readonly logger = new Logger(RedisService.name);

  constructor(@Inject(ConfigService) config: ConfigService) {
    this.client = new Redis({
      host: config.get<string>("REDIS_HOST") ?? "127.0.0.1",
      port: Number(config.get<string>("REDIS_PORT") ?? 6379),
      username: config.get<string>("REDIS_USERNAME"),
      password: config.get<string>("REDIS_PASSWORD"),
      lazyConnect: true,
      enableOfflineQueue: false,
      maxRetriesPerRequest: 1,
      retryStrategy: (attempt) => Math.min(attempt * 250, 2_000),
    });

    this.client.on("error", (error) => {
      this.logger.warn(`Redis 연결을 사용할 수 없습니다: ${error.message}`);
    });

    void this.client.connect().catch(() => undefined);
  }

  async get(key: string): Promise<string | null> {
    if (this.client.status !== "ready") {
      return null;
    }

    try {
      return await this.client.get(key);
    } catch {
      return null;
    }
  }

  async set(key: string, value: string, ttlSeconds: number): Promise<void> {
    if (this.client.status !== "ready") {
      return;
    }

    try {
      await this.client.set(key, value, "EX", ttlSeconds);
    } catch {
      // Redis는 선택적 캐시이므로 저장 실패가 요청을 실패시키지 않는다.
    }
  }

  async incrementWithExpiry(
    key: string,
    ttlSeconds: number,
  ): Promise<number | null> {
    if (this.client.status !== "ready") {
      return null;
    }

    try {
      const count = await this.client.eval(
        RedisService.incrementWithExpiryScript,
        1,
        key,
        String(ttlSeconds),
      );
      const parsedCount = Number(count);

      return Number.isSafeInteger(parsedCount) ? parsedCount : null;
    } catch {
      return null;
    }
  }

  onModuleDestroy(): void {
    this.client.disconnect();
  }
}
