import { Skeleton } from '@/shared/ui/Skeleton';
import { FooterBar } from './FooterBar';

export function RecommendationFooterSkeleton() {
  return (
    <footer className="w-full space-y-10 md:space-y-14 mt-auto">
      <div className="max-w-xl">
        <h4 className="text-[10px] uppercase tracking-widest font-bold text-accent mb-3 flex items-center gap-2">
          COMMENT <span className="h-px w-8 bg-border" />
        </h4>
        <div className="space-y-2">
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-4/5 h-4" />
          <Skeleton className="w-3/5 h-4" />
        </div>
      </div>
      <FooterBar />
    </footer>
  );
}
