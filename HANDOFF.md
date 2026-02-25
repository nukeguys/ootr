# HANDOFF — OOTR 프로젝트

> 작성 시점: 2026-02-25
> 마지막 커밋: `86564d8` feat: WeatherAPI 연동 — axios/react-query 도입 및 풍속 m/s 변환

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

## 전체 작업 이력

### 커밋 1: `b207e5d` 초기 스펙 문서 및 Claude 설정 추가
- YAML 도메인 명세 3개 작성 (weather, recommendation, app)
- Gherkin 시나리오 3개 작성 (weather, recommendation, app)
- overview.yaml로 도메인 간 관계 정의

### 커밋 2: `6dd2107` Next.js 프로젝트 초기 설정
- Next.js 16 + React 19 + TypeScript + Tailwind CSS 4
- Vitest + React Testing Library 테스트 환경
- ESLint 설정

### 커밋 3: `579de89` FSD 기반 UI 구현 및 다크모드 추가
- FSD 레이어 구조 구축
- 날씨 헤더, 복장 추천, 추천 이유 위젯 구현
- 다크모드 토글 (localStorage 기반, FOUC 방지)
- mock 데이터 기반 정적 UI

### 커밋 4: `86564d8` WeatherAPI 연동 — axios/react-query 도입 및 풍속 m/s 변환
- `fetch` → `axios` 교체 (API Route + 클라이언트)
- `useState/useEffect` → `useQuery` 전환
- 풍속 단위 km/h → m/s 변환 (`wind_kph / 3.6`)
- `QueryProvider` 생성 및 layout 적용
- `useGeolocation` 훅으로 GPS 좌표 획득
- `mapWeatherData`로 WeatherAPI 응답 → 내부 타입 변환
- Next.js API Route (`/api/weather`)로 API 키 보호
- `RecommendationLogic` → `RecommendationComment` 이름 변경
- `WeatherSection` 분리로 실시간 날씨 조회 연동
- 테스트 21개 전체 통과, lint 통과

## 현재 상태

### 완료된 기능
- **날씨 조회**: GPS → API Route → WeatherAPI → react-query 캐싱 → UI 표시
- **다크모드**: light/dark 토글, localStorage 저장, FOUC 방지
- **UI 구조**: 날씨 헤더, 복장 추천 카드, 추천 이유/시간 푸터
- **새로고침**: LogoBar의 Refresh 버튼 → useWeather.refetch 연결

### 테스트 현황
- `mapWeatherData.test.ts` — 9개 통과 (매핑 정합성)
- `useWeather.test.tsx` — 4개 통과 (위치 요청, 권한 거부, API 에러, refetch)
- `page.test.tsx` — 4개 통과 (로고, 날씨, 복장, 추천 이유 렌더링)
- `OutfitItem.test.tsx` — 4개 통과

## 남은 작업

### 핵심 기능 (recommendation 도메인)
1. **복장 추천 엔진 구현** — 체감온도 기반 TemperatureZone 매핑 → OutfitSet 결정
   - `specs/domains/recommendation.yaml`의 `TemperatureZoneConfig`가 `status: TBD`
   - 7개 온도 구간별 구체적 복장 매핑이 필요
2. **보정 로직** — 바람, 강수, 습도, 자외선, 낮/밤에 따른 복장 보정
3. **극한날씨 경고** — -10℃ 미만 또는 30℃ 이상 시 경고 UI

### 앱 기능 (app 도메인)
4. **오프라인 캐싱** — 구현 방식 미결정 (LocalStorage vs Service Worker)
5. **PWA 설정** — manifest.json, service worker 등록

### 시나리오 검증
- `specs/scenarios/recommendation.feature` — 8개 시나리오 미구현
- `specs/scenarios/app.feature` — 오프라인/PWA 관련 5개 시나리오 미구현
- `specs/scenarios/weather.feature` — 대부분 구현 완료, E2E 수준 검증 필요

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

## 특이사항

- **환경 변수**: `WEATHER_API_KEY`가 `.env.local`에 필요 (WeatherAPI.com)
- **mock 데이터**: 현재 복장 추천은 `mockRecommendation`을 직접 사용 중 (`src/app/page.tsx`). 추천 엔진 구현 후 교체 필요
- **프로젝트 원칙**: YAML 명세 → Gherkin 시나리오 → TDD 순서를 따름. `CLAUDE.md` 참조
- **TemperatureZoneConfig TBD**: 온도 구간별 복장 매핑 설정은 사용자가 직접 정리 예정
