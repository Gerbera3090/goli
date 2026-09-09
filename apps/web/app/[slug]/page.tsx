import { resolveLinkResponseSchema } from "@gori/contracts/links";
import { notFound } from "next/navigation";

import { BrandMark } from "../../components/brand-mark";

export const dynamic = "force-dynamic";

interface LinkPageProps {
  params: Promise<{ slug: string }>;
}

export default async function LinkPage({ params }: LinkPageProps) {
  const { slug: encodedSlug } = await params;
  let slug: string;

  try {
    slug = decodeURIComponent(encodedSlug);
  } catch {
    notFound();
  }

  const apiOrigin = process.env.API_INTERNAL_URL ?? "http://127.0.0.1:4000";
  const response = await fetch(
    `${apiOrigin}/api/links/${encodeURIComponent(slug)}`,
    { cache: "no-store" },
  );

  if (response.status === 404 || response.status === 400) {
    notFound();
  }

  if (!response.ok) {
    throw new Error("고리 서버에 연결하지 못했습니다.");
  }

  const result = resolveLinkResponseSchema.safeParse(await response.json());

  if (!result.success) {
    throw new Error("고리 서버가 잘못된 응답을 반환했습니다.");
  }

  return (
    <main className="centered-page">
      <BrandMark />
      <p className="eyebrow">LINK DESTINATION</p>
      <h1>이 고리를 따라갈까요?</h1>
      <p>{result.data.targetUrl}</p>
      <a className="primary-button link-button" href={result.data.targetUrl}>
        목적지로 이동
      </a>
    </main>
  );
}
