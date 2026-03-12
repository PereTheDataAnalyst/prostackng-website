import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StatusBadge from '@/components/ui/StatusBadge';
import { PRODUCTS } from '@/lib/data';

export const metadata = { title: 'Products — ProStack NG', description: 'Six intelligent platforms built on shared infrastructure.' };

const LIVE = ['protrackng', 'nightops', 'autoreport'];

export default function ProductsPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 68 }}>

        {/* Header */}
        <div className="bg-grid" style={{
          padding: 'clamp(64px,8vw,100px) clamp(16px,4vw,56px) clamp(48px,6vw,80px)',
          backgroundSize: '52px 52px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 70% at 50% 40%, transparent 30%, var(--bg) 100%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto' }}>
            <div className="eyebrow" style={{ marginBottom: 16 }}>Product Ecosystem</div>
            <h1 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(44px,7vw,96px)', letterSpacing: '-.05em', lineHeight: .9, color: 'var(--text)', marginBottom: 20 }}>
              Our platforms.<br /><span style={{ color: 'var(--blue-hi)' }}>One mission.</span>
            </h1>
            <p style={{ fontSize: 17, color: 'var(--sub)', lineHeight: 1.85, maxWidth: 560 }}>
              Every ProStack NG product shares core infrastructure — auth, payments, notifications, and analytics. We build once. The ecosystem compounds.
            </p>
          </div>
        </div>

        {/* Products list */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(48px,6vw,80px) clamp(16px,4vw,56px) clamp(64px,8vw,120px)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--border)' }}>
            {PRODUCTS.map(p => {
              const isLive = LIVE.includes(p.id);
              return (
                <div key={p.id} id={p.id} style={{
                  background: 'var(--card)',
                  padding: 'clamp(28px,4vw,52px)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))',
                  gap: 'clamp(24px,4vw,56px)',
                  opacity: isLive ? 1 : .6,
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${p.color}, transparent)` }} />

                  {/* Identity */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 24 }}>
                      <div style={{
                        width: 52, height: 52, flexShrink: 0,
                        background: `${p.color}10`, border: `1px solid ${p.color}22`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 22, color: p.color,
                      }}>
                        {p.icon}
                      </div>
                      <div>
                        <StatusBadge status={isLive ? p.status : 'COMING_SOON'} />
                        <div className="f-display" style={{ fontWeight: 800, fontSize: 22, letterSpacing: '-.02em', color: 'var(--text)', marginTop: 8 }}>
                          {p.name}
                        </div>
                        <div className="f-mono" style={{ fontSize: 9.5, color: p.color, letterSpacing: '.1em', textTransform: 'uppercase', marginTop: 3 }}>
                          {p.tagline}
                        </div>
                      </div>
                    </div>
                    <div className="f-mono" style={{ fontSize: 9, letterSpacing: '.12em', color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase' }}>Category</div>
                    <div style={{ fontSize: 13, color: 'var(--sub)', fontWeight: 500 }}>{p.category}</div>
                  </div>

                  {/* Description */}
                  <div>
                    <div className="f-mono" style={{ fontSize: 9, letterSpacing: '.12em', color: 'var(--muted)', marginBottom: 12, textTransform: 'uppercase' }}>About</div>
                    <p style={{ fontSize: 14, color: 'var(--sub)', lineHeight: 1.8 }}>{p.desc}</p>
                  </div>

                  {/* Metrics + Stack */}
                  <div>
                    <div className="f-mono" style={{ fontSize: 9, letterSpacing: '.12em', color: 'var(--muted)', marginBottom: 12, textTransform: 'uppercase' }}>Key Metrics</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                      {p.metrics.map((m, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ color: 'var(--blue)', fontSize: 8, fontWeight: 700 }}>◆</span>
                          <span style={{ fontSize: 13.5, color: 'var(--sub)' }}>{m}</span>
                        </div>
                      ))}
                    </div>
                    <div className="f-mono" style={{ fontSize: 9, letterSpacing: '.12em', color: 'var(--muted)', marginBottom: 10, textTransform: 'uppercase' }}>Tech Stack</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {p.stack.map(t => (
                        <span key={t} className="f-mono" style={{ fontSize: 10, color: 'var(--muted)', border: '1px solid var(--border)', padding: '3px 9px' }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div style={{ borderTop: '1px solid var(--border)', padding: 'clamp(48px,6vw,80px) clamp(16px,4vw,56px)', textAlign: 'center', background: 'var(--s1)' }}>
          <h2 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(28px,4vw,52px)', letterSpacing: '-.04em', color: 'var(--text)', marginBottom: 16 }}>
            Want a demo or custom build?
          </h2>
          <p style={{ fontSize: 16, color: 'var(--sub)', marginBottom: 36 }}>
            We&apos;ll walk you through any product or scope something custom for your business.
          </p>
          <Link href="/contact" className="btn btn-primary">
            Get In Touch →
          </Link>
        </div>

      </main>
      <Footer />
    </>
  );
}
