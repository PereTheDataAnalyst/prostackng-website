'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const LINKS = [
  { href: '/products',     label: 'Products'     },
  { href: '/technology',   label: 'Technology'   },
  { href: '/case-studies', label: 'Case Studies' },
  { href: '/company',      label: 'Company'      },
  { href: '/contact',      label: 'Contact'      },
];

export default function Navbar() {
  const pathname                    = usePathname();
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  if (pathname?.startsWith('/boardroom')) return null;

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
        style={{
          height: 68,
          padding: '0 clamp(16px, 4vw, 56px)',
          background:     scrolled ? 'rgba(5,5,7,.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px)'       : 'none',
          borderBottom:   scrolled ? '1px solid var(--border)' : 'none',
          transition: 'background .3s, border-color .3s',
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <div style={{
            width: 34, height: 34, background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 12,
            color: '#fff', letterSpacing: '.05em', flexShrink: 0,
          }}>
            PS
          </div>
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 15, letterSpacing: '-.02em', color: 'var(--text)', lineHeight: 1 }}>
              ProStack<span style={{ color: 'var(--accent)' }}>NG</span>
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, letterSpacing: '.2em', color: 'var(--muted)', lineHeight: 1, marginTop: 2 }}>
              TECHNOLOGIES
            </div>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex" style={{ gap: 32 }}>
          {LINKS.map(l => {
            const active = pathname === l.href;
            return (
              <Link key={l.href} href={l.href} style={{
                fontFamily: 'Instrument Sans, sans-serif',
                fontSize: 14, fontWeight: 500,
                color: active ? 'var(--text)' : 'var(--sub)',
                textDecoration: 'none',
                position: 'relative',
                paddingBottom: 2,
              }}>
                {l.label}
                <span style={{
                  position: 'absolute', bottom: -2, left: 0, right: 0, height: 1,
                  background: 'var(--accent)',
                  transform: active ? 'scaleX(1)' : 'scaleX(0)',
                  transformOrigin: 'left',
                  transition: 'transform .25s',
                }} />
              </Link>
            );
          })}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex" style={{ gap: 10 }}>
          <Link href="/products" className="nav-ghost-btn" style={{
            padding: '8px 18px', fontSize: 11,
            letterSpacing: '.06em', textTransform: 'uppercase',
            fontFamily: 'Syne, sans-serif', fontWeight: 600,
            textDecoration: 'none', display: 'inline-block',
          }}>
            Our Products
          </Link>
          <Link href="/contact" style={{
            padding: '8px 22px', fontSize: 11,
            letterSpacing: '.06em', textTransform: 'uppercase',
            fontFamily: 'Syne, sans-serif', fontWeight: 700,
            background: 'var(--accent)', color: '#fff',
            textDecoration: 'none', display: 'inline-block',
          }}>
            Work With Us
          </Link>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden"
          style={{ background: 'none', border: 'none', color: 'var(--text)', fontSize: 20, cursor: 'pointer' }}
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden" style={{
          position: 'fixed', inset: 0, zIndex: 40,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28,
          background: 'rgba(5,5,7,.98)', backdropFilter: 'blur(20px)', paddingTop: 68,
        }}>
          {LINKS.map(l => (
            <Link key={l.href} href={l.href} style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 28,
              letterSpacing: '-.02em', color: 'var(--text)', textDecoration: 'none',
            }}>
              {l.label}
            </Link>
          ))}
          <Link href="/contact" style={{
            marginTop: 16, padding: '14px 48px', fontSize: 13,
            letterSpacing: '.06em', textTransform: 'uppercase',
            fontFamily: 'Syne, sans-serif', fontWeight: 700,
            background: 'var(--accent)', color: '#fff', textDecoration: 'none',
          }}>
            Work With Us
          </Link>
        </div>
      )}

      {/* WhatsApp FAB */}
      <a
        href="https://wa.me/2347059449360"
        target="_blank"
        rel="noreferrer"
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 50,
          width: 54, height: 54, borderRadius: '50%',
          background: '#25D366', boxShadow: '0 4px 24px rgba(37,211,102,.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24, textDecoration: 'none',
        }}
      >
        💬
      </a>
    </>
  );
}
