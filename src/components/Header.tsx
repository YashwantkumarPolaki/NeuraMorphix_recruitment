import { useState } from 'react';
import { NeuraMorphixLogo } from './NeuraMorphixLogo';
import { ChevronDown, Search } from 'lucide-react';

interface HeaderProps {
  currentTab: 'home' | 'apply' | 'track' | 'admin' | 'startup';
  onSelectTab: (tab: 'home' | 'apply' | 'track' | 'admin' | 'startup') => void;
}

export function Header({ currentTab, onSelectTab }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (hash: string) => {
    onSelectTab('home');
    setMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <nav className="sticky top-0 p-4 bg-[var(--color-bg-paper)]/95 backdrop-blur-md w-full flex justify-between items-center md:px-8 z-50 border-b border-[var(--color-line)] shadow-xs text-[var(--color-text-primary)]">
      {/* Brand Logo */}
      <button
        type="button"
        onClick={() => {
          onSelectTab('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity bg-transparent border-none text-left"
      >
        <NeuraMorphixLogo size={42} />
        <div className="flex flex-col">
          <span className="font-display font-bold text-xl tracking-tight text-[var(--color-text-primary)] flex items-center gap-1.5">
            NeuraMorphix
            <span className="w-2 h-2 rounded-full bg-[var(--color-saffron)] animate-pulse"></span>
          </span>
          <span className="font-mono-label font-bold text-[10px] uppercase tracking-widest text-[var(--color-saffron)]">
            Recruitment 2026
          </span>
        </div>
      </button>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-6 lg:gap-8">
        <button
          type="button"
          onClick={() => handleNavClick('#about')}
          className="font-body font-medium text-[var(--color-text-muted)] hover:text-[var(--color-saffron)] transition-colors text-sm tracking-wide cursor-pointer bg-transparent border-none"
        >
          About
        </button>
        <button
          type="button"
          onClick={() => handleNavClick('#domains')}
          className="font-body font-medium text-[var(--color-text-muted)] hover:text-[var(--color-saffron)] transition-colors text-sm tracking-wide cursor-pointer bg-transparent border-none"
        >
          Domains
        </button>
        <button
          type="button"
          onClick={() => handleNavClick('#process')}
          className="font-body font-medium text-[var(--color-text-muted)] hover:text-[var(--color-saffron)] transition-colors text-sm tracking-wide cursor-pointer bg-transparent border-none"
        >
          Process
        </button>
        <button
          type="button"
          onClick={() => handleNavClick('#faqs')}
          className="font-body font-medium text-[var(--color-text-muted)] hover:text-[var(--color-saffron)] transition-colors text-sm tracking-wide cursor-pointer bg-transparent border-none"
        >
          FAQs
        </button>
      </div>

      {/* Action Buttons & Tabs */}
      <div className="hidden md:flex items-center gap-3">
        <button
          type="button"
          onClick={() => onSelectTab('track')}
          className={`px-4 py-2 rounded-[3px] font-body font-bold text-xs uppercase border transition-all cursor-pointer flex items-center gap-1.5 ${
            currentTab === 'track'
              ? 'bg-[var(--color-saffron)] text-white border-[var(--color-saffron)] shadow-md shadow-orange-500/20'
              : 'bg-transparent text-[var(--color-text-muted)] border-[var(--color-line)] hover:border-white hover:bg-[var(--color-line)]'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Track Status</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onSelectTab('apply');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="cyber-btn-primary text-xs py-2.5 px-6"
        >
          JOIN US
        </button>
      </div>

      {/* Mobile Popover Toggle */}
      <div className="flex md:hidden items-center gap-2 relative">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex justify-between items-center gap-2 px-4 py-2 border border-[var(--color-saffron)] rounded-[3px] text-[var(--color-text-primary)] font-body text-sm font-bold bg-[var(--color-saffron)] transition-all cursor-pointer"
        >
          <span>Menu</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`} />
        </button>

        {mobileMenuOpen && (
          <div className="absolute top-[calc(100%+12px)] right-0 w-[240px] flex flex-col gap-2.5 p-3 bg-[var(--color-bg-paper)] border border-[var(--color-line)] rounded-[6px] shadow-xl z-50 animate-in fade-in zoom-in-95">
            <button
              type="button"
              onClick={() => handleNavClick('#about')}
              className="w-full text-center py-2 px-4 border border-[var(--color-line)] rounded-[3px] bg-[var(--color-bg-dark)] text-[var(--color-text-muted)] font-body font-bold text-sm cursor-pointer hover:bg-[var(--color-line)]"
            >
              About
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('#domains')}
              className="w-full text-center py-2 px-4 border border-[var(--color-line)] rounded-[3px] bg-[var(--color-bg-dark)] text-[var(--color-text-muted)] font-body font-bold text-sm cursor-pointer hover:bg-[var(--color-line)]"
            >
              Domains
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('#process')}
              className="w-full text-center py-2 px-4 border border-[var(--color-line)] rounded-[3px] bg-[var(--color-bg-dark)] text-[var(--color-text-muted)] font-body font-bold text-sm cursor-pointer hover:bg-[var(--color-line)]"
            >
              Process
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('#faqs')}
              className="w-full text-center py-2 px-4 border border-[var(--color-line)] rounded-[3px] bg-[var(--color-bg-dark)] text-[var(--color-text-muted)] font-body font-bold text-sm cursor-pointer hover:bg-[var(--color-line)]"
            >
              FAQs
            </button>
            <button
              type="button"
              onClick={() => {
                onSelectTab('track');
                setMobileMenuOpen(false);
              }}
              className="w-full text-center py-2 px-4 border border-[var(--color-saffron)]/30 rounded-[3px] bg-[var(--color-saffron)]/10 text-[var(--color-saffron)] font-body font-bold text-sm cursor-pointer hover:bg-[var(--color-saffron)]/20"
            >
              Track Status
            </button>
            <button
              type="button"
              onClick={() => {
                onSelectTab('apply');
                setMobileMenuOpen(false);
              }}
              className="w-full text-center py-2.5 px-4 rounded-[3px] bg-[var(--color-saffron)] text-white font-display font-bold text-sm uppercase cursor-pointer hover:bg-[var(--color-saffron-hover)]"
            >
              JOIN US NOW
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
