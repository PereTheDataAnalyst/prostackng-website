'use client';
import { useState, useEffect, useCallback, useRef } from 'react';

/* ─── Types ──────────────────────────────────────────────────── */
type User = { name: string; role: string; color: string; token: string };

type ClockRecord = {
  id: string; token: string; staff_name: string; role: string;
  clocked_in_at: string; clocked_out_at: string | null; note: string | null;
};

type Announcement = {
  id: string; author_name: string; title: string; body: string;
  priority: string; pinned: boolean; created_at: string;
};

type Task = {
  id: string; created_by: string; assigned_to: string; assigned_name: string;
  title: string; description: string | null; priority: string;
  status: string; due_date: string | null; created_at: string;
};

type WorkRequest = {
  id: string; from_name: string; from_role: string; type: string;
  subject: string; body: string; status: string; created_at: string;
};

type Payment = {
  id: string; service_label: string; amount_kobo: number;
  email: string; name: string | null; status: string; created_at: string;
};

type DashData = {
  today_clocks:    ClockRecord[];
  announcements:   Announcement[];
  open_tasks:      Task[];
  open_requests:   WorkRequest[];
  recent_payments: Payment[];
  recent_enquiries: { full_name: string; email: string; sector: string; package: string; created_at: string }[];
};

/* ─── Role → desk mapping ────────────────────────────────────── */
const ROLE_DESK: Record<string, string> = {
  'CEO':               'ceo',
  'Lead Engineer':     'dev',
  'Backend Engineer':  'dev',
  'Full-Stack Dev':    'dev',
  'UI/UX Designer':    'design',
  'Marketing Lead':    'marketing',
  'Operations':        'hr',
  'Finance Lead':      'finance',
  'Product Manager':   'pm',
  'Social Media Manager': 'social',
  'Guest':             'guest',
  'Legal/Compliance':  'legal',
};

/* ─── Colours ────────────────────────────────────────────────── */
const PRIORITY_COLOR: Record<string, string> = {
  urgent: '#FF5757', high: '#F5B530', normal: '#2563EB', low: '#22C55E',
};
const STATUS_COLOR: Record<string, string> = {
  pending: '#F5B530', in_progress: '#2563EB', done: '#22C55E', blocked: '#FF5757',
  open: '#FF5757', in_review: '#F5B530', resolved: '#22C55E',
  paid: '#22C55E', pending_payment: '#F5B530',
};

/* ─── Helpers ────────────────────────────────────────────────── */
function timeAgo(iso: string) {
  const d = Date.now() - new Date(iso).getTime();
  const m = Math.floor(d / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
function fmt(iso: string) {
  return new Date(iso).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' });
}
function naira(kobo: number) {
  return `₦${(kobo / 100).toLocaleString()}`;
}

/* ─── Small reusable card ────────────────────────────────────── */
function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: '20px', ...style }}>
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="f-mono" style={{ fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 14 }}>
      {children}
    </div>
  );
}

