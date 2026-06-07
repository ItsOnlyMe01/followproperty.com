"use client";

import React from "react";
import { 
  LayoutDashboard, 
  Building2, 
  Search, 
  PlusCircle
} from "lucide-react";

/**
 * Mobile-only bottom navigation bar for the Builder Hub/Dashboard.
 * Mimics the user dashboard's bottom navigation bar layout and design.
 */
export default function BuilderBottomNav({ activeTab, onTabChange }) {
  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "profile", label: "Profile", icon: Building2 },
    { id: "projects", label: "Projects", icon: Search },
    { id: "add-project", label: "Add Project", icon: PlusCircle },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[64px] bg-brand-bg-card border-t border-brand-border z-40 flex items-center justify-around md:hidden px-2 shadow-[0_-4px_16px_rgba(0,0,0,0.03)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center justify-center flex-1 h-full bg-transparent border-none cursor-pointer outline-none transition-all ${
              isActive ? "text-brand-blue" : "text-brand-slate"
            }`}
          >
            <div className={`p-1 rounded-lg transition-colors ${isActive ? "text-brand-blue" : "text-brand-slate"}`}>
              <Icon size={19} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className="text-[10px] font-extrabold tracking-wide mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
