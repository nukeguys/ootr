import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Home from './page';
import { mockWeatherData } from '@/entities/weather';

vi.mock('@/features/color-mode', () => ({
  ColorModeProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  ColorModeToggle: () => <button aria-label="Switch to dark mode" />,
  useColorMode: () => ({ colorMode: 'light', toggleColorMode: vi.fn() }),
}));

vi.mock('@/features/get-weather', () => ({
  useWeather: () => ({
    weather: mockWeatherData,
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  }),
}));

describe('Home', () => {
  it('OOTR 로고가 렌더링된다', () => {
    render(<Home />);
    expect(screen.getByText('OOTR')).toBeInTheDocument();
  });

  it('날씨 정보가 표시된다', () => {
    render(<Home />);
    expect(screen.getByText('17°')).toBeInTheDocument();
    expect(screen.getByText('14°')).toBeInTheDocument();
    expect(screen.getByText('Clear Sky')).toBeInTheDocument();
  });

  it('복장 추천이 표시된다', () => {
    render(<Home />);
    expect(screen.getByText('Recommended Outfit')).toBeInTheDocument();
    expect(screen.getByText('긴팔 기능성 베이스레이어')).toBeInTheDocument();
    expect(
      screen.getByText('5인치 언라인드 퍼포먼스 쇼츠'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('테크니컬 캡, 물집 방지 양말'),
    ).toBeInTheDocument();
  });

  it('추천 이유가 표시된다', () => {
    render(<Home />);
    expect(screen.getByText(/온화한 기온에 낮은 습도로/)).toBeInTheDocument();
  });
});
