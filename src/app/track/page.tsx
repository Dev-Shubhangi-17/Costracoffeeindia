import React, { Suspense } from "react";
import { Metadata } from "next";
import TrackOrderClient from "@/components/tracking/TrackOrderClient";

export const metadata: Metadata = {
  title: "Track Your Order | COSTRA Coffee",
  description: "Track live status, payment confirmation, and delivery timeline for your COSTRA Coffee order.",
};

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-brand-white flex items-center justify-center p-8">
          <div className="w-8 h-8 border-3 border-brand-yellow border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <TrackOrderClient />
    </Suspense>
  );
}
