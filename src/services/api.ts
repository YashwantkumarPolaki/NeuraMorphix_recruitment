import type { Applicant, AdminUser } from '../types/recruitment';
import { DatabaseService } from './db';

const APPLICANTS_API = '/api/applicants';

export class BackendApiService {
  /**
   * Admin login is local-only (fixed admin list in DatabaseService) — no remote auth backend exists.
   */
  static async loginUser(email: string, password: string): Promise<AdminUser | null> {
    return DatabaseService.authenticateAdmin(email, password);
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
