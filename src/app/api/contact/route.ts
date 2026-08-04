import { NextRequest, NextResponse } from 'next/server'

import { Resend } from 'resend'

import { writeClient } from '@/sanity/lib/writeClient'
import { BUDGETS, PROJECT_TYPES, REFERRALS, TIMELINES } from '@/lib/contact-options'

const genProjectTypeLabels = Object.fromEntries(
  PROJECT_TYPES.map(({ value, label }) => [value, label]),
)

const genBudgetLabels = Object.fromEntries(
  BUDGETS.map(({ value, label }) => [value, label]),
)

const genTimelineLabels = Object.fromEntries(
  TIMELINES.map(({ value, label }) => [value, label]),
)

const genReferralLabels = Object.fromEntries(
  REFERRALS.map(({ value, label }) => [value, label]),
)

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      email,
      phone,
      organisation,
      website,
      projectType,
      timeline,
      budget,
      referral,
      message,
      consent,
      company,
    } = await request.json()

    if (!name || !email || !projectType || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Honeypot — silently accept bot submissions
    if (company) return NextResponse.json({ success: true })

    // 📚 Saving enquiry to Sanity gives us a permanent record,
    // allows lead tracking, and avoids relying solely on email delivery.
    await writeClient.create({
      _type: 'enquiry',
      name,
      email,
      phone,
      organisation,
      website,
      projectType,
      timeline,
      budget,
      referral,
      message,
      consent,
      status: 'New',
      submittedAt: new Date().toISOString(),
    })

    const projectTypeLabel = projectType
      ? (genProjectTypeLabels[projectType] ?? projectType)
      : 'N/A'

    const budgetLabel = budget ? (genBudgetLabels[budget] ?? budget) : 'N/A'

    const timelineLabel = timeline ? (genTimelineLabels[timeline] ?? timeline) : 'N/A'

    const referralLabel = referral ? (genReferralLabels[referral] ?? referral) : 'N/A'

    // Build the email notification to my email + send it
    await resend.emails.send({
      from: 'onboarding@resend.dev', // eventually: 'Portfolio Contact <contact@yourdomain.com>'
      to: process.env.CONTACT_EMAIL!,
      replyTo: email,

      subject: `${projectType ? projectTypeLabel : 'General enquiry'} — ${name}`,

      // fallback in case client can't render HTML
      text: `
New Contact Form Submission

Sender:
Name: ${name}
Email: ${email}
${organisation ? `Company: ${organisation}` : ''}
${phone ? `Phone: ${phone}` : ''}
${website ? `Current Website: ${website}` : ''}

Project Details:
Project Type: ${projectTypeLabel}
Timeline: ${timelineLabel}
Budget: ${budgetLabel}
How they found you: ${referralLabel}

Message:
${message}

Consent:
${consent === 'yes' ? 'Yes' : 'Not provided'}
  `.trim(),

      html: `
<div style="margin:0;padding:0;background:#f6f7fb;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:12px;">

    <div style="background:#ffffff;border:1px solid #e8eaf0;border-radius:4px;overflow:hidden;">

      <div style="padding:20px;color:#111827;line-height:1.5;font-size:14px;">

        <!-- Message -->
        <div style="margin-bottom:20px;">
          <div style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.08em;">
            Message
          </div>

          <div style="margin-top:8px;white-space:pre-wrap;font-size:14px;color:#111827;">
            ${message}
          </div>
        </div>

        <hr style="border:none;border-top:1px solid #eef0f4;margin:20px 0;" />

        <!-- Sender -->
        <div style="margin-bottom:18px;">
          <div style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.08em;">
            Sender Details
          </div>

          <div style="margin-top:10px;">
            <div style="margin-bottom:6px;">
              <span style="color:#6b7280;">Name:</span>
              <strong>${name}</strong>
            </div>

            <div style="margin-bottom:6px;">
              <span style="color:#6b7280;">Email:</span>
              <a href="mailto:${email}" style="color:#2563eb;text-decoration:none;font-weight:600;">
                ${email}
              </a>
            </div>

            ${
              phone
                ? `
            <div style="margin-bottom:6px;">
              <span style="color:#6b7280;">Phone:</span>
              ${phone}
            </div>`
                : ''
            }

            ${
              organisation
                ? `
            <div style="margin-bottom:6px;">
              <span style="color:#6b7280;">Company:</span>
              ${organisation}
            </div>`
                : ''
            }

            ${
              website
                ? `
            <div>
              <span style="color:#6b7280;">Website:</span>
              <a href="${website}" style="color:#2563eb;text-decoration:none;">
                ${website}
              </a>
            </div>`
                : ''
            }
          </div>
        </div>

        <hr style="border:none;border-top:1px solid #eef0f4;margin:20px 0;" />

        <!-- Project -->
        <div>
          <div style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.08em;">
            Project Details
          </div>

          <div style="margin-top:10px;">

            <div style="margin-bottom:6px;">
              <span style="color:#6b7280;">Type:</span>
              ${projectTypeLabel ?? 'N/A'}
            </div>

            <div style="margin-bottom:6px;">
              <span style="color:#6b7280;">Timeline:</span>
              ${timelineLabel ?? 'N/A'}
            </div>

            <div style="margin-bottom:6px;">
              <span style="color:#6b7280;">Budget:</span>
              ${budgetLabel ?? 'N/A'}
            </div>

            <div>
              <span style="color:#6b7280;">Referral:</span>
              ${referralLabel ?? 'N/A'}
            </div>

          </div>
        </div>

      </div>

      <!-- Footer -->
      <div style="background:#f9fafb;padding:14px 20px;border-top:1px solid #eef0f4;">
        <p style="margin:0;font-size:12px;color:#6b7280;">
          Reply directly to this email to respond to ${name}.
        </p>
      </div>

    </div>

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
