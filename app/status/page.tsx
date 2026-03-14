'use client';
import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type ServiceStatus = {
  id: string;
  name: string;
  color: string;
  status: 'operational' | 'degraded' | 'down' | 'loading';
  latencyMs: number;
  httpStatus: number;
  checkedAt: string;
  error?: string;
};

type StatusData = {
  overall: 'operational' | 'degraded' | 'outage';
  services: ServiceStatus[];
  generatedAt: string;
};

const STATUS_CONFIG = {
  operational: { label: 'Operational',    color: '#22C55E', bg: 'rgba(34,197,94,.08)',   border: 'rgba(34,197,94,.2)',   dot: '#22C55E' },
  degraded:    { label: 'Degraded',       color: '#F5B530', bg: 'rgba(245,181,48,.08)',  border: 'rgba(245,181,48,.2)',  dot: '#F5B530' },
  down:        { label: 'Outage',         color: '#FF5757', bg: 'rgba(255,87,87,.08)',   border: 'rgba(255,87,87,.2)',   dot: '#FF5757' },
  loading:     { label: 'Checking…',     color: '#7A7DA0', bg: 'rgba(122,125,160,.05)', border: 'rgba(122,125,160,.1)', dot: '#7A7DA0' },
  outage:      { label: 'Major Outage',   color: '#FF5757', bg: 'rgba(255,87,87,.08)',   border: 'rgba(255,87,87,.2)',   dot: '#FF5757' },
};

const OVERALL_MSG = {
  operational: { text: 'All systems operational', color: '#22C55E', icon: '✓' },
  degraded:    { text: 'Partial system degradation', color: '#F5B530', icon: '⚠' },
  outage:      { text: 'Service disruption detected', color: '#FF5757', icon: '✕' },
};

// 90-day mock uptime history — replace with real Supabase data later
const MOCK_HISTORY = Array.from({ length: 90 }, (_, i) => ({
  date: new Date(Date.now() - (89 - i) * 86400000).toISOString().split('T')[0],
  status: Math.random() > 0.02 ? 'operational' : 'degraded',
}));

function UptimeBar({ history }: { history: typeof MOCK_HISTORY }) {
  return (
    <div style={{ display: 'flex', gap: 1.5, alignItems: 'flex-end', height: 24 }}>
      {history.map((day, i) => (
        <div
          key={i}
          title={`${day.date}: ${day.status}`}
          style={{
            flex: 1,
            height: day.status === 'operational' ? '100%' : '50%',
            background: day.status === 'operational' ? 'rgba(34,197,94,.6)' : 'rgba(245,181,48,.7)',
            borderRadius: 1,
            minWidth: 2,
            transition: 'height .2s',
          }}
        />
      ))}
    </div>
  );
}

function LatencyBar({ ms }: { ms: number }) {
  const max   = 2000;
  const pct   = Math.min((ms / max) * 100, 100);
  const color = ms < 400 ? '#22C55E' : ms < 1000 ? '#F5B530' : '#FF5757';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,.04)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 2, transition: 'width .5s ease' }} />
      </div>
      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color, minWidth: 48, textAlign: 'right' }}>
        {ms > 0 ? `${ms}ms` : '—'}
      </span>
    </div>
  );
}

