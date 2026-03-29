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
    const { fullName, email, company, tier, useCase, description } = await req.json();

    if (!fullName || !email || !tier || !useCase) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }

    const { error: dbError } = await supabase.from('api_waitlist').insert({
      full_name:   fullName,
      email,
      company:     company || null,
      tier,
      use_case:    useCase,
      description: description || null,
      status:      'waiting',
    });

    if (dbError) {
      console.error('Supabase error:', dbError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // Notify admin
    await resend.emails.send({
      from:     'ProStack NG <hello@prostackng.com.ng>',
      to:       ['hello@prostackng.com.ng'],
      reply_to: email,
      subject:  `New API Waitlist — ${fullName} (${tier.split('—')[0].trim()})`,
      html: `
        <div style="font-family:monospace;max-width:500px;background:#080B14;color:#EEF0FF;padding:24px;border:1px solid #181C30;">
          <div style="font-size:16px;font-weight:800;margin-bottom:16px;">New API Waitlist Registration</div>
          <table style="width:100%;border-collapse:collapse;">
            ${[
              ['Name',     fullName],
              ['Email',    email],
              ['Company',  company || '—'],
              ['Tier',     tier],
              ['Use Case', useCase],
            ].map(([l, v]) => `
              <tr style="border-bottom:1px solid #181C30;">
                <td style="padding:8px 0;font-size:10px;color:#32365A;text-transform:uppercase;letter-spacing:.1em;width:30%">${l}</td>
                <td style="font-size:13px;padding:8px 0;color:#EEF0FF">${v}</td>
              </tr>
            `).join('')}
          </table>
          ${description ? `<div style="margin-top:16px;padding:12px;background:#0C0F1C;border:1px solid #181C30;font-size:13px;color:#7A7DA0;line-height:1.7">${description}</div>` : ''}
        </div>
      `,
    });

    // Confirm to registrant
    await resend.emails.send({
      from:    'ProStack NG <hello@prostackng.com.ng>',
      to:      [email],
      subject: 'API Waitlist Confirmed — ProStack NG',
      html: `
        <div style="font-family:'Plus Jakarta Sans',sans-serif;max-width:600px;margin:0 auto;background:#080B14;color:#EEF0FF;padding:32px;border:1px solid #181C30;">
          <div style="font-family:'Syne',sans-serif;font-size:22px;font-weight:800;margin-bottom:24px;">You&apos;re on the Waitlist ⚙️</div>
          <p style="font-size:14px;color:#7A7DA0;line-height:1.8;margin:0 0 16px;">Hi ${fullName},</p>
          <p style="font-size:14px;color:#7A7DA0;line-height:1.8;margin:0 0 16px;">
            You&apos;re registered for API access on the <strong style="color:#3B82F6">${tier}</strong> tier.
          </p>
          <p style="font-size:14px;color:#7A7DA0;line-height:1.8;margin:0 0 32px;">
            We will contact you at this email when access opens for your tier. Enterprise and Growth
            applicants are contacted first. Public API opening Q3 2026.
          </p>
          <div style="font-size:12px;color:#32365A;font-family:monospace;letter-spacing:.08em;border-top:1px solid #181C30;padding-top:20px;">
            ProStack NG Technologies · Port Harcourt, Nigeria · hello@prostackng.com.ng
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('API waitlist error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
