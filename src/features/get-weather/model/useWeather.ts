'use client';

import { useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { WeatherData, WeatherApiResponse } from '@/entities/weather';
import { mapWeatherData } from '@/entities/weather';
import { useGeolocation } from './useGeolocation';

interface UseWeatherReturn {
  weather: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

async function fetchWeather(
  latitude: number,
  longitude: number,
): Promise<WeatherData> {
  const { data } = await axios.get<WeatherApiResponse>('/api/weather', {
    params: { lat: latitude, lon: longitude },
  });
  return mapWeatherData(data);
}

export function useWeather(): UseWeatherReturn {
  const {
    coordinates,
    error: geoError,
    isLoading: geoLoading,
    requestLocation,
  } = useGeolocation();

  const {
    data: weather,
    error: queryError,
    isLoading: queryLoading,
    refetch: queryRefetch,
  } = useQuery({
    queryKey: ['weather', coordinates?.latitude, coordinates?.longitude],
    queryFn: () => fetchWeather(coordinates!.latitude, coordinates!.longitude),
    enabled: !!coordinates,
  });

  // 마운트 시 위치 요청
  useEffect(() => {
    requestLocation().catch(() => {
      // useGeolocation 내부에서 에러 처리됨
    });
  }, [requestLocation]);

  const refetch = useCallback(() => {
    if (coordinates) {
      queryRefetch();
    } else {
      requestLocation().catch(() => {
        // useGeolocation 내부에서 에러 처리됨
      });
    }
  }, [coordinates, queryRefetch, requestLocation]);

  const error = geoError ?? (queryError ? (queryError instanceof Error ? queryError.message : '날씨 데이터를 가져올 수 없습니다') : null);

  return {
    weather: weather ?? null,
    isLoading: geoLoading || queryLoading,
    error,
    refetch,
  };
}
