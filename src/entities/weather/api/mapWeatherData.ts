import type { WeatherData } from '../model/types';
import type { UnifiedWeatherResponse } from './unified/types';
import { getAirQualityGrade } from '../lib/getAirQualityGrade';

export function mapWeatherData(response: UnifiedWeatherResponse): WeatherData {
  return {
    temperature: response.temperature,
    feelsLike: response.feelsLike,
    precipitation: response.precipitation,
    isSnow: response.isSnow,
    windSpeed: response.windSpeed,
    humidity: response.humidity,
    condition: response.condition,
    uvIndex: response.uvIndex,
    isDay: response.isDay,
    locationName: response.location.name,
    airQuality: getAirQualityGrade(response.airQuality.pm10, response.airQuality.pm2_5),
    updatedAt: Date.now(),
  };
}
