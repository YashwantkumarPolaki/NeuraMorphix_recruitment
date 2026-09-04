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

  // Response field for Information Requested status
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
      setReplySuccessMsg('Thank you! Your requested information has been submitted to the recruitment team.');
      setInfoReplyInput('');
    }

    setIsSubmittingReply(false);
  };

  // Timeline Stepper Order
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
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase mb-4">
          <Clock className="w-3.5 h-3.5" />
          Real-Time Application Status
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Track Your <span className="glow-text">Recruitment Progress</span>
        </h2>
        <p className="text-slate-300 text-sm mt-2">
          Enter your Application ID to view your live evaluation status, interview updates, or respond to recruitment queries.
        </p>
      </div>

      {/* Search Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl mb-8 border-cyan-500/20">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-end gap-4">
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">
              Application ID <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. NM-2026-91823"
              value={appIdInput}
              onChange={(e) => setAppIdInput(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass-input text-sm font-mono uppercase tracking-wider"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer shrink-0"
          >
            <Search className="w-4 h-4" />
            CHECK APPLICATION STATUS
          </button>
        </form>
      </div>

      {notFound && (
        <div className="p-6 rounded-2xl glass-panel border-rose-500/30 text-center space-y-2 animate-fadeIn">
          <AlertCircle className="w-8 h-8 text-rose-400 mx-auto mb-2" />
          <h3 className="text-lg font-bold text-white">Application Not Found</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            No recruitment record matches Application ID <span className="font-mono text-white">{appIdInput}</span>. Please verify your Application ID.
          </p>
        </div>
      )}

      {/* APPLICANT DETAILS & TIMELINE */}
      {searchedApplicant && (
        <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-8 animate-fadeIn">
          {/* Top Bar with ID and Status Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="text-xs text-slate-400 uppercase font-semibold">Application ID</div>
              <h3 className="text-2xl font-black font-mono text-cyan-300">{searchedApplicant.application_id}</h3>
              <p className="text-xs text-slate-400 mt-1">Applicant: <strong className="text-white">{searchedApplicant.full_name}</strong> ({searchedApplicant.college})</p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border shadow-lg ${
                  searchedApplicant.status === 'Accepted'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                    : searchedApplicant.status === 'Declined'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                    : searchedApplicant.status === 'Interview'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : searchedApplicant.status === 'Information Requested'
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                    : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                }`}
              >
                {searchedApplicant.status === 'Accepted' && <UserCheck className="w-4 h-4" />}
                {searchedApplicant.status === 'Declined' && <UserX className="w-4 h-4" />}
                {searchedApplicant.status === 'Information Requested' && <FileQuestion className="w-4 h-4" />}
                Status: {searchedApplicant.status}
              </span>
            </div>
          </div>

          {/* VISUAL PROGRESS TIMELINE */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">Visual Application Timeline</h4>
            {searchedApplicant.status === 'Declined' ? (
              <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-sm flex items-center gap-3">
                <UserX className="w-6 h-6 text-rose-400 shrink-0" />
                <div>
                  <div className="font-bold">Application Status: Declined</div>
                  <div className="text-xs text-rose-300 mt-0.5">
                    Thank you for applying for the NeuraMorphix 2026 cycle. Unfortunately, your application was not selected for this recruitment period.
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative py-4">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 rounded-full -z-0"></div>
                <div
                  className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-cyan-500 to-emerald-400 -translate-y-1/2 rounded-full transition-all duration-500 -z-0"
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
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                            isCompleted
                              ? 'bg-cyan-500 text-slate-950 ring-4 ring-cyan-500/20 shadow-lg shadow-cyan-500/30'
                              : 'bg-slate-800 text-slate-500 border border-slate-700'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-5 h-5 stroke-[3]" /> : idx + 1}
                        </div>
                        <span
                          className={`text-[11px] font-semibold mt-2.5 ${
                            isCurrent ? 'text-cyan-300 font-extrabold' : isCompleted ? 'text-slate-200' : 'text-slate-500'
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

          {/* ACCEPTED FINAL ASSIGNED TEAM BANNER */}
          {searchedApplicant.status === 'Accepted' && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-cyan-950/80 border border-emerald-500/50 shadow-2xl flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Accepted into Team</div>
                <div className="text-xl font-black text-white">
                  {searchedApplicant.final_assigned_team || searchedApplicant.first_preference}
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Congratulations! Onboarding details will be communicated via email shortly.
                </p>
              </div>
            </div>
          )}

          {/* INFORMATION REQUESTED ACTION BOX */}
          {(searchedApplicant.status === 'Information Requested' || searchedApplicant.requested_info_question) && (
            <div className="p-6 rounded-2xl bg-purple-950/80 border border-purple-500/50 space-y-4">
              <div className="flex items-center gap-3">
                <FileQuestion className="w-6 h-6 text-purple-400" />
                <div>
                  <h4 className="text-sm font-bold text-white">Additional Information Requested by Recruiter</h4>
                  <p className="text-xs text-purple-200 mt-0.5">
                    {searchedApplicant.requested_info_question}
                  </p>
                </div>
              </div>

              {searchedApplicant.requested_info_response ? (
                <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-xs">
                  <span className="text-slate-400 block font-semibold mb-1">Your Submitted Response:</span>
                  <p className="text-slate-200 whitespace-pre-wrap">{searchedApplicant.requested_info_response}</p>
                  <span className="inline-block mt-2 text-[10px] text-emerald-400 font-bold uppercase">✓ Status: Information Received</span>
                </div>
              ) : (
                <form onSubmit={handleInfoReplySubmit} className="space-y-3">
                  <textarea
                    required
                    rows={3}
                    placeholder="Type your response here (e.g. GitHub link, portfolio details, or clarifications)..."
                    value={infoReplyInput}
                    onChange={(e) => setInfoReplyInput(e.target.value)}
                    className="w-full p-3 rounded-xl glass-input text-xs"
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingReply || !infoReplyInput.trim()}
                    className="px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-lg"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Submit Requested Information
                  </button>
                </form>
              )}

              {replySuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-950 text-emerald-300 text-xs font-medium">
                  {replySuccessMsg}
                </div>
              )}
            </div>
          )}

          {/* INTERVIEW DETAILS BOX */}
          {searchedApplicant.interview_details && (
            <div className="p-5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs space-y-1">
              <div className="font-bold flex items-center gap-2 text-amber-300">
                <Sparkles className="w-4 h-4" />
                Interview Information
              </div>
              <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{searchedApplicant.interview_details}</p>
            </div>
          )}

          {/* Application Summary Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t border-slate-800">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block font-semibold mb-1">🥇 First Preference</span>
              <span className="text-sm font-bold text-cyan-300">{searchedApplicant.first_preference}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block font-semibold mb-1">🥈 Second Preference</span>
              <span className="text-sm font-bold text-amber-300">{searchedApplicant.second_preference}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
