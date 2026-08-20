import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { BrandMark } from "@/components/brand-mark";
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
  const publicOrigins = getPublicOrigins();

  return (
    <html lang="ko">
      <body>
        <div className="identity-bar" />
        <header className="site-header">
          <div className="site-header-inner">
            <Link className="wordmark" href="/" aria-label="고리 홈">
              <BrandMark />
              <strong>고리</strong>
              <span>GOLI</span>
            </Link>
            <nav className="site-nav" aria-label="주요 메뉴">
              <Link href="/manage/links">링크 만들기</Link>
              <a href="https://sparcs.org" target="_blank" rel="noreferrer">
                SPARCS ↗
              </a>
            </nav>
          </div>
        </header>

        {children}

        <footer className="site-footer">
          <span>
            {publicOrigins.map((origin) => new URL(origin).host).join(" · ")}
          </span>
          <span>made by SPARCS</span>
        </footer>
      </body>
    </html>
  );
}
