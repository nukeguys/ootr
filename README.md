# OOTR (Outfit On The Run)

날씨 기반 러닝 복장 추천 서비스.

현재 위치의 날씨(기온, 체감온도, 풍속)를 분석하여 러닝에 적합한 복장을 추천합니다.

## 기술 스택

- **Next.js 16** (App Router, Turbopack)
- **React 19** / **TypeScript**
- **Tailwind CSS 4**
- **TanStack React Query** — 서버 상태 관리
- **Vitest** + **Testing Library** — 테스트
- **PWA** — 오프라인 폴백, 홈 화면 추가(A2HS)

## 시작하기

```bash
npm install
npm run dev
```

## 스크립트

| 명령어           | 설명               |
| ---------------- | ------------------ |
| `npm run dev`    | 개발 서버 실행     |
| `npm run build`  | 프로덕션 빌드      |
| `npm start`      | 프로덕션 서버 실행 |
| `npm test`       | 테스트 실행        |
| `npm run lint`   | ESLint 검사        |
| `npm run format` | Prettier 포맷팅    |
