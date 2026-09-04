import type { Applicant, EmailLog, EmailType } from '../types/recruitment';
import { DatabaseService } from './db';

export class EmailService {
  static getGmailComposeUrl(toEmail: string, subject: string, body: string): string {
    const encodedTo = encodeURIComponent(toEmail);
    const encodedSub = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedTo}&su=${encodedSub}&body=${encodedBody}`;
  }

  static openInGmail(toEmail: string, subject: string, body: string): void {
    const url = this.getGmailComposeUrl(toEmail, subject, body);
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  static sendEmail(
    type: EmailType,
    applicant: Applicant,
    extraContext: { requested_info_question?: string; interview_details?: string } = {}
  ): EmailLog | null {
    const settings = DatabaseService.getEmailSettings();

    // Check toggle
    const toggleMap: Record<EmailType, boolean> = {
      application_received: settings.enable_application_received,
      shortlisted: settings.enable_shortlist,
      interview: settings.enable_interview,
      info_requested: settings.enable_info_requested,
      accepted: settings.enable_acceptance,
      declined: settings.enable_decline,
    };

    if (!toggleMap[type]) {
      console.log(`Email event [${type}] is currently disabled in Email Settings.`);
      return null;
    }

    const template = settings.templates[type];
    if (!template) {
      console.warn(`Template for [${type}] not found.`);
      return null;
    }

    // Replace placeholders
    const replaceVariables = (str: string): string => {
      return str
        .replace(/\{\{name\}\}/g, applicant.full_name || 'Applicant')
        .replace(/\{\{email\}\}/g, applicant.email || 'user@example.com')
        .replace(/\{\{application_id\}\}/g, applicant.application_id || '')
        .replace(/\{\{first_preference\}\}/g, applicant.first_preference || 'N/A')
        .replace(/\{\{second_preference\}\}/g, applicant.second_preference || 'N/A')
        .replace(
          /\{\{final_assigned_team\}\}/g,
          applicant.final_assigned_team || applicant.first_preference || 'Assigned Team'
        )
        .replace(
          /\{\{requested_info_question\}\}/g,
          extraContext.requested_info_question || applicant.requested_info_question || 'N/A'
        )
        .replace(
          /\{\{interview_details\}\}/g,
          extraContext.interview_details || applicant.interview_details || 'Details to follow.'
        );
    };

    const subject = replaceVariables(template.subject);
    const body_html = replaceVariables(template.body_template);

    const emailLog: EmailLog = {
      email_id: `email-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      application_id: applicant.application_id,
      recipient_email: applicant.email,
      email_type: type,
      subject: subject,
      body_html: body_html,
      status: 'Sent',
      sent_at: new Date().toISOString(),
    };

    // Save to DB
    DatabaseService.addEmailLog(emailLog);

    // Dispatch global event for live inbox simulation
    window.dispatchEvent(
      new CustomEvent('neuramorphix_email_sent', {
        detail: emailLog,
      })
    );

    // Real-time email dispatch directly to applicant's Gmail inbox
    if (applicant.email && applicant.email.includes('@')) {
      try {
        const payload = {
          _subject: subject,
          _captcha: 'false',
          _replyto: 'moniswarmoni509@gmail.com',
          _cc: applicant.email,
          _template: 'box',
          'Applicant Name': applicant.full_name,
          'Application ID': applicant.application_id,
          'Recipient Email': applicant.email,
          '1st Choice (Compulsory)': applicant.first_preference,
          '2nd Choice (Optional)': applicant.second_preference || 'None (Optional)',
          'Application Status': applicant.status,
          'Message Details': body_html.replace(/<[^>]*>?/gm, ''),
        };

        // 1. Send via system endpoint with CC to applicant's inbox
        fetch('https://formsubmit.co/ajax/moniswarmoni509@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(payload),
        })
          .then((res) => console.log(`[Real Time Email CC User] Status:`, res.status))
          .catch((err) => console.log('[Real Time Email CC Error]:', err));

        // 2. Direct send to applicant's specific email address
        fetch(`https://formsubmit.co/ajax/${encodeURIComponent(applicant.email)}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(payload),
        })
          .then((res) => console.log(`[Real Time Email Direct User] Status:`, res.status))
          .catch((err) => console.log('[Real Time Email Direct Error]:', err));

        // 3. Local Nodemailer dev endpoint
        fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: applicant.email,
            from: 'moniswarmoni509@gmail.com',
            subject: subject,
            text: body_html,
            applicantName: applicant.full_name,
            applicationId: applicant.application_id,
            firstPreference: applicant.first_preference,
            secondPreference: applicant.second_preference,
          }),
        }).catch(() => {});
      } catch (e) {
        console.log('[Email Dispatch Exception]:', e);
      }
    }

    return emailLog;
  }
}
