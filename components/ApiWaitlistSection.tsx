'use client';
import { useState } from 'react';

const TIERS = [
  'Free — 100 requests/month',
  'Starter — ₦25,000/mo (10,000 requests)',
  'Growth — ₦75,000/mo (100,000 requests)',
  'Enterprise — Custom volume & pricing',
];

const USE_CASES = [
  'Internal tooling / automation',
  'Client-facing product integration',
  'Data pipeline / reporting',
  'Third-party platform integration',
  'Research & prototyping',
  'Other',
];

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'var(--s2)', border: '1px solid var(--border)',
  color: 'var(--text)', padding: '12px 14px', fontSize: 13, outline: 'none',
  fontFamily: 'Plus Jakarta Sans, sans-serif', boxSizing: 'border-box',
  transition: 'border-color .2s',
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontFamily: 'JetBrains Mono, monospace',
  fontSize: 9, letterSpacing: '.14em', textTransform: 'uppercase',
  color: 'var(--muted)', marginBottom: 8,
};

type FormData = {
  fullName: string; email: string; company: string;
  tier: string; useCase: string; description: string;
};

const EMPTY: FormData = {
  fullName: '', email: '', company: '', tier: '', useCase: '', description: '',
};

function WaitlistForm() {
  const [form, setForm] = useState<FormData>(EMPTY);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  function set(field: keyof FormData, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const required: (keyof FormData)[] = ['fullName', 'email', 'tier', 'useCase'];
    if (required.some(f => !form[f].trim())) {
      setErrorMsg('Please fill in all required fields.'); return;
    }
    setErrorMsg('');
    setStatus('sending');
    try {
      const res = await fetch('/api/api-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Server error');
      setStatus('success');
      setForm(EMPTY);
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong. Email us at hello@prostackng.com.ng');
    }
  }

  if (status === 'success') {
    return (
      <div style={{ background: 'rgba(16,185,129,.06)', border: '1px solid rgba(16,185,129,.25)', padding: '36px 28px', textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 14 }}>⚙️</div>
        <h3 className="f-display" style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-.02em', marginBottom: 10, color: '#34D399' }}>
          You&apos;re on the Waitlist
        </h3>
        <p className="f-body" style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.8, maxWidth: 440, margin: '0 auto' }}>
          We&apos;ll reach out to{' '}
          <strong style={{ color: 'var(--text)' }}>{form.email || 'your email'}</strong>{' '}
          when API access opens for your tier. Enterprise and Growth applicants are prioritised.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <div>
          <label style={labelStyle}>Full Name *</label>
          <input type="text" value={form.fullName} onChange={e => set('fullName', e.target.value)}
            placeholder="Your name" style={inputStyle} className="ps-input" />
        </div>
        <div>
          <label style={labelStyle}>Email Address *</label>
          <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
            placeholder="you@company.com" style={inputStyle} className="ps-input" />
        </div>
        <div>
          <label style={labelStyle}>Company <span style={{ opacity: .5 }}>(Optional)</span></label>
          <input type="text" value={form.company} onChange={e => set('company', e.target.value)}
            placeholder="Company name" style={inputStyle} className="ps-input" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <div>
          <label style={labelStyle}>Tier of Interest *</label>
          <select value={form.tier} onChange={e => set('tier', e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }} className="ps-input">
            <option value="">Select tier...</option>
            {TIERS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Primary Use Case *</label>
          <select value={form.useCase} onChange={e => set('useCase', e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }} className="ps-input">
            <option value="">Select use case...</option>
            {USE_CASES.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label style={labelStyle}>Brief Description <span style={{ opacity: .5 }}>(What will you build with the API?)</span></label>
        <textarea value={form.description} onChange={e => set('description', e.target.value)}
          rows={3} placeholder="e.g. We want to pull ProTrackNG tender data into our internal Slack bot to alert our BD team..."
          style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7 }} className="ps-input" />
      </div>

      {errorMsg && (
        <div style={{ background: 'rgba(220,38,38,.05)', border: '1px solid rgba(220,38,38,.2)', padding: '10px 14px' }}>
          <p className="f-body" style={{ fontSize: 13, color: '#F87171' }}>{errorMsg}</p>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
        <button type="submit" disabled={status === 'sending'} className="btn btn-primary"
          style={{ fontSize: 12, opacity: status === 'sending' ? .6 : 1, cursor: status === 'sending' ? 'not-allowed' : 'pointer' }}>
          {status === 'sending' ? 'Joining...' : 'Join Waitlist →'}
        </button>
        <p className="f-mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.08em' }}>
          Enterprise & Growth applicants contacted first
        </p>
      </div>

    </form>
  );
}

export default function ApiWaitlistSection() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div style={{
        background: 'rgba(37,99,235,.06)', border: '1px solid var(--blue-dim)',
        padding: '24px 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 16, marginBottom: open ? 20 : 0,
      }}>
        <div>
          <h3 className="f-display" style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>
            Join the API Waitlist
          </h3>
          <p className="f-body" style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.5 }}>
            Public API opening Q3 2026. Register now to be notified first and lock in early-access pricing.
          </p>
        </div>
        <button
          onClick={() => setOpen(o => !o)}
          className="btn btn-primary"
          style={{ fontSize: 11, cursor: 'pointer', border: 'none', whiteSpace: 'nowrap' }}
        >
          {open ? '✕ Close' : 'Register Interest →'}
        </button>
      </div>

      {open && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: 'clamp(24px,4vw,36px)' }}>
          <WaitlistForm />
        </div>
      )}
    </div>
  );
}
