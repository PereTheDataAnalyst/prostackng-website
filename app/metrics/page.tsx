import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'Live Metrics — ProStack NG',
  description: 'Real-time platform metrics and company traction for ProStack NG.',
};

// Static numbers — update these regularly or connect to a data source later
const METRICS = {
  updatedAt: 'March 2026',
  clients: { n: '20+', label: 'Active Clients', delta: '+3 this quarter', up: true },
  platforms: { n: '3',   label: 'Live Platforms', delta: 'AutoReport · ProTrackNG · NightOps', up: null },
  reports: { n: '800+', label: 'Reports Generated', delta: 'By AutoReport to date', up: true },
  tenders: { n: '400+',  label: 'Portals Monitored', delta: 'By ProTrackNG daily', up: null },
  reconcile: { n: '5min', label: 'Avg. Reconciliation Time', delta: 'Down from ~2 hrs', up: true },
  uptime: { n: '99.7%', label: 'Platform Uptime', delta: 'Last 90 days', up: true },
};

const PRODUCTS_STATUS = [
  {
    name: 'AutoReport',
    color: '#FF5757',
    status: 'LIVE',
    version: 'v2.4.1',
    metrics: [
      { label: 'Active Subscriptions', value: '8+' },
      { label: 'Avg. Report Time',     value: '< 9s' },
      { label: 'Data Formats Supported', value: '4'  },
      { label: 'Report Templates',     value: '12+'  },
    ],
    lastDeploy: 'Feb 28, 2026',
  },
  {
    name: 'ProTrackNG',
    color: '#06B6D4',
    status: 'LIVE',
    version: 'v1.8.0',
    metrics: [
      { label: 'Active Subscriptions', value: '7+' },
      { label: 'Portals Monitored',    value: '400+' },
      { label: 'Avg. Alert Latency',   value: '< 15min' },
      { label: 'Sectors Covered',      value: '12'  },
    ],
    lastDeploy: 'Mar 5, 2026',
  },
  {
    name: 'NightOps',
    color: '#A78BFA',
    status: 'LIVE',
    version: 'v1.3.2',
    metrics: [
      { label: 'Active Venues',          value: '5+'  },
      { label: 'Transactions Processed', value: '10K+' },
      { label: 'Avg. Reconcile Time',    value: '5min' },
      { label: 'Uptime (90d)',           value: '99.9%' },
    ],
    lastDeploy: 'Mar 10, 2026',
  },
  {
    name: 'MyHarriet',
    color: '#F5B530',
    status: 'BUILDING',
    version: 'Alpha',
    metrics: [
      { label: 'Waitlist',        value: 'Open' },
      { label: 'Launch Target',   value: 'Q3 2026' },
      { label: 'Beta Partners',   value: 'Recruiting' },
      { label: 'Sector',          value: 'Commerce' },
    ],
    lastDeploy: '—',
  },
  {
    name: 'SwiftRide',
    color: '#38BDF8',
    status: 'ROADMAP',
    version: 'Concept',
    metrics: [
      { label: 'Status',        value: 'Roadmap' },
      { label: 'Launch Target', value: 'Q1 2027' },
      { label: 'Market',        value: 'Rivers State' },
      { label: 'Sector',        value: 'Transport' },
    ],
    lastDeploy: '—',
  },
  {
    name: 'StakeX',
    color: '#FB923C',
    status: 'ROADMAP',
    version: 'Concept',
    metrics: [
      { label: 'Status',        value: 'Roadmap' },
      { label: 'Launch Target', value: 'Q2 2027' },
      { label: 'Sector',        value: 'Finance' },
      { label: 'Investor Preview', value: 'Available' },
    ],
    lastDeploy: '—',
  },
];

const TIMELINE = [
  { date: 'Mar 2026', event: 'Launched /pricing and /demo pages. Series A preparation underway.' },
  { date: 'Feb 2026', event: 'NightOps v1.3 — added VIP table management and event ticketing module.' },
  { date: 'Jan 2026', event: 'ProTrackNG expanded to 400+ portals. AI scoring engine deployed.' },
  { date: 'Dec 2025', event: 'AutoReport v2 — multi-format output (PDF + Excel + PowerPoint).' },
  { date: 'Nov 2025', event: 'Client milestone: 20+ paying businesses across three products.' },
  { date: 'Sep 2025', event: 'NightOps launched in Port Harcourt. First venue live within 7 days.' },
  { date: 'Jun 2025', event: 'ProTrackNG v1 launched. First 5 clients onboarded in week one.' },
  { date: 'Mar 2025', event: 'AutoReport v1 launched. First paying client within 48 hours.' },
  { date: 'Jan 2025', event: 'ProStack NG Technologies founded. Shared platform infrastructure begins.' },
];

