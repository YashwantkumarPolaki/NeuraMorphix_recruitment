import React from 'react';
import { NeuraMorphixLogo } from './NeuraMorphixLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/80 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <NeuraMorphixLogo size={28} />
            <span className="text-lg font-black tracking-wider text-white">NEURAMORPHIX</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Building the next generation of artificial intelligence, intelligent systems, hardware integration, and full-stack software products.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Recruitment Period</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>Opening Date: <strong className="text-cyan-300">05 September 2026</strong></li>
            <li>Closing Deadline: <strong className="text-rose-300">18 September 2026</strong></li>
            <li>Cycle: <strong className="text-white">Annual Team Recruitment 2026</strong></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Contact & Support</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>Email: <a href="mailto:recruitment@neuramorphix.org" className="text-cyan-400 hover:underline">recruitment@neuramorphix.org</a></li>
            <li>Web: <span className="text-slate-300">neuramorphix.org</span></li>
            <li>Location: Innovation Hub</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">System Features</h4>
          <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-400">
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800">Role Preference Engine</span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800">Auto Email Dispatch</span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800">Recruitment Platform</span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800">Status Progress Stepper</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-900 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
        <div>© 2026 NeuraMorphix. All rights reserved.</div>
        <div className="mt-2 sm:mt-0 font-medium">NeuraMorphix Team Recruitment Platform</div>
      </div>
    </footer>
  );
};
