import { NextRequest, NextResponse } from 'next/server';
import { isKorea } from '@/entities/weather/lib/coordConverter';
import { fetchFromWeatherApi } from './providers/weatherapi';
import { fetchFromKma } from './providers/kma';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!lat || !lon) {
    return NextResponse.json(
      { error: '위도(lat)와 경도(lon) 파라미터가 필요합니다' },
      { status: 400 },
    );
  }

  const latitude = Number(lat);
  const longitude = Number(lon);

  if (
    Number.isNaN(latitude) ||
    Number.isNaN(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return NextResponse.json(
      { error: '유효하지 않은 좌표입니다' },
      { status: 400 },
    );
  }

  try {
    if (isKorea(latitude, longitude)) {
      // 한국 지역: 기상청 + 에어코리아 + 생활기상지수 + 카카오 역지오코딩
      const dataGoKrKey = process.env.DATA_GO_KR_API_KEY;
      const kakaoKey = process.env.KAKAO_REST_API_KEY;

      if (!dataGoKrKey || !kakaoKey) {
        return NextResponse.json(
          { error: '서버 설정 오류: 한국 날씨 API 키가 없습니다' },
          { status: 500 },
        );
      }

      const data = await fetchFromKma(latitude, longitude, {
        kma: dataGoKrKey,
        airkorea: dataGoKrKey,
        livingIdx: dataGoKrKey,
        kakao: kakaoKey,
      });
      return NextResponse.json(data);
    } else {
      // 해외 지역: WeatherAPI.com
      const apiKey = process.env.WEATHER_API_KEY;
      if (!apiKey) {
        return NextResponse.json(
          { error: '서버 설정 오류: API 키가 없습니다' },
          { status: 500 },
        );
      }

      const data = await fetchFromWeatherApi(latitude, longitude, apiKey);
      return NextResponse.json(data);
    }
  } catch {
    return NextResponse.json(
      { error: '날씨 데이터를 가져올 수 없습니다' },
      { status: 500 },
    );
  }
}
