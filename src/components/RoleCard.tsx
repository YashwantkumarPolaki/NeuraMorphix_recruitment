import React from 'react';
import type { Role } from '../types/recruitment';
import { TeamIcon } from './TeamIcons';
import { Check, Award, Star } from 'lucide-react';

interface RoleCardProps {
  role: Role;
  firstChoice: string | null;
  secondChoice: string | null;
  onSelectFirstChoice: (roleName: string) => void;
  onSelectSecondChoice: (roleName: string) => void;
}

export const RoleCard: React.FC<RoleCardProps> = ({
  role,
  firstChoice,
  secondChoice,
  onSelectFirstChoice,
  onSelectSecondChoice,
}) => {
  const isFirst = firstChoice === role.role_name;
  const isSecond = secondChoice === role.role_name;

  return (
    <div
      className={`relative rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between border bg-white ${
        isFirst
          ? 'border-2 border-blue-600 ring-4 ring-blue-500/10 shadow-md'
          : isSecond
          ? 'border-2 border-indigo-600 ring-4 ring-indigo-500/10 shadow-md'
          : 'border-[var(--color-line)] shadow-xs hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      {/* Top Preference Badges */}
      <div className="absolute -top-3.5 right-4 flex gap-2 z-10">
        {isFirst && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-outfit font-extrabold bg-blue-600 text-white shadow-xs uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            🥇 1st Choice
          </span>
        )}
        {isSecond && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-outfit font-extrabold bg-indigo-600 text-white shadow-xs uppercase tracking-wider">
            <Star className="w-3.5 h-3.5" />
            🥈 2nd Choice
          </span>
        )}
      </div>

      <div>
        {/* Header Icon & Title */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`p-3 rounded-xl border ${
              isFirst
                ? 'bg-blue-50 border-blue-200 text-blue-600'
                : isSecond
                ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                : 'bg-slate-100 border-[var(--color-line)] text-[var(--color-text-muted)]'
            }`}
          >
            <TeamIcon name={role.icon_name} className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-outfit font-bold text-[var(--color-text-primary)] leading-snug">
              {role.role_name}
            </h3>
            <span className="text-[11px] font-rubik font-semibold text-slate-500 uppercase tracking-wider">
              NeuraMorphix Team
            </span>
          </div>
        </div>

        {/* Short Description */}
        <p className="font-rubik text-xs text-[var(--color-text-muted)] font-normal mb-5 leading-relaxed">
          {role.description}
        </p>

        {/* Relevant Skills */}
        <div className="mb-6">
          <h4 className="text-[10px] font-outfit font-bold text-slate-400 uppercase tracking-widest mb-2">
            Key Tech & Skills
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {role.skills.map((skill, idx) => (
              <span
                key={idx}
                className="text-[11px] font-rubik font-medium px-2.5 py-1 rounded-lg bg-slate-100 border border-[var(--color-line)] text-[var(--color-text-muted)]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5 pt-4 border-t border-[var(--color-line)]">
        <button
          type="button"
          onClick={() => onSelectFirstChoice(role.role_name)}
          className={`px-3 py-2 rounded-xl text-xs font-rubik font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border uppercase tracking-wider ${
            isFirst
              ? 'bg-blue-600 text-white border-blue-600 shadow-xs hover:bg-blue-700'
              : 'bg-[var(--color-bg-dark)] text-[var(--color-text-muted)] border-[var(--color-line)] hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300'
          }`}
        >
          {isFirst ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              Selected 1st
            </>
          ) : (
            'Select 1st'
          )}
        </button>

        <button
          type="button"
          onClick={() => onSelectSecondChoice(role.role_name)}
          className={`px-3 py-2 rounded-xl text-xs font-rubik font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border uppercase tracking-wider ${
            isSecond
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs hover:bg-indigo-700'
              : 'bg-[var(--color-bg-dark)] text-[var(--color-text-muted)] border-[var(--color-line)] hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300'
          }`}
        >
          {isSecond ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              Selected 2nd
            </>
          ) : (
            'Select 2nd'
          )}
        </button>
      </div>
    </div>
  );
};