export default function StatusPage() {
  const [mounted, setMounted]   = useState(false);
  const [data, setData]       = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => { setMounted(true); }, []);

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/status', { cache: 'no-store' });
      const json: StatusData = await res.json();
      setData(json);
      setLastCheck(new Date());
      setCountdown(60);
    } catch {
      // silently fail — keep showing last data
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 60_000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  // Countdown ticker
  useEffect(() => {
    const tick = setInterval(() => setCountdown(c => Math.max(c - 1, 0)), 1000);
    return () => clearInterval(tick);
  }, [lastCheck]);

  const overall = data?.overall ?? 'operational';
  const msg     = OVERALL_MSG[overall];

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 68, minHeight: 'calc(100vh - 68px)', background: 'var(--bg)' }}>

        {/* ── HEADER ── */}
        <div style={{
          background: 'var(--s1)',
          borderBottom: '1px solid var(--border)',
          padding: 'clamp(36px,5vw,64px) clamp(16px,4vw,56px)',
        }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Live Infrastructure</div>
            <h1 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(32px,5vw,60px)', letterSpacing: '-.05em', color: 'var(--text)', lineHeight: .95, marginBottom: 20 }}>
              System Status
            </h1>

            {/* Overall status badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: STATUS_CONFIG[overall]?.bg ?? 'rgba(34,197,94,.08)',
              border: `1px solid ${STATUS_CONFIG[overall]?.border ?? 'rgba(34,197,94,.2)'}`,
              padding: '12px 20px',
            }}>
              {/* Pulsing dot */}
              <div style={{ position: 'relative', width: 10, height: 10, flexShrink: 0 }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: msg.color, opacity: .3, animation: 'ping 1.5s ease-in-out infinite' }} />
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: msg.color }} />
              </div>
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: msg.color }}>
                {msg.icon} {msg.text}
              </span>
            </div>

            <style>{`@keyframes ping { 0%,100%{transform:scale(1);opacity:.3} 50%{transform:scale(2.2);opacity:0} }`}</style>

            {/* Last checked */}
            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <span className="f-mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.1em', textTransform: 'uppercase' }}>
                {mounted ? `Auto-refresh in ${countdown}s` : 'Auto-refresh in 60s'}
              </span>
              <button
                onClick={fetchStatus}
                style={{ background: 'none', border: 'none', color: 'var(--blue-hi)', fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '.1em', textTransform: 'uppercase', cursor: 'pointer', padding: 0 }}
              >
                {loading ? 'Checking…' : '↻ Refresh now'}
              </button>
              {lastCheck && (
                <span className="f-mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.06em' }}>
                  Last checked: {lastCheck.toLocaleTimeString('en-NG')}
                </span>
              )}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(32px,5vw,56px) clamp(16px,4vw,56px)' }}>

          {/* ── SERVICE CARDS ── */}
          <div style={{ marginBottom: 48 }}>
            <div className="eyebrow" style={{ marginBottom: 20 }}>Platform Status</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
              {(data?.services ?? []).map(svc => {
                const cfg = STATUS_CONFIG[svc.status] ?? STATUS_CONFIG.loading;
                return (
                  <div key={svc.id} style={{ background: 'var(--card)', padding: '20px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {/* Color dot */}
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: svc.color, flexShrink: 0 }} />
                        <span className="f-display" style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>{svc.name}</span>
                      </div>
                      <span style={{
                        fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase',
                        color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`, padding: '3px 9px',
                      }}>
                        {cfg.label}
                      </span>
                    </div>
                    <LatencyBar ms={svc.latencyMs} />
                  </div>
                );
              })}

              {/* Loading state */}
              {loading && !data && (
                <div style={{ background: 'var(--card)', padding: '32px 24px', textAlign: 'center' }}>
                  <span className="f-mono" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '.12em', textTransform: 'uppercase' }}>
                    Pinging services…
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ── 90-DAY UPTIME ── */}
          <div style={{ marginBottom: 48 }}>
            <div className="eyebrow" style={{ marginBottom: 20 }}>90-Day Uptime History</div>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: '24px 28px' }}>
              <div style={{ marginBottom: 20 }}>
                <UptimeBar history={MOCK_HISTORY} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="f-mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.08em' }}>90 days ago</span>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, background: 'rgba(34,197,94,.6)', borderRadius: 1 }} />
                    <span className="f-mono" style={{ fontSize: 9, color: 'var(--muted)' }}>Operational</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, background: 'rgba(245,181,48,.7)', borderRadius: 1 }} />
                    <span className="f-mono" style={{ fontSize: 9, color: 'var(--muted)' }}>Degraded</span>
                  </div>
                </div>
                <span className="f-mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.08em' }}>Today</span>
              </div>
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)', textAlign: 'right' }}>
                <span className="f-mono" style={{ fontSize: 10, color: '#22C55E', letterSpacing: '.08em' }}>
                  {MOCK_HISTORY.filter(d => d.status === 'operational').length}/90 days operational (
                  {((MOCK_HISTORY.filter(d => d.status === 'operational').length / 90) * 100).toFixed(1)}% uptime)
                </span>
              </div>
            </div>
          </div>

          {/* ── INCIDENT NOTICE ── */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: '20px 28px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>📢</span>
            <div>
              <div className="f-display" style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 6 }}>
                Incident Communications
              </div>
              <p style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.7, margin: 0 }}>
                For planned maintenance or service disruptions, we notify all active clients via WhatsApp and email 24 hours in advance.
                For urgent issues, contact us at{' '}
                <a href="mailto:contact@prostackng.com.ng" style={{ color: 'var(--blue-hi)', textDecoration: 'none' }}>
                  contact@prostackng.com.ng
                </a>
                {' '}or{' '}
                <a href="https://wa.me/2347059449360" target="_blank" rel="noreferrer" style={{ color: 'var(--blue-hi)', textDecoration: 'none' }}>
                  WhatsApp
                </a>.
              </p>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
