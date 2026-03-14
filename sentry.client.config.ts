// sentry.client.config.ts
// Sentry error tracking — client side (browser errors, React crashes)
//
// SETUP (one time):
// 1. npm install @sentry/nextjs
// 2. Sign up free at https://sentry.io (free tier = 5,000 errors/month)
// 3. Create a project → Next.js
// 4. Copy your DSN from project settings
// 5. Add to Vercel env vars:
//    NEXT_PUBLIC_SENTRY_DSN = https://xxxxx@oyyy.ingest.sentry.io/zzzz

import * as Sentry from '@sentry/nextjs';

const DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (DSN) {
  Sentry.init({
    dsn: DSN,
    environment: process.env.NODE_ENV,

    // Sample rates — tune based on traffic volume
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    replaysSessionSampleRate: 0.05,      // 5% of sessions
    replaysOnErrorSampleRate: 1.0,       // 100% when an error occurs

    // Tag every event with ProStack NG context
    initialScope: {
      tags: {
        company: 'prostackng',
        platform: 'website',
      },
    },

    // Don't track bots
    beforeSend(event) {
      const ua = navigator?.userAgent?.toLowerCase() ?? '';
      if (/bot|crawl|spider|headless/i.test(ua)) return null;
      return event;
    },

    // Session Replay — shows exactly what the user did before an error
    integrations: [
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
  });
}
