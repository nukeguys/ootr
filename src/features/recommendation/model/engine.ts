import type { WeatherData } from '@/entities/weather';
import type { Recommendation } from '@/entities/recommendation';
import { topPresets } from '@/entities/recommendation/model/wardrobe';

function selectBottom(feelsLike: number, windSpeed: number): string {
  if (feelsLike >= 10) {
    // 강풍 오버라이드: wind > 5 AND feelsLike < 13 → 긴바지
    return windSpeed > 5 && feelsLike < 13 ? '긴바지' : '쇼츠';
  } else if (feelsLike >= -4) {
    return '긴바지';
  } else {
    return '기모 바지';
  }
}

function generateReason(
  feelsLike: number,
  windSpeed: number,
  hasRain: boolean,
  uvIndex: number,
  isDay: boolean,
): string {
  const parts: string[] = [`체감온도 ${feelsLike}°C`];

  if (windSpeed > 5) parts.push(`강풍 ${windSpeed.toFixed(1)}m/s`);
  if (hasRain) parts.push('강수 있음');
  if (isDay && uvIndex > 3) parts.push(`자외선 지수 ${uvIndex}`);
  if (!isDay) parts.push('야간');

  return `${parts.join(', ')} 기준으로 추천되었습니다.`;
}

export function recommend(weather: WeatherData): Recommendation {
  const { feelsLike, windSpeed, precipitation, uvIndex, isDay } = weather;
  const hasRain = precipitation > 0;

  // 극한 날씨 판별
  const isExtremeWeather = feelsLike >= 30 || feelsLike < -10;
  const warnings: string[] = [];

  if (feelsLike >= 30) {
    warnings.push('극한 더위입니다. 실내 러닝 또는 휴식을 권장합니다.');
  } else if (feelsLike < -10) {
    warnings.push('극한 추위입니다. 실내 러닝 또는 휴식을 권장합니다.');
  }

  if (precipitation > 3) {
    warnings.push('강한 비/눈이 예상됩니다. 실내 러닝을 권장합니다.');
  }

  // 상의 프리셋 매칭 (첫 번째 일치 항목 사용)
  const preset = topPresets.find((p) => p.matches(feelsLike, windSpeed, hasRain));
  const combos = preset?.combos ?? [['반팔 티셔츠']];
  const top = combos[Math.floor(Math.random() * combos.length)];

  // 하의 선택
  const bottom = selectBottom(feelsLike, windSpeed);

  // 악세서리 선택
  const accessories: string[] = [];

  if (feelsLike < -5) accessories.push('마스크');
  if (feelsLike < -4) {
    accessories.push('두꺼운 장갑');
  } else if (feelsLike < 10) {
    accessories.push('장갑');
  }
  if (isDay && uvIndex > 3) {
    accessories.push('모자');
    accessories.push('선글라스');
  }
  if (!isDay) accessories.push('반사 장비');

  return {
    outfitSet: {
      top,
      bottom: [bottom],
      accessories,
    },
    reason: generateReason(feelsLike, windSpeed, hasRain, uvIndex, isDay),
    warnings,
    isExtremeWeather,
    createdAt: Date.now(),
  };
}
