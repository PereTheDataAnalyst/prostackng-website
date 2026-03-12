import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { TIMELINE, COMPANY_STATS } from '@/lib/data';

export const metadata = { title: 'Company — ProStack NG', description: 'About ProStack NG Technologies. Who we are and where we\'re going.' };

const VALUES = [
  { n: '01', title: 'Solve real problems',    desc: 'We build for African businesses with African constraints — slow networks, Naira payments, local compliance.' },
  { n: '02', title: 'Ship, then iterate',     desc: 'Three live products generating revenue. We execute before we fundraise.' },
  { n: '03', title: 'Platform over product',  desc: 'Every feature compounds across six platforms. Network effects are baked into the architecture.' },
  { n: '04', title: 'Transparency',           desc: 'With clients, investors, and each other. We say what the numbers actually are.' },
];

export default function CompanyPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 68 }}>

        {/* Header */}
        <div className="bg-grid" style={{ padding: 'clamp(64px,8vw,100px) clamp(16px,4vw,56px) clamp(48px,6vw,72px)', backgroundSize: '52px 52px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 40%, transparent 30%, var(--bg) 100%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto' }}>
            <div className="eyebrow" style={{ marginBottom: 16 }}>About ProStack NG</div>
            <h1 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(44px,7vw,96px)', letterSpacing: '-.05em', lineHeight: .9, color: 'var(--text)', marginBottom: 20 }}>
              Building Africa&apos;s<br /><span style={{ color: 'var(--blue-hi)' }}>digital backbone.</span>
            </h1>
            <p style={{ fontSize: 17, color: 'var(--sub)', lineHeight: 1.85, maxWidth: 600 }}>
              ProStack NG Technologies is a Port Harcourt-based software company building a suite of intelligent digital platforms. Three products live. Three in development. One shared infrastructure powering all of them.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ background: 'var(--s1)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(32px,4vw,56px) clamp(16px,4vw,56px)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
              {COMPANY_STATS.map(s => (
                <div key={s.label} style={{ background: 'var(--card)', padding: '32px 28px' }}>
                  <div className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(40px,5vw,64px)', letterSpacing: '-.04em', lineHeight: 1, color: 'var(--text)', marginBottom: 6 }}>
                    {s.value}<span style={{ color: 'var(--blue-hi)' }}>{s.suffix}</span>
                  </div>
                  <div className="f-mono" style={{ fontSize: 9.5, letterSpacing: '.14em', color: 'var(--muted)', textTransform: 'uppercase' }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission + Values */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(56px,7vw,100px) clamp(16px,4vw,56px)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 72, marginBottom: 80 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Our Mission</div>
              <h2 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(26px,3vw,40px)', letterSpacing: '-.04em', color: 'var(--text)', marginBottom: 20, lineHeight: 1.05 }}>
                Making sophisticated technology accessible to every African business.
              </h2>
              <p style={{ fontSize: 15, color: 'var(--sub)', lineHeight: 1.9 }}>
                Enterprise-grade platforms — real-time intelligence, automated reporting, marketplace infrastructure — should not be the exclusive preserve of multinationals. We build tools that give Nigerian SMEs and institutions the same competitive edge as the best-funded organisations in the world.
              </p>
            </div>
            <div>
              <div className="eyebrow" style={{ marginBottom: 24 }}>Our Values</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
                {VALUES.map(v => (
                  <div key={v.n} style={{ background: 'var(--card)', padding: '24px 28px', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 20, alignItems: 'start' }}>
                    <div className="f-mono" style={{ fontSize: 9.5, color: 'var(--blue)', letterSpacing: '.1em', marginTop: 2 }}>{v.n}</div>
                    <div>
                      <div className="f-display" style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 4 }}>{v.title}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--sub)', lineHeight: 1.7 }}>{v.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Roadmap */}
          <div className="eyebrow" style={{ marginBottom: 16 }}>Company Roadmap</div>
          <h2 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(26px,3.5vw,44px)', letterSpacing: '-.04em', color: 'var(--text)', marginBottom: 44 }}>
            The plan. Publicly committed to.
          </h2>
          <div style={{ position: 'relative' }}>
            <div className="hidden md:block" style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 1, background: 'linear-gradient(180deg, var(--blue), var(--border) 70%, transparent)' }} />
            {TIMELINE.map((t, i) => (
              <div key={i} className="md:pl-10" style={{ display: 'flex', gap: 40, marginBottom: 32 }}>
                <div style={{ minWidth: 96, flexShrink: 0 }}>
                  <div className="f-display" style={{ fontWeight: 700, fontSize: 13, color: t.status === 'active' ? 'var(--blue-hi)' : 'var(--muted)' }}>{t.phase}</div>
                  <div className="f-mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.08em', marginTop: 2 }}>{t.period}</div>
                </div>
                <div style={{
                  flex: 1, padding: '18px 24px',
                  border: `1px solid ${t.status === 'active' ? 'rgba(37,99,235,.25)' : 'var(--border)'}`,
                  background: t.status === 'active' ? 'rgba(37,99,235,.04)' : 'var(--card)',
                }}>
                  <p style={{ fontSize: 14, lineHeight: 1.8, color: t.status === 'active' ? 'var(--text)' : 'var(--sub)' }}>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: 'var(--s1)', borderTop: '1px solid var(--border)', padding: 'clamp(48px,6vw,80px) clamp(16px,4vw,56px)', textAlign: 'center' }}>
          <h2 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(28px,4vw,52px)', letterSpacing: '-.04em', color: 'var(--text)', marginBottom: 16 }}>
            Interested in investing?
          </h2>
          <p style={{ fontSize: 16, color: 'var(--sub)', marginBottom: 36 }}>Free consultation. No pitch, no pressure — just a conversation.</p>
          <Link href="/contact" className="btn btn-primary">Start a Conversation →</Link>
        </div>

      </main>
      <Footer />
    </>
  );
}
