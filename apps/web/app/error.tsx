"use client";

import { BrandMark } from "@/components/brand-mark";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="centered-page">
      <BrandMark />
      <p className="eyebrow">TEMPORARY ERROR</p>
      <h1>잠시 고리가 엉켰어요.</h1>
      <p>잠시 후 다시 시도해 주세요.</p>
      <button
        className="primary-button link-button"
        type="button"
        onClick={reset}
      >
        다시 시도하기
      </button>
    </main>
  );
}
