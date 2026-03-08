import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StatusBadge from '@/components/ui/StatusBadge';
import { PRODUCTS } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Products',
  description: 'Six intelligent platforms built on one shared infrastructure — ProTrackNG, NightOps, AutoReport, MyHarriet, SwiftRide, StakeX.',
};

export default function ProductsPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 80 }}>
        <div className="max-w-[1280px] mx-auto px-12 py-20 pb-36">
          <p className="font-mono text-accent mb-3" style={{ fontSize:11, letterSpacing:'.18em' }}>PRODUCT ECOSYSTEM</p>
          <h1 className="font-display font-black text-text mb-5"
            style={{ fontSize:'clamp(42px,6vw,80px)', letterSpacing:'-.04em', lineHeight:1.0 }}>
            Six platforms.<br /><span className="text-accent">One mission.</span>
          </h1>
          <p className="text-sub mb-24" style={{ fontSize:17, lineHeight:1.9, maxWidth:560 }}>
            Every ProStack NG product shares core infrastructure — auth, payments, notifications, and analytics.
            We build once. The ecosystem compounds.
          </p>

          <div className="flex flex-col gap-0.5">
            {PRODUCTS.map((p, i) => (
              <div key={p.id} id={p.id}
                className="bg-card border border-border grid relative overflow-hidden hover:border-borderhi transition-all duration-300"
                style={{ gridTemplateColumns:'1fr 1fr 1fr', gap:56, padding:'52px 56px' }}>
                <div className="absolute top-0 left-0 right-0 h-0.5 opacity-70" style={{ background:p.color }} />

                {/* Left: identity */}
                <div>
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-14 h-14 flex items-center justify-center text-2xl border shrink-0"
                      style={{ background:`${p.color}10`, borderColor:`${p.color}22`, color:p.color }}>
                      {p.icon}
                    </div>
                    <div>
                      <StatusBadge status={p.status} />
                      <div className="font-display font-black text-text mt-2" style={{ fontSize:24 }}>{p.name}</div>
                      <div className="font-mono mt-1" style={{ color:p.color, fontSize:10.5 }}>{p.tagline}</div>
                    </div>
                  </div>
                  <div className="font-mono text-muted mb-1.5" style={{ fontSize:9.5 }}>CATEGORY</div>
                  <div className="font-display font-semibold text-sub" style={{ fontSize:13.5 }}>{p.category}</div>
                </div>

                {/* Middle: description + metrics */}
                <div>
                  <p className="text-sub leading-relaxed mb-6" style={{ fontSize:14.5 }}>{p.desc}</p>
                  <div className="font-mono text-muted mb-3" style={{ fontSize:9.5 }}>KEY FEATURES</div>
                  {p.metrics.map((m,j) => (
                    <div key={j} className="flex gap-2.5 items-start mb-2.5">
                      <span className="font-bold mt-0.5" style={{ color:p.color, fontSize:11 }}>→</span>
                      <span className="text-sub" style={{ fontSize:13.5 }}>{m}</span>
                    </div>
                  ))}
                </div>

                {/* Right: stack + domain */}
                <div>
                  <div className="font-mono text-muted mb-3" style={{ fontSize:9.5 }}>TECH STACK</div>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {p.stack.map(t => (
                      <span key={t} className="font-mono border"
                        style={{ padding:'4px 10px', background:`${p.color}08`, borderColor:`${p.color}22`, color:p.color, fontSize:11 }}>
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="font-mono text-muted mb-1.5" style={{ fontSize:9.5 }}>DOMAIN</div>
                  <div className="font-mono text-sub" style={{ fontSize:12 }}>{p.domain}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-24">
            <p className="text-sub mb-7" style={{ fontSize:15 }}>Building a product and need a technical partner?</p>
            <Link href="/contact"
              className="bg-accent text-bg font-display font-bold hover:shadow-[0_12px_40px_rgba(0,232,122,.4)] transition-all no-underline"
              style={{ padding:'16px 48px', fontSize:14, letterSpacing:'.05em', textTransform:'uppercase' }}>
              Discuss Your Project →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
