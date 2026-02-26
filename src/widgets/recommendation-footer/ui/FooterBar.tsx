'use client';

import { trackEvent } from '@/shared/lib/analytics/trackEvent';

export function FooterBar() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-border pt-8 pb-4">
      <p className="font-serif italic text-accent text-sm md:text-base">
        &ldquo;There is no bad weather, only bad clothing.&rdquo;
      </p>
      <div className="flex items-center gap-2">
        <p className="text-[9px] md:text-[10px] font-bold tracking-[0.4em] uppercase text-footer-brand">
          Outfit Of The Run
        </p>
        <a
          href="https://forms.gle/6aUFva3uDNnsB2Py9"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('click_feedback')}
          className="text-accent opacity-40 hover:opacity-70 transition-opacity"
          aria-label="Feedback"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </a>
      </div>
    </div>
  );
}
