import React, { useState } from 'react';
import { IdCardGeneratorModal } from './IdCardGeneratorModal';
import { ExternalLink, Sparkles, CheckCircle2, ArrowRight, Code } from 'lucide-react';

export const TasksSection: React.FC = () => {
  const [showIdModal, setShowIdModal] = useState(false);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[var(--color-line)]">
      <IdCardGeneratorModal isOpen={showIdModal} onClose={() => setShowIdModal(false)} />

      {/* Header */}
      <div className="relative flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <img src="/images/robot_coder.png" alt="Robot Coder" className="absolute -right-4 -top-16 w-28 h-28 object-contain rounded-3xl border-[3px] border-[#14100b] bg-white shadow-[6px_6px_0_0_#14100b] rotate-6 hidden md:block hover:rotate-0 transition-transform" />
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-bg-dark)]/80 border border-[var(--color-saffron)]/30 text-[var(--color-saffron)] text-[11px] font-bold uppercase tracking-wider mb-3">
            <Code className="w-3.5 h-3.5 text-[var(--color-saffron)]" />
            <span>Trial Challenges</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[var(--color-text-primary)] tracking-tight">
            Build This <span className="glow-text">Selection Tasks</span>
          </h2>
          <p className="text-[var(--color-text-muted)] text-sm mt-2 max-w-xl">
            Complete one or more open trial tasks to move your application to the top of Alpha Selections.
          </p>
        </div>

        <div className="text-xs text-[var(--color-saffron)] font-mono flex items-center gap-2 bg-[var(--color-bg-card)] px-4 py-2 rounded-xl border border-[var(--color-line)]">
          <Sparkles className="w-4 h-4 text-[var(--color-saffron)]" />
          <span>TASKS ACTIVE • SUBMIT VIA GITHUB</span>
        </div>
      </div>

      {/* Task Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Task #1 */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[var(--color-saffron)]/40 relative overflow-hidden flex flex-col justify-between hover:border-[var(--color-saffron-hover)] transition-all group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-[var(--color-bg-dark)] text-[var(--color-saffron)] text-xs font-mono font-bold border border-[var(--color-saffron)]/30">
                TASK #1
              </span>
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Live Tool
              </span>
            </div>

            <h3 className="text-2xl font-black text-[var(--color-text-primary)] group-hover:text-[var(--color-saffron)] transition-colors">
              NeuraMorphix Photo ID & Builder Card Generator
            </h3>

            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              Design & generate your custom NeuraMorphix 2026 builder identity card. Personalized name, role, domain class, and 1-click output.
            </p>

            <ul className="space-y-2 text-xs text-[var(--color-text-muted)] pt-2 border-t border-[var(--color-line)]">
              <li className="flex items-center gap-2">
                <span className="text-[var(--color-saffron)] font-bold">✦</span>
                <span>Instantly recognizable NeuraMorphix identity</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[var(--color-saffron)] font-bold">✦</span>
                <span>Custom builder class & stack tagging</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[var(--color-saffron)] font-bold">✦</span>
                <span>1-click canvas download & badge generator</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-4 border-t border-[var(--color-line)] space-y-3">
            <button
              type="button"
              onClick={() => setShowIdModal(true)}
              className="w-full py-3 rounded-xl bg-[var(--color-saffron)] hover:bg-[var(--color-saffron-hover)] text-[var(--color-text-primary)] font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
            >
              <span>Launch Live ID Generator</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Task #2 */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[var(--color-line)] relative overflow-hidden flex flex-col justify-between hover:border-[var(--color-saffron)]/40 transition-all group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-[var(--color-bg-card)] text-[var(--color-text-muted)] text-xs font-mono font-bold border border-[var(--color-line)]">
                TASK #2
              </span>
              <span className="text-xs text-[var(--color-saffron)] font-mono">AI / RAG</span>
            </div>

            <h3 className="text-2xl font-black text-[var(--color-text-primary)] group-hover:text-[var(--color-saffron)] transition-colors">
              Voice-Enabled Neural RAG Engine
            </h3>

            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              Speak a query, get a grounded answer. Build a full voice-to-text RAG pipeline with engineered chunking, vector retrieval, and latency under 200ms.
            </p>

            <ul className="space-y-2 text-xs text-[var(--color-text-muted)] pt-2 border-t border-[var(--color-line)]">
              <li className="flex items-center gap-2">
                <span className="text-[var(--color-saffron)] font-bold">✦</span>
                <span>Real voice-to-text input (Web Speech API / Whisper)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[var(--color-saffron)] font-bold">✦</span>
                <span>Engineered vector retrieval & structured I/O</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[var(--color-saffron)] font-bold">✦</span>
                <span>Sub-200ms end-to-end benchmarked latency</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-4 border-t border-[var(--color-line)] space-y-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-dark)] text-[var(--color-text-primary)] font-extrabold text-xs flex items-center justify-center gap-2 border border-[var(--color-line)] transition-all"
            >
              <span>View Task Details & Spec</span>
              <ExternalLink className="w-3.5 h-3.5 text-[var(--color-saffron)]" />
            </a>
          </div>
        </div>

        {/* Task #3 */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[var(--color-line)] relative overflow-hidden flex flex-col justify-between hover:border-[var(--color-saffron)]/40 transition-all group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-[var(--color-bg-card)] text-[var(--color-text-muted)] text-xs font-mono font-bold border border-[var(--color-line)]">
                TASK #3
              </span>
              <span className="text-xs text-[var(--color-saffron)] font-mono">VISION & CHAIN</span>
            </div>

            <h3 className="text-2xl font-black text-[var(--color-text-primary)] group-hover:text-[var(--color-saffron)] transition-colors">
              Face ID & Blockchain Verification Pipeline
            </h3>

            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              Detect & encode a facial embedding from an input photo, find matching social media profile, and anchor tamper-evident hash to blockchain ledger.
            </p>

            <ul className="space-y-2 text-xs text-[var(--color-text-muted)] pt-2 border-t border-[var(--color-line)]">
              <li className="flex items-center gap-2">
                <span className="text-[var(--color-saffron)] font-bold">✦</span>
                <span>Face detection & feature embedding encoding</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[var(--color-saffron)] font-bold">✦</span>
                <span>Reverse-image search matching pipeline</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[var(--color-saffron)] font-bold">✦</span>
                <span>Immutable verification record output</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-4 border-t border-[var(--color-line)] space-y-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-dark)] text-[var(--color-text-primary)] font-extrabold text-xs flex items-center justify-center gap-2 border border-[var(--color-line)] transition-all"
            >
              <span>View Task Details & Spec</span>
              <ExternalLink className="w-3.5 h-3.5 text-[var(--color-saffron)]" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
