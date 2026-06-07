"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Building2, MapPin, CheckCircle2, ChevronLeft, Layers, Clock, Filter } from "lucide-react";
import PropertyGrid from "@/components/dashboard/PropertyGrid";
import BackButton from "@/components/ui/BackButton";

export default function BuilderProfileClient({
  builderName,
  totalProjects,
  deliveredProjects,
  ongoingProjects,
  cities = [],
  projects = []
}) {
  const [activeTab, setActiveTab] = useState("all"); // "all" | "delivered" | "ongoing"
  const [selectedType, setSelectedType] = useState("All");

  // Get unique property types present in this builder's project list
  const uniquePropertyTypes = useMemo(() => {
    const types = new Set(projects.map((p) => p.specificType || p.propertyType).filter(Boolean));
    return ["All", ...Array.from(types).sort()];
  }, [projects]);

  // Filter projects by status tab and property type pill
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // 1. Status Filter
      const isDelivered =
        project.status === "Ready to Move" ||
        project.status === "Ready" ||
        project.status === "Completed";
      
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "delivered" && isDelivered) ||
        (activeTab === "ongoing" && !isDelivered);

      // 2. Property Type Filter
      const projectType = project.specificType || project.propertyType;
      const matchesType =
        selectedType === "All" ||
        (projectType && projectType.toLowerCase() === selectedType.toLowerCase());

      return matchesTab && matchesType;
    });
  }, [projects, activeTab, selectedType]);

  return (
    <div className="max-w-6xl mx-auto pb-16">
      {/* 1. Back Navigation & Breadcrumb */}
      <div className="mb-6">
        <BackButton />
      </div>

      {/* 2. Hero Profile Header */}
      <div className="relative overflow-hidden bg-linear-to-br from-brand-navy-deep via-brand-navy to-brand-navy-mid p-6 sm:p-8 rounded-3xl border border-brand-border text-white shadow-brand-lg mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-in fade-in duration-200">
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ 
               backgroundImage: "radial-gradient(var(--color-brand-border) 1.2px, transparent 1.2px)", 
               backgroundSize: "24px 24px" 
             }} 
        />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center">
            <Building2 size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight m-0 leading-tight">
              {builderName}
            </h1>
            <p className="text-xs text-brand-slate-light m-0 mt-1.5 flex items-center gap-1.5 font-semibold">
              <MapPin size={14} className="text-brand-slate-light" />
              Active in: <span className="text-white font-extrabold">{cities.join(", ")}</span>
            </p>
          </div>
        </div>

        {/* 3-Column Mobile KPI Strip */}
        <div className="w-full md:w-auto grid grid-cols-3 gap-3 md:flex md:items-center bg-black/20 p-2.5 rounded-2xl border border-white/5">
          <div className="flex flex-col items-center px-3 py-1.5 md:border-r border-white/10 text-center">
            <span className="text-[9px] text-brand-slate-light uppercase font-bold tracking-wider mb-0.5">Projects</span>
            <span className="text-base font-extrabold">{totalProjects}</span>
          </div>
          <div className="flex flex-col items-center px-3 py-1.5 md:border-r border-white/10 text-center">
            <span className="text-[9px] text-brand-emerald-bg uppercase font-bold tracking-wider mb-0.5">Delivered</span>
            <span className="text-base font-extrabold text-brand-emerald">{deliveredProjects}</span>
          </div>
          <div className="flex flex-col items-center px-3 py-1.5 text-center">
            <span className="text-[9px] text-brand-amber-bg uppercase font-bold tracking-wider mb-0.5">Ongoing</span>
            <span className="text-base font-extrabold text-brand-amber-light">{ongoingProjects}</span>
          </div>
        </div>
      </div>

      {/* 3. Filter Controls Block */}
      <div className="bg-brand-bg-card p-4 rounded-2xl border border-brand-border shadow-brand mb-8 flex flex-col gap-4">
        {/* Segmented Status Tabs (Mobile Touch-Friendly) */}
        <div className="grid grid-cols-3 bg-brand-bg-alt p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("all")}
            className={`py-2 text-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === "all"
                ? "bg-brand-bg-card text-brand-blue shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                : "text-brand-slate hover:text-brand-navy"
            }`}
          >
            All Projects ({totalProjects})
          </button>
          <button
            onClick={() => setActiveTab("delivered")}
            className={`py-2 text-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === "delivered"
                ? "bg-brand-bg-card text-brand-blue shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                : "text-brand-slate hover:text-brand-navy"
            }`}
          >
            Delivered ({deliveredProjects})
          </button>
          <button
            onClick={() => setActiveTab("ongoing")}
            className={`py-2 text-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === "ongoing"
                ? "bg-brand-bg-card text-brand-blue shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                : "text-brand-slate hover:text-brand-navy"
            }`}
          >
            Ongoing ({ongoingProjects})
          </button>
        </div>

        {/* Dynamic Property Type Filter (Horizontal Scroll) */}
        {uniquePropertyTypes.length > 2 && (
          <div>
            <span className="block text-[9px] text-brand-slate uppercase font-bold tracking-wider mb-2 flex items-center gap-1">
              <Filter size={10} /> Filter by Configuration
            </span>
            <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {uniquePropertyTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedType === type
                      ? "badge-blue normal-case py-1.5"
                      : "btn-secondary py-1.5"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. Project Listings Grid */}
      <div>
        <div className="mb-4 text-xs text-brand-slate font-bold flex justify-between">
          <span>Found {filteredProjects.length} projects</span>
          {selectedType !== "All" && (
            <button
              onClick={() => setSelectedType("All")}
              className="text-brand-blue hover:underline bg-transparent border-none cursor-pointer p-0"
            >
              Show all configurations
            </button>
          )}
        </div>

        {filteredProjects.length > 0 ? (
          <PropertyGrid properties={filteredProjects} />
        ) : (
          <div className="bg-brand-bg-card rounded-3xl border border-brand-border p-12 text-center shadow-brand">
            <Building2 className="mx-auto text-brand-slate-light mb-4" size={40} />
            <h3 className="text-base font-extrabold text-brand-navy mb-1">No Matching Projects</h3>
            <p className="text-xs text-brand-slate max-w-xs mx-auto mb-0">
              There are no projects matching these filters for {builderName} currently.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
