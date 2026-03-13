'use client';
import { useState } from 'react';

type Variant = 'inline' | 'banner' | 'minimal';

export default function NewsletterSignup({
  variant = 'inline',
  heading = 'Get the ProStack NG digest.',
  sub = 'Product updates, African tech insights, and new platform launches. No spam.',
}: {
  variant?: Variant;
  heading?: string;
  sub?: string;
}) {
  const [email, setEmail]   = useState('');
  const [state, setState]   = useState<'idle'|'sending'|'done'|'error'>('idle');

  const submit = async () => {
    if (!email.trim() || !email.includes('@')) return;
    setState('sending');
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Newsletter Subscriber',
          email: email.trim(),
          service: 'NEWSLETTER',
          company: '',
          message: `Newsletter signup: ${email.trim()}`,
        }),
      });
      setState('done');
      setEmail('');
    } catch {
      setState('error');
    }
  };

  // ── MINIMAL (footer / small spaces) ─────────────────────────────────────
  if (variant === 'minimal') return (
    <div>
      {state === 'done' ? (
        <p className="f-mono" style={{ fontSize: 9.5, color: 'var(--blue-hi)', letterSpacing: '.1em' }}>✓ YOU'RE IN</p>
      ) : (
        <div style={{ display: 'flex', gap: 0 }}>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            placeholder="your@email.com"
            style={{ flex: 1, background: 'var(--s2)', border: '1px solid var(--border)', borderRight: 'none', color: 'var(--text)', padding: '9px 12px', fontSize: 12, outline: 'none', fontFamily: 'Plus Jakarta Sans, sans-serif', minWidth: 0 }}
          />
          <button onClick={submit} disabled={state === 'sending' || !email.trim()}
            style={{ background: 'var(--blue)', border: 'none', color: '#000', padding: '9px 16px', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', cursor: 'pointer', flexShrink: 0, opacity: !email.trim() ? .4 : 1 }}>
            {state === 'sending' ? '…' : '→'}
          </button>
        </div>
      )}
    </div>
  );

  // ── BANNER (full-width section) ──────────────────────────────────────────
  if (variant === 'banner') return (
    <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderLeft: '2px solid var(--blue)', padding: 'clamp(24px,3vw,44px) clamp(16px,4vw,48px)', display: 'flex', flexWrap: 'wrap', gap: 28, alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ flex: '1 1 280px', minWidth: 0 }}>
        <div className="f-mono" style={{ fontSize: 9.5, letterSpacing: '.16em', color: 'var(--blue-hi)', textTransform: 'uppercase', marginBottom: 8 }}>Newsletter</div>
        <div className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(18px,2.5vw,28px)', letterSpacing: '-.03em', color: 'var(--text)', lineHeight: 1.1, marginBottom: 6 }}>{heading}</div>
        <p style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.7 }}>{sub}</p>
      </div>
      <div style={{ flex: '1 1 320px', minWidth: 0, maxWidth: 460 }}>
        {state === 'done' ? (
          <div style={{ background: 'rgba(37,99,235,.06)', border: '1px solid rgba(37,99,235,.2)', padding: '16px 20px', textAlign: 'center' }}>
            <div className="f-display" style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)', marginBottom: 4 }}>You're subscribed.</div>
            <p className="f-mono" style={{ fontSize: 9.5, color: 'var(--muted)', letterSpacing: '.08em' }}>We'll be in touch with the good stuff only.</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', gap: 0, marginBottom: 8 }}>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submit()}
                placeholder="your@email.com"
                style={{ flex: 1, background: 'var(--bg)', border: '1px solid var(--border)', borderRight: 'none', color: 'var(--text)', padding: '12px 16px', fontSize: 13, outline: 'none', fontFamily: 'Plus Jakarta Sans, sans-serif', minWidth: 0 }}
              />
              <button onClick={submit} disabled={state === 'sending' || !email.trim()}
                style={{ background: 'var(--blue)', border: 'none', color: '#000', padding: '12px 22px', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', cursor: email.trim() ? 'pointer' : 'default', flexShrink: 0, opacity: !email.trim() ? .4 : 1 }}>
                {state === 'sending' ? '…' : 'Subscribe'}
              </button>
            </div>
            {state === 'error' && <p className="f-mono" style={{ fontSize: 9.5, color: '#FF5757', letterSpacing: '.08em' }}>Something went wrong. Try again or email us directly.</p>}
            <p className="f-mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.06em' }}>
              No spam. Unsubscribe any time. We send roughly once a month.
            </p>
          </>
        )}
      </div>
    </div>
  );

  // ── INLINE (default — card block) ────────────────────────────────────────
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--hi)', padding: 'clamp(28px,4vw,48px)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, var(--blue), #06B6D4, transparent)' }} />
      <div className="f-mono" style={{ fontSize: 9.5, letterSpacing: '.16em', color: 'var(--blue-hi)', textTransform: 'uppercase', marginBottom: 12 }}>Newsletter</div>
      <div className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(20px,2.5vw,30px)', letterSpacing: '-.03em', color: 'var(--text)', lineHeight: 1.1, marginBottom: 10 }}>{heading}</div>
      <p style={{ fontSize: 13.5, color: 'var(--sub)', lineHeight: 1.8, marginBottom: 22 }}>{sub}</p>
      {state === 'done' ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, background: 'rgba(37,99,235,.1)', border: '1px solid var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue)', fontSize: 13 }}>✓</div>
          <div>
            <div style={{ fontSize: 14, color: 'var(--text)', fontWeight: 600 }}>You're subscribed.</div>
            <div className="f-mono" style={{ fontSize: 9.5, color: 'var(--muted)', letterSpacing: '.06em', marginTop: 2 }}>Expect the good stuff only.</div>
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', gap: 0, marginBottom: 10 }}>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()}
              placeholder="your@email.com"
              style={{ flex: 1, background: 'var(--s2)', border: '1px solid var(--border)', borderRight: 'none', color: 'var(--text)', padding: '12px 16px', fontSize: 13, outline: 'none', fontFamily: 'Plus Jakarta Sans, sans-serif', minWidth: 0 }}
            />
            <button onClick={submit} disabled={state === 'sending' || !email.trim()}
              style={{ background: 'var(--blue)', border: 'none', color: '#000', padding: '12px 22px', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', cursor: email.trim() ? 'pointer' : 'default', flexShrink: 0, opacity: !email.trim() ? .4 : 1 }}>
              {state === 'sending' ? '…' : 'Subscribe →'}
            </button>
          </div>
          {state === 'error' && <p className="f-mono" style={{ fontSize: 9.5, color: '#FF5757', letterSpacing: '.08em', marginBottom: 8 }}>Something went wrong. Please try again.</p>}
          <p className="f-mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.06em' }}>No spam. Once a month, roughly. Unsubscribe any time.</p>
        </>
      )}
    </div>
  );
}
