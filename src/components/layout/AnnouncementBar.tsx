"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const announcements = [
  "☕ 70% Robusta & 30% Chicory Authentic Blend · Order Today",
  "🚚 Freshly Roasted · Shipped Pan-India | Free Shipping on orders above ₹499",
];

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isVisible]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % announcements.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative bg-[#F5B800] text-black text-xs font-semibold select-none z-50 shadow-sm border-b border-black/5"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-2.5">
            {/* Arrow Nav Left (desktop only) */}
            <button
              id="announcement-prev-btn"
              onClick={handlePrev}
              className="p-0.5 hover:bg-black/10 rounded transition-colors hidden sm:block cursor-pointer text-black"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {/* Announcement Text with slide animation */}
            <div className="flex-grow flex items-center justify-center overflow-hidden h-5 relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="text-center font-bold tracking-wide"
                >
                  {announcements[currentIndex]}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls Right */}
            <div className="flex items-center space-x-2 shrink-0">
              {/* Arrow Nav Right (desktop only) */}
              <button
                id="announcement-next-btn"
                onClick={handleNext}
                className="p-0.5 hover:bg-black/10 rounded transition-colors hidden sm:block cursor-pointer text-black"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <span className="h-3 w-px bg-black/15 hidden sm:block" />

              {/* Close Button */}
              <button
                id="announcement-dismiss-btn"
                onClick={() => setIsVisible(false)}
                className="p-0.5 hover:bg-black/10 rounded transition-colors cursor-pointer text-black"
                aria-label="Dismiss Announcement"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
