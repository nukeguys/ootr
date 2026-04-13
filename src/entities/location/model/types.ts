export interface Location {
  name: string; // "강남구" 또는 "합정동"
  address: string; // 지번 주소: "서울특별시 강남구"
  roadAddress: string; // 도로명 주소: "서울특별시 강남구 테헤란로 10"
  latitude: number;
  longitude: number;
}
