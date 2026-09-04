import React, { useState } from 'react';
import type { Role } from '../types/recruitment';
import { RoleCard } from './RoleCard';
import { Sparkles, ArrowRight, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

interface RoleSelectionSectionProps {
  roles: Role[];
  firstChoice: string | null;
  secondChoice: string | null;
  onSelectFirstChoice: (roleName: string) => void;
  onSelectSecondChoice: (roleName: string) => void;
  onClearPreferences: () => void;
  onProceedToForm: () => void;
}

export const RoleSelectionSection: React.FC<RoleSelectionSectionProps> = ({
  roles,
  firstChoice,
  secondChoice,
  onSelectFirstChoice,
  onSelectSecondChoice,
  onClearPreferences,
  onProceedToForm,
}) => {
  const [warningMsg, setWarningMsg] = useState<string | null>(null);

  const handleSelectFirst = (roleName: string) => {
    setWarningMsg(null);
    if (secondChoice === roleName) {
      setWarningMsg(`Swapped choices! "${roleName}" is now your 1st Preference.`);
    }
    onSelectFirstChoice(roleName);
  };

  const handleSelectSecond = (roleName: string) => {
    setWarningMsg(null);
    if (firstChoice === roleName) {
      setWarningMsg(`Swapped choices! "${roleName}" is now your 2nd Preference.`);
    }
    onSelectSecondChoice(roleName);
  };

  return (
    <section id="roles-section" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-4 shadow-inner">
          <Sparkles className="w-3.5 h-3.5" />
          Interactive Role Selection
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
          Choose Your <span className="glow-text">NeuraMorphix Team Preferences</span>
        </h2>
        <p className="text-slate-300 text-base leading-relaxed">
          Selecting your <strong>1st Choice Role is compulsory</strong>. A <strong>2nd Choice Role is optional</strong>. Explore all 10 specialized teams below.
        </p>

        {/* Counter Indicator Widget */}
        <div className="mt-6 inline-flex items-center gap-3 px-6 py-2.5 rounded-2xl glass-panel border-slate-700/80">
          <span className="text-sm font-semibold text-slate-300">Role Status:</span>
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-lg text-xs font-extrabold font-mono transition-all ${
                firstChoice
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
              }`}
            >
              {firstChoice ? '1st Choice Selected (Ready to Apply)' : '1st Choice Required (Compulsory)'}
            </span>
            {secondChoice && (
              <span className="px-3 py-1 rounded-lg text-xs font-extrabold font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/50">
                + 2nd Choice Added (Optional)
              </span>
            )}
          </div>
        </div>

        {warningMsg && (
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-200 text-xs font-medium animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            {warningMsg}
          </div>
        )}
      </div>

      {/* Selected Preferences Summary Banner */}
      <div className="mb-10 p-6 rounded-2xl glass-panel border-cyan-500/20 bg-slate-900/80 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Your Selected Roles
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-1">
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-950/80 border border-cyan-500/40">
                <span className="text-xl">🥇</span>
                <div>
                  <div className="text-[10px] text-cyan-400 uppercase font-bold">First Choice (Compulsory) *</div>
                  <div className="text-sm font-bold text-cyan-300">
                    {firstChoice || <span className="text-rose-400 italic">Select compulsory 1st role below...</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-xl">🥈</span>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Second Choice (Optional)</div>
                  <div className="text-sm font-bold text-amber-300">
                    {secondChoice || <span className="text-slate-500 italic">Optional (Select 2nd preference)...</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            {(firstChoice || secondChoice) && (
              <button
                type="button"
                onClick={onClearPreferences}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Clear Selection
              </button>
            )}

            <button
              type="button"
              disabled={!firstChoice}
              onClick={onProceedToForm}
              className={`px-6 py-3 rounded-xl text-sm font-extrabold flex items-center gap-2 transition-all shadow-lg ${
                firstChoice
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-500/25 ring-2 ring-cyan-300 cursor-pointer hover:scale-105'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
              }`}
            >
              Fill Application Details
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid of 10 Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <RoleCard
            key={role.role_id}
            role={role}
            firstChoice={firstChoice}
            secondChoice={secondChoice}
            onSelectFirstChoice={handleSelectFirst}
            onSelectSecondChoice={handleSelectSecond}
          />
        ))}
      </div>

      {/* ===== BOTTOM CTA — shown after selecting 1st choice ===== */}
      {firstChoice && (
        <div className="mt-12 animate-fadeIn">
          {/* Summary recap */}
          <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 text-center space-y-5">
            <div className="flex justify-center">
              <span className="px-4 py-1.5 rounded-full bg-emerald-950 text-emerald-300 text-xs font-bold uppercase border border-emerald-500/30 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Role Selection Done
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
              Ready to Apply!
            </h3>

            {/* Chosen roles recap */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950 border border-cyan-500/40">
                <span className="text-xl">🥇</span>
                <div className="text-left">
                  <div className="text-[10px] text-cyan-400 font-bold uppercase">1st Choice</div>
                  <div className="text-cyan-300 font-bold text-xs">{firstChoice}</div>
                </div>
              </div>
              {secondChoice ? (
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950 border border-amber-500/40">
                  <span className="text-xl">🥈</span>
                  <div className="text-left">
                    <div className="text-[10px] text-amber-400 font-bold uppercase">2nd Choice</div>
                    <div className="text-amber-300 font-bold text-xs">{secondChoice}</div>
                  </div>
                </div>
              ) : (
                <div className="px-4 py-2 rounded-xl bg-slate-950/60 border border-slate-700 text-slate-500 text-xs italic">
                  No 2nd choice (optional)
                </div>
              )}
            </div>

            <p className="text-slate-400 text-xs max-w-md mx-auto">
              Click below to fill in your personal information, skills, and experience to complete your NeuraMorphix 2026 recruitment application.
            </p>

            {/* Primary CTA button */}
            <button
              type="button"
              onClick={onProceedToForm}
              className="w-full sm:w-auto mx-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-base flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(56,189,248,0.35)] ring-2 ring-cyan-300 transition-all hover:scale-105 cursor-pointer"
            >
              Fill Application Details
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={onClearPreferences}
              className="text-xs text-slate-500 hover:text-slate-300 underline transition-colors"
            >
              Reset selection and start over
            </button>
          </div>
        </div>
      )}

      {/* ===== MOBILE STICKY BOTTOM BAR — appears after 1st choice selected ===== */}
      {firstChoice && (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-slate-950/95 backdrop-blur-md border-t border-cyan-500/30 px-4 py-3 shadow-[0_-4px_24px_rgba(6,182,212,0.15)]">
          <div className="flex items-center gap-3 max-w-lg mx-auto">
            <div className="flex-1 min-w-0">
              <div className="text-[10px] text-cyan-400 font-bold uppercase">Selected:</div>
              <div className="text-xs font-bold text-white truncate">{firstChoice}</div>
              {secondChoice && (
                <div className="text-[10px] text-amber-300 truncate">+ {secondChoice}</div>
              )}
            </div>
            <button
              type="button"
              onClick={onProceedToForm}
              className="shrink-0 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-lg cursor-pointer transition-all active:scale-95"
            >
              Fill Application
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom padding to avoid mobile sticky bar covering content */}
      {firstChoice && <div className="md:hidden h-20" />}
    </section>
  );
};
