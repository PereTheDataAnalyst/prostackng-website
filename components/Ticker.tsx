const ITEMS = [
  '3 LIVE PLATFORMS',
  'BUILT IN PORT HARCOURT',
  '20+ CLIENTS SERVED',
  '8-SECOND REPORTING PIPELINE',
  'NIGERIA · AFRICA',
  'TENDER INTELLIGENCE',
  'NIGHTLIFE OS',
  'AUTOMATED REPORTING',
  'REAL-TIME INFRASTRUCTURE',
  'SERIES A READY',
];

export default function Ticker() {
  const doubled = [...ITEMS, ...ITEMS];
  return (
    <div className="ticker-wrap" style={{
      background: 'var(--s1)',
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
      padding: '11px 0',
    }}>
      <div className="ticker-inner">
        {doubled.map((item, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 0 }}>
            <span className="f-mono" style={{
              fontSize: 9,
              letterSpacing: '.22em',
              color: 'var(--sub)',
              padding: '0 28px',
              whiteSpace: 'nowrap',
            }}>
              {item}
            </span>
            <span style={{ color: 'var(--blue)', fontSize: 8, opacity: .6 }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
