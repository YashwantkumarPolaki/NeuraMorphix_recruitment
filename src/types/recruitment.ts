export type ApplicationStatus =
  | 'Application Received'
  | 'Under Review'
  | 'Shortlisted'
  | 'Interview'
  | 'Information Requested'
  | 'Information Received'
  | 'Accepted'
  | 'Declined';

export type DeclineReasonCategory =
  | 'Role capacity reached'
  | 'Skills mismatch'
  | 'Application incomplete'
  | 'Selection criteria'
  | 'Other';

export interface AdminNote {
  id: string;
  author: string;
  text: string;
  created_at: string;
}

export interface Applicant {
  id: string;
  application_id: string;
  full_name: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  year: string;
  skills: string[];
  experience: string;
  first_preference: string;
  second_preference: string;
  final_assigned_team: string | null;
  status: ApplicationStatus;
  resume_url: string;
  github_url: string;
  linkedin_url: string;
  portfolio_url: string;
  admin_notes: AdminNote[];
  decline_reason: DeclineReasonCategory | null;
  decline_note: string | null;
  requested_info_question: string | null;
  requested_info_response: string | null;
  interview_details: string | null;
  created_at: string;
  updated_at: string;
  reviewed_at: string | null;
  accepted_at: string | null;
  declined_at: string | null;
  accepted_by?: string;
  declined_by?: string;
}

export interface Role {
  role_id: string;
  role_name: string;
  description: string;
  skills: string[];
  icon_name: string;
  is_active: boolean;
}

export type EmailType =
  | 'application_received'
  | 'shortlisted'
  | 'interview'
  | 'info_requested'
  | 'accepted'
  | 'declined';

export interface EmailLog {
  email_id: string;
  application_id: string;
  recipient_email: string;
  email_type: EmailType;
  subject: string;
  body_html: string;
  status: 'Sent' | 'Failed';
  sent_at: string;
}

export interface AdminUser {
  admin_id: string;
  name: string;
  email: string;
  role: 'Lead Recruiter' | 'Technical Reviewer' | 'Admin';
  password?: string;
  created_at: string;
}

export interface EmailTemplate {
  subject: string;
  body_template: string;
}

export interface EmailSettings {
  enable_application_received: boolean;
  enable_shortlist: boolean;
  enable_interview: boolean;
  enable_info_requested: boolean;
  enable_acceptance: boolean;
  enable_decline: boolean;
  templates: Record<EmailType, EmailTemplate>;
}

export interface RecruitmentConfig {
  start_date: string;
  end_date: string;
  is_manually_open: boolean | null; // null means auto by date
}
