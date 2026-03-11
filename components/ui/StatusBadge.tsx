type Status = 'LIVE' | 'BUILDING' | 'ROADMAP' | 'COMING_SOON';

export default function StatusBadge({ status }: { status: Status }) {
  const cfg: Record<Status, { bg: string; color: string; border: string }> = {
    LIVE:        { bg: 'rgba(0,232,122,.08)',   color: '#00E87A', border: 'rgba(0,232,122,.22)'   },
    BUILDING:    { bg: 'rgba(245,181,48,.07)',  color: '#F5B530', border: 'rgba(245,181,48,.22)'  },
    ROADMAP:     { bg: 'rgba(139,92,246,.08)',  color: '#A78BFA', border: 'rgba(139,92,246,.22)'  },
    COMING_SOON: { bg: 'rgba(0,200,255,.07)',   color: '#00C8FF', border: 'rgba(0,200,255,.22)'   },
  };
  const c = cfg[status];
  return (
    <span
      className="font-mono inline-flex items-center gap-1.5"
      style={{
        background: c.bg, color: c.color, border: `1px solid ${c.border}`,
        padding: '3px 9px', fontSize: 9.5, letterSpacing: '.14em', textTransform: 'uppercase',
      }}
    >
      <span
        className="rounded-full"
        style={{
          width: 5, height: 5,
          background: c.color,
          animation: status === 'LIVE' ? 'pulse 2s ease infinite' : undefined,
          flexShrink: 0,
        }}
      />
      {status.replace('_', ' ')}
    </span>
  );
}
