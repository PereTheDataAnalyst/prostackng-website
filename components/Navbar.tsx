'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const LINKS = [
  { href: '/',             label: 'Home' },
  { href: '/products',     label: 'Products' },
  { href: '/technology',   label: 'Technology' },
  { href: '/case-studies', label: 'Case Studies' },
  { href: '/company',      label: 'Company' },
  { href: '/contact',      label: 'Contact' },
];

export default function Navbar() {
  const pathname   = usePathname();
  const [scrolled, setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between transition-all duration-300"
        style={{
          height: 64,
          padding: '0 48px',
          background:     scrolled ? 'rgba(5,7,9,.94)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)'       : 'none',
          borderBottom:   scrolled ? '1px solid #111D2E' : 'none',
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 no-underline group">
          <div className="w-8 h-8 bg-accent flex items-center justify-center font-display font-black text-[13px] text-bg">
            PS
          </div>
          <div>
            <div className="font-display font-black text-[15px] text-text leading-none tracking-tight">
              ProStack<span className="text-accent">NG</span>
            </div>
            <div className="font-mono text-muted leading-none mt-0.5" style={{ fontSize: 9, letterSpacing: '.15em' }}>
              TECHNOLOGIES
            </div>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {LINKS.map(l => {
            const active = pathname === l.href;
            return (
              <Link key={l.href} href={l.href}
                className="relative text-[13.5px] font-medium transition-colors duration-200 no-underline group"
                style={{ color: active ? '#E2EAF4' : '#8899AA' }}>
                {l.label}
                <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-accent transition-transform duration-200 origin-left"
                  style={{ transform: active ? 'scaleX(1)' : 'scaleX(0)' }} />
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-2.5">
          <Link href="/products"
            className="border border-borderhi text-sub hover:border-accent hover:text-accent transition-all duration-200 font-display font-semibold no-underline"
            style={{ padding: '8px 18px', fontSize: 12, letterSpacing: '.05em', textTransform: 'uppercase' }}>
            Our Products
          </Link>
          <Link href="/contact"
            className="bg-accent text-bg hover:shadow-[0_8px_30px_rgba(0,232,122,.35)] transition-all duration-200 font-display font-bold no-underline"
            style={{ padding: '8px 22px', fontSize: 12, letterSpacing: '.05em', textTransform: 'uppercase' }}>
            Work With Us
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-text bg-transparent border-none cursor-pointer text-xl"
          onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-bg z-40 flex flex-col items-center justify-center gap-6 md:hidden"
          style={{ paddingTop: 64 }}>
          {LINKS.map(l => (
            <Link key={l.href} href={l.href}
              className="font-display font-bold text-2xl text-text no-underline hover:text-accent transition-colors">
              {l.label}
            </Link>
          ))}
          <Link href="/contact"
            className="mt-4 bg-accent text-bg font-display font-bold px-10 py-4 no-underline"
            style={{ fontSize: 14, letterSpacing: '.05em', textTransform: 'uppercase' }}>
            Work With Us →
          </Link>
        </div>
      )}
    </>
  );
}
