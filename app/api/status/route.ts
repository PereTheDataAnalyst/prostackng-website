// app/api/status/route.ts
// Server-side health checks for all ProStack NG platforms.
// Called by the /status page every 60 seconds.
// Returns response times + up/down status for each service.
//
// ⚠️  UPDATE THE URLS BELOW to match your actual platform domains.

import { NextResponse } from 'next/server';

// Services with a url are actively pinged.
// Services with comingSoon: true are skipped and shown as "Scheduled" instead.
type Service = {
  id: string; name: string; color: string;
  url?: string; comingSoon?: boolean;
};

const SERVICES: Service[] = [
  {
    id:    'clubops',
    name:  'ClubOps (NightOps)',
    color: '#A78BFA',
    url:   'https://clubops-b6zl.onrender.com/',
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
    url:   `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`,
  },
  {
    id:         'autoreport',
    name:       'AutoReport',
    color:      '#FF5757',
    comingSoon: true,
  },
  {
    id:         'protrackng',
    name:       'ProTrackNG',
    color:      '#06B6D4',
    comingSoon: true,
  },
];

async function pingService(service: Service) {
  // Coming soon — skip ping, return scheduled status
  if (service.comingSoon) {
    return {
      ...service,
      status: 'scheduled',
      latencyMs: 0,
      httpStatus: 0,
      checkedAt: new Date().toISOString(),
    };
  }

  const start = Date.now();
  try {
    const res = await fetch(service.url!, {
      method: 'GET',
      signal: AbortSignal.timeout(8000),
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

  // Only count active (non-scheduled) services for overall status
  const active = results.filter(r => r.status !== 'scheduled');
  const overall = active.every(r => r.status === 'operational')
    ? 'operational'
    : active.some(r => r.status === 'down')
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
