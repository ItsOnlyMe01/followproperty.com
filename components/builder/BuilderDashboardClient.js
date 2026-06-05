"use client";

import React, { useState } from "react";
import BuilderLayout from "./BuilderLayout";
import OverviewSection from "./OverviewSection";
import ProfileSection from "./ProfileSection";
import ProjectsSection from "./ProjectsSection";
import AddProjectSection from "./AddProjectSection";
import { ShieldAlert, RefreshCw } from "lucide-react";

export default function BuilderDashboardClient({ initialBuilder, initialProjects }) {
  const [activeTab, setActiveTab] = useState("overview");

  // Handle empty state if no builder exists in database
  if (!initialBuilder) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-brand-bgCard rounded-3xl border border-brand-border shadow-brand p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-brand-redBg text-brand-red flex items-center justify-center mx-auto border border-brand-redBorder">
            <ShieldAlert size={32} />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-black text-brand-navy tracking-tight">
              Builder Profile Offline
            </h1>
            <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">
              No developer records exist in the database. This workspace relies on real Builder collections to link properties.
            </p>
          </div>
          <div className="bg-brand-bgAlt rounded-xl p-4 text-[11px] text-brand-slate font-medium text-left border border-brand-border">
            Please run the migration scripts to seed raw Excel builders:
            <code className="block mt-1.5 p-1.5 bg-brand-navy text-white rounded font-mono text-[10px] break-all select-all">
              node scripts/migrate_builders.js
            </code>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full text-xs font-semibold text-white bg-brand-teal hover:bg-brand-tealDark border-none cursor-pointer py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-[0_2px_8px_rgba(13,148,136,0.30)]"
          >
            <RefreshCw size={14} /> Refresh Workspace
          </button>
        </div>
      </div>
    );
  }

  // Render the selected view component
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewSection
            builder={initialBuilder}
            projects={initialProjects}
            onTabChange={setActiveTab}
          />
        );
      case "profile":
        return <ProfileSection builder={initialBuilder} />;
      case "projects":
        return (
          <ProjectsSection
            projects={initialProjects}
            onTabChange={setActiveTab}
          />
        );
      case "add-project":
        return (
          <AddProjectSection
            builder={initialBuilder}
            onTabChange={setActiveTab}
          />
        );
      default:
        return (
          <OverviewSection
            builder={initialBuilder}
            projects={initialProjects}
            onTabChange={setActiveTab}
          />
        );
    }
  };

  return (
    <BuilderLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      builderName={initialBuilder.name}
    >
      {renderContent()}
    </BuilderLayout>
  );
}
