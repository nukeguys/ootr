'use client';

import { useMemo } from 'react';
import { useWeather } from '@/features/get-weather';
import { recommend } from '@/features/recommendation';
import { OutfitRecommendation, OutfitRecommendationSkeleton } from '@/widgets/outfit-recommendation';
import { RecommendationFooter, RecommendationFooterSkeleton } from '@/widgets/recommendation-footer';
import { WeatherSection } from './WeatherSection';

export function HomePage() {
  const { weather, isLoading } = useWeather();
  const recommendation = useMemo(
    () => (weather ? recommend(weather) : null),
    [weather],
  );

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col px-6 py-8 md:px-12 md:py-16 min-h-screen">
      <WeatherSection />
      {recommendation ? (
        <>
          <OutfitRecommendation outfitSet={recommendation.outfitSet} />
          <RecommendationFooter reason={recommendation.reason} />
        </>
      ) : isLoading ? (
        <>
          <OutfitRecommendationSkeleton />
          <RecommendationFooterSkeleton />
        </>
      ) : null}
    </div>
  );
}
