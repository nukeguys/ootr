import { openDB, type IDBPDatabase } from 'idb';
import type { OutfitLogEntry } from '../model/types';

const DB_NAME = 'ootr';
const STORE_NAME = 'outfit-log';
const DB_VERSION = 1;
const MAX_ENTRIES = 100;

function isIndexedDBAvailable(): boolean {
  return typeof indexedDB !== 'undefined';
}

function getDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('timestamp', 'timestamp');
      }
    },
  });
}

export async function getAllEntries(): Promise<OutfitLogEntry[]> {
  if (!isIndexedDBAvailable()) return [];
  const db = await getDB();
  const entries = await db.getAll(STORE_NAME);
  return entries.sort((a, b) => b.timestamp - a.timestamp);
}

export async function addEntry(entry: OutfitLogEntry): Promise<void> {
  if (!isIndexedDBAvailable()) return;
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);

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
  await db.put(STORE_NAME, entry);
}

export async function deleteEntry(id: string): Promise<void> {
  if (!isIndexedDBAvailable()) return;
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}
