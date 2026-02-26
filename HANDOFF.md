# HANDOFF — OOTR 프로젝트

> 작성 시점: 2026-02-26
> 마지막 커밋: `c322a5f` docs: add image resources
> 배포 URL: `https://ootr.kkick.xyz`

---

## 프로젝트 개요

**OOTR (Outfit On The Run)** — GPS 기반 날씨 정보로 러닝 복장을 추천하는 Next.js 웹 앱.
YAML 도메인 명세 + Gherkin 시나리오 + TDD 프로세스를 따른다.

## 기술 스택

| 항목 | 버전 |
|---|---|
| React | 19.2.3 |
| Next.js | 16.1.6 |
| React Query | 5.90.21 |
| Axios | 1.13.5 |
| Tailwind CSS | 4.x |
| TypeScript | 5.x |
| Vitest | 4.0.18 |
| Testing Library | 16.3.2 |

## 아키텍처

FSD (Feature-Sliced Design) 구조:

```
src/
├── app/              # Next.js 앱 라우터, API Route
├── entities/         # weather, recommendation 도메인 엔티티
├── features/         # get-weather, color-mode 기능 모듈
├── widgets/          # weather-header, outfit-recommendation, recommendation-footer
├── views/            # home 페이지 뷰
└── shared/           # ui(아이콘, 로딩, 에러), lib(QueryProvider)
```

## 이번 세션 작업 내용

### 1. Open Graph / Twitter Card 메타태그 설정 (커밋 완료)

- **커밋**: `2df4d4b` — `feat: Open Graph 및 Twitter Card 메타태그 설정`
- **파일**: `src/app/layout.tsx`
- `metadataBase` 설정 → 상대 경로 자동 절대 URL 변환
- `openGraph` 메타 (title, description, url, siteName, images, locale, type)
- `twitter` 카드 메타 (`summary_large_image`)
- OG 이미지 경로: `/icons/og-image.png`

### 2. spec-review 결과 반영 (미커밋)

| 파일 | 변경 | 심각도 |
|---|---|---|
| `specs/domains/recommendation.yaml` | 관계 type `produces` → `creates` | Critical |
| `specs/overview.yaml` | core_entities: `TemperatureZone` → `WardrobeItem`, `RecommendationEngine` | Critical |
| `specs/overview.yaml` | domain_connections: `TemperatureZone→OutfitSet(has)` → `RecommendationEngine→WardrobeItem(references)` | Critical |
| `specs/scenarios/recommendation.feature` | 시나리오 3건 추가 (장갑, 기모 하프 집업 레이어링, 추천 이유) | 높음/중간 |

### 3. yaml-to-mermaid 변환 스크립트 버그 수정 (미커밋)

- **파일**: `.claude/skills/yaml-to-mermaid/scripts/convert.py`
- **원인**: YAML prop_type을 sanitize 없이 Mermaid에 그대로 출력 → 따옴표·파이프·대괄호 파싱 에러
- **수정**: `_sanitize_type()` 함수 추가
  - union/리터럴 (`|`, `'`, `"`) → `enum`
  - 배열 (`Type[]`) → `Type-array`
  - 공백 → 하이픈 치환
- `recommendation.mmd` 스크립트로 재생성 완료

## 미커밋 변경 파일

```
.claude/skills/yaml-to-mermaid/scripts/convert.py  (스크립트 버그 수정)
specs/domains/recommendation.yaml                   (produces → creates)
specs/domains/recommendation.mmd                    (스크립트 재생성)
specs/overview.yaml                                 (도메인 구조 동기화)
specs/scenarios/recommendation.feature              (시나리오 3건 추가)
```

## 현재 상태

### 완료된 기능
- **날씨 조회**: GPS → API Route → WeatherAPI → react-query 캐싱 → UI
- **복장 추천 엔진**: 프리셋 기반 다중 후보 랜덤 선택 시스템
- **다크모드**: light/dark 토글, localStorage, FOUC 방지
- **PWA**: 오프라인 폴백, A2HS 지원
- **OG 메타**: 소셜 공유 미리보기

### 테스트 현황
- `mapWeatherData.test.ts` — 9개
- `useWeather.test.tsx` — 4개
- `page.test.tsx` — 4개
- `OutfitItem.test.tsx` — 4개

## 다음 단계

1. **미커밋 변경사항 커밋** — 위 5개 파일
2. **리모트 푸시** — 로컬이 origin/main보다 앞서 있음
3. **OG 태그 배포 후 검증** — 카카오 디버거, 트위터 카드 검증기, Facebook 디버거
4. **spec-review 낮음 우선순위 시나리오** (선택):
   - `-4 ≤ feelsLike < 10` 구간 "긴바지" 명시적 시나리오
   - OutfitSet UI 쉼표 구분 표시
   - 서버 사이드 API 호출 검증
5. **validator 허용 타입 목록 확장** — `string[]`, `OutfitSet` 등 커스텀 타입 Warning 8건

## 주요 파일 참조

| 구분 | 경로 |
|---|---|
| 도메인 명세 | `specs/domains/weather.yaml`, `recommendation.yaml`, `app.yaml` |
| 시나리오 | `specs/scenarios/weather.feature`, `recommendation.feature`, `app.feature` |
| 날씨 훅 | `src/features/get-weather/model/useWeather.ts` |
| API 매핑 | `src/entities/weather/api/mapWeatherData.ts` |
| 추천 타입 | `src/entities/recommendation/model/types.ts` |
| API Route | `src/app/api/weather/route.ts` |
| 홈 뷰 | `src/views/home/ui/HomePage.tsx` |
| 레이아웃 (OG 메타) | `src/app/layout.tsx` |
| Mermaid 변환 | `.claude/skills/yaml-to-mermaid/scripts/convert.py` |

## 특이사항

- **환경 변수**: `WEATHER_API_KEY`가 `.env.local`에 필요 (WeatherAPI.com)
- **OG 이미지 위치**: `public/icons/og-image.png` — 플랜 원안(`/og-image.png`)과 다름, 메타 경로를 `/icons/og-image.png`로 맞춤
- **프로젝트 원칙**: YAML 명세 → Gherkin 시나리오 → TDD 순서. `CLAUDE.md` 참조
