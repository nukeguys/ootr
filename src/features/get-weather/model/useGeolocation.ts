'use client';

import { useState, useCallback } from 'react';

interface Coordinates {
  latitude: number;
  longitude: number;
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

    return new Promise<Coordinates>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setCoordinates(coords);
          setIsLoading(false);
          resolve(coords);
        },
        (err) => {
          const message =
            err.code === err.PERMISSION_DENIED
              ? '위치 권한이 필요합니다'
              : '위치 정보를 가져올 수 없습니다';
          setError(message);
          setIsLoading(false);
          reject(new Error(message));
        },
      );
    });
  }, []);

  return { coordinates, error, isLoading, requestLocation };
}
