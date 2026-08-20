# Goli Design System

고리는 KAIST 구성원이 긴 주소를 빠르고 명확하게 공유하도록 돕는 짧은 링크
서비스입니다. 이 문서는 현재 제품에서 실제로 사용하는 최소 디자인 규칙을
정의합니다.

## 원칙

1. **빠름**: 링크 생성까지 불필요한 단계가 없어야 합니다.
2. **명확함**: 원본 주소, 링크 이름, 생성 결과를 확실히 구분합니다.
3. **신뢰감**: 장식보다 입력값, 오류, 결과 상태를 우선합니다.
4. **친근함**: 내부 용어 대신 짧고 자연스러운 한국어를 사용합니다.

## 색상

### 브랜드

| Token        | Value     | Usage                  |
| ------------ | --------- | ---------------------- |
| `yellow-50`  | `#FEFCE8` | 옅은 브랜드 배경       |
| `yellow-100` | `#FEF9C3` | 선택, 배지 배경        |
| `yellow-200` | `#FEF08A` | 강조 배경              |
| `yellow-300` | `#FDE047` | 로고, 장식             |
| `yellow-400` | `#FACC15` | 주 브랜드색, 기본 버튼 |
| `yellow-500` | `#EAB308` | Hover                  |
| `yellow-600` | `#CA8A04` | Pressed                |
| `yellow-700` | `#A16207` | Focus ring             |
| `yellow-800` | `#854D0E` | 링크, 진한 브랜드 글자 |
| `yellow-900` | `#713F12` | 고대비 브랜드 글자     |

노란 배경 위에는 흰색 대신 `#292524`를 사용합니다. `#FACC15`와
`#292524`의 명도 대비는 9.91:1입니다.

### 중립색

| Role           | Value     |
| -------------- | --------- |
| Page           | `#FFFEF7` |
| Surface        | `#FFFFFF` |
| Subtle surface | `#FAFAF9` |
| Border         | `#E7E5E4` |
| Strong border  | `#D6D3D1` |
| Primary text   | `#292524` |
| Secondary text | `#57534E` |
| Muted text     | `#78716C` |
| Disabled text  | `#A8A29E` |

### 상태색

| State   | Background | Border    | Foreground |
| ------- | ---------- | --------- | ---------- |
| Success | `#F0FDF4`  | `#BBF7D0` | `#15803D`  |
| Warning | `#FFF7ED`  | `#FED7AA` | `#C2410C`  |
| Error   | `#FEF2F2`  | `#FECACA` | `#DC2626`  |
| Info    | `#EFF6FF`  | `#BFDBFE` | `#2563EB`  |

브랜드색이 노랑이므로 Warning은 오렌지로 구분합니다. 상태는 색만으로 전달하지
않고 문구나 아이콘을 함께 사용합니다.

## 타이포그래피

Pretendard와 시스템 한글 글꼴을 사용합니다. 굵기는 400, 600, 700만 사용합니다.

| Role            | Size / Line height | Weight |
| --------------- | ------------------ | ------ |
| Display         | 48 / 56            | 700    |
| Page title      | 32 / 40            | 700    |
| Section title   | 24 / 32            | 600    |
| Component title | 20 / 28            | 600    |
| Body            | 16 / 24            | 400    |
| Body small      | 14 / 20            | 400    |
| Label           | 14 / 20            | 600    |
| Caption         | 12 / 16            | 400    |

## 간격과 크기

- 기본 단위: 4px
- 간격: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80px
- 기본 입력창과 버튼 높이: 48px
- 작은 버튼 높이: 40px
- 최소 터치 영역: 44×44px
- 버튼·입력창 radius: 8px
- 카드·알림 radius: 12px
- 모달 radius: 16px
- Pill radius는 배지에만 사용합니다.

## 레이아웃

- 콘텐츠 최대 폭: 1120px
- 폼과 읽기 콘텐츠 최대 폭: 640px
- 모바일 좌우 여백: 20px
- 데스크톱 좌우 여백: 40px
- Breakpoints: 720px, 960px, 1440px
- 데스크톱 섹션 간격: 64px
- 모바일 섹션 간격: 40px

## 테두리와 그림자

계층은 테두리를 우선하여 표현합니다.

- 기본 카드: 1px `border`, 그림자 없음
- 떠 있는 카드: `0 12px 32px rgb(41 37 36 / 8%)`
- 드롭다운·모달: `0 20px 48px rgb(41 37 36 / 14%)`

## 컴포넌트

초기 범위는 다음으로 제한합니다.

- Button: Primary, Secondary, Outline, Ghost, Danger
- TextField, URLField, LinkNameField
- Card, Badge, Alert, Toast
- Header, Footer, PageContainer
- EmptyState, LoadingIndicator

모든 인터랙션에는 Default, Hover, Focus, Pressed, Disabled, Loading 상태가
필요합니다. 폼은 Error와 Success 상태를 추가합니다.

## 문구

- 서비스 이름: 고리
- 결과물: 짧은 링크
- 사용자 지정 경로: 링크 이름
- 원본 URL: 이동할 주소
- 주요 액션: 고리 만들기, 주소 복사
- 완료 문구: 고리가 연결됐어요

Slug, Target URL, USER 0 같은 내부 용어는 사용자 화면에 노출하지 않습니다.

## 접근성

- 일반 텍스트는 WCAG AA 명도 대비 4.5:1 이상을 유지합니다.
- 키보드 Focus ring을 항상 표시합니다.
- 입력창은 시각적 문구와 연결된 `label`을 사용합니다.
- 아이콘 단독 버튼은 접근 가능한 이름을 제공합니다.
- 애니메이션은 `prefers-reduced-motion`을 존중합니다.
- 오류와 상태를 색만으로 전달하지 않습니다.

## 보류

다크 모드, 외부 디자인 시스템 패키지, Storybook, 데이터 시각화 팔레트는 실제
사용처가 생길 때 추가합니다.
