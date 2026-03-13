'use client';
import { useState, useEffect } from 'react';

// PWA Install Button — handles 3 cases:
// 1. Chrome/Edge on Android — shows native install prompt via beforeinstallprompt
// 2. Safari on iPhone/iPad  — shows step-by-step instructions modal
// 3. Already installed      — shows nothing (detects via display-mode: standalone)

type InstallState = 'loading' | 'android' | 'ios' | 'desktop' | 'installed';

export default function PwaInstallButton({ variant = 'footer' }: { variant?: 'footer' | 'banner' }) {
  const [state, setState]       = useState<InstallState>('loading');
  const [showIosModal, setShowIosModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Already installed as PWA — hide everything
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setState('installed');
      return;
    }

    const isIos    = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isIos && isSafari) {
      setState('ios');
      return;
    }

    // Chrome/Edge Android — listen for the install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setState('android');
    };
    window.addEventListener('beforeinstallprompt', handler);

    // Fallback for desktop or browsers that don't fire beforeinstallprompt —
    // show a generic "Install App" button that opens the iOS instructions modal
    // (which explains mobile-only installation).
    const fallback = setTimeout(() => {
      setState(s => s === 'loading' ? 'desktop' : s);
    }, 800);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      clearTimeout(fallback);
    };
  }, []);

  const handleAndroidInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setState('installed');
      setDeferredPrompt(null);
    }
  };

  // Hide only if already installed or still loading
  if (state === 'installed' || state === 'loading') return null;

  // ── FOOTER VARIANT ────────────────────────────────────────────────────────
  if (variant === 'footer') {
    return (
      <>
        <button
          onClick={state === 'android' ? handleAndroidInstall : () => setShowIosModal(true)}
          aria-label="Install ProStack NG as an app"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'transparent',
            border: '1px solid var(--border, #181C30)',
            color: 'var(--sub, #7A7DA0)',
            padding: '8px 16px',
            fontSize: 11,
            fontFamily: 'JetBrains Mono, monospace',
            letterSpacing: '.08em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'border-color .2s, color .2s',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--blue, #2563EB)';
            (e.currentTarget as HTMLElement).style.color = 'var(--blue-hi, #3B82F6)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border, #181C30)';
            (e.currentTarget as HTMLElement).style.color = 'var(--sub, #7A7DA0)';
          }}
        >
          <span style={{ fontSize: 14 }}>📲</span>
          {state === 'android' ? 'Install App' : state === 'desktop' ? 'Install App' : 'Add to Home Screen'}
        </button>

        {showIosModal && <IosInstructionsModal onClose={() => setShowIosModal(false)} />}
      </>
    );
  }

  // ── BANNER VARIANT (shown inline in a page section) ───────────────────────
  return (
    <>
      <div style={{
        background: 'var(--card, #111428)',
        border: '1px solid var(--border, #181C30)',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--blue, #2563EB)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 28, flexShrink: 0 }}>📲</span>
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--text, #EEF0FF)', marginBottom: 3 }}>
              Install ProStack NG
            </div>
            <div style={{ fontSize: 12, color: 'var(--sub, #7A7DA0)', lineHeight: 1.5 }}>
              Add to your home screen for instant access — no App Store needed.
            </div>
          </div>
        </div>
        <button
          onClick={state === 'android' ? handleAndroidInstall : () => setShowIosModal(true)}
          aria-label="Install ProStack NG as an app"
          style={{
            background: 'var(--blue, #2563EB)',
            color: '#fff',
            border: 'none',
            padding: '11px 24px',
            fontFamily: 'Syne, sans-serif',
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: '.08em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          {state === 'android' ? 'Install Now →' : 'How to Install →'}
        </button>
      </div>

      {showIosModal && <IosInstructionsModal onClose={() => setShowIosModal(false)} />}
    </>
  );
}

// ── iOS Instructions Modal ────────────────────────────────────────────────────
function IosInstructionsModal({ onClose }: { onClose: () => void }) {
  const STEPS = [
    {
      icon: '⬆',
      title: 'Tap the Share button',
      desc: 'At the bottom of your Safari browser, tap the Share icon (the box with an arrow pointing up).',
    },
    {
      icon: '＋',
      title: 'Tap "Add to Home Screen"',
      desc: 'Scroll down in the share sheet and tap "Add to Home Screen". If you don\'t see it, scroll right.',
    },
    {
      icon: '✓',
      title: 'Tap "Add"',
      desc: 'Confirm the name and tap "Add" in the top right. ProStack NG will appear on your home screen like a native app.',
    },
  ];

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(4,5,10,.9)',
        zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16, backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#0C0F1C', border: '1px solid #181C30',
          padding: '32px 28px', maxWidth: 420, width: '100%',
          position: 'relative',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top accent */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #2563EB, #06B6D4)' }} />

        {/* Close */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 14, right: 14, background: 'none', border: 'none', color: '#32365A', fontSize: 22, cursor: 'pointer', lineHeight: 1 }}
        >×</button>

        {/* Header */}
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '.18em', color: '#2563EB', textTransform: 'uppercase', marginBottom: 10 }}>
          iPhone / iPad
        </div>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, color: '#EEF0FF', marginBottom: 6, letterSpacing: '-.02em' }}>
          Add to Home Screen
        </div>
        <p style={{ fontSize: 13, color: '#7A7DA0', lineHeight: 1.7, marginBottom: 24 }}>
          Safari on iPhone doesn't show an install prompt — follow these 3 steps instead.
        </p>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: '#131526', border: '1px solid #131526', marginBottom: 24 }}>
          {STEPS.map((step, i) => (
            <div key={i} style={{ background: '#0C0F1C', padding: '16px 18px', display: 'flex', gap: 14 }}>
              <div style={{
                width: 32, height: 32, background: 'rgba(37,99,235,.08)', border: '1px solid rgba(37,99,235,.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 14, color: '#2563EB',
                flexShrink: 0,
              }}>
                {step.icon}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#EEF0FF', marginBottom: 4 }}>{step.title}</div>
                <div style={{ fontSize: 12, color: '#7A7DA0', lineHeight: 1.65 }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, color: '#32365A', letterSpacing: '.06em', textAlign: 'center' }}>
          Only works in Safari — not Chrome or Firefox on iPhone.
        </div>
      </div>
    </div>
  );
}
