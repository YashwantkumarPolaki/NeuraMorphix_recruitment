import { useState } from 'react';
import { NeuraMorphixLogo } from './NeuraMorphixLogo';
import { ChevronDown, Search, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  currentTab: 'home' | 'apply' | 'track' | 'admin';
  onSelectTab: (tab: 'home' | 'apply' | 'track' | 'admin') => void;
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
    <nav className="sticky top-0 p-4 bg-[#FAF7EE] w-full flex justify-between items-center md:px-8 z-50 border-b-[3px] border-[#1E1B24] shadow-sm">
      {/* Brand Logo */}
      <button
        type="button"
        onClick={() => {
          onSelectTab('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity bg-transparent border-none text-left"
      >
        <NeuraMorphixLogo size={44} />
        <div className="flex flex-col">
          <span className="font-outfit font-black text-xl tracking-tight text-[#1E1B24]">
            NeuraMorphix
          </span>
          <span className="font-rubik font-bold text-[10px] uppercase tracking-widest text-[#3E9FFF]">
            Recruitment 2026
          </span>
        </div>
      </button>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-6 lg:gap-8">
        <button
          type="button"
          onClick={() => handleNavClick('#about')}
          className="font-montserrat font-bold text-[#1E1B24] hover:text-[#3E9FFF] transition-colors text-base tracking-wide cursor-pointer bg-transparent border-none"
        >
          About
        </button>
        <button
          type="button"
          onClick={() => handleNavClick('#domains')}
          className="font-montserrat font-bold text-[#1E1B24] hover:text-[#3E9FFF] transition-colors text-base tracking-wide cursor-pointer bg-transparent border-none"
        >
          Domains
        </button>
        <button
          type="button"
          onClick={() => handleNavClick('#process')}
          className="font-montserrat font-bold text-[#1E1B24] hover:text-[#3E9FFF] transition-colors text-base tracking-wide cursor-pointer bg-transparent border-none"
        >
          Process
        </button>
        <button
          type="button"
          onClick={() => handleNavClick('#faqs')}
          className="font-montserrat font-bold text-[#1E1B24] hover:text-[#3E9FFF] transition-colors text-base tracking-wide cursor-pointer bg-transparent border-none"
        >
          FAQs
        </button>
      </div>

      {/* Action Buttons & Tabs */}
      <div className="hidden md:flex items-center gap-3">
        <button
          type="button"
          onClick={() => onSelectTab('track')}
          className={`px-4 py-2 rounded-xl font-rubik font-bold text-xs uppercase border-[2px] border-[#1E1B24] flex items-center gap-1.5 transition-all cursor-pointer ${
            currentTab === 'track'
              ? 'bg-[#FFD93D] text-[#1E1B24] shadow-[2px_2px_0_#1E1B24]'
              : 'bg-white text-[#1E1B24] hover:bg-[#FAF7EE]'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Track Status</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('admin')}
          className={`px-3 py-2 rounded-xl font-rubik font-bold text-xs uppercase border-[2px] border-[#1E1B24] flex items-center gap-1.5 transition-all cursor-pointer ${
            currentTab === 'admin'
              ? 'bg-[#FF4B4B] text-white shadow-[2px_2px_0_#1E1B24]'
              : 'bg-white text-[#1E1B24] hover:bg-[#FAF7EE]'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Admin</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onSelectTab('apply');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center justify-center px-7 py-2.5 rounded-full border-[3px] border-[#1E1B24] font-rubik font-bold text-white tracking-wider uppercase shadow-[4px_4px_0_#1E1B24] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#1E1B24] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none bg-[#3E9FFF] text-sm cursor-pointer"
        >
          JOIN US
        </button>
      </div>

      {/* Mobile Popover Toggle */}
      <div className="flex md:hidden items-center gap-2 relative">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex justify-between items-center gap-2 px-4 py-2 border-[3px] border-[#1E1B24] rounded-xl text-white font-rubik text-sm font-bold shadow-[3px_3px_0_#1E1B24] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer bg-[#3E9FFF]"
        >
          <span>Go to</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`} />
        </button>

        {mobileMenuOpen && (
          <div className="absolute top-[calc(100%+12px)] right-0 w-[240px] flex flex-col gap-2.5 p-3 bg-[#FAF7EE] border-[3px] border-[#1E1B24] rounded-2xl shadow-[6px_6px_0_#1E1B24] z-50 animate-in fade-in zoom-in-95">
            <button
              type="button"
              onClick={() => handleNavClick('#about')}
              className="w-full text-center py-2 px-4 border-[2px] border-[#1E1B24] rounded-xl bg-white font-rubik font-bold text-sm shadow-[2px_2px_0_#1E1B24] cursor-pointer"
            >
              About
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('#domains')}
              className="w-full text-center py-2 px-4 border-[2px] border-[#1E1B24] rounded-xl bg-white font-rubik font-bold text-sm shadow-[2px_2px_0_#1E1B24] cursor-pointer"
            >
              Domains
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('#process')}
              className="w-full text-center py-2 px-4 border-[2px] border-[#1E1B24] rounded-xl bg-white font-rubik font-bold text-sm shadow-[2px_2px_0_#1E1B24] cursor-pointer"
            >
              Process
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('#faqs')}
              className="w-full text-center py-2 px-4 border-[2px] border-[#1E1B24] rounded-xl bg-white font-rubik font-bold text-sm shadow-[2px_2px_0_#1E1B24] cursor-pointer"
            >
              FAQs
            </button>
            <button
              type="button"
              onClick={() => {
                onSelectTab('track');
                setMobileMenuOpen(false);
              }}
              className="w-full text-center py-2 px-4 border-[2px] border-[#1E1B24] rounded-xl bg-[#FFD93D] text-[#1E1B24] font-rubik font-bold text-sm shadow-[2px_2px_0_#1E1B24] cursor-pointer"
            >
              Track Status
            </button>
            <button
              type="button"
              onClick={() => {
                onSelectTab('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full text-center py-2 px-4 border-[2px] border-[#1E1B24] rounded-xl bg-[#FF4B4B] text-white font-rubik font-bold text-sm shadow-[2px_2px_0_#1E1B24] cursor-pointer"
            >
              Admin Portal
            </button>
            <button
              type="button"
              onClick={() => {
                onSelectTab('apply');
                setMobileMenuOpen(false);
              }}
              className="w-full text-center py-2.5 px-4 border-[3px] border-[#1E1B24] rounded-full bg-[#3E9FFF] text-white font-rubik font-bold text-sm shadow-[3px_3px_0_#1E1B24] cursor-pointer uppercase mt-1"
            >
              JOIN US NOW
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
