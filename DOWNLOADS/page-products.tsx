import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StatusBadge from '@/components/ui/StatusBadge';
import { PRODUCTS } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Products',
  description: 'Six intelligent platforms built on one shared infrastructure — ProTrackNG, NightOps, AutoReport, MyHarriet, SwiftRide, StakeX.',
};

const LIVE_IDS = ['protrackng', 'nightops', 'autoreport'];

export default function ProductsPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 68 }}>

        {/* Header */}
        <div
          className="relative overflow-hidden bg-grid"
          style={{ padding: 'clamp(60px,8vw,120px) clamp(16px,4vw,56px) clamp(40px,5vw,80px)', backgroundSize: '56px 56px' }}
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 40%, transparent 30%, var(--bg) 100%)' }} />
          <div className="absolute pointer-events-none"
            style={{ top: '-20%', left: '-10%', width: 600, height: 600, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(139,92,246,.1) 0%, transparent 65%)' }} />
          <div className="relative" style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div className="section-label">Product Ecosystem</div>
            <h1 className="font-display font-black text-text" style={{ fontSize: 'clamp(40px,6vw,84px)', letterSpacing: '-.04em', lineHeight: .95, marginBottom: 20 }}>
              Our platforms.<br /><span style={{ color: 'var(--accent)' }}>One mission.</span>
            </h1>
            <p className="text-sub" style={{ fontSize: 17, lineHeight: 1.9, maxWidth: 540 }}>
              Every ProStack NG product shares core infrastructure — auth, payments, notifications, and analytics. We build once. The ecosystem compounds.
            </p>
          </div>
        </div>

        {/* Products list */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(40px,5vw,80px) clamp(16px,4vw,56px) clamp(60px,8vw,120px)' }}>
          <div className="flex flex-col" style={{ gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
            {PRODUCTS.map((p) => {
              const isLive = LIVE_IDS.includes(p.id);
              return (
                <div
                  key={p.id}
                  id={p.id}
                  className="relative overflow-hidden hover-surface"
                  style={{
                    background: 'var(--card)',
                    padding: 'clamp(28px,4vw,52px)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
                    gap: 'clamp(24px,4vw,56px)',
                    opacity: isLive ? 1 : .6,
                  }}
                >
                  {/* Top accent */}
                  <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: p.color }} />

                  {/* Identity */}
                  <div>
                    <div className="flex items-start gap-4 mb-6">
                      <div
                        className="flex items-center justify-center font-display font-bold text-2xl border"
                        style={{ width: 56, height: 56, flexShrink: 0, background: `${p.color}10`, borderColor: `${p.color}22`, color: p.color }}
                      >
                        {p.icon}
                      </div>
                      <div>
                        <StatusBadge status={isLive ? p.status : 'COMING_SOON'} />
                        <div className="font-display font-black text-text mt-2" style={{ fontSize: 24 }}>{p.name}</div>
                        <div className="font-mono mt-1" style={{ color: p.color, fontSize: 10.5, letterSpacing: '.1em', textTransform: 'uppercase' }}>{p.tagline}</div>
                      </div>
                    </div>
                    <div className="font-mono text-muted mb-1.5" style={{ fontSize: 9.5, letterSpacing: '.12em' }}>CATEGORY</div>
                    <div className="text-sub font-medium" style={{ fontSize: 13.5 }}>{p.category}</div>
                  </div>

                  {/* Description */}
                  <div>
                    <div className="font-mono text-muted mb-3" style={{ fontSize: 9.5, letterSpacing: '.12em' }}>ABOUT</div>
                    <p className="text-sub leading-relaxed" style={{ fontSize: 14 }}>{p.desc}</p>
                  </div>

                  {/* Metrics + Stack */}
                  <div>
                    <div className="font-mono text-muted mb-3" style={{ fontSize: 9.5, letterSpacing: '.12em' }}>KEY METRICS</div>
                    <div className="flex flex-col gap-2 mb-6">
                      {p.metrics.map((m, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span style={{ color: 'var(--accent)', fontSize: 9, fontWeight: 700 }}>✓</span>
                          <span className="text-sub" style={{ fontSize: 13.5 }}>{m}</span>
                        </div>
                      ))}
                    </div>
                    <div className="font-mono text-muted mb-3" style={{ fontSize: 9.5, letterSpacing: '.12em' }}>TECH STACK</div>
                    <div className="flex flex-wrap gap-1.5">
                      {p.stack.map(t => (
                        <span key={t} className="font-mono text-muted"
                          style={{ padding: '3px 9px', fontSize: 10.5, border: '1px solid var(--border)', background: 'rgba(255,255,255,.02)' }}>
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
        <div style={{ borderTop: '1px solid var(--border)', padding: 'clamp(40px,5vw,80px) clamp(16px,4vw,56px)', textAlign: 'center' }}>
          <h2 className="font-display font-black text-text" style={{ fontSize: 'clamp(28px,4vw,48px)', letterSpacing: '-.03em', marginBottom: 16 }}>
            Want a demo or custom build?
          </h2>
          <p className="text-sub" style={{ fontSize: 16, marginBottom: 36 }}>We'll walk you through any product or scope something custom for your business.</p>
          <Link href="/contact"
            className="font-display font-bold no-underline hover-glow inline-block"
            style={{ padding: '14px 40px', fontSize: 13, letterSpacing: '.06em', textTransform: 'uppercase', background: 'var(--accent)', color: '#fff' }}>
            Get In Touch →
          </Link>
        </div>

      </main>
      <Footer />
    </>
  );
}