/* ─── Clock-in widget (shown on all desks) ───────────────────── */
function ClockWidget({ user }: { user: User }) {
  const [clocked, setClocked]   = useState(false);
  const [record, setRecord]     = useState<ClockRecord | null>(null);
  const [loading, setLoading]   = useState(false);
  const [note, setNote]         = useState('');
  const [showNote, setShowNote] = useState(false);
  const [checked, setChecked]   = useState(false);

  const check = useCallback(async () => {
    const res = await fetch(`/api/office?action=clock_status&token=${user.token}`);
    const d = await res.json();
    setClocked(d.clocked_in);
    setRecord(d.record);
    setChecked(true);
  }, [user.token]);

  useEffect(() => { check(); }, [check]);

  async function toggle() {
    setLoading(true);
    await fetch('/api/office', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: clocked ? 'clock_out' : 'clock_in', token: user.token, note }),
    });
    setNote('');
    setShowNote(false);
    await check();
    setLoading(false);
  }

  if (!checked) return null;

  return (
    <Card style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
      <div style={{
        width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
        background: clocked ? '#22C55E' : 'var(--muted)',
        boxShadow: clocked ? '0 0 10px rgba(34,197,94,.5)' : 'none',
      }} />
      <div style={{ flex: 1 }}>
        <div className="f-display" style={{ fontSize: 14, fontWeight: 700 }}>
          {clocked ? `Clocked in at ${record ? fmt(record.clocked_in_at) : '—'}` : 'Not clocked in'}
        </div>
        <div className="f-mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.1em', marginTop: 2 }}>
          {new Date().toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </div>

      {showNote && !clocked && (
        <input
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Today's focus (optional)"
          className="ps-input"
          style={{ padding: '8px 12px', fontSize: 12, width: 200 }}
        />
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        {!clocked && (
          <button onClick={() => setShowNote(o => !o)}
            style={{ background: 'var(--s2)', border: '1px solid var(--border)', color: 'var(--sub)', padding: '8px 12px', cursor: 'pointer', fontSize: 11, fontFamily: 'Syne, sans-serif' }}>
            + Note
          </button>
        )}
        <button
          onClick={toggle}
          disabled={loading}
          className="btn btn-primary"
          style={{ fontSize: 11, padding: '8px 20px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? .6 : 1 }}
        >
          {loading ? '...' : clocked ? 'Clock Out' : 'Clock In'}
        </button>
      </div>
    </Card>
  );
}

/* ─── CEO Desk ───────────────────────────────────────────────── */
function CeoDeskTab({
  label, active, onClick, badge,
}: { label: string; active: boolean; onClick: () => void; badge?: number }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        padding: '10px 16px', position: 'relative',
        fontFamily: 'Syne, sans-serif', fontWeight: 700,
        fontSize: 11, letterSpacing: '.06em', textTransform: 'uppercase',
        color: active ? 'var(--text)' : 'var(--sub)',
        borderBottom: active ? '2px solid var(--blue)' : '2px solid transparent',
        transition: 'color .15s',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
      {badge && badge > 0 ? (
        <span style={{
          position: 'absolute', top: 6, right: 4,
          background: '#FF5757', color: '#fff',
          fontSize: 8, fontWeight: 700, borderRadius: '50%',
          width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{badge > 9 ? '9+' : badge}</span>
      ) : null}
    </button>
  );
}

function CeoDesk({ user }: { user: User }) {
  const [tab, setTab]       = useState<'overview' | 'requests' | 'tasks' | 'payments' | 'announce' | 'attendance'>('overview');
  const [data, setData]     = useState<DashData | null>(null);
  const [loading, setLoading] = useState(true);

  // Announcement form
  const [aTitle, setATitle]   = useState('');
  const [aBody, setABody]     = useState('');
  const [aPriority, setAPriority] = useState('normal');
  const [aPinned, setAPinned] = useState(false);
  const [aSending, setASending] = useState(false);
  const [aDone, setADone]     = useState(false);

  // Task form
  const [tToken, setTToken]   = useState('');
  const [tTitle, setTTitle]   = useState('');
  const [tDesc, setTDesc]     = useState('');
  const [tPriority, setTPriority] = useState('normal');
  const [tDue, setTDue]       = useState('');
  const [tSending, setTSending] = useState(false);
  const [tDone, setTDone]     = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/office?action=dashboard');
    const d = await res.json();
    setData(d);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);
  // Refresh every 60s
  useEffect(() => {
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
  }, [load]);

  async function postAnnouncement() {
    if (!aTitle || !aBody) return;
    setASending(true);
    await fetch('/api/office', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'announcement', token: user.token, title: aTitle, body: aBody, priority: aPriority, pinned: aPinned }),
    });
    setATitle(''); setABody(''); setADone(true);
    setTimeout(() => setADone(false), 3000);
    setASending(false);
    load();
  }

  async function assignTask() {
    if (!tToken || !tTitle) return;
    setTSending(true);
    await fetch('/api/office', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'task', token: user.token, assigned_to: tToken, title: tTitle, description: tDesc, priority: tPriority, due_date: tDue || null }),
    });
    setTToken(''); setTTitle(''); setTDesc(''); setTDue(''); setTDone(true);
    setTimeout(() => setTDone(false), 3000);
    setTSending(false);
    load();
  }

  async function resolveRequest(id: string, resolution: string) {
    await fetch('/api/office', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update_request', token: user.token, request_id: id, status: 'resolved', response: resolution }),
    });
    load();
  }

  const openRequests = data?.open_requests?.length ?? 0;
  const openTasks    = data?.open_tasks?.length ?? 0;

  if (loading && !data) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div className="f-mono" style={{ fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--muted)' }}>Loading CEO Desk...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: 24, overflowX: 'auto', gap: 0 }}>
        <CeoDeskTab label="Overview"   active={tab === 'overview'}   onClick={() => setTab('overview')} />
        <CeoDeskTab label="Requests"   active={tab === 'requests'}   onClick={() => setTab('requests')}   badge={openRequests} />
        <CeoDeskTab label="Tasks"      active={tab === 'tasks'}      onClick={() => setTab('tasks')}      badge={openTasks} />
        <CeoDeskTab label="Payments"   active={tab === 'payments'}   onClick={() => setTab('payments')} />
        <CeoDeskTab label="Announce"   active={tab === 'announce'}   onClick={() => setTab('announce')} />
        <CeoDeskTab label="Attendance" active={tab === 'attendance'} onClick={() => setTab('attendance')} />
      </div>

      {/* ── Overview ── */}
      {tab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Stat row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(160px,100%), 1fr))', gap: 12 }}>
            {[
              { label: 'In Office Today',    value: data?.today_clocks?.filter(c => !c.clocked_out_at).length ?? 0,    color: '#22C55E' },
              { label: 'Open Requests',      value: openRequests,                                                        color: '#FF5757' },
              { label: 'Open Tasks',         value: openTasks,                                                           color: '#F5B530' },
              { label: 'Recent Payments',    value: data?.recent_payments?.filter(p => p.status === 'paid').length ?? 0, color: '#2563EB' },
            ].map(s => (
              <Card key={s.label} style={{ textAlign: 'center' }}>
                <div className="f-display" style={{ fontSize: 32, fontWeight: 800, color: s.color, letterSpacing: '-.03em', marginBottom: 4 }}>
                  {s.value}
                </div>
                <div className="f-mono" style={{ fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                  {s.label}
                </div>
              </Card>
            ))}
          </div>

          {/* Announcements */}
          <div>
            <SectionLabel>Latest Announcements</SectionLabel>
            {!data?.announcements?.length ? (
              <Card><p className="f-body" style={{ fontSize: 13, color: 'var(--muted)' }}>No announcements yet.</p></Card>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {data.announcements.slice(0, 3).map(a => (
                  <Card key={a.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: PRIORITY_COLOR[a.priority] ?? '#2563EB', marginTop: 5, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div className="f-display" style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{a.title}</div>
                      <p className="f-body" style={{ fontSize: 12, color: 'var(--sub)', lineHeight: 1.6 }}>{a.body}</p>
                    </div>
                    <div className="f-mono" style={{ fontSize: 9, color: 'var(--muted)', flexShrink: 0 }}>{timeAgo(a.created_at)}</div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Recent enquiries */}
          <div>
            <SectionLabel>Recent Consulting Enquiries</SectionLabel>
            {!data?.recent_enquiries?.length ? (
              <Card><p className="f-body" style={{ fontSize: 13, color: 'var(--muted)' }}>No recent enquiries.</p></Card>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {data.recent_enquiries.map((e, i) => (
                  <div key={i} style={{
                    background: 'var(--card)', border: '1px solid var(--border)',
                    padding: '12px 16px', display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', gap: 12, flexWrap: 'wrap',
                  }}>
                    <div>
                      <span className="f-display" style={{ fontSize: 13, fontWeight: 600 }}>{e.full_name}</span>
                      <span className="f-mono" style={{ fontSize: 10, color: 'var(--muted)', marginLeft: 8 }}>{e.sector}</span>
                    </div>
                    <span className="f-body" style={{ fontSize: 12, color: 'var(--sub)' }}>{e.package?.split('—')[0]}</span>
                    <span className="f-mono" style={{ fontSize: 9, color: 'var(--muted)' }}>{timeAgo(e.created_at)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Requests ── */}
      {tab === 'requests' && (
        <div>
          <SectionLabel>Open Work Requests & Complaints</SectionLabel>
          {!data?.open_requests?.length ? (
            <Card><p className="f-body" style={{ fontSize: 13, color: 'var(--muted)' }}>No open requests. ✓</p></Card>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {data.open_requests.map(r => (
                <RequestCard key={r.id} request={r} onResolve={resolveRequest} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Tasks ── */}
      {tab === 'tasks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Assign task form */}
          <Card>
            <SectionLabel>Assign New Task</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px,100%),1fr))', gap: 12 }}>
                <div>
                  <label className="f-mono" style={{ fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Assign To (Token)</label>
                  <input value={tToken} onChange={e => setTToken(e.target.value)} placeholder="e.g. PSN-DEV-001" className="ps-input" style={{ width: '100%', padding: '10px 12px', fontSize: 12 }} />
                </div>
                <div>
                  <label className="f-mono" style={{ fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Priority</label>
                  <select value={tPriority} onChange={e => setTPriority(e.target.value)} className="ps-input" style={{ width: '100%', padding: '10px 12px', fontSize: 12 }}>
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="f-mono" style={{ fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Due Date</label>
                  <input type="date" value={tDue} onChange={e => setTDue(e.target.value)} className="ps-input" style={{ width: '100%', padding: '10px 12px', fontSize: 12 }} />
                </div>
              </div>
              <div>
                <label className="f-mono" style={{ fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Task Title *</label>
                <input value={tTitle} onChange={e => setTTitle(e.target.value)} placeholder="What needs to be done?" className="ps-input" style={{ width: '100%', padding: '10px 12px', fontSize: 13 }} />
              </div>
              <div>
                <label className="f-mono" style={{ fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Description</label>
                <textarea value={tDesc} onChange={e => setTDesc(e.target.value)} rows={3} placeholder="Additional context..." className="ps-input" style={{ width: '100%', padding: '10px 12px', fontSize: 12, resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <button onClick={assignTask} disabled={tSending || !tToken || !tTitle} className="btn btn-primary" style={{ fontSize: 11, padding: '10px 24px', cursor: 'pointer', opacity: (!tToken || !tTitle) ? .5 : 1 }}>
                  {tSending ? 'Assigning...' : 'Assign Task →'}
                </button>
                {tDone && <span className="f-mono" style={{ fontSize: 10, color: '#22C55E', letterSpacing: '.1em' }}>TASK ASSIGNED ✓</span>}
              </div>
            </div>
          </Card>

          {/* Open tasks list */}
          <div>
            <SectionLabel>All Open Tasks</SectionLabel>
            {!data?.open_tasks?.length ? (
              <Card><p className="f-body" style={{ fontSize: 13, color: 'var(--muted)' }}>No open tasks. ✓</p></Card>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {data.open_tasks.map(t => (
                  <Card key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                        <span className="f-display" style={{ fontSize: 14, fontWeight: 700 }}>{t.title}</span>
                        <span className="badge" style={{ background: `${PRIORITY_COLOR[t.priority]}18`, color: PRIORITY_COLOR[t.priority], border: `1px solid ${PRIORITY_COLOR[t.priority]}40`, fontSize: 8 }}>
                          {t.priority}
                        </span>
                      </div>
                      <div className="f-mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.1em' }}>
                        → {t.assigned_name} · {timeAgo(t.created_at)}{t.due_date ? ` · Due ${t.due_date}` : ''}
                      </div>
                    </div>
                    <span style={{ padding: '3px 10px', fontSize: 9, fontFamily: 'monospace', letterSpacing: '.1em', textTransform: 'uppercase', background: `${STATUS_COLOR[t.status]}18`, color: STATUS_COLOR[t.status], border: `1px solid ${STATUS_COLOR[t.status]}40` }}>
                      {t.status.replace('_', ' ')}
                    </span>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Payments ── */}
      {tab === 'payments' && (
        <div>
          <SectionLabel>Recent Payments</SectionLabel>
          {!data?.recent_payments?.length ? (
            <Card><p className="f-body" style={{ fontSize: 13, color: 'var(--muted)' }}>No payments recorded yet.</p></Card>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {data.recent_payments.map(p => (
                <div key={p.id} style={{
                  background: 'var(--card)', border: '1px solid var(--border)',
                  padding: '14px 18px', display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', gap: 12, flexWrap: 'wrap',
                }}>
                  <div>
                    <div className="f-display" style={{ fontSize: 14, fontWeight: 700, marginBottom: 3 }}>{p.service_label}</div>
                    <div className="f-mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.08em' }}>
                      {p.name ?? p.email} · {timeAgo(p.created_at)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className="f-display" style={{ fontSize: 18, fontWeight: 800, color: p.status === 'paid' ? '#22C55E' : 'var(--muted)' }}>
                      {naira(p.amount_kobo)}
                    </span>
                    <span style={{ padding: '3px 10px', fontSize: 9, fontFamily: 'monospace', letterSpacing: '.1em', textTransform: 'uppercase', background: `${STATUS_COLOR[p.status] ?? '#7A7DA0'}18`, color: STATUS_COLOR[p.status] ?? '#7A7DA0', border: `1px solid ${STATUS_COLOR[p.status] ?? '#7A7DA0'}40` }}>
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Announce ── */}
      {tab === 'announce' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card>
            <SectionLabel>Post Company Announcement</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(180px,100%),1fr))', gap: 12 }}>
                <div>
                  <label className="f-mono" style={{ fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Priority</label>
                  <select value={aPriority} onChange={e => setAPriority(e.target.value)} className="ps-input" style={{ width: '100%', padding: '10px 12px', fontSize: 12 }}>
                    <option value="info">Info</option>
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 2 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input type="checkbox" checked={aPinned} onChange={e => setAPinned(e.target.checked)} style={{ accentColor: 'var(--blue)' }} />
                    <span className="f-mono" style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--sub)' }}>Pin to top</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="f-mono" style={{ fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Title *</label>
                <input value={aTitle} onChange={e => setATitle(e.target.value)} placeholder="Announcement title" className="ps-input" style={{ width: '100%', padding: '10px 12px', fontSize: 13 }} />
              </div>
              <div>
                <label className="f-mono" style={{ fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Message *</label>
                <textarea value={aBody} onChange={e => setABody(e.target.value)} rows={4} placeholder="Write your announcement..." className="ps-input" style={{ width: '100%', padding: '10px 12px', fontSize: 13, resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <button onClick={postAnnouncement} disabled={aSending || !aTitle || !aBody} className="btn btn-primary" style={{ fontSize: 11, padding: '10px 24px', cursor: 'pointer', opacity: (!aTitle || !aBody) ? .5 : 1 }}>
                  {aSending ? 'Posting...' : 'Post Announcement →'}
                </button>
                {aDone && <span className="f-mono" style={{ fontSize: 10, color: '#22C55E', letterSpacing: '.1em' }}>POSTED ✓</span>}
              </div>
            </div>
          </Card>

          {/* Previous announcements */}
          <div>
            <SectionLabel>Recent Announcements</SectionLabel>
            {!data?.announcements?.length ? (
              <Card><p className="f-body" style={{ fontSize: 13, color: 'var(--muted)' }}>None yet.</p></Card>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {data.announcements.map(a => (
                  <Card key={a.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                      <div>
                        <div className="f-display" style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
                          {a.pinned ? '📌 ' : ''}{a.title}
                        </div>
                        <p className="f-body" style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.65 }}>{a.body}</p>
                      </div>
                      <span style={{ padding: '3px 10px', fontSize: 9, fontFamily: 'monospace', letterSpacing: '.1em', textTransform: 'uppercase', background: `${PRIORITY_COLOR[a.priority] ?? '#2563EB'}18`, color: PRIORITY_COLOR[a.priority] ?? '#2563EB', border: `1px solid ${PRIORITY_COLOR[a.priority] ?? '#2563EB'}40`, flexShrink: 0 }}>
                        {a.priority}
                      </span>
                    </div>
                    <div className="f-mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.08em', marginTop: 8 }}>
                      {a.author_name} · {timeAgo(a.created_at)}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Attendance ── */}
      {tab === 'attendance' && (
        <div>
          <SectionLabel>Today&apos;s Attendance</SectionLabel>
          {!data?.today_clocks?.length ? (
            <Card><p className="f-body" style={{ fontSize: 13, color: 'var(--muted)' }}>Nobody has clocked in yet today.</p></Card>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {data.today_clocks.map(c => (
                <Card key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.clocked_out_at ? 'var(--muted)' : '#22C55E', boxShadow: c.clocked_out_at ? 'none' : '0 0 8px rgba(34,197,94,.5)' }} />
                    <div>
                      <div className="f-display" style={{ fontSize: 14, fontWeight: 700 }}>{c.staff_name}</div>
                      <div className="f-mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.08em' }}>{c.role} · {c.token}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="f-mono" style={{ fontSize: 11, color: 'var(--text)' }}>In: {fmt(c.clocked_in_at)}</div>
                    {c.clocked_out_at && <div className="f-mono" style={{ fontSize: 11, color: 'var(--sub)' }}>Out: {fmt(c.clocked_out_at)}</div>}
                    {!c.clocked_out_at && <div className="f-mono" style={{ fontSize: 9, color: '#22C55E', letterSpacing: '.1em' }}>ACTIVE</div>}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Request card (CEO desk) ────────────────────────────────── */
function RequestCard({ request, onResolve }: { request: WorkRequest; onResolve: (id: string, res: string) => void }) {
  const [response, setResponse] = useState('');
  const [open, setOpen]         = useState(false);

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
            <span className="f-display" style={{ fontSize: 14, fontWeight: 700 }}>{request.subject}</span>
            <span className="badge" style={{ background: 'rgba(255,87,87,.1)', color: '#FF5757', border: '1px solid rgba(255,87,87,.3)', fontSize: 8 }}>
              {request.type.replace('_', ' ')}
            </span>
          </div>
          <div className="f-mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.08em' }}>
            From {request.from_name} ({request.from_role}) · {timeAgo(request.created_at)}
          </div>
        </div>
        <button onClick={() => setOpen(o => !o)} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--sub)', padding: '5px 12px', cursor: 'pointer', fontSize: 10, fontFamily: 'monospace' }}>
          {open ? 'Close ↑' : 'Respond ↓'}
        </button>
      </div>
      <p className="f-body" style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.7 }}>{request.body}</p>
      {open && (
        <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <input
            value={response}
            onChange={e => setResponse(e.target.value)}
            placeholder="Write a response (optional)..."
            className="ps-input"
            style={{ flex: 1, minWidth: '200px', padding: '8px 12px', fontSize: 12 }}
          />
          <button
            onClick={() => onResolve(request.id, response)}
            className="btn btn-primary"
            style={{ fontSize: 11, padding: '8px 20px', cursor: 'pointer' }}
          >
            Mark Resolved ✓
          </button>
        </div>
      )}
    </Card>
  );
}

/* ─── Work request form (used by non-CEO desks) ──────────────── */
function WorkRequestForm({ user }: { user: User }) {
  const [type, setType]       = useState('work_request');
  const [subject, setSubject] = useState('');
  const [body, setBody]       = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone]       = useState(false);

  async function submit() {
    if (!subject || !body) return;
    setSending(true);
    await fetch('/api/office', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'work_request', token: user.token, type, subject, body }),
    });
    setSubject(''); setBody(''); setDone(true);
    setTimeout(() => setDone(false), 4000);
    setSending(false);
  }

  return (
    <Card>
      <SectionLabel>Submit a Request or Complaint</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(180px,100%),1fr))', gap: 12 }}>
          <div>
            <label className="f-mono" style={{ fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Type</label>
            <select value={type} onChange={e => setType(e.target.value)} className="ps-input" style={{ width: '100%', padding: '10px 12px', fontSize: 12 }}>
              <option value="work_request">Work Request</option>
              <option value="complaint">Complaint</option>
              <option value="leave">Leave Request</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="f-mono" style={{ fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Subject *</label>
            <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Brief subject line" className="ps-input" style={{ width: '100%', padding: '10px 12px', fontSize: 13 }} />
          </div>
        </div>
        <div>
          <label className="f-mono" style={{ fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Details *</label>
          <textarea value={body} onChange={e => setBody(e.target.value)} rows={4} placeholder="Explain your request in detail..." className="ps-input" style={{ width: '100%', padding: '10px 12px', fontSize: 13, resize: 'vertical' }} />
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button onClick={submit} disabled={sending || !subject || !body} className="btn btn-primary" style={{ fontSize: 11, padding: '10px 24px', cursor: 'pointer', opacity: (!subject || !body) ? .5 : 1 }}>
            {sending ? 'Sending...' : 'Submit Request →'}
          </button>
          {done && <span className="f-mono" style={{ fontSize: 10, color: '#22C55E', letterSpacing: '.1em' }}>SUBMITTED ✓ — goes to CEO desk</span>}
        </div>
      </div>
    </Card>
  );
}

/* ─── My Tasks (non-CEO desks) ───────────────────────────────── */
function MyTasks({ user }: { user: User }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(`/api/office?action=my_tasks&token=${user.token}`)
      .then(r => r.json())
      .then(d => { setTasks(d.tasks ?? []); setLoaded(true); });
  }, [user.token]);

  async function updateStatus(id: string, status: string) {
    await fetch('/api/office', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update_task', token: user.token, task_id: id, status }),
    });
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  }

  if (!loaded) return <Card><p className="f-mono" style={{ fontSize: 10, color: 'var(--muted)' }}>Loading tasks...</p></Card>;

  return (
    <div>
      <SectionLabel>My Tasks ({tasks.filter(t => t.status !== 'done').length} open)</SectionLabel>
      {!tasks.length ? (
        <Card><p className="f-body" style={{ fontSize: 13, color: 'var(--muted)' }}>No tasks assigned yet.</p></Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {tasks.map(t => (
            <Card key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                  <span className="f-display" style={{ fontSize: 14, fontWeight: 700, textDecoration: t.status === 'done' ? 'line-through' : 'none', opacity: t.status === 'done' ? .5 : 1 }}>
                    {t.title}
                  </span>
                  <span className="badge" style={{ background: `${PRIORITY_COLOR[t.priority]}18`, color: PRIORITY_COLOR[t.priority], border: `1px solid ${PRIORITY_COLOR[t.priority]}40`, fontSize: 8 }}>
                    {t.priority}
                  </span>
                </div>
                {t.description && <p className="f-body" style={{ fontSize: 12, color: 'var(--sub)', lineHeight: 1.6 }}>{t.description}</p>}
                {t.due_date && <div className="f-mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.08em', marginTop: 4 }}>Due: {t.due_date}</div>}
              </div>
              <select
                value={t.status}
                onChange={e => updateStatus(t.id, e.target.value)}
                style={{ background: 'var(--s2)', border: '1px solid var(--border)', color: STATUS_COLOR[t.status] ?? 'var(--text)', padding: '6px 10px', fontSize: 10, fontFamily: 'monospace', cursor: 'pointer', letterSpacing: '.06em' }}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="blocked">Blocked</option>
                <option value="done">Done ✓</option>
              </select>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Generic desk (Phase 2 placeholder) ─────────────────────── */
function GenericDesk({ user, deskLabel, description, phase }: {
  user: User; deskLabel: string; description: string; phase: string;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Phase notice */}
      <div style={{ background: 'rgba(37,99,235,.05)', border: '1px solid var(--blue-dim)', padding: '20px 24px' }}>
        <div className="f-mono" style={{ fontSize: 9, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--blue-hi)', marginBottom: 8 }}>
          {phase} — Coming Soon
        </div>
        <div className="f-display" style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{deskLabel}</div>
        <p className="f-body" style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.7 }}>{description}</p>
      </div>

      {/* Clock-in always works */}
      <ClockWidget user={user} />

      {/* Announcements */}
      <AnnouncementsFeed />

      {/* Tasks always work */}
      <MyTasks user={user} />

      {/* Work requests always work */}
      <WorkRequestForm user={user} />
    </div>
  );
}

/* ─── Announcements feed (all desks) ─────────────────────────── */
function AnnouncementsFeed() {
  const [items, setItems] = useState<Announcement[]>([]);
  useEffect(() => {
    fetch('/api/office?action=announcements')
      .then(r => r.json())
      .then(d => setItems(d.announcements ?? []));
  }, []);

  if (!items.length) return null;

  return (
    <div>
      <SectionLabel>Company Announcements</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.slice(0, 3).map(a => (
          <Card key={a.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: PRIORITY_COLOR[a.priority] ?? '#2563EB', marginTop: 5, flexShrink: 0 }} />
            <div>
              <div className="f-display" style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{a.pinned ? '📌 ' : ''}{a.title}</div>
              <p className="f-body" style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.65 }}>{a.body}</p>
              <div className="f-mono" style={{ fontSize: 9, color: 'var(--muted)', marginTop: 6, letterSpacing: '.08em' }}>
                {a.author_name} · {timeAgo(a.created_at)}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════
   PHASE 2 DESKS
   HR Office · Lead Marketer · Social Media Manager · Legal
═══════════════════════════════════════════════════════════ */

/* ─── Report submission form (used by Marketing → HR/CEO) ─── */
function ReportForm({ user, toCeo = true }: { user: User; toCeo?: boolean }) {
  const [title, setTitle]   = useState('');
  const [body, setBody]     = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone]     = useState(false);

  async function submit() {
    if (!title || !body) return;
    setSending(true);
    await fetch('/api/office', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'report', token: user.token,
        to_desk: toCeo ? 'ceo' : 'hr',
        title, body,
      }),
    });
    setTitle(''); setBody(''); setDone(true);
    setTimeout(() => setDone(false), 4000);
    setSending(false);
  }

  return (
    <Card>
      <SectionLabel>Submit Report → {toCeo ? 'CEO Desk' : 'HR Desk'}</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <label className="f-mono" style={{ fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Report Title *</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Weekly Marketing Summary — Week 14" className="ps-input" style={{ width: '100%', padding: '10px 12px', fontSize: 13 }} />
        </div>
        <div>
          <label className="f-mono" style={{ fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Report Body *</label>
          <textarea value={body} onChange={e => setBody(e.target.value)} rows={5} placeholder="Write your report..." className="ps-input" style={{ width: '100%', padding: '10px 12px', fontSize: 13, resize: 'vertical', lineHeight: 1.7 }} />
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button onClick={submit} disabled={sending || !title || !body} className="btn btn-primary"
            style={{ fontSize: 11, padding: '10px 24px', cursor: 'pointer', opacity: (!title || !body) ? .5 : 1 }}>
            {sending ? 'Sending...' : 'Submit Report →'}
          </button>
          {done && <span className="f-mono" style={{ fontSize: 10, color: '#22C55E', letterSpacing: '.1em' }}>SUBMITTED ✓</span>}
        </div>
      </div>
    </Card>
  );
}

/* ─── HR Desk ─────────────────────────────────────────────── */
function HrDesk({ user }: { user: User }) {
  const [tab, setTab]           = useState<'attendance' | 'requests' | 'reports' | 'recruitment'>( 'attendance');
  const [clocks, setClocks]     = useState<ClockRecord[]>([]);
  const [requests, setRequests] = useState<WorkRequest[]>([]);
  const [reports, setReports]   = useState<any[]>([]);
  const [loading, setLoading]   = useState(false);

  async function load() {
    setLoading(true);
    const [c, r, rep] = await Promise.all([
      fetch('/api/office?action=today_clocks').then(r => r.json()),
      fetch('/api/office?action=requests').then(r => r.json()),
      fetch('/api/office?action=reports').then(r => r.json()),
    ]);
    setClocks(c.clocks ?? []);
    setRequests(r.requests ?? []);
    setReports(rep.reports ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function resolveRequest(id: string, response: string) {
    await fetch('/api/office', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update_request', token: user.token, request_id: id, status: 'resolved', response }),
    });
    load();
  }

  const openReqs = requests.filter(r => r.status === 'open').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <ClockWidget user={user} />
      <AnnouncementsFeed />

      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', overflowX: 'auto', gap: 0 }}>
        <CeoDeskTab label="Attendance"   active={tab === 'attendance'}   onClick={() => setTab('attendance')} />
        <CeoDeskTab label="Requests"     active={tab === 'requests'}     onClick={() => setTab('requests')}   badge={openReqs} />
        <CeoDeskTab label="Reports"      active={tab === 'reports'}      onClick={() => setTab('reports')} />
        <CeoDeskTab label="Recruitment"  active={tab === 'recruitment'}  onClick={() => setTab('recruitment')} />
      </div>

      {tab === 'attendance' && (
        <div>
          <SectionLabel>Today's Attendance — {clocks.filter(c => !c.clocked_out_at).length} active now</SectionLabel>
          {!clocks.length ? (
            <Card><p className="f-body" style={{ fontSize: 13, color: 'var(--muted)' }}>No clock-ins yet today.</p></Card>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {clocks.map(c => (
                <Card key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.clocked_out_at ? 'var(--muted)' : '#22C55E', boxShadow: c.clocked_out_at ? 'none' : '0 0 8px rgba(34,197,94,.5)' }} />
                    <div>
                      <div className="f-display" style={{ fontSize: 14, fontWeight: 700 }}>{c.staff_name}</div>
                      <div className="f-mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.08em' }}>{c.role} · {c.token}{c.note ? ' · "' + c.note + '"' : ''}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="f-mono" style={{ fontSize: 11, color: 'var(--text)' }}>In: {fmt(c.clocked_in_at)}</div>
                    {c.clocked_out_at ? <div className="f-mono" style={{ fontSize: 11, color: 'var(--sub)' }}>Out: {fmt(c.clocked_out_at)}</div>
                      : <div className="f-mono" style={{ fontSize: 9, color: '#22C55E', letterSpacing: '.1em' }}>ACTIVE</div>}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'requests' && (
        <div>
          <SectionLabel>Staff Requests & Complaints</SectionLabel>
          {!requests.length ? (
            <Card><p className="f-body" style={{ fontSize: 13, color: 'var(--muted)' }}>No open requests. ✓</p></Card>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {requests.map(r => (
                <RequestCard key={r.id} request={r} onResolve={resolveRequest} />
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'reports' && (
        <div>
          <SectionLabel>Reports Received</SectionLabel>
          {!reports.length ? (
            <Card><p className="f-body" style={{ fontSize: 13, color: 'var(--muted)' }}>No reports yet.</p></Card>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {reports.filter(r => r.to_desk === 'hr').map((r: any) => (
                <Card key={r.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
                    <div>
                      <div className="f-display" style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{r.title}</div>
                      <div className="f-mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.08em' }}>From {r.from_name} ({r.from_role}) · {timeAgo(r.created_at)}</div>
                    </div>
                    <span style={{ padding: '3px 10px', fontSize: 9, fontFamily: 'monospace', letterSpacing: '.1em', textTransform: 'uppercase', background: 'rgba(37,99,235,.1)', color: 'var(--blue-hi)', border: '1px solid rgba(37,99,235,.3)' }}>
                      {r.status}
                    </span>
                  </div>
                  <p className="f-body" style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.7 }}>{r.body}</p>
                </Card>
              ))}
              {!reports.filter((r: any) => r.to_desk === 'hr').length && (
                <Card><p className="f-body" style={{ fontSize: 13, color: 'var(--muted)' }}>No reports directed to HR yet.</p></Card>
              )}
            </div>
          )}
        </div>
      )}

      {tab === 'recruitment' && (
        <div>
          <Card>
            <SectionLabel>Recruitment Pipeline</SectionLabel>
            <p className="f-body" style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.7, marginBottom: 16 }}>
              Job applications submitted via <strong style={{ color: 'var(--text)' }}>/contact</strong> with a role query param appear here.
              Full recruitment desk with applicant tracking launches in Phase 5.
            </p>
            <a href="/careers" target="_blank" rel="noreferrer" className="btn-outline-border" style={{ fontSize: 11, padding: '9px 20px' }}>
              View Live Careers Page →
            </a>
          </Card>
        </div>
      )}

      <WorkRequestForm user={user} />
    </div>
  );
}

/* ─── Lead Marketer Desk ─────────────────────────────────── */
function MarketingDesk({ user }: { user: User }) {
  const [tab, setTab] = useState<'tasks' | 'report' | 'requests'>( 'tasks');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <ClockWidget user={user} />
      <AnnouncementsFeed />

      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
        <CeoDeskTab label="My Tasks"     active={tab === 'tasks'}    onClick={() => setTab('tasks')} />
        <CeoDeskTab label="Submit Report" active={tab === 'report'}   onClick={() => setTab('report')} />
        <CeoDeskTab label="Requests"      active={tab === 'requests'} onClick={() => setTab('requests')} />
      </div>

      {tab === 'tasks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card>
            <SectionLabel>Campaign & Task Tracker</SectionLabel>
            <p className="f-body" style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.7, marginBottom: 12 }}>
              Marketing campaign boards, intern task distribution, and content pipeline launch in Phase 3.
              For now, all tasks assigned to your token appear below.
            </p>
          </Card>
          <MyTasks user={user} />
        </div>
      )}

      {tab === 'report' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card>
            <SectionLabel>Weekly Marketing Report</SectionLabel>
            <p className="f-body" style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.7 }}>
              Submit your weekly performance report. It routes to the HR desk for review and the CEO desk for awareness.
            </p>
          </Card>
          <ReportForm user={user} toCeo={false} />
          <ReportForm user={user} toCeo={true} />
        </div>
      )}

      {tab === 'requests' && <WorkRequestForm user={user} />}
    </div>
  );
}

/* ─── Social Media Manager Desk ──────────────────────────── */
function SocialMediaDesk({ user }: { user: User }) {
  const [tab, setTab] = useState<'tasks' | 'calendar' | 'report'>( 'tasks');

  const PLATFORMS = [
    { name: 'Twitter / X', handle: '@ProStackNG', url: 'https://x.com/ProStackNG', color: '#1DA1F2' },
    { name: 'LinkedIn', handle: 'ProStack NG Technologies', url: 'https://www.linkedin.com/company/prostackng', color: '#0A66C2' },
    { name: 'YouTube', handle: '@ProStackNG', url: 'https://www.youtube.com/@ProStackNG', color: '#FF0000' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <ClockWidget user={user} />
      <AnnouncementsFeed />

      {/* Platform quick links */}
      <div>
        <SectionLabel>Managed Platforms</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(160px,100%),1fr))', gap: 10 }}>
          {PLATFORMS.map(p => (
            <a key={p.name} href={p.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
              <Card style={{ borderLeft: `3px solid ${p.color}`, transition: 'border-color .15s' }}>
                <div className="f-display" style={{ fontSize: 13, fontWeight: 700, marginBottom: 4, color: p.color }}>{p.name}</div>
                <div className="f-mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.08em' }}>{p.handle}</div>
              </Card>
            </a>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
        <CeoDeskTab label="My Tasks"      active={tab === 'tasks'}    onClick={() => setTab('tasks')} />
        <CeoDeskTab label="Content Ideas" active={tab === 'calendar'} onClick={() => setTab('calendar')} />
        <CeoDeskTab label="Report"        active={tab === 'report'}   onClick={() => setTab('report')} />
      </div>

      {tab === 'tasks' && <MyTasks user={user} />}

      {tab === 'calendar' && (
        <div>
          <Card>
            <SectionLabel>Content Calendar</SectionLabel>
            <p className="f-body" style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.7, marginBottom: 12 }}>
              Full content calendar with post scheduling, approval workflow, and platform analytics integration
              launches in Phase 3. Use Work Requests to flag content ideas or approvals needed.
            </p>
            <button onClick={() => setTab('tasks')} className="btn-outline-border" style={{ fontSize: 11, padding: '9px 18px' }}>
              ← View My Tasks
            </button>
          </Card>
        </div>
      )}

      {tab === 'report' && <ReportForm user={user} toCeo={false} />}
      <WorkRequestForm user={user} />
    </div>
  );
}

/* ─── Legal & Compliance Desk ────────────────────────────── */
function LegalDesk({ user }: { user: User }) {
  const [tab, setTab] = useState<'checklist' | 'ndas' | 'tasks' | 'requests'>( 'checklist');

  const NDPR_CHECKLIST = [
    { item: 'Privacy Policy published on website', ref: '/privacy' },
    { item: 'Data collection consent documented', ref: null },
    { item: 'User data deletion process defined', ref: null },
    { item: 'Third-party data processors listed', ref: null },
    { item: 'Data breach response plan in place', ref: null },
    { item: 'Staff data handling training completed', ref: null },
    { item: 'DPA (Data Protection Audit) conducted', ref: null },
  ];

  const NITDA_CHECKLIST = [
    { item: 'Local content policy compliance reviewed', ref: null },
    { item: 'IT service provider registration current', ref: null },
    { item: 'Nigerian data residency requirements checked', ref: null },
    { item: 'NITDA levy filing up to date', ref: null },
  ];

  const NDA_LOG = [
    { party: 'White-Label Enquiries', status: 'template-ready', note: 'Formal NDA sent on enquiry submission' },
    { party: 'Build With Us clients', status: 'template-ready', note: 'Included in project contract' },
    { party: 'Partner agreements',    status: 'pending',         note: 'To be drafted when first partner confirmed' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <ClockWidget user={user} />
      <AnnouncementsFeed />

      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
        <CeoDeskTab label="Compliance"  active={tab === 'checklist'} onClick={() => setTab('checklist')} />
        <CeoDeskTab label="NDA Tracker" active={tab === 'ndas'}      onClick={() => setTab('ndas')} />
        <CeoDeskTab label="My Tasks"    active={tab === 'tasks'}     onClick={() => setTab('tasks')} />
        <CeoDeskTab label="Requests"    active={tab === 'requests'}  onClick={() => setTab('requests')} />
      </div>

      {tab === 'checklist' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {[
            { title: 'NDPR Compliance Checklist', items: NDPR_CHECKLIST, color: '#22C55E' },
            { title: 'NITDA Compliance Checklist', items: NITDA_CHECKLIST, color: '#2563EB' },
          ].map(section => (
            <div key={section.title}>
              <SectionLabel>{section.title}</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {section.items.map((item, i) => (
                  <Card key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 16, height: 16, border: `1.5px solid ${section.color}`, borderRadius: 2, flexShrink: 0, background: 'transparent' }} />
                    <span className="f-body" style={{ fontSize: 13, color: 'var(--sub)', flex: 1 }}>{item.item}</span>
                    {item.ref && (
                      <a href={item.ref} target="_blank" rel="noreferrer" className="f-mono" style={{ fontSize: 9, color: 'var(--blue-hi)', letterSpacing: '.08em', textDecoration: 'none' }}>
                        VIEW →
                      </a>
                    )}
                  </Card>
                ))}
              </div>
              <p className="f-mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.08em', marginTop: 8 }}>
                Check items manually. Full digital checklist with audit trail in Phase 5.
              </p>
            </div>
          ))}
        </div>
      )}

      {tab === 'ndas' && (
        <div>
          <SectionLabel>NDA Status Log</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {NDA_LOG.map((n, i) => (
              <Card key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <div className="f-display" style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{n.party}</div>
                  <div className="f-body" style={{ fontSize: 12, color: 'var(--sub)' }}>{n.note}</div>
                </div>
                <span style={{
                  padding: '3px 10px', fontSize: 9, fontFamily: 'monospace',
                  letterSpacing: '.1em', textTransform: 'uppercase',
                  background: n.status === 'template-ready' ? 'rgba(34,197,94,.1)' : 'rgba(245,181,48,.1)',
                  color: n.status === 'template-ready' ? '#22C55E' : '#F5B530',
                  border: n.status === 'template-ready' ? '1px solid rgba(34,197,94,.3)' : '1px solid rgba(245,181,48,.3)',
                  flexShrink: 0,
                }}>
                  {n.status.replace('-', ' ')}
                </span>
              </Card>
            ))}
          </div>
          <p className="f-mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.08em', marginTop: 12 }}>
            White-label enquiry NDA acknowledgements are logged automatically in the database.
            Full contract management with document uploads in Phase 5.
          </p>
        </div>
      )}

      {tab === 'tasks' && <MyTasks user={user} />}
      {tab === 'requests' && <WorkRequestForm user={user} />}
    </div>
  );
}

/* ─── Desk renderer ──────────────────────────────────────────── */
function DeskRenderer({ user }: { user: User }) {
  const desk = ROLE_DESK[user.role] ?? 'guest';

  if (desk === 'ceo') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <ClockWidget user={user} />
        <CeoDesk user={user} />
      </div>
    );
  }

  if (desk === 'hr') return <HrDesk user={user} />;
  if (desk === 'marketing') return <MarketingDesk user={user} />;
  if (desk === 'social') return <SocialMediaDesk user={user} />;
  if (desk === 'legal') return <LegalDesk user={user} />;

  const DESK_INFO: Record<string, { label: string; description: string; phase: string }> = {
    dev: {
      label:       'Developer Desk',
      description: 'Sprint tasks, bug reports, deployment notes, PR reviews, and technical discussions. This desk will include a sprint board, code review queue, and deployment status feed.',
      phase:       'Phase 4',
    },
    design: {
      label:       'Design Desk',
      description: 'Asset pipeline, design reviews, UI component library, and brand consistency tracking. Integrated with Figma project links.',
      phase:       'Phase 4',
    },
    marketing: {
      label:       'Lead Marketer Desk',
      description: 'Task distribution to marketing staff and interns, campaign pipeline, content calendar, and performance report submissions that route to CEO and HR.',
      phase:       'Phase 3',
    },
    hr: {
      label:       'HR / Operations Desk',
      description: 'Staff clock-in oversight, leave approvals, recruitment pipeline, complaints triage, and onboarding checklists.',
      phase:       'Phase 2',
    },
    finance: {
      label:       'Finance Desk',
      description: 'Payment tracker, invoice management, expense records, payroll preparation, and monthly financial summaries.',
      phase:       'Phase 5',
    },
    pm: {
      label:       'Product Manager Desk',
      description: 'Roadmap management, feature specifications, stakeholder updates, and sprint planning coordination across dev and design.',
      phase:       'Phase 4',
    },
    social: {
      label:       '📱 Social Media Manager Desk',
      description: 'Content calendar, platform management, post approvals, and performance reporting.',
      phase:       'Phase 3',
    },
    legal: {
      label:       '⚖️ Legal & Compliance Office',
      description: 'NDA tracker, client contracts, NDPR compliance checklist, CAC filings, and regulatory monitoring. Centralised legal document pipeline.',
      phase:       'Phase 5',
    },
    guest: {
      label:       'Guest Access',
      description: 'Limited read-only access. Contact the CEO or Operations to request a staff token.',
      phase:       'N/A',
    },
  };

  const info = DESK_INFO[desk] ?? DESK_INFO.guest;

  return (
    <GenericDesk
      user={user}
      deskLabel={info.label}
      description={info.description}
      phase={info.phase}
    />
  );
}

/* ─── Main virtual office page ───────────────────────────────── */
export default function VirtualOfficePage() {
  const [screen, setScreen]       = useState<'login' | 'office'>('login');
  const [tokenInput, setTokenInput] = useState('');
  const [tokenError, setTokenError] = useState('');
  const [loading, setLoading]     = useState(false);
  const [user, setUser]           = useState<User | null>(null);
  const inputRef                  = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Restore session
    const saved = sessionStorage.getItem('psn_office_user');
    if (saved) { try { setUser(JSON.parse(saved)); setScreen('office'); } catch {} }
  }, []);

  useEffect(() => {
    if (screen === 'login') setTimeout(() => inputRef.current?.focus(), 100);
  }, [screen]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    setLoading(true);
    setTokenError('');
    try {
      const res  = await fetch('/api/boardroom/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenInput.trim() }),
      });
      const data = await res.json();
      if (!data.success) {
        setTokenError(data.error ?? 'Invalid token');
        setLoading(false);
        return;
      }
      const u = { ...data.user };
      sessionStorage.setItem('psn_office_user', JSON.stringify(u));
      setUser(u);
      setScreen('office');
    } catch {
      setTokenError('Connection error. Try again.');
    }
    setLoading(false);
  }

  function logout() {
    sessionStorage.removeItem('psn_office_user');
    setUser(null);
    setTokenInput('');
    setScreen('login');
  }

  /* ── Login screen ── */
  if (screen === 'login') {
    return (
      <div style={{
        minHeight: '100vh', background: 'var(--bg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(24px,5vw,48px)',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div className="f-display" style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-.03em', marginBottom: 6 }}>
              ProStack<span style={{ color: 'var(--blue-hi)' }}>NG</span>
            </div>
            <div className="f-mono" style={{ fontSize: 10, letterSpacing: '.24em', textTransform: 'uppercase', color: 'var(--muted)' }}>
              Virtual Office
            </div>
          </div>

          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', overflow: 'hidden' }}>
            <div style={{ height: 2, background: 'linear-gradient(90deg, var(--blue), #06B6D4)' }} />
            <div style={{ padding: 'clamp(24px,5vw,36px)' }}>
              <div className="eyebrow" style={{ marginBottom: 20 }}>Staff Access</div>
              <h2 className="f-display" style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-.03em', marginBottom: 8 }}>
                Enter Your Office Token
              </h2>
              <p className="f-body" style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.7, marginBottom: 24 }}>
                Enter your ProStack NG staff access token.
                Contact Operations if you do not have one.
              </p>
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <input
                  ref={inputRef}
                  type="password"
                  value={tokenInput}
                  onChange={e => setTokenInput(e.target.value)}
                  placeholder="Enter access token"
                  className="ps-input"
                  style={{ padding: '14px 16px', fontSize: 15, letterSpacing: '.1em', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', width: '100%' }}
                  autoComplete="off"
                />
                {tokenError && (
                  <p className="f-body" style={{ fontSize: 13, color: '#FF5757' }}>{tokenError}</p>
                )}
                <button
                  type="submit"
                  disabled={loading || !tokenInput.trim()}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', fontSize: 12, padding: '14px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? .6 : 1 }}
                >
                  {loading ? 'Verifying...' : 'Enter Office →'}
                </button>
              </form>
            </div>
          </div>

          <p className="f-mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.1em', textAlign: 'center', marginTop: 20 }}>
            PROSTACK NG TECHNOLOGIES · PRIVATE ACCESS ONLY
          </p>
        </div>
      </div>
    );
  }

  /* ── Office screen ── */
  if (!user) return null;

  const deskInfo = ROLE_DESK[user.role] ?? 'guest';
  const deskLabels: Record<string, string> = {
    ceo: '🏛 CEO / CTO Office', dev: '💻 Developer Desk', design: '🎨 Design Desk',
    marketing: '📣 Marketing Desk', hr: '👥 HR & Operations', finance: '💰 Finance Desk',
    pm: '📋 Product Manager', social: '📱 Social Media', legal: '⚖️ Legal & Compliance', guest: '👤 Guest Access',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>

      {/* ── Top bar ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(4,5,10,.95)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        padding: '0 clamp(16px,4vw,40px)',
        height: 56, display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <div className="f-display" style={{ fontWeight: 800, fontSize: 14, letterSpacing: '-.02em' }}>
          ProStack<span style={{ color: 'var(--blue-hi)' }}>NG</span>
          <span className="f-mono" style={{ fontSize: 9, letterSpacing: '.2em', color: 'var(--muted)', marginLeft: 8 }}>VIRTUAL OFFICE</span>
        </div>

        <div style={{ flex: 1 }} />

        {/* Current desk */}
        <div className="f-mono hidden md:block" style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)' }}>
          {deskLabels[deskInfo]}
        </div>

        {/* User badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: user.color, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 11, fontWeight: 800,
            fontFamily: 'Syne, sans-serif', color: '#fff',
          }}>
            {user.name[0]}
          </div>
          <div className="hidden md:block">
            <div className="f-display" style={{ fontSize: 12, fontWeight: 700 }}>{user.name}</div>
            <div className="f-mono" style={{ fontSize: 8, color: 'var(--muted)', letterSpacing: '.1em' }}>{user.role}</div>
          </div>
        </div>

        <button
          onClick={logout}
          style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--muted)', padding: '5px 12px', cursor: 'pointer', fontSize: 9, fontFamily: 'monospace', letterSpacing: '.1em', textTransform: 'uppercase' }}
        >
          Exit
        </button>
      </div>

      {/* ── Desk content ── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(24px,4vw,40px) clamp(16px,4vw,40px)' }}>

        {/* Desk header */}
        <div style={{ marginBottom: 28 }}>
          <div className="f-display" style={{ fontSize: 'clamp(20px,3.5vw,32px)', fontWeight: 800, letterSpacing: '-.03em', marginBottom: 4 }}>
            {deskLabels[deskInfo]}
          </div>
          <div className="f-mono" style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            {user.name} · {user.token} · {new Date().toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>

        {/* Render the correct desk */}
        <DeskRenderer user={user} />
      </div>
    </div>
  );
}
