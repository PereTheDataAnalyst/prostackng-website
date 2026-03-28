import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Managed Service Packages — ProStack NG Technologies',
  description:
    'Let ProStack NG manage your platform entirely. Monthly retainer packages covering uptime, maintenance, support, and growth — so you focus on your business.',
  keywords: [
    'managed services Nigeria', 'SaaS managed service Nigeria', 'platform management Port Harcourt',
    'tech support Nigeria', 'ProStack NG managed services', 'software maintenance Nigeria',
  ],
  openGraph: {
    title: 'Managed Service Packages — ProStack NG',
    description: 'We run your platform. You run your business. Three tiers from ₦50,000/mo.',
    url: 'https://www.prostackng.com.ng/managed-services',
    siteName: 'ProStack NG Technologies',
    type: 'website',
  },
  alternates: { canonical: 'https://www.prostackng.com.ng/managed-services' },
};

const TIERS = [
  {
    name: 'Starter',
    price: '₦50,000', period: '/month',
    tagline: 'One platform. Fully covered.',
    description: 'Perfect for small businesses running a single ProStack NG platform who need peace of mind without an in-house tech team.',
    highlight: false, badge: null,
    dotColor: '#2563EB',
    coverage: [
      '1 ProStack NG platform managed',
      'Monthly platform health checks',
      'Uptime monitoring (99% SLA)',
      'Security patches & dependency updates',
      'Monthly performance report',
      'Minor bug fixes (up to 3 hrs/month)',
      'Email support',
    ],
    sla: { uptime: '99%', response: '48 hrs', resolution: '5 business days', reporting: 'Monthly' },
    cta: 'Book a Consultation', ctaHref: '/demo?service=managed-starter',
  },
  {
    name: 'Growth',
    price: '₦120,000', period: '/month',
    tagline: 'Scale with confidence.',
    description: 'For growing businesses running multiple platforms who need proactive management, faster support, and strategic input each month.',
    highlight: true, badge: 'Most Popular',
    dotColor: '#3B82F6',
    coverage: [
      'Up to 3 ProStack NG platforms managed',
      'Weekly platform health checks',
      'Advanced monitoring & alerting',
      'Security patches & dependency updates',
      'Bug fixes (up to 8 hrs/month)',
      'Minor feature enhancements',
      'Weekly performance reports',
      'Monthly strategy call (1 hr)',
      'Priority email + WhatsApp support',
    ],
    sla: { uptime: '99.5%', response: '24 hrs', resolution: '3 business days', reporting: 'Weekly' },
    cta: 'Book a Consultation', ctaHref: '/demo?service=managed-growth',
  },
  {
    name: 'Enterprise',
    price: '₦200,000+', period: '/month',
    tagline: 'Fully dedicated. Mission critical.',
    description: 'For organisations that require a dedicated technical team, custom SLA agreements, and full platform evolution support.',
    highlight: false, badge: 'Custom',
    dotColor: '#A78BFA',
    coverage: [
      'Unlimited platforms managed',
      'Daily monitoring & health checks',
      'Dedicated account manager',
      'Custom emergency response protocol',
      'Unlimited bug fixes',
      'Feature development budget included',
      'Custom performance dashboards',
      'Quarterly roadmap planning sessions',
      'WhatsApp + phone support',
      'Staff training sessions (quarterly)',
    ],
    sla: { uptime: '99.9%', response: '4 hrs', resolution: '24 hrs', reporting: 'Real-time dashboard' },
    cta: 'Request Enterprise Scope', ctaHref: '/demo?service=managed-enterprise',
  },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Scoping Call', body: 'We audit your current platform setup, identify risks, and agree on what "fully managed" means for your specific case.' },
  { step: '02', title: 'Onboarding & Handover', body: 'We take over access credentials, set up monitoring, establish reporting templates, and brief your team on escalation paths.' },
  { step: '03', title: 'Active Management', body: 'We operate your platform to the agreed SLA — proactively fixing issues before they affect users, issuing reports on schedule.' },
  { step: '04', title: 'Monthly Reviews', body: 'Every month we review platform health, discuss upcoming needs, and adjust the retainer scope if your business has grown.' },
];

