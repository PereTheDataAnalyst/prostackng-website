'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// NDPR Consent Banner — Nigeria Data Protection Regulation 2023
// Required for any site collecting personal data from Nigerian users.
// ProStack collects: contact form submissions, chat messages, newsletter signups, analytics.
//
// Design: minimal, non-intrusive bottom bar. One tap to accept. Dismiss persists in localStorage.
// Legal basis: NDPR Section 2.1 requires informed consent before data collection.

const STORAGE_KEY = 'psng_ndpr_consent';

export default function NdprBanner() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    // Small delay so it doesn't flash on first paint
    const timer = setTimeout(() => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) setVisible(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ consent: true, date: new Date().toISOString() }));
    setVisible(false);
  };

  const decline = () => {
    // Still set a flag so we don't keep showing the banner,
    // but don't enable analytics. The site still works — we just won't track.
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ consent: false, date: new Date().toISOString() }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9990,
        background: '#0C0F1C',
        borderTop: '1px solid #181C30',
        boxShadow: '0 -8px 40px rgba(0,0,0,.5)',
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform .3s ease',
      }}
    >
      {/* NDPR accent line */}
      <div style={{ height: 2, background: 'linear-gradient(90deg, #2563EB 0%, #06B6D4 50%, transparent 100%)' }} />

      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: 'clamp(14px,2vw,20px) clamp(16px,3vw,40px)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 20,
        flexWrap: 'wrap',
        justifyContent: 'space-between',
      }}>
        {/* Text block */}
        <div style={{ flex: 1, minWidth: 260 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 8.5,
              letterSpacing: '.16em',
              textTransform: 'uppercase',
              color: '#2563EB',
              background: 'rgba(37,99,235,.08)',
              border: '1px solid rgba(37,99,235,.2)',
              padding: '2px 7px',
            }}>
              🇳🇬 NDPR Notice
            </span>
          </div>

          <p style={{ fontSize: 12.5, color: '#7A7DA0', lineHeight: 1.7, margin: 0 }}>
            We collect data (contact forms, analytics, live chat) to improve our services and respond to enquiries.
            This complies with the{' '}
            <span style={{ color: '#EEF0FF' }}>Nigeria Data Protection Regulation (NDPR) 2019</span>.
          </p>

          {expanded && (
            <div style={{ marginTop: 10, fontSize: 12, color: '#32365A', lineHeight: 1.8 }}>
              <strong style={{ color: '#7A7DA0' }}>What we collect:</strong> Name, email, messages via contact forms and live chat; anonymous page view data via Umami analytics (no cookies, no cross-site tracking).
              <br />
              <strong style={{ color: '#7A7DA0' }}>Who stores it:</strong> Supabase (EU servers), Resend (email delivery). We do not sell or share your data with third parties.
              <br />
              <strong style={{ color: '#7A7DA0' }}>Your rights:</strong> You can request deletion at any time by emailing{' '}
              <a href="mailto:contact@prostackng.com.ng" style={{ color: '#3B82F6', textDecoration: 'none' }}>contact@prostackng.com.ng</a>.
            </div>
          )}

          <button
            onClick={() => setExpanded(!expanded)}
            style={{ background: 'none', border: 'none', color: '#3B82F6', fontSize: 11, cursor: 'pointer', padding: '4px 0 0', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '.06em' }}
          >
            {expanded ? '▲ Show less' : '▼ Learn more'}
          </button>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0, flexWrap: 'wrap' }}>
          <button
            onClick={decline}
            style={{
              background: 'transparent',
              border: '1px solid #181C30',
              color: '#32365A',
              padding: '10px 18px',
              fontSize: 11,
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              letterSpacing: '.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Decline
          </button>
          <button
            onClick={accept}
            style={{
              background: '#2563EB',
              border: 'none',
              color: '#fff',
              padding: '10px 22px',
              fontSize: 11,
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              letterSpacing: '.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Accept & Continue →
          </button>
        </div>
      </div>
    </div>
  );
}
