'use client';
import { useState } from 'react';
import ProjectIntakeForm from '@/components/ProjectIntakeForm';

export default function BuildWithUsSection() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* Stats strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))',
        gap: 12, marginBottom: 40,
      }}>
        {[
          { label: 'Response Time',    value: 'Within 48 hrs'   },
          { label: 'Scoping Call',     value: 'Free'            },
          { label: 'Brief Treatment',  value: 'Confidential'    },
          { label: 'Minimum Package',  value: '₦2,000,000'      },
        ].map(s => (
          <div key={s.label} style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            padding: '16px 20px',
          }}>
            <div className="f-mono" style={{
              fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase',
              color: 'var(--muted)', marginBottom: 6,
            }}>{s.label}</div>
            <div className="f-display" style={{
              fontSize: 16, fontWeight: 700, color: 'var(--blue-hi)',
            }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* CTA strip */}
      <div style={{
        background: 'rgba(37,99,235,.06)', border: '1px solid var(--blue-dim)',
        padding: '28px 32px',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: 20,
        marginBottom: open ? 24 : 0,
      }}>
        <div>
          <h3 className="f-display" style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>
            Ready to Start?
          </h3>
          <p className="f-body" style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.6 }}>
            Fill in the brief below. We review every submission and respond within 48 hours
            with a scoping call invitation. All briefs are confidential.
          </p>
        </div>
        <button
          onClick={() => setOpen(o => !o)}
          className="btn btn-primary"
          style={{ fontSize: 11, cursor: 'pointer', border: 'none', whiteSpace: 'nowrap' }}
        >
          {open ? '✕ Close Brief' : 'Start Your Build →'}
        </button>
      </div>

      {/* Form — shown only when open */}
      {open && (
        <div style={{
          background: 'var(--card)', border: '1px solid var(--border)',
          padding: 'clamp(28px,4vw,40px)',
        }}>
          <ProjectIntakeForm />
        </div>
      )}
    </div>
  );
}
