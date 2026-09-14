import { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Who can apply for NeuraMorphix 2026 Recruitment?",
    answer: "All SRMIST students across 1st, 2nd, and 3rd year from any branch or department who have a passion for learning, building, and teamwork are eligible to apply!"
  },
  {
    question: "Can I apply for more than one domain preference?",
    answer: "Yes! You can choose a compulsory 1st Choice Role and an optional 2nd Choice Role preference across Technical, Corporate, and Creative domains."
  },
  {
    question: "Is prior experience mandatory to join?",
    answer: "Not at all! We value curiosity, enthusiasm, and willingness to learn above all. Beginner-friendly training and mentorship are provided for every domain."
  },
  {
    question: "What happens after I submit my application form?",
    answer: "You will receive an instant Application ID on screen and via email. Shortlisted candidates will be contacted for interactive domain interactions."
  },
  {
    question: "How can I track my recruitment status?",
    answer: "Use your unique Application ID or registered email on our 'Track Status' page anytime to view live updates on your application stage."
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="w-full bg-[var(--color-bg-paper)] border-t border-[var(--color-line)] py-16 lg:py-24 px-6 md:px-12 flex flex-col items-center">
      <div className="relative max-w-4xl w-full flex flex-col items-center gap-4 text-center mb-12">
        <img src="/images/artist_elephant.png" alt="Artist Elephant" className="absolute -right-4 -top-10 w-32 h-32 object-contain rounded-3xl border-[3px] border-[#14100b] bg-white shadow-[6px_6px_0_0_#14100b] rotate-6 hidden md:block hover:rotate-0 transition-transform" />
        <div className="cyber-badge bg-indigo-50 border-indigo-200 text-indigo-700">
          <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
          <span>GOT QUESTIONS?</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-outfit font-black text-[var(--color-text-primary)] tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="font-rubik text-base sm:text-lg text-[var(--color-text-muted)] max-w-xl leading-relaxed">
          Everything you need to know about the NeuraMorphix recruitment process and team tracks.
        </p>
      </div>

      <div className="max-w-3xl w-full flex flex-col gap-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isOpen
                  ? 'bg-white border-blue-600 shadow-md'
                  : 'bg-white border-[var(--color-line)] hover:border-[var(--color-saffron)]'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleIndex(index)}
                className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left cursor-pointer bg-transparent border-none"
              >
                <span className="font-outfit font-bold text-base sm:text-lg text-[var(--color-text-primary)]">
                  {faq.question}
                </span>
                <div
                  className={`w-7 h-7 rounded-xl border flex items-center justify-center shrink-0 transition-transform ${
                    isOpen
                      ? 'bg-blue-50 border-blue-200 text-blue-600 rotate-180'
                      : 'bg-slate-100 border-[var(--color-line)] text-slate-500'
                  }`}
                >
                  {isOpen ? (
                    <Minus className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 pt-4 text-xs sm:text-sm font-rubik text-[var(--color-text-muted)] leading-relaxed border-t border-slate-100">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
