import type { OutfitLogEntry } from '../model/types';
import { getDB, isIndexedDBAvailable, STORE_OUTFIT_LOG } from '@/shared/lib/db';

const MAX_ENTRIES = 100;

export async function getAllEntries(): Promise<OutfitLogEntry[]> {
  if (!isIndexedDBAvailable()) return [];
  const db = await getDB();
  const entries = await db.getAll(STORE_OUTFIT_LOG);
  return entries.sort((a, b) => b.timestamp - a.timestamp);
}

export async function addEntry(entry: OutfitLogEntry): Promise<void> {
  if (!isIndexedDBAvailable()) return;
  const db = await getDB();
  const tx = db.transaction(STORE_OUTFIT_LOG, 'readwrite');
  const store = tx.objectStore(STORE_OUTFIT_LOG);

  await store.add(entry);

  // 최대 항목 수 초과 시 오래된 순 삭제
  const index = store.index('timestamp');
  const count = await store.count();
  if (count > MAX_ENTRIES) {
    const cursor = index.openCursor();
    let deleteCount = count - MAX_ENTRIES;
    let c = await cursor;
    while (c && deleteCount > 0) {
      await c.delete();
      deleteCount--;
      c = await c.continue();
    }
  }

  await tx.done;
}

export async function updateEntry(entry: OutfitLogEntry): Promise<void> {
  if (!isIndexedDBAvailable()) return;
  const db = await getDB();
  await db.put(STORE_OUTFIT_LOG, entry);
}

export async function deleteEntry(id: string): Promise<void> {
  if (!isIndexedDBAvailable()) return;
  const db = await getDB();
  await db.delete(STORE_OUTFIT_LOG, id);
}
