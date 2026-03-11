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
      { label: '+234 705 944 9360',     href: 'tel:+2347059449360'            },
      { label: 'WhatsApp Chat',         href: 'https://wa.me/2347059449360'   },
      { label: 'Free Consultation',    href: '/contact'                    },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border">
      <div className="max-w-[1280px] mx-auto px-12 pt-20 pb-8" style={{ padding: '80px 48px 32px' }}>

        {/* Main grid */}
        <div className="grid gap-12 mb-16"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))' }}>

          {/* Brand */}
          <div style={{ maxWidth: 320 }}>
            <Link href="/" className="flex items-center gap-2.5 no-underline mb-5">
              <div className="w-8 h-8 bg-accent flex items-center justify-center font-display font-black text-[13px] text-bg">
                PS
              </div>
              <div>
                <div className="font-display font-black text-[15px] text-text leading-none">
                  ProStack<span className="text-accent">NG</span>
                </div>
                <div className="font-mono text-muted leading-none mt-0.5" style={{ fontSize: 9 }}>TECHNOLOGIES</div>
              </div>
            </Link>
            <p className="text-sub leading-relaxed mb-6" style={{ fontSize: 13.5 }}>
              Building intelligent platforms that power Africa's commerce, mobility, and digital infrastructure ecosystem.
            </p>
            {/* Socials */}
            <div className="flex gap-2">
              {['𝕏', 'in', 'ig', 'gh'].map(s => (
                <div key={s}
                  className="w-8 h-8 bg-card border border-border flex items-center justify-center text-muted text-xs cursor-pointer transition-all duration-200 hover:border-accent hover:text-accent"
                  style={{ fontSize: 12 }}>
                  {s}
                </div>
              ))}
            </div>
          </div>

          {COLS.map(col => (
            <div key={col.title}>
              <div className="font-display font-bold text-text mb-5" style={{ fontSize: 13 }}>{col.title}</div>
              {col.links.map(l => (
                <Link key={l.label} href={l.href}
                  className="block text-sub hover:text-accent transition-colors duration-200 no-underline mb-2.5"
                  style={{ fontSize: 13 }}>
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-6 flex flex-wrap justify-between items-center gap-4">
          <p className="font-mono text-muted" style={{ fontSize: 11, letterSpacing: '.06em' }}>
            © 2026 ProStack NG Technologies · Port Harcourt, Nigeria · CAC Registration Pending
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service'].map(l => (
              <span key={l} className="font-mono text-muted hover:text-accent transition-colors cursor-pointer"
                style={{ fontSize: 11 }}>{l}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

