import "reflect-metadata";

import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";

import { AppModule } from "./app.module.js";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = Number(process.env.API_PORT ?? 4000);
  const trustProxyHops = Number(process.env.TRUST_PROXY_HOPS ?? 0);

  if (trustProxyHops > 0) {
    app.set("trust proxy", trustProxyHops);
  }

  app.setGlobalPrefix("api");
  app.enableShutdownHooks();

  await app.listen(port, "0.0.0.0");
  Logger.log(
    `GOLI API is listening on http://localhost:${port}/api`,
    "Bootstrap",
  );
}

void bootstrap();
