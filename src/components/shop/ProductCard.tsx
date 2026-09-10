"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Check, ShoppingBag } from "lucide-react";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/useCartStore";
import { trackAddToCart } from "@/lib/analytics";

interface ProductCardProps {
  product: Product;
}

const grinds = ["Filter Powder", "Whole Bean", "Fine Grind"];

export default function ProductCard({ product }: ProductCardProps) {
  const [selectedGrind, setSelectedGrind] = useState("Filter Powder");
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const toggleCart = useCartStore((state) => state.toggleCart);

  const handleAddToCart = () => {
    setIsAdded(true);
    addItem({
      productId: product.id,
      name: product.name,
      weight: product.netWeight,
      grind: selectedGrind,
      price: product.mrp,
      image: product.image,
    });
    trackAddToCart(product, 1);
    toggleCart(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  // Calculate discount percentage
  const discountPercent = product.originalMrp
    ? Math.round(((product.originalMrp - product.mrp) / product.originalMrp) * 100)
    : 0;

  return (
    <div 
      className="group relative bg-brand-white border border-[#E5E7EB] rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden"
      id={`product-card-${product.id}`}
    >
      {/* Top Yellow Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#F5B800]" />

      {/* Product Custom Type Badge */}
      {product.badge && (
        <div className="absolute top-4 left-3.5 z-20">
          <span className="bg-[#1A1A1A] text-[#F5B800] text-[8px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full shadow-md">
            {product.badge}
          </span>
        </div>
      )}

      {/* Discount Badge */}
      {discountPercent > 0 && (
        <div className="absolute top-4 right-3.5 z-20">
          <span className="bg-[#F5B800] text-black text-[9px] font-black px-2.5 py-1 rounded-md shadow-md uppercase tracking-wider">
            {discountPercent}% OFF
          </span>
        </div>
      )}

      {/* Product Image Container (Hover Zoom) */}
      <div className="p-4 bg-[#F9F9FB] border-b border-[#E5E7EB] flex items-center justify-center overflow-hidden h-52 select-none">
        <div className="relative w-full h-full flex items-center justify-center">
          <motion.img
            src={product.image}
            alt={`${product.name} - COSTRA Coffee Blend (${product.netWeight})`}
            width={300}
            height={300}
            loading="lazy"
            whileHover={{ scale: 1.05, y: -4 }}
            className="h-full object-contain drop-shadow-md transition-transform duration-300"
          />
        </div>
      </div>

      {/* Product Information Body */}
      <div className="p-5 flex flex-col flex-grow space-y-4">
        
        <div className="space-y-1.5 flex-grow">
          {/* Muted category label in small caps */}
          <span className="text-[8px] font-black tracking-widest text-[#1A1A1A]/40 uppercase block">
            {product.category}
          </span>

          {/* Product Title */}
          <h3 className="text-sm sm:text-base font-extrabold text-brand-charcoal leading-snug line-clamp-2 hover:text-[#F5B800] transition-colors">
            <Link href={`/product/${product.id}`} id={`product-link-${product.id}`}>
              {product.name}
            </Link>
          </h3>

          {/* Rating */}
          <div className="flex items-center space-x-1.5 pt-0.5">
            <div className="flex items-center text-[#F5B800]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating)
                      ? "fill-[#F5B800] text-[#F5B800]"
                      : "text-brand-neutral fill-[#E5E7EB]"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-black text-brand-charcoal">
              {product.rating}
            </span>
            <span className="text-[11px] text-brand-charcoal/40 font-bold">
              ({product.reviewsCount} Reviews)
            </span>
          </div>

          {/* Ingredients list */}
          <p className="text-[11px] font-semibold text-brand-charcoal/50 leading-relaxed pt-1 line-clamp-2">
            {product.ingredients}
          </p>
        </div>

        {/* Grind Selector Options */}
        <div className="space-y-1.5">
          <label className="text-[9px] font-black tracking-widest text-[#1A1A1A]/40 uppercase block">
            Select Grind Preference
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {grinds.map((grind) => {
              const isSelected = selectedGrind === grind;
              return (
                <button
                  key={grind}
                  id={`grind-selector-${product.id}-${grind.toLowerCase().replace(/\s+/g, "-")}`}
                  type="button"
                  onClick={() => setSelectedGrind(grind)}
                  className={`text-[9px] font-bold py-2 px-1 rounded-md text-center border transition-all duration-200 select-none cursor-pointer ${
                    isSelected
                      ? "bg-[#1A1A1A] border-[#1A1A1A] text-[#F5B800]"
                      : "bg-[#F9F9FB] border-[#E5E7EB] text-brand-charcoal/70 hover:bg-[#F9F9FB]/90 hover:text-brand-charcoal"
                  }`}
                >
                  {grind}
                </button>
              );
            })}
          </div>
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between gap-4">
          
          {/* Price & original strike-through MRP */}
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-[#1A1A1A]/40 uppercase leading-none">Price</span>
            <div className="flex items-baseline space-x-1.5 mt-1 leading-none">
              <span className="text-base font-black text-brand-charcoal">₹{product.mrp}</span>
              {product.originalMrp && (
                <span className="text-xs text-brand-charcoal/40 line-through">₹{product.originalMrp}</span>
              )}
              <span className="text-[9px] text-[#1A1A1A]/40 font-bold uppercase">/ {product.netWeight}</span>
            </div>
          </div>

          {/* Action Triggers */}
          <div className="flex items-center space-x-3">
            {/* Order on WhatsApp */}
            <a
              id={`btn-whatsapp-buy-${product.id}`}
              href={`https://wa.me/918734082232?text=${encodeURIComponent(
                `Hello COSTRA! I would like to order: ${product.name} (${product.netWeight}) for ₹${product.mrp}/-. Please confirm.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-black text-brand-charcoal hover:text-[#F5B800] transition-colors flex items-center space-x-1"
            >
              <svg className="w-3.5 h-3.5 fill-current text-[#25D366]" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.019-5.116-2.876-6.974A9.774 9.774 0 0 0 12.008 1.84c-5.439 0-9.863 4.421-9.867 9.867-.001 1.735.469 3.43 1.36 4.938l-.983 3.595 3.699-.97c1.517.828 3.195 1.264 4.84 1.264zm5.727-11.758c-.235-.526-.483-.537-.706-.546-.184-.007-.394-.007-.604-.007-.21 0-.552.079-.841.394-.29.316-1.104 1.078-1.104 2.629 0 1.551 1.13 3.05 1.288 3.261.158.21 2.221 3.391 5.38 4.757.753.325 1.341.52 1.801.666.757.24 1.446.206 1.99.125.607-.09 1.847-.756 2.109-1.485.263-.729.263-1.353.184-1.485-.079-.131-.29-.21-.604-.368-.315-.158-1.847-.912-2.136-1.018-.29-.105-.5-.158-.707.158-.207.316-.802 1.018-.983 1.229-.181.21-.362.237-.677.079-.315-.158-1.332-.491-2.536-1.566-.937-.836-1.57-1.868-1.753-2.184-.183-.316-.02-.487.138-.644.142-.142.315-.368.473-.552.158-.184.21-.316.315-.526.105-.21.053-.395-.026-.552-.079-.158-.707-1.702-.973-2.299z"/>
              </svg>
              <span>Order</span>
            </a>

            {/* Add to Bag round floating button */}
            <motion.button
              id={`btn-add-to-cart-${product.id}`}
              onClick={handleAddToCart}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer shadow-md ${
                isAdded
                  ? "bg-green-600 text-white shadow-green-600/10"
                  : "bg-[#F5B800] hover:bg-[#EAA000] text-black shadow-brand-yellow/10 hover:shadow-brand-yellow/20"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isAdded ? (
                  <motion.div
                    key="check"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                  >
                    <Check className="w-4.5 h-4.5 stroke-[3]" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="cart"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                  >
                    <ShoppingBag className="w-4.5 h-4.5 stroke-[2.5]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

        </div>

      </div>
    </div>
  );
}
