'use client';
import { useState } from 'react';

const PACKAGES = [
  'Audit Only — ₦500,000',
  'Audit + Roadmap — ₦1,200,000',
  'Full Implementation — ₦3,000,000+',
  'Not sure yet — need a discovery call',
];

const SECTORS = [
  'Oil & Gas', 'Financial Services / Fintech', 'Healthcare',
  'Education', 'Government / MDA', 'Retail & Commerce',
  'Hospitality & Entertainment', 'Logistics & Transportation',
  'Agriculture', 'Real Estate', 'Professional Services', 'Other',
];

const STAFF_SIZE = [
  '1–10 staff', '11–50 staff', '51–200 staff', '200+ staff',
];

const URGENCY = [
  'Urgent — NITDA / regulatory deadline',
  'Within 3 months',
  '3–6 months',
  'Exploring options — no fixed timeline',
];

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'var(--s2)',
  border: '1px solid var(--border)',
  color: 'var(--text)', padding: '12px 14px',
  fontSize: 13, outline: 'none',
  fontFamily: 'Plus Jakarta Sans, sans-serif',
  boxSizing: 'border-box', transition: 'border-color .2s',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: 9, letterSpacing: '.14em',
  textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8,
};

type FormData = {
  fullName: string; email: string; phone: string;
  company: string; sector: string; staffSize: string;
  package: string; currentChallenge: string; urgency: string;
};

const EMPTY: FormData = {
  fullName: '', email: '', phone: '', company: '',
  sector: '', staffSize: '', package: '',
  currentChallenge: '', urgency: '',
};

function EnquiryForm() {
  const [form, setForm] = useState<FormData>(EMPTY);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  function set(field: keyof FormData, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const required: (keyof FormData)[] = [
      'fullName', 'email', 'phone', 'sector', 'package', 'currentChallenge', 'urgency',
    ];
    const missing = required.filter(f => !form[f].trim());
    if (missing.length > 0) { setErrorMsg('Please fill in all required fields.'); return; }
    setErrorMsg('');
    setStatus('sending');
    try {
      const res = await fetch('/api/consulting-enquiry', {
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
      <div style={{
        background: 'rgba(16,185,129,.06)',
        border: '1px solid rgba(16,185,129,.25)',
        padding: '40px 32px', textAlign: 'center',
      }}>
        <div style={{ fontSize: 36, marginBottom: 16 }}>📋</div>
        <h3 className="f-display" style={{
          fontSize: 20, fontWeight: 800,
          letterSpacing: '-.02em', marginBottom: 12, color: '#34D399',
        }}>Enquiry Received</h3>
        <p className="f-body" style={{
          fontSize: 14, color: 'var(--sub)',
          lineHeight: 1.8, maxWidth: 480, margin: '0 auto',
        }}>
          Thank you. We will review your submission and reach out within 48 hours to
          schedule your free discovery call at{' '}
          <strong style={{ color: 'var(--text)' }}>{form.email || 'your email'}</strong>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Contact */}
      <div>
        <div className="f-display" style={{
          fontSize: 13, fontWeight: 700, marginBottom: 16,
          paddingBottom: 10, borderBottom: '1px solid var(--border)',
        }}>Contact Information</div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
        }}>
          <div>
            <label style={labelStyle}>Full Name *</label>
            <input type="text" value={form.fullName}
              onChange={e => set('fullName', e.target.value)}
              placeholder="Your full name" style={inputStyle} className="ps-input" />
          </div>
          <div>
            <label style={labelStyle}>Email Address *</label>
            <input type="email" value={form.email}
              onChange={e => set('email', e.target.value)}
              placeholder="you@company.com" style={inputStyle} className="ps-input" />
          </div>
          <div>
            <label style={labelStyle}>Phone Number *</label>
            <input type="tel" value={form.phone}
              onChange={e => set('phone', e.target.value)}
              placeholder="+234 800 000 0000" style={inputStyle} className="ps-input" />
          </div>
          <div>
            <label style={labelStyle}>Organisation <span style={{ opacity: .5 }}>(Optional)</span></label>
            <input type="text" value={form.company}
              onChange={e => set('company', e.target.value)}
              placeholder="Company or agency name" style={inputStyle} className="ps-input" />
          </div>
        </div>
      </div>

      {/* Organisation context */}
      <div>
        <div className="f-display" style={{
          fontSize: 13, fontWeight: 700, marginBottom: 16,
          paddingBottom: 10, borderBottom: '1px solid var(--border)',
        }}>Organisation Context</div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
        }}>
          <div>
            <label style={labelStyle}>Sector *</label>
            <select value={form.sector} onChange={e => set('sector', e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }} className="ps-input">
              <option value="">Select sector...</option>
              {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Organisation Size <span style={{ opacity: .5 }}>(Optional)</span></label>
            <select value={form.staffSize} onChange={e => set('staffSize', e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }} className="ps-input">
              <option value="">Select size...</option>
              {STAFF_SIZE.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Package Interest *</label>
            <select value={form.package} onChange={e => set('package', e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }} className="ps-input">
              <option value="">Select package...</option>
              {PACKAGES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Timeline / Urgency *</label>
            <select value={form.urgency} onChange={e => set('urgency', e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }} className="ps-input">
              <option value="">Select timeline...</option>
              {URGENCY.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Challenge */}
      <div>
        <label style={labelStyle}>
          Current Challenge * <span style={{ opacity: .5 }}>
            (What problem are you trying to solve? What is breaking down in your business today?)
          </span>
        </label>
        <textarea
          value={form.currentChallenge}
          onChange={e => set('currentChallenge', e.target.value)}
          rows={5}
          placeholder="e.g. Our staff manage everything in Excel — we have no real-time visibility into operations. Clients are complaining about slow response times and we suspect our processes are the reason..."
          style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7 }}
          className="ps-input"
        />
      </div>

      {/* Error */}
      {errorMsg && (
        <div style={{
          background: 'rgba(220,38,38,.05)',
          border: '1px solid rgba(220,38,38,.2)',
          padding: '12px 16px',
        }}>
          <p className="f-body" style={{ fontSize: 13, color: '#F87171' }}>{errorMsg}</p>
        </div>
      )}

      {/* Submit */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', paddingTop: 8 }}>
        <button
          type="submit"
          disabled={status === 'sending'}
          className="btn btn-primary"
          style={{
            fontSize: 12,
            opacity: status === 'sending' ? .6 : 1,
            cursor: status === 'sending' ? 'not-allowed' : 'pointer',
          }}
        >
          {status === 'sending' ? 'Submitting...' : 'Book Discovery Call →'}
        </button>
        <p className="f-mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.08em' }}>
          Free 45-min call · No commitment · Response within 48 hrs
        </p>
      </div>

    </form>
  );
}

