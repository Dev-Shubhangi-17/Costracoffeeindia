"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";

const b2bSectors = [
  { num: "01", name: "Cafes", desc: "Custom roasting profiles for specialty coffee bars." },
  { num: "02", name: "Hotels", desc: "Premium filter blends for breakfast buffets & lobbies." },
  { num: "03", name: "Restaurants", desc: "Chicory-blend filter decoction for authentic dining menus." },
  { num: "04", name: "Offices", desc: "Quick-brew instant coffee packs and beans for corporate setups." },
  { num: "05", name: "Retail Stores", desc: "Stock COSTRA stand-up pouches and canisters on shelves." },
  { num: "06", name: "Corporate Gifting", desc: "Elegant brass filter sets and customizable premium gift hampers." },
];

const checkmarks = [
  "Bulk volumetric wholesale supply pricing",
  "Consistency in flavor profile and roast levels",
  "Flexible packaging formats (250g to bulk sacks)",
  "Private label packaging formulation assistance",
];

export default function WholesaleSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const cardVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 },
    },
  };

  const whatsappMessage = "Hello COSTRA! I am interested in inquiring about your wholesale and B2B coffee supply plans. Please share your product catalog and bulk rates.";

  return (
    <section className="py-20 sm:py-28 bg-white border-t border-[#E5E7EB]" id="wholesale">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Top Header */}
        <div className="mb-14 space-y-3 text-center lg:text-left">
          <span className="text-[10px] font-black tracking-[0.25em] text-[#F5B800] uppercase block">
            WHOLESALE & B2B
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-charcoal font-heading leading-tight max-w-2xl">
            Coffee for cafes, hotels, restaurants & offices.
          </h2>
        </div>

        {/* Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Checklist & CTA */}
          <div className="lg:col-span-5 space-y-6">
            <p className="text-xs sm:text-sm text-brand-charcoal/70 leading-relaxed font-semibold">
              Power your business with India&apos;s finest coffee blends. Swati Gruh Udhyog brings consistent roasting standards, direct-estate sourcing, and flexible partnership tiers to commercial coffee operators nationwide.
            </p>

            {/* Checklist */}
            <div className="space-y-3.5">
              {checkmarks.map((text) => (
                <div key={text} className="flex items-start space-x-3 text-brand-charcoal/80">
                  <CheckCircle2 className="w-5 h-5 text-[#F5B800] shrink-0 mt-0.5" />
                  <span className="text-xs font-bold leading-tight">{text}</span>
                </div>
              ))}
            </div>

            {/* Enquire CTA Button */}
            <div className="pt-4">
              <a
                id="wholesale-enquiry-btn"
                href={`https://wa.me/918734082232?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-[#F5B800] hover:bg-[#EAA000] text-black font-extrabold text-xs tracking-wider uppercase px-8 py-4 rounded-2xl shadow-lg shadow-brand-yellow/10 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>ENQUIRE FOR WHOLESALE</span>
                <ArrowRight className="w-4 h-4 ml-2 stroke-[2.5]" />
              </a>
            </div>
          </div>

          {/* Right Column: Sector Ticker Cards Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {b2bSectors.map((sector) => (
              <motion.div
                key={sector.num}
                variants={cardVariants}
                whileHover={{ y: -4 }}
                className="bg-[#F9F9FB] rounded-2xl border border-[#E5E7EB] hover:border-[#F5B800] p-5 shadow-sm transition-all duration-300 flex flex-col justify-between h-36 cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black font-mono text-[#F5B800]">
                    {sector.num}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#F5B800] transition-colors" />
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-brand-charcoal uppercase tracking-wider leading-none">
                    {sector.name}
                  </h4>
                  <p className="text-[10px] font-bold text-brand-charcoal/50 leading-relaxed mt-1">
                    {sector.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
