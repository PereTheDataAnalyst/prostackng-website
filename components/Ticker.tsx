export default function Ticker() {
  const items = [
    'ProTrackNG', 'NightOps', 'AutoReport', 'MyHarriet', 'SwiftRide', 'StakeX',
    'Port Harcourt', 'Nigeria', 'Africa Tech', 'Platform Infrastructure',
    'ProTrackNG', 'NightOps', 'AutoReport', 'MyHarriet', 'SwiftRide', 'StakeX',
    'Port Harcourt', 'Nigeria', 'Africa Tech', 'Platform Infrastructure',
  ];

  return (
    <div
      className="ticker-wrap"
      style={{
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        background: 'var(--surface)',
        padding: '14px 0',
        overflow: 'hidden',
      }}
    >
      <div className="ticker-inner">
        {items.map((item, i) => (
          <span
            key={i}
            className="font-mono text-muted"
            style={{
              padding: '0 28px',
              fontSize: 11,
              letterSpacing: '.14em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            {item}
            <span style={{ color: 'var(--accent)', fontSize: 7 }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
