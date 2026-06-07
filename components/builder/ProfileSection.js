"use client";

import React from "react";
import { User, Shield, Link2, Calendar } from "lucide-react";

export default function ProfileSection({ builder }) {
  if (!builder) {
    return (
      <div className="bg-brand-bg-card p-6 rounded-3xl border border-brand-border shadow-brand text-center py-12">
        <h3 className="text-lg font-bold text-brand-navy mb-2">No Profile Found</h3>
        <p className="text-sm text-brand-slate max-w-md mx-auto">
          No developer profile is linked to this workspace. Please run database seed/migration files or set up a developer entry.
        </p>
      </div>
    );
  }

  // Get status color styling
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-brand-emerald-bg text-brand-emerald border-brand-emerald/10";
      case "pending":
        return "bg-brand-amber-bg text-brand-amber border-brand-amber-border";
      default:
        return "bg-brand-bg-alt text-brand-slate border-brand-border-mid";
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-brand-navy tracking-tight m-0">
          My Builder Profile
        </h2>
        <p className="text-xs sm:text-sm text-brand-slate mt-1 m-0">
          Your official developer registration details. This information is read-only for verification purposes.
        </p>
      </div>

      {/* Main Info Card */}
      <div className="bg-brand-bg-card rounded-3xl border border-brand-border shadow-brand p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-brand-border gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-blue-bg flex items-center justify-center text-brand-blue">
              <User size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-brand-navy m-0">
                {builder.name}
              </h3>
              <p className="text-xs text-brand-slate-light font-medium m-0">
                Developer Identity ID: {builder.id}
              </p>
            </div>
          </div>
          <span
            className={`self-start sm:self-center text-xs font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${getStatusBadgeClass(
              builder.status
            )}`}
          >
            {builder.status || "active"}
          </span>
        </div>

        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Builder Name Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-brand-slate uppercase tracking-wider flex items-center gap-1.5">
              <User size={13} className="text-brand-slate-light" /> Builder Name
            </label>
            <div className="bg-brand-bg-alt border border-brand-border-mid rounded-xl px-4 py-3 text-sm text-brand-navy font-semibold select-all">
              {builder.name}
            </div>
          </div>

          {/* Builder Slug Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-brand-slate uppercase tracking-wider flex items-center gap-1.5">
              <Link2 size={13} className="text-brand-slate-light" /> URL Slug
            </label>
            <div className="bg-brand-bg-alt border border-brand-border-mid rounded-xl px-4 py-3 text-sm text-brand-navy font-semibold select-all">
              {builder.slug}
            </div>
          </div>

          {/* Verification Status Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-brand-slate uppercase tracking-wider flex items-center gap-1.5">
              <Shield size={13} className="text-brand-slate-light" /> Account Status
            </label>
            <div className="bg-brand-bg-alt border border-brand-border-mid rounded-xl px-4 py-3 text-sm text-brand-navy font-semibold capitalize">
              {builder.status || "active"} Verified
            </div>
          </div>

          {/* Catalog URL Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-brand-slate uppercase tracking-wider flex items-center gap-1.5">
              <Calendar size={13} className="text-brand-slate-light" /> Public URL
            </label>
            <div className="bg-brand-bg-alt border border-brand-border-mid rounded-xl px-4 py-3 text-sm text-brand-navy font-semibold truncate select-all">
              /builders/{builder.slug}
            </div>
          </div>
        </div>

        {/* Moderation Notice Alert */}
        <div className="bg-brand-blue-bg border border-brand-blue-border rounded-2xl p-4.5 text-xs text-brand-blue-dark font-medium leading-relaxed">
          <strong>Need to update profile details?</strong> Standard editing forms are disabled to maintain catalog accuracy. To update your developer name or slug credentials, please submit an approval request through support channels.
        </div>
      </div>
    </div>
  );
}
