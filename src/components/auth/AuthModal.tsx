"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User as UserIcon, MessageSquare, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthTab = "signin" | "signup";

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [tab, setTab] = useState<AuthTab>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { loginWithEmail, signupWithEmail, loginWithGoogle } = useAuth();

  const handleSupabaseError = (err: unknown) => {
    console.error("Auth error:", err);
    const message = (err as { message?: string })?.message || "";
    
    if (message.toLowerCase().includes("invalid login credentials")) {
      return "Invalid email address or password. Please try again.";
    }
    if (message.toLowerCase().includes("user already registered")) {
      return "An account with this email already exists.";
    }
    if (message.toLowerCase().includes("password should be at least 6 characters")) {
      return "Password is too weak. Please use at least 6 characters.";
    }
    if (message.toLowerCase().includes("valid email")) {
      return "Please enter a valid email address.";
    }
    
    return message || "An unexpected error occurred. Please try again later.";
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (tab === "signin") {
        await loginWithEmail(email, password);
      } else {
        await signupWithEmail(email, password, name);
      }
      onClose();
      resetForm();
    } catch (err: unknown) {
      setError(handleSupabaseError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      onClose();
      resetForm();
    } catch (err: unknown) {
      setError(handleSupabaseError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setError("");
  };

  const handleTabChange = (newTab: AuthTab) => {
    setTab(newTab);
    setError("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-brand-charcoal/60 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-brand-white border border-brand-neutral/80 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col relative"
              id="auth-modal-card"
            >
              {/* Close Button */}
              <button
                id="auth-modal-close-btn"
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 text-brand-charcoal/40 hover:text-brand-charcoal hover:bg-brand-neutral rounded-lg transition-colors cursor-pointer z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Top Banner Accent */}
              <div className="h-2 bg-[#F5B800] w-full" />

              <div className="p-6 sm:p-8 space-y-6">
                
                {/* Header */}
                <div className="text-center space-y-1">
                  <span className="text-[10px] font-black tracking-widest text-[#F5B800] uppercase font-heading block">
                    COSTRA Coffee
                  </span>
                  <h3 className="text-xl font-extrabold text-brand-charcoal">
                    {tab === "signin" ? "Welcome Back" : "Join the Coffee Club"}
                  </h3>
                </div>

                {/* Tab Toggles */}
                <div className="flex bg-brand-neutral p-1 rounded-xl border border-brand-coffee/5">
                  <button
                    id="auth-tab-signin"
                    type="button"
                    onClick={() => handleTabChange("signin")}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      tab === "signin"
                        ? "bg-brand-white text-brand-charcoal shadow-sm"
                        : "text-brand-charcoal/50 hover:text-brand-charcoal"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    id="auth-tab-signup"
                    type="button"
                    onClick={() => handleTabChange("signup")}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      tab === "signup"
                        ? "bg-brand-white text-brand-charcoal shadow-sm"
                        : "text-brand-charcoal/50 hover:text-brand-charcoal"
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                {/* Error Box */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-bold flex items-start space-x-2"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}

                {/* Google Sign In */}
                <button
                  id="auth-google-btn"
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isSubmitting}
                  className="w-full py-3 border border-brand-coffee/15 rounded-xl flex items-center justify-center space-x-2.5 bg-brand-white hover:bg-brand-neutral text-xs font-bold text-brand-charcoal shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.9h6.69c-.29 1.5-.1.1.92-1.01 1.01-1.01v2.54h3.04c1.77-1.63 2.8-4.04 2.8-7.38z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.88-3.01c-1.08.72-2.45 1.16-4.08 1.16-3.13 0-5.78-2.11-6.73-4.96H1.21v3.15C3.18 21.88 7.31 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.27 14.28A7.2 7.2 0 0 1 4.8 12c0-.8.14-1.57.38-2.28V6.57H1.21A11.9 11.9 0 0 0 0 12c0 2.01.5 3.91 1.21 5.43l4.06-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.18 2.12 1.21 5.57l4.06 3.15c.95-2.85 3.6-4.97 6.73-4.97z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-x-0 h-[1px] bg-brand-neutral" />
                  <span className="relative z-10 px-3 bg-brand-white text-[10px] font-bold text-brand-charcoal/40 uppercase tracking-widest">
                    Or use email
                  </span>
                </div>

                {/* Email / Password Forms */}
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {/* Name field (signup only) */}
                  {tab === "signup" && (
                    <div className="space-y-1.5">
                      <label htmlFor="auth-name-input" className="text-[10px] font-bold text-brand-charcoal/50 uppercase tracking-widest block">
                        Full Name
                      </label>
                      <div className="relative">
                        <UserIcon className="w-4 h-4 text-brand-coffee/40 absolute left-3.5 inset-y-0 my-auto" />
                        <input
                          id="auth-name-input"
                          type="text"
                          required
                          placeholder="Your Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-brand-white border border-brand-coffee/15 focus:border-[#F5B800] px-4 py-2.5 pl-9 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#F5B800] font-semibold"
                        />
                      </div>
                    </div>
                  )}

                  {/* Email Field */}
                  <div className="space-y-1.5">
                    <label htmlFor="auth-email-input" className="text-[10px] font-bold text-brand-charcoal/50 uppercase tracking-widest block">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-brand-coffee/40 absolute left-3.5 inset-y-0 my-auto" />
                      <input
                        id="auth-email-input"
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-brand-white border border-brand-coffee/15 focus:border-[#F5B800] px-4 py-2.5 pl-9 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#F5B800] font-semibold"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-1.5">
                    <label htmlFor="auth-password-input" className="text-[10px] font-bold text-brand-charcoal/50 uppercase tracking-widest block">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-brand-coffee/40 absolute left-3.5 inset-y-0 my-auto" />
                      <input
                        id="auth-password-input"
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-brand-white border border-brand-coffee/15 focus:border-[#F5B800] px-4 py-2.5 pl-9 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#F5B800] font-semibold"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    id="auth-submit-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-[#F5B800] hover:bg-[#EAA000] text-brand-charcoal font-bold text-xs tracking-wider uppercase rounded-xl shadow-lg shadow-brand-yellow/10 transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="w-4 h-4 border-2 border-brand-charcoal border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span>{tab === "signin" ? "Sign In" : "Create Account"}</span>
                    )}
                  </button>

                </form>

                {/* Footer Care Badge */}
                <div className="flex items-start space-x-2 pt-4 border-t border-brand-neutral text-[11px] text-brand-charcoal/60 leading-relaxed font-semibold">
                  <MessageSquare className="w-4 h-4 text-brand-yellow shrink-0 mt-0.5" />
                  <span>
                    Need help logging in? WhatsApp us at{" "}
                    <a
                      href="https://wa.me/918360322894"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-charcoal font-bold hover:underline"
                    >
                      +91 8360322894
                    </a>
                    {" or "}
                    <a
                      href="https://wa.me/918734082232"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-charcoal font-bold hover:underline"
                    >
                      +91 8734082232
                    </a>
                  </span>
                </div>

              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
