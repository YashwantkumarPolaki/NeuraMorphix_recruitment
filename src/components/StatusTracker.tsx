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
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="neo-badge bg-[#FFD93D] text-[#1E1B24] mb-4">
          <Clock className="w-3.5 h-3.5 mr-1" />
          LIVE APPLICATION TRACKER
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-outfit font-black text-[#1E1B24] tracking-tight">
          Track Your <span className="text-[#3E9FFF]">Application Stage</span>
        </h2>
        <p className="font-rubik text-sm text-[#5C5866] mt-2 font-medium">
          Enter your Application ID below to view your recruitment status in real-time.
        </p>
      </div>

      {/* Search Form Card */}
      <div className="bg-white border-[3px] border-[#1E1B24] p-6 sm:p-8 rounded-3xl shadow-[6px_6px_0_#1E1B24] mb-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-end gap-4">
          <div className="flex-1 w-full">
            <label className="block text-xs font-outfit font-black text-[#1E1B24] uppercase mb-2">
              Application ID <span className="text-[#FF4B4B]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. NM-2026-91823"
              value={appIdInput}
              onChange={(e) => setAppIdInput(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-[2px] border-[#1E1B24] bg-white font-mono text-sm font-bold uppercase tracking-wider shadow-[2px_2px_0_#1E1B24] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-rubik font-bold bg-[#3E9FFF] text-white border-[3px] border-[#1E1B24] shadow-[4px_4px_0_#1E1B24] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#1E1B24] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_#1E1B24] transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 uppercase"
          >
            <Search className="w-4 h-4" />
            Track Status
          </button>
        </form>
      </div>

      {notFound && (
        <div className="p-6 bg-[#FF4B4B] text-white border-[3px] border-[#1E1B24] rounded-2xl shadow-[6px_6px_0_#1E1B24] text-center space-y-2">
          <AlertCircle className="w-8 h-8 mx-auto" />
          <h3 className="text-xl font-outfit font-black">Application Not Found</h3>
          <p className="font-rubik text-sm font-medium">
            No application record matches <span className="font-mono underline">{appIdInput}</span>. Please verify your Application ID.
          </p>
        </div>
      )}

      {/* APPLICANT DETAILS & TIMELINE */}
      {searchedApplicant && (
        <div className="bg-white border-[3px] border-[#1E1B24] p-6 sm:p-8 rounded-3xl shadow-[6px_6px_0_#1E1B24] space-y-8">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-[3px] border-[#1E1B24]">
            <div>
              <div className="text-xs font-outfit font-black text-[#3E9FFF] uppercase">Official Application ID</div>
              <h3 className="text-3xl font-mono font-black text-[#1E1B24]">{searchedApplicant.application_id}</h3>
              <p className="font-rubik text-sm text-[#5C5866] font-bold mt-1">
                Candidate: <span className="text-[#1E1B24]">{searchedApplicant.full_name}</span> ({searchedApplicant.college})
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`neo-badge text-xs border-[2px] border-[#1E1B24] ${
                  searchedApplicant.status === 'Accepted'
                    ? 'bg-[#4EC37B] text-white'
                    : searchedApplicant.status === 'Declined'
                    ? 'bg-[#FF4B4B] text-white'
                    : searchedApplicant.status === 'Interview'
                    ? 'bg-[#FFD93D] text-[#1E1B24]'
                    : 'bg-[#3E9FFF] text-white'
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
            <h4 className="text-xs font-outfit font-black uppercase tracking-wider text-[#1E1B24] mb-6">Application Progress</h4>
            {searchedApplicant.status === 'Declined' ? (
              <div className="p-4 rounded-2xl bg-[#FF4B4B] text-white border-[2px] border-[#1E1B24] text-sm flex items-center gap-3">
                <UserX className="w-6 h-6 shrink-0" />
                <div>
                  <div className="font-outfit font-black">Status: Application Declined</div>
                  <div className="font-rubik text-xs mt-0.5 font-medium">
                    Thank you for applying. Unfortunately, your application was not selected for this recruitment cycle.
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative py-4">
                <div className="absolute top-1/2 left-0 right-0 h-2 bg-[#FAF7EE] border-[1px] border-[#1E1B24] -translate-y-1/2 rounded-full -z-0"></div>
                <div
                  className="absolute top-1/2 left-0 h-2 bg-[#3E9FFF] border-[1px] border-[#1E1B24] -translate-y-1/2 rounded-full transition-all duration-500 -z-0"
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
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-outfit font-black text-xs border-[2px] border-[#1E1B24] transition-all ${
                            isCompleted
                              ? 'bg-[#4EC37B] text-white shadow-[2px_2px_0_#1E1B24]'
                              : 'bg-white text-[#5C5866]'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-5 h-5 stroke-[3]" /> : idx + 1}
                        </div>
                        <span
                          className={`text-xs font-rubik mt-2 ${
                            isCurrent ? 'text-[#3E9FFF] font-black' : isCompleted ? 'text-[#1E1B24] font-bold' : 'text-[#5C5866] font-medium'
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
            <div className="p-6 bg-[#4EC37B] text-white border-[3px] border-[#1E1B24] rounded-2xl shadow-[6px_6px_0_#1E1B24] flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-white text-[#1E1B24] border-[2px] border-[#1E1B24] shadow-[2px_2px_0_#1E1B24]">
                <Award className="w-8 h-8 text-[#4EC37B]" />
              </div>
              <div>
                <div className="text-xs font-outfit font-black uppercase tracking-wider text-white">Selected into Team</div>
                <div className="text-2xl font-outfit font-black">
                  {searchedApplicant.final_assigned_team || searchedApplicant.first_preference}
                </div>
                <p className="font-rubik text-xs mt-1 font-medium">
                  Congratulations! Onboarding details will be communicated via email shortly.
                </p>
              </div>
            </div>
          )}

          {/* INFORMATION REQUESTED BOX */}
          {(searchedApplicant.status === 'Information Requested' || searchedApplicant.requested_info_question) && (
            <div className="p-6 bg-[#FAF7EE] border-[3px] border-[#1E1B24] rounded-2xl shadow-[4px_4px_0_#1E1B24] space-y-4">
              <div className="flex items-center gap-3">
                <FileQuestion className="w-6 h-6 text-[#3E9FFF]" />
                <div>
                  <h4 className="font-outfit font-black text-lg text-[#1E1B24]">Additional Information Requested</h4>
                  <p className="font-rubik text-xs text-[#5C5866] font-bold mt-0.5">
                    {searchedApplicant.requested_info_question}
                  </p>
                </div>
              </div>

              {searchedApplicant.requested_info_response ? (
                <div className="p-4 bg-white border-[2px] border-[#1E1B24] rounded-xl text-xs font-rubik">
                  <span className="text-[#5C5866] font-bold block mb-1">Your Submitted Response:</span>
                  <p className="text-[#1E1B24] font-medium">{searchedApplicant.requested_info_response}</p>
                  <span className="inline-block mt-2 text-[10px] text-[#4EC37B] font-extrabold uppercase">✓ Status: Information Received</span>
                </div>
              ) : (
                <form onSubmit={handleInfoReplySubmit} className="space-y-3">
                  <textarea
                    required
                    rows={3}
                    placeholder="Type your response here..."
                    value={infoReplyInput}
                    onChange={(e) => setInfoReplyInput(e.target.value)}
                    className="w-full p-3 rounded-xl border-[2px] border-[#1E1B24] bg-white font-rubik text-xs shadow-[2px_2px_0_#1E1B24]"
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingReply || !infoReplyInput.trim()}
                    className="px-5 py-2.5 rounded-xl bg-[#3E9FFF] text-white font-rubik font-bold text-xs border-[2px] border-[#1E1B24] shadow-[2px_2px_0_#1E1B24] flex items-center gap-2 cursor-pointer uppercase"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Submit Requested Response
                  </button>
                </form>
              )}

              {replySuccessMsg && (
                <div className="p-3 bg-[#4EC37B] text-white font-rubik font-bold text-xs rounded-xl border-[2px] border-[#1E1B24]">
                  {replySuccessMsg}
                </div>
              )}
            </div>
          )}

          {/* INTERVIEW DETAILS BOX */}
          {searchedApplicant.interview_details && (
            <div className="p-5 bg-[#FFD93D] border-[3px] border-[#1E1B24] rounded-2xl shadow-[4px_4px_0_#1E1B24] text-xs font-rubik space-y-1">
              <div className="font-outfit font-black text-sm flex items-center gap-2 text-[#1E1B24]">
                <Sparkles className="w-4 h-4" />
                Interview Schedule
              </div>
              <p className="text-[#1E1B24] font-bold whitespace-pre-wrap">{searchedApplicant.interview_details}</p>
            </div>
          )}

          {/* Preferences Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t-[2px] border-dashed border-[#1E1B24]">
            <div className="p-4 rounded-xl bg-[#FAF7EE] border-[2px] border-[#1E1B24]">
              <span className="text-[#5C5866] font-bold block mb-1">🥇 1st Choice Preference</span>
              <span className="text-base font-outfit font-black text-[#FF4B4B]">{searchedApplicant.first_preference}</span>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF7EE] border-[2px] border-[#1E1B24]">
              <span className="text-[#5C5866] font-bold block mb-1">🥈 2nd Choice Preference</span>
              <span className="text-base font-outfit font-black text-[#3E9FFF]">{searchedApplicant.second_preference}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
