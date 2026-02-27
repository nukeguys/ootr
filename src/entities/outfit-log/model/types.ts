import type { WeatherData } from '@/entities/weather';
import type { OutfitSet } from '@/entities/recommendation';

export interface OutfitLogEntry {
  id: string;
  timestamp: number;
  weather: WeatherData;
  outfitSet: OutfitSet;
  reason: string;
  rating: number | null; // 1~5 (1=추웠다, 3=적절, 5=더웠다)
}

export interface OutfitLogStore {
  version: 1;
  entries: OutfitLogEntry[];
}
