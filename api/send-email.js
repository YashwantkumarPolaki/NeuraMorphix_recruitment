import nodemailer from 'nodemailer';

function escapeHtml(value) {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildHtml({
  applicantName,
  applicationId,
  phone,
  firstPreference,
  secondPreference,
  finalAssignedTeam,
  requestedInfoQuestion,
  interviewDetails,
  emailType,
  bodyHtml,
}) {
  const safeName = escapeHtml(applicantName);
  const safeApplicationId = escapeHtml(applicationId);
  const safePhone = escapeHtml(phone);
  const safeFirstPreference = escapeHtml(firstPreference);
  const safeSecondPreference = escapeHtml(secondPreference);
  const safeFinalTeam = escapeHtml(finalAssignedTeam);
  const safeQuestion = escapeHtml(requestedInfoQuestion);
  const safeInterview = escapeHtml(interviewDetails);

  let additionalContent = '';

  if (emailType === 'application_received') {
    additionalContent = `
      <p>
        Your application has been successfully received by
        the NeuraMorphix recruitment team.
      </p>

      <div class="info-box">
        <strong>Application ID:</strong>
        ${safeApplicationId}
      </div>
    `;
  }

  if (emailType === 'shortlisted') {
    additionalContent = `
      <p>
        Congratulations! Your application has been shortlisted
        for the next stage of the recruitment process.
      </p>

      <div class="info-box">
        <strong>Application ID:</strong>
        ${safeApplicationId}
      </div>
    `;
  }

  if (emailType === 'interview') {
    additionalContent = `
      <p>
        You have been selected for an interview.
      </p>

      <div class="info-box">
        <strong>Interview Details:</strong><br />
        ${safeInterview}
      </div>
    `;
  }

  if (emailType === 'info_requested') {
    additionalContent = `
      <p>
        Additional information is required for your application.
      </p>

      <div class="info-box">
        <strong>Requested Information:</strong><br />
        ${safeQuestion}
      </div>
    `;
  }

  if (emailType === 'accepted') {
    additionalContent = `
      <p>
        Congratulations! Your application has been accepted.
      </p>

      <div class="info-box">
        <strong>Assigned Team:</strong>
        ${safeFinalTeam}
      </div>
    `;
  }

  if (emailType === 'declined') {
    additionalContent = `
      <p>
        Thank you for your interest in NeuraMorphix.
        After reviewing your application, we are unable to
        proceed with your application at this time.
      </p>
    `;
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>NeuraMorphix Recruitment</title>

  <style>
    body {
      margin: 0;
      padding: 0;
      background: #0f172a;
      font-family: Arial, Helvetica, sans-serif;
      color: #e2e8f0;
    }

    .container {
      max-width: 650px;
      margin: 40px auto;
      background: #111827;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid #334155;
    }

    .header {
      padding: 28px;
      background: #020617;
      text-align: center;
    }

    .header h1 {
      margin: 0;
      color: #22d3ee;
      font-size: 26px;
    }

    .content {
      padding: 32px;
      line-height: 1.7;
    }

    .info-box {
      margin: 20px 0;
      padding: 16px;
      background: #0f172a;
      border: 1px solid #155e75;
      border-radius: 10px;
      color: #67e8f9;
    }

    .details {
      margin-top: 20px;
      padding: 18px;
      background: #020617;
      border-radius: 10px;
    }

    .details p {
      margin: 8px 0;
    }

    .footer {
      padding: 20px;
      background: #020617;
      text-align: center;
      font-size: 12px;
      color: #94a3b8;
    }

    strong {
      color: #f8fafc;
    }
  </style>
</head>

<body>
  <div class="container">

    <div class="header">
      <h1>NeuraMorphix</h1>
      <p>Recruitment 2026</p>
    </div>

    <div class="content">

      <p>Hello <strong>${safeName}</strong>,</p>

      ${additionalContent}

      <div class="details">
        <p>
          <strong>Application ID:</strong>
          ${safeApplicationId}
        </p>

        <p>
          <strong>Phone:</strong>
          ${safePhone}
        </p>

        <p>
          <strong>First Preference:</strong>
          ${safeFirstPreference}
        </p>

        <p>
          <strong>Second Preference:</strong>
          ${safeSecondPreference}
        </p>
      </div>

      ${
        bodyHtml
          ? `<div style="margin-top:20px">${bodyHtml}</div>`
          : ''
      }

      <p>
        Thank you for your interest in NeuraMorphix.
      </p>

      <p>
        Regards,<br />
        <strong>NeuraMorphix Recruitment Team</strong>
      </p>

    </div>

    <div class="footer">
      This is an automated recruitment notification.
    </div>

  </div>
</body>
</html>
`;
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'POST, OPTIONS'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type'
  );

  // OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  }

  try {
    const {
      to,
      subject,
      bodyHtml,
      applicantName,
      applicationId,
      phone,
      firstPreference,
      secondPreference,
      finalAssignedTeam,
      requestedInfoQuestion,
      interviewDetails,
      emailType,
    } = req.body || {};

    // Required fields
    if (!to || !subject || !applicantName || !applicationId) {
      return res.status(400).json({
        success: false,
        message:
          'Missing required email information',
      });
    }

    // Environment variables
    const systemEmail = process.env.SMTP_USER || 'moniswarmoni509@gmail.com';
    const systemPass = process.env.SMTP_PASS || 'rzlcebjxhpgbumqb';

    // Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',

      auth: {
        user: systemEmail,
        pass: systemPass,
      },
    });

    // Build email
    const html = buildHtml({
      applicantName,
      applicationId,
      phone,
      firstPreference,
      secondPreference,
      finalAssignedTeam,
      requestedInfoQuestion,
      interviewDetails,
      emailType,
      bodyHtml,
    });

    // Send
    const info = await transporter.sendMail({
      from: `"NeuraMorphix Recruitment" <${systemEmail}>`,
      to,
      subject,
      html,
    });

    console.log(
      'Email successfully sent:',
      info.messageId
    );

    return res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      messageId: info.messageId,
      via: 'Gmail SMTP',
    });

  } catch (error) {
    console.error(
      'Nodemailer error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Failed to send email',
    });
  }
}