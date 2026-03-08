import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const { token } = await req.json();
  if (!token) return NextResponse.json({ error: 'Token required' }, { status: 400 });

  const { data, error } = await supabaseAdmin()
    .from('staff_tokens')
    .select('*')
    .eq('token', token.toUpperCase().trim())
    .eq('active', true)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Invalid or inactive token' }, { status: 401 });
  }

  return NextResponse.json({ user: { name: data.name, role: data.role, color: data.color, token: data.token } });
}