import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { STACK, SHARED_SERVICES } from '@/lib/data';

export const metadata = { title: 'Technology — ProStack NG', description: 'Our full engineering stack and shared infrastructure.' };

export default function TechnologyPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 68 }}>

        {/* Header */}
        <div className="bg-grid" style={{ padding: 'clamp(64px,8vw,100px) clamp(16px,4vw,56px) clamp(48px,6vw,72px)', backgroundSize: '52px 52px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 40%, transparent 30%, var(--bg) 100%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto' }}>
            <div className="eyebrow" style={{ marginBottom: 16 }}>Engineering Stack</div>
            <h1 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(44px,7vw,96px)', letterSpacing: '-.05em', lineHeight: .9, color: 'var(--text)', marginBottom: 20 }}>
              How we build.
            </h1>
            <p style={{ fontSize: 17, color: 'var(--sub)', lineHeight: 1.85, maxWidth: 560 }}>
              Every tool, framework, and service we use — chosen for reliability, performance, and African market constraints.
            </p>
          </div>
        </div>

        {/* Stack grid */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(48px,6vw,80px) clamp(16px,4vw,56px)' }}>
          <div className="eyebrow" style={{ marginBottom: 40 }}>Full-Stack Technology</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px,1fr))', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', marginBottom: 80 }}>
            {STACK.map(s => (
              <div key={s.label} style={{ background: 'var(--card)', padding: 36, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${s.color},transparent)` }} />
                <div className="f-mono" style={{ fontSize: 9.5, color: s.color, letterSpacing: '.16em', textTransform: 'uppercase', marginBottom: 20 }}>
                  {s.label}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {s.items.map(item => (
                    <span key={item} style={{
                      fontSize: 13, color: 'var(--text)', fontWeight: 500,
                      background: 'var(--s2)', border: '1px solid var(--border)',
                      padding: '5px 12px',
                    }}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Shared services */}
          <div className="eyebrow" style={{ marginBottom: 28 }}>Shared Infrastructure</div>
          <h2 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(24px,3vw,40px)', letterSpacing: '-.04em', color: 'var(--text)', marginBottom: 40 }}>
            One backbone. Every product.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
            {SHARED_SERVICES.map(s => (
              <div key={s.subdomain} style={{ background: 'var(--s1)', padding: '28px 28px 24px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${s.color},transparent)` }} />
                <div className="f-mono" style={{ fontSize: 10, color: s.color, letterSpacing: '.06em', marginBottom: 10, wordBreak: 'break-all' }}>
                  {s.subdomain}
                </div>
                <p style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Principles */}
        <div style={{ background: 'var(--s1)', borderTop: '1px solid var(--border)', padding: 'clamp(48px,6vw,80px) clamp(16px,4vw,56px)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div className="eyebrow" style={{ marginBottom: 28 }}>Engineering Principles</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px,1fr))', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
              {[
                { n: '01', title: 'Real-time First',   desc: 'Every product uses WebSocket connections. Data is always live, never stale.' },
                { n: '02', title: 'Africa-native',      desc: 'Built for slow connections, Nigerian payment rails, and local compliance.' },
                { n: '03', title: 'Platform thinking',  desc: 'No product is an island. Every feature is designed to serve the whole ecosystem.' },
                { n: '04', title: 'Security by design', desc: 'Row-level security, encrypted storage, and full audit trails from day one.' },
              ].map(p => (
                <div key={p.n} style={{ background: 'var(--card)', padding: 32 }}>
                  <div className="f-mono" style={{ fontSize: 10, color: 'var(--blue)', letterSpacing: '.12em', marginBottom: 16 }}>{p.n}</div>
                  <div className="f-display" style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)', marginBottom: 10 }}>{p.title}</div>
                  <p style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.75 }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
