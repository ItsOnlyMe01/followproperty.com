"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Building2, Clock, LogOut } from "lucide-react";
import { logoutUser } from "@/services/auth-service";

export default function BuilderApplicationStatusPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        try {
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
            // Only allow users with "pending" status on this page
            if (data.user.builderApplicationStatus !== "pending") {
              router.push("/dashboard");
            }
          }
        } catch (e) {
          console.error("Error verifying in builder-application-status:", e);
        } finally {
          setCheckingAuth(false);
        }
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logoutUser();
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <svg className="animate-spin h-8 w-8 text-brand-amber mx-auto" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-sm font-semibold text-brand-navy">Verifying status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col justify-between p-4 sm:p-8 font-sans antialiased relative">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-brand-amber/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-[#EA580C]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Header */}
      <header className="w-full max-w-[1200px] mx-auto flex justify-between items-center py-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[9px] bg-gradient-to-br from-brand-amberLight to-[#EA580C] flex items-center justify-center shadow-[0_2px_10px_rgba(217,119,6,0.30)]">
            <Building2 size={15} color="#fff" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-[17px] text-brand-navy tracking-[-0.025em]">
            FollowProperty
          </span>
        </div>
        <button
          onClick={handleLogout}
          disabled={loading}
          className="text-xs font-semibold text-brand-slate hover:text-brand-red bg-transparent border-none cursor-pointer flex items-center gap-1.5 transition-colors focus:outline-none"
        >
          <LogOut size={14} /> Log Out
        </button>
      </header>

      {/* Main Container */}
      <div className="flex-grow flex items-center justify-center py-12 relative z-10">
        <div className="w-full max-w-[540px] bg-brand-bgCard rounded-3xl border border-brand-border p-8 sm:p-10 shadow-brand text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-brand-amberBg border border-brand-amberBorder flex items-center justify-center mx-auto shadow-sm">
            <Clock size={28} className="text-brand-amber" />
          </div>

          <div className="space-y-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight leading-tight">
              Application Under Review
            </h1>
            <p className="text-sm text-brand-slate leading-relaxed">
              Your builder application is under review.
            </p>
          </div>

          <div className="bg-brand-bgAlt border border-brand-border rounded-xl p-4 text-[12px] text-brand-slate font-medium">
            Our admin team is currently reviewing your profile registration. We will notify you once approval is complete.
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-[1200px] mx-auto text-center py-4 text-[11px] text-brand-slateLight font-medium border-t border-brand-border/60 relative z-10">
        © 2026 FollowProperty. All rights reserved.
      </footer>
    </div>
  );
}
