'use client';

import { useState } from 'react';
import { SearchIcon } from '@/shared/ui/icons/SearchIcon';
import type { Location } from '@/entities/location';
import { LocationSearchDialog } from '@/features/search-location';
import { sendGTMEvent } from '@next/third-parties/google';

interface WeatherMetaProps {
  locationName?: string;
  updatedAt?: number;
  onLocationChange?: (location: Location) => void;
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function WeatherMeta({ locationName, updatedAt, onLocationChange }: WeatherMetaProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSearchClick = () => {
    sendGTMEvent({ event: 'click_location_search' });
    setSearchOpen(true);
  };

  if (!updatedAt) return null;

  return (
    <>
      <div className="flex items-center justify-end gap-2 mb-4 md:mb-6">
        {onLocationChange && (
          <button
            onClick={handleSearchClick}
            className="text-accent hover:text-foreground transition-colors"
            aria-label="지역 검색"
          >
            <SearchIcon className="size-3" />
          </button>
        )}
        <p className="text-[10px] tracking-widest text-accent">
          {locationName && `${locationName} · `}
          {formatTime(updatedAt)}
        </p>
      </div>

      {onLocationChange && (
        <LocationSearchDialog
          open={searchOpen}
          onOpenChange={setSearchOpen}
          onSelect={onLocationChange}
        />
      )}
    </>
  );
}
