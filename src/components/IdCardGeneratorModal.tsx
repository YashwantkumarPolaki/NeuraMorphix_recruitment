import React, { useState, useRef } from 'react';
import { NeuraMorphixLogo } from './NeuraMorphixLogo';
import { Download, Sparkles, X, User } from 'lucide-react';

interface IdCardGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IdCardGeneratorModal: React.FC<IdCardGeneratorModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('Alex Vance');
  const [role, setRole] = useState('AI & Machine Learning Lead');
  const [builderClass, setBuilderClass] = useState('Neural Architect');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="glass-panel max-w-2xl w-full p-6 sm:p-8 rounded-3xl border border-cyan-500/40 shadow-2xl relative space-y-6 my-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-900 border border-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Task #1 — Identity Generator
          </div>
          <h2 className="text-2xl font-black text-white">NeuraMorphix Builder ID Generator</h2>
          <p className="text-xs text-slate-400">
            Customize your 2026 Cohort Builder ID badge and share your identity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Controls Form */}
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Builder Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Full Name"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Primary Role / Domain</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. AI / Full Stack / Hardware"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Builder Class</label>
              <select
                value={builderClass}
                onChange={(e) => setBuilderClass(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
              >
                <option value="Neural Architect">Neural Architect</option>
                <option value="Full-Stack Cyber Engineer">Full-Stack Cyber Engineer</option>
                <option value="Edge AI & IoT Specialist">Edge AI & IoT Specialist</option>
                <option value="Product & Design Visionary">Product & Design Visionary</option>
                <option value="Research Scientist">Research Scientist</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Upload Photo (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="w-full text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-950 file:text-cyan-300 hover:file:bg-cyan-900"
              />
            </div>
          </div>

          {/* Live ID Card Badge Preview */}
          <div className="flex flex-col items-center">
            <div
              ref={cardRef}
              className="w-full max-w-[280px] p-5 rounded-3xl bg-slate-950 border-2 border-cyan-500/60 shadow-2xl relative overflow-hidden space-y-4 text-center select-none"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-pink-500"></div>

              {/* Logo Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <NeuraMorphixLogo size={24} />
                  <span className="text-xs font-black text-white tracking-widest">NEURAMORPHIX</span>
                </div>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold">
                  2026 COHORT
                </span>
              </div>

              {/* Avatar / Photo */}
              <div className="w-20 h-20 rounded-2xl mx-auto border-2 border-cyan-400/80 p-1 bg-slate-900 relative overflow-hidden">
                {photoUrl ? (
                  <img src={photoUrl} alt="Builder Avatar" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <div className="w-full h-full rounded-xl bg-slate-900 flex items-center justify-center text-slate-500">
                    <User className="w-10 h-10 text-cyan-400/60" />
                  </div>
                )}
              </div>

              {/* Identity Info */}
              <div className="space-y-1">
                <h4 className="text-base font-black text-white tracking-tight">{name || 'Builder Name'}</h4>
                <p className="text-[11px] text-cyan-300 font-semibold">{role || 'Role Name'}</p>
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-300 text-[9px] font-bold font-mono border border-slate-800">
                  CLASS: {builderClass}
                </div>
              </div>

              {/* Footer Badge Barcode simulation */}
              <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-[8px] font-mono text-slate-500">
                <span>VERIFIED BUILDER</span>
                <span className="text-emerald-400 font-bold">ID #NMX-2026-HQ</span>
              </div>
            </div>

            <div className="mt-4 flex gap-2 w-full max-w-[280px]">
              <button
                type="button"
                onClick={() => alert(`ID Badge for ${name} generated! Take a screenshot or save frame.`)}
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-lg flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Save ID Card</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
