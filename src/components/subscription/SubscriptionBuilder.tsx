"use client";

import React, { useState } from "react";
import { Check, Calendar, ShoppingBag, Coffee } from "lucide-react";

const packs = [
  { id: "2packs", label: "2 x 250g Custom Packs", desc: "Ideal for couples & light coffee drinkers", price: 360 },
  { id: "4packs", label: "4 x 250g Family Pack", desc: "Perfect for daily household filter coffee", price: 700 },
  { id: "6packs", label: "6 x 250g Coffee Lover Pack", desc: "Best for heavy drinkers & workspace needs", price: 1000 },
];

const frequencies = [
  { id: "15days", label: "Every 15 Days", multiplier: 2, labelFreq: "Fortnightly" },
  { id: "month", label: "Every Month", multiplier: 1, labelFreq: "Monthly" },
  { id: "2months", label: "Every 2 Months", multiplier: 0.5, labelFreq: "Bi-Monthly" },
];

const grinds = [
  { id: "powder", label: "Pre-ground Filter Powder", desc: "Traditional slow extraction grind" },
  { id: "beans", label: "Whole Coffee Beans", desc: "Grind fresh at home for premium aroma" },
];

export default function SubscriptionBuilder() {
  const [selectedPack, setSelectedPack] = useState("2packs");
  const [selectedFreq, setSelectedFreq] = useState("month");
  const [selectedGrind, setSelectedGrind] = useState("powder");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const packObj = packs.find((p) => p.id === selectedPack) || packs[0];
  const freqObj = frequencies.find((f) => f.id === selectedFreq) || frequencies[1];

  // Price calculations based on frequency multiplier (delivered frequency)
  const baseCost = packObj.price * freqObj.multiplier;
  const discount = Math.round(baseCost * 0.1);
  const finalPrice = baseCost - discount;

  const handleSubscribe = () => {
    setIsSubscribed(true);
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  return (
    <div 
      className="bg-brand-white border border-brand-neutral/80 rounded-3xl p-6 sm:p-8 shadow-xl max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 relative overflow-hidden"
      id="subscription-builder-widget"
    >
      
      {/* Left Column: Preference Selectors */}
      <div className="md:col-span-7 space-y-6">
        
        {/* Step 1: Select Packs */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-brand-charcoal uppercase tracking-widest flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-brand-yellow text-brand-charcoal text-[11px] flex items-center justify-center font-black">
              1
            </span>
            <span>Choose Monthly Supply Size</span>
          </h4>
          <div className="space-y-2">
            {packs.map((pack) => {
              const isSelected = selectedPack === pack.id;
              return (
                <button
                  key={pack.id}
                  id={`sub-pack-${pack.id}`}
                  onClick={() => setSelectedPack(pack.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between group cursor-pointer ${
                    isSelected
                      ? "border-brand-yellow bg-brand-yellow/5 shadow-sm ring-1 ring-brand-yellow"
                      : "border-brand-coffee/15 bg-brand-white hover:border-brand-yellow/40"
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-sm font-bold text-brand-charcoal block group-hover:text-brand-yellow transition-colors">
                      {pack.label}
                    </span>
                    <span className="text-xs text-brand-charcoal/50 block">
                      {pack.desc}
                    </span>
                  </div>
                  <div className="text-right font-extrabold text-sm text-brand-charcoal shrink-0 ml-4">
                    ₹{pack.price}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Delivery Frequency */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-brand-charcoal uppercase tracking-widest flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-brand-yellow text-brand-charcoal text-[11px] flex items-center justify-center font-black">
              2
            </span>
            <span>Select Delivery Frequency</span>
          </h4>
          <div className="grid grid-cols-3 gap-3">
            {frequencies.map((freq) => {
              const isSelected = selectedFreq === freq.id;
              return (
                <button
                  key={freq.id}
                  id={`sub-freq-${freq.id}`}
                  onClick={() => setSelectedFreq(freq.id)}
                  className={`py-3 px-2 rounded-xl text-center border transition-all duration-200 cursor-pointer select-none flex flex-col justify-center items-center ${
                    isSelected
                      ? "bg-brand-charcoal border-brand-charcoal text-brand-yellow shadow-md font-bold"
                      : "bg-brand-white border-brand-coffee/15 text-brand-charcoal/70 hover:border-brand-yellow/50"
                  }`}
                >
                  <Calendar className="w-4 h-4 mb-1" />
                  <span className="text-[10px] font-bold block leading-none">
                    {freq.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Grind Preference */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-brand-charcoal uppercase tracking-widest flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-brand-yellow text-brand-charcoal text-[11px] flex items-center justify-center font-black">
              3
            </span>
            <span>Choose Grind Style</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {grinds.map((grind) => {
              const isSelected = selectedGrind === grind.id;
              return (
                <button
                  key={grind.id}
                  id={`sub-grind-${grind.id}`}
                  onClick={() => setSelectedGrind(grind.id)}
                  className={`text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "border-brand-yellow bg-brand-yellow/5 shadow-sm ring-1 ring-brand-yellow"
                      : "border-brand-coffee/15 bg-brand-white hover:border-brand-yellow/40"
                  }`}
                >
                  <span className="text-xs font-bold text-brand-charcoal block mb-0.5">
                    {grind.label}
                  </span>
                  <span className="text-[10px] text-brand-charcoal/50 leading-relaxed block font-semibold">
                    {grind.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Right Column: Dynamic Summary Sidebar */}
      <div className="md:col-span-5 flex flex-col justify-between">
        
        {/* Yellow Header Panel Summary card */}
        <div className="bg-brand-yellow rounded-2xl text-brand-charcoal p-6 flex flex-col justify-between h-full shadow-md border border-brand-yellow/20">
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Coffee className="w-5 h-5 stroke-[2.5]" />
              <span className="text-xs font-black tracking-widest uppercase">
                Supply Summary
              </span>
            </div>

            {/* Calculations matrix */}
            <div className="space-y-2.5 text-xs font-bold border-b border-brand-charcoal/10 pb-4">
              <div className="flex justify-between">
                <span>Monthly Base Cost</span>
                <span>₹{baseCost}</span>
              </div>
              <div className="flex justify-between text-brand-charcoal/80">
                <span>Subscriber 10% Discount</span>
                <span>- ₹{discount}</span>
              </div>
              <div className="flex justify-between text-green-800">
                <span>Delivery Perk</span>
                <span className="font-extrabold">FREE (Save ₹50)</span>
              </div>
            </div>

            {/* Quality checklist */}
            <ul className="space-y-2 text-[10px] font-bold text-brand-charcoal/80">
              <li className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 stroke-[3] shrink-0" />
                <span>Fresh Batch Guaranteed (Small Roasts)</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 stroke-[3] shrink-0" />
                <span>Never Run Out of Filter Coffee</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 stroke-[3] shrink-0" />
                <span>Modify, Pause, or Cancel Anytime</span>
              </li>
            </ul>
          </div>

          <div className="pt-6 mt-6 border-t border-brand-charcoal/10 space-y-4">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[10px] font-black tracking-wider text-brand-charcoal/60 uppercase block leading-none mb-1">
                  Deliveries {freqObj.labelFreq}
                </span>
                <span className="text-2xl font-black">
                  ₹{finalPrice}
                </span>
              </div>
              <span className="text-[10px] font-bold bg-brand-charcoal text-brand-yellow px-2 py-0.5 rounded tracking-widest uppercase">
                Per Cycle
              </span>
            </div>

            {/* CTA Button */}
            <button
              id="sub-builder-subscribe-btn"
              onClick={handleSubscribe}
              className={`w-full py-4 rounded-xl flex items-center justify-center space-x-2 font-black text-xs tracking-widest uppercase transition-all duration-300 shadow-lg cursor-pointer ${
                isSubscribed
                  ? "bg-green-700 text-white shadow-green-700/20"
                  : "bg-brand-charcoal text-brand-yellow hover:bg-brand-coffee shadow-brand-charcoal/20"
              }`}
            >
              {isSubscribed ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Subscribed Successfully!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                  <span>Subscribe Now • ₹{finalPrice}</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
