'use client';

import { useState, useEffect, useCallback } from 'react';
import type { WeatherData } from '@/entities/weather';
import type { OutfitSet } from '@/entities/recommendation';
import type { OutfitLogEntry } from '@/entities/outfit-log';
import {
  getAllEntries,
  addEntry,
  updateEntry,
  deleteEntry,
} from '@/entities/outfit-log';

export function useOutfitLog() {
  const [entries, setEntries] = useState<OutfitLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAllEntries()
      .then(setEntries)
      .finally(() => setIsLoading(false));
  }, []);

  const record = useCallback(
    async (weather: WeatherData, outfitSet: OutfitSet, reason: string) => {
      const entry: OutfitLogEntry = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        weather,
        outfitSet,
        reason,
        rating: null,
      };
      await addEntry(entry);
      setEntries((prev) => [entry, ...prev]);
    },
    [],
  );

  const update = useCallback(async (entry: OutfitLogEntry) => {
    await updateEntry(entry);
    setEntries((prev) => prev.map((e) => (e.id === entry.id ? entry : e)));
  }, []);

  const remove = useCallback(async (id: string) => {
    await deleteEntry(id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return { entries, isLoading, record, update, remove };
}
