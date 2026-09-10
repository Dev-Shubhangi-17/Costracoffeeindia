"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Mail, Phone, MapPin, CreditCard, ChevronRight, ChevronLeft, Sparkles, PhoneCall } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

const steps = [
  { id: "contact", label: "Contact Info" },
  { id: "shipping", label: "Shipping Address" },
  { id: "payment", label: "Payment Selection" },
];

export default function CheckoutForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const clearCart = useCartStore((state) => state.clearCart);

  // Form values
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    whatsappUpdates: true,
    fullName: "",
    address: "",
    city: "India",
    state: "Gujarat",
    pincode: "",
    paymentMethod: "upi",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [isPlacing, setIsPlacing] = useState(false);

  const validateStep = (stepIdx: number) => {
    const errors: Record<string, string> = {};
    if (stepIdx === 0) {
      if (!formData.email) {
        errors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = "Please enter a valid email address";
      }
      if (!formData.phone) {
        errors.phone = "Mobile number is required";
      } else if (!/^\d{10}$/.test(formData.phone)) {
        errors.phone = "Please enter a valid 10-digit mobile number";
      }
    } else if (stepIdx === 1) {
      if (!formData.fullName) errors.fullName = "Full name is required";
      if (!formData.address) errors.address = "Address is required";
      if (!formData.city) errors.city = "City is required";
      if (!formData.state) errors.state = "State is required";
      if (!formData.pincode) {
        errors.pincode = "Pincode is required";
      } else if (!/^\d{6}$/.test(formData.pincode)) {
        errors.pincode = "Pincode must be exactly 6 digits";
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      setIsPlacing(true);
      setTimeout(() => {
        setIsPlacing(false);
        setIsOrderPlaced(true);
        clearCart();
      }, 2500);
    }
  };

  const handleFieldChange = (key: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (formErrors[key]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  if (isOrderPlaced) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-brand-white border border-brand-neutral/80 rounded-3xl p-8 text-center space-y-6 shadow-xl max-w-lg mx-auto"
      >
        <div className="w-16 h-16 bg-green-50 border border-green-200 rounded-full flex items-center justify-center text-green-600 mx-auto">
          <Check className="w-8 h-8 stroke-[3]" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-brand-charcoal font-heading">
            Order Placed Successfully!
          </h3>
          <p className="text-sm text-brand-charcoal/60 leading-relaxed">
            Thank you for ordering with COSTRA. We have sent confirmation details to your email <strong>{formData.email}</strong>.
          </p>
          {formData.whatsappUpdates && (
            <p className="text-xs text-brand-charcoal/50 bg-green-50 px-3 py-1.5 rounded-lg inline-block border border-green-100">
              💬 Order status updates will be sent to <strong>+91 {formData.phone}</strong> on WhatsApp.
            </p>
          )}
        </div>
        <div className="pt-4 border-t border-brand-neutral">
          <a
            href="/"
            className="inline-flex items-center justify-center bg-brand-yellow hover:bg-brand-gold text-brand-charcoal font-bold text-xs tracking-wider uppercase px-8 py-3.5 rounded-xl shadow transition-all duration-200 cursor-pointer"
          >
            Continue Shopping
          </a>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-brand-white border border-brand-neutral/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
      
      {/* Step Indicators */}
      <div className="flex items-center justify-between pb-6 border-b border-brand-neutral">
        {steps.map((step, idx) => {
          const isActive = currentStep === idx;
          const isCompleted = currentStep > idx;
          return (
            <div key={step.id} className="flex items-center flex-grow last:flex-grow-0">
              <div className="flex items-center space-x-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all duration-200 ${
                  isActive 
                    ? "bg-brand-yellow border-brand-yellow text-brand-charcoal shadow-sm"
                    : isCompleted
                      ? "bg-brand-charcoal border-brand-charcoal text-brand-yellow"
                      : "bg-brand-white border-brand-coffee/15 text-brand-charcoal/45"
                }`}>
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                </div>
                <span className={`text-xs font-bold hidden sm:block ${isActive ? "text-brand-charcoal" : "text-brand-charcoal/40"}`}>
                  {step.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`h-0.5 mx-4 flex-grow rounded transition-colors duration-300 ${
                  currentStep > idx ? "bg-brand-charcoal" : "bg-brand-neutral"
                }`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Panels Container */}
      <div className="min-h-[220px]">
        <AnimatePresence mode="wait">
          
          {/* Step 1: Contact Information */}
          {currentStep === 0 && (
            <motion.div
              key="step-contact"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <h4 className="text-base font-extrabold text-brand-charcoal font-heading">
                  Contact Information
                </h4>
                <p className="text-xs text-brand-charcoal/50">
                  Enter your email and mobile phone number to place your coffee shipment order.
                </p>
              </div>

              <div className="space-y-3">
                {/* Email Field */}
                <div className="space-y-1.5">
                  <label htmlFor="checkout-email" className="text-[10px] font-bold text-brand-charcoal/50 uppercase tracking-widest block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-brand-coffee/40 absolute left-3.5 inset-y-0 my-auto" />
                    <input
                      id="checkout-email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => handleFieldChange("email", e.target.value)}
                      className={`w-full bg-brand-white border px-4 py-3 pl-9 rounded-xl text-xs sm:text-sm focus:outline-none transition-all ${
                        formErrors.email 
                          ? "border-red-500 focus:border-red-500" 
                          : "border-brand-coffee/15 focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow font-semibold"
                      }`}
                    />
                  </div>
                  {formErrors.email && (
                    <span className="text-[10px] text-red-500 font-bold block">{formErrors.email}</span>
                  )}
                </div>

                {/* Phone Field */}
                <div className="space-y-1.5">
                  <label htmlFor="checkout-phone" className="text-[10px] font-bold text-brand-charcoal/50 uppercase tracking-widest block">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-brand-coffee/40 absolute left-3.5 inset-y-0 my-auto" />
                    <input
                      id="checkout-phone"
                      type="tel"
                      placeholder="10-digit number"
                      maxLength={10}
                      value={formData.phone}
                      onChange={(e) => handleFieldChange("phone", e.target.value.replace(/\D/g, ""))}
                      className={`w-full bg-brand-white border px-4 py-3 pl-9 rounded-xl text-xs sm:text-sm focus:outline-none transition-all ${
                        formErrors.phone 
                          ? "border-red-500 focus:border-red-500" 
                          : "border-brand-coffee/15 focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow font-semibold"
                      }`}
                    />
                  </div>
                  {formErrors.phone && (
                    <span className="text-[10px] text-red-500 font-bold block">{formErrors.phone}</span>
                  )}
                </div>

                {/* WhatsApp Updates Checkbox */}
                <label className="flex items-start space-x-2.5 pt-2 select-none cursor-pointer">
                  <input
                    id="checkout-whatsapp-updates"
                    type="checkbox"
                    checked={formData.whatsappUpdates}
                    onChange={(e) => handleFieldChange("whatsappUpdates", e.target.checked)}
                    className="w-4 h-4 mt-0.5 border-brand-coffee/20 rounded focus:ring-brand-yellow accent-brand-yellow"
                  />
                  <span className="text-xs font-semibold text-brand-charcoal/60 leading-relaxed">
                    Yes, send me order updates and delivery details on WhatsApp.
                  </span>
                </label>
              </div>
            </motion.div>
          )}

          {/* Step 2: Shipping Address */}
          {currentStep === 1 && (
            <motion.div
              key="step-shipping"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <h4 className="text-base font-extrabold text-brand-charcoal font-heading">
                  Shipping Details
                </h4>
                <p className="text-xs text-brand-charcoal/50">
                  Enter the delivery address. Local deliveries in India qualify for fast dispatch.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label htmlFor="checkout-fullname" className="text-[10px] font-bold text-brand-charcoal/50 uppercase tracking-widest block">
                    Full Name
                  </label>
                  <input
                    id="checkout-fullname"
                    type="text"
                    placeholder="E.g. Shailesh Patel"
                    value={formData.fullName}
                    onChange={(e) => handleFieldChange("fullName", e.target.value)}
                    className={`w-full bg-brand-white border px-4 py-3 rounded-xl text-xs focus:outline-none transition-all ${
                      formErrors.fullName 
                        ? "border-red-500 focus:border-red-500" 
                        : "border-brand-coffee/15 focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow font-semibold"
                    }`}
                  />
                  {formErrors.fullName && (
                    <span className="text-[10px] text-red-500 font-bold block">{formErrors.fullName}</span>
                  )}
                </div>

                {/* Address Line */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label htmlFor="checkout-address" className="text-[10px] font-bold text-brand-charcoal/50 uppercase tracking-widest block">
                    Complete Address
                  </label>
                  <input
                    id="checkout-address"
                    type="text"
                    placeholder="House/Apartment Number, Street, Area"
                    value={formData.address}
                    onChange={(e) => handleFieldChange("address", e.target.value)}
                    className={`w-full bg-brand-white border px-4 py-3 rounded-xl text-xs focus:outline-none transition-all ${
                      formErrors.address 
                        ? "border-red-500 focus:border-red-500" 
                        : "border-brand-coffee/15 focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow font-semibold"
                    }`}
                  />
                  {formErrors.address && (
                    <span className="text-[10px] text-red-500 font-bold block">{formErrors.address}</span>
                  )}
                </div>

                {/* Pincode */}
                <div className="space-y-1.5">
                  <label htmlFor="checkout-pincode" className="text-[10px] font-bold text-brand-charcoal/50 uppercase tracking-widest block">
                    Pincode
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-brand-coffee/40 absolute left-3.5 inset-y-0 my-auto" />
                    <input
                      id="checkout-pincode"
                      type="text"
                      placeholder="6-digit postal code"
                      maxLength={6}
                      value={formData.pincode}
                      onChange={(e) => handleFieldChange("pincode", e.target.value.replace(/\D/g, ""))}
                      className={`w-full bg-brand-white border px-4 py-3 pl-9 rounded-xl text-xs focus:outline-none transition-all ${
                        formErrors.pincode 
                          ? "border-red-500 focus:border-red-500" 
                          : "border-brand-coffee/15 focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow font-semibold"
                      }`}
                    />
                  </div>
                  {formErrors.pincode && (
                    <span className="text-[10px] text-red-500 font-bold block">{formErrors.pincode}</span>
                  )}
                </div>

                {/* City */}
                <div className="space-y-1.5">
                  <label htmlFor="checkout-city" className="text-[10px] font-bold text-brand-charcoal/50 uppercase tracking-widest block">
                    City
                  </label>
                  <input
                    id="checkout-city"
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleFieldChange("city", e.target.value)}
                    className="w-full bg-brand-neutral border border-brand-coffee/15 px-4 py-3 rounded-xl text-xs font-bold text-brand-charcoal focus:outline-none"
                  />
                </div>

                {/* State */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label htmlFor="checkout-state" className="text-[10px] font-bold text-brand-charcoal/50 uppercase tracking-widest block">
                    State
                  </label>
                  <input
                    id="checkout-state"
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleFieldChange("state", e.target.value)}
                    className="w-full bg-brand-neutral border border-brand-coffee/15 px-4 py-3 rounded-xl text-xs font-bold text-brand-charcoal focus:outline-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Payment Options */}
          {currentStep === 2 && (
            <motion.div
              key="step-payment"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <h4 className="text-base font-extrabold text-brand-charcoal font-heading">
                  Payment Method
                </h4>
                <p className="text-xs text-brand-charcoal/50">
                  Select your preferred secure payment channel. All transactions are SSL encrypted.
                </p>
              </div>

              <div className="flex flex-col space-y-3">
                {/* UPI */}
                <button
                  id="checkout-payment-upi"
                  type="button"
                  onClick={() => handleFieldChange("paymentMethod", "upi")}
                  className={`p-4 rounded-xl border text-left flex items-start space-x-3.5 transition-all duration-200 cursor-pointer ${
                    formData.paymentMethod === "upi"
                      ? "bg-brand-yellow/5 border-brand-yellow ring-1 ring-brand-yellow"
                      : "bg-brand-white border-brand-coffee/15 hover:border-brand-yellow/45"
                  }`}
                >
                  <div className="p-2 bg-brand-neutral rounded-lg text-brand-charcoal shrink-0 mt-0.5">
                    <Sparkles className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-brand-charcoal block">
                      UPI / Instant Google Pay / PhonePe / Paytm
                    </span>
                    <span className="text-[10px] text-brand-charcoal/50 leading-relaxed block mt-0.5">
                      Pay instantly with any UPI app on your mobile phone. Safe, secure, and fee-free.
                    </span>
                  </div>
                </button>

                {/* Credit Card */}
                <button
                  id="checkout-payment-card"
                  type="button"
                  onClick={() => handleFieldChange("paymentMethod", "card")}
                  className={`p-4 rounded-xl border text-left flex items-start space-x-3.5 transition-all duration-200 cursor-pointer ${
                    formData.paymentMethod === "card"
                      ? "bg-brand-yellow/5 border-brand-yellow ring-1 ring-brand-yellow"
                      : "bg-brand-white border-brand-coffee/15 hover:border-brand-yellow/45"
                  }`}
                >
                  <div className="p-2 bg-brand-neutral rounded-lg text-brand-charcoal shrink-0 mt-0.5">
                    <CreditCard className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-brand-charcoal block">
                      Credit / Debit Card
                    </span>
                    <span className="text-[10px] text-brand-charcoal/50 leading-relaxed block mt-0.5">
                      Accepts Visa, Mastercard, RuPay, and American Express. Securely processed via payment gateway.
                    </span>
                  </div>
                </button>

                {/* COD */}
                <button
                  id="checkout-payment-cod"
                  type="button"
                  onClick={() => handleFieldChange("paymentMethod", "cod")}
                  className={`p-4 rounded-xl border text-left flex items-start space-x-3.5 transition-all duration-200 cursor-pointer ${
                    formData.paymentMethod === "cod"
                      ? "bg-brand-yellow/5 border-brand-yellow ring-1 ring-brand-yellow"
                      : "bg-brand-white border-brand-coffee/15 hover:border-brand-yellow/45"
                  }`}
                >
                  <div className="p-2 bg-brand-neutral rounded-lg text-brand-charcoal shrink-0 mt-0.5">
                    <PhoneCall className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-brand-charcoal block">
                      Cash on Delivery (COD)
                    </span>
                    <span className="text-[10px] text-brand-charcoal/50 leading-relaxed block mt-0.5">
                      Pay with cash when the delivery executive hands over the package.
                    </span>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-brand-neutral">
        {currentStep > 0 ? (
          <button
            id="checkout-back-btn"
            type="button"
            onClick={handleBack}
            className="py-3 px-6 rounded-xl flex items-center space-x-1.5 font-bold text-xs tracking-wider uppercase border border-brand-coffee/20 hover:border-brand-yellow hover:bg-brand-neutral transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        ) : (
          <div />
        )}

        {currentStep < steps.length - 1 ? (
          <button
            id="checkout-next-btn"
            type="button"
            onClick={handleNext}
            className="py-3 px-6 rounded-xl flex items-center space-x-1.5 font-bold text-xs tracking-wider uppercase bg-brand-yellow hover:bg-brand-gold text-brand-charcoal shadow transition-all cursor-pointer"
          >
            <span>Next Step</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            id="checkout-submit-btn"
            type="submit"
            disabled={isPlacing}
            className="py-3.5 px-8 rounded-xl flex items-center space-x-2 font-black text-xs tracking-widest uppercase bg-brand-yellow hover:bg-brand-gold text-brand-charcoal shadow-lg shadow-brand-yellow/15 hover:shadow-brand-yellow/25 transition-all duration-300 disabled:opacity-50 cursor-pointer"
          >
            {isPlacing ? (
              <span className="flex items-center space-x-2">
                <span className="w-4 h-4 border-2 border-brand-charcoal border-t-transparent rounded-full animate-spin" />
                <span>Placing Order...</span>
              </span>
            ) : (
              <>
                <Check className="w-4.5 h-4.5 stroke-[2.5]" />
                <span>Place Order</span>
              </>
            )}
          </button>
        )}
      </div>

    </form>
  );
}
