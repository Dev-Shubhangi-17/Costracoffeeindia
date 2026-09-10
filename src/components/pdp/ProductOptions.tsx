"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Check, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { mockProducts } from "@/data/mockProducts";

interface ProductOptionsProps {
  productId?: string;
}

const grindTypes = [
  "Traditional Filter Powder",
  "Whole Beans",
  "Fine Espresso Grind",
];

export default function ProductOptions({ productId }: ProductOptionsProps) {
  const product = mockProducts.find((p) => p.id === productId) || mockProducts[0];
  
  // Dynamic weight options based on base net weight
  const weightOptions = React.useMemo(() => {
    const baseMrp = product.mrp;
    if (product.netWeight.toUpperCase() === "1KG") {
      return [
        { label: "250g", price: Math.round(baseMrp * 0.3) },
        { label: "500g", price: Math.round(baseMrp * 0.55) },
        { label: "1kg", price: baseMrp },
        { label: "2kg", price: Math.round(baseMrp * 1.8) },
      ];
    } else {
      return [
        { label: "50g", price: baseMrp },
        { label: "250g", price: Math.round(baseMrp * 3.8) },
        { label: "500g", price: Math.round(baseMrp * 7.2) },
        { label: "1kg", price: Math.round(baseMrp * 13.5) },
      ];
    }
  }, [product]);

  const [selectedWeight, setSelectedWeight] = useState(product.netWeight);
  const [selectedGrind, setSelectedGrind] = useState("Traditional Filter Powder");
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Sync weight selector on dynamic routing parameter changes
  React.useEffect(() => {
    setSelectedWeight(product.netWeight);
  }, [product]);
  
  const addItem = useCartStore((state) => state.addItem);

  const activeOption = React.useMemo(() => {
    return weightOptions.find((opt) => opt.label.toLowerCase() === selectedWeight.toLowerCase()) || weightOptions[0];
  }, [weightOptions, selectedWeight]);

  const price = activeOption.price;
  const totalPrice = price * quantity;

  const handleIncrement = () => {
    setQuantity((prev) => Math.min(prev + 1, 10));
  };

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  const handleAddToCart = () => {
    setIsAdded(true);
    addItem({
      productId: product.id,
      name: product.name,
      weight: activeOption.label,
      grind: selectedGrind,
      price: price,
      image: product.image,
    }, quantity);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Dynamic pricing display */}
      <div className="pb-4 border-b border-brand-neutral flex items-baseline justify-between">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-brand-charcoal/40 uppercase block">
            Current Price
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-brand-charcoal">
              ₹{totalPrice}
            </span>
            {quantity > 1 && (
              <span className="text-xs text-brand-charcoal/40 font-semibold">
                (₹{price} x {quantity})
              </span>
            )}
          </div>
        </div>
        <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-md border border-green-100">
          In Stock
        </span>
      </div>

      {/* FSSAI Verified Pill */}
      <div className="flex items-center space-x-2 bg-green-50 border border-green-100 rounded-xl p-2.5 select-none">
        <div className="bg-[#185A9D] text-white px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider leading-none">
          fssai
        </div>
        <span className="text-[10px] font-extrabold text-green-700">
          Reg. No. 20726032000830 | 100% Quality Assured
        </span>
      </div>

      {/* Net Weight Selector */}
      <div className="space-y-3">
        <label className="text-[10px] font-bold tracking-widest text-brand-charcoal/50 uppercase block">
          Select Net Weight
        </label>
        <div className="grid grid-cols-4 gap-2.5">
          {weightOptions.map((opt) => {
            const isSelected = activeOption.label === opt.label;
            return (
              <button
                key={opt.label}
                id={`pdp-weight-${opt.label.toLowerCase()}`}
                type="button"
                onClick={() => setSelectedWeight(opt.label)}
                className={`py-3 px-2 rounded-xl text-center text-xs font-bold border transition-all duration-200 cursor-pointer select-none ${
                  isSelected
                    ? "bg-brand-charcoal border-brand-charcoal text-brand-yellow shadow-md"
                    : "bg-brand-white border-brand-coffee/15 text-brand-charcoal/70 hover:border-brand-yellow/50 hover:bg-brand-neutral"
                }`}
              >
                <div>{opt.label}</div>
                <div className={`text-[9px] font-semibold mt-0.5 ${isSelected ? "text-brand-yellow/80" : "text-brand-charcoal/40"}`}>
                  ₹{opt.price}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grind Type Selector */}
      <div className="space-y-3">
        <label className="text-[10px] font-bold tracking-widest text-brand-charcoal/50 uppercase block">
          Select Grind Type
        </label>
        <div className="flex flex-col space-y-2">
          {grindTypes.map((grind) => {
            const isSelected = selectedGrind === grind;
            return (
              <button
                key={grind}
                id={`pdp-grind-${grind.toLowerCase().replace(/\s+/g, "-")}`}
                type="button"
                onClick={() => setSelectedGrind(grind)}
                className={`w-full text-left py-3 px-4 rounded-xl text-xs font-bold border transition-all duration-200 flex items-center justify-between cursor-pointer select-none ${
                  isSelected
                    ? "bg-brand-white border-brand-yellow text-brand-charcoal shadow-sm ring-1 ring-brand-yellow"
                    : "bg-brand-white border-brand-coffee/15 text-brand-charcoal/70 hover:border-brand-yellow/50"
                }`}
              >
                <span>{grind}</span>
                <span className={`w-3 h-3 rounded-full border flex items-center justify-center ${
                  isSelected ? "border-brand-yellow bg-brand-yellow" : "border-brand-coffee/30"
                }`}>
                  {isSelected && <span className="w-1 h-1 rounded-full bg-brand-charcoal" />}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pack Quantity Selector & Add to Cart */}
      <div className="flex items-center space-x-4 pt-4 border-t border-brand-neutral">
        
        {/* Quantity Counter */}
        <div className="flex items-center border border-brand-coffee/20 rounded-xl bg-brand-neutral p-1.5 shrink-0">
          <button
            id="pdp-qty-decrement"
            onClick={handleDecrement}
            className="p-1 text-brand-charcoal/60 hover:text-brand-charcoal rounded-lg hover:bg-brand-white/80 transition-all cursor-pointer"
            aria-label="Decrease Quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          
          <span className="w-10 text-center text-sm font-extrabold text-brand-charcoal">
            {quantity}
          </span>

          <button
            id="pdp-qty-increment"
            onClick={handleIncrement}
            className="p-1 text-brand-charcoal/60 hover:text-brand-charcoal rounded-lg hover:bg-brand-white/80 transition-all cursor-pointer"
            aria-label="Increase Quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Add to Bag Button */}
        <motion.button
          id="pdp-add-to-cart-btn"
          onClick={handleAddToCart}
          className={`flex-grow py-3.5 rounded-xl flex items-center justify-center space-x-2 font-bold text-xs tracking-wider uppercase transition-all duration-300 cursor-pointer ${
            isAdded
              ? "bg-green-600 text-white shadow-lg shadow-green-600/10"
              : "bg-brand-yellow hover:bg-brand-gold text-brand-charcoal shadow-lg shadow-brand-yellow/15 hover:shadow-brand-yellow/25"
          }`}
          whileTap={{ scale: 0.98 }}
        >
          <AnimatePresence mode="wait">
            {isAdded ? (
              <motion.div
                key="checked"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center space-x-1.5"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Added to Bag!</span>
              </motion.div>
            ) : (
              <motion.div
                key="shopbag"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center space-x-1.5"
              >
                <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                <span>Add to Bag • ₹{totalPrice}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

      </div>

      {/* WhatsApp Conversion Panel */}
      <div className="pt-1.5">
        <a
          id="pdp-whatsapp-checkout-btn"
          href={`https://wa.me/918734082232?text=${encodeURIComponent(
            `Hello COSTRA! I would like to order:\n- Product: ${product.name}\n- Weight: ${selectedWeight}\n- Grind: ${selectedGrind}\n- Quantity: ${quantity}\n- Total Price: ₹${totalPrice}\n\nPlease confirm my order. Thank you!`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs tracking-wider uppercase rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-green-500/10 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.019-5.116-2.876-6.974A9.774 9.774 0 0 0 12.008 1.84c-5.439 0-9.863 4.421-9.867 9.867-.001 1.735.469 3.43 1.36 4.938l-.983 3.595 3.699-.97c1.517.828 3.195 1.264 4.84 1.264zm5.727-11.758c-.235-.526-.483-.537-.706-.546-.184-.007-.394-.007-.604-.007-.21 0-.552.079-.841.394-.29.316-1.104 1.078-1.104 2.629 0 1.551 1.13 3.05 1.288 3.261.158.21 2.221 3.391 5.38 4.757.753.325 1.341.52 1.801.666.757.24 1.446.206 1.99.125.607-.09 1.847-.756 2.109-1.485.263-.729.263-1.353.184-1.485-.079-.131-.29-.21-.604-.368-.315-.158-1.847-.912-2.136-1.018-.29-.105-.5-.158-.707.158-.207.316-.802 1.018-.983 1.229-.181.21-.362.237-.677.079-.315-.158-1.332-.491-2.536-1.566-.937-.836-1.57-1.868-1.753-2.184-.183-.316-.02-.487.138-.644.142-.142.315-.368.473-.552.158-.184.21-.316.315-.526.105-.21.053-.395-.026-.552-.079-.158-.707-1.702-.973-2.299z"/>
          </svg>
          <span>Order via WhatsApp</span>
        </a>
      </div>

    </div>
  );
}
