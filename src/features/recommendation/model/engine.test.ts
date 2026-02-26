import { describe, it, expect } from 'vitest';
import type { WeatherData } from '@/entities/weather';
import { recommend } from './engine';

function makeWeather(overrides: Partial<WeatherData> = {}): WeatherData {
  return {
    temperature: 10,
    feelsLike: 10,
    precipitation: 0,
    isSnow: false,
    windSpeed: 0,
    humidity: 60,
    condition: 'clear',
    uvIndex: 1,
    isDay: true,
    locationName: '테스트',
    updatedAt: 0,
    ...overrides,
  };
}

describe('상의 프리셋', () => {
  it('hot: feelsLike ≥ 25, wind ≤ 5, 강수 없음 → 싱글렛 or 반팔', () => {
    const result = recommend(makeWeather({ feelsLike: 27 }));
    expect([['싱글렛'], ['반팔 티셔츠']]).toContainEqual(result.outfitSet.top);
  });

  it('warm-wind: feelsLike ≥ 20, wind > 5 → 반팔 + 바람막이', () => {
    const result = recommend(makeWeather({ feelsLike: 22, windSpeed: 7 }));
    expect(result.outfitSet.top).toEqual(['반팔 티셔츠', '바람막이']);
  });

  it('warm-wind: feelsLike ≥ 20, 강수 → 반팔 + 바람막이', () => {
    const result = recommend(makeWeather({ feelsLike: 22, precipitation: 1 }));
    expect(result.outfitSet.top).toEqual(['반팔 티셔츠', '바람막이']);
  });

  it('warm: feelsLike ≥ 20, 바람/강수 없음 → 싱글렛 or 반팔', () => {
    const result = recommend(makeWeather({ feelsLike: 22 }));
    expect([['싱글렛'], ['반팔 티셔츠']]).toContainEqual(result.outfitSet.top);
  });

  it('mild-wind: feelsLike ≥ 12, wind > 5 → 긴팔+바람막이 or 하프집업+바람막이', () => {
    const result = recommend(makeWeather({ feelsLike: 15, windSpeed: 7 }));
    expect([
      ['긴팔 티셔츠', '바람막이'],
      ['하프 집업', '바람막이'],
    ]).toContainEqual(result.outfitSet.top);
  });

  it('mild-wind: feelsLike ≥ 12, 강수 → 긴팔+바람막이 or 하프집업+바람막이', () => {
    const result = recommend(makeWeather({ feelsLike: 15, precipitation: 1 }));
    expect([
      ['긴팔 티셔츠', '바람막이'],
      ['하프 집업', '바람막이'],
    ]).toContainEqual(result.outfitSet.top);
  });

  it('mild: feelsLike ≥ 12 → 긴팔 or 하프 집업', () => {
    const result = recommend(makeWeather({ feelsLike: 15 }));
    expect([['긴팔 티셔츠'], ['하프 집업']]).toContainEqual(result.outfitSet.top);
  });

  it('cool-wind: feelsLike ≥ 5, wind > 5 → 하프집업+바람막이 or 긴팔+바람막이', () => {
    const result = recommend(makeWeather({ feelsLike: 8, windSpeed: 7 }));
    expect([
      ['하프 집업', '바람막이'],
      ['긴팔 티셔츠', '바람막이'],
    ]).toContainEqual(result.outfitSet.top);
  });

  it('cool-wind: feelsLike ≥ 5, 강수 → 하프집업+바람막이 or 긴팔+바람막이', () => {
    const result = recommend(makeWeather({ feelsLike: 8, precipitation: 1 }));
    expect([
      ['하프 집업', '바람막이'],
      ['긴팔 티셔츠', '바람막이'],
    ]).toContainEqual(result.outfitSet.top);
  });

  it('cool: feelsLike ≥ 5 → 하프집업 or 기모하프집업 or 긴팔+바람막이', () => {
    const result = recommend(makeWeather({ feelsLike: 8 }));
    expect([
      ['하프 집업'],
      ['기모 하프 집업'],
      ['긴팔 티셔츠', '바람막이'],
    ]).toContainEqual(result.outfitSet.top);
  });

  it('cold-wind: feelsLike ≥ 0, wind > 5 → 기모하프집업+바람막이 or 하프집업+바람막이', () => {
    const result = recommend(makeWeather({ feelsLike: 2, windSpeed: 7 }));
    expect([
      ['기모 하프 집업', '바람막이'],
      ['하프 집업', '바람막이'],
    ]).toContainEqual(result.outfitSet.top);
  });

  it('cold-wind: feelsLike ≥ 0, 강수 → 기모하프집업+바람막이 or 하프집업+바람막이', () => {
    const result = recommend(makeWeather({ feelsLike: 2, precipitation: 1 }));
    expect([
      ['기모 하프 집업', '바람막이'],
      ['하프 집업', '바람막이'],
    ]).toContainEqual(result.outfitSet.top);
  });

  it('cold: feelsLike ≥ 0 → 기모하프집업 or 긴팔+바람막이 or 기모하프집업+바람막이', () => {
    const result = recommend(makeWeather({ feelsLike: 3 }));
    expect([
      ['기모 하프 집업'],
      ['긴팔 티셔츠', '바람막이'],
      ['기모 하프 집업', '바람막이'],
    ]).toContainEqual(result.outfitSet.top);
  });

  it('very-cold-wind: feelsLike ≥ -4, wind > 5 → 반팔+기모+바람막이 or 기모+바람막이', () => {
    const result = recommend(makeWeather({ feelsLike: -2, windSpeed: 7 }));
    expect([
      ['반팔 티셔츠', '기모 하프 집업', '바람막이'],
      ['기모 하프 집업', '바람막이'],
    ]).toContainEqual(result.outfitSet.top);
  });

  it('very-cold: feelsLike ≥ -4 → 기모+바람막이 or 하프집업+바람막이', () => {
    const result = recommend(makeWeather({ feelsLike: -2 }));
    expect([
      ['기모 하프 집업', '바람막이'],
      ['하프 집업', '바람막이'],
    ]).toContainEqual(result.outfitSet.top);
  });

  it('extreme-cold: feelsLike ≥ -8 → 반팔+기모+바람막이 or 긴팔+패딩+바람막이 or 하프집업+패딩+바람막이', () => {
    const result = recommend(makeWeather({ feelsLike: -5 }));
    expect([
      ['반팔 티셔츠', '기모 하프 집업', '바람막이'],
      ['긴팔 티셔츠', '패딩 조끼', '바람막이'],
      ['하프 집업', '패딩 조끼', '바람막이'],
    ]).toContainEqual(result.outfitSet.top);
  });

  it('extreme-cold-deep: fallback → 기모+패딩+바람막이 or 반팔+기모+패딩+바람막이', () => {
    const result = recommend(makeWeather({ feelsLike: -12 }));
    expect([
      ['기모 하프 집업', '패딩 조끼', '바람막이'],
      ['반팔 티셔츠', '기모 하프 집업', '패딩 조끼', '바람막이'],
    ]).toContainEqual(result.outfitSet.top);
  });
});

