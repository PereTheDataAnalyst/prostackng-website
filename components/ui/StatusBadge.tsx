type Status = 'LIVE' | 'BUILDING' | 'ROADMAP' | 'COMING_SOON';

const MAP: Record<Status, { label: string; cls: string; dot: string }> = {
  LIVE:        { label: 'Live',        cls: 'badge badge-live',        dot: '#34D399' },
  BUILDING:    { label: 'Building',    cls: 'badge badge-building',    dot: '#FBBF24' },
  ROADMAP:     { label: 'Roadmap',     cls: 'badge badge-roadmap',     dot: '#60A5FA' },
  COMING_SOON: { label: 'Coming Soon', cls: 'badge badge-coming_soon', dot: '#636687' },
};

export default function StatusBadge({ status }: { status: Status }) {
  const { label, cls, dot } = MAP[status] ?? MAP.COMING_SOON;
  return (
    <span className={cls}>
      <span style={{
        width: 5, height: 5, borderRadius: '50%', background: dot,
        display: 'inline-block', flexShrink: 0,
        animation: status === 'LIVE' ? 'pulse-dot 2s infinite' : undefined,
      }} />
      {label}
    </span>
  );
}
