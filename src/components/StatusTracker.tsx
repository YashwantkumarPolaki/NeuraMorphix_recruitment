import React, { useState, useEffect } from 'react';
import type { Applicant, ApplicationStatus } from '../types/recruitment';
import { DatabaseService } from '../services/db';
import {
  Search,
  CheckCircle2,
  Clock,
  Send,
  AlertCircle,
  FileQuestion,
  UserCheck,
  UserX,
  Award,
  Sparkles,
} from 'lucide-react';

interface StatusTrackerProps {
  initialAppId?: string | null;
}

export const StatusTracker: React.FC<StatusTrackerProps> = ({ initialAppId }) => {
  const [appIdInput, setAppIdInput] = useState(initialAppId || '');
  const [searchedApplicant, setSearchedApplicant] = useState<Applicant | null>(() => {
    return initialAppId ? DatabaseService.getApplicantById(initialAppId) || null : null;
  });
  const [notFound, setNotFound] = useState(false);

  const [infoReplyInput, setInfoReplyInput] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [replySuccessMsg, setReplySuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialAppId) {
      const found = DatabaseService.getApplicantById(initialAppId);
      if (found) {
        setAppIdInput(initialAppId);
        setSearchedApplicant(found);
        setNotFound(false);
      }
    }
  }, [initialAppId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setNotFound(false);
    setReplySuccessMsg(null);

    const found = DatabaseService.getApplicantById(appIdInput);
    if (found) {
      setSearchedApplicant(found);
    } else {
      setSearchedApplicant(null);
      setNotFound(true);
    }
  };

  const handleInfoReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchedApplicant || !infoReplyInput.trim()) return;

    setIsSubmittingReply(true);

    const updated = DatabaseService.updateApplicant(searchedApplicant.id, {
      requested_info_response: infoReplyInput.trim(),
      status: 'Information Received',
    });

    if (updated) {
      setSearchedApplicant(updated);
      setReplySuccessMsg('Thank you! Your response has been submitted to the recruitment team.');
      setInfoReplyInput('');
    }

    setIsSubmittingReply(false);
  };

  const TIMELINE_STEPS: { status: ApplicationStatus; label: string }[] = [
    { status: 'Application Received', label: 'Received' },
    { status: 'Under Review', label: 'Under Review' },
    { status: 'Shortlisted', label: 'Shortlisted' },
    { status: 'Interview', label: 'Interview' },
    { status: 'Accepted', label: 'Accepted' },
  ];

  const getStepIndex = (status: ApplicationStatus) => {
    switch (status) {
      case 'Application Received':
        return 0;
      case 'Under Review':
        return 1;
      case 'Shortlisted':
        return 2;
      case 'Interview':
        return 3;
      case 'Information Requested':
      case 'Information Received':
        return 1;
      case 'Accepted':
        return 4;
      case 'Declined':
        return -1;
      default:
        return 0;
    }
  };

  const currentStepIdx = searchedApplicant ? getStepIndex(searchedApplicant.status) : 0;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 relative z-10">
        <img src="/images/detective_monkey.png" alt="Detective Monkey" className="absolute -left-12 -top-12 w-40 h-40 object-contain rounded-3xl border-[3px] border-[#14100b] bg-white shadow-[6px_6px_0_0_#14100b] -rotate-12 hidden md:block hover:rotate-0 transition-transform" />
        <div className="cyber-badge bg-[var(--color-saffron)]/10 border-[var(--color-saffron)]/20 text-[var(--color-saffron)] mb-4">
          <Clock className="w-3.5 h-3.5 text-[var(--color-saffron)]" />
          <span>LIVE APPLICATION TRACKER</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-[var(--color-text-primary)] tracking-tight">
          Track Your <span className="gradient-text-blue">Application Stage</span>
        </h2>
        <p className="font-body text-sm text-[var(--color-text-muted)] mt-2 leading-relaxed">
          Enter your Application ID below to view your recruitment status in real-time.
        </p>
      </div>

      {/* Search Form Card */}
      <div className="cyber-card p-6 sm:p-8 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-end gap-4">
          <div className="flex-1 w-full">
            <label className="block text-xs font-display font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
              Application ID <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. NM-2026-91823"
              value={appIdInput}
              onChange={(e) => setAppIdInput(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass-input font-mono text-sm font-bold uppercase tracking-wider text-[var(--color-text-primary)]"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto cyber-btn-primary text-xs py-3.5 px-8 uppercase shrink-0"
          >
            <Search className="w-4 h-4" />
            <span>TRACK STATUS</span>
          </button>
        </form>
      </div>

      {notFound && (
        <div className="p-6 bg-rose-50 text-rose-800 border border-rose-200 rounded-2xl shadow-xs text-center space-y-2">
          <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
          <h3 className="text-xl font-display font-bold text-[var(--color-text-primary)]">Application Not Found</h3>
          <p className="font-body text-sm text-[var(--color-text-muted)]">
            No application record matches <span className="font-mono text-rose-700 underline font-bold">{appIdInput}</span>. Please check your Application ID.
          </p>
        </div>
      )}

      {/* APPLICANT DETAILS & TIMELINE */}
      {searchedApplicant && (
        <div className="cyber-card p-6 sm:p-8 space-y-8">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--color-line)]">
            <div>
              <div className="text-[10px] font-display font-bold text-[var(--color-saffron)] uppercase tracking-widest">Official Application ID</div>
              <h3 className="text-3xl font-mono font-black text-[var(--color-text-primary)]">{searchedApplicant.application_id}</h3>
              <p className="font-body text-sm text-[var(--color-text-muted)] mt-1">
                Candidate: <span className="text-[var(--color-text-primary)] font-bold">{searchedApplicant.full_name}</span> ({searchedApplicant.college})
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`cyber-badge text-xs border-[2px] shadow-[2px_2px_0_0_#14100b] ${
                  searchedApplicant.status === 'Accepted'
                    ? 'bg-emerald-50 border-[#14100b] text-emerald-700'
                    : searchedApplicant.status === 'Declined'
                    ? 'bg-rose-50 border-[#14100b] text-rose-700'
                    : searchedApplicant.status === 'Interview'
                    ? 'bg-amber-50 border-[#14100b] text-amber-800'
                    : 'bg-blue-400 border-[#14100b] text-[#14100b]'
                }`}
              >
                {searchedApplicant.status === 'Accepted' && <UserCheck className="w-3.5 h-3.5 mr-1" />}
                {searchedApplicant.status === 'Declined' && <UserX className="w-3.5 h-3.5 mr-1" />}
                {searchedApplicant.status === 'Information Requested' && <FileQuestion className="w-3.5 h-3.5 mr-1" />}
                Status: {searchedApplicant.status}
              </span>
            </div>
          </div>

          {/* VISUAL TIMELINE */}
          <div>
            <h4 className="text-xs font-display font-bold uppercase tracking-wider text-slate-500 mb-6">Application Progress</h4>
            {searchedApplicant.status === 'Declined' ? (
              <div className="p-4 rounded-2xl bg-rose-50 text-rose-800 border border-rose-200 text-sm flex items-center gap-3">
                <UserX className="w-6 h-6 text-rose-600 shrink-0" />
                <div>
                  <div className="font-display font-bold text-[var(--color-text-primary)]">Status: Application Declined</div>
                  <div className="font-body text-xs mt-0.5 text-[var(--color-text-muted)]">
                    Thank you for applying. Unfortunately, your application was not selected for this recruitment cycle.
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative py-4">
                <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-[var(--color-line)] border border-[var(--color-line)] -translate-y-1/2 rounded-full -z-0"></div>
                <div
                  className="absolute top-1/2 left-0 h-1.5 bg-[var(--color-saffron)] -translate-y-1/2 rounded-full transition-all duration-500 shadow-xs -z-0"
                  style={{
                    width: `${(Math.max(0, currentStepIdx) / (TIMELINE_STEPS.length - 1)) * 100}%`,
                  }}
                ></div>

                <div className="grid grid-cols-5 gap-2 relative z-10 text-center">
                  {TIMELINE_STEPS.map((stepItem, idx) => {
                    const isCompleted = idx <= currentStepIdx;
                    const isCurrent = idx === currentStepIdx;
                    return (
                      <div key={idx} className="flex flex-col items-center">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-mono font-bold text-xs border-[2px] transition-all ${
                            isCompleted
                              ? 'bg-emerald-400 text-white border-[#14100b] shadow-[2px_2px_0_0_#14100b]'
                              : 'bg-white text-slate-400 border-[#14100b]'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-4 h-4 stroke-[3]" /> : idx + 1}
                        </div>
                        <span
                          className={`text-xs font-body mt-2 ${
                            isCurrent ? 'text-blue-600 font-bold' : isCompleted ? 'text-[var(--color-text-primary)] font-medium' : 'text-slate-400'
                          }`}
                        >
                          {stepItem.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ACCEPTED BANNER */}
          {searchedApplicant.status === 'Accepted' && (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl shadow-xs flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-white border border-emerald-200 text-emerald-600">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <div className="text-[10px] font-display font-extrabold uppercase tracking-wider text-emerald-700">Selected into Team</div>
                <div className="text-2xl font-display font-bold text-[var(--color-text-primary)]">
                  {searchedApplicant.final_assigned_team || searchedApplicant.first_preference}
                </div>
                <p className="font-body text-xs mt-1 text-[var(--color-text-muted)]">
                  Congratulations! Onboarding details will be communicated via email shortly.
                </p>
              </div>
            </div>
          )}

          {/* INFORMATION REQUESTED BOX */}
          {(searchedApplicant.status === 'Information Requested' || searchedApplicant.requested_info_question) && (
            <div className="p-6 bg-[var(--color-bg-dark)] border border-[var(--color-line)] text-[var(--color-text-primary)] rounded-2xl space-y-4">
              <div className="flex items-center gap-3">
                <FileQuestion className="w-6 h-6 text-[var(--color-saffron)]" />
                <div>
                  <h4 className="font-display font-bold text-lg text-[var(--color-text-primary)]">Additional Information Requested</h4>
                  <p className="font-body text-xs text-[var(--color-text-muted)] mt-0.5">
                    {searchedApplicant.requested_info_question}
                  </p>
                </div>
              </div>

              {searchedApplicant.requested_info_response ? (
                <div className="p-4 bg-white border border-[var(--color-line)] rounded-xl text-xs font-body">
                  <span className="text-slate-500 block mb-1">Your Submitted Response:</span>
                  <p className="text-[var(--color-text-primary)] font-medium">{searchedApplicant.requested_info_response}</p>
                  <span className="inline-block mt-2 text-[10px] text-emerald-700 font-extrabold uppercase">✓ Status: Information Received</span>
                </div>
              ) : (
                <form onSubmit={handleInfoReplySubmit} className="space-y-3">
                  <textarea
                    required
                    rows={3}
                    placeholder="Type your response here..."
                    value={infoReplyInput}
                    onChange={(e) => setInfoReplyInput(e.target.value)}
                    className="w-full p-3 rounded-xl glass-input text-xs text-[var(--color-text-primary)]"
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingReply || !infoReplyInput.trim()}
                    className="cyber-btn-primary text-xs py-2.5 px-6 uppercase flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Requested Response</span>
                  </button>
                </form>
              )}

              {replySuccessMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-800 font-body font-bold text-xs rounded-xl border border-emerald-200">
                  {replySuccessMsg}
                </div>
              )}
            </div>
          )}

          {/* INTERVIEW DETAILS BOX */}
          {searchedApplicant.interview_details && (
            <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl text-xs font-body space-y-1">
              <div className="font-display font-bold text-sm flex items-center gap-2 text-amber-800">
                <Sparkles className="w-4 h-4" />
                Interview Schedule
              </div>
              <p className="text-[var(--color-text-muted)] whitespace-pre-wrap">{searchedApplicant.interview_details}</p>
            </div>
          )}

          {/* Preferences Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t-2 border-dashed border-slate-300 mt-6">
            <div className="p-4 rounded-xl bg-[#FDFBF4] border-[2px] border-[#14100b] shadow-[3px_3px_0_0_#14100b]">
              <span className="text-[var(--color-text-muted)] font-bold block mb-1">🥇 1st Choice Preference</span>
              <span className="text-base font-display font-bold text-red-500">{searchedApplicant.first_preference}</span>
            </div>

            <div className="p-4 rounded-xl bg-[#FDFBF4] border-[2px] border-[#14100b] shadow-[3px_3px_0_0_#14100b]">
              <span className="text-[var(--color-text-muted)] font-bold block mb-1">🥈 2nd Choice Preference</span>
              <span className="text-base font-display font-bold text-blue-500">{searchedApplicant.second_preference}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


