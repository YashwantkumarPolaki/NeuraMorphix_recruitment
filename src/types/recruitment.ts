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

// Answers collected by the Startup & Entrepreneurship assessment page.
// Keys correspond to `id` fields in src/data/startupAssessmentQuestions.ts.
export interface StartupAssessmentAnswers {
  linkedin_url: string;
  github_portfolio_url: string;
  instagram_url: string;
  why_join_neuramorphix: string;
  why_startup_environment: string;
  why_hire_you: string;
  what_contribute: string;
  startup_attraction: string;
  incomplete_instructions: string;
  idea_rejected: string;
  project_fails: string;
  unassigned_problem: string;
  important_quality: string;
  unknown_task: string;
  teammate_struggling: string;
  ownership_meaning: string;
  new_initiative_first_step: string;
  leadership_approach: string;
  disagree_with_senior: string;
  little_market_info: string;
  negative_feedback: string;
  limited_resources_priority: string;
  two_ideas_investigate: string;
  missed_deadline: string;
  founding_team_reason: string;
  improve_or_build: string;
  first_three_steps: string;
  real_world_problem: string;
  first_idea_failed: string;
  comfort_with_uncertainty: string;
  willing_to_commit: string;
  completion_sentence: string;
}

export interface Applicant {
  id: string;
  application_id: string;
  full_name: string;
  gender: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  year: string;
  registration_number?: string;
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
  instagram_url: string;
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
  startup_assessment?: StartupAssessmentAnswers;
}

export interface Role {
  role_id: string;
  role_name: string;
  description: string;
  skills: string[];
  icon_name: string;
  is_active: boolean;
  eligibility_note?: string;
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
  passcode?: string;
  invited_by?: string | null;
  last_login_at?: string | null;
  last_seen_at?: string | null;
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
