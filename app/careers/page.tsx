import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Careers — ProStack NG',
  description: 'Build Africa\'s digital infrastructure. Join ProStack NG in Port Harcourt.',
};

const ROLES = [
  {
    title: 'Senior Full-Stack Engineer',
    type: 'Full-time',
    location: 'Port Harcourt (Hybrid)',
    product: 'Platform',
    productColor: '#2563EB',
    urgent: true,
    desc: 'Own the architecture of multiple products on our shared Next.js + Supabase platform. You\'ll build features across AutoReport, ProTrackNG, and NightOps.',
    stack: ['Next.js 14', 'TypeScript', 'Supabase', 'PostgreSQL', 'Tailwind'],
    requirements: [
      '3+ years production Next.js experience',
      'Strong PostgreSQL and Supabase knowledge',
      'Experience shipping to production without hand-holding',
      'Based in or willing to relocate to Port Harcourt',
    ],
  },
  {
    title: 'Product Designer (UI/UX)',
    type: 'Full-time',
    location: 'Port Harcourt / Remote',
    product: 'Design',
    productColor: '#A78BFA',
    urgent: false,
    desc: 'Design the interfaces that Nigerian businesses use every day. You\'ll work across all six platforms, maintaining a tight design system while shipping fast.',
    stack: ['Figma', 'Framer', 'Tailwind', 'React'],
    requirements: [
      'Portfolio of production SaaS or dashboard UI work',
      'Strong design systems thinking',
      'Comfortable working directly in code (Tailwind/React)',
      'Attention to detail that borders on obsessive',
    ],
  },
  {
    title: 'Business Development Manager',
    type: 'Full-time',
    location: 'Port Harcourt / Lagos',
    product: 'Growth',
    productColor: '#06B6D4',
    urgent: true,
    desc: 'Own enterprise client acquisition for AutoReport and ProTrackNG. You\'ll run demo calls, negotiate contracts, and close oil & gas and procurement-heavy businesses.',
    stack: ['CRM', 'WhatsApp Business', 'Demo delivery', 'Proposal writing'],
    requirements: [
      'Proven B2B sales track record in Nigeria',
      'Network in oil & gas, logistics, or procurement',
      'Comfortable selling ₦85K–₦500K/month solutions',
      'Hunter mentality — you find your own leads',
    ],
  },
  {
    title: 'NightOps Onboarding Specialist',
    type: 'Contract',
    location: 'Port Harcourt',
    product: 'NightOps',
    productColor: '#A78BFA',
    urgent: false,
    desc: 'Help nightlife venues go live on NightOps. You\'ll handle setup, training, and the first 30 days of client support for each new venue we onboard.',
    stack: ['NightOps platform', 'Client training', 'WhatsApp support'],
    requirements: [
      'Experience in hospitality or nightlife operations',
      'Strong people skills and patience',
      'Comfortable working evening/weekend hours',
      'Port Harcourt-based',
    ],
  },
];

const VALUES = [
  { icon: '◆', title: 'Ship first, perfect second', desc: 'We launch fast and iterate in production. If you need 3 months to "perfect" something before it goes live, this isn\'t the place.' },
  { icon: '◎', title: 'Own your work end to end', desc: 'No handoffs. You design it, you build it, you deploy it, you support it. Total ownership — total credit.' },
  { icon: '▦', title: 'Africa-first thinking', desc: 'Every decision starts with "does this work for a Nigerian business in 2024?" Not Silicon Valley playbooks applied to Lagos.' },
  { icon: '◈', title: 'Honest over comfortable', desc: 'We say what we mean in meetings. No office politics, no hierarchical nonsense. Good ideas win regardless of who has them.' },
];

