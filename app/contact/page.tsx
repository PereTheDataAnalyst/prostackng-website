'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const [form,   setForm]   = useState({ name: '', email: '', phone: '', type: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error,  setError]  = useState('');
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Please fill in name, email, and message.'); return;
    }
    setError(''); setStatus('loading');
    try {
      const res  = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Server error');
      setStatus('success');
    } catch (err: any) {
      setStatus('error'); setError(err.message || 'Something went wrong. Please try again.');
    }
  };

  const inputBase: React.CSSProperties = {
    background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)',
    padding: '13px 16px', fontFamily: 'Instrument Sans, sans-serif', fontSize: 14,
    outline: 'none', width: '100%', transition: 'border-color .2s',
  };

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 68 }}>

        {/* Header */}
        <div
          className="relative overflow-hidden bg-grid"
          style={{ padding: 'clamp(60px,8vw,120px) clamp(16px,4vw,56px) clamp(40px,5vw,80px)', backgroundSize: '56px 56px' }}
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 40%, transparent 30%, var(--bg) 100%)' }} />
          <div className="absolute pointer-events-none"
            style={{ top: '-20%', left: '-5%', width: 600, height: 600, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(139,92,246,.1) 0%, transparent 65%)' }} />
          <div className="relative" style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div className="section-label">Contact</div>
            <h1 className="font-display font-black text-text" style={{ fontSize: 'clamp(40px,6vw,84px)', letterSpacing: '-.04em', lineHeight: .95, marginBottom: 20 }}>
              Let's talk about<br /><span style={{ color: 'var(--accent)' }}>your project.</span>
            </h1>
            <p className="text-sub" style={{ fontSize: 17, lineHeight: 1.9, maxWidth: 520 }}>
              First consultation is always free. No sales scripts — just an honest conversation about what you want built and whether we're the right team to build it.
            </p>
          </div>
        </div>

        {/* Body */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(40px,5vw,80px) clamp(16px,4vw,56px) clamp(60px,8vw,120px)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 'clamp(40px,6vw,80px)', alignItems: 'start' }}>

            {/* Left — info */}
            <div>
              {[
                { icon: '📍', label: 'Location',        value: 'Port Harcourt, Rivers State, Nigeria' },
                { icon: '📧', label: 'Email',            value: 'contact@prostackng.com' },
                { icon: '💬', label: 'WhatsApp',         value: '+234 705 944 9360' },
                { icon: '⚡', label: 'Response Time',    value: 'Within 2 business hours' },
              ].map((c, i) => (
                <div key={i} className="flex gap-4 mb-7">
                  <div
                    className="flex items-center justify-center text-lg flex-shrink-0"
                    style={{ width: 44, height: 44, background: 'rgba(139,92,246,.08)', border: '1px solid rgba(139,92,246,.2)' }}
                  >
                    {c.icon}
                  </div>
                  <div>
                    <div className="font-mono" style={{ color: 'var(--accent)', fontSize: 9.5, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 4 }}>{c.label}</div>
                    <div className="text-text" style={{ fontSize: 15 }}>{c.value}</div>
                  </div>
                </div>
              ))}

              {/* Free consultation card */}
              <div style={{ background: 'var(--card)', border: '1px solid var(--borderhi)', padding: 32, marginTop: 8, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,var(--accent),var(--accent2),transparent)' }} />
                <div className="font-mono" style={{ color: 'var(--accent)', fontSize: 9.5, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 20 }}>
                  Free Consultation Includes
                </div>
                {[
                  '45-minute strategy call',
                  'Technical audit of your current systems',
                  'Written architecture recommendations',
                  'Fixed-price project quote — no obligation',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 mb-3">
                    <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 12, marginTop: 2, flexShrink: 0 }}>✓</span>
                    <span className="text-sub" style={{ fontSize: 13.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — form */}
            <div style={{ background: 'var(--card)', border: '1px solid var(--borderhi)', padding: 'clamp(32px,4vw,52px)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,var(--accent),var(--accent2),transparent)' }} />

              {status === 'success' ? (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                  <div style={{ fontSize: 52, marginBottom: 24 }}>✅</div>
                  <h3 className="font-display font-black" style={{ color: 'var(--accent)', fontSize: 26, marginBottom: 16 }}>Message Received!</h3>
                  <p className="text-sub" style={{ lineHeight: 1.8 }}>
                    Thanks, <strong style={{ color: 'var(--text)' }}>{form.name.split(' ')[0]}</strong>.<br />
                    You'll hear from us within 2 business hours.<br />
                    Check your email for a confirmation.
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="font-display font-bold text-text mb-8" style={{ fontSize: 22 }}>Start a Conversation</h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                    {[
                      { ph: 'Full Name *',     type: 'text',  key: 'name'  },
                      { ph: 'Email Address *', type: 'email', key: 'email' },
                    ].map(f => (
                      <input key={f.key} placeholder={f.ph} type={f.type} value={(form as any)[f.key]}
                        onChange={e => set(f.key, e.target.value)}
                        style={inputBase}
                        onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--accent)'; }}
                        onBlur={e  => { (e.target as HTMLInputElement).style.borderColor = 'var(--border)'; }} />
                    ))}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                    <input placeholder="WhatsApp Number" value={form.phone} onChange={e => set('phone', e.target.value)}
                      style={inputBase}
                      onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--accent)'; }}
                      onBlur={e  => { (e.target as HTMLInputElement).style.borderColor = 'var(--border)'; }} />
                    <select value={form.type} onChange={e => set('type', e.target.value)}
                      style={{ ...inputBase, color: form.type ? 'var(--text)' : 'var(--muted)', appearance: 'none' }}>
                      <option value="">Enquiry Type</option>
                      <option>New Project / Build</option>
                      <option>IT Consulting</option>
                      <option>Product Demo — ProTrackNG</option>
                      <option>Product Demo — NightOps</option>
                      <option>Product Demo — AutoReport</option>
                      <option>Partnership</option>
                      <option>Investment</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <textarea rows={5}
                    placeholder="Describe your project — what problem are you solving? *"
                    value={form.message}
                    onChange={e => set('message', e.target.value)}
                    style={{ ...inputBase, resize: 'vertical', marginBottom: 24 }}
                    onFocus={e => { (e.target as HTMLTextAreaElement).style.borderColor = 'var(--accent)'; }}
                    onBlur={e  => { (e.target as HTMLTextAreaElement).style.borderColor = 'var(--border)'; }} />

                  {error && (
                    <p className="font-mono" style={{ color: '#FF5757', marginBottom: 16, fontSize: 12 }}>⚠ {error}</p>
                  )}

                  <button
                    onClick={submit}
                    disabled={status === 'loading'}
                    className="w-full font-display font-bold transition-all duration-300"
                    style={{
                      background: status === 'loading' ? '#6D40C4' : 'var(--accent)',
                      color: '#fff', padding: '16px 0', fontSize: 14,
                      letterSpacing: '.06em', textTransform: 'uppercase',
                      border: 'none', cursor: 'pointer',
                    }}
                    onMouseEnter={e => { if (status !== 'loading') (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(139,92,246,.4)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}>
                    {status === 'loading' ? 'Sending…' : 'Send Message →'}
                  </button>
                  <p className="font-mono text-muted text-center mt-3" style={{ fontSize: 10.5 }}>
                    🔒 Your information is confidential and never shared.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
