import nodemailer from 'nodemailer';
import { neon } from '@neondatabase/serverless';

const WHATSAPP_GROUP_URL = 'https://chat.whatsapp.com/LMDhxAl2TLR31hNTeKUG7E';

const JSON_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Content-Type': 'application/json',
};

const escapeHtml = (t) =>
  String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Plain-text template -> HTML with clickable links and line breaks.
function textToHtml(text) {
  return escapeHtml(text)
    .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" style="color:#2563eb;font-weight:700;">$1</a>')
    .replace(/\r?\n/g, '<br/>');
}

function wrapShell(label, innerHtml) {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;"><tr><td align="center">
    <table width="100%" style="max-width:580px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
      <tr><td style="background:linear-gradient(135deg,#0284c7,#2563eb);padding:28px;text-align:center;">
        <p style="margin:0 0 6px 0;color:#e0f2fe;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">NeuraMorphix · Recruitment 2026</p>
        <p style="margin:0;color:#ffffff;font-size:20px;font-weight:900;">${label}</p>
      </td></tr>
      <tr><td style="padding:28px;color:#334155;font-size:14px;line-height:1.7;">${innerHtml}</td></tr>
    </table>
  </td></tr></table>
</body></html>`;
}

function buildAdminAlertHtml(d) {
  const row = (k, v) => `<tr><td style="padding:5px 0;color:#64748b;font-size:12px;font-weight:600;width:140px;">${k}</td><td style="padding:5px 0;color:#0f172a;font-size:13px;font-weight:600;">${escapeHtml(v || 'N/A')}</td></tr>`;
  return wrapShell('New Candidate Registration', `
    <p style="margin:0 0 16px 0;"><strong>${escapeHtml(d.applicantName)}</strong> just registered. Review and schedule an interview from the admin portal.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:12px 16px;">
      ${row('Application ID', d.applicationId)}${row('Email', d.email)}${row('Phone', d.phone)}
      ${row('College', d.college)}${row('Department / Year', [d.department, d.year].filter(Boolean).join(' · '))}
      ${row('1st Preference', d.firstPreference)}${row('2nd Preference', d.secondPreference)}
    </table>
    <p style="margin:20px 0 0 0;text-align:center;"><a href="https://neuramorphix.live/admin" style="background:#2563eb;color:#fff;text-decoration:none;font-weight:700;font-size:13px;padding:12px 28px;border-radius:10px;display:inline-block;">Open Admin Portal</a></p>`);
}

async function getAdminRecipients(systemEmail) {
  const emails = new Set([systemEmail]);
  try {
    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql`SELECT email FROM admins`;
    rows.forEach((r) => r.email && emails.add(r.email));
  } catch (err) {
    console.error('[send-email function] could not load admin emails:', err);
  }
  return [...emails];
}

function buildHtml({ applicantName, applicationId, phone, firstPreference, secondPreference, emailType }) {
  const typeLabel = {
    application_received: 'Application Received',
    shortlisted: 'Shortlisted',
    interview: 'Interview Scheduled',
    info_requested: 'Additional Information Requested',
    accepted: 'Application Accepted',
    declined: 'Application Update',
  };
  const label = typeLabel[emailType] || 'Recruitment Update';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>NeuraMorphix Recruitment</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:580px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
          <tr>
            <td style="background:linear-gradient(135deg,#0284c7,#2563eb);padding:36px 28px;text-align:center;">
              <p style="margin:0 0 6px 0;color:#e0f2fe;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">NeuraMorphix · Recruitment 2026</p>
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:900;letter-spacing:-0.5px;">NeuraMorphix Recruitment</h1>
              <p style="margin:10px 0 0 0;color:#bae6fd;font-size:13px;font-weight:600;">${label}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 28px;background:#ffffff;">
              <p style="margin:0 0 16px 0;color:#0f172a;font-size:16px;font-weight:700;">Hello ${applicantName || 'Applicant'},</p>
              <p style="margin:0 0 24px 0;color:#334155;font-size:14px;line-height:1.7;">
                Welcome to <strong style="color:#0284c7;">NeuraMorphix</strong>! We are thrilled to receive your application for the
                <strong style="color:#0f172a;">NeuraMorphix 2026 Team Recruitment</strong>. Your application has been successfully
                registered in our system and is under review by our recruitment team.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 14px 0;color:#0284c7;font-size:11px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;border-bottom:1px solid #e2e8f0;padding-bottom:10px;">Application Details</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:6px 0;color:#64748b;font-size:12px;font-weight:600;width:140px;">Application ID</td>
                        <td style="padding:6px 0;color:#0284c7;font-size:14px;font-weight:800;font-family:monospace;letter-spacing:1px;">${applicationId || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#64748b;font-size:12px;font-weight:600;">Phone Number</td>
                        <td style="padding:6px 0;color:#0f172a;font-size:13px;font-weight:600;">${phone || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#64748b;font-size:12px;font-weight:600;">1st Preference</td>
                        <td style="padding:6px 0;color:#0f172a;font-size:13px;font-weight:600;">${firstPreference || 'N/A'}</td>
                      </tr>
                      ${secondPreference && secondPreference !== 'None (Optional)' ? `
                      <tr>
                        <td style="padding:6px 0;color:#64748b;font-size:12px;font-weight:600;">2nd Preference</td>
                        <td style="padding:6px 0;color:#0f172a;font-size:13px;font-weight:600;">${secondPreference}</td>
                      </tr>` : ''}
                      <tr>
                        <td style="padding:6px 0;color:#64748b;font-size:12px;font-weight:600;">Status</td>
                        <td style="padding:6px 0;"><span style="background:#dcfce7;color:#166534;font-size:11px;font-weight:700;padding:4px 12px;border-radius:20px;text-transform:uppercase;border:1px solid #bbf7d0;">${label}</span></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 12px 0;color:#475569;font-size:13px;line-height:1.7;">
                Please <strong style="color:#0f172a;">save your Application ID</strong> — you will need it to track your recruitment status on our portal at any time.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px 0;">
                <tr>
                  <td align="center">
                    <a href="${WHATSAPP_GROUP_URL}" target="_blank" style="display:inline-block;background:#25D366;color:#ffffff;font-size:13px;font-weight:700;text-decoration:none;padding:12px 28px;border-radius:10px;">
                      💬 Join Our WhatsApp Group for Further Information
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 24px 0;color:#475569;font-size:13px;line-height:1.7;">
                Our recruitment team will review all applications and update your status accordingly. You will receive further updates at this email address.
              </p>
              <p style="margin:0;color:#64748b;font-size:12px;border-top:1px solid #e2e8f0;padding-top:20px;line-height:1.7;">
                Thank you for applying and for your interest in joining NeuraMorphix.<br/>
                We look forward to reviewing your application!<br/><br/>
                <strong style="color:#0284c7;font-size:13px;">Thank you,<br/>The NeuraMorphix Team</strong><br/>
                <span style="color:#94a3b8;">NeuraMorphix Recruitment System · neuramorphix@gmail.com</span>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#f8fafc;padding:18px 24px;text-align:center;border-top:1px solid #e2e8f0;">
              <p style="margin:0;color:#64748b;font-size:11px;">© 2026 NeuraMorphix · All rights reserved</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

let gmailTransporter = null;
function getGmailTransporter() {
  if (!gmailTransporter) {
    gmailTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      tls: { rejectUnauthorized: false },
    });
  }
  return gmailTransporter;
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: JSON_HEADERS, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: JSON_HEADERS, body: JSON.stringify({ success: false, error: 'Method Not Allowed' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { to, subject, applicantName, applicationId, phone, firstPreference, secondPreference, emailType } = body;

    const systemEmail = process.env.SMTP_USER;
    const systemPass = process.env.SMTP_PASS;

    if (!systemEmail || !systemPass) {
      console.error('[send-email function] SMTP_USER/SMTP_PASS not configured');
      return { statusCode: 500, headers: JSON_HEADERS, body: JSON.stringify({ success: false, error: 'Email is not configured on the server' }) };
    }

    let recipientEmail = to || systemEmail;
    let emailSubject = subject || `NeuraMorphix Recruitment — Application Received (${applicationId || 'N/A'})`;
    let htmlContent;

    if (emailType === 'admin_new_application') {
      recipientEmail = (await getAdminRecipients(systemEmail)).join(',');
      emailSubject = `New registration: ${applicantName || 'Candidate'} (${applicationId || 'N/A'})`;
      htmlContent = buildAdminAlertHtml(body);
    } else if (emailType && emailType !== 'application_received' && body.bodyHtml) {
      // Status emails (interview, accepted, ...) use the admin-edited template text.
      const labels = { shortlisted: 'Shortlisted', interview: 'Interview Scheduled', info_requested: 'Additional Information Requested', accepted: 'Application Accepted', declined: 'Application Update' };
      htmlContent = wrapShell(labels[emailType] || 'Recruitment Update', textToHtml(body.bodyHtml));
    } else {
      htmlContent = buildHtml({ applicantName, applicationId, phone, firstPreference, secondPreference, emailType });
    }

    const info = await getGmailTransporter().sendMail({
      from: `"NeuraMorphix Recruitment" <${systemEmail}>`,
      to: recipientEmail,
      subject: emailSubject,
      html: htmlContent,
    });

    return {
      statusCode: 200,
      headers: JSON_HEADERS,
      body: JSON.stringify({ success: true, messageId: info.messageId, via: 'Gmail' }),
    };
  } catch (err) {
    console.error('[send-email function] error:', err);
    return { statusCode: 500, headers: JSON_HEADERS, body: JSON.stringify({ success: false, error: err.message || 'Internal error' }) };
  }
};
