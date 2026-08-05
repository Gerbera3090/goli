import { LinkForm } from "@/components/link-form";

export default function HomePage() {
  return (
    <main className="shell">
      <section className="hero">
        <div className="brand-mark" aria-hidden="true">
          고
        </div>
        <p className="eyebrow">SPARCS · KAIST SHORT LINK</p>
        <h1>
          길고 복잡한 주소를
          <br />
          하나의 고리로.
        </h1>
        <p className="description">
          지금은 로그인 없이 누구나 링크를 만들 수 있어요. 생성자는 익명 사용자
          0번으로 기록됩니다.
        </p>
      </section>

      <LinkForm />

      <footer>
        <span>goli.sparcs.org</span>
        <span>made by SPARCS</span>
      </footer>
    </main>
  );
}
