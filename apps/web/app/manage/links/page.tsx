import { LinkForm } from "@/components/link-form";
import { getPublicOrigins } from "@/lib/public-origins";

export const dynamic = "force-dynamic";

export default function ManageLinksPage() {
  const publicOrigins = getPublicOrigins();

  return (
    <main className="shell">
      <section className="hero">
        <div className="brand-mark" aria-hidden="true">
          고
        </div>
        <p className="eyebrow">SPARCS · KAIST SHORT LINK</p>
        <h1>링크 관리</h1>
        <p className="description">
          지금은 로그인 없이 링크를 만들 수 있으며, 생성자는 임시 사용자 0번으로
          기록됩니다.
        </p>
      </section>

      <LinkForm publicOrigins={publicOrigins} />

      <footer>
        <span>
          {publicOrigins.map((origin) => new URL(origin).host).join(" · ")}
        </span>
        <span>made by SPARCS</span>
      </footer>
    </main>
  );
}
