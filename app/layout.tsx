import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://prostackng.com'),
  title: { default: 'ProStack NG — Platform Technology for Africa', template: '%s | ProStack NG' },
  description: 'ProStack NG builds intelligent digital platforms — tender intelligence, nightlife OS, marketplace commerce, ride-hailing, and data automation — from Port Harcourt to the world.',
  keywords: ['tech company Nigeria', 'software development Port Harcourt', 'web development Nigeria', 'mobile app development', 'ERP Nigeria', 'digital transformation Africa'],
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: 'https://prostackng.com',
    siteName: 'ProStack NG Technologies',
    title: 'ProStack NG — Platform Technology for Africa',
    description: 'Building intelligent digital platforms that power Africa\'s commerce, mobility, and digital infrastructure ecosystem.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'ProStack NG Technologies' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ProStack NG — Platform Technology for Africa',
    description: 'Building intelligent digital platforms for Africa.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  themeColor: '#050709',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const umamiId  = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const umamiUrl = process.env.NEXT_PUBLIC_UMAMI_URL;

  return (
    <html lang="en">
      <head>
        {/* Umami Analytics — self-hosted, privacy-first, GDPR-clean */}
        {umamiId && umamiUrl && (
          <Script
            src={`${umamiUrl}/script.js`}
            data-website-id={umamiId}
            strategy="afterInteractive"
            defer
          />
        )}
      </head>
      <body className="bg-bg text-text antialiased">
        {children}
      </body>
    </html>
  );
}
