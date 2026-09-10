import React from "react";
import { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import LeadershipSection from "@/components/about/LeadershipSection";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://costracoffee.com";

export const metadata: Metadata = {
  title: "About Us & Leadership | COSTRA Coffee & Swati Gruh Udhyog",
  description: "Discover the culinary heritage of Swati Gruh Udhyog in India. Learn about our leadership team, quality standards, and FSSAI-certified coffee roasts.",
  keywords: [
    "About COSTRA Coffee",
    "Swati Gruh Udhyog",
    "Swati Pashupati Singh",
    "India Coffee Manufacturer",
    "FSSAI Certified Coffee Gujarat",
    "Filter Coffee Heritage",
  ],
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  openGraph: {
    title: "About Us & Leadership | COSTRA Coffee & Swati Gruh Udhyog",
    description: "Discover the culinary heritage of Swati Gruh Udhyog in India. Learn about our leadership team, quality standards, and FSSAI-certified coffee roasts.",
    url: `${siteUrl}/about`,
    siteName: "COSTRA Coffee",
    type: "article",
    images: [
      {
        url: "/images/team/swati-singh.jpg",
        width: 600,
        height: 750,
        alt: "Swati Pashupati Singh - Founder & CEO of Swati Gruh Udhyog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About COSTRA Coffee & Swati Gruh Udhyog",
    description: "Learn about the heritage of Swati Gruh Udhyog, leadership team, and FSSAI-certified coffee standards.",
    images: ["/images/team/swati-singh.jpg"],
  },
};

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "About COSTRA Coffee & Swati Gruh Udhyog",
  "description": "Learn about the heritage of Swati Gruh Udhyog and COSTRA Coffee, our FSSAI-certified quality standards, and dedicated leadership team.",
  "url": `${siteUrl}/about`,
  "mainEntity": {
    "@type": "Organization",
    "name": "Swati Gruh Udhyog",
    "founder": {
      "@type": "Person",
      "name": "Swati Pashupati Singh",
      "jobTitle": "Founder & Chief Executive Officer (CEO)"
    },
    "location": {
      "@type": "PostalAddress",
      "streetAddress": "A-2, 503 Yagnapurush Residency, Kalali",
      "addressLocality": "India",
      "addressRegion": "Gujarat",
      "postalCode": "390012",
      "addressCountry": "IN"
    }
  }
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-brand-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      {/* 1. Leadership Section Component (Headers, CEO, Team Grid) */}
      <LeadershipSection />

      {/* 2. FSSAI Verification Section */}
      <section className="py-16 sm:py-24 bg-[#FAF9F5] border-t border-b border-[#EAE6DB]" id="fssai-verification">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white rounded-3xl border border-[#EAE6DB] p-8 md:p-12 shadow-xl max-w-4xl mx-auto relative overflow-hidden">
            
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F5B800]/5 rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#F5B800]/5 rounded-tr-full" />

            <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
              
              {/* Trust Badge Icon */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-3xl bg-[#F5B800]/10 border-2 border-[#F5B800]/35 flex flex-col items-center justify-center shadow-lg relative group">
                  <ShieldCheck className="w-10 h-10 text-[#F5B800] stroke-[2]" />
                  <span className="text-[7px] font-black text-black/75 tracking-wider uppercase mt-1">
                    CERTIFIED
                  </span>
                </div>
              </div>

              {/* FSSAI Text Context */}
              <div className="flex-grow space-y-4 text-center md:text-left">
                <div className="inline-flex items-center space-x-1.5 bg-[#4B8B3B]/10 border border-[#4B8B3B]/30 text-[#4B8B3B] text-[9px] font-black tracking-widest px-3 py-1 rounded-full uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4B8B3B]" />
                  <span>100% PURE & COMPLIANT</span>
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-brand-charcoal leading-tight">
                  FSSAI Quality Checked & Verified
                </h3>
                
                <p className="text-xs sm:text-sm text-brand-charcoal/60 leading-relaxed font-body font-medium max-w-2xl">
                  Every batch of Costra Coffee blends and Swati Gruh Udhyog food products is processed under strict sanitary protocols, lab tested, and formulation certified in absolute alignment with the Food Safety and Standards Authority of India (FSSAI) guidelines.
                </p>

                {/* License Tag */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                  <div className="bg-[#FAF9F5] border border-[#E5E7EB] rounded-xl px-4 py-2 text-xs font-mono font-bold text-brand-charcoal flex items-center space-x-2">
                    <span className="text-brand-charcoal/40">FSSAI Lic. No:</span>
                    <strong className="text-brand-charcoal">10724999000371</strong>
                  </div>
                  <span className="text-[10px] font-bold text-[#4B8B3B] uppercase tracking-wider">
                    ✓ Verified Food Safety Standard Compliant
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
