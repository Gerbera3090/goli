import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MikroOrmModule } from "@mikro-orm/nestjs";

import { createDatabaseConfig } from "./database/database.config.js";
import { validateEnvironment } from "./config/environment.js";
import { HealthController } from "./health/health.controller.js";
import { LinksModule } from "./links/links.module.js";
import { RedisModule } from "./redis/redis.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ["../../.env", ".env"],
      isGlobal: true,
      validate: validateEnvironment,
    }),
    MikroOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => createDatabaseConfig(config),
    }),
    RedisModule,
    LinksModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
