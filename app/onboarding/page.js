"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Building2, Search, Sparkles } from "lucide-react";

export default function Onboarding() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
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
            const status = data.user.builderApplicationStatus;
            if (status === "draft" || status === "rejected") {
              router.push("/builder-register");
            } else if (status === "pending") {
              router.push("/builder-application-status");
            } else if (status === "approved") {
              router.push("/builder-dashboard");
            }
          }
        } catch (e) {
          console.error("Error verifying in Onboarding page:", e);
        }
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSelection = async (option) => {
    try {
      setLoading(true);
      
      // Update onboarding status on server
      const res = await fetch("/api/auth/onboard", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        }
      });
      
      if (!res.ok) {
        throw new Error("Failed to complete onboarding on server");
      }
      
      // Redirect based on selected path
      if (option === "track") {
        router.push("/portfolio");
      } else {
        router.push("/watchlist");
      }
    } catch (err) {
      console.error("Onboarding selection error:", err);
      // Fallback redirection in case API has issues
      if (option === "track") {
        router.push("/portfolio");
      } else {
        router.push("/watchlist");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col justify-center items-center p-4 sm:p-8 font-sans antialiased">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-brand-teal/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-brand-amber/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-[680px] text-center relative z-10">
        
        {/* Logo / Header */}
        <div className="flex items-center justify-center gap-2.5 no-underline mb-6">
          <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-brand-amberLight to-[#EA580C] flex items-center justify-center shadow-[0_2px_12px_rgba(217,119,6,0.30)]">
            <Building2 size={18} color="#fff" strokeWidth={2.5} />
          </div>
          <span className="font-extrabold text-[22px] text-brand-navy tracking-[-0.03em]">
            FollowProperty
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy mb-3 tracking-tight">
          How would you like to start?
        </h1>
        <p className="text-sm sm:text-base text-brand-slate max-w-[480px] mx-auto mb-10 leading-relaxed">
          Tell us your primary real estate goal to customize your dashboard with personalized analytics, rates, and alerts.
        </p>

        {/* Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
          
          {/* Card 1: Track My Properties */}
          <div 
            onClick={() => !loading && handleSelection("track")}
            className="group relative bg-brand-bgCard rounded-2xl border border-brand-border p-6 shadow-brand hover:-translate-y-1 hover:shadow-brand-md transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[220px]"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-brand-amberBg border border-brand-amberBorder flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-105">
                <Building2 className="text-brand-amber" size={24} />
              </div>
              <h3 className="text-lg font-bold text-brand-navy mb-2 flex items-center gap-1.5">
                Track My Properties
              </h3>
              <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">
                Add your owned real assets to track capital gains, market valuations, ongoing loans, and monthly rental yields.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs font-bold text-brand-amber group-hover:opacity-80 transition-opacity">
              <span>Get Started →</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-brand-amberBg text-brand-amber rounded-md border border-brand-amberBorder">Portfolio</span>
            </div>
          </div>

          {/* Card 2: Looking To Buy */}
          <div 
            onClick={() => !loading && handleSelection("buy")}
            className="group relative bg-brand-bgCard rounded-2xl border border-brand-border p-6 shadow-brand hover:-translate-y-1 hover:shadow-brand-md transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[220px]"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-brand-tealBg border border-brand-tealBorder flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-105">
                <Search className="text-brand-tealDark" size={24} />
              </div>
              <h3 className="text-lg font-bold text-brand-navy mb-2">
                Looking To Buy
              </h3>
              <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">
                Set up watchlists for target builder projects, track prices, assess locality risks, and compare eligible bank LAP limits.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs font-bold text-brand-tealDark group-hover:opacity-80 transition-opacity">
              <span>Explore Matches →</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-brand-tealBg text-brand-tealDark rounded-md border border-brand-tealBorder">Watchlist</span>
            </div>
          </div>

        </div>

        {/* Informational Footer */}
        <p className="text-[11px] text-brand-slateLight mt-12 flex items-center justify-center gap-1.5 font-medium">
          <Sparkles size={13} className="text-brand-amber" />
          Don't worry — you can track properties and create buying watchlists later from your dashboard.
        </p>
        
      </div>
    </div>
  );
}