const FAQS = [
  {
    q: 'Can I use this if my platform was not built by ProStack NG?',
    a: 'Yes, but we will need a 2-week technical onboarding period to review your codebase and infrastructure before committing to an SLA. Platforms built on our stack (Next.js, Supabase, Vercel) onboard in 3 days.',
  },
  {
    q: 'What happens if there is a critical outage at 2 AM?',
    a: 'Growth and Enterprise clients have a WhatsApp emergency line. We operate response protocols around the clock for Enterprise. Starter clients are covered during business hours (8 AM – 8 PM WAT).',
  },
  {
    q: 'Is the retainer in addition to my SaaS subscription?',
    a: 'Yes. Your SaaS subscription covers the software licence. The managed service retainer covers the human effort of operating, maintaining, and improving the platform on your behalf.',
  },
  {
    q: 'Can I upgrade or downgrade my tier?',
    a: 'You can upgrade at any time — we prorate the difference. Downgrades take effect at the start of the next billing cycle with 14 days notice.',
  },
  {
    q: 'What does "minor feature enhancements" mean on the Growth plan?',
    a: 'UI copy changes, report column additions, form field updates, email template edits — work that takes under 2 hours. Larger feature builds are scoped separately.',
  },
];

const SLA_ROWS = [
  { label: 'Uptime guarantee',      s: '99.0%',           g: '99.5%',           e: '99.9%'                    },
  { label: 'First response time',   s: '48 hours',        g: '24 hours',        e: '4 hours'                  },
  { label: 'Issue resolution',      s: '5 business days', g: '3 business days', e: '24 hours'                 },
  { label: 'Reporting cadence',     s: 'Monthly',         g: 'Weekly',          e: 'Real-time'                },
  { label: 'Support channel',       s: 'Email',           g: 'Email + WhatsApp', e: 'Email + WhatsApp + Phone' },
  { label: 'Monthly strategy call', s: '—',               g: '✓ 1 hour',        e: '✓ Unlimited'              },
  { label: 'Emergency protocol',    s: '—',               g: '—',               e: '✓ 24/7'                   },
  { label: 'Dedicated manager',     s: '—',               g: '—',               e: '✓ Named contact'          },
];

