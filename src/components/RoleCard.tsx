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
      className={`relative rounded-3xl p-6 transition-all duration-200 flex flex-col justify-between border-[3px] border-[#1E1B24] ${
        isFirst
          ? 'bg-[#FFFEEF] shadow-[6px_6px_0_#FF4B4B] ring-2 ring-[#FF4B4B]'
          : isSecond
          ? 'bg-[#FFFEEF] shadow-[6px_6px_0_#FFD93D] ring-2 ring-[#FFD93D]'
          : 'bg-white shadow-[4px_4px_0_#1E1B24] hover:shadow-[6px_6px_0_#1E1B24] hover:-translate-y-1'
      }`}
    >
      {/* Top Preference Badges */}
      <div className="absolute -top-3.5 right-4 flex gap-2 z-10">
        {isFirst && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-outfit font-black bg-[#FF4B4B] text-white border-[2px] border-[#1E1B24] shadow-[2px_2px_0_#1E1B24]">
            <Award className="w-3.5 h-3.5" />
            🥇 1st Choice
          </span>
        )}
        {isSecond && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-outfit font-black bg-[#FFD93D] text-[#1E1B24] border-[2px] border-[#1E1B24] shadow-[2px_2px_0_#1E1B24]">
            <Star className="w-3.5 h-3.5" />
            🥈 2nd Choice
          </span>
        )}
      </div>

      <div>
        {/* Header Icon & Title */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`p-3.5 rounded-2xl border-[3px] border-[#1E1B24] shadow-[3px_3px_0_#1E1B24] ${
              isFirst
                ? 'bg-[#FF4B4B] text-white'
                : isSecond
                ? 'bg-[#FFD93D] text-[#1E1B24]'
                : 'bg-[#3E9FFF] text-white'
            }`}
          >
            <TeamIcon name={role.icon_name} className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-outfit font-black text-[#1E1B24]">
              {role.role_name}
            </h3>
            <span className="text-xs font-rubik font-bold text-[#5C5866] uppercase tracking-wider">
              NeuraMorphix Team
            </span>
          </div>
        </div>

        {/* Short Description */}
        <p className="font-rubik text-sm text-[#5C5866] font-medium mb-5 leading-relaxed">
          {role.description}
        </p>

        {/* Relevant Skills */}
        <div className="mb-6">
          <h4 className="text-[11px] font-outfit font-black text-[#1E1B24] uppercase tracking-wider mb-2">
            Key Skills
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {role.skills.map((skill, idx) => (
              <span
                key={idx}
                className="text-xs font-rubik font-bold px-2.5 py-1 rounded-lg bg-[#FAF7EE] border-[2px] border-[#1E1B24] text-[#1E1B24]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5 pt-4 border-t-[2px] border-dashed border-[#1E1B24]">
        <button
          type="button"
          onClick={() => onSelectFirstChoice(role.role_name)}
          className={`px-3 py-2.5 rounded-xl text-xs font-rubik font-bold flex items-center justify-center gap-1.5 border-[2px] border-[#1E1B24] transition-all cursor-pointer ${
            isFirst
              ? 'bg-[#FF4B4B] text-white shadow-[2px_2px_0_#1E1B24]'
              : 'bg-white hover:bg-[#FAF7EE] text-[#1E1B24] shadow-[2px_2px_0_#1E1B24]'
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
          className={`px-3 py-2.5 rounded-xl text-xs font-rubik font-bold flex items-center justify-center gap-1.5 border-[2px] border-[#1E1B24] transition-all cursor-pointer ${
            isSecond
              ? 'bg-[#FFD93D] text-[#1E1B24] shadow-[2px_2px_0_#1E1B24]'
              : 'bg-white hover:bg-[#FAF7EE] text-[#1E1B24] shadow-[2px_2px_0_#1E1B24]'
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
