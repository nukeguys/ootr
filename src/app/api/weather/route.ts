import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

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

  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: '서버 설정 오류: API 키가 없습니다' },
      { status: 500 },
    );
  }

  try {
    const { data } = await axios.get(
      'https://api.weatherapi.com/v1/current.json',
      { params: { key: apiKey, q: `${latitude},${longitude}` } },
    );
    return NextResponse.json(data);
  } catch (error) {
    const status = axios.isAxiosError(error) ? (error.response?.status ?? 500) : 500;
    return NextResponse.json(
      { error: '날씨 데이터를 가져올 수 없습니다' },
      { status },
    );
  }
}
