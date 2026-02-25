'use client';

import { useColorMode } from '../model/ColorModeContext';
import { SunIcon } from '@/shared/ui/icons/SunIcon';
import { MoonIcon } from '@/shared/ui/icons/MoonIcon';

export function ColorModeToggle() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <button
      onClick={toggleColorMode}
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
