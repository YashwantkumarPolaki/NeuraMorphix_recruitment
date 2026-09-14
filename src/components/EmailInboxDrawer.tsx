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
        className="fixed bottom-6 left-6 z-40 px-4 py-3 rounded-2xl glass-panel bg-[var(--color-bg-card)] text-[var(--color-saffron)] hover:text-[var(--color-text-primary)] border-[var(--color-saffron)]/40 shadow-2xl flex items-center gap-2.5 transition-all hover:scale-105"
      >
        <div className="relative">
          <Mail className="w-5 h-5" />
          {newUnreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-[var(--color-text-primary)] text-[10px] font-bold flex items-center justify-center">
              {newUnreadCount}
            </span>
          )}
        </div>
        <span className="text-xs font-bold">Simulated Sent Emails ({emailLogs.length})</span>
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-[#241c13]/60 backdrop-blur-md flex justify-end">
          <div className="w-full max-w-xl bg-[var(--color-bg-card)] border-l border-[var(--color-line)] h-full flex flex-col shadow-2xl animate-slideLeft">
            {/* Drawer Header */}
            <div className="p-6 border-b border-[var(--color-line)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-[var(--color-saffron)]" />
                <h3 className="text-lg font-bold text-[var(--color-text-primary)]">Sent Email Notification Logs</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
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
                    className="text-xs text-[var(--color-saffron)] hover:underline flex items-center gap-1 font-semibold"
                  >
                    ← Back to all sent emails
                  </button>

                  <div className="p-6 rounded-2xl glass-panel border-[var(--color-saffron)]/30 space-y-4">
                    <div className="border-b border-[var(--color-line)] pb-3">
                      <div className="text-[10px] text-[var(--color-saffron)] font-bold uppercase">To: {selectedEmail.recipient_email}</div>
                      <h4 className="text-base font-extrabold text-[var(--color-text-primary)] mt-1">{selectedEmail.subject}</h4>
                      <div className="text-[11px] text-[var(--color-text-muted)] mt-1 flex justify-between">
                        <span>App ID: {selectedEmail.application_id}</span>
                        <span>{new Date(selectedEmail.sent_at).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="text-xs text-[var(--color-text-primary)] whitespace-pre-wrap font-mono leading-relaxed bg-[var(--color-bg-dark)] p-4 rounded-xl border border-[var(--color-line)]">
                      {selectedEmail.body_html}
                    </div>

                    <div className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1 pt-2">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Sent automatically via NeuraMorphix Email Engine
                    </div>
                  </div>
                </div>
              ) : emailLogs.length === 0 ? (
                <div className="text-center py-16 text-[var(--color-text-muted)] text-xs">
                  No automated emails sent yet. Submit an application or trigger admin actions to view generated emails!
                </div>
              ) : (
                <div className="space-y-2">
                  {emailLogs.map((log) => (
                    <div
                      key={log.email_id}
                      onClick={() => setSelectedEmail(log)}
                      className="p-4 rounded-xl bg-[#241c13]/60 hover:bg-[var(--color-bg-dark)] border border-[var(--color-line)] transition-all cursor-pointer flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[var(--color-text-primary)]">{log.subject}</span>
                          <span className="px-2 py-0.5 rounded bg-[var(--color-bg-dark)] text-[var(--color-saffron)] text-[9px] font-bold uppercase">
                            {log.email_type}
                          </span>
                        </div>
                        <div className="text-[11px] text-[var(--color-text-muted)]">
                          To: {log.recipient_email} ({log.application_id})
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)]" />
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
