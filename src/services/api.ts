import type { Applicant, AdminUser } from '../types/recruitment';
import { DatabaseService } from './db';

const BACKEND_BASE_URL = 'http://localhost:8080';

export class BackendApiService {
  /**
   * Attempt to authenticate via Spring Boot backend (/api/users/login)
   * Falls back to local DatabaseService if backend is offline.
   */
  static async loginUser(email: string, password: string): Promise<AdminUser | null> {
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const user = await response.json();
        if (user && user.email) {
          return {
            admin_id: `admin-${user.id || 'db'}`,
            name: user.name || user.email.split('@')[0],
            email: user.email,
            role: (user.role as any) || 'admin',
            created_at: new Date().toISOString(),
          };
        }
      }
    } catch {
      console.log('[BackendApiService] Backend offline, using local authentication.');
    }

    // Fallback to local authentication
    return DatabaseService.authenticateAdmin(email, password);
  }

  /**
   * Register a user via Spring Boot backend (/api/users/register)
   */
  static async registerUser(name: string, email: string, password: string, role = 'admin'): Promise<boolean> {
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      return response.ok;
    } catch (err) {
      console.error('[BackendApiService] Register error:', err);
      return false;
    }
  }

  /**
   * Sync new applicant to Spring Boot backend (/api/applicants)
   */
  static async syncApplicant(applicant: Applicant): Promise<void> {
    try {
      await fetch(`${BACKEND_BASE_URL}/api/applicants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: applicant.application_id,
          fullName: applicant.full_name,
          email: applicant.email,
          phone: applicant.phone,
          college: applicant.college,
          department: applicant.department,
          yearOfStudy: applicant.year,
          firstPreference: applicant.first_preference,
          secondPreference: applicant.second_preference,
          skills: applicant.skills?.join(', '),
          experienceSummary: applicant.experience,
          whyJoin: '',
          githubUrl: applicant.github_url,
          linkedinUrl: applicant.linkedin_url,
          portfolioUrl: applicant.portfolio_url,
          status: applicant.status,
          finalAssignedTeam: applicant.final_assigned_team,
        }),
      });
    } catch {
      console.log('[BackendApiService] Backend offline, applicant saved locally.');
    }
  }

  /**
   * Update applicant status in Spring Boot backend
   */
  static async updateApplicantStatus(
    applicationId: string,
    updates: Partial<Applicant>
  ): Promise<void> {
    try {
      await fetch(`${BACKEND_BASE_URL}/api/applicants/${applicationId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: updates.status,
          finalAssignedTeam: updates.final_assigned_team,
          declineReason: updates.decline_reason,
          requestedInfoQuestion: updates.requested_info_question,
          requestedInfoResponse: updates.requested_info_response,
          interviewDetails: updates.interview_details,
        }),
      });
    } catch {
      console.log('[BackendApiService] Backend offline, status saved locally.');
    }
  }
}
