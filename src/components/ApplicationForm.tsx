import React, { useState } from 'react';
import type { Applicant, Role } from '../types/recruitment';
import { DatabaseService } from '../services/db';
import { EmailService } from '../services/email';
import confetti from 'canvas-confetti';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Code,
  FileCheck,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Search,
} from 'lucide-react';

interface ApplicationFormProps {
  firstChoice: string;
  secondChoice: string | null;
  roles: Role[];
  onChangePreferences: () => void;
  onApplicationSubmitted: (applicant: Applicant) => void;
  onTrackStatusDirectly?: (appId: string) => void;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({
  firstChoice,
  secondChoice,
  roles,
  onChangePreferences,
  onApplicationSubmitted,
  onTrackStatusDirectly,
}) => {
  const [step, setStep] = useState<'details' | 'skills_experience' | 'review' | 'submitted'>('details');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('3rd Year');
  const [resumeUrl, setResumeUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');

  // Skills & Experience
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [experience, setExperience] = useState('');

  // Review & Confirmation
  const [confirmed, setConfirmed] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedApplicant, setSubmittedApplicant] = useState<Applicant | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available skills extracted from selected roles
  const firstRoleObj = roles.find((r) => r.role_name === firstChoice);
  const secondRoleObj = roles.find((r) => r.role_name === secondChoice);
  const suggestedSkills = Array.from(
    new Set([...(firstRoleObj?.skills || []), ...(secondRoleObj?.skills || [])])
  );

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const addCustomSkill = () => {
    if (customSkillInput.trim() && !selectedSkills.includes(customSkillInput.trim())) {
      setSelectedSkills([...selectedSkills, customSkillInput.trim()]);
      setCustomSkillInput('');
    }
  };

  const handleNextFromDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!fullName || !email || !phone || !college || !department) {
      setErrorMsg('Please fill in all required personal information fields.');
      return;
    }

    const windowCheck = DatabaseService.isRecruitmentOpen();
    if (!windowCheck.isOpen) {
      setErrorMsg(windowCheck.message);
      return;
    }

