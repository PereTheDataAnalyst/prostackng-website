import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, service, message } = body;
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    await resend.emails.send({
      from: 'ProStack NG <onboarding@resend.dev>',
      to: [process.env.CONTACT_EMAIL ?? 'contact@prostackng.com'],
      subject: `New enquiry from ${name}${company ? ` (${company})` : ''}`,
      reply_to: email,
      html: `
        <div style="font-family:sans-serif;max-width:600px">
          <h2 style="color:#2563EB">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
          ${service ? `<p><strong>Service:</strong> ${service}</p>` : ''}
          <hr/>
          <p><strong>Message:</strong></p>
          <p style="white-space:pre-wrap">${message}</p>
        </div>
      `,
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact error:', err);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
