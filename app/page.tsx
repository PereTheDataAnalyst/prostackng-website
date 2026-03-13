import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Ticker from '@/components/Ticker';
import StatusBadge from '@/components/ui/StatusBadge';
import StackLogo from '@/components/StackLogo';
import NewsletterSignup from '@/components/NewsletterSignup';
import { CHANNEL_VIDEOS, AD_VIDEOS, ytThumb, ytWatch } from '@/lib/videos';
import type { VideoEntry } from '@/lib/videos';

// Compact video card — sm = horizontal row (thumb left, title right), md = grid card
function VideoCard({ v, size = 'md' }: { v: VideoEntry; size?: 'sm' | 'md' }) {
  const ready = v.hasVideo && v.id;

  // ── HORIZONTAL ROW (sm) ──────────────────────────────────────────────────
  if (size === 'sm') {
    const row = (
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, height: 56 }}>
        {/* Thumbnail — fixed 96×56 */}
        <div style={{ width: 96, height: 56, flexShrink: 0, background: 'var(--s2)', position: 'relative', overflow: 'hidden' }}>
          {ready ? (
            <img src={ytThumb(v.id, 'mq')} alt={v.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              <svg width="22" height="18" viewBox="0 0 52 44" fill="none" opacity=".12">
                <path d="M6 30 L36 30 L46 38 L16 38 Z" fill="#2563EB" opacity=".5"/>
                <path d="M2 20 L32 20 L42 28 L12 28 Z" fill="#2563EB" opacity=".75"/>
                <path d="M0 10 L30 10 L40 18 L10 18 Z" fill="#2563EB"/>
              </svg>
            </div>
          )}
          {ready && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(4,5,10,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(37,99,235,.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 0, height: 0, borderTop: '3px solid transparent', borderBottom: '3px solid transparent', borderLeft: '6px solid #fff', marginLeft: 2 }} />
              </div>
            </div>
          )}
          {/* Tag */}
          <div style={{ position: 'absolute', bottom: 3, left: 3, fontFamily: 'JetBrains Mono, monospace', fontSize: 5.5, letterSpacing: '.08em', textTransform: 'uppercase', background: 'rgba(8,11,20,.9)', color: v.tagColor, padding: '1px 4px' }}>
            {v.tag}
          </div>
        </div>
        {/* Title */}
        <div style={{ flex: 1, padding: '0 12px', minWidth: 0 }}>
          <div className="f-display" style={{ fontWeight: 700, fontSize: 11, color: ready ? 'var(--text)' : 'var(--sub)', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {v.title}
          </div>
          {!ready && <div className="f-mono" style={{ fontSize: 7, color: 'var(--muted)', letterSpacing: '.1em', marginTop: 2 }}>UPLOADING SOON</div>}
        </div>
      </div>
    );
    const rowStyle: React.CSSProperties = { display: 'block', textDecoration: 'none', background: 'var(--card)', overflow: 'hidden', cursor: ready ? 'pointer' : 'default', opacity: ready ? 1 : .6, borderBottom: '1px solid var(--border)' };
    return ready
      ? <a href={ytWatch(v.id)} target="_blank" rel="noreferrer" style={rowStyle}>{row}</a>
      : <div style={rowStyle}>{row}</div>;
  }

  // ── GRID CARD (md) ───────────────────────────────────────────────────────
  const inner = (
    <>
      <div style={{ position: 'relative', paddingBottom: '56.25%', background: 'var(--s2)', overflow: 'hidden' }}>
        {ready ? (
          <img src={ytThumb(v.id, 'hq')} alt={v.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,var(--card),var(--s2))', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <svg width="36" height="30" viewBox="0 0 52 44" fill="none" opacity=".1">
              <path d="M6 30 L36 30 L46 38 L16 38 Z" fill="#2563EB" opacity=".5"/>
              <path d="M2 20 L32 20 L42 28 L12 28 Z" fill="#2563EB" opacity=".75"/>
              <path d="M0 10 L30 10 L40 18 L10 18 Z" fill="#2563EB"/>
            </svg>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 7.5, letterSpacing: '.14em', color: 'var(--muted)', textTransform: 'uppercase' }}>Coming Soon</span>
          </div>
        )}
        <div style={{ position: 'absolute', inset: 0, background: ready ? 'rgba(4,5,10,.25)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {ready && (
            <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(37,99,235,.88)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: '13px solid #fff', marginLeft: 3 }} />
            </div>
          )}
        </div>
        <div style={{ position: 'absolute', top: 8, left: 8, fontFamily: 'JetBrains Mono, monospace', fontSize: 8, letterSpacing: '.12em', textTransform: 'uppercase', background: 'rgba(8,11,20,.88)', border: `1px solid ${v.tagColor}38`, color: v.tagColor, padding: '2px 7px' }}>{v.tag}</div>
      </div>
      <div style={{ padding: '14px 18px' }}>
        <div className="f-display" style={{ fontWeight: 700, fontSize: 13, color: ready ? 'var(--text)' : 'var(--sub)', lineHeight: 1.3 }}>{v.title}</div>
        {!ready && <div className="f-mono" style={{ fontSize: 8, color: 'var(--muted)', letterSpacing: '.1em', marginTop: 4 }}>UPLOADING SOON</div>}
      </div>
    </>
  );
  const gridStyle: React.CSSProperties = { display: 'block', textDecoration: 'none', background: 'var(--card)', overflow: 'hidden', cursor: ready ? 'pointer' : 'default', opacity: ready ? 1 : .65 };
  return ready
    ? <a href={ytWatch(v.id)} target="_blank" rel="noreferrer" style={gridStyle}>{inner}</a>
    : <div style={gridStyle}>{inner}</div>;
}

