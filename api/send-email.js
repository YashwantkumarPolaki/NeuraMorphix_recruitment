import nodemailer from 'nodemailer';

function buildHtml({ applicantName, applicationId, phone, firstPreference, secondPreference, emailType }) {
  const typeLabel = {
    application_received: 'Application Received',
    shortlisted: 'Shortlisted',
    interview: 'Interview Scheduled',
    info_requested: 'Additional Information Requested',
    accepted: 'Application Accepted',
    declined: 'Application Update',
  }[emailType] || 'Recruitment Update';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>NeuraMorphix Recruitment</title>
</head>
<body style="margin:0;padding:0;background:#0f172a;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:560px;background:#1e293b;border-radius:16px;overflow:hidden;border:1px solid #334155;">
          <tr>
            <td style="background:linear-gradient(135deg,#0e7490,#1d4ed8);padding:32px 24px;text-align:center;">
              <p style="margin:0 0 6px 0;color:#bae6fd;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">NeuraMorphix · Recruitment 2026</p>
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:900;letter-spacing:-0.5px;">NeuraMorphix Recruitment</h1>
              <p style="margin:10px 0 0 0;color:#bae6fd;font-size:13px;">${typeLabel}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 24px;">
              <p style="margin:0 0 16px 0;color:#e2e8f0;font-size:16px;font-weight:600;">Hello ${applicantName || 'Applicant'},</p>
              <p style="margin:0 0 20px 0;color:#94a3b8;font-size:14px;line-height:1.7;">
                Welcome to <strong style="color:#38bdf8;">NeuraMorphix</strong>! We are thrilled to receive your application for the
                <strong style="color:#f8fafc;">NeuraMorphix 2026 Team Recruitment</strong>. Your application has been successfully
                registered in our system and is now under review by our recruitment team.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;border-radius:12px;border:1px solid #334155;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 14px 0;color:#38bdf8;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;border-bottom:1px solid #1e293b;padding-bottom:10px;">Application Details</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:5px 0;color:#64748b;font-size:12px;font-weight:600;width:140px;">Application ID</td>
                        <td style="padding:5px 0;color:#38bdf8;font-size:14px;font-weight:900;font-family:monospace;letter-spacing:1px;">${applicationId || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td style="padding:5px 0;color:#64748b;font-size:12px;font-weight:600;">Phone Number</td>
                        <td style="padding:5px 0;color:#e2e8f0;font-size:13px;font-weight:600;">${phone || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td style="padding:5px 0;color:#64748b;font-size:12px;font-weight:600;">1st Preference</td>
                        <td style="padding:5px 0;color:#e2e8f0;font-size:13px;font-weight:600;">${firstPreference || 'N/A'}</td>
                      </tr>
                      ${secondPreference && secondPreference !== 'None (Optional)' ? `
                      <tr>
                        <td style="padding:5px 0;color:#64748b;font-size:12px;font-weight:600;">2nd Preference</td>
                        <td style="padding:5px 0;color:#e2e8f0;font-size:13px;font-weight:600;">${secondPreference}</td>
                      </tr>` : ''}
                      <tr>
                        <td style="padding:5px 0;color:#64748b;font-size:12px;font-weight:600;">Status</td>
                        <td style="padding:5px 0;"><span style="background:#064e3b;color:#6ee7b7;font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;text-transform:uppercase;">${typeLabel}</span></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 10px 0;color:#94a3b8;font-size:13px;line-height:1.7;">
                Please <strong style="color:#f8fafc;">save your Application ID</strong> — you will need it to track your recruitment status on our portal at any time.
              </p>
              <p style="margin:0 0 24px 0;color:#94a3b8;font-size:13px;line-height:1.7;">
                Our recruitment team will review all applications and update your status accordingly. You will receive further updates at this email address.
              </p>
              <p style="margin:0;color:#64748b;font-size:12px;border-top:1px solid #334155;padding-top:20px;line-height:1.7;">
                Thank you for applying and for your interest in joining NeuraMorphix.<br/>
                We look forward to reviewing your application!<br/><br/>
                <strong style="color:#38bdf8;">Thank you,<br/>The NeuraMorphix Team</strong><br/>
                <span style="color:#475569;">NeuraMorphix Recruitment System · moniswarmoni509@gmail.com</span>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#0f172a;padding:16px 24px;text-align:center;border-top:1px solid #1e293b;">
              <p style="margin:0;color:#334155;font-size:11px;">© 2026 NeuraMorphix · All rights reserved</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const systemEmail = process.env.SMTP_USER || 'moniswarmoni509@gmail.com';
  const systemPass = process.env.SMTP_PASS || 'rzlcebjxhpgbumqb';

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: systemEmail,
      pass: systemPass,
    },
    tls: { rejectUnauthorized: false },
  });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { to, subject, applicantName, applicationId, phone, firstPreference, secondPreference, emailType } = body;

    const recipientEmail = to || systemEmail;
    const emailSubject = subject || `NeuraMorphix Recruitment — Application Received (${applicationId || 'N/A'})`;
    const htmlContent = buildHtml({ applicantName, applicationId, phone, firstPreference, secondPreference, emailType });

    const mailOptions = {
      from: `"NeuraMorphix Recruitment" <${systemEmail}>`,
      to: recipientEmail,
      subject: emailSubject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Vercel Serverless Nodemailer] Sent to ${recipientEmail}:`, info.messageId);

    return res.status(200).json({ success: true, messageId: info.messageId, via: 'Gmail' });
  } catch (error) {
    console.error('[Vercel Serverless Nodemailer Error]:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
