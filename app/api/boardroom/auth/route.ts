// rebuilt: 2026-03-13
import { NextRequest, NextResponse } from 'next/server';

const TOKENS: Record<string, { name: string; role: string; color: string }> = {
  'PSN-CEO-001':   { name: 'Fubara',     role: 'CEO',               color: '#2563EB' },
  'PSN-ENG-001':   { name: 'Eng 01',     role: 'Lead Engineer',     color: '#06B6D4' },
  'PSN-ENG-002':   { name: 'Eng 02',     role: 'Backend Engineer',  color: '#38BDF8' },
  'PSN-DES-001':   { name: 'Design 01',  role: 'UI/UX Designer',    color: '#A78BFA' },
  'PSN-MKT-001':   { name: 'Mkt 01',     role: 'Marketing Lead',    color: '#F472B6' },
  'PSN-OPS-001':   { name: 'Ops 01',     role: 'Operations',        color: '#FB923C' },
  'PSN-FIN-001':   { name: 'Finance 01', role: 'Finance Lead',      color: '#FBBF24' },
  'PSN-DEV-001':   { name: 'Dev 01',     role: 'Full-Stack Dev',    color: '#34D399' },
  'PSN-DEV-002':   { name: 'Dev 02',     role: 'Full-Stack Dev',    color: '#60A5FA' },
  'PSN-PM-001':    { name: 'PM 01',      role: 'Product Manager',   color: '#E879F9' },
  'PSN-SMM-001':   { name: 'SMM 01',     role: 'Social Media Manager', color: '#EC4899' },
  'PSN-LEGAL-001': { name: 'Legal 01',  role: 'Legal/Compliance',  color: '#10B981' },
  'PSN-HR-001':    { name: 'HR 01',     role: 'Operations',        color: '#FB923C' },
  'PSN-GUEST-001': { name: 'Guest',     role: 'Guest',             color: '#636687' },
};

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (!token) return NextResponse.json({ error: 'Token required' }, { status: 400 });
    const user = TOKENS[token.trim().toUpperCase()];
    if (!user) return NextResponse.json({ error: 'Invalid token. Contact your administrator.' }, { status: 401 });
    return NextResponse.json({ success: true, user: { ...user, token: token.trim().toUpperCase() } });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
