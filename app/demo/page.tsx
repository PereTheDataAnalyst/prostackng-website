'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StackLogo from '@/components/StackLogo';

const PRODUCTS = [
  { id: 'autoreport',  label: 'AutoReport',  color: '#FF5757', icon: '▦', desc: 'Executive reporting pipeline' },
  { id: 'protrackng', label: 'ProTrackNG',  color: '#06B6D4', icon: '◎', desc: 'Tender intelligence' },
  { id: 'nightops',   label: 'NightOps',    color: '#A78BFA', icon: '◈', desc: 'Nightlife operating system' },
  { id: 'myharriet',  label: 'MyHarriet',   color: '#F5B530', icon: '⬡', desc: 'Commerce & marketplace' },
  { id: 'general',    label: 'General enquiry / not sure yet', color: '#2563EB', icon: '◆', desc: '' },
];

const SLOTS = [
  { day: 'Monday',    slots: ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'] },
  { day: 'Tuesday',   slots: ['9:00 AM', '11:00 AM', '2:00 PM'] },
  { day: 'Wednesday', slots: ['10:00 AM', '12:00 PM', '3:00 PM', '5:00 PM'] },
  { day: 'Thursday',  slots: ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'] },
  { day: 'Friday',    slots: ['9:00 AM', '11:00 AM', '1:00 PM'] },
];

const GOALS = [
  'See a live product demo',
  'Understand pricing for my business',
  'Discuss a custom build',
  'Explore investment opportunity',
  'Technical integration questions',
  'General discovery call',
];

type Step = 'product' | 'slot' | 'details' | 'confirm';

export default function DemoPage() {
  const [step, setStep]       = useState<Step>('product');
  const [product, setProduct] = useState('');
  const [day, setDay]         = useState('');
  const [time, setTime]       = useState('');
  const [goal, setGoal]       = useState('');
  const [form, setForm]       = useState({ name: '', email: '', company: '', phone: '', notes: '' });
  const [sending, setSending] = useState(false);
  const [done, setDone]       = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const progress = { product: 25, slot: 50, details: 75, confirm: 100 }[step];

  const submit = async () => {
    setSending(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company,
          service: `DEMO REQUEST — ${PRODUCTS.find(p => p.id === product)?.label}`,
          message: `Demo request:\n\nProduct: ${PRODUCTS.find(p => p.id === product)?.label}\nPreferred slot: ${day} at ${time}\nGoal: ${goal}\nPhone: ${form.phone}\n\nNotes: ${form.notes}`,
        }),
      });
      setDone(true);
    } catch {
      setSending(false);
    }
  };

  // WhatsApp fallback message
  const waMsg = encodeURIComponent(
    `Hi! I'd like to book a demo for ${PRODUCTS.find(p => p.id === product)?.label ?? 'ProStack NG'}. Preferred time: ${day} ${time}. My name is ${form.name}.`
  );

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 68 }}>

        {/* ── TWO-COLUMN LAYOUT ── */}
        <div style={{ minHeight: 'calc(100vh - 68px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))' }}>

          {/* LEFT — context panel */}
          <div className="bg-grid" style={{
            background: 'var(--s1)', borderRight: '1px solid var(--border)',
            padding: 'clamp(48px,6vw,80px) clamp(24px,4vw,64px)',
            display: 'flex', flexDirection: 'column',
            backgroundSize: '52px 52px', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 90% 80% at 20% 60%, transparent 50%, var(--s1) 100%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', flex: 1 }}>
              <div className="eyebrow" style={{ marginBottom: 20 }}>Free Strategy Session</div>
              <h1 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(36px,4.5vw,62px)', letterSpacing: '-.05em', lineHeight: .9, color: 'var(--text)', marginBottom: 24 }}>
                45 minutes.<br /><span style={{ color: 'var(--blue-hi)' }}>No pitch.</span><br />Just answers.
              </h1>
              <p style={{ fontSize: 15, color: 'var(--sub)', lineHeight: 1.9, marginBottom: 44, maxWidth: 420 }}>
                Tell us what you&apos;re trying to solve. We&apos;ll show you exactly how we&apos;d build it — and be honest if we&apos;re not the right fit.
              </p>

              {/* What to expect */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 48 }}>
                {[
                  { n: '01', title: 'Live product walkthrough', desc: 'We share our screen and walk through every relevant feature in real time.' },
                  { n: '02', title: 'Honest fit assessment',    desc: 'We tell you whether our platform actually solves your problem — not just a sales pitch.' },
                  { n: '03', title: 'Clear next steps',         desc: 'You leave with a plan: what to build, what it costs, and when it can go live.' },
                ].map(e => (
                  <div key={e.n} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div className="f-mono" style={{ fontSize: 9.5, color: 'var(--blue)', letterSpacing: '.1em', marginTop: 3, flexShrink: 0 }}>{e.n}</div>
                    <div>
                      <div className="f-display" style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 3 }}>{e.title}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--sub)', lineHeight: 1.7 }}>{e.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact alternatives */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 28, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="f-mono" style={{ fontSize: 9, letterSpacing: '.14em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 4 }}>Prefer to reach out directly?</div>
                <a href="https://wa.me/2347059449360" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                  <span style={{ fontSize: 14 }}>💬</span>
                  <span style={{ fontSize: 13, color: 'var(--sub)' }}>WhatsApp: <span style={{ color: 'var(--blue-hi)' }}>+234 705 944 9360</span></span>
                </a>
                <a href="mailto:contact@prostackng.com.ng" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                  <span style={{ fontSize: 14 }}>📧</span>
                  <span style={{ fontSize: 13, color: 'var(--sub)' }}>Email: <span style={{ color: 'var(--blue-hi)' }}>contact@prostackng.com.ng</span></span>
                </a>
              </div>

              {/* Faint logo watermark */}
              <div style={{ marginTop: 48, opacity: .04 }}>
                <StackLogo size={96} />
              </div>
            </div>
          </div>

          {/* RIGHT — booking flow */}
          <div style={{ padding: 'clamp(48px,6vw,80px) clamp(24px,4vw,64px)', display: 'flex', flexDirection: 'column' }}>

            {done ? (
              /* ── SUCCESS STATE ── */
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
                <div style={{ width: 72, height: 72, background: 'rgba(37,99,235,.08)', border: '1px solid rgba(37,99,235,.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 28 }}>✓</div>
                <div className="f-display" style={{ fontWeight: 800, fontSize: 28, color: 'var(--text)', letterSpacing: '-.03em', marginBottom: 14 }}>
                  You&apos;re booked.
                </div>
                <p style={{ fontSize: 15, color: 'var(--sub)', lineHeight: 1.85, marginBottom: 32 }}>
                  We&apos;ve received your request for <strong style={{ color: 'var(--text)' }}>{day} at {time}</strong>. Expect a confirmation email within the hour. We&apos;ll send a Google Meet link before the session.
                </p>
                <a href={`https://wa.me/2347059449360?text=${waMsg}`} target="_blank" rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', textDecoration: 'none', background: '#25D366', color: '#fff', padding: '12px 28px' }}>
                  💬 Confirm on WhatsApp too
                </a>
              </div>
            ) : (
              <>
                {/* Progress bar */}
                <div style={{ marginBottom: 40 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    {(['product', 'slot', 'details', 'confirm'] as Step[]).map((s, i) => (
                      <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: '50%',
                          background: step === s ? 'var(--blue)' : progress > (i + 1) * 25 ? 'var(--blue-dim)' : 'var(--card)',
                          border: `1px solid ${step === s ? 'var(--blue-hi)' : progress > (i + 1) * 25 ? 'var(--blue-dim)' : 'var(--border)'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5,
                          color: step === s || progress > (i + 1) * 25 ? '#fff' : 'var(--muted)',
                          transition: 'all .3s',
                        }}>
                          {progress > (i + 1) * 25 ? '✓' : i + 1}
                        </div>
                        <span className="f-mono" style={{ fontSize: 8.5, letterSpacing: '.1em', textTransform: 'uppercase', color: step === s ? 'var(--text)' : 'var(--muted)' }}>
                          {s === 'product' ? 'Product' : s === 'slot' ? 'Time' : s === 'details' ? 'Details' : 'Confirm'}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div style={{ height: 2, background: 'var(--border)', borderRadius: 1 }}>
                    <div style={{ height: '100%', width: `${progress}%`, background: 'var(--blue)', transition: 'width .4s ease', borderRadius: 1 }} />
                  </div>
                </div>

                {/* STEP 1 — Product */}
                {step === 'product' && (
                  <div style={{ flex: 1 }}>
                    <div className="eyebrow" style={{ marginBottom: 16 }}>Step 1 of 4</div>
                    <h2 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(22px,3vw,34px)', letterSpacing: '-.03em', color: 'var(--text)', marginBottom: 28 }}>
                      Which product are you interested in?
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {PRODUCTS.map(p => (
                        <button key={p.id} onClick={() => { setProduct(p.id); setStep('slot'); }}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 16,
                            padding: '16px 20px', cursor: 'pointer', textAlign: 'left',
                            background: product === p.id ? `${p.color}08` : 'var(--card)',
                            border: `1px solid ${product === p.id ? p.color : 'var(--border)'}`,
                            transition: 'all .2s', width: '100%',
                          }}>
                          <div style={{ fontSize: 20, color: p.color, flexShrink: 0, width: 28, textAlign: 'center' }}>{p.icon}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="f-display" style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', lineHeight: 1 }}>{p.label}</div>
                            {p.desc && <div className="f-mono" style={{ fontSize: 9.5, color: 'var(--muted)', letterSpacing: '.08em', marginTop: 4, textTransform: 'uppercase' }}>{p.desc}</div>}
                          </div>
                          <div style={{ color: product === p.id ? p.color : 'var(--muted)', fontSize: 14, flexShrink: 0 }}>→</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 2 — Time Slot */}
                {step === 'slot' && (
                  <div style={{ flex: 1 }}>
                    <div className="eyebrow" style={{ marginBottom: 16 }}>Step 2 of 4</div>
                    <h2 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(22px,3vw,34px)', letterSpacing: '-.03em', color: 'var(--text)', marginBottom: 8 }}>
                      Pick a time that works for you.
                    </h2>
                    <p style={{ fontSize: 13, color: 'var(--sub)', marginBottom: 28 }}>All times are WAT (West Africa Time, GMT+1).</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
                      {SLOTS.map(s => (
                        <div key={s.day}>
                          <div className="f-mono" style={{ fontSize: 9, letterSpacing: '.14em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>{s.day}</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {s.slots.map(t => {
                              const sel = day === s.day && time === t;
                              return (
                                <button key={t} onClick={() => { setDay(s.day); setTime(t); }}
                                  style={{
                                    fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                                    letterSpacing: '.06em', padding: '8px 16px', cursor: 'pointer',
                                    background: sel ? 'var(--blue)' : 'var(--card)',
                                    border: `1px solid ${sel ? 'var(--blue)' : 'var(--border)'}`,
                                    color: sel ? '#fff' : 'var(--sub)',
                                    transition: 'all .2s',
                                  }}>
                                  {t}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button onClick={() => setStep('product')} className="btn btn-ghost btn-sm">← Back</button>
                      <button onClick={() => day && time && setStep('details')}
                        className="btn btn-primary btn-sm"
                        style={{ opacity: day && time ? 1 : .4, cursor: day && time ? 'pointer' : 'default' }}>
                        Continue →
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3 — Details */}
                {step === 'details' && (
                  <div style={{ flex: 1 }}>
                    <div className="eyebrow" style={{ marginBottom: 16 }}>Step 3 of 4</div>
                    <h2 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(22px,3vw,34px)', letterSpacing: '-.03em', color: 'var(--text)', marginBottom: 28 }}>
                      A few details so we prepare.
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12 }}>
                        <div>
                          <label className="f-mono" style={{ fontSize: 9.5, letterSpacing: '.14em', color: 'var(--muted)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Full Name *</label>
                          <input className="ps-input" placeholder="Your name" value={form.name} onChange={e => set('name', e.target.value)} required />
                        </div>
                        <div>
                          <label className="f-mono" style={{ fontSize: 9.5, letterSpacing: '.14em', color: 'var(--muted)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Email *</label>
                          <input className="ps-input" type="email" placeholder="you@company.com" value={form.email} onChange={e => set('email', e.target.value)} required />
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12 }}>
                        <div>
                          <label className="f-mono" style={{ fontSize: 9.5, letterSpacing: '.14em', color: 'var(--muted)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Company</label>
                          <input className="ps-input" placeholder="Acme Corp" value={form.company} onChange={e => set('company', e.target.value)} />
                        </div>
                        <div>
                          <label className="f-mono" style={{ fontSize: 9.5, letterSpacing: '.14em', color: 'var(--muted)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>WhatsApp / Phone</label>
                          <input className="ps-input" placeholder="+234 800 000 0000" value={form.phone} onChange={e => set('phone', e.target.value)} />
                        </div>
                      </div>
                      <div>
                        <label className="f-mono" style={{ fontSize: 9.5, letterSpacing: '.14em', color: 'var(--muted)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>What do you want to get out of this call?</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 12 }}>
                          {GOALS.map(g => (
                            <button key={g} type="button" onClick={() => setGoal(g)} style={{
                              fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, letterSpacing: '.06em',
                              padding: '6px 13px', cursor: 'pointer',
                              background: goal === g ? 'rgba(37,99,235,.08)' : 'transparent',
                              border: `1px solid ${goal === g ? 'var(--blue)' : 'var(--border)'}`,
                              color: goal === g ? 'var(--blue-hi)' : 'var(--muted)',
                              transition: 'all .2s',
                            }}>
                              {g}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="f-mono" style={{ fontSize: 9.5, letterSpacing: '.14em', color: 'var(--muted)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Anything we should know beforehand?</label>
                        <textarea className="ps-input" placeholder="Context about your business, current setup, or specific questions..." value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} style={{ resize: 'vertical' }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                      <button onClick={() => setStep('slot')} className="btn btn-ghost btn-sm">← Back</button>
                      <button onClick={() => form.name && form.email && setStep('confirm')}
                        className="btn btn-primary btn-sm"
                        style={{ opacity: form.name && form.email ? 1 : .4, cursor: form.name && form.email ? 'pointer' : 'default' }}>
                        Review Booking →
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4 — Confirm */}
                {step === 'confirm' && (
                  <div style={{ flex: 1 }}>
                    <div className="eyebrow" style={{ marginBottom: 16 }}>Step 4 of 4</div>
                    <h2 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(22px,3vw,34px)', letterSpacing: '-.03em', color: 'var(--text)', marginBottom: 28 }}>
                      Confirm your booking.
                    </h2>
                    <div style={{ background: 'var(--card)', border: '1px solid var(--hi)', padding: 28, marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, var(--blue), #06B6D4)' }} />
                      {[
                        { label: 'Product',  value: PRODUCTS.find(p => p.id === product)?.label ?? '' },
                        { label: 'Date',     value: day },
                        { label: 'Time',     value: `${time} WAT` },
                        { label: 'Name',     value: form.name },
                        { label: 'Email',    value: form.email },
                        { label: 'Company',  value: form.company || '—' },
                        { label: 'Goal',     value: goal || '—' },
                      ].map(r => (
                        <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, marginBottom: 12, borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: 8 }}>
                          <span className="f-mono" style={{ fontSize: 10, letterSpacing: '.1em', color: 'var(--muted)', textTransform: 'uppercase' }}>{r.label}</span>
                          <span style={{ fontSize: 14, color: 'var(--text)', fontWeight: 500 }}>{r.value}</span>
                        </div>
                      ))}
                      <p style={{ fontSize: 12.5, color: 'var(--sub)', lineHeight: 1.75, marginTop: 8 }}>
                        We&apos;ll send a Google Meet link to <strong style={{ color: 'var(--text)' }}>{form.email}</strong> before the session.
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <button onClick={() => setStep('details')} className="btn btn-ghost btn-sm">← Edit</button>
                      <button onClick={submit} disabled={sending}
                        className="btn btn-primary"
                        style={{ flex: 1, justifyContent: 'center', opacity: sending ? .6 : 1, cursor: sending ? 'wait' : 'pointer' }}>
                        {sending ? 'Confirming...' : 'Confirm Booking →'}
                      </button>
                    </div>
                    <a href={`https://wa.me/2347059449360?text=${waMsg}`} target="_blank" rel="noreferrer"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 10, fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', textDecoration: 'none', background: '#25D366', color: '#fff', padding: '11px 20px', width: '100%' }}>
                      💬 Or confirm directly on WhatsApp
                    </a>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
