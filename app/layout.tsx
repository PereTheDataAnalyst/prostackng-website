import type { Metadata, Viewport } from 'next';
import './globals.css';
import Analytics from '@/components/Analytics';
import ChatWidgetWrapper from '@/components/ChatWidgetWrapper';

// viewport-fit=cover activates env(safe-area-inset-*) on iPhone —
// critical for the Boardroom not being cut off on notch/Dynamic Island devices.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.prostackng.com.ng'),
  title: {
    default: 'ProStack NG — Platform-first technology for African businesses',
    template: '%s — ProStack NG',
  },
  description: 'ProStack NG Technologies builds intelligent digital platforms for Nigerian businesses. AutoReport, ProTrackNG, and NightOps are live. Three more in development.',
  keywords: ['Nigerian software', 'African tech', 'business automation', 'tender intelligence Nigeria', 'nightclub POS Nigeria', 'Port Harcourt tech company', 'SaaS Nigeria'],
  authors: [{ name: 'ProStack NG Technologies', url: 'https://www.prostackng.com.ng' }],
  creator: 'ProStack NG Technologies',
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: 'https://www.prostackng.com.ng',
    siteName: 'ProStack NG Technologies',
    title: 'ProStack NG — Platform-first technology for African businesses',
    description: 'ProStack NG Technologies builds intelligent digital platforms for Nigerian businesses. AutoReport, ProTrackNG, and NightOps are live.',
    images: [
      {
        url: '/og-default.png',
        width: 1200,
        height: 630,
        alt: 'ProStack NG Technologies',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@prostackng',
    creator: '@prostackng',
    title: 'ProStack NG — Platform-first technology for African businesses',
    description: 'Three live SaaS platforms for Nigerian businesses. AutoReport, ProTrackNG, NightOps.',
    images: ['/og-default.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest', // enables PWA install + kills 'No manifest' DevTools warning
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Analytics />
      </head>
      <body>{children}<ChatWidgetWrapper /></body>
    </html>
  );
}
