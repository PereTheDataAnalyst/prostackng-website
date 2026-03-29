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
      fullName, email, phone, company, sector,
      staffSize, package: pkg, currentChallenge, urgency,
    } = body;

    // ── 1. Save to Supabase ─────────────────────────────────────────
    const { error: dbError } = await supabase
      .from('consulting_enquiries')
      .insert({
        full_name:         fullName,
        email,
        phone,
        company:           company || null,
        sector,
        staff_size:        staffSize || null,
        package:           pkg,
        current_challenge: currentChallenge,
        urgency,
        status:            'new',
      });

    if (dbError) {
      console.error('Supabase error:', dbError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // ── 2. Notify admin ─────────────────────────────────────────────
    await resend.emails.send({
      from:     'ProStack NG <hello@prostackng.com.ng>',
      to:       ['hello@prostackng.com.ng'],
      reply_to: email,
      subject:  `New Consulting Enquiry — ${fullName}${company ? ` (${company})` : ''}`,
      html: `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; max-width: 600px; margin: 0 auto; background: #080B14; color: #EEF0FF; padding: 32px; border: 1px solid #181C30;">
          <div style="font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; margin-bottom: 8px;">New Consulting Enquiry</div>
          <div style="font-size: 11px; color: #7A7DA0; margin-bottom: 28px; font-family: monospace; letter-spacing: .1em; text-transform: uppercase;">Digital Transformation Consulting</div>

          <table style="width: 100%; border-collapse: collapse;">
            ${[
              ['Name',         fullName],
              ['Email',        email],
              ['Phone',        phone],
              ['Organisation', company || '—'],
              ['Sector',       sector],
              ['Staff Size',   staffSize || '—'],
              ['Package',      pkg],
              ['Urgency',      urgency],
            ].map(([label, value]) => `
              <tr style="border-bottom: 1px solid #181C30;">
                <td style="padding: 10px 0; font-size: 11px; color: #32365A; font-family: monospace; letter-spacing: .1em; text-transform: uppercase; width: 36%; vertical-align: top;">${label}</td>
                <td style="padding: 10px 0; font-size: 13px; color: #EEF0FF; vertical-align: top;">${value}</td>
              </tr>
            `).join('')}
          </table>

          <div style="margin-top: 24px; padding: 16px; background: #0C0F1C; border: 1px solid #181C30;">
            <div style="font-size: 11px; color: #32365A; font-family: monospace; letter-spacing: .1em; text-transform: uppercase; margin-bottom: 10px;">Current Challenge</div>
            <p style="font-size: 13px; color: #7A7DA0; line-height: 1.8; margin: 0;">${currentChallenge}</p>
          </div>

          <div style="margin-top: 24px; font-size: 11px; color: #32365A; font-family: monospace; letter-spacing: .08em;">
            Reply to this email to reach the client directly · Book their discovery call within 48 hrs
          </div>
        </div>
      `,
    });

    // ── 3. Confirm to client ────────────────────────────────────────
    await resend.emails.send({
      from:    'ProStack NG <hello@prostackng.com.ng>',
      to:      [email],
      subject: 'Your Consulting Enquiry — ProStack NG Technologies',
      html: `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; max-width: 600px; margin: 0 auto; background: #080B14; color: #EEF0FF; padding: 32px; border: 1px solid #181C30;">
          <div style="font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; margin-bottom: 24px;">Enquiry Received 📋</div>
          <p style="font-size: 14px; color: #7A7DA0; line-height: 1.8; margin: 0 0 16px;">Hi ${fullName},</p>
          <p style="font-size: 14px; color: #7A7DA0; line-height: 1.8; margin: 0 0 16px;">
            Thank you for reaching out about our Digital Transformation Consulting service. We have received your enquiry for:
          </p>
          <div style="padding: 16px; background: rgba(37,99,235,.08); border: 1px solid rgba(37,99,235,.3); margin-bottom: 24px;">
            <div style="font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px; color: #3B82F6;">${pkg}</div>
          </div>
          <p style="font-size: 14px; color: #7A7DA0; line-height: 1.8; margin: 0 0 16px;">
            Our team will review your submission and reach out within 48 hours to schedule your free 45-minute discovery call.
          </p>
          <p style="font-size: 14px; color: #7A7DA0; line-height: 1.8; margin: 0 0 32px;">
            If your situation is urgent, WhatsApp us directly at +234 705 944 9360 and mention your consulting enquiry.
          </p>
          <div style="font-size: 12px; color: #32365A; font-family: monospace; letter-spacing: .08em; border-top: 1px solid #181C30; padding-top: 20px;">
            ProStack NG Technologies · Port Harcourt, Nigeria · hello@prostackng.com.ng
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('Consulting enquiry error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
