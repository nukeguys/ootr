// 모든 날씨 provider가 반환하는 통합 응답 포맷
// WeatherAPI.com, 기상청+에어코리아+생활기상지수 모두 이 포맷으로 변환
export interface UnifiedWeatherResponse {
  location: { name: string };
  temperature: number; // ℃
  feelsLike: number; // ℃
  windSpeed: number; // m/s
  humidity: number; // %
  precipitation: number; // mm
  condition: string; // "맑음", "Clear" 등
  isSnow: boolean;
  uvIndex: number;
  isDay: boolean;
  airQuality: { pm10: number; pm2_5: number };
}
