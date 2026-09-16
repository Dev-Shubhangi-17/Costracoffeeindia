"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  CheckCircle2,
  Clock,
  Package,
  Bike,
  Check,
  AlertCircle,
  Coffee,
  ShoppingBag,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderData {
  id: string;
  publicOrderId: string;
  customerName: string;
  customerPhoneMasked?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  currency: string;
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus:
    | "order_placed"
    | "payment_confirmed"
    | "preparing"
    | "ready"
    | "out_for_delivery"
    | "delivered"
    | "cancelled";
  shippingAddress?: string;
  createdAt: string;
  updatedAt: string;
}

const STATUS_STEPS = [
  { key: "order_placed", label: "Order Placed", icon: Clock, desc: "Order received by COSTRA" },
  { key: "payment_confirmed", label: "Payment Confirmed", icon: CheckCircle2, desc: "Payment verified successfully" },
  { key: "preparing", label: "Preparing", icon: Coffee, desc: "Fresh coffee blend being crafted" },
  { key: "ready", label: "Ready", icon: Package, desc: "Packed & quality verified" },
  { key: "out_for_delivery", label: "Out for Delivery", icon: Bike, desc: "On the way to your address" },
  { key: "delivered", label: "Delivered", icon: Check, desc: "Delivered. Enjoy your COSTRA coffee!" },
];

