import type { WeatherData } from '@/entities/weather';
import { LogoBar } from './LogoBar';
import { WeatherSummary } from './WeatherSummary';

interface WeatherHeaderProps {
  weather: WeatherData;
  onRefresh?: () => void;
}

export function WeatherHeader({ weather, onRefresh }: WeatherHeaderProps) {
  return (
    <header className="w-full">
      <LogoBar onRefresh={onRefresh} />
      <WeatherSummary weather={weather} />
    </header>
  );
}
