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
      fullName, email, phone, company, jobTitle,
      sector, companySize, platform, useCase, timeline, ndaAgreed,
    } = body;

    if (!ndaAgreed) {
      return NextResponse.json({ error: 'NDA agreement required' }, { status: 400 });
    }

    // ── 1. Save to Supabase ─────────────────────────────────────────
    const { error: dbError } = await supabase
      .from('white_label_enquiries')
      .insert({
        full_name:    fullName,
        email,
        phone,
        company,
        job_title:    jobTitle   || null,
        sector,
        company_size: companySize || null,
        platform,
        use_case:     useCase,
        timeline,
        nda_agreed:   ndaAgreed,
        nda_agreed_at: new Date().toISOString(),
        status:       'new',
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
      subject:  `New White-Label Enquiry — ${company} (${platform.split(' ')[0]})`,
      html: `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; max-width: 600px; margin: 0 auto; background: #080B14; color: #EEF0FF; padding: 32px; border: 1px solid #181C30;">
          <div style="font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; margin-bottom: 8px;">New White-Label Enquiry</div>
          <div style="font-size: 11px; color: #7A7DA0; margin-bottom: 28px; font-family: monospace; letter-spacing: .1em; text-transform: uppercase;">NDA Acknowledged</div>

          <table style="width: 100%; border-collapse: collapse;">
            ${[
              ['Name',         fullName],
              ['Email',        email],
              ['Phone',        phone],
              ['Company',      company],
              ['Job Title',    jobTitle || '—'],
              ['Sector',       sector],
              ['Company Size', companySize || '—'],
              ['Platform',     platform],
              ['Timeline',     timeline],
              ['NDA Agreed',   ndaAgreed ? '✓ Yes — logged at ' + new Date().toISOString() : '—'],
            ].map(([label, value]) => `
              <tr style="border-bottom: 1px solid #181C30;">
                <td style="padding: 10px 0; font-size: 11px; color: #32365A; font-family: monospace; letter-spacing: .1em; text-transform: uppercase; width: 36%; vertical-align: top;">${label}</td>
                <td style="padding: 10px 0; font-size: 13px; color: #EEF0FF; vertical-align: top;">${value}</td>
              </tr>
            `).join('')}
          </table>

          <div style="margin-top: 24px; padding: 16px; background: #0C0F1C; border: 1px solid #181C30;">
            <div style="font-size: 11px; color: #32365A; font-family: monospace; letter-spacing: .1em; text-transform: uppercase; margin-bottom: 10px;">Intended Use Case</div>
            <p style="font-size: 13px; color: #7A7DA0; line-height: 1.8; margin: 0;">${useCase}</p>
          </div>

          <div style="margin-top: 24px; padding: 12px 16px; background: rgba(37,99,235,.06); border: 1px solid rgba(37,99,235,.2);">
            <p style="font-size: 12px; color: #3B82F6; margin: 0; font-family: monospace; letter-spacing: .06em;">
              ACTION REQUIRED: Send formal NDA document to ${email} before sharing any technical docs.
            </p>
          </div>
        </div>
      `,
    });

    // ── 3. Confirm to client ────────────────────────────────────────
    await resend.emails.send({
      from:    'ProStack NG <hello@prostackng.com.ng>',
      to:      [email],
      subject: 'White-Label Licence Enquiry — ProStack NG Technologies',
      html: `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; max-width: 600px; margin: 0 auto; background: #080B14; color: #EEF0FF; padding: 32px; border: 1px solid #181C30;">
          <div style="font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; margin-bottom: 24px;">Enquiry Received 🏷</div>
          <p style="font-size: 14px; color: #7A7DA0; line-height: 1.8; margin: 0 0 16px;">Hi ${fullName},</p>
          <p style="font-size: 14px; color: #7A7DA0; line-height: 1.8; margin: 0 0 16px;">
            Thank you for your white-label licensing enquiry for:
          </p>
          <div style="padding: 16px; background: rgba(37,99,235,.08); border: 1px solid rgba(37,99,235,.3); margin-bottom: 24px;">
            <div style="font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px; color: #3B82F6;">${platform}</div>
          </div>
          <p style="font-size: 14px; color: #7A7DA0; line-height: 1.8; margin: 0 0 16px;">
            Your NDA acknowledgement has been logged. We will review your submission and send you a
            formal mutual NDA document within 48 hours. No technical documentation will be shared
            until the NDA is countersigned.
          </p>
          <p style="font-size: 14px; color: #7A7DA0; line-height: 1.8; margin: 0 0 32px;">
            If your timeline is urgent, WhatsApp us at +234 705 944 9360.
          </p>
          <div style="font-size: 12px; color: #32365A; font-family: monospace; letter-spacing: .08em; border-top: 1px solid #181C30; padding-top: 20px;">
            ProStack NG Technologies · Port Harcourt, Nigeria · hello@prostackng.com.ng
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('White label enquiry error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
