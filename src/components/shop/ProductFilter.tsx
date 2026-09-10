"use client";

import React from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";

export type CategoryFilter = "all" | "Filter Coffee" | "Flavoured Coffee" | "Coffee Beans" | "Instant Coffee";
export type SortOption = "featured" | "price-asc" | "price-desc" | "rating-desc";

interface ProductFilterProps {
  activeCategory: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
  activeSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const categories: { label: string; value: CategoryFilter }[] = [
  { label: "All Products", value: "all" },
  { label: "Filter Coffee", value: "Filter Coffee" },
  { label: "Flavoured", value: "Flavoured Coffee" },
  { label: "Coffee Beans (1KG)", value: "Coffee Beans" },
  { label: "Instant Coffee", value: "Instant Coffee" },
];

const sortOptions: { label: string; value: SortOption }[] = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Highest Rated", value: "rating-desc" },
];

export default function ProductFilter({
  activeCategory,
  onCategoryChange,
  activeSort,
  onSortChange,
}: ProductFilterProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-brand-neutral/60">
      
      {/* Category Tabs */}
      <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0 flex items-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex space-x-2 md:space-x-3 whitespace-nowrap min-w-full md:min-w-0">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                id={`filter-tab-${cat.value.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => onCategoryChange(cat.value)}
                className={`relative px-4 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "text-brand-charcoal"
                    : "text-brand-charcoal/60 hover:text-brand-charcoal hover:bg-brand-neutral/80"
                }`}
              >
                <span className="relative z-10">{cat.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-brand-yellow rounded-lg shadow-sm"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sorting Select */}
      <div className="flex items-center space-x-3 self-end md:self-auto shrink-0">
        <label htmlFor="sort-select" className="text-sm font-semibold text-brand-charcoal/70 flex items-center space-x-1.5">
          <SlidersHorizontal className="w-4 h-4 text-brand-yellow" />
          <span>Sort By:</span>
        </label>
        
        <div className="relative">
          <select
            id="sort-select"
            value={activeSort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="appearance-none bg-brand-white border border-brand-coffee/20 hover:border-brand-yellow text-brand-charcoal px-4 py-2.5 pr-10 rounded-lg text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-brand-yellow focus:border-brand-yellow transition-all cursor-pointer min-w-[180px]"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-brand-charcoal/50">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

    </div>
  );
}
