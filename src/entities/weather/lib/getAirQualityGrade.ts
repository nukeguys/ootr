export type AirQualityGrade = 'good' | 'fair' | 'poor' | 'bad';

export const AIR_QUALITY_LABEL: Record<AirQualityGrade, string> = {
  good: 'Good',
  fair: 'Fair',
  poor: 'Poor',
  bad: 'Bad',
};

const GRADE_ORDER: AirQualityGrade[] = ['good', 'fair', 'poor', 'bad'];

function gradePm25(value: number): AirQualityGrade {
  if (value <= 15) return 'good';
  if (value <= 50) return 'fair';
  if (value <= 100) return 'poor';
  return 'bad';
}

function gradePm10(value: number): AirQualityGrade {
  if (value <= 30) return 'good';
  if (value <= 80) return 'fair';
  if (value <= 150) return 'poor';
  return 'bad';
}

export function getAirQualityGrade(pm10: number, pm25: number): AirQualityGrade {
  const g10 = gradePm10(pm10);
  const g25 = gradePm25(pm25);
  return GRADE_ORDER.indexOf(g10) >= GRADE_ORDER.indexOf(g25) ? g10 : g25;
}
