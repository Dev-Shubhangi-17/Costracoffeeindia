"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, ShieldCheck, Info, BookOpen, Star, Sparkles } from "lucide-react";
import { trackViewItem } from "@/lib/analytics";
import { motion, AnimatePresence } from "framer-motion";
import { mockProducts } from "@/data/mockProducts";
import ProductGallery from "@/components/pdp/ProductGallery";
import ProductOptions from "@/components/pdp/ProductOptions";

// Accordion Panel component
interface AccordionItemProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function AccordionItem({ id, title, icon, children }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-brand-coffee/10 rounded-2xl bg-brand-white shadow-sm overflow-hidden">
      <button
        id={`pdp-accordion-trigger-${id}`}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-brand-charcoal hover:bg-brand-neutral/40 transition-colors select-none cursor-pointer"
      >
        <div className="flex items-center space-x-3">
          <div className="text-brand-yellow shrink-0">{icon}</div>
          <span className="tracking-wide">{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4.5 h-4.5 text-brand-charcoal/60 shrink-0" />
        ) : (
          <ChevronDown className="w-4.5 h-4.5 text-brand-charcoal/60 shrink-0" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-5 pt-0 border-t border-brand-neutral text-xs sm:text-sm text-brand-charcoal/70 leading-relaxed space-y-4 bg-brand-neutral/20">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductDetailClient({ productId }: { productId: string }) {
  // Resolve product using dynamic path parameter, fallback to traditional blend to prevent crashes
  const product = mockProducts.find((p) => p.id === productId) || mockProducts[0];

  useEffect(() => {
    if (product) {
      trackViewItem({
        id: product.id,
        name: product.name,
        mrp: product.mrp,
        category: product.category,
      });
    }
  }, [product]);

  return (
    <div className="bg-brand-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Breadcrumbs */}
        <nav className="text-xs font-semibold text-brand-charcoal/40 uppercase tracking-widest mb-8 flex items-center space-x-2">
          <a href="/" className="hover:text-brand-yellow transition-colors">Home</a>
          <span>/</span>
          <a href="/#shop-catalog" className="hover:text-brand-yellow transition-colors">Shop</a>
          <span>/</span>
          <span className="text-brand-charcoal/80">{product.name}</span>
        </nav>

        {/* Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Visual Gallery */}
          <div className="lg:col-span-6">
            <ProductGallery image={product.image} productName={product.name} />
          </div>

          {/* Right Column: Title Info & Selection options */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Header info */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                {product.badge && (
                  <span className="bg-brand-charcoal text-brand-yellow text-[9px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full shadow-sm">
                    {product.badge}
                  </span>
                )}
                
                {/* Stylized FSSAI licence tag */}
                <span className="inline-flex items-center space-x-1.5 bg-green-50 border border-green-200 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
                  <span>FSSAI LIC: 20726032000830</span>
                </span>
              </div>

              {/* Title & Brand */}
              <div className="space-y-1">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-charcoal tracking-tight font-heading">
                  {product.name}
                </h1>
                <p className="text-xs sm:text-sm font-bold text-brand-yellow uppercase tracking-widest flex items-center space-x-1.5">
                  <span>By Swati Gruh Udhyog</span>
                  <span className="w-1 h-1 rounded-full bg-brand-yellow" />
                  <span>India</span>
                </p>
              </div>

              {/* Ingredients tag box */}
              <div className="inline-block bg-brand-yellow/10 border border-brand-yellow/20 px-3 py-1.5 rounded-xl">
                <span className="text-[10px] font-bold text-brand-charcoal/50 uppercase block tracking-wider leading-none mb-1">
                  Blend Ingredients
                </span>
                <span className="text-xs font-extrabold text-brand-coffee">
                  {product.ingredients}
                </span>
              </div>

              {/* Rating Summary */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center text-brand-yellow">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? "fill-brand-yellow"
                          : "text-brand-neutral fill-brand-neutral"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-brand-charcoal">
                  {product.rating} / 5.0
                </span>
                <span className="text-xs text-brand-charcoal/40 font-semibold">
                  ({product.reviewsCount} verified consumer reviews)
                </span>
              </div>
            </div>

            {/* Selection Matrix Component */}
            <div className="bg-brand-neutral/30 border border-brand-neutral p-6 rounded-3xl">
              <ProductOptions productId={product.id} />
            </div>

          </div>

        </div>

        {/* Bottom Accordion Information Panels */}
        <div className="max-w-3xl mx-auto pt-16 border-t border-brand-neutral mt-16 space-y-4">
          
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center space-x-1.5 text-brand-yellow font-bold uppercase tracking-widest text-[10px]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>COSTRA Coffee Guide</span>
            </div>
            <h2 className="text-2xl font-extrabold text-brand-charcoal font-heading">
              Additional Product Information
            </h2>
          </div>

          {/* Panel 1: Brewing Guide */}
          <AccordionItem
            id="brew-guide"
            title="How to Brew Perfect South Indian Filter Coffee"
            icon={<BookOpen className="w-5 h-5" />}
          >
            <p className="font-semibold text-brand-charcoal">Follow this traditional 3-step visual instruction to enjoy authentic frothy coffee:</p>
            <ol className="space-y-3 list-decimal list-inside pl-1">
              <li>
                <strong>Load the Filter:</strong> Add 2-3 tablespoons of COSTRA Filter Coffee powder into the upper grid chamber of your brass coffee filter. Tap gently to level the powder.
              </li>
              <li>
                <strong>Drip Steep:</strong> Pour 50-60ml of freshly boiled water over the press disc/powder. Seal the filter lid and let it steep undisturbed for 15-20 minutes to collect the thick, dark aromatic decoction in the bottom chamber.
              </li>
              <li>
                <strong>Froth & Serve:</strong> Mix 20ml of this fresh decoction with 100ml of hot boiling milk and sugar to taste. Pour back and forth between a cup and a Dabara tumbler from a height to create a thick golden froth. Serve hot.
              </li>
            </ol>
          </AccordionItem>

          {/* Panel 2: Ingredients & Shelf Life */}
          <AccordionItem
            id="shelf-life"
            title="Ingredients, Freshness & Shelf Life"
            icon={<Info className="w-5 h-5" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-bold text-brand-charcoal mb-1">Blend Specifics</h3>
                <p>Contains pure roasted coffee beans ground to precision, mixed with premium chicory roots according to packaging ratios ({product.ingredients}). 100% natural with no artificial flavors or preservatives.</p>
              </div>
              <div>
                <h3 className="font-bold text-brand-charcoal mb-1">Storage & Freshness</h3>
                <p>Transfer to an airtight canister immediately after opening to retain aroma. Keep stored in a cool, dry place away from direct sunlight. Shelf life is 6 months from the date of packing.</p>
              </div>
            </div>
          </AccordionItem>

          {/* Panel 3: Customer Support Contact Box */}
          <AccordionItem
            id="customer-support"
            title="Customer Support & Manufacturer Details"
            icon={<ShieldCheck className="w-5 h-5" />}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-black text-brand-charcoal uppercase tracking-wider text-[10px] mb-2 text-[#F5B800]">
                    Manufacturer Information
                  </h3>
                  <div className="space-y-1.5 text-xs text-brand-charcoal/85 font-semibold">
                    <span className="block"><strong>Brand Legal Name:</strong> SWATI GRUH UDHYOG</span>
                    <span className="block"><strong>Verified Address:</strong> A-2, 503 Yagnapurush Residency, Kalali, India - 390012</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-black text-brand-charcoal uppercase tracking-wider text-[10px] mb-2 text-[#F5B800]">
                    Customer Helpdesk
                  </h3>
                  <div className="space-y-1.5 text-xs text-brand-charcoal/85 font-semibold">
                    <span className="block font-semibold">
                      <strong>Mobile / WhatsApp:</strong>{" "}
                      <a href="https://wa.me/918360322894" target="_blank" rel="noopener noreferrer" className="hover:text-[#F5B800] underline">+91 83603 22894</a>
                      {" / "}
                      <a href="https://wa.me/918734082232" target="_blank" rel="noopener noreferrer" className="hover:text-[#F5B800] underline">+91 87340 82232</a>
                    </span>
                    <span className="block"><strong>Email:</strong> <a href="mailto:costrabyswatigruhudhyog@gmail.com" className="text-gray-900 underline hover:text-[#F5B800]">costrabyswatigruhudhyog@gmail.com</a></span>
                    <span className="block"><strong>Instagram:</strong> <a href="https://www.instagram.com/costra_23?igsh=MWdmMTJxamlva29wcQ==" target="_blank" rel="noopener noreferrer" className="text-gray-900 underline hover:text-[#F5B800]">@costra_23</a></span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2.5 pt-3.5 border-t border-gray-200 mt-2">
                <div className="bg-[#185A9D] text-white px-2 py-1 rounded text-[8px] font-black uppercase tracking-wider leading-none select-none">
                  fssai
                </div>
                <span className="text-[11px] font-bold text-gray-700">
                  Registered Central License Number: <strong className="font-mono text-gray-900">20726032000830</strong>
                </span>
              </div>
            </div>
          </AccordionItem>

        </div>

      </div>
    </div>
  );
}
