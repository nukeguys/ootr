import { describe, it, expect, vi } from 'vitest';
import { mapWeatherData } from './mapWeatherData';
import type { WeatherApiResponse } from './types';

describe('mapWeatherData', () => {
  const baseResponse: WeatherApiResponse = {
    location: { name: 'Seoul' },
    current: {
      temp_c: 17.3,
      feelslike_c: 14.8,
      precip_mm: 2.7,
      wind_kph: 8.4,
      humidity: 45,
      uv: 3,
      is_day: 1,
      condition: { text: 'Clear' },
      air_quality: { pm2_5: 35.65, pm10: 38.35 },
    },
  };

  it('숫자 필드를 반올림한다', () => {
    const result = mapWeatherData(baseResponse);
    expect(result.temperature).toBe(17);
    expect(result.feelsLike).toBe(15);
    expect(result.precipitation).toBe(3);
    expect(result.windSpeed).toBe(2); // 8.4 kph / 3.6 ≈ 2.33 → 2
  });

  it('위치명을 매핑한다', () => {
    const result = mapWeatherData(baseResponse);
    expect(result.locationName).toBe('Seoul');
  });

  it('condition text를 매핑한다', () => {
    const result = mapWeatherData(baseResponse);
    expect(result.condition).toBe('Clear');
  });

  it('습도와 UV 지수를 매핑한다', () => {
    const result = mapWeatherData(baseResponse);
    expect(result.humidity).toBe(45);
    expect(result.uvIndex).toBe(3);
  });

  it('is_day 1이면 isDay true', () => {
    const result = mapWeatherData(baseResponse);
    expect(result.isDay).toBe(true);
  });

  it('is_day 0이면 isDay false', () => {
    const response = {
      ...baseResponse,
      current: { ...baseResponse.current, is_day: 0 },
    };
    const result = mapWeatherData(response);
    expect(result.isDay).toBe(false);
  });

  it('condition에 snow가 포함되면 isSnow true', () => {
    const response = {
      ...baseResponse,
      current: {
        ...baseResponse.current,
        condition: { text: 'Heavy Snow' },
      },
    };
    const result = mapWeatherData(response);
    expect(result.isSnow).toBe(true);
  });

  it('condition에 snow가 없으면 isSnow false', () => {
    const result = mapWeatherData(baseResponse);
    expect(result.isSnow).toBe(false);
  });

  it('PM10/PM2.5에서 airQuality 등급을 산출한다', () => {
    // pm10: 38.35 → fair (31–80), pm2.5: 35.65 → fair (16–50)
    const result = mapWeatherData(baseResponse);
    expect(result.airQuality).toBe('fair');
  });

  it('PM2.5가 더 나쁘면 해당 등급을 반영한다', () => {
    const response = {
      ...baseResponse,
      current: {
        ...baseResponse.current,
        air_quality: { pm2_5: 80, pm10: 20 },
      },
    };
    const result = mapWeatherData(response);
    expect(result.airQuality).toBe('poor');
  });

  it('updatedAt에 현재 timestamp를 설정한다', () => {
    const now = 1700000000000;
    vi.spyOn(Date, 'now').mockReturnValue(now);
    const result = mapWeatherData(baseResponse);
    expect(result.updatedAt).toBe(now);
    vi.restoreAllMocks();
  });
});
