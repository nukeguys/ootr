import type { WeatherData } from '../model/types';
import type { WeatherApiResponse } from './types';

export function mapWeatherData(response: WeatherApiResponse): WeatherData {
  const { location, current } = response;

  return {
    temperature: Math.round(current.temp_c),
    feelsLike: Math.round(current.feelslike_c),
    precipitation: Math.round(current.precip_mm),
    isSnow: current.condition.text.toLowerCase().includes('snow'),
    windSpeed: Math.round(current.wind_kph / 3.6),
    humidity: current.humidity,
    condition: current.condition.text,
    uvIndex: current.uv,
    isDay: current.is_day === 1,
    locationName: location.name,
    updatedAt: Date.now(),
  };
}