export default function ManagedServicesPage() {
  return (
    <main style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>

      {/* ─── HERO ──────────────────────────────────────────────────── */}
      <section className="bg-grid" style={{
        position: 'relative', overflow: 'hidden',
        paddingTop: 'clamp(96px,12vw,140px)', paddingBottom: 'clamp(64px,8vw,96px)',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(37,99,235,.15) 0%, transparent 65%)',
        }} />
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 clamp(16px,4vw,56px)', textAlign: 'center', position: 'relative' }}>
          <div className="eyebrow" style={{ marginBottom: 24, justifyContent: 'center' }}>
            Managed Service Packages
          </div>
          <h1 className="f-display" style={{
            fontSize: 'clamp(36px,6vw,72px)', fontWeight: 800,
            letterSpacing: '-.04em', lineHeight: 1.0, marginBottom: 24,
          }}>
            We Run Your Platform.<br />
            <span style={{ color: 'var(--blue-hi)' }}>You Run Your Business.</span>
          </h1>
          <p className="f-body" style={{
            fontSize: 'clamp(15px,2vw,18px)', color: 'var(--sub)',
            maxWidth: 620, margin: '0 auto 40px', lineHeight: 1.75,
          }}>
            ProStack NG manages your platform entirely on a monthly retainer — uptime, maintenance,
            security, reporting, and support. No in-house tech team needed.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#tiers" className="btn btn-primary" style={{ fontSize: 12 }}>View Packages →</a>
            <Link href="/demo?service=managed" className="btn-outline-border">Book a Free Consultation</Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginTop: 56, flexWrap: 'wrap' }}>
            {[
              { value: '20+',   label: 'Active Clients'     },
              { value: '3',     label: 'Live Platforms'     },
              { value: '99.9%', label: 'Platform Uptime'    },
              { value: 'WAT',   label: 'Nigeria-Based Team' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div className="f-display" style={{ fontSize: 24, fontWeight: 800, color: 'var(--blue-hi)', marginBottom: 4, letterSpacing: '-.02em' }}>{s.value}</div>
                <div className="f-mono" style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TIERS ─────────────────────────────────────────────────── */}
      <section id="tiers" style={{ padding: 'clamp(64px,8vw,96px) clamp(16px,4vw,56px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: 56 }}>
            <div className="eyebrow" style={{ marginBottom: 16 }}>Pricing Tiers</div>
            <h2 className="f-display" style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: '-.03em' }}>
              Choose Your Coverage Level
            </h2>
            <p className="f-body" style={{ fontSize: 14, color: 'var(--sub)', marginTop: 10, maxWidth: 540 }}>
              All plans are monthly. No lock-in contracts. Cancel with 30 days notice.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, alignItems: 'start' }}>
            {TIERS.map(tier => (
              <div key={tier.name} style={{
                background: tier.highlight ? 'rgba(37,99,235,.07)' : 'var(--card)',
                border: tier.highlight ? '1px solid var(--blue-dim)' : '1px solid var(--border)',
                padding: '32px 28px', display: 'flex', flexDirection: 'column', position: 'relative',
              }}>
                {tier.badge && (
                  <div className="f-mono" style={{
                    position: 'absolute', top: -12, left: 28,
                    background: tier.highlight ? 'var(--blue)' : 'var(--hi)',
                    color: tier.highlight ? '#fff' : 'var(--sub)',
                    fontSize: 9, letterSpacing: '.14em', textTransform: 'uppercase',
                    padding: '4px 12px', border: '1px solid var(--border)',
                  }}>{tier.badge}</div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <h3 className="f-display" style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-.02em' }}>{tier.name}</h3>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: tier.dotColor, boxShadow: `0 0 12px ${tier.dotColor}` }} />
                </div>

                <div style={{ marginBottom: 8 }}>
                  <span className="f-display" style={{
                    fontSize: 40, fontWeight: 800, letterSpacing: '-.04em',
                    color: tier.highlight ? 'var(--blue-hi)' : 'var(--text)',
                  }}>{tier.price}</span>
                  <span className="f-mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '.1em', marginLeft: 4 }}>{tier.period}</span>
                </div>

                <p className="f-mono" style={{
                  fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase',
                  color: tier.highlight ? 'var(--blue-hi)' : 'var(--sub)', marginBottom: 12,
                }}>{tier.tagline}</p>

                <p className="f-body" style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.75, marginBottom: 28 }}>
                  {tier.description}
                </p>

                <div style={{ height: 1, background: 'var(--border)', marginBottom: 24 }} />

                <div className="f-mono" style={{ fontSize: 9, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 14 }}>
                  What&apos;s Covered
                </div>
                <ul style={{ listStyle: 'none', marginBottom: 28, flex: 1 }}>
                  {tier.coverage.map(item => (
                    <li key={item} className="f-body" style={{
                      fontSize: 13, color: 'var(--sub)', paddingLeft: 18,
                      position: 'relative', marginBottom: 10, lineHeight: 1.5,
                    }}>
                      <span style={{ position: 'absolute', left: 0, top: 5, color: 'var(--blue)', fontSize: 7 }}>◆</span>
                      {item}
                    </li>
                  ))}
                </ul>

                {/* SLA box */}
                <div style={{ background: 'var(--s2)', border: '1px solid var(--border)', padding: '16px', marginBottom: 24 }}>
                  <div className="f-mono" style={{ fontSize: 9, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>
                    SLA Commitments
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px' }}>
                    {[
                      { label: 'Uptime',     value: tier.sla.uptime     },
                      { label: 'Response',   value: tier.sla.response   },
                      { label: 'Resolution', value: tier.sla.resolution },
                      { label: 'Reporting',  value: tier.sla.reporting  },
                    ].map(s => (
                      <div key={s.label}>
                        <div className="f-mono" style={{ fontSize: 8, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 3 }}>{s.label}</div>
                        <div className="f-display" style={{ fontSize: 13, fontWeight: 700, color: tier.highlight ? 'var(--blue-hi)' : 'var(--text)' }}>{s.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ✅ Pure CSS — no JS handlers */}
                <Link
                  href={tier.ctaHref}
                  className={tier.highlight ? 'btn btn-primary' : 'btn-outline-border'}
                  style={{ justifyContent: 'center', fontSize: 11, padding: '13px 24px' }}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>

          <p className="f-mono" style={{
            fontSize: 10, color: 'var(--muted)', letterSpacing: '.08em',
            marginTop: 24, textAlign: 'center',
          }}>
            All retainers are paid monthly in advance · Prices exclusive of applicable taxes · Enterprise pricing based on final scope
          </p>
        </div>
      </section>

      {/* ─── SLA TABLE ──────────────────────────────────────────────── */}
      <section style={{
        background: 'var(--s1)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
        padding: 'clamp(64px,8vw,96px) clamp(16px,4vw,56px)', overflowX: 'auto',
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ marginBottom: 48 }}>
            <div className="eyebrow" style={{ marginBottom: 16 }}>SLA At a Glance</div>
            <h2 className="f-display" style={{ fontSize: 'clamp(26px,3.5vw,40px)', fontWeight: 800, letterSpacing: '-.03em' }}>
              Service Level Commitments
            </h2>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Commitment', 'Starter', 'Growth', 'Enterprise'].map((h, i) => (
                  <th key={h} className="f-mono" style={{
                    fontSize: 9, letterSpacing: '.14em', textTransform: 'uppercase',
                    color: i === 0 ? 'var(--muted)' : 'var(--blue-hi)',
                    padding: '0 16px 16px', textAlign: i === 0 ? 'left' : 'center', fontWeight: 400,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SLA_ROWS.map((row, ri) => (
                <tr key={row.label} style={{
                  borderBottom: '1px solid var(--border)',
                  background: ri % 2 === 0 ? 'transparent' : 'rgba(255,255,255,.015)',
                }}>
                  <td className="f-body" style={{ fontSize: 13, color: 'var(--sub)', padding: '14px 16px' }}>{row.label}</td>
                  {[row.s, row.g, row.e].map((val, ci) => (
                    <td key={ci} className="f-body" style={{
                      fontSize: 13, textAlign: 'center', padding: '14px 16px',
                      color: val === '—' ? 'var(--muted)' : ci === 1 ? 'var(--blue-hi)' : 'var(--text)',
                      fontWeight: ci === 1 ? 600 : 400,
                    }}>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ─── HOW IT WORKS ───────────────────────────────────────────── */}
      <section style={{ padding: 'clamp(64px,8vw,96px) clamp(16px,4vw,56px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ marginBottom: 56 }}>
            <div className="eyebrow" style={{ marginBottom: 16 }}>The Process</div>
            <h2 className="f-display" style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: '-.03em' }}>
              How Managed Services Works
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 2 }}>
            {HOW_IT_WORKS.map((item, idx) => (
              <div key={item.step} style={{
                background: 'var(--card)', border: '1px solid var(--border)',
                padding: '32px 24px', position: 'relative',
                borderLeft: idx === 0 ? '1px solid var(--border)' : 'none',
              }}>
                <div className="f-display text-ghost" style={{
                  fontSize: 56, fontWeight: 800, letterSpacing: '-.04em',
                  lineHeight: 1, marginBottom: 20, userSelect: 'none',
                }}>{item.step}</div>
                <h3 className="f-display" style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-.02em', marginBottom: 10 }}>{item.title}</h3>
                <p className="f-body" style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.75 }}>{item.body}</p>
                {idx < HOW_IT_WORKS.length - 1 && (
                  <div style={{
                    position: 'absolute', top: '50%', right: -14, transform: 'translateY(-50%)',
                    zIndex: 2, color: 'var(--blue)', fontSize: 18, fontWeight: 700,
                  }}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ────────────────────────────────────────────────────── */}
      <section style={{
        background: 'var(--s1)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
        padding: 'clamp(64px,8vw,96px) clamp(16px,4vw,56px)',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ marginBottom: 48 }}>
            <div className="eyebrow" style={{ marginBottom: 16 }}>FAQ</div>
            <h2 className="f-display" style={{ fontSize: 'clamp(26px,3.5vw,40px)', fontWeight: 800, letterSpacing: '-.03em' }}>
              Common Questions
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: '24px 28px' }}>
                <h3 className="f-display" style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-.01em', marginBottom: 10 }}>{faq.q}</h3>
                <p className="f-body" style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.8 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ────────────────────────────────────────────────────── */}
      <section style={{ padding: 'clamp(64px,8vw,96px) clamp(16px,4vw,56px)' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <div style={{
            background: 'var(--s1)', border: '1px solid var(--border)',
            padding: 'clamp(40px,5vw,64px)', textAlign: 'center',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)',
              width: 300, height: 300, borderRadius: '50%',
              background: 'var(--blue-lo)', filter: 'blur(60px)', pointerEvents: 'none',
            }} />
            <div style={{ position: 'relative' }}>
              <div className="eyebrow" style={{ marginBottom: 20, justifyContent: 'center' }}>Get Started</div>
              <h2 className="f-display" style={{ fontSize: 'clamp(26px,4vw,44px)', fontWeight: 800, letterSpacing: '-.03em', marginBottom: 16 }}>
                Stop Worrying About Your Platform
              </h2>
              <p className="f-body" style={{ fontSize: 14, color: 'var(--sub)', lineHeight: 1.8, marginBottom: 32, maxWidth: 540, margin: '0 auto 32px' }}>
                Book a free 30-minute consultation. We will review your current setup, identify gaps,
                and recommend the right tier — no obligation.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/demo?service=managed" className="btn btn-primary" style={{ fontSize: 12 }}>
                  Book Free Consultation →
                </Link>
                <a
                  href="mailto:hello@prostackng.com.ng?subject=Managed%20Service%20Enquiry"
                  className="btn-outline-border"
                >
                  Send an Enquiry
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
