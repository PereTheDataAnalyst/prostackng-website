import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Ticker from '@/components/Ticker';
import StatusBadge from '@/components/ui/StatusBadge';
import Counter from '@/components/ui/Counter';
import { PRODUCTS, CASE_STUDIES, TIMELINE, COMPANY_STATS } from '@/lib/data';

const LIVE = PRODUCTS.filter(p => p.status === 'LIVE');

export default function HomePage() {
  const hero = LIVE[0];

  return (
    <>
      <Navbar />
      <main>

        {/* ── HERO ─────────────────────────────────────────────── */}
        <section
          className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-grid"
          style={{ paddingTop: 68, backgroundSize: '56px 56px' }}
        >
          {/* Grid fade mask */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 40%, transparent 30%, var(--bg) 100%)' }} />

          {/* Glow orbs */}
          <div className="absolute pointer-events-none"
            style={{ top: '-10%', left: '-5%', width: 700, height: 700, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(139,92,246,.12) 0%, transparent 65%)' }} />
          <div className="absolute pointer-events-none"
            style={{ bottom: '-10%', right: '-5%', width: 600, height: 600, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(236,72,153,.07) 0%, transparent 65%)' }} />

          {/* Scan line */}
          <div className="absolute left-0 right-0 h-px pointer-events-none animate-scan"
            style={{ background: 'linear-gradient(90deg,transparent 0%,rgba(139,92,246,.5) 50%,transparent 100%)' }} />

          <div
            className="relative w-full"
            style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(60px,8vh,120px) clamp(16px,4vw,56px)' }}
          >
            {/* Eyebrow pill */}
            <div className="animate-fadeUp flex items-center gap-2 mb-8" style={{ width: 'fit-content' }}>
              <div
                className="font-mono flex items-center gap-2"
                style={{
                  padding: '6px 14px', fontSize: 10.5, letterSpacing: '.18em',
                  color: 'var(--accent-hi)',
                  border: '1px solid rgba(139,92,246,.3)',
                  background: 'rgba(139,92,246,.07)',
                }}
              >
                <span className="animate-blink" style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
                BUILDING AFRICA'S DIGITAL INFRASTRUCTURE
              </div>
            </div>

            {/* Headline */}
            <h1
              className="font-display font-black animate-fadeUp delay-1"
              style={{ fontSize: 'clamp(52px,7.5vw,108px)', lineHeight: .95, letterSpacing: '-.04em', maxWidth: 960, marginBottom: 32 }}
            >
              Platform-first<br />
              <span className="text-ghost">technology</span><br />
              <span style={{ color: 'var(--accent)' }}>for Africa.</span>
            </h1>

            <p
              className="text-sub animate-fadeUp delay-2"
              style={{ fontSize: 'clamp(15px,1.5vw,18px)', lineHeight: 1.85, maxWidth: 520, marginBottom: 44 }}
            >
              ProStack NG builds intelligent digital platforms — from tender intelligence and nightlife operating systems
              to marketplace commerce and ride-hailing. One ecosystem. Serious infrastructure.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 animate-fadeUp delay-3" style={{ marginBottom: 72 }}>
              <Link href="/products"
                className="font-display font-bold no-underline hover-glow inline-flex items-center gap-2"
                style={{ padding: '14px 36px', fontSize: 13, letterSpacing: '.06em', textTransform: 'uppercase', background: 'var(--accent)', color: '#fff' }}
                Explore Products →
              </Link>
              <Link href="/case-studies"
                className="font-display font-semibold no-underline inline-flex items-center"
                style={{ padding: '14px 36px', fontSize: 13, letterSpacing: '.06em', textTransform: 'uppercase', border: '1px solid var(--borderhi)', color: 'var(--sub)' }}
                View Case Studies
              </Link>
            </div>

            {/* Stats */}
            <div
              className="flex flex-wrap gap-0 animate-fadeUp delay-4"
              style={{ borderTop: '1px solid var(--border)', paddingTop: 40 }}
            >
              {COMPANY_STATS.map((s, i) => (
                <div key={s.label}
                  style={{ paddingRight: 48, marginRight: 48, borderRight: i < COMPANY_STATS.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div className="font-display font-black" style={{ fontSize: 'clamp(32px,3.5vw,48px)', lineHeight: 1, color: 'var(--accent)', letterSpacing: '-.03em' }}>
                    <Counter target={s.value} suffix={s.suffix} />
                  </div>
                  <div className="font-mono text-muted mt-1" style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase' }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating product card — desktop only */}
          <div
            className="absolute hidden lg:block animate-float"
            style={{ right: 'clamp(20px,5vw,80px)', top: '50%', transform: 'translateY(-50%)', width: 276 }}
          >
            <div
              className="relative overflow-hidden"
              style={{ background: 'var(--card)', border: '1px solid var(--borderhi)', padding: 28 }}
            >
              <div className="absolute top-0 left-0 right-0 h-0.5"
                style={{ background: `linear-gradient(90deg,${hero.color},transparent)` }} />
              <div className="flex justify-between items-start mb-5">
                <StatusBadge status="LIVE" />
                <span className="font-mono text-muted" style={{ fontSize: 9 }}>ACTIVE</span>
              </div>
              <div className="font-display font-bold text-text mb-1" style={{ fontSize: 17 }}>{hero.name}</div>
              <div className="font-mono mb-5" style={{ color: hero.color, fontSize: 10 }}>{hero.tagline}</div>
              {hero.metrics.map((m, i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <span style={{ color: 'var(--accent)', fontSize: 9, fontWeight: 700 }}>✓</span>
                  <span className="text-sub" style={{ fontSize: 11.5 }}>{m}</span>
                </div>
              ))}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {hero.stack.slice(0, 3).map(t => (
                  <span key={t} className="font-mono"
                    style={{ padding: '2px 7px', fontSize: 9, border: '1px solid rgba(139,92,246,.2)', color: 'var(--accent-hi)', background: 'rgba(139,92,246,.06)' }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Ticker />

        {/* ── PRODUCTS GRID ────────────────────────────────────── */}
        <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: 'clamp(60px,8vw,120px) clamp(16px,4vw,56px)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div className="flex justify-between items-end flex-wrap gap-5" style={{ marginBottom: 48 }}>
              <div>
                <div className="section-label">Product Ecosystem</div>
                <h2 className="font-display font-black text-text" style={{ fontSize: 'clamp(30px,4vw,54px)', letterSpacing: '-.03em', lineHeight: 1.0 }}>
                  Our platforms.<br />One infrastructure.
                </h2>
              </div>
              <Link href="/products"
                className="font-mono text-sub no-underline transition-colors duration-200 flex items-center gap-2"
                style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', borderBottom: '1px solid var(--border)', paddingBottom: 4 }}
                All Products →
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
              {PRODUCTS.map(p => {
                const isLive = p.status === 'LIVE';
                return (
                  <div key={p.id}
                    className="relative overflow-hidden hover-surface"
                    style={{ background: 'var(--card)', padding: 36, opacity: isLive ? 1 : .55 }}
                  >
                    <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: p.color, opacity: .7 }} />
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center justify-center font-display font-bold border text-xl"
                        style={{ width: 48, height: 48, background: `${p.color}10`, borderColor: `${p.color}25`, color: p.color }}>
                        {p.icon}
                      </div>
                      <StatusBadge status={isLive ? p.status : 'COMING_SOON'} />
                    </div>
                    <div className="font-display font-bold text-text mb-1" style={{ fontSize: 19 }}>{p.name}</div>
                    <div className="font-mono mb-4" style={{ color: p.color, fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase' }}>{p.tagline}</div>
                    <p className="text-sub leading-relaxed mb-5" style={{ fontSize: 13.5 }}>{p.desc.slice(0, 110)}...</p>
                    <div className="flex flex-wrap gap-1.5">
                      {p.stack.slice(0, 3).map(t => (
                        <span key={t} className="font-mono text-muted"
                          style={{ padding: '2px 8px', fontSize: 10.5, border: '1px solid var(--border)', background: 'rgba(255,255,255,.02)' }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── TERMINAL / HOW WE BUILD ───────────────────────────── */}
        <section style={{ padding: 'clamp(60px,8vw,120px) clamp(16px,4vw,56px)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 64, alignItems: 'center' }}>
            <div>
              <div className="section-label">How We Build</div>
              <h2 className="font-display font-black text-text" style={{ fontSize: 'clamp(28px,3.5vw,48px)', letterSpacing: '-.03em', lineHeight: 1.05, marginBottom: 16 }}>
                Infrastructure you can<br /><span style={{ color: 'var(--accent)' }}>depend on.</span>
              </h2>
              <p className="text-sub" style={{ fontSize: 15, lineHeight: 1.85, marginBottom: 40, maxWidth: 440 }}>
                Every platform we build shares a common backbone — shared auth, payment rails, real-time infrastructure, and cloud-native deployment. Build once, scale infinitely.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
                {[
                  { num: '01', icon: '⚡', title: 'Shared Auth',     desc: 'One identity system. Sign in once, access all products.' },
                  { num: '02', icon: '💳', title: 'Payment Rails',   desc: 'Paystack, Flutterwave, and crypto-ready from the core.' },
                  { num: '03', icon: '📡', title: 'Real-time First', desc: 'WebSockets, live dashboards, instant notifications.' },
                  { num: '04', icon: '🔒', title: 'Security by Default', desc: 'RLS policies, encrypted storage, audit logs everywhere.' },
                ].map(f => (
                  <div key={f.num}
                    className="hover-surface"
                    style={{ background: 'var(--card)', padding: 28 }}
                  >
                    <div className="font-mono text-muted mb-3" style={{ fontSize: 10, letterSpacing: '.1em' }}>{f.num}</div>
                    <div style={{ fontSize: 22, marginBottom: 10 }}>{f.icon}</div>
                    <div className="font-display font-bold text-text mb-2" style={{ fontSize: 14 }}>{f.title}</div>
                    <div className="text-sub" style={{ fontSize: 12.5, lineHeight: 1.65 }}>{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Terminal */}
            <div style={{ background: '#070710', border: '1px solid var(--borderhi)', overflow: 'hidden' }}>
              <div style={{ background: 'var(--card)', padding: '10px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                {['#FF5757','#F5B530','#00E87A'].map(c => (
                  <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
                ))}
                <span className="font-mono text-muted" style={{ marginLeft: 8, fontSize: 10, letterSpacing: '.1em' }}>
                  prostackng — autoreport — zsh
                </span>
              </div>
              <div className="font-mono" style={{ padding: 28, fontSize: 12, lineHeight: 2.1 }}>
                <div><span style={{ color: 'var(--muted)' }}>$</span> <span style={{ color: 'var(--accent)' }}>python</span> <span style={{ color: 'var(--text)' }}>run_pipeline.py</span></div>
                <div>&nbsp;</div>
                <div><span style={{ color: 'var(--muted)' }}>▶</span> <span style={{ color: '#F5B530' }}>Loading</span> <span style={{ color: 'var(--text)' }}>raw_sales_data.xlsx...</span></div>
                <div><span style={{ color: 'var(--muted)' }}>▶</span> <span style={{ color: '#F5B530' }}>Cleaning</span> <span style={{ color: 'var(--text)' }}>14,823 rows</span></div>
                <div><span style={{ color: 'var(--muted)' }}>▶</span> <span style={{ color: '#F5B530' }}>Calculating</span> <span style={{ color: 'var(--text)' }}>KPIs & metrics</span></div>
                <div><span style={{ color: 'var(--muted)' }}>▶</span> <span style={{ color: '#F5B530' }}>Building</span> <span style={{ color: 'var(--text)' }}>4 performance charts</span></div>
                <div><span style={{ color: 'var(--muted)' }}>▶</span> <span style={{ color: '#F5B530' }}>Generating</span> <span style={{ color: 'var(--text)' }}>6-page branded PDF</span></div>
                <div><span style={{ color: 'var(--muted)' }}>▶</span> <span style={{ color: '#F5B530' }}>Generating</span> <span style={{ color: 'var(--text)' }}>7-sheet Excel workbook</span></div>
                <div><span style={{ color: 'var(--muted)' }}>▶</span> <span style={{ color: '#00C8FF' }}>Sending</span> <span style={{ color: 'var(--text)' }}>to 12 recipients...</span></div>
                <div>&nbsp;</div>
                <div><span style={{ color: '#00E87A' }}>✓</span> <span style={{ color: 'var(--text)' }}>Pipeline complete in</span> <span style={{ color: 'var(--accent)' }}>8.2s</span></div>
                <div>
                  <span style={{ color: 'var(--muted)' }}>$</span>{' '}
                  <span style={{ display: 'inline-block', width: 7, height: 14, background: 'var(--accent)', verticalAlign: 'middle', animation: 'blink 1s step-end infinite' }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CASE STUDIES ─────────────────────────────────────── */}
        <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: 'clamp(60px,8vw,120px) clamp(16px,4vw,56px)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div className="flex justify-between items-end flex-wrap gap-5" style={{ marginBottom: 48 }}>
              <div>
                <div className="section-label">Case Studies</div>
                <h2 className="font-display font-black text-text" style={{ fontSize: 'clamp(30px,4vw,54px)', letterSpacing: '-.03em', lineHeight: 1.0 }}>
                  Results that speak.
                </h2>
              </div>
              <Link href="/case-studies"
                className="font-mono text-sub no-underline transition-colors duration-200"
                style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', borderBottom: '1px solid var(--border)', paddingBottom: 4 }}
                All Case Studies →
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(360px,1fr))', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
              {CASE_STUDIES.map((c, i) => (
                <div key={i}
                  className="relative overflow-hidden hover-surface"
                  style={{ background: 'var(--card)', padding: 40 }}
                >
                  <div className="absolute top-0 left-0 bottom-0" style={{ width: 3, background: c.color }} />
                  <div className="font-mono mb-4" style={{ color: c.color, fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase' }}>{c.product}</div>
                  <h3 className="font-display font-bold text-text mb-5" style={{ fontSize: 'clamp(16px,1.8vw,20px)', lineHeight: 1.25 }}>{c.title}</h3>
                  <div className="font-mono text-muted mb-2" style={{ fontSize: 9.5, letterSpacing: '.14em' }}>PROBLEM</div>
                  <p className="text-sub leading-relaxed mb-5" style={{ fontSize: 13.5 }}>{c.problem}</p>
                  <div className="font-mono text-muted mb-2" style={{ fontSize: 9.5, letterSpacing: '.14em' }}>RESULT</div>
                  <p className="font-semibold text-text leading-relaxed" style={{ fontSize: 13.5, paddingLeft: 14, borderLeft: `2px solid ${c.color}` }}>{c.result}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ROADMAP ───────────────────────────────────────────── */}
        <section style={{ padding: 'clamp(60px,8vw,120px) clamp(16px,4vw,56px)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div className="section-label">Company Roadmap</div>
            <h2 className="font-display font-black text-text" style={{ fontSize: 'clamp(28px,4vw,52px)', letterSpacing: '-.03em', marginBottom: 56 }}>
              Where we're going.
            </h2>
            <div className="relative">
              <div className="absolute hidden md:block" style={{ left: 0, top: 0, bottom: 0, width: 1, background: 'linear-gradient(180deg,var(--accent),var(--border),transparent)' }} />
              {TIMELINE.map((t, i) => (
                <div key={i} className="flex gap-10 mb-10 md:pl-8 relative">
                  <div className="absolute hidden md:block" style={{
                    left: -5, top: 6, width: 11, height: 11, borderRadius: '50%',
                    background: t.status === 'active' ? 'var(--accent)' : 'var(--card)',
                    border: `2px solid ${t.status === 'active' ? 'var(--accent)' : 'var(--muted)'}`,
                    boxShadow: t.status === 'active' ? '0 0 12px rgba(139,92,246,.6)' : 'none',
                  }} />
                  <div style={{ minWidth: 110, flexShrink: 0 }}>
                    <div className="font-display font-bold" style={{ fontSize: 13, color: t.status === 'active' ? 'var(--accent)' : 'var(--muted)' }}>{t.phase}</div>
                    <div className="font-mono text-muted" style={{ fontSize: 9.5 }}>{t.period}</div>
                  </div>
                  <div className="flex-1 border p-5"
                    style={{
                      borderColor: t.status === 'active' ? 'rgba(139,92,246,.3)' : 'var(--border)',
                      background: t.status === 'active' ? 'rgba(139,92,246,.04)' : 'var(--card)',
                    }}>
                    <p style={{ fontSize: 14.5, lineHeight: 1.75, color: t.status === 'active' ? 'var(--text)' : 'var(--sub)' }}>{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────── */}
        <section
          className="relative overflow-hidden bg-grid text-center"
          style={{ padding: 'clamp(80px,10vw,160px) clamp(16px,4vw,56px)', backgroundSize: '56px 56px' }}
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, var(--bg) 100%)' }} />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(139,92,246,.07) 0%, transparent 70%)' }} />
          <div className="relative" style={{ maxWidth: 700, margin: '0 auto' }}>
            <div className="section-label" style={{ justifyContent: 'center', marginBottom: 20 }}>Let's Build Together</div>
            <h2 className="font-display font-black text-text" style={{ fontSize: 'clamp(40px,6vw,80px)', letterSpacing: '-.04em', lineHeight: 1.0, marginBottom: 20 }}>
              Ready to build<br /><span style={{ color: 'var(--accent)' }}>something real?</span>
            </h2>
            <p className="text-sub" style={{ fontSize: 17, lineHeight: 1.9, marginBottom: 44 }}>
              Free 45-minute strategy session. No commitment — just honest answers and a clear plan for whatever you need built.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/contact"
                className="font-display font-bold no-underline hover-glow"
                style={{ padding: '16px 44px', fontSize: 14, letterSpacing: '.06em', textTransform: 'uppercase', background: 'var(--accent)', color: '#fff' }}
                Start a Project →
              </Link>
              <a href="https://wa.me/2347059449360" target="_blank" rel="noreferrer"
                className="font-display font-semibold no-underline"
                style={{ padding: '16px 44px', fontSize: 14, letterSpacing: '.06em', textTransform: 'uppercase', border: '1px solid var(--borderhi)', color: 'var(--sub)' }}
                💬 WhatsApp Us
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
