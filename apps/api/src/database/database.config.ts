import type { ConfigService } from "@nestjs/config";
import { Migrator } from "@mikro-orm/migrations";
import { defineConfig } from "@mikro-orm/mysql";

import { Link } from "../links/link.entity.js";

type ConfigurationSource = Pick<ConfigService, "get">;

function read(
  config: ConfigurationSource | undefined,
  key: string,
  fallback: string,
): string {
  return config?.get<string>(key) ?? process.env[key] ?? fallback;
}

export function createDatabaseConfig(config?: ConfigurationSource) {
  return defineConfig({
    entities: [Link],
    host: read(config, "DB_HOST", "127.0.0.1"),
    port: Number(read(config, "DB_PORT", "3306")),
    user: read(config, "DB_USER", "goli"),
    password: read(config, "DB_PASSWORD", "goli"),
    dbName: read(config, "DB_NAME", "goli"),
    extensions: [Migrator],
    migrations: {
      path: "dist/src/migrations",
      pathTs: "src/migrations",
      glob: "*.{js,ts}",
      emit: "ts",
    },
  });
}
