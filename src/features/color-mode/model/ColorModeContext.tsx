'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from 'react';

type ColorMode = 'light' | 'dark';

interface ColorModeContextValue {
  colorMode: ColorMode;
  toggleColorMode: () => void;
}

const ColorModeContext = createContext<ColorModeContextValue | null>(null);

function resolveColorMode(): ColorMode {
  const stored = localStorage.getItem('color-mode');
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

// colorMode를 외부 스토어로 관리하여 SSR/hydration 불일치 없이 동기화
let currentMode: ColorMode = 'light';
const listeners = new Set<() => void>();

function getSnapshot(): ColorMode {
  return currentMode;
}

function getServerSnapshot(): ColorMode {
  return 'light';
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function setMode(mode: ColorMode) {
  currentMode = mode;
  document.documentElement.setAttribute('data-color-mode', mode);
  listeners.forEach((l) => l());
}

export function ColorModeProvider({ children }: { children: React.ReactNode }) {
  const colorMode = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  // 마운트 시 실제 colorMode 동기화 (FOUC 스크립트가 이미 DOM을 설정한 상태)
  useEffect(() => {
    setMode(resolveColorMode());
  }, []);

  // 시스템 설정 변경 리스너 (수동 설정 시 무시)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      if (localStorage.getItem('color-mode') !== null) return;
      setMode(e.matches ? 'dark' : 'light');
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const toggleColorMode = useCallback(() => {
    const next = currentMode === 'light' ? 'dark' : 'light';
    localStorage.setItem('color-mode', next);
    setMode(next);
  }, []);

  return (
    <ColorModeContext value={{ colorMode, toggleColorMode }}>
      {children}
    </ColorModeContext>
  );
}

export function useColorMode() {
  const context = useContext(ColorModeContext);
  if (!context) {
    throw new Error('useColorMode must be used within a ColorModeProvider');
  }
  return context;
}