export const metadata = {
  title: 'ProStack NG — Platform-first technology for Africa',
  description: 'ProStack NG builds intelligent digital platforms for African businesses. Tender intelligence, nightlife OS, automated reporting, marketplace, ride-hailing.',
};

const STATS = [
  { n: '3',    unit: '',   label: 'Live Platforms'    },
  { n: '20+',  unit: '',   label: 'Clients Served'    },
  { n: '8s',   unit: '',   label: 'Report Pipeline'   },
  { n: '₦0',   unit: '',   label: 'Outside Capital'   },
];

const PRODUCTS = [
  { id: 'protrackng', name: 'ProTrackNG',  color: '#06B6D4', icon: '◎', tag: 'Tender Intelligence',     status: 'LIVE'        as const, desc: 'Centralised tender tracking for Nigerian procurement teams. Real-time alerts, bid pipeline, deadline management.' },
  { id: 'nightops',   name: 'NightOps',    color: '#A78BFA', icon: '◈', tag: 'Nightlife Operating System', status: 'LIVE'      as const, desc: 'Full operational platform for nightclubs — table management, bottle tracking, real-time revenue, end-of-night reconciliation.' },
  { id: 'autoreport', name: 'AutoReport',  color: '#FF5757', icon: '▦', tag: 'Executive Reporting',      status: 'LIVE'        as const, desc: 'Automated pipeline from raw data to branded PDF and Excel report, delivered daily. No manual effort after setup.' },
  { id: 'myharriet',  name: 'MyHarriet',   color: '#F5B530', icon: '⬡', tag: 'Commerce & Marketplace',   status: 'BUILDING'    as const, desc: 'Marketplace platform for Nigerian commerce with escrow payments, vendor profiles, and campus-first launch.' },
  { id: 'swiftride',  name: 'SwiftRide',   color: '#38BDF8', icon: '⟁', tag: 'Mobility Platform',        status: 'ROADMAP'     as const, desc: 'Ride-hailing built for Rivers State — GPS tracking, driver earnings dashboards, SOS, Mapbox navigation.' },
  { id: 'stakex',     name: 'StakeX',      color: '#FB923C', icon: '◑', tag: 'Digital Staking',          status: 'ROADMAP'     as const, desc: 'Digital staking and prediction platform for Africa with auditable infrastructure and responsible gaming controls.' },
];

const LIVE = ['protrackng', 'nightops', 'autoreport'];

const SERVICES = [
  { name: 'auth.prostackng.com',      label: 'Unified Auth',    color: '#06B6D4' },
  { name: 'api.prostackng.com',       label: 'API Gateway',     color: '#2563EB' },
  { name: 'payments.prostackng.com',  label: 'Payment Rails',   color: '#F5B530' },
  { name: 'notify.prostackng.com',    label: 'Notifications',   color: '#A78BFA' },
  { name: 'analytics.prostackng.com', label: 'Analytics',       color: '#FF5757' },
  { name: 'cdn.prostackng.com',       label: 'CDN & Storage',   color: '#FB923C' },
];

