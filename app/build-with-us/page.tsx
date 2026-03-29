import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BuildWithUsSection from '@/components/BuildWithUsSection';

export const metadata: Metadata = {
  title: 'Build With Us — Custom SaaS Development | ProStack NG',
  description:
    'ProStack NG builds custom SaaS platforms for Nigerian businesses. Fixed-price packages from ₦2M. MVP in 8 weeks. Enterprise solutions for complex requirements.',
  keywords: [
    'custom software development Nigeria', 'SaaS development Nigeria',
    'software company Port Harcourt', 'MVP development Nigeria',
    'ProStack NG build', 'Nigerian software agency', 'Next.js Supabase development Nigeria',
  ],
  openGraph: {
    title: 'Build With Us — ProStack NG Technologies',
    description: 'Custom SaaS development. Fixed-price. Delivered. MVP from ₦2M in 8 weeks.',
    url: 'https://www.prostackng.com.ng/build-with-us',
    siteName: 'ProStack NG Technologies',
    type: 'website',
  },
  alternates: { canonical: 'https://www.prostackng.com.ng/build-with-us' },
};

/* ─── DATA ─────────────────────────────────────────────────────── */
const PACKAGES = [
  {
    name: 'MVP', icon: '⚡',
    price: '₦2,000,000', timeline: '8 weeks',
    tagline: 'From idea to live product.',
    description: 'Everything you need to launch, validate, and start acquiring your first paying users. A real, production-ready platform — not a prototype.',
    highlight: false,
    includes: [
      'Up to 5 core feature modules',
      'User authentication & role management',
      'Admin dashboard',
      'Paystack or Flutterwave payment integration',
      'Email notifications via Resend',
      'Mobile-responsive UI (Next.js + Tailwind)',
      'Supabase database + Row-Level Security',
      'Vercel deployment + custom domain setup',
      '30 days post-launch bug support',
    ],
    notIncluded: ['Mobile apps', 'Advanced AI/ML features', 'Third-party API integrations beyond payment'],
    cta: 'Start an MVP',
  },
  {
    name: 'Growth', icon: '📈',
    price: '₦5,000,000', timeline: '12 weeks',
    tagline: 'Built to scale from day one.',
    description: 'For businesses that have validated their concept and need a full-featured, scalable platform ready for hundreds or thousands of users.',
    highlight: true,
    includes: [
      'Up to 12 feature modules',
      'Multi-tenant architecture',
      'Advanced role & permission system',
      'Complex workflow automation',
      'Third-party API integrations (up to 5)',
      'Real-time features (Supabase Realtime)',
      'PDF/Excel report generation',
      'WhatsApp notification integration',
      'Analytics dashboard (Umami or custom)',
      'Vercel + Supabase production setup',
      '60 days post-launch support',
    ],
    notIncluded: ['Mobile apps (quoted separately)', 'AI model training'],
    cta: 'Start a Growth Build',
  },
  {
    name: 'Enterprise', icon: '🏛',
    price: 'Custom', timeline: 'Custom',
    tagline: 'Complex problems. Complete solutions.',
    description: 'For organisations with complex, multi-stakeholder requirements — government agencies, large corporates, or platforms with significant regulatory or compliance needs.',
    highlight: false,
    includes: [
      'Unlimited feature scope',
      'Dedicated ProStack NG engineering team',
      'Discovery & architecture workshops',
      'Custom infrastructure design',
      'Multi-platform delivery (web + mobile)',
      'AI/ML integration',
      'Regulatory & compliance support (NDPR, SEC)',
      'SLA-backed post-launch retainer',
      'Staff training & documentation',
      'Ongoing feature development',
    ],
    notIncluded: [],
    cta: 'Discuss Enterprise',
  },
];

const PROCESS = [
  { step: '01', title: 'Brief Submission', body: 'Fill in the project intake form below. Be as detailed as you can — the more context you give us, the more accurate our scoping will be.' },
  { step: '02', title: 'Scoping Call', body: 'We review your brief and schedule a 60-minute call within 48 hours. We map out the full scope, clarify requirements, and confirm the package.' },
  { step: '03', title: 'Proposal & Contract', body: 'We deliver a detailed proposal with scope, timeline, milestones, and payment schedule. Once signed, development begins.' },
  { step: '04', title: 'Build & Review', body: 'Weekly demos. You see progress every Friday. Two rounds of revision included at each milestone. No surprises.' },
  { step: '05', title: 'Launch & Handover', body: 'We deploy to production, configure your domain, and hand over full ownership. Your team receives training and documentation.' },
  { step: '06', title: 'Support Window', body: 'Post-launch support is included in every package. Bugs are fixed at no charge. Feature requests become a managed service or new project.' },
];

