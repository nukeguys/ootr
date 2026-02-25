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

vi.mock('@/features/recommendation', () => ({
  recommend: () => ({
    outfitSet: {
      top: ['긴팔 티셔츠'],
      bottom: ['쇼츠'],
      accessories: [],
    },
    reason: '체감온도 14°C 기준으로 추천되었습니다.',
    warnings: [],
    isExtremeWeather: false,
    createdAt: Date.now(),
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
    expect(screen.getByText('긴팔 티셔츠')).toBeInTheDocument();
    expect(screen.getByText('쇼츠')).toBeInTheDocument();
  });

  it('추천 이유가 표시된다', () => {
    render(<Home />);
    expect(screen.getByText(/체감온도 14°C/)).toBeInTheDocument();
  });
});
