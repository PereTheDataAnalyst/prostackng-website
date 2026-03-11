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

  // Don't render on boardroom
  if (pathname?.startsWith('/boardroom')) return null;

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between transition-all duration-300"
        style={{
          height: 68,
          padding: '0 clamp(16px, 4vw, 56px)',
          background:     scrolled ? 'rgba(5,5,7,.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px)' : 'none',
          borderBottom:   scrolled ? '1px solid var(--border)' : 'none',
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 no-underline group">
          <div
            className="flex items-center justify-center font-display font-black text-bg transition-all duration-300"
            style={{ width: 34, height: 34, background: 'var(--accent)', fontSize: 12, letterSpacing: '.05em' }}
          >
            PS
          </div>
          <div>
            <div className="font-display font-black text-text leading-none" style={{ fontSize: 15, letterSpacing: '-.02em' }}>
              ProStack<span style={{ color: 'var(--accent)' }}>NG</span>
            </div>
            <div className="font-mono text-muted leading-none mt-0.5" style={{ fontSize: 8, letterSpacing: '.2em' }}>
              TECHNOLOGIES
            </div>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {LINKS.map(l => {
            const active = pathname === l.href;
            return (
              <Link key={l.href} href={l.href}
                className="relative font-body transition-colors duration-200 no-underline"
                style={{ fontSize: 14, fontWeight: 500, color: active ? 'var(--text)' : 'var(--sub)' }}>
                {l.label}
                <span
                  className="absolute -bottom-0.5 left-0 right-0 h-px transition-transform duration-300 origin-left"
                  style={{ background: 'var(--accent)', transform: active ? 'scaleX(1)' : 'scaleX(0)' }}>
                />
              </Link>
            );
          })}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/products"
            className="font-display font-semibold no-underline transition-all duration-200"
            style={{
              padding: '8px 18px', fontSize: 11,
              letterSpacing: '.06em', textTransform: 'uppercase',
              border: '1px solid var(--borderhi)', color: 'var(--sub)',
            }}>
            Our Products
          </Link>
          <Link href="/contact"
            className="font-display font-bold no-underline transition-all duration-200"
            style={{
              padding: '8px 22px', fontSize: 11,
              letterSpacing: '.06em', textTransform: 'uppercase',
              background: 'var(--accent)', color: '#fff',
            }}>
            Work With Us
          </Link>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden text-text bg-transparent border-none cursor-pointer"
          style={{ fontSize: 20 }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-7 md:hidden"
          style={{ background: 'rgba(5,5,7,.98)', backdropFilter: 'blur(20px)', paddingTop: 68 }}
        >
          {LINKS.map(l => (
            <Link key={l.href} href={l.href}
              className="font-display font-bold text-text no-underline transition-colors duration-200"
              style={{ fontSize: 28, letterSpacing: '-.02em' }}>
              {l.label}
            </Link>
          ))}
          <Link href="/contact"
            className="font-display font-bold no-underline mt-4"
            style={{
              padding: '14px 48px', fontSize: 13,
              letterSpacing: '.06em', textTransform: 'uppercase',
              background: 'var(--accent)', color: '#fff',
            }}>
            Work With Us →
          </Link>
        </div>
      )}

      {/* WhatsApp FAB */}
      <a
        href="https://wa.me/2347059449360"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 no-underline flex items-center justify-center text-2xl"
        style={{
          width: 54, height: 54,
          borderRadius: '50%',
          background: '#25D366',
          boxShadow: '0 4px 24px rgba(37,211,102,.4)',
        }}
      >
        💬
      </a>
    </>
  );
}
