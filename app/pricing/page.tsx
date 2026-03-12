import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Pricing — ProStack NG',
  description: 'Transparent pricing for every ProStack NG platform. Start free, scale as you grow.',
};

const PRODUCTS = [
  {
    id: 'autoreport',
    name: 'AutoReport',
    tagline: 'Executive Reporting Pipeline',
    color: '#FF5757',
    icon: '▦',
    tiers: [
      {
        name: 'Starter',
        price: '₦45,000',
        period: '/month',
        desc: 'Perfect for small teams generating weekly reports.',
        features: [
          'Up to 3 report templates',
          '5,000 rows processed/month',
          'PDF + Excel output',
          'Email delivery to 5 recipients',
          'Standard charts (4 types)',
          'Email support',
        ],
        cta: 'Get Started',
        highlighted: false,
      },
      {
        name: 'Growth',
        price: '₦120,000',
        period: '/month',
        desc: 'For growing businesses running daily automated reporting.',
        features: [
          'Unlimited report templates',
          '100,000 rows processed/month',
          'PDF + Excel + PowerPoint',
          'Email delivery to 25 recipients',
          'Advanced charts (12 types)',
          'Scheduled daily/weekly delivery',
          'Custom branding & logo',
          'Priority support',
        ],
        cta: 'Start Free Trial',
        highlighted: true,
      },
      {
        name: 'Enterprise',
        price: 'Custom',
        period: '',
        desc: 'For large organisations with complex reporting needs.',
        features: [
          'Unlimited rows & templates',
          'Unlimited recipients',
          'Multi-source data ingestion',
          'Custom KPI formulas',
          'White-label deployment',
          'Dedicated account manager',
          'SLA guarantee',
          'On-premise option',
        ],
        cta: 'Contact Us',
        highlighted: false,
      },
    ],
  },
  {
    id: 'protrackng',
    name: 'ProTrackNG',
    tagline: 'Tender Intelligence Platform',
    color: '#06B6D4',
    icon: '◎',
    tiers: [
      {
        name: 'Solo',
        price: '₦35,000',
        period: '/month',
        desc: 'For freelancers and sole contractors tracking tenders.',
        features: [
          'Monitor 50 tender portals',
          'Daily email digest',
          'Basic keyword alerts',
          'Deadline calendar',
          'Mobile alerts',
          'Email support',
        ],
        cta: 'Get Started',
        highlighted: false,
      },
      {
        name: 'Business',
        price: '₦95,000',
        period: '/month',
        desc: 'For SMEs building a serious tender pipeline.',
        features: [
          'Monitor 400+ tender portals',
          'Real-time alerts (WhatsApp + Email)',
          'AI relevance scoring',
          'Pipeline tracking dashboard',
          'Team access (5 users)',
          'Bid deadline reminders',
          'Win/loss analytics',
          'Priority support',
        ],
        cta: 'Start Free Trial',
        highlighted: true,
      },
      {
        name: 'Enterprise',
        price: 'Custom',
        period: '',
        desc: 'For large firms with dedicated bid teams.',
        features: [
          'Full portal coverage (all sectors)',
          'Unlimited users',
          'CRM integration',
          'Custom portal scraping',
          'Competitor intelligence',
          'Dedicated bid strategist',
          'API access',
          'SLA guarantee',
        ],
        cta: 'Contact Us',
        highlighted: false,
      },
    ],
  },
  {
    id: 'nightops',
    name: 'NightOps',
    tagline: 'Nightlife Operating System',
    color: '#A78BFA',
    icon: '◈',
    tiers: [
      {
        name: 'Venue',
        price: '₦60,000',
        period: '/month',
        desc: 'Single venue, full digital operations.',
        features: [
          'POS & till management',
          'Nightly reconciliation',
          'Staff scheduling',
          'Inventory tracking',
          'Daily revenue reports',
          'WhatsApp support',
        ],
        cta: 'Get Started',
        highlighted: false,
      },
      {
        name: 'Premium',
        price: '₦150,000',
        period: '/month',
        desc: 'Full OS for high-volume venues and clubs.',
        features: [
          'Everything in Venue',
          'Real-time revenue dashboard',
          'VIP table management',
          'Event ticketing module',
          'Multi-till synchronisation',
          'Executive nightly reports',
          'Staff performance tracking',
          'Priority support',
        ],
        cta: 'Book a Demo',
        highlighted: true,
      },
      {
        name: 'Group',
        price: 'Custom',
        period: '',
        desc: 'For hospitality groups with multiple venues.',
        features: [
          'Multi-venue management',
          'Consolidated group reporting',
          'Centralised staff payroll',
          'Cross-venue inventory',
          'Group analytics dashboard',
          'Dedicated account manager',
          'Custom integrations',
          'On-site training',
        ],
        cta: 'Contact Us',
        highlighted: false,
      },
    ],
  },
];

