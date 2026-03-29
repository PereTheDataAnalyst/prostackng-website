// ============================================================
// ProStack NG — Central Paystack Webhook Router
// File location: src/app/api/webhooks/paystack/route.ts
//   (or src/pages/api/webhooks/paystack.ts if using Pages Router)
//
// Register ONE URL in Paystack: https://prostackng.com.ng/api/webhooks/paystack
// Never change it. Add new products by adding to PRODUCTS below.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// ── Signature verification ────────────────────────────────
function verifySignature(rawBody: string, signature: string): boolean {
  const secret = process.env.PAYSTACK_SECRET_KEY ?? '';
  const hash = crypto.createHmac('sha512', secret).update(rawBody).digest('hex');
  return hash === signature;
}

// ── Registered products ───────────────────────────────────
// Add a new product: add one entry here + one env var in Vercel
const PRODUCTS = [
  {
    name: 'ClubOps',
    urlEnvKey: 'CLUBOPS_WEBHOOK_URL',
    // e.g. https://clubops.up.railway.app/webhook/paystack
  },
  {
    name: 'LodgeIQ',
    urlEnvKey: 'LODGEIQ_WEBHOOK_URL',
    // e.g. https://web-production-0fd1b.up.railway.app/webhook/paystack (your current one)
  },
  {
    name: 'AutoReport',
    urlEnvKey: 'AUTOREPORT_WEBHOOK_URL',
    // https://autoreport.prostackng.com.ng/api/webhooks/paystack
  },
  {
    name: 'ProTrackNG',
    urlEnvKey: 'PROTRACKNG_WEBHOOK_URL',
    // https://protrackng-production.up.railway.app/api/v1/payments/webhook
  },
  // Future products — add here when ready:
  // { name: 'ProStack Academy', urlEnvKey: 'PROSTACKNG_PAYMENT_HANDLER_URL' },
  // { name: 'NewProduct', urlEnvKey: 'NEWPRODUCT_WEBHOOK_URL' },
];

// ── Forward to one product ────────────────────────────────
async function forwardToProduct(
  name: string,
  url: string,
  rawBody: string,
  signature: string
): Promise<{ name: string; status: number | string }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-paystack-signature': signature,
        'x-forwarded-by': 'prostackng-webhook-router',
      },
      body: rawBody,
      signal: controller.signal,
    });

    clearTimeout(timeout);
    console.log(`[Paystack Router] ${name} → ${res.status}`);
    return { name, status: res.status };

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[Paystack Router] ${name} failed: ${message}`);
    return { name, status: message.includes('abort') ? 'timeout' : 'error' };
  }
}

// ── Handle ProStack's own payments ────────────────────────
// When ProStack Academy, consultations, etc. go live,
// handle them here directly without forwarding
async function handleProStackPayment(event: {
  event: string;
  data: Record<string, unknown>;
}): Promise<void> {
  // TODO: when ProStack Academy launches, handle:
  // - course purchases
  // - consultation fee payments
  // - any direct ProStack product payments
  //
  // Example:
  // if (event.event === 'charge.success') {
  //   const email = (event.data.customer as Record<string, string>)?.email;
  //   const metadata = event.data.metadata as Record<string, string>;
  //   if (metadata?.product === 'academy') {
  //     await grantCourseAccess(email, metadata.course_id);
  //   }
  // }

  // For now, just log
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[ProStack] Received event: ${event.event}`);
  }
}

// ── Main handler ──────────────────────────────────────────
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get('x-paystack-signature') ?? '';

  // Verify signature — reject anything not from Paystack
  if (!verifySignature(rawBody, signature)) {
    console.error('[Paystack Router] Invalid signature rejected');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  // Parse event
  let event: { event: string; data: Record<string, unknown> };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  console.log(`[Paystack Router] Event: ${event.event}`);

  // Respond to Paystack immediately — must be within 20 seconds
  // Fan-out happens after response is sent (fire and forget via waitUntil if available,
  // or synchronously before responding)

  // Collect enabled product URLs
  const targets = PRODUCTS
    .map(p => ({ name: p.name, url: process.env[p.urlEnvKey] ?? '' }))
    .filter(p => p.url.length > 0);

  // Handle ProStack's own payments + forward to products in parallel
  await Promise.all([
    handleProStackPayment(event),
    ...targets.map(p => forwardToProduct(p.name, p.url, rawBody, signature)),
  ]);

  return NextResponse.json({ received: true, forwarded_to: targets.map(p => p.name) });
}

// ── Health check ──────────────────────────────────────────
export async function GET() {
  const products = PRODUCTS.map(p => ({
    name: p.name,
    configured: !!(process.env[p.urlEnvKey]),
    url: process.env[p.urlEnvKey] ? `${process.env[p.urlEnvKey]?.slice(0, 30)}...` : 'not set',
  }));

  return NextResponse.json({
    service: 'ProStack NG Webhook Router',
    status: 'active',
    products,
  });
}
