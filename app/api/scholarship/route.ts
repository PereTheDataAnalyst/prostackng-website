import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // use service role for server-side inserts
);

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      fullName, email, phone, stateOfResidence, idType, idNumber,
      currentStatus, institution, preferredCourse,
      statementOfPurpose, financialNeed, referralSource,
    } = body;

    // ── 1. Save to Supabase ─────────────────────────────────────────
    const { error: dbError } = await supabase
      .from('scholarship_applications')
      .insert({
        full_name:            fullName,
        email,
        phone,
        state_of_residence:  stateOfResidence,
        id_type:             idType,
        id_number:           idNumber,
        current_status:      currentStatus,
        institution:         institution || null,
        preferred_course:    preferredCourse,
        statement_of_purpose: statementOfPurpose,
        financial_need:      financialNeed,
        referral_source:     referralSource || null,
        status:              'pending',
      });

    if (dbError) {
      console.error('Supabase error:', dbError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // ── 2. Send notification email to admin ─────────────────────────
    await resend.emails.send({
      from:    'ProStack NG Academy <academy@prostackng.com.ng>',
      to:      ['academy@prostackng.com.ng'],
      subject: `New Scholarship Application — ${fullName}`,
      html: `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; max-width: 600px; margin: 0 auto; background: #080B14; color: #EEF0FF; padding: 32px; border: 1px solid #181C30;">
          <div style="font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; margin-bottom: 8px; color: #EEF0FF;">
            New Scholarship Application
          </div>
          <div style="font-size: 12px; color: #7A7DA0; margin-bottom: 28px; font-family: monospace; letter-spacing: .1em; text-transform: uppercase;">
            ProStack NG Academy
          </div>

          <table style="width: 100%; border-collapse: collapse;">
            ${[
              ['Full Name',         fullName],
              ['Email',             email],
              ['Phone',             phone],
              ['State',             stateOfResidence],
              ['ID Type',           idType],
              ['ID Number',         idNumber],
              ['Current Status',    currentStatus],
              ['Institution',       institution || '—'],
              ['Preferred Course',  preferredCourse],
              ['Referral Source',   referralSource || '—'],
            ].map(([label, value]) => `
              <tr style="border-bottom: 1px solid #181C30;">
                <td style="padding: 10px 0; font-size: 11px; color: #32365A; font-family: monospace; letter-spacing: .1em; text-transform: uppercase; width: 40%; vertical-align: top;">${label}</td>
                <td style="padding: 10px 0; font-size: 13px; color: #EEF0FF; vertical-align: top;">${value}</td>
              </tr>
            `).join('')}
          </table>

          <div style="margin-top: 24px; padding: 16px; background: #0C0F1C; border: 1px solid #181C30;">
            <div style="font-size: 11px; color: #32365A; font-family: monospace; letter-spacing: .1em; text-transform: uppercase; margin-bottom: 10px;">Statement of Purpose</div>
            <p style="font-size: 13px; color: #7A7DA0; line-height: 1.8; margin: 0;">${statementOfPurpose}</p>
          </div>

          <div style="margin-top: 16px; padding: 16px; background: #0C0F1C; border: 1px solid #181C30;">
            <div style="font-size: 11px; color: #32365A; font-family: monospace; letter-spacing: .1em; text-transform: uppercase; margin-bottom: 10px;">Financial Need Statement</div>
            <p style="font-size: 13px; color: #7A7DA0; line-height: 1.8; margin: 0;">${financialNeed}</p>
          </div>

          <div style="margin-top: 24px; font-size: 11px; color: #32365A; font-family: monospace; letter-spacing: .08em;">
            Review all applications at prostackng.com.ng/chat-admin
          </div>
        </div>
      `,
    });

    // ── 3. Send confirmation to applicant ────────────────────────────
    await resend.emails.send({
      from:    'ProStack NG Academy <academy@prostackng.com.ng>',
      to:      [email],
      subject: 'Your ProStack NG Academy Scholarship Application',
      html: `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; max-width: 600px; margin: 0 auto; background: #080B14; color: #EEF0FF; padding: 32px; border: 1px solid #181C30;">
          <div style="font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; margin-bottom: 24px; color: #EEF0FF;">
            Application Received 🎓
          </div>
          <p style="font-size: 14px; color: #7A7DA0; line-height: 1.8; margin: 0 0 16px;">
            Hi ${fullName},
          </p>
          <p style="font-size: 14px; color: #7A7DA0; line-height: 1.8; margin: 0 0 16px;">
            Thank you for applying for a ProStack NG Academy scholarship. We have received your application for:
          </p>
          <div style="padding: 16px; background: rgba(37,99,235,.08); border: 1px solid rgba(37,99,235,.3); margin-bottom: 24px;">
            <div style="font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px; color: #3B82F6;">${preferredCourse}</div>
          </div>
          <p style="font-size: 14px; color: #7A7DA0; line-height: 1.8; margin: 0 0 16px;">
            We review scholarship applications 4 weeks before each cohort begins. You will hear from us at this email address with our decision.
          </p>
          <p style="font-size: 14px; color: #7A7DA0; line-height: 1.8; margin: 0 0 32px;">
            If you have any questions in the meantime, reply to this email or reach us on WhatsApp at +234 705 944 9360.
          </p>
          <div style="font-size: 12px; color: #32365A; font-family: monospace; letter-spacing: .08em; border-top: 1px solid #181C30; padding-top: 20px;">
            ProStack NG Academy · Port Harcourt, Nigeria · academy@prostackng.com.ng
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('Scholarship API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