export default function MetricsPage() {
  const vals = Object.values(METRICS).filter(v => typeof v === 'object' && 'n' in v) as typeof METRICS.clients[];
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 68 }}>

        {/* Header */}
        <div className="bg-grid" style={{ padding: 'clamp(48px,6vw,80px) clamp(16px,4vw,56px) clamp(32px,4vw,52px)', backgroundSize: '52px 52px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 40%, transparent 30%, var(--bg) 100%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 12 }}>Public Metrics</div>
              <h1 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(36px,5vw,72px)', letterSpacing: '-.05em', lineHeight: .9, color: 'var(--text)', marginBottom: 14 }}>
                Traction, live.
              </h1>
              <p style={{ fontSize: 15, color: 'var(--sub)', lineHeight: 1.8, maxWidth: 440 }}>
                We believe in public accountability. These numbers are real, updated manually, and honest.
              </p>
            </div>
            <div className="f-mono" style={{ fontSize: 9.5, letterSpacing: '.12em', color: 'var(--muted)', textTransform: 'uppercase', textAlign: 'right' }}>
              Last updated<br /><span style={{ color: 'var(--blue-hi)' }}>{METRICS.updatedAt}</span>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(36px,5vw,64px) clamp(16px,4vw,56px) clamp(64px,8vw,100px)' }}>

          {/* Top-line metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', marginBottom: 56 }}>
            {[METRICS.clients, METRICS.platforms, METRICS.reports, METRICS.tenders, METRICS.reconcile, METRICS.uptime].map(m => (
              <div key={m.label} style={{ background: 'var(--card)', padding: 'clamp(20px,3vw,32px) 24px' }}>
                <div className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(28px,3vw,40px)', letterSpacing: '-.04em', color: 'var(--text)', lineHeight: 1, marginBottom: 6 }}>{m.n}</div>
                <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500, marginBottom: 5 }}>{m.label}</div>
                <div className="f-mono" style={{ fontSize: 9, letterSpacing: '.06em', color: m.up === true ? '#34D399' : m.up === false ? '#F87171' : 'var(--muted)' }}>
                  {m.up === true ? '↑ ' : m.up === false ? '↓ ' : ''}{m.delta}
                </div>
              </div>
            ))}
          </div>

          {/* Per-product status */}
          <div style={{ marginBottom: 56 }}>
            <div className="eyebrow" style={{ marginBottom: 20 }}>Platform Status</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
              {PRODUCTS_STATUS.map(p => (
                <div key={p.name} style={{ background: 'var(--card)', padding: '24px 26px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: p.status === 'LIVE' ? 2 : 1, background: p.status === 'LIVE' ? p.color : 'transparent', borderTop: p.status !== 'LIVE' ? `1px dashed ${p.color}30` : 'none' }} />
                  {/* Name + badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                      <div className="f-display" style={{ fontWeight: 800, fontSize: 17, color: 'var(--text)' }}>{p.name}</div>
                      <div className="f-mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.08em', marginTop: 3 }}>{p.version}</div>
                    </div>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 8, letterSpacing: '.14em',
                      textTransform: 'uppercase', background: `${p.color}10`,
                      border: `1px solid ${p.color}30`, color: p.color, padding: '3px 9px',
                    }}>
                      {p.status === 'LIVE' ? '● ' : p.status === 'BUILDING' ? '◐ ' : '○ '}{p.status}
                    </span>
                  </div>
                  {/* Metrics 2×2 */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                    {p.metrics.map(m => (
                      <div key={m.label} style={{ background: 'var(--s2)', padding: '10px 12px' }}>
                        <div className="f-display" style={{ fontWeight: 700, fontSize: 16, color: p.status === 'LIVE' ? p.color : 'var(--sub)', lineHeight: 1, marginBottom: 3 }}>{m.value}</div>
                        <div className="f-mono" style={{ fontSize: 8.5, color: 'var(--muted)', letterSpacing: '.06em' }}>{m.label}</div>
                      </div>
                    ))}
                  </div>
                  {p.status === 'LIVE' && (
                    <div className="f-mono" style={{ fontSize: 8.5, color: 'var(--muted)', letterSpacing: '.08em' }}>
                      Last deploy: <span style={{ color: 'var(--sub)' }}>{p.lastDeploy}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div>
            <div className="eyebrow" style={{ marginBottom: 20 }}>Company Timeline</div>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: 72, top: 0, bottom: 0, width: 1, background: 'linear-gradient(180deg, var(--blue), var(--border) 70%, transparent)' }} />
              {TIMELINE.map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: 28, marginBottom: 24, alignItems: 'flex-start' }}>
                  <div className="f-mono" style={{ fontSize: 9, letterSpacing: '.08em', color: 'var(--muted)', textTransform: 'uppercase', minWidth: 64, flexShrink: 0, paddingTop: 2, textAlign: 'right' }}>
                    {t.date.split(' ')[0]}<br />{t.date.split(' ')[1]}
                  </div>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: i === 0 ? 'var(--blue)' : 'var(--border)', border: `1px solid ${i === 0 ? 'var(--blue-hi)' : 'var(--muted)'}`, flexShrink: 0, marginTop: 4, position: 'relative', zIndex: 1 }} />
                  <p style={{ fontSize: 14, color: i === 0 ? 'var(--text)' : 'var(--sub)', lineHeight: 1.7, fontWeight: i === 0 ? 500 : 400 }}>{t.event}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Investor CTA */}
          <div style={{ marginTop: 56, background: 'var(--card)', border: '1px solid var(--hi)', padding: 'clamp(24px,4vw,44px)', display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, var(--blue), #06B6D4)' }} />
            <div>
              <div className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(16px,2.5vw,24px)', color: 'var(--text)', letterSpacing: '-.02em' }}>
                Interested in investing?
              </div>
              <p style={{ fontSize: 13.5, color: 'var(--sub)', marginTop: 6 }}>We&apos;re preparing for a ₦75M – ₦150M raise. View our full investor page or request the deck directly.</p>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link href="/investor" className="btn btn-primary btn-sm">Investor Page →</Link>
              <Link href="/demo" className="btn btn-ghost btn-sm">Book a Call</Link>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
