import type { Metadata } from "next";
import HeroSlider from "@/components/home/HeroSlider";
import ProductGrid from "@/components/shop/ProductGrid";
import BrewingGuides from "@/components/home/BrewingGuides";
import QualityVerified from "@/components/home/QualityVerified";
import PhilosophyAndQuiz from "@/components/home/PhilosophyAndQuiz";
import FAQSection from "@/components/home/FAQSection";
import WholesaleSection from "@/components/home/WholesaleSection";

export const metadata: Metadata = {
  title: "COSTRA Coffee | Authentic Filter Coffee & Artisanal Blends",
  description: "Shop premium South Indian filter coffee (70% Robusta & 30% Chicory), roasted Arabica whole beans, and instant coffee by Swati Gruh Udhyog in India.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-brand-white">
      
      {/* Animated Hero Carousel Slider */}
      <HeroSlider />

      {/* Main E-Commerce Shop Section */}
      <section id="shop-catalog" className="max-w-7xl mx-auto px-6 py-20 md:py-24">
        <div className="space-y-4 text-center md:text-left mb-12">
          <div className="inline-flex items-center space-x-1.5 text-[#F5B800] bg-[#F5B800]/10 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase">
            <span>COSTRA Storefront</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-brand-charcoal font-heading leading-tight">
              Our Artisanal Coffee Blends
            </h2>
            <p className="text-xs sm:text-sm text-brand-charcoal/50 max-w-md md:text-right leading-relaxed font-semibold">
              Explore our selection of premium roasted filter blends, whole bean single-origin coffees, and instant solutions.
            </p>
          </div>
        </div>

        {/* Dynamic Product Grid Component with Client-Side state */}
        <ProductGrid />
      </section>

      {/* Detailed Brewing Guides Accordion Section */}
      <BrewingGuides />

      {/* Quality Verified Section */}
      <QualityVerified />

      {/* Coffee Philosophy & Recommender Quiz Section */}
      <PhilosophyAndQuiz />

      {/* Questions, Answered FAQ Section */}
      <FAQSection />

      {/* Wholesale & B2B Section */}
      <WholesaleSection />

    </div>
  );
}
