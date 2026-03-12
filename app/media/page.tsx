'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { VIDEOS, FEATURED, ytThumb, ytEmbed, VideoEntry } from '@/lib/videos';

const TAGS = ['All', 'Product Demo', 'Case Study', 'Company', 'Coming Soon', 'Roadmap'];

function VideoModal({ video, onClose }: { video: VideoEntry; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(4,5,10,.95)', backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 960, position: 'relative' }}>
        {/* Close */}
        <button onClick={onClose} style={{
          position: 'absolute', top: -44, right: 0,
          background: 'none', border: '1px solid var(--hi)',
          color: 'var(--sub)', fontFamily: 'JetBrains Mono, monospace',
          fontSize: 11, letterSpacing: '.1em', padding: '7px 16px',
          cursor: 'pointer', transition: 'color .2s, border-color .2s',
        }}>
          ESC / CLOSE
        </button>

        {/* 16:9 iframe */}
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', background: '#000' }}>
          <iframe
            src={ytEmbed(video.id)}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={video.title}
          />
        </div>

        {/* Meta below */}
        <div style={{
          background: 'var(--card)', border: '1px solid var(--hi)',
          borderTop: 'none', padding: '20px 28px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12,
        }}>
          <div>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '.14em',
              textTransform: 'uppercase', color: video.tagColor, marginBottom: 6, display: 'block',
            }}>{video.tag}</span>
            <div className="f-display" style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>{video.title}</div>
          </div>
          <a href={`https://youtube.com/watch?v=${video.id}`} target="_blank" rel="noreferrer"
            style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '.1em',
              textTransform: 'uppercase', color: 'var(--sub)', textDecoration: 'none',
              border: '1px solid var(--border)', padding: '8px 16px',
              transition: 'color .2s, border-color .2s', whiteSpace: 'nowrap',
              flexShrink: 0,
            }}>
            Open on YouTube ↗
          </a>
        </div>
      </div>
    </div>
  );
}

function VideoCard({ v, large, onClick }: { v: VideoEntry; large?: boolean; onClick: () => void }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <div
      onClick={onClick}
      style={{
        cursor: 'pointer', position: 'relative', overflow: 'hidden',
        background: 'var(--card)', border: '1px solid var(--border)',
        transition: 'border-color .2s, transform .25s',
        display: 'flex', flexDirection: 'column',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--hi)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      }}
    >
      {/* Thumbnail */}
      <div style={{ position: 'relative', paddingBottom: '56.25%', background: 'var(--s2)', overflow: 'hidden' }}>
        {!imgErr ? (
          <img
            src={ytThumb(v.id, large ? 'max' : 'hq')}
            alt={v.title}
            onError={() => setImgErr(true)}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s' }}
          />
        ) : (
          /* Fallback thumbnail if image 404s */
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(135deg, var(--card), var(--s2))`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width={large ? 80 : 48} height={large ? 67 : 40} viewBox="0 0 52 44" fill="none" opacity=".12">
              <path d="M6 30 L36 30 L46 38 L16 38 Z" fill="#2563EB" opacity=".5"/>
              <path d="M2 20 L32 20 L42 28 L12 28 Z" fill="#2563EB" opacity=".75"/>
              <path d="M0 10 L30 10 L40 18 L10 18 Z" fill="#2563EB"/>
            </svg>
          </div>
        )}

        {/* Play button overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(4,5,10,.38)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background .2s',
        }}>
          <div style={{
            width: large ? 72 : 52, height: large ? 72 : 52,
            borderRadius: '50%',
            background: 'rgba(37,99,235,.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 40px rgba(37,99,235,.5)',
            transition: 'transform .2s, box-shadow .2s',
          }}>
            <div style={{
              width: 0, height: 0,
              borderTop: `${large ? 14 : 10}px solid transparent`,
              borderBottom: `${large ? 14 : 10}px solid transparent`,
              borderLeft: `${large ? 22 : 16}px solid #fff`,
              marginLeft: large ? 5 : 3,
            }} />
          </div>
        </div>

        {/* Tag badge */}
        <div style={{
          position: 'absolute', top: 12, left: 12,
          fontFamily: 'JetBrains Mono, monospace', fontSize: 8.5,
          letterSpacing: '.14em', textTransform: 'uppercase',
          background: 'rgba(4,5,10,.85)', border: `1px solid ${v.tagColor}44`,
          color: v.tagColor, padding: '3px 10px',
        }}>
          {v.tag}
        </div>

        {/* Date */}
        <div style={{
          position: 'absolute', top: 12, right: 12,
          fontFamily: 'JetBrains Mono, monospace', fontSize: 8.5,
          letterSpacing: '.1em', color: 'var(--sub)',
          background: 'rgba(4,5,10,.8)', padding: '3px 8px',
        }}>
          {v.date}
        </div>
      </div>

      {/* Meta */}
      <div style={{ padding: large ? '24px 28px' : '18px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="f-display" style={{
          fontWeight: 700,
          fontSize: large ? 18 : 14,
          color: 'var(--text)', lineHeight: 1.25,
          marginBottom: 10,
        }}>
          {v.title}
        </div>
        <p style={{ fontSize: large ? 14 : 12.5, color: 'var(--sub)', lineHeight: 1.75, flex: 1 }}>
          {v.desc}
        </p>
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: v.tagColor, flexShrink: 0 }} />
          <span className="f-mono" style={{ fontSize: 9.5, color: 'var(--muted)', letterSpacing: '.1em', textTransform: 'uppercase' }}>
            Watch now
          </span>
        </div>
      </div>
    </div>
  );
}

