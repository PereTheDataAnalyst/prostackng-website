import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { STACK, SHARED_SERVICES } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Technology',
  description: 'The standardised tech stack and shared infrastructure that powers every ProStack NG product.',
};

export default function TechnologyPage() {
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
            style={{ top: '-20%', right: '-10%', width: 600, height: 600, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(139,92,246,.1) 0%, transparent 65%)' }} />
          <div className="relative" style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div className="section-label">Technology</div>
            <h1 className="font-display font-black text-text" style={{ fontSize: 'clamp(40px,6vw,84px)', letterSpacing: '-.04em', lineHeight: .95, marginBottom: 20 }}>
              The stack behind<br /><span style={{ color: 'var(--accent)' }}>everything we build.</span>
            </h1>
            <p className="text-sub" style={{ fontSize: 17, lineHeight: 1.9, maxWidth: 560 }}>
              We standardise our entire stack across every product. Every new service inherits battle-tested infrastructure — no reinventing auth, no rebuilding payment flows. Just shipping.
            </p>
          </div>
        </div>

        {/* Stack grid */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(40px,5vw,80px) clamp(16px,4vw,56px)' }}>
          <div className="section-label" style={{ marginBottom: 32 }}>Core Stack</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', marginBottom: 80 }}>
            {STACK.map((layer, i) => (
              <div key={i}
                className="hover-surface"
                style={{ background: 'var(--card)', padding: 40 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div style={{ width: 3, height: 28, background: layer.color, flexShrink: 0 }} />
                  <div className="font-display font-bold text-text" style={{ fontSize: 14, letterSpacing: '.02em' }}>{layer.label}</div>
                </div>
                <div className="flex flex-col gap-2">
                  {layer.items.map(t => (
                    <div key={t}
                      className="flex items-center gap-3"
                      style={{ padding: '10px 14px', border: '1px solid var(--border)', background: 'var(--surface)' }}
                    >
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: layer.color, flexShrink: 0 }} />
                      <span className="text-sub font-medium" style={{ fontSize: 14 }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Shared services */}
          <div className="section-label" style={{ marginBottom: 32 }}>Shared Infrastructure</div>
          <p className="text-sub" style={{ fontSize: 15, lineHeight: 1.85, maxWidth: 560, marginBottom: 40 }}>
            Every ProStack NG product is deployed as a module on our shared service layer. New products inherit all infrastructure from day one.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
            {SHARED_SERVICES.map((s, i) => (
              <div key={i}
                className="hover-surface"
                style={{ background: 'var(--card)', padding: 32 }}
              >
                <div className="font-mono mb-2" style={{ color: s.color, fontSize: 10, letterSpacing: '.12em' }}>{s.subdomain}</div>
                <div className="text-sub" style={{ fontSize: 13.5, lineHeight: 1.65 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