    setStep('skills_experience');
  };

  const handleNextFromSkills = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (selectedSkills.length === 0) {
      setErrorMsg('Please select or add at least one relevant skill.');
      return;
    }
    if (!experience.trim()) {
      setErrorMsg('Please provide a brief description of your previous projects or experience.');
      return;
    }
    setStep('review');
  };

  const handleSubmitApplication = () => {
    setErrorMsg(null);
    if (!confirmed) {
      setErrorMsg('You must check the confirmation box before submitting your application.');
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

      const newApplicant: Applicant = {
        id: `app-${Date.now()}`,
        application_id: appId,
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        college: college.trim(),
        department: department.trim(),
        year: year,
        skills: selectedSkills,
        experience: experience.trim(),
        first_preference: firstChoice,
        second_preference: secondChoice || 'None (Optional)',
        final_assigned_team: null,
        status: 'Application Received',
        resume_url: resumeUrl.trim() || 'https://neuramorphix.org/resumes/default_resume.pdf',
        github_url: githubUrl.trim(),
        linkedin_url: linkedinUrl.trim(),
        portfolio_url: portfolioUrl.trim(),
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
      };

      DatabaseService.addApplicant(newApplicant);
      EmailService.sendEmail('application_received', newApplicant);

      try {
        confetti({
          particleCount: 120,
          spread: 80,
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

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Progress Bar Header */}
      <div className="mb-8 glass-panel rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm">
            {step === 'details' ? '1' : step === 'skills_experience' ? '2' : step === 'review' ? '3' : '✓'}
          </span>
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase">Step {step === 'details' ? '1 of 3' : step === 'skills_experience' ? '2 of 3' : '3 of 3'}</div>
            <div className="text-sm font-bold text-white">
              {step === 'details' && 'Personal Information'}
              {step === 'skills_experience' && 'Skills & Project Experience'}
              {step === 'review' && 'Review Your Application'}
              {step === 'submitted' && 'Application Submitted Successfully!'}
            </div>
          </div>
        </div>

        {step !== 'submitted' && (
          <button
            type="button"
            onClick={onChangePreferences}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Change Preference Choices
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: PERSONAL DETAILS */}
      {step === 'details' && (
        <form onSubmit={handleNextFromDetails} className="glass-panel p-6 sm:p-8 rounded-2xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <User className="w-6 h-6 text-cyan-400" />
              Personal Information
            </h2>
            <p className="text-sm text-slate-400">Enter your official contact and academic details.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">
                Email Address <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="e.g. aarav.sharma@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">
                Phone Number <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">
                College / Institution <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. IIT Delhi / BITS Pilani"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">
                Department / Major <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Computer Science / Electronics"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">
                Academic Year <span className="text-rose-400">*</span>
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm bg-slate-900 text-white"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Postgraduate / PhD">Postgraduate / PhD</option>
              </select>
            </div>
          </div>

          {/* Social / Portfolio Links */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold text-slate-300">Online Profiles & Portfolio Links (Optional)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="url"
                placeholder="GitHub Profile URL"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full px-4 py-2 rounded-xl glass-input text-xs"
              />
              <input
                type="url"
                placeholder="LinkedIn Profile URL"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="w-full px-4 py-2 rounded-xl glass-input text-xs"
              />
              <input
                type="url"
                placeholder="Portfolio / Personal Website URL"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                className="w-full px-4 py-2 rounded-xl glass-input text-xs"
              />
              <input
                type="url"
                placeholder="Resume Drive/PDF Link"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                className="w-full px-4 py-2 rounded-xl glass-input text-xs"
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t border-slate-800">
            <button
              type="button"
              onClick={onChangePreferences}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Role Selection
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              Continue to Skills & Experience
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: SKILLS & EXPERIENCE */}
      {step === 'skills_experience' && (
        <form onSubmit={handleNextFromSkills} className="glass-panel p-6 sm:p-8 rounded-2xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Code className="w-6 h-6 text-cyan-400" />
              Skills & Experience
            </h2>
            <p className="text-sm text-slate-400">Highlight your expertise relevant to your selected role preferences.</p>
          </div>

          {/* Suggested Skills */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-3">
              Select Relevant Skills <span className="text-rose-400">*</span>
            </label>
            <div className="flex flex-wrap gap-2 mb-4">
              {suggestedSkills.map((skill, idx) => {
                const active = selectedSkills.includes(skill);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      active
                        ? 'bg-cyan-500 text-slate-950 font-bold border border-cyan-400 shadow-md'
                        : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 border border-slate-700'
                    }`}
                  >
                    {active ? '✓ ' : '+ '}
                    {skill}
                  </button>
                );
              })}
            </div>

            {/* Custom Skill Input */}
            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                placeholder="Add custom skill (e.g. OpenCV, Docker)"
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
                className="px-4 py-2 rounded-xl glass-input text-xs flex-1"
              />
              <button
                type="button"
                onClick={addCustomSkill}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 hover:bg-slate-700"
              >
                Add Skill
              </button>
            </div>
          </div>

          {/* Previous Projects / Experience */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">
              Previous Projects / Experience <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows={5}
              placeholder="Describe your previous projects, team experience, code repositories, design portfolios, or research contributions..."
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full p-4 rounded-xl glass-input text-sm leading-relaxed"
            />
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setStep('details')}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Personal Info
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              Proceed to Final Review
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: REVIEW YOUR APPLICATION */}
      {step === 'review' && (
        <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-8">
          <div className="border-b border-slate-800 pb-4 text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 text-xs font-bold uppercase mb-2">
              <FileCheck className="w-3.5 h-3.5" />
              Final Step
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">REVIEW YOUR APPLICATION</h2>
            <p className="text-slate-400 text-xs mt-1">Please verify all details before submitting your application to NeuraMorphix.</p>
          </div>

          {/* Role Preferences Section */}
          <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Role Preferences</h3>
              <button
                type="button"
                onClick={onChangePreferences}
                className="text-xs text-slate-400 hover:text-cyan-300 font-medium underline"
              >
                Change Preferences
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-bold uppercase">🥇 First Choice</div>
                <div className="text-sm font-extrabold text-cyan-300">{firstChoice}</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-bold uppercase">🥈 Second Choice (Optional)</div>
                <div className="text-sm font-extrabold text-amber-300">
                  {secondChoice || <span className="text-slate-500 italic font-normal">None selected (Optional)</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information Summary */}
          <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Personal Information</h3>
              <button
                type="button"
                onClick={() => setStep('details')}
                className="text-xs text-slate-400 hover:text-cyan-300 font-medium underline"
              >
                Edit
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block">Name:</span>
                <span className="font-semibold text-slate-200">{fullName}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Email:</span>
                <span className="font-semibold text-slate-200">{email}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Phone:</span>
                <span className="font-semibold text-slate-200">{phone}</span>
              </div>
              <div>
                <span className="text-slate-400 block">College:</span>
                <span className="font-semibold text-slate-200">{college}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Department:</span>
                <span className="font-semibold text-slate-200">{department}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Year:</span>
                <span className="font-semibold text-slate-200">{year}</span>
              </div>
            </div>
          </div>

          {/* Skills & Experience Summary */}
          <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Skills & Experience</h3>
              <button
                type="button"
                onClick={() => setStep('skills_experience')}
                className="text-xs text-slate-400 hover:text-cyan-300 font-medium underline"
              >
                Edit
              </button>
            </div>
            <div>
              <span className="text-slate-400 text-xs block mb-1.5">Selected Skills:</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedSkills.map((sk, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700">
                    {sk}
                  </span>
                ))}
              </div>
            </div>
            <div className="pt-2">
              <span className="text-slate-400 text-xs block mb-1">Previous Projects / Experience:</span>
              <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-850">
                {experience}
              </p>
            </div>
          </div>

          {/* Confirmation Checkbox */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
            <input
              type="checkbox"
              id="confirm-check"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400 bg-slate-900 border-slate-700 cursor-pointer"
            />
            <label htmlFor="confirm-check" className="text-xs text-slate-300 leading-relaxed cursor-pointer">
              I confirm that the information provided is accurate and I understand that my role preferences are subject to the Neuramorphix selection process.
            </label>
          </div>

          {/* Submission Button */}
          <div className="flex justify-between pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setStep('skills_experience')}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              type="button"
              disabled={!confirmed || isSubmitting}
              onClick={handleSubmitApplication}
              className={`px-8 py-3 rounded-xl text-sm font-extrabold flex items-center gap-2 shadow-xl transition-all ${
                confirmed && !isSubmitting
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 shadow-cyan-500/25 ring-2 ring-cyan-300 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
              }`}
            >
              {isSubmitting ? (
                <>Submitting Application...</>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  SUBMIT APPLICATION
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: SUBMITTED SUCCESS SCREEN */}
      {step === 'submitted' && submittedApplicant && (
        <div className="glass-panel p-8 rounded-2xl text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 text-xs font-bold uppercase border border-emerald-500/30">
              Application Status: Received
            </span>
            <h2 className="text-3xl font-extrabold text-white">Application Received!</h2>
            <p className="text-slate-300 text-sm max-w-lg mx-auto">
              Thank you, <strong className="text-white">{submittedApplicant.full_name}</strong>! Your registration for the NeuraMorphix 2026 Team Recruitment has been successfully received.
            </p>
          </div>

          {/* Unique Application ID Box */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-cyan-500/30 max-w-md mx-auto shadow-2xl">
            <div className="text-xs text-slate-400 uppercase font-semibold mb-1">Application Number</div>
            <div className="text-2xl font-mono font-black text-cyan-300 tracking-wider">
              {submittedApplicant.application_id}
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              Registered Name: <strong className="text-slate-200">{submittedApplicant.full_name}</strong>
            </div>
          </div>

          {/* Sent Email Confirmation Badge */}
          <div className="flex justify-center pt-2">
            <span className="px-5 py-2.5 rounded-2xl bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-500/10">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Sent Email
            </span>
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            {onTrackStatusDirectly && (
              <button
                type="button"
                onClick={() => onTrackStatusDirectly(submittedApplicant.application_id)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-black cursor-pointer shadow-xl flex items-center gap-2 transition-all hover:scale-105"
              >
                <Search className="w-4 h-4 text-slate-950" />
                <span>Track Application Status Directly &rarr;</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setStep('details');
                setSubmittedApplicant(null);
                setConfirmed(false);
              }}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 cursor-pointer transition-all"
            >
              Submit Another Application
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
