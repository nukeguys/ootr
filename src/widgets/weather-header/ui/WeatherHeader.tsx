import type { WeatherData } from '@/entities/weather';
import { LogoBar } from './LogoBar';
import { WeatherSummary } from './WeatherSummary';

interface WeatherHeaderProps {
  weather: WeatherData;
}

export function WeatherHeader({ weather }: WeatherHeaderProps) {
  return (
    <header className="w-full">
      <LogoBar />
      <WeatherSummary weather={weather} />
    </header>
  );
}
