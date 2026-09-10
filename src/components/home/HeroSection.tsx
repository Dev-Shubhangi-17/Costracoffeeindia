"use client";

import React from "react";
import { motion } from "framer-motion";
import { Coffee, ArrowRight, ShieldCheck, Flame, Sun } from "lucide-react";

const infoStripItems = [
  { num: "01", title: "Origin", desc: "India" },
  { num: "02", title: "Roast", desc: "Weekly Small Batch" },
  { num: "03", title: "Delivery", desc: "Pan-India Express" },
  { num: "04", title: "Legacy", desc: "Swati Gruh Udhyog" },
];

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 },
    },
  };

  return (
    <section className="relative bg-brand-white text-brand-charcoal overflow-hidden pt-12 md:pt-16" id="hero-section">
      {/* Background radial highlight */}
      <div className="absolute top-1/4 right-0 w-[40rem] h-[40rem] bg-brand-yellow/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[24rem] h-[24rem] bg-brand-yellow/5 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Body */}
      <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center pb-16">
        
        {/* Left Content Column */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-7 space-y-6 text-center lg:text-left"
        >
          {/* Eyebrow badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 bg-[#F5B800]/10 border border-[#F5B800]/25 px-4 py-1.5 rounded-full text-brand-charcoal">
            <ShieldCheck className="w-3.5 h-3.5 text-[#F5B800] shrink-0" />
            <span className="text-[10px] font-black tracking-widest uppercase">
              AUTHENTIC FILTER COFFEE · FSSAI REGISTERED
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-brand-charcoal leading-[1.08] font-heading">
              Premium beans, <br />
              <span className="font-extrabold italic relative inline-block">
                carefully
                <span className="absolute bottom-1 left-0 w-full h-[3px] bg-[#F5B800] rounded" />
              </span>{" "}
              selected.
            </h1>
            <p className="text-sm sm:text-base text-brand-charcoal/70 max-w-lg leading-relaxed mx-auto lg:mx-0 font-medium">
              Formulated by Swati Gruh Udhyog with high-grade Robusta and premium Chicory to brew the perfect thick, frothy traditional South Indian decoction.
            </p>
          </motion.div>

          {/* Action CTAs */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
            <a
              id="hero-explore-cta"
              href="#shop-catalog"
              className="w-full sm:w-auto inline-flex items-center justify-center bg-[#F5B800] hover:bg-[#EAA000] text-black font-extrabold text-xs tracking-wider uppercase px-8 py-4 rounded-2xl shadow-lg shadow-brand-yellow/10 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>EXPLORE COFFEES</span>
              <ArrowRight className="w-4 h-4 ml-2 stroke-[2.5]" />
            </a>
            
            <a
              id="hero-origins-cta"
              href="#origins"
              className="w-full sm:w-auto inline-flex items-center justify-center bg-brand-charcoal hover:bg-brand-charcoal/85 text-brand-white font-extrabold text-xs tracking-wider uppercase px-8 py-4 rounded-2xl shadow-md transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
            >
              OUR ORIGINS
            </a>
          </motion.div>
        </motion.div>

        {/* Right Layout: Large Product Packaging Hero Display */}
        <div className="lg:col-span-5 flex justify-center relative min-h-[360px] select-none">
          <motion.img
            src="/images/costra-filter-coffee.png"
            alt="COSTRA Filter Coffee Packaging"
            className="h-88 sm:h-96 object-contain drop-shadow-2xl"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 80 }}
          />
        </div>

      </div>

      {/* Highlights Grid with responsive zero overlapping */}
      <div className="w-full max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          
          {/* Card 1: ESTD 2023 */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl border-2 border-[#F5B800] p-6 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="w-9 h-9 rounded-xl bg-[#F5B800]/10 flex items-center justify-center text-[#F5B800]">
                  <Coffee className="w-5 h-5" />
                </div>
                <span className="text-[9px] font-black bg-brand-charcoal text-[#F5B800] tracking-widest uppercase px-2 py-1 rounded">
                  ESTD 2023
                </span>
              </div>
              <h3 className="text-base font-extrabold text-brand-charcoal font-heading leading-tight mb-2">
                Hand-Formulated Kaapi
              </h3>
              <p className="leading-relaxed text-gray-600 text-sm mb-4 font-semibold">
                A perfect 70% Robusta & 30% Chicory blend for signature thickness and aroma.
              </p>
            </div>
            <span className="text-[#F5B800] font-bold text-xs tracking-wider uppercase">
              SWATI GRUH UDHYOG LEGACY
            </span>
          </motion.div>

          {/* Card 2: BATCH ROASTED */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl border-2 border-[#F5B800] p-6 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="w-9 h-9 rounded-xl bg-[#F5B800]/10 flex items-center justify-center text-[#F5B800]">
                  <Flame className="w-5 h-5" />
                </div>
                <span className="text-[9px] font-black bg-brand-charcoal text-[#F5B800] tracking-widest uppercase px-2 py-1 rounded">
                  BATCH ROASTED
                </span>
              </div>
              <h3 className="text-base font-extrabold text-brand-charcoal font-heading leading-tight mb-2">
                Slow Flame Roasted
              </h3>
              <p className="leading-relaxed text-gray-600 text-sm mb-4 font-semibold">
                Roasted weekly in small batches to preserve natural cocoa and earthy notes.
              </p>
            </div>
            <span className="text-[#F5B800] font-bold text-xs tracking-wider uppercase">
              PAN-INDIA DELIVERY
            </span>
          </motion.div>

          {/* Card 3: QUALITY ASSURED */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl border-2 border-[#F5B800] p-6 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="w-9 h-9 rounded-xl bg-[#F5B800]/10 flex items-center justify-center text-[#F5B800]">
                  <Sun className="w-5 h-5" />
                </div>
                <span className="text-[9px] font-black bg-brand-charcoal text-[#F5B800] tracking-widest uppercase px-2 py-1 rounded">
                  QUALITY ASSURED
                </span>
              </div>
              <h3 className="text-base font-extrabold text-brand-charcoal font-heading leading-tight mb-2">
                FSSAI Registered
              </h3>
              <p className="leading-relaxed text-gray-600 text-sm mb-4 font-semibold">
                Licensed packing facilities (No: 20726032000830) ensuring pure, raw ingredients.
              </p>
            </div>
            <span className="text-[#F5B800] font-bold text-xs tracking-wider uppercase">
              100% PURE INGREDIENTS
            </span>
          </motion.div>

        </div>
      </div>

      {/* Bottom Info Strip: 4-Column Metadata Ticker */}
      <div className="border-t border-brand-border bg-[#F9F9FB]">
        <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {infoStripItems.map((item) => (
            <div key={item.num} className="space-y-1 text-center md:text-left">
              <span className="text-[10px] font-black text-[#F5B800] block tracking-widest font-mono">
                {item.num}
              </span>
              <h4 className="text-xs font-black text-brand-charcoal uppercase tracking-wider leading-none">
                {item.title}
              </h4>
              <p className="text-[11px] font-bold text-brand-charcoal/50 mt-0.5 leading-none">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Continuous Marquee Strip below Hero Section */}
      <div className="relative bg-[#F5B800] py-4 border-y border-black/5 overflow-hidden flex select-none">
        <div className="animate-marquee whitespace-nowrap flex shrink-0 items-center">
          {[...Array(4)].map((_, idx) => (
            <span key={idx} className="text-[10px] font-black tracking-[0.25em] text-black uppercase mx-8 flex items-center shrink-0">
              ✦ FRESHLY ROASTED &nbsp;&nbsp;&nbsp; ✦ &nbsp;&nbsp;&nbsp; TRACKED PAN-INDIA SHIPPING &nbsp;&nbsp;&nbsp; ✦ &nbsp;&nbsp;&nbsp; TRADITIONAL FILTER BLENDS &nbsp;&nbsp;&nbsp; ✦ &nbsp;&nbsp;&nbsp; FSSAI APPROVED
            </span>
          ))}
        </div>
        <div className="animate-marquee whitespace-nowrap flex shrink-0 items-center" aria-hidden="true">
          {[...Array(4)].map((_, idx) => (
            <span key={idx} className="text-[10px] font-black tracking-[0.25em] text-black uppercase mx-8 flex items-center shrink-0">
              ✦ FRESHLY ROASTED &nbsp;&nbsp;&nbsp; ✦ &nbsp;&nbsp;&nbsp; TRACKED PAN-INDIA SHIPPING &nbsp;&nbsp;&nbsp; ✦ &nbsp;&nbsp;&nbsp; TRADITIONAL FILTER BLENDS &nbsp;&nbsp;&nbsp; ✦ &nbsp;&nbsp;&nbsp; FSSAI APPROVED
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
