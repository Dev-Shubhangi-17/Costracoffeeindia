"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Play,
  ShoppingBag,
  ChevronRight,
  ExternalLink,
  Star,
  Flame,
  Coffee,
  Timer,
  Droplets,
  Award,
  CheckCircle2,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

// ─── Brew Step Data ───────────────────────────────────────────────────────────

interface BrewStep {
  step: number;
  title: string;
  subtitle: string;
  description: string;
  tip: string;
  icon: React.ReactNode;
  duration: string;
  color: string;
  bgColor: string;
}

const brewSteps: BrewStep[] = [
  {
    step: 1,
    title: "Load the Filter Chamber",
    subtitle: "Perfect Decoction Ratio",
    description:
      "Add exactly 2 heaped tablespoons of COSTRA Filter Coffee powder (approx. 15–18g) into the upper perforated chamber of your South Indian coffee filter. Press the powder disc gently to ensure an even bed. Do not over-pack.",
    tip: "A 70:30 Robusta-Chicory ratio gives the perfect thick, frothy decoction every single time.",
    icon: <Coffee className="w-6 h-6" />,
    duration: "2 mins",
    color: "#F5B800",
    bgColor: "#FFFBEB",
  },
  {
    step: 2,
    title: "Pour & Steep Slowly",
    subtitle: "10–15 Minutes Patience",
    description:
      "Pour freshly boiled water (92–96°C) gently over the coffee bed — fill to about ¾ of the upper chamber. Cover with the lid and allow the decoction to drip through the perforated base into the lower collection vessel.",
    tip: "Never use rapidly boiling water. Let it rest 30 seconds after boiling so the flavour oils extract cleanly.",
    icon: <Droplets className="w-6 h-6" />,
    duration: "10–15 mins",
    color: "#3B82F6",
    bgColor: "#EFF6FF",
  },
  {
    step: 3,
    title: "Mix, Froth & Serve",
    subtitle: "The Dabara-Tumbler Ritual",
    description:
      "Pour the thick dark decoction into a davarah (wide flat saucer) and add freshly boiled whole milk and sugar to your taste. Froth by lifting and pouring repeatedly between the brass tumbler and davarah from a height to create the signature South Indian froth.",
    tip: "Two to three pours from height creates a rich, velvety microfoam that is the hallmark of a perfect kaapi.",
    icon: <Flame className="w-6 h-6" />,
    duration: "3–4 mins",
    color: "#EF4444",
    bgColor: "#FEF2F2",
  },
];

// ─── Product Data ─────────────────────────────────────────────────────────────

const featuredProduct = {
  id: "costra-filter-coffee",
  name: "COSTRA Filter Coffee",
  netWeight: "50g",
  mrp: 199,
  badge: "Traditional Bestseller",
  ingredients: "70% Robusta & 30% Chicory",
  rating: 4.9,
  reviewsCount: 142,
  description:
    "Traditional South Indian filter coffee blend with 70% high-grade Robusta and 30% premium Chicory.",
  image: "/images/costra-filter-coffee.jpg",
  category: "Filter Coffee",
};

// ─── Step Card Component ──────────────────────────────────────────────────────

