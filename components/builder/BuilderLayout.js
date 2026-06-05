"use client";

import React, { useState } from "react";
import BuilderSidebar from "./BuilderSidebar";
import BuilderNavbar from "./BuilderNavbar";
import BuilderBottomNav from "./BuilderBottomNav";
import Footer from "@/components/landing/Footer";

export default function BuilderLayout({ children, activeTab, onTabChange, builderName }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-brand-bg">
      <BuilderSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <BuilderNavbar
          onMenuClick={() => setSidebarOpen(true)}
          builderName={builderName}
        />
        <main className="flex-1 overflow-y-auto flex flex-col justify-between">
          <div className="flex-1 p-4 md:p-8 pb-10">
            {children}
          </div>
          <div className="mt-20 md:mt-28 pb-16 md:pb-0">
            <Footer />
          </div>
        </main>
      </div>
      <BuilderBottomNav activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
}

