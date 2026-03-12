'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StackLogo from '@/components/StackLogo';

const TRACTION = [
  { n: '3',      label: 'Live Platforms',        sub: 'AutoReport · ProTrackNG · NightOps' },
  { n: '20+',    label: 'Paying Clients',         sub: 'Across PH, Lagos & Abuja'           },
  { n: '₦0',    label: 'Outside Capital Raised',  sub: 'Fully bootstrapped to date'         },
  { n: '6',      label: 'Platforms in Pipeline',  sub: '3 live · 3 in active development'   },
];

// Use of funds — realistic for a Nigerian seed/pre-Series A at this stage
const RAISE = [
  { pct: '45%', label: 'Engineering',      desc: 'Hire 2 mid-level engineers. Accelerate MyHarriet and ProTrackNG v2 development.',     color: '#2563EB' },
  { pct: '30%', label: 'Sales & Marketing', desc: 'Digital advertising, enterprise direct sales, SEO content, and trade show presence.',  color: '#06B6D4' },
  { pct: '15%', label: 'Working Capital',   desc: 'Sustain the team through 6–12 month enterprise procurement cycles.',                   color: '#A78BFA' },
  { pct: '10%', label: 'Operations',        desc: 'Legal, compliance, office, and infrastructure costs.',                                 color: '#F5B530' },
];

const RISKS = [
  { risk: 'Acquiring enterprise clients at scale', mitigation: 'Raise enables dedicated BizDev hire with oil & gas sector network. Currently closing deals through founders only.' },
  { risk: 'Long payment cycles from clients',       mitigation: 'Working capital buffer covers 6–12 months. We already collect monthly subscriptions — enterprise clients are the exception.' },
  { risk: 'Building multiple platforms simultaneously', mitigation: 'Shared infrastructure means platforms 4–6 cost 60–70% less to build. We\'ve proven this across our first three.' },
  { risk: 'Market readiness for software spend',    mitigation: 'Our clients are already paying. AutoReport clients save hours daily — the ROI is immediate and demonstrable.' },
];

