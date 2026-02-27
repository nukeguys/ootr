'use client';

import type { OutfitLogEntry } from '@/entities/outfit-log';
import type { OutfitSet } from '@/entities/recommendation';
import { EditableOutfit } from './EditableOutfit';
import { RatingSelector } from './RatingSelector';

interface OutfitLogItemProps {
  entry: OutfitLogEntry;
  onUpdate: (entry: OutfitLogEntry) => void;
  onDelete: (id: string) => void;
}

function formatDate(timestamp: number): string {
  const d = new Date(timestamp);
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function formatWeatherSummary(entry: OutfitLogEntry): string {
  const { weather } = entry;
  return `${weather.locationName} · ${weather.temperature}°C ${weather.condition}`;
}

export function OutfitLogItem({ entry, onUpdate, onDelete }: OutfitLogItemProps) {
  const handleOutfitChange = (category: keyof OutfitSet, items: string[]) => {
    onUpdate({
      ...entry,
      outfitSet: { ...entry.outfitSet, [category]: items },
    });
  };

  const handleRatingChange = (rating: number | null) => {
    onUpdate({ ...entry, rating });
  };

  return (
    <div className="group/item border-t border-border pt-4 pb-3 space-y-2">
      <div className="text-xs text-accent">
        {formatDate(entry.timestamp)} · {formatWeatherSummary(entry)}
      </div>

      <div className="space-y-1">
        <EditableOutfit
          label="상의"
          items={entry.outfitSet.top}
          onChange={(items) => handleOutfitChange('top', items)}
        />
        <EditableOutfit
          label="하의"
          items={entry.outfitSet.bottom}
          onChange={(items) => handleOutfitChange('bottom', items)}
        />
        <EditableOutfit
          label="악세서리"
          items={entry.outfitSet.accessories}
          onChange={(items) => handleOutfitChange('accessories', items)}
        />
      </div>

      <div className="flex items-center justify-between">
        <RatingSelector value={entry.rating} onChange={handleRatingChange} />
        <button
          type="button"
          onClick={() => {
            if (window.confirm('이 기록을 삭제할까요?')) {
              onDelete(entry.id);
            }
          }}
          className="text-xs text-accent/40 hover:text-red-500 transition-colors"
        >
          삭제
        </button>
      </div>
    </div>
  );
}
