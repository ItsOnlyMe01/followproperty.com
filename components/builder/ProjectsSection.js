"use client";

import React from "react";
import { SearchX, Plus, Building2, MapPin, Tag } from "lucide-react";

export default function ProjectsSection({ projects, onTabChange }) {
  if (!projects || projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-5 bg-brand-bg-card rounded-3xl border border-dashed border-brand-border-mid text-center mt-5 animate-in fade-in duration-200">
        <div className="w-16 h-16 rounded-2xl bg-brand-bg-alt flex items-center justify-center mb-4 text-brand-slate">
          <SearchX size={32} />
        </div>
        <h3 className="text-lg font-bold text-brand-navy mb-2 max-w-[500px] leading-snug">
          No listed projects found in your portfolio
        </h3>
        <p className="text-xs sm:text-sm text-brand-slate max-w-[460px] leading-relaxed mb-6">
          Currently, there are no verified properties associated with your builder account in the directory.
        </p>
        <button
          onClick={() => onTabChange("add-project")}
          className="text-xs font-bold text-white bg-linear-to-r from-brand-blue-deep to-brand-blue border border-white/5 cursor-pointer py-2.5 px-5 rounded-lg flex items-center gap-1.5 shadow-sm hover:shadow-brand-blue/30 hover:-translate-y-0.5 transition-all"
        >
          <Plus size={16} /> Add Your First Project
        </button>
      </div>
    );
  }

  // Format price helper
  const formatPrice = (price) => {
    if (!price) return "TBD";
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    }
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lakh`;
    }
    return `₹${price.toLocaleString("en-IN")}`;
  };

  // Status Badge Class
  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("ready") || s.includes("completed")) {
      return "bg-brand-emerald-bg text-brand-emerald border-brand-emerald/10";
    }
    return "bg-brand-amber-bg text-brand-amber border-brand-amber-border";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-brand-navy tracking-tight m-0">
            My Projects
          </h2>
          <p className="text-xs sm:text-sm text-brand-slate mt-1 m-0">
            A list of all properties connected with your builder entity profile.
          </p>
        </div>
        <button
          onClick={() => onTabChange("add-project")}
          className="self-start sm:self-center text-xs font-bold text-white bg-linear-to-r from-brand-blue-deep to-brand-blue border border-white/5 cursor-pointer py-2 px-4 rounded-lg flex items-center gap-1.5 shadow-sm hover:shadow-brand-blue/30 hover:-translate-y-0.5 transition-all"
        >
          <Plus size={16} /> Add Project
        </button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-brand-bg-card rounded-3xl border border-brand-border shadow-brand overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-brand-border bg-brand-bg-alt/50">
              <th className="px-6 py-4 text-xs font-bold text-brand-slate uppercase tracking-wider">
                Project Name
              </th>
              <th className="px-6 py-4 text-xs font-bold text-brand-slate uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-4 text-xs font-bold text-brand-slate uppercase tracking-wider">
                Property Type
              </th>
              <th className="px-6 py-4 text-xs font-bold text-brand-slate uppercase tracking-wider">
                Price Index
              </th>
              <th className="px-6 py-4 text-xs font-bold text-brand-slate uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            {projects.map((proj) => (
              <tr key={proj.id} className="hover:bg-brand-bg-alt/10 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-brand-blue-bg flex items-center justify-center text-brand-blue font-bold shrink-0">
                      <Building2 size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-brand-navy m-0">
                        {proj.projectName}
                      </p>
                      {proj.locality && (
                        <p className="text-[11px] text-brand-slate-light font-medium m-0">
                          {proj.locality}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-brand-navy-mid font-semibold">
                    {proj.city}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-semibold text-brand-slate bg-brand-bg-alt px-2.5 py-1 rounded-md border border-brand-border">
                    {proj.propertyType}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-brand-navy font-bold">
                    {proj.minPrice > 0
                      ? `${formatPrice(proj.minPrice)} - ${formatPrice(proj.maxPrice)}`
                      : "Pricing TBD"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${getStatusBadge(
                      proj.status
                    )}`}
                  >
                    {proj.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="bg-brand-bg-card p-5 rounded-2xl border border-brand-border shadow-brand space-y-4 hover:shadow-brand-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-base font-extrabold text-brand-navy m-0">
                  {proj.projectName}
                </h4>
                {proj.locality && (
                  <p className="text-xs text-brand-slate m-0 mt-0.5 flex items-center gap-1">
                    <MapPin size={12} /> {proj.locality}
                  </p>
                )}
              </div>
              <span
                className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${getStatusBadge(
                  proj.status
                )}`}
              >
                {proj.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-brand-border">
              <div>
                <span className="text-brand-slate-light block">City</span>
                <span className="font-bold text-brand-navy-mid mt-0.5 block">{proj.city}</span>
              </div>
              <div>
                <span className="text-brand-slate-light block">Type</span>
                <span className="font-bold text-brand-navy-mid mt-0.5 block flex items-center gap-1">
                  <Tag size={12} /> {proj.propertyType}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-brand-border">
              <span className="text-brand-slate-light text-[11px] block">Price Index</span>
              <span className="text-sm font-black text-brand-navy mt-0.5 block">
                {proj.minPrice > 0
                  ? `${formatPrice(proj.minPrice)} - ${formatPrice(proj.maxPrice)}`
                  : "Pricing TBD"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
