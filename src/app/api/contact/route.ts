import { NextRequest, NextResponse } from 'next/server'

import { Resend } from 'resend'

import { writeClient } from '@/sanity/lib/writeClient'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { name, email, projectType, message } = await request.json()

    if (!name || !email || !message)
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      )

    // 📚 Saving email to enquiries collection/table. Best practice so that we have a permanent record, can mark leads as followed up and we're never dependent on email deliverability alone
    await writeClient.create({
      _type: 'enquiry',
      name,
      email,
      projectType,
      message,
      status: 'New',
      submittedAt: new Date().toISOString(),
    })

    // Build the email notification to my email + send it
    await resend.emails.send({
      from: 'onboarding@resend.dev', // eventually my verified domain i.e. 'Portfolio Contact <contact@yourdomain.com>'
      to: process.env.CONTACT_EMAIL!, // my inbox email
      replyTo: email, // client's email that goes in `replyTo` header that reaches my inbox
      subject: `${projectType ? projectType : 'General Enquiry'}`,
      // fallback in case client can't render HTML
      text: `
      New Contact Form Submission
      
      Name: ${name}
      Email: ${email}
      Project Type: ${projectType ?? 'Not specified'}
      
      Message:
      ${message}
      `,
      html: `
      <div style="margin:0;padding:0;background:#f6f7fb;font-family:Arial,Helvetica,sans-serif;">
        <div style="max-width:600px;margin:0 auto;padding:12px;">

          <!-- Card -->
          <div style="background:#ffffff;border:1px solid #e8eaf0;border-radius:4px;overflow:hidden;">
            <!-- Body -->
            <div style="padding:20px;color:#111827;line-height:1.5;font-size:14px;">

              <!-- Message -->
              <div style="margin-bottom:16px;">
                <div style="margin-top:6px;white-space:pre-wrap;font-size:14px;color:#111827;">
                  ${message}
                </div>
              </div>

              <hr style="border:none;border-top:1px solid #eef0f4;margin:16px 0;" />

              <!-- Contact Info -->
              <div style="margin-bottom:10px;">
                <div style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.08em;">
                  Sender Details
                </div>

                <div style="margin-top:8px;">
                  <div style="margin-bottom:6px;">
                    <span style="color:#6b7280;">Name:</span>
                    <span style="font-weight:600;">${name}</span>
                  </div>
                  <div>
                    <span style="color:#6b7280;">Email:</span>
                    <a href="mailto:${email}" style="color:#2563eb;text-decoration:none;font-weight:600;">
                      ${email}
                    </a>
                  </div>
                </div>
              </div>

            </div>

            <!-- Footer -->
            <div style="background:#f9fafb;padding:14px 20px;border-top:1px solid #eef0f4;">
              <p style="margin:0;font-size:12px;color:#6b7280;">
                Reply directly to this email to respond to the sender.
              </p>
            </div>

          </div>

          <!-- Spacer note -->
          <div style="text-align:center;font-size:11px;color:#9ca3af;margin-top:10px;">
            Portfolio Contact System
          </div>

        </div>
      </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact form error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
