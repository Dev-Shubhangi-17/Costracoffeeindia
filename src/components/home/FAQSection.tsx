"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  id: number;
  num: string;
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    id: 1,
    num: "01",
    question: "Why COSTRA Filter Coffee?",
    answer: "Formulated with 70% Robusta & 30% Chicory for the thickest decoction, boldest cup, and richest aroma. It is the perfect recipe for authentic South Indian filter kaapi.",
  },
  {
    id: 2,
    num: "02",
    question: "What is 100% Arabica & Robusta?",
    answer: "These are single-origin pure whole coffee beans roasted individually to their peak profiles. Arabica delivers delicate, fruity clarity, whereas Robusta provides high crema, bold body, and a strong caffeine punch.",
  },
  {
    id: 3,
    num: "03",
    question: "When is my coffee roasted?",
    answer: "To ensure peak freshness, we roast in weekly small batches. Your coffee is packed and shipped within 48 hours of roasting, so you receive maximum aroma in every package.",
  },
  {
    id: 4,
    num: "04",
    question: "How should I brew it?",
    answer: "Use our traditional filter powder for South Indian brass or stainless steel percolators. Our whole beans are ideal for home espresso machines, French presses, and Moka pots.",
  },
];

export default function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(1);

  return (
    <section className="py-20 sm:py-28 bg-[#F9F9FB] border-t border-[#E5E7EB]" id="faq-section">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Heading */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[10px] font-black tracking-[0.25em] text-[#F5B800] uppercase block">
              QUESTIONS, ANSWERED
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-charcoal font-heading leading-tight tracking-tight">
              Why, what, when & how.
            </h2>
            <p className="text-xs sm:text-sm text-brand-charcoal/50 font-bold uppercase tracking-wider leading-relaxed max-w-sm">
              The four things people ask before their first order — answered straight.
            </p>
          </div>

          {/* Right Column: Numbered List Items Accordion */}
          <div className="lg:col-span-7 space-y-3">
            {faqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  id={`faq-accordion-${faq.id}`}
                  className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden ${
                    isOpen ? "border-[#F5B800] shadow-md" : "border-[#E5E7EB] hover:border-brand-charcoal/30"
                  }`}
                >
                  <button
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer"
                  >
                    <div className="flex items-center space-x-4 pr-4">
                      <span className={`text-[10px] font-black font-mono ${isOpen ? "text-[#F5B800]" : "text-[#1A1A1A]/40"}`}>
                        {faq.num}
                      </span>
                      <span className="text-xs sm:text-sm font-black tracking-wide text-brand-charcoal uppercase">
                        {faq.question}
                      </span>
                    </div>
                    
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className={`p-1.5 rounded-xl ${isOpen ? "bg-[#F5B800] text-black" : "bg-[#F9F9FB] text-brand-charcoal/40"}`}
                    >
                      <ChevronDown className="w-4.5 h-4.5 stroke-[2.5]" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="px-6 pb-6 pt-1 border-t border-[#E5E7EB]">
                          <p className="text-xs text-brand-charcoal/70 leading-relaxed font-semibold pl-8 mt-4">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
