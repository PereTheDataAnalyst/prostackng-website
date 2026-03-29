import Navbar from '@/components/Navbar';
import ApiWaitlistSection from '@/components/ApiWaitlistSection';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'API Documentation — ProStack NG',
  description: 'Developer documentation and API pricing for ProStack NG. Free tier available. Paid plans from ₦25,000/month. Join the waitlist for early access.',
};

// ── Code block styles ────────────────────────────────────────────────────────
function CodeBlock({ language, code }: { language: string; code: string }) {
  return (
    <div style={{ background: '#060810', border: '1px solid #181C30', overflow: 'hidden', borderRadius: 0 }}>
      <div style={{ padding: '8px 16px', borderBottom: '1px solid #181C30', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', color: '#32365A' }}>{language}</span>
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF5757', opacity: .4 }} />
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F5B530', opacity: .4 }} />
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', opacity: .4 }} />
        </div>
      </div>
      <pre style={{ margin: 0, padding: '20px 24px', overflowX: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: 12.5, lineHeight: 1.8, color: '#9BA4D4', whiteSpace: 'pre' }}>
        <code dangerouslySetInnerHTML={{ __html: code }} />
      </pre>
    </div>
  );
}

function EndpointRow({ method, path, desc }: { method: string; path: string; desc: string }) {
  const colors: Record<string, string> = {
    GET: '#22C55E', POST: '#2563EB', PUT: '#F5B530', DELETE: '#FF5757', PATCH: '#A78BFA',
  };
  return (
    <div style={{ background: 'var(--card)', padding: '14px 20px', display: 'flex', alignItems: 'flex-start', gap: 14, borderBottom: '1px solid var(--border)' }}>
      <span style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, fontWeight: 700, letterSpacing: '.08em',
        color: colors[method] ?? '#7A7DA0',
        background: `${colors[method] ?? '#7A7DA0'}12`,
        border: `1px solid ${colors[method] ?? '#7A7DA0'}30`,
        padding: '2px 8px', flexShrink: 0, minWidth: 52, textAlign: 'center',
      }}>{method}</span>
      <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#EEF0FF', flex: 1, minWidth: 0, wordBreak: 'break-all' }}>{path}</code>
      <span style={{ fontSize: 12.5, color: 'var(--sub)', lineHeight: 1.5, flexShrink: 0, maxWidth: 280 }}>{desc}</span>
    </div>
  );
}

const AUTH_EXAMPLE = `curl -X GET https://api.prostackng.com.ng/v1/reports \\
  -H "<span style="color:#3B82F6">Authorization</span>: Bearer <span style="color:#22C55E">YOUR_API_KEY</span>" \\
  -H "<span style="color:#3B82F6">Content-Type</span>: application/json"`;

const RESPONSE_EXAMPLE = `{
  "<span style="color:#3B82F6">status</span>": "<span style="color:#22C55E">success</span>",
  "<span style="color:#3B82F6">data</span>": {
    "<span style="color:#3B82F6">reports</span>": [
      {
        "<span style="color:#3B82F6">id</span>": "<span style="color:#F5B530">rpt_01J8K...</span>",
        "<span style="color:#3B82F6">name</span>": "<span style="color:#22C55E">Q3 Executive Summary</span>",
        "<span style="color:#3B82F6">status</span>": "<span style="color:#22C55E">delivered</span>",
        "<span style="color:#3B82F6">generatedAt</span>": "<span style="color:#22C55E">2026-03-13T06:00:00Z</span>",
        "<span style="color:#3B82F6">durationMs</span>": <span style="color:#F5B530">7842</span>
      }
    ],
    "<span style="color:#3B82F6">meta</span>": { "<span style="color:#3B82F6">total</span>": <span style="color:#F5B530">847</span>, "<span style="color:#3B82F6">page</span>": <span style="color:#F5B530">1</span>, "<span style="color:#3B82F6">limit</span>": <span style="color:#F5B530">20</span> }
  }
}`;

const WEBHOOK_EXAMPLE = `// Node.js webhook handler
app.post('<span style="color:#22C55E">/webhook/prostackng</span>', (req, res) => {
  const sig  = req.headers['<span style="color:#3B82F6">x-prostackng-signature</span>'];
  const body = req.rawBody;

  <span style="color:#A78BFA">// Verify signature (HMAC-SHA256)
  // const secret = process.env.PROSTACKNG_WEBHOOK_SECRET;</span>

  const event = req.body;
  
  <span style="color:#A78BFA">switch</span> (event.type) {
    case '<span style="color:#22C55E">report.generated</span>':
      console.log('Report ready:', event.data.reportId);
      break;
    case '<span style="color:#22C55E">tender.alert</span>':
      notifyTeam(event.data.tender);
      break;
  }
  
  res.json({ received: <span style="color:#F5B530">true</span> });
});`;

