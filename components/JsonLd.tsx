// JsonLd.tsx — Structured data for Google rich results
// Injected once in layout.tsx inside <head>
// Gives Google: organisation info, social profiles, sitelinks, and SoftwareApplication entries
// Result: ProStack NG can appear with rich descriptions, ratings, and product cards in search

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    // ── Organisation ────────────────────────────────────────────────────────
    {
      '@type': 'Organization',
      '@id': 'https://www.prostackng.com.ng/#organization',
      name: 'ProStack NG Technologies',
      alternateName: 'ProStack NG',
      url: 'https://www.prostackng.com.ng',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.prostackng.com.ng/favicon-icon.png',
        width: 192,
        height: 192,
      },
      description:
        'Port Harcourt-based software company building intelligent digital platforms for African businesses. AutoReport, ProTrackNG, and NightOps are live.',
      foundingDate: '2024',
      foundingLocation: {
        '@type': 'Place',
        name: 'Port Harcourt, Rivers State, Nigeria',
      },
      areaServed: ['Nigeria', 'Africa'],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: 'contact@prostackng.com.ng',
        availableLanguage: 'English',
      },
      sameAs: [
        'https://twitter.com/prostackng',
        'https://linkedin.com/company/prostackng',
        'https://github.com/prostackng',
        'https://youtube.com/@prostackng',
        'https://instagram.com/prostackng',
      ],
    },

    // ── Website with SearchAction (enables Google Sitelinks Searchbox) ──────
    {
      '@type': 'WebSite',
      '@id': 'https://www.prostackng.com.ng/#website',
      url: 'https://www.prostackng.com.ng',
      name: 'ProStack NG',
      description: 'Platform-first technology for Africa',
      publisher: { '@id': 'https://www.prostackng.com.ng/#organization' },
      inLanguage: 'en-NG',
    },

    // ── AutoReport ───────────────────────────────────────────────────────────
    {
      '@type': 'SoftwareApplication',
      name: 'AutoReport',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      url: 'https://www.prostackng.com.ng/products#autoreport',
      description:
        'Automated executive reporting — raw data to branded PDF and Excel in 8 seconds. Delivered to every inbox, every morning. No manual effort.',
      offers: {
        '@type': 'Offer',
        price: '45000',
        priceCurrency: 'NGN',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '45000',
          priceCurrency: 'NGN',
          unitText: 'MONTH',
        },
      },
      provider: { '@id': 'https://www.prostackng.com.ng/#organization' },
    },

    // ── ProTrackNG ───────────────────────────────────────────────────────────
    {
      '@type': 'SoftwareApplication',
      name: 'ProTrackNG',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      url: 'https://www.prostackng.com.ng/products#protrackng',
      description:
        'Tender intelligence for Nigerian procurement teams. Monitor 400+ portals, get real-time alerts, and manage your full bid pipeline in one place.',
      offers: {
        '@type': 'Offer',
        price: '15000',
        priceCurrency: 'NGN',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '15000',
          priceCurrency: 'NGN',
          unitText: 'MONTH',
        },
      },
      provider: { '@id': 'https://www.prostackng.com.ng/#organization' },
    },

    // ── NightOps ─────────────────────────────────────────────────────────────
    {
      '@type': 'SoftwareApplication',
      name: 'NightOps',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      url: 'https://www.prostackng.com.ng/products#nightops',
      description:
        'Full operating system for Nigerian nightclubs and entertainment venues. Table management, bottle tracking, real-time revenue, 5-minute nightly reconciliation.',
      offers: {
        '@type': 'Offer',
        price: '15000',
        priceCurrency: 'NGN',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '15000',
          priceCurrency: 'NGN',
          unitText: 'MONTH',
        },
      },
      provider: { '@id': 'https://www.prostackng.com.ng/#organization' },
    },
  ],
};

export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
    />
  );
}
