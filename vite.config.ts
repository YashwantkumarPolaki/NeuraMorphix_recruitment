import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
// @ts-ignore
import nodemailer from 'nodemailer';

// Custom Vite plugin to handle Nodemailer API in dev server
function nodemailerPlugin() {
  const systemEmail = process.env.SMTP_USER || 'moniswarmoni509@gmail.com';
  const systemPass = process.env.SMTP_PASS || 'moni1234';

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: systemEmail,
      pass: systemPass,
    },
  });

  let testTransporter: nodemailer.Transporter | null = null;
  async function getTestTransporter() {
    if (!testTransporter) {
      const testAccount = await nodemailer.createTestAccount();
      testTransporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }
    return testTransporter;
  }

  return {
    name: 'vite-plugin-nodemailer',
    configureServer(server: any) {
      server.middlewares.use('/api/send-email', async (req: any, res: any) => {
        if (req.method === 'POST') {
          let bodyStr = '';
          req.on('data', (chunk: any) => {
            bodyStr += chunk.toString();
          });

          req.on('end', async () => {
            try {
              const body = JSON.parse(bodyStr || '{}');
              const { to, subject, text, applicantName, applicationId, firstPreference, secondPreference } = body;

              const recipientEmail = to || systemEmail;
              const emailSubject = subject || `NeuraMorphix Recruitment — Application Received (${applicationId || 'N/A'})`;

              const htmlContent = `
                <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 24px; border-radius: 16px;">
                  <h2 style="color: #38bdf8; margin-bottom: 12px;">NeuraMorphix Recruitment 2026</h2>
                  <p>Hello <strong>${applicantName || 'Applicant'}</strong>,</p>
                  <p>Your application for the NeuraMorphix recruitment cycle has been successfully received.</p>
                  
                  <div style="background-color: #1e293b; padding: 16px; border-radius: 12px; margin: 16px 0; border: 1px solid #334155;">
                    <p style="margin: 4px 0;"><strong>Application ID:</strong> <span style="font-family: monospace; color: #38bdf8;">${applicationId || 'N/A'}</span></p>
                    <p style="margin: 4px 0;"><strong>Registered Email:</strong> ${recipientEmail}</p>
                    <p style="margin: 4px 0;"><strong>1st Choice (Compulsory):</strong> ${firstPreference || 'N/A'}</p>
                    <p style="margin: 4px 0;"><strong>2nd Choice (Optional):</strong> ${secondPreference || 'None'}</p>
                    <p style="margin: 4px 0;"><strong>Status:</strong> Application Received</p>
                  </div>

                  <p>You can track your live recruitment status anytime on our portal using your Application ID.</p>
                  <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">Sent via NeuraMorphix Nodemailer Engine (&lt;moniswarmoni509@gmail.com&gt;)</p>
                </div>
              `;

              const mailOptions = {
                from: `"NeuraMorphix System" <${systemEmail}>`,
                to: recipientEmail,
                subject: emailSubject,
                text: text || `Hello ${applicantName}, Application ID: ${applicationId}`,
                html: htmlContent,
              };

              let info;
              try {
                info = await transporter.sendMail(mailOptions);
                console.log(`[Nodemailer Dev Plugin] Email sent to ${recipientEmail}:`, info.messageId);
              } catch (primaryErr: any) {
                console.log('[Nodemailer Dev Plugin] Primary Gmail fallback:', primaryErr.message);
                const fallbackTransporter = await getTestTransporter();
                info = await fallbackTransporter.sendMail(mailOptions);
                console.log(`[Nodemailer Test Account] Email sent to ${recipientEmail}:`, info.messageId);
              }

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true, messageId: info.messageId, provider: 'Nodemailer' }));
            } catch (err: any) {
              console.error('[Nodemailer Dev Plugin Error]:', err);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
        } else {
          res.statusCode = 405;
          res.end('Method Not Allowed');
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), nodemailerPlugin()],
});