export default function DocsPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 68 }}>

        {/* ── HERO ── */}
        <div className="bg-grid" style={{ padding: 'clamp(48px,6vw,80px) clamp(16px,4vw,56px)', backgroundSize: '52px 52px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 40%, transparent 30%, var(--bg) 100%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto' }}>
            <div className="eyebrow" style={{ marginBottom: 14 }}>Developer Resources</div>
            <h1 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(36px,5vw,68px)', letterSpacing: '-.05em', lineHeight: .95, color: 'var(--text)', marginBottom: 20 }}>
              API Documentation
            </h1>
            <p style={{ fontSize: 17, color: 'var(--sub)', lineHeight: 1.85, marginBottom: 28 }}>
              Integrate ProStack NG platforms into your existing workflow. Automate report delivery, query tender data, and push events via webhooks.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <a href="mailto:contact@prostackng.com.ng?subject=API Access Request" className="btn btn-primary">
                Request API Access →
              </a>
              <a href="/demo" className="btn btn-ghost">Book a Technical Demo</a>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(40px,5vw,64px) clamp(16px,4vw,56px)' }}>

          {/* ── NOTICE BANNER ── */}
          <div style={{ background: 'rgba(37,99,235,.06)', border: '1px solid rgba(37,99,235,.18)', padding: '16px 22px', marginBottom: 48, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>ℹ️</span>
            <div>
              <div style={{ fontSize: 13.5, color: 'var(--text)', fontWeight: 600, marginBottom: 4 }}>API in beta — public launch Q3 2026</div>
              <p style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.7, margin: 0 }}>
                Currently available to existing clients and approved partners. A free tier (100 req/month)
                and paid plans open to all from Q3 2026.{' '}
                <a href="#api-pricing" style={{ color: 'var(--blue-hi)', textDecoration: 'none' }}>See pricing ↓</a>{' '}or{' '}
                <a href="#waitlist" style={{ color: 'var(--blue-hi)', textDecoration: 'none' }}>join the waitlist</a>.
              </p>
            </div>
          </div>

          {/* ── AUTHENTICATION ── */}
          <section style={{ marginBottom: 56 }}>
            <div className="eyebrow" style={{ marginBottom: 16 }}>Authentication</div>
            <h2 className="f-display" style={{ fontWeight: 800, fontSize: 28, color: 'var(--text)', letterSpacing: '-.03em', marginBottom: 12 }}>Bearer Token Auth</h2>
            <p style={{ fontSize: 14, color: 'var(--sub)', lineHeight: 1.8, marginBottom: 20 }}>
              All API requests require an <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--blue-hi)', background: 'rgba(59,130,246,.08)', padding: '1px 6px' }}>Authorization</code> header with your API key.
              Keys are scoped per platform and can be rotated from your client portal.
            </p>
            <CodeBlock language="cURL" code={AUTH_EXAMPLE} />

            <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
              {[
                { key: 'Base URL',       val: 'api.prostackng.com.ng' },
                { key: 'API Version',    val: 'v1' },
                { key: 'Format',         val: 'JSON' },
                { key: 'Rate Limit',     val: '100 req/min' },
              ].map(r => (
                <div key={r.key} style={{ background: 'var(--card)', padding: '14px 18px' }}>
                  <div className="f-mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 5 }}>{r.key}</div>
                  <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12.5, color: 'var(--text)' }}>{r.val}</code>
                </div>
              ))}
            </div>
          </section>

          {/* ── ENDPOINTS ── */}
          <section style={{ marginBottom: 56 }}>
            <div className="eyebrow" style={{ marginBottom: 16 }}>AutoReport API</div>
            <h2 className="f-display" style={{ fontWeight: 800, fontSize: 28, color: 'var(--text)', letterSpacing: '-.03em', marginBottom: 20 }}>Report Management</h2>

            <div style={{ border: '1px solid var(--border)', overflow: 'hidden', marginBottom: 24 }}>
              <EndpointRow method="GET"  path="/v1/reports"              desc="List all reports for your account with pagination" />
              <EndpointRow method="GET"  path="/v1/reports/:id"          desc="Get a single report by ID including download URL" />
              <EndpointRow method="POST" path="/v1/reports/trigger"      desc="Manually trigger a report generation outside the schedule" />
              <EndpointRow method="GET"  path="/v1/reports/:id/download" desc="Download the generated PDF or Excel file" />
              <EndpointRow method="PUT"  path="/v1/reports/:id/schedule" desc="Update the delivery schedule for a report" />
            </div>

            <CodeBlock language="JSON — Response" code={RESPONSE_EXAMPLE} />
          </section>

          <section style={{ marginBottom: 56 }}>
            <div className="eyebrow" style={{ marginBottom: 16 }}>ProTrackNG API</div>
            <h2 className="f-display" style={{ fontWeight: 800, fontSize: 28, color: 'var(--text)', letterSpacing: '-.03em', marginBottom: 20 }}>Tender Intelligence</h2>
            <div style={{ border: '1px solid var(--border)', overflow: 'hidden' }}>
              <EndpointRow method="GET"    path="/v1/tenders"              desc="Search and filter live tenders across all monitored portals" />
              <EndpointRow method="GET"    path="/v1/tenders/:id"          desc="Full tender details including deadline, value, and documents" />
              <EndpointRow method="POST"   path="/v1/alerts"               desc="Create a new keyword alert for automatic tender matching" />
              <EndpointRow method="GET"    path="/v1/alerts"               desc="List all active keyword alerts for your account" />
              <EndpointRow method="DELETE" path="/v1/alerts/:id"           desc="Remove a keyword alert" />
              <EndpointRow method="GET"    path="/v1/pipeline"             desc="List tenders in your active bid pipeline" />
              <EndpointRow method="PATCH"  path="/v1/pipeline/:id/status"  desc="Update bid status (tracking, submitted, won, lost)" />
            </div>
          </section>

          {/* ── WEBHOOKS ── */}
          <section style={{ marginBottom: 56 }}>
            <div className="eyebrow" style={{ marginBottom: 16 }}>Webhooks</div>
            <h2 className="f-display" style={{ fontWeight: 800, fontSize: 28, color: 'var(--text)', letterSpacing: '-.03em', marginBottom: 12 }}>Event Notifications</h2>
            <p style={{ fontSize: 14, color: 'var(--sub)', lineHeight: 1.8, marginBottom: 20 }}>
              Subscribe to real-time events. ProStack NG posts a signed HTTPS payload to your endpoint within seconds of each event.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', marginBottom: 24 }}>
              {[
                { event: 'report.generated',   platform: 'AutoReport',  desc: 'Report PDF/Excel is ready for download' },
                { event: 'report.failed',       platform: 'AutoReport',  desc: 'Report generation encountered an error' },
                { event: 'tender.alert',        platform: 'ProTrackNG',  desc: 'New tender matched one of your keywords' },
                { event: 'tender.deadline',     platform: 'ProTrackNG',  desc: '48-hour warning before a tracked deadline' },
                { event: 'session.closed',      platform: 'NightOps',   desc: 'End-of-night session reconciled and closed' },
                { event: 'invoice.generated',   platform: 'Billing',     desc: 'Monthly invoice is ready' },
              ].map(w => (
                <div key={w.event} style={{ background: 'var(--card)', padding: '16px 18px' }}>
                  <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--blue-hi)', display: 'block', marginBottom: 6 }}>{w.event}</code>
                  <div className="f-mono" style={{ fontSize: 8.5, color: 'var(--muted)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 6 }}>{w.platform}</div>
                  <div style={{ fontSize: 12, color: 'var(--sub)', lineHeight: 1.5 }}>{w.desc}</div>
                </div>
              ))}
            </div>

            <CodeBlock language="Node.js — Webhook Handler" code={WEBHOOK_EXAMPLE} />
          </section>

          {/* ── SDK NOTE ── */}
          <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 64 }}>
            <div>
              <div className="f-display" style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)', marginBottom: 6 }}>
                SDKs coming Q3 2026
              </div>
              <p style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.7, margin: 0 }}>
                Official TypeScript/Node.js and Python SDKs are in development. Early access available to partner integrators.
              </p>
            </div>
            <a href="#waitlist" className="btn btn-ghost">
              Join Waitlist →
            </a>
          </div>

          {/* ── API PRICING ── */}
          <section id="api-pricing" style={{ marginBottom: 64 }}>
            <div className="eyebrow" style={{ marginBottom: 16 }}>API Pricing</div>
            <h2 className="f-display" style={{ fontWeight: 800, fontSize: 28, color: 'var(--text)', letterSpacing: '-.03em', marginBottom: 12 }}>
              Paid Tier Access
            </h2>
            <p style={{ fontSize: 14, color: 'var(--sub)', lineHeight: 1.8, marginBottom: 32 }}>
              A generous free tier for developers and small teams. Paid tiers for production workloads.
              All plans include full API documentation, webhook support, and email assistance.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 2, background: 'var(--border)', border: '1px solid var(--border)', marginBottom: 32 }}>
              {[
                {
                  tier: 'Free',
                  price: '₦0',
                  period: 'forever',
                  requests: '100 req / month',
                  highlight: false,
                  features: ['All API endpoints', 'Standard rate limit', 'Community support', 'Webhook events'],
                },
                {
                  tier: 'Starter',
                  price: '₦25,000',
                  period: '/month',
                  requests: '10,000 req / month',
                  highlight: false,
                  features: ['All API endpoints', 'Higher rate limits', 'Email support (48hr)', 'Webhook events', 'Usage dashboard'],
                },
                {
                  tier: 'Growth',
                  price: '₦75,000',
                  period: '/month',
                  requests: '100,000 req / month',
                  highlight: true,
                  features: ['All API endpoints', 'Priority rate limits', 'Email support (24hr)', 'Webhook events', 'Usage dashboard', 'Dedicated Slack channel'],
                },
                {
                  tier: 'Enterprise',
                  price: 'Custom',
                  period: 'pricing',
                  requests: 'Unlimited',
                  highlight: false,
                  features: ['All API endpoints', 'Custom rate limits', 'SLA-backed support', 'Custom webhooks', 'Dedicated account manager', 'On-premise option'],
                },
              ].map(plan => (
                <div key={plan.tier} style={{
                  background: plan.highlight ? 'rgba(37,99,235,.07)' : 'var(--card)',
                  padding: '28px 22px',
                  display: 'flex', flexDirection: 'column',
                  position: 'relative',
                }}>
                  {plan.highlight && (
                    <div className="f-mono" style={{
                      position: 'absolute', top: -1, left: 0, right: 0, height: 2,
                      background: 'var(--blue)',
                    }} />
                  )}
                  <div className="f-display" style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }}>{plan.tier}</div>
                  <div style={{ marginBottom: 4 }}>
                    <span className="f-display" style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-.03em', color: plan.highlight ? 'var(--blue-hi)' : 'var(--text)' }}>
                      {plan.price}
                    </span>
                    <span className="f-mono" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '.08em', marginLeft: 4 }}>{plan.period}</span>
                  </div>
                  <div className="f-mono" style={{ fontSize: 10, color: 'var(--blue-hi)', letterSpacing: '.08em', marginBottom: 20, textTransform: 'uppercase' }}>
                    {plan.requests}
                  </div>
                  <ul style={{ listStyle: 'none', flex: 1 }}>
                    {plan.features.map(f => (
                      <li key={f} className="f-body" style={{ fontSize: 12, color: 'var(--sub)', paddingLeft: 16, position: 'relative', marginBottom: 7, lineHeight: 1.5 }}>
                        <span style={{ position: 'absolute', left: 0, top: 4, color: 'var(--blue)', fontSize: 6 }}>◆</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <p className="f-mono" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '.08em', textAlign: 'center' }}>
              All plans billed monthly in Nigerian Naira · Overage charged at ₦3/request (Starter) or ₦1/request (Growth) · Enterprise flat rate
            </p>
          </section>

          {/* ── WAITLIST ── */}
          <section id="waitlist" style={{ marginBottom: 48 }}>
            <div className="eyebrow" style={{ marginBottom: 16 }}>API Waitlist</div>
            <h2 className="f-display" style={{ fontWeight: 800, fontSize: 28, color: 'var(--text)', letterSpacing: '-.03em', marginBottom: 12 }}>
              Get Early Access
            </h2>
            <p style={{ fontSize: 14, color: 'var(--sub)', lineHeight: 1.8, marginBottom: 28 }}>
              Register your interest now. We open tier access in order of registration — Enterprise
              and Growth applicants are onboarded first.
            </p>
            <ApiWaitlistSection />
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
