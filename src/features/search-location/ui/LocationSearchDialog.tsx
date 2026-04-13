'use client';

import { useCallback } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import type { Location } from '@/entities/location';
import { useLocationSearch } from '@/features/search-location';

interface LocationSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (location: Location) => void;
}

// 내부 콘텐츠: open일 때만 마운트되어 매번 검색 상태 초기화
function SearchContent({
  onSelect,
  onClose,
}: {
  onSelect: (location: Location) => void;
  onClose: () => void;
}) {
  const { query, setQuery, results, isLoading } = useLocationSearch();

  const handleSelect = useCallback(
    (location: Location) => {
      onSelect(location);
      onClose();
    },
    [onSelect, onClose],
  );

  return (
    <>
      {/* 검색 입력 */}
      <div className="p-4 border-b border-border">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="어디서 달릴까요? (장소명·주소)"
          className="w-full bg-transparent text-foreground text-sm outline-none placeholder:text-accent font-kr tracking-wide"
          autoFocus
        />
      </div>

      {/* 검색 결과 */}
      <div className="overflow-y-auto flex-1">
        {isLoading && (
          <p className="p-4 text-xs text-accent text-center">검색 중...</p>
        )}

        {!isLoading && query.length >= 2 && results.length === 0 && (
          <p className="p-4 text-xs text-accent text-center">
            검색 결과가 없습니다
          </p>
        )}

        {results.map((location, index) => (
          <button
            key={`${location.latitude}-${location.longitude}-${index}`}
            onClick={() => handleSelect(location)}
            className="w-full text-left px-4 py-3 hover:bg-border/50 transition-colors border-b border-border/50 last:border-b-0"
          >
            <span className="block text-sm font-medium text-foreground font-kr">
              {location.name}
            </span>
            <span className="block text-[10px] text-accent mt-0.5 font-kr">
              {location.roadAddress || location.address}
            </span>
          </button>
        ))}
      </div>
    </>
  );
}

export function LocationSearchDialog({
  open,
  onOpenChange,
  onSelect,
}: LocationSearchDialogProps) {
  const handleClose = useCallback(() => onOpenChange(false), [onOpenChange]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed inset-x-4 top-[10vh] max-w-md mx-auto bg-background border border-border rounded-lg shadow-2xl z-50 flex flex-col max-h-[70vh]">
          <Dialog.Title className="sr-only">지역 검색</Dialog.Title>

          {/* open일 때만 마운트 → 닫으면 상태 자동 리셋 */}
          {open && <SearchContent onSelect={onSelect} onClose={handleClose} />}

          {/* 닫기 */}
          <div className="p-3 border-t border-border text-center">
            <Dialog.Close className="text-xs tracking-widest uppercase text-accent hover:text-foreground transition-colors py-1 px-4">
              닫기
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
