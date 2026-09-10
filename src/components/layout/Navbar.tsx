"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, ShoppingBag, Menu, X, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import Link from "next/link";

const navLinks = [
  { label: "HOME", href: "/" },
  { label: "SHOP", href: "/#shop-catalog" },
  { label: "ORIGINS", href: "/#origins" },
  { label: "ABOUT", href: "/about" },
  { label: "BREWING GUIDES", href: "/#brew-guide-section" },
  { label: "CONTACT", href: "/#contact" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { cart, toggleCart } = useCartStore();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <header className="sticky top-0 z-40 w-full flex justify-between items-center px-6 py-4 bg-white border-b border-gray-200">
        
        {/* Left: Brand Logo */}
        <Link href="/" className="flex items-center space-x-2 shrink-0 group">
          <div className="leading-none px-3 py-1.5 rounded-xl bg-[#F5B800]/10 border border-[#F5B800]/30 group-hover:border-[#F5B800] transition-all duration-200 shadow-sm">
            <span className="text-xl font-extrabold tracking-wider text-gray-900 uppercase block font-heading">
              COSTRA™
            </span>
            <span className="text-[8px] text-[#D49400] font-black tracking-widest uppercase block mt-1">
              BY SWATI GRUH UDHYOG • INDIA
            </span>
          </div>
        </Link>

        {/* Center: Desktop Menu Links */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              id={`navbar-link-${link.label.toLowerCase()}`}
              href={link.href}
              className="text-sm font-semibold tracking-wide uppercase text-gray-900 no-underline hover:text-[#F5B800] transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Controls & Badges */}
        <div className="flex items-center space-x-3.5">
          {/* Search Trigger */}
          <button
            id="navbar-search-btn"
            onClick={() => setIsSearchOpen(true)}
            className="p-2 text-gray-800 hover:text-[#F5B800] hover:bg-gray-100 rounded-full transition-all cursor-pointer"
            aria-label="Open Search"
          >
            <Search className="w-5 h-5 text-gray-800" />
          </button>

          {/* Wishlist */}
          <button
            id="navbar-wishlist-btn"
            className="p-2 text-gray-800 hover:text-[#F5B800] hover:bg-gray-100 rounded-full transition-all hidden sm:block relative cursor-pointer"
            aria-label="View Wishlist"
          >
            <Heart className="w-5 h-5 text-gray-800" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#F5B800] rounded-full animate-pulse" />
          </button>

          {/* WhatsApp Shortcut */}
          <a
            id="navbar-whatsapp-btn"
            href="https://wa.me/918734082232"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-800 hover:text-[#25D366] hover:bg-gray-100 rounded-full transition-all cursor-pointer flex items-center justify-center shrink-0"
            aria-label="WhatsApp Support"
          >
            <svg className="w-5 h-5 text-gray-800 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.019-5.116-2.876-6.974A9.774 9.774 0 0 0 12.008 1.84c-5.439 0-9.863 4.421-9.867 9.867-.001 1.735.469 3.43 1.36 4.938l-.983 3.595 3.699-.97c1.517.828 3.195 1.264 4.84 1.264zm5.727-11.758c-.235-.526-.483-.537-.706-.546-.184-.007-.394-.007-.604-.007-.21 0-.552.079-.841.394-.29.316-1.104 1.078-1.104 2.629 0 1.551 1.13 3.05 1.288 3.261.158.21 2.221 3.391 5.38 4.757.753.325 1.341.52 1.801.666.757.24 1.446.206 1.99.125.607-.09 1.847-.756 2.109-1.485.263-.729.263-1.353.184-1.485-.079-.131-.29-.21-.604-.368-.315-.158-1.847-.912-2.136-1.018-.29-.105-.5-.158-.707.158-.207.316-.802 1.018-.983 1.229-.181.21-.362.237-.677.079-.315-.158-1.332-.491-2.536-1.566-.937-.836-1.57-1.868-1.753-2.184-.183-.316-.02-.487.138-.644.142-.142.315-.368.473-.552.158-.184.21-.316.315-.526.105-.21.053-.395-.026-.552-.079-.158-.707-1.702-.973-2.299z"/>
            </svg>
          </a>

          {/* Shopping Cart Drawer Trigger */}
          <button
            id="navbar-cart-btn"
            onClick={() => toggleCart(true)}
            className="p-2 text-gray-800 hover:text-[#F5B800] hover:bg-gray-100 rounded-full transition-all relative flex items-center cursor-pointer"
            aria-label="View Shopping Bag"
          >
            <ShoppingBag className="w-5 h-5 text-gray-800" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#F5B800] text-brand-charcoal text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Hamburger menu */}
          <button
            id="navbar-mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-800 hover:text-[#F5B800] hover:bg-gray-100 rounded-full transition-all md:hidden cursor-pointer"
            aria-label="Toggle Mobile Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-gray-800" /> : <Menu className="w-5 h-5 text-gray-800" />}
          </button>
        </div>

      </header>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#1A1A1A]/80 backdrop-blur-sm flex items-start justify-center pt-24 px-6"
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="bg-white w-full max-w-xl rounded-3xl shadow-2xl p-6 border border-gray-200 relative"
            >
              <button
                id="search-close-btn"
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery("");
                }}
                className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>

              <h3 className="text-[10px] font-black tracking-widest text-gray-400 uppercase mb-3">
                Search Coffee Blends
              </h3>

              <div className="flex items-center space-x-3 border border-gray-200 bg-gray-50 rounded-2xl p-3 focus-within:bg-white focus-within:border-[#F5B800] focus-within:ring-1 focus-within:ring-[#F5B800] transition-all">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  id="search-input-field"
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-gray-950 placeholder:text-gray-400 flex-grow text-xs font-semibold"
                  autoFocus
                />
              </div>

              <div className="mt-4 flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                <span>Hit Enter to Search</span>
                <span className="text-[#F5B800]">Swati Gruh Udhyog Legacy</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Slide-Over Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-30 bg-[#1A1A1A]/40 backdrop-blur-sm md:hidden"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-30 w-80 max-w-xs bg-white shadow-2xl p-6 flex flex-col justify-between md:hidden"
            >
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <span className="text-base font-black text-gray-900 tracking-wide uppercase font-heading">
                    COSTRA™
                  </span>
                  <button
                    id="mobile-menu-close-btn"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 text-gray-500 hover:text-[#F5B800] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <nav className="flex flex-col space-y-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      id={`mobile-nav-link-${link.label.toLowerCase()}`}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-xs font-black tracking-widest text-gray-800 hover:text-[#F5B800] flex items-center justify-between border-b border-gray-100 pb-3 group no-underline"
                    >
                      <span>{link.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#F5B800] transition-colors" />
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="border-t border-gray-200 pt-6 space-y-3">
                <div className="text-[9px] text-gray-400 font-black uppercase tracking-widest">
                  Authentic Taste & Heritage
                </div>
                <div className="text-[10px] text-gray-600 font-semibold leading-relaxed">
                  Swati Gruh Udhyog<br />
                  India
                </div>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
