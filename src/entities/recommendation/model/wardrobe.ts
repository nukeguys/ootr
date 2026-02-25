export interface WardrobeItem {
  id: string;
  name: string;
  category: 'base_top' | 'outer' | 'bottom' | 'accessory';
  properties: string[];
}

export const wardrobeItems: WardrobeItem[] = [
  // base_top
  { id: 'singlet', name: '싱글렛', category: 'base_top', properties: [] },
  { id: 'short-sleeve', name: '반팔 티셔츠', category: 'base_top', properties: [] },
  { id: 'long-sleeve', name: '긴팔 티셔츠', category: 'base_top', properties: [] },
  { id: 'half-zip', name: '하프 집업', category: 'base_top', properties: [] },
  { id: 'fleece-half-zip', name: '기모 하프 집업', category: 'base_top', properties: ['보온'] },
  // outer
  { id: 'windbreaker', name: '바람막이', category: 'outer', properties: ['방풍', '생활방수'] },
  { id: 'padded-vest', name: '패딩 조끼', category: 'outer', properties: ['보온'] },
  // bottom
  { id: 'shorts', name: '쇼츠', category: 'bottom', properties: [] },
  { id: 'long-pants', name: '긴바지', category: 'bottom', properties: ['방풍'] },
  { id: 'fleece-pants', name: '기모 바지', category: 'bottom', properties: ['보온'] },
  // accessory
  { id: 'cap', name: '모자', category: 'accessory', properties: ['자외선'] },
  { id: 'gloves', name: '장갑', category: 'accessory', properties: [] },
  { id: 'heavy-gloves', name: '두꺼운 장갑', category: 'accessory', properties: ['보온'] },
  { id: 'sunglasses', name: '선글라스', category: 'accessory', properties: ['자외선'] },
  { id: 'mask', name: '마스크', category: 'accessory', properties: ['보온'] },
  { id: 'reflective-gear', name: '반사 장비', category: 'accessory', properties: ['야간반사'] },
];

export interface TopPreset {
  id: string;
  /** 복수 후보 조합 (각각 내→외 순서) — 랜덤 선택 */
  combos: string[][];
  matches: (feelsLike: number, windSpeed: number, hasRain: boolean) => boolean;
}

/**
 * 상의 프리셋 목록 (우선순위 높은 순서로 정렬)
 * 첫 번째로 matches()가 true인 프리셋이 선택됨
 * 선택된 프리셋의 combos 중 하나가 랜덤으로 결정됨
 */
export const topPresets: TopPreset[] = [
  {
    id: 'hot',
    combos: [['싱글렛'], ['반팔 티셔츠']],
    matches: (feelsLike, windSpeed, hasRain) =>
      feelsLike >= 25 && windSpeed <= 5 && !hasRain,
  },
  {
    id: 'warm-wind',
    combos: [['반팔 티셔츠', '바람막이']],
    matches: (feelsLike, windSpeed, hasRain) =>
      feelsLike >= 20 && (windSpeed > 5 || hasRain),
  },
  {
    id: 'warm',
    combos: [['싱글렛'], ['반팔 티셔츠']],
    matches: (feelsLike) => feelsLike >= 20,
  },
  {
    id: 'mild-wind',
    combos: [
      ['긴팔 티셔츠', '바람막이'],
      ['하프 집업', '바람막이'],
    ],
    matches: (feelsLike, windSpeed, hasRain) =>
      feelsLike >= 12 && (windSpeed > 5 || hasRain),
  },
  {
    id: 'mild',
    combos: [['긴팔 티셔츠'], ['하프 집업']],
    matches: (feelsLike) => feelsLike >= 12,
  },
  {
    id: 'cool-wind',
    combos: [
      ['하프 집업', '바람막이'],
      ['긴팔 티셔츠', '바람막이'],
    ],
    matches: (feelsLike, windSpeed, hasRain) =>
      feelsLike >= 5 && (windSpeed > 5 || hasRain),
  },
  {
    id: 'cool',
    combos: [['하프 집업'], ['기모 하프 집업'], ['긴팔 티셔츠', '바람막이']],
    matches: (feelsLike) => feelsLike >= 5,
  },
  {
    id: 'cold-wind',
    combos: [
      ['기모 하프 집업', '바람막이'],
      ['하프 집업', '바람막이'],
    ],
    matches: (feelsLike, windSpeed, hasRain) =>
      feelsLike >= 0 && (windSpeed > 5 || hasRain),
  },
  {
    id: 'cold',
    combos: [
      ['기모 하프 집업'],
      ['긴팔 티셔츠', '바람막이'],
      ['기모 하프 집업', '바람막이'],
    ],
    matches: (feelsLike) => feelsLike >= 0,
  },
  {
    id: 'very-cold-wind',
    combos: [
      ['반팔 티셔츠', '기모 하프 집업', '바람막이'],
      ['기모 하프 집업', '바람막이'],
    ],
    matches: (feelsLike, windSpeed, hasRain) =>
      feelsLike >= -4 && (windSpeed > 5 || hasRain),
  },
  {
    id: 'very-cold',
    combos: [
      ['기모 하프 집업', '바람막이'],
      ['하프 집업', '바람막이'],
    ],
    matches: (feelsLike) => feelsLike >= -4,
  },
  {
    id: 'extreme-cold',
    combos: [
      ['반팔 티셔츠', '기모 하프 집업', '바람막이'],
      ['긴팔 티셔츠', '패딩 조끼', '바람막이'],
      ['하프 집업', '패딩 조끼', '바람막이'],
    ],
    matches: (feelsLike) => feelsLike >= -8,
  },
  {
    id: 'extreme-cold-deep',
    combos: [
      ['기모 하프 집업', '패딩 조끼', '바람막이'],
      ['반팔 티셔츠', '기모 하프 집업', '패딩 조끼', '바람막이'],
    ],
    matches: () => true,
  },
];
