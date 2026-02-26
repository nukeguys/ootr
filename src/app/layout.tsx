import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display, Noto_Sans_KR } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ColorModeProvider } from '@/features/color-mode';
import { QueryProvider } from '@/shared/lib/QueryProvider';
import { GoogleTagManager } from '@/shared/lib/analytics/GoogleTagManager';
import { ServiceWorkerRegister } from '@/shared/ui/ServiceWorkerRegister';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
});

const notoSansKR = Noto_Sans_KR({
  variable: '--font-noto-kr',
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://ootr.kkick.xyz'),
  title: 'OOTR',
  description: '오늘 뭐 입지? - 날씨 기반 러닝 복장 추천 서비스',
  openGraph: {
    title: 'OOTR - 오늘 뭐 입지',
    description: '날씨 기반 러닝 복장 추천 서비스',
    url: 'https://ootr.kkick.xyz',
    siteName: 'OOTR',
    images: [{ url: '/icons/og-image.png', width: 1200, height: 630 }],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OOTR - 오늘 뭐 입지',
    description: '날씨 기반 러닝 복장 추천 서비스',
    images: ['/icons/og-image.png'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'OOTR',
  },
  icons: {
    icon: '/icons/icon-192x192.png',
    apple: '/icons/apple-touch-icon.png',
  },
};

const FOUC_SCRIPT = `
(function(){
  try {
    var stored = localStorage.getItem('color-mode');
    if (stored === 'light' || stored === 'dark') {
      document.documentElement.setAttribute('data-color-mode', stored);
    } else {
      document.documentElement.setAttribute('data-color-mode', 'dark');
    }
  } catch(e) {
    document.documentElement.setAttribute('data-color-mode', 'dark');
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={`${inter.variable} ${playfair.variable} ${notoSansKR.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: FOUC_SCRIPT }} />
      </head>
      <body className="flex flex-col items-center antialiased">
        <QueryProvider>
          <ColorModeProvider>{children}</ColorModeProvider>
        </QueryProvider>
        <ServiceWorkerRegister />
        <Analytics />
        <SpeedInsights />
        <GoogleTagManager />
      </body>
    </html>
  );
}
