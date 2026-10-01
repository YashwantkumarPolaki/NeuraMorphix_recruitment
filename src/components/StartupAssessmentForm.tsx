import React, { useState } from 'react';
import type { Applicant, Role, StartupAssessmentAnswers } from '../types/recruitment';
import { DatabaseService } from '../services/db';
import { EmailService } from '../services/email';
import { BackendApiService } from '../services/api';
import { STARTUP_ASSESSMENT_SECTIONS, STARTUP_ASSESSMENT_TOTAL_STEPS } from '../data/startupAssessmentQuestions';
import { WhatsAppIcon } from './WhatsAppIcon';
import confetti from 'canvas-confetti';

import {
  Rocket,
  User,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  XCircle,
  Pencil,
  ShieldQuestion,
  Camera,
} from 'lucide-react';

const WHATSAPP_GROUP_URL = 'https://chat.whatsapp.com/LMDhxAl2TLR31hNTeKUG7E';

interface StartupAssessmentFormProps {
  firstChoice: string;
  secondChoice: string | null;
  roles: Role[];
  onChangePreferences: () => void;
  onApplicationSubmitted: (applicant: Applicant) => void;
  onTrackStatusDirectly?: (appId: string) => void;
}

type PersonalDetails = {
  fullName: string;
  email: string;
  phone: string;
  college: string;
  registrationNumber: string;
  courseAndBranch: string;
  year: string;
  linkedinUrl: string;
  githubPortfolioUrl: string;
  instagramUrl: string;
};

const EMPTY_PERSONAL: PersonalDetails = {
  fullName: '',
  email: '',
  phone: '',
  college: 'SRM Institute of Science and Technology, Kattankulathur',
  registrationNumber: '',
  courseAndBranch: '',
  year: '2nd Year',
  linkedinUrl: '',
  githubPortfolioUrl: '',
  instagramUrl: '',
};

const EMPTY_ANSWERS: StartupAssessmentAnswers = {
  linkedin_url: '',
  github_portfolio_url: '',
  instagram_url: '',
  why_join_neuramorphix: '',
  why_startup_environment: '',
  why_hire_you: '',
  what_contribute: '',
  startup_attraction: '',
  incomplete_instructions: '',
  idea_rejected: '',
  project_fails: '',
  unassigned_problem: '',
  important_quality: '',
  unknown_task: '',
  teammate_struggling: '',
  ownership_meaning: '',
  new_initiative_first_step: '',
  leadership_approach: '',
  disagree_with_senior: '',
  little_market_info: '',
  negative_feedback: '',
  limited_resources_priority: '',
  two_ideas_investigate: '',
  missed_deadline: '',
  founding_team_reason: '',
  improve_or_build: '',
  first_three_steps: '',
  real_world_problem: '',
  first_idea_failed: '',
  comfort_with_uncertainty: '',
  willing_to_commit: '',
  completion_sentence: '',
};

type Step = 'eligibility' | 'ineligible' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 'review' | 'submitted';

