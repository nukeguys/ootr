interface WeatherMetaProps {
  locationName?: string;
  updatedAt?: number;
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function WeatherMeta({ locationName, updatedAt }: WeatherMetaProps) {
  if (!updatedAt) return null;

  return (
    <p className="text-[10px] tracking-widest text-accent text-right mb-4 md:mb-6">
      {locationName && `${locationName} · `}
      {formatTime(updatedAt)}
    </p>
  );
}
