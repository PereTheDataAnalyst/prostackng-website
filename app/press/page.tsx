import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StackLogo from '@/components/StackLogo';

export const metadata = {
  title: 'Press & Media Kit — ProStack NG',
  description: 'Media assets, company facts, founder bio, and press contact for ProStack NG Technologies.',
};

const FACTS = [
  { label: 'Founded',         value: '2024' },
  { label: 'Headquarters',    value: 'Port Harcourt, Rivers State, Nigeria' },
  { label: 'Live Products',   value: '3 (AutoReport, ProTrackNG, NightOps)' },
  { label: 'Products in Dev', value: '3 (MyHarriet, SwiftRide, StakeX)' },
  { label: 'Clients Served',  value: '20+' },
  { label: 'Stage',           value: 'Bootstrapped — Series A prep (2026)' },
  { label: 'Target Raise',    value: '$500K – $2M' },
];

const COLORS = [
  { name: 'Electric Blue',   hex: '#2563EB', role: 'Primary Accent'  },
  { name: 'Blue Hi',         hex: '#3B82F6', role: 'Hover State'     },
  { name: 'Obsidian',        hex: '#080B14', role: 'Background'      },
  { name: 'Surface',         hex: '#0C0F1C', role: 'Card Surface'    },
  { name: 'Text White',      hex: '#EEF0FF', role: 'Primary Text'    },
  { name: 'Subtitle',        hex: '#7A7DA0', role: 'Secondary Text'  },
];

const BOILERPLATE = `ProStack NG Technologies is a Port Harcourt-based software company building a suite of intelligent digital platforms for African businesses. Founded in 2024, the company operates three live products — AutoReport (executive reporting automation), ProTrackNG (tender intelligence), and NightOps (nightlife operating system) — with three additional platforms in development. ProStack NG is bootstrapped, Series A-ready, and targeting a $500K–$2M raise in 2026.`;

