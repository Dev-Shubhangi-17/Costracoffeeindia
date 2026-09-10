"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, ExternalLink, Send, ShieldCheck, Clock } from "lucide-react";

interface ContactOption {
  name: string;
  phone: string;
  label: string;
  status: string;
}

const contacts: ContactOption[] = [
  {
    name: "Primary Support & Orders",
    phone: "918360322894",
    label: "+91 83603 22894",
    status: "Online • Quick Response",
  },
  {
    name: "Support Line 2",
    phone: "918734082232",
    label: "+91 87340 82232",
    status: "Available • Swati Gruh Udhyog",
  },
];

interface QuickChip {
  text: string;
  message: string;
  targetPhone: string;
}

const quickChips: QuickChip[] = [
  {
    text: "Order Filter Coffee 50g (₹199)",
    message: "Hello COSTRA! I would like to order the COSTRA Filter Coffee 50g pack (₹199/-). Please confirm.",
    targetPhone: "918360322894",
  },
  {
    text: "Inquire about Arabica 1KG Beans",
    message: "Hello COSTRA! I am interested in inquiring about the COSTRA Arabica Coffee Beans 1KG pack. Please share availability details.",
    targetPhone: "918360322894",
  },
  {
    text: "Help with existing order",
    message: "Hello COSTRA Support! I need help with an existing order I placed on the website.",
    targetPhone: "918734082232",
  },
];

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const handleContactClick = (phone: string, customMessage?: string) => {
    const text = customMessage || "Hello COSTRA! I have a query about your coffee blends.";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" id="whatsapp-floating-widget">
      
      {/* Popup Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ type: "spring", duration: 0.35 }}
            className="w-80 sm:w-88 bg-brand-white border border-brand-neutral/80 rounded-3xl shadow-2xl overflow-hidden mb-4 flex flex-col"
            id="whatsapp-widget-popup"
          >
            {/* Header */}
            <div className="bg-brand-charcoal p-5 text-brand-white relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#F5B800]" />
              
              <button
                id="whatsapp-widget-close"
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-1 text-brand-white/60 hover:text-brand-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-md shadow-green-500/20">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.019-5.116-2.876-6.974A9.774 9.774 0 0 0 12.008 1.84c-5.439 0-9.863 4.421-9.867 9.867-.001 1.735.469 3.43 1.36 4.938l-.983 3.595 3.699-.97c1.517.828 3.195 1.264 4.84 1.264zm5.727-11.758c-.235-.526-.483-.537-.706-.546-.184-.007-.394-.007-.604-.007-.21 0-.552.079-.841.394-.29.316-1.104 1.078-1.104 2.629 0 1.551 1.13 3.05 1.288 3.261.158.21 2.221 3.391 5.38 4.757.753.325 1.341.52 1.801.666.757.24 1.446.206 1.99.125.607-.09 1.847-.756 2.109-1.485.263-.729.263-1.353.184-1.485-.079-.131-.29-.21-.604-.368-.315-.158-1.847-.912-2.136-1.018-.29-.105-.5-.158-.707.158-.207.316-.802 1.018-.983 1.229-.181.21-.362.237-.677.079-.315-.158-1.332-.491-2.536-1.566-.937-.836-1.57-1.868-1.753-2.184-.183-.316-.02-.487.138-.644.142-.142.315-.368.473-.552.158-.184.21-.316.315-.526.105-.21.053-.395-.026-.552-.079-.158-.707-1.702-.973-2.299z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-extrabold tracking-wide font-heading">
                    COSTRA Support Desk
                  </h4>
                  <div className="flex items-center space-x-1.5 text-[10px] text-brand-white/60 font-semibold mt-0.5">
                    <Clock className="w-3 h-3 text-[#F5B800] animate-pulse" />
                    <span>Typically replies within a few minutes</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Body Content */}
            <div className="p-5 space-y-4 max-h-[300px] overflow-y-auto scrollbar-thin">
              
              <p className="text-[11px] font-semibold text-brand-charcoal/50 leading-relaxed">
                Click any official line to open chat on WhatsApp directly or select a quick action template.
              </p>

              {/* Contacts List */}
              <div className="space-y-2.5">
                {contacts.map((contact, idx) => (
                  <button
                    key={contact.phone}
                    id={`whatsapp-contact-${idx}`}
                    onClick={() => handleContactClick(contact.phone)}
                    className="w-full p-3 rounded-2xl border border-brand-neutral bg-brand-white hover:bg-brand-neutral/40 flex items-center justify-between text-left transition-all duration-200 cursor-pointer"
                  >
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-black text-brand-charcoal/40 uppercase tracking-widest block leading-none">
                        {contact.name}
                      </span>
                      <span className="text-xs font-black text-brand-charcoal block">
                        {contact.label}
                      </span>
                      <span className="text-[9px] font-bold text-green-600 block mt-0.5">
                        {contact.status}
                      </span>
                    </div>
                    <div className="p-1.5 bg-[#25D366]/10 text-[#25D366] rounded-lg shrink-0">
                      <Send className="w-3.5 h-3.5" />
                    </div>
                  </button>
                ))}
              </div>

              {/* Quick Chips Section */}
              <div className="space-y-2 pt-2 border-t border-brand-neutral">
                <label className="text-[9px] font-black tracking-widest text-brand-charcoal/40 uppercase block">
                  Quick Actions & Inquiries
                </label>
                <div className="flex flex-col space-y-1.5">
                  {quickChips.map((chip, idx) => (
                    <button
                      key={idx}
                      id={`whatsapp-chip-${idx}`}
                      onClick={() => handleContactClick(chip.targetPhone, chip.message)}
                      className="w-full py-2 px-3 rounded-xl border border-[#F5B800]/25 bg-[#F5B800]/5 hover:bg-[#F5B800]/10 text-left text-[11px] font-bold text-brand-coffee flex items-center justify-between transition-colors cursor-pointer group"
                    >
                      <span className="truncate pr-4">{chip.text}</span>
                      <ExternalLink className="w-3 h-3 text-[#F5B800] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="bg-brand-neutral px-5 py-3 border-t border-brand-neutral flex items-center justify-center space-x-1.5 text-[9px] text-brand-charcoal/40 font-bold uppercase tracking-wider select-none">
              <ShieldCheck className="w-3.5 h-3.5 text-[#F5B800]" />
              <span>Official Swati Gruh Udhyog Support</span>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        id="whatsapp-widget-toggle"
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full flex items-center justify-center shadow-xl shadow-green-500/25 relative focus:outline-none transition-all duration-300 hover:scale-105 cursor-pointer"
        whileTap={{ scale: 0.95 }}
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25 scale-105 pointer-events-none" />
        
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-6 h-6 stroke-[2.5]" />
            </motion.div>
          ) : (
            <motion.div
              key="message"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle className="w-6.5 h-6.5 fill-current" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

    </div>
  );
}
