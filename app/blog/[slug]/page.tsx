import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { POSTS } from '@/lib/blog-data';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return POSTS.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = POSTS.find(p => p.slug === params.slug);
  if (!post) return {};
  return { title: `${post.title} — ProStack NG`, description: post.excerpt };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post  = POSTS.find(p => p.slug === params.slug);
  if (!post) notFound();

  const idx   = POSTS.indexOf(post);
  const next  = POSTS[idx + 1];
  const prev  = POSTS[idx - 1];

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 68 }}>

        {/* ── HERO ── */}
        <div className="bg-grid" style={{ padding: 'clamp(56px,7vw,96px) clamp(16px,4vw,56px) clamp(36px,5vw,56px)', backgroundSize: '52px 52px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 90% 70% at 50% 40%, transparent 30%, var(--bg) 100%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto' }}>
            <Link href="/blog" className="f-mono" style={{ fontSize: 9.5, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
              ← All Posts
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8.5, letterSpacing: '.16em', textTransform: 'uppercase', color: post.categoryColor, background: `${post.categoryColor}10`, border: `1px solid ${post.categoryColor}25`, padding: '3px 9px' }}>
                {post.category}
              </span>
              <span className="f-mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.08em' }}>{post.date}</span>
              <span className="f-mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.08em' }}>{post.readTime}</span>
            </div>
            <h1 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(28px,4vw,52px)', letterSpacing: '-.04em', lineHeight: 1.05, color: 'var(--text)', marginBottom: 20 }}>
              {post.title}
            </h1>
            <p style={{ fontSize: 17, color: 'var(--sub)', lineHeight: 1.85 }}>{post.excerpt}</p>
          </div>
        </div>

        {/* ── AUTHOR BAR ── */}
        <div style={{ background: 'var(--s1)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', padding: '16px clamp(16px,4vw,56px)', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 13, color: '#fff', flexShrink: 0 }}>
                {post.author[0]}
              </div>
              <div>
                <div style={{ fontSize: 13.5, color: 'var(--text)', fontWeight: 600 }}>{post.author}</div>
                <div className="f-mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.08em' }}>{post.authorRole}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://prostackng.com/blog/${post.slug}`)}`} target="_blank" rel="noreferrer"
                style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', textDecoration: 'none', border: '1px solid var(--border)', padding: '6px 12px', transition: 'color .2s, border-color .2s' }}>
                Share on 𝕏
              </a>
              <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`https://prostackng.com/blog/${post.slug}`)}&title=${encodeURIComponent(post.title)}`} target="_blank" rel="noreferrer"
                style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', textDecoration: 'none', border: '1px solid var(--border)', padding: '6px 12px' }}>
                Share on LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div style={{ maxWidth: 800, margin: '0 auto', padding: 'clamp(40px,6vw,72px) clamp(16px,4vw,56px)' }}>
          <div
            className="prose-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
            style={{ fontSize: 16, color: 'var(--sub)', lineHeight: 1.9 }}
          />

          {/* Inline CTA */}
          <div style={{ margin: '52px 0', background: 'var(--card)', border: '1px solid var(--hi)', padding: '28px 32px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: post.categoryColor }} />
            <div className="f-display" style={{ fontWeight: 800, fontSize: 20, color: 'var(--text)', marginBottom: 10, letterSpacing: '-.02em' }}>
              Ready to see it live?
            </div>
            <p style={{ fontSize: 14, color: 'var(--sub)', lineHeight: 1.75, marginBottom: 20 }}>
              Book a free 45-minute demo. We&apos;ll show you the product with your actual data, answer every question, and only recommend a plan if it fits your business.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link href="/demo" className="btn btn-primary btn-sm">Book a Free Demo →</Link>
              <Link href="/pricing" className="btn btn-ghost btn-sm">View Pricing</Link>
            </div>
          </div>
        </div>

        {/* ── PREV / NEXT ── */}
        {(prev || next) && (
          <div style={{ background: 'var(--s1)', borderTop: '1px solid var(--border)' }}>
            <div style={{ maxWidth: 800, margin: '0 auto', padding: 'clamp(32px,4vw,52px) clamp(16px,4vw,56px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 1, background: 'var(--border)' }}>
              {prev && (
                <Link href={`/blog/${prev.slug}`} style={{ background: 'var(--card)', padding: '24px 28px', textDecoration: 'none', display: 'block' }}>
                  <div className="f-mono" style={{ fontSize: 8.5, letterSpacing: '.12em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 10 }}>← Previous</div>
                  <div className="f-display" style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', lineHeight: 1.3 }}>{prev.title}</div>
                </Link>
              )}
              {next && (
                <Link href={`/blog/${next.slug}`} style={{ background: 'var(--card)', padding: '24px 28px', textDecoration: 'none', display: 'block', textAlign: prev ? 'right' : 'left' }}>
                  <div className="f-mono" style={{ fontSize: 8.5, letterSpacing: '.12em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 10 }}>Next →</div>
                  <div className="f-display" style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', lineHeight: 1.3 }}>{next.title}</div>
                </Link>
              )}
            </div>
          </div>
        )}

      </main>
      <Footer />
    </>
  );
}
