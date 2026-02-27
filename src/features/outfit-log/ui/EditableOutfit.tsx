'use client';

import { useState, useRef, useEffect } from 'react';

interface EditableOutfitProps {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
}

export function EditableOutfit({ label, items, onChange }: EditableOutfitProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  if (items.length === 0) return null;

  const startEdit = () => {
    setDraft(items.join(', '));
    setIsEditing(true);
  };

  const commit = () => {
    const next = draft
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (next.length > 0) {
      onChange(next);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') commit();
    if (e.key === 'Escape') setIsEditing(false);
  };

  return (
    <div className="flex items-start gap-2 text-sm">
      <span className="text-accent shrink-0">{label}:</span>
      {isEditing ? (
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-b border-accent text-foreground text-sm outline-none px-0 py-0"
        />
      ) : (
        <button
          type="button"
          onClick={startEdit}
          className="text-foreground hover:text-accent transition-colors text-left"
        >
          {items.join(', ')}
          <span className="ml-1 text-accent opacity-0 group-hover/item:opacity-50 text-xs">
            ✏️
          </span>
        </button>
      )}
    </div>
  );
}
