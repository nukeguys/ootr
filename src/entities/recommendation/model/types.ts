export interface OutfitSet {
  top: string[];
  bottom: string[];
  accessories: string[];
}

export interface Recommendation {
  outfitSet: OutfitSet;
  reason: string;
  warnings: string[];
  isExtremeWeather: boolean;
  createdAt: number;
}
