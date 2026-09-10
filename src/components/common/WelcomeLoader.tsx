"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function WelcomeLoader() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check session storage to only trigger loader on initial session visit
    const hasShown = sessionStorage.getItem("costra_welcome_shown");
    if (!hasShown) {
      setIsVisible(true);

      // Auto dismiss after 3.5 seconds
      const timer = setTimeout(() => {
        handleDismiss();
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem("costra_welcome_shown", "true");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/95 backdrop-blur-md select-none"
        >
          {/* Main Card Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: "spring", stiffness: 100, damping: 18 }}
            className="border-t-4 border-[#F5B800] bg-white text-gray-900 rounded-3xl overflow-hidden shadow-2xl max-w-lg w-full relative"
          >
            {/* Header Image */}
            <div className="relative w-full h-56 sm:h-64 bg-gray-100">
              <Image
                src="/images/welcome-founders.jpg"
                alt="Swati Gruh Udhyog and Costra Coffee Founders"
                fill
                priority
                sizes="(max-w-768px) 100vw, 512px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            {/* Content Area */}
            <div className="p-6 sm:p-8 space-y-5 text-center">
              <div className="space-y-2">
                <span className="text-[#F5B800] font-black text-[10px] sm:text-xs tracking-[0.3em] uppercase block">
                  SWATI GRUH UDHYOG PRESENTS
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-brand-charcoal leading-tight">
                  Welcome to COSTRA Coffee
                </h2>
              </div>
              
              <p className="text-xs sm:text-sm text-gray-500 font-body font-semibold leading-relaxed max-w-sm mx-auto">
                Experience the authentic rich aroma and traditional taste of hand-formulated Indian filter coffee.
              </p>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={handleDismiss}
                  className="w-full bg-[#F5B800] hover:bg-[#EAA000] text-black font-black text-xs tracking-widest uppercase py-3.5 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>EXPLORE COSTRA COFFEE</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
