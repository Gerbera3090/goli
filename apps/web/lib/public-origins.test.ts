import { describe, expect, it } from "vitest";

import { getPublicOrigins } from "./public-origins";

describe("getPublicOrigins", () => {
  it("normalizes configured origins and rejects paths", () => {
    expect(
      getPublicOrigins({
        PUBLIC_WEB_ORIGIN: "https://gori.bera.page/",
        ALTERNATE_WEB_ORIGIN: "https://goli.sparcs.org",
      }),
    ).toEqual(["https://gori.bera.page", "https://goli.sparcs.org"]);

    expect(() =>
      getPublicOrigins({ PUBLIC_WEB_ORIGIN: "https://gori.bera.page/manage" }),
    ).toThrow();
  });
});
