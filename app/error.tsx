'use client';
import { useEffect } from 'react';
import Link from 'next/link';

// app/error.tsx — catches runtime errors in any page
// Shows a professional recovery screen instead of a blank white crash

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to console in dev — swap for Sentry in production
    console.error('[ProStack NG Error]', error);
  }, [error]);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080B14',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      padding: '24px 16px',
    }}>
      <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>

        {/* Logo */}
        <svg width="48" height="40" viewBox="0 0 52 44" fill="none" style={{ marginBottom: 24, opacity: 0.5 }}>
          <path d="M6 30 L36 30 L46 38 L16 38 Z" fill="#1E3A8A" opacity=".5"/>
          <path d="M2 20 L32 20 L42 28 L12 28 Z" fill="#1D4ED8" opacity=".75"/>
          <path d="M0 10 L30 10 L40 18 L10 18 Z" fill="#2563EB"/>
          <path d="M0 10 L30 10" stroke="#93C5FD" strokeWidth="1.5" opacity=".7"/>
        </svg>

        {/* Error code */}
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 10,
          letterSpacing: '.2em',
          color: '#FF5757',
          textTransform: 'uppercase',
          marginBottom: 16,
        }}>
          ⚠ Something went wrong
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(22px,4vw,34px)',
          letterSpacing: '-.04em',
          color: '#EEF0FF',
          lineHeight: 1.1,
          marginBottom: 14,
        }}>
          An unexpected error occurred.
        </h1>

        <p style={{ fontSize: 14, color: '#7A7DA0', lineHeight: 1.8, marginBottom: 32 }}>
          Our team has been notified. You can try again, or head back home while we look into it.
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={reset}
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: '.08em',
              textTransform: 'uppercase',
              background: '#2563EB',
              color: '#fff',
              border: 'none',
              padding: '13px 28px',
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
          <Link
            href="/"
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: '.08em',
              textTransform: 'uppercase',
              background: 'transparent',
              color: '#7A7DA0',
              border: '1px solid #181C30',
              padding: '13px 28px',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            ← Home
          </Link>
        </div>

        {/* Error digest for support */}
        {error.digest && (
          <p style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 9,
            color: '#32365A',
            letterSpacing: '.08em',
            marginTop: 28,
          }}>
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
