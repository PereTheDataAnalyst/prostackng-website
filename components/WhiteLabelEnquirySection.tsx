'use client';
import { useState } from 'react';

const PLATFORMS = [
  'AutoReport — Automated Executive Reporting',
  'ProTrackNG — Tender Intelligence Platform',
  'ClubOps — Nightlife / Venue Operating System',
  'Blockchain Explorer — Web3 Transaction Interface',
  'Multiple platforms — custom bundle',
];

const SECTORS = [
  'Financial Services / Fintech', 'Oil & Gas', 'Government / MDA',
  'Hospitality & Entertainment', 'Education / EdTech',
  'Healthcare', 'Retail & Commerce', 'Logistics',
  'Other',
];

const COMPANY_SIZES = [
  'Startup (1–20 staff)', 'SME (21–100 staff)',
  'Mid-market (101–500 staff)', 'Enterprise (500+ staff)',
];

const TIMELINE = [
  'ASAP', '1–3 months', '3–6 months', 'Exploring options',
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
  fullName: string; email: string; phone: string; company: string;
  jobTitle: string; sector: string; companySize: string;
  platform: string; useCase: string; timeline: string;
  ndaAgreed: boolean;
};

const EMPTY: FormData = {
  fullName: '', email: '', phone: '', company: '', jobTitle: '',
  sector: '', companySize: '', platform: '', useCase: '', timeline: '',
  ndaAgreed: false,
};

function EnquiryForm() {
  const [form, setForm] = useState<FormData>(EMPTY);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  function set(field: keyof FormData, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const required: (keyof FormData)[] = [
      'fullName', 'email', 'phone', 'company', 'sector', 'platform', 'useCase', 'timeline',
    ];
    const missing = required.filter(f => !form[f]);
    if (missing.length > 0) { setErrorMsg('Please fill in all required fields.'); return; }
    if (!form.ndaAgreed) { setErrorMsg('You must agree to the NDA terms to proceed.'); return; }
    setErrorMsg('');
    setStatus('sending');
    try {
      const res = await fetch('/api/white-label-enquiry', {
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
      <div style={{ background: 'rgba(16,185,129,.06)', border: '1px solid rgba(16,185,129,.25)', padding: '40px 32px', textAlign: 'center' }}>
        <div style={{ fontSize: 36, marginBottom: 16 }}>🏷</div>
        <h3 className="f-display" style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-.02em', marginBottom: 12, color: '#34D399' }}>
          Enquiry Received
        </h3>
        <p className="f-body" style={{ fontSize: 14, color: 'var(--sub)', lineHeight: 1.8, maxWidth: 480, margin: '0 auto' }}>
          Thank you. Your NDA acknowledgement is logged. We will review your submission and
          contact you at{' '}
          <strong style={{ color: 'var(--text)' }}>{form.email || 'your email'}</strong>{' '}
          within 48 hours with next steps and the formal NDA document.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* NDA Notice */}
      <div style={{ background: 'rgba(37,99,235,.06)', border: '1px solid var(--blue-dim)', padding: '20px 24px' }}>
        <div className="f-mono" style={{ fontSize: 9, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--blue-hi)', marginBottom: 8 }}>
          NDA Gate
        </div>
        <p className="f-body" style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.75 }}>
          White-label licensing discussions involve sharing proprietary platform architecture,
          pricing structures, and integration documentation. By submitting this form you agree
          to treat all information shared by ProStack NG Technologies as strictly confidential.
          A formal mutual NDA will be sent before any technical documentation is shared.
        </p>
      </div>

      {/* Contact */}
      <div>
        <div className="f-display" style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>
          Contact Information
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <div>
            <label style={labelStyle}>Full Name *</label>
            <input type="text" value={form.fullName} onChange={e => set('fullName', e.target.value)}
              placeholder="Your full name" style={inputStyle} className="ps-input" />
          </div>
          <div>
            <label style={labelStyle}>Email Address *</label>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
              placeholder="you@company.com" style={inputStyle} className="ps-input" />
          </div>
          <div>
            <label style={labelStyle}>Phone Number *</label>
            <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
              placeholder="+234 800 000 0000" style={inputStyle} className="ps-input" />
          </div>
          <div>
            <label style={labelStyle}>Job Title</label>
            <input type="text" value={form.jobTitle} onChange={e => set('jobTitle', e.target.value)}
              placeholder="e.g. CTO, CEO, Head of Product" style={inputStyle} className="ps-input" />
          </div>
        </div>
      </div>

      {/* Company */}
      <div>
        <div className="f-display" style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>
          Organisation Details
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <div>
            <label style={labelStyle}>Company Name *</label>
            <input type="text" value={form.company} onChange={e => set('company', e.target.value)}
              placeholder="Your company name" style={inputStyle} className="ps-input" />
          </div>
          <div>
            <label style={labelStyle}>Sector *</label>
            <select value={form.sector} onChange={e => set('sector', e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }} className="ps-input">
              <option value="">Select sector...</option>
              {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Company Size</label>
            <select value={form.companySize} onChange={e => set('companySize', e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }} className="ps-input">
              <option value="">Select size...</option>
              {COMPANY_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Platform */}
      <div>
        <div className="f-display" style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>
          Licensing Interest
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={labelStyle}>Platform of Interest *</label>
            <select value={form.platform} onChange={e => set('platform', e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }} className="ps-input">
              <option value="">Select platform...</option>
              {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>
              Intended Use Case * <span style={{ opacity: .5 }}>
                (How will you deploy it? Who are your end users?)
              </span>
            </label>
            <textarea value={form.useCase} onChange={e => set('useCase', e.target.value)}
              rows={4} placeholder="e.g. We are a Nigerian fintech serving 200+ SME clients. We want to offer them an AutoReport-style reporting dashboard under our own brand..."
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7 }} className="ps-input" />
          </div>
          <div>
            <label style={labelStyle}>Timeline *</label>
            <select value={form.timeline} onChange={e => set('timeline', e.target.value)}
              style={{ ...inputStyle, maxWidth: 280, cursor: 'pointer' }} className="ps-input">
              <option value="">Select timeline...</option>
              {TIMELINE.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* NDA Checkbox */}
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '16px', background: 'var(--s2)', border: '1px solid var(--border)' }}>
        <input
          type="checkbox"
          id="nda-agreed"
          checked={form.ndaAgreed}
          onChange={e => set('ndaAgreed', e.target.checked)}
          style={{ marginTop: 2, cursor: 'pointer', flexShrink: 0, accentColor: 'var(--blue)' }}
        />
        <label htmlFor="nda-agreed" className="f-body" style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.7, cursor: 'pointer' }}>
          I agree to treat all information shared by ProStack NG Technologies as strictly confidential.
          I understand that a formal mutual NDA will be required before any technical or commercial
          documentation is shared. *
        </label>
      </div>

      {/* Error */}
      {errorMsg && (
        <div style={{ background: 'rgba(220,38,38,.05)', border: '1px solid rgba(220,38,38,.2)', padding: '12px 16px' }}>
          <p className="f-body" style={{ fontSize: 13, color: '#F87171' }}>{errorMsg}</p>
        </div>
      )}

      {/* Submit */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', paddingTop: 8 }}>
        <button type="submit" disabled={status === 'sending'} className="btn btn-primary"
          style={{ fontSize: 12, opacity: status === 'sending' ? .6 : 1, cursor: status === 'sending' ? 'not-allowed' : 'pointer' }}>
          {status === 'sending' ? 'Submitting...' : 'Submit Enquiry →'}
        </button>
        <p className="f-mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.08em' }}>
          NDA acknowledgement logged · Response within 48 hrs · All details confidential
        </p>
      </div>

    </form>
  );
}

