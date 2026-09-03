import React, { useState } from 'react';
import { IdCardGeneratorModal } from './IdCardGeneratorModal';
import { ExternalLink, Sparkles, CheckCircle2, ArrowRight, Code } from 'lucide-react';

export const TasksSection: React.FC = () => {
  const [showIdModal, setShowIdModal] = useState(false);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
      <IdCardGeneratorModal isOpen={showIdModal} onClose={() => setShowIdModal(false)} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold uppercase tracking-wider mb-3">
            <Code className="w-3.5 h-3.5 text-cyan-400" />
            <span>Trial Challenges</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Build This <span className="glow-text">Selection Tasks</span>
          </h2>
          <p className="text-slate-400 text-sm mt-2 max-w-xl">
            Complete one or more open trial tasks to move your application to the top of Alpha Selections.
          </p>
        </div>

        <div className="text-xs text-cyan-400 font-mono flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>TASKS ACTIVE • SUBMIT VIA GITHUB</span>
        </div>
      </div>

      {/* Task Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Task #1 */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/40 relative overflow-hidden flex flex-col justify-between hover:border-cyan-400 transition-all group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/30">
                TASK #1
              </span>
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Live Tool
              </span>
            </div>

            <h3 className="text-2xl font-black text-white group-hover:text-cyan-300 transition-colors">
              NeuraMorphix Photo ID & Builder Card Generator
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              Design & generate your custom NeuraMorphix 2026 builder identity card. Personalized name, role, domain class, and 1-click output.
            </p>

            <ul className="space-y-2 text-xs text-slate-400 pt-2 border-t border-slate-900">
              <li className="flex items-center gap-2">
                <span className="text-cyan-400 font-bold">✦</span>
                <span>Instantly recognizable NeuraMorphix identity</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400 font-bold">✦</span>
                <span>Custom builder class & stack tagging</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400 font-bold">✦</span>
                <span>1-click canvas download & badge generator</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-900 space-y-3">
            <button
              type="button"
              onClick={() => setShowIdModal(true)}
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
            >
              <span>Launch Live ID Generator</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Task #2 */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 relative overflow-hidden flex flex-col justify-between hover:border-cyan-500/40 transition-all group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-slate-900 text-slate-300 text-xs font-mono font-bold border border-slate-800">
                TASK #2
              </span>
              <span className="text-xs text-cyan-400 font-mono">AI / RAG</span>
            </div>

            <h3 className="text-2xl font-black text-white group-hover:text-cyan-300 transition-colors">
              Voice-Enabled Neural RAG Engine
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              Speak a query, get a grounded answer. Build a full voice-to-text RAG pipeline with engineered chunking, vector retrieval, and latency under 200ms.
            </p>

            <ul className="space-y-2 text-xs text-slate-400 pt-2 border-t border-slate-900">
              <li className="flex items-center gap-2">
                <span className="text-cyan-400 font-bold">✦</span>
                <span>Real voice-to-text input (Web Speech API / Whisper)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400 font-bold">✦</span>
                <span>Engineered vector retrieval & structured I/O</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400 font-bold">✦</span>
                <span>Sub-200ms end-to-end benchmarked latency</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-900 space-y-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all"
            >
              <span>View Task Details & Spec</span>
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            </a>
          </div>
        </div>

        {/* Task #3 */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 relative overflow-hidden flex flex-col justify-between hover:border-cyan-500/40 transition-all group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-slate-900 text-slate-300 text-xs font-mono font-bold border border-slate-800">
                TASK #3
              </span>
              <span className="text-xs text-cyan-400 font-mono">VISION & CHAIN</span>
            </div>

            <h3 className="text-2xl font-black text-white group-hover:text-cyan-300 transition-colors">
              Face ID & Blockchain Verification Pipeline
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              Detect & encode a facial embedding from an input photo, find matching social media profile, and anchor tamper-evident hash to blockchain ledger.
            </p>

            <ul className="space-y-2 text-xs text-slate-400 pt-2 border-t border-slate-900">
              <li className="flex items-center gap-2">
                <span className="text-cyan-400 font-bold">✦</span>
                <span>Face detection & feature embedding encoding</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400 font-bold">✦</span>
                <span>Reverse-image search matching pipeline</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400 font-bold">✦</span>
                <span>Immutable verification record output</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-900 space-y-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all"
            >
              <span>View Task Details & Spec</span>
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
