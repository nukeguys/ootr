'use client';

const RATINGS = [
  { value: 1, label: '추움', selected: 'text-blue-500' },
  { value: 2, label: '쌀쌀', selected: 'text-blue-400' },
  { value: 3, label: '적절', selected: 'text-green-500' },
  { value: 4, label: '따뜻', selected: 'text-orange-400' },
  { value: 5, label: '더움', selected: 'text-red-500' },
] as const;

interface RatingSelectorProps {
  value: number | null;
  onChange: (rating: number | null) => void;
}

export function RatingSelector({ value, onChange }: RatingSelectorProps) {
  return (
    <div className="flex items-center text-xs font-kr">
      {RATINGS.map(({ value: v, label, selected }, i) => (
        <span key={v} className="flex items-center">
          {i > 0 && <span className="text-border">|</span>}
          <button
            type="button"
            onClick={() => onChange(value === v ? null : v)}
            className={`px-1 transition-colors ${
              value === v ? `${selected} font-bold` : 'text-accent/40'
            }`}
          >
            {label}
          </button>
        </span>
      ))}
    </div>
  );
}
