import { RecommendationComment } from './RecommendationComment';
import { FooterBar } from './FooterBar';

interface RecommendationFooterProps {
  reason: string;
}

export function RecommendationFooter({ reason }: RecommendationFooterProps) {
  return (
    <footer className="w-full space-y-10 md:space-y-14 mt-auto">
      <RecommendationComment reason={reason} />
      <FooterBar />
    </footer>
  );
}