const CASES = [
  { color: '#FF5757', product: 'AutoReport', metric: '8s', metricLabel: 'Pipeline Runtime', title: 'From 3-hour grind to 8-second intelligence', result: 'Zero human effort. Board-ready reports in every inbox, every morning.' },
  { color: '#A78BFA', product: 'NightOps',   metric: '5min', metricLabel: 'Nightly Reconciliation', title: 'A nightclub that knows its numbers in real time', result: '100% ops digitised. Reconciliation down from 2 hours to 5 minutes.' },
  { color: '#06B6D4', product: 'ProTrackNG', metric: '100%', metricLabel: 'Pipeline Visibility', title: 'Tender deadlines never missed again', result: 'Full pipeline visibility from day one. Bid success measurably improved.' },
];

const TIMELINE = [
  { phase: 'Phase 1', period: '2024 – 2025', status: 'active',  desc: 'ProTrackNG, NightOps, and AutoReport launched and live. 20+ paying clients across Port Harcourt, Lagos, and Abuja. Fully bootstrapped.' },
  { phase: 'Phase 2', period: '2026', status: 'next', desc: 'MyHarriet beta — campus and neighbourhood marketplace launch in Port Harcourt. Escrow payments, vendor onboarding, parcel tracking.' },
  { phase: 'Phase 3', period: '2026 – 2027', status: 'plan', desc: 'SwiftRide — Rivers State and Bayelsa ride-hailing launch. Shared authentication and payment infrastructure fully operational across all products.' },
  { phase: 'Phase 4', period: '2027', status: 'plan', desc: 'StakeX launch. Full platform ecosystem complete. Seed / pre-Series A raise targeting ₦75M–₦150M to scale engineering and sales.' },
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>

        {/* ═══════════════════════════════ HERO ══════════════════════════════ */}
        <section className="bg-grid" style={{
          minHeight: '100vh',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
          paddingTop: 68,
          backgroundSize: '52px 52px',
        }}>
          {/* Radial vignette */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 90% 80% at 50% 50%, transparent 40%, var(--bg) 100%)', pointerEvents: 'none' }} />
          {/* Blue glow left */}
          <div style={{ position: 'absolute', top: '15%', left: '-5%', width: 640, height: 640, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,.07) 0%, transparent 65%)', pointerEvents: 'none' }} />
          {/* Scan line */}
          <div className="anim-scan" style={{ position: 'absolute', left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(37,99,235,.5),transparent)', pointerEvents: 'none' }} />

          {/* Giant watermark logo */}
          <div style={{ position: 'absolute', right: '-2%', top: '50%', transform: 'translateY(-52%)', pointerEvents: 'none', opacity: .03 }}>
            <StackLogo size={640} />
          </div>

          <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto', width: '100%', padding: 'clamp(64px,10vh,120px) clamp(16px,4vw,56px)' }}>

            {/* Eyebrow */}
            <div className="eyebrow anim-fadeup d1" style={{ marginBottom: 32 }}>
              Building Africa&apos;s Digital Infrastructure
            </div>

            {/* Headline */}
            <h1 className="f-display anim-fadeup d2" style={{
              fontSize: 'clamp(56px,8.5vw,120px)',
              fontWeight: 800,
              lineHeight: .92,
              letterSpacing: '-.04em',
              marginBottom: 32,
              maxWidth: 900,
            }}>
              Platform&#8209;first<br />
              <span className="text-ghost">technology</span><br />
              <span style={{ color: 'var(--blue-hi)' }}>for Africa.</span>
            </h1>

            <p className="anim-fadeup d3" style={{
              fontSize: 'clamp(15px,1.5vw,18px)',
              color: 'var(--sub)',
              lineHeight: 1.85,
              maxWidth: 520,
              marginBottom: 44,
            }}>
              ProStack NG builds intelligent digital platforms — from tender intelligence
              and nightlife operating systems to marketplace commerce and ride-hailing.
              One ecosystem. Serious infrastructure.
            </p>

            {/* CTAs */}
            <div className="anim-fadeup d4" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 72 }}>
              <Link href="/products" className="btn btn-primary">Explore Products →</Link>
              <Link href="/case-studies" className="btn btn-ghost">View Case Studies</Link>
            </div>

            {/* Stats strip */}
            <div className="anim-fadeup d5" style={{ display: 'flex', flexWrap: 'wrap', gap: 0, borderTop: '1px solid var(--border)', paddingTop: 40 }}>
              {STATS.map((s, i) => (
                <div key={s.label} style={{
                  paddingRight: 'clamp(20px,3vw,40px)',
                  marginRight: 'clamp(20px,3vw,40px)',
                  borderRight: i < STATS.length - 1 ? '1px solid var(--border)' : 'none',
                  marginBottom: 20,
                  minWidth: 80,
                }}>
                  <div className="f-display" style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 800, lineHeight: 1, letterSpacing: '-.03em', color: 'var(--text)' }}>
                    {s.n}<span style={{ color: 'var(--blue-hi)' }}>{s.unit}</span>
                  </div>
                  <div className="f-mono" style={{ fontSize: 9.5, letterSpacing: '.14em', color: 'var(--muted)', marginTop: 5, textTransform: 'uppercase' }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating product card — desktop only */}
          <div className="anim-float hidden lg:block" style={{
            position: 'absolute',
            right: 'clamp(24px,5vw,80px)',
            top: '50%', transform: 'translateY(-44%)',
            width: 268,
          }}>
            <div style={{
              background: 'var(--card)',
              border: '1px solid var(--hi)',
              padding: 28,
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #2563EB, #06B6D4)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <StatusBadge status="LIVE" />
                <div className="f-mono" style={{ fontSize: 8.5, color: 'var(--muted)', letterSpacing: '.1em' }}>PROTRACKNG</div>
              </div>
              <div className="f-display" style={{ fontWeight: 800, fontSize: 20, letterSpacing: '-.02em', color: 'var(--text)', marginBottom: 4 }}>
                ProTrackNG
              </div>
              <div className="f-mono" style={{ fontSize: 9.5, color: '#06B6D4', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 20 }}>
                Tender Intelligence
              </div>
              {['Oil & Gas sector live', 'Multi-tender pipeline', 'Real-time alerts'].map(m => (
                <div key={m} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ color: '#2563EB', fontSize: 8, fontWeight: 700 }}>◆</span>
                  <span style={{ fontSize: 12, color: 'var(--sub)' }}>{m}</span>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 6, marginTop: 18 }}>
                {['React', 'Node.js', 'PostgreSQL'].map(t => (
                  <span key={t} className="f-mono" style={{ fontSize: 9, color: 'var(--muted)', border: '1px solid var(--border)', padding: '2px 7px' }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Ticker />

        {/* ═══════════════════════════ PRODUCTS ══════════════════════════════ */}
        <section style={{ background: 'var(--s1)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: 'clamp(64px,8vw,120px) clamp(16px,4vw,56px)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20, marginBottom: 52 }}>
              <div>
                <div className="eyebrow" style={{ marginBottom: 14 }}>Product Ecosystem</div>
                <h2 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(32px,4.5vw,60px)', letterSpacing: '-.04em', lineHeight: .95, color: 'var(--text)' }}>
                  Six platforms.<br />One infrastructure.
                </h2>
              </div>
              <Link href="/products" className="f-mono" style={{ fontSize: 10.5, letterSpacing: '.14em', color: 'var(--sub)', textDecoration: 'none', borderBottom: '1px solid var(--border)', paddingBottom: 3, textTransform: 'uppercase', transition: 'color .2s, border-color .2s' }}>
                All Products →
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 1, background: 'var(--border)' }}>
              {PRODUCTS.map(p => (
                <div key={p.id} className="card-hover" style={{
                  background: 'var(--card)',
                  padding: 36,
                  position: 'relative',
                  overflow: 'hidden',
                  opacity: LIVE.includes(p.id) ? 1 : .55,
                }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: p.color, opacity: .7 }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                    <div style={{
                      width: 44, height: 44, flexShrink: 0,
                      background: `${p.color}12`,
                      border: `1px solid ${p.color}25`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 20, color: p.color,
                    }}>
                      {p.icon}
                    </div>
                    <StatusBadge status={LIVE.includes(p.id) ? p.status : 'COMING_SOON'} />
                  </div>
                  <div className="f-display" style={{ fontWeight: 800, fontSize: 20, letterSpacing: '-.02em', color: 'var(--text)', marginBottom: 4 }}>
                    {p.name}
                  </div>
                  <div className="f-mono" style={{ fontSize: 9.5, color: p.color, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 14 }}>
                    {p.tag}
                  </div>
                  <p style={{ fontSize: 13.5, color: 'var(--sub)', lineHeight: 1.75 }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════ ARCHITECTURE ══════════════════════════ */}
        <section style={{ padding: 'clamp(64px,8vw,120px) clamp(16px,4vw,56px)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px,1fr))', gap: 72, alignItems: 'center' }}>
              <div>
                <div className="eyebrow" style={{ marginBottom: 14 }}>Shared Infrastructure</div>
                <h2 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(28px,3.5vw,48px)', letterSpacing: '-.04em', lineHeight: .95, color: 'var(--text)', marginBottom: 20 }}>
                  Build once.<br /><span style={{ color: 'var(--blue-hi)' }}>Scale everywhere.</span>
                </h2>
                <p style={{ fontSize: 15, color: 'var(--sub)', lineHeight: 1.85, marginBottom: 36, maxWidth: 440 }}>
                  Every ProStack NG product shares a common backbone — unified auth, payment rails, real-time notifications, and analytics. We build the infrastructure once. Every new platform inherits it instantly.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    { icon: '⚡', label: 'Shared Auth',      desc: 'One identity. Sign in once, access everything.' },
                    { icon: '💳', label: 'Payment Rails',    desc: 'Paystack, Flutterwave, and crypto-ready.' },
                    { icon: '📡', label: 'Real-time First',  desc: 'WebSockets, live dashboards, instant alerts.' },
                    { icon: '🔒', label: 'Security',         desc: 'RLS policies, encrypted storage, audit logs.' },
                  ].map(f => (
                    <div key={f.label} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                      <div style={{ fontSize: 16, marginTop: 2, flexShrink: 0 }}>{f.icon}</div>
                      <div>
                        <div className="f-display" style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text)', marginBottom: 2 }}>{f.label}</div>
                        <div style={{ fontSize: 12.5, color: 'var(--sub)' }}>{f.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Services grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
                {SERVICES.map(s => (
                  <div key={s.name} style={{ background: 'var(--card)', padding: '24px 20px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${s.color},transparent)` }} />
                    <div className="f-mono" style={{ fontSize: 8.5, color: s.color, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                      {s.label}
                    </div>
                    <div className="f-mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.04em', wordBreak: 'break-all', lineHeight: 1.5 }}>
                      {s.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════ TERMINAL ══════════════════════════════ */}
        <section style={{ background: 'var(--s1)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: 'clamp(64px,8vw,120px) clamp(16px,4vw,56px)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 72, alignItems: 'center' }}>
            {/* Terminal */}
            <div style={{ background: '#050608', border: '1px solid var(--hi)', overflow: 'hidden' }}>
              <div style={{ background: 'var(--card)', padding: '10px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 7 }}>
                {['#FF605C','#FFBD2E','#27C840'].map(c => (
                  <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
                ))}
                <span className="f-mono" style={{ marginLeft: 10, fontSize: 10, color: 'var(--muted)', letterSpacing: '.08em' }}>
                  prostackng — autoreport.py — zsh
                </span>
              </div>
              <div className="f-mono" style={{ padding: '28px 28px 32px', fontSize: 12, lineHeight: 2.1 }}>
                <div><span style={{ color: 'var(--muted)' }}>$</span> <span style={{ color: '#3B82F6' }}>python</span> <span style={{ color: 'var(--text)' }}>run_pipeline.py --daily</span></div>
                <div style={{ color: 'var(--muted)', fontSize: 11 }}>&nbsp;</div>
                <div><span style={{ color: 'var(--muted)' }}>▶</span> <span style={{ color: '#FBBF24' }}>Loading</span><span style={{ color: 'var(--sub)' }}>  raw_sales_data.xlsx      </span><span style={{ color: 'var(--muted)' }}>14,823 rows</span></div>
                <div><span style={{ color: 'var(--muted)' }}>▶</span> <span style={{ color: '#FBBF24' }}>Cleaning</span><span style={{ color: 'var(--sub)' }}>  nulls, duplicates, types </span><span style={{ color: '#34D399' }}>✓</span></div>
                <div><span style={{ color: 'var(--muted)' }}>▶</span> <span style={{ color: '#FBBF24' }}>Calculating</span><span style={{ color: 'var(--sub)' }}> 24 KPIs &amp; metrics      </span><span style={{ color: '#34D399' }}>✓</span></div>
                <div><span style={{ color: 'var(--muted)' }}>▶</span> <span style={{ color: '#FBBF24' }}>Rendering</span><span style={{ color: 'var(--sub)' }}>  4 charts, 6-page PDF     </span><span style={{ color: '#34D399' }}>✓</span></div>
                <div><span style={{ color: 'var(--muted)' }}>▶</span> <span style={{ color: '#FBBF24' }}>Exporting</span><span style={{ color: 'var(--sub)' }}>  7-sheet Excel workbook   </span><span style={{ color: '#34D399' }}>✓</span></div>
                <div><span style={{ color: 'var(--muted)' }}>▶</span> <span style={{ color: '#60A5FA' }}>Emailing</span><span style={{ color: 'var(--sub)' }}>   12 recipients @ 08:00    </span><span style={{ color: '#34D399' }}>✓</span></div>
                <div style={{ color: 'var(--muted)', fontSize: 11 }}>&nbsp;</div>
                <div>
                  <span style={{ color: '#34D399', fontWeight: 700 }}>✓ Done</span>
                  <span style={{ color: 'var(--sub)' }}> Pipeline complete in </span>
                  <span style={{ color: '#3B82F6', fontWeight: 700 }}>8.2s</span>
                </div>
                <div style={{ marginTop: 4 }}>
                  <span style={{ color: 'var(--muted)' }}>$</span>
                  <span className="anim-blink" style={{ display: 'inline-block', width: 7, height: 14, background: 'var(--blue)', marginLeft: 4, verticalAlign: 'middle' }} />
                </div>
              </div>
            </div>

            {/* Copy */}
            <div>
              <div className="eyebrow" style={{ marginBottom: 14 }}>AutoReport · Live Product</div>
              <h2 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(28px,3.5vw,48px)', letterSpacing: '-.04em', lineHeight: .95, color: 'var(--text)', marginBottom: 20 }}>
                8 seconds.<br /><span style={{ color: '#FF5757' }}>Board-ready.</span>
              </h2>
              <p style={{ fontSize: 15, color: 'var(--sub)', lineHeight: 1.85, marginBottom: 32 }}>
                AutoReport loads raw sales data, cleans it, calculates all KPIs, builds professional charts, generates a 6-page PDF and 7-sheet Excel workbook, then emails everything automatically every morning. Zero human effort.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', marginBottom: 32 }}>
                {[
                  { n: '~8s',  l: 'Full Pipeline' },
                  { n: '6pg',  l: 'PDF Report'    },
                  { n: '7sh',  l: 'Excel Sheets'  },
                  { n: '24',   l: 'KPIs Tracked'  },
                ].map(m => (
                  <div key={m.l} style={{ background: 'var(--card)', padding: '20px 18px' }}>
                    <div className="f-display" style={{ fontWeight: 800, fontSize: 28, letterSpacing: '-.03em', color: '#FF5757', lineHeight: 1, marginBottom: 4 }}>
                      {m.n}
                    </div>
                    <div className="f-mono" style={{ fontSize: 9, letterSpacing: '.12em', color: 'var(--muted)', textTransform: 'uppercase' }}>
                      {m.l}
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/products#autoreport" className="btn btn-ghost btn-sm">View AutoReport →</Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════ CASE STUDIES ══════════════════════════ */}
        <section style={{ padding: 'clamp(64px,8vw,120px) clamp(16px,4vw,56px)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20, marginBottom: 52 }}>
              <div>
                <div className="eyebrow" style={{ marginBottom: 14 }}>Case Studies</div>
                <h2 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(32px,4.5vw,60px)', letterSpacing: '-.04em', lineHeight: .95, color: 'var(--text)' }}>
                  Results that<br />speak for themselves.
                </h2>
              </div>
              <Link href="/case-studies" className="f-mono" style={{ fontSize: 10.5, letterSpacing: '.14em', color: 'var(--sub)', textDecoration: 'none', borderBottom: '1px solid var(--border)', paddingBottom: 3, textTransform: 'uppercase' }}>
                All Case Studies →
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px,1fr))', gap: 1, background: 'var(--border)' }}>
              {CASES.map((c, i) => (
                <div key={i} style={{ background: 'var(--card)', padding: 40, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 2, background: c.color }} />
                  <div className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(48px,5vw,72px)', letterSpacing: '-.04em', color: c.color, lineHeight: .9, marginBottom: 4 }}>
                    {c.metric}
                  </div>
                  <div className="f-mono" style={{ fontSize: 9, letterSpacing: '.14em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 20 }}>
                    {c.metricLabel}
                  </div>
                  <div className="f-mono" style={{ fontSize: 9.5, color: c.color, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 8 }}>
                    {c.product}
                  </div>
                  <h3 className="f-display" style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)', lineHeight: 1.3, marginBottom: 14 }}>
                    {c.title}
                  </h3>
                  <p style={{ fontSize: 13.5, color: 'var(--sub)', lineHeight: 1.75 }}>{c.result}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════ VIDEO ═════════════════════════════════ */}
        <section style={{ padding: 'clamp(56px,7vw,100px) clamp(16px,4vw,56px)', background: 'var(--bg)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>

            {/* Section header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 40 }}>
              <div>
                <div className="eyebrow" style={{ marginBottom: 12 }}>From Our Studio</div>
                <h2 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(28px,3.5vw,50px)', letterSpacing: '-.04em', lineHeight: .95, color: 'var(--text)' }}>
                  Watch us build Africa.
                </h2>
              </div>
              <Link href="/media" className="f-mono" style={{ fontSize: 10, letterSpacing: '.14em', color: 'var(--sub)', textDecoration: 'none', borderBottom: '1px solid var(--border)', paddingBottom: 2, textTransform: 'uppercase', marginBottom: 4, flexShrink: 0 }}>
                Full Library →
              </Link>
            </div>

            {/* Two columns — Channel | Ads */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 1, background: 'var(--border)' }}>

              {/* ── LEFT: Channel Videos ── */}
              <div style={{ background: 'var(--card)', display: 'flex', flexDirection: 'column' }}>
                {/* Column header */}
                <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF0000', flexShrink: 0 }} />
                    <span className="f-mono" style={{ fontSize: 9.5, letterSpacing: '.16em', color: 'var(--text)', textTransform: 'uppercase' }}>YouTube Channel</span>
                  </div>
                  <a href="https://youtube.com/@prostackng" target="_blank" rel="noreferrer"
                    style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8.5, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', textDecoration: 'none', background: 'rgba(255,0,0,.08)', border: '1px solid rgba(255,0,0,.2)', padding: '3px 10px', transition: 'color .2s' }}>
                    Subscribe ↗
                  </a>
                </div>
                {/* Video list — compact stacked */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--border)', flex: 1 }}>
                  {CHANNEL_VIDEOS.slice(0, 3).map((v, i) => (
                    <VideoCard key={i} v={v} size="sm" />
                  ))}
                </div>
                {/* Footer link */}
                <div style={{ padding: '12px 18px', borderTop: '1px solid var(--border)', textAlign: 'right' }}>
                  <Link href="/media" className="f-mono" style={{ fontSize: 9, letterSpacing: '.1em', color: 'var(--muted)', textDecoration: 'none', textTransform: 'uppercase' }}>
                    {CHANNEL_VIDEOS.length} videos total →
                  </Link>
                </div>
              </div>

              {/* ── RIGHT: Latest Ads ── */}
              <div style={{ background: 'var(--card)', display: 'flex', flexDirection: 'column' }}>
                {/* Column header */}
                <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--blue)', flexShrink: 0 }} />
                    <span className="f-mono" style={{ fontSize: 9.5, letterSpacing: '.16em', color: 'var(--text)', textTransform: 'uppercase' }}>Latest Ads</span>
                  </div>
                  <span className="f-mono" style={{ fontSize: 8.5, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', background: 'var(--s2)', border: '1px solid var(--border)', padding: '3px 10px' }}>
                    Ad Team
                  </span>
                </div>
                {/* Ads list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--border)', flex: 1 }}>
                  {AD_VIDEOS.slice(0, 3).map((v, i) => (
                    <VideoCard key={i} v={v} size="sm" />
                  ))}
                </div>
                {/* Footer link */}
                <div style={{ padding: '12px 18px', borderTop: '1px solid var(--border)', textAlign: 'right' }}>
                  <Link href="/media" className="f-mono" style={{ fontSize: 9, letterSpacing: '.1em', color: 'var(--muted)', textDecoration: 'none', textTransform: 'uppercase' }}>
                    View all ads →
                  </Link>
                </div>
              </div>

            </div>

            {/* Subscribe strip */}
            <div style={{ marginTop: 1, background: 'var(--s1)', border: '1px solid var(--border)', borderTop: 'none', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <p className="f-mono" style={{ fontSize: 9.5, letterSpacing: '.1em', color: 'var(--muted)', textTransform: 'uppercase' }}>
                Subscribe for product demos, case studies, and company updates
              </p>
              <a href="https://youtube.com/@prostackng" target="_blank" rel="noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, letterSpacing: '.1em', textTransform: 'uppercase', color: '#fff', background: '#FF0000', padding: '7px 18px', textDecoration: 'none', flexShrink: 0 }}>
                ▶ Subscribe on YouTube
              </a>
            </div>

          </div>
        </section>

        {/* ═══════════════════════════ ROADMAP ════════════════════════════════ */}
        <section style={{ background: 'var(--s1)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: 'clamp(64px,8vw,120px) clamp(16px,4vw,56px)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div className="eyebrow" style={{ marginBottom: 14 }}>Company Roadmap</div>
            <h2 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(32px,4.5vw,56px)', letterSpacing: '-.04em', lineHeight: .95, color: 'var(--text)', marginBottom: 56 }}>
              Where we&apos;re going.
            </h2>
            <div style={{ position: 'relative' }}>
              <div className="hidden md:block" style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 1, background: 'linear-gradient(180deg, var(--blue), var(--border) 70%, transparent)' }} />
              {TIMELINE.map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: 48, marginBottom: 36, paddingLeft: 0 }} className="md:pl-10">
                  {/* Node */}
                  <div className="hidden md:block" style={{
                    position: 'absolute',
                    left: -5, marginTop: 7,
                    width: 11, height: 11, borderRadius: '50%',
                    background: t.status === 'active' ? 'var(--blue)' : 'var(--card)',
                    border: `2px solid ${t.status === 'active' ? 'var(--blue-hi)' : 'var(--muted)'}`,
                    boxShadow: t.status === 'active' ? '0 0 16px rgba(37,99,235,.6)' : 'none',
                    flexShrink: 0,
                  }} />
                  <div style={{ minWidth: 96, flexShrink: 0 }}>
                    <div className="f-display" style={{ fontWeight: 700, fontSize: 13, color: t.status === 'active' ? 'var(--blue-hi)' : 'var(--muted)' }}>
                      {t.phase}
                    </div>
                    <div className="f-mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.08em', marginTop: 2 }}>
                      {t.period}
                    </div>
                  </div>
                  <div style={{
                    flex: 1,
                    padding: '18px 24px',
                    border: `1px solid ${t.status === 'active' ? 'rgba(37,99,235,.25)' : 'var(--border)'}`,
                    background: t.status === 'active' ? 'rgba(37,99,235,.04)' : 'var(--card)',
                  }}>
                    <p style={{ fontSize: 14, lineHeight: 1.8, color: t.status === 'active' ? 'var(--text)' : 'var(--sub)' }}>
                      {t.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════ NEWSLETTER ═════════════════════════════ */}
        <section style={{ padding: '0 clamp(16px,4vw,56px) 1px', background: 'var(--s1)', borderTop: '1px solid var(--border)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(48px,6vw,80px) 0' }}>
            <NewsletterSignup
              variant="banner"
              heading="Stay ahead of Nigerian tech."
              sub="Product updates, industry insights, and ProStack NG news — directly from Fubara's desk. Roughly once a month."
            />
          </div>
        </section>

        {/* ═══════════════════════════ CTA ════════════════════════════════════ */}
        <section className="bg-grid" style={{
          position: 'relative', overflow: 'hidden',
          padding: 'clamp(80px,12vw,160px) clamp(16px,4vw,56px)',
          textAlign: 'center',
          backgroundSize: '52px 52px',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, var(--bg) 100%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', opacity: .02, pointerEvents: 'none' }}>
            <StackLogo size={400} />
          </div>
          <div style={{ position: 'relative', maxWidth: 680, margin: '0 auto' }}>
            <div className="eyebrow" style={{ justifyContent: 'center', marginBottom: 20 }}>Let&apos;s Build Together</div>
            <h2 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(44px,7vw,88px)', letterSpacing: '-.05em', lineHeight: .9, color: 'var(--text)', marginBottom: 24 }}>
              Ready to build<br /><span style={{ color: 'var(--blue-hi)' }}>something real?</span>
            </h2>
            <p style={{ fontSize: 17, color: 'var(--sub)', lineHeight: 1.9, marginBottom: 44 }}>
              Free 45-minute strategy session. No commitment — just honest answers and a clear plan for whatever you need built.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
              <Link href="/contact" className="btn btn-primary" style={{ fontSize: 13, padding: '16px 44px' }}>
                Start a Project →
              </Link>
              <a href="https://wa.me/2347059449360" target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ fontSize: 13, padding: '16px 44px' }}>
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
