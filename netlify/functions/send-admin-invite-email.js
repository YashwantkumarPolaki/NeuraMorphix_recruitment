import nodemailer from 'nodemailer';

const JSON_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Content-Type': 'application/json',
};

function buildHtml({ name, role, email, tempPassword, passcode, invitedBy, loginUrl }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>NeuraMorphix Admin Access</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:580px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
          <tr>
            <td style="background:linear-gradient(135deg,#0284c7,#2563eb);padding:36px 28px;text-align:center;">
              <p style="margin:0 0 6px 0;color:#e0f2fe;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">NeuraMorphix · Recruitment Portal</p>
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:900;letter-spacing:-0.5px;">You've Been Added as an Admin</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 28px;background:#ffffff;">
              <p style="margin:0 0 16px 0;color:#0f172a;font-size:16px;font-weight:700;">Hello ${name},</p>
              <p style="margin:0 0 24px 0;color:#334155;font-size:14px;line-height:1.7;">
                ${invitedBy ? `<strong style="color:#0284c7;">${invitedBy}</strong> has` : 'You have been'} given you access to the
                <strong style="color:#0f172a;">NeuraMorphix Recruitment Admin Portal</strong> as a
                <strong style="color:#0f172a;">${role}</strong>. You can now review applicants, manage recruitment status, and more.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 14px 0;color:#0284c7;font-size:11px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;border-bottom:1px solid #e2e8f0;padding-bottom:10px;">Your Login Details</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:6px 0;color:#64748b;font-size:12px;font-weight:600;width:140px;">Admin Email</td>
                        <td style="padding:6px 0;color:#0f172a;font-size:13px;font-weight:600;">${email}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#64748b;font-size:12px;font-weight:600;">Temporary Password</td>
                        <td style="padding:6px 0;color:#0284c7;font-size:14px;font-weight:800;font-family:monospace;letter-spacing:1px;">${tempPassword}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#64748b;font-size:12px;font-weight:600;">Quick-Login Passcode</td>
                        <td style="padding:6px 0;color:#0284c7;font-size:14px;font-weight:800;font-family:monospace;letter-spacing:1px;">${passcode}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 12px 0;color:#475569;font-size:13px;line-height:1.7;">
                You can sign in two ways: with your <strong style="color:#0f172a;">email + temporary password</strong> above, or with the
                <strong style="color:#0f172a;">quick-login passcode</strong> on its own — no email needed.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px 0;">
                <tr>
                  <td align="center">
                    <a href="${loginUrl}" target="_blank" style="display:inline-block;background:#2563eb;color:#ffffff;font-size:13px;font-weight:700;text-decoration:none;padding:12px 28px;border-radius:10px;">
                      Go to Admin Login →
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0;color:#64748b;font-size:12px;border-top:1px solid #e2e8f0;padding-top:20px;line-height:1.7;">
                Keep this email private — it contains your login credentials.<br/><br/>
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
    const { name, email, role, tempPassword, passcode, invitedBy } = JSON.parse(event.body || '{}');

    const systemEmail = process.env.SMTP_USER;
    const systemPass = process.env.SMTP_PASS;
    if (!systemEmail || !systemPass) {
      console.error('[send-admin-invite-email] SMTP_USER/SMTP_PASS not configured');
      return { statusCode: 500, headers: JSON_HEADERS, body: JSON.stringify({ success: false, error: 'Email is not configured on the server' }) };
    }
    if (!email || !name || !tempPassword || !passcode) {
      return { statusCode: 400, headers: JSON_HEADERS, body: JSON.stringify({ success: false, error: 'Missing required fields' }) };
    }

    const loginUrl = `https://${event.headers?.host || 'neuramorphix.netlify.app'}/admin`;
    const htmlContent = buildHtml({ name, role, email, tempPassword, passcode, invitedBy, loginUrl });

    const info = await getGmailTransporter().sendMail({
      from: `"NeuraMorphix Recruitment" <${systemEmail}>`,
      to: email,
      subject: 'You’ve Been Added as a NeuraMorphix Admin',
      html: htmlContent,
    });

    return { statusCode: 200, headers: JSON_HEADERS, body: JSON.stringify({ success: true, messageId: info.messageId }) };
  } catch (err) {
    console.error('[send-admin-invite-email] error:', err);
    return { statusCode: 500, headers: JSON_HEADERS, body: JSON.stringify({ success: false, error: err.message || 'Internal error' }) };
  }
};
