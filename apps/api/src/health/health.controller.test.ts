import { ServiceUnavailableException } from "@nestjs/common";
import type { MikroORM } from "@mikro-orm/core";
import { describe, expect, it, vi } from "vitest";

import { HealthController } from "./health.controller.js";

function ormWithExecute(execute: () => Promise<unknown>): MikroORM {
  return {
    em: {
      getConnection: () => ({ execute }),
    },
  } as unknown as MikroORM;
}

describe("HealthController", () => {
  it("reports ready when MySQL responds", async () => {
    const controller = new HealthController(
      ormWithExecute(vi.fn().mockResolvedValue([{ value: 1 }])),
    );

    await expect(controller.check()).resolves.toEqual({
      status: "ok",
      checks: { mysql: "up" },
    });
  });

  it("returns 503 when MySQL is unavailable", async () => {
    const controller = new HealthController(
      ormWithExecute(vi.fn().mockRejectedValue(new Error("offline"))),
    );

    await expect(controller.check()).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
  });
});
