import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";

export default function NotFoundPage() {
  return (
    <main className="centered-page">
      <BrandMark />
      <p className="eyebrow">404 · BROKEN LINK</p>
      <h1>끊어진 고리예요.</h1>
      <p>주소가 정확한지 확인하거나 새로운 고리를 만들어 주세요.</p>
      <Link className="primary-button link-button" href="/">
        홈으로 돌아가기
      </Link>
    </main>
  );
}
