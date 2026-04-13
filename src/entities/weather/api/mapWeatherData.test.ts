import { describe, it, expect, vi } from 'vitest';
import { mapWeatherData } from './mapWeatherData';
import type { UnifiedWeatherResponse } from './unified/types';

describe('mapWeatherData', () => {
  const baseResponse: UnifiedWeatherResponse = {
    location: { name: 'Seoul' },
    temperature: 17,
    feelsLike: 15,
    windSpeed: 2,
    humidity: 45,
    precipitation: 3,
    condition: 'Clear',
    isSnow: false,
    uvIndex: 3,
    isDay: true,
    airQuality: { pm10: 38.35, pm2_5: 35.65 },
  };

  it('숫자 필드를 매핑한다', () => {
    const result = mapWeatherData(baseResponse);
    expect(result.temperature).toBe(17);
    expect(result.feelsLike).toBe(15);
    expect(result.precipitation).toBe(3);
    expect(result.windSpeed).toBe(2);
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

  it('isDay를 매핑한다', () => {
    const result = mapWeatherData(baseResponse);
    expect(result.isDay).toBe(true);
  });

  it('isDay false일 때', () => {
    const response = { ...baseResponse, isDay: false };
    const result = mapWeatherData(response);
    expect(result.isDay).toBe(false);
  });

  it('isSnow true일 때', () => {
    const response = { ...baseResponse, isSnow: true };
    const result = mapWeatherData(response);
    expect(result.isSnow).toBe(true);
  });

  it('isSnow false일 때', () => {
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
      airQuality: { pm2_5: 80, pm10: 20 },
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
