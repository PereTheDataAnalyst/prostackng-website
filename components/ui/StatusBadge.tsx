type Status = 'LIVE' | 'BUILDING' | 'ROADMAP' | 'COMING_SOON';

export default function StatusBadge({ status }: { status: Status }) {
  const cfg = {
    LIVE:        { bg: 'rgba(0,232,122,.1)',    color: '#00E87A', border: 'rgba(0,232,122,.3)'   },
    BUILDING:    { bg: 'rgba(245,181,48,.08)',  color: '#F5B530', border: 'rgba(245,181,48,.3)'  },
    ROADMAP:     { bg: 'rgba(136,153,170,.07)', color: '#8899AA', border: 'rgba(136,153,170,.2)' },
    COMING_SOON: { bg: 'rgba(0,200,255,.07)',   color: '#00C8FF', border: 'rgba(0,200,255,.2)'   },
  }[status];

  return (
    <span className="font-mono inline-flex items-center gap-1.5"
      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
               padding: '3px 9px', fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase' }}>
      <span className="w-1.5 h-1.5 rounded-full"
        style={{ background: cfg.color, animation: status === 'LIVE' ? 'pulse 2s ease infinite' : undefined }} />
      {status.replace('_', ' ')}
    </span>
  );
}
