import type { Recommendation } from '@/entities/recommendation';
import { OutfitRecommendation } from '@/widgets/outfit-recommendation';
import { RecommendationFooter } from '@/widgets/recommendation-footer';
import { WeatherSection } from './WeatherSection';

interface HomePageProps {
  recommendation: Recommendation;
}

export function HomePage({ recommendation }: HomePageProps) {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col px-6 py-8 md:px-12 md:py-16 min-h-screen">
      <WeatherSection />
      <OutfitRecommendation outfitSet={recommendation.outfitSet} />
      <RecommendationFooter reason={recommendation.reason} />
    </div>
  );
}
