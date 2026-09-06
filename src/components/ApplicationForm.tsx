import React, { useState, useRef, useEffect } from 'react';
import type { Applicant, Role } from '../types/recruitment';
import { DatabaseService } from '../services/db';
import { EmailService } from '../services/email';
import { BackendApiService } from '../services/api';
import { INDIAN_COLLEGES } from '../data/indianColleges';
import confetti from 'canvas-confetti';

import {
  User,
  Code,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  XCircle,
  Plus,
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
  const [step, setStep] = useState<
    'details' | 'skills_experience' | 'review' | 'submitted'
  >('details');

  // FORM FIELDS
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('SRM Institute of Science and Technology, Kattankulathur');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('1st Year');

  const [resumeUrl, setResumeUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');

  // PHONE VALIDATION
  const phoneDigits = phone.replace(/\D/g, '');
  const isPhoneValid = phoneDigits.length === 10;
  const phoneHasInput = phone.trim().length > 0;

  // COLLEGE AUTOCOMPLETE
  const [collegeQuery, setCollegeQuery] = useState('SRM Institute of Science and Technology, Kattankulathur');
  const [showCollegeSuggestions, setShowCollegeSuggestions] = useState(false);
  const collegeRef = useRef<HTMLDivElement>(null);

  const collegeSuggestions =
    collegeQuery.trim().length >= 2
      ? INDIAN_COLLEGES.filter((c) =>
          c.toLowerCase().includes(collegeQuery.toLowerCase())
        ).slice(0, 6)
      : [];


  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (
        collegeRef.current &&
        !collegeRef.current.contains(e.target as Node)
      ) {
        setShowCollegeSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleCollegeSelect = (name: string) => {
    setCollege(name);
    setCollegeQuery(name);
    setShowCollegeSuggestions(false);
  };

  // SKILLS & EXPERIENCE
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [experience, setExperience] = useState('');

  // REVIEW & SUBMISSION
  const [confirmed, setConfirmed] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedApplicant, setSubmittedApplicant] = useState<Applicant | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ROLE SKILLS
  const firstRoleObj = roles.find((r) => r.role_name === firstChoice);
  const secondRoleObj = roles.find((r) => r.role_name === secondChoice);
  const suggestedSkills = Array.from(
    new Set([
      ...(firstRoleObj?.skills || []),
      ...(secondRoleObj?.skills || []),
      'React',
      'Node.js',
      'Python',
      'Figma',
      'UI/UX Design',
      'Event Management',
      'Public Relations',
      'Content Writing',
      'Video Editing',
    ])
  );

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const addCustomSkill = () => {
    const skill = customSkillInput.trim();
    if (skill && !selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
      setCustomSkillInput('');
    }
  };

  const handleNextFromDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (
      !fullName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !college.trim() ||
      !department.trim()
    ) {
      setErrorMsg('Please fill in all required personal information fields.');
      return;
    }

    if (!isPhoneValid) {
      setErrorMsg('Please enter a valid 10-digit phone number.');
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
      setErrorMsg('Please provide a brief summary of your interest/projects.');
      return;
    }

    setStep('review');
  };

  const handleSubmitApplication = async () => {
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

      const newApplicant: Applicant = {
        id: `app-${Date.now()}`,
        application_id: appId,
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        college: college.trim(),
        department: department.trim(),
        year,
        skills: selectedSkills,
        experience: experience.trim(),
        first_preference: firstChoice,
        second_preference: secondChoice || 'None (Optional)',
        final_assigned_team: null,
        status: 'Application Received',
        resume_url: resumeUrl.trim(),
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

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
      {/* PROGRESS HEADER */}
      <div className="mb-8 bg-white border-[3px] border-[#1E1B24] rounded-2xl p-4 shadow-[4px_4px_0_#1E1B24] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#3E9FFF] text-white border-[2px] border-[#1E1B24] flex items-center justify-center font-outfit font-black text-base shadow-[2px_2px_0_#1E1B24]">
            {step === 'details' ? '1' : step === 'skills_experience' ? '2' : step === 'review' ? '3' : '✓'}
          </div>
          <div>
            <div className="text-xs font-outfit font-extrabold text-[#3E9FFF] uppercase tracking-wider">
              Step {step === 'details' ? '1 of 3' : step === 'skills_experience' ? '2 of 3' : '3 of 3'}
            </div>
            <div className="text-base font-outfit font-black text-[#1E1B24]">
              {step === 'details' && 'Candidate Details'}
              {step === 'skills_experience' && 'Skills & Experience'}
              {step === 'review' && 'Review & Confirm Application'}
              {step === 'submitted' && 'Application Submitted Successfully! 🎉'}
            </div>
          </div>
        </div>

        {step !== 'submitted' && (
          <button
            type="button"
            onClick={onChangePreferences}
            className="text-xs font-rubik font-bold text-[#1E1B24] bg-[#FFD93D] hover:bg-[#ffe169] px-3.5 py-2 rounded-xl border-[2px] border-[#1E1B24] shadow-[2px_2px_0_#1E1B24] flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Change Roles
          </button>
        )}
      </div>

      {/* ERROR DISPLAY */}
      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-[#FF4B4B] text-white border-[3px] border-[#1E1B24] shadow-[4px_4px_0_#1E1B24] font-rubik font-bold text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: CANDIDATE DETAILS */}
      {step === 'details' && (
        <form onSubmit={handleNextFromDetails} className="bg-white border-[3px] border-[#1E1B24] rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0_#1E1B24] space-y-6">
          <div className="border-b-[3px] border-[#1E1B24] pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-outfit font-black text-[#1E1B24] flex items-center gap-2">
                <User className="w-6 h-6 text-[#3E9FFF]" />
                Personal & Academic Details
              </h2>
              <p className="font-rubik text-sm text-[#5C5866] font-medium">Enter your official contact and student details below.</p>
            </div>
          </div>

          {/* Preferences Banner */}
          <div className="p-4 bg-[#FAF7EE] border-[2px] border-[#1E1B24] rounded-2xl flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-outfit font-black text-[#1E1B24]">🥇 1st Choice:</span>
              <span className="neo-badge bg-[#FF4B4B] text-white text-xs">{firstChoice}</span>
            </div>
            {secondChoice && secondChoice !== 'None (Optional)' && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-outfit font-black text-[#1E1B24]">🥈 2nd Choice:</span>
                <span className="neo-badge bg-[#FFD93D] text-[#1E1B24] text-xs">{secondChoice}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-outfit font-extrabold text-[#1E1B24] uppercase mb-2">
                Full Name <span className="text-[#FF4B4B]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Aarav Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-[2px] border-[#1E1B24] bg-white font-rubik text-sm shadow-[2px_2px_0_#1E1B24] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-outfit font-extrabold text-[#1E1B24] uppercase mb-2">
                Email Address <span className="text-[#FF4B4B]">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="e.g. aarav@srmist.edu.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-[2px] border-[#1E1B24] bg-white font-rubik text-sm shadow-[2px_2px_0_#1E1B24] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-outfit font-extrabold text-[#1E1B24] uppercase mb-2">
                Phone Number (10 digits) <span className="text-[#FF4B4B]">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full px-4 py-3 rounded-xl border-[2px] border-[#1E1B24] bg-white font-rubik text-sm shadow-[2px_2px_0_#1E1B24] focus:outline-none"
                />
                {phoneHasInput && (
                  <div className="absolute right-3 top-3.5">
                    {isPhoneValid ? (
                      <CheckCircle2 className="w-5 h-5 text-[#4EC37B]" />
                    ) : (
                      <XCircle className="w-5 h-5 text-[#FF4B4B]" />
                    )}
                  </div>
                )}
              </div>
            </div>

            <div ref={collegeRef} className="relative">
              <label className="block text-xs font-outfit font-extrabold text-[#1E1B24] uppercase mb-2">
                College / Institution <span className="text-[#FF4B4B]">*</span>
              </label>
              <input
                type="text"
                required
                autoComplete="off"
                placeholder="Search college..."
                value={collegeQuery}
                onFocus={() => setShowCollegeSuggestions(true)}
                onChange={(e) => {
                  setCollegeQuery(e.target.value);
                  setCollege(e.target.value);
                  setShowCollegeSuggestions(true);
                }}
                className="w-full px-4 py-3 rounded-xl border-[2px] border-[#1E1B24] bg-white font-rubik text-sm shadow-[2px_2px_0_#1E1B24] focus:outline-none"
              />
              {showCollegeSuggestions && collegeSuggestions.length > 0 && (
                <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border-[3px] border-[#1E1B24] rounded-xl shadow-[4px_4px_0_#1E1B24] max-h-48 overflow-y-auto">
                  {collegeSuggestions.map((name, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleCollegeSelect(name)}
                      className="w-full text-left px-4 py-2.5 hover:bg-[#FFD93D] font-rubik text-xs text-[#1E1B24] font-bold border-b border-[#1E1B24] last:border-none cursor-pointer"
                    >
                      {name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-outfit font-extrabold text-[#1E1B24] uppercase mb-2">
                Department / Branch <span className="text-[#FF4B4B]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Computer Science / IT / ECE"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-[2px] border-[#1E1B24] bg-white font-rubik text-sm shadow-[2px_2px_0_#1E1B24] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-outfit font-extrabold text-[#1E1B24] uppercase mb-2">
                Year of Study <span className="text-[#FF4B4B]">*</span>
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-[2px] border-[#1E1B24] bg-white font-rubik text-sm font-bold shadow-[2px_2px_0_#1E1B24] focus:outline-none cursor-pointer"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="px-8 py-3.5 rounded-xl bg-[#3E9FFF] text-white font-rubik font-bold text-base border-[3px] border-[#1E1B24] shadow-[4px_4px_0_#1E1B24] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#1E1B24] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_#1E1B24] transition-all flex items-center gap-2 uppercase tracking-wide cursor-pointer"
            >
              Next: Skills & Experience →
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: SKILLS & EXPERIENCE */}
      {step === 'skills_experience' && (
        <form onSubmit={handleNextFromSkills} className="bg-white border-[3px] border-[#1E1B24] rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0_#1E1B24] space-y-6">
          <div className="border-b-[3px] border-[#1E1B24] pb-4">
            <h2 className="text-2xl font-outfit font-black text-[#1E1B24] flex items-center gap-2">
              <Code className="w-6 h-6 text-[#3E9FFF]" />
              Skills & Portfolio Links
            </h2>
            <p className="font-rubik text-sm text-[#5C5866] font-medium">Highlight your tech stack, projects, and work links.</p>
          </div>

          {/* Suggested Skills */}
          <div>
            <label className="block text-xs font-outfit font-extrabold text-[#1E1B24] uppercase mb-2">
              Select Relevant Skills <span className="text-[#FF4B4B]">*</span>
            </label>
            <div className="flex flex-wrap gap-2 mb-4">
              {suggestedSkills.map((skill, idx) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-3.5 py-1.5 rounded-xl border-[2px] border-[#1E1B24] font-rubik text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FFD93D] text-[#1E1B24] shadow-[2px_2px_0_#1E1B24]'
                        : 'bg-[#FAF7EE] text-[#5C5866] hover:bg-white'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {skill}
                  </button>
                );
              })}
            </div>

            {/* Custom Skill */}
            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                placeholder="Add custom skill..."
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomSkill();
                  }
                }}
                className="flex-1 px-4 py-2 rounded-xl border-[2px] border-[#1E1B24] bg-white font-rubik text-xs shadow-[2px_2px_0_#1E1B24]"
              />
              <button
                type="button"
                onClick={addCustomSkill}
                className="px-4 py-2 rounded-xl bg-[#3E9FFF] text-white font-rubik font-bold text-xs border-[2px] border-[#1E1B24] shadow-[2px_2px_0_#1E1B24] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Project Experience */}
          <div>
            <label className="block text-xs font-outfit font-extrabold text-[#1E1B24] uppercase mb-2">
              Brief Project Summary / Experience <span className="text-[#FF4B4B]">*</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describe projects, tools, or relevant experience..."
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-[2px] border-[#1E1B24] bg-white font-rubik text-sm shadow-[2px_2px_0_#1E1B24] focus:outline-none"
            />
          </div>

          {/* Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-outfit font-extrabold text-[#1E1B24] uppercase mb-1">GitHub / Code Link</label>
              <input
                type="url"
                placeholder="https://github.com/username"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border-[2px] border-[#1E1B24] bg-white font-rubik text-xs shadow-[2px_2px_0_#1E1B24]"
              />
            </div>
            <div>
              <label className="block text-xs font-outfit font-extrabold text-[#1E1B24] uppercase mb-1">LinkedIn Profile</label>
              <input
                type="url"
                placeholder="https://linkedin.com/in/username"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border-[2px] border-[#1E1B24] bg-white font-rubik text-xs shadow-[2px_2px_0_#1E1B24]"
              />
            </div>
            <div>
              <label className="block text-xs font-outfit font-extrabold text-[#1E1B24] uppercase mb-1">Portfolio / Website</label>
              <input
                type="url"
                placeholder="https://yourportfolio.com"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border-[2px] border-[#1E1B24] bg-white font-rubik text-xs shadow-[2px_2px_0_#1E1B24]"
              />
            </div>
            <div>
              <label className="block text-xs font-outfit font-extrabold text-[#1E1B24] uppercase mb-1">Resume Drive / Cloud Link</label>
              <input
                type="url"
                placeholder="https://drive.google.com/..."
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border-[2px] border-[#1E1B24] bg-white font-rubik text-xs shadow-[2px_2px_0_#1E1B24]"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep('details')}
              className="px-6 py-3 rounded-xl bg-white text-[#1E1B24] font-rubik font-bold text-sm border-[2px] border-[#1E1B24] shadow-[2px_2px_0_#1E1B24] cursor-pointer"
            >
              ← Back to Details
            </button>
            <button
              type="submit"
              className="px-8 py-3.5 rounded-xl bg-[#3E9FFF] text-white font-rubik font-bold text-base border-[3px] border-[#1E1B24] shadow-[4px_4px_0_#1E1B24] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#1E1B24] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_#1E1B24] transition-all flex items-center gap-2 uppercase tracking-wide cursor-pointer"
            >
              Next: Review Application →
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: REVIEW & CONFIRM */}
      {step === 'review' && (
        <div className="bg-white border-[3px] border-[#1E1B24] rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0_#1E1B24] space-y-6">
          <div className="border-b-[3px] border-[#1E1B24] pb-4">
            <h2 className="text-2xl font-outfit font-black text-[#1E1B24] flex items-center gap-2">
              <FileCheck className="w-6 h-6 text-[#3E9FFF]" />
              Review Your Summary
            </h2>
            <p className="font-rubik text-sm text-[#5C5866] font-medium">Verify your details before submitting to the recruitment team.</p>
          </div>

          {/* Details Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FAF7EE] p-5 rounded-2xl border-[2px] border-[#1E1B24]">
            <div>
              <div className="text-xs font-outfit font-black text-[#3E9FFF] uppercase">Applicant Name</div>
              <div className="text-base font-rubik font-bold text-[#1E1B24]">{fullName}</div>
            </div>
            <div>
              <div className="text-xs font-outfit font-black text-[#3E9FFF] uppercase">Email & Phone</div>
              <div className="text-sm font-rubik font-bold text-[#1E1B24]">{email} · {phone}</div>
            </div>
            <div>
              <div className="text-xs font-outfit font-black text-[#3E9FFF] uppercase">College & Department</div>
              <div className="text-sm font-rubik font-bold text-[#1E1B24]">{college}</div>
              <div className="text-xs font-rubik text-[#5C5866]">{department} ({year})</div>
            </div>
            <div>
              <div className="text-xs font-outfit font-black text-[#FF4B4B] uppercase">Domain Preferences</div>
              <div className="text-sm font-rubik font-bold text-[#1E1B24]">🥇 1st: {firstChoice}</div>
              {secondChoice && secondChoice !== 'None (Optional)' && (
                <div className="text-xs font-rubik font-bold text-[#5C5866]">🥈 2nd: {secondChoice}</div>
              )}
            </div>
          </div>

          <div>
            <div className="text-xs font-outfit font-black text-[#1E1B24] uppercase mb-1">Selected Skills</div>
            <div className="flex flex-wrap gap-1.5">
              {selectedSkills.map((s, i) => (
                <span key={i} className="text-xs font-rubik font-bold px-2.5 py-1 rounded-lg bg-[#FFD93D] text-[#1E1B24] border-[1px] border-[#1E1B24]">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-outfit font-black text-[#1E1B24] uppercase mb-1">Experience Summary</div>
            <p className="font-rubik text-sm text-[#5C5866] bg-[#FAF7EE] p-3.5 rounded-xl border-[2px] border-[#1E1B24] font-medium leading-relaxed">
              {experience}
            </p>
          </div>

          <label className="flex items-start gap-3 p-4 bg-[#FAF7EE] border-[2px] border-[#1E1B24] rounded-2xl cursor-pointer">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-0.5 w-5 h-5 accent-[#3E9FFF] cursor-pointer"
            />
            <span className="font-rubik text-xs sm:text-sm text-[#1E1B24] font-bold">
              I confirm that all information provided above is accurate and true to the best of my knowledge.
            </span>
          </label>

          <div className="flex justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep('skills_experience')}
              className="px-6 py-3 rounded-xl bg-white text-[#1E1B24] font-rubik font-bold text-sm border-[2px] border-[#1E1B24] shadow-[2px_2px_0_#1E1B24] cursor-pointer"
            >
              ← Back to Edit
            </button>
            <button
              type="button"
              disabled={isSubmitting || !confirmed}
              onClick={handleSubmitApplication}
              className={`px-10 py-3.5 rounded-xl font-rubik font-bold text-base border-[3px] border-[#1E1B24] transition-all uppercase tracking-wide cursor-pointer ${
                confirmed && !isSubmitting
                  ? 'bg-[#FF4B4B] text-white shadow-[4px_4px_0_#1E1B24] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#1E1B24] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_#1E1B24]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-60'
              }`}
            >
              {isSubmitting ? 'Submitting Application...' : 'SUBMIT APPLICATION NOW 🎉'}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: SUBMITTED CONFIRMATION */}
      {step === 'submitted' && submittedApplicant && (
        <div className="bg-white border-[4px] border-[#1E1B24] rounded-3xl p-8 shadow-[8px_8px_0_#1E1B24] text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#4EC37B] text-white border-[3px] border-[#1E1B24] flex items-center justify-center mx-auto shadow-[4px_4px_0_#1E1B24]">
            <CheckCircle2 className="w-10 h-10 stroke-[3]" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-outfit font-black text-[#1E1B24]">
            Application Registered Successfully!
          </h2>

          <p className="font-rubik text-base text-[#5C5866] max-w-lg mx-auto font-medium leading-relaxed">
            Welcome aboard, <strong className="text-[#3E9FFF]">{submittedApplicant.full_name}</strong>! Your application has been registered and sent to our recruitment system.
          </p>

          {/* APPLICATION ID CARD */}
          <div className="max-w-md mx-auto p-6 bg-[#FFD93D] border-[3px] border-[#1E1B24] rounded-2xl shadow-[6px_6px_0_#1E1B24]">
            <div className="text-xs font-outfit font-black text-[#1E1B24] uppercase tracking-widest mb-1">
              Your Official Application ID
            </div>
            <div className="font-mono text-3xl font-black text-[#1E1B24] tracking-wider my-2">
              {submittedApplicant.application_id}
            </div>
            <div className="text-xs font-rubik text-[#1E1B24] font-bold">
              Please save this ID to track your application stage!
            </div>
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            {onTrackStatusDirectly && (
              <button
                type="button"
                onClick={() => onTrackStatusDirectly(submittedApplicant.application_id)}
                className="px-8 py-3.5 rounded-xl bg-[#3E9FFF] text-white font-rubik font-bold text-base border-[3px] border-[#1E1B24] shadow-[4px_4px_0_#1E1B24] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#1E1B24] transition-all cursor-pointer uppercase"
              >
                Track Live Status →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};