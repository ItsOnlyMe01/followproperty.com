"use client";

import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Building2, 
  Search, 
  PlusCircle, 
  X, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "profile", label: "My Builder Profile", icon: Building2 },
  { id: "projects", label: "My Projects", icon: Search },
  { id: "add-project", label: "Add Project", icon: PlusCircle },
];

export default function BuilderSidebar({ isOpen, onClose, activeTab, onTabChange }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("builder_sidebar_collapsed");
      if (stored === "true") {
        setIsCollapsed(true);
      }
    } catch (err) {
      console.error("Failed to read builder_sidebar_collapsed:", err);
    }

    const timer = setTimeout(() => {
      setIsTransitionEnabled(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const toggleCollapse = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    try {
      localStorage.setItem("builder_sidebar_collapsed", String(nextState));
    } catch (err) {
      console.error("Failed to save builder_sidebar_collapsed:", err);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 md:hidden backdrop-blur-sm transition-opacity bg-brand-navy/40"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`fixed md:sticky top-0 left-0 h-screen flex flex-col z-50 md:translate-x-0 bg-brand-bgCard border-r border-brand-border ${
          isTransitionEnabled ? "transition-all duration-300 ease-in-out" : ""
        } ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${
          isCollapsed 
            ? "w-[76px] md:w-[76px] p-2 md:p-3" 
            : "w-[260px] md:w-[260px] p-4 md:p-6"
        }`}
      >
        {/* Mobile Close Button */}
        <div className="flex justify-end md:hidden mb-4">
          <button 
            onClick={onClose}
            className="p-1.5 bg-transparent border-none cursor-pointer text-brand-slate hover:bg-brand-bgAlt rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <div className={`flex-1 ${isOpen ? "mt-0" : "mt-3"}`}>
          {isCollapsed ? (
            <div className="flex flex-col items-center mb-4">
              <button 
                onClick={toggleCollapse}
                className="hidden md:flex items-center justify-center p-1.5 bg-transparent border-none cursor-pointer text-brand-slate hover:bg-brand-bgAlt rounded-lg transition-colors"
                title="Expand Menu"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between mb-4 pl-3">
              <p className="text-[11px] font-bold text-brand-slateLight tracking-[0.08em] uppercase m-0">
                Builder Workspace
              </p>
              <button 
                onClick={toggleCollapse}
                className="hidden md:flex items-center justify-center p-1.5 bg-transparent border-none cursor-pointer text-brand-slate hover:bg-brand-bgAlt rounded-lg transition-colors"
                title="Collapse Menu"
              >
                <ChevronLeft size={16} />
              </button>
            </div>
          )}

          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    if (window.innerWidth < 768) {
                      onClose();
                    }
                  }}
                  title={isCollapsed ? item.label : ""}
                  className={`flex items-center rounded-[10px] border-none text-left cursor-pointer transition-all duration-200 ${
                    isCollapsed 
                      ? "justify-center px-0 py-2.5 w-full" 
                      : "gap-3 px-3 py-2.5 w-full"
                  } ${
                    isActive 
                      ? "bg-brand-tealBg text-brand-tealDark font-semibold" 
                      : "bg-transparent text-brand-navyMid font-medium hover:bg-brand-bgAlt"
                  }`}
                >
                  <Icon size={18} className={isActive ? "text-brand-teal" : "text-brand-slate"} />
                  {!isCollapsed && <span className="text-sm">{item.label}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
