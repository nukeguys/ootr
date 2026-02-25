interface WeatherErrorProps {
  message: string;
  onRetry: () => void;
}

export function WeatherError({ message, onRetry }: WeatherErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <p className="text-sm text-accent">{message}</p>
      <button
        onClick={onRetry}
        className="text-xs tracking-widest uppercase text-foreground underline underline-offset-4 hover:text-accent transition-colors"
      >
        다시 시도
      </button>
    </div>
  );
}
