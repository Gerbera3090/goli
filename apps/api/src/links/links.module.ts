import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";

import { Link } from "./link.entity.js";
import {
  CreateLinkRateLimitGuard,
  CreateLinkRateLimiter,
} from "./create-link-rate-limit.guard.js";
import { LinksController } from "./links.controller.js";
import { LinksService } from "./links.service.js";

@Module({
  imports: [MikroOrmModule.forFeature([Link])],
  controllers: [LinksController],
  providers: [LinksService, CreateLinkRateLimiter, CreateLinkRateLimitGuard],
})
export class LinksModule {}