export default function ConsultingEnquirySection() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* Info strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))',
        gap: 12, marginBottom: 40,
      }}>
        {[
          { label: 'Discovery Call', value: 'Free'         },
          { label: 'Duration',       value: '45 minutes'   },
          { label: 'Response Time',  value: 'Within 48 hrs'},
          { label: 'Starting From',  value: '₦500,000'     },
        ].map(s => (
          <div key={s.label} style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            padding: '16px 20px',
          }}>
            <div className="f-mono" style={{
              fontSize: 9, letterSpacing: '.12em',
              textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6,
            }}>{s.label}</div>
            <div className="f-display" style={{
              fontSize: 16, fontWeight: 700, color: 'var(--blue-hi)',
            }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* CTA strip */}
      <div style={{
        background: 'rgba(37,99,235,.06)',
        border: '1px solid var(--blue-dim)',
        padding: '28px 32px',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: 20,
        marginBottom: open ? 24 : 0,
      }}>
        <div>
          <h3 className="f-display" style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>
            Book Your Free Discovery Call
          </h3>
          <p className="f-body" style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.6 }}>
            Tell us about your business and where it's struggling. We'll take it from there.
          </p>
        </div>
        <button
          onClick={() => setOpen(o => !o)}
          className="btn btn-primary"
          style={{ fontSize: 11, cursor: 'pointer', border: 'none', whiteSpace: 'nowrap' }}
        >
          {open ? '✕ Close Form' : 'Start Enquiry →'}
        </button>
      </div>

      {/* Form */}
      {open && (
        <div style={{
          background: 'var(--card)', border: '1px solid var(--border)',
          padding: 'clamp(28px,4vw,40px)',
        }}>
          <EnquiryForm />
        </div>
      )}
    </div>
  );
}
