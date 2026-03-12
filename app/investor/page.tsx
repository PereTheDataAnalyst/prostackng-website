'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StackLogo from '@/components/StackLogo';

const TRACTION = [
  { n: '3',      label: 'Live Platforms',       sub: 'AutoReport · ProTrackNG · NightOps' },
  { n: '20+',    label: 'Paying Clients',        sub: 'Across PH, Lagos & Abuja'           },
  { n: '₦0',    label: 'Outside Capital Raised', sub: 'Fully bootstrapped to date'         },
  { n: '6',      label: 'Platforms in Pipeline', sub: '3 live · 3 in active development'   },
];

const RAISE = [
  { pct: '40%', label: 'Engineering',     desc: 'Accelerate platform 4–6 development. Hire 2 senior engineers.',     color: '#2563EB' },
  { pct: '35%', label: 'Sales & Marketing', desc: 'Build scalable inbound. Digital ads, enterprise outreach, SEO.',  color: '#06B6D4' },
  { pct: '15%', label: 'Working Capital',  desc: 'Bridge enterprise client onboarding cycles (6–18 months).',        color: '#A78BFA' },
  { pct: '10%', label: 'Operations',       desc: 'Team expansion, legal, compliance, infrastructure.',               color: '#F5B530' },
];

const RISKS = [
  { risk: 'Customer acquisition at scale',    mitigation: 'Series A budget targets digital channels + enterprise direct sales we currently can\'t afford.' },
  { risk: 'Long enterprise sales cycles',      mitigation: 'Working capital allocation gives us 18-month runway to survive NNPCL/NPA procurement cycles.' },
  { risk: 'Execution across 6 platforms',      mitigation: 'Shared infrastructure means new platforms cost 60–70% less to build than the first. We\'ve proven this.' },
  { risk: 'Market education in niche segments', mitigation: 'NightOps has no local competitor. ProTrackNG competes only with manual processes. AutoReport vs Excel is a clear ROI story.' },
];

const PRODUCTS_TIMELINE = [
  { name: 'AutoReport',  status: 'live',     year: '2024', color: '#FF5757' },
  { name: 'ProTrackNG',  status: 'live',     year: '2024', color: '#06B6D4' },
  { name: 'NightOps',    status: 'live',     year: '2024', color: '#A78BFA' },
  { name: 'MyHarriet',   status: 'building', year: '2025', color: '#F5B530' },
  { name: 'SwiftRide',   status: 'roadmap',  year: '2026', color: '#38BDF8' },
  { name: 'StakeX',      status: 'roadmap',  year: '2026', color: '#FB923C' },
];

