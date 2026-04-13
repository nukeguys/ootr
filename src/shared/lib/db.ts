// 앱 전체 IDB 데이터베이스 관리
// 모든 object store를 한 곳에서 생성하여 스키마 충돌 방지

import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'ootr';
const DB_VERSION = 2; // 기존 v1에 location store 추가

let dbPromise: Promise<IDBPDatabase> | null = null;

export const STORE_OUTFIT_LOG = 'outfit-log';
export const STORE_LOCATION = 'location';

export function getDB(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // outfit-log store
        if (!db.objectStoreNames.contains(STORE_OUTFIT_LOG)) {
          const store = db.createObjectStore(STORE_OUTFIT_LOG, { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp');
        }

        // location store
        if (!db.objectStoreNames.contains(STORE_LOCATION)) {
          db.createObjectStore(STORE_LOCATION);
        }
      },
    });
  }
  return dbPromise;
}

export function isIndexedDBAvailable(): boolean {
  return typeof indexedDB !== 'undefined';
}
