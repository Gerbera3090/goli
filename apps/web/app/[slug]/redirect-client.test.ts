import { describe, expect, it, vi } from "vitest";

import { markRedirectHistoryEntry } from "./redirect-client";

describe("markRedirectHistoryEntry", () => {
  it("marks a new entry and leaves a restored entry in place", () => {
    const replaceState = vi.fn();

    expect(markRedirectHistoryEntry({ state: { idx: 1 }, replaceState })).toBe(
      true,
    );
    expect(replaceState).toHaveBeenCalledWith(
      { idx: 1, __goliRedirected: true },
      "",
    );

    expect(
      markRedirectHistoryEntry({
        state: { __goliRedirected: true },
        replaceState,
      }),
    ).toBe(false);
    expect(replaceState).toHaveBeenCalledOnce();
  });
});
