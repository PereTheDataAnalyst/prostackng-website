'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const SERVICES = [
  {
    group: 'Managed Services',
    items: [
      { key: 'managed-starter',    label: 'Managed Service — Starter',    amount: 50000,   period: '/month' },
      { key: 'managed-growth',     label: 'Managed Service — Growth',     amount: 120000,  period: '/month' },
      { key: 'managed-enterprise', label: 'Managed Service — Enterprise', amount: 200000,  period: '/month' },
    ],
  },
  {
    group: 'Consulting',
    items: [
      { key: 'consulting-audit',   label: 'Digital Transformation Audit',        amount: 500000,  period: 'one-time' },
      { key: 'consulting-roadmap', label: 'Audit + Transformation Roadmap',      amount: 1200000, period: 'one-time' },
      { key: 'consulting-full',    label: 'Full Digital Transformation — Deposit', amount: 1500000, period: 'deposit' },
    ],
  },
  {
    group: 'White Label',
    items: [
      { key: 'white-label-setup',   label: 'White-Label Setup Fee',          amount: 100000, period: 'one-time' },
      { key: 'white-label-monthly', label: 'White-Label Monthly Licence',    amount: 50000,  period: '/month'   },
    ],
  },
  {
    group: 'General',
    items: [
      { key: 'deposit', label: 'Project / Service Deposit', amount: 0,  period: 'custom' },
      { key: 'invoice', label: 'Invoice Payment',           amount: 0,  period: 'custom' },
    ],
  },
];

const ALL_ITEMS = SERVICES.flatMap(g => g.items);

