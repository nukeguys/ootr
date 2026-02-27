import type { AirQualityGrade } from '../lib/getAirQualityGrade';

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  precipitation: number;
  isSnow: boolean;
  windSpeed: number;
  humidity: number;
  condition: string;
  uvIndex: number;
  isDay: boolean;
  locationName: string;
  airQuality: AirQualityGrade;
  updatedAt: number;
}
