'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { POSTS, FEATURED_POST, CATEGORIES } from '@/lib/blog-data';
import type { Post } from '@/lib/blog-data';

function PostCard({ post, featured }: { post: Post; featured?: boolean }) {
  return (
    <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', background: 'var(--card)', overflow: 'hidden', position: 'relative', transition: 'transform .25s' }}
      onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: featured ? 2 : 1, background: post.categoryColor }} />

      {/* Category + date */}
      <div style={{ padding: featured ? '28px 32px 0' : '22px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8.5, letterSpacing: '.16em', textTransform: 'uppercase', color: post.categoryColor, background: `${post.categoryColor}10`, border: `1px solid ${post.categoryColor}25`, padding: '3px 9px' }}>
          {post.category}
        </span>
        <span className="f-mono" style={{ fontSize: 9, letterSpacing: '.08em', color: 'var(--muted)' }}>{post.date}</span>
      </div>

      {/* Title */}
      <div style={{ padding: featured ? '20px 32px' : '14px 24px', flex: 1 }}>
        <h2 className="f-display" style={{ fontWeight: 800, fontSize: featured ? 'clamp(18px,2.2vw,26px)' : 15, letterSpacing: '-.03em', color: 'var(--text)', lineHeight: 1.2, marginBottom: 10 }}>
          {post.title}
        </h2>
        <p style={{ fontSize: featured ? 14.5 : 13, color: 'var(--sub)', lineHeight: 1.8 }}>{post.excerpt}</p>
      </div>

      {/* Footer */}
      <div style={{ padding: featured ? '16px 32px 24px' : '12px 24px 20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 12.5, color: 'var(--text)', fontWeight: 500 }}>{post.author}</div>
          <div className="f-mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.08em', marginTop: 2 }}>{post.authorRole}</div>
        </div>
        <span className="f-mono" style={{ fontSize: 9, letterSpacing: '.1em', color: 'var(--muted)', background: 'var(--s2)', border: '1px solid var(--border)', padding: '3px 9px' }}>
          {post.readTime}
        </span>
      </div>
    </Link>
  );
}

export default function BlogPage() {
  const [cat, setCat] = useState('All');
  const filtered = cat === 'All' ? POSTS : POSTS.filter(p => p.category === cat);

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 68 }}>

        {/* Header */}
        <div className="bg-grid" style={{ padding: 'clamp(56px,7vw,96px) clamp(16px,4vw,56px) clamp(40px,5vw,64px)', backgroundSize: '52px 52px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 40%, transparent 30%, var(--bg) 100%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto' }}>
            <div className="eyebrow" style={{ marginBottom: 14 }}>Insights</div>
            <h1 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(44px,7vw,96px)', letterSpacing: '-.05em', lineHeight: .9, color: 'var(--text)', marginBottom: 18 }}>
              We write about<br /><span style={{ color: 'var(--blue-hi)' }}>what we know.</span>
            </h1>
            <p style={{ fontSize: 16, color: 'var(--sub)', lineHeight: 1.85, maxWidth: 520 }}>
              Industry analysis, product thinking, and honest dispatches from building Africa's digital infrastructure — from Port Harcourt.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(40px,5vw,72px) clamp(16px,4vw,56px) clamp(64px,8vw,120px)' }}>

          {/* Featured */}
          <div style={{ marginBottom: 48 }}>
            <div className="f-mono" style={{ fontSize: 9, letterSpacing: '.16em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 14 }}>Featured Post</div>
            <PostCard post={FEATURED_POST} featured />
          </div>

          {/* Category filter */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 32 }}>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCat(c)} style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, letterSpacing: '.1em',
                textTransform: 'uppercase', padding: '6px 16px', cursor: 'pointer',
                background: cat === c ? 'var(--blue)' : 'transparent',
                border: `1px solid ${cat === c ? 'var(--blue)' : 'var(--border)'}`,
                color: cat === c ? '#fff' : 'var(--muted)', transition: 'all .2s',
              }}>{c}</button>
            ))}
          </div>

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 1, background: 'var(--border)' }}>
            {filtered.map(p => <PostCard key={p.slug} post={p} />)}
          </div>

          {/* Newsletter CTA */}
          <div style={{ marginTop: 64, background: 'var(--card)', border: '1px solid var(--hi)', padding: 'clamp(28px,4vw,48px)', display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'center', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, var(--blue), #06B6D4)' }} />
            <div>
              <div className="eyebrow" style={{ marginBottom: 10 }}>Newsletter</div>
              <div className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(18px,2.5vw,28px)', color: 'var(--text)', letterSpacing: '-.03em' }}>
                New posts, straight to your inbox.
              </div>
              <p style={{ fontSize: 13.5, color: 'var(--sub)', marginTop: 8 }}>One email per week. No noise. Unsubscribe any time.</p>
            </div>
            <Link href="/contact" className="btn btn-primary">Subscribe →</Link>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
