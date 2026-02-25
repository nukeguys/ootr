import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { useWeather } from './useWeather';

vi.mock('axios');
const mockedAxios = vi.mocked(axios);

const mockWeatherApiResponse = {
  location: { name: 'Seoul' },
  current: {
    temp_c: 17,
    feelslike_c: 14,
    precip_mm: 0,
    wind_kph: 8,
    humidity: 45,
    uv: 3,
    is_day: 1,
    condition: { text: 'Clear Sky' },
  },
};

// Geolocation mock
const mockGetCurrentPosition = vi.fn();

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }
  return Wrapper;
}

beforeEach(() => {
  vi.restoreAllMocks();

  Object.defineProperty(navigator, 'geolocation', {
    value: { getCurrentPosition: mockGetCurrentPosition },
    writable: true,
    configurable: true,
  });
});

function setupGeolocationSuccess(lat = 37.5665, lon = 126.978) {
  mockGetCurrentPosition.mockImplementation((success) => {
    success({ coords: { latitude: lat, longitude: lon } });
  });
}

function setupGeolocationDenied() {
  mockGetCurrentPosition.mockImplementation((_, error) => {
    error({ code: 1, PERMISSION_DENIED: 1 });
  });
}

function setupAxiosSuccess(data = mockWeatherApiResponse) {
  mockedAxios.get.mockResolvedValue({ data });
}

function setupAxiosError(message = '서버 오류') {
  const error = new Error(message);
  mockedAxios.get.mockRejectedValue(error);
}

describe('useWeather', () => {
  it('마운트 시 위치를 요청하고 날씨를 조회한다', async () => {
    setupGeolocationSuccess();
    setupAxiosSuccess();

    const { result } = renderHook(() => useWeather(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.weather).not.toBeNull();
    });

    expect(result.current.weather!.temperature).toBe(17);
    expect(result.current.weather!.locationName).toBe('Seoul');
    expect(result.current.error).toBeNull();
  });

  it('위치 권한 거부 시 에러 메시지를 반환한다', async () => {
    setupGeolocationDenied();

    const { result } = renderHook(() => useWeather(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.error).toBe('위치 권한이 필요합니다');
    });

    expect(result.current.weather).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('API 에러 시 에러 메시지를 반환한다', async () => {
    setupGeolocationSuccess();
    setupAxiosError();

    const { result } = renderHook(() => useWeather(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
    });

    expect(result.current.weather).toBeNull();
  });

  it('refetch 호출 시 날씨를 다시 조회한다', async () => {
    setupGeolocationSuccess();
    setupAxiosSuccess();

    const { result } = renderHook(() => useWeather(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.weather).not.toBeNull();
    });

    const updatedResponse = {
      ...mockWeatherApiResponse,
      current: { ...mockWeatherApiResponse.current, temp_c: 20 },
    };
    mockedAxios.get.mockResolvedValue({ data: updatedResponse });

    await act(async () => {
      result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.weather!.temperature).toBe(20);
    });
  });
});
