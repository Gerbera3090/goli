# GORI 기여 가이드

## 브랜치와 Pull Request

1. 최신 `dev`에서 `TU-<번호>-<설명>` 형식의 브랜치를 만듭니다.
2. 작업 브랜치에서 변경하고 Pull Request의 base를 `dev`로 지정합니다.
3. 검증과 리뷰가 끝나면 squash merge합니다.
4. 배포할 변경은 `dev`에서 `main`으로 Pull Request를 만들고 merge commit으로 병합합니다.

예시 브랜치 이름:

```text
TU-123-add-link-expiration
TU-456-fix-korean-slug
```

`main`으로 향하는 Pull Request는 `dev`에서만 만들고, `dev`로 향하는 Pull Request는 TU 번호가 있는 작업 브랜치에서만 만듭니다. CI가 이 규칙을 확인합니다.

## 로컬 검증

Pull Request를 만들기 전에 아래 검증을 모두 통과시켜 주세요.

```bash
pnpm format:check
pnpm lint
pnpm check-types
pnpm test
pnpm build
```

DB 스키마를 변경했다면 마이그레이션을 적용한 뒤 Entity와 실제 스키마가 일치하는지도 확인해야 합니다.

```bash
pnpm --filter @gori/api db:migrate
pnpm --filter @gori/api exec mikro-orm schema:update --dump
```

마지막 명령은 `Schema is up-to-date`를 출력해야 합니다.
