import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhiteLabelEnquirySection from '@/components/WhiteLabelEnquirySection';

export const metadata: Metadata = {
  title: 'White-Label Licensing — ProStack NG Technologies',
  description:
    'License AutoReport, ProTrackNG, or ClubOps under your own brand. Monthly fee from ₦50,000. Branded, deployed, and supported by ProStack NG.',
  keywords: [
    'white label software Nigeria', 'white label SaaS Nigeria',
    'license software Nigeria', 'branded software Nigeria',
    'ProStack NG white label', 'AutoReport white label',
    'ProTrackNG white label',
  ],
  openGraph: {
    title: 'White-Label Licensing — ProStack NG',
    description: 'License our live platforms under your own brand. From ₦50,000/month.',
    url: 'https://www.prostackng.com.ng/white-label',
    siteName: 'ProStack NG Technologies',
    type: 'website',
  },
  alternates: { canonical: 'https://www.prostackng.com.ng/white-label' },
};

/* ─── DATA ─────────────────────────────────────────────────────── */
const PLATFORMS = [
  {
    id: 'autoreport',
    name: 'AutoReport',
    icon: '▦',
    color: '#FF5757',
    tagline: 'Automated Executive Reporting',
    description:
      'License AutoReport to offer your clients a fully branded automated reporting platform — PDF generation, Excel exports, KPI dashboards, and scheduled delivery. Your logo, your domain, your brand.',
    monthlyFee: '₦50,000 – ₦80,000',
    idealFor: [
      'Accounting & audit firms',
      'Business intelligence consultancies',
      'ERP vendors wanting a reporting add-on',
      'Nigerian banks & financial services firms',
    ],
    whatYouGet: [
      'Your logo, brand colours, and custom domain',
      'Dedicated instance — your data only',
      'White-labelled email notifications',
      'Onboarding support for your clients',
      'ProStack NG invisible — your brand leads',
    ],
    liveUrl: 'https://autoreport.prostackng.com.ng/',
  },
  {
    id: 'protrackng',
    name: 'ProTrackNG',
    icon: '◎',
    color: '#06B6D4',
    tagline: 'Tender Intelligence Platform',
    description:
      'License ProTrackNG to offer Nigerian businesses a branded tender tracking and bid management platform. Tap into the Nigerian government procurement market under your own brand.',
    monthlyFee: '₦80,000 – ₦120,000',
    idealFor: [
      'Procurement consulting firms',
      'Law firms with public sector clients',
      'Business development agencies',
      'Industry associations managing member bids',
    ],
    whatYouGet: [
      'Fully branded portal at your domain',
      'White-labelled onboarding emails',
      'Dedicated database instance',
      'Custom welcome messaging',
      'Client support routed through you',
    ],
    liveUrl: 'https://www.protrackng.com.ng/',
  },
  {
    id: 'clubops',
    name: 'ClubOps',
    icon: '◈',
    color: '#A78BFA',
    tagline: 'Venue & Hospitality Operating System',
    description:
      'License ClubOps to deploy a fully branded venue management platform across multiple hospitality clients — nightclubs, restaurants, event centres, hotels, and supper clubs.',
    monthlyFee: '₦60,000 – ₦100,000',
    idealFor: [
      'Hospitality management companies',
      'POS resellers & hospitality tech distributors',
      'Hotel groups & venue chains',
      'Event management companies',
    ],
    whatYouGet: [
      'Custom brand across all screens',
      'Multi-venue management from one dashboard',
      'Your domain and SSL',
      'Staff onboarding documentation branded',
      'ProStack NG as silent infrastructure',
    ],
    liveUrl: 'https://clubops-b6zl.onrender.com/',
  },
  {
    id: 'blockchain-explorer',
    name: 'Blockchain Explorer',
    icon: '⛓',
    color: '#7C3AED',
    tagline: 'Branded Web3 Transaction Interface',
    description:
      'License a white-label blockchain explorer — a branded interface showing real-time on-chain transaction history for your fintech product, private blockchain, or tokenised asset platform.',
    monthlyFee: '₦100,000 – ₦150,000',
    idealFor: [
      'Nigerian fintechs launching tokenised products',
      'Banks building private blockchain infrastructure',
      'Investment platforms with on-chain settlement',
      'Government agencies running digital bond programmes',
    ],
    whatYouGet: [
      'Fully branded explorer at your domain',
      'Configurable for Ethereum, Solana, or private chains',
      'Real-time transaction feed',
      'Address lookup and contract verification',
      'Embedded widget option for existing platforms',
    ],
    liveUrl: null,
    badge: 'Coming Soon',
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'NDA & Initial Discussion',
    body: 'You submit the enquiry form (NDA-gated). We review and schedule a call to understand your use case, client base, and deployment timeline.',
  },
  {
    step: '02',
    title: 'Formal NDA Signed',
    body: 'We send a mutual NDA. Once signed, we share full technical documentation, platform architecture, and pricing for your specific configuration.',
  },
  {
    step: '03',
    title: 'Branding & Configuration',
    body: 'You provide your brand assets — logo, colours, domain. We configure a dedicated instance of the platform under your brand. Takes 2–4 weeks.',
  },
  {
    step: '04',
    title: 'Testing & Handover',
    body: 'You and your team test the branded platform. We train your support staff and hand over documentation. You go live.',
  },
  {
    step: '05',
    title: 'Monthly Licence & Support',
    body: 'Monthly licensing fee covers hosting, maintenance, security patches, and a support SLA. Feature updates roll out automatically to your instance.',
  },
];

