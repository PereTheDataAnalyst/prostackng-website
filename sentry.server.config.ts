// sentry.server.config.ts
// Sentry error tracking — server side (API route crashes, SSR errors)
// Same setup instructions as sentry.client.config.ts

import * as Sentry from '@sentry/nextjs';

const DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (DSN) {
  Sentry.init({
    dsn: DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    initialScope: {
      tags: {
        company: 'prostackng',
        platform: 'website-server',
      },
    },
  });
}
