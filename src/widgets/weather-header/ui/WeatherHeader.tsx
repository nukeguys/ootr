import type { WeatherData } from '@/entities/weather';
import { LogoBar } from './LogoBar';
import { WeatherMeta } from './WeatherMeta';
import { WeatherSummary } from './WeatherSummary';

interface WeatherHeaderProps {
  weather: WeatherData;
}

export function WeatherHeader({ weather }: WeatherHeaderProps) {
  return (
    <header className="w-full">
      <LogoBar />
      <WeatherMeta locationName={weather.locationName} updatedAt={weather.updatedAt} />
      <WeatherSummary weather={weather} />
    </header>
  );
}
