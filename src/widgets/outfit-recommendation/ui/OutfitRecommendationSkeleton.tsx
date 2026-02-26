import { Skeleton } from '@/shared/ui/Skeleton';

function OutfitItemSkeleton({ label }: { label: string }) {
  return (
    <div className="group py-2">
      <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold block mb-2 opacity-50">
        {label}
      </span>
      <Skeleton className="w-48 md:w-64 h-7 md:h-9" />
    </div>
  );
}

export function OutfitRecommendationSkeleton() {
  return (
    <main className="flex-1 flex flex-col py-10 md:py-14">
      <div className="max-w-2xl w-full">
        <h2 className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-accent font-bold mb-8 opacity-60">
          Recommended Outfit
        </h2>
        <div className="space-y-6 md:space-y-8">
          <OutfitItemSkeleton label="Top" />
          <OutfitItemSkeleton label="Bottom" />
          <OutfitItemSkeleton label="Accessories" />
        </div>
      </div>
    </main>
  );
}
