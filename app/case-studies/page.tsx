import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CASE_STUDIES } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Case Studies',
  description: 'Real problems, real solutions — ProStack NG case studies from live production projects.',
};

export default function CaseStudiesPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 80 }}>
        <div className="max-w-[1280px] mx-auto px-4 md:px-12 py-12 md:py-20 pb-20 md:pb-36">
          <p className="font-mono text-accent mb-3" style={{ fontSize:11, letterSpacing:'.18em' }}>CASE STUDIES</p>
          <h1 className="font-display font-black text-text mb-5"
            style={{ fontSize:'clamp(36px,6vw,80px)', letterSpacing:'-.04em', lineHeight:1.0 }}>
            Real problems.<br /><span className="text-accent">Real solutions.</span>
          </h1>
          <p className="text-sub mb-12 md:mb-24" style={{ fontSize:17, lineHeight:1.9, maxWidth:560 }}>
            Every case study below is a real ProStack NG build — shipped, live, and in production.
          </p>

          <div className="flex flex-col gap-0.5">
            {CASE_STUDIES.map((c,i) => (
              <div key={i}
                className="bg-card border border-border relative overflow-hidden hover:border-borderhi transition-all duration-300 grid grid-cols-1 md:grid-cols-3"
                style={{ gap:'clamp(24px,4vw,56px)', padding:'clamp(24px,4vw,56px)' }}>
                <div className="absolute top-0 left-0 bottom-0 w-0.5" style={{ background:c.color }} />

                {/* Identity + metric */}
                <div>
                  <div className="font-mono mb-3" style={{ color:c.color, fontSize:10.5 }}>{c.product}</div>
                  <h2 className="font-display font-black text-text mb-8" style={{ fontSize:'clamp(18px,2vw,24px)', lineHeight:1.2 }}>{c.title}</h2>
                  <div className="border-l-2 pl-5" style={{ borderColor:c.color }}>
                    <div className="font-display font-black" style={{ color:c.color, fontSize:'clamp(28px,3.5vw,44px)', lineHeight:1 }}>{c.metric}</div>
                    <div className="font-mono text-muted mt-1" style={{ fontSize:10 }}>{c.metricLabel}</div>
                  </div>
                  <div className="mt-6">
                    <div className="font-mono text-muted mb-1.5" style={{ fontSize:9.5 }}>CLIENT</div>
                    <div className="text-sub" style={{ fontSize:13.5 }}>{c.client}</div>
                  </div>
                </div>

                {/* Problem */}
                <div>
                  <div className="font-mono text-muted mb-3" style={{ fontSize:9.5 }}>THE PROBLEM</div>
                  <p className="text-sub leading-relaxed" style={{ fontSize:14.5 }}>{c.problem}</p>
                </div>

                {/* Solution + result */}
                <div>
                  <div className="font-mono text-muted mb-3" style={{ fontSize:9.5 }}>THE SOLUTION</div>
                  <p className="text-sub leading-relaxed mb-6" style={{ fontSize:14.5 }}>{c.solution}</p>
                  <div className="border-l-2 pl-4 py-1" style={{ borderColor:c.color }}>
                    <div className="font-mono text-muted mb-1.5" style={{ fontSize:9.5 }}>RESULT</div>
                    <p className="text-text font-semibold leading-relaxed" style={{ fontSize:13.5 }}>{c.result}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-24">
            <h3 className="font-display font-black text-text mb-4" style={{ fontSize:32 }}>Want results like these?</h3>
            <p className="text-sub mb-8" style={{ fontSize:15 }}>Tell us your problem. We'll tell you exactly how we'd solve it.</p>
            <Link href="/contact"
              className="bg-accent text-bg font-display font-bold hover:shadow-[0_12px_40px_rgba(0,232,122,.4)] transition-all no-underline"
              style={{ padding:'16px 48px', fontSize:14, letterSpacing:'.05em', textTransform:'uppercase' }}>
              Book Free Consultation →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
