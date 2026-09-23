"use client";

import React, { useState, useEffect } from "react";
import { Lock, Search, Filter, RefreshCw, Eye, MessageCircle } from "lucide-react";
import { OrderRecord, OrderStatus } from "@/lib/orders";
import { getWhatsAppNotificationLink, buildCustomerOrderConfirmationMsg, buildStatusUpdateMsg } from "@/lib/notifications";

export default function AdminOrdersClient() {
  const [secretKey, setSecretKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (secretKey.trim()) {
      setIsAuthenticated(true);
      fetchOrders(secretKey.trim());
    }
  };

  const fetchOrders = async (key: string, isSilent = false) => {
    if (!isSilent) setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders?secretKey=${encodeURIComponent(key)}&_t=${Date.now()}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else if (!isSilent) {
        setError(data.error || "Failed to load orders. Please verify admin key.");
      }
    } catch (err) {
      console.error(err);
      if (!isSilent) setError("Network error fetching orders.");
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !secretKey) return;

    const interval = setInterval(() => {
      fetchOrders(secretKey, true);
    }, 15000);

    return () => clearInterval(interval);
  }, [isAuthenticated, secretKey]);

  const handleStatusChange = async (publicOrderId: string, newStatus: OrderStatus) => {
    setUpdatingId(publicOrderId);
    try {
      const res = await fetch(`/api/admin/orders?secretKey=${encodeURIComponent(secretKey)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicOrderId, orderStatus: newStatus }),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setOrders((prev) =>
          prev.map((o) => (o.publicOrderId === publicOrderId ? data.order : o))
        );
      } else {
        alert(data.error || "Failed to update order status.");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-brand-white min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-[#E5E7EB] p-8 rounded-3xl shadow-sm space-y-6 text-center">
          <div className="w-12 h-12 bg-brand-yellow/20 text-brand-charcoal rounded-2xl flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6 text-brand-charcoal" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-brand-charcoal font-heading">
              COSTRA Admin Portal
            </h1>
            <p className="text-xs font-bold text-brand-charcoal/60 mt-1">
              Enter Admin Secret Key to manage store orders
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-charcoal/70">
                Admin Secret Key
              </label>
              <input
                type="password"
                required
                placeholder="Enter secret key..."
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                className="w-full px-4 py-3 bg-[#FAF9F5] border border-[#E5E7EB] rounded-2xl text-sm font-bold text-brand-charcoal focus:outline-none focus:border-[#F5B800] transition-all"
              />
            </div>
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="w-full py-3.5 bg-brand-yellow hover:bg-brand-gold text-brand-charcoal font-extrabold text-sm rounded-2xl shadow-md transition-all cursor-pointer"
            >
              Access Admin Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  const filteredOrders = orders.filter((o) => {
    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "paid"
        ? o.paymentStatus === "paid"
        : o.orderStatus === statusFilter;

    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      o.publicOrderId.toLowerCase().includes(query) ||
      o.customerName.toLowerCase().includes(query) ||
      o.customerPhone.includes(query);

    return matchesStatus && matchesQuery;
  });

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="bg-brand-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#F5B800]">
              COSTRA Coffee Store Manager
            </span>
            <h1 className="text-3xl font-black text-brand-charcoal tracking-tight font-heading">
              Order Management Dashboard
            </h1>
          </div>

          <button
            onClick={() => fetchOrders(secretKey)}
            disabled={loading}
            className="px-4 py-2.5 bg-brand-neutral hover:bg-gray-200 text-brand-charcoal font-bold text-xs rounded-xl shadow-sm border border-gray-300 transition-all flex items-center space-x-2 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Orders</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white border border-[#E5E7EB] p-5 rounded-2xl shadow-sm">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Orders</span>
            <span className="text-2xl font-black text-brand-charcoal font-mono">{orders.length}</span>
          </div>
          <div className="bg-white border border-[#E5E7EB] p-5 rounded-2xl shadow-sm">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Revenue</span>
            <span className="text-2xl font-black text-emerald-600 font-mono">₹{totalRevenue}</span>
          </div>
          <div className="bg-white border border-[#E5E7EB] p-5 rounded-2xl shadow-sm">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Paid Transactions</span>
            <span className="text-2xl font-black text-blue-600 font-mono">
              {orders.filter((o) => o.paymentStatus === "paid").length}
            </span>
          </div>
          <div className="bg-white border border-[#E5E7EB] p-5 rounded-2xl shadow-sm">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Pending / Placed</span>
            <span className="text-2xl font-black text-amber-600 font-mono">
              {orders.filter((o) => o.orderStatus === "order_placed").length}
            </span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-[#FAF9F5] border border-[#E5E7EB] p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Order ID, Name, or Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-brand-charcoal focus:outline-none focus:border-[#F5B800]"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-brand-charcoal focus:outline-none focus:border-[#F5B800]"
            >
              <option value="all">All Statuses</option>
              <option value="order_placed">Order Placed</option>
              <option value="payment_confirmed">Payment Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white border border-[#E5E7EB] rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-brand-neutral/40 border-b border-gray-200 text-brand-charcoal font-black uppercase text-[10px] tracking-wider">
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Order Status Action</th>
                  <th className="p-4">Notify Customer</th>
                  <th className="p-4 text-right">Track Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-semibold">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-gray-400 font-bold">
                      No orders found matching the filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((o) => {
                    const waMessage = o.orderStatus === "payment_confirmed" || o.orderStatus === "order_placed"
                      ? buildCustomerOrderConfirmationMsg(o)
                      : buildStatusUpdateMsg(o, o.orderStatus);
                    const waLink = getWhatsAppNotificationLink(o.customerPhone, waMessage);

                    return (
                      <tr key={o.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="p-4 font-mono font-black text-brand-charcoal text-sm">
                          #{o.publicOrderId}
                        </td>
                        <td className="p-4 text-gray-500 text-[11px]">
                          {new Date(o.createdAt).toLocaleString("en-IN", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </td>
                        <td className="p-4">
                          <span className="block font-extrabold text-brand-charcoal">{o.customerName}</span>
                          <span className="block text-gray-500 text-[11px]">{o.customerPhone}</span>
                        </td>
                        <td className="p-4 text-gray-600 max-w-xs truncate">
                          {o.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                        </td>
                        <td className="p-4 font-bold text-brand-coffee text-sm">
                          ₹{o.totalAmount}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                              o.paymentStatus === "paid"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            {o.paymentStatus}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <select
                              disabled={updatingId === o.publicOrderId}
                              value={o.orderStatus}
                              onChange={(e) =>
                                handleStatusChange(o.publicOrderId, e.target.value as OrderStatus)
                              }
                              className="px-3 py-1.5 bg-white border border-gray-300 rounded-xl text-xs font-bold text-brand-charcoal focus:outline-none focus:border-[#F5B800] disabled:opacity-50"
                            >
                              <option value="order_placed">Order Placed</option>
                              <option value="payment_confirmed">Payment Confirmed</option>
                              <option value="preparing">Preparing</option>
                              <option value="ready">Ready</option>
                              <option value="out_for_delivery">Out for Delivery</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            {updatingId === o.publicOrderId && (
                              <div className="w-3.5 h-3.5 border-2 border-brand-yellow border-t-transparent rounded-full animate-spin" />
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-200 transition-all cursor-pointer shadow-sm"
                            title="Send WhatsApp confirmation / tracking update to customer"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                            <span>WhatsApp</span>
                          </a>
                        </td>
                        <td className="p-4 text-right">
                          <a
                            href={`/track?id=${o.publicOrderId}&phone=${o.customerPhone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-xs font-bold text-brand-charcoal hover:text-[#F5B800] underline"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </a>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
