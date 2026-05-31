"use client";

import React from "react";
import { SearchX } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-5 bg-brand-bgCard rounded-2xl border border-dashed border-brand-borderMid text-center mt-5">
      <div className="w-16 h-16 rounded-2xl bg-brand-bgAlt flex items-center justify-center mb-4">
        <SearchX size={32} className="text-brand-slate" />
      </div>
      <h3 className="text-xl font-bold text-brand-navy mb-2">
        No properties found
      </h3>
      <p className="text-sm text-brand-slate max-w-[400px] leading-relaxed mb-6">
        We couldn't find any properties matching your exact criteria. Try adjusting your filters or budget to see more results.
      </p>
      <button
        className="px-5 py-2.5 rounded-lg bg-brand-navy text-white border-none text-sm font-semibold cursor-pointer transition-opacity duration-200 hover:opacity-90"
        onClick={() => {
          if (typeof window !== "undefined") {
            sessionStorage.removeItem("watchlistFilters");
            window.location.reload();
          }
        }}
      >
        Clear Filters
      </button>
    </div>
  );
}
