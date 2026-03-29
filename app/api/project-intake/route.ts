import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName, email, phone, company, industry, package: pkg,
      projectSummary, keyFeatures, timeline, budget, existingSystem, howHeard,
    } = body;

    // ── 1. Save to Supabase ─────────────────────────────────────────
    const { error: dbError } = await supabase
      .from('project_intakes')
      .insert({
        full_name:       fullName,
        email,
        phone,
        company:         company || null,
        industry,
        package:         pkg,
        project_summary: projectSummary,
        key_features:    keyFeatures || null,
        timeline,
        budget,
        existing_system: existingSystem || null,
        how_heard:       howHeard || null,
        status:          'new',
      });

    if (dbError) {
      console.error('Supabase error:', dbError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // ── 2. Notify admin ─────────────────────────────────────────────
    await resend.emails.send({
      from:    'ProStack NG <hello@prostackng.com.ng>',
      to:      ['hello@prostackng.com.ng'],
      subject: `New Project Brief — ${fullName}${company ? ` (${company})` : ''}`,
      html: `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; max-width: 600px; margin: 0 auto; background: #080B14; color: #EEF0FF; padding: 32px; border: 1px solid #181C30;">
          <div style="font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; margin-bottom: 8px;">New Project Brief</div>
          <div style="font-size: 11px; color: #7A7DA0; margin-bottom: 28px; font-family: monospace; letter-spacing: .1em; text-transform: uppercase;">Build With Us — prostackng.com.ng</div>

          <table style="width: 100%; border-collapse: collapse;">
            ${[
              ['Name',     fullName],
              ['Email',    email],
              ['Phone',    phone],
              ['Company',  company || '—'],
              ['Industry', industry],
              ['Package',  pkg],
              ['Timeline', timeline],
              ['Budget',   budget],
              ['Existing System', existingSystem || '—'],
              ['How Heard', howHeard || '—'],
            ].map(([label, value]) => `
              <tr style="border-bottom: 1px solid #181C30;">
                <td style="padding: 10px 0; font-size: 11px; color: #32365A; font-family: monospace; letter-spacing: .1em; text-transform: uppercase; width: 36%; vertical-align: top;">${label}</td>
                <td style="padding: 10px 0; font-size: 13px; color: #EEF0FF; vertical-align: top;">${value}</td>
              </tr>
            `).join('')}
          </table>

          <div style="margin-top: 24px; padding: 16px; background: #0C0F1C; border: 1px solid #181C30;">
            <div style="font-size: 11px; color: #32365A; font-family: monospace; letter-spacing: .1em; text-transform: uppercase; margin-bottom: 10px;">Project Summary</div>
            <p style="font-size: 13px; color: #7A7DA0; line-height: 1.8; margin: 0;">${projectSummary}</p>
          </div>

          ${keyFeatures ? `
          <div style="margin-top: 16px; padding: 16px; background: #0C0F1C; border: 1px solid #181C30;">
            <div style="font-size: 11px; color: #32365A; font-family: monospace; letter-spacing: .1em; text-transform: uppercase; margin-bottom: 10px;">Key Features Requested</div>
            <p style="font-size: 13px; color: #7A7DA0; line-height: 1.8; margin: 0;">${keyFeatures}</p>
          </div>` : ''}

          <div style="margin-top: 24px; font-size: 11px; color: #32365A; font-family: monospace; letter-spacing: .08em;">
            Reply to this email to reach the client directly · Respond within 48 hrs
          </div>
        </div>
      `,
      reply_to: email,
    });

    // ── 3. Confirm to client ────────────────────────────────────────
    await resend.emails.send({
      from:    'ProStack NG <hello@prostackng.com.ng>',
      to:      [email],
      subject: 'Your Project Brief — ProStack NG Technologies',
      html: `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; max-width: 600px; margin: 0 auto; background: #080B14; color: #EEF0FF; padding: 32px; border: 1px solid #181C30;">
          <div style="font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; margin-bottom: 24px;">Project Brief Received 🚀</div>
          <p style="font-size: 14px; color: #7A7DA0; line-height: 1.8; margin: 0 0 16px;">Hi ${fullName},</p>
          <p style="font-size: 14px; color: #7A7DA0; line-height: 1.8; margin: 0 0 16px;">
            Thank you for submitting your project brief. We have received your enquiry for:
          </p>
          <div style="padding: 16px; background: rgba(37,99,235,.08); border: 1px solid rgba(37,99,235,.3); margin-bottom: 24px;">
            <div style="font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px; color: #3B82F6;">${pkg}</div>
          </div>
          <p style="font-size: 14px; color: #7A7DA0; line-height: 1.8; margin: 0 0 16px;">
            Our team will review your brief and reach out within 48 hours to schedule a scoping call.
          </p>
          <p style="font-size: 14px; color: #7A7DA0; line-height: 1.8; margin: 0 0 32px;">
            If your project is urgent, WhatsApp us directly at +234 705 944 9360.
          </p>
          <div style="font-size: 12px; color: #32365A; font-family: monospace; letter-spacing: .08em; border-top: 1px solid #181C30; padding-top: 20px;">
            ProStack NG Technologies · Port Harcourt, Nigeria · hello@prostackng.com.ng
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('Project intake error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
