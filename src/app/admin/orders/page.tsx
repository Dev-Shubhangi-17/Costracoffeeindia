import React, { Suspense } from "react";
import { Metadata } from "next";
import AdminOrdersClient from "@/components/admin/AdminOrdersClient";

export const metadata: Metadata = {
  title: "Admin Order Management | COSTRA Coffee",
  description: "Costra Coffee admin portal for tracking and managing incoming customer orders.",
};

export default function AdminOrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-brand-white flex items-center justify-center p-8">
          <div className="w-8 h-8 border-3 border-brand-yellow border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AdminOrdersClient />
    </Suspense>
  );
}
