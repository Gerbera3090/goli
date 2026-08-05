import { describe, expect, it } from "vitest";

import { generateSlug } from "./slug.js";

describe("generateSlug", () => {
  it("creates a seven-character URL-safe slug", () => {
    expect(generateSlug()).toMatch(/^[23456789abcdefghjkmnpqrstuvwxyz]{7}$/);
  });
});