export default function MediaPage() {
  const [activeTag, setActiveTag] = useState('All');
  const [active, setActive]       = useState<VideoEntry | null>(null);

  const filtered = activeTag === 'All' ? VIDEOS : VIDEOS.filter(v => v.tag === activeTag);

  return (
    <>
      <Navbar />
      {active && <VideoModal video={active} onClose={() => setActive(null)} />}

      <main style={{ paddingTop: 68 }}>

        {/* ── HERO ── */}
        <div className="bg-grid" style={{
          padding: 'clamp(64px,8vw,100px) clamp(16px,4vw,56px) 0',
          backgroundSize: '52px 52px', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 40%, transparent 30%, var(--bg) 100%)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto' }}>
            <div className="eyebrow" style={{ marginBottom: 16 }}>Studio & Media</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20, marginBottom: 48 }}>
              <h1 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(44px,6vw,88px)', letterSpacing: '-.05em', lineHeight: .9, color: 'var(--text)' }}>
                See us<br /><span style={{ color: 'var(--blue-hi)' }}>in action.</span>
              </h1>
              <a href="https://youtube.com/@prostackng" target="_blank" rel="noreferrer"
                className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-end', marginBottom: 8 }}>
                ▶ Subscribe on YouTube
              </a>
            </div>

            {/* Featured video — full width */}
            <VideoCard v={FEATURED} large onClick={() => setActive(FEATURED)} />
          </div>
        </div>

        {/* ── FILTER + GRID ── */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(48px,6vw,80px) clamp(16px,4vw,56px) clamp(64px,8vw,120px)' }}>

          {/* Tag filter */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 40 }}>
            {TAGS.map(t => (
              <button key={t} onClick={() => setActiveTag(t)} style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '.1em',
                textTransform: 'uppercase', padding: '8px 18px', cursor: 'pointer',
                background: activeTag === t ? 'var(--blue)' : 'transparent',
                border: `1px solid ${activeTag === t ? 'var(--blue)' : 'var(--border)'}`,
                color: activeTag === t ? '#fff' : 'var(--sub)',
                transition: 'all .2s',
              }}>
                {t}
                {t !== 'All' && (
                  <span style={{ marginLeft: 6, opacity: .55 }}>
                    ({VIDEOS.filter(v => v.tag === t).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px,1fr))',
            gap: 1,
            background: filtered.length > 0 ? 'var(--border)' : 'transparent',
          }}>
            {filtered.length > 0 ? (
              filtered.map(v => (
                <VideoCard key={v.id} v={v} onClick={() => setActive(v)} />
              ))
            ) : (
              <div style={{ gridColumn: '1/-1', padding: '80px 0', textAlign: 'center' }}>
                <div className="f-mono" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '.14em' }}>
                  No videos in this category yet.
                </div>
              </div>
            )}
          </div>

          {/* Subscribe CTA */}
          <div style={{
            marginTop: 64,
            background: 'var(--card)', border: '1px solid var(--hi)',
            padding: 'clamp(32px,4vw,56px)',
            display: 'flex', flexWrap: 'wrap', gap: 32,
            alignItems: 'center', justifyContent: 'space-between',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,#FF0000,var(--blue))' }} />
            <div>
              <div className="eyebrow" style={{ marginBottom: 10 }}>YouTube Channel</div>
              <div className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(20px,2.5vw,30px)', color: 'var(--text)', letterSpacing: '-.03em' }}>
                Watch demos, walkthroughs, and case studies.
              </div>
              <p style={{ fontSize: 14, color: 'var(--sub)', marginTop: 8, maxWidth: 480, lineHeight: 1.75 }}>
                Every product gets a full walkthrough video. Subscribe to stay updated as we launch new platforms.
              </p>
            </div>
            <a href="https://youtube.com/@prostackng" target="_blank" rel="noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                fontFamily: 'Syne, sans-serif', fontWeight: 700,
                fontSize: 12, letterSpacing: '.06em', textTransform: 'uppercase',
                textDecoration: 'none', padding: '14px 32px',
                background: '#FF0000', color: '#fff',
                transition: 'opacity .2s', flexShrink: 0,
              }}>
              ▶ Subscribe Now
            </a>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
