"use client";

import React from "react";
import { motion } from "framer-motion";
import { Award, ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react";

interface QualityCard {
  id: string;
  stat: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
}

const metrics: QualityCard[] = [
  {
    id: "sca",
    stat: "75.25",
    title: "SCA Sensory Score",
    desc: "Formulated using sensory evaluation standards for consistent single-origin quality.",
    icon: <Award className="w-6 h-6 text-[#F5B800]" />,
  },
  {
    id: "defects",
    stat: "0",
    title: "Defects Recorded",
    desc: "Rigorous green bean sorting ensures zero primary cup defects during sample evaluations.",
    icon: <ShieldAlert className="w-6 h-6 text-[#F5B800]" />,
  },
  {
    id: "notes",
    stat: "4",
    title: "Tasting Notes",
    desc: "Distinct chocolatey body, roasted hazelnut notes, low caramel acidity, and rich crema.",
    icon: <Sparkles className="w-6 h-6 text-[#F5B800]" />,
  },
  {
    id: "fssai",
    stat: "100%",
    title: "Lab Tested & Approved",
    desc: "100% pure coffee formulation compliant with FSSAI packing standard protocols.",
    icon: <CheckCircle2 className="w-6 h-6 text-[#F5B800]" />,
  },
];

export default function QualityVerified() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 },
    },
  };

  return (
    <section className="py-20 sm:py-28 bg-white border-t border-[#E5E7EB]" id="quality-verified-section">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="inline-block text-[10px] font-black tracking-[0.25em] uppercase text-[#F5B800] bg-[#F5B800]/10 px-4 py-1.5 rounded-full border border-[#F5B800]/25">
            QUALITY VERIFIED
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-charcoal font-heading leading-tight">
            Evaluated, Tested, Trusted
          </h2>
          <p className="text-xs sm:text-sm text-brand-charcoal/50 max-w-lg mx-auto font-bold uppercase tracking-wider">
            Our coffee blends are crafted using sensory evaluation standards for rich aroma and zero defects.
          </p>
        </div>

        {/* 4-Column Stat Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {metrics.map((item) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              className="bg-[#F9F9FB] rounded-3xl border border-[#E5E7EB] hover:border-[#F5B800] p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-64 cursor-pointer relative overflow-hidden group"
            >
              {/* Subtle top accent tag */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-[#F5B800] transition-colors duration-300" />

              {/* Icon & Stat Row */}
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-white border border-[#E5E7EB] group-hover:border-[#F5B800]/30 flex items-center justify-center shadow-inner transition-colors duration-300">
                  {item.icon}
                </div>
                <span className="text-3xl font-black text-brand-charcoal font-heading tracking-tight leading-none">
                  {item.stat}
                </span>
              </div>

              {/* Card Titles */}
              <div className="space-y-1.5 pt-6">
                <h4 className="text-sm font-black text-brand-charcoal uppercase tracking-wider leading-snug">
                  {item.title}
                </h4>
                <p className="text-[11px] font-semibold text-brand-charcoal/60 leading-relaxed">
                  {item.desc}
                </p>
              </div>

            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
