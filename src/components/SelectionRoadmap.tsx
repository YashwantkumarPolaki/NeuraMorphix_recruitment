import React, { useState } from 'react';
import { Compass, Layers, Zap, Target } from 'lucide-react';

interface TimelineStep {
  phase: string;
  title: string;
  description: string;
  status: 'Completed' | 'Active' | 'Upcoming';
}

export const SelectionRoadmap: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'rhythm'>('roadmap');

  const roadmapSteps: TimelineStep[] = [
    {
      phase: '01',
      title: 'Registration Begins',
      description: 'Applications open for all 10 core multidisciplinary teams. Choose 1st and 2nd preference roles.',
      status: 'Active',
    },
    {
      phase: '02',
      title: 'Open Trials & Builder Tasks',
      description: 'Skill-based challenges open to all applicants: Photo ID Generator, Voice RAG, and AI Agent Dev.',
      status: 'Active',
    },
    {
      phase: '03',
      title: 'Alpha Shortlisting',
      description: 'First screening based on Open Trial task submissions, GitHub repositories, and portfolio work.',
      status: 'Upcoming',
    },
    {
      phase: '04',
      title: 'Beta Technical Review',
      description: 'Deep technical architecture review and code quality assessment by domain engineering leads.',
      status: 'Upcoming',
    },
    {
      phase: '05',
      title: 'Charlie Interviews',
      description: '1-on-1 interview and team-fit evaluation with team leads.',
      status: 'Upcoming',
    },
    {
      phase: '06',
      title: 'Final Cohort Onboarding',
      description: 'Final team placement confirmation, hardware kit dispatch, and cohort onboarding.',
      status: 'Upcoming',
    },
  ];

  const rhythmDays = [
    {
      day: 'Day 01',
      subtitle: 'Genesis Day',
      tagline: 'Where it all begins',
      desc: 'Cohort orientation, stack selection, team formation, and system architecture setup.',
    },
    {
      day: 'Day 02',
      subtitle: 'Day of Triangle',
      tagline: 'Problem. Solution. Market.',
      desc: 'Refining core value propositions, vector model engineering, and API integration.',
    },
    {
      day: 'Day 03',
      subtitle: 'Build Day',
      tagline: 'Heads down. Ship or ship.',
      desc: '24-hour continuous sprint. Zero fluff, high-speed fiber, live debugging, and deployment.',
    },
    {
      day: 'Day 04',
      subtitle: 'Launch Day',
      tagline: 'The world watches',
      desc: 'Project presentations, live demo evaluation, bounties award, and final team allocation.',
    },
  ];

  return (
    <section className="py-16 lg:py-24 px-6 md:px-12 w-full max-w-7xl mx-auto bg-[var(--color-bg-paper)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 relative z-10">
        <img src="/images/startup_bear.png" alt="Startup Bear" className="absolute -left-6 -top-16 w-36 h-36 object-contain rounded-3xl border-[3px] border-[#14100b] bg-white shadow-[6px_6px_0_0_#14100b] -rotate-6 hidden md:block hover:rotate-0 transition-transform" />
        <div>
          <div className="cyber-badge bg-emerald-50 border-emerald-200 text-emerald-700 mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Selection & Onboarding Journey</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-outfit font-black text-[var(--color-text-primary)] tracking-tight">
            The Roadmap <span className="gradient-text-cyan">at a Glance</span>
          </h2>
          <p className="font-rubik text-[var(--color-text-muted)] font-normal text-sm sm:text-base mt-2 max-w-xl leading-relaxed">
            From initial registration and trial tasks to final team onboarding — every milestone engineered for clarity.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="bg-white p-1.5 rounded-2xl border border-[var(--color-line)] shadow-xs flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('roadmap')}
            className={`px-5 py-2.5 rounded-xl text-xs font-rubik font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'roadmap'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Selection Roadmap</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('rhythm')}
            className={`px-5 py-2.5 rounded-xl text-xs font-rubik font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'rhythm'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>4-Day Sprint Rhythm</span>
          </button>
        </div>
      </div>

      {activeTab === 'roadmap' ? (
        /* ROADMAP TIMELINE */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
          {roadmapSteps.map((step) => (
            <div
              key={step.phase}
              className="cyber-card p-6 flex flex-col justify-between gap-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-blue-600 font-outfit px-3 py-1 rounded-xl bg-blue-50 border border-blue-200">
                    #{step.phase}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-rubik font-bold uppercase tracking-wider border ${
                      step.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-[var(--color-bg-dark)] text-slate-500 border-[var(--color-line)]'
                    }`}
                  >
                    {step.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-outfit font-bold text-[var(--color-text-primary)]">{step.title}</h3>
                </div>

                <p className="text-xs font-rubik text-[var(--color-text-muted)] leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-bold font-mono">
                <span>PHASE {step.phase}</span>
                <span>NEURAMORPHIX 2026</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* 4-DAY SPRINT RHYTHM */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeIn">
          {rhythmDays.map((item, idx) => (
            <div
              key={item.day}
              className="cyber-card p-6 flex flex-col justify-between gap-6"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-xl bg-blue-50 text-blue-700 text-xs font-mono font-bold border border-blue-200">
                    {item.day}
                  </span>
                  <span className="text-xs font-bold text-slate-400 font-mono">0{idx + 1} / 04</span>
                </div>

                <div>
                  <h3 className="text-xl font-outfit font-bold text-[var(--color-text-primary)]">
                    {item.subtitle}
                  </h3>
                  <div className="text-xs font-rubik font-bold text-slate-500 mt-0.5">
                    "{item.tagline}"
                  </div>
                </div>

                <p className="text-xs font-rubik text-[var(--color-text-muted)] leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                <Target className="w-3.5 h-3.5 text-blue-600" />
                <span>Sprint Milestone</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