describe('하의 선택', () => {
  it('feelsLike ≥ 10, 바람 없음 → 쇼츠', () => {
    const result = recommend(makeWeather({ feelsLike: 15 }));
    expect(result.outfitSet.bottom).toEqual(['쇼츠']);
  });

  it('feelsLike ≥ 10, wind > 5, feelsLike < 13 → 강풍 오버라이드: 긴바지', () => {
    const result = recommend(makeWeather({ feelsLike: 11, windSpeed: 7 }));
    expect(result.outfitSet.bottom).toEqual(['긴바지']);
  });

  it('feelsLike ≥ 13, wind > 5 → 강풍 오버라이드 미적용: 쇼츠', () => {
    const result = recommend(makeWeather({ feelsLike: 14, windSpeed: 7 }));
    expect(result.outfitSet.bottom).toEqual(['쇼츠']);
  });

  it('-4 ≤ feelsLike < 10 → 긴바지', () => {
    const result = recommend(makeWeather({ feelsLike: 5 }));
    expect(result.outfitSet.bottom).toEqual(['긴바지']);
  });

  it('feelsLike = -4 (경계값) → 긴바지', () => {
    const result = recommend(makeWeather({ feelsLike: -4 }));
    expect(result.outfitSet.bottom).toEqual(['긴바지']);
  });

  it('feelsLike < -4 → 기모 바지', () => {
    const result = recommend(makeWeather({ feelsLike: -5 }));
    expect(result.outfitSet.bottom).toEqual(['기모 바지']);
  });
});

describe('악세서리', () => {
  it('feelsLike < -5 → 마스크 + 두꺼운 장갑 포함', () => {
    const result = recommend(makeWeather({ feelsLike: -6, isDay: false }));
    expect(result.outfitSet.accessories).toContain('마스크');
    expect(result.outfitSet.accessories).toContain('두꺼운 장갑');
  });

  it('feelsLike -5 이상 -4 미만 → 두꺼운 장갑 포함, 마스크 없음', () => {
    const result = recommend(makeWeather({ feelsLike: -5 }));
    expect(result.outfitSet.accessories).toContain('두꺼운 장갑');
    expect(result.outfitSet.accessories).not.toContain('마스크');
  });

  it('-4 ≤ feelsLike < 10 → 장갑 포함', () => {
    const result = recommend(makeWeather({ feelsLike: -2 }));
    expect(result.outfitSet.accessories).toContain('장갑');
    expect(result.outfitSet.accessories).not.toContain('두꺼운 장갑');
  });

  it('feelsLike ≥ 10 → 장갑 없음', () => {
    const result = recommend(makeWeather({ feelsLike: 15 }));
    expect(result.outfitSet.accessories).not.toContain('장갑');
    expect(result.outfitSet.accessories).not.toContain('두꺼운 장갑');
  });

  it('isDay, uvIndex > 3 → 모자 + 선글라스 포함', () => {
    const result = recommend(makeWeather({ feelsLike: 22, isDay: true, uvIndex: 5 }));
    expect(result.outfitSet.accessories).toContain('모자');
    expect(result.outfitSet.accessories).toContain('선글라스');
  });

  it('isDay, uvIndex ≤ 3 → 모자/선글라스 없음', () => {
    const result = recommend(makeWeather({ feelsLike: 22, isDay: true, uvIndex: 3 }));
    expect(result.outfitSet.accessories).not.toContain('모자');
    expect(result.outfitSet.accessories).not.toContain('선글라스');
  });

  it('야간 → 반사 장비 포함', () => {
    const result = recommend(makeWeather({ feelsLike: 22, isDay: false }));
    expect(result.outfitSet.accessories).toContain('반사 장비');
  });

  it('주간 → 반사 장비 없음', () => {
    const result = recommend(makeWeather({ feelsLike: 22, isDay: true }));
    expect(result.outfitSet.accessories).not.toContain('반사 장비');
  });
});

