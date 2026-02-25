import { HomePage } from '@/views/home';
import { mockWeatherData } from '@/entities/weather';
import { mockRecommendation } from '@/entities/recommendation';

export default function Home() {
  return (
    <HomePage weather={mockWeatherData} recommendation={mockRecommendation} />
  );
}
