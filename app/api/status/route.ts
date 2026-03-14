// app/api/status/route.ts
// Server-side health checks for all ProStack NG platforms.
// Called by the /status page every 60 seconds.
// Returns response times + up/down status for each service.
//
// ⚠️  UPDATE THE URLS BELOW to match your actual platform domains.

import { NextResponse } from 'next/server';

const SERVICES = [
  {
    id:    'autoreport',
    name:  'AutoReport',
    color: '#FF5757',
    // Replace with your actual platform URL — ideally a /health or /api/ping endpoint
    url:   'https://autoreport.prostackng.com.ng',
  },
  {
    id:    'protrackng',
    name:  'ProTrackNG',
    color: '#06B6D4',
    url:   'https://protrackng.prostackng.com.ng',
  },
  {
    id:    'nightops',
    name:  'NightOps',
    color: '#A78BFA',
    url:   'https://nightops.prostackng.com.ng',
  },
  {
    id:    'website',
    name:  'ProStack NG Website',
    color: '#2563EB',
    url:   'https://www.prostackng.com.ng',
  },
  {
    id:    'database',
    name:  'Database (Supabase)',
    color: '#22C55E',
    // Your Supabase project REST URL — this endpoint always returns 200 if Supabase is up
    url:   `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`,
  },
];

async function pingService(service: typeof SERVICES[0]) {
  const start = Date.now();
  try {
    const res = await fetch(service.url, {
      method: 'GET',
      signal: AbortSignal.timeout(8000), // 8s timeout
      headers: { 'User-Agent': 'ProStack-Status-Monitor/1.0' },
    });
    const ms = Date.now() - start;
    return {
      ...service,
      status: res.ok || res.status < 500 ? 'operational' : 'degraded',
      latencyMs: ms,
      httpStatus: res.status,
      checkedAt: new Date().toISOString(),
    };
  } catch (err: any) {
    return {
      ...service,
      status: err?.name === 'TimeoutError' ? 'degraded' : 'down',
      latencyMs: Date.now() - start,
      httpStatus: 0,
      checkedAt: new Date().toISOString(),
      error: err?.message ?? 'Unknown error',
    };
  }
}

export async function GET() {
  const results = await Promise.all(SERVICES.map(pingService));

  const overall = results.every(r => r.status === 'operational')
    ? 'operational'
    : results.some(r => r.status === 'down')
    ? 'outage'
    : 'degraded';

  return NextResponse.json(
    { overall, services: results, generatedAt: new Date().toISOString() },
    {
      headers: {
        // Cache for 60s at CDN edge so we don't hammer platforms
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}
