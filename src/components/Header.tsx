import React from 'react';
import { DatabaseService } from '../services/db';
import { NeuraMorphixLogo } from './NeuraMorphixLogo';
import { Search, UserPlus } from 'lucide-react';

interface HeaderProps {
  currentTab: 'home' | 'apply' | 'track' | 'admin';
  onSelectTab: (tab: 'home' | 'apply' | 'track' | 'admin') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onSelectTab }) => {
  const windowStatus = DatabaseService.isRecruitmentOpen();
  const [timeStr, setTimeStr] = React.useState('');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-slate-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <div
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0"
        >
          <NeuraMorphixLogo size={36} />
          <div>
            <span className="text-base sm:text-xl font-extrabold tracking-wider text-white group-hover:text-cyan-300 transition-colors">
              NEURAMORPHIX
            </span>
            {/* Full subtitle — desktop only */}
            <div className="hidden sm:flex items-center gap-2 text-[10px] text-slate-400 font-semibold uppercase tracking-widest">
              <span>Recruitment 2026</span>
              <span className="text-cyan-400">•</span>
              <span className="text-slate-300">05 Sep – 18 Sep 2026</span>
              {timeStr && (
                <>
                  <span className="text-cyan-400">•</span>
                  <span className="text-cyan-300 font-mono font-bold">{timeStr}</span>
                </>
              )}
            </div>
            {/* Compact — mobile only */}
            <div className="flex sm:hidden text-[9px] text-slate-400 font-semibold uppercase tracking-wide">
              Recruitment 2026
            </div>
          </div>
        </div>

        {/* Navigation Tabs — desktop only */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => onSelectTab('home')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              currentTab === 'home'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Explore Teams
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('apply')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentTab === 'apply'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Apply Now
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('track')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentTab === 'track'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            Track Status
          </button>
        </nav>

        {/* Recruitment Status Pill */}
        <div className="flex items-center shrink-0">
          <span
            className={`px-2.5 sm:px-3.5 py-1.5 rounded-full text-[10px] sm:text-xs font-extrabold flex items-center gap-1.5 border shadow-inner ${
              windowStatus.isOpen
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                : 'bg-rose-950/80 text-rose-300 border-rose-500/40'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                windowStatus.isOpen ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-rose-400'
              }`}
            ></span>
            <span className="hidden sm:inline">{windowStatus.isOpen ? 'RECRUITMENT OPEN' : 'RECRUITMENT CLOSED'}</span>
            <span className="sm:hidden">{windowStatus.isOpen ? 'OPEN' : 'CLOSED'}</span>
          </span>
        </div>
      </div>

      {/* Mobile bottom nav tabs — only visible on mobile */}
      <div className="flex md:hidden border-t border-slate-800 bg-slate-950/95">
        <button
          type="button"
          onClick={() => onSelectTab('home')}
          className={`flex-1 py-2.5 text-[11px] font-bold transition-all flex flex-col items-center gap-0.5 ${
            currentTab === 'home' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-500'
          }`}
        >
          <span>🏠</span>
          <span>Teams</span>
        </button>
        <button
          type="button"
          onClick={() => onSelectTab('apply')}
          className={`flex-1 py-2.5 text-[11px] font-bold transition-all flex flex-col items-center gap-0.5 ${
            currentTab === 'apply' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-500'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Apply</span>
        </button>
        <button
          type="button"
          onClick={() => onSelectTab('track')}
          className={`flex-1 py-2.5 text-[11px] font-bold transition-all flex flex-col items-center gap-0.5 ${
            currentTab === 'track' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-500'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Track</span>
        </button>
      </div>
    </header>
  );
};
