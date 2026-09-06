import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

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
    <section id="faqs" className="w-full bg-[#FFFEEF] border-t-[3px] border-[#1E1B24] py-16 lg:py-24 px-6 md:px-12 flex flex-col items-center">
      <div className="max-w-4xl w-full flex flex-col items-center gap-4 text-center mb-12">
        <div className="neo-badge bg-[#A855F7] text-white">
          <span>GOT QUESTIONS?</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-outfit font-black text-[#1E1B24] tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="font-rubik text-base sm:text-lg text-[#5C5866] max-w-xl font-medium">
          Everything you need to know about the NeuraMorphix 2026 recruitment process and team roles.
        </p>
      </div>

      <div className="max-w-3xl w-full flex flex-col gap-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="bg-white border-[3px] border-[#1E1B24] rounded-2xl shadow-[4px_4px_0_#1E1B24] overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => toggleIndex(index)}
                className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left cursor-pointer bg-transparent border-none"
              >
                <span className="font-outfit font-extrabold text-lg sm:text-xl text-[#1E1B24]">
                  {faq.question}
                </span>
                <div
                  className={`w-8 h-8 rounded-full border-[2px] border-[#1E1B24] flex items-center justify-center shrink-0 transition-transform ${
                    isOpen ? 'bg-[#FFD93D] rotate-180' : 'bg-[#FAF7EE]'
                  }`}
                >
                  {isOpen ? (
                    <Minus className="w-5 h-5 text-[#1E1B24] stroke-[3]" />
                  ) : (
                    <Plus className="w-5 h-5 text-[#1E1B24] stroke-[3]" />
                  )}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base font-rubik font-medium text-[#5C5866] leading-relaxed border-t-[2px] border-dashed border-[#1E1B24] mt-1 pt-4">
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
