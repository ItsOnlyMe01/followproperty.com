"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

export default function ProjectsFilterClient({
  cities = [],
  builders = [],
  propertyTypes = [],
  statuses = [],
  currentFilters = {}
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Handle filter changes by updating the URL query parameters
  const handleFilterChange = (key, value) => {
    const params = new URLSearchParams(searchParams);
    
    if (value && value !== "All") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    // Always reset to page 1 on filter changes
    params.set("page", "1");
    
    router.push(`/projects?${params.toString()}`);
  };

  // Check if any filter is currently active
  const hasActiveFilters = Object.values(currentFilters).some(
    (val) => val && val !== "All"
  );

  const handleReset = () => {
    router.push("/projects");
  };

  return (
    <div className="bg-brand-bgCard p-5 rounded-3xl border border-brand-border shadow-brand mb-6">
      {/* Title */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-brand-border">
        <h2 className="text-sm font-extrabold text-brand-navy m-0 flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-brand-teal" /> Filter Properties
        </h2>
        
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-red bg-brand-redBg border border-brand-redBorder hover:opacity-85 px-2.5 py-1 rounded-lg cursor-pointer transition-opacity"
          >
            <RotateCcw size={10} /> Reset Filters
          </button>
        )}
      </div>

      {/* Grid of Dropdowns */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* City Filter */}
        <div className="flex flex-col">
          <label htmlFor="city-select" className="text-[10px] text-brand-slate font-bold uppercase tracking-wider mb-1">
            City
          </label>
          <select
            id="city-select"
            value={currentFilters.city || "All"}
            onChange={(e) => handleFilterChange("city", e.target.value)}
            className="bg-brand-bgAlt border border-brand-border rounded-xl px-3 py-2.5 text-xs text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all"
          >
            <option value="All">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Builder Filter */}
        <div className="flex flex-col">
          <label htmlFor="builder-select" className="text-[10px] text-brand-slate font-bold uppercase tracking-wider mb-1">
            Developer
          </label>
          <select
            id="builder-select"
            value={currentFilters.builder || "All"}
            onChange={(e) => handleFilterChange("builder", e.target.value)}
            className="bg-brand-bgAlt border border-brand-border rounded-xl px-3 py-2.5 text-xs text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all max-w-full"
          >
            <option value="All">All Developers</option>
            {builders.map((builder) => (
              <option key={builder} value={builder}>
                {builder}
              </option>
            ))}
          </select>
        </div>

        {/* Property Type Filter */}
        <div className="flex flex-col">
          <label htmlFor="propertyType-select" className="text-[10px] text-brand-slate font-bold uppercase tracking-wider mb-1">
            Property Type
          </label>
          <select
            id="propertyType-select"
            value={currentFilters.propertyType || "All"}
            onChange={(e) => handleFilterChange("propertyType", e.target.value)}
            className="bg-brand-bgAlt border border-brand-border rounded-xl px-3 py-2.5 text-xs text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all"
          >
            <option value="All">All Types</option>
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex flex-col">
          <label htmlFor="status-select" className="text-[10px] text-brand-slate font-bold uppercase tracking-wider mb-1">
            Construction Status
          </label>
          <select
            id="status-select"
            value={currentFilters.status || "All"}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="bg-brand-bgAlt border border-brand-border rounded-xl px-3 py-2.5 text-xs text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all"
          >
            <option value="All">All Statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
