'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import StackLogo from './StackLogo';

const LINKS = [
  { href: '/products',     label: 'Products'     },
  { href: '/technology',   label: 'Technology'   },
  { href: '/case-studies', label: 'Case Studies' },
  { href: '/media',        label: 'Media'        },
  { href: '/pricing',      label: 'Pricing'      },
  { href: '/company',      label: 'Company'      },
  { href: '/contact',      label: 'Contact'      },
  { href: '/academy',      label: 'Our Programmes' },
  { href: '/build-with-us', label: 'Build With Us'  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  if (pathname?.startsWith('/boardroom')) return null;

  const navBg = scrolled
    ? 'rgba(4,5,10,.92)'
    : 'transparent';
  const navBorder = scrolled
    ? '1px solid var(--border)'
    : '1px solid transparent';

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        height: 68,
        display: 'flex', alignItems: 'center',
        padding: '0 clamp(16px,4vw,56px)',
        background: navBg,
        borderBottom: navBorder,
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        transition: 'background .3s, border-color .3s, backdrop-filter .3s',
      }}>

        {/* Logo */}
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

        {/* Desktop nav links */}
        <div className="hidden md:flex" style={{ gap: 32, marginLeft: 48 }}>
          {LINKS.map(l => (
            <Link key={l.href} href={l.href} className={`nav-link${pathname === l.href ? ' active' : ''}`}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex" style={{ gap: 10, marginLeft: 'auto' }}>
          <Link href="/pricing" className="nav-cta-ghost">Pricing</Link>
          <Link href="/demo" className="nav-cta-solid">Book a Demo →</Link>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden"
          style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--text)', fontSize: 22, cursor: 'pointer', lineHeight: 1 }}
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Menu"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden" style={{
          position: 'fixed', inset: 0, zIndex: 40,
          background: 'rgba(4,5,10,.97)', backdropFilter: 'blur(24px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <div style={{ marginBottom: 40, opacity: .4 }}>
            <StackLogo size={48} />
          </div>
          {LINKS.map(l => (
            <Link key={l.href} href={l.href} style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 700,
              fontSize: 'clamp(28px,7vw,44px)',
              letterSpacing: '-.03em',
              color: pathname === l.href ? 'var(--blue-hi)' : 'var(--text)',
              textDecoration: 'none',
              padding: '10px 0',
            }}>
              {l.label}
            </Link>
          ))}
          <Link href="/demo" style={{
            marginTop: 28, fontFamily: 'Syne, sans-serif', fontWeight: 700,
            fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase',
            background: 'var(--blue)', color: '#fff',
            padding: '14px 48px', textDecoration: 'none',
          }}>
            Book a Demo →
          </Link>
        </div>
      )}

      {/* WhatsApp FAB — left side to avoid chat widget conflict */}
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
