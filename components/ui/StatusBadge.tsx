export default function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    LIVE:        { label: 'LIVE',        color: '#00E87A', bg: 'rgba(0,232,122,.08)'  },
    BUILDING:    { label: 'BUILDING',    color: '#F5B530', bg: 'rgba(245,181,48,.08)' },
    ROADMAP:     { label: 'ROADMAP',     color: '#445566', bg: 'rgba(68,85,102,.12)'  },
    COMING_SOON: { label: 'COMING SOON', color: '#8899AA', bg: 'rgba(136,153,170,.1)' },
  };
  const s = map[status] ?? map['ROADMAP'];
  return (
    <span style={{ fontFamily:'DM Mono, monospace', fontSize:9, letterSpacing:'.14em', color:s.color, background:s.bg, border:`1px solid ${s.color}30`, padding:'3px 8px', display:'inline-block' }}>
      {s.label}
    </span>
  );
}
