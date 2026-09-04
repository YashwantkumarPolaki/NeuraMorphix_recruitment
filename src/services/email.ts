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

    // Single automated real email dispatch to registered user email (no activation emails, no duplicate sends)
    if (applicant.email && applicant.email.includes('@')) {
      try {
        // Use FormSubmit activated token or clean ajax endpoint with captcha false
        const targetEndpoint = 'https://formsubmit.co/ajax/43b1e7c56ba19fd8ae9d0b7e01f3353';
        
        fetch(targetEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            _subject: `NeuraMorphix Recruitment — Application Received (${applicant.application_id})`,
            _captcha: 'false',
            _replyto: 'moniswarmoni509@gmail.com',
            _autorespond: `Hello ${applicant.full_name},

Thank you for registering for NeuraMorphix 2026 Recruitment!

Application Details & Tracking:
• Application ID: ${applicant.application_id}
• Registered Name: ${applicant.full_name}
• Registered Email: ${applicant.email}
• 1st Choice (Compulsory): ${applicant.first_preference}
• 2nd Choice (Optional): ${applicant.second_preference || 'None'}
• Application Status: Application Received

Tracking Status:
Track your progress on our portal using Application ID: ${applicant.application_id}

Best regards,
NeuraMorphix System (moniswarmoni509@gmail.com)`,
            'Application ID': applicant.application_id,
            'Applicant Name': applicant.full_name,
            'Registered Email': applicant.email,
            'First Preference (1st Choice)': applicant.first_preference,
            'Second Preference (2nd Choice)': applicant.second_preference || 'None (Optional)',
            'Application Status': applicant.status,
            'Tracking Portal URL': `https://neuramorphix.org/track (ID: ${applicant.application_id})`,
          }),
        })
          .then((res) => {
            console.log(`Real-time single email sent to user ${applicant.email}:`, res.status);
          })
          .catch((err) => console.log('Real-time email dispatch status:', err));
      } catch (e) {
        console.log('Real email API handler exception:', e);
      }
    }

    return emailLog;
  }
}
