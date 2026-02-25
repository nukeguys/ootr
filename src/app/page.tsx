import { HomePage } from '@/views/home';
import { mockRecommendation } from '@/entities/recommendation';

export default function Home() {
  return <HomePage recommendation={mockRecommendation} />;
}
