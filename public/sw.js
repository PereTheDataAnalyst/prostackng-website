// ProStack NG — Service Worker
// Strategy: Network-first for pages, Cache-first for static assets.
// This lets the site load even on 2G or when offline.

const CACHE_NAME    = 'psng-v1';
const STATIC_ASSETS = [
  '/',
  '/products',
  '/pricing',
  '/blog',
  '/contact',
  '/portal',
  '/metrics',
  '/offline',
  '/favicon-icon.png',
  '/og-default.png',
  '/site.webmanifest',
];

// ── INSTALL — pre-cache core pages ──────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Cache what we can — failures are silent
      return Promise.allSettled(
        STATIC_ASSETS.map(url =>
          cache.add(url).catch(() => {
            console.warn('[PSW] Failed to cache:', url);
          })
        )
      );
    }).then(() => self.skipWaiting())
  );
});

// ── ACTIVATE — clean up old caches ──────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── FETCH — network-first with cache fallback ────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests on our origin
  if (request.method !== 'GET') return;
  if (url.origin !== location.origin) return;

  // Skip: API routes, Supabase calls, auth endpoints, Next.js internals
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/_next/webpack-hmr') ||
    url.pathname.includes('supabase') ||
    url.pathname.startsWith('/boardroom') ||
    url.pathname.startsWith('/chat-admin')
  ) return;

  // Static assets (_next/static) — cache-first (they're content-hashed)
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // HTML pages — network-first, fall back to cache, then offline page
  event.respondWith(
    fetch(request)
      .then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return response;
      })
      .catch(() =>
        caches.match(request).then(cached => {
          if (cached) return cached;
          // Ultimate fallback — return the cached homepage
          return caches.match('/').then(home => home || Response.error());
        })
      )
  );
});
