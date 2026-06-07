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
          <Building2 className="text-brand-blue" size={28} /> Developer Directory
        </h1>
        <p className="text-xs sm:text-sm text-brand-slate m-0">
          Search and track developer project volumes, construction delivery ratios, and geographical presence.
        </p>
      </div>

      {/* 2. Search and Filter Bar */}
      <div className="bg-brand-bg-card p-4 sm:p-5 rounded-3xl border border-brand-border shadow-brand mb-8 flex flex-col gap-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-slate-light" size={18} />
          <input
            id="builder-search"
            type="text"
            placeholder="Search builder or developer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input pl-10 pr-4 py-3 text-xs sm:text-sm"
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
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedCity === "All"
                  ? "btn-primary"
                  : "btn-secondary"
              }`}
            >
              All Cities
            </button>
            {uniqueCities.map((city) => (
              <button
                key={city}
                id={`city-filter-${city.toLowerCase()}`}
                onClick={() => setSelectedCity(city)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedCity === city
                    ? "btn-primary"
                    : "btn-secondary"
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
            className="text-brand-blue hover:underline bg-transparent border-none cursor-pointer p-0"
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
              className="card-frame p-6 flex flex-col justify-between group"
            >
              <div>
                {/* Developer Name */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-brand-bg-alt border border-brand-border flex items-center justify-center text-brand-slate group-hover:text-brand-blue transition-colors">
                      <Building2 size={20} />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-extrabold text-brand-navy m-0 leading-tight">
                        {builder.builderName}
                      </h2>
                      <p className="text-[10px] text-brand-slate font-semibold uppercase tracking-wider m-0 mt-0.5 flex items-center gap-1">
                        <MapPin size={10} className="text-brand-slate-light" />
                        {builder.cities.join(", ")}
                      </p>
                    </div>
                  </div>
                  
                  {/* Total Count Badge */}
                  <div className="bg-brand-blue-bg text-brand-blue-dark border border-brand-blue-border px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                    {builder.totalProjects} {builder.totalProjects === 1 ? "Project" : "Projects"}
                  </div>
                </div>

                {/* KPI Breakdown */}
                <div className="grid grid-cols-3 gap-2.5 mb-5 py-3.5 border-y border-brand-border/60">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-brand-slate uppercase font-bold tracking-wider mb-0.5 flex items-center gap-1">
                      <Layers size={10} className="text-brand-slate-light" /> Total
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
                className="btn-secondary w-full py-2.5 text-xs"
              >
                View Profile & Listings <ChevronRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-brand-bg-card rounded-3xl border border-brand-border p-12 text-center shadow-brand">
          <Building2 className="mx-auto text-brand-slate-light mb-4" size={48} />
          <h3 className="text-base font-extrabold text-brand-navy mb-1">No Developers Found</h3>
          <p className="text-xs text-brand-slate max-w-sm mx-auto mb-6">
            We couldn't find any developer matching "{searchQuery}" in {selectedCity === "All" ? "any city" : selectedCity}.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCity("All");
            }}
            className="px-5 py-2.5 bg-linear-to-r from-brand-navy-deep to-brand-navy-mid hover:from-[#121b2d] hover:to-brand-navy-deep border border-white/5 text-white rounded-xl text-xs font-bold cursor-pointer transition-all duration-200"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
