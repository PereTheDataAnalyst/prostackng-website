import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Counter from '@/components/ui/Counter';
import { TIMELINE, COMPANY_STATS } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Company',
  description: 'ProStack NG Technologies — building intelligent platforms from Port Harcourt to the world.',
};

const VALUES = [
  { icon:'◎', title:'Platform Thinking',     desc:'We don\'t build isolated products. Every system is designed as a composable piece of a larger ecosystem — shared auth, payments, analytics, and APIs from day one.' },
  { icon:'⬡', title:'African-First Design',   desc:'We build for real conditions — low bandwidth, USSD fallbacks, Naira pricing, Paystack integration, and local compliance. Our products work everywhere in Africa.' },
  { icon:'▦', title:'Technical Rigour',       desc:'Every line of code is production-grade, tested, and documented. We don\'t ship until we\'re proud of it. No shortcuts, no spaghetti, no "good enough."' },
  { icon:'⟁', title:'Radical Transparency',  desc:'No black boxes. No surprise invoices. No excuses. You see everything — code, progress, blockers — at every stage of the project.' },
];

export default function CompanyPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 80 }}>
        <div className="max-w-[1280px] mx-auto px-4 md:px-12 py-12 md:py-20 pb-20 md:pb-36">

          {/* Hero */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-start mb-16 md:mb-28">
            <div>
              <p className="font-mono text-accent mb-3" style={{ fontSize:11, letterSpacing:'.18em' }}>THE COMPANY</p>
              <h1 className="font-display font-black text-text mb-7"
                style={{ fontSize:'clamp(38px,5vw,68px)', letterSpacing:'-.04em', lineHeight:1.0 }}>
                Built in Nigeria.<br /><span className="text-accent">Scaling Africa.</span>
              </h1>
              <p className="text-sub mb-5" style={{ fontSize:16, lineHeight:1.9 }}>
                ProStack NG Technologies is a Port Harcourt-based platform company building intelligent digital infrastructure for African businesses.
                We are engineers, designers, and strategists who believe Nigerian companies deserve the same quality of software that global companies receive — not cheaper versions, not shortcuts. The real thing.
              </p>
              <p className="text-sub mb-10" style={{ fontSize:16, lineHeight:1.9 }}>
                Our model: build platform infrastructure once, then deploy multiple products on top of it. Every product we ship makes the next one faster to build and easier to scale. That's the compound advantage.
              </p>
              <Link href="/contact"
                className="bg-accent text-bg font-display font-bold hover:shadow-[0_12px_40px_rgba(0,232,122,.4)] transition-all no-underline"
                style={{ padding:'14px 36px', fontSize:13, letterSpacing:'.05em', textTransform:'uppercase' }}>
                Work With Us →
              </Link>
            </div>

            {/* Info card */}
            <div className="bg-card border border-border relative overflow-hidden" style={{ padding:48 }}>
              <div className="absolute top-0 left-6 right-6 h-0.5"
                style={{ background:'linear-gradient(90deg,#00E87A,#00C8FF,transparent)' }} />
              {[
                { label:'Founded In',    value:'Port Harcourt, Rivers State, Nigeria' },
                { label:'Team Size',     value:'8 full-time + 20+ specialist network' },
                { label:'Client Reach',  value:'Nigeria · UK · USA · Canada · Netherlands' },
                { label:'Core Sectors',  value:'Fintech · EdTech · GovTech · Nightlife · Commerce · Mobility' },
                { label:'Mission',       value:'Building intelligent platforms for Africa\'s digital economy' },
                { label:'Languages',     value:'English · French' },
                { label:'Status',        value:'Operating · CAC Registration Pending' },
              ].map((item,i,arr) => (
                <div key={i} className="py-3.5" style={{ borderBottom: i<arr.length-1?'1px solid #111D2E':'none' }}>
                  <div className="font-mono text-accent mb-1" style={{ fontSize:9.5, letterSpacing:'.12em' }}>{item.label}</div>
                  <div className="text-text font-medium" style={{ fontSize:14.5 }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid mb-28 bg-surface border border-border" style={{ gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', padding:'52px 48px' }}>
            {COMPANY_STATS.map(s => (
              <div key={s.label} className="text-center">
                <div className="font-display font-black text-accent" style={{ fontSize:'clamp(42px,5vw,64px)', lineHeight:1 }}>
                  <Counter target={s.value} suffix={s.suffix} />
                </div>
                <div className="font-mono text-muted mt-2" style={{ fontSize:10.5 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Values */}
          <div className="mb-28">
            <p className="font-mono text-accent mb-3" style={{ fontSize:11, letterSpacing:'.18em' }}>OUR VALUES</p>
            <h2 className="font-display font-black text-text mb-16" style={{ fontSize:'clamp(28px,4vw,48px)', letterSpacing:'-.03em' }}>What we stand for.</h2>
            <div className="grid gap-0.5" style={{ gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))' }}>
              {VALUES.map((v,i) => (
                <div key={i} className="bg-card border border-border hover:-translate-y-1 transition-all duration-300" style={{ padding:44 }}>
                  <div className="text-accent mb-4 font-display" style={{ fontSize:26 }}>{v.icon}</div>
                  <div className="font-display font-bold text-text mb-3" style={{ fontSize:17 }}>{v.title}</div>
                  <p className="text-sub leading-relaxed" style={{ fontSize:13.5 }}>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mission statement */}
          <div className="bg-card border border-border text-center relative overflow-hidden" style={{ padding:'72px 64px' }}>
            <div className="absolute inset-0" style={{ background:'radial-gradient(ellipse at 50% 50%,rgba(0,232,122,.04) 0%,transparent 60%)' }} />
            <div className="relative">
              <div className="font-mono text-muted mb-5" style={{ fontSize:10 }}>OUR POSITIONING</div>
              <blockquote className="font-display font-black text-text mx-auto" style={{ fontSize:'clamp(20px,3vw,34px)', lineHeight:1.3, maxWidth:780 }}>
                "ProStack NG builds scalable digital infrastructure for Africa's commerce, mobility, and intelligence ecosystem."
              </blockquote>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
