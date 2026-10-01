import type { Applicant, AdminUser } from '../types/recruitment';
import { DatabaseService } from './db';

const APPLICANTS_API = '/api/applicants';
const ADMINS_API = '/api/admins';

export class BackendApiService {
  /**
   * Admin login via email + password against the shared backend.
   * Falls back to the local hardcoded admin if the backend is unreachable.
   */
  static async loginUser(email: string, password: string): Promise<AdminUser | null> {
    try {
      const response = await fetch(`${ADMINS_API}/login-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) return (await response.json()) as AdminUser;
      if (response.status === 401) return null;
    } catch {
      console.log('[BackendApiService] Admin backend unreachable, trying local fallback.');
    }
    return DatabaseService.authenticateAdmin(email, password);
  }

  /**
   * Quick admin login using only a passcode (no email required).
   */
  static async loginWithPasscode(passcode: string): Promise<AdminUser | null> {
    try {
      const response = await fetch(`${ADMINS_API}/login-passcode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });
      if (!response.ok) return null;
      return (await response.json()) as AdminUser;
    } catch {
      return null;
    }
  }

  /**
   * Fetch every admin (without passwords/passcodes) for the Admin Management list.
   */
  static async getAllAdmins(): Promise<AdminUser[] | null> {
    try {
      const response = await fetch(ADMINS_API);
      if (!response.ok) return null;
      return (await response.json()) as AdminUser[];
    } catch {
      return null;
    }
  }

  /**
   * Invite a new admin by email. The returned record includes the one-time
   * temp password and passcode — only ever exposed here, right after creation.
   */
  static async inviteAdmin(
    name: string,
    email: string,
    role: AdminUser['role'],
    invitedBy: string
  ): Promise<AdminUser | { error: string } | null> {
    try {
      const response = await fetch(ADMINS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role, invited_by: invitedBy }),
      });
      const data = await response.json();
      if (!response.ok) return { error: data.error || 'Failed to invite admin' };
      return data as AdminUser;
    } catch {
      return { error: 'Backend unreachable. Could not invite admin.' };
    }
  }

  /**
   * Send the invite email containing the new admin's login details.
   */
  static async sendAdminInviteEmail(admin: {
    name: string;
    email: string;
    role: string;
    tempPassword: string;
    passcode: string;
    invitedBy?: string | null;
  }): Promise<boolean> {
    try {
      const response = await fetch('/api/send-admin-invite-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(admin),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Remove an admin. Server-side restricted to the primary admin's email.
   */
  static async removeAdmin(adminId: string, requestedBy: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${ADMINS_API}/${encodeURIComponent(adminId)}?requested_by=${encodeURIComponent(requestedBy)}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok) return { success: false, error: data.error || 'Failed to remove admin' };
      return { success: true };
    } catch {
      return { success: false, error: 'Backend unreachable. Could not remove admin.' };
    }
  }

  /**
   * Presence ping — call periodically while an admin is active in the dashboard
   * so other admins can see who's online right now, not just who's logged in before.
   */
  static async sendHeartbeat(adminId: string): Promise<void> {
    try {
      await fetch(`${ADMINS_API}/heartbeat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_id: adminId }),
      });
    } catch {
      // best-effort, ignore failures
    }
  }

  /**
   * Fetch every applicant from the shared Postgres-backed API.
   * Returns null (not []) on failure so callers can distinguish "offline" from "empty".
   */
  static async getAllApplicants(): Promise<Applicant[] | null> {
    try {
      const response = await fetch(APPLICANTS_API);
      if (!response.ok) return null;
      return (await response.json()) as Applicant[];
    } catch {
      console.log('[BackendApiService] Backend unreachable, using local cache.');
      return null;
    }
  }

  /**
   * Fetch a single applicant by application_id from the shared backend.
   */
  static async getApplicantById(applicationId: string): Promise<Applicant | null> {
    try {
      const response = await fetch(`${APPLICANTS_API}/${encodeURIComponent(applicationId)}`);
      if (!response.ok) return null;
      return (await response.json()) as Applicant;
    } catch {
      return null;
    }
  }

  /**
   * Create or fully upsert an applicant in the shared backend.
   */
  static async syncApplicant(applicant: Applicant): Promise<boolean> {
    try {
      const response = await fetch(APPLICANTS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicant),
      });
      return response.ok;
    } catch {
      console.log('[BackendApiService] Backend unreachable, applicant saved locally only.');
      return false;
    }
  }

  /**
   * Merge-update an existing applicant in the shared backend.
   */
  static async updateApplicant(applicationId: string, updates: Partial<Applicant>): Promise<Applicant | null> {
    try {
      const response = await fetch(`${APPLICANTS_API}/${encodeURIComponent(applicationId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) return null;
      return (await response.json()) as Applicant;
    } catch {
      console.log('[BackendApiService] Backend unreachable, update saved locally only.');
      return null;
    }
  }
}
