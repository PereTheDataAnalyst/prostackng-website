'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import StackLogo from './StackLogo';

/* ─── Structure ──────────────────────────────────────────────────
   Desktop: Logo | Products ▾ | Services ▾ | Company ▾ | Pricing | Contact | Book Demo →
   Mobile:  Hamburger → Accordion sections
────────────────────────────────────────────────────────────────*/

const PRODUCTS_LINKS = [
  { href: '/products#protrackng', label: 'ProTrackNG',   sub: 'Tender Intelligence',         dot: '#06B6D4' },
  { href: '/products#autoreport', label: 'AutoReport',   sub: 'Automated Executive Reporting', dot: '#FF5757' },
  { href: '/products#nightops',   label: 'ClubOps',      sub: 'Nightlife Operating System',   dot: '#A78BFA' },
];

const SERVICES_LINKS = [
  { href: '/academy',          label: 'Academy',          sub: 'Practical tech courses in ₦',    icon: '🎓' },
  { href: '/build-with-us',    label: 'Build With Us',    sub: 'Custom SaaS development',         icon: '⚡' },
  { href: '/managed-services', label: 'Managed Services', sub: 'We run your platform',             icon: '🛡' },
  { href: '/consulting',       label: 'Consulting',       sub: 'Digital transformation roadmaps', icon: '🗺' },
  { href: '/white-label',      label: 'White Label',      sub: 'License our platforms',            icon: '🏷' },
  { href: '/docs',             label: 'API Access',       sub: 'Build on our infrastructure',      icon: '⚙️' },
];

const COMPANY_LINKS = [
  { href: '/company',      label: 'About Us'          },
  { href: '/technology',   label: 'Technology'        },
  { href: '/case-studies', label: 'Case Studies'      },
  { href: '/blog',         label: 'Blog & Insights'   },
  { href: '/media',        label: 'Media'             },
  { href: '/careers',      label: 'Careers'           },
  { href: '/investor',     label: 'Investor Relations'},
];

const MOBILE_SECTIONS = [
  {
    heading: 'Products',
    links: [
      { href: '/products#protrackng', label: 'ProTrackNG'  },
      { href: '/products#autoreport', label: 'AutoReport'  },
      { href: '/products#nightops',   label: 'ClubOps'     },
      { href: '/pricing',             label: 'Pricing'      },
    ],
  },
  {
    heading: 'Services',
    links: SERVICES_LINKS.map(l => ({ href: l.href, label: l.label })),
  },
  {
    heading: 'Company',
    links: COMPANY_LINKS,
  },
  {
    heading: 'More',
    links: [
      { href: '/contact',  label: 'Contact'      },
      { href: '/portal',   label: 'Client Portal' },
      { href: '/status',   label: 'System Status' },
      { href: '/docs',     label: 'API Docs'      },
    ],
  },
];