export default function InvestorPage() {
  const [deckRequested, setDeckRequested] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', firm: '', note: '' });
  const [sending, setSending] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    setSending(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.firm,
          service: 'INVESTOR DECK REQUEST',
          message: `Investor deck request from ${form.name} (${form.firm}).\n\nNote: ${form.note}`,
        }),
      });
      setDeckRequested(true);
    } catch { setSending(false); }
  };

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 68 }}>

        {/* ── HERO ── */}
        <div className="bg-grid" style={{ padding: 'clamp(64px,8vw,120px) clamp(16px,4vw,56px) clamp(48px,6vw,80px)', backgroundSize: '52px 52px', position: 'relative', overflow: 'hidden', minHeight: 480, display: 'flex', alignItems: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 70% at 20% 50%, rgba(37,99,235,.07) 0%, transparent 60%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 80% 50%, transparent 50%, var(--bg) 100%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 48, alignItems: 'center' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Investor Relations</div>
              <h1 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(44px,6vw,84px)', letterSpacing: '-.05em', lineHeight: .9, color: 'var(--text)', marginBottom: 22 }}>
                Africa&apos;s digital<br />infrastructure.<br /><span style={{ color: 'var(--blue-hi)' }}>From PH.</span>
              </h1>
              <p style={{ fontSize: 16, color: 'var(--sub)', lineHeight: 1.9, maxWidth: 480, marginBottom: 36 }}>
                ProStack NG is bootstrapped, revenue-generating, and preparing for a <strong style={{ color: 'var(--text)' }}>$500K – $2M Series A</strong> in 2026. We&apos;ve proven the model. We need capital to scale it.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <a href="#deck" className="btn btn-primary" style={{ padding: '14px 36px' }}>Request Investor Deck →</a>
                <Link href="/demo" className="btn btn-ghost" style={{ padding: '14px 36px' }}>Book a Call</Link>
              </div>
            </div>
            {/* Stack watermark */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: .06 }}>
              <StackLogo size={240} />
            </div>
          </div>
        </div>

        {/* ── TRACTION ── */}
        <div style={{ background: 'var(--s1)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 0, background: 'var(--border)' }}>
            {TRACTION.map(t => (
              <div key={t.n} style={{ background: 'var(--s1)', padding: 'clamp(28px,3vw,44px) 28px', borderRight: '1px solid var(--border)' }}>
                <div className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(36px,4vw,54px)', letterSpacing: '-.05em', color: 'var(--text)', lineHeight: 1, marginBottom: 6 }}>{t.n}</div>
                <div style={{ fontSize: 14, color: 'var(--text)', fontWeight: 600, marginBottom: 4 }}>{t.label}</div>
                <div className="f-mono" style={{ fontSize: 9.5, color: 'var(--muted)', letterSpacing: '.08em' }}>{t.sub}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(56px,7vw,96px) clamp(16px,4vw,56px)' }}>

          {/* ── THE OPPORTUNITY ── */}
          <div style={{ marginBottom: 80 }}>
            <div className="eyebrow" style={{ marginBottom: 16 }}>The Opportunity</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 48, alignItems: 'start' }}>
              <div>
                <h2 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(28px,3.5vw,48px)', letterSpacing: '-.04em', color: 'var(--text)', lineHeight: 1, marginBottom: 20 }}>
                  African businesses are running on WhatsApp and Excel.
                </h2>
                <p style={{ fontSize: 15, color: 'var(--sub)', lineHeight: 1.9 }}>
                  The digitisation gap in Nigeria alone represents a trillion-naira opportunity. Oil & gas service companies track tenders by hand. Nightclubs reconcile cash at 2am with a notepad. Executives wait until noon for reports that should arrive at 8am.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
                {[
                  { stat: '200M+', label: 'Nigerians. One of the world\'s largest consumer markets.' },
                  { stat: '₦500T',  label: 'Nigerian GDP — and most of it runs on informal systems.' },
                  { stat: '87%',    label: 'Of Nigerian SMEs still manage operations without software.' },
                  { stat: '3hrs',   label: 'Average time lost per day to manual reporting in our target sectors.' },
                ].map(s => (
                  <div key={s.stat} style={{ background: 'var(--card)', padding: '20px 24px', display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                    <div className="f-display" style={{ fontWeight: 800, fontSize: 28, letterSpacing: '-.04em', color: 'var(--blue-hi)', flexShrink: 0, lineHeight: 1, minWidth: 72 }}>{s.stat}</div>
                    <div style={{ fontSize: 13.5, color: 'var(--sub)', lineHeight: 1.7, paddingTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── PLATFORM TIMELINE ── */}
          <div style={{ marginBottom: 80 }}>
            <div className="eyebrow" style={{ marginBottom: 16 }}>Platform Roadmap</div>
            <h2 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(24px,3vw,40px)', letterSpacing: '-.04em', color: 'var(--text)', marginBottom: 32, lineHeight: 1 }}>
              Six platforms. One infrastructure.
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
              {PRODUCTS_TIMELINE.map(p => (
                <div key={p.name} style={{ background: 'var(--card)', padding: '24px 22px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: p.status === 'live' ? p.color : 'transparent', borderTop: p.status !== 'live' ? `1px dashed ${p.color}40` : 'none' }} />
                  <div className="f-display" style={{ fontWeight: 800, fontSize: 17, color: 'var(--text)', marginBottom: 8 }}>{p.name}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 8.5, letterSpacing: '.12em', textTransform: 'uppercase',
                      background: `${p.color}10`, border: `1px solid ${p.color}30`, color: p.color, padding: '2px 8px',
                    }}>
                      {p.status === 'live' ? '● Live' : p.status === 'building' ? '◐ Building' : '○ Roadmap'}
                    </span>
                    <span className="f-mono" style={{ fontSize: 9.5, color: 'var(--muted)' }}>{p.year}</span>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.75, marginTop: 16 }}>
              Each new platform costs 60–70% less to build than the previous — shared auth, payments, notifications, and analytics are already in production.
            </p>
          </div>

          {/* ── USE OF FUNDS ── */}
          <div style={{ marginBottom: 80 }}>
            <div className="eyebrow" style={{ marginBottom: 16 }}>Use of Funds</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 48, alignItems: 'center' }}>
              <div>
                <h2 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(24px,3vw,40px)', letterSpacing: '-.04em', color: 'var(--text)', lineHeight: 1, marginBottom: 16 }}>
                  $500K – $2M.<br />Clear allocation.
                </h2>
                <p style={{ fontSize: 15, color: 'var(--sub)', lineHeight: 1.85 }}>
                  We&apos;ve operated lean since day one. Every naira of outside capital goes into growth and defence — not overhead.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
                {RAISE.map(r => (
                  <div key={r.label} style={{ background: 'var(--card)', padding: '18px 22px', display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                    <div className="f-display" style={{ fontWeight: 800, fontSize: 26, letterSpacing: '-.04em', color: r.color, flexShrink: 0, lineHeight: 1, minWidth: 54 }}>{r.pct}</div>
                    <div>
                      <div style={{ fontSize: 14, color: 'var(--text)', fontWeight: 600, marginBottom: 3 }}>{r.label}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--sub)', lineHeight: 1.65 }}>{r.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RISKS & MITIGATIONS ── */}
          <div style={{ marginBottom: 80 }}>
            <div className="eyebrow" style={{ marginBottom: 16 }}>Honest Risk Assessment</div>
            <h2 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(24px,3vw,40px)', letterSpacing: '-.04em', color: 'var(--text)', lineHeight: 1, marginBottom: 32 }}>
              What could go wrong — and why it won&apos;t.
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
              {RISKS.map((r, i) => (
                <div key={i} style={{ background: 'var(--card)', padding: '22px 26px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 20 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ color: '#F59E0B', fontSize: 8, marginTop: 5, flexShrink: 0 }}>▲</span>
                    <div style={{ fontSize: 14, color: 'var(--text)', fontWeight: 600, lineHeight: 1.4 }}>{r.risk}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--blue)', fontSize: 8, marginTop: 5, flexShrink: 0 }}>◆</span>
                    <div style={{ fontSize: 13.5, color: 'var(--sub)', lineHeight: 1.7 }}>{r.mitigation}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── DECK REQUEST FORM ── */}
          <div id="deck" style={{ background: 'var(--card)', border: '1px solid var(--hi)', padding: 'clamp(32px,5vw,60px)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, var(--blue), #06B6D4)' }} />
            {deckRequested ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(37,99,235,.08)', border: '1px solid rgba(37,99,235,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 20px' }}>✓</div>
                <div className="f-display" style={{ fontWeight: 800, fontSize: 24, color: 'var(--text)', marginBottom: 10 }}>Request received.</div>
                <p style={{ fontSize: 14, color: 'var(--sub)', lineHeight: 1.8 }}>
                  We&apos;ll send the deck to <strong style={{ color: 'var(--text)' }}>{form.email}</strong> within 24 hours. If you&apos;d like to speak sooner, WhatsApp us directly.
                </p>
                <a href="https://wa.me/2347059449360" target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: 20, fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', textDecoration: 'none', background: '#25D366', color: '#fff', padding: '11px 28px' }}>
                  💬 WhatsApp Us Now
                </a>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 48 }}>
                <div>
                  <div className="eyebrow" style={{ marginBottom: 14 }}>Investor Deck</div>
                  <h2 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(24px,3vw,40px)', letterSpacing: '-.04em', color: 'var(--text)', lineHeight: 1, marginBottom: 16 }}>
                    Request our<br />investor deck.
                  </h2>
                  <p style={{ fontSize: 14.5, color: 'var(--sub)', lineHeight: 1.85 }}>
                    Full financials, product metrics, market sizing, and the Series A ask. Sent within 24 hours. We follow up with a call only if you&apos;d like one.
                  </p>
                  <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {['Full financial model & projections', 'Market sizing & competitive landscape', 'Product roadmap with milestones', 'Team & advisor profiles', 'Series A terms & structure'].map(item => (
                      <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <span style={{ color: 'var(--blue)', fontSize: 8, marginTop: 5, flexShrink: 0 }}>◆</span>
                        <span style={{ fontSize: 13.5, color: 'var(--sub)' }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12 }}>
                    <div>
                      <label className="f-mono" style={{ fontSize: 9.5, letterSpacing: '.14em', color: 'var(--muted)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Full Name *</label>
                      <input className="ps-input" placeholder="Your name" value={form.name} onChange={e => set('name', e.target.value)} />
                    </div>
                    <div>
                      <label className="f-mono" style={{ fontSize: 9.5, letterSpacing: '.14em', color: 'var(--muted)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Email *</label>
                      <input className="ps-input" type="email" placeholder="you@fund.com" value={form.email} onChange={e => set('email', e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="f-mono" style={{ fontSize: 9.5, letterSpacing: '.14em', color: 'var(--muted)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Firm / Organisation</label>
                    <input className="ps-input" placeholder="Acme Ventures" value={form.firm} onChange={e => set('firm', e.target.value)} />
                  </div>
                  <div>
                    <label className="f-mono" style={{ fontSize: 9.5, letterSpacing: '.14em', color: 'var(--muted)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Brief note (optional)</label>
                    <textarea className="ps-input" placeholder="Investment thesis, sector focus, or any questions..." value={form.note} onChange={e => set('note', e.target.value)} rows={3} style={{ resize: 'vertical' }} />
                  </div>
                  <button onClick={submit} disabled={sending || !form.name || !form.email}
                    className="btn btn-primary"
                    style={{ opacity: sending || !form.name || !form.email ? .4 : 1, cursor: sending || !form.name || !form.email ? 'default' : 'pointer', justifyContent: 'center' }}>
                    {sending ? 'Sending...' : 'Request Investor Deck →'}
                  </button>
                  <p className="f-mono" style={{ fontSize: 9, letterSpacing: '.08em', color: 'var(--muted)', textAlign: 'center' }}>
                    Or email directly: contact@prostackng.com
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
