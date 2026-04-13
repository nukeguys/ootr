'use client';

import { useState, useCallback } from 'react';
import { loadLastLocation } from '@/entities/location';

// 기본 위치: 서울
const DEFAULT_COORDS = { latitude: 37.5665, longitude: 126.978 };

interface Coordinates {
  latitude: number;
  longitude: number;
  isDefault?: boolean;
}

interface UseGeolocationReturn {
  coordinates: Coordinates | null;
  error: string | null;
  isLoading: boolean;
  requestLocation: () => Promise<Coordinates>;
}

export function useGeolocation(): UseGeolocationReturn {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const requestLocation = useCallback((): Promise<Coordinates> => {
    setIsLoading(true);
    setError(null);

    return new Promise<Coordinates>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: Coordinates = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setCoordinates(coords);
          setIsLoading(false);

          resolve(coords);
        },
        async () => {
          // 권한 거부 시: IDB → 서울 순으로 폴백
          const saved = await loadLastLocation();
          const fallback: Coordinates = saved
            ? { latitude: saved.latitude, longitude: saved.longitude, isDefault: true }
            : { ...DEFAULT_COORDS, isDefault: true };

          setCoordinates(fallback);
          setIsLoading(false);
          resolve(fallback);
        },
      );
    });
  }, []);

  return { coordinates, error, isLoading, requestLocation };
}
