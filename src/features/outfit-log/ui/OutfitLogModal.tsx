'use client';

import * as Dialog from '@radix-ui/react-dialog';
import type { ReactNode } from 'react';
import type { WeatherData } from '@/entities/weather';
import type { OutfitSet } from '@/entities/recommendation';
import { trackEvent } from '@/shared/lib/analytics/trackEvent';
import { useOutfitLog } from '../model/useOutfitLog';
import { OutfitLogList } from './OutfitLogList';

interface OutfitLogModalProps {
  weather: WeatherData;
  outfitSet: OutfitSet;
  reason: string;
  trigger: ReactNode;
}

export function OutfitLogModal({
  weather,
  outfitSet,
  reason,
  trigger,
}: OutfitLogModalProps) {
  const { entries, record, update, remove } = useOutfitLog();

  const handleRecord = async () => {
    await record(weather, outfitSet, reason);
    trackEvent('outfit_log_record');
  };

  const handleDelete = async (id: string) => {
    await remove(id);
    trackEvent('outfit_log_delete');
  };

  const handleUpdate = async (entry: Parameters<typeof update>[0]) => {
    await update(entry);
  };

  const totalCount = entries.length;

  const handleExport = () => {
    const json = JSON.stringify(entries, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `running-log-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    trackEvent('outfit_log_export');
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md max-h-[85vh] flex flex-col rounded-xl bg-background border border-border shadow-lg focus:outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
          <div className="shrink-0 p-6 pb-4">
            <Dialog.Title className="text-sm font-bold tracking-[0.2em] uppercase text-foreground">
              Running Log
            </Dialog.Title>

            {totalCount > 0 && (
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-accent">
                  총 {totalCount}회 기록
                </p>
                <button
                  type="button"
                  onClick={handleExport}
                  className="text-xs text-accent/40 hover:text-foreground transition-colors"
                >
                  Export
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={handleRecord}
              className="w-full mt-4 py-2.5 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity font-kr"
            >
              현재 복장 기록하기
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <OutfitLogList
              entries={entries}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          </div>

          <Dialog.Close className="absolute top-4 right-4 text-accent hover:text-foreground transition-colors">
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              />
            </svg>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
