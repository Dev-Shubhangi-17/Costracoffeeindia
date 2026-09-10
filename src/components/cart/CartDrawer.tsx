"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, ShoppingBag, Tag, Sparkles } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { trackInitiateCheckout, trackAddToCart } from "@/lib/analytics";

export default function CartDrawer() {
  const {
    cart,
    isOpen,
    toggleCart,
    removeItem,
    updateQuantity,
    getSubtotal,
    getRemainingForFreeShipping,
  } = useCartStore();

  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState("");

  const subtotal = getSubtotal();
  const remainingForFreeShipping = getRemainingForFreeShipping();
  const freeShippingThreshold = 499;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 50;
  const grandTotal = subtotal - discountAmount + shippingFee;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === "COSTRA10") {
      setDiscountPercent(10);
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code. Try COSTRA10!");
      setDiscountPercent(0);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => toggleCart(false)}
            className="fixed inset-0 z-50 bg-[#1A1A1A]/60 backdrop-blur-sm"
          />

          {/* Drawer Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col justify-between"
            id="shopping-cart-drawer"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-5 h-5 text-[#F5B800]" />
                <span className="text-base font-extrabold tracking-wide text-brand-charcoal font-heading">
                  Your Coffee Bag
                </span>
                {cart.length > 0 && (
                  <span className="bg-[#F9F9FB] text-brand-charcoal text-xs font-bold px-2 py-0.5 rounded-full border border-[#E5E7EB]">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </div>
              <button
                id="cart-drawer-close"
                onClick={() => toggleCart(false)}
                className="p-1.5 text-brand-charcoal/50 hover:text-brand-charcoal hover:bg-[#F9F9FB] rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            {cart.length > 0 && (
              <div className="px-6 py-4 bg-[#F9F9FB] border-b border-[#E5E7EB] space-y-2">
                <div className="text-[11px] font-black tracking-wider uppercase text-brand-charcoal/70 flex items-center justify-between">
                  {remainingForFreeShipping > 0 ? (
                    <span>
                      Add <strong className="text-[#F5B800]">₹{remainingForFreeShipping}</strong> more for <strong>FREE Express Shipping!</strong>
                    </span>
                  ) : (
                    <span className="text-green-700 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#F5B800] animate-pulse" />
                      <span>Unlocked Free Shipping 🎉</span>
                    </span>
                  )}
                </div>
                <div className="w-full h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#F5B800]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}

            {/* Cart Items List */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4 scrollbar-thin">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center space-y-4 py-20 text-center">
                  <div className="p-4 bg-[#F9F9FB] rounded-full text-brand-charcoal/30">
                    <ShoppingBag className="w-12 h-12" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-brand-charcoal">Your bag is empty</h4>
                    <p className="text-xs text-brand-charcoal/50 leading-relaxed mt-1 font-semibold">
                      Looks like you haven&apos;t added any coffee blends yet!
                    </p>
                  </div>
                  <button
                    id="cart-drawer-continue-shopping"
                    onClick={() => toggleCart(false)}
                    className="bg-[#F5B800] hover:bg-[#EAA000] text-black font-extrabold text-xs tracking-wider uppercase px-6 py-2.5 rounded-xl shadow-sm transition-all duration-200 cursor-pointer"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 p-3 bg-[#F9F9FB] border border-[#E5E7EB] rounded-2xl"
                  >
                    {/* Item Thumbnail packaging image */}
                    <div className="shrink-0">
                      <div className="w-16 h-20 bg-[#F9F9FB] border border-[#E5E7EB] rounded-xl flex items-center justify-center p-1.5 shadow-inner select-none">
                        <img
                          src={item.image}
                          alt={item.name}
                          width={64}
                          height={80}
                          loading="lazy"
                          className="h-full object-contain drop-shadow"
                        />
                      </div>
                    </div>

                    {/* Item Details */}
                    <div className="flex-grow min-w-0 space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-bold text-brand-charcoal truncate">
                            {item.name}
                          </h4>
                          <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                            <span className="text-[8px] font-black bg-[#1A1A1A] text-[#F5B800] px-1.5 py-0.25 rounded uppercase">
                              {item.weight}
                            </span>
                            <span className="text-[9px] font-semibold text-brand-charcoal/50">
                              {item.grind}
                            </span>
                          </div>
                        </div>
                        <button
                          id={`cart-remove-${item.id}`}
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-brand-charcoal/40 hover:text-red-600 rounded hover:bg-red-50 transition-colors shrink-0 cursor-pointer"
                          aria-label="Remove Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Quantity & Price adjusters */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center border border-[#E5E7EB] rounded-lg bg-[#F9F9FB] p-1 shrink-0">
                          <button
                            id={`cart-qty-decrement-${item.id}`}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-0.5 text-brand-charcoal/60 hover:text-brand-charcoal rounded hover:bg-white transition-all cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-7 text-center text-xs font-extrabold text-brand-charcoal">
                            {item.quantity}
                          </span>
                          <button
                            id={`cart-qty-increment-${item.id}`}
                            onClick={() => {
                              updateQuantity(item.id, item.quantity + 1);
                              trackAddToCart(
                                {
                                  id: item.productId,
                                  name: item.name,
                                  mrp: item.price,
                                },
                                1
                              );
                            }}
                            className="p-0.5 text-brand-charcoal/60 hover:text-brand-charcoal rounded hover:bg-white transition-all cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-xs font-extrabold text-brand-charcoal shrink-0 font-mono">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer summary panels */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-[#E5E7EB] bg-[#F9F9FB] space-y-4">
                
                {/* Coupon Discount Panel */}
                <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                  <label htmlFor="coupon-input" className="text-[9px] font-black text-brand-charcoal/50 uppercase tracking-widest block">
                    Have a coupon code?
                  </label>
                  <div className="flex space-x-2">
                    <div className="relative flex-grow">
                      <Tag className="w-4 h-4 text-brand-coffee/40 absolute left-3.5 inset-y-0 my-auto" />
                      <input
                        id="coupon-input"
                        type="text"
                        placeholder="E.g. COSTRA10"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-full bg-white border border-[#E5E7EB] focus:border-[#F5B800] px-4 py-2 pl-9 rounded-xl text-xs focus:outline-none placeholder:text-brand-charcoal/30 font-semibold"
                      />
                    </div>
                    <button
                      id="coupon-apply-btn"
                      type="submit"
                      className="bg-brand-charcoal text-[#F5B800] font-bold text-xs tracking-wider uppercase px-4 py-2 rounded-xl border border-brand-charcoal hover:bg-brand-charcoal/90 transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {discountPercent > 0 && (
                    <span className="text-[10px] text-green-700 font-bold block">
                      ✓ Coupon COSTRA10 applied! 10% Discount saved.
                    </span>
                  )}
                  {couponError && (
                    <span className="text-[10px] text-red-600 font-semibold block">
                      {couponError}
                    </span>
                  )}
                </form>

                {/* Subtotal table matrix */}
                <div className="space-y-2 text-xs font-bold text-brand-charcoal/70 border-t border-[#E5E7EB] pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-700">
                      <span>Discount (10%)</span>
                      <span>- ₹{discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>{shippingFee === 0 ? <strong className="text-green-700">FREE</strong> : `₹${shippingFee}`}</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-brand-charcoal pt-2 border-t border-[#E5E7EB] mt-2">
                    <span>Total Amount</span>
                    <span className="font-mono">₹{grandTotal}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <Link
                  id="cart-checkout-btn"
                  href="/checkout"
                  onClick={() => {
                    trackInitiateCheckout(cart, grandTotal);
                    toggleCart(false);
                  }}
                  className="w-full bg-[#F5B800] hover:bg-[#EAA000] text-black font-black text-xs tracking-widest uppercase py-4 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-brand-yellow/15 hover:shadow-brand-yellow/25 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer text-center"
                >
                  <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                  <span>Proceed to Checkout</span>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