function StepCard({ step, index }: { step: BrewStep; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="relative group"
    >
      {/* Connector line between steps (not after last) */}
      {index < brewSteps.length - 1 && (
        <div className="hidden lg:block absolute top-1/2 -right-6 z-10 w-12 h-0.5 bg-gradient-to-r from-brand-neutral to-transparent" />
      )}

      <div
        className={`rounded-3xl border overflow-hidden transition-all duration-300 cursor-pointer ${
          expanded ? "shadow-xl" : "shadow-sm hover:shadow-lg"
        }`}
        style={{ borderColor: expanded ? step.color + "55" : "#F1F1F1" }}
        onClick={() => setExpanded(!expanded)}
        id={`brew-step-card-${step.step}`}
      >
        {/* Card Top Accent */}
        <div className="h-1.5 w-full" style={{ backgroundColor: step.color }} />

        <div className="p-6" style={{ backgroundColor: expanded ? step.bgColor : "#FFFFFF" }}>
          {/* Header Row */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              {/* Step Number Badge */}
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-extrabold text-sm shrink-0 shadow-lg"
                style={{ backgroundColor: step.color === "#F5B800" ? "#1A1A1A" : step.color }}
              >
                {step.step}
              </div>
              <div>
                <p className="text-[9px] font-black tracking-widest uppercase text-brand-charcoal/40">
                  {step.subtitle}
                </p>
                <h3 className="text-base font-extrabold text-brand-charcoal mt-0.5 font-heading">
                  {step.title}
                </h3>
              </div>
            </div>

            {/* Duration Badge */}
            <div className="flex items-center space-x-1 shrink-0">
              <Timer className="w-3 h-3 text-brand-charcoal/40" />
              <span className="text-[10px] font-bold text-brand-charcoal/40">{step.duration}</span>
            </div>
          </div>

          {/* Icon Circle */}
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors"
            style={{ backgroundColor: step.color + "20", color: step.color === "#F5B800" ? "#1A1A1A" : step.color }}
          >
            {step.icon}
          </div>

          {/* Description */}
          <p className="text-sm text-brand-charcoal/70 font-medium leading-relaxed">
            {step.description}
          </p>

          {/* Expandable Tip */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div
                  className="mt-4 p-3.5 rounded-2xl flex items-start space-x-2.5 border"
                  style={{ borderColor: step.color + "33", backgroundColor: step.color + "10" }}
                >
                  <CheckCircle2
                    className="w-4 h-4 shrink-0 mt-0.5"
                    style={{ color: step.color === "#F5B800" ? "#92400E" : step.color }}
                  />
                  <p
                    className="text-[11px] font-bold leading-relaxed"
                    style={{ color: step.color === "#F5B800" ? "#78350F" : "#1A1A1A" }}
                  >
                    <span className="font-black uppercase text-[9px] tracking-widest block mb-0.5" style={{ opacity: 0.6 }}>
                      Pro Tip
                    </span>
                    {step.tip}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expand Toggle */}
          <button
            className="mt-3 text-[10px] font-black tracking-wider uppercase flex items-center space-x-1 transition-colors"
            style={{ color: step.color === "#F5B800" ? "#92400E" : step.color }}
          >
            <span>{expanded ? "Hide Tip" : "Show Pro Tip"}</span>
            <ChevronRight
              className={`w-3 h-3 transition-transform duration-200 ${expanded ? "rotate-90" : ""}`}
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Video Modal ──────────────────────────────────────────────────────────────

function VideoModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-charcoal/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", duration: 0.4 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-brand-charcoal rounded-3xl overflow-hidden w-full max-w-2xl shadow-2xl relative"
        id="brew-video-modal"
      >
        {/* Yellow Top Bar */}
        <div className="h-1.5 bg-[#F5B800] w-full" />

        <div className="p-5 flex items-center justify-between border-b border-white/10">
          <div>
            <h4 className="text-white font-extrabold text-sm">Brewing Guide Video</h4>
            <p className="text-white/40 text-[10px] font-bold mt-0.5">Traditional South Indian Filter Coffee</p>
          </div>
          <button
            id="brew-video-modal-close"
            onClick={onClose}
            className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Placeholder */}
        <div className="relative aspect-video bg-gradient-to-br from-brand-charcoal/90 to-[#332219] flex flex-col items-center justify-center space-y-4">
          {/* Coffee Cup Illustration via SVG */}
          <svg className="w-20 h-20 opacity-20" viewBox="0 0 80 80" fill="none">
            <rect x="10" y="20" width="45" height="40" rx="5" fill="#F5B800" />
            <path d="M55 30 Q70 30 70 40 Q70 50 55 50" stroke="#F5B800" strokeWidth="4" fill="none" />
            <ellipse cx="32" cy="20" rx="22" ry="5" fill="#EAA000" />
            <rect x="15" y="60" width="35" height="5" rx="2" fill="#EAA000" />
          </svg>

          <div className="text-center space-y-2">
            <p className="text-white/60 text-sm font-bold">Video Coming Soon</p>
            <p className="text-white/30 text-[11px] font-medium">Watch us brew on Instagram</p>
          </div>

          {/* Instagram CTA */}
          <a
            href="https://www.instagram.com/costra_23?igsh=MWdmMTJxamlva29wcQ=="
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-4 py-2.5 bg-[#F5B800] text-brand-charcoal rounded-xl font-bold text-xs hover:bg-[#EAA000] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Watch on @costra_23</span>
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BrewGuide() {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const toggleCart = useCartStore((s) => s.toggleCart);

  const handleAddToCart = () => {
    addItem({
      productId: featuredProduct.id,
      name: featuredProduct.name,
      price: featuredProduct.mrp,
      image: featuredProduct.image,
      weight: featuredProduct.netWeight,
      grind: "Traditional Filter Powder",
    });
    setAddedToCart(true);
    toggleCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  return (
    <section className="py-20 sm:py-28 bg-white overflow-hidden" id="brew-guide-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14 space-y-4"
        >
          <span className="inline-block text-[10px] font-black tracking-[0.3em] uppercase text-[#F5B800] bg-[#F5B800]/10 px-4 py-1.5 rounded-full border border-[#F5B800]/20">
            Brewing Ritual
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-charcoal font-heading leading-tight">
            How to Brew the Perfect
            <br />
            <span className="text-[#F5B800]">COSTRA Filter Coffee</span>
          </h2>
          <p className="text-brand-charcoal/50 max-w-xl mx-auto text-sm sm:text-base font-medium leading-relaxed">
            Three simple steps rooted in generations of South Indian coffee tradition.
            Follow this ritual and experience the authentic richness of every cup.
          </p>

          {/* Video CTA Button */}
          <motion.button
            id="brew-guide-video-btn"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowVideoModal(true)}
            className="inline-flex items-center space-x-2.5 mt-2 px-6 py-3 bg-brand-charcoal text-white rounded-2xl font-bold text-sm hover:bg-brand-charcoal/85 transition-all shadow-lg shadow-brand-charcoal/10 cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-[#F5B800] flex items-center justify-center">
              <Play className="w-3.5 h-3.5 text-brand-charcoal fill-current ml-0.5" />
            </div>
            <span>Watch Brewing Video</span>
          </motion.button>
        </motion.div>

        {/* Two-column: Illustration + Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start mb-16">

          {/* Left: Illustration Panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 relative"
          >
            <div className="relative rounded-3xl bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7] border border-[#F5B800]/20 overflow-hidden p-8 flex flex-col items-center justify-center min-h-72">
              {/* Decorative blobs */}
              <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-[#F5B800]/10 blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-[#EAA000]/15 blur-xl" />

              {/* Coffee Filter SVG Illustration */}
              <svg viewBox="0 0 200 240" className="w-48 h-56 relative z-10" fill="none">
                {/* Upper chamber */}
                <rect x="40" y="20" width="120" height="70" rx="10" fill="#D4A017" />
                <rect x="50" y="30" width="100" height="50" rx="8" fill="#F5B800" />
                {/* Perforations */}
                {[0,1,2,3].map(row => [0,1,2,3,4].map(col => (
                  <circle key={`${row}-${col}`} cx={62 + col * 20} cy={42 + row * 12} r="2" fill="#D4A017" />
                )))}
                {/* Lid */}
                <ellipse cx="100" cy="22" rx="62" ry="8" fill="#EAA000" />
                <ellipse cx="100" cy="22" rx="40" ry="5" fill="#D4A017" />
                {/* Handle/knob */}
                <rect x="88" y="8" width="24" height="14" rx="7" fill="#D4A017" />
                {/* Lower collection vessel */}
                <rect x="35" y="95" width="130" height="85" rx="10" fill="#92400E" />
                <rect x="45" y="103" width="110" height="67" rx="7" fill="#7C3209" />
                {/* Decoction liquid */}
                <rect x="48" y="128" width="104" height="40" rx="5" fill="#5C2009" />
                {/* Tumbler */}
                <rect x="150" y="130" width="32" height="48" rx="6" fill="#D4A017" />
                <ellipse cx="166" cy="130" rx="16" ry="5" fill="#EAA000" />
                {/* Davarah saucer */}
                <ellipse cx="166" cy="178" rx="22" ry="7" fill="#EAA000" />
                {/* Steam */}
                {[0,1,2].map(i => (
                  <path
                    key={i}
                    d={`M${78 + i * 18} 96 Q${82 + i * 18} 82 ${78 + i * 18} 68`}
                    stroke="#F5B800"
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.4"
                  />
                ))}
              </svg>

              {/* Info Badges */}
              <div className="mt-5 flex flex-wrap gap-2 justify-center relative z-10">
                {[
                  { icon: "☕", label: "70% Robusta" },
                  { icon: "🌿", label: "30% Chicory" },
                  { icon: "🏆", label: "FSSAI Certified" },
                ].map(badge => (
                  <span
                    key={badge.label}
                    className="px-2.5 py-1 rounded-full bg-white border border-[#F5B800]/30 text-[10px] font-bold text-brand-charcoal/70 flex items-center space-x-1"
                  >
                    <span>{badge.icon}</span>
                    <span>{badge.label}</span>
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Steps Grid */}
          <div className="lg:col-span-3 flex flex-col space-y-4">
            {brewSteps.map((step, idx) => (
              <StepCard key={step.step} step={step} index={idx} />
            ))}
          </div>
        </div>

        {/* Bottom: Recommended Product Widget */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl bg-brand-charcoal overflow-hidden"
          id="brew-guide-product-widget"
        >
          {/* Yellow left accent stripe */}
          <div className="absolute left-0 inset-y-0 w-1.5 bg-[#F5B800]" />

          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#F5B800]/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none" />

          <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">

            {/* Left Content */}
            <div className="flex items-center space-x-5">
              {/* Product Canister SVG */}
              <div className="w-16 h-16 shrink-0 rounded-2xl bg-[#F5B800]/10 border border-[#F5B800]/20 flex items-center justify-center">
                <svg viewBox="0 0 64 64" className="w-9 h-9" fill="none">
                  <rect x="12" y="16" width="40" height="36" rx="6" fill="#F5B800" />
                  <rect x="18" y="22" width="28" height="24" rx="4" fill="#1A1A1A" />
                  <text x="32" y="36" textAnchor="middle" fill="#F5B800" fontSize="7" fontWeight="bold" fontFamily="sans-serif">COSTRA</text>
                  <text x="32" y="44" textAnchor="middle" fill="#F5B800" fontSize="5" fontFamily="sans-serif">50g</text>
                  <ellipse cx="32" cy="16" rx="20" ry="5" fill="#EAA000" />
                  <ellipse cx="32" cy="52" rx="20" ry="5" fill="#EAA000" />
                </svg>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                  <span className="px-2.5 py-0.5 bg-[#F5B800] text-brand-charcoal rounded-full text-[9px] font-black tracking-widest uppercase">
                    {featuredProduct.badge}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-[#F5B800] fill-current" />
                    <span className="text-[10px] font-bold text-white/60">
                      {featuredProduct.rating} ({featuredProduct.reviewsCount} reviews)
                    </span>
                  </div>
                </div>
                <h4 className="text-white font-extrabold text-base sm:text-lg font-heading">
                  {featuredProduct.name}
                </h4>
                <p className="text-white/50 text-[11px] font-semibold leading-relaxed max-w-xs">
                  {featuredProduct.ingredients} — perfect for this brewing guide.
                </p>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-[#F5B800] font-black text-xl">₹{featuredProduct.mrp}</span>
                  <span className="text-white/40 text-xs font-bold">/ {featuredProduct.netWeight}</span>
                </div>
              </div>
            </div>

            {/* Right CTAs */}
            <div className="flex flex-col sm:items-end space-y-2.5 w-full sm:w-auto">
              {/* FSSAI Badge */}
              <div className="flex items-center space-x-1.5 text-white/30">
                <Award className="w-3.5 h-3.5" />
                <span className="text-[9px] font-black tracking-widest uppercase">FSSAI Lic: 20726032000830</span>
              </div>

              {/* Add to Cart */}
              <motion.button
                id="brew-guide-add-to-cart-btn"
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                className={`flex items-center space-x-2 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 cursor-pointer whitespace-nowrap ${
                  addedToCart
                    ? "bg-green-500 text-white shadow-lg shadow-green-500/20"
                    : "bg-[#F5B800] text-brand-charcoal hover:bg-[#EAA000] shadow-lg shadow-[#F5B800]/15"
                }`}
              >
                {addedToCart ? (
                  <>
                    <CheckCircle2 className="w-4.5 h-4.5" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4.5 h-4.5" />
                    <span>Buy COSTRA Filter Coffee 50g — ₹199</span>
                  </>
                )}
              </motion.button>

              {/* WhatsApp Order */}
              <a
                href={`https://wa.me/918734082232?text=${encodeURIComponent("Hello COSTRA! I would like to order the COSTRA Filter Coffee 50g pack (₹199/-). Please confirm availability.")}`}
                target="_blank"
                rel="noopener noreferrer"
                id="brew-guide-whatsapp-order-btn"
                className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-2xl border border-white/15 text-white/70 text-xs font-bold hover:border-[#25D366]/50 hover:text-[#25D366] transition-all"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.019-5.116-2.876-6.974A9.774 9.774 0 0 0 12.008 1.84c-5.439 0-9.863 4.421-9.867 9.867-.001 1.735.469 3.43 1.36 4.938l-.983 3.595 3.699-.97c1.517.828 3.195 1.264 4.84 1.264zm5.727-11.758c-.235-.526-.483-.537-.706-.546-.184-.007-.394-.007-.604-.007-.21 0-.552.079-.841.394-.29.316-1.104 1.078-1.104 2.629 0 1.551 1.13 3.05 1.288 3.261.158.21 2.221 3.391 5.38 4.757.753.325 1.341.52 1.801.666.757.24 1.446.206 1.99.125.607-.09 1.847-.756 2.109-1.485.263-.729.263-1.353.184-1.485-.079-.131-.29-.21-.604-.368-.315-.158-1.847-.912-2.136-1.018-.29-.105-.5-.158-.707.158-.207.316-.802 1.018-.983 1.229-.181.21-.362.237-.677.079-.315-.158-1.332-.491-2.536-1.566-.937-.836-1.57-1.868-1.753-2.184-.183-.316-.02-.487.138-.644.142-.142.315-.368.473-.552.158-.184.21-.316.315-.526.105-.21.053-.395-.026-.552-.079-.158-.707-1.702-.973-2.299z" />
                </svg>
                <span>Order via WhatsApp</span>
              </a>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideoModal && <VideoModal onClose={() => setShowVideoModal(false)} />}
      </AnimatePresence>
    </section>
  );
}
