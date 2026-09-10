import React from "react";
import { Metadata } from "next";
import CheckoutClient from "@/components/checkout/CheckoutClient";

export const metadata: Metadata = {
  title: "Secure Checkout | COSTRA Coffee",
  description: "Complete your order securely for authentic COSTRA filter coffee and artisanal blends by Swati Gruh Udhyog.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
