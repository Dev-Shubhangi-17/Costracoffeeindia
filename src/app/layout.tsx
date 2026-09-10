import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import CartDrawer from "@/components/cart/CartDrawer";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
import WhatsAppWidget from "@/components/common/WhatsAppWidget";
import WelcomeLoader from "@/components/common/WelcomeLoader";
import AnalyticsScripts from "@/components/analytics/AnalyticsScripts";
import RouteTracker from "@/components/analytics/RouteTracker";
import "./globals.css";
 
const headingFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});
 
const bodyFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});
 
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://costracoffee.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "COSTRA Coffee | Authentic Filter Coffee & Blends by Swati Gruh Udhyog",
    template: "%s | COSTRA Coffee",
  },
  description: "Experience premium, authentic filter coffee roasts and rich aromatic blends by COSTRA. Rooted in the rich culinary heritage of Swati Gruh Udhyog in India.",
  keywords: [
    "Filter Coffee",
    "South Indian Filter Coffee",
    "Swati Gruh Udhyog",
    "COSTRA Coffee",
    "India Coffee",
    "Artisanal Coffee Blends",
    "Robusta Chicory Blend",
    "Arabica Coffee Beans",
    "Instant Hazelnut Coffee",
    "FSSAI Certified Coffee",
  ],
  authors: [{ name: "Swati Gruh Udhyog" }],
  creator: "Swati Gruh Udhyog",
  publisher: "COSTRA Coffee",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: "COSTRA Coffee | Authentic Filter Coffee & Blends by Swati Gruh Udhyog",
    description: "Experience premium, authentic filter coffee roasts and rich aromatic blends by COSTRA. Rooted in the rich culinary heritage of Swati Gruh Udhyog in India.",
    url: siteUrl,
    siteName: "COSTRA Coffee",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/costra-filter-coffee.png",
        width: 1200,
        height: 630,
        alt: "COSTRA Coffee - Authentic South Indian Filter Coffee & Blends",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "COSTRA Coffee | Authentic Filter Coffee & Blends",
    description: "Experience premium, authentic filter coffee roasts and rich aromatic blends by COSTRA. Rooted in Swati Gruh Udhyog, India.",
    images: ["/images/costra-filter-coffee.png"],
  },
};

const jsonLdData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      "name": "COSTRA Coffee",
      "alternateName": "Swati Gruh Udhyog",
      "url": siteUrl,
      "logo": `${siteUrl}/images/costra-filter-coffee.png`,
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-8734082232",
        "contactType": "customer service",
        "areaServed": "IN",
        "availableLanguage": ["English", "Hindi", "Gujarati"]
      },
      "sameAs": [
        "https://www.instagram.com/costra_23"
      ]
    },
    {
      "@type": "LocalBusiness",
      "@id": `${siteUrl}/#localbusiness`,
      "name": "COSTRA Coffee & Swati Gruh Udhyog",
      "image": `${siteUrl}/images/costra-filter-coffee.png`,
      "telephone": "+91-8734082232",
      "email": "costrabyswatigruhudhyog@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "A-2, 503 Yagnapurush Residency, Kalali",
        "addressLocality": "India",
        "addressRegion": "Gujarat",
        "postalCode": "390012",
        "addressCountry": "IN"
      },
      "priceRange": "₹149 - ₹2299"
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      "url": siteUrl,
      "name": "COSTRA Coffee",
      "description": "Authentic South Indian filter coffee roasts and artisanal coffee blends by Swati Gruh Udhyog.",
      "publisher": {
        "@id": `${siteUrl}/#organization`
      }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      </head>
      <body
        className={`${headingFont.variable} ${bodyFont.variable} font-body bg-brand-white text-brand-charcoal antialiased flex flex-col min-h-screen`}
      >
        <AuthProvider>
          {/* Sticky announcements and navigation */}
          <AnnouncementBar />
          <Navbar />

          {/* Global Cart Drawer */}
          <CartDrawer />

          {/* Main Content Area */}
          <main className="flex-grow">
            {children}
          </main>

          {/* Global Brand Footer */}
          <Footer />

          {/* Floating WhatsApp Widget */}
          <WhatsAppWidget />

          {/* Welcome Loader Preloader Modal */}
          <WelcomeLoader />

          {/* Third-Party Analytics Trackers */}
          <AnalyticsScripts />
          <RouteTracker />
        </AuthProvider>
      </body>
    </html>
  );
}

