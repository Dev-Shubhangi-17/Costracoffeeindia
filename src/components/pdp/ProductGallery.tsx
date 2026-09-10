"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn, X } from "lucide-react";

interface ProductGalleryProps {
  image: string;
  productName: string;
}

export default function ProductGallery({ image, productName }: ProductGalleryProps) {
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  return (
    <>
      {/* Single Main Product Image Panel */}
      <div className="relative h-96 sm:h-[420px] bg-[#F9F9FB] rounded-3xl overflow-hidden border border-[#E5E7EB] shadow-sm flex items-center justify-center p-6 sm:p-8 group select-none">
        <motion.img
          key={image}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          src={image}
          alt={`${productName} - COSTRA Coffee`}
          width={500}
          height={500}
          loading="eager"
          onClick={() => setIsZoomOpen(true)}
          className="max-h-full max-w-full object-contain drop-shadow-xl cursor-zoom-in transition-transform duration-300 group-hover:scale-105"
        />

        {/* Zoom Trigger Button */}
        <button
          id="gallery-zoom-trigger"
          onClick={() => setIsZoomOpen(true)}
          className="absolute bottom-4 right-4 p-3 bg-white/90 backdrop-blur-sm hover:bg-white text-brand-charcoal rounded-2xl shadow-md border border-[#E5E7EB] transition-all opacity-90 sm:opacity-0 group-hover:opacity-100 cursor-pointer flex items-center space-x-1.5 text-xs font-extrabold"
          aria-label="Zoom Product Image"
        >
          <ZoomIn className="w-4 h-4 text-brand-charcoal stroke-[2.5]" />
          <span className="hidden sm:inline">Enlarge</span>
        </button>
      </div>

      {/* Lightbox Zoom Modal for the exact same image */}
      <AnimatePresence>
        {isZoomOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomOpen(false)}
            className="fixed inset-0 z-50 bg-brand-charcoal/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 cursor-zoom-out"
          >
            {/* Close Button */}
            <button
              id="gallery-zoom-close"
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all cursor-pointer"
              aria-label="Close image zoom view"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Zoomed Single Image View */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl max-h-[80vh] w-full h-full bg-[#FAF9F5] rounded-3xl p-6 sm:p-12 flex items-center justify-center border border-white/10 shadow-2xl overflow-hidden"
            >
              <img
                src={image}
                alt={`${productName} - Zoomed View`}
                className="max-h-full max-w-full object-contain drop-shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
