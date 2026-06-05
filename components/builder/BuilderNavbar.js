"use client";

import React from "react";
import Link from "next/link";
import { Menu, Building2, ExternalLink } from "lucide-react";

export default function BuilderNavbar({ onMenuClick, builderName }) {
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
          className="md:hidden flex items-center justify-center p-2 rounded-lg bg-transparent hover:bg-brand-bgAlt border-none cursor-pointer text-brand-slate"
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

      {/* Right side: Builder Info & Main App Link */}
      <div className="flex items-center gap-3 md:gap-5">
        <Link
          href="/dashboard"
          className="hidden sm:flex items-center gap-1 text-[13px] font-semibold text-brand-slate hover:text-brand-navy no-underline transition-colors"
        >
          <span>Go to Main App</span>
          <ExternalLink size={14} />
        </Link>

        {/* Divider */}
        <div className="hidden sm:block w-[1px] h-6 bg-brand-border" />

        {/* Profile Circle */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-full text-white flex items-center justify-center font-bold text-[13px] md:text-[14px] bg-brand-teal select-none shadow-[0_2px_8px_rgba(13,148,136,0.20)]">
            {initials}
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-[13px] font-semibold text-brand-navy max-w-[150px] truncate">
              {builderName || "Developer Partner"}
            </span>
            <span className="text-[10px] text-brand-slateLight font-medium">
              Dashboard V1
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