export default function CareersPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 68 }}>

        {/* Header */}
        <div className="bg-grid" style={{ padding: 'clamp(56px,7vw,96px) clamp(16px,4vw,56px) clamp(40px,5vw,64px)', backgroundSize: '52px 52px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 40%, transparent 30%, var(--bg) 100%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto' }}>
            <div className="eyebrow" style={{ marginBottom: 14 }}>Careers</div>
            <h1 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(44px,7vw,96px)', letterSpacing: '-.05em', lineHeight: .9, color: 'var(--text)', marginBottom: 18 }}>
              Build the future.<br /><span style={{ color: 'var(--blue-hi)' }}>From PH.</span>
            </h1>
            <p style={{ fontSize: 16, color: 'var(--sub)', lineHeight: 1.85, maxWidth: 520 }}>
              We&apos;re a small team building big infrastructure. Every hire directly shapes the products that Nigerian businesses run on.
            </p>
          </div>
        </div>

        {/* Values */}
        <div style={{ background: 'var(--s1)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(40px,5vw,64px) clamp(16px,4vw,56px)' }}>
            <div className="eyebrow" style={{ marginBottom: 24 }}>How We Work</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
              {VALUES.map(v => (
                <div key={v.title} style={{ background: 'var(--card)', padding: '28px 24px' }}>
                  <div style={{ fontSize: 20, color: 'var(--blue)', marginBottom: 14 }}>{v.icon}</div>
                  <div className="f-display" style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', marginBottom: 8 }}>{v.title}</div>
                  <p style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.75 }}>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Roles */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(48px,6vw,80px) clamp(16px,4vw,56px)' }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Open Roles</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36, flexWrap: 'wrap', gap: 12 }}>
            <h2 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(26px,3.5vw,44px)', letterSpacing: '-.04em', color: 'var(--text)', lineHeight: 1 }}>
              {ROLES.length} open positions.
            </h2>
            <span className="f-mono" style={{ fontSize: 9.5, color: 'var(--muted)', letterSpacing: '.1em', textTransform: 'uppercase' }}>
              Port Harcourt, Nigeria
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', marginBottom: 48 }}>
            {ROLES.map(role => (
              <div key={role.title} style={{ background: 'var(--card)', padding: 'clamp(24px,3vw,36px)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 2, background: role.productColor }} />
                <div style={{ paddingLeft: 20 }}>
                  {/* Header row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                        <h3 className="f-display" style={{ fontWeight: 800, fontSize: 18, color: 'var(--text)', letterSpacing: '-.02em' }}>{role.title}</h3>
                        {role.urgent && (
                          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, letterSpacing: '.14em', textTransform: 'uppercase', background: 'rgba(255,87,87,.1)', border: '1px solid rgba(255,87,87,.3)', color: '#FF5757', padding: '2px 8px' }}>
                            Urgent
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        {[role.type, role.location].map(tag => (
                          <span key={tag} className="f-mono" style={{ fontSize: 9.5, letterSpacing: '.1em', color: 'var(--muted)', background: 'var(--s2)', border: '1px solid var(--border)', padding: '2px 9px', textTransform: 'uppercase' }}>
                            {tag}
                          </span>
                        ))}
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, letterSpacing: '.1em', textTransform: 'uppercase', background: `${role.productColor}10`, border: `1px solid ${role.productColor}25`, color: role.productColor, padding: '2px 9px' }}>
                          {role.product}
                        </span>
                      </div>
                    </div>
                    <Link href={`/contact?role=${encodeURIComponent(role.title)}`} className="btn btn-ghost btn-sm" style={{ flexShrink: 0 }}>
                      Apply →
                    </Link>
                  </div>

                  {/* Description */}
                  <p style={{ fontSize: 14, color: 'var(--sub)', lineHeight: 1.8, marginBottom: 20 }}>{role.desc}</p>

                  {/* Requirements + Stack in two cols */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 24 }}>
                    <div>
                      <div className="f-mono" style={{ fontSize: 9, letterSpacing: '.14em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 10 }}>Requirements</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                        {role.requirements.map(r => (
                          <div key={r} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                            <span style={{ color: 'var(--blue)', fontSize: 7, marginTop: 5, flexShrink: 0 }}>◆</span>
                            <span style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.55 }}>{r}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="f-mono" style={{ fontSize: 9, letterSpacing: '.14em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 10 }}>Stack / Tools</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {role.stack.map(s => (
                          <span key={s} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '.06em', color: role.productColor, background: `${role.productColor}08`, border: `1px solid ${role.productColor}25`, padding: '3px 10px' }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No role? */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: 'clamp(24px,4vw,44px)', display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div className="f-display" style={{ fontWeight: 800, fontSize: 20, color: 'var(--text)', marginBottom: 8 }}>Don&apos;t see your role?</div>
              <p style={{ fontSize: 14, color: 'var(--sub)', lineHeight: 1.75, maxWidth: 440 }}>
                We hire for character and capability first. If you&apos;re exceptional at something and believe in what we&apos;re building, reach out anyway.
              </p>
            </div>
            <a href="mailto:contact@prostackng.com.ng?subject=Open Application" className="btn btn-ghost">Send Open Application →</a>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
