// KMA provider — 한국 지역 날씨 조회
// 기상청 초단기실황 + 에어코리아 시도별 + 생활기상지수 자외선 + 카카오 역지오코딩

import axios from 'axios';
import type { UnifiedWeatherResponse } from '@/entities/weather/api/unified/types';
import { latLonToGrid } from '@/entities/weather/lib/coordConverter';
import { getKmaBaseDateTime } from '@/entities/weather/lib/kmaBaseTime';
import { calculateFeelsLike } from '@/entities/weather/lib/feelsLike';
import { kmaConditionText } from '@/entities/weather/lib/kmaCondition';
import { getKstDate } from '@/entities/weather/lib/kstDate';

interface KmaKeys {
  kma: string;
  airkorea: string;
  livingIdx: string;
  kakao: string;
}

// --- 카카오 역지오코딩 ---

interface KakaoRegionDocument {
  region_type: string;
  code: string;
  address_name: string;
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
}

// 시도 전체명 → 에어코리아 시도명 변환
const SIDO_NAME_MAP: Record<string, string> = {
  서울특별시: '서울',
  부산광역시: '부산',
  대구광역시: '대구',
  인천광역시: '인천',
  광주광역시: '광주',
  대전광역시: '대전',
  울산광역시: '울산',
  세종특별자치시: '세종',
  경기도: '경기',
  강원특별자치도: '강원',
  충청북도: '충북',
  충청남도: '충남',
  전북특별자치도: '전북',
  전라남도: '전남',
  경상북도: '경북',
  경상남도: '경남',
  제주특별자치도: '제주',
};

async function fetchKakaoRegion(
  lat: number,
  lon: number,
  kakaoKey: string,
): Promise<{ locationName: string; sidoName: string; areaNo: string }> {
  const { data } = await axios.get(
    'https://dapi.kakao.com/v2/local/geo/coord2regioncode.json',
    {
      params: { x: lon, y: lat },
      headers: { Authorization: `KakaoAK ${kakaoKey}` },
    },
  );

  // 법정동(B) 타입 문서 우선 사용
  const doc: KakaoRegionDocument | undefined =
    data.documents?.find((d: KakaoRegionDocument) => d.region_type === 'B') ??
    data.documents?.[0];

  if (!doc) {
    return { locationName: '알 수 없음', sidoName: '서울', areaNo: '1100000000' };
  }

  const region1 = doc.region_1depth_name;
  const region2 = doc.region_2depth_name;
  const locationName = region2 ? `${region2}, ${region1}` : region1;
  const sidoName = SIDO_NAME_MAP[region1] ?? '서울';

  // areaNo: 법정동 코드 사용 (시군구 레벨: 앞 5자리 + 00000)
  const areaNo = doc.code.length >= 5 ? doc.code.substring(0, 5) + '00000' : doc.code;

  return { locationName, sidoName, areaNo };
}

// --- 기상청 초단기실황 ---

interface KmaItem {
  category: string;
  obsrValue: string;
}

async function fetchKmaWeather(
  nx: number,
  ny: number,
  kmaKey: string,
): Promise<Record<string, number>> {
  const { baseDate, baseTime } = getKmaBaseDateTime();

  const { data } = await axios.get(
    'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst',
    {
      params: {
        serviceKey: kmaKey,
        pageNo: 1,
        numOfRows: 10,
        dataType: 'JSON',
        base_date: baseDate,
        base_time: baseTime,
        nx,
        ny,
      },
    },
  );

  const items: KmaItem[] = data?.response?.body?.items?.item ?? [];
  const result: Record<string, number> = {};

  for (const item of items) {
    result[item.category] = Number(item.obsrValue);
  }

  return result;
}

// --- 에어코리아 시도별 실시간 ---

async function fetchAirKorea(
  sidoName: string,
  airkoreaKey: string,
): Promise<{ pm10: number; pm2_5: number }> {
  try {
    const { data } = await axios.get(
      'https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty',
      {
        params: {
          serviceKey: airkoreaKey,
          returnType: 'json',
          numOfRows: 1,
          pageNo: 1,
          sidoName,
          ver: '1.0',
        },
      },
    );

    const item = data?.response?.body?.items?.[0];
    return {
      pm10: Number(item?.pm10Value) || 0,
      pm2_5: Number(item?.pm25Value) || 0,
    };
  } catch {
    // 에어코리아 API 실패 시 기본값 반환
    return { pm10: 0, pm2_5: 0 };
  }
}

// --- 생활기상지수 자외선 ---

async function fetchUvIndex(areaNo: string, livingIdxKey: string): Promise<number> {
  try {
    const now = getKstDate();
    const time =
      `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}` +
      `${String(now.getDate()).padStart(2, '0')}` +
      `${String(now.getHours()).padStart(2, '0')}`;

    const { data } = await axios.get(
      'https://apis.data.go.kr/1360000/LivingWthrIdxServiceV4/getUVIdxV4',
      {
        params: {
          serviceKey: livingIdxKey,
          areaNo,
          time,
          dataType: 'JSON',
        },
      },
    );

    const item = data?.response?.body?.items?.item?.[0];
    // h0: 현재 시각 기준 자외선 지수
    return Number(item?.h0) || 0;
  } catch {
    // 자외선 데이터 실패 시 기본값 반환
    return 0;
  }
}

// --- isDay 계산 ---

function checkIsDay(): boolean {
  const hour = getKstDate().getHours();
  return hour >= 6 && hour < 20;
}

// --- 통합 조회 ---

/**
 * 한국 지역 날씨 데이터를 기상청 + 에어코리아 + 생활기상지수 + 카카오 역지오코딩으로 통합 조회
 */
export async function fetchFromKma(
  lat: number,
  lon: number,
  keys: KmaKeys,
): Promise<UnifiedWeatherResponse> {
  const { nx, ny } = latLonToGrid(lat, lon);

  // 카카오 역지오코딩 (시도명, areaNo 확보)
  const regionInfo = await fetchKakaoRegion(lat, lon, keys.kakao);

  // 3개 API 병렬 호출
  const [kmaData, airData, uvIndex] = await Promise.all([
    fetchKmaWeather(nx, ny, keys.kma),
    fetchAirKorea(regionInfo.sidoName, keys.airkorea),
    fetchUvIndex(regionInfo.areaNo, keys.livingIdx),
  ]);

  const temperature = Math.round((kmaData['T1H'] ?? 0) * 10) / 10;
  const windSpeedRaw = kmaData['WSD'] ?? 0;
  const humidity = kmaData['REH'] ?? 0;
  const precipitationRaw = kmaData['RN1'] ?? 0;
  const pty = kmaData['PTY'] ?? 0;
  const sky = kmaData['SKY'] ?? 1;

  return {
    location: { name: regionInfo.locationName },
    temperature,
    feelsLike: calculateFeelsLike(temperature, windSpeedRaw, humidity),
    windSpeed: Math.round(windSpeedRaw * 10) / 10,
    humidity,
    precipitation: Math.round(precipitationRaw * 10) / 10,
    condition: kmaConditionText(sky, pty),
    isSnow: pty === 3 || pty === 7,
    uvIndex,
    isDay: checkIsDay(),
    airQuality: airData,
  };
}