export default function TrackOrderClient() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || "";
  const initialPhone = searchParams.get("phone") || "";

  const [orderId, setOrderId] = useState(initialId);
  const [phone, setPhone] = useState(initialPhone);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderData | null>(null);

  const fetchOrder = async (searchId: string, searchPhone: string) => {
    if (!searchId.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: searchId.trim(), phone: searchPhone.trim() }),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setOrder(data.order);
      } else {
        setError(data.error || "Order not found. Please verify your details.");
        setOrder(null);
      }
    } catch (err: unknown) {
      console.error(err);
      setError("Network error fetching order details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      fetchOrder(initialId, initialPhone);
    }
  }, [initialId, initialPhone]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(orderId, phone);
  };

  const getStepStatus = (stepKey: string) => {
    if (!order) return "upcoming";
    if (order.orderStatus === "cancelled") return "cancelled";

    const stepOrder = STATUS_STEPS.map((s) => s.key);
    const currentIndex = stepOrder.indexOf(order.orderStatus);
    const stepIndex = stepOrder.indexOf(stepKey);

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "upcoming";
  };

  return (
    <div className="bg-brand-white min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-6 space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="bg-brand-yellow/15 text-brand-charcoal text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border border-brand-yellow/30">
            COSTRA Coffee Live Tracker
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-charcoal tracking-tight font-heading">
            Track Your Order
          </h1>
          <p className="text-xs sm:text-sm text-brand-charcoal/60 font-semibold max-w-md mx-auto">
            Enter your Order ID (e.g., <code className="font-mono text-brand-charcoal font-bold bg-brand-neutral px-1.5 py-0.5 rounded">COSTRA1024</code>) and phone number to view live status.
          </p>
        </div>

        {/* Search Card Form */}
        <div className="bg-[#FAF9F5] border border-[#E5E7EB] p-6 sm:p-8 rounded-3xl shadow-sm space-y-4">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
            <div className="sm:col-span-6 space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-charcoal/70">
                Order ID *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. COSTRA1024"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-2xl text-sm font-bold text-brand-charcoal focus:outline-none focus:border-[#F5B800] transition-all uppercase"
              />
            </div>

            <div className="sm:col-span-6 space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-charcoal/70">
                Phone Number <span className="text-[10px] text-gray-400 font-normal">(Verification)</span>
              </label>
              <input
                type="tel"
                placeholder="e.g. 8734082232"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-2xl text-sm font-bold text-brand-charcoal focus:outline-none focus:border-[#F5B800] transition-all"
              />
            </div>

            <div className="sm:col-span-12">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-brand-yellow hover:bg-brand-gold text-brand-charcoal font-extrabold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-brand-charcoal border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Search className="w-4 h-4 stroke-[2.5]" />
                    <span>Track Order Status</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-2xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Order Details Display Card */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-10 shadow-sm space-y-8"
          >
            {/* Top Summary Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-6">
              <div>
                <span className="text-[10px] font-bold text-brand-charcoal/40 uppercase tracking-widest block">
                  Order Reference
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-brand-charcoal tracking-tight font-mono">
                  #{order.publicOrderId}
                </h2>
                <span className="text-xs text-brand-charcoal/60 font-semibold block mt-0.5">
                  Placed on {new Date(order.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 bg-green-50 border border-green-200 text-green-700 font-extrabold text-xs rounded-full uppercase tracking-wider">
                  Payment: {order.paymentStatus.toUpperCase()}
                </span>
                <span className="px-3 py-1 bg-brand-charcoal text-[#F5B800] font-extrabold text-xs rounded-full uppercase tracking-wider">
                  Status: {order.orderStatus.replace(/_/g, " ").toUpperCase()}
                </span>
              </div>
            </div>

            {/* Visual Timeline Tracker */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-brand-charcoal/60 uppercase tracking-wider">
                Live Order Progress
              </h3>

              {order.orderStatus === "cancelled" ? (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 font-bold text-sm rounded-2xl flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <span>This order was cancelled. If you have questions, please contact COSTRA Support.</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
                  {STATUS_STEPS.map((step) => {
                    const status = getStepStatus(step.key);
                    const Icon = step.icon;

                    let bgClass = "bg-gray-50 border-gray-200 text-gray-400";
                    let iconBg = "bg-gray-200 text-gray-500";

                    if (status === "completed") {
                      bgClass = "bg-emerald-50 border-emerald-200 text-emerald-900";
                      iconBg = "bg-emerald-600 text-white";
                    } else if (status === "current") {
                      bgClass = "bg-[#F5B800]/15 border-[#F5B800] text-brand-charcoal ring-2 ring-[#F5B800]/20";
                      iconBg = "bg-[#F5B800] text-brand-charcoal animate-pulse";
                    }

                    return (
                      <div
                        key={step.key}
                        className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-between space-y-2.5 transition-all ${bgClass}`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${iconBg}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-extrabold block leading-tight">
                            {step.label}
                          </span>
                          <span className="text-[9px] font-semibold opacity-75 block leading-tight mt-0.5">
                            {step.desc}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Items & Shipping Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4 border-t border-gray-100">
              {/* Items List */}
              <div className="md:col-span-7 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-black uppercase text-brand-charcoal/70 tracking-wider">
                  <ShoppingBag className="w-4 h-4 text-brand-yellow" />
                  <span>Items Ordered</span>
                </div>
                <div className="space-y-2 bg-[#F9F9FB] border border-[#E5E7EB] p-4 rounded-2xl">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs font-semibold text-brand-charcoal">
                      <span>{item.quantity}x {item.name}</span>
                      <span className="font-bold">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 pt-2.5 flex justify-between items-center text-sm font-extrabold text-brand-charcoal">
                    <span>Total Amount Paid</span>
                    <span className="text-brand-coffee">₹{order.totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="md:col-span-5 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-black uppercase text-brand-charcoal/70 tracking-wider">
                  <MapPin className="w-4 h-4 text-brand-yellow" />
                  <span>Delivery Address</span>
                </div>
                <div className="bg-[#F9F9FB] border border-[#E5E7EB] p-4 rounded-2xl space-y-1.5 text-xs text-brand-charcoal font-semibold">
                  <span className="block font-bold text-gray-900">{order.customerName}</span>
                  {order.shippingAddress && <span className="block text-gray-600">{order.shippingAddress}</span>}
                  {order.customerPhoneMasked && <span className="block text-gray-500">Contact: {order.customerPhoneMasked}</span>}
                </div>
              </div>
            </div>

          </motion.div>
        )}

      </div>
    </div>
  );
}
