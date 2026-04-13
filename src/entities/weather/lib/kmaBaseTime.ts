// 기상청 초단기실황 API의 base_date / base_time 계산
// 초단기실황: 매시 정시 관측, API 제공은 약 40분 후

import { getKstDate } from './kstDate';

interface KmaBaseDateTime {
  baseDate: string; // YYYYMMDD
  baseTime: string; // HHmm
}

/**
 * 현재 시각 기준으로 초단기실황 API에 사용할 base_date, base_time 계산
 *
 * 규칙: 현재 시각의 분이 40분 이상이면 현재 시의 정시,
 *       40분 미만이면 이전 시의 정시 사용
 *       (API 데이터가 ~40분 후에 제공되므로)
 */
export function getKmaBaseDateTime(now: Date = new Date()): KmaBaseDateTime {
  const kstNow = getKstDate(now);
  let year = kstNow.getFullYear();
  let month = kstNow.getMonth() + 1;
  let day = kstNow.getDate();
  let hour = kstNow.getHours();
  const minutes = kstNow.getMinutes();

  // 40분 이전이면 이전 시간 사용
  if (minutes < 40) {
    hour -= 1;
    if (hour < 0) {
      hour = 23;
      // 하루 전으로 이동
      const yesterday = getKstDate(now);
      yesterday.setDate(yesterday.getDate() - 1);
      year = yesterday.getFullYear();
      month = yesterday.getMonth() + 1;
      day = yesterday.getDate();
    }
  }

  const baseDate = `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;
  const baseTime = `${String(hour).padStart(2, '0')}00`;

  return { baseDate, baseTime };
}
