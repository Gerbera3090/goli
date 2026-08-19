import type { Metadata } from "next";
import type { ReactNode } from "react";

import { getPublicOrigins } from "@/lib/public-origins";

import "./globals.css";

export function generateMetadata(): Metadata {
  const [publicOrigin] = getPublicOrigins();

  return {
    metadataBase: new URL(publicOrigin),
    title: "고리 | KAIST Short Link",
    description: "KAIST 구성원을 위한 짧은 링크 서비스",
  };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
