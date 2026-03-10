import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Ticker from '@/components/Ticker';
import StatusBadge from '@/components/ui/StatusBadge';
import Counter from '@/components/ui/Counter';
import { PRODUCTS, CASE_STUDIES, TIMELINE, COMPANY_STATS } from '@/lib/data';

export default function HomePage() {
  const liveProducts = PRODUCTS.filter(p => p.status === 'LIVE').slice(0, 1)[0];

  return (
    <>
      <Navbar />
      <main>

        {/* ══ HERO ══════════════════════════════════════════════════ */}
        <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-grid bg-grid pt-16"
          style={{ backgroundSize: '80px 80px' }}>
          {/* Ambient glow */}
          <div className="absolute pointer-events-none"
            style={{ top:'8%',left:'4%',width:500,height:500,background:'radial-gradient(circle,rgba(0,232,122,.07) 0%,transparent 65%)' }} />
          <div className="absolute pointer-events-none"
            style={{ bottom:'8%',right:'4%',width:600,height:600,background:'radial-gradient(circle,rgba(0,200,255,.04) 0%,transparent 65%)' }} />
          {/* Scan line */}
          <div className="absolute left-0 right-0 h-px pointer-events-none animate-scan"
            style={{ background:'linear-gradient(90deg,transparent 0%,rgba(0,232,122,.35) 50%,transparent 100%)' }} />

          <div className="max-w-[1280px] mx-auto w-full px-4 md:px-12 py-12 md:py-20 relative">
            {/* Eyebrow */}
            <div className="flex items-center gap-2.5 mb-8 animate-fadeUp">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="font-mono text-accent" style={{ fontSize:11, letterSpacing:'.18em' }}>
                BUILDING AFRICA'S DIGITAL INFRASTRUCTURE
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display font-black text-text animate-fadeUp"
              style={{ fontSize:'clamp(52px,7.5vw,106px)', letterSpacing:'-.04em', lineHeight:1.0, maxWidth:980 }}>
              Platform-first<br />
              <span className="shimmer-text">technology</span><br />
              for Africa.
            </h1>

            <p className="text-sub animate-fadeUp mt-9 mb-12"
              style={{ fontSize:'clamp(15px,1.6vw,19px)', lineHeight:1.85, maxWidth:560, animationDelay:'.1s' }}>
              ProStack NG builds intelligent digital platforms — from tender intelligence and nightlife operating systems to marketplace commerce and ride-hailing.
              One ecosystem. Multiple products. Serious infrastructure.
            </p>

            <div className="flex flex-wrap gap-3.5 animate-fadeUp" style={{ animationDelay:'.2s' }}>
              <Link href="/products"
                className="bg-accent text-bg font-display font-bold hover:shadow-[0_12px_40px_rgba(0,232,122,.4)] transition-all duration-200 no-underline"
                style={{ padding:'15px 36px', fontSize:13, letterSpacing:'.05em', textTransform:'uppercase' }}>
                Explore Products →
              </Link>
              <Link href="/case-studies"
                className="border border-borderhi text-sub hover:border-accent hover:text-accent transition-all duration-200 font-display font-semibold no-underline"
                style={{ padding:'15px 36px', fontSize:13, letterSpacing:'.05em', textTransform:'uppercase' }}>
                View Case Studies
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-12 mt-20 animate-fadeUp" style={{ animationDelay:'.3s' }}>
              {COMPANY_STATS.map(s => (
                <div key={s.label}>
                  <div className="font-display font-black text-text" style={{ fontSize:'clamp(36px,4vw,54px)', lineHeight:1 }}>
                    <Counter target={s.value} suffix={s.suffix} />
                  </div>
                  <div className="font-mono text-muted mt-1.5" style={{ fontSize:10.5, letterSpacing:'.1em' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating product card — desktop only */}
          <div className="absolute right-12 top-1/2 -translate-y-1/2 w-64 hidden lg:block animate-float">
            <div className="bg-card border border-border relative overflow-hidden" style={{ padding:28 }}>
              <div className="absolute top-0 left-0 right-0 h-0.5"
                style={{ background:`linear-gradient(90deg,${liveProducts.color},transparent)` }} />
              <div className="flex justify-between items-start mb-4">
                <StatusBadge status="LIVE" />
                <span className="font-mono text-muted" style={{ fontSize:9.5 }}>ACTIVE</span>
              </div>
              <div className="font-display font-bold text-text mb-1" style={{ fontSize:17 }}>{liveProducts.name}</div>
              <div className="font-mono mb-4" style={{ color:liveProducts.color, fontSize:10 }}>{liveProducts.tagline}</div>
              {liveProducts.metrics.map((m,i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <span className="text-accent font-bold" style={{ fontSize:9 }}>✓</span>
                  <span className="text-sub" style={{ fontSize:11.5 }}>{m}</span>
                </div>
              ))}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {liveProducts.stack.slice(0,3).map(t => (
                  <span key={t} className="font-mono border"
                    style={{ padding:'2px 7px', background:'rgba(0,232,122,.05)', borderColor:'rgba(0,232,122,.15)', color:'#00E87A', fontSize:9.5 }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Ticker />

        {/* ══ PRODUCTS GRID ══════════════════════════════════════════ */}
        <section className="max-w-[1280px] mx-auto px-4 md:px-12 py-16 md:py-28">
          <div className="flex justify-between items-end mb-16 flex-wrap gap-5">
            <div>
              <p className="font-mono text-accent mb-3" style={{ fontSize:11, letterSpacing:'.18em' }}>PRODUCT ECOSYSTEM</p>
              <h2 className="font-display font-black text-text" style={{ fontSize:'clamp(30px,4vw,52px)', letterSpacing:'-.03em' }}>
                Six platforms.<br />One infrastructure.
              </h2>
            </div>
            <Link href="/products"
              className="border border-borderhi text-sub hover:border-accent hover:text-accent transition-all font-display font-semibold no-underline"
              style={{ padding:'11px 24px', fontSize:12, letterSpacing:'.05em', textTransform:'uppercase' }}>
              All Products →
            </Link>
          </div>

          <div className="grid gap-0.5" style={{ gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))' }}>
            {PRODUCTS.map(p => (
              <div key={p.id} className="bg-card border border-border hover:-translate-y-1 transition-all duration-300 hover:border-borderhi relative overflow-hidden"
                style={{ '--prod-color':p.color } as React.CSSProperties}>
                <div className="absolute top-0 left-0 right-0 h-0.5 opacity-70"
                  style={{ background: p.color }} />
                <div style={{ padding:40 }}>
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 flex items-center justify-center font-display font-bold text-xl border"
                      style={{ background:`${p.color}12`, borderColor:`${p.color}25`, color:p.color }}>
                      {p.icon}
                    </div>
                    <StatusBadge status={p.status} />
                  </div>
                  <div className="font-display font-bold text-text mb-1" style={{ fontSize:20 }}>{p.name}</div>
                  <div className="font-mono mb-4" style={{ color:p.color, fontSize:10.5 }}>{p.tagline}</div>
                  <p className="text-sub leading-relaxed mb-5" style={{ fontSize:13.5 }}>
                    {p.desc.slice(0,110)}...
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.stack.slice(0,3).map(t => (
                      <span key={t} className="font-mono border border-border text-muted"
                        style={{ padding:'2px 8px', background:'rgba(0,232,122,.04)', fontSize:11 }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ CASE STUDIES ══════════════════════════════════════════ */}
        <section className="bg-surface border-t border-border py-28">
          <div className="max-w-[1280px] mx-auto px-4 md:px-12">
            <div className="flex justify-between items-end mb-16 flex-wrap gap-5">
              <div>
                <p className="font-mono text-accent mb-3" style={{ fontSize:11, letterSpacing:'.18em' }}>CASE STUDIES</p>
                <h2 className="font-display font-black text-text" style={{ fontSize:'clamp(30px,4vw,52px)', letterSpacing:'-.03em' }}>
                  Results that speak.
                </h2>
              </div>
              <Link href="/case-studies"
                className="border border-borderhi text-sub hover:border-accent hover:text-accent transition-all font-display font-semibold no-underline"
                style={{ padding:'11px 24px', fontSize:12, letterSpacing:'.05em', textTransform:'uppercase' }}>
                All Case Studies →
              </Link>
            </div>

            <div className="grid gap-0.5" style={{ gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))' }}>
              {CASE_STUDIES.map((c,i) => (
                <div key={i} className="bg-card border border-border relative overflow-hidden hover:-translate-y-1 transition-all duration-300"
                  style={{ padding:44 }}>
                  <div className="absolute top-0 left-0 bottom-0 w-0.5" style={{ background:c.color }} />
                  <div className="font-mono mb-4" style={{ color:c.color, fontSize:10.5 }}>{c.product}</div>
                  <h3 className="font-display font-bold text-text mb-5" style={{ fontSize:'clamp(17px,2vw,22px)', lineHeight:1.2 }}>
                    {c.title}
                  </h3>
                  <div className="mb-4">
                    <div className="font-mono text-muted mb-2" style={{ fontSize:9.5 }}>PROBLEM</div>
                    <p className="text-sub leading-relaxed" style={{ fontSize:13.5 }}>{c.problem}</p>
                  </div>
                  <div className="mt-5 border-l-2 pl-4" style={{ borderColor:c.color }}>
                    <div className="font-mono text-muted mb-2" style={{ fontSize:9.5 }}>RESULT</div>
                    <p className="text-text font-semibold leading-relaxed" style={{ fontSize:13.5 }}>{c.result}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ ROADMAP ═══════════════════════════════════════════════ */}
        <section className="max-w-[1280px] mx-auto px-4 md:px-12 py-16 md:py-28">
          <p className="font-mono text-accent mb-3" style={{ fontSize:11, letterSpacing:'.18em' }}>COMPANY ROADMAP</p>
          <h2 className="font-display font-black text-text mb-16" style={{ fontSize:'clamp(30px,4vw,52px)', letterSpacing:'-.03em' }}>
            Where we're going.
          </h2>

          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-px hidden md:block"
              style={{ background:'linear-gradient(180deg,#00E87A,#111D2E,transparent)' }} />
            {TIMELINE.map((t, i) => (
              <div key={i} className="flex gap-10 mb-10 md:pl-8 relative">
                <div className="absolute -left-1 top-1.5 w-2.5 h-2.5 rounded-full hidden md:block"
                  style={{
                    background:   t.status==='active' ? '#00E87A' : '#111D2E',
                    border:       `2px solid ${t.status==='active'?'#00E87A':'#445566'}`,
                    boxShadow:    t.status==='active' ? '0 0 10px #00E87A' : 'none',
                  }} />
                <div style={{ minWidth:110 }}>
                  <div className="font-display font-bold" style={{ fontSize:13, color:t.status==='active'?'#00E87A':'#445566' }}>{t.phase}</div>
                  <div className="font-mono text-muted" style={{ fontSize:9.5 }}>{t.period}</div>
                </div>
                <div className="flex-1 border p-4"
                  style={{
                    background:   t.status==='active' ? 'rgba(0,232,122,.03)' : '#0C1220',
                    borderColor:  t.status==='active' ? 'rgba(0,232,122,.2)'  : '#111D2E',
                  }}>
                  <p className="leading-relaxed" style={{ fontSize:14.5, color:t.status==='active'?'#E2EAF4':'#8899AA' }}>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ FINAL CTA ═════════════════════════════════════════════ */}
        <section className="relative py-36 text-center overflow-hidden bg-grid" style={{ backgroundSize:'80px 80px' }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background:'radial-gradient(ellipse at 50% 50%,rgba(0,232,122,.06) 0%,transparent 60%)' }} />
          <div className="relative max-w-[700px] mx-auto px-4 md:px-12">
            <p className="font-mono text-accent mb-3" style={{ fontSize:11, letterSpacing:'.18em' }}>LET'S BUILD TOGETHER</p>
            <h2 className="font-display font-black text-text mb-6"
              style={{ fontSize:'clamp(40px,6vw,80px)', letterSpacing:'-.04em', lineHeight:1.0 }}>
              Ready to build<br /><span className="text-accent">something real?</span>
            </h2>
            <p className="text-sub mb-14" style={{ fontSize:17, lineHeight:1.9 }}>
              Free 45-minute strategy session. No commitment — just honest answers and a clear plan for whatever you need built.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact"
                className="bg-accent text-bg font-display font-bold hover:shadow-[0_12px_40px_rgba(0,232,122,.4)] transition-all no-underline"
                style={{ padding:'16px 44px', fontSize:14, letterSpacing:'.05em', textTransform:'uppercase' }}>
                Start a Project →
              </Link>
              <a href="https://wa.me/2347059449360" target="_blank" rel="noreferrer"
                className="border border-borderhi text-sub hover:border-accent hover:text-accent transition-all font-display font-semibold no-underline"
                style={{ padding:'16px 44px', fontSize:14, letterSpacing:'.05em', textTransform:'uppercase' }}>
                💬 WhatsApp Us
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />

      {/* WhatsApp FAB */}
      <a href="https://wa.me/2347059449360" target="_blank" rel="noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center text-2xl z-50 no-underline"
        style={{ background:'#25D366', boxShadow:'0 4px 20px rgba(37,211,102,.45)' }}>
        💬
      </a>
    </>
  );
}

