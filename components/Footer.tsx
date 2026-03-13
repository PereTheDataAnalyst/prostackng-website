import Link from 'next/link';
import StackLogo from './StackLogo';

const COLS = [
  {
    title: 'Products',
    links: [
      { label: 'ProTrackNG',  href: '/products#protrackng'  },
      { label: 'NightOps',    href: '/products#nightops'    },
      { label: 'AutoReport',  href: '/products#autoreport'  },
      { label: 'MyHarriet',   href: '/products#myharriet'   },
      { label: 'SwiftRide',   href: '/products#swiftride'   },
      { label: 'StakeX',      href: '/products#stakex'      },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us',           href: '/company'      },
      { label: 'Technology',         href: '/technology'   },
      { label: 'Case Studies',       href: '/case-studies' },
      { label: 'Testimonials',       href: '/testimonials' },
      { label: 'Blog & Insights',    href: '/blog'         },
      { label: 'Press & Media',      href: '/press'        },
      { label: 'Investor Relations', href: '/investor'     },
      { label: 'Careers',            href: '/careers'      },
    ],
  },
  {
    title: 'Connect',
    links: [
      { label: 'contact@prostackng.com.ng',      href: 'mailto:contact@prostackng.com.ng'    },
      { label: 'WhatsApp: +234 705 944 9360', href: 'https://wa.me/2347059449360'      },
      { label: 'Book a Free Demo',            href: '/demo'                            },
      { label: 'Pricing',                     href: '/pricing'                         },
      { label: 'Client Portal',               href: '/portal'                          },
      { label: 'Public Metrics',              href: '/metrics'                         },
      { label: 'Boardroom (Staff)',            href: '/boardroom'                       },
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
              {['𝕏', 'in', 'ig', 'gh'].map(s => (
                <div key={s} style={{
                  width: 30, height: 30,
                  border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, color: 'var(--muted)',
                  cursor: 'pointer',
                  transition: 'border-color .2s, color .2s',
                }}>
                  {s}
                </div>
              ))}
            </div>
          </div>

          {COLS.map(col => (
            <div key={col.title}>
              <div className="f-display" style={{ fontWeight: 700, fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text)', marginBottom: 20 }}>
                {col.title}
              </div>
              {col.links.map(l => (
                <Link key={l.label} href={l.href} className="footer-link">
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <p className="f-mono" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '.08em' }}>
            © 2026 ProStack NG Technologies Ltd · Port Harcourt, Nigeria · CAC Registration Pending
          </p>
          <div style={{ display: 'flex', gap: 24 }}>
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
