import React, { useState, useEffect } from 'react';
import type {
  Applicant,
  Role,
  DeclineReasonCategory,
  EmailSettings,
  RecruitmentConfig,
  EmailType,
  AdminUser,
} from '../types/recruitment';
import { DatabaseService } from '../services/db';
import { EmailService } from '../services/email';
import { BackendApiService } from '../services/api';
import { NeuraMorphixLogo } from './NeuraMorphixLogo';
import { STARTUP_ASSESSMENT_SECTIONS } from '../data/startupAssessmentQuestions';
import type { StartupAssessmentAnswers } from '../types/recruitment';
import {
  Users,
  Search,
  Eye,
  EyeOff,
  Mail,
  Settings,
  MessageSquare,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Sliders,
  LogOut,
  Lock,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Rocket,
  KeyRound,
  UserPlus,
  Copy,
  Crown,
} from 'lucide-react';

interface AdminDashboardProps {
  onSelectTab?: (tab: 'home' | 'apply' | 'track' | 'admin') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = () => {
  // Admin auth state
  const [sessionUser, setSessionUser] = useState<AdminUser | null>(() => {
    try {
      const saved = sessionStorage.getItem('neuramorphix_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return !!sessionStorage.getItem('neuramorphix_admin_user');
    } catch {
      return false;
    }
  });

  // Login Form State
  const [loginMode, setLoginMode] = useState<'password' | 'passcode'>('password');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginPasscode, setLoginPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const adminUser = sessionUser
    ? `${sessionUser.name} (${sessionUser.role})`
    : 'Admin Recruiter';

  const completeLogin = (matchedAdmin: AdminUser) => {
    setSessionUser(matchedAdmin);
    setIsAuthenticated(true);
    try {
      sessionStorage.setItem('neuramorphix_admin_user', JSON.stringify(matchedAdmin));
    } catch {
      // ignore
    }
    showToast(`Welcome back, ${matchedAdmin.name}! Authenticated as ${matchedAdmin.role}.`);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!loginEmail.trim()) {
      setAuthError('Please enter your admin email address.');
      return;
    }
    if (!loginPassword.trim()) {
      setAuthError('Please enter your admin password.');
      return;
    }

    setIsLoggingIn(true);

    try {
      const matchedAdmin = await BackendApiService.loginUser(loginEmail, loginPassword);
      if (matchedAdmin) {
        completeLogin(matchedAdmin);
      } else {
        setAuthError('Invalid credentials. Contact the NeuraMorphix team lead for admin access.');
      }
    } catch {
      setAuthError('Authentication error. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handlePasscodeLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!loginPasscode.trim()) {
      setAuthError('Please enter your quick-login passcode.');
      return;
    }

    setIsLoggingIn(true);

    try {
      const matchedAdmin = await BackendApiService.loginWithPasscode(loginPasscode.trim());
      if (matchedAdmin) {
        completeLogin(matchedAdmin);
      } else {
        setAuthError('Invalid passcode.');
      }
    } catch {
      setAuthError('Authentication error. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('neuramorphix_admin_user');
    } catch {
      // ignore
    }
    setSessionUser(null);
    setIsAuthenticated(false);
    setLoginPassword('');
    showToast('Logged out of Admin Portal.');
  };

  // Main navigation tab
  const [activeTab, setActiveTab] = useState<'analytics' | 'applicants' | 'email_settings' | 'config' | 'admins'>('analytics');

  // State data from DB
  const [applicants, setApplicants] = useState<Applicant[]>(() => DatabaseService.getApplicants());
  const [roles, setRoles] = useState<Role[]>(() => DatabaseService.getRoles());
  const [emailSettings, setEmailSettings] = useState<EmailSettings>(() => DatabaseService.getEmailSettings());
  const [config, setConfig] = useState<RecruitmentConfig>(() => DatabaseService.getConfig());

  // Admin Management state
  const [admins, setAdmins] = useState<AdminUser[]>(() => DatabaseService.getAdmins());
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<AdminUser['role']>('Technical Reviewer');
  const [isInviting, setIsInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [newAdminCredentials, setNewAdminCredentials] = useState<{
    name: string;
    email: string;
    tempPassword: string;
    passcode: string;
    emailSent: boolean;
  } | null>(null);

  // Search & Filters for Applicants Table
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Selected Applicant for detail view modal
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);

  // Action Modals
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState<DeclineReasonCategory>('Role capacity reached');
  const [declineNote, setDeclineNote] = useState('');

  const [showReqInfoModal, setShowReqInfoModal] = useState(false);
  const [reqInfoQuestion, setReqInfoQuestion] = useState('Please provide your GitHub repository or portfolio for your selected development role.');

  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewDetailsInput, setInterviewDetailsInput] = useState('Google Meet link: https://meet.google.com/nmx-recruit | Date: Sep 14, 2026 at 4:00 PM IST');

  const [showRoleAssignModal, setShowRoleAssignModal] = useState(false);
  const [assignedRoleChoice, setAssignedRoleChoice] = useState('');

  const [noteInput, setNoteInput] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Email Template Editing tab state
  const [editingTemplateType, setEditingTemplateType] = useState<EmailType>('application_received');
  const [templateSubject, setTemplateSubject] = useState(() => {
    const settings = DatabaseService.getEmailSettings();
    return settings.templates['application_received']?.subject || '';
  });
  const [templateBody, setTemplateBody] = useState(() => {
    const settings = DatabaseService.getEmailSettings();
    return settings.templates['application_received']?.body_template || '';
  });

  const refreshData = () => {
    const apps = DatabaseService.getApplicants();
    const rls = DatabaseService.getRoles();
    setApplicants(apps);
    setRoles(rls);
    setEmailSettings(DatabaseService.getEmailSettings());
    setConfig(DatabaseService.getConfig());
  };

  // Hydrate from the shared backend on login so the admin sees every applicant
  // across all devices/browsers, not just whatever is cached in this browser's
  // localStorage. Falls back silently to the local cache if the backend is unreachable.
  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    (async () => {
      const remote = await BackendApiService.getAllApplicants();
      if (!cancelled && remote) {
        DatabaseService.saveApplicants(remote);
        setApplicants(remote);
      }
      const remoteAdmins = await BackendApiService.getAllAdmins();
      if (!cancelled && remoteAdmins) {
        DatabaseService.saveAdmins(remoteAdmins);
        setAdmins(remoteAdmins);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const handleInviteAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError(null);

    if (!inviteName.trim() || !inviteEmail.trim()) {
      setInviteError('Please enter both a name and email address.');
      return;
    }

    setIsInviting(true);
    try {
      const result = await BackendApiService.inviteAdmin(
        inviteName.trim(),
        inviteEmail.trim(),
        inviteRole,
        sessionUser?.name || adminUser
      );

      if (!result) {
        setInviteError('Could not reach the server. Please try again.');
        return;
      }
      if ('error' in result) {
        setInviteError(result.error);
        return;
      }

      const emailSent = await BackendApiService.sendAdminInviteEmail({
        name: result.name,
        email: result.email,
        role: result.role,
        tempPassword: result.password || '',
        passcode: result.passcode || '',
        invitedBy: result.invited_by,
      });

      setNewAdminCredentials({
        name: result.name,
        email: result.email,
        tempPassword: result.password || '',
        passcode: result.passcode || '',
        emailSent,
      });

      const refreshedAdmins = await BackendApiService.getAllAdmins();
      if (refreshedAdmins) {
        DatabaseService.saveAdmins(refreshedAdmins);
        setAdmins(refreshedAdmins);
      }

      setInviteName('');
      setInviteEmail('');
      setInviteRole('Technical Reviewer');
      showToast(emailSent ? `Invite sent to ${result.email}.` : `Admin added, but the invite email failed to send.`);
    } catch {
      setInviteError('Something went wrong while inviting this admin.');
    } finally {
      setIsInviting(false);
    }
  };

  useEffect(() => {
    if (selectedApplicant) {
      const current = applicants.find((a) => a.id === selectedApplicant.id);
      if (current && current !== selectedApplicant) {
        setSelectedApplicant(current);
      }
    }
  }, [applicants, selectedApplicant]);

  useEffect(() => {
    if (emailSettings.templates[editingTemplateType]) {
      setTemplateSubject(emailSettings.templates[editingTemplateType].subject);
      setTemplateBody(emailSettings.templates[editingTemplateType].body_template);
    }
  }, [editingTemplateType, emailSettings]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Analytics Metrics
  const totalApps = applicants.length;
  const pendingApps = applicants.filter((a) => a.status === 'Application Received' || a.status === 'Under Review').length;
  const shortlistedApps = applicants.filter((a) => a.status === 'Shortlisted').length;
  const interviewApps = applicants.filter((a) => a.status === 'Interview').length;
  const acceptedApps = applicants.filter((a) => a.status === 'Accepted').length;
  const declinedApps = applicants.filter((a) => a.status === 'Declined').length;

  const getRoleApplicantCount = (roleName: string) => {
    return applicants.filter(
      (a) => a.first_preference === roleName || a.second_preference === roleName
    ).length;
  };

  // Filtered Applicants List
  const filteredApplicants = applicants.filter((app) => {
    const matchesSearch =
      app.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.application_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;

    const matchesRole =
      roleFilter === 'ALL' ||
      app.first_preference === roleFilter ||
      app.second_preference === roleFilter ||
      app.final_assigned_team === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  // Action Handlers
  const handleShortlist = (applicant: Applicant) => {
    const updated = DatabaseService.updateApplicant(applicant.id, {
      status: 'Shortlisted',
      reviewed_at: new Date().toISOString(),
    });
    if (updated) {
      BackendApiService.updateApplicant(updated.application_id, { status: updated.status, reviewed_at: updated.reviewed_at });
      EmailService.sendEmail('shortlisted', updated);
      refreshData();
      showToast(`Applicant ${applicant.full_name} moved to Shortlisted.`);
    }
  };

  const handleExecuteRequestInterview = () => {
    if (!selectedApplicant || !interviewDetailsInput.trim()) return;
    const updated = DatabaseService.updateApplicant(selectedApplicant.id, {
      status: 'Interview',
      interview_details: interviewDetailsInput.trim(),
      reviewed_at: new Date().toISOString(),
    });
    if (updated) {
      BackendApiService.updateApplicant(updated.application_id, { status: updated.status, interview_details: updated.interview_details, reviewed_at: updated.reviewed_at });
      EmailService.sendEmail('interview', updated, { interview_details: interviewDetailsInput.trim() });
      refreshData();
      setShowInterviewModal(false);
      showToast(`Interview requested for ${selectedApplicant.full_name}.`);
    }
  };

  const handleExecuteRequestInfo = () => {
    if (!selectedApplicant || !reqInfoQuestion.trim()) return;
    const updated = DatabaseService.updateApplicant(selectedApplicant.id, {
      status: 'Information Requested',
      requested_info_question: reqInfoQuestion.trim(),
      reviewed_at: new Date().toISOString(),
    });
    if (updated) {
      BackendApiService.updateApplicant(updated.application_id, { status: updated.status, requested_info_question: updated.requested_info_question, reviewed_at: updated.reviewed_at });
      EmailService.sendEmail('info_requested', updated, { requested_info_question: reqInfoQuestion.trim() });
      refreshData();
      setShowReqInfoModal(false);
      showToast(`Additional information requested from ${selectedApplicant.full_name}.`);
    }
  };

  const handleExecuteAccept = () => {
    if (!selectedApplicant) return;
    const assignedTeam = selectedApplicant.final_assigned_team || selectedApplicant.first_preference;

    const updated = DatabaseService.updateApplicant(selectedApplicant.id, {
      status: 'Accepted',
      final_assigned_team: assignedTeam,
      accepted_at: new Date().toISOString(),
      accepted_by: adminUser,
    });
    if (updated) {
      BackendApiService.updateApplicant(updated.application_id, { status: updated.status, final_assigned_team: updated.final_assigned_team, accepted_at: updated.accepted_at, accepted_by: updated.accepted_by });
      EmailService.sendEmail('accepted', updated);
      refreshData();
      setShowAcceptModal(false);
      showToast(`Applicant ${selectedApplicant.full_name} ACCEPTED into ${assignedTeam}! Confirmation email sent.`);
    }
  };

  const handleExecuteDecline = () => {
    if (!selectedApplicant) return;
    const updated = DatabaseService.updateApplicant(selectedApplicant.id, {
      status: 'Declined',
      decline_reason: declineReason,
      decline_note: declineNote.trim() || null,
      declined_at: new Date().toISOString(),
      declined_by: adminUser,
    });
    if (updated) {
      BackendApiService.updateApplicant(updated.application_id, { status: updated.status, decline_reason: updated.decline_reason, decline_note: updated.decline_note, declined_at: updated.declined_at, declined_by: updated.declined_by });
      EmailService.sendEmail('declined', updated);
      refreshData();
      setShowDeclineModal(false);
      showToast(`Application for ${selectedApplicant.full_name} DECLINED. Polite email notification sent.`);
    }
  };

  const handleAddNote = () => {
    if (!selectedApplicant || !noteInput.trim()) return;
    const newNote = {
      id: `note-${Date.now()}`,
      author: adminUser,
      text: noteInput.trim(),
      created_at: new Date().toISOString(),
    };
    const updatedNotes = [...(selectedApplicant.admin_notes || []), newNote];
    const updated = DatabaseService.updateApplicant(selectedApplicant.id, {
      admin_notes: updatedNotes,
    });
    if (updated) {
      BackendApiService.updateApplicant(updated.application_id, { admin_notes: updated.admin_notes });
      setNoteInput('');
      refreshData();
      showToast('Internal note saved.');
    }
  };

  const handleAssignFinalTeam = () => {
    if (!selectedApplicant || !assignedRoleChoice) return;
    const updated = DatabaseService.updateApplicant(selectedApplicant.id, {
      final_assigned_team: assignedRoleChoice,
    });
    if (updated) {
      BackendApiService.updateApplicant(updated.application_id, { final_assigned_team: updated.final_assigned_team });
      refreshData();
      setShowRoleAssignModal(false);
      showToast(`Assigned final team to ${assignedRoleChoice}.`);
    }
  };

  const handleSaveEmailTemplate = () => {
    const settings = { ...emailSettings };
    settings.templates[editingTemplateType] = {
      subject: templateSubject,
      body_template: templateBody,
    };
    DatabaseService.saveEmailSettings(settings);
    setEmailSettings(settings);
    showToast(`Saved email template for [${editingTemplateType}]`);
  };

  const handleToggleEmailSetting = (key: keyof Omit<EmailSettings, 'templates'>) => {
    const settings = { ...emailSettings, [key]: !emailSettings[key] };
    DatabaseService.saveEmailSettings(settings);
    setEmailSettings(settings);
    showToast(`Updated email trigger notification settings.`);
  };

  const handleSaveConfig = (newConfig: RecruitmentConfig) => {
    DatabaseService.saveConfig(newConfig);
    setConfig(newConfig);
    showToast('Recruitment configuration saved.');
  };

  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-[85vh] bg-[var(--color-bg-paper)] text-[var(--color-text-primary)] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center border-t-4 border-[#1E1B24]">
        <div className="max-w-lg w-full mx-auto">
          {/* Toast Notification */}
          {toastMsg && (
            <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-saffron)] text-[var(--color-saffron)] text-xs font-semibold shadow-2xl flex items-center gap-3 animate-fadeIn">
              <Sparkles className="w-4 h-4 text-[var(--color-saffron)] shrink-0" />
              <span>{toastMsg}</span>
            </div>
          )}

          <div className="glass-panel p-8 rounded-3xl border border-[var(--color-saffron)]/30 shadow-2xl relative overflow-hidden space-y-6">
            {/* Ambient Glow Background Accent */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--color-saffron)]/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Logo & Header */}
            <div className="text-center space-y-3">
              <div className="flex justify-center mb-2">
                <NeuraMorphixLogo size={56} />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-bg-dark)]/90 border border-[var(--color-saffron)]/40 text-[var(--color-saffron)] text-[11px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                NeuraMorphix Access Portal
              </div>
              <h2 className="text-2xl font-black text-[var(--color-text-primary)] tracking-tight">Recruiter Sign In</h2>
              <p className="text-xs text-[var(--color-text-muted)]">
                Enter your authorized recruiter or employee credentials to access management dashboard.
              </p>
            </div>

            <div className="space-y-6 animate-fadeIn">
                {/* Error Alert */}
                {authError && (
                  <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-200 text-xs flex items-start gap-2.5 animate-fadeIn">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{authError}</span>
                  </div>
                )}

                {/* Login Mode Toggle */}
                <div className="flex gap-2 p-1 rounded-xl bg-[var(--color-bg-dark)] border border-[var(--color-line)]">
                  <button
                    type="button"
                    onClick={() => { setLoginMode('password'); setAuthError(null); }}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                      loginMode === 'password'
                        ? 'bg-[var(--color-saffron)] text-[var(--color-text-primary)]'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                    }`}
                  >
                    Email &amp; Password
                  </button>
                  <button
                    type="button"
                    onClick={() => { setLoginMode('passcode'); setAuthError(null); }}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                      loginMode === 'passcode'
                        ? 'bg-[var(--color-saffron)] text-[var(--color-text-primary)]'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                    }`}
                  >
                    Quick Passcode
                  </button>
                </div>

                {/* Login Form (Email + Password) */}
                {loginMode === 'password' && (
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--color-text-primary)] mb-1.5">
                        Employee / Admin Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="you@neuramorphix.com"
                          required
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] text-sm focus:outline-none focus:border-[var(--color-saffron)] focus:ring-1 focus:ring-cyan-400 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[var(--color-text-primary)] mb-1.5">
                        Employee Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="Enter your admin password"
                          required
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl glass-input text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] text-sm focus:outline-none focus:border-[var(--color-saffron)] focus:ring-1 focus:ring-cyan-400 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoggingIn}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-[var(--color-text-primary)] font-black text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isLoggingIn ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-[var(--color-text-primary)]" />
                          <span>Authenticating Employee...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In as Employee</span>
                          <ArrowRight className="w-4 h-4 text-[var(--color-text-primary)]" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Login Form (Passcode only) */}
                {loginMode === 'passcode' && (
                  <form onSubmit={handlePasscodeLoginSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--color-text-primary)] mb-1.5">
                        Quick-Login Passcode
                      </label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          inputMode="numeric"
                          value={loginPasscode}
                          onChange={(e) => setLoginPasscode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          placeholder="6-digit passcode"
                          required
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] text-sm tracking-widest font-mono focus:outline-none focus:border-[var(--color-saffron)] focus:ring-1 focus:ring-cyan-400 transition-all"
                        />
                      </div>
                      <p className="mt-1.5 text-[11px] text-[var(--color-text-muted)]">No email needed — just the passcode sent to you.</p>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoggingIn}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-[var(--color-text-primary)] font-black text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isLoggingIn ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-[var(--color-text-primary)]" />
                          <span>Verifying Passcode...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In with Passcode</span>
                          <ArrowRight className="w-4 h-4 text-[var(--color-text-primary)]" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[var(--color-bg-paper)] text-[var(--color-text-primary)] py-8 px-4 sm:px-6 lg:px-8 border-t-4 border-[#1E1B24]">
      <div className="max-w-7xl mx-auto">

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-saffron)] text-[var(--color-saffron)] text-xs font-semibold shadow-2xl flex items-center gap-3 animate-fadeIn">
          <Sparkles className="w-4 h-4 text-[var(--color-saffron)] shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Admin Top Header */}
      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[var(--color-line)]">
        <img src="/images/tiger.png" alt="Tiger" className="absolute -right-2 -top-14 w-32 h-32 object-contain rounded-3xl border-[3px] border-[#14100b] bg-white shadow-[6px_6px_0_0_#14100b] rotate-6 hidden lg:block hover:rotate-0 transition-transform" />
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[var(--color-bg-dark)] text-[var(--color-saffron)] text-[10px] font-bold uppercase border border-[var(--color-saffron)]/30">
              Recruitment Team Portal
            </span>
            <span className="text-xs text-[var(--color-text-muted)]">Logged in: <strong className="text-[var(--color-text-primary)]">{adminUser}</strong></span>
          </div>
          <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] tracking-tight mt-1">
            NeuraMorphix <span className="glow-text">Recruitment Dashboard</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              DatabaseService.resetToDefaultSeed();
              refreshData();
              showToast('Reset database to default seed data.');
            }}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-[var(--color-bg-dark)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-dark)] border border-[var(--color-line)] flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Seed Data
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-rose-950/60 text-rose-300 hover:bg-rose-900 border border-rose-800 flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            Lock Portal
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-8 bg-[var(--color-bg-card)] p-1.5 rounded-2xl border border-[var(--color-line)]">
        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'bg-[var(--color-saffron)] text-[var(--color-text-primary)] shadow-md'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          <Sliders className="w-4 h-4" />
          Dashboard Metrics
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('applicants')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'applicants'
              ? 'bg-[var(--color-saffron)] text-[var(--color-text-primary)] shadow-md'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          <Users className="w-4 h-4" />
          Applicant Management ({applicants.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('email_settings')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'email_settings'
              ? 'bg-[var(--color-saffron)] text-[var(--color-text-primary)] shadow-md'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          <Mail className="w-4 h-4" />
          Email Notifications & Templates
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('config')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'config'
              ? 'bg-[var(--color-saffron)] text-[var(--color-text-primary)] shadow-md'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          <Settings className="w-4 h-4" />
          Recruitment Date Control
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('admins')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'admins'
              ? 'bg-[var(--color-saffron)] text-[var(--color-text-primary)] shadow-md'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          <Crown className="w-4 h-4" />
          Admin Management ({admins.length})
        </button>
      </div>

      {/* TAB 1: ANALYTICS & METRICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Metric Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-5 rounded-2xl glass-panel border-[var(--color-saffron)]/20">
              <div className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] mb-1">Total Applications</div>
              <div className="text-3xl font-black text-[var(--color-text-primary)]">{totalApps}</div>
              <div className="text-[11px] text-[var(--color-saffron)] mt-1 font-medium">Logged candidates</div>
            </div>

            <div className="p-5 rounded-2xl glass-panel border-amber-500/20">
              <div className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] mb-1">Pending Review</div>
              <div className="text-3xl font-black text-amber-300">{pendingApps}</div>
              <div className="text-[11px] text-amber-400/80 mt-1 font-medium">Awaiting evaluation</div>
            </div>

            <div className="p-5 rounded-2xl glass-panel border-blue-500/20">
              <div className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] mb-1">Shortlisted</div>
              <div className="text-3xl font-black text-blue-300">{shortlistedApps}</div>
              <div className="text-[11px] text-blue-400/80 mt-1 font-medium">Passed screening</div>
            </div>

            <div className="p-5 rounded-2xl glass-panel border-purple-500/20">
              <div className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] mb-1">Interview</div>
              <div className="text-3xl font-black text-purple-300">{interviewApps}</div>
              <div className="text-[11px] text-purple-400/80 mt-1 font-medium">Scheduled interaction</div>
            </div>

            <div className="p-5 rounded-2xl glass-panel border-emerald-500/20">
              <div className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] mb-1">Accepted</div>
              <div className="text-3xl font-black text-emerald-300">{acceptedApps}</div>
              <div className="text-[11px] text-emerald-400/80 mt-1 font-medium">Selected members</div>
            </div>

            <div className="p-5 rounded-2xl glass-panel border-rose-500/20">
              <div className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] mb-1">Declined</div>
              <div className="text-3xl font-black text-rose-300">{declinedApps}</div>
              <div className="text-[11px] text-rose-400/80 mt-1 font-medium">Not selected</div>
            </div>
          </div>

          {/* Role-Wise Statistics Breakdown for 10 Teams */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-6">
            <div>
              <h3 className="text-xl font-extrabold text-[var(--color-text-primary)]">Role-Wise Applicant Statistics</h3>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">Breakdown of applicant preference choices across all 10 NeuraMorphix recruitment teams.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roles.map((role) => {
                const count = getRoleApplicantCount(role.role_name);
                const percent = totalApps > 0 ? Math.round((count / (totalApps * 2)) * 100) : 0;
                return (
                  <div key={role.role_id} className="p-4 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-line)] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[var(--color-text-primary)]">{role.role_name}</span>
                      <span className="text-xs font-mono font-bold text-[var(--color-saffron)] bg-[var(--color-bg-dark)] px-2.5 py-1 rounded-lg border border-[var(--color-line)]">
                        {count} applicants
                      </span>
                    </div>

                    <div className="w-full bg-[var(--color-bg-dark)] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(5, percent * 2))}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: APPLICANT MANAGEMENT */}
      {activeTab === 'applicants' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Search & Filters */}
          <div className="glass-panel p-4 sm:p-6 rounded-2xl flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search applicants by name, ID, email, college, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl glass-input text-xs bg-[var(--color-bg-card)] text-[var(--color-text-primary)]"
              >
                <option value="ALL">All Statuses</option>
                <option value="Application Received">Application Received</option>
                <option value="Under Review">Under Review</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview">Interview</option>
                <option value="Information Requested">Information Requested</option>
                <option value="Information Received">Information Received</option>
                <option value="Accepted">Accepted</option>
                <option value="Declined">Declined</option>
              </select>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl glass-input text-xs bg-[var(--color-bg-card)] text-[var(--color-text-primary)]"
              >
                <option value="ALL">All Teams</option>
                {roles.map((r) => (
                  <option key={r.role_id} value={r.role_name}>
                    {r.role_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table of Applicants */}
          <div className="glass-panel rounded-2xl overflow-hidden border-[var(--color-line)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--color-bg-card)] text-[var(--color-text-muted)] uppercase font-semibold border-b border-[var(--color-line)]">
                  <tr>
                    <th className="px-6 py-4">Application ID & Name</th>
                    <th className="px-6 py-4">College & Dept</th>
                    <th className="px-6 py-4">First Preference</th>
                    <th className="px-6 py-4">Second Preference</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredApplicants.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-[var(--color-text-muted)]">
                        No applicants found matching the search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredApplicants.map((app) => (
                      <tr key={app.id} className="hover:bg-[var(--color-bg-dark)]/40 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-[var(--color-text-primary)] text-sm">{app.full_name}</div>
                          <div className="font-mono text-[var(--color-saffron)] font-semibold">{app.application_id}</div>
                          <div className="text-[11px] text-[var(--color-text-muted)]">{app.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-[var(--color-text-primary)] font-medium">{app.college}</div>
                          <div className="text-[11px] text-[var(--color-text-muted)]">{app.department} ({app.year})</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-[var(--color-saffron)]">{app.first_preference}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-amber-300">{app.second_preference}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-[11px] font-bold border inline-block ${
                              app.status === 'Accepted'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : app.status === 'Declined'
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                : app.status === 'Interview'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                : app.status === 'Information Requested'
                                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                                : 'bg-[var(--color-saffron)]/20 text-[var(--color-saffron)] border-[var(--color-saffron)]/40'
                            }`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedApplicant(app)}
                            className="px-3.5 py-1.5 rounded-lg bg-[var(--color-saffron)]/20 hover:bg-[var(--color-saffron)] text-[var(--color-saffron)] hover:text-[var(--color-text-primary)] font-bold border border-[var(--color-saffron)]/40 transition-all flex items-center gap-1 ml-auto"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Review
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* APPLICANT DETAIL MODAL */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 bg-[#241c13]/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel w-full max-w-4xl rounded-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto border-[var(--color-saffron)]/30">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[var(--color-line)]">
              <div>
                <span className="px-3 py-1 rounded-full bg-[var(--color-bg-dark)] text-[var(--color-saffron)] text-[10px] font-mono font-bold uppercase">
                  ID: {selectedApplicant.application_id}
                </span>
                <h2 className="text-2xl font-black text-[var(--color-text-primary)] mt-1">{selectedApplicant.full_name}</h2>
                <p className="text-xs text-[var(--color-text-muted)]">{selectedApplicant.college} • {selectedApplicant.department} ({selectedApplicant.year})</p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedApplicant(null)}
                className="p-2 rounded-lg bg-[var(--color-bg-dark)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              >
                ✕
              </button>
            </div>

            {/* Quick Action Bar */}
            <div className="p-4 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-line)] flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs font-semibold text-[var(--color-text-muted)]">
                Current Status: <span className="text-[var(--color-saffron)] font-bold">{selectedApplicant.status}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleShortlist(selectedApplicant)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-500/20 hover:bg-blue-500 text-blue-300 hover:text-[var(--color-text-primary)] border border-blue-500/40"
                >
                  SHORTLIST
                </button>

                <button
                  type="button"
                  onClick={() => setShowInterviewModal(true)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-[var(--color-text-primary)] border border-amber-500/40"
                >
                  REQUEST INTERVIEW
                </button>

                <button
                  type="button"
                  onClick={() => setShowReqInfoModal(true)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-500/20 hover:bg-purple-500 text-purple-300 hover:text-[var(--color-text-primary)] border border-purple-500/40"
                >
                  REQUEST INFO
                </button>

                <button
                  type="button"
                  onClick={() => setShowRoleAssignModal(true)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[var(--color-bg-dark)] hover:bg-[var(--color-bg-dark)] text-[var(--color-text-primary)] border border-[var(--color-line)]"
                >
                  CHANGE ROLE
                </button>

                <button
                  type="button"
                  onClick={() => setShowDeclineModal(true)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-[var(--color-text-primary)] border border-rose-500/40"
                >
                  DECLINE
                </button>

                <button
                  type="button"
                  onClick={() => setShowAcceptModal(true)}
                  className="px-4 py-1.5 rounded-lg text-xs font-black bg-emerald-500 hover:bg-emerald-400 text-[var(--color-text-primary)] shadow-md"
                >
                  ACCEPT APPLICANT
                </button>
              </div>
            </div>

            {/* Application Data Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-line)] space-y-2">
                  <h4 className="font-bold text-[var(--color-saffron)] uppercase text-[10px]">Contact Information</h4>
                  <div>Email: <strong className="text-[var(--color-text-primary)]">{selectedApplicant.email}</strong></div>
                  <div>Phone: <strong className="text-[var(--color-text-primary)]">{selectedApplicant.phone}</strong></div>
                  <div>Application Date: <strong className="text-[var(--color-text-primary)]">{new Date(selectedApplicant.created_at).toLocaleDateString()}</strong></div>
                </div>

                <div className="p-4 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-line)] space-y-2">
                  <h4 className="font-bold text-[var(--color-saffron)] uppercase text-[10px]">Role Preferences & Assigned Team</h4>
                  <div>🥇 First Choice: <strong className="text-[var(--color-saffron)]">{selectedApplicant.first_preference}</strong></div>
                  <div>🥈 Second Choice: <strong className="text-amber-300">{selectedApplicant.second_preference}</strong></div>
                  <div className="pt-2 border-t border-[var(--color-line)]">
                    Final Assigned Team: <strong className="text-emerald-400">{selectedApplicant.final_assigned_team || 'Not assigned yet'}</strong>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-line)] space-y-2">
                  <h4 className="font-bold text-[var(--color-saffron)] uppercase text-[10px]">Online Links</h4>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {selectedApplicant.github_url && (
                      <a href={selectedApplicant.github_url} target="_blank" rel="noreferrer" className="px-2.5 py-1 rounded bg-[var(--color-bg-dark)] text-[var(--color-saffron)] hover:underline flex items-center gap-1">
                        GitHub <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {selectedApplicant.linkedin_url && (
                      <a href={selectedApplicant.linkedin_url} target="_blank" rel="noreferrer" className="px-2.5 py-1 rounded bg-[var(--color-bg-dark)] text-blue-300 hover:underline flex items-center gap-1">
                        LinkedIn <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {selectedApplicant.portfolio_url && (
                      <a href={selectedApplicant.portfolio_url} target="_blank" rel="noreferrer" className="px-2.5 py-1 rounded bg-[var(--color-bg-dark)] text-purple-300 hover:underline flex items-center gap-1">
                        Portfolio <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {selectedApplicant.resume_url && (
                      <a href={selectedApplicant.resume_url} target="_blank" rel="noreferrer" className="px-2.5 py-1 rounded bg-[var(--color-bg-dark)] text-amber-300 hover:underline flex items-center gap-1">
                        Resume <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-line)] space-y-2">
                  <h4 className="font-bold text-[var(--color-saffron)] uppercase text-[10px]">Skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedApplicant.skills.map((s, i) => (
                      <span key={i} className="px-2.5 py-1 rounded bg-[var(--color-bg-dark)] text-[var(--color-text-primary)] border border-[var(--color-line)]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-line)] space-y-2">
                  <h4 className="font-bold text-[var(--color-saffron)] uppercase text-[10px]">Projects / Experience</h4>
                  <p className="text-[var(--color-text-muted)] leading-relaxed whitespace-pre-wrap">{selectedApplicant.experience}</p>
                </div>
              </div>
            </div>

            {/* Startup & Entrepreneurship Assessment (only present for that track) */}
            {selectedApplicant.startup_assessment && (
              <div className="p-4 rounded-xl bg-[var(--color-bg-dark)] border border-emerald-200 space-y-4">
                <h4 className="font-bold text-emerald-600 text-xs uppercase flex items-center gap-2">
                  <Rocket className="w-4 h-4 text-emerald-600" />
                  Startup & Entrepreneurship Assessment
                </h4>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                  {STARTUP_ASSESSMENT_SECTIONS.map((section) => (
                    <div key={section.id} className="space-y-2">
                      <div className="text-[10px] font-bold text-[var(--color-saffron)] uppercase tracking-wider">{section.title}</div>
                      {section.questions.map((q) => (
                        <div key={q.id} className="p-3 rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-line)] text-xs space-y-1">
                          <div className="font-semibold text-[var(--color-text-primary)]">{q.number}. {q.label}</div>
                          <div className="text-[var(--color-text-muted)] whitespace-pre-wrap">
                            {selectedApplicant.startup_assessment?.[q.id as keyof StartupAssessmentAnswers] || (
                              <span className="italic">Not answered</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Internal Admin Notes Thread */}
            <div className="p-4 rounded-xl bg-[var(--color-bg-dark)] border border-[var(--color-line)] space-y-3">
              <h4 className="font-bold text-[var(--color-text-primary)] text-xs uppercase flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[var(--color-saffron)]" />
                Internal Recruiter Notes ({selectedApplicant.admin_notes?.length || 0})
              </h4>

              <div className="space-y-2 max-h-36 overflow-y-auto">
                {selectedApplicant.admin_notes?.length === 0 ? (
                  <p className="text-xs text-[var(--color-text-muted)] italic">No internal notes added yet.</p>
                ) : (
                  selectedApplicant.admin_notes.map((note) => (
                    <div key={note.id} className="p-3 rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-line)] text-xs">
                      <div className="flex justify-between text-[10px] text-[var(--color-text-muted)] font-semibold mb-1">
                        <span>{note.author}</span>
                        <span>{new Date(note.created_at).toLocaleString()}</span>
                      </div>
                      <p className="text-[var(--color-text-primary)]">{note.text}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Type an internal review note..."
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl glass-input text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddNote}
                  className="px-4 py-2 rounded-xl bg-[var(--color-saffron)] text-[var(--color-text-primary)] text-xs font-bold"
                >
                  ADD NOTE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ACCEPT CONFIRMATION MODAL */}
      {showAcceptModal && selectedApplicant && (
        <div className="fixed inset-0 z-50 bg-[#241c13]/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 space-y-4 border-emerald-500/50">
            <h3 className="text-xl font-bold text-[var(--color-text-primary)]">Accept Applicant Confirmation</h3>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              Are you sure you want to accept <strong>{selectedApplicant.full_name}</strong> into NeuraMorphix?
            </p>
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs">
              This will update their status to <strong>Accepted</strong>, store acceptance metadata, and automatically trigger an acceptance notification email.
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowAcceptModal(false)}
                className="px-4 py-2 rounded-xl bg-[var(--color-bg-dark)] text-[var(--color-text-muted)] text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteAccept}
                className="px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[var(--color-text-primary)] text-xs font-bold"
              >
                CONFIRM ACCEPTANCE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DECLINE CONFIRMATION MODAL */}
      {showDeclineModal && selectedApplicant && (
        <div className="fixed inset-0 z-50 bg-[#241c13]/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 space-y-4 border-rose-500/50">
            <h3 className="text-xl font-bold text-[var(--color-text-primary)]">Decline Application Confirmation</h3>
            <p className="text-xs text-[var(--color-text-muted)]">
              Are you sure you want to decline the application for <strong>{selectedApplicant.full_name}</strong>?
            </p>

            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase mb-2">Select Decline Reason (Internal)</label>
              <select
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value as DeclineReasonCategory)}
                className="w-full p-2.5 rounded-xl glass-input text-xs bg-[var(--color-bg-card)] text-[var(--color-text-primary)]"
              >
                <option value="Role capacity reached">Role capacity reached</option>
                <option value="Skills mismatch">Skills mismatch</option>
                <option value="Application incomplete">Application incomplete</option>
                <option value="Selection criteria">Selection criteria</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase mb-1">Custom Note (Internal Only)</label>
              <textarea
                rows={2}
                placeholder="Optional internal note regarding decline decision..."
                value={declineNote}
                onChange={(e) => setDeclineNote(e.target.value)}
                className="w-full p-2 rounded-xl glass-input text-xs"
              />
            </div>

            <p className="text-[11px] text-[var(--color-text-muted)]">
              Note: The applicant will receive a polite email notification. Internal notes will <strong>NOT</strong> be exposed to the applicant.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeclineModal(false)}
                className="px-4 py-2 rounded-xl bg-[var(--color-bg-dark)] text-[var(--color-text-muted)] text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteDecline}
                className="px-6 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-[var(--color-text-primary)] text-xs font-bold"
              >
                DECLINE APPLICATION
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REQUEST INFO MODAL */}
      {showReqInfoModal && selectedApplicant && (
        <div className="fixed inset-0 z-50 bg-[#241c13]/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 space-y-4 border-purple-500/50">
            <h3 className="text-xl font-bold text-[var(--color-text-primary)]">Request Additional Information</h3>
            <p className="text-xs text-[var(--color-text-muted)]">
              Enter the specific information or code repository needed from <strong>{selectedApplicant.full_name}</strong>:
            </p>

            <textarea
              rows={3}
              value={reqInfoQuestion}
              onChange={(e) => setReqInfoQuestion(e.target.value)}
              className="w-full p-3 rounded-xl glass-input text-xs"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowReqInfoModal(false)}
                className="px-4 py-2 rounded-xl bg-[var(--color-bg-dark)] text-[var(--color-text-muted)] text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteRequestInfo}
                className="px-6 py-2 rounded-xl bg-purple-500 text-[var(--color-text-primary)] text-xs font-bold"
              >
                SEND REQUEST EMAIL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REQUEST INTERVIEW MODAL */}
      {showInterviewModal && selectedApplicant && (
        <div className="fixed inset-0 z-50 bg-[#241c13]/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 space-y-4 border-amber-500/50">
            <h3 className="text-xl font-bold text-[var(--color-text-primary)]">Request Interview</h3>
            <p className="text-xs text-[var(--color-text-muted)]">
              Enter interview slot details / Google Meet link for <strong>{selectedApplicant.full_name}</strong>:
            </p>

            <textarea
              rows={3}
              value={interviewDetailsInput}
              onChange={(e) => setInterviewDetailsInput(e.target.value)}
              className="w-full p-3 rounded-xl glass-input text-xs"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowInterviewModal(false)}
                className="px-4 py-2 rounded-xl bg-[var(--color-bg-dark)] text-[var(--color-text-muted)] text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteRequestInterview}
                className="px-6 py-2 rounded-xl bg-amber-500 text-[var(--color-text-primary)] text-xs font-bold"
              >
                SEND INTERVIEW INVITATION
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ROLE ALLOCATION MODAL */}
      {showRoleAssignModal && selectedApplicant && (
        <div className="fixed inset-0 z-50 bg-[#241c13]/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 space-y-4 border-[var(--color-saffron)]/50">
            <h3 className="text-xl font-bold text-[var(--color-text-primary)]">Role Allocation / Final Team</h3>
            <p className="text-xs text-[var(--color-text-muted)]">
              Assign a final team independently of the applicant's preferences.
            </p>

            <div className="text-xs text-[var(--color-text-muted)] space-y-1">
              <div>🥇 1st Choice: <span className="text-[var(--color-saffron)]">{selectedApplicant.first_preference}</span></div>
              <div>🥈 2nd Choice: <span className="text-amber-300">{selectedApplicant.second_preference}</span></div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase mb-2">Select Final Team Assignment</label>
              <select
                value={assignedRoleChoice || selectedApplicant.first_preference}
                onChange={(e) => setAssignedRoleChoice(e.target.value)}
                className="w-full p-2.5 rounded-xl glass-input text-xs bg-[var(--color-bg-card)] text-[var(--color-text-primary)]"
              >
                {roles.map((r) => (
                  <option key={r.role_id} value={r.role_name}>
                    {r.role_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowRoleAssignModal(false)}
                className="px-4 py-2 rounded-xl bg-[var(--color-bg-dark)] text-[var(--color-text-muted)] text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAssignFinalTeam}
                className="px-6 py-2 rounded-xl bg-[var(--color-saffron)] text-[var(--color-text-primary)] text-xs font-bold"
              >
                SAVE ROLE ASSIGNMENT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EMAIL NOTIFICATIONS & TEMPLATE EDITOR */}
      {activeTab === 'email_settings' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Toggles */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2">
              <Mail className="w-5 h-5 text-[var(--color-saffron)]" />
              Automated Email Event Triggers
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <label className="p-4 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-line)] flex items-center justify-between cursor-pointer">
                <span>☑ Application received email</span>
                <input
                  type="checkbox"
                  checked={emailSettings.enable_application_received}
                  onChange={() => handleToggleEmailSetting('enable_application_received')}
                  className="w-4 h-4 rounded text-[var(--color-saffron)]"
                />
              </label>

              <label className="p-4 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-line)] flex items-center justify-between cursor-pointer">
                <span>☑ Shortlist email</span>
                <input
                  type="checkbox"
                  checked={emailSettings.enable_shortlist}
                  onChange={() => handleToggleEmailSetting('enable_shortlist')}
                  className="w-4 h-4 rounded text-[var(--color-saffron)]"
                />
              </label>

              <label className="p-4 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-line)] flex items-center justify-between cursor-pointer">
                <span>☑ Interview email</span>
                <input
                  type="checkbox"
                  checked={emailSettings.enable_interview}
                  onChange={() => handleToggleEmailSetting('enable_interview')}
                  className="w-4 h-4 rounded text-[var(--color-saffron)]"
                />
              </label>

              <label className="p-4 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-line)] flex items-center justify-between cursor-pointer">
                <span>☑ Information request email</span>
                <input
                  type="checkbox"
                  checked={emailSettings.enable_info_requested}
                  onChange={() => handleToggleEmailSetting('enable_info_requested')}
                  className="w-4 h-4 rounded text-[var(--color-saffron)]"
                />
              </label>

              <label className="p-4 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-line)] flex items-center justify-between cursor-pointer">
                <span>☑ Acceptance email</span>
                <input
                  type="checkbox"
                  checked={emailSettings.enable_acceptance}
                  onChange={() => handleToggleEmailSetting('enable_acceptance')}
                  className="w-4 h-4 rounded text-[var(--color-saffron)]"
                />
              </label>

              <label className="p-4 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-line)] flex items-center justify-between cursor-pointer">
                <span>☑ Decline email</span>
                <input
                  type="checkbox"
                  checked={emailSettings.enable_decline}
                  onChange={() => handleToggleEmailSetting('enable_decline')}
                  className="w-4 h-4 rounded text-[var(--color-saffron)]"
                />
              </label>
            </div>
          </div>

          {/* Template Editor */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-line)] pb-4">
              <div>
                <h3 className="text-xl font-bold text-[var(--color-text-primary)]">Email Template Editor</h3>
                <p className="text-xs text-[var(--color-text-muted)]">Customize the subject and content for automated notification emails.</p>
              </div>

              <select
                value={editingTemplateType}
                onChange={(e) => setEditingTemplateType(e.target.value as EmailType)}
                className="px-4 py-2 rounded-xl glass-input text-xs bg-[var(--color-bg-card)] text-[var(--color-saffron)] font-bold"
              >
                <option value="application_received">Application Received Email</option>
                <option value="shortlisted">Shortlisted Email</option>
                <option value="interview">Interview Invitation Email</option>
                <option value="info_requested">Information Request Email</option>
                <option value="accepted">Acceptance Email</option>
                <option value="declined">Decline Email</option>
              </select>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase mb-2">Subject Line</label>
                <input
                  type="text"
                  value={templateSubject}
                  onChange={(e) => setTemplateSubject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase mb-2">Body Template (Markdown/Text)</label>
                <textarea
                  rows={10}
                  value={templateBody}
                  onChange={(e) => setTemplateBody(e.target.value)}
                  className="w-full p-4 rounded-xl glass-input text-xs font-mono leading-relaxed"
                />
              </div>

              <div className="p-3 rounded-xl bg-[var(--color-bg-dark)] border border-[var(--color-line)] text-[11px] text-[var(--color-text-muted)]">
                Available Placeholders: <code>{`{{name}}`}</code>, <code>{`{{application_id}}`}</code>, <code>{`{{first_preference}}`}</code>, <code>{`{{second_preference}}`}</code>, <code>{`{{final_assigned_team}}`}</code>, <code>{`{{requested_info_question}}`}</code>, <code>{`{{interview_details}}`}</code>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleSaveEmailTemplate}
                  className="px-6 py-2.5 rounded-xl bg-[var(--color-saffron)] hover:bg-[var(--color-saffron-hover)] text-[var(--color-text-primary)] text-xs font-bold shadow-lg"
                >
                  SAVE EMAIL TEMPLATE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RECRUITMENT CONFIGURATION & DEADLINE CONTROL */}
      {activeTab === 'config' && (
        <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[var(--color-saffron)]" />
              Recruitment Period & Deadline Control
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Configure recruitment opening and closing dates or manually override window state.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase mb-2">Start Date</label>
              <input
                type="date"
                value={config.start_date}
                onChange={(e) => handleSaveConfig({ ...config, start_date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase mb-2">End Date (Deadline)</label>
              <input
                type="date"
                value={config.end_date}
                onChange={(e) => handleSaveConfig({ ...config, end_date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-line)] space-y-3">
            <h4 className="font-bold text-xs text-[var(--color-text-primary)] uppercase">Manual Override Options</h4>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => handleSaveConfig({ ...config, is_manually_open: true })}
                className={`px-4 py-2 rounded-xl text-xs font-bold ${
                  config.is_manually_open === true
                    ? 'bg-emerald-500 text-[var(--color-text-primary)] ring-2 ring-emerald-400'
                    : 'bg-[var(--color-bg-dark)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-dark)]'
                }`}
              >
                FORCE OPEN RECRUITMENT
              </button>

              <button
                type="button"
                onClick={() => handleSaveConfig({ ...config, is_manually_open: false })}
                className={`px-4 py-2 rounded-xl text-xs font-bold ${
                  config.is_manually_open === false
                    ? 'bg-rose-500 text-[var(--color-text-primary)] ring-2 ring-rose-400'
                    : 'bg-[var(--color-bg-dark)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-dark)]'
                }`}
              >
                FORCE CLOSE RECRUITMENT
              </button>

              <button
                type="button"
                onClick={() => handleSaveConfig({ ...config, is_manually_open: null })}
                className={`px-4 py-2 rounded-xl text-xs font-bold ${
                  config.is_manually_open === null
                    ? 'bg-[var(--color-saffron)] text-[var(--color-text-primary)] ring-2 ring-cyan-400'
                    : 'bg-[var(--color-bg-dark)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-dark)]'
                }`}
              >
                USE AUTOMATIC DATES
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ADMIN MANAGEMENT */}
      {activeTab === 'admins' && (
        <div className="space-y-6 animate-fadeIn">
          {newAdminCredentials && (
            <div className="glass-panel p-6 rounded-2xl border border-emerald-500/40 space-y-4 relative">
              <button
                type="button"
                onClick={() => setNewAdminCredentials(null)}
                className="absolute top-4 right-4 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              >
                Dismiss
              </button>
              <h4 className="font-bold text-emerald-400 flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                {newAdminCredentials.name} was added
                {newAdminCredentials.emailSent ? ' — invite email sent' : ' — but the invite email failed to send'}
              </h4>
              <p className="text-xs text-[var(--color-text-muted)]">
                {newAdminCredentials.emailSent
                  ? 'These credentials were also emailed to them. Shown here once in case you want to share them directly.'
                  : 'Share these credentials with them manually since the email failed.'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-line)]">
                  <div className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold mb-1">Email</div>
                  <div className="font-mono text-[var(--color-text-primary)] break-all">{newAdminCredentials.email}</div>
                </div>
                <div className="p-3 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-line)] flex items-center justify-between gap-2">
                  <div>
                    <div className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold mb-1">Temp Password</div>
                    <div className="font-mono text-[var(--color-text-primary)]">{newAdminCredentials.tempPassword}</div>
                  </div>
                  <button type="button" onClick={() => navigator.clipboard?.writeText(newAdminCredentials.tempPassword)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="p-3 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-line)] flex items-center justify-between gap-2">
                  <div>
                    <div className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold mb-1">Passcode</div>
                    <div className="font-mono text-[var(--color-text-primary)]">{newAdminCredentials.passcode}</div>
                  </div>
                  <button type="button" onClick={() => navigator.clipboard?.writeText(newAdminCredentials.passcode)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-6">
            <div>
              <h3 className="text-xl font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[var(--color-saffron)]" />
                Invite a New Admin
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                They'll be emailed a temporary password and a quick-login passcode.
              </p>
            </div>

            {inviteError && (
              <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-200 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{inviteError}</span>
              </div>
            )}

            <form onSubmit={handleInviteAdmin} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase mb-2">Full Name</label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  required
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase mb-2">Email Address</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase mb-2">Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as AdminUser['role'])}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-xs cursor-pointer"
                >
                  <option value="Admin">Admin</option>
                  <option value="Lead Recruiter">Lead Recruiter</option>
                  <option value="Technical Reviewer">Technical Reviewer</option>
                </select>
              </div>
              <div className="sm:col-span-3 flex justify-end">
                <button
                  type="submit"
                  disabled={isInviting}
                  className="px-6 py-2.5 rounded-xl bg-[var(--color-saffron)] text-[var(--color-text-primary)] text-xs font-bold flex items-center gap-2 disabled:opacity-60"
                >
                  {isInviting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
                  {isInviting ? 'Inviting...' : 'Invite Admin'}
                </button>
              </div>
            </form>
          </div>

          <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-4">
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] flex items-center gap-2">
              <Crown className="w-5 h-5 text-[var(--color-saffron)]" />
              Current Admins ({admins.length})
            </h3>
            <div className="space-y-2">
              {admins.map((a) => (
                <div
                  key={a.admin_id}
                  className="p-4 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-line)] flex flex-wrap items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-[var(--color-text-primary)]">{a.name}</div>
                    <div className="text-[var(--color-text-muted)]">{a.email}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-2.5 py-1 rounded-lg bg-[var(--color-bg-dark)] border border-[var(--color-line)] text-[var(--color-text-muted)] font-bold">
                      {a.role}
                    </span>
                    {a.invited_by && (
                      <span className="text-[var(--color-text-muted)]">Invited by {a.invited_by}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
  );
};
