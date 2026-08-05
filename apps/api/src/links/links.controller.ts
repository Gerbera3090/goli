import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UsePipes,
  UseGuards,
} from "@nestjs/common";
import {
  createLinkRequestSchema,
  slugSchema,
  type CreateLinkRequest,
  type LinkResponse,
  type ResolveLinkResponse,
} from "@goli/contracts/links";

import { ZodValidationPipe } from "../common/zod-validation.pipe.js";
import { CreateLinkRateLimitGuard } from "./create-link-rate-limit.guard.js";
import { LinksService } from "./links.service.js";

@Controller("links")
export class LinksController {
  constructor(
    @Inject(LinksService) private readonly linksService: LinksService,
  ) {}

  @Post()
  @UseGuards(CreateLinkRateLimitGuard)
  @UsePipes(new ZodValidationPipe(createLinkRequestSchema))
  create(@Body() input: CreateLinkRequest): Promise<LinkResponse> {
    return this.linksService.create(input);
  }

  @Get(":slug")
  resolve(@Param("slug") rawSlug: string): Promise<ResolveLinkResponse> {
    const slug = new ZodValidationPipe(slugSchema).transform(rawSlug);
    return this.linksService.resolve(slug);
  }
}
