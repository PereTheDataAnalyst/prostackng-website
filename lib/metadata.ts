// ─────────────────────────────────────────────────────────────────────────────
// ProStack NG — Shared SEO metadata
// Import and spread into each page's `export const metadata = { ... }`
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = 'https://prostackng-website.vercel.app';
const SITE_NAME = 'ProStack NG Technologies';
const TWITTER_HANDLE = '@prostackng';

export const defaultMeta = {
  metadataBase: new URL(BASE_URL),
  authors: [{ name: 'ProStack NG Technologies', url: BASE_URL }],
  creator: 'ProStack NG Technologies',
  publisher: 'ProStack NG Technologies',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website' as const,
    locale: 'en_NG',
    siteName: SITE_NAME,
    url: BASE_URL,
  },
  twitter: {
    card: 'summary_large_image' as const,
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
  },
};

export function buildMeta(opts: {
  title: string;
  description: string;
  path?: string;
  image?: string;
}) {
  const url = `${BASE_URL}${opts.path ?? ''}`;
  const image = opts.image ?? `${BASE_URL}/og-default.png`;
  return {
    ...defaultMeta,
    title: `${opts.title} — ProStack NG`,
    description: opts.description,
    alternates: { canonical: url },
    openGraph: {
      ...defaultMeta.openGraph,
      title: opts.title,
      description: opts.description,
      url,
      images: [{ url: image, width: 1200, height: 630, alt: opts.title }],
    },
    twitter: {
      ...defaultMeta.twitter,
      title: opts.title,
      description: opts.description,
      images: [image],
    },
  };
}
