"use client";

import React, { useState } from "react";
import Script from "next/script";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import { ShoppingBag, ArrowLeft, ShieldCheck, CheckCircle2, MessageSquare, CreditCard, Landmark, AlertCircle } from "lucide-react";
import Link from "next/link";
import { trackPurchase, trackInitiateCheckout } from "@/lib/analytics";

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayFailureResponse {
  error?: {
    code?: string;
    description?: string;
    source?: string;
    step?: string;
    reason?: string;
    metadata?: Record<string, unknown>;
  };
}

export default function CheckoutClient() {
  const { cart, getSubtotal, clearCart } = useCartStore();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    pincode: "",
    city: "India",
    address: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "cod">("upi");
  const [isOrdering, setIsOrdering] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [confirmedPublicOrderId, setConfirmedPublicOrderId] = useState<string>("");

  const subtotal = getSubtotal();
  const isCartEmpty = cart.length === 0;

  // Invoice calculations
  const gstAmount = Math.round(subtotal * 0.05); // 5% Coffee GST
  const freeShippingThreshold = 499;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 50;
  const grandTotal = subtotal + gstAmount + shippingFee;

  const [hasInitiatedCheckout, setHasInitiatedCheckout] = useState(false);

  React.useEffect(() => {
    if (cart.length > 0 && !hasInitiatedCheckout) {
      trackInitiateCheckout(
        cart.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        grandTotal
      );
      setHasInitiatedCheckout(true);
    }
  }, [cart, grandTotal, hasInitiatedCheckout]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (paymentError) setPaymentError(null);
  };

  const buildWhatsAppMessage = () => {
    const itemsText = cart
      .map((item) => `• ${item.name} (${item.weight}) x ${item.quantity} - ₹${item.price * item.quantity}`)
      .join("\n");
    const addressText = `${formData.address}, ${formData.city} - ${formData.pincode}`;
    
    return `☕ *NEW COSTRA COFFEE ORDER*\n` +
      `--------------------------------\n` +
      `*Customer:* ${formData.name}\n` +
      `*Phone:* ${formData.phone}\n` +
      `*Delivery Address:* ${addressText}\n` +
      `--------------------------------\n` +
      `*ORDERED ITEMS:*\n${itemsText}\n` +
      `--------------------------------\n` +
      `*Subtotal:* ₹${subtotal}\n` +
      `*GST (5%):* ₹${gstAmount}\n` +
      `*Shipping:* ${shippingFee === 0 ? "FREE" : `₹${shippingFee}`}\n` +
      `*GRAND TOTAL:* ₹${grandTotal}\n` +
      `*Payment Method:* ${paymentMethod.toUpperCase()}\n` +
      `--------------------------------\n` +
      `Please confirm my order dispatch!`;
  };

  const handleWhatsAppCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.pincode || !formData.address) {
      setPaymentError("Please fill out all required shipping fields before proceeding.");
      return;
    }
    
    const orderItems = cart.map((item) => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));
    const totalAmount = grandTotal;

    const message = buildWhatsAppMessage();
    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/918734082232?text=${encoded}`;
    
    window.open(whatsappUrl, "_blank");
    trackPurchase(`order_${Date.now()}`, orderItems, totalAmount);

    clearCart();
    setIsSuccess(true);
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && (window as unknown as { Razorpay: unknown }).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim() || !formData.pincode.trim() || !formData.address.trim()) {
      setPaymentError("Please fill out all required shipping fields before placing your order.");
      return;
    }

    setPaymentError(null);

    const orderItems = cart.map((item) => ({
      id: item.id || item.productId,
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    if (paymentMethod === "cod") {
      setIsOrdering(true);
      setTimeout(() => {
        setIsOrdering(false);
        trackPurchase(`cod_order_${Date.now()}`, orderItems, grandTotal);
        clearCart();
        setIsSuccess(true);
      }, 1200);
      return;
    }

    // Razorpay Online / UPI Payment Flow
    setIsOrdering(true);

    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        setPaymentError("Could not load Razorpay Payment Gateway. Please check your internet connection and try again.");
        setIsOrdering(false);
        return;
      }

      // Step 1: Create Razorpay Order via backend API with customer details
      const response = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: grandTotal,
          customerName: formData.name,
          customerPhone: formData.phone.replace(/\D/g, ""),
          items: orderItems,
          shippingAddress: `${formData.address}, ${formData.city} - ${formData.pincode}`,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setPaymentError(data.error || "Failed to create payment order with server.");
        setIsOrdering(false);
        return;
      }

      const activeKeyId = data.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_TbTAf4ZPh03a1b";
      const siteOrigin = typeof window !== "undefined" ? window.location.origin : "";
      if (data.publicOrderId || data.public_order_id) {
        setConfirmedPublicOrderId(data.publicOrderId || data.public_order_id);
      }

      // Step 2: Configure Razorpay Checkout modal options
      const options = {
        key: activeKeyId,
        amount: data.amount,
        currency: data.currency || "INR",
        name: "COSTRA Coffee",
        description: "Authentic South Indian Filter Coffee & Blends by Swati Gruh Udhyog",
        image: `${siteOrigin}/images/costra-filter-coffee.png`,
        order_id: data.orderId,
        prefill: {
          name: formData.name,
          contact: formData.phone.replace(/\D/g, ""),
        },
        notes: {
          address: `${formData.address}, ${formData.city} - ${formData.pincode}`,
        },
        theme: {
          color: "#F5B800",
        },
        handler: async function (paymentResponse: RazorpayResponse) {
          try {
            // Step 3: Send Razorpay signature & details to backend for verification
            const verifyRes = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              if (verifyData.publicOrderId) {
                setConfirmedPublicOrderId(verifyData.publicOrderId);
              }
              trackPurchase(`razorpay_${paymentResponse.razorpay_payment_id}`, orderItems, grandTotal);
              clearCart();
              setIsSuccess(true);
            } else {
              setPaymentError(`Payment Verification Error: ${verifyData.error || "Signature verification failed."}`);
            }
          } catch (err: unknown) {
            console.error("Verification error:", err);
            setPaymentError("Network error while verifying payment signature with server. Please contact support.");
          } finally {
            setIsOrdering(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsOrdering(false);
          },
        },
      };

      const windowObj = window as unknown as {
        Razorpay: new (opts: typeof options) => {
          open: () => void;
          on: (event: string, cb: (res: RazorpayFailureResponse) => void) => void;
        };
      };

      const razorpayInstance = new windowObj.Razorpay(options);

      razorpayInstance.on("payment.failed", function (failResponse: RazorpayFailureResponse) {
        const errorDesc = failResponse.error?.description || failResponse.error?.reason || "Transaction was declined or cancelled.";
        setPaymentError(`Payment Failed: ${errorDesc}`);
        setIsOrdering(false);
      });

      razorpayInstance.open();
    } catch (err: unknown) {
      console.error("Razorpay initiation error:", err);
      const msg = err instanceof Error ? err.message : "Failed to launch Razorpay Checkout.";
      setPaymentError(`Unexpected Payment Error: ${msg}`);
      setIsOrdering(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-brand-white min-h-screen py-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-[#E5E7EB] rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-xl py-12"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#F5B800] block">
              Payment Confirmed
            </span>
            <h2 className="text-2xl font-black text-brand-charcoal font-heading">Order Placed Successfully!</h2>
            {confirmedPublicOrderId && (
              <div className="p-3 bg-[#FAF9F5] border border-[#E5E7EB] rounded-2xl font-mono text-sm font-black text-brand-charcoal">
                Order #{confirmedPublicOrderId}
              </div>
            )}
            <p className="text-xs text-brand-charcoal/60 leading-relaxed font-semibold">
              Thank you for shopping with COSTRA. Your order is confirmed and being prepared. Order updates will be sent to <strong className="text-brand-charcoal">{formData.phone}</strong>.
            </p>
          </div>
          <div className="space-y-3 pt-2">
            <Link
              href={`/track?id=${confirmedPublicOrderId}&phone=${encodeURIComponent(formData.phone)}`}
              className="bg-[#F5B800] hover:bg-[#EAA000] text-black font-extrabold text-xs tracking-wider uppercase px-8 py-3.5 rounded-2xl shadow-md transition-all duration-200 block cursor-pointer"
            >
              Track Order Live
            </Link>
            <Link
              href="/"
              className="bg-brand-neutral hover:bg-gray-200 text-brand-charcoal font-extrabold text-xs tracking-wider uppercase px-8 py-3 rounded-2xl transition-all duration-200 block cursor-pointer"
            >
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-12">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Breadcrumb */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#E5E7EB]">
          <div>
            <nav className="text-[10px] font-black text-[#1A1A1A]/40 uppercase tracking-widest mb-3 flex items-center space-x-2">
              <Link href="/" className="hover:text-[#F5B800] transition-colors">Home</Link>
              <span>/</span>
              <span className="text-[#1A1A1A]/80">Secure Checkout</span>
            </nav>
            <h1 className="text-3xl font-extrabold tracking-tight text-brand-charcoal font-heading flex flex-wrap items-center gap-2.5">
              <span>Checkout</span>
              <span className="inline-flex items-center space-x-1.5 bg-[#F5B800]/10 border border-[#F5B800]/25 text-brand-charcoal text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-[#F5B800]" />
                <span>SSL Encrypted Secure Connection</span>
              </span>
            </h1>
          </div>
          
          <Link
            href="/"
            className="self-start md:self-auto inline-flex items-center text-xs font-bold text-brand-charcoal/60 hover:text-[#F5B800] uppercase tracking-wider transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            <span>Back to Store</span>
          </Link>
        </div>

        {/* Payment Error Alert Box */}
        {paymentError && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-3 text-red-800 text-xs font-bold animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-extrabold block uppercase tracking-wider text-[10px] text-red-900">
                Payment Notice
              </span>
              <p className="leading-relaxed">{paymentError}</p>
            </div>
          </div>
        )}

        {isCartEmpty ? (
          /* Empty Bag State */
          <div className="bg-white border border-[#E5E7EB] rounded-3xl p-8 max-w-md mx-auto text-center space-y-6 shadow-md py-16">
            <div className="w-16 h-16 bg-[#F9F9FB] rounded-full flex items-center justify-center text-brand-charcoal/40 mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-base font-extrabold text-brand-charcoal font-heading">Your bag is empty</h2>
              <p className="text-xs text-brand-charcoal/50 leading-relaxed font-semibold">
                You cannot proceed to checkout without any coffee blends inside your shopping bag.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/"
                className="bg-[#F5B800] hover:bg-[#EAA000] text-black font-extrabold text-xs tracking-wider uppercase px-8 py-3.5 rounded-2xl shadow-sm transition-all duration-200 inline-block cursor-pointer"
              >
                Go Add Blends
              </Link>
            </div>
          </div>
        ) : (
          /* Checkout Grid layout */
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Column: Shipping Address Form */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Shipping Address Box */}
              <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center space-x-3 pb-4 border-b border-[#E5E7EB]">
                  <div className="w-8 h-8 rounded-xl bg-[#F5B800]/10 border border-[#F5B800]/30 flex items-center justify-center text-[#F5B800] font-black text-xs">
                    1
                  </div>
                  <h2 className="text-lg font-black text-brand-charcoal font-heading">
                    Delivery Shipping Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-brand-charcoal/70 uppercase tracking-wider block">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-[#FAF9F5] border border-[#E5E7EB] rounded-xl px-4 py-3 text-xs font-semibold text-brand-charcoal focus:outline-none focus:border-[#F5B800] focus:ring-1 focus:ring-[#F5B800] transition-all"
                    />
                  </div>

                  {/* Phone / WhatsApp */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-brand-charcoal/70 uppercase tracking-wider block">
                      Mobile / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="10-digit mobile number"
                      className="w-full bg-[#FAF9F5] border border-[#E5E7EB] rounded-xl px-4 py-3 text-xs font-semibold text-brand-charcoal focus:outline-none focus:border-[#F5B800] focus:ring-1 focus:ring-[#F5B800] transition-all"
                    />
                  </div>

                  {/* Pincode */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-brand-charcoal/70 uppercase tracking-wider block">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="e.g. 390012"
                      className="w-full bg-[#FAF9F5] border border-[#E5E7EB] rounded-xl px-4 py-3 text-xs font-semibold text-brand-charcoal focus:outline-none focus:border-[#F5B800] focus:ring-1 focus:ring-[#F5B800] transition-all"
                    />
                  </div>

                  {/* City */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-brand-charcoal/70 uppercase tracking-wider block">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g. India"
                      className="w-full bg-[#FAF9F5] border border-[#E5E7EB] rounded-xl px-4 py-3 text-xs font-semibold text-brand-charcoal focus:outline-none focus:border-[#F5B800] focus:ring-1 focus:ring-[#F5B800] transition-all"
                    />
                  </div>

                  {/* Full Street Address */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-[11px] font-bold text-brand-charcoal/70 uppercase tracking-wider block">
                      Complete Street Address (Flat / House / Landmark) *
                    </label>
                    <textarea
                      name="address"
                      required
                      rows={3}
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="House No, Apartment name, Street, Landmark..."
                      className="w-full bg-[#FAF9F5] border border-[#E5E7EB] rounded-xl px-4 py-3 text-xs font-semibold text-brand-charcoal focus:outline-none focus:border-[#F5B800] focus:ring-1 focus:ring-[#F5B800] transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center space-x-3 pb-4 border-b border-[#E5E7EB]">
                  <div className="w-8 h-8 rounded-xl bg-[#F5B800]/10 border border-[#F5B800]/30 flex items-center justify-center text-[#F5B800] font-black text-xs">
                    2
                  </div>
                  <h2 className="text-lg font-black text-brand-charcoal font-heading">
                    Payment Method
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* UPI / Instant Option */}
                  <div
                    onClick={() => setPaymentMethod("upi")}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center space-x-3 select-none ${
                      paymentMethod === "upi"
                        ? "border-[#F5B800] bg-[#F5B800]/5 shadow-sm"
                        : "border-[#E5E7EB] hover:border-gray-300 bg-[#FAF9F5]"
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full border-2 border-brand-charcoal flex items-center justify-center p-0.5">
                      {paymentMethod === "upi" && <div className="w-full h-full rounded-full bg-[#F5B800]" />}
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <CreditCard className="w-4 h-4 text-[#F5B800]" />
                        <span className="text-xs font-black text-brand-charcoal">Razorpay / UPI / Cards</span>
                      </div>
                      <span className="text-[10px] text-brand-charcoal/50 font-semibold block mt-0.5">
                        GPay, PhonePe, Paytm, Cards & Net Banking
                      </span>
                    </div>
                  </div>

                  {/* COD Option */}
                  <div
                    onClick={() => setPaymentMethod("cod")}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center space-x-3 select-none ${
                      paymentMethod === "cod"
                        ? "border-[#F5B800] bg-[#F5B800]/5 shadow-sm"
                        : "border-[#E5E7EB] hover:border-gray-300 bg-[#FAF9F5]"
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full border-2 border-brand-charcoal flex items-center justify-center p-0.5">
                      {paymentMethod === "cod" && <div className="w-full h-full rounded-full bg-[#F5B800]" />}
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <Landmark className="w-4 h-4 text-brand-charcoal/60" />
                        <span className="text-xs font-black text-brand-charcoal">Cash on Delivery (COD)</span>
                      </div>
                      <span className="text-[10px] text-brand-charcoal/50 font-semibold block mt-0.5">
                        Pay cash upon parcel delivery
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Order Invoice Breakdown */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 shadow-md space-y-6 sticky top-28">
                <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
                  <h3 className="text-base font-black text-brand-charcoal font-heading">
                    Order Invoice Breakdown
                  </h3>
                  <span className="text-xs font-bold text-brand-charcoal/40 uppercase tracking-widest">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)} Items
                  </span>
                </div>

                {/* Items Breakdown list */}
                <div className="max-h-56 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 py-1.5 border-b border-[#F5B800]/10 last:border-none">
                      {/* Thumbnail packaging */}
                      <div className="shrink-0">
                        <div className="w-10 h-12 bg-white border border-[#E5E7EB] rounded-lg flex items-center justify-center p-1 shadow-inner select-none">
                          <img
                            src={item.image}
                            alt={item.name}
                            width={40}
                            height={48}
                            loading="lazy"
                            className="h-full object-contain drop-shadow"
                          />
                        </div>
                      </div>

                      {/* Text details */}
                      <div className="flex-grow min-w-0 space-y-0.5">
                        <h4 className="text-xs font-bold text-brand-charcoal truncate">{item.name}</h4>
                        <div className="flex items-center space-x-2 text-[10px] text-brand-charcoal/50 font-semibold">
                          <span>Qty: {item.quantity}</span>
                          <span>•</span>
                          <span className="font-mono">{item.weight}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-black text-brand-charcoal">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Financial Totals */}
                <div className="space-y-3 pt-4 border-t border-[#E5E7EB] text-xs font-semibold text-brand-charcoal/70">
                  <div className="flex justify-between">
                    <span>Items Subtotal</span>
                    <span className="font-bold text-brand-charcoal">₹{subtotal}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Coffee GST (5% Included)</span>
                    <span className="font-bold text-brand-charcoal">₹{gstAmount}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Pan-India Shipping</span>
                    {shippingFee === 0 ? (
                      <span className="font-extrabold text-green-600 uppercase tracking-wider text-[10px]">
                        FREE SHIPPING
                      </span>
                    ) : (
                      <span className="font-bold text-brand-charcoal">₹{shippingFee}</span>
                    )}
                  </div>

                  {subtotal < freeShippingThreshold && (
                    <div className="bg-[#F5B800]/10 border border-[#F5B800]/30 rounded-xl p-2.5 text-[10px] font-bold text-brand-charcoal text-center">
                      Add ₹{freeShippingThreshold - subtotal} more to unlock <strong>FREE Shipping</strong>!
                    </div>
                  )}

                  <div className="flex justify-between items-center text-sm font-black text-brand-charcoal pt-3 border-t border-[#E5E7EB]">
                    <span className="font-heading">Grand Total</span>
                    <span className="text-lg font-black text-brand-charcoal">₹{grandTotal}</span>
                  </div>
                </div>

                {/* Action Buttons Stack */}
                <div className="space-y-3 pt-2">
                  <button
                    type="submit"
                    disabled={isOrdering}
                    className="w-full bg-[#F5B800] hover:bg-[#EAA000] text-black font-black text-xs tracking-wider uppercase py-4 rounded-2xl shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>{isOrdering ? "Processing Order..." : `Place Order · ₹${grandTotal}`}</span>
                  </button>

                  {/* Direct WhatsApp Order CTA button */}
                  <button
                    type="button"
                    onClick={handleWhatsAppCheckout}
                    className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs tracking-wider uppercase py-3.5 rounded-2xl shadow transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 fill-white" />
                    <span>Order via WhatsApp Direct</span>
                  </button>
                </div>

                <div className="text-center pt-2">
                  <span className="text-[9px] font-bold text-brand-charcoal/40 uppercase tracking-widest block">
                    Swati Gruh Udhyog • FSSAI Lic: 20726032000830
                  </span>
                </div>

              </div>

            </div>

          </form>
        )}

      </div>
    </div>
  );
}
