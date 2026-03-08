const ITEMS = [
  'Web Development', 'Mobile Apps', 'ERP Systems', 'CRM & POS', 'Python Automation',
  'Data Pipelines', 'UI/UX Design', 'Cloud & DevOps', 'IT Consulting', 'Digital Transformation',
  'Tender Tracking', 'Nightlife OS', 'Marketplace Platforms', 'Ride-Hailing Tech', 'Executive Reporting',
];

export default function Ticker() {
  const doubled = [...ITEMS, ...ITEMS];
  return (
    <div className="ticker-wrap border-t border-b"
      style={{ background: 'rgba(0,232,122,.06)', borderColor: 'rgba(0,232,122,.14)', padding: '11px 0' }}>
      <div className="ticker-inner">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap">
            <span className="font-mono text-accent" style={{ fontSize: 11, letterSpacing: '.12em' }}>{item}</span>
            <span className="text-muted" style={{ fontSize: 8 }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
