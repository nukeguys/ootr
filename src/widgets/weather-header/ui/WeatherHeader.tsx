import type { WeatherData } from '@/entities/weather';
import type { Location } from '@/entities/location';
import { LogoBar } from './LogoBar';
import { WeatherMeta } from './WeatherMeta';
import { WeatherSummary } from './WeatherSummary';

interface WeatherHeaderProps {
  weather: WeatherData;
  onLocationChange?: (location: Location) => void;
}

export function WeatherHeader({ weather, onLocationChange }: WeatherHeaderProps) {
  return (
    <header className="w-full">
      <LogoBar />
      <WeatherMeta
        locationName={weather.locationName}
        updatedAt={weather.updatedAt}
        onLocationChange={onLocationChange}
      />
      <WeatherSummary weather={weather} />
    </header>
  );
}
