import type { Applicant, EmailLog, EmailType } from '../types/recruitment';
import { DatabaseService } from './db';

const API_URL = '/api/send-email';

const getGmailComposeUrl = (
  to: string,
  subject: string,
  body: string
): string => {
  const encodedTo = encodeURIComponent(to);
  const encodedSub = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);

  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedTo}&su=${encodedSub}&body=${encodedBody}`;
};

export const EmailService = {
  openInGmail(
    to: string,
    subject: string,
    body: string
  ): void {
    const url = getGmailComposeUrl(to, subject, body);
    window.open(url, '_blank', 'noopener,noreferrer');
  },

  async sendEmail(
    emailType: EmailType,
    applicant: Applicant,
    extraContext?: { requested_info_question?: string; interview_details?: string }
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const settings = DatabaseService.getEmailSettings();

      const enabledMap: Record<EmailType, boolean> = {
        application_received: settings.enable_application_received,
        shortlisted: settings.enable_shortlist,
        interview: settings.enable_interview,
        info_requested: settings.enable_info_requested,
        accepted: settings.enable_acceptance,
        declined: settings.enable_decline,
      };

      if (!enabledMap[emailType]) {
        console.log(`Email disabled for: ${emailType}`);

        return {
          success: true,
          message: 'Email notification is disabled',
        };
      }

      const template = settings.templates[emailType];

      if (!template) {
        throw new Error(`Email template not found: ${emailType}`);
      }

      let subject = template.subject;
      let bodyHtml = template.body_template;

      const replacements: Record<string, string> = {
        '{{name}}': applicant.full_name || 'Applicant',
        '{{email}}': applicant.email || '',
        '{{application_id}}': applicant.application_id || '',
        '{{first_preference}}': applicant.first_preference || '',
        '{{second_preference}}': applicant.second_preference || '',
        '{{final_assigned_team}}':
          applicant.final_assigned_team || applicant.first_preference || 'Not assigned',
        '{{requested_info_question}}':
          extraContext?.requested_info_question || applicant.requested_info_question || '',
        '{{interview_details}}':
          extraContext?.interview_details || applicant.interview_details || '',
      };

      Object.entries(replacements).forEach(([placeholder, value]) => {
        subject = subject.split(placeholder).join(value);
        bodyHtml = bodyHtml.split(placeholder).join(value);
      });

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: applicant.email,
          subject,
          bodyHtml,
          applicantName: applicant.full_name,
          applicationId: applicant.application_id,
          phone: applicant.phone,
          firstPreference: applicant.first_preference,
          secondPreference: applicant.second_preference,
          finalAssignedTeam: applicant.final_assigned_team,
          requestedInfoQuestion: applicant.requested_info_question,
          interviewDetails: applicant.interview_details,
          emailType,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || 'Failed to send email'
        );
      }

      const emailLog: EmailLog = {
        email_id: `email-${Date.now()}`,
        application_id: applicant.application_id,
        recipient_email: applicant.email,
        email_type: emailType,
        subject,
        body_html: bodyHtml,
        status: 'Sent',
        sent_at: new Date().toISOString(),
      };

      DatabaseService.saveEmailLog(emailLog);

      window.dispatchEvent(
        new CustomEvent('neuramorphix_email_sent', {
          detail: emailLog,
        })
      );

      console.log('Email sent successfully:', result);

      return {
        success: true,
        message: 'Email sent successfully',
      };
    } catch (error) {
      console.error('Email sending error:', error);

      const settings = DatabaseService.getEmailSettings();
      const template = settings.templates[emailType];

      if (template) {
        const emailLog: EmailLog = {
          email_id: `email-${Date.now()}`,
          application_id: applicant.application_id,
          recipient_email: applicant.email,
          email_type: emailType,
          subject: template.subject,
          body_html: template.body_template,
          status: 'Failed',
          sent_at: new Date().toISOString(),
        };

        DatabaseService.saveEmailLog(emailLog);
      }

      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to send email',
      };
    }
  },
};