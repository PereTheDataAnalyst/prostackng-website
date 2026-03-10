import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, type, message } = body;

    // Basic validation
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // 1. Save to Supabase (never deleted, queryable forever)
    const { error: dbError } = await supabaseAdmin()
      .from('contact_submissions')
      .insert({ name, email, phone: phone || null, inquiry_type: type || null, message, created_at: new Date().toISOString() });

    if (dbError) {
      console.error('Supabase error:', dbError);
      // Don't fail the request — still try to send email
    }

    // 2. Send notification email via Resend
    const contactEmail = process.env.CONTACT_EMAIL || 'contact@prostackng.com';
    await resend.emails.send({
      from:    'ProStack NG Website <noreply@prostackng.com>',
      to:      [contactEmail],
      reply_to: email,
      subject: `New enquiry from ${name} — ${type || 'General'}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0C1220;color:#E2EAF4;padding:40px;border-radius:8px">
          <div style="border-bottom:2px solid #00E87A;padding-bottom:16px;margin-bottom:24px">
            <h2 style="color:#00E87A;margin:0;font-size:20px">New ProStack NG Enquiry</h2>
          </div>
          <table style="width:100%;border-collapse:collapse">
            ${[['Name',name],['Email',email],['Phone',phone||'—'],['Type',type||'General'],].map(([k,v])=>`
            <tr><td style="padding:10px 0;color:#8899AA;font-size:13px;width:100px;vertical-align:top">${k}</td>
                <td style="padding:10px 0;color:#E2EAF4;font-size:14px">${v}</td></tr>`).join('')}
          </table>
          <div style="margin-top:20px;background:#080C12;padding:20px;border-left:3px solid #00E87A">
            <p style="color:#8899AA;font-size:12px;margin:0 0 8px 0">MESSAGE</p>
            <p style="color:#E2EAF4;font-size:14px;line-height:1.7;margin:0">${message.replace(/\n/g,'<br>')}</p>
          </div>
          <p style="margin-top:24px;color:#445566;font-size:12px">Submitted via prostackng.com</p>
        </div>
      `,
    });

    // 3. Send confirmation email to the person
    await resend.emails.send({
      from:    'ProStack NG <contact@prostackng.com>',
      to:      [email],
      subject: `We got your message, ${name.split(' ')[0]}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#050709;color:#E2EAF4;padding:48px">
          <div style="width:36px;height:36px;background:#00E87A;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:14px;color:#000;margin-bottom:28px">PS</div>
          <h1 style="font-size:26px;font-weight:800;margin:0 0 16px 0">We'll be in touch shortly.</h1>
          <p style="color:#8899AA;line-height:1.8;margin:0 0 24px 0">
            Hi ${name.split(' ')[0]}, thanks for reaching out to ProStack NG. We've received your message and one of our team will respond within <strong style="color:#00E87A">2 business hours</strong>.
          </p>
          <p style="color:#8899AA;line-height:1.8;margin:0 0 40px 0">
            In the meantime, you can reach us directly on WhatsApp: <a href="https://wa.me/2347059449360" style="color:#00E87A">+234 705 944 9360</a>
          </p>
          <div style="border-top:1px solid #111D2E;padding-top:24px">
            <p style="color:#445566;font-size:12px;margin:0">ProStack NG Technologies · Port Harcourt, Nigeria · prostackng.com</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json({ error: 'Server error — please try again' }, { status: 500 });
  }
}

