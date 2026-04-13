import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// 카카오 로컬 API 키워드 검색 프록시
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json(
      { error: '검색어는 2글자 이상 입력해주세요' },
      { status: 400 },
    );
  }

  const kakaoKey = process.env.KAKAO_REST_API_KEY;
  if (!kakaoKey) {
    return NextResponse.json(
      { error: '서버 설정 오류: 카카오 API 키가 없습니다' },
      { status: 500 },
    );
  }

  try {
    const { data } = await axios.get(
      'https://dapi.kakao.com/v2/local/search/keyword.json',
      {
        params: { query, size: 10 },
        headers: { Authorization: `KakaoAK ${kakaoKey}` },
      },
    );

    interface KakaoPlace {
      place_name: string;
      address_name: string;
      road_address_name: string;
      y: string;
      x: string;
    }

    const results = (data.documents ?? []).map((doc: KakaoPlace) => ({
      name: doc.place_name,
      address: doc.address_name,
      roadAddress: doc.road_address_name ?? '',
      latitude: Number(doc.y),
      longitude: Number(doc.x),
    }));

    return NextResponse.json(results);
  } catch {
    return NextResponse.json(
      { error: '지역 검색에 실패했습니다' },
      { status: 500 },
    );
  }
}
