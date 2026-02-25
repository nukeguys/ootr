import type { Recommendation } from '../model/types';

export const mockRecommendation: Recommendation = {
  outfitSet: {
    top: ['긴팔 기능성 베이스레이어'],
    bottom: ['5인치 언라인드 퍼포먼스 쇼츠'],
    accessories: ['테크니컬 캡', '물집 방지 양말'],
  },
  reason:
    '온화한 기온에 낮은 습도로 빠르게 체온이 오릅니다. 긴팔 레이어는 초반 체감 14°C의 쌀쌀함을 막아주면서도, 심박수가 올라간 뒤 과열을 방지합니다.',
  warnings: [],
  isExtremeWeather: false,
  createdAt: 1772010000000,
};
