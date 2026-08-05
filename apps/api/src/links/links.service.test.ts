import { NotFoundException } from "@nestjs/common";
import type { ConfigService } from "@nestjs/config";
import type { EntityRepository } from "@mikro-orm/mysql";
import { describe, expect, it, vi } from "vitest";

import type { RedisService } from "../redis/redis.service.js";
import type { Link } from "./link.entity.js";
import { LinksService } from "./links.service.js";

function createService(options?: {
  cachedTarget?: string | null;
  foundLink?: Partial<Link> | null;
}) {
  const repository = {
    insert: vi.fn().mockResolvedValue(42),
    findOne: vi.fn().mockResolvedValue(options?.foundLink ?? null),
  } as unknown as EntityRepository<Link>;
  const redis = {
    get: vi.fn().mockResolvedValue(options?.cachedTarget ?? null),
    set: vi.fn().mockResolvedValue(undefined),
  } as unknown as RedisService;
  const config = {
    get: vi.fn().mockReturnValue(3600),
  } as unknown as ConfigService;

  return {
    service: new LinksService(repository, redis, config),
    repository,
    redis,
  };
}

describe("LinksService", () => {
  it("creates every anonymous link for user 0 and warms the cache", async () => {
    const { service, repository, redis } = createService();

    const result = await service.create({
      slug: "고리테스트",
      targetUrl: "https://sparcs.org/",
    });

    expect(repository.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        slug: "고리테스트",
        targetUrl: "https://sparcs.org/",
        ownerUserId: 0,
      }),
    );
    expect(redis.set).toHaveBeenCalledWith(
      "link:slug:고리테스트",
      "https://sparcs.org/",
      3600,
    );
    expect(result).toMatchObject({
      id: 42,
      ownerUserId: 0,
      shortPath: "/go/고리테스트",
    });
  });

  it("falls back to MySQL on a cache miss and refills Redis", async () => {
    const { service, repository, redis } = createService({
      foundLink: { slug: "스팍스", targetUrl: "https://sparcs.org/" },
    });

    await expect(service.resolve("스팍스")).resolves.toEqual({
      slug: "스팍스",
      targetUrl: "https://sparcs.org/",
    });
    expect(repository.findOne).toHaveBeenCalledWith({ slug: "스팍스" });
    expect(redis.set).toHaveBeenCalled();
  });

  it("returns not found when neither cache nor MySQL has the slug", async () => {
    const { service } = createService();

    await expect(service.resolve("없는고리")).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
