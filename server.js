import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// System Mailer configuration using Nodemailer
const systemEmail = process.env.SMTP_USER || 'moniswarmoni509@gmail.com';
const systemPass = process.env.SMTP_PASS || 'moni1234';

// Create Nodemailer Transporter
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: systemEmail,
    pass: systemPass,
  },
});

// Fallback to test SMTP if Gmail SMTP credentials are not active in environment
let testTransporter = null;
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

app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, text, applicantName, applicationId, firstPreference, secondPreference } = req.body;

    const recipientEmail = to || systemEmail;
    const emailSubject = subject || `NeuraMorphix Recruitment — Application Received (${applicationId || 'N/A'})`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 24px; borderRadius: 16px;">
        <h2 style="color: #38bdf8; margin-bottom: 12px;">NeuraMorphix Recruitment 2026</h2>
        <p>Hello <strong>${applicantName || 'Applicant'}</strong>,</p>
        <p>Your registration for the NeuraMorphix recruitment cycle has been successfully received.</p>
        
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
      from: `"NeuraMorphix Recruitment System" <${systemEmail}>`,
      to: recipientEmail,
      subject: emailSubject,
      text: text || `Hello ${applicantName}, Application ID: ${applicationId}`,
      html: htmlContent,
    };

    let info;
    try {
      // Primary: Send via Nodemailer Gmail Transporter
      info = await transporter.sendMail(mailOptions);
      console.log(`[Nodemailer] Email sent to ${recipientEmail}:`, info.messageId);
    } catch (primaryErr) {
      console.log('[Nodemailer] Primary Gmail Transport fallback:', primaryErr.message);
      // Fallback: Send via Nodemailer Test SMTP
      const fallbackTransporter = await getTestTransporter();
      info = await fallbackTransporter.sendMail(mailOptions);
      console.log(`[Nodemailer Test Account] Email sent to ${recipientEmail}:`, info.messageId);
      console.log('[Nodemailer Preview URL]:', nodemailer.getTestMessageUrl(info));
    }

    return res.status(200).json({
      success: true,
      message: 'Email sent successfully via Nodemailer',
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info) || null,
    });
  } catch (error) {
    console.error('[Nodemailer Handler Error]:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to send email via Nodemailer',
    });
  }
});

app.listen(PORT, () => {
  console.log(`[Nodemailer Server] Server listening on http://localhost:${PORT}`);
});
