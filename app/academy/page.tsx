import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScholarshipForm from '@/components/ScholarshipForm';
import OpenChatButton from '@/components/OpenChatButton';

export const metadata: Metadata = {
  title: 'ProStack NG Academy — Practical Tech Education for Nigerian Builders',
  description:
    'Learn to build SaaS products, win Nigerian government contracts, and digitally transform your business. Courses designed for Nigerian professionals by ProStack NG Technologies.',
  keywords: [
    'tech courses Nigeria', 'SaaS development Nigeria', 'digital transformation Nigeria',
    'Next.js course Nigeria', 'Nigerian government contracts', 'ProStack NG Academy',
    'tech scholarships Nigeria', 'university tech partnership Nigeria',
  ],
  openGraph: {
    title: 'ProStack NG Academy',
    description: 'Practical tech education built for the Nigerian market. Courses, bundles, corporate cohorts, and scholarships.',
    url: 'https://www.prostackng.com.ng/academy',
    siteName: 'ProStack NG Technologies',
    type: 'website',
  },
  alternates: { canonical: 'https://www.prostackng.com.ng/academy' },
};

/* ─── DATA ─────────────────────────────────────────────────────── */
const COURSES = [
  {
    id: 'saas-nextjs-supabase', icon: '⚡',
    title: 'Building SaaS with Next.js + Supabase',
    tagline: 'Ship your first real product in 8 weeks',
    description: 'A hands-on course covering the exact stack powering AutoReport, ProTrackNG, and ClubOps. Build auth, multi-tenancy, payments, and deployment pipelines from scratch.',
    level: 'Intermediate', levelColor: '#2563EB',
    duration: '8 weeks', lessons: 42, price: 15000,
    selarUrl: 'https://selar.co/prostackng-saas-nextjs',
    highlights: [
      'Next.js 14 App Router deep dive', 'Supabase auth, RLS & real-time',
      'Stripe & Paystack integration', 'Vercel deployment & CI/CD',
      'Multi-tenant architecture patterns',
    ],
    badge: 'Best Seller', badgeClass: 'badge-live',
  },
  {
    id: 'process-automation', icon: '🔄',
    title: 'Process Automation for Nigerian Businesses',
    tagline: 'Automate the work that is killing your margins',
    description: 'Practical automation workflows for Nigerian SMEs — from Excel chaos to structured pipelines using no-code and low-code tools, plus custom scripting for complex scenarios.',
    level: 'Beginner–Intermediate', levelColor: '#0284C7',
    duration: '5 weeks', lessons: 28, price: 10000,
    selarUrl: 'https://selar.co/prostackng-automation',
    highlights: [
      'Mapping your current processes', 'Make (Integromat) & Zapier for Nigeria',
      'Google Workspace automation', 'Report generation pipelines', 'ROI measurement frameworks',
    ],
    badge: null, badgeClass: '',
  },
  {
    id: 'tender-intelligence', icon: '🏛',
    title: 'Tender Intelligence — Winning Nigerian Government Contracts',
    tagline: 'The insider system for public procurement',
    description: "Navigate Nigeria's government procurement landscape with confidence. Learn how to find, evaluate, and win tenders from MDAs, state governments, and development agencies.",
    level: 'All Levels', levelColor: '#7C3AED',
    duration: '4 weeks', lessons: 22, price: 12000,
    selarUrl: 'https://selar.co/prostackng-tender',
    highlights: [
      'BPP portal & procurement law', 'Pre-qualification document templates',
      'Pricing strategies that win', 'Rivers State & FCT opportunity mapping',
      'NITDA & development agency grants',
    ],
    badge: 'High Demand', badgeClass: 'badge-building',
  },
  {
    id: 'digital-transformation-sme', icon: '🌐',
    title: 'Digital Transformation for Nigerian SMEs',
    tagline: 'Modernise without breaking the bank',
    description: 'A structured programme helping Nigerian business owners understand, plan, and execute digital transformation across operations, customer experience, and data management.',
    level: 'Beginner', levelColor: '#059669',
    duration: '4 weeks', lessons: 20, price: 8000,
    selarUrl: 'https://selar.co/prostackng-digital-sme',
    highlights: [
      'Digital maturity self-assessment', 'Technology stack selection for Nigeria',
      'Change management for Nigerian teams', 'Vendor evaluation framework', 'NITDA compliance basics',
    ],
    badge: null, badgeClass: '',
  },
  {
    id: 'launch-startup-nigeria', icon: '🚀',
    title: 'Launching a Tech Startup in Nigeria from Scratch',
    tagline: 'Zero to revenue in the Nigerian market',
    description: 'Everything you need to go from idea to your first paying customer in Nigeria — legal registration, product validation, building with lean resources, and early growth tactics.',
    level: 'Beginner', levelColor: '#059669',
    duration: '6 weeks', lessons: 34, price: 10000,
    selarUrl: 'https://selar.co/prostackng-launch',
    highlights: [
      'CAC registration & legal structure', 'Product validation in Nigerian context',
      'Building an MVP under ₦500k', 'Nigerian payment stacks (Paystack, Flutterwave)',
      'Angel funding & NITDA grants',
    ],
    badge: 'New', badgeClass: 'badge-roadmap',
  },
];

