'use client';

import { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { WeatherData } from '@/entities/weather';
import type { UnifiedWeatherResponse } from '@/entities/weather/api/unified/types';
import { mapWeatherData } from '@/entities/weather';
import { saveLastLocation } from '@/entities/location';
import { useGeolocation } from './useGeolocation';

interface UseWeatherReturn {
  weather: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  isDefaultLocation: boolean;
  setLocation: (lat: number, lon: number, name?: string) => void;
  refetch: () => void;
}

async function fetchWeather(
  latitude: number,
  longitude: number,
): Promise<WeatherData> {
  const { data } = await axios.get<UnifiedWeatherResponse>('/api/weather', {
    params: { lat: latitude, lon: longitude },
  });
  return mapWeatherData(data);
}

export function useWeather(): UseWeatherReturn {
  const {
    coordinates,
    isLoading: geoLoading,
    requestLocation,
  } = useGeolocation();

  // 외부에서 좌표를 주입할 수 있는 상태
  const [overrideCoords, setOverrideCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // 실제 사용할 좌표: override > geolocation
  const activeCoords = overrideCoords ?? coordinates;
  const isDefaultLocation = !overrideCoords && (coordinates?.isDefault ?? false);

  const {
    data: weather,
    error: queryError,
    isLoading: queryLoading,
    refetch: queryRefetch,
  } = useQuery({
    queryKey: ['weather', activeCoords?.latitude, activeCoords?.longitude],
    queryFn: () => fetchWeather(activeCoords!.latitude, activeCoords!.longitude),
    enabled: !!activeCoords,
  });

  // 마운트 시 위치 요청
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  // 날씨 조회 성공 시, GPS로 받은 위치의 locationName을 IDB에 업데이트
  useEffect(() => {
    if (weather && coordinates && !coordinates.isDefault && !overrideCoords) {
      saveLastLocation({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        name: weather.locationName,
        savedAt: Date.now(),
      });
    }
  }, [weather, coordinates, overrideCoords]);

  const setLocation = useCallback(
    (lat: number, lon: number, name?: string) => {
      setOverrideCoords({ latitude: lat, longitude: lon });

      // 검색으로 선택한 위치를 IDB에 저장
      saveLastLocation({
        latitude: lat,
        longitude: lon,
        name: name ?? '',
        savedAt: Date.now(),
      });
    },
    [],
  );

  const refetch = useCallback(() => {
    if (activeCoords) {
      queryRefetch();
    } else {
      requestLocation();
    }
  }, [activeCoords, queryRefetch, requestLocation]);

  const error = queryError
    ? queryError instanceof Error
      ? queryError.message
      : '날씨 데이터를 가져올 수 없습니다'
    : null;

  return {
    weather: weather ?? null,
    isLoading: geoLoading || queryLoading,
    error,
    isDefaultLocation,
    setLocation,
    refetch,
  };
}
