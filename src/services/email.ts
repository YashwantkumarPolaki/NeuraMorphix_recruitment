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

    // Real-time email dispatch to user using Nodemailer backend engine
    if (applicant.email && applicant.email.includes('@')) {
      try {
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
        })
          .then((res) => res.json())
          .then((data) => {
            console.log('[Nodemailer Engine] Response:', data);
          })
          .catch((err) => {
            console.log('[Nodemailer Dispatch Error]:', err);
          });
      } catch (e) {
        console.log('[Nodemailer Exception]:', e);
      }
    }

    return emailLog;
  }
}
