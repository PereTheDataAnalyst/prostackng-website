import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: '404 — Page Not Found · ProStack NG',
  description: 'This page does not exist.',
};

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 68 }}>
        <div
          className="bg-grid"
          style={{
            minHeight: 'calc(100vh - 68px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(48px,8vw,96px) clamp(16px,4vw,56px)',
            backgroundSize: '52px 52px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 50%, transparent 40%, var(--bg) 100%)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', textAlign: 'center', maxWidth: 560 }}>

            {/* Large 404 */}
            <div
              className="f-display"
              style={{
                fontWeight: 800,
                fontSize: 'clamp(96px,18vw,180px)',
                letterSpacing: '-.05em',
                lineHeight: 1,
                color: 'transparent',
                WebkitTextStroke: '1.5px rgba(37,99,235,.2)',
                marginBottom: 8,
                userSelect: 'none',
              }}
            >
              404
            </div>

            {/* Eyebrow */}
            <div className="eyebrow" style={{ justifyContent: 'center', marginBottom: 16 }}>
              Page Not Found
            </div>

            {/* Headline */}
            <h1
              className="f-display"
              style={{
                fontWeight: 800,
                fontSize: 'clamp(24px,4vw,40px)',
                letterSpacing: '-.04em',
                color: 'var(--text)',
                lineHeight: 1.1,
                marginBottom: 16,
              }}
            >
              This page doesn&apos;t exist.
            </h1>

            <p style={{ fontSize: 15, color: 'var(--sub)', lineHeight: 1.8, marginBottom: 36 }}>
              The URL may have changed, or this page was never here to begin with.
              Either way — here&apos;s where you probably want to go.
            </p>

            {/* Quick nav */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 1,
              background: 'var(--border)',
              border: '1px solid var(--border)',
              marginBottom: 32,
              textAlign: 'left',
            }}>
              {[
                { href: '/',            label: 'Home',             icon: '◎' },
                { href: '/products',    label: 'Products',         icon: '▦' },
                { href: '/pricing',     label: 'Pricing',          icon: '◈' },
                { href: '/demo',        label: 'Book a Demo',      icon: '⬡' },
                { href: '/blog',        label: 'Blog',             icon: '⟁' },
                { href: '/contact',     label: 'Contact',          icon: '◑' },
              ].map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '16px 20px',
                    background: 'var(--card)',
                    textDecoration: 'none',
                    transition: 'background .15s',
                  }}
                >
                  <span style={{ color: 'var(--blue)', fontSize: 14, flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: 600 }}>{item.label}</span>
                  <span style={{ marginLeft: 'auto', color: 'var(--muted)', fontSize: 12 }}>→</span>
                </Link>
              ))}
            </div>

            <Link href="/" className="btn btn-primary">
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
