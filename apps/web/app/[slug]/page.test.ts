import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { notFoundMock } = vi.hoisted(() => ({
  notFoundMock: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("next/navigation", () => ({
  notFound: notFoundMock,
}));

import { RedirectClient } from "./redirect-client";
import LinkPage from "./page";

describe("LinkPage", () => {
  beforeEach(() => {
    process.env.API_INTERNAL_URL = "http://api.internal:4000";
    notFoundMock.mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.API_INTERNAL_URL;
  });

  it("resolves an encoded Korean slug and renders its history page", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          slug: "2026고리홍보",
          targetUrl: "https://sparcs.org/",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const page = await LinkPage({
      params: Promise.resolve({ slug: encodeURIComponent("2026고리홍보") }),
    });

    expect(fetchMock).toHaveBeenCalledWith(
      `http://api.internal:4000/api/links/${encodeURIComponent("2026고리홍보")}`,
      { cache: "no-store" },
    );
    expect(page.type).toBe(RedirectClient);
    expect(page.props).toEqual({ targetUrl: "https://sparcs.org/" });
  });

  it("renders not found when the API cannot resolve the slug", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 404 })),
    );

    await expect(
      LinkPage({ params: Promise.resolve({ slug: "없는고리" }) }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFoundMock).toHaveBeenCalledOnce();
  });
});
