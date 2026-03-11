import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CASE_STUDIES } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Case Studies',
  description: 'Real problems, real solutions — ProStack NG case studies from live production projects.',
};

export default function CaseStudiesPage() {
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
            style={{ bottom: '-20%', left: '-10%', width: 600, height: 600, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(236,72,153,.08) 0%, transparent 65%)' }} />
          <div className="relative" style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div className="section-label">Case Studies</div>
            <h1 className="font-display font-black text-text" style={{ fontSize: 'clamp(40px,6vw,84px)', letterSpacing: '-.04em', lineHeight: .95, marginBottom: 20 }}>
              Real problems.<br /><span style={{ color: 'var(--accent)' }}>Real solutions.</span>
            </h1>
            <p className="text-sub" style={{ fontSize: 17, lineHeight: 1.9, maxWidth: 520 }}>
              Every case study below is a real ProStack NG build — shipped, live, and in production.
            </p>
          </div>
        </div>

        {/* Case studies */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(40px,5vw,80px) clamp(16px,4vw,56px) clamp(60px,8vw,120px)' }}>
          <div className="flex flex-col" style={{ gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
            {CASE_STUDIES.map((c, i) => (
              <div key={i}
                className="relative overflow-hidden hover-surface"
                style={{
                  background: 'var(--card)',
                  padding: 'clamp(28px,4vw,56px)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
                  gap: 'clamp(24px,4vw,56px)',
                }}
              >
                <div className="absolute top-0 left-0 bottom-0" style={{ width: 3, background: c.color }} />

                {/* Identity + metric */}
                <div>
                  <div className="font-mono mb-3" style={{ color: c.color, fontSize: 10.5, letterSpacing: '.16em', textTransform: 'uppercase' }}>{c.product}</div>
                  <h2 className="font-display font-black text-text mb-8" style={{ fontSize: 'clamp(18px,2vw,24px)', lineHeight: 1.2 }}>{c.title}</h2>
                  <div style={{ paddingLeft: 16, borderLeft: `2px solid ${c.color}` }}>
                    <div className="font-display font-black" style={{ color: c.color, fontSize: 'clamp(28px,3.5vw,44px)', lineHeight: 1 }}>{c.metric}</div>
                    <div className="font-mono text-muted mt-1" style={{ fontSize: 9.5, letterSpacing: '.12em', textTransform: 'uppercase' }}>{c.metricLabel}</div>
                  </div>
                  <div style={{ marginTop: 24 }}>
                    <div className="font-mono text-muted mb-1.5" style={{ fontSize: 9.5, letterSpacing: '.12em' }}>CLIENT</div>
                    <div className="text-sub" style={{ fontSize: 13.5 }}>{c.client}</div>
                  </div>
                </div>

                {/* Problem */}
                <div>
                  <div className="font-mono text-muted mb-3" style={{ fontSize: 9.5, letterSpacing: '.12em' }}>THE PROBLEM</div>
                  <p className="text-sub leading-relaxed" style={{ fontSize: 14.5 }}>{c.problem}</p>
                </div>

                {/* Solution + Result */}
                <div>
                  <div className="font-mono text-muted mb-3" style={{ fontSize: 9.5, letterSpacing: '.12em' }}>THE SOLUTION</div>
                  <p className="text-sub leading-relaxed mb-6" style={{ fontSize: 14.5 }}>{c.solution}</p>
                  <div style={{ paddingLeft: 16, borderLeft: `2px solid ${c.color}`, paddingTop: 4, paddingBottom: 4 }}>
                    <div className="font-mono text-muted mb-1.5" style={{ fontSize: 9.5, letterSpacing: '.12em' }}>RESULT</div>
                    <p className="font-semibold text-text leading-relaxed" style={{ fontSize: 13.5 }}>{c.result}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
