import { LinkForm } from "@/components/link-form";
import { getPublicOrigins } from "@/lib/public-origins";

export const dynamic = "force-dynamic";

export default function ManageLinksPage() {
  const publicOrigins = getPublicOrigins();

  return (
    <main className="page-shell narrow-page">
      <section className="page-heading">
        <p className="eyebrow">KAIST SHORT LINK</p>
        <h1>새 링크 만들기</h1>
        <p className="description">
          이동할 주소와 사용할 링크 이름을 입력해 주세요.
        </p>
      </section>

      <LinkForm publicOrigins={publicOrigins} />
    </main>
  );
}
