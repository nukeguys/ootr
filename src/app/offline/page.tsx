'use client';

export default function OfflinePage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-serif text-3xl font-bold tracking-tight">오프라인</h1>
      <p className="text-accent">
        인터넷 연결이 없습니다.
        <br />
        연결을 확인한 뒤 다시 시도해 주세요.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 rounded-lg border border-border px-6 py-2 text-sm transition-colors hover:bg-foreground/5"
      >
        다시 시도
      </button>
    </main>
  );
}
