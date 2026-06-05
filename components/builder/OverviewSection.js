"use client";

import React from "react";
import { Building2, BadgeCheck, Clock, ArrowRight } from "lucide-react";

export default function OverviewSection({ builder, projects, onTabChange }) {
  const builderName = builder?.name || "Developer Partner";

  // Calculate statistics from real project data only
  const totalProjects = projects.length;
  const pendingProjects = projects.filter((p) => p.moderationStatus === "pending").length;
  const approvedProjects = totalProjects - pendingProjects;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-brand-navy text-white rounded-3xl p-6 md:p-8 shadow-brand-lg">
        {/* Subtle decorative background gradient circles */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-brand-teal/20 to-transparent rounded-full -mr-16 -mt-16 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-gradient-to-tr from-brand-amber/10 to-transparent rounded-full -mb-16 pointer-events-none" />

        <div className="relative z-10 max-w-xl">
          <span className="text-xs font-bold text-brand-teal bg-brand-tealBg border border-brand-tealBorder px-2.5 py-1 rounded-full uppercase tracking-wider mb-3.5 inline-block">
            Builder Hub MVP
          </span>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2">
            Welcome back, {builderName}!
          </h1>
          <p className="text-sm text-brand-slateLight leading-relaxed mb-6">
            Access your developer profile, monitor listed inventories, and prepare new launching projects for the FollowProperty matching index.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onTabChange("projects")}
              className="text-xs font-semibold text-white bg-brand-teal hover:bg-brand-tealDark border-none cursor-pointer py-2 px-4 rounded-lg flex items-center gap-1.5 transition-all shadow-[0_2px_8px_rgba(13,148,136,0.30)] hover:-translate-y-0.5"
            >
              View Listings <ArrowRight size={14} />
            </button>
            <button
              onClick={() => onTabChange("profile")}
              className="text-xs font-semibold text-brand-slateLight hover:text-white bg-white/10 hover:bg-white/15 border border-white/10 cursor-pointer py-2 px-4 rounded-lg transition-all"
            >
              Developer Profile
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Card 1: Total Projects */}
        <div className="bg-brand-bgCard p-5 rounded-2xl border border-brand-border shadow-brand flex flex-col justify-between min-h-[135px]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-brand-slate uppercase tracking-wider">
              Total Projects
            </span>
            <div className="w-8 h-8 rounded-lg bg-brand-tealBg flex items-center justify-center">
              <Building2 size={16} className="text-brand-teal" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-brand-navy m-0">
              {totalProjects}
            </h3>
            <p className="mt-1 text-[11px] text-brand-slate font-medium m-0">
              Active projects in index
            </p>
          </div>
        </div>

        {/* Card 2: Approved Projects */}
        <div className="bg-brand-bgCard p-5 rounded-2xl border border-brand-border shadow-brand flex flex-col justify-between min-h-[135px]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-brand-slate uppercase tracking-wider">
              Approved Projects
            </span>
            <div className="w-8 h-8 rounded-lg bg-brand-emeraldBg flex items-center justify-center">
              <BadgeCheck size={16} className="text-brand-emerald" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-brand-navy m-0">
              {approvedProjects}
            </h3>
            <p className="mt-1 text-[11px] text-brand-slate font-medium m-0">
              Live and visible to buyers
            </p>
          </div>
        </div>

        {/* Card 3: Pending Projects */}
        <div className="bg-brand-bgCard p-5 rounded-2xl border border-brand-border shadow-brand flex flex-col justify-between min-h-[135px]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-brand-slate uppercase tracking-wider">
              Pending Projects
            </span>
            <div className="w-8 h-8 rounded-lg bg-brand-amberBg flex items-center justify-center">
              <Clock size={16} className="text-brand-amber" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-brand-navy m-0">
              {pendingProjects}
            </h3>
            <p className="mt-1 text-[11px] text-brand-slate font-medium m-0">
              Awaiting approval flow (V2)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
