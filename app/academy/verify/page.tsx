import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Verify Certificate — ProStack NG Academy',
  description: 'Verify the authenticity of a ProStack NG Academy certificate using the certificate ID.',
  alternates: { canonical: 'https://www.prostackng.com.ng/academy/verify' },
};

// ─── In production: replace with Supabase query (see STREAM_1_INTEGRATION.md) ─
const MOCK_CERTS: Record<string, {
  name: string; course: string; completedAt: string; certificateId: string; instructor: string;
}> = {
  'CERT-PSA-2025-00142': {
    name: 'Precious Amiekumo',
    course: 'Building SaaS with Next.js + Supabase',
    completedAt: '15 March 2025',
    certificateId: 'CERT-PSA-2025-00142',
    instructor: 'Suoyo Amiekumo',
  },
  'CERT-PSA-2025-00101': {
    name: 'Chukwuemeka Obi',
    course: 'Tender Intelligence — Winning Nigerian Government Contracts',
    completedAt: '2 February 2025',
    certificateId: 'CERT-PSA-2025-00101',
    instructor: 'Suoyo Amiekumo',
  },
};

interface Props { searchParams: { id?: string }; }

export default function VerifyPage({ searchParams }: Props) {
  const certId = searchParams.id?.toUpperCase().trim();
  const cert   = certId ? MOCK_CERTS[certId] : null;
  const searched = Boolean(certId);

  return (
    <main style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(37,99,235,.1) 0%, transparent 55%)',
      }} />

      <div style={{ maxWidth: 600, margin: '0 auto', padding: 'clamp(96px,12vw,128px) clamp(16px,4vw,24px) 64px', position: 'relative' }}>

        <Link href="/academy" className="f-mono" style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 40 }}>
          ← Back to Academy
        </Link>

        <div className="eyebrow" style={{ marginBottom: 20 }}>Certificate Verification</div>

        <h1 className="f-display" style={{ fontSize: 'clamp(28px,5vw,44px)', fontWeight: 800, letterSpacing: '-.03em', marginBottom: 12 }}>
          Verify a Certificate
        </h1>
        <p className="f-body" style={{ fontSize: 14, color: 'var(--sub)', marginBottom: 36, lineHeight: 1.7 }}>
          Enter the certificate ID printed on the certificate to confirm its authenticity.
        </p>

        {/* Search form */}
        <form method="GET" action="/academy/verify" style={{ display: 'flex', gap: 10, marginBottom: 40 }}>
          <input
            type="text"
            name="id"
            defaultValue={certId}
            placeholder="e.g. CERT-PSA-2025-00142"
            className="ps-input"
            style={{ flex: 1, padding: '13px 16px' }}
          />
          <button type="submit" className="btn btn-primary" style={{ fontSize: 11, padding: '12px 28px', cursor: 'pointer' }}>
            Verify
          </button>
        </form>

        {/* ─── Verified ─── */}
        {searched && cert && (
          <div style={{ background: 'rgba(16,185,129,.06)', border: '1px solid rgba(16,185,129,.25)', padding: '28px' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 24 }}>
              <div style={{ fontSize: 22 }}>✅</div>
              <div>
                <div className="f-display" style={{ fontSize: 15, fontWeight: 700, color: '#34D399', marginBottom: 4 }}>
                  Certificate Verified
                </div>
                <div className="f-body" style={{ fontSize: 12, color: 'var(--sub)' }}>
                  This is a genuine ProStack NG Academy certificate
                </div>
              </div>
            </div>

            {[
              { label: 'Graduate Name',   value: cert.name           },
              { label: 'Course Completed', value: cert.course        },
              { label: 'Completion Date',  value: cert.completedAt   },
              { label: 'Certificate ID',   value: cert.certificateId },
              { label: 'Instructor',       value: cert.instructor    },
              { label: 'Issuing Body',     value: 'ProStack NG Academy, Port Harcourt' },
            ].map(row => (
              <div key={row.label} style={{
                display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
                padding: '10px 0', borderBottom: '1px solid var(--border)',
              }}>
                <span className="f-mono" style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)' }}>{row.label}</span>
                <span className="f-body" style={{ fontSize: 13, color: 'var(--text)', textAlign: 'right' }}>{row.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* ─── Not found ─── */}
        {searched && !cert && (
          <div style={{ background: 'rgba(220,38,38,.05)', border: '1px solid rgba(220,38,38,.2)', padding: '24px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ fontSize: 20 }}>❌</div>
            <div>
              <div className="f-display" style={{ fontSize: 15, fontWeight: 700, color: '#F87171', marginBottom: 6 }}>Certificate Not Found</div>
              <p className="f-body" style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.7 }}>
                No certificate matching{' '}
                <span className="f-mono" style={{ color: 'var(--text)', fontSize: 12 }}>{certId}</span>{' '}
                was found. Please double-check the ID or contact{' '}
                <a href="mailto:academy@prostackng.com.ng" style={{ color: 'var(--blue-hi)' }}>
                  academy@prostackng.com.ng
                </a>.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
