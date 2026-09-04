import { useState } from 'react';
import { DatabaseService } from './services/db';
import { NeuraMorphixLogo } from './components/NeuraMorphixLogo';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { RoleSelectionSection } from './components/RoleSelectionSection';
import { ApplicationForm } from './components/ApplicationForm';
import { StatusTracker } from './components/StatusTracker';
import { AdminDashboard } from './components/AdminDashboard';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Search,
  Award,
  Calendar,
  Lock,
} from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'apply' | 'track' | 'admin'>('home');

  // Selected Preferences state
  const [firstChoice, setFirstChoice] = useState<string | null>(null);
  const [secondChoice, setSecondChoice] = useState<string | null>(null);
  const [trackedAppId, setTrackedAppId] = useState<string | null>(null);

  const roles = DatabaseService.getRoles();
  const windowStatus = DatabaseService.isRecruitmentOpen();

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
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 relative">
      {/* Navigation Header */}
      <Header currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* INTERACTIVE STEP NAVIGATION BAR */}
      <div className="bg-slate-900/90 border-b border-slate-800/80 py-3 px-4 shadow-md sticky top-20 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-6 text-xs font-bold">
            <button
              type="button"
              onClick={() => setCurrentTab('home')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                currentTab === 'home'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-extrabold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-slate-950/40 flex items-center justify-center text-[10px]">1</span>
              <span>Select Roles</span>
            </button>

            <span className="text-slate-600 font-mono">→</span>

            <button
              type="button"
              onClick={() => setCurrentTab('apply')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                currentTab === 'apply'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-extrabold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-slate-950/40 flex items-center justify-center text-[10px]">2</span>
              <span>Fill Details</span>
            </button>

            <span className="text-slate-600 font-mono">→</span>

            <button
              type="button"
              onClick={() => setCurrentTab('track')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                currentTab === 'track'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-extrabold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-slate-950/40 flex items-center justify-center text-[10px]">3</span>
              <span>Track Status</span>
            </button>
          </div>

          {/* Back / Forward Step Buttons */}
          <div className="flex items-center gap-2">
            {currentTab === 'apply' && (
              <button
                type="button"
                onClick={() => setCurrentTab('home')}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Role Selection</span>
              </button>
            )}
            {currentTab === 'home' && firstChoice && (
              <button
                type="button"
                onClick={() => setCurrentTab('apply')}
                className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md transition-all cursor-pointer hover:scale-105"
              >
                <span>Proceed to Form</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            {currentTab === 'track' && (
              <button
                type="button"
                onClick={() => setCurrentTab('home')}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Home</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* RECRUITMENT CLOSED BANNER IF APPLICABLE */}
      {!windowStatus.isOpen && (
        <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 border-b border-rose-500/50 py-3 px-4 text-center">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-rose-200 text-xs font-bold">
            <Lock className="w-4 h-4 text-rose-400" />
            <span>{windowStatus.message} Existing applicants can still track status. Admins can manually reopen.</span>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main className="flex-1">
        {/* HOME & TEAM EXPLORATION VIEW */}
        {currentTab === 'home' && (
          <div>
            {/* HERO SECTION */}
            <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/10 via-violet-500/10 to-pink-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

              <div className="flex justify-center mb-6">
                <NeuraMorphixLogo size={80} />
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-6 shadow-inner">
                <Sparkles className="w-3.5 h-3.5" />
                NeuraMorphix Recruitment 2026
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
                Shape the Future of <br />
                <span className="glow-text">AI & Intelligent Technologies</span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
                Join NeuraMorphix's multidisciplinary teams pushing boundaries in Artificial Intelligence, Web/App Development, IoT, UI/UX, Hardware, Research, and Operations.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                {windowStatus.isOpen ? (
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('roles-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-8 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-sm flex items-center gap-2 shadow-[0_0_30px_rgba(56,189,248,0.35)] transition-transform hover:scale-105"
                  >
                    Select Role Preferences & Apply
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCurrentTab('track')}
                    className="px-8 py-3.5 rounded-2xl bg-slate-800 text-slate-300 font-extrabold text-sm flex items-center gap-2 border border-slate-700"
                  >
                    Track Existing Application Status
                    <Search className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setCurrentTab('track')}
                  className="px-6 py-3.5 rounded-2xl glass-panel text-slate-200 font-semibold text-sm hover:border-cyan-400/50 transition-colors flex items-center gap-2"
                >
                  <Search className="w-4 h-4 text-cyan-400" />
                  Check Application Status
                </button>
              </div>

              {/* Recruitment Info Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16 text-left">
                <div className="p-5 rounded-2xl glass-panel border-cyan-500/20">
                  <Calendar className="w-6 h-6 text-cyan-400 mb-2" />
                  <h3 className="text-sm font-bold text-white">Recruitment Date</h3>
                  <p className="text-xs text-slate-400 mt-1">05 September 2026 – 18 September 2026</p>
                </div>

                <div className="p-5 rounded-2xl glass-panel border-amber-500/20">
                  <Award className="w-6 h-6 text-amber-400 mb-2" />
                  <h3 className="text-sm font-bold text-white">Dual Role Choice System</h3>
                  <p className="text-xs text-slate-400 mt-1">Select 1st Preference & 2nd Preference across 10 specialized teams.</p>
                </div>

                <div className="p-5 rounded-2xl glass-panel border-emerald-500/20">
                  <ShieldCheck className="w-6 h-6 text-emerald-400 mb-2" />
                  <h3 className="text-sm font-bold text-white">Automated Notifications</h3>
                  <p className="text-xs text-slate-400 mt-1">Receive immediate status updates via automated email engine.</p>
                </div>
              </div>
            </section>

            {/* ROLE SELECTION SECTION */}
            <RoleSelectionSection
              roles={roles}
              firstChoice={firstChoice}
              secondChoice={secondChoice}
              onSelectFirstChoice={handleSelectFirstChoice}
              onSelectSecondChoice={handleSelectSecondChoice}
              onClearPreferences={handleClearPreferences}
              onProceedToForm={handleProceedToForm}
            />
          </div>
        )}

        {/* APPLY APPLICATION FORM VIEW */}
        {currentTab === 'apply' && (
          <div>
            {!firstChoice ? (
              <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-6">
                <div className="p-8 rounded-2xl glass-panel border-amber-500/30 space-y-4">
                  <span className="px-3 py-1 rounded-full bg-amber-950 text-amber-300 text-xs font-bold uppercase">
                    1st Choice Role Required
                  </span>
                  <h2 className="text-2xl font-bold text-white">Please Select Your Compulsory 1st Role Choice</h2>
                  <p className="text-sm text-slate-300">
                    Before filling out your personal details, you must select your 🥇 1st Choice team preference (2nd Choice is optional).
                  </p>
                  <button
                    type="button"
                    onClick={() => setCurrentTab('home')}
                    className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg inline-flex items-center gap-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Go to Interactive Role Selector
                  </button>
                </div>
              </div>
            ) : (
              <ApplicationForm
                firstChoice={firstChoice}
                secondChoice={secondChoice}
                roles={roles}
                onChangePreferences={() => setCurrentTab('home')}
                onApplicationSubmitted={(applicant) => {
                  setTrackedAppId(applicant.application_id);
                }}
                onTrackStatusDirectly={handleTrackStatusDirectly}
              />
            )}
          </div>
        )}

        {/* APPLICATION STATUS TRACKER VIEW */}
        {currentTab === 'track' && <StatusTracker initialAppId={trackedAppId} />}

        {/* ADMIN RECRUITMENT PORTAL VIEW */}
        {currentTab === 'admin' && <AdminDashboard onSelectTab={setCurrentTab} />}
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

export default App;
