"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Building2, MapPin, CheckCircle2, ChevronRight, X, Layers, Clock } from "lucide-react";

export default function BuildersDirectoryClient({ initialBuilders = [], uniqueCities = [] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");

  // Filter builders based on search input and selected city pill
  const filteredBuilders = useMemo(() => {
    return initialBuilders.filter((builder) => {
      const matchesSearch = builder.builderName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      
      const matchesCity =
        selectedCity === "All" ||
        builder.cities.some((city) => city.toLowerCase() === selectedCity.toLowerCase());

      return matchesSearch && matchesCity;
    });
  }, [initialBuilders, searchQuery, selectedCity]);

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* 1. Header & Intro */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-brand-navy mb-1.5 tracking-tight flex items-center gap-2.5">
          <Building2 className="text-brand-teal" size={28} /> Developer Directory
        </h1>
        <p className="text-xs sm:text-sm text-brand-slate m-0">
          Search and track developer project volumes, construction delivery ratios, and geographical presence.
        </p>
      </div>

      {/* 2. Search and Filter Bar */}
      <div className="bg-brand-bgCard p-4 sm:p-5 rounded-3xl border border-brand-border shadow-brand mb-8 flex flex-col gap-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-slateLight" size={18} />
          <input
            id="builder-search"
            type="text"
            placeholder="Search builder or developer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-brand-bgAlt border border-brand-border rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all placeholder:text-brand-slateLight"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-slate hover:text-brand-navy bg-transparent border-none p-0 cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* City Filter Pills */}
        <div>
          <span className="block text-[10px] text-brand-slate uppercase font-bold tracking-wider mb-2">
            Filter by Location
          </span>
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              id="city-filter-all"
              onClick={() => setSelectedCity("All")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                selectedCity === "All"
                  ? "bg-brand-teal text-white border-brand-teal shadow-[0_2px_8px_rgba(13,148,136,0.2)]"
                  : "bg-brand-bgAlt text-brand-navyMid border-brand-border hover:bg-brand-borderMid"
              }`}
            >
              All Cities
            </button>
            {uniqueCities.map((city) => (
              <button
                key={city}
                id={`city-filter-${city.toLowerCase()}`}
                onClick={() => setSelectedCity(city)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                  selectedCity === city
                    ? "bg-brand-teal text-white border-brand-teal shadow-[0_2px_8px_rgba(13,148,136,0.2)]"
                    : "bg-brand-bgAlt text-brand-navyMid border-brand-border hover:bg-brand-borderMid"
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Results Section */}
      <div className="mb-4 flex items-center justify-between text-xs text-brand-slate font-bold">
        <span>Showing {filteredBuilders.length} developers</span>
        {(searchQuery || selectedCity !== "All") && (
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCity("All");
            }}
            className="text-brand-teal hover:underline bg-transparent border-none cursor-pointer p-0"
          >
            Clear active filters
          </button>
        )}
      </div>

      {filteredBuilders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBuilders.map((builder) => (
            <div
              key={builder.slug}
              className="bg-brand-bgCard rounded-3xl border border-brand-border p-6 shadow-brand flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-brand-md"
            >
              <div>
                {/* Developer Name */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-brand-bgAlt border border-brand-border flex items-center justify-center text-brand-teal">
                      <Building2 size={20} />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-extrabold text-brand-navy m-0 leading-tight">
                        {builder.builderName}
                      </h2>
                      <p className="text-[10px] text-brand-slate font-semibold uppercase tracking-wider m-0 mt-0.5 flex items-center gap-1">
                        <MapPin size={10} className="text-brand-teal" />
                        {builder.cities.join(", ")}
                      </p>
                    </div>
                  </div>
                  
                  {/* Total Count Badge */}
                  <div className="bg-brand-tealBg text-brand-tealDark border border-brand-tealBorder px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                    {builder.totalProjects} {builder.totalProjects === 1 ? "Project" : "Projects"}
                  </div>
                </div>

                {/* KPI Breakdown */}
                <div className="grid grid-cols-3 gap-2.5 mb-5 py-3.5 border-y border-brand-border/60">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-brand-slate uppercase font-bold tracking-wider mb-0.5 flex items-center gap-1">
                      <Layers size={10} className="text-brand-slateLight" /> Total
                    </span>
                    <span className="text-sm font-extrabold text-brand-navy">
                      {builder.totalProjects}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[9px] text-brand-slate uppercase font-bold tracking-wider mb-0.5 flex items-center gap-1">
                      <CheckCircle2 size={10} className="text-brand-emerald" /> Delivered
                    </span>
                    <span className="text-sm font-extrabold text-brand-emerald">
                      {builder.deliveredProjects}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[9px] text-brand-slate uppercase font-bold tracking-wider mb-0.5 flex items-center gap-1">
                      <Clock size={10} className="text-brand-amber" /> Ongoing
                    </span>
                    <span className="text-sm font-extrabold text-brand-amber">
                      {builder.ongoingProjects}
                    </span>
                  </div>
                </div>
              </div>

              {/* View Profile CTA */}
              <Link
                id={`view-profile-${builder.slug}`}
                href={`/builders/${builder.slug}`}
                className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-brand-bgAlt hover:bg-brand-teal hover:text-white text-brand-tealDark border border-brand-tealBorder rounded-xl text-xs font-bold cursor-pointer transition-all duration-200 no-underline text-center"
              >
                View Profile & Listings <ChevronRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-brand-bgCard rounded-3xl border border-brand-border p-12 text-center shadow-brand">
          <Building2 className="mx-auto text-brand-slateLight mb-4" size={48} />
          <h3 className="text-base font-extrabold text-brand-navy mb-1">No Developers Found</h3>
          <p className="text-xs text-brand-slate max-w-sm mx-auto mb-6">
            We couldn't find any developer matching "{searchQuery}" in {selectedCity === "All" ? "any city" : selectedCity}.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCity("All");
            }}
            className="px-5 py-2.5 bg-brand-teal text-white rounded-xl text-xs font-bold cursor-pointer transition-all"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
