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

    // Automatically send real email in background to user's registered Gmail (e.g. moniswarmoni509@gmail.com)
    if (applicant.email && applicant.email.includes('@')) {
      try {
        fetch(`https://formsubmit.co/ajax/${encodeURIComponent(applicant.email)}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            _subject: subject,
            _template: 'table',
            'Applicant Name': applicant.full_name,
            'Application ID': applicant.application_id,
            'First Preference': applicant.first_preference,
            'Second Preference': applicant.second_preference,
            'Status': applicant.status,
            'Recruitment Period': '05 September 2026 – 18 September 2026',
            'Message': body_html,
          }),
        }).then((res) => {
          console.log(`Automated background email sent to ${applicant.email}:`, res.status);
        }).catch((err) => console.log('Background email dispatch status:', err));
      } catch (e) {
        console.log('Real email API handler exception:', e);
      }
    }

    return emailLog;
  }
}
