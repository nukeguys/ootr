import type { WeatherData } from '@/entities/weather';

export interface RunningContext {
  originalFeelsLike: number;
  adjustedFeelsLike: number;
  seasonReason: string | null;
  windSpeed: number;
  hasRain: boolean;
  uvIndex: number;
  isDay: boolean;
  isExtremeWeather: boolean;
  warnings: string[];
}

/**
 * 기상청의 원본 날씨 데이터를 받아 러닝에 맞게 보정(계절별 기후 적응 등)하고
 * 엔진이 필요로 하는 통합된 컨텍스트 객체를 생성합니다.
 */
export function createRunningContext(weather: WeatherData, timestamp: number): RunningContext {
  const month = new Date(timestamp).getMonth() + 1;
  let offset = 0;
  let seasonReason: string | null = null;
  
  // 봄 (3, 4, 5월): 겨울에 적응되어 같은 기온이라도 더 덥게 느낌
  if (month >= 3 && month <= 5) {
    offset = 2;
    seasonReason = '봄철 체감 보정 +2°C';
  } 
  // 가을 (9, 10, 11월): 여름에 적응되어 같은 기온이라도 더 춥게 느낌
  else if (month >= 9 && month <= 11) {
    offset = -2;
    seasonReason = '가을철 체감 보정 -2°C';
  }

  const adjustedFeelsLike = weather.feelsLike + offset;
  const hasRain = weather.precipitation > 0;
  
  const warnings: string[] = [];
  if (adjustedFeelsLike >= 30) {
    warnings.push('극한 더위입니다. 실내 러닝 또는 휴식을 권장합니다.');
  } else if (adjustedFeelsLike < -10) {
    warnings.push('극한 추위입니다. 실내 러닝 또는 휴식을 권장합니다.');
  }
  
  if (weather.precipitation > 3) {
    warnings.push('강한 비/눈이 예상됩니다. 실내 러닝을 권장합니다.');
  }

  return {
    originalFeelsLike: weather.feelsLike,
    adjustedFeelsLike,
    seasonReason,
    windSpeed: weather.windSpeed,
    hasRain,
    uvIndex: weather.uvIndex,
    isDay: weather.isDay,
    isExtremeWeather: adjustedFeelsLike >= 30 || adjustedFeelsLike < -10,
    warnings,
  };
}
