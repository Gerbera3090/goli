import { LinkForm } from "@/components/link-form";
import { getPublicOrigins } from "@/lib/public-origins";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const publicOrigins = getPublicOrigins();

  return (
    <main className="page-shell home-layout">
      <section className="hero">
        <p className="eyebrow">KAIST SHORT LINK</p>
        <h1>
          긴 주소를 가볍게,
          <br />
          <span>하나의 고리로.</span>
        </h1>
        <p className="description">
          복잡한 주소를 기억하기 쉬운 짧은 링크로 바꿔보세요. 로그인 없이 바로
          만들고 공유할 수 있어요.
        </p>
        <ul className="service-points" aria-label="서비스 특징">
          <li>로그인 없이</li>
          <li>한글 링크 이름</li>
          <li>만들고 바로 복사</li>
        </ul>
      </section>

      <LinkForm publicOrigins={publicOrigins} />
    </main>
  );
}
