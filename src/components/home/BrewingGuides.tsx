"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Thermometer, Timer, Scale, Compass } from "lucide-react";

interface GuideItem {
  id: string;
  num: string;
  name: string;
  grind: string;
  ratio: string;
  temp: string;
  time: string;
  instruction: string;
}

const guides: GuideItem[] = [
  {
    id: "v60",
    num: "01",
    name: "Pour Over / V60",
    grind: "Medium-fine grind",
    ratio: "1:15 ratio",
    temp: "92°C water",
    time: "3 min duration",
    instruction: "Pour hot water in circular motions over a paper filter to highlight delicate fruity and floral notes.",
  },
  {
    id: "filter",
    num: "02",
    name: "South Indian Filter",
    grind: "Medium grind",
    ratio: "1:10 strong decoction",
    temp: "drip-percolate, then mix with hot milk",
    time: "10 min duration",
    instruction: "Let hot water drip slowly through the top chamber to extract a thick, dark, chicory-rich decoction.",
  },
  {
    id: "press",
    num: "03",
    name: "French Press",
    grind: "Coarse grind",
    ratio: "1:12 ratio",
    temp: "94°C water",
    time: "5 min duration (steep 4 mins)",
    instruction: "Steep coffee grounds directly in water and plunge gently to extract rich oils and a full-bodied mouthfeel.",
  },
  {
    id: "moka",
    num: "04",
    name: "Moka Pot",
    grind: "Fine grind",
    ratio: "Fill basket, water to valve",
    temp: "low heat until gurgles",
    time: "4 min duration",
    instruction: "Use steam pressure to push water up through the coffee bed, brewing a strong espresso-like concentrate.",
  },
  {
    id: "espresso",
    num: "05",
    name: "Espresso Machine",
    grind: "Fine grind",
    ratio: "18-20g dose",
    temp: "25-30s extraction",
    time: "30 sec duration",
    instruction: "Extract coffee at high pressure (9 bars) to create a thick, golden hazelnut crema and concentrated body.",
  },
  {
    id: "drip-bag",
    num: "06",
    name: "Drip Bag",
    grind: "Medium grind",
    ratio: "150ml hot water",
    temp: "90°C water",
    time: "2 min duration",
    instruction: "Hang the pre-packed bag filter over your mug, pour water in batches, and enjoy an instant, mess-free brew.",
  },
];

export default function BrewingGuides() {
  const [openId, setOpenId] = useState<string | null>("filter");

  const toggleGuide = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-20 sm:py-28 bg-[#F9F9FB] border-t border-[#E5E7EB]" id="brew-guide-section">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center space-x-1.5 text-[#F5B800] bg-[#F5B800]/10 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
            <span>06 Methods</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-charcoal font-heading leading-tight">
            More Ways to Brew / Brewing Guides
          </h2>
          <p className="text-xs sm:text-sm text-brand-charcoal/50 max-w-lg mx-auto font-bold uppercase tracking-wider">
            Find the optimal extraction values for each device.
          </p>
        </div>

        {/* Accordion Rows */}
        <div className="space-y-3">
          {guides.map((guide) => {
            const isOpen = openId === guide.id;
            return (
              <div
                key={guide.id}
                id={`brewing-accordion-${guide.id}`}
                className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden ${
                  isOpen ? "border-[#F5B800] shadow-md" : "border-[#E5E7EB] hover:border-brand-charcoal/35"
                }`}
              >
                {/* Accordion Header Row */}
                <button
                  onClick={() => toggleGuide(guide.id)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    {/* Active yellow status indicator */}
                    <div className="flex items-center space-x-2.5">
                      <span className={`text-[10px] font-black font-mono ${isOpen ? "text-[#F5B800]" : "text-[#1A1A1A]/40"}`}>
                        {guide.num}
                      </span>
                      <span className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${isOpen ? "bg-[#F5B800]" : "bg-transparent"}`} />
                    </div>
                    <span className="text-sm sm:text-base font-extrabold text-brand-charcoal font-heading">
                      {guide.name}
                    </span>
                  </div>
                  
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={`p-1.5 rounded-xl ${isOpen ? "bg-[#F5B800] text-black" : "bg-[#F9F9FB] text-brand-charcoal/40"}`}
                  >
                    <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                  </motion.div>
                </button>

                {/* Accordion Content Panel */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-2 border-t border-[#E5E7EB] space-y-4">
                        
                        {/* Parameters grid strip */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#F9F9FB] p-4 rounded-2xl text-[10px] font-black uppercase tracking-wider text-brand-charcoal/70">
                          
                          <div className="flex items-center space-x-2">
                            <Compass className="w-4 h-4 text-[#F5B800] shrink-0" />
                            <div>
                              <span className="text-[8px] text-[#1A1A1A]/40 block leading-none mb-1">Grind Size</span>
                              <span className="block leading-none text-brand-charcoal">{guide.grind}</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Scale className="w-4 h-4 text-[#F5B800] shrink-0" />
                            <div>
                              <span className="text-[8px] text-[#1A1A1A]/40 block leading-none mb-1">Ratio</span>
                              <span className="block leading-none text-brand-charcoal">{guide.ratio}</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Thermometer className="w-4 h-4 text-[#F5B800] shrink-0" />
                            <div>
                              <span className="text-[8px] text-[#1A1A1A]/40 block leading-none mb-1">Temperature</span>
                              <span className="block leading-none text-brand-charcoal">{guide.temp}</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Timer className="w-4 h-4 text-[#F5B800] shrink-0" />
                            <div>
                              <span className="text-[8px] text-[#1A1A1A]/40 block leading-none mb-1">Duration</span>
                              <span className="block leading-none text-brand-charcoal">{guide.time}</span>
                            </div>
                          </div>

                        </div>

                        {/* Directions paragraph */}
                        <p className="text-xs text-brand-charcoal/70 leading-relaxed font-semibold pl-1">
                          {guide.instruction}
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
    </section>
  );
}
