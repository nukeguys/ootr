interface RecommendationLogicProps {
  reason: string;
}

export function RecommendationLogic({ reason }: RecommendationLogicProps) {
  return (
    <div className="max-w-xl">
      <h4 className="text-[10px] uppercase tracking-widest font-bold text-accent mb-3 flex items-center gap-2">
        Logic <span className="h-px w-8 bg-border" />
      </h4>
      <p className="text-sm md:text-base text-accent font-light leading-relaxed font-kr">
        {reason}
      </p>
    </div>
  );
}
