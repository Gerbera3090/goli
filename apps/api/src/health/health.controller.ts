import {
  Controller,
  Get,
  Inject,
  ServiceUnavailableException,
} from "@nestjs/common";
import { MikroORM } from "@mikro-orm/core";

interface HealthResponse {
  status: "ok";
  checks: { mysql: "up" };
}

@Controller("health")
export class HealthController {
  constructor(@Inject(MikroORM) private readonly orm: MikroORM) {}

  @Get()
  async check(): Promise<HealthResponse> {
    try {
      await this.orm.em.getConnection().execute("select 1");
      return { status: "ok", checks: { mysql: "up" } };
    } catch {
      throw new ServiceUnavailableException({
        status: "error",
        checks: { mysql: "down" },
      });
    }
  }
}
