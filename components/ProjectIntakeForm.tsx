'use client';
import { useState } from 'react';

const PACKAGES = [
  'MVP Package — ₦2,000,000 (8 weeks)',
  'Growth Package — ₦5,000,000 (12 weeks)',
  'Enterprise Package — Custom scope & pricing',
  "I'm not sure yet — need a scoping call",
];

const INDUSTRIES = [
  'Oil & Gas', 'Financial Services / Fintech', 'Healthcare',
  'Education / EdTech', 'Government / Public Sector', 'Retail & Commerce',
  'Hospitality & Entertainment', 'Logistics & Transportation',
  'Agriculture / AgriTech', 'Real Estate', 'Other',
];

const TIMELINES = [
  'ASAP — within 4 weeks', '1–3 months', '3–6 months', 'Flexible / not urgent',
];

const BUDGETS = [
  'Under ₦2M', '₦2M – ₦5M', '₦5M – ₦10M', '₦10M+', 'Need to discuss',
];

const HOW_HEARD = [
  'Google Search', 'LinkedIn', 'Referral / Word of mouth',
  'Twitter / X', 'ProStack NG website', 'Other',
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
  industry: string; package: string; projectSummary: string;
  keyFeatures: string; timeline: string; budget: string;
  existingSystem: string; howHeard: string;
};

const EMPTY: FormData = {
  fullName: '', email: '', phone: '', company: '',
  industry: '', package: '', projectSummary: '', keyFeatures: '',
  timeline: '', budget: '', existingSystem: '', howHeard: '',
};

export default function ProjectIntakeForm() {
  const [form, setForm] = useState<FormData>(EMPTY);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  function set(field: keyof FormData, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const required: (keyof FormData)[] = ['fullName', 'email', 'phone', 'industry', 'package', 'projectSummary', 'timeline', 'budget'];
    const missing = required.filter(f => !form[f].trim());
    if (missing.length > 0) { setErrorMsg('Please fill in all required fields.'); return; }
    if (form.projectSummary.trim().split(/\s+/).length < 20) {
      setErrorMsg('Please describe your project in at least 20 words.'); return;
    }
    setErrorMsg('');
    setStatus('sending');
    try {
      const res = await fetch('/api/project-intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Server error');
      setStatus('success');
      setForm(EMPTY);
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong. Email us directly at hello@prostackng.com.ng');
    }
  }

  if (status === 'success') {
    return (
      <div style={{ background: 'rgba(16,185,129,.06)', border: '1px solid rgba(16,185,129,.25)', padding: '40px 32px', textAlign: 'center' }}>
        <div style={{ fontSize: 36, marginBottom: 16 }}>🚀</div>
        <h3 className="f-display" style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-.02em', marginBottom: 12, color: '#34D399' }}>Project Brief Received</h3>
        <p className="f-body" style={{ fontSize: 14, color: 'var(--sub)', lineHeight: 1.8, maxWidth: 480, margin: '0 auto' }}>
          Thank you. We will review your brief and respond within 48 hours with a scoping call invitation.
          Check your inbox at <strong style={{ color: 'var(--text)' }}>{form.email || 'your email'}</strong>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* Contact */}
      <div>
        <div className="f-display" style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>Contact Information</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          <div>
            <label style={labelStyle}>Full Name *</label>
            <input type="text" value={form.fullName} onChange={e => set('fullName', e.target.value)} placeholder="Your full name" style={inputStyle} className="ps-input" />
          </div>
          <div>
            <label style={labelStyle}>Email Address *</label>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@company.com" style={inputStyle} className="ps-input" />
          </div>
          <div>
            <label style={labelStyle}>Phone Number *</label>
            <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+234 800 000 0000" style={inputStyle} className="ps-input" />
          </div>
          <div>
            <label style={labelStyle}>Company / Organisation <span style={{ opacity: .5 }}>(Optional)</span></label>
            <input type="text" value={form.company} onChange={e => set('company', e.target.value)} placeholder="Company name" style={inputStyle} className="ps-input" />
          </div>
        </div>
      </div>

      {/* Project */}
      <div>
        <div className="f-display" style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>Project Details</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            <div>
              <label style={labelStyle}>Industry *</label>
              <select value={form.industry} onChange={e => set('industry', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }} className="ps-input">
                <option value="">Select industry...</option>
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Package Interest *</label>
              <select value={form.package} onChange={e => set('package', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }} className="ps-input">
                <option value="">Select a package...</option>
                {PACKAGES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Project Summary * <span style={{ opacity: .5 }}>(What do you want built? Who is it for?)</span></label>
            <textarea value={form.projectSummary} onChange={e => set('projectSummary', e.target.value)} rows={5}
              placeholder="Describe your product idea, the problem it solves, and who your target users are..."
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7 }} className="ps-input" />
            <div className="f-mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.08em', marginTop: 6 }}>
              {form.projectSummary.trim().split(/\s+/).filter(Boolean).length} words
            </div>
          </div>

          <div>
            <label style={labelStyle}>Key Features <span style={{ opacity: .5 }}>(Optional — list the core features you know you need)</span></label>
            <textarea value={form.keyFeatures} onChange={e => set('keyFeatures', e.target.value)} rows={4}
              placeholder="e.g. User login, admin dashboard, payment integration, PDF reports, WhatsApp notifications..."
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7 }} className="ps-input" />
          </div>

          <div>
            <label style={labelStyle}>Existing System / Context <span style={{ opacity: .5 }}>(Optional — what does the client use today?)</span></label>
            <input type="text" value={form.existingSystem} onChange={e => set('existingSystem', e.target.value)}
              placeholder="e.g. Excel spreadsheets, a legacy system, nothing yet..." style={inputStyle} className="ps-input" />
          </div>

        </div>
      </div>

      {/* Timeline & Budget */}
      <div>
        <div className="f-display" style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>Timeline & Budget</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          <div>
            <label style={labelStyle}>Desired Timeline *</label>
            <select value={form.timeline} onChange={e => set('timeline', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }} className="ps-input">
              <option value="">Select timeline...</option>
              {TIMELINES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Budget Range *</label>
            <select value={form.budget} onChange={e => set('budget', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }} className="ps-input">
              <option value="">Select budget range...</option>
              {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* How heard */}
      <div>
        <label style={labelStyle}>How did you hear about ProStack NG?</label>
        <select value={form.howHeard} onChange={e => set('howHeard', e.target.value)} style={{ ...inputStyle, maxWidth: 320, cursor: 'pointer' }} className="ps-input">
          <option value="">Select...</option>
          {HOW_HEARD.map(h => <option key={h} value={h}>{h}</option>)}
        </select>
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
          {status === 'sending' ? 'Submitting...' : 'Submit Project Brief →'}
        </button>
        <p className="f-mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.08em' }}>
          We respond within 48 hours · All briefs are confidential
        </p>
      </div>

    </form>
  );
}
