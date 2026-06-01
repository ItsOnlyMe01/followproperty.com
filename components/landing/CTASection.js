"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Menu, X } from "lucide-react";

export default function Nav({ authState }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-[0.4s] ease-in-out ${
        scrolled 
          ? "bg-[#FAFAF8]/94 backdrop-blur-[18px] border-b border-brand-border shadow-brand" 
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[9px] bg-gradient-to-br from-brand-amberLight to-[#EA580C] flex items-center justify-center shadow-[0_2px_10px_rgba(217,119,6,0.30)]">
            <Building2 size={15} color="#fff" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-[17px] text-brand-navy tracking-[-0.025em]">
            FollowProperty
          </span>
          <span className="hidden sm:inline-block text-[10px] text-brand-slateLight tracking-[0.14em] uppercase ml-1">
            Real Assets
          </span>
        </div>

        <div className="hidden md:flex gap-7">
          {["Features", "How It Works", "Pricing"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-[13px] text-brand-slate no-underline transition-colors duration-200 hover:text-brand-navy"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="hidden md:flex gap-2 items-center">
          {authState?.isAuthenticated ? (
            <Link href="/dashboard" className="text-[13px] font-semibold text-white bg-gradient-to-br from-brand-amberLight to-[#EA580C] border-none cursor-pointer py-[9px] px-5 rounded-[10px] shadow-[0_2px_12px_rgba(217,119,6,0.28)] transition-all duration-[0.22s] hover:-translate-y-[1px] hover:shadow-brand-amber no-underline flex items-center gap-1">
              Go to Dashboard &rarr;
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-[13px] font-medium text-brand-slate bg-transparent border-none cursor-pointer py-2 px-3.5 no-underline hover:text-brand-navy transition-colors">
                Login
              </Link>
              <Link href="/signup" className="text-[13px] font-semibold text-white bg-gradient-to-br from-brand-amberLight to-[#EA580C] border-none cursor-pointer py-[9px] px-5 rounded-[10px] shadow-[0_2px_12px_rgba(217,119,6,0.28)] transition-all duration-[0.22s] hover:-translate-y-[1px] hover:shadow-brand-amber no-underline flex items-center">
                Create Account
              </Link>
            </>
          )}
        </div>

        <button
          className="bg-transparent border-none cursor-pointer text-brand-slate md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-brand-bg border-b border-brand-border px-6 pb-5 md:hidden overflow-hidden"
          >
            {["Features", "How It Works", "Pricing"].map((item) => (
              <a
                key={item}
                href="#"
                className="block py-3 text-brand-slate text-sm border-b border-brand-border no-underline"
              >
                {item}
              </a>
            ))}
            {authState?.isAuthenticated ? (
              <Link href="/dashboard" className="w-full mt-4 bg-gradient-to-br from-brand-amberLight to-[#EA580C] text-white font-semibold p-3 rounded-[10px] border-none cursor-pointer block text-center no-underline">
                Go to Dashboard &rarr;
              </Link>
            ) : (
              <>
                <Link href="/signup" className="w-full mt-4 bg-gradient-to-br from-brand-amberLight to-[#EA580C] text-white font-semibold p-3 rounded-[10px] border-none cursor-pointer block text-center no-underline">
                  Get Started Free
                </Link>
                <Link href="/login" className="w-full mt-2 bg-transparent border border-brand-borderMid text-brand-navy font-semibold p-3 rounded-[10px] cursor-pointer block text-center no-underline">
                  Login
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
