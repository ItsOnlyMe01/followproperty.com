"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Building2, LogOut, ChevronDown } from "lucide-react";
import { logoutUser } from "@/services/auth-service";

export default function BuilderNavbar({ onMenuClick, builderName }) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      setDropdownOpen(false);
      const res = await logoutUser();
      if (res.success) {
        router.push("/login");
      } else {
        console.error("Logout failed:", res.message);
      }
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  const initials = builderName
    ? builderName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "B";

  return (
    <header className="flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 h-[72px] border-b bg-brand-bgCard border-brand-border">
      {/* Left side: Hamburger and Logo */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger menu */}
        <button
          onClick={onMenuClick}
          className="hidden flex items-center justify-center p-2 rounded-lg bg-transparent hover:bg-brand-bgAlt border-none cursor-pointer text-brand-slate"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-8 h-8 rounded-[9px] bg-gradient-to-br from-brand-teal to-brand-tealDark flex items-center justify-center shadow-[0_2px_10px_rgba(13,148,136,0.30)]">
            <Building2 size={15} color="#fff" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <span className="font-bold text-[17px] text-brand-navy tracking-[-0.025em] block">
              FollowProperty
            </span>
            <span className="text-[10px] font-extrabold text-brand-teal bg-brand-tealBg px-2 py-0.5 rounded border border-brand-tealBorder tracking-wide uppercase self-start">
              Builder Hub
            </span>
          </div>
        </Link>
      </div>

      {/* Right side: Builder Info */}
      <div className="flex items-center gap-3 md:gap-5">
        {/* Profile with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 md:gap-3 cursor-pointer bg-transparent border-none p-0 outline-none text-left"
          >
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full text-white flex items-center justify-center font-bold text-[13px] md:text-[14px] bg-brand-teal select-none shadow-[0_2px_8px_rgba(13,148,136,0.20)]">
              {initials}
            </div>
            <div className="hidden md:flex flex-col">
              <span className="text-[13px] font-semibold text-brand-navy max-w-[150px] truncate flex items-center gap-1">
                {builderName || "Developer Partner"} <ChevronDown size={12} className="text-brand-slateLight" />
              </span>
            </div>
          </button>

          {dropdownOpen && (
            <>
              {/* Invisible overlay backplane */}
              <div 
                className="fixed inset-0 z-20 bg-transparent cursor-default" 
                onClick={() => setDropdownOpen(false)}
              />
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2.5 w-44 rounded-xl border bg-brand-bgCard border-brand-border shadow-brand-md p-1.5 z-30 flex flex-col gap-0.5">
                <div className="px-3 py-2 text-[10px] font-bold text-brand-slateLight uppercase tracking-wider border-b border-brand-border/60 mb-1">
                  Manage Account
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-lg text-[13px] font-semibold text-brand-red bg-transparent hover:bg-brand-redBg border-none cursor-pointer transition-colors duration-150"
                >
                  <LogOut size={15} />
                  <span>Log Out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