const TERMS = [
  { label: 'Licence Fee',          value: '₦50,000 – ₦150,000/month depending on platform and usage tier' },
  { label: 'Minimum Term',         value: '3 months' },
  { label: 'Setup Fee',            value: 'One-time ₦100,000 – ₦200,000 (covers branding & configuration)' },
  { label: 'NDA Required',         value: 'Yes — before any technical documentation is shared' },
  { label: 'IP Ownership',         value: 'ProStack NG retains full IP. You license the right to deploy and brand.' },
  { label: 'Your Branding',        value: 'Logo, domain, colours, email templates — fully customised to you' },
  { label: 'Data Isolation',       value: 'Dedicated database instance — your client data never co-mingles with ours' },
  { label: 'Support',              value: 'ProStack NG provides backend support. You manage client relationships.' },
  { label: 'Termination Notice',   value: '30 days written notice after minimum term' },
];

export default function WhiteLabelPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>

        {/* ─── HERO ────────────────────────────────────────────────── */}
        <section className="bg-grid" style={{
          position: 'relative', overflow: 'hidden',
          paddingTop: 'clamp(96px,12vw,140px)', paddingBottom: 'clamp(64px,8vw,96px)',
        }}>
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(37,99,235,.18) 0%, transparent 65%)' }} />
          <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 clamp(16px,4vw,56px)', textAlign: 'center', position: 'relative' }}>
            <div className="eyebrow" style={{ marginBottom: 24, justifyContent: 'center' }}>White-Label Licensing</div>
            <h1 className="f-display" style={{ fontSize: 'clamp(36px,6vw,72px)', fontWeight: 800, letterSpacing: '-.04em', lineHeight: 1.0, marginBottom: 24 }}>
              Our Platforms.<br />
              <span style={{ color: 'var(--blue-hi)' }}>Your Brand. Your Clients.</span>
            </h1>
            <p className="f-body" style={{ fontSize: 'clamp(15px,2vw,18px)', color: 'var(--sub)', maxWidth: 640, margin: '0 auto 40px', lineHeight: 1.75 }}>
              License AutoReport, ProTrackNG, ClubOps, or our upcoming Blockchain Explorer
              under your own brand. Dedicated instances. No ProStack NG branding visible to your
              clients. Monthly fee from ₦50,000.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="#platforms" className="btn btn-primary" style={{ fontSize: 12 }}>View Platforms →</a>
              <a href="#enquiry" className="btn-outline-border">Submit NDA Enquiry</a>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 48, marginTop: 56, flexWrap: 'wrap' }}>
              {[
                { value: '4',         label: 'Licensable Platforms' },
                { value: '₦50k/mo',   label: 'Starting Fee'         },
                { value: '2–4 wks',   label: 'Setup Time'           },
                { value: 'NDA',       label: 'Protected Engagement'  },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div className="f-display" style={{ fontSize: 22, fontWeight: 800, color: 'var(--blue-hi)', marginBottom: 4 }}>{s.value}</div>
                  <div className="f-mono" style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── PLATFORMS ───────────────────────────────────────────── */}
        <section id="platforms" style={{ padding: 'clamp(64px,8vw,96px) clamp(16px,4vw,56px)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ marginBottom: 56 }}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Available Platforms</div>
              <h2 className="f-display" style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: '-.03em' }}>
                What You Can License
              </h2>
              <p className="f-body" style={{ fontSize: 14, color: 'var(--sub)', marginTop: 10, maxWidth: 540 }}>
                Every platform has been built, tested, and deployed in production. You are licensing
                working software — not a prototype or a proof of concept.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {PLATFORMS.map(platform => (
                <div key={platform.id} style={{
                  background: 'var(--card)', border: '1px solid var(--border)',
                  overflow: 'hidden', position: 'relative',
                }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${platform.color}, transparent)` }} />
                  <div style={{
                    padding: 'clamp(28px,4vw,40px)',
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: 32, alignItems: 'start',
                  }}>

                    {/* Left: identity + description */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                        <div style={{ width: 52, height: 52, background: `${platform.color}15`, border: `1px solid ${platform.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: platform.color, flexShrink: 0 }}>
                          {platform.icon}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <h3 className="f-display" style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-.02em' }}>{platform.name}</h3>
                            {platform.badge && (
                              <span className="badge badge-roadmap">{platform.badge}</span>
                            )}
                          </div>
                          <div className="f-mono" style={{ fontSize: 9, letterSpacing: '.1em', textTransform: 'uppercase', color: platform.color, marginTop: 3 }}>
                            {platform.tagline}
                          </div>
                        </div>
                      </div>
                      <p className="f-body" style={{ fontSize: 14, color: 'var(--sub)', lineHeight: 1.8, marginBottom: 20 }}>
                        {platform.description}
                      </p>
                      <div className="f-mono" style={{ fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>Ideal For</div>
                      <ul style={{ listStyle: 'none' }}>
                        {platform.idealFor.map(f => (
                          <li key={f} className="f-body" style={{ fontSize: 13, color: 'var(--sub)', paddingLeft: 16, position: 'relative', marginBottom: 6, lineHeight: 1.5 }}>
                            <span style={{ position: 'absolute', left: 0, top: 5, color: platform.color, fontSize: 7 }}>◆</span>{f}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Right: what you get + fee */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                      <div style={{ background: 'var(--s2)', border: '1px solid var(--border)', padding: '20px' }}>
                        <div className="f-mono" style={{ fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>What You Get</div>
                        <ul style={{ listStyle: 'none' }}>
                          {platform.whatYouGet.map(w => (
                            <li key={w} className="f-body" style={{ fontSize: 13, color: 'var(--sub)', paddingLeft: 16, position: 'relative', marginBottom: 7, lineHeight: 1.5 }}>
                              <span style={{ position: 'absolute', left: 0, top: 5, color: 'var(--blue)', fontSize: 7 }}>◆</span>{w}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                        <div>
                          <div className="f-mono" style={{ fontSize: 9, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6 }}>Monthly Licence</div>
                          <div className="f-display" style={{ fontSize: 22, fontWeight: 800, color: 'var(--blue-hi)', letterSpacing: '-.02em' }}>{platform.monthlyFee}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                          {platform.liveUrl && (
                            <a href={platform.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-outline-border" style={{ fontSize: 10, padding: '9px 16px' }}>
                              View Live →
                            </a>
                          )}
                          <a href="#enquiry" className="btn btn-primary" style={{ fontSize: 11, padding: '11px 20px' }}>
                            Enquire →
                          </a>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── TERMS ───────────────────────────────────────────────── */}
        <section style={{ background: 'var(--s1)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: 'clamp(64px,8vw,96px) clamp(16px,4vw,56px)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ marginBottom: 48 }}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Licensing Terms</div>
              <h2 className="f-display" style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: '-.03em' }}>Key Terms at a Glance</h2>
              <p className="f-body" style={{ fontSize: 14, color: 'var(--sub)', marginTop: 10 }}>
                No surprises. Full terms are covered in the formal licence agreement shared post-NDA.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {TERMS.map((term, i) => (
                <div key={term.label} style={{
                  background: i % 2 === 0 ? 'var(--card)' : 'rgba(255,255,255,.015)',
                  border: '1px solid var(--border)',
                  padding: '16px 24px',
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'flex-start', gap: 20, flexWrap: 'wrap',
                }}>
                  <span className="f-mono" style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', flexShrink: 0, minWidth: 160 }}>{term.label}</span>
                  <span className="f-body" style={{ fontSize: 13, color: 'var(--text)', flex: 1, textAlign: 'right' }}>{term.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── HOW IT WORKS ────────────────────────────────────────── */}
        <section style={{ padding: 'clamp(64px,8vw,96px) clamp(16px,4vw,56px)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ marginBottom: 56 }}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>The Process</div>
              <h2 className="f-display" style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: '-.03em' }}>From Enquiry to Live</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 2 }}>
              {HOW_IT_WORKS.map((step, idx) => (
                <div key={step.step} style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: '28px 22px', position: 'relative', borderLeft: idx === 0 ? '1px solid var(--border)' : 'none' }}>
                  <div className="f-display text-ghost" style={{ fontSize: 48, fontWeight: 800, letterSpacing: '-.04em', lineHeight: 1, marginBottom: 16, userSelect: 'none' }}>{step.step}</div>
                  <h3 className="f-display" style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-.01em', marginBottom: 8 }}>{step.title}</h3>
                  <p className="f-body" style={{ fontSize: 12, color: 'var(--sub)', lineHeight: 1.75 }}>{step.body}</p>
                  {idx < HOW_IT_WORKS.length - 1 && (
                    <div style={{ position: 'absolute', top: '50%', right: -14, transform: 'translateY(-50%)', color: 'var(--blue)', fontSize: 16, fontWeight: 700, zIndex: 2 }}>→</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── ENQUIRY ─────────────────────────────────────────────── */}
        <section id="enquiry" style={{ background: 'var(--s1)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: 'clamp(64px,8vw,96px) clamp(16px,4vw,56px)' }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <div style={{ marginBottom: 48 }}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>NDA-Gated Enquiry</div>
              <h2 className="f-display" style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: '-.03em' }}>Start the Licensing Conversation</h2>
              <p className="f-body" style={{ fontSize: 14, color: 'var(--sub)', marginTop: 10, maxWidth: 580, lineHeight: 1.8 }}>
                All white-label discussions are conducted under NDA. Submit your enquiry below —
                your confidentiality acknowledgement is logged on submission, and a formal mutual
                NDA document is sent before any technical information is shared.
              </p>
            </div>
            <WhiteLabelEnquirySection />
          </div>
        </section>

        {/* ─── BOTTOM CTA ──────────────────────────────────────────── */}
        <section style={{ padding: 'clamp(64px,8vw,96px) clamp(16px,4vw,56px)' }}>
          <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
            <div className="eyebrow" style={{ marginBottom: 20, justifyContent: 'center' }}>Want Something Built Instead?</div>
            <h2 className="f-display" style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 800, letterSpacing: '-.03em', marginBottom: 16 }}>
              We Also Build Custom Platforms
            </h2>
            <p className="f-body" style={{ fontSize: 14, color: 'var(--sub)', lineHeight: 1.8, marginBottom: 32, maxWidth: 520, margin: '0 auto 32px' }}>
              If none of our existing platforms fit your needs exactly, our Build With Us service
              delivers a fully custom SaaS platform — fixed-price, fixed-timeline.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/build-with-us" className="btn btn-primary" style={{ fontSize: 12 }}>View Build Packages →</Link>
              <Link href="/managed-services" className="btn-outline-border">Managed Services</Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
