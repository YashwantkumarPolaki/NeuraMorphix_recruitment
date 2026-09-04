import React, { useState, useEffect } from 'react';
import type { EmailLog } from '../types/recruitment';
import { DatabaseService } from '../services/db';
import { Mail, X, CheckCircle2, ChevronRight } from 'lucide-react';

export const EmailInboxDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>(() => DatabaseService.getEmailLogs());
  const [selectedEmail, setSelectedEmail] = useState<EmailLog | null>(null);
  const [newUnreadCount, setNewUnreadCount] = useState(0);

  const fetchLogs = () => {
    const logs = DatabaseService.getEmailLogs();
    setEmailLogs(logs);
  };

  useEffect(() => {
    const handleEmailSent = (e: Event) => {
      fetchLogs();
      setNewUnreadCount((prev) => prev + 1);
      const customEvent = e as CustomEvent<EmailLog>;
      if (customEvent.detail) {
        setSelectedEmail(customEvent.detail);
      }
    };

    window.addEventListener('neuramorphix_email_sent', handleEmailSent);
    return () => {
      window.removeEventListener('neuramorphix_email_sent', handleEmailSent);
    };
  }, []);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setNewUnreadCount(0);
      fetchLogs();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        type="button"
        onClick={toggleOpen}
        className="fixed bottom-6 left-6 z-40 px-4 py-3 rounded-2xl glass-panel bg-slate-900/90 text-cyan-300 hover:text-white border-cyan-500/40 shadow-2xl flex items-center gap-2.5 transition-all hover:scale-105"
      >
        <div className="relative">
          <Mail className="w-5 h-5" />
          {newUnreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
              {newUnreadCount}
            </span>
          )}
        </div>
        <span className="text-xs font-bold">Simulated Sent Emails ({emailLogs.length})</span>
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex justify-end">
          <div className="w-full max-w-xl bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-slideLeft">
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white">Sent Email Notification Logs</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Split: Log List vs Email Preview */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedEmail ? (
                <div className="space-y-4 animate-fadeIn">
                  <button
                    type="button"
                    onClick={() => setSelectedEmail(null)}
                    className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    ← Back to all sent emails
                  </button>

                  <div className="p-6 rounded-2xl glass-panel border-cyan-500/30 space-y-4">
                    <div className="border-b border-slate-800 pb-3">
                      <div className="text-[10px] text-cyan-400 font-bold uppercase">To: {selectedEmail.recipient_email}</div>
                      <h4 className="text-base font-extrabold text-white mt-1">{selectedEmail.subject}</h4>
                      <div className="text-[11px] text-slate-400 mt-1 flex justify-between">
                        <span>App ID: {selectedEmail.application_id}</span>
                        <span>{new Date(selectedEmail.sent_at).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-200 whitespace-pre-wrap font-mono leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-850">
                      {selectedEmail.body_html}
                    </div>

                    <div className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1 pt-2">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Sent automatically via NeuraMorphix Email Engine
                    </div>
                  </div>
                </div>
              ) : emailLogs.length === 0 ? (
                <div className="text-center py-16 text-slate-500 text-xs">
                  No automated emails sent yet. Submit an application or trigger admin actions to view generated emails!
                </div>
              ) : (
                <div className="space-y-2">
                  {emailLogs.map((log) => (
                    <div
                      key={log.email_id}
                      onClick={() => setSelectedEmail(log)}
                      className="p-4 rounded-xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 transition-all cursor-pointer flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{log.subject}</span>
                          <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[9px] font-bold uppercase">
                            {log.email_type}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          To: {log.recipient_email} ({log.application_id})
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
