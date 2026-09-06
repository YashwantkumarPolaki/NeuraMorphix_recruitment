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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFD93D] border-[2px] border-[#1E1B24] text-[#1E1B24] text-xs font-bold shadow-[2px_2px_0_#1E1B24]">
            <AlertCircle className="w-4 h-4 text-[#1E1B24] shrink-0" />
            {warningMsg}
          </div>
        </div>
      )}

      {/* Selected Preferences Summary Banner (Image 2) */}
      <div className="mb-8 p-6 bg-white border-[3px] border-[#1E1B24] rounded-2xl shadow-[6px_6px_0_#1E1B24] relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-xs font-outfit font-extrabold uppercase tracking-wider text-[#3E9FFF] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#3E9FFF]" />
              Your Chosen Preferences
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-1">
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#FAF7EE] border-[2px] border-[#1E1B24] shadow-[2px_2px_0_#1E1B24]">
                <span className="text-xl">🥇</span>
                <div>
                  <div className="text-[10px] font-outfit font-extrabold text-[#FF4B4B] uppercase">First Choice (Compulsory) *</div>
                  <div className="text-sm font-rubik font-bold text-[#1E1B24]">
                    {firstChoice || <span className="text-[#FF4B4B] italic">Select 1st choice role below...</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#FAF7EE] border-[2px] border-[#1E1B24] shadow-[2px_2px_0_#1E1B24]">
                <span className="text-xl">🥈</span>
                <div>
                  <div className="text-[10px] font-outfit font-extrabold text-[#5C5866] uppercase">Second Choice (Optional)</div>
                  <div className="text-sm font-rubik font-bold text-[#1E1B24]">
                    {secondChoice || <span className="text-[#5C5866] italic">Select 2nd choice role...</span>}
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
                className="px-4 py-2.5 rounded-xl text-xs font-rubik font-bold bg-white hover:bg-[#FAF7EE] text-[#1E1B24] border-[2px] border-[#1E1B24] shadow-[2px_2px_0_#1E1B24] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Clear
              </button>
            )}

            <button
              type="button"
              disabled={!firstChoice}
              onClick={onProceedToForm}
              className={`px-6 py-3 rounded-xl text-sm font-rubik font-bold flex items-center gap-2 transition-all border-[3px] border-[#1E1B24] ${
                firstChoice
                  ? 'bg-[#3E9FFF] text-white shadow-[4px_4px_0_#1E1B24] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#1E1B24] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_#1E1B24] cursor-pointer'
                  : 'bg-gray-200 text-gray-500 shadow-none cursor-not-allowed opacity-60'
              }`}
            >
              Fill Application Form
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Domain Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-2 border-b-[2px] border-dashed border-[#1E1B24]">
        <div className="flex items-center gap-2 text-xs font-outfit font-black text-[#1E1B24] uppercase">
          <Filter className="w-4 h-4 text-[#3E9FFF]" />
          <span>Filter Roles by Domain:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All Sub-Domains (15)', color: '#1E1B24' },
            { id: 'technical', label: '💻 Technical', color: '#FF4B4B' },
            { id: 'non-technical', label: '🎨 Non-Technical', color: '#FFD93D' },
            { id: 'entrepreneurship', label: '🚀 Entrepreneurship & Startups', color: '#4EC37B' },
          ].map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl border-[2px] border-[#1E1B24] font-rubik font-bold text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'text-white shadow-[2px_2px_0_#1E1B24]'
                    : 'bg-white text-[#1E1B24] hover:bg-[#FAF7EE]'
                }`}
                style={{
                  backgroundColor: isActive ? tab.color : undefined,
                  color: isActive && tab.id === 'non-technical' ? '#1E1B24' : undefined,
                }}
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
          <div className="max-w-2xl mx-auto p-6 bg-white border-[3px] border-[#1E1B24] rounded-3xl shadow-[8px_8px_0_#1E1B24] text-center space-y-4">
            <div className="flex justify-center">
              <span className="neo-badge bg-[#4EC37B] text-white">
                ROLE SELECTION COMPLETE
              </span>
            </div>

            <h3 className="text-2xl font-outfit font-black text-[#1E1B24]">
              Ready to Fill Your Details!
            </h3>

            <p className="font-rubik text-sm text-[#5C5866] max-w-md mx-auto font-medium">
              Click below to enter your information, skills, and portfolio links to complete your recruitment application.
            </p>

            <button
              type="button"
              onClick={onProceedToForm}
              className="px-10 py-3.5 rounded-xl bg-[#FF4B4B] text-white font-rubik font-bold text-base border-[3px] border-[#1E1B24] shadow-[4px_4px_0_#1E1B24] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#1E1B24] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_#1E1B24] transition-all cursor-pointer inline-flex items-center justify-center gap-2 uppercase tracking-wide"
            >
              Fill Application Details NOW →
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
