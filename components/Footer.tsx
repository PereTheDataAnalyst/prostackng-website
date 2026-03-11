import Link from 'next/link';

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
      { label: 'About Us',      href: '/company'      },
      { label: 'Technology',    href: '/technology'   },
      { label: 'Case Studies',  href: '/case-studies' },
      { label: 'Blog',          href: '#'             },
      { label: 'Careers',       href: '#'             },
    ],
  },
  {
    title: 'Connect',
    links: [
      { label: 'contact@prostackng.com', href: 'mailto:contact@prostackng.com' },
      { label: 'WhatsApp Chat',          href: 'https://wa.me/2347059449360'   },
      { label: 'Free Consultation',      href: '/contact'                      },
    ],
  },
];

export default function Footer() {
  return (
    <footer style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(60px,7vw,100px) clamp(16px,4vw,56px) 40px' }}>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 48, marginBottom: 56 }}>

          {/* Brand */}
          <div style={{ maxWidth: 300 }}>
            <Link href="/" className="flex items-center gap-3 no-underline mb-5">
              <div
                className="font-display font-black flex items-center justify-center"
                style={{ width: 34, height: 34, background: 'var(--accent)', fontSize: 12, color: '#fff', letterSpacing: '.05em' }}
              >
                PS
              </div>
              <div>
                <div className="font-display font-black text-text leading-none" style={{ fontSize: 15 }}>
                  ProStack<span style={{ color: 'var(--accent)' }}>NG</span>
                </div>
                <div className="font-mono text-muted leading-none mt-0.5" style={{ fontSize: 8, letterSpacing: '.2em' }}>TECHNOLOGIES</div>
              </div>
            </Link>
            <p className="text-sub leading-relaxed mb-6" style={{ fontSize: 13 }}>
              Building intelligent platforms that power Africa's commerce, mobility, and digital infrastructure ecosystem.
            </p>
            <div className="flex gap-2">
              {['𝕏', 'in', 'ig', 'gh'].map(s => (
                <div key={s}
                  className="flex items-center justify-center text-muted cursor-pointer transition-all duration-200"
                  style={{
                    width: 30, height: 30,
                    border: '1px solid var(--border)',
                    fontSize: 11,
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--muted)'; }}
                >
                  {s}
                </div>
              ))}
            </div>
          </div>

          {COLS.map(col => (
            <div key={col.title}>
              <div className="font-display font-bold text-text mb-5" style={{ fontSize: 12, letterSpacing: '.06em', textTransform: 'uppercase' }}>
                {col.title}
              </div>
              {col.links.map(l => (
                <Link key={l.label} href={l.href}
                  className="block text-sub no-underline mb-2.5 transition-colors duration-200"
                  style={{ fontSize: 13 }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--sub)'; }}>
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-wrap justify-between items-center gap-4"
          style={{ borderTop: '1px solid var(--border)', paddingTop: 28 }}
        >
          <p className="font-mono text-muted" style={{ fontSize: 11, letterSpacing: '.06em' }}>
            © 2026 ProStack NG Technologies · Port Harcourt, Nigeria · CAC Registration Pending
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service'].map(l => (
              <span key={l} className="font-mono text-muted cursor-pointer transition-colors duration-200"
                style={{ fontSize: 11 }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--muted)'; }}>
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