export default function WhiteLabelEnquirySection() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: 12, marginBottom: 40 }}>
        {[
          { label: 'Monthly Licence', value: '₦50k – ₦150k'  },
          { label: 'Setup Time',      value: '2–4 weeks'      },
          { label: 'NDA Required',    value: 'Yes'            },
          { label: 'Response Time',   value: 'Within 48 hrs'  },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: '16px 20px' }}>
            <div className="f-mono" style={{ fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6 }}>{s.label}</div>
            <div className="f-display" style={{ fontSize: 16, fontWeight: 700, color: 'var(--blue-hi)' }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{
        background: 'rgba(37,99,235,.06)', border: '1px solid var(--blue-dim)',
        padding: '28px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 20, marginBottom: open ? 24 : 0,
      }}>
        <div>
          <h3 className="f-display" style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>
            Ready to Enquire?
          </h3>
          <p className="f-body" style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.6 }}>
            Submit your enquiry. An NDA acknowledgement is required to proceed.
            We respond within 48 hours.
          </p>
        </div>
        <button
          onClick={() => setOpen(o => !o)}
          className="btn btn-primary"
          style={{ fontSize: 11, cursor: 'pointer', border: 'none', whiteSpace: 'nowrap' }}
        >
          {open ? '✕ Close Enquiry' : 'Submit NDA Enquiry →'}
        </button>
      </div>

      {open && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: 'clamp(28px,4vw,40px)' }}>
          <EnquiryForm />
        </div>
      )}
    </div>
  );
}