export const StartupAssessmentForm: React.FC<StartupAssessmentFormProps> = ({
  firstChoice,
  secondChoice,
  onChangePreferences,
  onApplicationSubmitted,
  onTrackStatusDirectly,
}) => {
  const [step, setStep] = useState<Step>('eligibility');
  const [personal, setPersonal] = useState<PersonalDetails>(EMPTY_PERSONAL);
  const [answers, setAnswers] = useState<StartupAssessmentAnswers>(EMPTY_ANSWERS);
  const [confirmed, setConfirmed] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedApplicant, setSubmittedApplicant] = useState<Applicant | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const phoneDigits = personal.phone.replace(/\D/g, '');
  const isPhoneValid = phoneDigits.length === 10;
  const phoneHasInput = personal.phone.trim().length > 0;

  const setAnswer = (id: keyof StartupAssessmentAnswers, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const currentSection = typeof step === 'number' ? STARTUP_ASSESSMENT_SECTIONS.find((s) => s.step === step) : undefined;

  const validatePersonalDetails = (): string | null => {
    if (
      !personal.fullName.trim() ||
      !personal.email.trim() ||
      !personal.phone.trim() ||
      !personal.college.trim() ||
      !personal.registrationNumber.trim() ||
      !personal.courseAndBranch.trim() ||
      !personal.linkedinUrl.trim() ||
      !personal.githubPortfolioUrl.trim() ||
      !personal.instagramUrl.trim()
    ) {
      return 'Please fill in all required personal detail fields.';
    }
    if (!isPhoneValid) {
      return 'Please enter a valid 10-digit phone number.';
    }
    return null;
  };

  const handleNext = () => {
    setErrorMsg(null);

    const windowCheck = DatabaseService.isRecruitmentOpen();
    if (!windowCheck.isOpen) {
      setErrorMsg(windowCheck.message);
      return;
    }

    if (step === 1) {
      const err = validatePersonalDetails();
      if (err) {
        setErrorMsg(err);
        return;
      }
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (currentSection) {
      const missing = currentSection.questions.some(
        (q) => !answers[q.id as keyof StartupAssessmentAnswers]?.trim()
      );
      if (missing) {
        setErrorMsg('Please answer all required questions before continuing.');
        return;
      }
      if (currentSection.step === STARTUP_ASSESSMENT_TOTAL_STEPS) {
        setStep('review');
      } else {
        setStep(((currentSection.step + 1) as Step));
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setErrorMsg(null);
    if (step === 'review') {
      setStep(STARTUP_ASSESSMENT_TOTAL_STEPS as Step);
    } else if (typeof step === 'number' && step > 1) {
      setStep((step - 1) as Step);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    setErrorMsg(null);
    if (!confirmed) {
      setErrorMsg('Please confirm your application submission.');
      return;
    }

    const windowCheck = DatabaseService.isRecruitmentOpen();
    if (!windowCheck.isOpen) {
      setErrorMsg(windowCheck.message);
      return;
    }

    setIsSubmitting(true);

    try {
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      const appId = `NM-2026-${randomNum}`;

      const finalAnswers: StartupAssessmentAnswers = {
        ...answers,
        linkedin_url: personal.linkedinUrl.trim(),
        github_portfolio_url: personal.githubPortfolioUrl.trim(),
        instagram_url: personal.instagramUrl.trim(),
      };

      const newApplicant: Applicant = {
        id: `app-${Date.now()}`,
        application_id: appId,
        full_name: personal.fullName.trim(),
        email: personal.email.trim(),
        phone: personal.phone.trim(),
        college: personal.college.trim(),
        registration_number: personal.registrationNumber.trim(),
        department: personal.courseAndBranch.trim(),
        year: personal.year,
        skills: [],
        experience: finalAnswers.why_hire_you,
        first_preference: firstChoice,
        second_preference: secondChoice || 'None (Optional)',
        final_assigned_team: null,
        status: 'Application Received',
        resume_url: '',
        github_url: '',
        linkedin_url: personal.linkedinUrl.trim(),
        portfolio_url: personal.githubPortfolioUrl.trim(),
        instagram_url: personal.instagramUrl.trim(),
        admin_notes: [],
        decline_reason: null,
        decline_note: null,
        requested_info_question: null,
        requested_info_response: null,
        interview_details: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        reviewed_at: null,
        accepted_at: null,
        declined_at: null,
        startup_assessment: finalAnswers,
      };

      DatabaseService.addApplicant(newApplicant);
      BackendApiService.syncApplicant(newApplicant);

      await EmailService.sendEmail('application_received', newApplicant);

      try {
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.6 },
        });
      } catch (e) {
        console.log('Confetti triggered', e);
      }

      setSubmittedApplicant(newApplicant);
      setStep('submitted');
      onApplicationSubmitted(newApplicant);
    } catch (err) {
      console.error('Submission error:', err);
      setErrorMsg('An error occurred during submission. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressLabel =
    step === 'review'
      ? 'Review & Submit'
      : step === 'submitted'
      ? 'Complete'
      : step === 'eligibility' || step === 'ineligible'
      ? 'Eligibility Check'
      : `Startup Assessment — ${step} of ${STARTUP_ASSESSMENT_TOTAL_STEPS}`;

  const showChrome = step !== 'submitted' && step !== 'eligibility' && step !== 'ineligible';

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
      {/* PROGRESS HEADER */}
      <div className="mb-8 cyber-card p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-mono font-bold text-sm shrink-0">
            {step === 'submitted' ? '✓' : step === 'review' ? 'R' : step === 'eligibility' || step === 'ineligible' ? '?' : step}
          </div>
          <div>
            <div className="text-[10px] font-display font-extrabold text-emerald-600 uppercase tracking-widest">
              {progressLabel}
            </div>
            <div className="text-base font-display font-bold text-[var(--color-text-primary)]">
              {step === 'eligibility' && 'Startup Track Eligibility'}
              {step === 'ineligible' && 'Not Open This Cycle'}
              {step === 1 && 'Personal Details'}
              {typeof step === 'number' && step > 1 && currentSection?.title}
              {step === 'review' && 'Review Your Answers'}
              {step === 'submitted' && 'Application Received! 🎉'}
            </div>
          </div>
        </div>

        {showChrome && (
          <button
            type="button"
            onClick={onChangePreferences}
            className="text-xs font-body font-bold text-[var(--color-text-muted)] bg-[var(--color-line)] border border-[var(--color-line)] hover:bg-slate-200 hover:text-[var(--color-text-primary)] px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Change Roles
          </button>
        )}
      </div>

      {/* PROGRESS BAR */}
      {showChrome && (
        <div className="mb-8 flex items-center gap-1.5">
          {Array.from({ length: STARTUP_ASSESSMENT_TOTAL_STEPS }, (_, i) => i + 1).map((n) => (
            <div
              key={n}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                (typeof step === 'number' && n <= step) || step === 'review'
                  ? 'bg-emerald-500'
                  : 'bg-[var(--color-line)]'
              }`}
            />
          ))}
        </div>
      )}

      {/* ERROR DISPLAY */}
      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 font-body font-bold text-sm flex items-center gap-3 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ELIGIBILITY GATE */}
      {step === 'eligibility' && (
        <div className="cyber-card p-8 sm:p-10 text-center space-y-6">
          <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
            <ShieldQuestion className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-[var(--color-text-primary)]">
            This opportunity is open to 2nd year students only.
          </h2>
          <p className="font-body text-sm text-[var(--color-text-muted)] max-w-md mx-auto leading-relaxed">
            Are you a 2nd year student?
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 cyber-btn-primary text-xs py-3.5 px-8 bg-gradient-to-br from-emerald-500 to-emerald-700"
            >
              <span>YES — CONTINUE TO ASSESSMENT</span>
            </button>
            <button
              type="button"
              onClick={() => setStep('ineligible')}
              className="flex-1 px-6 py-3.5 rounded-xl bg-[var(--color-line)] text-[var(--color-text-muted)] border border-[var(--color-line)] hover:bg-slate-200 hover:text-[var(--color-text-primary)] font-body font-bold text-xs uppercase cursor-pointer"
            >
              NO
            </button>
          </div>
        </div>
      )}

      {/* INELIGIBLE MESSAGE */}
      {step === 'ineligible' && (
        <div className="cyber-card p-8 sm:p-10 text-center space-y-6">
          <div className="w-14 h-14 rounded-full bg-[var(--color-bg-dark)] border border-[var(--color-line)] text-[var(--color-text-muted)] flex items-center justify-center mx-auto">
            <Camera className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-[var(--color-text-primary)]">
            Thank you for your interest.
          </h2>
          <p className="font-body text-sm text-[var(--color-text-muted)] max-w-md mx-auto leading-relaxed">
            This founding team position is currently open for 2nd year students only. Watch our Instagram for future opportunities.
            <br />
            <span className="font-bold text-[var(--color-text-primary)]">@neuramorphix 🔬</span>
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={onChangePreferences}
              className="px-8 py-3.5 rounded-xl bg-[var(--color-line)] text-[var(--color-text-muted)] border border-[var(--color-line)] hover:bg-slate-200 hover:text-[var(--color-text-primary)] font-body font-bold text-xs uppercase cursor-pointer"
            >
              ← Back to Roles
            </button>
          </div>
        </div>
      )}

      {/* STEP 1: PERSONAL DETAILS */}
      {step === 1 && (
        <div className="cyber-card p-6 sm:p-8 space-y-6">
          <div className="border-b border-[var(--color-line)] pb-4">
            <h2 className="text-2xl font-display font-bold text-[var(--color-text-primary)] flex items-center gap-2">
              <User className="w-6 h-6 text-emerald-600" />
              Personal & Academic Details
            </h2>
            <p className="font-body text-sm text-[var(--color-text-muted)]">Enter your official contact and student details below.</p>
          </div>

          {/* Preferences Banner */}
          <div className="p-4 bg-[var(--color-bg-dark)] border border-[var(--color-line)] text-[var(--color-text-primary)] rounded-2xl flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-display font-bold text-[var(--color-text-muted)]">🥇 1st Choice:</span>
              <span className="cyber-badge bg-emerald-50 border-emerald-200 text-emerald-700 text-xs">{firstChoice}</span>
            </div>
            {secondChoice && secondChoice !== 'None (Optional)' && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-display font-bold text-[var(--color-text-muted)]">🥈 2nd Choice:</span>
                <span className="cyber-badge bg-emerald-50 border-emerald-200 text-emerald-700 text-xs">{secondChoice}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-display font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Aarav Sharma"
                value={personal.fullName}
                onChange={(e) => setPersonal({ ...personal, fullName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm text-[var(--color-text-primary)]"
              />
            </div>

            <div>
              <label className="block text-xs font-display font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="e.g. aarav@srmist.edu.in"
                value={personal.email}
                onChange={(e) => setPersonal({ ...personal, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm text-[var(--color-text-primary)]"
              />
            </div>

            <div>
              <label className="block text-xs font-display font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
                Phone Number (10 digits) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="e.g. 9876543210"
                  value={personal.phone}
                  onChange={(e) => setPersonal({ ...personal, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm text-[var(--color-text-primary)]"
                />
                {phoneHasInput && (
                  <div className="absolute right-3 top-3.5">
                    {isPhoneValid ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-500" />
                    )}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-display font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
                College / University <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={personal.college}
                disabled
                className="w-full px-4 py-3 rounded-xl glass-input text-sm text-[var(--color-text-primary)] opacity-70 cursor-not-allowed"
              />
              <p className="mt-1.5 text-[11px] text-[var(--color-text-muted)]">This track is open to SRMIST Kattankulathur students only.</p>
            </div>

            <div>
              <label className="block text-xs font-display font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
                Registration Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="RA25XXXXXXXXXX"
                value={personal.registrationNumber}
                onChange={(e) => setPersonal({ ...personal, registrationNumber: e.target.value.toUpperCase() })}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm text-[var(--color-text-primary)] uppercase placeholder:normal-case"
              />
            </div>

            <div>
              <label className="block text-xs font-display font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
                Course & Branch <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. B.Tech Computer Science"
                value={personal.courseAndBranch}
                onChange={(e) => setPersonal({ ...personal, courseAndBranch: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm text-[var(--color-text-primary)]"
              />
            </div>

            <div>
              <label className="block text-xs font-display font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
                Year of Study <span className="text-rose-500">*</span>
              </label>
              <select
                value={personal.year}
                disabled
                className="w-full px-4 py-3 rounded-xl glass-input text-sm text-[var(--color-text-primary)] opacity-70 cursor-not-allowed"
              >
                <option value="2nd Year">2nd Year</option>
              </select>
              <p className="mt-1.5 text-[11px] text-[var(--color-text-muted)]">This track is open to 2nd year students only.</p>
            </div>

            <div>
              <label className="block text-xs font-display font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
                LinkedIn Profile URL <span className="text-rose-500">*</span>
              </label>
              <input
                type="url"
                required
                placeholder="https://linkedin.com/in/username"
                value={personal.linkedinUrl}
                onChange={(e) => setPersonal({ ...personal, linkedinUrl: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm text-[var(--color-text-primary)]"
              />
            </div>

            <div>
              <label className="block text-xs font-display font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
                GitHub / Portfolio URL <span className="text-rose-500">*</span>
              </label>
              <input
                type="url"
                required
                placeholder="https://github.com/username or portfolio link"
                value={personal.githubPortfolioUrl}
                onChange={(e) => setPersonal({ ...personal, githubPortfolioUrl: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm text-[var(--color-text-primary)]"
              />
            </div>

            <div>
              <label className="block text-xs font-display font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
                Instagram Profile URL <span className="text-rose-500">*</span>
              </label>
              <input
                type="url"
                required
                placeholder="https://instagram.com/username"
                value={personal.instagramUrl}
                onChange={(e) => setPersonal({ ...personal, instagramUrl: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm text-[var(--color-text-primary)]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="button" onClick={handleNext} className="cyber-btn-primary text-xs py-3.5 px-8 bg-gradient-to-br from-emerald-500 to-emerald-700">
              <span>NEXT: STARTUP MOTIVATION →</span>
            </button>
          </div>
        </div>
      )}

      {/* STEPS 2-7: GENERIC SECTIONS */}
      {typeof step === 'number' && step > 1 && currentSection && (
        <div className="cyber-card p-6 sm:p-8 space-y-8">
          <div className="border-b border-[var(--color-line)] pb-4">
            <h2 className="text-2xl font-display font-bold text-[var(--color-text-primary)] flex items-center gap-2">
              <Rocket className="w-6 h-6 text-emerald-600" />
              {currentSection.title}
            </h2>
            <p className="font-body text-sm text-[var(--color-text-muted)]">{currentSection.subtitle}</p>
          </div>

          {currentSection.questions.map((q) => (
            <div key={q.id} className="space-y-3">
              <label className="block text-sm font-display font-bold text-[var(--color-text-primary)] leading-snug">
                {q.number}. {q.label} <span className="text-rose-500">*</span>
              </label>

              {q.type === 'mcq' && q.options && (
                <div className="grid grid-cols-1 gap-2">
                  {q.options.map((opt) => {
                    const isSelected = answers[q.id as keyof StartupAssessmentAnswers] === opt.text;
                    return (
                      <label
                        key={opt.letter}
                        className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-400 shadow-xs'
                            : 'bg-[var(--color-bg-dark)] border-[var(--color-line)] hover:border-emerald-200'
                        }`}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          checked={isSelected}
                          onChange={() => setAnswer(q.id as keyof StartupAssessmentAnswers, opt.text)}
                          className="mt-0.5 w-4 h-4 accent-emerald-600 cursor-pointer shrink-0"
                        />
                        <span className="font-body text-sm text-[var(--color-text-primary)]">
                          <strong className="text-emerald-700">{opt.letter}.</strong> {opt.text}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}

              {(q.type === 'long' || q.type === 'short') && (
                <textarea
                  required
                  rows={q.type === 'long' ? 4 : 2}
                  placeholder="Type your answer..."
                  value={answers[q.id as keyof StartupAssessmentAnswers]}
                  onChange={(e) => setAnswer(q.id as keyof StartupAssessmentAnswers, e.target.value)}
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm text-[var(--color-text-primary)]"
                />
              )}
            </div>
          ))}

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-3 rounded-xl bg-[var(--color-line)] text-[var(--color-text-muted)] border border-[var(--color-line)] hover:bg-slate-200 hover:text-[var(--color-text-primary)] font-body font-bold text-xs uppercase cursor-pointer"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="cyber-btn-primary text-xs py-3.5 px-8 bg-gradient-to-br from-emerald-500 to-emerald-700"
            >
              <span>{currentSection.step === STARTUP_ASSESSMENT_TOTAL_STEPS ? 'REVIEW ANSWERS →' : 'NEXT SECTION →'}</span>
            </button>
          </div>
        </div>
      )}

      {/* REVIEW & SUBMIT */}
      {step === 'review' && (
        <div className="cyber-card p-6 sm:p-8 space-y-6">
          <div className="border-b border-[var(--color-line)] pb-4">
            <h2 className="text-2xl font-display font-bold text-[var(--color-text-primary)] flex items-center gap-2">
              <FileCheck className="w-6 h-6 text-emerald-600" />
              Review Your Answers
            </h2>
            <p className="font-body text-sm text-[var(--color-text-muted)]">Verify everything before submitting your assessment.</p>
          </div>

          {/* Personal Details Summary */}
          <div className="bg-[var(--color-bg-dark)] text-[var(--color-text-primary)] p-5 rounded-2xl border border-[var(--color-line)] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-display font-bold text-emerald-600 uppercase tracking-wider">Personal Details</h3>
              <button type="button" onClick={() => setStep(1)} className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 cursor-pointer hover:underline">
                <Pencil className="w-3 h-3" /> Edit
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-body">
              <div><strong>Name:</strong> {personal.fullName}</div>
              <div><strong>Email:</strong> {personal.email}</div>
              <div><strong>Phone:</strong> {personal.phone}</div>
              <div><strong>College:</strong> {personal.college}</div>
              <div><strong>Registration Number:</strong> {personal.registrationNumber}</div>
              <div><strong>Course & Branch:</strong> {personal.courseAndBranch}</div>
              <div><strong>Year:</strong> {personal.year}</div>
              {personal.linkedinUrl && <div><strong>LinkedIn:</strong> {personal.linkedinUrl}</div>}
              {personal.githubPortfolioUrl && <div><strong>GitHub/Portfolio:</strong> {personal.githubPortfolioUrl}</div>}
              {personal.instagramUrl && <div><strong>Instagram:</strong> {personal.instagramUrl}</div>}
            </div>
          </div>

          {/* Section Summaries */}
          {STARTUP_ASSESSMENT_SECTIONS.map((section) => (
            <div key={section.id} className="bg-[var(--color-bg-dark)] text-[var(--color-text-primary)] p-5 rounded-2xl border border-[var(--color-line)] space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-display font-bold text-emerald-600 uppercase tracking-wider">{section.title}</h3>
                <button
                  type="button"
                  onClick={() => setStep(section.step as Step)}
                  className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 cursor-pointer hover:underline"
                >
                  <Pencil className="w-3 h-3" /> Edit
                </button>
              </div>
              <div className="space-y-3">
                {section.questions.map((q) => (
                  <div key={q.id} className="text-xs font-body">
                    <div className="font-bold text-[var(--color-text-primary)]">{q.number}. {q.label}</div>
                    <div className="text-[var(--color-text-muted)] mt-0.5 whitespace-pre-wrap">
                      {answers[q.id as keyof StartupAssessmentAnswers] || <span className="italic">Not answered</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <label className="flex items-start gap-3 p-4 bg-[var(--color-bg-dark)] border border-[var(--color-line)] text-[var(--color-text-primary)] rounded-2xl cursor-pointer">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-0.5 w-5 h-5 accent-emerald-600 cursor-pointer"
            />
            <span className="font-body text-xs sm:text-sm text-[var(--color-text-muted)]">
              I confirm that all information and answers provided above are accurate and true to the best of my knowledge.
            </span>
          </label>

          <div className="flex justify-between pt-2">
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-3 rounded-xl bg-[var(--color-line)] text-[var(--color-text-muted)] border border-[var(--color-line)] hover:bg-slate-200 hover:text-[var(--color-text-primary)] font-body font-bold text-xs uppercase cursor-pointer"
            >
              ← Back to Edit
            </button>
            <button
              type="button"
              disabled={isSubmitting || !confirmed}
              onClick={handleSubmit}
              className={`px-10 py-3.5 rounded-xl font-body font-bold text-xs transition-all uppercase tracking-wider cursor-pointer ${
                confirmed && !isSubmitting
                  ? 'cyber-btn-primary bg-gradient-to-br from-emerald-500 to-emerald-700'
                  : 'bg-[var(--color-line)] text-slate-400 border border-[var(--color-line)] cursor-not-allowed opacity-50'
              }`}
            >
              {isSubmitting ? 'Submitting Assessment...' : 'SUBMIT ASSESSMENT 🚀'}
            </button>
          </div>
        </div>
      )}

      {/* SUBMITTED CONFIRMATION */}
      {step === 'submitted' && submittedApplicant && (
        <div className="cyber-card p-8 text-center space-y-6 relative overflow-visible">
          <div className="w-16 h-16 rounded-full bg-emerald-400 border-[3px] border-[#14100b] text-white flex items-center justify-center mx-auto shadow-[4px_4px_0_0_#14100b]">
            <CheckCircle2 className="w-8 h-8 stroke-[3]" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-display font-black text-[var(--color-text-primary)]">
            Application received.
          </h2>

          <p className="font-body text-sm text-[var(--color-text-muted)] max-w-lg mx-auto leading-relaxed">
            Thank you for taking the time to complete the Startup & Entrepreneurship assessment. Our team will review your application and contact you regarding the next steps.
          </p>

          {/* APPLICATION ID CARD */}
          <div className="max-w-md mx-auto p-6 bg-[#FDE047] border-[3px] border-[#14100b] rounded-2xl shadow-[6px_6px_0_0_#14100b] relative z-10">
            <div className="text-[10px] font-display font-black text-[#14100b] uppercase tracking-widest mb-1">
              Your Official Application ID
            </div>
            <div className="font-mono text-3xl font-black text-[#14100b] tracking-wider my-2">
              {submittedApplicant.application_id}
            </div>
            <div className="text-xs font-body font-bold text-[#14100b]">
              Please save this ID to track your application stage!
            </div>
          </div>

          {/* WHATSAPP GROUP CTA */}
          <a
            href={WHATSAPP_GROUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="max-w-md mx-auto flex items-center justify-center gap-3 p-4 bg-[#25D366] text-white border-[3px] border-[#14100b] rounded-2xl shadow-[4px_4px_0_0_#14100b] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#14100b] transition-all"
          >
            <WhatsAppIcon className="w-6 h-6 shrink-0" />
            <span className="font-display font-bold text-sm uppercase tracking-wide">
              Join Our WhatsApp Group for Further Information
            </span>
          </a>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            {onTrackStatusDirectly && (
              <button
                type="button"
                onClick={() => onTrackStatusDirectly(submittedApplicant.application_id)}
                className="px-8 py-3.5 rounded-xl bg-emerald-500 text-white border-[3px] border-[#14100b] shadow-[4px_4px_0_0_#14100b] text-xs font-bold uppercase hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#14100b] transition-all"
              >
                <span>TRACK LIVE STATUS →</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
