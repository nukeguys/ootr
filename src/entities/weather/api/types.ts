// WeatherAPI.com 원시 응답 타입 — providers/weatherapi.ts 내부에서만 사용
// 통합 응답 타입은 unified/types.ts의 UnifiedWeatherResponse 사용
export type { UnifiedWeatherResponse as WeatherApiResponse } from './unified/types';
