import React, { useState } from 'react';
import { Pin, Bell, CheckCircle2 } from 'lucide-react';

interface Notice {
  id: string;
  title: string;
  category: 'Announcement' | 'Task Update' | 'Deadline' | 'Live Session';
  date: string;
  content: string;
  isPinned?: boolean;
}

export const NoticeBoard: React.FC = () => {
  const [notices] = useState<Notice[]>([
    {
      id: 'notice-1',
      title: 'Open Trials & Task Submissions Now Live',
      category: 'Task Update',
      date: 'Sep 06, 2026',
      content: 'Tasks #1 (Photo ID Generator), #2 (Voice RAG), and #3 (Face ID) are now active. Submit your github repo & demo videos before Alpha Selections.',
      isPinned: true,
    },
    {
      id: 'notice-2',
      title: 'Live Q&A Session with Lead Recruiter',
      category: 'Live Session',
      date: 'Sep 10, 2026 • 4:00 PM IST',
      content: 'Join Google Meet for team allocations, stipend details, and selection criteria walkthrough.',
      isPinned: true,
    },
    {
      id: 'notice-3',
      title: 'Annual Team Residency Stipend & Perks Announced',
      category: 'Announcement',
      date: 'Sep 05, 2026',
      content: 'Selected candidates for the 2026 cohort receive high-performance hardware access, fiber internet workstation, cloud credits, and monthly stipend.',
      isPinned: false,
    },
  ]);

  const [activeNotice, setActiveNotice] = useState<Notice | null>(notices[0]);

  return (
    <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto w-full bg-[var(--color-bg-paper)]">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[var(--color-line)] gap-4">
        <div>
          <div className="cyber-badge bg-blue-50 border-blue-200 text-blue-700 mb-2">
            <Pin className="w-3.5 h-3.5 text-blue-600" />
            <span>Pinned Up</span>
          </div>
          <h2 className="text-3xl font-outfit font-black text-[var(--color-text-primary)] tracking-tight">Notice Board</h2>
          <p className="text-xs font-rubik text-[var(--color-text-muted)] mt-1">Official announcements & live trial updates from NeuraMorphix Labs.</p>
        </div>

        <div className="flex items-center gap-2 text-xs font-rubik font-semibold text-[var(--color-text-muted)] bg-white px-3.5 py-2 rounded-xl border border-[var(--color-line)] shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Notice Engine Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notice List */}
        <div className="lg:col-span-1 space-y-3">
          {notices.map((notice) => (
            <div
              key={notice.id}
              onClick={() => setActiveNotice(notice)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                activeNotice?.id === notice.id
                  ? 'bg-white border-blue-600 shadow-md'
                  : 'bg-white border-[var(--color-line)] hover:border-[var(--color-saffron)] shadow-xs'
              }`}
            >
              {notice.isPinned && (
                <div className="absolute top-3 right-3 text-blue-600">
                  <Pin className="w-3.5 h-3.5 fill-blue-50" />
                </div>
              )}
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold uppercase border border-blue-200">
                  {notice.category}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">{notice.date}</span>
              </div>
              <h3 className="text-sm font-outfit font-bold text-[var(--color-text-primary)] transition-colors line-clamp-1">
                {notice.title}
              </h3>
              <p className="text-xs font-rubik text-[var(--color-text-muted)] mt-1 line-clamp-2 leading-relaxed">
                {notice.content}
              </p>
            </div>
          ))}
        </div>

        {/* Notice Detail Panel */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-[var(--color-line)] shadow-md relative overflow-hidden flex flex-col justify-between">
          {activeNotice ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-mono">{activeNotice.date}</span>
                    <h4 className="text-lg font-outfit font-bold text-[var(--color-text-primary)]">{activeNotice.title}</h4>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase border border-blue-200">
                  {activeNotice.category}
                </span>
              </div>

              <div className="text-sm font-rubik text-[var(--color-text-muted)] leading-relaxed space-y-3 pt-2">
                <p>{activeNotice.content}</p>
                <div className="p-4 rounded-xl bg-[var(--color-bg-dark)] border border-[var(--color-line)] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verified Official Communication</span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">ID: {activeNotice.id}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 font-rubik">
              Select a notice to view details
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>NeuraMorphix Recruitment Notice Board 2026</span>
            <span className="text-blue-600 font-bold">STATUS: BROADCASTING</span>
          </div>
        </div>
      </div>
    </section>
  );
};
