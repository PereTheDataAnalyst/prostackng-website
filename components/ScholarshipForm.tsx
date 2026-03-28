'use client';
import { useState } from 'react';

const COURSES = [
  'Building SaaS with Next.js + Supabase',
  'Process Automation for Nigerian Businesses',
  'Tender Intelligence — Winning Nigerian Government Contracts',
  'Digital Transformation for Nigerian SMEs',
  'Launching a Tech Startup in Nigeria from Scratch',
];

const ID_TYPES = [
  'National Identification Number (NIN)',
  'International Passport',
  "Voter's Card",
  "Driver's Licence",
];

const STATUSES = [
  'Student (University / Polytechnic)',
  'Student (Secondary School)',
  'Employed (Full-time)',
  'Employed (Part-time)',
  'Self-Employed / Freelancer',
  'Unemployed',
  'Business Owner',
];

const REFERRAL = [
  'Google Search',
  'LinkedIn',
  'Twitter / X',
  'WhatsApp',
  'Friend / Colleague',
  'University / School Notice',
  'Newspaper / Blog',
  'Other',
];

const NIGERIAN_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
  'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT (Abuja)',
  'Gombe','Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara',
  'Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers',
  'Sokoto','Taraba','Yobe','Zamfara',
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
  fullName: string; email: string; phone: string;
  stateOfResidence: string; idType: string; idNumber: string;
  currentStatus: string; institution: string;
  preferredCourse: string; statementOfPurpose: string;
  financialNeed: string; referralSource: string;
};

const EMPTY: FormData = {
  fullName: '', email: '', phone: '', stateOfResidence: '',
  idType: '', idNumber: '', currentStatus: '', institution: '',
  preferredCourse: '', statementOfPurpose: '', financialNeed: '', referralSource: '',
};

