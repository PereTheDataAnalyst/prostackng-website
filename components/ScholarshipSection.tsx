'use client';
import { useState } from 'react';
import ScholarshipForm from '@/components/ScholarshipForm';

export default function ScholarshipSection() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* Info strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: 12, marginBottom: 40 }}>
        {[
          { label: 'Application',   value: 'Free'              },
          { label: 'Aid Available', value: 'Up to 100%'        },
          { label: 'Response Time', value: 'Before each cohort'},
          { label: 'Open To',       value: 'All Nigerians'     },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: '16px 20px' }}>
            <div className="f-mono" style={{ fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6 }}>{s.label}</div>
            <div className="f-display" style={{ fontSize: 16, fontWeight: 700, color: 'var(--blue-hi)' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* CTA strip */}
      <div style={{
        background: 'rgba(37,99,235,.06)', border: '1px solid var(--blue-dim)',
        padding: '28px 32px', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20,
        marginBottom: open ? 24 : 0,
      }}>
        <div>
          <h3 className="f-display" style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>
            Ready to Apply?
          </h3>
          <p className="f-body" style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.6 }}>
            Fill in the form below. We review all applications 4 weeks before each cohort and respond to every applicant.
          </p>
        </div>
        <button
          onClick={() => setOpen(o => !o)}
          className="btn btn-primary"
          style={{ fontSize: 11, cursor: 'pointer', border: 'none', whiteSpace: 'nowrap' }}
        >
          {open ? '✕ Close Application' : 'Start Application →'}
        </button>
      </div>

      {/* Form — shown only when open */}
      {open && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: 'clamp(28px,4vw,40px)' }}>
          <ScholarshipForm />
        </div>
      )}
    </div>
  );
}