const CASE_STUDIES = [
  {
    product: 'ClubOps (NightOps)',
    color: '#A78BFA',
    icon: '◈',
    client: 'Nightclub & Entertainment Venue, Port Harcourt',
    brief: 'A high-volume nightclub needed to replace manual operations — paper-based table booking, manual bottle tracking, cash reconciliation that took 2+ hours every night.',
    scope: 'Full operational platform: table management, bottle service tracking, staff shift management, real-time revenue dashboard, inventory alerts, and nightly reconciliation engine.',
    outcome: 'Live in 10 weeks. Nightly reconciliation from 2 hours to under 5 minutes. Full digital operations from day one.',
    metric: '2hrs → 5min',
    metricLabel: 'Nightly reconciliation',
    stack: ['React', 'Node.js', 'PostgreSQL', 'Supabase', 'Paystack'],
  },
  {
    product: 'Hensard AMS',
    color: '#06B6D4',
    icon: '◎',
    client: 'Legislative Assembly Management, Nigeria',
    brief: 'A legislative body needed a formal Assembly Management System to digitise member records, session management, committee tracking, and document archiving.',
    scope: 'Role-based access for clerks, committee chairs, and administrators. Session scheduling, minute generation, member attendance, and a full document management module with version control.',
    outcome: 'Delivered on schedule. Full digitalisation of legislative workflows. Secure, auditable record-keeping replacing a paper-based system.',
    metric: '100%',
    metricLabel: 'Legislative ops digitalised',
    stack: ['Next.js', 'TypeScript', 'Supabase', 'Resend', 'Vercel'],
  },
];

const GUARANTEES = [
  { icon: '📋', title: 'Fixed Scope. Fixed Price.', body: 'We agree on exactly what gets built before we start. No surprise invoices. No scope creep billing.' },
  { icon: '👁', title: 'Weekly Demos. Every Friday.', body: 'You see the actual product being built — not slide decks. Feedback is incorporated the following week.' },
  { icon: '🔐', title: 'You Own Everything.', body: 'Source code, database, domain — 100% yours from day one. No lock-in. No ongoing licence fees.' },
  { icon: '🇳🇬', title: 'Built for Nigeria.', body: 'Paystack, Naira pricing, Nigerian regulatory context, local hosting options — we understand the market.' },
];

