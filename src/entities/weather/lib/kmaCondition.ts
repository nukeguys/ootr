// 기상청 SKY + PTY 코드 → 날씨 상태 텍스트 변환 (영어)

/**
 * 기상청 하늘상태(SKY) + 강수형태(PTY) 코드를 텍스트로 변환
 *
 * PTY 우선: 강수가 있으면 강수형태가 condition
 * SKY: 강수 없으면 하늘상태가 condition
 *
 * @param sky 하늘상태 코드 (1=맑음, 3=구름많음, 4=흐림)
 * @param pty 강수형태 코드 (0=없음, 1=비, 2=비/눈, 3=눈, 4=소나기, 5=빗방울, 6=빗방울눈날림, 7=눈날림)
 */
export function kmaConditionText(sky: number, pty: number): string {
  // 강수형태 우선
  if (pty > 0) {
    const ptyMap: Record<number, string> = {
      1: 'Rain',
      2: 'Rain/Snow',
      3: 'Snow',
      4: 'Shower',
      5: 'Drizzle',
      6: 'Drizzle/Snow',
      7: 'Flurry',
    };
    return ptyMap[pty] ?? 'Rain';
  }

  // 하늘상태
  const skyMap: Record<number, string> = {
    1: 'Clear',
    3: 'Mostly Cloudy',
    4: 'Cloudy',
  };
  return skyMap[sky] ?? 'Clear';
}