const PRODUCTS_TIMELINE = [
  { name: 'AutoReport',  status: 'live',     year: '2024', color: '#FF5757' },
  { name: 'ProTrackNG',  status: 'live',     year: '2024', color: '#06B6D4' },
  { name: 'NightOps',    status: 'live',     year: '2025', color: '#A78BFA' },
  { name: 'MyHarriet',   status: 'building', year: '2026', color: '#F5B530' },
  { name: 'SwiftRide',   status: 'roadmap',  year: '2027', color: '#38BDF8' },
  { name: 'StakeX',      status: 'roadmap',  year: '2027', color: '#FB923C' },
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
          name: form.name, email: form.email, company: form.firm,
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
                ProStack NG is bootstrapped, revenue-generating, and seeking a <strong style={{ color: 'var(--text)' }}>seed/pre-Series A raise of ₦75M – ₦150M</strong> in 2026 to accelerate growth across our live platforms.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <a href="#deck" className="btn btn-primary" style={{ padding: '14px 36px' }}>Request Investor Deck →</a>
                <Link href="/demo" className="btn btn-ghost" style={{ padding: '14px 36px' }}>Book a Call</Link>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: .06 }}>
              <StackLogo size={240} />
            </div>
          </div>
        </div>

        {/* ── TRACTION NUMBERS ── */}
        <div style={{ background: 'var(--s1)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', background: 'var(--border)', gap: 0 }}>
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
                  Nigerian businesses are running on WhatsApp and Excel.
                </h2>
                <p style={{ fontSize: 15, color: 'var(--sub)', lineHeight: 1.9 }}>
                  The SME digitisation gap in Nigeria is real and measurable. Oil & gas service companies track tenders manually. Nightclubs reconcile cash at 2am on paper. Executives wait hours for reports that should be automated. These are not niche problems — they are daily realities for tens of thousands of businesses.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
                {[
                  { stat: '41M+',  label: 'Nigerian SMEs — most running without dedicated software.' },
                  { stat: '₦1.2T', label: 'Estimated annual value of government tenders in Nigeria.' },
                  { stat: '3hrs',  label: 'Average time lost daily to manual reporting in target sectors.' },
                  { stat: '0',     label: 'Direct local competitors to NightOps in the Rivers State market.' },
                ].map(s => (
                  <div key={s.stat} style={{ background: 'var(--card)', padding: '20px 24px', display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                    <div className="f-display" style={{ fontWeight: 800, fontSize: 28, letterSpacing: '-.04em', color: 'var(--blue-hi)', flexShrink: 0, lineHeight: 1, minWidth: 80 }}>{s.stat}</div>
                    <div style={{ fontSize: 13.5, color: 'var(--sub)', lineHeight: 1.7, paddingTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── REVENUE MODEL ── */}
          <div style={{ marginBottom: 80 }}>
            <div className="eyebrow" style={{ marginBottom: 16 }}>Revenue Model</div>
            <h2 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(24px,3vw,40px)', letterSpacing: '-.04em', color: 'var(--text)', marginBottom: 28, lineHeight: 1 }}>
              Monthly subscriptions. Predictable revenue.
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', marginBottom: 16 }}>
              {[
                { product: 'AutoReport',  range: '₦45K – ₦120K/mo', color: '#FF5757', clients: '8+ clients' },
                { product: 'ProTrackNG', range: '₦15K – ₦85K/mo',  color: '#06B6D4', clients: '7+ clients' },
                { product: 'NightOps',   range: '₦15K – ₦85K/mo',  color: '#A78BFA', clients: '5+ venues'  },
              ].map(p => (
                <div key={p.product} style={{ background: 'var(--card)', padding: '22px 22px', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: p.color }} />
                  <div className="f-display" style={{ fontWeight: 800, fontSize: 17, color: 'var(--text)', marginBottom: 6 }}>{p.product}</div>
                  <div className="f-display" style={{ fontWeight: 700, fontSize: 20, color: p.color, letterSpacing: '-.02em', marginBottom: 4 }}>{p.range}</div>
                  <div className="f-mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.1em', textTransform: 'uppercase' }}>{p.clients}</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.75 }}>
              All plans billed monthly. Enterprise clients negotiated separately. No revenue share, no transaction fees — clean SaaS subscriptions.
            </p>
          </div>

          {/* ── PLATFORM ROADMAP ── */}
          <div style={{ marginBottom: 80 }}>
            <div className="eyebrow" style={{ marginBottom: 16 }}>Platform Roadmap</div>
            <h2 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(24px,3vw,40px)', letterSpacing: '-.04em', color: 'var(--text)', marginBottom: 32, lineHeight: 1 }}>
              Six platforms. One infrastructure.
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(175px,1fr))', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
              {PRODUCTS_TIMELINE.map(p => (
                <div key={p.name} style={{ background: 'var(--card)', padding: '22px 20px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: p.status === 'live' ? 2 : 1, background: p.status === 'live' ? p.color : 'transparent', borderTop: p.status !== 'live' ? `1px dashed ${p.color}40` : 'none' }} />
                  <div className="f-display" style={{ fontWeight: 800, fontSize: 16, color: 'var(--text)', marginBottom: 10 }}>{p.name}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, letterSpacing: '.12em', textTransform: 'uppercase', background: `${p.color}10`, border: `1px solid ${p.color}30`, color: p.color, padding: '2px 7px' }}>
                      {p.status === 'live' ? '● Live' : p.status === 'building' ? '◐ Building' : '○ Roadmap'}
                    </span>
                    <span className="f-mono" style={{ fontSize: 9, color: 'var(--muted)' }}>{p.year}</span>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.75, marginTop: 14 }}>
              Each new platform leverages shared auth, payment, notifications, and reporting infrastructure already in production. Platforms 4–6 cost significantly less to build than the first three.
            </p>
          </div>

          {/* ── USE OF FUNDS ── */}
          <div style={{ marginBottom: 80 }}>
            <div className="eyebrow" style={{ marginBottom: 16 }}>Use of Funds</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 48, alignItems: 'center' }}>
              <div>
                <h2 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(24px,3vw,40px)', letterSpacing: '-.04em', color: 'var(--text)', lineHeight: 1, marginBottom: 16 }}>
                  ₦75M – ₦150M.<br />Clear allocation.
                </h2>
                <p style={{ fontSize: 15, color: 'var(--sub)', lineHeight: 1.85, marginBottom: 14 }}>
                  We have operated on zero outside capital since founding. Every naira raised goes into growth — not salaries for founders or office perks.
                </p>
                <div style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: '16px 20px' }}>
                  <div className="f-mono" style={{ fontSize: 9, letterSpacing: '.12em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>Current Monthly Revenue Run Rate</div>
                  <div className="f-display" style={{ fontWeight: 800, fontSize: 28, color: 'var(--blue-hi)', letterSpacing: '-.04em' }}>₦1.2M – ₦2.5M</div>
                  <div className="f-mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.08em', marginTop: 4 }}>Estimate across 3 platforms · growing monthly</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
                {RAISE.map(r => (
                  <div key={r.label} style={{ background: 'var(--card)', padding: '18px 22px', display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                    <div className="f-display" style={{ fontWeight: 800, fontSize: 24, letterSpacing: '-.04em', color: r.color, flexShrink: 0, lineHeight: 1, minWidth: 50 }}>{r.pct}</div>
                    <div>
                      <div style={{ fontSize: 14, color: 'var(--text)', fontWeight: 600, marginBottom: 3 }}>{r.label}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--sub)', lineHeight: 1.65 }}>{r.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RISKS ── */}
          <div style={{ marginBottom: 80 }}>
            <div className="eyebrow" style={{ marginBottom: 16 }}>Honest Risk Assessment</div>
            <h2 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(24px,3vw,40px)', letterSpacing: '-.04em', color: 'var(--text)', lineHeight: 1, marginBottom: 32 }}>
              What could go wrong — and our plan.
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
              {RISKS.map((r, i) => (
                <div key={i} style={{ background: 'var(--card)', padding: '22px 26px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 20 }}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <span style={{ color: '#F59E0B', fontSize: 8, marginTop: 5, flexShrink: 0 }}>▲</span>
                    <div style={{ fontSize: 14, color: 'var(--text)', fontWeight: 600, lineHeight: 1.4 }}>{r.risk}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <span style={{ color: 'var(--blue)', fontSize: 8, marginTop: 5, flexShrink: 0 }}>◆</span>
                    <div style={{ fontSize: 13.5, color: 'var(--sub)', lineHeight: 1.7 }}>{r.mitigation}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── DECK REQUEST ── */}
          <div id="deck" style={{ background: 'var(--card)', border: '1px solid var(--hi)', padding: 'clamp(32px,5vw,60px)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, var(--blue), #06B6D4)' }} />
            {deckRequested ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(37,99,235,.08)', border: '1px solid rgba(37,99,235,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 20px' }}>✓</div>
                <div className="f-display" style={{ fontWeight: 800, fontSize: 24, color: 'var(--text)', marginBottom: 10 }}>Request received.</div>
                <p style={{ fontSize: 14, color: 'var(--sub)', lineHeight: 1.8 }}>
                  We&apos;ll send the deck to <strong style={{ color: 'var(--text)' }}>{form.email}</strong> within 24 hours.
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
                    Request the<br />investor deck.
                  </h2>
                  <p style={{ fontSize: 14.5, color: 'var(--sub)', lineHeight: 1.85, marginBottom: 20 }}>
                    Includes our financials, platform metrics, market sizing, and raise structure. Sent within 24 hours. We only follow up with a call if you ask for one.
                  </p>
                  {['Current MRR and growth trajectory', 'Platform-by-platform unit economics', 'Market sizing for each product vertical', 'Team background and structure', '₦75M – ₦150M raise terms'].map(item => (
                    <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
                      <span style={{ color: 'var(--blue)', fontSize: 8, marginTop: 5, flexShrink: 0 }}>◆</span>
                      <span style={{ fontSize: 13.5, color: 'var(--sub)' }}>{item}</span>
                    </div>
                  ))}
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
                    <textarea className="ps-input" placeholder="Investment focus, questions, or how you heard about us..." value={form.note} onChange={e => set('note', e.target.value)} rows={3} style={{ resize: 'vertical' }} />
                  </div>
                  <button onClick={submit} disabled={sending || !form.name || !form.email}
                    className="btn btn-primary"
                    style={{ opacity: sending || !form.name || !form.email ? .4 : 1, cursor: sending || !form.name || !form.email ? 'default' : 'pointer', justifyContent: 'center' }}>
                    {sending ? 'Sending...' : 'Request Investor Deck →'}
                  </button>
                  <p className="f-mono" style={{ fontSize: 9, letterSpacing: '.08em', color: 'var(--muted)', textAlign: 'center' }}>Or email directly: contact@prostackng.com</p>
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