export default function PaymentPage() {
  const [selectedKey, setSelectedKey] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [reference, setReference] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const selected = ALL_ITEMS.find(i => i.key === selectedKey);
  const isCustom = selected?.period === 'custom';
  const displayAmount = isCustom
    ? Number(customAmount.replace(/,/g, '')) || 0
    : selected?.amount ?? 0;

  async function handlePay() {
    if (!selectedKey) { setErrorMsg('Please select a service.'); return; }
    if (!name.trim())  { setErrorMsg('Please enter your name.'); return; }
    if (!email.trim() || !email.includes('@')) { setErrorMsg('Please enter a valid email.'); return; }
    if (isCustom && !customAmount) { setErrorMsg('Please enter the amount.'); return; }

    setErrorMsg('');
    setStatus('loading');

    try {
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: selectedKey,
          amount:  displayAmount * 100, // convert to kobo
          email,
          name,
          metadata: { reference_note: reference },
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.authorization_url) {
        throw new Error(data.error ?? 'Payment initialisation failed');
      }

      // Redirect to Paystack payment page
      window.location.href = data.authorization_url;

    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message ?? 'Something went wrong. Please try again or contact us.');
    }
  }

  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh', paddingTop: 68 }}>

        {/* Header */}
        <div className="bg-grid" style={{
          padding: 'clamp(48px,6vw,80px) clamp(16px,4vw,56px)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(37,99,235,.15) 0%, transparent 65%)' }} />
          <div style={{ maxWidth: 760, margin: '0 auto', position: 'relative' }}>
            <div className="eyebrow" style={{ marginBottom: 16 }}>Secure Payment</div>
            <h1 className="f-display" style={{ fontWeight: 800, fontSize: 'clamp(32px,5vw,60px)', letterSpacing: '-.04em', lineHeight: .95, marginBottom: 16 }}>
              Pay for a ProStack NG Service
            </h1>
            <p className="f-body" style={{ fontSize: 15, color: 'var(--sub)', lineHeight: 1.8, maxWidth: 560 }}>
              Select your service, enter your details, and pay securely via Paystack in Nigerian Naira.
              A receipt is sent to your email automatically on confirmation.
            </p>
          </div>
        </div>

        {/* Payment form */}
        <div style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(40px,5vw,64px) clamp(16px,4vw,56px)' }}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', overflow: 'hidden' }}>
            <div style={{ height: 2, background: 'linear-gradient(90deg, var(--blue), #06B6D4)' }} />
            <div style={{ padding: 'clamp(24px,4vw,40px)', display: 'flex', flexDirection: 'column', gap: 24 }}>

              {/* Service selection */}
              <div>
                <label className="f-mono" style={{ fontSize: 9, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 12 }}>
                  Select Service *
                </label>
                {SERVICES.map(group => (
                  <div key={group.group} style={{ marginBottom: 12 }}>
                    <div className="f-mono" style={{ fontSize: 8, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6, paddingLeft: 2 }}>
                      {group.group}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {group.items.map(item => (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => { setSelectedKey(item.key); setCustomAmount(''); }}
                          style={{
                            background: selectedKey === item.key ? 'rgba(37,99,235,.1)' : 'var(--s2)',
                            border: selectedKey === item.key ? '1px solid var(--blue)' : '1px solid var(--border)',
                            padding: '12px 16px',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            cursor: 'pointer', textAlign: 'left', transition: 'all .15s',
                            gap: 12, flexWrap: 'wrap',
                          }}
                        >
                          <span className="f-body" style={{ fontSize: 13, color: selectedKey === item.key ? 'var(--text)' : 'var(--sub)', fontWeight: selectedKey === item.key ? 600 : 400 }}>
                            {item.label}
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                            {item.amount > 0 && (
                              <span className="f-display" style={{ fontSize: 14, fontWeight: 700, color: selectedKey === item.key ? 'var(--blue-hi)' : 'var(--muted)' }}>
                                ₦{item.amount.toLocaleString()}
                              </span>
                            )}
                            <span className="f-mono" style={{ fontSize: 9, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                              {item.period}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Custom amount for deposit/invoice */}
              {isCustom && (
                <div>
                  <label className="f-mono" style={{ fontSize: 9, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 8 }}>
                    Amount (₦) *
                  </label>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={e => setCustomAmount(e.target.value)}
                    placeholder="Enter amount in Naira e.g. 250000"
                    className="ps-input"
                    style={{ width: '100%', padding: '12px 14px', fontSize: 15, fontFamily: 'Syne, sans-serif', fontWeight: 700 }}
                    min="1000"
                  />
                  {selected?.key === 'invoice' && (
                    <p className="f-mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.08em', marginTop: 6 }}>
                      Enter the exact amount shown on your invoice
                    </p>
                  )}
                </div>
              )}

              {/* Name + Email */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))', gap: 16 }}>
                <div>
                  <label className="f-mono" style={{ fontSize: 9, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 8 }}>
                    Full Name *
                  </label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder="Your full name" className="ps-input" style={{ width: '100%', padding: '12px 14px' }} />
                </div>
                <div>
                  <label className="f-mono" style={{ fontSize: 9, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 8 }}>
                    Email Address *
                  </label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@company.com" className="ps-input" style={{ width: '100%', padding: '12px 14px' }} />
                </div>
              </div>

              {/* Optional reference */}
              <div>
                <label className="f-mono" style={{ fontSize: 9, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 8 }}>
                  Reference / Note <span style={{ opacity: .5 }}>(Optional — e.g. invoice number, project name)</span>
                </label>
                <input type="text" value={reference} onChange={e => setReference(e.target.value)}
                  placeholder="e.g. INV-2026-0042 or Managed Services March" className="ps-input" style={{ width: '100%', padding: '12px 14px' }} />
              </div>

              {/* Amount summary */}
              {selectedKey && (
                <div style={{ background: 'var(--s2)', border: '1px solid var(--border)', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div className="f-mono" style={{ fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 4 }}>You are paying</div>
                    <div className="f-body" style={{ fontSize: 13, color: 'var(--sub)' }}>{selected?.label}</div>
                  </div>
                  <div className="f-display" style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-.03em', color: 'var(--blue-hi)' }}>
                    {displayAmount > 0 ? `₦${displayAmount.toLocaleString()}` : '—'}
                  </div>
                </div>
              )}

              {/* Error */}
              {errorMsg && (
                <div style={{ background: 'rgba(220,38,38,.05)', border: '1px solid rgba(220,38,38,.2)', padding: '12px 16px' }}>
                  <p className="f-body" style={{ fontSize: 13, color: '#F87171' }}>{errorMsg}</p>
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handlePay}
                disabled={status === 'loading'}
                className="btn btn-primary"
                style={{
                  width: '100%', justifyContent: 'center', fontSize: 13,
                  opacity: status === 'loading' ? .6 : 1,
                  cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                  padding: '16px',
                }}
              >
                {status === 'loading' ? 'Redirecting to Paystack...' : `Pay Securely with Paystack →`}
              </button>

              <p className="f-mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.08em', textAlign: 'center' }}>
                Payments processed securely in Nigerian Naira · Powered by Paystack · Receipt sent to your email
              </p>
            </div>
          </div>

          {/* Support strip */}
          <div style={{ marginTop: 24, background: 'var(--s1)', border: '1px solid var(--border)', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <p className="f-body" style={{ fontSize: 13, color: 'var(--sub)' }}>
              Need help with a payment? Received a proforma invoice?
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <a href="https://wa.me/2347059449360" target="_blank" rel="noreferrer"
                className="btn-outline-border" style={{ fontSize: 11, padding: '9px 16px' }}>
                WhatsApp Us
              </a>
              <a href="mailto:hello@prostackng.com.ng?subject=Payment%20Query"
                className="btn-outline-border" style={{ fontSize: 11, padding: '9px 16px' }}>
                Email Us
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
