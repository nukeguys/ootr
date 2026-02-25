import type { OutfitSet } from '@/entities/recommendation';
import { OutfitItem } from './OutfitItem';

interface OutfitRecommendationProps {
  outfitSet: OutfitSet;
}

export function OutfitRecommendation({ outfitSet }: OutfitRecommendationProps) {
  return (
    <main className="flex-1 flex flex-col py-10 md:py-14">
      <div className="max-w-2xl w-full">
        <h2 className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-accent font-bold mb-8 opacity-60">
          Recommended Outfit
        </h2>
        <div className="space-y-6 md:space-y-8">
          <OutfitItem label="Top" items={outfitSet.top} />
          <OutfitItem label="Bottom" items={outfitSet.bottom} />
          <OutfitItem label="Accessories" items={outfitSet.accessories} />
        </div>
      </div>
    </main>
  );
}
