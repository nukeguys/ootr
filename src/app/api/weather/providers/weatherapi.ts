// WeatherAPI.com provider — 해외 지역 날씨 조회
import axios from 'axios';
import type { UnifiedWeatherResponse } from '@/entities/weather/api/unified/types';

// WeatherAPI.com 응답 타입 (내부 전용)
interface WeatherApiRawResponse {
  location: { name: string };
  current: {
    temp_c: number;
    feelslike_c: number;
    precip_mm: number;
    wind_kph: number;
    humidity: number;
    uv: number;
    is_day: number;
    condition: { text: string };
    air_quality: { pm2_5: number; pm10: number };
  };
}

/**
 * WeatherAPI.com에서 날씨 데이터를 조회하여 통합 포맷으로 반환
 */
export async function fetchFromWeatherApi(
  lat: number,
  lon: number,
  apiKey: string,
): Promise<UnifiedWeatherResponse> {
  const { data } = await axios.get<WeatherApiRawResponse>(
    'https://api.weatherapi.com/v1/current.json',
    { params: { key: apiKey, q: `${lat},${lon}`, aqi: 'yes' } },
  );

  const { location, current } = data;

  return {
    location: { name: location.name },
    temperature: Math.round(current.temp_c * 10) / 10,
    feelsLike: Math.round(current.feelslike_c * 10) / 10,
    windSpeed: Math.round((current.wind_kph / 3.6) * 10) / 10, // km/h → m/s
    humidity: current.humidity,
    precipitation: Math.round(current.precip_mm * 10) / 10,
    condition: current.condition.text,
    isSnow: current.condition.text.toLowerCase().includes('snow'),
    uvIndex: current.uv,
    isDay: current.is_day === 1,
    airQuality: {
      pm10: current.air_quality.pm10,
      pm2_5: current.air_quality.pm2_5,
    },
  };
}
