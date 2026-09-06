import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
// @ts-ignore
import nodemailer from 'nodemailer';
// @ts-ignore
import { readFileSync } from 'fs';
// @ts-ignore
import { resolve } from 'path';

// Load .env manually for Vite plugins (they run in Node context)
function loadDotEnv(): Record<string, string> {
  try {
    const envPath = resolve(process.cwd(), '.env');
    const content = readFileSync(envPath, 'utf-8');
    const vars: Record<string, string> = {};
    content.split('\n').forEach((line: string) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        const value = trimmed.slice(eqIdx + 1).trim();
        vars[key] = value;
      }
    });
    return vars;
  } catch {
    return {};
  }
}

function buildHtml({ applicantName, applicationId, phone, firstPreference, secondPreference, emailType }: any) {
  const typeLabel: Record<string, string> = {
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

function nodemailerPlugin() {
  const env = loadDotEnv();
  const systemEmail = env.SMTP_USER || process.env.SMTP_USER || 'neuramorphix@gmail.com';
  const systemPass = env.SMTP_PASS || process.env.SMTP_PASS || 'rzlcebjxhpgbumqb';

  const isRealPassword = systemPass.length > 0 && !systemPass.includes('your_gmail_app_password');

  // Primary Gmail transporter
  const gmailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: systemEmail, pass: systemPass },
    tls: { rejectUnauthorized: false },
  });

  let testTransporter: nodemailer.Transporter | null = null;
  async function getEtherealTransporter() {
    if (!testTransporter) {
      console.log('\n[NeuraMorphix Mailer] Creating Ethereal test account...');
      const testAccount = await nodemailer.createTestAccount();
      testTransporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass },
      });
      console.log('[NeuraMorphix Mailer] Ethereal test account ready:', testAccount.user);
    }
    return testTransporter;
  }

  if (!isRealPassword) {
    console.log('\n⚠️  [NeuraMorphix Mailer] No Gmail App Password found in .env (SMTP_PASS).');
    console.log('   Emails will use Ethereal test preview (not delivered to real inbox).');
    console.log('   To send real emails: set SMTP_PASS=<16-char Gmail App Password> in .env\n');
  } else {
    console.log(`\n✅ [NeuraMorphix Mailer] Gmail configured for ${systemEmail}`);
    console.log('   Real emails will be sent immediately via Gmail SMTP.\n');
  }

  return {
    name: 'vite-plugin-nodemailer',
    configureServer(server: any) {
      server.middlewares.use('/api/send-email', async (req: any, res: any) => {
        // CORS Headers for mobile devices connecting over WiFi / Network IP
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

        if (req.method === 'OPTIONS') {
          res.statusCode = 200;
          res.end();
          return;
        }

        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end('Method Not Allowed');
          return;
        }

        let bodyStr = '';
        req.on('data', (chunk: any) => { bodyStr += chunk.toString(); });
        req.on('end', async () => {
          try {
            const body = JSON.parse(bodyStr || '{}');
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

            let info: any;
            let sentVia = 'Gmail';

            if (isRealPassword) {
              try {
                info = await gmailTransporter.sendMail(mailOptions);
                console.log(`\n✅ [NeuraMorphix Mailer] Email sent to ${recipientEmail} via Gmail`);
                console.log(`   Message ID: ${info.messageId}`);
              } catch (gmailErr: any) {
                console.log(`\n⚠️  [NeuraMorphix Mailer] Gmail failed: ${gmailErr.message}`);
                console.log('   Falling back to Ethereal preview...');
                const ethereal = await getEtherealTransporter();
                info = await ethereal.sendMail(mailOptions);
                sentVia = 'Ethereal (preview)';
                const previewUrl = nodemailer.getTestMessageUrl(info);
                console.log(`\n📧 [NeuraMorphix Mailer] Email preview: ${previewUrl}\n`);
              }
            } else {
              // No real password — use Ethereal for preview
              const ethereal = await getEtherealTransporter();
              info = await ethereal.sendMail(mailOptions);
              sentVia = 'Ethereal (preview)';
              const previewUrl = nodemailer.getTestMessageUrl(info);
              console.log(`\n📧 [NeuraMorphix Mailer] Email preview (open in browser): ${previewUrl}\n`);
            }

            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, messageId: info.messageId, via: sentVia }));
          } catch (err: any) {
            console.error('\n❌ [NeuraMorphix Mailer] Error:', err.message);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), nodemailerPlugin()],
  server: {
    host: true, // Listen on all network addresses (0.0.0.0) for mobile access
    cors: true,
  },
  preview: {
    host: true,
    cors: true,
  },
});
