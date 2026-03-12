import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Client Testimonials — ProStack NG',
  description: 'What clients say about AutoReport, ProTrackNG, and NightOps.',
};

const TESTIMONIALS = [
  {
    quote: 'Before AutoReport, my Monday mornings were consumed by report formatting. Now the MD has everything in their inbox before they wake up. I cannot imagine going back.',
    name: 'Operations Manager',
    company: 'Oil & Gas Services Company, Port Harcourt',
    product: 'AutoReport',
    productColor: '#FF5757',
    metric: '3hrs → 0',
    metricLabel: 'Morning reporting time',
  },
  {
    quote: 'We were missing tenders because nobody had time to check the portals every day. ProTrackNG alerts us the moment anything relevant goes up. We\'ve never been better positioned.',
    name: 'Business Development Director',
    company: 'Marine & Logistics Company, PH',
    product: 'ProTrackNG',
    productColor: '#06B6D4',
    metric: '400+',
    metricLabel: 'Portals monitored',
  },
  {
    quote: 'Reconciliation used to be a nightmare. Two bartenders, three tills, and a spreadsheet at midnight. NightOps made that a five-minute job. The accuracy is unreal.',
    name: 'General Manager',
    company: 'Entertainment Venue, Port Harcourt',
    product: 'NightOps',
    productColor: '#A78BFA',
    metric: '5min',
    metricLabel: 'Nightly reconciliation',
  },
  {
    quote: 'What impressed me was that they didn\'t just build what we asked for. They understood the problem better than we did and built the right solution. That\'s rare.',
    name: 'CEO',
    company: 'Consulting Firm, Abuja',
    product: 'AutoReport',
    productColor: '#FF5757',
    metric: '14 days',
    metricLabel: 'Deployment to live',
  },
  {
    quote: 'The realtime dashboard is something our previous system couldn\'t dream of. I can see tonight\'s revenue from my phone while I\'m at home. That changes everything.',
    name: 'Owner',
    company: 'Lounge & Event Space, Rivers State',
    product: 'NightOps',
    productColor: '#A78BFA',
    metric: '100%',
    metricLabel: 'Ops digitised',
  },
  {
    quote: 'They set up ProTrackNG in less than a week and the first relevant tender alert came through within 48 hours. We\'ve already recovered the subscription cost ten times over.',
    name: 'Managing Director',
    company: 'Engineering & Procurement Company, PH',
    product: 'ProTrackNG',
    productColor: '#06B6D4',
    metric: '10×',
    metricLabel: 'ROI in first 30 days',
  },
];

const LOGOS = [
  'Oil & Gas Services', 'Marine Logistics', 'FMCG Retail', 'Event Management',
  'Engineering & Procurement', 'Hospitality Group', 'Consulting Firm', 'Property Development',
];

export default function TestimonialsPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 68 }}>

        {/* Header */}
        <div className="bg-grid" style={{ padding: 'clamp(56px,7vw,96px) clamp(16px,4vw,56px) clamp(40px,5vw,64px)', backgroundSize: '52px 52px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 40%, transparent 30%, var(--bg) 100%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
            <div className="eyebrow" style={{ justifyContent: 'center', marginBottom: 14 }}>Client Testimonials</div>
            <h1 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(44px,7vw,96px)', letterSpacing: '-.05em', lineHeight: .9, color: 'var(--text)', marginBottom: 18 }}>
              Don&apos;t take<br /><span style={{ color: 'var(--blue-hi)' }}>our word for it.</span>
            </h1>
            <p style={{ fontSize: 16, color: 'var(--sub)', lineHeight: 1.85, maxWidth: 480, margin: '0 auto' }}>
              Real clients. Real results. Every quote below is from an active ProStack NG user.
            </p>
          </div>
        </div>

        {/* Client industries strip */}
        <div style={{ background: 'var(--s1)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '16px clamp(16px,4vw,56px)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', gap: 0, flexWrap: 'wrap', justifyContent: 'center' }}>
            {LOGOS.map((l, i) => (
              <span key={i} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '.14em', color: 'var(--muted)', textTransform: 'uppercase', padding: '6px 20px', borderRight: i < LOGOS.length - 1 ? '1px solid var(--border)' : 'none', whiteSpace: 'nowrap' }}>
                {l}
              </span>
            ))}
          </div>
        </div>

        {/* Testimonials grid */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(48px,6vw,80px) clamp(16px,4vw,56px)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px,1fr))', gap: 1, background: 'var(--border)' }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{ background: 'var(--card)', padding: 36, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: t.productColor }} />

                {/* Metric */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                  <div>
                    <div className="f-display" style={{ fontWeight: 800, fontSize: 36, letterSpacing: '-.04em', color: t.productColor, lineHeight: 1 }}>
                      {t.metric}
                    </div>
                    <div className="f-mono" style={{ fontSize: 8.5, letterSpacing: '.12em', color: 'var(--muted)', textTransform: 'uppercase', marginTop: 3 }}>
                      {t.metricLabel}
                    </div>
                  </div>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8.5, letterSpacing: '.12em', textTransform: 'uppercase', background: `${t.productColor}10`, border: `1px solid ${t.productColor}25`, color: t.productColor, padding: '3px 9px', flexShrink: 0 }}>
                    {t.product}
                  </span>
                </div>

                {/* Quote */}
                <div style={{ fontSize: 14, color: 'var(--sub)', lineHeight: 1.85, flex: 1, fontStyle: 'italic', marginBottom: 24 }}>
                  &ldquo;{t.quote}&rdquo;
                </div>

                {/* Attribution */}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 18 }}>
                  <div style={{ fontSize: 13.5, color: 'var(--text)', fontWeight: 600, marginBottom: 3 }}>{t.name}</div>
                  <div className="f-mono" style={{ fontSize: 9.5, color: 'var(--muted)', letterSpacing: '.06em' }}>{t.company}</div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ marginTop: 64, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
            <div style={{ background: 'var(--card)', padding: 'clamp(28px,4vw,48px)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--blue)' }} />
              <div className="eyebrow" style={{ marginBottom: 14 }}>Join Them</div>
              <h2 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(24px,3vw,40px)', letterSpacing: '-.04em', color: 'var(--text)', marginBottom: 14, lineHeight: 1 }}>
                Your result could<br />be next.
              </h2>
              <p style={{ fontSize: 14.5, color: 'var(--sub)', lineHeight: 1.8, marginBottom: 28 }}>
                Book a free 45-minute demo. We&apos;ll walk through the product live, with your actual data.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Link href="/demo" className="btn btn-primary">Book a Demo →</Link>
                <Link href="/case-studies" className="btn btn-ghost">Read Case Studies</Link>
              </div>
            </div>
            <div style={{ background: 'var(--s2)', padding: 'clamp(28px,4vw,48px)' }}>
              <div className="eyebrow" style={{ marginBottom: 20 }}>What to expect</div>
              {[
                'Live product walkthrough with your data',
                'Honest fit assessment — no hard sell',
                'Clear pricing and deployment timeline',
                'WhatsApp follow-up within 24 hours',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
                  <span style={{ color: 'var(--blue)', fontSize: 8, marginTop: 5, flexShrink: 0, fontWeight: 700 }}>◆</span>
                  <span style={{ fontSize: 14, color: 'var(--sub)', lineHeight: 1.6 }}>{item}</span>
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
