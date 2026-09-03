import React, { useState } from 'react';
import { Calendar, Compass, Layers, Zap, Target } from 'lucide-react';

interface TimelineStep {
  phase: string;
  title: string;
  date: string;
  description: string;
  status: 'Completed' | 'Active' | 'Upcoming';
}

export const SelectionRoadmap: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'rhythm'>('roadmap');

  const roadmapSteps: TimelineStep[] = [
    {
      phase: '01',
      title: 'Registration Begins',
      date: '05 September 2026',
      description: 'Applications open for all 6 core multidisciplinary teams. Choose 1st and 2nd preference roles.',
      status: 'Active',
    },
    {
      phase: '02',
      title: 'Open Trials & Builder Tasks',
      date: '08 September 2026',
      description: 'Skill-based challenges open to all applicants: Photo ID Generator, Voice RAG, and Blockchain Face ID.',
      status: 'Active',
    },
    {
      phase: '03',
      title: 'Alpha Shortlisting',
      date: '12 September 2026',
      description: 'First screening based on Open Trial task submissions, GitHub repositories, and portfolio work.',
      status: 'Upcoming',
    },
    {
      phase: '04',
      title: 'Beta Technical Review',
      date: '15 September 2026',
      description: 'Deep technical architecture review and code quality assessment by domain engineering leads.',
      status: 'Upcoming',
    },
    {
      phase: '05',
      title: 'Charlie Interviews',
      date: '17 September 2026',
      description: '1-on-1 interview and team-fit evaluation with Lead Recruiter Dr. Sarah Vance & tech leads.',
      status: 'Upcoming',
    },
    {
      phase: '06',
      title: 'Final Cohort Residency',
      date: '18 September 2026',
      description: 'Final team placement confirmation, hardware kit dispatch, and cohort residency onboarding.',
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
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Selection & Residency Journey</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            The Roadmap <span className="glow-text">at a Glance</span>
          </h2>
          <p className="text-slate-400 text-sm mt-2 max-w-xl">
            From initial registration and trial tasks to final team residency — every milestone engineered for clarity.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('roadmap')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'roadmap'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Selection Roadmap</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('rhythm')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'rhythm'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
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
              className={`p-6 rounded-3xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                step.status === 'Active'
                  ? 'bg-slate-900/90 border-cyan-500/50 shadow-xl shadow-cyan-500/10'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-cyan-400 font-mono">
                    #{step.phase}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                      step.status === 'Active'
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40 animate-pulse'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    {step.status}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{step.date}</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-white">{step.title}</h3>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>PHASE {step.phase}</span>
                <span>NEURAMOPRHIX 2026</span>
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
              className="glass-panel p-6 rounded-3xl border border-slate-800 relative overflow-hidden space-y-4 flex flex-col justify-between hover:border-cyan-500/40 transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-xl bg-cyan-950 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/30">
                    {item.day}
                  </span>
                  <span className="text-xs font-bold text-slate-500 font-mono">0{idx + 1} / 04</span>
                </div>

                <div>
                  <h3 className="text-xl font-black text-white group-hover:text-cyan-300 transition-colors">
                    {item.subtitle}
                  </h3>
                  <div className="text-xs font-semibold text-cyan-400 mt-0.5 italic">
                    "{item.tagline}"
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-900 flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                <Target className="w-3.5 h-3.5 text-cyan-400" />
                <span>Sprint Milestone</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
