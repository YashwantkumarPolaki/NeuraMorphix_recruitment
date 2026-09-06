import { useState } from 'react';
import { DatabaseService } from './services/db';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { RoleSelectionSection } from './components/RoleSelectionSection';
import { ApplicationForm } from './components/ApplicationForm';
import { StatusTracker } from './components/StatusTracker';
import { AdminDashboard } from './components/AdminDashboard';
import { FAQSection } from './components/FAQSection';
import { NeuraMorphixLogo } from './components/NeuraMorphixLogo';
import {
  Code,
  GraduationCap,
  Users,
  TrendingUp,
  Terminal,
  Briefcase,
  Rocket,
  Lock,
  Search,
} from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'apply' | 'track' | 'admin'>('home');

  // Selected Preferences state
  const [firstChoice, setFirstChoice] = useState<string | null>(null);
  const [secondChoice, setSecondChoice] = useState<string | null>(null);
  const [trackedAppId, setTrackedAppId] = useState<string | null>(null);
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>('all');

  const roles = DatabaseService.getRoles();
  const windowStatus = DatabaseService.isRecruitmentOpen();

  const handleDomainApply = (domainName: string) => {
    setSelectedDomainFilter(domainName.toLowerCase());
    const el = document.getElementById('roles-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectFirstChoice = (roleName: string) => {
    if (secondChoice === roleName) {
      setSecondChoice(firstChoice);
    }
    setFirstChoice(roleName);
  };

  const handleSelectSecondChoice = (roleName: string) => {
    if (firstChoice === roleName) {
      setFirstChoice(secondChoice);
    }
    setSecondChoice(roleName);
  };

  const handleClearPreferences = () => {
    setFirstChoice(null);
    setSecondChoice(null);
  };

  const handleProceedToForm = () => {
    setCurrentTab('apply');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTrackStatusDirectly = (appId: string) => {
    setTrackedAppId(appId);
    setCurrentTab('track');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };



  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7EE] text-[#1E1B24] font-outfit selection:bg-[#FFD93D] selection:text-[#1E1B24] relative overflow-x-hidden">
      {/* Navigation Header */}
      <Header currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* RECRUITMENT CLOSED BANNER IF APPLICABLE */}
      {!windowStatus.isOpen && (
        <div className="bg-[#FF4B4B] text-white border-b-[3px] border-[#1E1B24] py-3 px-4 text-center font-rubik font-bold text-xs shadow-md">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <Lock className="w-4 h-4" />
            <span>{windowStatus.message} Existing applicants can still track status. Admins can manually reopen.</span>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main className="flex-1">
        {/* HOME & LANDING VIEW */}
        {currentTab === 'home' && (
          <div>
            {/* HERO SECTION - Electric Indigo Neo-Brutalist Canvas */}
            <section className="relative w-full min-h-[85vh] flex flex-col lg:flex-row items-center justify-between px-6 md:px-16 py-16 lg:py-20 gap-12 overflow-hidden border-b-[4px] border-[#1E1B24] bg-[#4338CA]">
              {/* Background Overlay Pattern */}
              <div
                className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-repeat"
                style={{
                  backgroundImage:
                    'radial-gradient(#ffffff 1.5px, transparent 1.5px)',
                  backgroundSize: '24px 24px',
                }}
              ></div>

              {/* Left Column Content */}
              <div className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left max-w-2xl gap-6">
                <div className="neo-badge bg-[#FFD93D] text-[#1E1B24] shadow-[3px_3px_0_#1E1B24]">
                  <span>NEURAMORPHIX RECRUITMENT 2026 IS LIVE!</span>
                </div>

                <h1 className="font-overpass font-black text-5xl md:text-6xl lg:text-[72px] text-white leading-[105%] tracking-tight text-stroke-primary">
                  Shape the <br />
                  Next Era of AI & <br />
                  Intelligence!
                </h1>

                <p className="font-rubik text-white text-base md:text-lg max-w-lg opacity-95 leading-relaxed font-semibold">
                  Join NeuraMorphix — a premier student community of AI researchers, developers, musicians, actors, and project leaders building high-impact work.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-2 w-full">
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('domains');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-8 py-3.5 border-[3px] border-[#1E1B24] rounded-xl font-rubik font-bold text-lg shadow-[4px_4px_0_#1E1B24] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#1E1B24] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_#1E1B24] transition-all flex items-center justify-center gap-2 bg-[#FF4B4B] text-white uppercase tracking-wide cursor-pointer w-full sm:w-auto"
                  >
                    APPLY NOW →
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('domains');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-8 py-3.5 border-[3px] border-[#1E1B24] rounded-xl font-rubik font-bold text-lg shadow-[4px_4px_0_#1E1B24] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#1E1B24] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_#1E1B24] transition-all flex items-center justify-center gap-2 bg-[#FFD93D] text-[#1E1B24] uppercase tracking-wide cursor-pointer w-full sm:w-auto"
                  >
                    EXPLORE DOMAINS
                  </button>
                </div>
              </div>

              {/* Right Column Character Mascot Graphic */}
              <div className="relative z-10 flex flex-col items-center justify-center w-full lg:w-auto lg:min-w-[360px] gap-6">
                <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] bg-white border-[4px] border-[#1E1B24] rounded-3xl shadow-[8px_8px_0_#1E1B24] flex items-center justify-center p-6 overflow-hidden">
                  <img
                    src="/bears.png"
                    alt="We Bare Bears Mascot"
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="w-full max-w-[340px] p-4 bg-[#FFD93D] border-[3px] border-[#1E1B24] rounded-2xl shadow-[4px_4px_0_#1E1B24] font-rubik text-xs md:text-sm font-bold text-[#1E1B24] text-left">
                  "Welcome Innovator! … Which domain aligns with your talent?"
                </div>
              </div>
            </section>

            {/* CULTURE / ABOUT SECTION (`#about`) */}
            <div id="about" className="w-full flex flex-col items-center bg-[#FAF7EE] border-t-[3px] border-[#1E1B24]">
              <section className="relative w-full max-w-7xl py-16 px-6 sm:px-8 lg:py-24 flex flex-col items-center gap-12">
                <div className="flex flex-col items-center gap-4 text-center max-w-2xl">
                  <div className="neo-badge bg-[#FF4B4B] text-white">
                    <span>CULTURE AT NEURAMORPHIX</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-outfit font-black text-[#1E1B24] tracking-tight">
                    Why You'll Thrive With Us
                  </h2>
                  <p className="font-rubik text-base lg:text-lg font-medium text-[#5C5866] leading-relaxed">
                    We blend high-impact AI research, software engineering, music jams, and stage performances into a collaborative ecosystem.
                  </p>
                </div>

                {/* 4 Feature Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                  {/* Innovate Card */}
                  <div className="flex flex-col gap-5 bg-white rounded-3xl border-[3px] border-[#1E1B24] shadow-[6px_6px_0_#1E1B24] p-6 hover:-translate-y-1 transition-all">
                    <div className="w-14 h-14 rounded-2xl border-[3px] border-[#1E1B24] bg-[#FF4B4B] text-white flex items-center justify-center shadow-[3px_3px_0_#1E1B24]">
                      <Code className="w-7 h-7" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-2xl font-outfit font-black text-[#1E1B24]">Innovate</h3>
                      <p className="font-rubik text-sm font-medium text-[#5C5866] leading-relaxed">
                        Turn ambitious ideas into production-ready web apps, AI models, music tracks, and stage productions.
                      </p>
                    </div>
                  </div>

                  {/* Master Card */}
                  <div className="flex flex-col gap-5 bg-white rounded-3xl border-[3px] border-[#1E1B24] shadow-[6px_6px_0_#1E1B24] p-6 hover:-translate-y-1 transition-all">
                    <div className="w-14 h-14 rounded-2xl border-[3px] border-[#1E1B24] bg-[#FFD93D] text-[#1E1B24] flex items-center justify-center shadow-[3px_3px_0_#1E1B24]">
                      <GraduationCap className="w-7 h-7" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-2xl font-outfit font-black text-[#1E1B24]">Master</h3>
                      <p className="font-rubik text-sm font-medium text-[#5C5866] leading-relaxed">
                        Learn full-stack frameworks, AI tools, event management, instrument playing, and stage acting.
                      </p>
                    </div>
                  </div>

                  {/* Collaborate Card */}
                  <div className="flex flex-col gap-5 bg-white rounded-3xl border-[3px] border-[#1E1B24] shadow-[6px_6px_0_#1E1B24] p-6 hover:-translate-y-1 transition-all">
                    <div className="w-14 h-14 rounded-2xl border-[3px] border-[#1E1B24] bg-[#3E9FFF] text-white flex items-center justify-center shadow-[3px_3px_0_#1E1B24]">
                      <Users className="w-7 h-7" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-2xl font-outfit font-black text-[#1E1B24]">Collaborate</h3>
                      <p className="font-rubik text-sm font-medium text-[#5C5866] leading-relaxed">
                        Partner with top student talent across software, operations, music, and theatrical drama.
                      </p>
                    </div>
                  </div>

                  {/* Elevate Card */}
                  <div className="flex flex-col gap-5 bg-white rounded-3xl border-[3px] border-[#1E1B24] shadow-[6px_6px_0_#1E1B24] p-6 hover:-translate-y-1 transition-all">
                    <div className="w-14 h-14 rounded-2xl border-[3px] border-[#1E1B24] bg-[#4EC37B] text-white flex items-center justify-center shadow-[3px_3px_0_#1E1B24]">
                      <TrendingUp className="w-7 h-7" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-2xl font-outfit font-black text-[#1E1B24]">Elevate</h3>
                      <p className="font-rubik text-sm font-medium text-[#5C5866] leading-relaxed">
                        Lead projects, perform at major campus events, and build a standout professional portfolio.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* DOMAINS & OPEN ROLES SECTION (`#domains`) */}
            <div id="domains" className="w-full flex flex-col items-center bg-[#FFFEEF] border-t-[3px] border-[#1E1B24]">
              <section className="relative w-full max-w-7xl py-16 px-6 sm:px-8 lg:py-24 flex flex-col items-center gap-12">
                <div className="flex flex-col items-center gap-4 text-center max-w-2xl">
                  <div className="neo-badge bg-[#3E9FFF] text-white">
                    <span>JOB BOARD</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-outfit font-black text-[#1E1B24] tracking-tight">
                    Open Roles
                  </h2>
                  <p className="font-rubik text-base lg:text-lg font-medium text-[#5C5866] leading-relaxed">
                    Explore available positions across Technical, Non-Technical, and Entrepreneurship & Startups!
                  </p>
                </div>

                {/* 3 Core Domain Overview Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-4">
                  {/* 1. TECHNICAL DOMAIN */}
                  <div className="bg-white rounded-3xl border-[3px] border-[#1E1B24] shadow-[6px_6px_0_#1E1B24] p-6 flex flex-col justify-between gap-6 hover:-translate-y-1 transition-all">
                    <div className="space-y-4">
                      <div className="neo-badge bg-[#FF4B4B] text-white text-xs">
                        <span>TECHNICAL</span>
                      </div>
                      <h3 className="text-xl font-outfit font-black text-[#1E1B24] flex items-center gap-2">
                        <Terminal className="w-6 h-6 text-[#FF4B4B] shrink-0" />
                        Web / App / AI / Cloud / IoT
                      </h3>
                      <p className="font-rubik text-xs text-[#5C5866] font-medium leading-relaxed">
                        Frontend, backend, mobile apps, AI models, hardware microcontrollers, cybersecurity, and deep learning.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDomainApply('technical')}
                      className="w-full py-3 border-[3px] border-[#1E1B24] rounded-xl font-rubik font-bold text-xs shadow-[3px_3px_0_#1E1B24] bg-[#FF4B4B] text-white uppercase tracking-wider hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all cursor-pointer"
                    >
                      APPLY TECHNICAL →
                    </button>
                  </div>

                  {/* 2. NON-TECHNICAL DOMAIN */}
                  <div className="bg-white rounded-3xl border-[3px] border-[#1E1B24] shadow-[6px_6px_0_#1E1B24] p-6 flex flex-col justify-between gap-6 hover:-translate-y-1 transition-all">
                    <div className="space-y-4">
                      <div className="neo-badge bg-[#FFD93D] text-[#1E1B24] text-xs">
                        <span>NON-TECHNICAL</span>
                      </div>
                      <h3 className="text-xl font-outfit font-black text-[#1E1B24] flex items-center gap-2">
                        <Briefcase className="w-6 h-6 text-[#1E1B24] shrink-0" />
                        Creatives / PR / Events / Content
                      </h3>
                      <p className="font-rubik text-xs text-[#5C5866] font-medium leading-relaxed">
                        UI/UX design, corporate sponsorships, public relations, event management, media production, and HR.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDomainApply('non-technical')}
                      className="w-full py-3 border-[3px] border-[#1E1B24] rounded-xl font-rubik font-bold text-xs shadow-[3px_3px_0_#1E1B24] bg-[#FFD93D] text-[#1E1B24] uppercase tracking-wider hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all cursor-pointer"
                    >
                      APPLY NON-TECH →
                    </button>
                  </div>

                  {/* 3. ENTREPRENEURSHIP & STARTUPS DOMAIN */}
                  <div className="bg-white rounded-3xl border-[3px] border-[#1E1B24] shadow-[6px_6px_0_#1E1B24] p-6 flex flex-col justify-between gap-6 hover:-translate-y-1 transition-all">
                    <div className="space-y-4">
                      <div className="neo-badge bg-[#4EC37B] text-white text-xs">
                        <span>ENTREPRENEURSHIP & STARTUPS</span>
                      </div>
                      <h3 className="text-xl font-outfit font-black text-[#1E1B24] flex items-center gap-2">
                        <Rocket className="w-6 h-6 text-[#4EC37B] shrink-0" />
                        Pitch Decks / Product / Growth
                      </h3>
                      <p className="font-rubik text-xs text-[#5C5866] font-medium leading-relaxed">
                        Incubating tech startups, investor pitch decks, product strategy, market research, and business models.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDomainApply('entrepreneurship')}
                      className="w-full py-3 border-[3px] border-[#1E1B24] rounded-xl font-rubik font-bold text-xs shadow-[3px_3px_0_#1E1B24] bg-[#4EC37B] text-white uppercase tracking-wider hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all cursor-pointer"
                    >
                      APPLY STARTUPS →
                    </button>
                  </div>
                </div>

                {/* Interactive Detailed Role Selection Grid */}
                <div className="w-full">
                  <RoleSelectionSection
                    roles={roles}
                    firstChoice={firstChoice}
                    secondChoice={secondChoice}
                    selectedDomainFilter={selectedDomainFilter}
                    onSelectFirstChoice={handleSelectFirstChoice}
                    onSelectSecondChoice={handleSelectSecondChoice}
                    onClearPreferences={handleClearPreferences}
                    onProceedToForm={handleProceedToForm}
                  />
                </div>
              </section>
            </div>

            {/* ROADMAP SECTION (`#process`) */}
            <div id="process" className="w-full flex flex-col items-center bg-[#FAF7EE] border-t-[3px] border-[#1E1B24]">
              <section className="relative w-full max-w-7xl py-16 px-6 sm:px-8 lg:py-24 flex flex-col items-center gap-12">
                <div className="flex flex-col items-center gap-4 text-center max-w-2xl">
                  <div className="neo-badge bg-[#4EC37B] text-white">
                    <span>RECRUITMENT ROADMAP</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-outfit font-black text-[#1E1B24] tracking-tight">
                    4 Steps to Join NeuraMorphix
                  </h2>
                  <p className="font-rubik text-base lg:text-lg font-medium text-[#5C5866] leading-relaxed">
                    A streamlined recruitment cycle designed for speed, fairness, and transparency!
                  </p>
                </div>

                {/* 4 Process Steps */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                  {/* Step 01 */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl border-[3px] border-[#1E1B24] bg-[#FF4B4B] text-white flex items-center justify-center font-outfit font-black text-xl shadow-[3px_3px_0_#1E1B24]">
                        01
                      </div>
                      <div className="flex-1 h-1.5 bg-[#1E1B24] rounded-full"></div>
                    </div>
                    <div className="bg-white border-[3px] border-[#1E1B24] rounded-2xl p-6 shadow-[4px_4px_0_#1E1B24] min-h-[140px] flex flex-col justify-center">
                      <h3 className="text-xl font-outfit font-black text-[#1E1B24]">01. DISCOVER</h3>
                      <p className="font-rubik text-sm font-medium text-[#5C5866] mt-2">
                        Explore domain tracks and choose your 1st & 2nd role preferences.
                      </p>
                    </div>
                  </div>

                  {/* Step 02 */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl border-[3px] border-[#1E1B24] bg-[#FFD93D] text-[#1E1B24] flex items-center justify-center font-outfit font-black text-xl shadow-[3px_3px_0_#1E1B24]">
                        02
                      </div>
                      <div className="flex-1 h-1.5 bg-[#1E1B24] rounded-full"></div>
                    </div>
                    <div className="bg-white border-[3px] border-[#1E1B24] rounded-2xl p-6 shadow-[4px_4px_0_#1E1B24] min-h-[140px] flex flex-col justify-center">
                      <h3 className="text-xl font-outfit font-black text-[#1E1B24]">02. SUBMIT</h3>
                      <p className="font-rubik text-sm font-medium text-[#5C5866] mt-2">
                        Fill out your applicant details, portfolio links, and skill summaries.
                      </p>
                    </div>
                  </div>

                  {/* Step 03 */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl border-[3px] border-[#1E1B24] bg-[#3E9FFF] text-white flex items-center justify-center font-outfit font-black text-xl shadow-[3px_3px_0_#1E1B24]">
                        03
                      </div>
                      <div className="flex-1 h-1.5 bg-[#1E1B24] rounded-full"></div>
                    </div>
                    <div className="bg-white border-[3px] border-[#1E1B24] rounded-2xl p-6 shadow-[4px_4px_0_#1E1B24] min-h-[140px] flex flex-col justify-center">
                      <h3 className="text-xl font-outfit font-black text-[#1E1B24]">03. INTERACT</h3>
                      <p className="font-rubik text-sm font-medium text-[#5C5866] mt-2">
                        Shortlisted applicants engage in interactive domain discussions with team leads.
                      </p>
                    </div>
                  </div>

                  {/* Step 04 */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl border-[3px] border-[#1E1B24] bg-[#4EC37B] text-white flex items-center justify-center font-outfit font-black text-xl shadow-[3px_3px_0_#1E1B24]">
                        04
                      </div>
                    </div>
                    <div className="bg-white border-[3px] border-[#1E1B24] rounded-2xl p-6 shadow-[4px_4px_0_#1E1B24] min-h-[140px] flex flex-col justify-center">
                      <h3 className="text-xl font-outfit font-black text-[#1E1B24]">04. ONBOARD</h3>
                      <p className="font-rubik text-sm font-medium text-[#5C5866] mt-2">
                        Receive your acceptance badge, meet your team, and begin building!
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* FAQS SECTION (`#faqs`) */}
            <FAQSection />
          </div>
        )}

        {/* APPLICATION FORM VIEW (`/apply`) */}
        {currentTab === 'apply' && (
          <div>
            {!firstChoice ? (
              <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-6">
                <div className="bg-white border-[3px] border-[#1E1B24] rounded-3xl p-8 shadow-[6px_6px_0_#1E1B24] space-y-4">
                  <span className="neo-badge bg-[#FFD93D] text-[#1E1B24]">
                    1st Choice Role Required
                  </span>
                  <h2 className="text-2xl font-outfit font-black text-[#1E1B24]">
                    Please Select Your Compulsory 1st Role Choice
                  </h2>
                  <p className="font-rubik text-sm text-[#5C5866] font-medium">
                    Before filling out your personal details, select your 🥇 1st Choice domain role preference.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentTab('home');
                      setTimeout(() => {
                        const el = document.getElementById('domains');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="px-6 py-3 rounded-xl bg-[#3E9FFF] text-white font-rubik font-bold text-sm border-[3px] border-[#1E1B24] shadow-[4px_4px_0_#1E1B24] inline-flex items-center gap-2 cursor-pointer uppercase"
                  >
                    Go to Domain Selector →
                  </button>
                </div>
              </div>
            ) : (
              <ApplicationForm
                firstChoice={firstChoice}
                secondChoice={secondChoice}
                roles={roles}
                onChangePreferences={() => {
                  setCurrentTab('home');
                  setTimeout(() => {
                    const el = document.getElementById('domains');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                onApplicationSubmitted={(applicant) => {
                  setTrackedAppId(applicant.application_id);
                }}
                onTrackStatusDirectly={handleTrackStatusDirectly}
              />
            )}
          </div>
        )}

        {/* STATUS TRACKER VIEW (`/track`) */}
        {currentTab === 'track' && <StatusTracker initialAppId={trackedAppId} />}

        {/* ADMIN PORTAL VIEW (`/admin`) */}
        {currentTab === 'admin' && <AdminDashboard onSelectTab={setCurrentTab} />}
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

export default App;
