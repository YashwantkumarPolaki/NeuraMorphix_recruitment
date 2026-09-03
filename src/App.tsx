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
  ShieldCheck,
  Search,
  Award,
  Calendar,
  Lock,
  GraduationCap,
  Briefcase,
} from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'apply' | 'track' | 'admin'>('home');
  const [showRoleModal, setShowRoleModal] = useState<boolean>(() => {
    try {
      return !sessionStorage.getItem('neuramorphix_entry_selected');
    } catch {
      return true;
    }
  });

  // Selected Preferences state
  const [firstChoice, setFirstChoice] = useState<string | null>(null);
  const [secondChoice, setSecondChoice] = useState<string | null>(null);

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

  const handleSelectCandidateRole = () => {
    try {
      sessionStorage.setItem('neuramorphix_entry_selected', 'candidate');
    } catch {}
    setShowRoleModal(false);
    setCurrentTab('home');
  };

  const handleSelectEmployeeRole = () => {
    try {
      sessionStorage.setItem('neuramorphix_entry_selected', 'employee');
    } catch {}
    setShowRoleModal(false);
    setCurrentTab('admin');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 relative">
      {/* INITIAL ENTRY ROLE SELECTION GATEWAY MODAL */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel max-w-xl w-full p-8 rounded-3xl border border-cyan-500/30 shadow-2xl relative overflow-hidden space-y-6 text-center">
            {/* Ambient Background Glow Accent */}
            <div className="absolute -top-24 -right-24 w-60 h-60 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex justify-center mb-2">
              <NeuraMorphixLogo size={64} />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                NeuraMorphix Portal Gateway
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight">Welcome to NeuraMorphix</h2>
              <p className="text-sm text-slate-300 mt-2 max-w-md mx-auto">
                Please select your portal access type to proceed:
              </p>
            </div>

            {/* Role Options Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Option: I am candidate */}
              <button
                type="button"
                onClick={handleSelectCandidateRole}
                className="p-6 rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-700/80 hover:border-cyan-400 text-left transition-all group flex flex-col justify-between hover:shadow-xl hover:shadow-cyan-500/10 cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform border border-cyan-500/30">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white group-hover:text-cyan-300 transition-colors">
                      I am candidate
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Explore available teams, apply for open roles, or track your application status.
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-1 text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
                  <span>Enter Candidate Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>

              {/* Option: I am employee */}
              <button
                type="button"
                onClick={handleSelectEmployeeRole}
                className="p-6 rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-700/80 hover:border-cyan-400 text-left transition-all group flex flex-col justify-between hover:shadow-xl hover:shadow-cyan-500/10 cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform border border-blue-500/30">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white group-hover:text-cyan-300 transition-colors">
                      I am employee
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Recruiter & administrator sign in (moni@neuramophrix.com).
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-1 text-xs font-bold text-blue-400 group-hover:translate-x-1 transition-transform">
                  <span>Sign In as Employee</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Header */}
      <Header currentTab={currentTab} onSelectTab={setCurrentTab} onOpenRoleModal={() => setShowRoleModal(true)} />

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
            {!firstChoice || !secondChoice ? (
              <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-6">
                <div className="p-8 rounded-2xl glass-panel border-amber-500/30 space-y-4">
                  <span className="px-3 py-1 rounded-full bg-amber-950 text-amber-300 text-xs font-bold uppercase">
                    Role Preference Required
                  </span>
                  <h2 className="text-2xl font-bold text-white">Please Select Your Two Role Preferences</h2>
                  <p className="text-sm text-slate-300">
                    Before filling out your personal information, you must select your 🥇 1st Choice and 🥈 2nd Choice team preferences.
                  </p>
                  <button
                    type="button"
                    onClick={() => setCurrentTab('home')}
                    className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg inline-flex items-center gap-2"
                  >
                    Go to Interactive Role Selector
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <ApplicationForm
                firstChoice={firstChoice}
                secondChoice={secondChoice}
                roles={roles}
                onChangePreferences={() => setCurrentTab('home')}
                onApplicationSubmitted={() => {
                  // After submission keep user on submitted state or offer tracking
                }}
              />
            )}
          </div>
        )}

        {/* APPLICATION STATUS TRACKER VIEW */}
        {currentTab === 'track' && <StatusTracker />}

        {/* ADMIN RECRUITMENT PORTAL VIEW */}
        {currentTab === 'admin' && <AdminDashboard onSelectTab={setCurrentTab} />}
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

export default App;
