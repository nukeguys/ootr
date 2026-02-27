'use client';

import type { OutfitLogEntry } from '@/entities/outfit-log';
import { OutfitLogItem } from './OutfitLogItem';

interface OutfitLogListProps {
  entries: OutfitLogEntry[];
  onUpdate: (entry: OutfitLogEntry) => void;
  onDelete: (id: string) => void;
}

export function OutfitLogList({ entries, onUpdate, onDelete }: OutfitLogListProps) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-accent text-center py-8">
        아직 기록이 없습니다
      </p>
    );
  }

  return (
    <div className="space-y-1">
      {entries.map((entry) => (
        <OutfitLogItem
          key={entry.id}
          entry={entry}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
