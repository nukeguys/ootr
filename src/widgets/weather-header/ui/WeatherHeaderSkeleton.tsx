import { Skeleton } from '@/shared/ui/Skeleton';
import { LogoBar } from './LogoBar';

export function WeatherHeaderSkeleton() {
  return (
    <header className="w-full">
      <LogoBar />
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border pb-8">
        <div className="flex items-baseline gap-4">
          <Skeleton className="w-14 h-12 md:w-36 md:h-16" />
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-widest font-semibold text-accent">
              Feels Like
            </span>
            <Skeleton className="w-10 h-5" />
          </div>
        </div>
        <div className="flex gap-8 md:gap-12">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest font-semibold text-accent mb-1">
              Wind
            </span>
            <Skeleton className="w-14 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest font-semibold text-accent mb-1">
              Precip
            </span>
            <Skeleton className="w-14 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest font-semibold text-accent mb-1">
              Conditions
            </span>
            <Skeleton className="w-14 h-5" />
          </div>
        </div>
      </div>
    </header>
  );
}
