import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StatusBadge from '@/components/ui/StatusBadge';
import { PRODUCTS } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Products',
  description: 'Six intelligent platforms built on one shared infrastructure — ProTrackNG, NightOps, AutoReport, MyHarriet, SwiftRide, StakeX.',
};

// Products that are live and fully visible
const LIVE_IDS = ['protrackng', 'nightops'];

export default function ProductsPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 80 }}>
        <div className="max-w-[1280px] mx-auto px-4 md:px-12 py-12 md:py-20 pb-20 md:pb-36">
          <p className="font-mono text-accent mb-3" style={{ fontSize:11, letterSpacing:'.18em' }}>PRODUCT ECOSYSTEM</p>
          <h1 className="font-display font-black text-text mb-5"
            style={{ fontSize:'clamp(42px,6vw,80px)', letterSpacing:'-.04em', lineHeight:1.0 }}>
            Six platforms.<br /><span className="text-accent">One mission.</span>
          </h1>
          <p className="text-sub mb-16 md:mb-24" style={{ fontSize:17, lineHeight:1.9, maxWidth:560 }}>
            Every ProStack NG product shares core infrastructure — auth, payments, notifications, and analytics.
            We build once. The ecosystem compounds.
          </p>

          <div className="flex flex-col gap-0.5">
            {PRODUCTS.map((p) => {
              const isLive = LIVE_IDS.includes(p.id);
              return (
                <div key={p.id} id={p.id}
                  className="bg-card border border-border relative overflow-hidden transition-all duration-300"
                  style={{
                    gridTemplateColumns:'1fr 1fr 1fr',
                    opacity: isLive ? 1 : 0.55,
                    filter: isLive ? 'none' : 'grayscale(40%)',
                  }}>
                  <div className="absolute top-0 left-0 right-0 h-0.5 opacity-70" style={{ background: p.color }} />

                  {/* Coming Soon overlay banner */}
                  {!isLive && (
                    <div className="absolute top-4 right-4 z-10">
                      <span style={{
                        fontFamily: 'DM Mono, monospace',
                        fontSize: 9,
                        letterSpacing: '.18em',
                        color: '#8899AA',
                        background: 'rgba(8,12,18,.9)',
                        border: '1px solid #1A2E48',
                        padding: '4px 10px',
                        display: 'inline-block',
                      }}>
                        COMING SOON
                      </span>
                    </div>
                  )}

                  <div className="grid gap-6 md:gap-0" style={{ padding:'clamp(28px,4vw,52px) clamp(20px,4vw,56px)', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
                    {/* Left: identity */}
                    <div>
                      <div className="flex items-start gap-4 mb-5">
                        <div className="w-14 h-14 flex items-center justify-center text-2xl border shrink-0"
                          style={{ background:`${p.color}10`, borderColor:`${p.color}22`, color: isLive ? p.color : '#445566' }}>
                          {p.icon}
                        </div>
                        <div>
                          <StatusBadge status={isLive ? p.status : 'COMING_SOON'} />
                          <div className="font-display font-black text-text mt-2" style={{ fontSize:24 }}>{p.name}</div>
                          <div className="font-mono mt-1" style={{ color: isLive ? p.color : '#445566', fontSize:10.5 }}>{p.tagline}</div>
                        </div>
                      </div>
                      <div className="font-mono text-muted mb-1.5" style={{ fontSize:9.5 }}>CATEGORY</div>
                      <div className="font-display font-semibold text-sub" style={{ fontSize:13.5 }}>{p.category}</div>
                    </div>

                    {/* Middle: description + features */}
                    <div>
                      <p className="text-sub leading-relaxed mb-6" style={{ fontSize:14.5 }}>
                        {isLive ? p.desc : 'This product is currently in development. Join our waitlist to be notified when it launches.'}
                      </p>
                      {isLive && (
                        <>
                          <div className="font-mono text-muted mb-3" style={{ fontSize:9.5 }}>KEY FEATURES</div>
                          {p.metrics.map((m,j) => (
                            <div key={j} className="flex gap-2.5 items-start mb-2.5">
                              <span className="font-bold mt-0.5" style={{ color:p.color, fontSize:11 }}>→</span>
                              <span className="text-sub" style={{ fontSize:13.5 }}>{m}</span>
                            </div>
                          ))}
                        </>
                      )}
                      {!isLive && (
                        <div className="flex items-center gap-2 mt-2">
                          <span style={{ width:6, height:6, borderRadius:'50%', background:'#445566', display:'inline-block' }} />
                          <span className="font-mono text-muted" style={{ fontSize:10.5 }}>IN DEVELOPMENT</span>
                        </div>
                      )}
                    </div>

                    {/* Right: stack + domain */}
                    <div>
                      <div className="font-mono text-muted mb-3" style={{ fontSize:9.5 }}>TECH STACK</div>
                      <div className="flex flex-wrap gap-2 mb-8">
                        {p.stack.map(t => (
                          <span key={t} className="font-mono border"
                            style={{ padding:'4px 10px', background:`${isLive ? p.color : '#445566'}08`, borderColor:`${isLive ? p.color : '#445566'}22`, color: isLive ? p.color : '#445566', fontSize:11 }}>
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="font-mono text-muted mb-1.5" style={{ fontSize:9.5 }}>DOMAIN</div>
                      <div className="font-mono text-sub" style={{ fontSize:12 }}>{p.domain}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-16 md:mt-24">
            <p className="text-sub mb-7" style={{ fontSize:15 }}>Building a product and need a technical partner?</p>
            <a href="/contact"
              className="bg-accent text-bg font-display font-bold hover:shadow-[0_12px_40px_rgba(0,232,122,.4)] transition-all no-underline inline-block"
              style={{ padding:'16px 48px', fontSize:14, letterSpacing:'.05em', textTransform:'uppercase' }}>
              Discuss Your Project →
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