const BUNDLES = [
  {
    name: 'SaaS Builder Bundle',
    includes: ['Building SaaS with Next.js + Supabase', 'Launching a Tech Startup in Nigeria'],
    price: 22000, originalPrice: 25000, selarUrl: 'https://selar.co/prostackng-bundle-saas',
  },
  {
    name: 'Digital Business Bundle',
    includes: ['Process Automation for Nigerian Businesses', 'Digital Transformation for Nigerian SMEs'],
    price: 16000, originalPrice: 18000, selarUrl: 'https://selar.co/prostackng-bundle-digital',
  },
  {
    name: 'Government & Enterprise Bundle',
    includes: ['Tender Intelligence', 'Digital Transformation for SMEs', 'Process Automation'],
    price: 28000, originalPrice: 30000, selarUrl: 'https://selar.co/prostackng-bundle-gov',
  },
  {
    name: "Complete Founder's Pack",
    includes: ['All 5 courses included'],
    price: 45000, originalPrice: 55000, selarUrl: 'https://selar.co/prostackng-bundle-all',
  },
];

const PRICING = [
  {
    tier: 'Individual Courses', price: '₦5,000 – ₦15,000',
    description: 'Pick the course you need. One-time payment, lifetime access.',
    features: [
      'Lifetime course access', 'Downloadable resources & templates',
      'Community Discord access', 'ProStack NG Academy certificate', 'Certificate verification URL',
    ],
    cta: 'Browse Courses', ctaHref: '#courses', highlight: false,
  },
  {
    tier: 'Course Bundles', price: '₦25,000 – ₦50,000',
    description: 'Curated paths for specific career goals — bigger savings, deeper learning.',
    features: [
      'All individual course features', '2–4 thematically linked courses',
      'Bonus masterclasses', 'Priority community support', 'LinkedIn-ready certificate pack',
    ],
    cta: 'View Bundles', ctaHref: '#bundles', highlight: true,
  },
  {
    tier: 'Corporate Cohorts', price: '₦150,000 – ₦500,000',
    description: 'Train your entire team. Custom scheduling, live sessions, progress tracking.',
    features: [
      'Up to 20 staff per cohort', 'Live weekly sessions with instructors',
      'Custom case studies for your industry', 'Progress dashboards for HR teams',
      'Certificates for each participant', 'Post-training implementation support',
    ],
    cta: 'Request a Quote',
    ctaHref: 'mailto:academy@prostackng.com.ng?subject=Corporate%20Cohort%20Enquiry',
    highlight: false,
  },
];

const PARTNERS = [
  {
    type: 'Universities & Polytechnics', icon: '🏫',
    description: 'We partner with Nigerian universities and polytechnics to deliver practical tech modules as part of their curriculum or extracurricular enrichment. Students graduate with both an institutional record and a verified ProStack NG Academy certificate.',
    benefits: [
      'Custom curriculum aligned to your department',
      'Guest lectures from ProStack NG engineers',
      'Discounted cohort rates for student enrolment',
      'Joint certificate issuance',
      'Internship pipeline to ProStack NG clients',
    ],
    chatMessage: 'Hi, I am enquiring about a University Partnership with ProStack NG Academy.',
  },
  {
    type: 'Corporate Training Partners', icon: '🏢',
    description: "Companies that want to upskill their workforce can co-brand our delivery or customise our curriculum entirely. We handle all training logistics — you focus on your team's growth.",
    benefits: [
      'Branded training portal for your company',
      'Custom course content for your industry',
      'Dedicated instructor for your cohort',
      'Progress tracking per employee',
      'Post-training competency assessments',
      'Volume pricing from ₦150,000 per cohort',
    ],
    chatMessage: 'Hi, I am enquiring about a Corporate Training Partnership with ProStack NG Academy.',
  },
];

