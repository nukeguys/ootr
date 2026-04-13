export function getKstDate(date: Date = new Date()): Date {
  // 1. 밀리초 단위의 UTC 시간(Epoch time) 계산
  const utc = date.getTime() + date.getTimezoneOffset() * 60 * 1000;

  // 2. KST 오프셋(UTC+9) 더하기
  const kstOffset = 9 * 60 * 60 * 1000;

  // 3. KST 시간에 해당하는 Date 객체 반환
  return new Date(utc + kstOffset);
}
