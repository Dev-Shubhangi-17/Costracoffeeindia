"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, RefreshCw, ShoppingBag, ChevronRight } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { mockProducts } from "@/data/mockProducts";
import { Product } from "@/types/product";
import Link from "next/link";

// Recommender Steps definition
interface Option {
  value: string;
  label: string;
  desc: string;
}

interface Question {
  id: number;
  title: string;
  options: Option[];
}

const questions: Question[] = [
  {
    id: 1,
    title: "How do you like your coffee flavor profile?",
    options: [
      { value: "smooth", label: "Smooth & Light", desc: "Floral, fruity, tea-like clarity" },
      { value: "balanced", label: "Balanced", desc: "Chocolate, roasted hazelnut, nutty notes" },
      { value: "bold", label: "Bold & Strong", desc: "Full-bodied, intense, traditional filter kaapi" },
    ],
  },
  {
    id: 2,
    title: "What is your preferred brewing method?",
    options: [
      { value: "pourover", label: "Pour Over / Drip Bag", desc: "Paper filter gravity extraction" },
      { value: "frenchpress", label: "French Press / Espresso", desc: "Direct immersion or high pressure" },
      { value: "traditional", label: "South Indian Filter / Moka Pot", desc: "Slow drip percolation or steam" },
    ],
  },
  {
    id: 3,
    title: "Do you add milk and sugar to your cup?",
    options: [
      { value: "black", label: "Black Coffee", desc: "Pure extract, no additives" },
      { value: "light", label: "A splash of milk / sugar", desc: "Lightly sweetened or moderated body" },
      { value: "milk", label: "Classic Milk Coffee", desc: "Frothy boiled whole milk and sugar" },
    ],
  },
];

