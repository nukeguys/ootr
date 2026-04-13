'use client';

import { useCallback } from 'react';
import { useWeather } from '@/features/get-weather';
import { WeatherHeader, WeatherHeaderSkeleton } from '@/widgets/weather-header';
import { WeatherError } from '@/shared/ui/WeatherError';
import type { Location } from '@/entities/location';

export function WeatherSection() {
  const { weather, isLoading, error, setLocation, refetch } = useWeather();

  const handleLocationChange = useCallback(
    (location: Location) => {
      setLocation(location.latitude, location.longitude, location.name);
    },
    [setLocation],
  );

  if (isLoading && !weather) {
    return <WeatherHeaderSkeleton />;
  }

  if (error && !weather) {
    return <WeatherError message={error} onRetry={refetch} />;
  }

  if (!weather) {
    return null;
  }

  return <WeatherHeader weather={weather} onLocationChange={handleLocationChange} />;
}
