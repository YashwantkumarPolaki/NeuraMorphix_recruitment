import { useState } from 'react';
import { DatabaseService } from './services/db';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { RoleSelectionSection } from './components/RoleSelectionSection';
import { ApplicationForm } from './components/ApplicationForm';
import { StartupAssessmentForm } from './components/StartupAssessmentForm';
import { StatusTracker } from './components/StatusTracker';
import { AdminDashboard } from './components/AdminDashboard';
import { FAQSection } from './components/FAQSection';
import { SelectionRoadmap } from './components/SelectionRoadmap';
import {
  Code,
  GraduationCap,
  Users,
  TrendingUp,
  Terminal,
  Briefcase,
  Rocket,
  Lock,
  Sparkles,
  Zap,
  CheckCircle2,
  Award,
  ArrowRight,
  Cpu,
  Flame,
  Timer,
} from 'lucide-react';

type Tab = 'home' | 'apply' | 'track' | 'admin' | 'startup';

const FOUNDING_TEAM_ROLE_NAME = 'Entrepreneurship - Startup Track';

function getInitialTab(): Tab {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname.replace(/\/+$/, '').toLowerCase();
  if (path === '/admin') return 'admin';
  if (path === '/startup') return 'startup';
  return 'home';
}

function getInitialFirstChoice(): string | null {
  if (typeof window === 'undefined') return null;
  const path = window.location.pathname.replace(/\/+$/, '').toLowerCase();
  if (path === '/startup') return FOUNDING_TEAM_ROLE_NAME;
  return null;
}