export default function AcademyPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>

        {/* ─── HERO ────────────────────────────────────────────────── */}
        <section className="bg-grid" style={{
          position: 'relative', overflow: 'hidden',
          paddingTop: 'clamp(96px,12vw,140px)', paddingBottom: 'clamp(64px,8vw,96px)',
        }}>
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(37,99,235,.18) 0%, transparent 65%)',
          }} />
          <div style={{ maxWidth: 880, margin: '0 auto', padding: '0 clamp(16px,4vw,56px)', textAlign: 'center', position: 'relative' }}>
            <div className="eyebrow" style={{ marginBottom: 24, justifyContent: 'center' }}>ProStack NG Academy</div>
            <h1 className="f-display" style={{ fontSize: 'clamp(36px,6vw,72px)', fontWeight: 800, letterSpacing: '-.04em', lineHeight: 1.0, marginBottom: 24 }}>
              Practical Tech Education<br />
              <span style={{ color: 'var(--blue-hi)' }}>Built for Nigeria.</span>
            </h1>
            <p className="f-body" style={{ fontSize: 'clamp(15px,2vw,18px)', color: 'var(--sub)', maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.75 }}>
              No fluff. No theory for theory&apos;s sake. Every course is taught by the team that built
              AutoReport, ProTrackNG, and ClubOps — real products, serving real Nigerian clients.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="#courses" className="btn btn-primary" style={{ fontSize: 12 }}>Browse Courses →</a>
              <a href="#scholarships" className="btn-outline-border">Apply for Scholarship</a>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 48, marginTop: 56, flexWrap: 'wrap' }}>
              {[
                { label: 'Live Courses', value: '5' },
                { label: 'Naira Pricing', value: '₦ Only' },
                { label: 'Scholarships Available', value: '✓' },
                { label: 'Certificate on Completion', value: '✓ Verified' },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div className="f-display" style={{ fontSize: 22, fontWeight: 800, color: 'var(--blue-hi)', marginBottom: 4 }}>{s.value}</div>
                  <div className="f-mono" style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── COURSES ─────────────────────────────────────────────── */}
        <section id="courses" style={{ padding: 'clamp(64px,8vw,96px) clamp(16px,4vw,56px)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ marginBottom: 56 }}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Our Programmes</div>
              <h2 className="f-display" style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: '-.03em' }}>
                What You&apos;ll Learn
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: 20 }}>
              {COURSES.map(course => (
                <div key={course.id} className="card-hover-blue" style={{
                  background: 'var(--card)', border: '1px solid var(--border)',
                  padding: '28px 28px 24px', position: 'relative',
                }}>
                  {course.badge && (
                    <span className={`badge ${course.badgeClass}`} style={{ position: 'absolute', top: 20, right: 20 }}>
                      {course.badge}
                    </span>
                  )}
                  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 16 }}>
                    <div style={{ width: 44, height: 44, background: 'var(--blue-lo)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                      {course.icon}
                    </div>
                    <div>
                      <h3 className="f-display" style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-.02em', marginBottom: 4, lineHeight: 1.2 }}>{course.title}</h3>
                      <p style={{ fontSize: 13, color: 'var(--blue-hi)', fontWeight: 500 }}>{course.tagline}</p>
                    </div>
                  </div>
                  <p className="f-body" style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.75, marginBottom: 20 }}>{course.description}</p>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
                    <span className="badge" style={{ background: `${course.levelColor}18`, color: course.levelColor, border: `1px solid ${course.levelColor}40` }}>{course.level}</span>
                    <span className="f-mono" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '.1em' }}>{course.duration}</span>
                    <span className="f-mono" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '.1em' }}>{course.lessons} LESSONS</span>
                  </div>
                  <ul style={{ listStyle: 'none', marginBottom: 24 }}>
                    {course.highlights.map(h => (
                      <li key={h} className="f-body" style={{ fontSize: 13, color: 'var(--sub)', paddingLeft: 16, position: 'relative', marginBottom: 8, lineHeight: 1.5 }}>
                        <span style={{ position: 'absolute', left: 0, top: 5, color: 'var(--blue)', fontSize: 7 }}>◆</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: 20 }}>
                    <span className="f-display" style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-.03em' }}>₦{course.price.toLocaleString()}</span>
                    <a href={course.selarUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontSize: 11, padding: '11px 24px' }}>
                      Enrol on Selar ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── BUNDLES ─────────────────────────────────────────────── */}
        <section id="bundles" style={{ background: 'var(--s1)', padding: 'clamp(64px,8vw,96px) clamp(16px,4vw,56px)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ marginBottom: 48 }}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Save More</div>
              <h2 className="f-display" style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: '-.03em' }}>Course Bundles</h2>
              <p className="f-body" style={{ fontSize: 14, color: 'var(--sub)', marginTop: 8 }}>Curated learning paths for specific goals. Better value, deeper expertise.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
              {BUNDLES.map(bundle => (
                <div key={bundle.name} className="card-hover-blue" style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: '24px', display: 'flex', flexDirection: 'column' }}>
                  <h3 className="f-display" style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>{bundle.name}</h3>
                  <ul style={{ listStyle: 'none', marginBottom: 20, flex: 1 }}>
                    {bundle.includes.map(c => (
                      <li key={c} className="f-body" style={{ fontSize: 12, color: 'var(--sub)', paddingLeft: 14, position: 'relative', marginBottom: 8, lineHeight: 1.5 }}>
                        <span style={{ position: 'absolute', left: 0, top: 5, color: 'var(--blue)', fontSize: 6 }}>◆</span>{c}
                      </li>
                    ))}
                  </ul>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 16 }}>
                    <span className="f-display" style={{ fontSize: 20, fontWeight: 800 }}>₦{bundle.price.toLocaleString()}</span>
                    <span className="f-mono" style={{ fontSize: 10, color: 'var(--muted)', textDecoration: 'line-through' }}>₦{bundle.originalPrice.toLocaleString()}</span>
                  </div>
                  <a href={bundle.selarUrl} target="_blank" rel="noopener noreferrer" className="btn-outline-blue">Get Bundle →</a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── PRICING ─────────────────────────────────────────────── */}
        <section id="pricing" style={{ padding: 'clamp(64px,8vw,96px) clamp(16px,4vw,56px)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div className="eyebrow" style={{ marginBottom: 16, justifyContent: 'center' }}>Pricing</div>
              <h2 className="f-display" style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: '-.03em' }}>Every Budget. Every Team Size.</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
              {PRICING.map(tier => (
                <div key={tier.tier} style={{
                  background: tier.highlight ? 'rgba(37,99,235,.07)' : 'var(--card)',
                  border: tier.highlight ? '1px solid var(--blue-dim)' : '1px solid var(--border)',
                  padding: '32px 28px', display: 'flex', flexDirection: 'column', position: 'relative',
                }}>
                  {tier.highlight && (
                    <div className="f-mono" style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'var(--blue)', color: '#fff', fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', padding: '4px 14px', whiteSpace: 'nowrap' }}>
                      Most Popular
                    </div>
                  )}
                  <h3 className="f-display" style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{tier.tier}</h3>
                  <p className="f-display" style={{ fontSize: 26, fontWeight: 800, color: 'var(--blue-hi)', letterSpacing: '-.03em', marginBottom: 12 }}>{tier.price}</p>
                  <p className="f-body" style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.7, marginBottom: 24 }}>{tier.description}</p>
                  <ul style={{ listStyle: 'none', flex: 1, marginBottom: 28 }}>
                    {tier.features.map(f => (
                      <li key={f} className="f-body" style={{ fontSize: 13, color: 'var(--sub)', paddingLeft: 18, position: 'relative', marginBottom: 10, lineHeight: 1.5 }}>
                        <span style={{ position: 'absolute', left: 0, top: 5, color: 'var(--blue)', fontSize: 7 }}>◆</span>{f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={tier.ctaHref}
                    target={tier.ctaHref.startsWith('mailto') ? '_blank' : undefined}
                    rel={tier.ctaHref.startsWith('mailto') ? 'noopener noreferrer' : undefined}
                    className={tier.highlight ? 'btn btn-primary' : 'btn-outline-border'}
                    style={{ justifyContent: 'center', fontSize: 11, padding: '13px 24px' }}
                  >{tier.cta}</a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── SCHOLARSHIPS ────────────────────────────────────────── */}
        <section id="scholarships" style={{ background: 'var(--s1)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: 'clamp(64px,8vw,96px) clamp(16px,4vw,56px)' }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>

            <div style={{ marginBottom: 48 }}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Scholarships</div>
              <h2 className="f-display" style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: '-.03em' }}>
                Apply for a Scholarship
              </h2>
              <p className="f-body" style={{ fontSize: 14, color: 'var(--sub)', marginTop: 10, maxWidth: 600, lineHeight: 1.8 }}>
                We believe cost should never stop a talented Nigerian from accessing quality tech education.
                Fill in the form below — we review all applications 4 weeks before each cohort and
                respond to every applicant directly.
              </p>
            </div>

            {/* Info strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: 12, marginBottom: 40 }}>
              {[
                { label: 'Application', value: 'Free' },
                { label: 'Aid Available', value: 'Up to 100%' },
                { label: 'Response Time', value: 'Before each cohort' },
                { label: 'Open To', value: 'All Nigerians' },
              ].map(s => (
                <div key={s.label} style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: '16px 20px' }}>
                  <div className="f-mono" style={{ fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6 }}>{s.label}</div>
                  <div className="f-display" style={{ fontSize: 16, fontWeight: 700, color: 'var(--blue-hi)' }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* The form — client component */}
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: 'clamp(28px,4vw,40px)' }}>
              <ScholarshipForm />
            </div>

          </div>
        </section>

        {/* ─── PARTNERSHIPS ────────────────────────────────────────── */}
        <section id="partnerships" style={{ padding: 'clamp(64px,8vw,96px) clamp(16px,4vw,56px)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ marginBottom: 56 }}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Partnerships</div>
              <h2 className="f-display" style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: '-.03em' }}>
                University & Corporate Partnerships
              </h2>
              <p className="f-body" style={{ fontSize: 14, color: 'var(--sub)', marginTop: 10, maxWidth: 600, lineHeight: 1.8 }}>
                ProStack NG Academy partners with institutions and companies to deliver specialised
                tech training at scale — fully customised to your context. Click Enquire to chat with us directly.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: 20 }}>
              {PARTNERS.map(partner => (
                <div key={partner.type} style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: '36px' }}>
                  <div style={{ fontSize: 32, marginBottom: 16 }}>{partner.icon}</div>
                  <h3 className="f-display" style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-.02em', marginBottom: 12 }}>{partner.type}</h3>
                  <p className="f-body" style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.8, marginBottom: 24 }}>{partner.description}</p>
                  <div className="f-mono" style={{ fontSize: 9, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 14 }}>
                    What&apos;s Included
                  </div>
                  <ul style={{ listStyle: 'none', marginBottom: 28 }}>
                    {partner.benefits.map(b => (
                      <li key={b} className="f-body" style={{ fontSize: 13, color: 'var(--sub)', paddingLeft: 18, position: 'relative', marginBottom: 10, lineHeight: 1.5 }}>
                        <span style={{ position: 'absolute', left: 0, top: 5, color: 'var(--blue)', fontSize: 7 }}>◆</span>{b}
                      </li>
                    ))}
                  </ul>
                  {/* ✅ OpenChatButton — opens the live chat widget in-app */}
                  <OpenChatButton
                    className="btn btn-primary"
                    style={{ fontSize: 11, cursor: 'pointer', border: 'none' }}
                  >
                    Enquire via Live Chat →
                  </OpenChatButton>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CERTIFICATES ────────────────────────────────────────── */}
        <section style={{ background: 'var(--s1)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: 'clamp(64px,8vw,96px) clamp(16px,4vw,56px)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: 56, alignItems: 'center' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 20 }}>Certificates</div>
              <h2 className="f-display" style={{ fontSize: 'clamp(26px,3.5vw,40px)', fontWeight: 800, letterSpacing: '-.03em', marginBottom: 16 }}>
                ProStack NG Academy Certificates
              </h2>
              <p className="f-body" style={{ fontSize: 14, color: 'var(--sub)', lineHeight: 1.8, marginBottom: 24 }}>
                Every course completion earns you a verifiable ProStack NG Academy certificate.
                Share it on LinkedIn, include it in tender proposals, or present it during RFP submissions.
                Each certificate carries a unique verification URL employers and clients can check in real time.
              </p>
              <ul style={{ listStyle: 'none', marginBottom: 32 }}>
                {[
                  'Unique certificate ID per graduate',
                  'Publicly verifiable at verify.prostackng.com.ng',
                  'PDF download + shareable link',
                  'LinkedIn-optimised format',
                  'Issued under ProStack NG Technologies seal',
                ].map(item => (
                  <li key={item} className="f-body" style={{ fontSize: 13, color: 'var(--sub)', paddingLeft: 18, position: 'relative', marginBottom: 10 }}>
                    <span style={{ position: 'absolute', left: 0, top: 5, color: 'var(--blue)', fontSize: 7 }}>◆</span>{item}
                  </li>
                ))}
              </ul>
              <Link href="/academy/verify" className="f-display" style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--blue-hi)', textDecoration: 'none' }}>
                Verify a Certificate →
              </Link>
            </div>

            {/* Certificate mock-up */}
            <div style={{ background: 'var(--card)', border: '1px solid var(--blue-dim)', padding: '36px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'var(--blue-lo)', filter: 'blur(40px)' }} />
              <div style={{ position: 'relative', textAlign: 'center' }}>
                <div className="f-mono" style={{ fontSize: 9, letterSpacing: '.24em', textTransform: 'uppercase', color: 'var(--blue-hi)', marginBottom: 4 }}>PROSTACK NG ACADEMY</div>
                <div className="f-mono" style={{ fontSize: 9, color: 'var(--muted)', marginBottom: 28, letterSpacing: '.1em' }}>Certificate of Completion</div>
                <div className="f-display" style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-.02em', marginBottom: 8 }}>John Doe</div>
                <div className="f-body" style={{ fontSize: 13, color: 'var(--sub)', marginBottom: 20 }}>has successfully completed</div>
                <div className="f-display" style={{ fontSize: 16, fontWeight: 700, color: 'var(--blue-hi)', marginBottom: 28, lineHeight: 1.3 }}>
                  Building SaaS with Next.js + Supabase
                </div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div style={{ textAlign: 'left' }}>
                    <div className="f-display" style={{ fontSize: 12, fontWeight: 700, marginBottom: 2 }}>Mr Fubara</div>
                    <div className="f-mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.08em' }}>CEO, PROSTACK NG</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="f-mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.06em', marginBottom: 2 }}>CERT-PSA-2025-00142</div>
                    <div className="f-mono" style={{ fontSize: 9, color: 'var(--blue-hi)', letterSpacing: '.06em' }}>verify.prostackng.com.ng</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── CTA ─────────────────────────────────────────────────── */}
        <section style={{ padding: 'clamp(64px,8vw,96px) clamp(16px,4vw,56px)' }}>
          <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', padding: 'clamp(40px,5vw,64px)' }}>
              <div className="eyebrow" style={{ marginBottom: 20, justifyContent: 'center' }}>Get Started Today</div>
              <h2 className="f-display" style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 800, letterSpacing: '-.03em', marginBottom: 16 }}>Ready to Level Up?</h2>
              <p className="f-body" style={{ fontSize: 14, color: 'var(--sub)', lineHeight: 1.8, marginBottom: 32, maxWidth: 520, margin: '0 auto 32px' }}>
                All payments are processed securely in Nigerian Naira via Selar.co. No hidden fees, no dollar-rate surprises.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="#courses" className="btn btn-primary" style={{ fontSize: 12 }}>Browse Courses →</a>
                <a href="#scholarships" className="btn-outline-border">Apply for Scholarship</a>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
