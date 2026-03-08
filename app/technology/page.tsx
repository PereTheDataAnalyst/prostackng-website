import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { STACK, SHARED_SERVICES } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Technology',
  description: 'The standardised tech stack and shared infrastructure that powers every ProStack NG product.',
};

export default function TechnologyPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 80 }}>
        <div className="max-w-[1280px] mx-auto px-12 py-20 pb-36">
          <p className="font-mono text-accent mb-3" style={{ fontSize:11, letterSpacing:'.18em' }}>TECHNOLOGY</p>
          <h1 className="font-display font-black text-text mb-5"
            style={{ fontSize:'clamp(42px,6vw,80px)', letterSpacing:'-.04em', lineHeight:1.0 }}>
            The stack behind<br /><span className="text-accent">everything we build.</span>
          </h1>
          <p className="text-sub mb-24" style={{ fontSize:17, lineHeight:1.9, maxWidth:580 }}>
            We standardise our entire stack across every product. Every new service inherits battle-tested infrastructure —
            no reinventing auth, no rebuilding payment flows. Just shipping.
          </p>

          {/* Stack grid */}
          <div className="grid gap-0.5 mb-24" style={{ gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))' }}>
            {STACK.map((layer, i) => (
              <div key={i} className="bg-card border border-border" style={{ padding:40 }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8" style={{ background:layer.color }} />
                  <div className="font-display font-bold text-text" style={{ fontSize:15 }}>{layer.label}</div>
                </div>
                <div className="flex flex-col gap-2.5">
                  {layer.items.map(t => (
                    <div key={t} className="flex items-center gap-3 border border-border bg-surface"
                      style={{ padding:'10px 14px' }}>
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background:layer.color }} />
                      <span className="text-sub font-medium" style={{ fontSize:14 }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Shared infrastructure */}
          <div className="bg-card border border-border relative overflow-hidden mb-20" style={{ padding:'60px 56px' }}>
            <div className="absolute top-0 left-0 right-0 h-0.5"
              style={{ background:'linear-gradient(90deg,#00E87A,#00C8FF,#A78BFA,transparent)' }} />
            <p className="font-mono text-accent mb-3" style={{ fontSize:11, letterSpacing:'.18em' }}>SHARED PLATFORM ARCHITECTURE</p>
            <h2 className="font-display font-bold text-text mb-2" style={{ fontSize:28 }}>
              One infrastructure. Every product.
            </h2>
            <p className="text-sub mb-10" style={{ fontSize:14.5, lineHeight:1.8, maxWidth:540 }}>
              Instead of rebuilding the same systems for each product, every ProStack NG platform shares core services.
              Think Google — one account works across Gmail, YouTube, and Drive. Same concept.
            </p>
            <div className="grid gap-3" style={{ gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))' }}>
              {SHARED_SERVICES.map((s,i) => (
                <div key={i} className="border-l-2 pl-4 bg-surface border border-border"
                  style={{ borderLeftColor:s.color, padding:'18px 20px', borderLeft:`3px solid ${s.color}` }}>
                  <div className="font-mono mb-2" style={{ color:s.color, fontSize:10.5 }}>{s.subdomain}</div>
                  <div className="text-sub" style={{ fontSize:13 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Domain strategy */}
          <div className="bg-card border border-border" style={{ padding:'48px 56px' }}>
            <p className="font-mono text-accent mb-3" style={{ fontSize:11, letterSpacing:'.18em' }}>DOMAIN STRATEGY</p>
            <h2 className="font-display font-bold text-text mb-8" style={{ fontSize:24 }}>
              A domain for every product. One parent brand.
            </h2>
            <div className="grid gap-3" style={{ gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))' }}>
              {[
                { domain:'prostackng.com',                 label:'Parent Company',    color:'#00E87A' },
                { domain:'protrackng.com',                 label:'ProTrackNG',        color:'#00E87A' },
                { domain:'myharriet.com',                  label:'MyHarriet',         color:'#F5B530' },
                { domain:'swiftride.com',                  label:'SwiftRide',         color:'#00C8FF' },
                { domain:'stakex.com',                     label:'StakeX',            color:'#FF9500' },
                { domain:'nightops.prostackng.com',        label:'NightOps',          color:'#A78BFA' },
                { domain:'auth.prostackng.com',            label:'Auth Service',      color:'#445566' },
                { domain:'api.prostackng.com',             label:'API Gateway',       color:'#445566' },
                { domain:'analytics.prostackng.com',      label:'Umami Analytics',   color:'#445566' },
              ].map(d => (
                <div key={d.domain} className="border border-border bg-surface" style={{ padding:'14px 18px' }}>
                  <div className="font-mono mb-1" style={{ color:d.color, fontSize:10.5 }}>{d.domain}</div>
                  <div className="text-muted" style={{ fontSize:12 }}>{d.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
