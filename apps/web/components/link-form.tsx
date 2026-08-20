"use client";

import {
  createLinkRequestSchema,
  linkSchema,
  type LinkResponse,
} from "@goli/contracts/links";
import { type FormEvent, useState } from "react";

type SubmissionState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; link: LinkResponse; shortUrls: string[] }
  | { status: "error"; message: string };

export function LinkForm({
  publicOrigins,
}: {
  publicOrigins: [string, ...string[]];
}) {
  const [targetUrl, setTargetUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [state, setState] = useState<SubmissionState>({ status: "idle" });
  const [copied, setCopied] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCopied(null);

    const parsedRequest = createLinkRequestSchema.safeParse({
      targetUrl,
      ...(slug.trim() ? { slug } : {}),
    });

    if (!parsedRequest.success) {
      setState({
        status: "error",
        message:
          parsedRequest.error.issues[0]?.message ?? "입력값을 확인해 주세요.",
      });
      return;
    }

    setState({ status: "submitting" });

    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedRequest.data),
      });
      const body: unknown = await response.json();

      if (!response.ok) {
        const message =
          typeof body === "object" && body && "message" in body
            ? String(body.message)
            : "링크를 만들지 못했습니다.";
        throw new Error(message);
      }

      const link = linkSchema.parse(body);
      setState({
        status: "success",
        link,
        shortUrls: publicOrigins.map((origin) => `${origin}${link.shortPath}`),
      });
    } catch (error) {
      setState({
        status: "error",
        message:
          error instanceof Error ? error.message : "링크를 만들지 못했습니다.",
      });
    }
  }

  async function copyShortUrl(shortUrl: string) {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(shortUrl);
  }

  return (
    <section className="card" aria-labelledby="create-link-title">
      <div className="card-heading">
        <div>
          <p className="step">NEW LINK</p>
          <h2 id="create-link-title">새 고리 만들기</h2>
        </div>
        <span className="anonymous-badge">로그인 없이 사용</span>
      </div>

      <form onSubmit={handleSubmit}>
        <label htmlFor="target-url">이동할 주소</label>
        <input
          id="target-url"
          name="targetUrl"
          type="url"
          inputMode="url"
          placeholder="https://example.com/아주-긴-주소"
          value={targetUrl}
          onChange={(event) => setTargetUrl(event.target.value)}
          required
          autoComplete="url"
        />

        <label htmlFor="slug">
          링크 이름 <span>선택</span>
        </label>
        <div className="slug-input">
          <span>{new URL(publicOrigins[0]).host}/</span>
          <input
            id="slug"
            name="slug"
            type="text"
            placeholder="2026고리홍보"
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            minLength={2}
            maxLength={64}
          />
        </div>
        <p className="hint">
          비워두면 읽기 쉬운 7자리 이름을 자동으로 만들어요.
        </p>

        <button
          className="primary-button"
          type="submit"
          disabled={state.status === "submitting"}
        >
          {state.status === "submitting" ? "고리를 잇는 중…" : "고리 만들기"}
        </button>
      </form>

      {state.status === "error" && (
        <p className="message error" role="alert">
          {state.message}
        </p>
      )}

      {state.status === "success" && (
        <div className="result" aria-live="polite">
          <p>고리가 연결됐어요</p>
          {state.shortUrls.map((shortUrl) => (
            <div className="result-link" key={shortUrl}>
              <a href={shortUrl} target="_blank" rel="noreferrer">
                {shortUrl}
              </a>
              <button type="button" onClick={() => copyShortUrl(shortUrl)}>
                {copied === shortUrl ? "복사했어요" : "주소 복사"}
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
