"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Sidebar from "../dashboard/Sidebar";
import Navbar from "../dashboard/Navbar";
import BottomNav from "../dashboard/BottomNav";
import Footer from "../landing/Footer";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          const token = await currentUser.getIdToken();
          const res = await fetch("/api/auth/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          });
          const data = await res.json();
          if (data.success && data.user) {
            const status = data.user.builderApplicationStatus;
            if (status === "draft" || status === "rejected") {
              router.push("/builder-register");
              return; // Keep loading true during redirection
            } else if (status === "pending") {
              router.push("/builder-application-status");
              return; // Keep loading true during redirection
            } else if (status === "approved") {
              router.push("/builder-dashboard");
              return; // Keep loading true during redirection
            }
          }
        }
      } catch (e) {
        console.error("Error verifying in DashboardLayout:", e);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-brand-amber/20 border-t-brand-amber animate-spin" />
          <p className="text-sm font-semibold text-brand-navy/60 animate-pulse">Securing session...</p>
        </div>
      </div>
    );
  }

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

