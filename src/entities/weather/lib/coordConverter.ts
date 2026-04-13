// 기상청 LCC DFS 좌표 변환 (위경도 ↔ 격자)
// 출처: 기상청 공공데이터포털 샘플 코드

interface GridCoord {
  nx: number;
  ny: number;
}

const RE = 6371.00877; // 지구 반경 (km)
const GRID = 5.0; // 격자 간격 (km)
const SLAT1 = 30.0; // 투영 위도1 (degree)
const SLAT2 = 60.0; // 투영 위도2 (degree)
const OLON = 126.0; // 기준점 경도 (degree)
const OLAT = 38.0; // 기준점 위도 (degree)
const XO = 43; // 기준점 X좌표 (GRID)
const YO = 136; // 기준점 Y좌표 (GRID)

const DEGRAD = Math.PI / 180.0;

/**
 * 위경도 → 기상청 격자 좌표(nx, ny) 변환
 */
export function latLonToGrid(lat: number, lon: number): GridCoord {
  const re = RE / GRID;
  const slat1 = SLAT1 * DEGRAD;
  const slat2 = SLAT2 * DEGRAD;
  const olon = OLON * DEGRAD;
  const olat = OLAT * DEGRAD;

  let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
  let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
  let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = (re * sf) / Math.pow(ro, sn);

  let ra = Math.tan(Math.PI * 0.25 + lat * DEGRAD * 0.5);
  ra = (re * sf) / Math.pow(ra, sn);
  let theta = lon * DEGRAD - olon;
  if (theta > Math.PI) theta -= 2.0 * Math.PI;
  if (theta < -Math.PI) theta += 2.0 * Math.PI;
  theta *= sn;

  return {
    nx: Math.floor(ra * Math.sin(theta) + XO + 0.5),
    ny: Math.floor(ro - ra * Math.cos(theta) + YO + 0.5),
  };
}

/**
 * 좌표가 한국 영역인지 판별 (대한민국 본토 + 제주 포함)
 */
export function isKorea(lat: number, lon: number): boolean {
  return lat >= 33.0 && lat <= 38.7 && lon >= 124.5 && lon <= 132.0;
}
