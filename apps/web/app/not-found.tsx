import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="centered-page">
      <div className="brand-mark" aria-hidden="true">
        고
      </div>
      <p className="eyebrow">404 · BROKEN LINK</p>
      <h1>끊어진 고리예요.</h1>
      <p>주소가 정확한지 확인하거나 새로운 고리를 만들어 주세요.</p>
      <Link className="primary-button link-button" href="/">
        홈으로 돌아가기
      </Link>
    </main>
  );
}
