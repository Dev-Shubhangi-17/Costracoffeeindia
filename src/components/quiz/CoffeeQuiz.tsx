"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, RotateCcw, Check, ShoppingBag, Sparkles, ChevronRight } from "lucide-react";
import { mockProducts } from "@/data/mockProducts";
import { useCartStore } from "@/store/useCartStore";

// Quiz Step definitions
const steps = [
  {
    id: "brew",
    title: "How do you usually brew your coffee?",
    options: [
      { id: "filter", label: "South Indian Brass Filter", desc: "Traditional slow-drip thick decoction", icon: "☕" },
      { id: "espresso", label: "Espresso Machine", desc: "High pressure concentrated shots", icon: "⚡" },
      { id: "pourover", label: "Pour Over / Drip", desc: "Clean, artisanal pour-over cup", icon: "💧" },
      { id: "drip", label: "Electric Coffee Maker", desc: "Convenient automatic drip brewer", icon: "🔌" },
      { id: "instant", label: "Instant Coffee Cup", desc: "Quick dissolvable cup on the go", icon: "⏱️" },
    ],
  },
  {
    id: "taste",
    title: "What taste profile do you prefer?",
    options: [
      { id: "strong", label: "Strong & Bold (Chicory Blend)", desc: "Heavy body, rich crema, low bitterness", icon: "🔥" },
      { id: "smooth", label: "Smooth & Aromatic (Pure Arabica)", desc: "Sweet chocolatey finish, refined notes", icon: "🌱" },
      { id: "balanced", label: "Balanced Traditional", desc: "Classic rich taste, medium body", icon: "⚖️" },
    ],
  },
  {
    id: "milk",
    title: "How do you like to take your brew?",
    options: [
      { id: "milk-strong", label: "Strong Milk Coffee", desc: "Traditional frothy milk & sugar", icon: "🥛" },
      { id: "milk-light", label: "Less Milk Light Brew", desc: "Splash of milk, minimal sugar", icon: "☁️" },
      { id: "black", label: "Black Coffee", desc: "Zero milk, enjoying the pure extraction", icon: "⚫" },
    ],
  },
];

