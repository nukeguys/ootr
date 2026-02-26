'use client';

import { useWeather } from '@/features/get-weather';
import { WeatherHeader, WeatherHeaderSkeleton } from '@/widgets/weather-header';
import { WeatherError } from '@/shared/ui/WeatherError';

export function WeatherSection() {
  const { weather, isLoading, error, refetch } = useWeather();

  if (isLoading && !weather) {
    return <WeatherHeaderSkeleton />;
  }

  if (error && !weather) {
    return <WeatherError message={error} onRetry={refetch} />;
  }

  if (!weather) {
    return null;
  }

  return <WeatherHeader weather={weather} />;
}
