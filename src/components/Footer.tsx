import { NeuraMorphixLogo } from './NeuraMorphixLogo';
import { ArrowUp, Mail } from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#FAF7EE] border-t-[4px] border-[#1E1B24] pt-12 pb-8 px-6 md:px-12 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-8 border-b-[3px] border-[#1E1B24]">
          {/* Brand Info */}
          <div className="flex flex-col gap-3 max-w-md">
            <div className="flex items-center gap-3">
              <NeuraMorphixLogo size={40} />
              <span className="font-outfit font-black text-2xl tracking-tight text-[#1E1B24]">
                NeuraMorphix
              </span>
            </div>
            <p className="font-rubik text-sm text-[#5C5866] leading-relaxed font-medium">
              Join the NeuraMorphix Community — your path to building real-world AI, Web, Creative, and Operations projects.
            </p>
            <p className="font-rubik text-xs text-[#1E1B24] font-bold flex flex-wrap items-center gap-1.5 mt-1">
              <span>Contact & Partnerships:</span>
              <a href="mailto:partnerships@neuramorphix.com" className="text-[#3E9FFF] hover:underline">
                partnerships@neuramorphix.com
              </a>
            </p>
          </div>

          {/* Social Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://www.linkedin.com/company/neuramorphix"
              target="_blank"
              rel="noreferrer"
              className="p-3 bg-white border-[3px] border-[#1E1B24] rounded-xl shadow-[3px_3px_0_#1E1B24] hover:-translate-y-1 hover:shadow-[5px_5px_0_#1E1B24] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all text-[#1E1B24]"
              aria-label="LinkedIn"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/neuramorphix/"
              target="_blank"
              rel="noreferrer"
              className="p-3 bg-white border-[3px] border-[#1E1B24] rounded-xl shadow-[3px_3px_0_#1E1B24] hover:-translate-y-1 hover:shadow-[5px_5px_0_#1E1B24] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all text-[#1E1B24]"
              aria-label="Instagram"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a
              href="mailto:partnerships@neuramorphix.com"
              className="p-3 bg-white border-[3px] border-[#1E1B24] rounded-xl shadow-[3px_3px_0_#1E1B24] hover:-translate-y-1 hover:shadow-[5px_5px_0_#1E1B24] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all text-[#1E1B24]"
              aria-label="Email Us"
            >
              <Mail className="w-5 h-5" />
            </a>
            <button
              type="button"
              onClick={scrollToTop}
              className="p-3 bg-[#FFD93D] border-[3px] border-[#1E1B24] rounded-xl shadow-[3px_3px_0_#1E1B24] hover:-translate-y-1 hover:shadow-[5px_5px_0_#1E1B24] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all text-[#1E1B24] cursor-pointer ml-2"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-5 h-5 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-rubik font-bold text-[#5C5866]">
          <p>© 2026 NeuraMorphix Recruitment Portal · All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span>Made with mischief, code & creativity</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#4EC37B] border-[1px] border-[#1E1B24]"></span>
          </p>
        </div>
      </div>
    </footer>
  );
}
