"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { mockProducts } from "@/data/mockProducts";
import ProductCard from "./ProductCard";

export default function ProductGrid() {
  const [category, setCategory] = useState<"all" | "beans" | "filter-instant">("all");

  const allCount = mockProducts.length;
  const beansCount = mockProducts.filter((p) => p.category === "Coffee Beans").length;
  const filterInstantCount = mockProducts.filter((p) => p.category !== "Coffee Beans").length;

  const filteredProducts = useMemo(() => {
    let result = [...mockProducts];

    if (category === "beans") {
      result = result.filter((p) => p.category === "Coffee Beans");
    } else if (category === "filter-instant") {
      result = result.filter((p) => p.category !== "Coffee Beans");
    }

    return result;
  }, [category]);

  const pills = [
    { label: "✨ All", count: allCount, value: "all" as const },
    { label: "🫘 Whole Beans", count: beansCount, value: "beans" as const },
    { label: "☕ Filter & Instant", count: filterInstantCount, value: "filter-instant" as const },
  ];

  return (
    <div className="space-y-10" id="product-grid-section">
      
      {/* Category Switcher Pills Grid */}
      <div className="flex justify-center items-center pb-6 border-b border-[#E5E7EB]">
        <div className="flex bg-[#F9F9FB] p-1.5 rounded-full border border-[#E5E7EB] space-x-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {pills.map((pill) => {
            const isActive = category === pill.value;
            return (
              <button
                key={pill.value}
                id={`filter-pill-${pill.value}`}
                onClick={() => setCategory(pill.value)}
                className={`relative px-5 py-3 rounded-full text-[10px] font-black tracking-widest uppercase transition-all duration-300 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "text-black"
                    : "text-[#1A1A1A]/60 hover:text-black hover:bg-[#1A1A1A]/5"
                }`}
              >
                <span className="relative z-10">
                  {pill.label} ({pill.count})
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activePill"
                    className="absolute inset-0 bg-[#F5B800] rounded-full shadow-sm"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Cards Grid Listing */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center bg-[#F9F9FB] rounded-3xl border border-dashed border-[#E5E7EB]">
          <p className="text-brand-charcoal/60 text-xs font-bold uppercase tracking-widest">
            No products found matching this filter.
          </p>
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="h-full"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
