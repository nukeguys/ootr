// WeatherAPI current.json 응답에서 사용하는 필드만 정의
export interface WeatherApiResponse {
  location: {
    name: string;
  };
  current: {
    temp_c: number;
    feelslike_c: number;
    precip_mm: number;
    wind_kph: number;
    humidity: number;
    uv: number;
    is_day: number;
    condition: {
      text: string;
    };
    air_quality: {
      pm2_5: number;
      pm10: number;
    };
  };
}