export default function CoffeeQuiz() {
  const [stepIndex, setStepIndex] = useState(-1); // -1: Intro Screen, steps.length: Result
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isCalculating, setIsCalculating] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const activeQuestion = steps[stepIndex];
  const progressPercent = stepIndex >= 0 ? ((stepIndex) / steps.length) * 100 : 0;

  const handleSelectOption = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    
    const nextStep = stepIndex + 1;
    if (nextStep < steps.length) {
      setStepIndex(nextStep);
    } else {
      // Trigger calculation loading animation
      setIsCalculating(true);
      setStepIndex(steps.length);
      setTimeout(() => {
        setIsCalculating(false);
      }, 1500);
    }
  };

  const handleRestart = () => {
    setAnswers({});
    setStepIndex(-1);
    setIsCalculating(false);
    setIsAdded(false);
  };

  // evaluation engine
  const matchedData = useMemo(() => {
    if (stepIndex < steps.length) return null;
    const { brew, taste, milk } = answers;
    
    let productId = "costra-filter-coffee";
    let rationale = "";

    if (brew === "instant") {
      productId = "costra-instant-coffee-50g";
      rationale = "For a quick, rich cup without any brewing equipment, our COSTRA Instant Coffee made with 70% Arabica and 30% Chicory is your match. It dissolves instantly while preserving a rich aroma.";
    } else if (brew === "pourover") {
      productId = "costra-arabica-beans-1kg";
      rationale = "For coffee lovers who appreciate delicate, aromatic notes, our COSTRA Arabica Coffee Beans (100% Arabica roasted whole beans) provide a clean, smooth, and chocolatey profile.";
    } else if (taste === "smooth") {
      productId = "costra-arabica-beans-1kg";
      rationale = "Since you prefer a smooth, aromatic cup, our COSTRA Arabica Coffee Beans (100% Arabica) offer a velvety finish with chocolatey and fruity notes.";
    } else if (taste === "strong") {
      if (milk === "black") {
        productId = "costra-robusta-beans-1kg";
        rationale = "Since you love your coffee strong, bold, and black, the COSTRA Robusta Coffee Beans (100% Robusta whole beans) offer a deep, powerful body that cuts through beautifully.";
      } else {
        productId = "costra-filter-coffee";
        rationale = "For a traditional, heavy South Indian filter coffee with milk, our flagship COSTRA Filter Coffee (70% Robusta & 30% Chicory) delivers the perfect balance of chicory thickness.";
      }
    } else {
      if (milk === "milk-strong") {
        productId = "costra-filter-coffee";
        rationale = "For a strong, creamy milk coffee, the 70% Robusta & 30% Chicory traditional ratio is optimal, ensuring the rich coffee body isn't overpowered by milk.";
      } else {
        productId = "costra-arabica-beans-1kg";
        rationale = "For a balanced traditional cup that works well either black or with a splash of milk, our Premium Arabica whole beans are highly versatile.";
      }
    }

    const product = mockProducts.find((p) => p.id === productId) || mockProducts[0];
    return { product, rationale };
  }, [answers, stepIndex]);

  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    if (!matchedData) return;
    setIsAdded(true);
    addItem({
      productId: matchedData.product.id,
      name: matchedData.product.name,
      weight: matchedData.product.netWeight,
      grind: "Filter Powder",
      price: matchedData.product.mrp,
      image: matchedData.product.image,
    });
    setTimeout(() => setIsAdded(false), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.96 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" as const } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.96,
      transition: { duration: 0.2, ease: "easeIn" as const } 
    }
  };

  return (
    <div 
      className="bg-brand-white border-2 border-brand-yellow/80 rounded-3xl p-6 sm:p-10 shadow-xl max-w-2xl mx-auto relative overflow-hidden"
      id="coffee-quiz-widget"
    >
      {/* Decorative vector coffee beans */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-yellow/5 rounded-full blur-xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand-coffee/5 rounded-full blur-xl pointer-events-none" />

      <AnimatePresence mode="wait">
        
        {/* Step -1: Intro Screen */}
        {stepIndex === -1 && (
          <motion.div
            key="intro"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="text-center space-y-6"
          >
            <div className="mx-auto w-16 h-16 bg-brand-yellow rounded-2xl flex items-center justify-center text-brand-charcoal shadow-md">
              <Coffee className="w-8 h-8 stroke-[2]" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold tracking-tight text-brand-charcoal font-heading">
                Find Your Perfect Brew Ratio
              </h3>
              <p className="text-sm text-brand-charcoal/70 max-w-md mx-auto leading-relaxed">
                Answer 3 quick questions about your brewing habits and taste preferences to unlock your custom COSTRA ratio recommendation.
              </p>
            </div>

            <button
              id="quiz-btn-start"
              onClick={() => setStepIndex(0)}
              className="bg-brand-charcoal hover:bg-brand-coffee text-brand-yellow font-bold text-xs tracking-wider uppercase px-8 py-3.5 rounded-xl shadow-md transition-all duration-300 cursor-pointer"
            >
              Start Customizer Quiz
            </button>
          </motion.div>
        )}

        {/* Step 0 to 2: Active Questions */}
        {stepIndex >= 0 && stepIndex < steps.length && activeQuestion && (
          <motion.div
            key={activeQuestion.id}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            {/* Progress indicator */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-bold tracking-widest text-brand-charcoal/40 uppercase">
                <span>Question {stepIndex + 1} of {steps.length}</span>
                <span>{Math.round(progressPercent)}% Completed</span>
              </div>
              <div className="w-full h-1.5 bg-brand-neutral rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-brand-yellow" 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Question title */}
            <h3 className="text-lg sm:text-xl font-bold text-brand-charcoal font-heading">
              {activeQuestion.title}
            </h3>

            {/* Option buttons */}
            <div className="space-y-3">
              {activeQuestion.options.map((opt) => (
                <button
                  key={opt.id}
                  id={`quiz-option-${activeQuestion.id}-${opt.id}`}
                  onClick={() => handleSelectOption(activeQuestion.id, opt.id)}
                  className="w-full text-left bg-brand-white border border-brand-coffee/15 hover:border-brand-yellow p-4 rounded-2xl flex items-center justify-between transition-all duration-200 shadow-sm hover:shadow group cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl select-none" role="img" aria-label={opt.label}>
                      {opt.icon}
                    </span>
                    <div>
                      <span className="font-bold text-sm text-brand-charcoal block group-hover:text-brand-yellow transition-colors">
                        {opt.label}
                      </span>
                      <span className="text-xs text-brand-charcoal/50 leading-relaxed block mt-0.5">
                        {opt.desc}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-brand-charcoal/30 group-hover:text-brand-yellow group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>

            {/* Back to intro button */}
            <button
              id="quiz-btn-back-intro"
              onClick={handleRestart}
              className="text-xs font-semibold text-brand-charcoal/40 hover:text-brand-charcoal transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset & Back to Start</span>
            </button>
          </motion.div>
        )}

        {/* Calculating Loading State */}
        {stepIndex === steps.length && isCalculating && (
          <motion.div
            key="loading"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="text-center space-y-6 py-8"
          >
            {/* Spinning Customizer Loader */}
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-brand-yellow/20 border-t-brand-yellow animate-spin" />
              <Coffee className="w-6 h-6 text-brand-yellow absolute inset-0 m-auto animate-pulse" />
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-bold tracking-widest text-brand-charcoal/50 uppercase">
                Analyzing Brew Preferences
              </h4>
              <p className="text-xs text-brand-charcoal/40 font-semibold">
                Calculating your optimal Robusta/Arabica Chicory ratio...
              </p>
            </div>
          </motion.div>
        )}

        {/* Results Screen */}
        {stepIndex === steps.length && !isCalculating && matchedData && (
          <motion.div
            key="results"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8"
          >
            {/* Yellow / White transition header */}
            <div className="text-center space-y-2 pb-6 border-b border-brand-neutral">
              <div className="inline-flex items-center space-x-1.5 text-brand-yellow font-bold uppercase tracking-widest text-[10px]">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>Recommendation Unlocked</span>
              </div>
              <h3 className="text-2xl font-extrabold text-brand-charcoal font-heading">
                Your Ideal COSTRA Blend
              </h3>
            </div>

            {/* Matched Product Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-brand-neutral/40 p-6 rounded-2xl border border-brand-neutral">
              
              {/* Product package container */}
              <div className="md:col-span-4 flex justify-center">
                <div className={`relative w-28 h-36 bg-brand-charcoal rounded-2xl shadow-xl border border-brand-coffee/40 flex flex-col justify-between p-3 overflow-hidden select-none bg-gradient-to-tr ${matchedData.product.image}`}>
                  <div className="absolute top-0 left-0 right-0 h-2.5 bg-brand-yellow border-b border-brand-charcoal/20 flex justify-around items-center px-1">
                    <div className="w-1 h-1 rounded-full bg-brand-charcoal/35" />
                    <div className="w-1 h-1 rounded-full bg-brand-charcoal/35" />
                  </div>

                  <div className="mt-3 text-center">
                    <span className="text-[11px] font-black tracking-widest text-brand-yellow block leading-none font-heading">
                      COSTRA
                    </span>
                    <span className="text-[5px] text-brand-white/40 tracking-widest uppercase block leading-none mt-0.5">
                      Premium Ratio
                    </span>
                  </div>

                  <div className="bg-brand-white/95 px-2 py-1 rounded-md border border-brand-yellow/30 shadow-sm text-center">
                    <span className="text-[7px] font-bold text-brand-charcoal block truncate leading-tight">
                      {matchedData.product.name.replace("COSTRA ", "")}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[5px] text-brand-white/40 font-mono">
                    <span>MATCHED</span>
                    <span>100% PURE</span>
                  </div>
                </div>
              </div>

              {/* Product details and rationale */}
              <div className="md:col-span-8 space-y-4">
                <div>
                  <span className="inline-block text-[9px] font-bold tracking-wider text-brand-coffee bg-brand-yellow/20 px-2 py-0.5 rounded-full border border-brand-yellow/30 mb-1.5">
                    {matchedData.product.ingredients}
                  </span>
                  <h4 className="text-lg font-bold text-brand-charcoal">
                    {matchedData.product.name}
                  </h4>
                  <span className="text-sm font-extrabold text-brand-charcoal block mt-0.5">
                    ₹{matchedData.product.mrp}
                  </span>
                </div>

                <p className="text-xs text-brand-charcoal/70 leading-relaxed font-medium">
                  {matchedData.rationale}
                </p>
              </div>

            </div>

            {/* Actions Panel */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-brand-neutral">
              {/* Retake Button */}
              <button
                id="quiz-btn-retake"
                onClick={handleRestart}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 text-brand-charcoal/70 hover:text-brand-charcoal font-bold text-xs tracking-wider uppercase py-3.5 px-6 rounded-xl border border-brand-coffee/20 hover:border-brand-yellow hover:bg-brand-neutral/40 transition-all duration-200 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Quiz</span>
              </button>

              {/* Add matched product directly */}
              <button
                id="quiz-btn-add-matched-to-cart"
                onClick={handleAddToCart}
                className={`w-full sm:w-auto px-8 py-3.5 rounded-xl flex items-center justify-center space-x-2 font-bold text-xs tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                  isAdded
                    ? "bg-green-600 text-white shadow-md shadow-green-600/10"
                    : "bg-brand-yellow hover:bg-brand-gold text-brand-charcoal shadow-md shadow-brand-yellow/15 hover:shadow-brand-yellow/25"
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                    <span>Add matched to bag • ₹{matchedData.product.mrp}</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
