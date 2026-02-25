export function WeatherLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="size-6 border-2 border-accent border-t-foreground rounded-full animate-spin" />
      <span className="text-xs tracking-widest uppercase text-accent">
        Loading weather
      </span>
    </div>
  );
}
