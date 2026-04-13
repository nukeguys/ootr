import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { useWeather } from './useWeather';

vi.mock('axios');
const mockedGet = vi.mocked(axios.get);

// 통합 응답 포맷 mock
const mockUnifiedResponse = {
  location: { name: 'Seoul' },
  temperature: 17,
  feelsLike: 14,
  windSpeed: 2,
  humidity: 45,
  precipitation: 0,
  condition: '맑음',
  isSnow: false,
  uvIndex: 3,
  isDay: true,
  airQuality: { pm10: 35, pm2_5: 20 },
};

// Geolocation mock
const mockGetCurrentPosition = vi.fn();

// IDB mock
vi.mock('@/entities/location', () => ({
  saveLastLocation: vi.fn(),
  loadLastLocation: vi.fn().mockResolvedValue(null),
}));

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

function setupAxiosSuccess(data = mockUnifiedResponse) {
  mockedGet.mockResolvedValue({ data });
}

function setupAxiosError(message = '서버 오류') {
  const error = new Error(message);
  mockedGet.mockRejectedValue(error);
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

  it('위치 권한 거부 시 기본 위치(서울)로 폴백하여 날씨를 조회한다', async () => {
    setupGeolocationDenied();
    setupAxiosSuccess();

    const { result } = renderHook(() => useWeather(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.weather).not.toBeNull();
    });

    // 서울 폴백으로 날씨 조회 성공
    expect(result.current.weather!.temperature).toBe(17);
    expect(result.current.isDefaultLocation).toBe(true);
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

  it('setLocation 호출 시 해당 좌표로 날씨를 다시 조회한다', async () => {
    setupGeolocationSuccess();
    setupAxiosSuccess();

    const { result } = renderHook(() => useWeather(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.weather).not.toBeNull();
    });

    const updatedResponse = {
      ...mockUnifiedResponse,
      temperature: 20,
      location: { name: '강남구, 서울특별시' },
    };
    mockedGet.mockResolvedValue({ data: updatedResponse });

    await act(async () => {
      result.current.setLocation(37.498, 127.028, '강남구');
    });

    await waitFor(() => {
      expect(result.current.weather!.temperature).toBe(20);
    });
  });
});
