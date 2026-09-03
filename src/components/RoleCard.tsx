import React from 'react';
import type { Role } from '../types/recruitment';
import { TeamIcon } from './TeamIcons';
import { Check, Star, Award } from 'lucide-react';

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
      className={`relative group rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between ${
        isFirst
          ? 'bg-slate-900/90 border-2 border-cyan-400 shadow-[0_0_25px_rgba(56,189,248,0.35)] scale-[1.02]'
          : isSecond
          ? 'bg-slate-900/90 border-2 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.35)] scale-[1.02]'
          : 'glass-card hover:bg-slate-800/80 border-slate-700/60'
      }`}
    >
      {/* Top Preference Badges */}
      <div className="absolute -top-3 right-4 flex gap-2 z-10">
        {isFirst && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500 text-slate-950 shadow-md">
            <Award className="w-3.5 h-3.5" />
            🥇 1st Choice
          </span>
        )}
        {isSecond && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950 shadow-md">
            <Star className="w-3.5 h-3.5" />
            🥈 2nd Choice
          </span>
        )}
      </div>

      <div>
        {/* Header Icon & Title */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`p-3.5 rounded-xl transition-colors ${
              isFirst
                ? 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-400/50'
                : isSecond
                ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-400/50'
                : 'bg-slate-800/90 text-cyan-400 group-hover:bg-slate-700'
            }`}
          >
            <TeamIcon name={role.icon_name} className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
              {role.role_name}
            </h3>
            <span className="text-xs font-medium text-slate-400">NeuraMorphix Team</span>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-sm text-slate-300 mb-5 leading-relaxed">{role.description}</p>

        {/* Relevant Skills */}
        <div className="mb-6">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
            Relevant Skills
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {role.skills.map((skill, idx) => (
              <span
                key={idx}
                className={`text-xs px-2.5 py-1 rounded-md border font-medium ${
                  isFirst
                    ? 'bg-cyan-950/60 border-cyan-700/50 text-cyan-200'
                    : isSecond
                    ? 'bg-amber-950/60 border-amber-700/50 text-amber-200'
                    : 'bg-slate-800/80 border-slate-700/80 text-slate-300'
                }`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5 pt-4 border-t border-slate-800">
        <button
          type="button"
          onClick={() => onSelectFirstChoice(role.role_name)}
          className={`px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            isFirst
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-300'
              : 'bg-slate-800/90 text-slate-300 hover:bg-cyan-950/50 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/50'
          }`}
        >
          {isFirst ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              Selected 1st
            </>
          ) : (
            'Select as 1st Choice'
          )}
        </button>

        <button
          type="button"
          onClick={() => onSelectSecondChoice(role.role_name)}
          className={`px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            isSecond
              ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/30 ring-2 ring-amber-300'
              : 'bg-slate-800/90 text-slate-300 hover:bg-amber-950/50 hover:text-amber-300 border border-slate-700 hover:border-amber-500/50'
          }`}
        >
          {isSecond ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              Selected 2nd
            </>
          ) : (
            'Select as 2nd Choice'
          )}
        </button>
      </div>
    </div>
  );
};
