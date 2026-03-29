// app/api/payments/create/route.ts
//
// ProStack NG internal payment infrastructure.
// Creates Paystack payment links for ProStack's own services:
//   - Managed service retainer payments
//   - Consulting engagement deposits
//   - White-label licence fees
//   - Academy course purchases (fallback if Selar not used)
//   - Any other ProStack-billed service
//
// Usage: POST /api/payments/create
// Body: { service, amount, email, name, metadata }
// Returns: { authorization_url, access_code, reference }

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ── Registered ProStack services ─────────────────────────────
export const PROSTACK_SERVICES = {
  // Managed Services
  'managed-starter':    { label: 'Managed Service — Starter',    minAmount: 5000000   }, // ₦50,000 in kobo
  'managed-growth':     { label: 'Managed Service — Growth',     minAmount: 12000000  }, // ₦120,000 in kobo
  'managed-enterprise': { label: 'Managed Service — Enterprise', minAmount: 20000000  }, // ₦200,000+ in kobo

  // Consulting
  'consulting-audit':     { label: 'Digital Transformation Audit',          minAmount: 50000000  }, // ₦500,000
  'consulting-roadmap':   { label: 'Audit + Transformation Roadmap',        minAmount: 120000000 }, // ₦1,200,000
  'consulting-full':      { label: 'Full Digital Transformation',           minAmount: 300000000 }, // ₦3,000,000+

  // White Label
  'white-label-setup':    { label: 'White-Label Setup Fee',                 minAmount: 10000000  }, // ₦100,000
  'white-label-monthly':  { label: 'White-Label Monthly Licence',           minAmount: 5000000   }, // ₦50,000

  // Custom / General
  'deposit':              { label: 'ProStack NG Deposit',                   minAmount: 1000000   }, // ₦10,000 min
  'invoice':              { label: 'ProStack NG Invoice Payment',           minAmount: 1000000   },
} as const;

type ServiceKey = keyof typeof PROSTACK_SERVICES;

function generateReference(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `PSN-${timestamp}-${random}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { service, amount, email, name, metadata = {} } = body;

    // ── Validate service ────────────────────────────────────────
    if (!service || !(service in PROSTACK_SERVICES)) {
      return NextResponse.json(
        { error: `Unknown service. Valid services: ${Object.keys(PROSTACK_SERVICES).join(', ')}` },
        { status: 400 }
      );
    }

    // ── Validate amount (in kobo) ───────────────────────────────
    const serviceConfig = PROSTACK_SERVICES[service as ServiceKey];
    const amountKobo = Number(amount);
    if (!amountKobo || amountKobo < serviceConfig.minAmount) {
      return NextResponse.json(
        { error: `Minimum amount for ${service} is ₦${serviceConfig.minAmount / 100}` },
        { status: 400 }
      );
    }

    // ── Validate email ──────────────────────────────────────────
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    const reference = generateReference();

    // ── Create Paystack transaction ─────────────────────────────
    const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: amountKobo,
        reference,
        currency: 'NGN',
        callback_url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.prostackng.com.ng'}/payment/verify?ref=${reference}`,
        metadata: {
          product: 'prostack',
          service,
          service_label: serviceConfig.label,
          customer_name: name ?? '',
          ...metadata,
          custom_fields: [
            { display_name: 'Service', variable_name: 'service', value: serviceConfig.label },
            { display_name: 'Customer Name', variable_name: 'customer_name', value: name ?? '' },
          ],
        },
      }),
    });

    if (!paystackRes.ok) {
      const err = await paystackRes.json();
      console.error('Paystack error:', err);
      return NextResponse.json({ error: 'Payment provider error' }, { status: 502 });
    }

    const paystackData = await paystackRes.json();

    if (!paystackData.status) {
      return NextResponse.json({ error: paystackData.message ?? 'Paystack rejected the request' }, { status: 400 });
    }

    const { authorization_url, access_code } = paystackData.data;

    // ── Log to Supabase ─────────────────────────────────────────
    await supabase.from('prostack_payments').insert({
      reference,
      service,
      service_label:  serviceConfig.label,
      amount_kobo:    amountKobo,
      email,
      name:           name ?? null,
      status:         'pending',
      metadata:       JSON.stringify(metadata),
    });

    return NextResponse.json({
      success: true,
      authorization_url,
      access_code,
      reference,
      service_label: serviceConfig.label,
    });

  } catch (err) {
    console.error('Payment create error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ── GET — list available services (useful for frontend dropdowns) ──
export async function GET() {
  const services = Object.entries(PROSTACK_SERVICES).map(([key, val]) => ({
    key,
    label:      val.label,
    minAmount:  val.minAmount,
    minNaira:   `₦${(val.minAmount / 100).toLocaleString()}`,
  }));
  return NextResponse.json({ services });
}
