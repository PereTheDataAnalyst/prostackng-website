import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Counter from '@/components/ui/Counter';
import { TIMELINE, COMPANY_STATS } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Company',
  description: 'ProStack NG Technologies — building intelligent platforms from Port Harcourt to the world.',
};

const VALUES = [
  { icon: '◎', title: 'Platform Thinking',    desc: 'We don\'t build isolated products. Every system is designed as a composable piece of a larger ecosystem — shared auth, payments, analytics, and APIs from day one.' },
  { icon: '⬡', title: 'African-First Design',  desc: 'We build for real conditions — low bandwidth, USSD fallbacks, Naira pricing, Paystack integration, and local compliance. Our products work everywhere in Africa.' },
  { icon: '▦', title: 'Technical Rigour',      desc: 'Every line of code is production-grade, tested, and documented. We don\'t ship until we\'re proud of it. No shortcuts, no spaghetti, no "good enough."' },
  { icon: '⟁', title: 'Radical Transparency', desc: 'No black boxes. No surprise invoices. No excuses. You see everything — code, progress, blockers — at every stage of the project.' },
];

export default function CompanyPage() {
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
            style={{ top: '-10%', right: '-5%', width: 700, height: 700, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(139,92,246,.1) 0%, transparent 65%)' }} />
          <div className="relative" style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div className="section-label">The Company</div>
            <h1 className="font-display font-black text-text" style={{ fontSize: 'clamp(40px,6vw,84px)', letterSpacing: '-.04em', lineHeight: .95, marginBottom: 20 }}>
              Built in Nigeria.<br /><span style={{ color: 'var(--accent)' }}>Scaling Africa.</span>
            </h1>
            <p className="text-sub" style={{ fontSize: 17, lineHeight: 1.9, maxWidth: 580 }}>
              ProStack NG Technologies is a Port Harcourt-based platform company building intelligent digital infrastructure for African businesses. We are engineers, designers, and strategists who believe Nigerian companies deserve the same quality of software that global companies receive.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(40px,5vw,72px) clamp(16px,4vw,56px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
            {COMPANY_STATS.map(s => (
              <div key={s.label} style={{ background: 'var(--surface)', padding: 'clamp(28px,3vw,44px) 28px', textAlign: 'center' }}>
                <div className="font-display font-black" style={{ fontSize: 'clamp(36px,4vw,56px)', lineHeight: 1, color: 'var(--accent)', letterSpacing: '-.03em' }}>
                  <Counter target={s.value} suffix={s.suffix} />
                </div>
                <div className="font-mono text-muted mt-2" style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(60px,8vw,100px) clamp(16px,4vw,56px)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 64, alignItems: 'start', marginBottom: 80 }}>
            <div>
              <div className="section-label" style={{ marginBottom: 24 }}>Our Model</div>
              <h2 className="font-display font-black text-text" style={{ fontSize: 'clamp(28px,3.5vw,44px)', letterSpacing: '-.03em', lineHeight: 1.05, marginBottom: 20 }}>
                The compound<br /><span style={{ color: 'var(--accent)' }}>advantage.</span>
              </h2>
              <p className="text-sub" style={{ fontSize: 15, lineHeight: 1.85, marginBottom: 16 }}>
                ProStack NG builds platform infrastructure once, then deploys multiple products on top of it. Every product we ship makes the next one faster to build and easier to scale.
              </p>
              <p className="text-sub" style={{ fontSize: 15, lineHeight: 1.85 }}>
                Auth, payments, notifications, analytics — built once, inherited by every product forever. That's the compound advantage that lets us ship enterprise-quality software at startup speed.
              </p>
            </div>
            <div>
              <div className="section-label" style={{ marginBottom: 24 }}>Our Values</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
                {VALUES.map((v, i) => (
                  <div key={i}
                    className="hover-surface"
                    style={{ background: 'var(--card)', padding: '24px 28px', display: 'flex', gap: 16 }}
                  >
                    <div className="font-display font-bold flex-shrink-0" style={{ fontSize: 18, color: 'var(--accent)', width: 28 }}>{v.icon}</div>
                    <div>
                      <div className="font-display font-bold text-text mb-2" style={{ fontSize: 14 }}>{v.title}</div>
                      <div className="text-sub" style={{ fontSize: 13, lineHeight: 1.7 }}>{v.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Roadmap */}
          <div className="section-label" style={{ marginBottom: 32 }}>Company Roadmap</div>
          <h2 className="font-display font-black text-text" style={{ fontSize: 'clamp(28px,4vw,48px)', letterSpacing: '-.03em', marginBottom: 48 }}>
            Where we're going.
          </h2>
          <div className="relative">
            <div className="absolute hidden md:block" style={{ left: 0, top: 0, bottom: 0, width: 1, background: 'linear-gradient(180deg,var(--accent),var(--border),transparent)' }} />
            {TIMELINE.map((t, i) => (
              <div key={i} className="flex gap-10 mb-8 md:pl-8 relative">
                <div className="absolute hidden md:block" style={{
                  left: -5, top: 6, width: 11, height: 11, borderRadius: '50%',
                  background: t.status === 'active' ? 'var(--accent)' : 'var(--card)',
                  border: `2px solid ${t.status === 'active' ? 'var(--accent)' : 'var(--muted)'}`,
                  boxShadow: t.status === 'active' ? '0 0 12px rgba(139,92,246,.6)' : 'none',
                }} />
                <div style={{ minWidth: 110, flexShrink: 0 }}>
                  <div className="font-display font-bold" style={{ fontSize: 13, color: t.status === 'active' ? 'var(--accent)' : 'var(--muted)' }}>{t.phase}</div>
                  <div className="font-mono text-muted" style={{ fontSize: 9.5 }}>{t.period}</div>
                </div>
                <div className="flex-1 border p-5"
                  style={{
                    borderColor: t.status === 'active' ? 'rgba(139,92,246,.3)' : 'var(--border)',
                    background: t.status === 'active' ? 'rgba(139,92,246,.04)' : 'var(--card)',
                  }}>
                  <p style={{ fontSize: 14.5, lineHeight: 1.75, color: t.status === 'active' ? 'var(--text)' : 'var(--sub)' }}>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: 'clamp(48px,6vw,80px) clamp(16px,4vw,56px)', textAlign: 'center' }}>
          <h2 className="font-display font-black text-text" style={{ fontSize: 'clamp(28px,4vw,48px)', letterSpacing: '-.03em', marginBottom: 16 }}>
            Want to work with us?
          </h2>
          <p className="text-sub" style={{ fontSize: 16, marginBottom: 36 }}>Free consultation. No pitch, no pressure — just a conversation.</p>
          <Link href="/contact"
            className="font-display font-bold no-underline hover-glow inline-block"
            style={{ padding: '14px 40px', fontSize: 13, letterSpacing: '.06em', textTransform: 'uppercase', background: 'var(--accent)', color: '#fff' }}
            Start a Conversation →
          </Link>
        </div>

      </main>
      <Footer />
    </>
  );
}
