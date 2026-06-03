"use client";

import React, { useState } from "react";
import Sidebar from "../dashboard/Sidebar";
import Navbar from "../dashboard/Navbar";
import BottomNav from "../dashboard/BottomNav";
import Footer from "../landing/Footer";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-brand-bg">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto flex flex-col justify-between">
          <div className="flex-1 p-4 md:p-8 pb-10">
            {children}
          </div>
          <div className="mt-24 md:mt-32 pb-16 md:pb-0">
            <Footer />
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}

