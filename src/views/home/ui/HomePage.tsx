import type { WeatherData } from '@/entities/weather';
import type { Recommendation } from '@/entities/recommendation';
import { WeatherHeader } from '@/widgets/weather-header';
import { OutfitRecommendation } from '@/widgets/outfit-recommendation';
import { RecommendationFooter } from '@/widgets/recommendation-footer';
interface HomePageProps {
  weather: WeatherData;
  recommendation: Recommendation;
}

export function HomePage({ weather, recommendation }: HomePageProps) {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col px-6 py-8 md:px-12 md:py-16 min-h-screen">
      <WeatherHeader weather={weather} />
      <OutfitRecommendation outfitSet={recommendation.outfitSet} />
      <RecommendationFooter reason={recommendation.reason} />
    </div>
  );
}
