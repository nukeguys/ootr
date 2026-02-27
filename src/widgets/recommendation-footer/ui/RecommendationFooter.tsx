import type { WeatherData } from '@/entities/weather';
import type { OutfitSet } from '@/entities/recommendation';
import { RecommendationComment } from './RecommendationComment';
import { FooterBar } from './FooterBar';

interface RecommendationFooterProps {
  weather: WeatherData;
  outfitSet: OutfitSet;
  reason: string;
}

export function RecommendationFooter({ weather, outfitSet, reason }: RecommendationFooterProps) {
  return (
    <footer className="w-full space-y-10 md:space-y-14 mt-auto">
      <RecommendationComment reason={reason} />
      <FooterBar weather={weather} outfitSet={outfitSet} reason={reason} />
    </footer>
  );
}
