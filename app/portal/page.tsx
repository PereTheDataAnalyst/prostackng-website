'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StackLogo from '@/components/StackLogo';

const PORTALS = [
  {
    product: 'AutoReport',
    color: '#FF5757',
    icon: '▦',
    desc: 'View your report history, update data sources, manage delivery schedules.',
    loginUrl: 'https://autoreport.prostackng.com.ng/',
    status: 'live' as const,
  },
  {
    product: 'ProTrackNG',
    color: '#06B6D4',
    icon: '◎',
    desc: 'Manage your keyword alerts, view tender history, update your company profile.',
    loginUrl: 'https://www.protrackng.com.ng/',
    status: 'live' as const,
  },
  {
    product: 'NightOps',
    color: '#A78BFA',
    icon: '◈',
    desc: 'Access your venue dashboard, reconciliation history, and staff reports.',
    loginUrl: '#',  // Migrating from Render to Railway — URL updating soon
    status: 'live' as const,
  },
  {
    product: 'MyHarriet',
    color: '#F5B530',
    icon: '⬡',
    desc: 'Merchant portal — manage listings, orders, and payouts.',
    loginUrl: '#',
    status: 'soon' as const,
  },
];

const SUPPORT_OPTIONS = [
  { icon: '💬', label: 'WhatsApp Support', desc: 'Fastest response. Business hours.', action: 'https://wa.me/2347059449360', cta: 'Open WhatsApp' },
  { icon: '📧', label: 'Email Support',    desc: 'Detailed issues and reports.',      action: 'mailto:contact@prostackng.com.ng', cta: 'Send Email' },
  { icon: '📅', label: 'Book a Session',   desc: 'Screen share with our team.',        action: '/demo', cta: 'Book Now' },
];

export default function ClientPortalPage() {
  const [search, setSearch] = useState('');
  const filtered = PORTALS.filter(p => p.product.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 68, minHeight: 'calc(100vh - 68px)', background: 'var(--bg)' }}>

        {/* ── HEADER ── */}
        <div style={{ background: 'var(--s1)', borderBottom: '1px solid var(--border)', padding: 'clamp(36px,5vw,64px) clamp(16px,4vw,56px)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 10 }}>Client Access</div>
              <h1 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(32px,4.5vw,60px)', letterSpacing: '-.05em', lineHeight: .9, color: 'var(--text)' }}>
                Client Portal
              </h1>
            </div>
            <div style={{ opacity: .08 }}>
              <StackLogo size={72} />
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(36px,5vw,64px) clamp(16px,4vw,56px)' }}>

          {/* ── PRODUCT PORTALS ── */}
          <div style={{ marginBottom: 56 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
              <div className="eyebrow">Your Platforms</div>
              <input
                placeholder="Search products…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="ps-input"
                style={{ maxWidth: 240, padding: '8px 14px', fontSize: 12 }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
              {filtered.map(p => (
                <div key={p.product} style={{ background: 'var(--card)', padding: 28, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: p.status === 'live' ? 2 : 1, background: p.status === 'live' ? p.color : 'transparent', borderTop: p.status !== 'live' ? `1px dashed ${p.color}40` : 'none' }} />

                  {/* Icon + name */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, background: `${p.color}12`, border: `1px solid ${p.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: p.color }}>
                        {p.icon}
                      </div>
                      <div>
                        <div className="f-display" style={{ fontWeight: 800, fontSize: 16, color: 'var(--text)' }}>{p.product}</div>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, letterSpacing: '.12em', textTransform: 'uppercase', color: p.color }}>
                          {p.status === 'live' ? '● Active' : '○ Coming Soon'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.75, marginBottom: 20, flex: 1 }}>{p.desc}</p>

                  {p.status === 'live' ? (
                    <a href={p.loginUrl} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 11,
                      letterSpacing: '.08em', textTransform: 'uppercase', textDecoration: 'none',
                      padding: '11px 20px', background: p.color, color: '#fff',
                      transition: 'opacity .2s',
                    }}>
                      Open {p.product} →
                    </a>
                  ) : (
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', textAlign: 'center', padding: '11px 20px', border: '1px dashed var(--border)' }}>
                      Coming Soon
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── QUICK RESOURCES ── */}
          <div style={{ marginBottom: 56 }}>
            <div className="eyebrow" style={{ marginBottom: 20 }}>Quick Resources</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
              {[
                { icon: '📄', label: 'AutoReport User Guide',    href: 'https://autoreport.prostackng.com.ng/docs/user-guide', tag: 'Guide'  },
                { icon: '📄', label: 'ProTrackNG Setup Guide',   href: 'https://www.protrackng.com.ng/docs', tag: 'Guide'  },
                { icon: '📄', label: 'ClubOps Onboarding',       href: '/docs#clubops', tag: 'Guide' },
                { icon: '🎥', label: 'Video Walkthroughs',        href: '/media', tag: 'Media' },
                { icon: '💰', label: 'Billing & Invoices',        href: 'mailto:contact@prostackng.com.ng?subject=Billing enquiry', tag: 'Email' },
                { icon: '🔄', label: 'Upgrade or Change Plan',    href: '/pricing', tag: 'Pricing' },
              ].map(r => (
                <a key={r.label} href={r.href} style={{ background: 'var(--card)', padding: '18px 20px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 14, transition: 'background .2s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--hi)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--card)')}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{r.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500, lineHeight: 1.3 }}>{r.label}</div>
                    <div className="f-mono" style={{ fontSize: 8.5, color: 'var(--muted)', letterSpacing: '.1em', marginTop: 3, textTransform: 'uppercase' }}>{r.tag}</div>
                  </div>
                  <span style={{ color: 'var(--muted)', fontSize: 12, flexShrink: 0 }}>→</span>
                </a>
              ))}
            </div>
          </div>

          {/* ── SUPPORT ── */}
          <div>
            <div className="eyebrow" style={{ marginBottom: 20 }}>Get Support</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
              {SUPPORT_OPTIONS.map(s => (
                <a key={s.label} href={s.action} target={s.action.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                  style={{ background: 'var(--card)', padding: '24px 26px', textDecoration: 'none', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 24, flexShrink: 0 }}>{s.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div className="f-display" style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--sub)', marginBottom: 12 }}>{s.desc}</div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--blue-hi)', borderBottom: '1px solid rgba(59,130,246,.3)', paddingBottom: 2, display: 'inline-block' }}>
                      {s.cta} →
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Not a client yet */}
          <div style={{ marginTop: 48, background: 'var(--s1)', border: '1px solid var(--border)', padding: '20px 28px', display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="f-mono" style={{ fontSize: 9.5, letterSpacing: '.1em', color: 'var(--muted)', textTransform: 'uppercase' }}>
              Not a client yet?
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <a href="/demo" className="btn btn-primary btn-sm">Book a Free Demo →</a>
              <a href="/pricing" className="btn btn-ghost btn-sm">View Pricing</a>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
