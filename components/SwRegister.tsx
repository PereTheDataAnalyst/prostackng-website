'use client';
import { useEffect } from 'react';

// Registers the service worker (public/sw.js) silently.
// PWA offline support — caches pages and assets so the site works
// even on poor Nigerian network connectivity.

export default function SwRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js', { scope: '/' })
          .then(reg => {
            console.log('[PSW] Service worker registered:', reg.scope);
          })
          .catch(err => {
            // Silently fail — site works fine without SW
            console.warn('[PSW] Service worker registration failed:', err);
          });
      });
    }
  }, []);

  return null; // renders nothing
}
