import { describe, expect, it } from "vitest";

import { createLinkRequestSchema, slugSchema } from "./links.js";

describe("slugSchema", () => {
  it("accepts and normalizes a Korean campaign slug", () => {
    expect(slugSchema.parse(" 2026고리홍보 ")).toBe("2026고리홍보");
  });

  it("normalizes latin letters to lowercase", () => {
    expect(slugSchema.parse("GoLi_2026")).toBe("goli_2026");
  });

  it("rejects path separators", () => {
    expect(() => slugSchema.parse("events/goli")).toThrow();
  });
});

describe("createLinkRequestSchema", () => {
  it("accepts only http and https targets", () => {
    expect(
      createLinkRequestSchema.parse({ targetUrl: "https://sparcs.org" }),
    ).toEqual({ targetUrl: "https://sparcs.org/" });

    expect(() =>
      createLinkRequestSchema.parse({ targetUrl: "javascript:alert(1)" }),
    ).toThrow();
  });

  it("rejects credential-bearing and private network targets", () => {
    expect(() =>
      createLinkRequestSchema.parse({
        targetUrl: "https://user:password@example.com/private",
      }),
    ).toThrow();
    expect(() =>
      createLinkRequestSchema.parse({ targetUrl: "http://127.0.0.1/admin" }),
    ).toThrow();
    expect(() =>
      createLinkRequestSchema.parse({ targetUrl: "http://192.168.0.1" }),
    ).toThrow();
    expect(() =>
      createLinkRequestSchema.parse({ targetUrl: "http://[::1]" }),
    ).toThrow();
    expect(() =>
      createLinkRequestSchema.parse({
        targetUrl: "http://[::ffff:127.0.0.1]",
      }),
    ).toThrow();
  });

  it("reserves top-level service routes", () => {
    expect(() =>
      createLinkRequestSchema.parse({
        targetUrl: "https://sparcs.org",
        slug: "manage",
      }),
    ).toThrow();

    expect(slugSchema.parse("manage")).toBe("manage");
  });
});