const FAQS = [
  { q: 'Do you offer free trials?', a: 'Yes — all Growth and Business tiers come with a 14-day free trial, no credit card required. We set everything up for you and walk you through the platform on day one.' },
  { q: 'Are prices in Naira?', a: 'All prices are in Nigerian Naira (₦). We accept bank transfer, Paystack, and Flutterwave. Enterprise clients can arrange quarterly or annual invoicing.' },
  { q: 'Can I switch plans later?', a: 'Absolutely. You can upgrade or downgrade at any time. Upgrades take effect immediately. Downgrades apply at the next billing cycle.' },
  { q: 'What counts as a "row" in AutoReport?', a: 'One row = one record in your source data (Excel, CSV, or database). If you upload a 10,000-row sales spreadsheet, that counts as 10,000 rows processed.' },
  { q: 'Do you offer discounts for annual billing?', a: 'Yes — pay annually and get 2 months free on any plan. Contact us to set up annual billing.' },
  { q: 'What happens after my free trial?', a: 'We\'ll reach out before your trial ends to discuss which plan fits best. Nothing is charged without your explicit confirmation.' },
];

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 68 }}>

        {/* ── HEADER ── */}
        <div className="bg-grid" style={{
          padding: 'clamp(64px,8vw,100px) clamp(16px,4vw,56px) clamp(48px,5vw,72px)',
          backgroundSize: '52px 52px', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 40%, transparent 30%, var(--bg) 100%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
            <div className="eyebrow" style={{ justifyContent: 'center', marginBottom: 16 }}>Pricing</div>
            <h1 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(44px,7vw,100px)', letterSpacing: '-.05em', lineHeight: .9, color: 'var(--text)', marginBottom: 20 }}>
              Honest pricing.<br /><span style={{ color: 'var(--blue-hi)' }}>Real results.</span>
            </h1>
            <p style={{ fontSize: 17, color: 'var(--sub)', lineHeight: 1.85, maxWidth: 520, margin: '0 auto 36px' }}>
              Every plan includes onboarding support. No hidden fees, no lock-in. Pay month to month, cancel any time.
            </p>
            {/* Annual toggle hint */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: 'var(--card)', border: '1px solid var(--hi)', padding: '10px 20px' }}>
              <span className="f-mono" style={{ fontSize: 10, letterSpacing: '.1em', color: 'var(--sub)', textTransform: 'uppercase' }}>Annual billing</span>
              <span style={{ background: 'rgba(37,99,235,.1)', border: '1px solid rgba(37,99,235,.25)', color: 'var(--blue-hi)', fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, letterSpacing: '.1em', padding: '3px 10px', textTransform: 'uppercase' }}>
                Save 2 months
              </span>
            </div>
          </div>
        </div>

        {/* ── PRODUCT PRICING SECTIONS ── */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(48px,6vw,80px) clamp(16px,4vw,56px)' }}>
          {PRODUCTS.map((product, pi) => (
            <div key={product.id} id={product.id} style={{ marginBottom: pi < PRODUCTS.length - 1 ? 80 : 0 }}>

              {/* Product label */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 36, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
                <div style={{
                  width: 44, height: 44, flexShrink: 0,
                  background: `${product.color}12`, border: `1px solid ${product.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, color: product.color,
                }}>
                  {product.icon}
                </div>
                <div>
                  <div className="f-display" style={{ fontWeight: 800, fontSize: 22, letterSpacing: '-.02em', color: 'var(--text)', lineHeight: 1 }}>
                    {product.name}
                  </div>
                  <div className="f-mono" style={{ fontSize: 9.5, letterSpacing: '.12em', color: product.color, textTransform: 'uppercase', marginTop: 3 }}>
                    {product.tagline}
                  </div>
                </div>
              </div>

              {/* Tier cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 1, background: 'var(--border)' }}>
                {product.tiers.map(tier => (
                  <div key={tier.name} style={{
                    background: tier.highlighted ? 'var(--s2)' : 'var(--card)',
                    padding: 'clamp(28px,3vw,44px)',
                    position: 'relative', overflow: 'hidden',
                    display: 'flex', flexDirection: 'column',
                  }}>
                    {/* Top accent */}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: tier.highlighted ? 2 : 1, background: tier.highlighted ? product.color : 'transparent' }} />

                    {/* Most popular badge */}
                    {tier.highlighted && (
                      <div style={{
                        position: 'absolute', top: 18, right: 18,
                        fontFamily: 'JetBrains Mono, monospace', fontSize: 8.5,
                        letterSpacing: '.12em', textTransform: 'uppercase',
                        background: `${product.color}15`, border: `1px solid ${product.color}40`,
                        color: product.color, padding: '3px 9px',
                      }}>
                        Most Popular
                      </div>
                    )}

                    {/* Tier name */}
                    <div className="f-mono" style={{ fontSize: 10, letterSpacing: '.16em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 16 }}>
                      {tier.name}
                    </div>

                    {/* Price */}
                    <div style={{ marginBottom: 6 }}>
                      <span className="f-display" style={{ fontWeight: 800, fontSize: tier.price === 'Custom' ? 40 : 48, letterSpacing: '-.04em', color: tier.highlighted ? product.color : 'var(--text)', lineHeight: 1 }}>
                        {tier.price}
                      </span>
                      {tier.period && (
                        <span className="f-mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '.08em', marginLeft: 4 }}>
                          {tier.period}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.7, marginBottom: 28 }}>
                      {tier.desc}
                    </p>

                    {/* Features */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32, flex: 1 }}>
                      {tier.features.map(f => (
                        <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                          <span style={{ color: tier.highlighted ? product.color : 'var(--blue)', fontSize: 9, marginTop: 4, flexShrink: 0, fontWeight: 700 }}>◆</span>
                          <span style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.5 }}>{f}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <Link
                      href={tier.cta === 'Contact Us' ? '/contact' : '/demo'}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'Syne, sans-serif', fontWeight: 700,
                        fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase',
                        textDecoration: 'none', padding: '13px 24px',
                        background: tier.highlighted ? product.color : 'transparent',
                        border: `1px solid ${tier.highlighted ? product.color : 'var(--hi)'}`,
                        color: tier.highlighted ? '#fff' : 'var(--sub)',
                        transition: 'all .2s',
                      }}
                    >
                      {tier.cta} →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── COMING SOON PRODUCTS ── */}
        <div style={{ background: 'var(--s1)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: 'clamp(48px,5vw,72px) clamp(16px,4vw,56px)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div className="eyebrow" style={{ marginBottom: 20 }}>Upcoming Platforms</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
              {[
                { name: 'MyHarriet', icon: '⬡', color: '#F5B530', status: 'Building', desc: 'Marketplace & escrow platform. Early access pricing available for launch partners.' },
                { name: 'SwiftRide', icon: '⟁', color: '#38BDF8', status: 'Roadmap',  desc: 'Ride-hailing for Rivers State. Driver and operator onboarding opens Q3 2025.' },
                { name: 'StakeX',    icon: '◑', color: '#FB923C', status: 'Roadmap',  desc: 'Digital staking platform. Investor preview available — contact us for details.' },
              ].map(p => (
                <div key={p.name} style={{ background: 'var(--card)', padding: 32, opacity: .7 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div style={{ fontSize: 22, color: p.color }}>{p.icon}</div>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 8.5,
                      letterSpacing: '.12em', textTransform: 'uppercase',
                      background: `${p.color}10`, border: `1px solid ${p.color}25`,
                      color: p.color, padding: '3px 9px',
                    }}>{p.status}</span>
                  </div>
                  <div className="f-display" style={{ fontWeight: 800, fontSize: 18, color: 'var(--text)', marginBottom: 8 }}>{p.name}</div>
                  <p style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.75 }}>{p.desc}</p>
                  <Link href="/contact" style={{
                    display: 'inline-block', marginTop: 18,
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5,
                    letterSpacing: '.1em', textTransform: 'uppercase',
                    color: p.color, textDecoration: 'none',
                    borderBottom: `1px solid ${p.color}50`, paddingBottom: 2,
                  }}>
                    Join Waitlist →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── FAQs ── */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(56px,7vw,96px) clamp(16px,4vw,56px)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 72 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 16 }}>FAQs</div>
              <h2 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(28px,3.5vw,48px)', letterSpacing: '-.04em', color: 'var(--text)', lineHeight: 1 }}>
                Common<br />questions.
              </h2>
              <p style={{ fontSize: 15, color: 'var(--sub)', lineHeight: 1.85, marginTop: 16, maxWidth: 360 }}>
                Still have questions? Book a free 45-minute call — we'll walk through every product in detail.
              </p>
              <Link href="/demo" className="btn btn-ghost btn-sm" style={{ marginTop: 28 }}>
                Book a Call →
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
              {FAQS.map((faq, i) => (
                <div key={i} style={{ background: 'var(--card)', padding: '24px 28px' }}>
                  <div className="f-display" style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 10, lineHeight: 1.3 }}>
                    {faq.q}
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.8 }}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── BOTTOM CTA ── */}
        <div style={{ background: 'var(--s1)', borderTop: '1px solid var(--border)', padding: 'clamp(48px,6vw,80px) clamp(16px,4vw,56px)', textAlign: 'center' }}>
          <div className="eyebrow" style={{ justifyContent: 'center', marginBottom: 16 }}>Still Deciding?</div>
          <h2 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(28px,4vw,56px)', letterSpacing: '-.04em', color: 'var(--text)', marginBottom: 16 }}>
            Talk to us first.<br /><span style={{ color: 'var(--blue-hi)' }}>No commitment.</span>
          </h2>
          <p style={{ fontSize: 16, color: 'var(--sub)', marginBottom: 36, maxWidth: 480, margin: '0 auto 36px' }}>
            45 minutes. We walk you through the product live, answer every question, and only recommend a plan if it genuinely fits your business.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            <Link href="/demo" className="btn btn-primary" style={{ padding: '16px 44px' }}>Book a Free Demo →</Link>
            <a href="https://wa.me/2347059449360" target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ padding: '16px 44px' }}>💬 WhatsApp Us</a>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
