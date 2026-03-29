// app/api/payments/verify/route.ts
//
// Verifies a Paystack payment by reference.
// Called after redirect from Paystack payment page.
// Also used by the webhook handler to confirm charge.success events.

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get('ref') ?? req.nextUrl.searchParams.get('reference');

  if (!reference) {
    return NextResponse.json({ error: 'Reference required' }, { status: 400 });
  }

  try {
    // ── Verify with Paystack ────────────────────────────────────
    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      }
    );

    const paystackData = await paystackRes.json();

    if (!paystackData.status || paystackData.data?.status !== 'success') {
      return NextResponse.json({
        verified: false,
        status: paystackData.data?.status ?? 'unknown',
        message: 'Payment not successful',
      });
    }

    const { amount, currency, customer, metadata } = paystackData.data;

    // ── Update Supabase ─────────────────────────────────────────
    await supabase
      .from('prostack_payments')
      .update({
        status:      'paid',
        paid_at:     new Date().toISOString(),
        amount_kobo: amount,
      })
      .eq('reference', reference);

    // ── Send payment receipt ────────────────────────────────────
    if (customer?.email) {
      await resend.emails.send({
        from:    'ProStack NG <hello@prostackng.com.ng>',
        to:      [customer.email],
        subject: `Payment Confirmed — ${metadata?.service_label ?? 'ProStack NG Service'}`,
        html: `
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; max-width: 600px; margin: 0 auto; background: #080B14; color: #EEF0FF; padding: 32px; border: 1px solid #181C30;">
            <div style="font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; margin-bottom: 24px;">Payment Confirmed ✓</div>
            <p style="font-size: 14px; color: #7A7DA0; line-height: 1.8; margin: 0 0 16px;">
              Hi${metadata?.customer_name ? ` ${metadata.customer_name}` : ''},
            </p>
            <p style="font-size: 14px; color: #7A7DA0; line-height: 1.8; margin: 0 0 16px;">
              Your payment has been confirmed. Here are the details:
            </p>
            <div style="padding: 20px; background: rgba(37,99,235,.08); border: 1px solid rgba(37,99,235,.3); margin-bottom: 24px;">
              <table style="width: 100%; border-collapse: collapse;">
                ${[
                  ['Service',   metadata?.service_label ?? '—'],
                  ['Amount',    `₦${(amount / 100).toLocaleString()} ${currency}`],
                  ['Reference', reference],
                  ['Date',      new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })],
                ].map(([label, value]) => `
                  <tr style="border-bottom: 1px solid rgba(37,99,235,.15);">
                    <td style="padding: 8px 0; font-size: 11px; color: #7A7DA0; font-family: monospace; letter-spacing: .1em; text-transform: uppercase; width: 40%;">${label}</td>
                    <td style="padding: 8px 0; font-size: 13px; color: #EEF0FF;">${value}</td>
                  </tr>
                `).join('')}
              </table>
            </div>
            <p style="font-size: 14px; color: #7A7DA0; line-height: 1.8; margin: 0 0 32px;">
              Our team will be in touch within 24 hours to confirm next steps for your engagement.
              If you have any questions, reply to this email or WhatsApp us at +234 705 944 9360.
            </p>
            <div style="font-size: 12px; color: #32365A; font-family: monospace; letter-spacing: .08em; border-top: 1px solid #181C30; padding-top: 20px;">
              ProStack NG Technologies · Port Harcourt, Nigeria · hello@prostackng.com.ng
            </div>
          </div>
        `,
      });

      // Notify admin
      await resend.emails.send({
        from:    'ProStack NG <hello@prostackng.com.ng>',
        to:      ['hello@prostackng.com.ng'],
        subject: `Payment Received — ${metadata?.service_label ?? reference} (₦${(amount / 100).toLocaleString()})`,
        html: `
          <div style="font-family: monospace; max-width: 500px; background: #080B14; color: #EEF0FF; padding: 24px; border: 1px solid #181C30;">
            <div style="font-size: 16px; font-weight: 800; margin-bottom: 16px; color: #34D399;">💰 Payment Received</div>
            <table style="width: 100%;">
              ${[
                ['Service',   metadata?.service_label ?? '—'],
                ['Amount',    `₦${(amount / 100).toLocaleString()}`],
                ['From',      `${metadata?.customer_name ?? ''} &lt;${customer.email}&gt;`],
                ['Reference', reference],
              ].map(([l, v]) => `<tr><td style="padding: 6px 0; font-size: 11px; color: #32365A; text-transform: uppercase; letter-spacing: .1em; width: 35%">${l}</td><td style="font-size: 13px; padding: 6px 0">${v}</td></tr>`).join('')}
            </table>
          </div>
        `,
      });
    }

    return NextResponse.json({
      verified: true,
      reference,
      amount_naira: amount / 100,
      service_label: metadata?.service_label,
    });

  } catch (err) {
    console.error('Payment verify error:', err);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
