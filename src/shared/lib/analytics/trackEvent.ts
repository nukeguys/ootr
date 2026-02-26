declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function trackEvent(event: string, params?: Record<string, string>) {
  window.dataLayer?.push({ event, ...params });
}
