'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CHANNEL_VIDEOS, AD_VIDEOS, ytThumb, ytEmbed, ytWatch } from '@/lib/videos';
import type { VideoEntry } from '@/lib/videos';

const TAGS = ['All', 'Product Demo', 'Case Study', 'Company', 'Roadmap'];
const AD_TAGS = ['All Ads', 'Ad'];

function VideoModal({ video, onClose }: { video: VideoEntry; onClose: () => void }) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(8,11,20,.96)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 900, position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: -44, right: 0, background: 'none', border: '1px solid var(--hi)', color: 'var(--sub)', fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '.1em', padding: '7px 14px', cursor: 'pointer' }}>
          ESC / CLOSE ✕
        </button>
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', background: '#000' }}>
          <iframe src={ytEmbed(video.id)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title={video.title} />
        </div>
        <div style={{ background: 'var(--card)', border: '1px solid var(--hi)', borderTop: 'none', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8.5, letterSpacing: '.14em', textTransform: 'uppercase', color: video.tagColor, display: 'block', marginBottom: 4 }}>{video.tag}</span>
            <div className="f-display" style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>{video.title}</div>
          </div>
          <a href={ytWatch(video.id)} target="_blank" rel="noreferrer" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--sub)', textDecoration: 'none', border: '1px solid var(--border)', padding: '7px 14px', flexShrink: 0 }}>
            YouTube ↗
          </a>
        </div>
      </div>
    </div>
  );
}

function VideoCard({ v, onClick }: { v: VideoEntry; onClick?: () => void }) {
  const ready = !!(v.hasVideo && v.id);
  return (
    <div
      onClick={ready ? onClick : undefined}
      style={{ cursor: ready ? 'pointer' : 'default', background: 'var(--card)', overflow: 'hidden', opacity: ready ? 1 : .6, transition: 'opacity .2s, transform .2s' }}
      onMouseEnter={e => ready && ((e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)')}
      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = 'translateY(0)')}
    >
      {/* Thumbnail */}
      <div style={{ position: 'relative', paddingBottom: '56.25%', background: 'var(--s2)', overflow: 'hidden' }}>
        {ready ? (
          <img src={ytThumb(v.id)} alt={v.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,var(--card),var(--s2))', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <svg width="40" height="33" viewBox="0 0 52 44" fill="none" opacity=".1">
              <path d="M6 30 L36 30 L46 38 L16 38 Z" fill="#2563EB" opacity=".5"/>
              <path d="M2 20 L32 20 L42 28 L12 28 Z" fill="#2563EB" opacity=".75"/>
              <path d="M0 10 L30 10 L40 18 L10 18 Z" fill="#2563EB"/>
            </svg>
            <span className="f-mono" style={{ fontSize: 8, letterSpacing: '.14em', color: 'var(--muted)', textTransform: 'uppercase' }}>Coming Soon</span>
          </div>
        )}
        <div style={{ position: 'absolute', inset: 0, background: ready ? 'rgba(8,11,20,.22)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {ready && (
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(37,99,235,.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(37,99,235,.4)' }}>
              <div style={{ width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: '13px solid #fff', marginLeft: 3 }} />
            </div>
          )}
        </div>
        <div style={{ position: 'absolute', top: 10, left: 10, fontFamily: 'JetBrains Mono, monospace', fontSize: 8, letterSpacing: '.12em', textTransform: 'uppercase', background: 'rgba(8,11,20,.85)', border: `1px solid ${v.tagColor}38`, color: v.tagColor, padding: '2px 8px' }}>{v.tag}</div>
        <div style={{ position: 'absolute', top: 10, right: 10, fontFamily: 'JetBrains Mono, monospace', fontSize: 8, letterSpacing: '.08em', color: 'var(--muted)', background: 'rgba(8,11,20,.8)', padding: '2px 7px' }}>{v.date}</div>
      </div>
      {/* Meta */}
      <div style={{ padding: '16px 18px' }}>
        <div className="f-display" style={{ fontWeight: 700, fontSize: 13.5, color: ready ? 'var(--text)' : 'var(--sub)', lineHeight: 1.3, marginBottom: 6 }}>{v.title}</div>
        <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.65 }}>{v.desc}</p>
      </div>
    </div>
  );
}

type Tab = 'channel' | 'ads';

