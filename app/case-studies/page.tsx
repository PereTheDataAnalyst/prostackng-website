import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CASE_STUDIES } from '@/lib/data';

export const metadata = { title: 'Case Studies — ProStack NG', description: 'Real results from live ProStack NG deployments.' };

export default function CaseStudiesPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 68 }}>

        {/* Header */}
        <div className="bg-grid" style={{ padding: 'clamp(64px,8vw,100px) clamp(16px,4vw,56px) clamp(48px,6vw,72px)', backgroundSize: '52px 52px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 40%, transparent 30%, var(--bg) 100%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto' }}>
            <div className="eyebrow" style={{ marginBottom: 16 }}>Case Studies</div>
            <h1 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(44px,7vw,96px)', letterSpacing: '-.05em', lineHeight: .9, color: 'var(--text)', marginBottom: 20 }}>
              Results that<br /><span style={{ color: 'var(--blue-hi)' }}>speak for themselves.</span>
            </h1>
            <p style={{ fontSize: 17, color: 'var(--sub)', lineHeight: 1.85, maxWidth: 560 }}>
              Real deployments. Real clients. Real numbers. No demos, no concepts — everything here is live and in production.
            </p>
          </div>
        </div>

        {/* Cases */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(48px,6vw,80px) clamp(16px,4vw,56px) clamp(64px,8vw,120px)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--border)' }}>
            {CASE_STUDIES.map((c, i) => (
              <div key={i} style={{ background: 'var(--card)', padding: 'clamp(36px,5vw,64px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 'clamp(32px,5vw,64px)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 2, background: c.color }} />

                {/* Metric + Identity */}
                <div>
                  <div className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(56px,7vw,96px)', letterSpacing: '-.05em', color: c.color, lineHeight: .85, marginBottom: 8 }}>
                    {c.metric}
                  </div>
                  <div className="f-mono" style={{ fontSize: 9.5, color: 'var(--muted)', letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 28 }}>
                    {c.metricLabel}
                  </div>
                  <div className="f-mono" style={{ fontSize: 9.5, color: c.color, letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 8 }}>
                    {c.product}
                  </div>
                  <h2 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(18px,2vw,24px)', color: 'var(--text)', lineHeight: 1.2 }}>
                    {c.title}
                  </h2>
                </div>

                {/* Problem */}
                <div>
                  <div className="f-mono" style={{ fontSize: 9, letterSpacing: '.14em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 14 }}>The Problem</div>
                  <p style={{ fontSize: 14.5, color: 'var(--sub)', lineHeight: 1.85 }}>{c.problem}</p>
                </div>

                {/* Solution + Result */}
                <div>
                  <div className="f-mono" style={{ fontSize: 9, letterSpacing: '.14em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 14 }}>The Solution</div>
                  <p style={{ fontSize: 14.5, color: 'var(--sub)', lineHeight: 1.85, marginBottom: 24 }}>{c.solution}</p>
                  <div style={{ borderLeft: `2px solid ${c.color}`, paddingLeft: 16 }}>
                    <div className="f-mono" style={{ fontSize: 9, letterSpacing: '.14em', color: c.color, textTransform: 'uppercase', marginBottom: 8 }}>Result</div>
                    <p style={{ fontSize: 14, color: 'var(--text)', fontWeight: 500, lineHeight: 1.75 }}>{c.result}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: 'var(--s1)', borderTop: '1px solid var(--border)', padding: 'clamp(48px,6vw,80px) clamp(16px,4vw,56px)', textAlign: 'center' }}>
          <div className="eyebrow" style={{ justifyContent: 'center', marginBottom: 16 }}>Your Project</div>
          <h2 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(28px,4vw,52px)', letterSpacing: '-.04em', color: 'var(--text)', marginBottom: 16 }}>
            You could be next.
          </h2>
          <p style={{ fontSize: 16, color: 'var(--sub)', marginBottom: 36, maxWidth: 480, margin: '0 auto 36px' }}>
            Every result above started with a 45-minute conversation. No pitch, no pressure.
          </p>
          <Link href="/contact" className="btn btn-primary">Start a Conversation →</Link>
        </div>

      </main>
      <Footer />
    </>
  );
}
