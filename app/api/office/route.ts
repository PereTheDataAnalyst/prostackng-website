// app/api/office/route.ts
// Central API for the ProStack NG Virtual Office.
// Handles: clock-in/out, announcements, tasks, work requests, reports, dashboard data.
// All writes use service role key. Auth is validated via token lookup.

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ── Token → user map (mirrors boardroom auth) ─────────────────
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
  'PSN-CS-001':    { name: 'CS 01',     role: 'Customer Success',  color: '#10B981' },
  'PSN-PARTNER-001': { name: 'Partner',  role: 'Partner',           color: '#F59E0B' },
  'PSN-GUEST-001': { name: 'Guest',     role: 'Guest',             color: '#636687' },
};

function getUser(token: string) {
  return TOKENS[token?.trim().toUpperCase()] ?? null;
}

// ─────────────────────────────────────────────────────────────
// GET — fetch dashboard data
// ?action=dashboard (CEO full overview)
// ?action=clock_status&token=PSN-xxx (is this token clocked in today)
// ?action=today_clocks (all clock-ins today)
// ?action=announcements
// ?action=my_tasks&token=PSN-xxx
// ?action=requests (CEO/HR — all open requests)
// ?action=reports (CEO/HR — all reports)
// ?action=recent_enquiries (CEO — last 10 from all enquiry tables)
// ?action=recent_payments (CEO — last 10 payments)
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const action = searchParams.get('action');
  const token  = searchParams.get('token')?.trim().toUpperCase();

  try {
    // ── Dashboard (CEO only) ────────────────────────────────
    if (action === 'dashboard') {
      const today = new Date().toISOString().split('T')[0];

      const [clocks, announcements, openTasks, openRequests, payments, enquiries] = await Promise.all([
        supabase.from('office_clock_ins').select('*').eq('date_key', today).order('clocked_in_at', { ascending: false }),
        supabase.from('office_announcements').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('office_tasks').select('*').neq('status', 'done').order('created_at', { ascending: false }).limit(10),
        supabase.from('office_work_requests').select('*').eq('status', 'open').order('created_at', { ascending: false }).limit(10),
        supabase.from('prostack_payments').select('*').order('created_at', { ascending: false }).limit(8),
        // Fetch last 3 from each enquiry type
        supabase.from('consulting_enquiries').select('full_name, email, sector, package, created_at').order('created_at', { ascending: false }).limit(3),
      ]);

      return NextResponse.json({
        today_clocks:    clocks.data ?? [],
        announcements:   announcements.data ?? [],
        open_tasks:      openTasks.data ?? [],
        open_requests:   openRequests.data ?? [],
        recent_payments: payments.data ?? [],
        recent_enquiries: enquiries.data ?? [],
      });
    }

    // ── Finance dashboard ─────────────────────────────────────
    if (action === 'finance_dashboard') {
      const [payments, whiteLabel, consulting, projects, apiWaitlist] = await Promise.all([
        supabase.from('prostack_payments').select('*').order('created_at', { ascending: false }).limit(50),
        supabase.from('white_label_enquiries').select('full_name, company, platform, timeline, status, created_at').order('created_at', { ascending: false }).limit(10),
        supabase.from('consulting_enquiries').select('full_name, company, package, status, created_at').order('created_at', { ascending: false }).limit(10),
        supabase.from('project_intakes').select('full_name, company, package, budget, status, created_at').order('created_at', { ascending: false }).limit(10),
        supabase.from('api_waitlist').select('full_name, company, tier, created_at').order('created_at', { ascending: false }).limit(10),
      ]);
      const paid   = (payments.data ?? []).filter((p: any) => p.status === 'paid');
      const totalRevenue = paid.reduce((sum: number, p: any) => sum + (p.amount_kobo ?? 0), 0);
      return NextResponse.json({
        payments:      payments.data ?? [],
        white_label:   whiteLabel.data ?? [],
        consulting:    consulting.data ?? [],
        projects:      projects.data ?? [],
        api_waitlist:  apiWaitlist.data ?? [],
        total_revenue: totalRevenue,
        paid_count:    paid.length,
      });
    }

    // ── All tasks — dev / PM view ──────────────────────────────
    if (action === 'dev_tasks') {
      const { data } = await supabase
        .from('office_tasks')
        .select('*')
        .order('created_at', { ascending: false });
      return NextResponse.json({ tasks: data ?? [] });
    }

    // ── All open tasks (PM view) ───────────────────────────────
    if (action === 'all_tasks') {
      const { data } = await supabase
        .from('office_tasks')
        .select('*')
        .order('created_at', { ascending: false });
      return NextResponse.json({ tasks: data ?? [] });
    }

    // ── Monthly clock records ────────────────────────────────
    if (action === 'month_clocks') {
      const month = searchParams.get('month'); // format: YYYY-MM
      if (!month) return NextResponse.json({ error: 'month param required' }, { status: 400 });
      const startDate = `${month}-01`;
      // Get last day of month properly
      const [y, m] = month.split('-').map(Number);
      const lastDay = new Date(y, m, 0).getDate();
      const endDate = `${month}-${String(lastDay).padStart(2, '0')}`;
      const { data } = await supabase
        .from('office_clock_ins')
        .select('*')
        .gte('date_key', startDate)
        .lte('date_key', endDate)
        .order('date_key', { ascending: true })
        .order('clocked_in_at', { ascending: true });
      return NextResponse.json({ clocks: data ?? [] });
    }

    // ── Today's clock status for a token ────────────────────
    if (action === 'clock_status' && token) {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('office_clock_ins')
        .select('*')
        .eq('token', token)
        .eq('date_key', today)
        .order('clocked_in_at', { ascending: false })
        .limit(1);
      const record = data?.[0] ?? null;
      return NextResponse.json({
        clocked_in: !!record && !record.clocked_out_at,
        record,
      });
    }

    // ── Today's clock-ins (all staff) ───────────────────────
    if (action === 'today_clocks') {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('office_clock_ins')
        .select('*')
        .eq('date_key', today)
        .order('clocked_in_at', { ascending: false });
      return NextResponse.json({ clocks: data ?? [] });
    }

    // ── Announcements ───────────────────────────────────────
    if (action === 'announcements') {
      const { data } = await supabase
        .from('office_announcements')
        .select('*')
        .order('pinned', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(20);
      return NextResponse.json({ announcements: data ?? [] });
    }

    // ── My tasks ────────────────────────────────────────────
    if (action === 'my_tasks' && token) {
      const { data } = await supabase
        .from('office_tasks')
        .select('*')
        .eq('assigned_to', token)
        .order('created_at', { ascending: false });
      return NextResponse.json({ tasks: data ?? [] });
    }

    // ── Open work requests ──────────────────────────────────
    if (action === 'requests') {
      const { data } = await supabase
        .from('office_work_requests')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });
      return NextResponse.json({ requests: data ?? [] });
    }

    // ── Reports ─────────────────────────────────────────────
    if (action === 'reports') {
      const { data } = await supabase
        .from('office_reports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      return NextResponse.json({ reports: data ?? [] });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });

  } catch (err) {
    console.error('Office GET error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────
// POST — write actions
// { action: 'clock_in', token, note? }
// { action: 'clock_out', token }
// { action: 'announcement', token, title, body, priority?, pinned? }
// { action: 'task', token, assigned_to, title, description?, priority?, due_date? }
// { action: 'work_request', token, type, subject, body }
// { action: 'report', token, to_desk, title, body }
// { action: 'update_request', token, request_id, status, response? }
// { action: 'update_task', token, task_id, status }
export async function POST(req: NextRequest) {
  try {
    const body   = await req.json();
    const { action, token } = body;
    const userToken = token?.trim().toUpperCase();
    const user = getUser(userToken);

    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // ── Clock in ────────────────────────────────────────────
    if (action === 'clock_in') {
      const today = new Date().toISOString().split('T')[0];
      // Check if already clocked in today without clocking out
      const { data: existing } = await supabase
        .from('office_clock_ins')
        .select('id, clocked_out_at')
        .eq('token', userToken)
        .eq('date_key', today)
        .is('clocked_out_at', null)
        .limit(1);

      if (existing && existing.length > 0) {
        return NextResponse.json({ error: 'Already clocked in today. Clock out first.' }, { status: 400 });
      }

      const { data, error } = await supabase
        .from('office_clock_ins')
        .insert({
          token:      userToken,
          staff_name: user.name,
          role:       user.role,
          note:       body.note ?? null,
          date_key:   today,
        })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, record: data });
    }

    // ── Clock out ───────────────────────────────────────────
    if (action === 'clock_out') {
      const today = new Date().toISOString().split('T')[0];
      const { data: openRecord } = await supabase
        .from('office_clock_ins')
        .select('id')
        .eq('token', userToken)
        .eq('date_key', today)
        .is('clocked_out_at', null)
        .limit(1);

      if (!openRecord || openRecord.length === 0) {
        return NextResponse.json({ error: 'No active clock-in found for today.' }, { status: 400 });
      }

      const { data, error } = await supabase
        .from('office_clock_ins')
        .update({ clocked_out_at: new Date().toISOString() })
        .eq('id', openRecord[0].id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, record: data });
    }

    // ── Post announcement (CEO / OPS only) ──────────────────
    if (action === 'announcement') {
      if (!['CEO', 'Operations'].includes(user.role)) {
        return NextResponse.json({ error: 'Only CEO or Operations can post announcements' }, { status: 403 });
      }
      const { data, error } = await supabase
        .from('office_announcements')
        .insert({
          author_token: userToken,
          author_name:  user.name,
          title:        body.title,
          body:         body.body,
          priority:     body.priority ?? 'normal',
          pinned:       body.pinned ?? false,
        })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, announcement: data });
    }

    // ── Create task ─────────────────────────────────────────
    if (action === 'task') {
      const assignee = getUser(body.assigned_to?.trim().toUpperCase());
      if (!assignee) {
        return NextResponse.json({ error: 'Invalid assignee token' }, { status: 400 });
      }
      const { data, error } = await supabase
        .from('office_tasks')
        .insert({
          created_by:    userToken,
          assigned_to:   body.assigned_to.trim().toUpperCase(),
          assigned_name: assignee.name,
          title:         body.title,
          description:   body.description ?? null,
          priority:      body.priority ?? 'normal',
          due_date:      body.due_date ?? null,
        })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, task: data });
    }

    // ── Work request / complaint ─────────────────────────────
    if (action === 'work_request') {
      const { data, error } = await supabase
        .from('office_work_requests')
        .insert({
          from_token: userToken,
          from_name:  user.name,
          from_role:  user.role,
          type:       body.type ?? 'work_request',
          subject:    body.subject,
          body:       body.body,
        })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, request: data });
    }

    // ── Submit report ────────────────────────────────────────
    if (action === 'report') {
      const { data, error } = await supabase
        .from('office_reports')
        .insert({
          from_token: userToken,
          from_name:  user.name,
          from_role:  user.role,
          to_desk:    body.to_desk ?? 'ceo',
          title:      body.title,
          body:       body.body,
        })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, report: data });
    }

    // ── Update request status (CEO / OPS) ───────────────────
    if (action === 'update_request') {
      if (!['CEO', 'Operations'].includes(user.role)) {
        return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
      }
      const { error } = await supabase
        .from('office_work_requests')
        .update({ status: body.status, response: body.response ?? null, updated_at: new Date().toISOString() })
        .eq('id', body.request_id);

      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    // ── Update task status ───────────────────────────────────
    if (action === 'update_task') {
      const { error } = await supabase
        .from('office_tasks')
        .update({ status: body.status, updated_at: new Date().toISOString() })
        .eq('id', body.task_id);

      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    // ── Post bug report (dev → PM/CEO) ──────────────────────
    if (action === 'bug_report') {
      const { data, error } = await supabase
        .from('office_reports')
        .insert({
          from_token: userToken,
          from_name:  user.name,
          from_role:  user.role,
          to_desk:    'ceo',
          title:      `[BUG] ${body.title}`,
          body:       `Platform: ${body.platform}\nSeverity: ${body.severity}\n\n${body.body}`,
        })
        .select()
        .single();
      if (error) throw error;
      return NextResponse.json({ success: true, report: data });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });

  } catch (err) {
    console.error('Office POST error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
