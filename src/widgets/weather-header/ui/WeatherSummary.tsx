import type { WeatherData } from '@/entities/weather';

interface WeatherSummaryProps {
  weather: WeatherData;
}

export function WeatherSummary({ weather }: WeatherSummaryProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border pb-8">
      <div className="flex items-baseline gap-4">
        <span className="text-5xl md:text-7xl font-extralight tracking-tighter">
          {weather.temperature}°
        </span>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest font-semibold text-accent">
            Feels Like
          </span>
          <span className="text-lg font-light italic">
            {weather.feelsLike}°
          </span>
        </div>
      </div>
      <div className="flex gap-8 md:gap-12">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest font-semibold text-accent mb-1">
            Wind
          </span>
          <span className="text-sm md:text-base font-light">
            {weather.windSpeed} <span className="text-[10px]">m/s</span>
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest font-semibold text-accent mb-1">
            Precip
          </span>
          <span className="text-sm md:text-base font-light">
            {weather.precipitation} <span className="text-[10px]">mm</span>
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest font-semibold text-accent mb-1">
            Conditions
          </span>
          <span className="text-sm md:text-base font-light">
            {weather.condition}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest font-semibold text-accent mb-1">
            PM10
          </span>
          <span className="text-sm md:text-base font-light">
            {weather.pm10} <span className="text-[10px]">μg/m³</span>
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest font-semibold text-accent mb-1">
            PM2.5
          </span>
          <span className="text-sm md:text-base font-light">
            {weather.pm25} <span className="text-[10px]">μg/m³</span>
          </span>
        </div>
      </div>
    </div>
  );
}