export default function ScholarshipForm() {
  const [form, setForm] = useState<FormData>(EMPTY);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  function set(field: keyof FormData, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Basic validation
    const required: (keyof FormData)[] = [
      'fullName', 'email', 'phone', 'stateOfResidence', 'idType', 'idNumber',
      'currentStatus', 'preferredCourse', 'statementOfPurpose', 'financialNeed',
    ];
    const missing = required.filter(f => !form[f].trim());
    if (missing.length > 0) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }
    if (form.statementOfPurpose.trim().split(/\s+/).length < 50) {
      setErrorMsg('Your statement of purpose should be at least 50 words.');
      return;
    }
    setErrorMsg('');
    setStatus('sending');
    try {
      const res = await fetch('/api/scholarship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Server error');
      setStatus('success');
      setForm(EMPTY);
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again or email academy@prostackng.com.ng');
    }
  }

  if (status === 'success') {
    return (
      <div style={{
        background: 'rgba(16,185,129,.06)', border: '1px solid rgba(16,185,129,.25)',
        padding: '40px 32px', textAlign: 'center',
      }}>
        <div style={{ fontSize: 36, marginBottom: 16 }}>🎓</div>
        <h3 className="f-display" style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-.02em', marginBottom: 12, color: '#34D399' }}>
          Application Received
        </h3>
        <p className="f-body" style={{ fontSize: 14, color: 'var(--sub)', lineHeight: 1.8, maxWidth: 480, margin: '0 auto' }}>
          Thank you for applying. We review all scholarship applications 4 weeks before each cohort
          and will contact you at <strong style={{ color: 'var(--text)' }}>{form.email || 'your email'}</strong> with the outcome.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Personal Details */}
      <div>
        <div className="f-display" style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>
          Personal Details
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>

          <div>
            <label style={labelStyle}>Full Name *</label>
            <input
              type="text" value={form.fullName} onChange={e => set('fullName', e.target.value)}
              placeholder="As on your ID" style={inputStyle} className="ps-input"
            />
          </div>

          <div>
            <label style={labelStyle}>Email Address *</label>
            <input
              type="email" value={form.email} onChange={e => set('email', e.target.value)}
              placeholder="you@example.com" style={inputStyle} className="ps-input"
            />
          </div>

          <div>
            <label style={labelStyle}>Phone Number *</label>
            <input
              type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
              placeholder="+234 800 000 0000" style={inputStyle} className="ps-input"
            />
          </div>

          <div>
            <label style={labelStyle}>State of Residence *</label>
            <select
              value={form.stateOfResidence} onChange={e => set('stateOfResidence', e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }} className="ps-input"
            >
              <option value="">Select state...</option>
              {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

        </div>
      </div>

      {/* Identity Verification */}
      <div>
        <div className="f-display" style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>
          Identity Verification
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>

          <div>
            <label style={labelStyle}>ID Type *</label>
            <select
              value={form.idType} onChange={e => set('idType', e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }} className="ps-input"
            >
              <option value="">Select ID type...</option>
              {ID_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle}>ID Number *</label>
            <input
              type="text" value={form.idNumber} onChange={e => set('idNumber', e.target.value)}
              placeholder="Enter your ID number" style={inputStyle} className="ps-input"
            />
          </div>

        </div>
        <p className="f-mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.08em', marginTop: 10 }}>
          Your ID is used solely for scholarship verification. It is stored securely and never shared with third parties.
        </p>
      </div>

      {/* Background */}
      <div>
        <div className="f-display" style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>
          Your Background
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>

          <div>
            <label style={labelStyle}>Current Status *</label>
            <select
              value={form.currentStatus} onChange={e => set('currentStatus', e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }} className="ps-input"
            >
              <option value="">Select status...</option>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Institution / Employer <span style={{ opacity: .5 }}>(Optional)</span></label>
            <input
              type="text" value={form.institution} onChange={e => set('institution', e.target.value)}
              placeholder="University, company, etc." style={inputStyle} className="ps-input"
            />
          </div>

          <div>
            <label style={labelStyle}>Preferred Course *</label>
            <select
              value={form.preferredCourse} onChange={e => set('preferredCourse', e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }} className="ps-input"
            >
              <option value="">Select a course...</option>
              {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

        </div>
      </div>

      {/* Written Statements */}
      <div>
        <div className="f-display" style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>
          Written Statements
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          <div>
            <label style={labelStyle}>
              Statement of Purpose * <span style={{ opacity: .5 }}>(min. 50 words — Why do you want to take this course? What will you do with it?)</span>
            </label>
            <textarea
              value={form.statementOfPurpose} onChange={e => set('statementOfPurpose', e.target.value)}
              rows={6} placeholder="Tell us your story, your goals, and why this course matters to you..."
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7 }}
              className="ps-input"
            />
            <div className="f-mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.08em', marginTop: 6 }}>
              {form.statementOfPurpose.trim().split(/\s+/).filter(Boolean).length} words
            </div>
          </div>

          <div>
            <label style={labelStyle}>
              Financial Need Statement * <span style={{ opacity: .5 }}>(Why do you need financial assistance?)</span>
            </label>
            <textarea
              value={form.financialNeed} onChange={e => set('financialNeed', e.target.value)}
              rows={4} placeholder="Describe your current financial situation and why a scholarship would make a real difference..."
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7 }}
              className="ps-input"
            />
          </div>

        </div>
      </div>

      {/* Referral */}
      <div>
        <label style={labelStyle}>How did you hear about ProStack NG Academy?</label>
        <select
          value={form.referralSource} onChange={e => set('referralSource', e.target.value)}
          style={{ ...inputStyle, maxWidth: 320, cursor: 'pointer' }} className="ps-input"
        >
          <option value="">Select...</option>
          {REFERRAL.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* Error */}
      {errorMsg && (
        <div style={{ background: 'rgba(220,38,38,.06)', border: '1px solid rgba(220,38,38,.2)', padding: '12px 16px' }}>
          <p className="f-body" style={{ fontSize: 13, color: '#F87171' }}>{errorMsg}</p>
        </div>
      )}

      {/* Submit */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', paddingTop: 8 }}>
        <button
          type="submit"
          disabled={status === 'sending'}
          className="btn btn-primary"
          style={{ fontSize: 12, opacity: status === 'sending' ? .6 : 1, cursor: status === 'sending' ? 'not-allowed' : 'pointer' }}
        >
          {status === 'sending' ? 'Submitting...' : 'Submit Application →'}
        </button>
        <p className="f-mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.08em' }}>
          Applications reviewed 4 weeks before each cohort
        </p>
      </div>

    </form>
  );
}
