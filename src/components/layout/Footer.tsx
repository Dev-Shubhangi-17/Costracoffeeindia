"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Coffee, Mail, MapPin, Send, CheckCircle2, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="relative bg-brand-white border-t border-gray-200 overflow-hidden">
      {/* Top Gold Border Accent */}
      <div className="h-[4px] bg-[#F5B800] w-full" />

      {/* Newsletter Block Container */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-6">
        
        {/* Newsletter Subscription Box (Charcoal Theme) */}
        <div className="relative bg-[#1A1A1A] rounded-3xl overflow-hidden p-8 sm:p-12 mb-16 shadow-xl border border-white/5">
          {/* Coffee Grain Abstract Visual Overlay */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none" />
          <div className="absolute -right-24 -bottom-24 w-80 h-80 rounded-full bg-[#F5B800]/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-24 -top-24 w-80 h-80 rounded-full bg-[#F5B800]/5 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Newsletter Column Left */}
            <div className="lg:col-span-6 space-y-4">
              <span className="text-[10px] font-black tracking-[0.25em] uppercase text-[#F5B800]">
                Subscribe & Save
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight leading-tight">
                Unlock the Secrets of Authentic South Indian Brewing
              </h3>
              <p className="text-xs text-white/60 font-semibold tracking-wide">
                Join 2,000+ coffee lovers. No spam, ever.
              </p>

              {/* Benefits Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {[
                  "Early access to fresh micro-lots",
                  "10% off your first checkout order",
                  "Traditional brewing masterclasses",
                  "Subscriber-only bulk deals",
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center space-x-2 text-white/80">
                    <CheckCircle2 className="w-4 h-4 text-[#F5B800] shrink-0" />
                    <span className="text-[11px] font-bold leading-none">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter Column Right */}
            <div className="lg:col-span-6">
              <form onSubmit={handleSubscribe} className="space-y-3.5">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-grow">
                    <Mail className="w-4 h-4 text-white/40 absolute left-4 inset-y-0 my-auto" />
                    <input
                      id="footer-newsletter-email"
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#2A2A2A] border border-white/10 focus:border-[#F5B800] text-white pl-10 pr-4 py-3.5 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#F5B800] transition-all placeholder:text-white/30"
                    />
                  </div>
                  <motion.button
                    id="footer-newsletter-submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="bg-[#F5B800] hover:bg-[#EAA000] text-black font-extrabold text-xs tracking-wider uppercase py-3.5 px-7 rounded-2xl flex items-center justify-center space-x-2 transition-all duration-300 shadow-lg shadow-brand-yellow/10 cursor-pointer shrink-0"
                  >
                    {subscribed ? (
                      <span>Subscribed!</span>
                    ) : (
                      <>
                        <span>Subscribe</span>
                        <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                      </>
                    )}
                  </motion.button>
                </div>
                {subscribed && (
                  <p className="text-[10px] text-[#F5B800] font-extrabold text-center sm:text-left">
                    Welcome to the COSTRA family! Check your inbox for your 10% discount code.
                  </p>
                )}
              </form>
            </div>

          </div>
        </div>

        {/* Bottom Footer Directory (4 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 pb-12 border-b border-gray-200">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-1.5 rounded-2xl bg-[#F5B800]/5 border border-[#F5B800]/20 w-fit">
              <div className="w-10 h-10 bg-[#F5B800] rounded-2xl flex items-center justify-center text-black shadow-md shadow-amber-500/20">
                <Coffee className="w-5.5 h-5.5 stroke-[2.5]" />
              </div>
              <div className="pr-2">
                <span className="text-base font-black tracking-wider text-gray-900 uppercase block font-heading leading-tight">
                  COSTRA
                </span>
                <span className="text-[9px] text-gray-500 font-bold tracking-widest uppercase block -mt-0.5">
                  By Swati Gruh Udhyog
                </span>
              </div>
            </div>
            
            <p className="text-xs text-gray-600 leading-relaxed font-semibold">
              COSTRA Coffee is formulated by <strong>SWATI GRUH UDHYOG</strong> (Proprietor: Swati Pashupati Singh) to bring traditional South Indian filter roasts and rich aromatic blends straight from India to coffee lovers pan-India.
            </p>

            {/* Stylized Trust Badge */}
            <div className="flex items-center space-x-3 bg-gray-50 border border-gray-200 rounded-2xl p-3 shrink-0 select-none">
              <div className="bg-[#185A9D] text-white px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest leading-none text-center">
                fssai
              </div>
              <div className="space-y-0.5">
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block leading-none">
                  FSSAI REG. NUMBER
                </span>
                <span className="text-[10px] font-bold text-gray-800 font-mono block">
                  20726032000830
                </span>
                <span className="text-[8px] font-semibold text-gray-500 block leading-none">
                  Coffee & Chicory Blends
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Shop Catalog */}
          <div className="space-y-4">
            <h4 className="text-xs font-black tracking-widest text-gray-900 uppercase border-l-2 border-[#F5B800] pl-3">
              Shop Blends
            </h4>
            <ul className="space-y-2.5 text-[11px] font-bold text-gray-600">
              <li>
                <Link href="/product/costra-filter-coffee" className="hover:text-[#F5B800] transition-colors no-underline">
                  COSTRA Filter Coffee (50g)
                </Link>
              </li>
              <li>
                <Link href="/product/costra-hazelnut-instant" className="hover:text-[#F5B800] transition-colors no-underline">
                  Hazelnut Instant Coffee (50g)
                </Link>
              </li>
              <li>
                <Link href="/product/costra-arabica-beans-1kg" className="hover:text-[#F5B800] transition-colors no-underline">
                  100% Arabica Whole Beans (1KG)
                </Link>
              </li>
              <li>
                <Link href="/product/costra-robusta-beans-1kg" className="hover:text-[#F5B800] transition-colors no-underline">
                  100% Robusta Whole Beans (1KG)
                </Link>
              </li>
              <li>
                <Link href="/product/costra-instant-coffee-50g" className="hover:text-[#F5B800] transition-colors no-underline">
                  Instant Coffee Blend (50g)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Corporate Pages */}
          <div className="space-y-4">
            <h4 className="text-xs font-black tracking-widest text-gray-900 uppercase border-l-2 border-[#F5B800] pl-3">
              Company
            </h4>
            <ul className="space-y-2.5 text-[11px] font-bold text-gray-600">
              <li>
                <a href="#origins" className="hover:text-[#F5B800] transition-colors no-underline">
                  About Our Origins
                </a>
              </li>
              <li>
                <a href="#brew-guide-section" className="hover:text-[#F5B800] transition-colors no-underline">
                  Brewing Guide Options
                </a>
              </li>
              <li>
                <a href="#philosophy-quiz-section" className="hover:text-[#F5B800] transition-colors no-underline">
                  Coffee Recommender Quiz
                </a>
              </li>
              <li>
                <a href="#wholesale-section" className="hover:text-[#F5B800] transition-colors no-underline">
                  Wholesale & B2B Solutions
                </a>
              </li>
              <li>
                <a href="#faq-section" className="hover:text-[#F5B800] transition-colors no-underline">
                  Frequently Asked Questions
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Locations */}
          <div className="space-y-4">
            <h4 className="text-xs font-black tracking-widest text-gray-900 uppercase border-l-2 border-[#F5B800] pl-3">
              Get in Touch
            </h4>
            <ul className="space-y-3.5 text-[11px] font-semibold text-gray-700">
              
              {/* WhatsApp Numbers */}
              <li className="flex items-start space-x-2">
                <MessageSquare className="w-4 h-4 text-[#F5B800] shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold block text-gray-400 text-[9px] uppercase tracking-wider">WhatsApp & Mobile</span>
                  <div className="flex flex-col space-y-0.5 mt-0.5 font-bold">
                    <a
                      href="https://wa.me/918360322894"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#F5B800] transition-colors"
                    >
                      +91 83603 22894
                    </a>
                    <a
                      href="https://wa.me/918734082232"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#F5B800] transition-colors"
                    >
                      +91 87340 82232
                    </a>
                  </div>
                </div>
              </li>

              {/* Email Address */}
              <li className="flex items-start space-x-2">
                <Mail className="w-4 h-4 text-[#F5B800] shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold block text-gray-400 text-[9px] uppercase tracking-wider">Email Care</span>
                  <a
                    href="mailto:costrabyswatigruhudhyog@gmail.com"
                    className="font-bold hover:text-[#F5B800] transition-colors block mt-0.5"
                  >
                    costrabyswatigruhudhyog@gmail.com
                  </a>
                </div>
              </li>

              {/* Instagram Profile */}
              <li className="flex items-start space-x-2">
                <svg
                  className="w-4 h-4 text-[#F5B800] shrink-0 mt-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                <div>
                  <span className="font-extrabold block text-gray-400 text-[9px] uppercase tracking-wider">Instagram Page</span>
                  <a
                    href="https://www.instagram.com/costra_23?igsh=MWdmMTJxamlva29wcQ=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold hover:text-[#F5B800] transition-colors block mt-0.5"
                  >
                    @costra_23
                  </a>
                </div>
              </li>

              {/* Physical Location */}
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#F5B800] shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold block text-gray-400 text-[9px] uppercase tracking-wider">Verified Address</span>
                  <span className="block mt-0.5 font-bold leading-relaxed text-gray-600">
                    SWATI GRUH UDHYOG<br />
                    A-2, 503 Yagnapurush Residency,<br />
                    Near Chanakyanagari, At & Post: Kalali,<br />
                    India - 390012
                  </span>
                </div>
              </li>

            </ul>
          </div>

        </div>

        {/* Footer Sub-bar with Copyright and GSTIN details */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">
          <div>
            &copy; 2026 COSTRA Coffee - By Swati Gruh Udhyog. All rights reserved.
          </div>
          <div className="font-mono text-[9px] select-all">
            GSTIN / TAX ID: 24AABCS9825F1Z2
          </div>
          <div className="flex items-center space-x-1">
            <span>Proprietor: Swati Pashupati Singh</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
