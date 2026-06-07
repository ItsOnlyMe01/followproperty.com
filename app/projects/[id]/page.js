import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  MapPin, 
  Building, 
  Calendar, 
  Maximize2, 
  Building2, 
  Info, 
  ArrowLeft, 
  Layers,
  LayoutGrid,
  TrendingUp,
  Tag,
  CheckCircle2
} from "lucide-react";

import connectToDatabase from "@/lib/db";
import MarketProject from "@/models/MarketProject";
import Watchlist from "@/models/Watchlist";
import DashboardLayout from "@/components/layout/DashboardLayout";
import LeadButton from "./LeadButton";
import CompareButton from "./CompareButton";
import CompareBar from "@/components/compare/CompareBar";
import DownloadReportButton from "./DownloadReportButton";
import { formatCurrency, formatPriceRange, formatAreaRange } from "@/utils/pdf/formatter";
import { normalizeBuilder } from "@/utils/admin/normalization";
import BackButton from "@/components/ui/BackButton";

export default async function ProjectDetailsPage({ params, searchParams }) {
  // Await route params and searchParams for the project details page
  const { id } = await params;
  const { watchlistId } = await searchParams;

  await connectToDatabase();

  // Retrieve project document by ID
  let project = null;
  try {
    project = await MarketProject.findById(id).lean();
  } catch (err) {
    console.error("Invalid ObjectId format:", id);
  }

  if (!project) {
    return notFound();
  }

  // Retrieve watchlist document if parameter exists to show contextual matching block
  let watchlist = null;
  if (watchlistId) {
    try {
      watchlist = await Watchlist.findById(watchlistId).lean();
    } catch (err) {
      console.error("Invalid watchlist ID:", watchlistId);
    }
  }

  // Shared formatting helpers imported from @/utils/pdf/formatter

  const isReady = project.status === "Ready to Move" || project.status === "Ready";

  // Compile Dynamic Project Highlights list
  const highlights = [];
  if (project.bhk && project.bhk.length > 0) {
    highlights.push(`${project.bhk.join(", ")} BHK Configurations`);
  }
  if (project.status) {
    highlights.push(project.status);
  }
  if (project.locality && project.city) {
    highlights.push(`Located in ${project.locality}, ${project.city}`);
  }
  if (project.minPrice) {
    highlights.push(`Base Entry Price: ${formatCurrency(project.minPrice, "₹")}`);
  }
  if (project.perSqftRate) {
    highlights.push(`Competitive rate of ₹${Number(project.perSqftRate).toLocaleString()}/sq.ft`);
  }
  if (project.possessionYear !== undefined && project.possessionYear !== null) {
    highlights.push(project.possessionYear === 0 ? "Ready to Move in" : `Possession target year: ${project.possessionYear}`);
  }

  const builderSlug = project.builderName
    ? normalizeBuilder(project.builderName).toLowerCase().replace(/[^a-z0-9]+/g, "-")
    : "";

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto pb-16 pt-4 px-2 sm:px-4 font-sans antialiased text-brand-navy">
        
        {/* Navigation Control & Breadcrumbs */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <BackButton />
          <DownloadReportButton projectId={project._id.toString()} />
        </div>

        {/* 1. HERO SECTION */}
        <div className="bg-brand-bg-card p-6 sm:p-8 rounded-3xl border border-brand-border shadow-brand mb-6 flex flex-col md:flex-row justify-between items-start md:items-stretch gap-6 animate-in fade-in duration-200">
          {/* Left Column: Project Identity */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight leading-tight m-0 mb-1.5">
                {project.projectName}
              </h1>
              
              {project.builderName && (
                <p className="text-sm text-brand-slate font-bold m-0 mb-3 flex items-center gap-1.5">
                  <Building size={14} className="text-brand-slate-light" />
                  By{" "}
                  <Link
                    href={`/builders/${builderSlug}`}
                    className="text-brand-navy hover:text-brand-blue font-extrabold transition-colors hover:underline"
                  >
                    {project.builderName}
                  </Link>
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 mb-4">
                {project.bhk && project.bhk.length > 0 && (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-brand-bg text-brand-navy border border-brand-border-mid">
                    {project.bhk.join(", ")} BHK
                  </span>
                )}
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                  isReady
                    ? "bg-brand-emerald-bg text-brand-emerald border-brand-emerald/20"
                    : "bg-brand-amber-bg text-brand-amber border-brand-amber/20"
                }`}>
                  {isReady ? "Ready to Move" : "Under Construction"}
                </span>
                
                <CompareButton projectId={project._id.toString()} projectName={project.projectName} />
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-brand-navy-mid font-extrabold mt-3 md:mt-0">
              <MapPin size={15} className="text-brand-slate" />
              <span>
                {project.locality ? `${project.locality}, ` : ""}{project.city}{project.state ? `, ${project.state}` : ""}
              </span>
            </div>
          </div>

          {/* Right Column: Price Highlight Card */}
          <div className="w-full md:w-[280px] bg-brand-bg-alt p-5 rounded-2xl border border-brand-border flex flex-col justify-between min-h-[120px] md:min-h-auto">
            <div>
              <p className="text-[10px] text-brand-slate uppercase font-bold tracking-wider mb-1">
                Estimated Price Range
              </p>
              <h2 className="text-xl sm:text-2xl font-extrabold text-brand-navy-deep tracking-tight m-0 leading-tight">
                {formatPriceRange(project.minPrice, project.maxPrice, "₹")}
              </h2>
            </div>
            
            {project.monthlyRentRange && (
              <div className="mt-4 pt-3 border-t border-brand-border/60">
                <p className="text-[9px] text-brand-slate uppercase font-bold tracking-wider mb-0.5">
                  Est. Monthly Rental Yield
                </p>
                <p className="text-xs font-extrabold text-brand-navy m-0">
                  {project.monthlyRentRange}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 2. WATCHLIST CONTEXT BANNER */}
        {watchlist && (
          <div className="bg-brand-bg-card border border-brand-border shadow-brand p-4 sm:p-5 rounded-2xl flex items-start sm:items-center gap-3.5 mb-6 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="w-8 h-8 rounded-lg bg-brand-blue-bg text-brand-blue flex-shrink-0 flex items-center justify-center font-extrabold border border-brand-blue-border">
              ✓
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-brand-navy m-0 mb-0.5">
                Matched your buying requirements
              </h4>
              <p className="text-xs text-brand-slate m-0 leading-relaxed font-semibold">
                This project satisfies your active buying profile for a <span className="font-bold text-brand-navy">{watchlist.specificType}</span> in <span className="font-bold text-brand-navy">{watchlist.locality}, {watchlist.city}</span>.
              </p>
            </div>
          </div>
        )}

        {/* 3. PROJECT HIGHLIGHTS */}
        {highlights.length > 0 && (
          <div className="bg-brand-bg-card p-6 rounded-3xl border border-brand-border shadow-brand mb-6">
            <h3 className="text-xs font-extrabold text-brand-slate uppercase tracking-wider mb-4 border-b border-brand-border pb-2.5 flex items-center gap-2 m-0">
              <CheckCircle2 size={15} className="text-brand-slate" /> Project Highlights
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {highlights.map((highlight, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-sm font-bold text-brand-navy-mid">
                  <span className="text-brand-blue font-extrabold">✓</span>
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. CONFIGURATIONS & DIMENSIONS */}
        <div className="bg-brand-bg-card p-6 rounded-3xl border border-brand-border shadow-brand mb-6">
          <h3 className="text-xs font-extrabold text-brand-slate uppercase tracking-wider mb-4 border-b border-brand-border pb-2.5 flex items-center gap-2 m-0">
            <LayoutGrid size={15} className="text-brand-slate" /> Configurations & Dimensions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* BHK Configurations */}
            {project.bhk && project.bhk.length > 0 && (
              <div className="p-4 bg-brand-bg-card rounded-xl border border-brand-border shadow-xs flex flex-col justify-between">
                <span className="text-[10px] text-brand-slate uppercase font-bold tracking-wider mb-2.5 block">
                  BHK Options
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {project.bhk.map((b) => (
                    <span key={b} className="px-2.5 py-0.5 rounded bg-brand-bg text-brand-navy text-xs font-extrabold border border-brand-border-mid">
                      {b} BHK
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Area Range */}
            {formatAreaRange(project.minArea, project.maxArea, project.superArea, project.avgAreaSqft) && (
              <div className="p-4 bg-brand-bg-card rounded-xl border border-brand-border shadow-xs">
                <span className="text-[10px] text-brand-slate uppercase font-bold tracking-wider mb-2.5 block">
                  Area Range
                </span>
                <span className="text-sm font-extrabold text-brand-navy block">
                  {formatAreaRange(project.minArea, project.maxArea, project.superArea, project.avgAreaSqft)}
                </span>
              </div>
            )}

            {/* Structure Configurations */}
            {project.configuration && (
              <div className="p-4 bg-brand-bg-card rounded-xl border border-brand-border shadow-xs">
                <span className="text-[10px] text-brand-slate uppercase font-bold tracking-wider mb-2.5 block">
                  Structure Types
                </span>
                <span className="text-sm font-extrabold text-brand-navy block truncate" title={project.configuration}>
                  {project.configuration}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 5. PROJECT OVERVIEW */}
        {(project.towers || project.units || project.totalArea || project.launchedDate || project.possessionDate) && (
          <div className="bg-brand-bg-card p-6 rounded-3xl border border-brand-border shadow-brand mb-6">
            <h3 className="text-xs font-extrabold text-brand-slate uppercase tracking-wider mb-4 border-b border-brand-border pb-2.5 flex items-center gap-2 m-0">
              <Layers size={15} className="text-brand-slate" /> Project Overview
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-5 gap-x-4">
              {project.towers && (
                <div className="flex flex-col">
                  <span className="text-[9px] text-brand-slate font-bold uppercase tracking-wider mb-1">Towers</span>
                  <span className="text-sm font-extrabold text-brand-navy">{project.towers}</span>
                </div>
              )}
              {project.units && (
                <div className="flex flex-col">
                  <span className="text-[9px] text-brand-slate font-bold uppercase tracking-wider mb-1">Total Units</span>
                  <span className="text-sm font-extrabold text-brand-navy">{project.units} Units</span>
                </div>
              )}
              {project.totalArea && (
                <div className="flex flex-col">
                  <span className="text-[9px] text-brand-slate font-bold uppercase tracking-wider mb-1">Total Area</span>
                  <span className="text-sm font-extrabold text-brand-navy">{project.totalArea}</span>
                </div>
              )}
              {project.launchedDate && (
                <div className="flex flex-col">
                  <span className="text-[9px] text-brand-slate font-bold uppercase tracking-wider mb-1">Launched Date</span>
                  <span className="text-sm font-extrabold text-brand-navy">{project.launchedDate}</span>
                </div>
              )}
              {project.possessionDate && (
                <div className="flex flex-col col-span-2 sm:col-span-1">
                  <span className="text-[9px] text-brand-slate font-bold uppercase tracking-wider mb-1">Possession Timeline</span>
                  <span className="text-sm font-extrabold text-brand-navy">{project.possessionDate}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 6. PRICING & RENTAL INFORMATION */}
        {(project.perSqftRate || project.monthlyRentRange || project.perSqftRentalAvg) && (
          <div className="bg-brand-bg-card p-6 rounded-3xl border border-brand-border shadow-brand mb-8">
            <h3 className="text-xs font-extrabold text-brand-slate uppercase tracking-wider mb-4 border-b border-brand-border pb-2.5 flex items-center gap-2 m-0">
              <TrendingUp size={15} className="text-brand-slate" /> Pricing & Rental Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Average rate */}
              {project.perSqftRate && (
                <div className="p-4 bg-brand-bg-card rounded-xl border border-brand-border shadow-xs">
                  <span className="text-[10px] text-brand-slate uppercase font-bold tracking-wider mb-2 block">
                    Average Price Rate
                  </span>
                  <span className="text-sm font-extrabold text-brand-navy block">
                    ₹{Number(project.perSqftRate).toLocaleString("en-IN")}/sq.ft
                  </span>
                </div>
              )}

              {/* Monthly rental estimate */}
              {project.monthlyRentRange && (
                <div className="p-4 bg-brand-bg-card rounded-xl border border-brand-border shadow-xs">
                  <span className="text-[10px] text-brand-slate uppercase font-bold tracking-wider mb-2 block">
                    Monthly Rent Estimate
                  </span>
                  <span className="text-sm font-extrabold text-brand-navy block">
                    {project.monthlyRentRange}
                  </span>
                </div>
              )}

              {/* Average rental yield rate */}
              {project.perSqftRentalAvg && (
                <div className="p-4 bg-brand-bg-card rounded-xl border border-brand-border shadow-xs">
                  <span className="text-[10px] text-brand-slate uppercase font-bold tracking-wider mb-2 block">
                    Rental Rate Avg
                  </span>
                  <span className="text-sm font-extrabold text-brand-navy block">
                    ₹{project.perSqftRentalAvg}/sq.ft
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 7. BOTTOM CTA SECTION */}
        <div className="relative overflow-hidden bg-linear-to-br from-brand-navy-deep via-brand-navy to-brand-navy-mid p-6 sm:p-8 rounded-3xl border border-brand-border text-center shadow-brand-lg text-white animate-in fade-in zoom-in-95 duration-200">
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
               style={{ 
                 backgroundImage: "radial-gradient(var(--color-brand-border) 1.2px, transparent 1.2px)", 
                 backgroundSize: "24px 24px" 
               }} 
          />
          <h3 className="relative z-10 text-xl sm:text-2xl font-extrabold tracking-tight m-0 mb-2">
            Interested in this Project?
          </h3>
          <p className="relative z-10 text-xs sm:text-sm text-brand-slate-light max-w-[480px] mx-auto m-0 mb-6 leading-relaxed">
            Receive direct builder inventory pricing updates and schedule verified site visits with project managers. Skip external broker fees entirely.
          </p>
          
          <div className="relative z-10">
            <LeadButton />
          </div>
        </div>

        {/* Floating Bottom Comparison Drawer */}
        <CompareBar />

      </div>
    </DashboardLayout>
  );
}
