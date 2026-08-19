# 고리 (GOLI)

KAIST 구성원을 위한 짧은 링크 서비스입니다.

현재 MVP는 로그인 없이 링크를 생성하며, 모든 링크의 `createdByUserId`는 익명 사용자 `0`으로 저장합니다. 익명 생성 API에는 IP 단위 요청 제한을 적용하고, 로컬 네트워크와 인증정보가 포함된 URL은 받지 않습니다.

## 구조

```text
apps/web          Next.js 웹과 /[slug] 리다이렉트
apps/api          NestJS 링크 API
packages/contracts  Zod 기반 요청/응답 계약
packages/config     ESLint와 TypeScript 공통 설정
infra/compose.yaml  MySQL과 Redis 개발 인프라
```

MySQL이 링크의 원본 저장소이고 Redis는 slug 조회 결과를 캐시합니다. Redis가 잠시 중단되어도 API는 MySQL에서 링크를 조회합니다.

링크 생성 제한도 Redis를 우선 사용합니다. Redis 장애 시에는 API 인스턴스 내부 카운터로 전환해 무제한 생성으로 열리지 않도록 구성했습니다.

`PUBLIC_WEB_ORIGIN`은 새로 생성한 링크에 사용하는 기본 공개 주소이고, `ALTERNATE_WEB_ORIGIN`은 같은 slug를 제공하는 선택적 보조 주소입니다. 현재 임시 기본 주소는 `https://gori.bera.page`이며, 두 값 모두 경로 없는 HTTP(S) origin이어야 합니다.

## 로컬 실행

Node.js 22.22.1과 pnpm 10이 필요합니다.

```bash
cp .env.example .env
pnpm install
pnpm infra:up
pnpm --filter @goli/api db:migrate
pnpm dev
```

- 웹: http://localhost:3000
- API 상태: http://localhost:4000/api/health
- 링크 관리: `http://localhost:3000/manage/links`
- 링크 생성: `POST http://localhost:4000/api/links`
- 링크 이동: `http://localhost:3000/<slug>`

MySQL과 Redis의 개발 포트는 호스트의 `127.0.0.1`에만 공개됩니다. 리버스 프록시 뒤에서 API를 실행한다면 실제 프록시 홉 수에 맞춰 `TRUST_PROXY_HOPS`를 설정해야 정확한 클라이언트 IP로 생성 제한을 적용할 수 있습니다.

## API 예시

slug를 생략하면 읽기 쉬운 7자리 slug를 자동 생성합니다.

```bash
curl -X POST http://localhost:4000/api/links \
  -H 'Content-Type: application/json' \
  -d '{"targetUrl":"https://sparcs.org","slug":"2026고리홍보"}'
```

## 검증

```bash
pnpm lint
pnpm check-types
pnpm test
pnpm build
```

검증에는 링크 생성·캐시 fallback·요청 제한·DB readiness·한글 slug 리다이렉트 테스트가 포함됩니다.

## 브랜치 전략

- 작업 브랜치: `TU-123-short-description` 형식으로 `dev`에서 분기
- 작업 브랜치 → `dev`: Pull Request와 squash merge
- `dev` → `main`: Pull Request와 merge commit
- rebase merge: 사용하지 않음

GitHub ruleset이 `dev`에는 squash, `main`에는 merge commit만 허용하도록 설정됩니다. 자세한 작업 순서는 [CONTRIBUTING.md](./CONTRIBUTING.md)를 참고해 주세요.
