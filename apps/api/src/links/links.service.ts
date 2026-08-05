import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UniqueConstraintViolationException } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import type { EntityRepository } from "@mikro-orm/mysql";
import type {
  CreateLinkRequest,
  LinkResponse,
  ResolveLinkResponse,
} from "@goli/contracts/links";

import { RedisService } from "../redis/redis.service.js";
import { Link } from "./link.entity.js";
import { generateSlug } from "./slug.js";

const ANONYMOUS_USER_ID = 0 as const;
const RANDOM_SLUG_ATTEMPTS = 5;

@Injectable()
export class LinksService {
  private readonly cacheTtlSeconds: number;

  constructor(
    @InjectRepository(Link)
    private readonly linkRepository: EntityRepository<Link>,
    @Inject(RedisService) private readonly redis: RedisService,
    @Inject(ConfigService) config: ConfigService,
  ) {
    this.cacheTtlSeconds = Number(
      config.get<string>("REDIS_LINK_TTL_SECONDS") ?? 3600,
    );
  }

  async create(input: CreateLinkRequest): Promise<LinkResponse> {
    if (input.slug) {
      return this.persistLink(input.slug, input.targetUrl, true);
    }

    for (let attempt = 0; attempt < RANDOM_SLUG_ATTEMPTS; attempt += 1) {
      try {
        return await this.persistLink(generateSlug(), input.targetUrl, false);
      } catch (error) {
        if (!(error instanceof UniqueConstraintViolationException)) {
          throw error;
        }
      }
    }

    throw new ConflictException(
      "slug를 생성하지 못했습니다. 다시 시도해 주세요.",
    );
  }

  async resolve(slug: string): Promise<ResolveLinkResponse> {
    const cacheKey = this.cacheKey(slug);
    const cachedTarget = await this.redis.get(cacheKey);

    if (cachedTarget) {
      return { slug, targetUrl: cachedTarget };
    }

    const link = await this.linkRepository.findOne({ slug });

    if (!link) {
      throw new NotFoundException("존재하지 않는 고리입니다.");
    }

    await this.redis.set(cacheKey, link.targetUrl, this.cacheTtlSeconds);

    return { slug: link.slug, targetUrl: link.targetUrl };
  }

  private async persistLink(
    slug: string,
    targetUrl: string,
    isCustomSlug: boolean,
  ): Promise<LinkResponse> {
    const now = new Date();
    let id: number;

    try {
      id = Number(
        await this.linkRepository.insert({
          slug,
          targetUrl,
          ownerUserId: ANONYMOUS_USER_ID,
          createdAt: now,
          updatedAt: now,
        }),
      );
    } catch (error) {
      if (error instanceof UniqueConstraintViolationException && isCustomSlug) {
        throw new ConflictException("이미 사용 중인 slug입니다.");
      }

      throw error;
    }

    await this.redis.set(this.cacheKey(slug), targetUrl, this.cacheTtlSeconds);

    return {
      id,
      slug,
      targetUrl,
      ownerUserId: ANONYMOUS_USER_ID,
      shortPath: `/go/${slug}`,
      createdAt: now.toISOString(),
    };
  }

  private cacheKey(slug: string): string {
    return `link:slug:${slug}`;
  }
}
