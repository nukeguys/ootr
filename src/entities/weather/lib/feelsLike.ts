// 기상청 공식 체감온도 계산
// 겨울: Wind Chill (캐나다/미국 공동 공식, 기상청 채택)
// 여름: Rothfusz Heat Index (간이 열지수)

/**
 * 체감온도 계산
 * @param tempC 기온 (℃)
 * @param windSpeedMs 풍속 (m/s)
 * @param humidity 상대습도 (%)
 * @returns 체감온도 (℃, 소수점 1자리 반올림)
 */
export function calculateFeelsLike(
  tempC: number,
  windSpeedMs: number,
  humidity: number,
): number {
  const windKph = windSpeedMs * 3.6;

  // 겨울철 체감온도: T ≤ 10℃ 이고 풍속 ≥ 4.8 km/h
  if (tempC <= 10 && windKph >= 4.8) {
    const wc =
      13.12 +
      0.6215 * tempC -
      11.37 * Math.pow(windKph, 0.16) +
      0.3965 * Math.pow(windKph, 0.16) * tempC;
    return Math.round(wc * 10) / 10;
  }

  // 여름철 열지수: T ≥ 27℃ 이고 습도 ≥ 40%
  if (tempC >= 27 && humidity >= 40) {
    // Rothfusz 회귀식 (간이)
    const T = tempC;
    const R = humidity;
    const hi =
      -8.784695 +
      1.61139411 * T +
      2.338549 * R -
      0.14611605 * T * R -
      0.012308094 * T * T -
      0.016424828 * R * R +
      0.002211732 * T * T * R +
      0.00072546 * T * R * R -
      0.000003582 * T * T * R * R;
    return Math.round(hi * 10) / 10;
  }

  // 중간 범위: 기온 그대로 반환
  return Math.round(tempC * 10) / 10;
}
