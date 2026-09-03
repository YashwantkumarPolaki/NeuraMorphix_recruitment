import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: 'Who can participate in NeuraMorphix recruitment?',
      answer: 'Anyone passionate about building intelligence systems! Whether you are a developer, designer, AI researcher, hardware engineer, or product strategist — you are welcome here. Candidates apply individually and choose 1st & 2nd preference roles.',
    },
    {
      question: 'How does the selection process work in NeuraMorphix?',
      answer: 'First, submit your application with role preferences. Next, participate in Open Trial tasks (Photo ID Generator, Voice RAG, etc.). Top performers move through Alpha, Beta, and Charlie interview stages before final cohort residency placement.',
    },
    {
      question: 'Is there a registration or application fee?',
      answer: 'No! Participation and application in NeuraMorphix recruitment is completely free. Selected cohort members receive hardware workstations, cloud credits, and monthly stipends.',
    },
    {
      question: 'Can I apply to multiple teams simultaneously?',
      answer: 'Yes! Our Dual Preference System allows you to pick a Primary (1st Choice) and Secondary (2nd Choice) role across AI, Web, Mobile, IoT, UI/UX, Hardware, and Research teams.',
    },
    {
      question: 'What should I submit for the trial challenges?',
      answer: 'Submit your public GitHub repository link along with an unedited screen recording demonstrating your code running end to end. High signal, working code is prioritized above all.',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-slate-900">
      <div className="text-center space-y-3 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>Clear Signal</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Frequently Asked <span className="glow-text">Questions</span>
        </h2>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          Everything you need to know about applying, selection stages, and cohort residency.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={faq.question}
            className="glass-panel rounded-2xl border border-slate-800/80 overflow-hidden transition-all"
          >
            <button
              type="button"
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-white text-sm hover:text-cyan-300 transition-colors"
            >
              <span>{faq.question}</span>
              <ChevronDown
                className={`w-4 h-4 text-cyan-400 shrink-0 transition-transform ${
                  openIdx === idx ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openIdx === idx && (
              <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-900 pt-3 animate-fadeIn">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
