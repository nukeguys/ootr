import type { Metadata } from 'next';
import { Inter, Playfair_Display, Noto_Sans_KR } from 'next/font/google';
import { ColorModeProvider } from '@/features/color-mode';
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

export const metadata: Metadata = {
  title: 'OOTR',
  description: '오늘 뭐 입지? - 날씨 기반 러닝 복장 추천 서비스',
};

const FOUC_SCRIPT = `
(function(){
  try {
    var stored = localStorage.getItem('color-mode');
    if (stored === 'light' || stored === 'dark') {
      document.documentElement.setAttribute('data-color-mode', stored);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-color-mode', 'dark');
    } else {
      document.documentElement.setAttribute('data-color-mode', 'light');
    }
  } catch(e) {
    document.documentElement.setAttribute('data-color-mode', 'light');
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
        <ColorModeProvider>{children}</ColorModeProvider>
      </body>
    </html>
  );
}
