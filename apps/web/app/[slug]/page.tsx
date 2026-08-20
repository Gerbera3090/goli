import { resolveLinkResponseSchema } from "@goli/contracts/links";
import { notFound } from "next/navigation";

import { RedirectClient } from "./redirect-client";

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

  return <RedirectClient targetUrl={result.data.targetUrl} />;
}