describe('극한 날씨 경고', () => {
  it('feelsLike ≥ 30 → isExtremeWeather: true, 더위 경고', () => {
    const result = recommend(makeWeather({ feelsLike: 32 }));
    expect(result.isExtremeWeather).toBe(true);
    expect(result.warnings.some((w) => w.includes('극한 더위'))).toBe(true);
  });

  it('feelsLike < -10 → isExtremeWeather: true, 추위 경고', () => {
    const result = recommend(makeWeather({ feelsLike: -12 }));
    expect(result.isExtremeWeather).toBe(true);
    expect(result.warnings.some((w) => w.includes('극한 추위'))).toBe(true);
  });

  it('정상 체감온도 → isExtremeWeather: false', () => {
    const result = recommend(makeWeather({ feelsLike: 15 }));
    expect(result.isExtremeWeather).toBe(false);
    expect(result.warnings).toHaveLength(0);
  });

  it('precipitation > 3 → 강한 비/눈 경고', () => {
    const result = recommend(makeWeather({ feelsLike: 10, precipitation: 5 }));
    expect(result.warnings.some((w) => w.includes('강한 비/눈'))).toBe(true);
  });

  it('precipitation ≤ 3 → 강한 비/눈 경고 없음', () => {
    const result = recommend(makeWeather({ feelsLike: 10, precipitation: 2 }));
    expect(result.warnings.every((w) => !w.includes('강한 비/눈'))).toBe(true);
  });
});

describe('통합 시나리오', () => {
  it('feelsLike 22°C, 맑음, 주간, uvIndex 5 → 싱글렛/반팔 + 쇼츠 + 모자 + 선글라스', () => {
    const result = recommend(
      makeWeather({ feelsLike: 22, isDay: true, uvIndex: 5 }),
    );
    expect([['싱글렛'], ['반팔 티셔츠']]).toContainEqual(result.outfitSet.top);
    expect(result.outfitSet.bottom).toEqual(['쇼츠']);
    expect(result.outfitSet.accessories).toContain('모자');
    expect(result.outfitSet.accessories).toContain('선글라스');
  });

  it('feelsLike 8°C, wind 7m/s → 하프집업/긴팔+바람막이 + 긴바지', () => {
    const result = recommend(makeWeather({ feelsLike: 8, windSpeed: 7 }));
    expect([
      ['하프 집업', '바람막이'],
      ['긴팔 티셔츠', '바람막이'],
    ]).toContainEqual(result.outfitSet.top);
    expect(result.outfitSet.bottom).toEqual(['긴바지']);
  });

  it('feelsLike 12°C, precip 1mm → 긴팔/하프집업+바람막이 + 쇼츠', () => {
    const result = recommend(makeWeather({ feelsLike: 12, precipitation: 1 }));
    expect([
      ['긴팔 티셔츠', '바람막이'],
      ['하프 집업', '바람막이'],
    ]).toContainEqual(result.outfitSet.top);
    expect(result.outfitSet.bottom).toEqual(['쇼츠']);
  });

  it('feelsLike 3°C, 바람 없음 → 기모하프집업/긴팔+바람막이/기모+바람막이 + 긴바지 + 장갑', () => {
    const result = recommend(makeWeather({ feelsLike: 3 }));
    expect([
      ['기모 하프 집업'],
      ['긴팔 티셔츠', '바람막이'],
      ['기모 하프 집업', '바람막이'],
    ]).toContainEqual(result.outfitSet.top);
    expect(result.outfitSet.bottom).toEqual(['긴바지']);
    expect(result.outfitSet.accessories).toContain('장갑');
  });

  it('feelsLike 25°C, 야간 → 싱글렛/반팔 + 쇼츠 + 반사 장비', () => {
    const result = recommend(makeWeather({ feelsLike: 25, isDay: false }));
    expect([['싱글렛'], ['반팔 티셔츠']]).toContainEqual(result.outfitSet.top);
    expect(result.outfitSet.bottom).toEqual(['쇼츠']);
    expect(result.outfitSet.accessories).toContain('반사 장비');
  });
});