export default function PressPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 68 }}>

        {/* Header */}
        <div className="bg-grid" style={{ padding: 'clamp(56px,7vw,96px) clamp(16px,4vw,56px) clamp(40px,5vw,64px)', backgroundSize: '52px 52px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 40%, transparent 30%, var(--bg) 100%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto' }}>
            <div className="eyebrow" style={{ marginBottom: 14 }}>Press & Media</div>
            <h1 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(44px,7vw,96px)', letterSpacing: '-.05em', lineHeight: .9, color: 'var(--text)', marginBottom: 18 }}>
              Media Kit.
            </h1>
            <p style={{ fontSize: 16, color: 'var(--sub)', lineHeight: 1.85, maxWidth: 520 }}>
              Assets, facts, and context for journalists, analysts, and investors covering ProStack NG.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(48px,6vw,80px) clamp(16px,4vw,56px) clamp(64px,8vw,120px)' }}>

          {/* Logo downloads */}
          <div style={{ marginBottom: 72 }}>
            <div className="eyebrow" style={{ marginBottom: 20 }}>Logo & Mark</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', marginBottom: 16 }}>
              {[
                { bg: 'var(--bg)',    label: 'Dark Background', variant: 'color' as const },
                { bg: '#0B0D1A',     label: 'Surface',          variant: 'color' as const },
                { bg: '#F1F5FF',     label: 'Light Background', variant: 'mono' as const  },
                { bg: '#2563EB',     label: 'Blue Background',  variant: 'white' as const },
              ].map(item => (
                <div key={item.label} style={{ background: item.bg, padding: '36px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <StackLogo size={36} variant={item.variant} />
                    <div>
                      <div className="f-display" style={{ fontWeight: 800, fontSize: 15, letterSpacing: '-.02em', color: item.variant === 'white' ? '#fff' : item.variant === 'mono' ? '#0F172A' : 'var(--text)', lineHeight: 1 }}>
                        ProStack<span style={{ color: item.variant === 'white' ? '#93C5FD' : item.variant === 'mono' ? '#2563EB' : 'var(--blue-hi)' }}>NG</span>
                      </div>
                      <div className="f-mono" style={{ fontSize: 7, letterSpacing: '.22em', color: item.variant === 'white' ? 'rgba(255,255,255,.5)' : '#94A3B8', marginTop: 2 }}>
                        TECHNOLOGIES
                      </div>
                    </div>
                  </div>
                  <div className="f-mono" style={{ fontSize: 9, letterSpacing: '.1em', color: item.variant === 'white' ? 'rgba(255,255,255,.5)' : 'var(--muted)', textTransform: 'uppercase' }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.75 }}>
              Contact <a href="mailto:contact@prostackng.com" style={{ color: 'var(--blue-hi)' }}>contact@prostackng.com</a> to request hi-res logo files, brand guidelines, or custom assets.
            </p>
          </div>

          {/* Brand colours */}
          <div style={{ marginBottom: 72 }}>
            <div className="eyebrow" style={{ marginBottom: 20 }}>Brand Colours</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px,1fr))', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
              {COLORS.map(c => (
                <div key={c.hex} style={{ background: 'var(--card)', padding: '0 0 16px' }}>
                  <div style={{ height: 64, background: c.hex, marginBottom: 14 }} />
                  <div style={{ padding: '0 16px' }}>
                    <div className="f-display" style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)', marginBottom: 3 }}>{c.name}</div>
                    <div className="f-mono" style={{ fontSize: 10, color: 'var(--blue-hi)', letterSpacing: '.06em', marginBottom: 3 }}>{c.hex}</div>
                    <div className="f-mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.08em' }}>{c.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Typography note */}
          <div style={{ marginBottom: 72, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
            {[
              { name: 'Syne',               role: 'Display / Headlines', sample: 'ProStack NG Technologies', weight: '800' },
              { name: 'Plus Jakarta Sans',  role: 'Body / UI Text',      sample: 'Building Africa\'s digital backbone with intelligent platforms.', weight: '400' },
              { name: 'JetBrains Mono',     role: 'Labels / Code / Data', sample: 'API.PROSTACKNG.COM', weight: '400' },
            ].map(f => (
              <div key={f.name} style={{ background: 'var(--card)', padding: '28px 28px' }}>
                <div className="f-mono" style={{ fontSize: 9, letterSpacing: '.14em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 12 }}>
                  {f.role}
                </div>
                <div style={{ fontFamily: `'${f.name}', sans-serif`, fontWeight: f.weight, fontSize: f.name === 'Syne' ? 18 : 14, color: 'var(--text)', lineHeight: 1.4, marginBottom: 10 }}>
                  {f.sample}
                </div>
                <div className="f-mono" style={{ fontSize: 9.5, color: 'var(--blue-hi)' }}>{f.name}</div>
              </div>
            ))}
          </div>

          {/* Company facts */}
          <div style={{ marginBottom: 72, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 56 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 20 }}>Company Facts</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
                {FACTS.map(f => (
                  <div key={f.label} style={{ background: 'var(--card)', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                    <span className="f-mono" style={{ fontSize: 9.5, letterSpacing: '.1em', color: 'var(--muted)', textTransform: 'uppercase' }}>{f.label}</span>
                    <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500, textAlign: 'right' }}>{f.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Boilerplate + Founder */}
            <div>
              <div className="eyebrow" style={{ marginBottom: 20 }}>Boilerplate</div>
              <div style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: '24px 24px', marginBottom: 24, position: 'relative' }}>
                <p style={{ fontSize: 13.5, color: 'var(--sub)', lineHeight: 1.85, fontStyle: 'italic' }}>
                  &ldquo;{BOILERPLATE}&rdquo;
                </p>
              </div>

              <div className="eyebrow" style={{ marginBottom: 16 }}>Founder</div>
              <div style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: '22px 22px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 18, color: '#fff', flexShrink: 0 }}>P</div>
                <div>
                  <div className="f-display" style={{ fontWeight: 800, fontSize: 16, color: 'var(--text)' }}>Fubara</div>
                  <div className="f-mono" style={{ fontSize: 9.5, color: 'var(--blue-hi)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 10 }}>Founder & CEO</div>
                  <p style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.75 }}>
                    Founder of ProStack NG Technologies. Building Africa&apos;s digital infrastructure from Port Harcourt. Focused on platform business models, Nigerian market constraints, and the intersection of operations and software.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Press contact */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--hi)', padding: 'clamp(28px,4vw,48px)', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, var(--blue), #06B6D4)' }} />
            <div className="eyebrow" style={{ justifyContent: 'center', marginBottom: 14 }}>Press Contact</div>
            <h2 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(22px,3vw,38px)', letterSpacing: '-.04em', color: 'var(--text)', marginBottom: 14 }}>
              Media enquiries welcome.
            </h2>
            <p style={{ fontSize: 15, color: 'var(--sub)', marginBottom: 28, maxWidth: 440, margin: '0 auto 28px' }}>
              For interviews, product enquiries, or custom asset requests, reach out directly.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="mailto:contact@prostackng.com" className="btn btn-primary">📧 contact@prostackng.com</a>
              <a href="https://wa.me/2347059449360" target="_blank" rel="noreferrer" className="btn btn-ghost">💬 WhatsApp</a>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