export function App() {
  const [currentTab, setCurrentTabState] = useState<Tab>(getInitialTab);

  const setCurrentTab = (tab: Tab) => {
    setCurrentTabState(tab);
    try {
      const nextPath = tab === 'admin' ? '/admin' : tab === 'startup' ? '/startup' : '/';
      if (window.location.pathname !== nextPath) {
        window.history.replaceState(null, '', nextPath);
      }
    } catch {
      // ignore (e.g. non-browser environments)
    }
  };

  // Selected Preferences state
  const [firstChoice, setFirstChoice] = useState<string | null>(getInitialFirstChoice);
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

  const handleJoinStartupTrack = () => {
    setFirstChoice(FOUNDING_TEAM_ROLE_NAME);
    setCurrentTab('startup');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    setCurrentTab(firstChoice === FOUNDING_TEAM_ROLE_NAME ? 'startup' : 'apply');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTrackStatusDirectly = (appId: string) => {
    setTrackedAppId(appId);
    setCurrentTab('track');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg-paper)] text-[var(--color-text-primary)] font-body selection:bg-[var(--color-saffron)] selection:text-white relative overflow-x-hidden">
      {/* Navigation Header */}
      <Header currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* RECRUITMENT CLOSED BANNER IF APPLICABLE */}
      {!windowStatus.isOpen && (
        <div className="bg-rose-600 text-white border-b border-rose-700 py-3 px-4 text-center font-rubik font-bold text-xs shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <Lock className="w-4 h-4 text-white" />
            <span>{windowStatus.message} Existing applicants can still track status. Admins can manually reopen.</span>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main className="flex-1">
        {/* HOME & LANDING VIEW */}
        {currentTab === 'home' && (
          <div className="bg-[var(--color-bg-paper)]">
            {/* LIVE ANNOUNCEMENT MARQUEE BANNER */}
            <div className="bg-blue-600 py-2.5 font-mono text-[11px] font-bold uppercase tracking-widest text-white flex items-center overflow-hidden select-none shadow-xs">
              <div className="animate-marquee whitespace-nowrap flex items-center gap-12 shrink-0">
                <span className="flex items-center gap-2"><Zap className="w-3.5 h-3.5" /> NEURAMORPHIX 2026 RECRUITMENT IS LIVE</span>
                <span className="flex items-center gap-2"><Sparkles className="w-3.5 h-3.5" /> 10 SPECIALIST TEAMS HIRING NOW</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5" /> SELECTION STAGE 1 ACTIVE</span>
                <span className="flex items-center gap-2"><Award className="w-3.5 h-3.5" /> RESIDENCY STIPEND & HARDWARE PERKS</span>
                <span className="flex items-center gap-2"><Zap className="w-3.5 h-3.5" /> NEURAMORPHIX 2026 RECRUITMENT IS LIVE</span>
                <span className="flex items-center gap-2"><Sparkles className="w-3.5 h-3.5" /> 10 SPECIALIST TEAMS HIRING NOW</span>
              </div>
            </div>

            {/* HERO SECTION - Crisp Uniform Light Mode Canvas */}
            <section className="relative w-full min-h-[85vh] flex flex-col lg:flex-row items-center justify-between px-6 md:px-16 py-16 lg:py-24 gap-12 overflow-hidden border-b border-[var(--color-line)] bg-[var(--color-bg-paper)]">
              {/* Soft Ambient Orbs */}
              <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[var(--color-saffron)]/10 rounded-full blur-[140px] pointer-events-none -z-0"></div>
              <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-amber-400/10 rounded-full blur-[140px] pointer-events-none -z-0"></div>

              {/* Left Column Content */}
              <div className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left max-w-2xl gap-6">
                <img src="/bears.png" alt="Bears mascot" className="absolute -left-6 -top-16 w-28 h-28 object-contain rounded-3xl border-[3px] border-[#14100b] bg-white shadow-[6px_6px_0_0_#14100b] -rotate-6 hidden lg:block hover:rotate-0 transition-transform" />
                <div className="cyber-badge bg-[var(--color-saffron)]/10 border-[var(--color-saffron)]/30 text-[var(--color-saffron)]">
                  <Cpu className="w-3.5 h-3.5 text-[var(--color-saffron)]" />
                  <span>NEURAMORPHIX RECRUITMENT 2026 • OFFICIAL PORTAL</span>
                </div>

                <h1 className="font-outfit font-black text-5xl md:text-6xl lg:text-[70px] text-[var(--color-text-primary)] leading-[108%] tracking-tight">
                  Architect the <br />
                  <span className="gradient-text-cyan glow-text">Next Frontier</span> of <br />
                  Artificial Intelligence
                </h1>

                <p className="font-rubik text-[var(--color-text-muted)] text-base md:text-lg max-w-lg leading-relaxed font-normal">
                  Join NeuraMorphix — SRMIST's elite student ecosystem of AI researchers, full-stack engineers, creative strategists, media directors, and startup builders.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-2 w-full">
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('domains');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="cyber-btn-primary w-full sm:w-auto text-sm py-4 px-8 shadow-blue-500/20"
                  >
                    <span>APPLY NOW FOR 2026</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('domains');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full sm:w-auto px-8 py-4 rounded-xl font-rubik font-bold text-xs uppercase tracking-wider bg-white text-[var(--color-text-muted)] border border-slate-300 hover:border-blue-500 hover:text-blue-600 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                  >
                    <span>EXPLORE DOMAINS</span>
                  </button>
                </div>
              </div>

              {/* Right Column Mascot */}
              <div className="relative z-10 flex flex-col items-center justify-center w-full lg:w-auto lg:min-w-[420px]">
                <img src="/images/elephant.png" alt="Elephant mascot" className="w-full max-w-[380px] object-contain drop-shadow-2xl" />
              </div>
            </section>

            {/* CULTURE / ABOUT SECTION (`#about`) */}
            <div id="about" className="w-full flex flex-col items-center bg-[var(--color-bg-paper)] border-t border-[var(--color-line)]">
              <section className="relative w-full max-w-7xl py-16 px-6 sm:px-8 lg:py-24 flex flex-col items-center gap-12">
                <div className="flex flex-col items-center gap-4 text-center max-w-2xl">
                  <div className="cyber-badge bg-rose-50 border-rose-200 text-rose-700">
                    <span>CULTURE AT NEURAMORPHIX</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-outfit font-black text-[var(--color-text-primary)] tracking-tight">
                    Why You'll Thrive With Us
                  </h2>
                  <p className="font-rubik text-base lg:text-lg font-normal text-[var(--color-text-muted)] leading-relaxed">
                    We combine high-impact AI research, full-stack software, creative production, and startup incubation into one collaborative environment.
                  </p>
                </div>

                {/* 4 Feature Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                  {/* Innovate Card */}
                  <div className="cyber-card p-6 flex flex-col gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--color-saffron)]/10 border border-[var(--color-saffron)]/30 text-[var(--color-saffron)] flex items-center justify-center shadow-xs">
                      <Code className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-xl font-outfit font-bold text-[var(--color-text-primary)]">Innovate</h3>
                      <p className="font-rubik text-xs font-normal text-[var(--color-text-muted)] leading-relaxed">
                        Turn ambitious ideas into production-ready web applications, machine learning pipelines, and creative media.
                      </p>
                    </div>
                  </div>

                  {/* Master Card */}
                  <div className="cyber-card p-6 flex flex-col gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shadow-xs">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-xl font-outfit font-bold text-[var(--color-text-primary)]">Master</h3>
                      <p className="font-rubik text-xs font-normal text-[var(--color-text-muted)] leading-relaxed">
                        Learn modern tech stacks, AI agent architecture, UI/UX design systems, public relations, and leadership.
                      </p>
                    </div>
                  </div>

                  {/* Collaborate Card */}
                  <div className="cyber-card p-6 flex flex-col gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shadow-xs">
                      <Users className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-xl font-outfit font-bold text-[var(--color-text-primary)]">Collaborate</h3>
                      <p className="font-rubik text-xs font-normal text-[var(--color-text-muted)] leading-relaxed">
                        Partner with top student talent across software engineering, graphic design, content writing, and event ops.
                      </p>
                    </div>
                  </div>

                  {/* Elevate Card */}
                  <div className="cyber-card p-6 flex flex-col gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shadow-xs">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-xl font-outfit font-bold text-[var(--color-text-primary)]">Elevate</h3>
                      <p className="font-rubik text-xs font-normal text-[var(--color-text-muted)] leading-relaxed">
                        Spearhead major projects, compete in hackathons, publish original research, and build a resume that stands out.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* JOIN OUR STARTUP URGENCY CTA (`#join-startup`) */}
            <div id="join-startup" className="w-full flex flex-col items-center bg-[var(--color-bg-paper)] border-t border-[var(--color-line)]">
              <section className="relative w-full max-w-7xl mx-6 sm:mx-8 my-12 lg:my-16 rounded-[28px] overflow-hidden border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-amber-50 shadow-[0_12px_40px_-8px_rgba(5,150,105,0.15)]">
                <div className="absolute -top-16 -right-16 w-64 h-64 bg-emerald-400/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[var(--color-saffron)]/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 px-6 sm:px-10 py-10 lg:py-12">
                  <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-4 max-w-2xl">
                    <div className="cyber-badge bg-rose-50 border-rose-200 text-rose-600 animate-pulse">
                      <Flame className="w-3.5 h-3.5" />
                      <span>LIMITED SLOTS · CLOSING SOON</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-outfit font-black text-[var(--color-text-primary)] tracking-tight leading-tight">
                      Want to Join Our Startup?
                    </h2>
                    <p className="font-rubik text-sm sm:text-base font-normal text-[var(--color-text-muted)] leading-relaxed">
                      We're onboarding founding team members for the NeuraMorphix startup track right now — pitch decks, product, and go-to-market. Seats are limited and filling fast, so don't wait until the window closes.
                    </p>
                    <div className="flex items-center gap-2 text-xs font-rubik font-bold uppercase tracking-wider text-emerald-700">
                      <Timer className="w-4 h-4" />
                      <span>Only a few founding seats remain this cycle</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={handleJoinStartupTrack}
                      className="cyber-btn-primary text-sm py-4 px-8 bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-emerald-500/30"
                    >
                      <Rocket className="w-4 h-4" />
                      <span>JOIN THE STARTUP TRACK</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <span className="font-rubik text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                      Limited slots · Apply before they're gone
                    </span>
                  </div>
                </div>
              </section>
            </div>

            {/* DOMAINS & OPEN ROLES SECTION (`#domains`) */}
            <div id="domains" className="w-full flex flex-col items-center bg-[var(--color-bg-paper)] border-t border-[var(--color-line)]">
              <section className="relative w-full max-w-7xl py-16 px-6 sm:px-8 lg:py-24 flex flex-col items-center gap-12">
                <img src="/images/vr_cow.png" alt="VR Cow mascot" className="absolute right-2 top-6 w-28 h-28 object-contain rounded-3xl border-[3px] border-[#14100b] bg-white shadow-[6px_6px_0_0_#14100b] rotate-6 hidden lg:block hover:rotate-0 transition-transform" />
                <div className="flex flex-col items-center gap-4 text-center max-w-2xl">
                  <div className="cyber-badge bg-blue-50 border-blue-200 text-blue-700">
                    <span>JOB BOARD & DOMAIN EXPLORER</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-outfit font-black text-[var(--color-text-primary)] tracking-tight">
                    Explore Specialist Tracks
                  </h2>
                  <p className="font-rubik text-base lg:text-lg font-normal text-[var(--color-text-muted)] leading-relaxed">
                    Select positions across Technical, Non-Technical, and Entrepreneurship & Startups!
                  </p>
                </div>

                {/* 3 Core Domain Overview Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-4">
                  {/* 1. TECHNICAL DOMAIN */}
                  <div className="cyber-card p-6 flex flex-col justify-between gap-6">
                    <div className="space-y-4">
                      <div className="cyber-badge bg-blue-50 border-blue-200 text-blue-700">
                        <span>TECHNICAL</span>
                      </div>
                      <h3 className="text-xl font-outfit font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-blue-600 shrink-0" />
                        Web / App / AI / Cloud
                      </h3>
                      <p className="font-rubik text-xs text-[var(--color-text-muted)] leading-relaxed">
                        Frontend, backend, mobile apps, AI models, microcontrollers, cybersecurity, and deep learning.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDomainApply('technical')}
                      className="w-full py-3 rounded-xl font-rubik font-bold text-xs uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-600 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>VIEW TECHNICAL ROLES →</span>
                    </button>
                  </div>

                  {/* 2. NON-TECHNICAL DOMAIN */}
                  <div className="cyber-card p-6 flex flex-col justify-between gap-6">
                    <div className="space-y-4">
                      <div className="cyber-badge bg-indigo-50 border-indigo-200 text-indigo-700">
                        <span>NON-TECHNICAL</span>
                      </div>
                      <h3 className="text-xl font-outfit font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-indigo-600 shrink-0" />
                        Creatives / PR / Events
                      </h3>
                      <p className="font-rubik text-xs text-[var(--color-text-muted)] leading-relaxed">
                        UI/UX design, corporate sponsorships, public relations, event management, media production, and HR.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDomainApply('non-technical')}
                      className="w-full py-3 rounded-xl font-rubik font-bold text-xs uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>VIEW NON-TECH ROLES →</span>
                    </button>
                  </div>

                  {/* 3. ENTREPRENEURSHIP & STARTUPS DOMAIN */}
                  <div className="cyber-card p-6 flex flex-col justify-between gap-6">
                    <div className="space-y-4">
                      <div className="cyber-badge bg-emerald-50 border-emerald-200 text-emerald-700">
                        <span>STARTUPS</span>
                      </div>
                      <h3 className="text-xl font-outfit font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                        <Rocket className="w-5 h-5 text-emerald-600 shrink-0" />
                        Pitch Decks / Product
                      </h3>
                      <p className="font-rubik text-xs text-[var(--color-text-muted)] leading-relaxed">
                        Incubating tech startups, investor pitch decks, product strategy, market research, and business models.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDomainApply('entrepreneurship')}
                      className="w-full py-3 rounded-xl font-rubik font-bold text-xs uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-600 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>VIEW STARTUP ROLES →</span>
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
            <div id="process" className="w-full bg-[var(--color-bg-paper)] border-t border-[var(--color-line)]">
              <SelectionRoadmap />
            </div>

            {/* FAQS SECTION (`#faqs`) */}
            <FAQSection />
          </div>
        )}

        {/* APPLICATION FORM VIEW (`/apply`) */}
        {currentTab === 'apply' && (
          <div className="bg-[var(--color-bg-paper)] min-h-[80vh]">
            {!firstChoice ? (
              <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-6">
                <div className="cyber-card p-8 rounded-3xl space-y-4">
                  <span className="cyber-badge bg-rose-50 border-rose-200 text-rose-700">
                    1st Choice Role Required
                  </span>
                  <h2 className="text-2xl font-outfit font-bold text-[var(--color-text-primary)]">
                    Please Select Your 1st Role Choice
                  </h2>
                  <p className="font-rubik text-sm text-[var(--color-text-muted)]">
                    Before filling out your personal details, select your compulsory 🥇 1st Choice domain role preference.
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
                    className="cyber-btn-primary text-xs"
                  >
                    <span>GO TO DOMAIN SELECTOR</span>
                    <ArrowRight className="w-4 h-4" />
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

        {/* STARTUP & ENTREPRENEURSHIP FOUNDING TEAM ASSESSMENT (`/startup`) */}
        {currentTab === 'startup' && (
          <div className="bg-[var(--color-bg-paper)] min-h-[80vh]">
            <StartupAssessmentForm
              firstChoice={firstChoice || FOUNDING_TEAM_ROLE_NAME}
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
          </div>
        )}

        {/* STATUS TRACKER VIEW (`/track`) */}
        {currentTab === 'track' && (
          <div className="bg-[var(--color-bg-paper)] min-h-[80vh]">
            <StatusTracker initialAppId={trackedAppId} />
          </div>
        )}

        {/* ADMIN PORTAL VIEW (`/admin`) */}
        {currentTab === 'admin' && (
          <div className="bg-[var(--color-bg-paper)] min-h-[80vh]">
            <AdminDashboard onSelectTab={setCurrentTab} />
          </div>
        )}
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
export default App;
