'use client';
import Link from 'next/link';
import PwaInstallButton from './PwaInstallButton';
import StackLogo from './StackLogo';

const COLS = [
  {
    title: 'Products',
    links: [
      { label: 'ProTrackNG',  href: '/products#protrackng',  ready: true  },
      { label: 'NightOps',    href: '/products#nightops',    ready: true  },
      { label: 'AutoReport',  href: '/products#autoreport',  ready: true  },
      { label: 'MyHarriet',   href: '/products#myharriet',   ready: false },
      { label: 'SwiftRide',   href: '/products#swiftride',   ready: false },
      { label: 'StakeX',      href: '/products#stakex',      ready: false },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us',           href: '/company',      ready: true  },
      { label: 'Technology',         href: '/technology',   ready: true  },
      { label: 'Case Studies',       href: '/case-studies', ready: true  },
      { label: 'Testimonials',       href: '/testimonials', ready: true  },
      { label: 'Blog & Insights',    href: '/blog',         ready: true  },
      { label: 'Press & Media',      href: '/press',        ready: true  },
      { label: 'Investor Relations', href: '/investor',     ready: true  },
      { label: 'Careers',            href: '/careers',      ready: true  },
      { label: 'Academy',            href: '/academy',      ready: true  },
      { label: 'Managed Services',    href: '/managed-services', ready: true  },
      { label: 'Build With Us',        href: '/build-with-us',    ready: true  },
      { label: 'Consulting',            href: '/consulting',       ready: true  },
      { label: 'White Label',          href: '/white-label',      ready: true  },
    ],
  },
  {
    title: 'Connect',
    links: [
      { label: 'contact@prostackng.com.ng', href: 'mailto:contact@prostackng.com.ng', ready: true },
      { label: 'WhatsApp: +234 705 944 9360', href: 'https://wa.me/2347059449360',    ready: true },
      { label: 'Make a Payment',              href: '/payment',                        ready: true  },
      { label: 'Book a Free Demo',            href: '/demo',                           ready: true },
      { label: 'Pricing',                     href: '/pricing',                        ready: true },
      { label: 'Client Portal',               href: '/portal',                         ready: true },
      { label: 'Public Metrics',              href: '/metrics',                        ready: true },
      { label: 'Boardroom (Staff)',            href: '/boardroom',                      ready: true },
      { label: 'System Status',                href: '/status',                         ready: true },
      { label: 'API Docs',                     href: '/docs',                           ready: true  },
      { label: 'Verify Certificate',             href: '/academy/verify',                 ready: true  },
    ],
  },
];

export default function Footer() {
  return (
    <footer style={{ background: 'var(--s1)', borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(56px,7vw,96px) clamp(16px,4vw,56px) 40px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: 48, marginBottom: 56 }}>

          {/* Brand */}
          <div style={{ maxWidth: 280 }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', marginBottom: 20 }}>
              <StackLogo size={32} />
              <div>
                <div className="f-display" style={{ fontWeight: 800, fontSize: 15, letterSpacing: '-.02em', color: 'var(--text)', lineHeight: 1 }}>
                  ProStack<span style={{ color: 'var(--blue-hi)' }}>NG</span>
                </div>
                <div className="f-mono" style={{ fontSize: 7.5, letterSpacing: '.2em', color: 'var(--muted)', marginTop: 2 }}>
                  TECHNOLOGIES
                </div>
              </div>
            </Link>
            <p style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.8, marginBottom: 24 }}>
              Building intelligent platforms that power Africa's commerce, mobility, and digital infrastructure.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { label: '𝕏',  href: 'https://x.com/ProStackNG',                   title: 'Follow us on X' },
                { label: 'in', href: 'https://www.linkedin.com/company/prostackng', title: 'Connect on LinkedIn' },
                { label: '▶',  href: 'https://www.youtube.com/@ProStackNG',         title: 'Subscribe on YouTube' },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" title={s.title}
                  className="social-icon-btn"
                  style={{
                    width: 32, height: 32,
                    border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, color: 'var(--muted)',
                    textDecoration: 'none',
                    transition: 'border-color .2s, color .2s',
                  }}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {COLS.map(col => (
            <div key={col.title}>
              <div className="f-display" style={{ fontWeight: 700, fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text)', marginBottom: 20 }}>
                {col.title}
              </div>
              {col.links.map(l => (
                l.ready ? (
                  <Link key={l.label} href={l.href} className="footer-link">
                    {l.label}
                  </Link>
                ) : (
                  <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <span className="footer-link" style={{ color: 'var(--muted)', cursor: 'default', opacity: 0.5, pointerEvents: 'none' }}>
                      {l.label}
                    </span>
                    <span style={{
                      fontSize: 8,
                      fontFamily: 'monospace',
                      letterSpacing: '.06em',
                      textTransform: 'uppercase',
                      color: 'var(--blue-hi)',
                      border: '1px solid var(--blue-hi)',
                      borderRadius: 3,
                      padding: '1px 4px',
                      opacity: 0.6,
                      lineHeight: 1.4,
                    }}>
                      Soon
                    </span>
                  </div>
                )
              ))}
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <p className="f-mono" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '.08em' }}>
            © 2026 ProStack NG Technologies Ltd · Port Harcourt, Nigeria
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <PwaInstallButton variant="footer" />
            {['Privacy Policy', 'Terms of Service'].map(l => (
              <span key={l} className="f-mono" style={{ fontSize: 10, color: 'var(--muted)', cursor: 'pointer', letterSpacing: '.06em' }}>
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