export default function BuildWithUsPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>

        {/* ─── HERO ────────────────────────────────────────────────── */}
        <section className="bg-grid" style={{ position: 'relative', overflow: 'hidden', paddingTop: 'clamp(96px,12vw,140px)', paddingBottom: 'clamp(64px,8vw,96px)' }}>
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(37,99,235,.18) 0%, transparent 65%)' }} />
          <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 clamp(16px,4vw,56px)', textAlign: 'center', position: 'relative' }}>
            <div className="eyebrow" style={{ marginBottom: 24, justifyContent: 'center' }}>Custom SaaS Development</div>
            <h1 className="f-display" style={{ fontSize: 'clamp(36px,6vw,72px)', fontWeight: 800, letterSpacing: '-.04em', lineHeight: 1.0, marginBottom: 24 }}>
              We Build the Platform.<br /><span style={{ color: 'var(--blue-hi)' }}>You Own It. Forever.</span>
            </h1>
            <p className="f-body" style={{ fontSize: 'clamp(15px,2vw,18px)', color: 'var(--sub)', maxWidth: 640, margin: '0 auto 40px', lineHeight: 1.75 }}>
              Fixed-price. Fixed-timeline. Production-ready SaaS platforms for Nigerian businesses,
              government bodies, and enterprises — built on the same stack powering our own live products.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="#intake" className="btn btn-primary" style={{ fontSize: 12 }}>Submit Project Brief →</a>
              <a href="#packages" className="btn-outline-border">View Packages</a>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 48, marginTop: 56, flexWrap: 'wrap' }}>
              {[
                { value: '3',      label: 'Live Products Built'     },
                { value: '20+',    label: 'Clients Served'          },
                { value: '8wks',   label: 'MVP Timeline'            },
                { value: '100%',   label: 'Source Code Ownership'   },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div className="f-display" style={{ fontSize: 22, fontWeight: 800, color: 'var(--blue-hi)', marginBottom: 4 }}>{s.value}</div>
                  <div className="f-mono" style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── PACKAGES ────────────────────────────────────────────── */}
        <section id="packages" style={{ padding: 'clamp(64px,8vw,96px) clamp(16px,4vw,56px)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ marginBottom: 56 }}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Packages</div>
              <h2 className="f-display" style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: '-.03em' }}>Fixed-Price Packages</h2>
              <p className="f-body" style={{ fontSize: 14, color: 'var(--sub)', marginTop: 10, maxWidth: 560 }}>
                No hourly billing. No open-ended engagements. A defined scope, a fixed price, and a delivery date we commit to.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, alignItems: 'start' }}>
              {PACKAGES.map(pkg => (
                <div key={pkg.name} style={{
                  background: pkg.highlight ? 'rgba(37,99,235,.07)' : 'var(--card)',
                  border: pkg.highlight ? '1px solid var(--blue-dim)' : '1px solid var(--border)',
                  padding: '32px 28px', display: 'flex', flexDirection: 'column', position: 'relative',
                }}>
                  {pkg.highlight && (
                    <div className="f-mono" style={{ position: 'absolute', top: -12, left: 28, background: 'var(--blue)', color: '#fff', fontSize: 9, letterSpacing: '.14em', textTransform: 'uppercase', padding: '4px 12px' }}>
                      Most Chosen
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 44, height: 44, background: 'var(--blue-lo)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                      {pkg.icon}
                    </div>
                    <div>
                      <h3 className="f-display" style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-.02em' }}>{pkg.name}</h3>
                      <span className="f-mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.1em', textTransform: 'uppercase' }}>{pkg.tagline}</span>
                    </div>
                  </div>

                  <div style={{ marginBottom: 8 }}>
                    <span className="f-display" style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-.04em', color: pkg.highlight ? 'var(--blue-hi)' : 'var(--text)' }}>{pkg.price}</span>
                  </div>
                  <div className="f-mono" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '.1em', marginBottom: 16 }}>⏱ {pkg.timeline}</div>

                  <p className="f-body" style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.75, marginBottom: 24 }}>{pkg.description}</p>

                  <div style={{ height: 1, background: 'var(--border)', marginBottom: 20 }} />

                  <div className="f-mono" style={{ fontSize: 9, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 14 }}>Included</div>
                  <ul style={{ listStyle: 'none', marginBottom: pkg.notIncluded.length > 0 ? 20 : 28, flex: 1 }}>
                    {pkg.includes.map(item => (
                      <li key={item} className="f-body" style={{ fontSize: 13, color: 'var(--sub)', paddingLeft: 18, position: 'relative', marginBottom: 8, lineHeight: 1.5 }}>
                        <span style={{ position: 'absolute', left: 0, top: 5, color: 'var(--blue)', fontSize: 7 }}>◆</span>{item}
                      </li>
                    ))}
                  </ul>

                  {pkg.notIncluded.length > 0 && (
                    <>
                      <div className="f-mono" style={{ fontSize: 9, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>Not Included</div>
                      <ul style={{ listStyle: 'none', marginBottom: 24 }}>
                        {pkg.notIncluded.map(item => (
                          <li key={item} className="f-body" style={{ fontSize: 12, color: 'var(--muted)', paddingLeft: 16, position: 'relative', marginBottom: 6, lineHeight: 1.5 }}>
                            <span style={{ position: 'absolute', left: 0, top: 4, fontSize: 9 }}>—</span>{item}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  <a href="#intake"
                    className={pkg.highlight ? 'btn btn-primary' : 'btn-outline-border'}
                    style={{ justifyContent: 'center', fontSize: 11, padding: '13px 24px' }}
                  >{pkg.cta} →</a>
                </div>
              ))}
            </div>

            <p className="f-mono" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '.08em', marginTop: 24, textAlign: 'center' }}>
              All prices in Nigerian Naira · Payment milestones: 40% on contract, 40% at midpoint, 20% on delivery · VAT applicable
            </p>
          </div>
        </section>

        {/* ─── GUARANTEES ──────────────────────────────────────────── */}
        <section style={{ background: 'var(--s1)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: 'clamp(64px,8vw,96px) clamp(16px,4vw,56px)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ marginBottom: 48 }}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Our Commitments</div>
              <h2 className="f-display" style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: '-.03em' }}>What We Guarantee</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
              {GUARANTEES.map(g => (
                <div key={g.title} style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: '28px' }}>
                  <div style={{ fontSize: 28, marginBottom: 14 }}>{g.icon}</div>
                  <h3 className="f-display" style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-.01em', marginBottom: 10 }}>{g.title}</h3>
                  <p className="f-body" style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.75 }}>{g.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CASE STUDIES ────────────────────────────────────────── */}
        <section style={{ padding: 'clamp(64px,8vw,96px) clamp(16px,4vw,56px)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ marginBottom: 56 }}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Case Studies</div>
              <h2 className="f-display" style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: '-.03em' }}>Platforms We&apos;ve Built</h2>
              <p className="f-body" style={{ fontSize: 14, color: 'var(--sub)', marginTop: 10, maxWidth: 560 }}>
                We don&apos;t just consult. We build. Here are two platforms we delivered from brief to production.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {CASE_STUDIES.map(cs => (
                <div key={cs.product} style={{ background: 'var(--card)', border: '1px solid var(--border)', overflow: 'hidden', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${cs.color}, transparent)` }} />
                  <div style={{ padding: 'clamp(28px,4vw,40px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>

                    {/* Left */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                        <div style={{ width: 44, height: 44, background: `${cs.color}15`, border: `1px solid ${cs.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: cs.color }}>
                          {cs.icon}
                        </div>
                        <div>
                          <h3 className="f-display" style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-.02em' }}>{cs.product}</h3>
                          <p className="f-body" style={{ fontSize: 12, color: 'var(--sub)' }}>{cs.client}</p>
                        </div>
                      </div>

                      {[
                        { label: 'The Brief',  value: cs.brief  },
                        { label: 'The Scope',  value: cs.scope  },
                        { label: 'The Result', value: cs.outcome },
                      ].map(row => (
                        <div key={row.label} style={{ marginBottom: 16 }}>
                          <div className="f-mono" style={{ fontSize: 9, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6 }}>{row.label}</div>
                          <p className="f-body" style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.75 }}>{row.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Right */}
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 24 }}>
                      <div style={{ background: 'var(--s2)', border: '1px solid var(--border)', padding: '24px', textAlign: 'center' }}>
                        <div className="f-display" style={{ fontSize: 40, fontWeight: 800, color: cs.color, letterSpacing: '-.03em', marginBottom: 6 }}>{cs.metric}</div>
                        <div className="f-mono" style={{ fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)' }}>{cs.metricLabel}</div>
                      </div>
                      <div>
                        <div className="f-mono" style={{ fontSize: 9, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>Tech Stack Used</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {cs.stack.map(t => (
                            <span key={t} className="f-mono" style={{ fontSize: 10, color: 'var(--muted)', border: '1px solid var(--border)', padding: '3px 9px' }}>{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: 28 }}>
              <Link href="/case-studies" className="f-display" style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--blue-hi)', textDecoration: 'none' }}>
                View All Case Studies →
              </Link>
            </div>
          </div>
        </section>

        {/* ─── PROCESS ─────────────────────────────────────────────── */}
        <section style={{ background: 'var(--s1)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: 'clamp(64px,8vw,96px) clamp(16px,4vw,56px)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ marginBottom: 56 }}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>How It Works</div>
              <h2 className="f-display" style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: '-.03em' }}>From Brief to Launch</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
              {PROCESS.map((step, idx) => (
                <div key={step.step} style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: '28px 22px', position: 'relative', borderLeft: idx === 0 ? '1px solid var(--border)' : 'none' }}>
                  <div className="f-display text-ghost" style={{ fontSize: 48, fontWeight: 800, letterSpacing: '-.04em', lineHeight: 1, marginBottom: 16, userSelect: 'none' }}>{step.step}</div>
                  <h3 className="f-display" style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-.01em', marginBottom: 8 }}>{step.title}</h3>
                  <p className="f-body" style={{ fontSize: 12, color: 'var(--sub)', lineHeight: 1.75 }}>{step.body}</p>
                  {idx < PROCESS.length - 1 && (
                    <div style={{ position: 'absolute', top: '50%', right: -14, transform: 'translateY(-50%)', color: 'var(--blue)', fontSize: 16, fontWeight: 700, zIndex: 2 }}>→</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── INTAKE FORM ─────────────────────────────────────────── */}
        <section id="intake" style={{ padding: 'clamp(64px,8vw,96px) clamp(16px,4vw,56px)' }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <div style={{ marginBottom: 48 }}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Project Brief</div>
              <h2 className="f-display" style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: '-.03em' }}>Start Your Build</h2>
            </div>
            <BuildWithUsSection />
          </div>
        </section>

        {/* ─── CTA ─────────────────────────────────────────────────── */}
        <section style={{ background: 'var(--s1)', borderTop: '1px solid var(--border)', padding: 'clamp(64px,8vw,96px) clamp(16px,4vw,56px)' }}>
          <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
            <div className="eyebrow" style={{ marginBottom: 20, justifyContent: 'center' }}>Not Ready for a Full Build?</div>
            <h2 className="f-display" style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 800, letterSpacing: '-.03em', marginBottom: 16 }}>
              Start with a Consultation
            </h2>
            <p className="f-body" style={{ fontSize: 14, color: 'var(--sub)', lineHeight: 1.8, marginBottom: 32, maxWidth: 520, margin: '0 auto 32px' }}>
              Not sure what you need yet? Book a 60-minute scoping session. We&apos;ll audit your current process, map out what a digital solution looks like, and give you a clear recommendation — no obligation.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/consulting" className="btn btn-primary" style={{ fontSize: 12 }}>Book a Consultation →</Link>
              <Link href="/demo" className="btn-outline-border">Book a Demo Instead</Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
