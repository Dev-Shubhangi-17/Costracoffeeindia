"use client";

import React, { useState } from "react";
import { ShoppingBag, Tag, Sparkles, MessageSquare, Mail } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export default function OrderSummary() {
  const { cart } = useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState("");

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = Math.round(subtotal * (discountPercent / 100));

  const freeShippingThreshold = 499;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 49;

  // 5% GST calculated on discounted price
  const gstTax = Math.round((subtotal - discountAmount) * 0.05);
  const grandTotal = subtotal - discountAmount + shippingFee + gstTax;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === "COSTRA10") {
      setDiscountPercent(10);
      setCouponError("");
    } else {
      setCouponError("Invalid coupon. Try COSTRA10!");
      setDiscountPercent(0);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Yellow Summary Box */}
      <div className="bg-brand-yellow rounded-3xl text-brand-charcoal p-6 shadow-md border border-brand-yellow/30 space-y-4">
        <div className="flex items-center space-x-2 border-b border-brand-charcoal/10 pb-3">
          <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
          <h3 className="text-base font-extrabold tracking-wide font-heading">
            Order Summary
          </h3>
        </div>

        {/* Items List inside summary */}
        <div className="max-h-48 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center text-xs">
              <div className="space-y-0.5">
                <span className="font-extrabold block truncate max-w-[180px]">
                  {item.name}
                </span>
                <span className="text-[10px] text-brand-charcoal/60 font-semibold uppercase tracking-wider block">
                  {item.weight} • {item.grind}
                </span>
              </div>
              <div className="text-right font-extrabold font-mono shrink-0 ml-4">
                ₹{item.price * item.quantity}
                <span className="text-[9px] text-brand-charcoal/60 block font-sans">
                  Qty: {item.quantity}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Coupon Form */}
        <form onSubmit={handleApplyCoupon} className="pt-3 border-t border-brand-charcoal/10 space-y-2">
          <label htmlFor="summary-coupon-input" className="text-[9px] font-bold text-brand-charcoal/60 uppercase tracking-widest block leading-none">
            Promo Code
          </label>
          <div className="flex space-x-2">
            <div className="relative flex-grow">
              <Tag className="w-4 h-4 text-brand-charcoal/40 absolute left-3 inset-y-0 my-auto" />
              <input
                id="summary-coupon-input"
                type="text"
                placeholder="E.g. COSTRA10"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="w-full bg-brand-white border border-brand-charcoal/15 focus:border-brand-charcoal px-3 py-2 pl-8 rounded-xl text-xs focus:outline-none placeholder:text-brand-charcoal/30 font-semibold"
              />
            </div>
            <button
              id="summary-coupon-btn"
              type="submit"
              className="bg-brand-charcoal hover:bg-brand-coffee text-brand-yellow font-bold text-xs tracking-wider uppercase px-4 py-2 rounded-xl transition-colors cursor-pointer"
            >
              Apply
            </button>
          </div>
          {discountPercent > 0 && (
            <span className="text-[10px] text-green-800 font-extrabold block">
              ✓ Coupon COSTRA10 applied! 10% Discount saved.
            </span>
          )}
          {couponError && (
            <span className="text-[10px] text-red-700 font-bold block">
              {couponError}
            </span>
          )}
        </form>

        {/* Calculations breakdown list */}
        <div className="space-y-2 text-xs font-bold border-t border-brand-charcoal/10 pt-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-green-800 font-extrabold">
              <span>Discount</span>
              <span>- ₹{discountAmount}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span>{shippingFee === 0 ? <strong className="text-green-800">FREE</strong> : `₹${shippingFee}`}</span>
          </div>
          <div className="flex justify-between">
            <span>GST (5%)</span>
            <span>₹{gstTax}</span>
          </div>
          <div className="flex justify-between text-base font-black pt-2.5 border-t border-brand-charcoal/10 mt-2">
            <span>Grand Total</span>
            <span>₹{grandTotal}</span>
          </div>
        </div>

      </div>

      {/* Help / Assistance Footer Badge Card */}
      <div className="bg-brand-neutral border border-brand-coffee/10 rounded-2xl p-5 space-y-3.5 shadow-sm text-xs text-brand-charcoal/80 leading-relaxed font-semibold">
        <div className="flex items-center space-x-2 text-brand-yellow font-bold uppercase tracking-wider text-[10px]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Need Help With Your Order?</span>
        </div>
        
        <div className="space-y-2 font-medium">
          <div className="flex items-start space-x-2">
            <MessageSquare className="w-4 h-4 text-brand-yellow shrink-0 mt-0.5" />
            <span>
              WhatsApp us at <a href="https://wa.me/918360322894" target="_blank" rel="noopener noreferrer" className="text-brand-charcoal font-bold hover:underline">+91 83603 22894</a> / <a href="https://wa.me/918734082232" target="_blank" rel="noopener noreferrer" className="text-brand-charcoal font-bold hover:underline">+91 87340 82232</a>
            </span>
          </div>
          
          <div className="flex items-start space-x-2">
            <Mail className="w-4 h-4 text-brand-yellow shrink-0 mt-0.5" />
            <span>
              Email: <a href="mailto:costrabyswatigruhudhyog@gmail.com" className="text-brand-charcoal font-bold hover:underline">costrabyswatigruhudhyog@gmail.com</a>
            </span>
          </div>

          <div className="flex items-start space-x-2">
            <svg className="w-4 h-4 text-brand-yellow shrink-0 mt-0.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
            </svg>
            <span>
              Follow us: <a href="https://www.instagram.com/costra_23?igsh=MWdmMTJxamlva29wcQ==" target="_blank" rel="noopener noreferrer" className="text-brand-charcoal font-bold hover:underline">@costra_23</a>
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
