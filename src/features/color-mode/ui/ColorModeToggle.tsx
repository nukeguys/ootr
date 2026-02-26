'use client';

import { useColorMode } from '../model/ColorModeContext';
import { SunIcon } from '@/shared/ui/icons/SunIcon';
import { MoonIcon } from '@/shared/ui/icons/MoonIcon';
import { trackEvent } from '@/shared/lib/analytics/trackEvent';

export function ColorModeToggle() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <button
      onClick={() => {
        toggleColorMode();
        trackEvent('click_theme_toggle', {
          color_mode: colorMode === 'light' ? 'dark' : 'light',
        });
      }}
      className="text-accent hover:text-foreground transition-colors"
      aria-label={
        colorMode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
      }
    >
      {colorMode === 'light' ? (
        <MoonIcon className="size-4" />
      ) : (
        <SunIcon className="size-4" />
      )}
    </button>
  );
}
