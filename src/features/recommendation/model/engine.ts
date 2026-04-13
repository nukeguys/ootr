import type { WeatherData } from '@/entities/weather';
import type { AirQualityGrade } from '@/entities/weather';
import type { Recommendation } from '@/entities/recommendation';
import { topPresets } from '@/entities/recommendation/model/wardrobe';
import { createRunningContext, type RunningContext } from './runningContext';

function selectBottom(ctx: RunningContext): string {
  if (ctx.adjustedFeelsLike >= 10) {
    // 강풍 오버라이드: wind > 5 AND feelsLike < 13 → 긴바지
    return ctx.windSpeed > 5 && ctx.adjustedFeelsLike < 13 ? '긴바지' : '쇼츠';
  } else if (ctx.adjustedFeelsLike >= -4) {
    return '긴바지';
  } else {
    return '기모 바지';
  }
}

function generateReason(
  ctx: RunningContext,
  airQuality: AirQualityGrade,
): string {
  const tempText = ctx.seasonReason 
    ? `체감온도 ${ctx.originalFeelsLike}°C(${ctx.seasonReason})` 
    : `체감온도 ${ctx.originalFeelsLike}°C`;
    
  const parts: string[] = [tempText];
  const tips: string[] = [];

  if (ctx.windSpeed > 5) parts.push(`강풍 ${ctx.windSpeed.toFixed(1)}m/s`);
  if (ctx.hasRain) parts.push('강수 있음');
  if (ctx.isDay && ctx.uvIndex > 3) parts.push(`자외선 지수 ${ctx.uvIndex}`);
  if (!ctx.isDay) parts.push('야간');
  if (airQuality === 'poor' || airQuality === 'bad') {
    parts.push('미세먼지 나쁨');
    tips.push('마스크 착용을 권장합니다');
  }

  let reason = `${parts.join(', ')} 기준으로 추천되었습니다.`;
  if (tips.length > 0) reason += ` ${tips.join(' ')}`;

  return reason;
}

export function recommend(weather: WeatherData): Recommendation {
  const now = Date.now();
  const ctx = createRunningContext(weather, now);

  // 상의 프리셋 매칭 (첫 번째 일치 항목 사용)
  const preset = topPresets.find((p) => p.matches(ctx.adjustedFeelsLike, ctx.windSpeed, ctx.hasRain));
  const combos = preset?.combos ?? [['반팔 티셔츠']];
  const top = combos[Math.floor(Math.random() * combos.length)];

  // 하의 선택
  const bottom = selectBottom(ctx);

  // 악세서리 선택
  const accessories: string[] = [];

  if (ctx.adjustedFeelsLike < -5) accessories.push('마스크');
  if (ctx.adjustedFeelsLike < -4) {
    accessories.push('두꺼운 장갑');
  } else if (ctx.adjustedFeelsLike < 10) {
    accessories.push('장갑');
  }
  if (ctx.isDay && ctx.uvIndex > 3) {
    accessories.push('모자');
    accessories.push('선글라스');
  }
  if (!ctx.isDay) accessories.push('반사 장비');

  return {
    outfitSet: {
      top,
      bottom: [bottom],
      accessories,
    },
    reason: generateReason(ctx, weather.airQuality),
    warnings: ctx.warnings,
    isExtremeWeather: ctx.isExtremeWeather,
    createdAt: now,
  };
}