export default function PhilosophyAndQuiz() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<string[]>([]);
  const [recommendedProduct, setRecommendedProduct] = useState<Product | null>(null);
  const [isAdded, setIsAdded] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const toggleCart = useCartStore((s) => s.toggleCart);

  const handleOptionSelect = (optionValue: string) => {
    const updatedAnswers = [...answers, optionValue];
    setAnswers(updatedAnswers);

    if (step < 3) {
      setStep(step + 1);
    } else {
      // Evaluate and match product
      const matched = evaluateProduct(updatedAnswers);
      setRecommendedProduct(matched);
      setStep(4);
    }
  };

  const evaluateProduct = (ans: string[]): Product => {
    const [flavor, brew, milk] = ans;

    // 1. Traditional milk filter coffee path
    if (flavor === "bold" && brew === "traditional" && milk === "milk") {
      return mockProducts.find((p) => p.id === "costra-filter-coffee") || mockProducts[0];
    }
    // 2. Bold black coffee path
    if (flavor === "bold" && milk === "black") {
      return mockProducts.find((p) => p.id === "costra-robusta-beans-1kg") || mockProducts[3];
    }
    // 3. Smooth pour over black coffee path
    if (flavor === "smooth" && brew === "pourover") {
      return mockProducts.find((p) => p.id === "costra-arabica-beans-1kg") || mockProducts[2];
    }
    // 4. Hazelnut flavoured path
    if (flavor === "balanced" && milk === "milk") {
      return mockProducts.find((p) => p.id === "costra-hazelnut-instant") || mockProducts[1];
    }
    // Default fallback instant coffee
    return mockProducts.find((p) => p.id === "costra-instant-coffee-50g") || mockProducts[4];
  };

  const handleAddToCart = () => {
    if (!recommendedProduct) return;
    setIsAdded(true);
    addItem({
      productId: recommendedProduct.id,
      name: recommendedProduct.name,
      price: recommendedProduct.mrp,
      image: recommendedProduct.image,
      weight: recommendedProduct.netWeight,
      grind: "Filter Powder",
    });
    toggleCart(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleReset = () => {
    setStep(1);
    setAnswers([]);
    setRecommendedProduct(null);
    setIsAdded(false);
  };

  return (
    <section className="py-20 sm:py-28 bg-white border-t border-[#E5E7EB]" id="philosophy-quiz-section">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
          
          {/* Left Block: Our Philosophy */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
            <span className="text-[10px] font-black tracking-[0.25em] text-[#F5B800] uppercase block">
              OUR PHILOSOPHY
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-charcoal font-heading leading-tight tracking-tight">
              Traditional taste & rich aroma from India.
            </h2>
            <p className="text-xs sm:text-sm text-brand-charcoal/70 leading-relaxed font-semibold">
              Sourced from high-altitude estates, COSTRA blends 100% Arabica and Robusta beans with precision to deliver authentic Indian coffee culture straight to your home. Inspired by Swati Gruh Udhyog&apos;s heritage, we preserve the artisanal flame-roasting method.
            </p>
            <div className="pt-2">
              <Link
                href="#origins"
                className="group flex items-center space-x-2 text-[#F5B800] font-bold text-sm tracking-wider hover:underline transition-all cursor-pointer"
              >
                <span>EXPLORE COSTRA ORIGINS</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right Block: Coffee Recommender Widget */}
          <div className="lg:col-span-7">
            <div className="bg-[#1A1A1A] text-white p-8 sm:p-10 rounded-3xl border-t-4 border-[#F5B800] shadow-xl relative overflow-hidden flex flex-col h-full justify-between">
              
              {/* Background texture blobs */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#F5B800]/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-6">
                
                {/* Recommender Header */}
                <div className="border-b border-white/10 pb-5">
                  <span className="text-[9px] font-black tracking-[0.2em] text-[#F5B800] uppercase block mb-1">
                    FIND YOUR COFFEE
                  </span>
                  <h3 className="text-lg sm:text-xl font-extrabold font-heading text-white">
                    Coffee Recommender
                  </h3>
                  <p className="text-xs text-white/50 mt-1 font-semibold">
                    Answer 3 quick questions to find your perfect blend.
                  </p>
                </div>

                {/* Progress Indicators & Step Sheets */}
                <AnimatePresence mode="wait">
                  {step <= 3 ? (
                    <motion.div
                      key={`step-${step}`}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-5"
                    >
                      {/* Step index tag */}
                      <span className="text-[10px] font-black tracking-wider text-[#F5B800] uppercase block">
                        STEP {step} OF 3: {questions[step - 1].title}
                      </span>

                      {/* Option cards grid */}
                      <div className="space-y-3">
                        {questions[step - 1].options.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => handleOptionSelect(opt.value)}
                            className="w-full text-left p-4 bg-[#262626] hover:bg-[#333333] border border-white/5 hover:border-[#F5B800]/50 rounded-2xl transition-all flex items-center justify-between cursor-pointer group"
                          >
                            <div className="space-y-0.5 pr-4">
                              <h4 className="text-xs font-black text-white group-hover:text-[#F5B800] transition-colors uppercase tracking-wider">
                                {opt.label}
                              </h4>
                              <p className="text-[10px] text-white/50 font-bold">
                                {opt.desc}
                              </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-[#F5B800] group-hover:translate-x-0.5 transition-all" />
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    // Recommendation Card
                    <motion.div
                      key="recommendation"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-5 text-center sm:text-left"
                    >
                      <span className="text-[10px] font-black tracking-widest text-green-500 uppercase block">
                        ✓ MATCH FOUND!
                      </span>

                      {recommendedProduct && (
                        <div className="bg-[#262626] border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center sm:items-stretch gap-6">
                          
                          {/* Packaging image preview */}
                          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-2xl flex items-center justify-center p-2 shrink-0 select-none">
                            <img
                              src={recommendedProduct.image}
                              alt={`${recommendedProduct.name} - Recommended Coffee Blend`}
                              width={96}
                              height={96}
                              loading="lazy"
                              className="h-full object-contain drop-shadow"
                            />
                          </div>

                          {/* Product details */}
                          <div className="flex-grow space-y-2 text-center sm:text-left flex flex-col justify-between">
                            <div className="space-y-1">
                              <span className="text-[8px] font-black tracking-widest text-[#F5B800] uppercase block">
                                Recommended for you
                              </span>
                              <Link href={`/product/${recommendedProduct.id}`} className="hover:underline block">
                                <h4 className="text-sm sm:text-base font-extrabold text-white font-heading">
                                  {recommendedProduct.name}
                                </h4>
                              </Link>
                              <p className="text-[10px] text-white/50 font-bold leading-relaxed">
                                {recommendedProduct.description}
                              </p>
                            </div>
                            
                            <div className="flex items-baseline justify-center sm:justify-start space-x-1.5 pt-1">
                              <span className="text-base font-black text-[#F5B800]">₹{recommendedProduct.mrp}</span>
                              <span className="text-[9px] text-white/40 font-bold">/ {recommendedProduct.netWeight}</span>
                            </div>
                          </div>

                        </div>
                      )}

                      {/* Add to bag and reset buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <motion.button
                          onClick={handleAddToCart}
                          className={`flex-grow py-3.5 rounded-2xl flex items-center justify-center space-x-1.5 font-bold text-xs tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                            isAdded
                              ? "bg-green-600 text-white shadow-lg shadow-green-600/10"
                              : "bg-[#F5B800] hover:bg-[#EAA000] text-black shadow-lg shadow-[#F5B800]/10"
                          }`}
                          whileTap={{ scale: 0.96 }}
                        >
                          {isAdded ? (
                            <>
                              <CheckCircle2 className="w-4.5 h-4.5" />
                              <span>Added to Bag!</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-4.5 h-4.5" />
                              <span>Add to Cart</span>
                            </>
                          )}
                        </motion.button>

                        <button
                          onClick={handleReset}
                          className="px-5 py-3.5 rounded-2xl border border-white/10 hover:border-white/20 text-white/60 hover:text-white flex items-center justify-center space-x-2 text-xs font-bold uppercase transition-colors cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Restart</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
