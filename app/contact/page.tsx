'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StackLogo from '@/components/StackLogo';

const SERVICES = [
  'Custom Platform Development',
  'AutoReport Setup',
  'ProTrackNG Onboarding',
  'NightOps Deployment',
  'API Integration',
  'Investor Discussion',
  'Other',
];

export default function ContactPage() {
  const [form, setForm]     = useState({ name: '', email: '', company: '', service: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      setStatus(r.ok ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 68 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(64px,8vw,100px) clamp(16px,4vw,56px)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 72 }}>

            {/* Left: info */}
            <div>
              <div className="eyebrow" style={{ marginBottom: 20 }}>Get In Touch</div>
              <h1 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(36px,5vw,64px)', letterSpacing: '-.05em', lineHeight: .9, color: 'var(--text)', marginBottom: 24 }}>
                Let&apos;s build<br /><span style={{ color: 'var(--blue-hi)' }}>something real.</span>
              </h1>
              <p style={{ fontSize: 15, color: 'var(--sub)', lineHeight: 1.85, marginBottom: 48, maxWidth: 400 }}>
                Free 45-minute strategy session. Tell us what you&apos;re building and we&apos;ll tell you exactly how we&apos;d build it — and whether you even need us to.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                {[
                  { icon: '📧', label: 'Email', value: 'contact@prostackng.com', href: 'mailto:contact@prostackng.com' },
                  { icon: '💬', label: 'WhatsApp', value: '+234 705 944 9360', href: 'https://wa.me/2347059449360' },
                  { icon: '📍', label: 'Location', value: 'Port Harcourt, Rivers State, Nigeria', href: undefined },
                ].map(c => (
                  <div key={c.label} style={{ display: 'flex', gap: 16 }}>
                    <div style={{ fontSize: 18, marginTop: 1 }}>{c.icon}</div>
                    <div>
                      <div className="f-mono" style={{ fontSize: 9, letterSpacing: '.14em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 4 }}>{c.label}</div>
                      {c.href
                        ? <a href={c.href} style={{ fontSize: 14, color: 'var(--blue-hi)', textDecoration: 'none', fontWeight: 500 }}>{c.value}</a>
                        : <div style={{ fontSize: 14, color: 'var(--sub)' }}>{c.value}</div>}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 60, opacity: .06 }}>
                <StackLogo size={120} />
              </div>
            </div>

            {/* Right: form */}
            <div>
              <div style={{ background: 'var(--card)', border: '1px solid var(--hi)', overflow: 'hidden' }}>
                <div style={{ height: 2, background: 'linear-gradient(90deg, var(--blue), #06B6D4)' }} />
                <div style={{ padding: 'clamp(28px,4vw,48px)' }}>
                  {status === 'done' ? (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                      <div style={{ fontSize: 48, marginBottom: 20 }}>✓</div>
                      <div className="f-display" style={{ fontWeight: 800, fontSize: 24, color: 'var(--text)', marginBottom: 12 }}>Message received.</div>
                      <p style={{ fontSize: 14, color: 'var(--sub)', lineHeight: 1.75 }}>
                        We&apos;ll be in touch within 24 hours. Or message us directly on WhatsApp for a faster reply.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12 }}>
                        <div>
                          <label className="f-mono" style={{ fontSize: 9.5, letterSpacing: '.14em', color: 'var(--muted)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Full Name *</label>
                          <input className="ps-input" placeholder="John Doe" value={form.name} onChange={e => set('name', e.target.value)} required />
                        </div>
                        <div>
                          <label className="f-mono" style={{ fontSize: 9.5, letterSpacing: '.14em', color: 'var(--muted)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Email *</label>
                          <input className="ps-input" type="email" placeholder="you@company.com" value={form.email} onChange={e => set('email', e.target.value)} required />
                        </div>
                      </div>
                      <div>
                        <label className="f-mono" style={{ fontSize: 9.5, letterSpacing: '.14em', color: 'var(--muted)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Company / Organisation</label>
                        <input className="ps-input" placeholder="Acme Corp" value={form.company} onChange={e => set('company', e.target.value)} />
                      </div>
                      <div>
                        <label className="f-mono" style={{ fontSize: 9.5, letterSpacing: '.14em', color: 'var(--muted)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>I&apos;m interested in</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                          {SERVICES.map(s => (
                            <button key={s} type="button" onClick={() => set('service', s)} style={{
                              fontFamily: 'JetBrains Mono, monospace',
                              fontSize: 10, letterSpacing: '.06em',
                              padding: '6px 13px',
                              border: `1px solid ${form.service === s ? 'var(--blue)' : 'var(--border)'}`,
                              background: form.service === s ? 'var(--blue-lo)' : 'transparent',
                              color: form.service === s ? 'var(--blue-hi)' : 'var(--muted)',
                              cursor: 'pointer',
                              transition: 'all .2s',
                            }}>
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="f-mono" style={{ fontSize: 9.5, letterSpacing: '.14em', color: 'var(--muted)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Message *</label>
                        <textarea className="ps-input" placeholder="Tell us what you're building or what problem you need solved..." value={form.message} onChange={e => set('message', e.target.value)} required rows={5} style={{ resize: 'vertical', minHeight: 120 }} />
                      </div>
                      {status === 'error' && (
                        <p style={{ fontSize: 12.5, color: '#FF5757' }}>Something went wrong. Please try WhatsApp or email directly.</p>
                      )}
                      <button type="submit" disabled={status === 'sending'} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', opacity: status === 'sending' ? .6 : 1, cursor: status === 'sending' ? 'wait' : 'pointer' }}>
                        {status === 'sending' ? 'Sending...' : 'Send Message →'}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
