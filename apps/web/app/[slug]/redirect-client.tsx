"use client";

import { useEffect } from "react";

const redirectedKey = "__goliRedirected";

export function markRedirectHistoryEntry(
  history: Pick<History, "replaceState" | "state">,
): boolean {
  const state =
    history.state && typeof history.state === "object" ? history.state : {};

  if (state[redirectedKey]) return false;

  history.replaceState({ ...state, [redirectedKey]: true }, "");
  return true;
}

export function RedirectClient({ targetUrl }: { targetUrl: string }) {
  useEffect(() => {
    if (markRedirectHistoryEntry(window.history)) {
      window.location.assign(targetUrl);
    }
  }, [targetUrl]);

  return (
    <main className="centered-page">
      <div className="brand-mark" aria-hidden="true">
        고
      </div>
      <p className="eyebrow">LINK HISTORY</p>
      <h1>고리를 따라 이동했어요.</h1>
      <p>
        이 페이지는 뒤로 돌아왔을 때 이동한 링크를 확인할 수 있도록 남아
        있어요.
      </p>
      <a className="primary-button link-button" href={targetUrl}>
        목적지로 다시 이동
      </a>
    </main>
  );
}
