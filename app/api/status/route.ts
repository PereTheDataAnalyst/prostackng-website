// app/api/status/route.ts
// Server-side health checks for all ProStack NG platforms.
// Called by the /status page every 60 seconds.

import { NextResponse } from 'next/server';

type Service = {
  id: string; name: string; color: string;
  url?: string; comingSoon?: boolean;
  slowStart?: boolean; // Render free tier — retries once on timeout
};

const SERVICES: Service[] = [
  {
    id:         'clubops',
    name:       'ClubOps (NightOps)',
    color:      '#A78BFA',
    url:        'https://clubops-b6zl.onrender.com/',
    slowStart:  true, // Render free tier spins down — retry once before marking degraded
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
    id:    'autoreport',
    name:  'AutoReport',
    color: '#FF5757',
    url:   'https://autoreport.prostackng.com.ng/',
  },
  {
    id:    'protrackng',
    name:  'ProTrackNG',
    color: '#06B6D4',
    url:   'https://www.protrackng.com.ng/',
  },
];

// Single ping attempt
async function attemptPing(url: string, timeoutMs: number) {
  const start = Date.now();
  const res = await fetch(url, {
    method: 'GET',
    signal: AbortSignal.timeout(timeoutMs),
    headers: { 'User-Agent': 'ProStack-Status-Monitor/1.0' },
  });
  return { ok: res.ok || res.status < 500, ms: Date.now() - start, httpStatus: res.status };
}

async function pingService(service: Service) {
  if (service.comingSoon) {
    return {
      ...service, status: 'scheduled',
      latencyMs: 0, httpStatus: 0,
      checkedAt: new Date().toISOString(),
    };
  }

  const start = Date.now();

  try {
    // First attempt — 15s timeout
    const result = await attemptPing(service.url!, 15000);
    return {
      ...service,
      status: result.ok ? 'operational' : 'degraded',
      latencyMs: result.ms,
      httpStatus: result.httpStatus,
      checkedAt: new Date().toISOString(),
    };
  } catch (firstErr: any) {
    const isTimeout = firstErr?.name === 'TimeoutError' || firstErr?.name === 'AbortError';

    // slowStart services (Render free tier) get one retry with a longer 30s window
    if (isTimeout && service.slowStart) {
      try {
        const retry = await attemptPing(service.url!, 30000);
        return {
          ...service,
          status: retry.ok ? 'operational' : 'degraded',
          latencyMs: Date.now() - start,
          httpStatus: retry.httpStatus,
          checkedAt: new Date().toISOString(),
          note: 'Recovered after cold start',
        };
      } catch {
        // Retry also failed — genuinely degraded, not just sleeping
        return {
          ...service,
          status: 'degraded',
          latencyMs: Date.now() - start,
          httpStatus: 0,
          checkedAt: new Date().toISOString(),
          error: 'Cold start timeout — service spinning up',
        };
      }
    }

    return {
      ...service,
      status: isTimeout ? 'degraded' : 'down',
      latencyMs: Date.now() - start,
      httpStatus: 0,
      checkedAt: new Date().toISOString(),
      error: firstErr?.message ?? 'Unknown error',
    };
  }
}

export async function GET() {
  const results = await Promise.all(SERVICES.map(pingService));

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
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}
