"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface Slide {
  eyebrow: string;
  headline: string;
  buttonText: string;
  buttonHref: string;
  bgImage: string;
}

const slides: Slide[] = [
  {
    eyebrow: "AUTHENTIC FILTER COFFEE · SWATI GRUH UDHYOG",
    headline: "Traceable, honest, origin-driven.",
    buttonText: "VIEW COLLECTION",
    buttonHref: "#shop-catalog",
    bgImage: "https://images.unsplash.com/photo-1507133750040-4a8f57021571?auto=format&fit=crop&w=1600&q=80",
  },
  {
    eyebrow: "70% ROBUSTA & 30% CHICORY",
    headline: "Traditional Kaapi from India.",
    buttonText: "SHOP FILTER COFFEE",
    buttonHref: "#shop-catalog",
    bgImage: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=1600&q=80",
  },
  {
    eyebrow: "100% ARABICA & ROBUSTA BEANS",
    headline: "Premium beans, carefully selected.",
    buttonText: "EXPLORE COFFEES",
    buttonHref: "#shop-catalog",
    bgImage: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1600&q=80",
  },
  {
    eyebrow: "FRESHLY ROASTED · PAN-INDIA DELIVERY",
    headline: "Roasted fresh, shipped fast.",
    buttonText: "FIND YOUR COFFEE",
    buttonHref: "#philosophy-quiz-section",
    bgImage: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1600&q=80",
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const textVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
  };

  return (
    <section className="relative w-full h-[85vh] min-h-[580px] bg-black overflow-hidden flex flex-col justify-between" id="hero-slider">
      
      {/* Background Slideshow with crossfade transition */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[currentSlide].bgImage})` }}
          >
            {/* Dark contrast overlay layer */}
            <div className="absolute inset-0 bg-black/60" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Left Vertical Ribbon (rotates text sidebar) */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 hidden lg:block select-none">
        <span 
          className="text-[9px] font-black tracking-[0.35em] text-white/40 uppercase block origin-left -rotate-90 -translate-x-1/2 whitespace-nowrap font-body"
        >
          SWATI GRUH UDHYOG • INDIA
        </span>
      </div>

      {/* Right Vertical Ribbon (rotates text sidebar) */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 hidden lg:block select-none">
        <span 
          className="text-[9px] font-black tracking-[0.35em] text-white/40 uppercase block origin-right rotate-90 translate-x-1/2 whitespace-nowrap font-body"
        >
          FRESHLY ROASTED • 100% AUTHENTIC
        </span>
      </div>

      {/* Main Slide Content Area */}
      <div className="flex-grow flex items-center justify-center max-w-7xl mx-auto px-6 sm:px-12 relative z-10 w-full">
        <div className="w-full max-w-3xl text-center lg:text-left space-y-6">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-6"
            >
              {/* Eyebrow Label */}
              <motion.div variants={textVariants}>
                <span className="inline-flex items-center space-x-1 bg-[#F5B800]/10 border border-[#F5B800]/30 text-[#F5B800] text-[10px] font-black tracking-[0.2em] px-4 py-1.5 rounded-full uppercase">
                  {slides[currentSlide].eyebrow}
                </span>
              </motion.div>

              {/* Slide Headline (Bold elegant serif font) */}
              <motion.h1 
                variants={textVariants}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight font-heading"
              >
                {slides[currentSlide].headline}
              </motion.h1>

              {/* Action Buttons Stack */}
              <motion.div 
                variants={textVariants} 
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
              >
                <Link
                  id={`slider-primary-cta-${currentSlide}`}
                  href={slides[currentSlide].buttonHref}
                  className="w-full sm:w-auto inline-flex items-center justify-center bg-[#F5B800] hover:bg-[#EAA000] text-black font-extrabold text-xs tracking-wider uppercase px-8 py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>{slides[currentSlide].buttonText}</span>
                  <ArrowRight className="w-4 h-4 ml-2 stroke-[2.5]" />
                </Link>

                <Link
                  id={`slider-secondary-cta-${currentSlide}`}
                  href="#origins"
                  className="text-xs font-black tracking-widest text-white hover:text-[#F5B800] uppercase underline decoration-white/30 hover:decoration-[#F5B800] underline-offset-8 transition-all py-3 px-4"
                >
                  OUR ORIGINS
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>

        </div>
      </div>

    </section>
  );
}
