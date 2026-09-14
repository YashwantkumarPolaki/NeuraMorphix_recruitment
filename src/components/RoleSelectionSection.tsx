import React, { useState, useEffect } from 'react';
import type { Role } from '../types/recruitment';
import { RoleCard } from './RoleCard';
import { ArrowRight, RefreshCw, CheckCircle2, AlertCircle, Filter } from 'lucide-react';

interface RoleSelectionSectionProps {
  roles: Role[];
  firstChoice: string | null;
  secondChoice: string | null;
  selectedDomainFilter?: string;
  onSelectFirstChoice: (roleName: string) => void;
  onSelectSecondChoice: (roleName: string) => void;
  onClearPreferences: () => void;
  onProceedToForm: () => void;
}

export const RoleSelectionSection: React.FC<RoleSelectionSectionProps> = ({
  roles,
  firstChoice,
  secondChoice,
  selectedDomainFilter = 'all',
  onSelectFirstChoice,
  onSelectSecondChoice,
  onClearPreferences,
  onProceedToForm,
}) => {
  const [warningMsg, setWarningMsg] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>(selectedDomainFilter);

  useEffect(() => {
    if (selectedDomainFilter) {
      setActiveFilter(selectedDomainFilter.toLowerCase());
    }
  }, [selectedDomainFilter]);

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

  // Filter roles based on active 3 Core Domains
  const filteredRoles = roles.filter((role) => {
    if (activeFilter === 'all') return true;
    const lowerName = role.role_name.toLowerCase();
    if (activeFilter === 'technical') return lowerName.startsWith('technical');
    if (activeFilter === 'non-technical') return lowerName.startsWith('non-technical');
    if (activeFilter === 'entrepreneurship') return lowerName.startsWith('entrepreneurship') || lowerName.includes('startup');
    return lowerName.includes(activeFilter);
  });

  return (
    <section id="roles-section" className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {warningMsg && (
        <div className="mb-6 flex items-center justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold shadow-xs">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            {warningMsg}
          </div>
        </div>
      )}

      {/* Selected Preferences Summary Banner */}
      <div className="mb-8 p-6 glass-panel bg-white border border-[var(--color-line)] shadow-sm rounded-2xl relative">
        <img src="/images/running_cheetah.png" alt="Running Cheetah" className="absolute -right-4 -top-12 w-28 h-28 object-contain rounded-2xl border-2 border-[#14100b] bg-white shadow-[3px_3px_0_0_#14100b] rotate-6 hidden sm:block hover:rotate-0 transition-transform z-20" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-xs font-outfit font-extrabold uppercase tracking-wider text-blue-600 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              Your Selected Preferences
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-1">
              <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[var(--color-bg-dark)] border border-[var(--color-line)]">
                <span className="text-xl">🥇</span>
                <div>
                  <div className="text-[10px] font-outfit font-extrabold text-blue-700 uppercase tracking-wider">First Choice (Compulsory) *</div>
                  <div className="text-sm font-rubik font-bold text-[var(--color-text-primary)]">
                    {firstChoice || <span className="text-slate-400 italic font-normal">Select 1st choice role below...</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[var(--color-bg-dark)] border border-[var(--color-line)]">
                <span className="text-xl">🥈</span>
                <div>
                  <div className="text-[10px] font-outfit font-extrabold text-indigo-700 uppercase tracking-wider">Second Choice (Optional)</div>
                  <div className="text-sm font-rubik font-bold text-[var(--color-text-primary)]">
                    {secondChoice || <span className="text-slate-400 italic font-normal">Select 2nd choice role...</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            {(firstChoice || secondChoice) && (
              <button
                type="button"
                onClick={onClearPreferences}
                className="px-4 py-2.5 rounded-xl text-xs font-rubik font-bold bg-slate-100 text-[var(--color-text-muted)] border border-[var(--color-line)] hover:bg-slate-200 hover:text-[var(--color-text-primary)] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Clear
              </button>
            )}

            <button
              type="button"
              disabled={!firstChoice}
              onClick={onProceedToForm}
              className={`px-6 py-3 rounded-xl text-xs font-rubik font-bold flex items-center gap-2 transition-all uppercase tracking-wider ${
                firstChoice
                  ? 'cyber-btn-primary'
                  : 'bg-slate-100 text-slate-400 border border-[var(--color-line)] cursor-not-allowed opacity-50'
              }`}
            >
              Fill Application Form
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Domain Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-[var(--color-line)]">
        <div className="flex items-center gap-2 text-xs font-outfit font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
          <Filter className="w-4 h-4 text-blue-600" />
          <span>Filter Roles by Domain:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All Sub-Domains (15)' },
            { id: 'technical', label: '💻 Technical' },
            { id: 'non-technical', label: '🎨 Non-Technical' },
            { id: 'entrepreneurship', label: '🚀 Entrepreneurship & Startups' },
          ].map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-2 rounded-xl border text-xs font-rubik font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white text-[var(--color-text-muted)] border-[var(--color-line)] hover:bg-[var(--color-bg-dark)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoles.map((role) => (
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

      {/* BOTTOM CTA — shown after selecting 1st choice */}
      {firstChoice && (
        <div className="mt-12">
          <div className="max-w-2xl mx-auto p-8 glass-panel bg-white border border-[var(--color-line)] shadow-sm rounded-3xl text-center space-y-4">
            <div className="flex justify-center">
              <span className="cyber-badge bg-emerald-50 border border-emerald-200 text-emerald-700">
                ROLE SELECTION COMPLETE
              </span>
            </div>

            <h3 className="text-2xl font-outfit font-bold text-[var(--color-text-primary)]">
              Ready to Fill Your Details!
            </h3>

            <p className="font-rubik text-sm text-[var(--color-text-muted)] max-w-md mx-auto leading-relaxed">
              Click below to enter your contact details, portfolio links, and skills to finalize your submission.
            </p>

            <button
              type="button"
              onClick={onProceedToForm}
              className="cyber-btn-primary text-xs py-3.5 px-8"
            >
              <span>FILL APPLICATION DETAILS NOW</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