export default function MediaPage() {
  const [tab, setTab]       = useState<Tab>('channel');
  const [filter, setFilter] = useState('All');
  const [active, setActive] = useState<VideoEntry | null>(null);

  const channelFiltered = filter === 'All'
    ? CHANNEL_VIDEOS
    : CHANNEL_VIDEOS.filter(v => v.tag === filter);

  return (
    <>
      <Navbar />
      {active && <VideoModal video={active} onClose={() => setActive(null)} />}
      <main style={{ paddingTop: 68 }}>

        {/* ── HEADER ── */}
        <div className="bg-grid" style={{ padding: 'clamp(56px,7vw,96px) clamp(16px,4vw,56px) clamp(40px,5vw,64px)', backgroundSize: '52px 52px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 40%, transparent 30%, var(--bg) 100%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto' }}>
            <div className="eyebrow" style={{ marginBottom: 14 }}>Studio & Media</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
              <h1 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(40px,6vw,80px)', letterSpacing: '-.05em', lineHeight: .9, color: 'var(--text)' }}>
                See us <span style={{ color: 'var(--blue-hi)' }}>in action.</span>
              </h1>
              <a href="https://youtube.com/@prostackng" target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm" style={{ marginBottom: 6 }}>
                ▶ Subscribe on YouTube
              </a>
            </div>
          </div>
        </div>

        {/* ── TABS ── */}
        <div style={{ background: 'var(--s1)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(16px,4vw,56px)', display: 'flex', gap: 0 }}>
            {([
              { id: 'channel' as Tab, label: 'YouTube Channel', dot: '#FF0000', count: CHANNEL_VIDEOS.length },
              { id: 'ads'     as Tab, label: 'Latest Ads',       dot: 'var(--blue)', count: AD_VIDEOS.length },
            ]).map(t => (
              <button key={t.id} onClick={() => { setTab(t.id); setFilter('All'); }} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '16px 24px', cursor: 'pointer',
                background: 'none', border: 'none',
                borderBottom: `2px solid ${tab === t.id ? 'var(--blue)' : 'transparent'}`,
                fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '.12em',
                textTransform: 'uppercase', color: tab === t.id ? 'var(--text)' : 'var(--muted)',
                transition: 'color .2s, border-color .2s',
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: t.dot, flexShrink: 0 }} />
                {t.label}
                <span style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: '1px 7px', fontSize: 9, color: 'var(--muted)' }}>
                  {t.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(36px,5vw,64px) clamp(16px,4vw,56px) clamp(64px,8vw,120px)' }}>

          {/* Channel tab */}
          {tab === 'channel' && (
            <>
              {/* Filter pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 32 }}>
                {TAGS.map(t => (
                  <button key={t} onClick={() => setFilter(t)} style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, letterSpacing: '.1em',
                    textTransform: 'uppercase', padding: '6px 16px', cursor: 'pointer',
                    background: filter === t ? 'var(--blue)' : 'transparent',
                    border: `1px solid ${filter === t ? 'var(--blue)' : 'var(--border)'}`,
                    color: filter === t ? '#fff' : 'var(--muted)',
                    transition: 'all .2s',
                  }}>
                    {t}
                    {t !== 'All' && <span style={{ marginLeft: 5, opacity: .6 }}>({CHANNEL_VIDEOS.filter(v => v.tag === t).length})</span>}
                  </button>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 1, background: 'var(--border)' }}>
                {channelFiltered.map((v, i) => (
                  <VideoCard key={i} v={v} onClick={() => v.hasVideo && v.id && setActive(v)} />
                ))}
              </div>
            </>
          )}

          {/* Ads tab */}
          {tab === 'ads' && (
            <>
              <div className="f-mono" style={{ fontSize: 9.5, letterSpacing: '.14em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 28 }}>
                Short-form promotional content produced by the ProStack NG ad team.
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 1, background: 'var(--border)' }}>
                {AD_VIDEOS.map((v, i) => (
                  <VideoCard key={i} v={v} onClick={() => v.hasVideo && v.id && setActive(v)} />
                ))}
              </div>
            </>
          )}

          {/* Subscribe CTA */}
          <div style={{ marginTop: 56, background: 'var(--card)', border: '1px solid var(--hi)', padding: 'clamp(24px,4vw,44px)', display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,#FF0000,var(--blue))' }} />
            <div>
              <div className="eyebrow" style={{ marginBottom: 8 }}>Stay Updated</div>
              <div className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(18px,2.5vw,26px)', color: 'var(--text)', letterSpacing: '-.03em' }}>
                Subscribe for demos, case studies & product updates.
              </div>
            </div>
            <a href="https://youtube.com/@prostackng" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 11, letterSpacing: '.06em', textTransform: 'uppercase', textDecoration: 'none', padding: '12px 28px', background: '#FF0000', color: '#fff', flexShrink: 0 }}>
              ▶ Subscribe on YouTube
            </a>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
