// 마지막 사용 위치를 IndexedDB에 저장/로드
import { getDB, STORE_LOCATION } from '@/shared/lib/db';

const KEY = 'last';

export interface SavedLocation {
  latitude: number;
  longitude: number;
  name: string; // 표시용 지역명
  savedAt: number; // 저장 시각 (timestamp)
}

/**
 * 마지막 사용 위치를 IDB에 저장
 * GPS 성공 시 또는 검색으로 지역 변경 시 호출
 */
export async function saveLastLocation(location: SavedLocation): Promise<void> {
  try {
    const db = await getDB();
    await db.put(STORE_LOCATION, location, KEY);
  } catch {
    // IDB 접근 불가 시 (시크릿 모드 등) 무시
  }
}

/**
 * IDB에서 마지막 사용 위치를 로드
 * 위치 권한 거부 시 폴백으로 사용
 */
export async function loadLastLocation(): Promise<SavedLocation | null> {
  try {
    const db = await getDB();
    const result = await db.get(STORE_LOCATION, KEY);
    return (result as SavedLocation) ?? null;
  } catch {
    return null;
  }
}
