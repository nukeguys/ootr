import { RefreshIcon } from '@/shared/ui/icons/RefreshIcon';
import { ColorModeToggle } from '@/features/color-mode';

export function LogoBar() {
  return (
    <div className="flex items-center justify-between mb-8 md:mb-12">
      <div className="flex items-center gap-3">
        <div className="size-2 bg-foreground rounded-full" />
        <h1 className="text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase">
          OOTR
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <button
          className="text-accent hover:text-foreground transition-colors"
          aria-label="Refresh"
          onClick={() => window.location.reload()}
        >
          <RefreshIcon className="size-[18px]" />
        </button>
        <ColorModeToggle />
      </div>
    </div>
  );
}