/* ─── Reusable dropdown wrapper ─────────────────────────────── */
function NavDropdown({
  label,
  isActive,
  children,
}: {
  label: string;
  isActive: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div
      ref={ref}
      style={{ position: 'relative' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '4px 0', display: 'flex', alignItems: 'center', gap: 4,
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontSize: 13, fontWeight: isActive ? 600 : 500,
          color: isActive ? 'var(--text)' : 'var(--sub)',
          transition: 'color .15s',
          position: 'relative',
        }}
      >
        {label}
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none"
          style={{ transition: 'transform .2s', transform: open ? 'rotate(180deg)' : 'none', opacity: .5 }}>
          <path d="M1.5 3L4.5 6L7.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {isActive && (
          <div style={{ position: 'absolute', bottom: -2, left: 0, right: 0, height: 1, background: 'var(--blue)' }} />
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 18px)',
          left: '50%', transform: 'translateX(-50%)',
          background: 'var(--s1)', border: '1px solid var(--border)',
          boxShadow: '0 20px 60px rgba(0,0,0,.6)',
          zIndex: 100,
          animation: 'fadeUp .12s ease forwards',
        }}>
          {/* Notch */}
          <div style={{
            position: 'absolute', top: -1, left: '50%',
            transform: 'translateX(-50%)',
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderBottom: '6px solid var(--border)',
          }} />
          <div style={{
            position: 'absolute', top: 0, left: '50%',
            transform: 'translateX(-50%)',
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderBottom: '5px solid var(--s1)',
          }} />
          {children}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMobileOpen(false); setOpenSection(null); }, [pathname]);

  if (pathname?.startsWith('/boardroom') || pathname?.startsWith('/virtual-office')) return null;

  const isProductsActive = ['/products', '/pricing'].some(p => pathname?.startsWith(p));
  const isServicesActive = [
    '/academy', '/build-with-us', '/managed-services',
    '/consulting', '/white-label', '/docs',
  ].some(p => pathname?.startsWith(p));
  const isCompanyActive = [
    '/company', '/technology', '/case-studies',
    '/blog', '/media', '/careers', '/investor',
  ].some(p => pathname?.startsWith(p));

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        height: 68,
        display: 'flex', alignItems: 'center',
        padding: '0 clamp(16px,4vw,56px)',
        background: scrolled ? 'rgba(4,5,10,.92)' : 'transparent',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        transition: 'background .3s, border-color .3s, backdrop-filter .3s',
      }}>

        {/* ── Logo ── */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', flexShrink: 0 }}>
          <StackLogo size={28} />
          <div>
            <div className="f-display" style={{ fontWeight: 800, fontSize: 15, letterSpacing: '-.02em', color: 'var(--text)', lineHeight: 1 }}>
              ProStack<span style={{ color: 'var(--blue-hi)' }}>NG</span>
            </div>
            <div className="f-mono" style={{ fontSize: 7.5, letterSpacing: '.22em', color: 'var(--muted)', marginTop: 2 }}>
              TECHNOLOGIES
            </div>
          </div>
        </Link>

        {/* ── Desktop nav ── */}
        <div className="hidden md:flex" style={{ gap: 24, marginLeft: 44, alignItems: 'center' }}>

          {/* Products ▾ */}
          <NavDropdown label="Products" isActive={isProductsActive}>
            <div style={{ padding: '8px 0', minWidth: 260 }}>
              {PRODUCTS_LINKS.map(l => (
                <Link key={l.href} href={l.href} style={{ textDecoration: 'none', display: 'block' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 18px', transition: 'background .15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--hi)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: l.dot, flexShrink: 0, boxShadow: `0 0 6px ${l.dot}` }} />
                    <div>
                      <div className="f-display" style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', lineHeight: 1.2 }}>{l.label}</div>
                      <div className="f-body" style={{ fontSize: 11, color: 'var(--sub)', marginTop: 2 }}>{l.sub}</div>
                    </div>
                  </div>
                </Link>
              ))}
              <div style={{ borderTop: '1px solid var(--border)', margin: '4px 0' }} />
              <Link href="/pricing" style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{ padding: '9px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'background .15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--hi)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <span className="f-mono" style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--blue-hi)' }}>
                    View Pricing →
                  </span>
                </div>
              </Link>
            </div>
          </NavDropdown>

          {/* Services ▾ */}
          <NavDropdown label="Services" isActive={isServicesActive}>
            <div style={{ padding: '8px 0', minWidth: 290 }}>
              {SERVICES_LINKS.map(l => (
                <Link key={l.href} href={l.href} style={{ textDecoration: 'none', display: 'block' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 18px', transition: 'background .15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--hi)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <div style={{
                      width: 28, height: 28, background: 'var(--blue-lo)',
                      border: '1px solid var(--border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, flexShrink: 0,
                    }}>{l.icon}</div>
                    <div>
                      <div className="f-display" style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', lineHeight: 1.2 }}>{l.label}</div>
                      <div className="f-body" style={{ fontSize: 11, color: 'var(--sub)', marginTop: 2 }}>{l.sub}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </NavDropdown>

          {/* Company ▾ */}
          <NavDropdown label="Company" isActive={isCompanyActive}>
            <div style={{ padding: '8px 0', minWidth: 200 }}>
              {COMPANY_LINKS.map(l => (
                <Link key={l.href} href={l.href} style={{ textDecoration: 'none', display: 'block' }}>
                  <div style={{ padding: '9px 18px', transition: 'background .15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--hi)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <span className="f-body" style={{ fontSize: 13, color: 'var(--sub)' }}>{l.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </NavDropdown>

          {/* Pricing — flat */}
          <Link href="/pricing" className={`nav-link${pathname === '/pricing' ? ' active' : ''}`}>
            Pricing
          </Link>

        </div>

        {/* ── Desktop CTAs ── */}
        <div className="hidden md:flex" style={{ gap: 10, marginLeft: 'auto', alignItems: 'center' }}>
          <Link href="/contact" className="nav-cta-ghost">Contact</Link>
          <Link href="/demo" className="nav-cta-solid">Book a Demo →</Link>
        </div>

        {/* ── Hamburger ── */}
        <button
          className="md:hidden"
          style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--text)', fontSize: 22, cursor: 'pointer', lineHeight: 1 }}
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Menu"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className="md:hidden" style={{
          position: 'fixed', inset: 0, zIndex: 40,
          background: 'rgba(4,5,10,.98)', backdropFilter: 'blur(24px)',
          overflowY: 'auto', paddingTop: 80, paddingBottom: 48,
        }}>
          <div style={{ padding: '0 clamp(24px,6vw,48px)' }}>

            {MOBILE_SECTIONS.map(section => (
              <div key={section.heading}>
                <button
                  onClick={() => setOpenSection(s => s === section.heading ? null : section.heading)}
                  style={{
                    width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                    padding: '14px 0',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <span className="f-mono" style={{ fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                    {section.heading}
                  </span>
                  <span style={{ color: 'var(--muted)', fontSize: 18, lineHeight: 1 }}>
                    {openSection === section.heading ? '−' : '+'}
                  </span>
                </button>
                {openSection === section.heading && (
                  <div style={{ paddingTop: 4, paddingBottom: 8 }}>
                    {section.links.map(l => (
                      <Link key={l.href} href={l.href} style={{
                        display: 'block', padding: '10px 0',
                        fontFamily: 'Syne, sans-serif', fontWeight: 700,
                        fontSize: 'clamp(18px,5vw,26px)', letterSpacing: '-.02em',
                        color: pathname === l.href ? 'var(--blue-hi)' : 'var(--text)',
                        textDecoration: 'none',
                      }}>
                        {l.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <Link href="/demo" style={{
              display: 'block', textAlign: 'center', marginTop: 32, padding: '16px',
              fontFamily: 'Syne, sans-serif', fontWeight: 700,
              fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase',
              background: 'var(--blue)', color: '#fff', textDecoration: 'none',
            }}>
              Book a Demo →
            </Link>
          </div>
        </div>
      )}

      {/* ── WhatsApp FAB ── */}
      <a href="https://wa.me/2347059449360" target="_blank" rel="noreferrer"
        style={{
          position: 'fixed', bottom: 28, left: 28, zIndex: 50,
          width: 52, height: 52, borderRadius: '50%',
          background: '#25D366', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, textDecoration: 'none',
          boxShadow: '0 4px 20px rgba(37,211,102,.35)',
          transition: 'transform .2s, box-shadow .2s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.08)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
      >
        💬
      </a>
    </>
  );
}
