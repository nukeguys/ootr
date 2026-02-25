interface OutfitItemProps {
  label: string;
  items: string[];
}

export function OutfitItem({ label, items }: OutfitItemProps) {
  return (
    <div className="group py-2">
      <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold block mb-2 opacity-50">
        {label}
      </span>
      <h3 className="font-serif italic text-2xl md:text-4xl font-normal leading-tight tracking-tight text-foreground">
        {items.join(', ')}
      </h3>
    </div>
  );
}
