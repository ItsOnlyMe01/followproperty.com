"use client";

import React, { useState } from "react";
import { CITIES } from "@/constants/admin/cities";
import { Sparkles, CheckCircle2, ArrowLeft, Loader2 } from "lucide-react";

export default function AddProjectSection({ builder, onTabChange }) {
  const builderName = builder?.name || "Developer Partner";

  const [formData, setFormData] = useState({
    projectName: "",
    city: CITIES[0] || "Gurgaon",
    locality: "",
    propertyType: "Residential",
    minPrice: "",
    maxPrice: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const PROPERTY_TYPES = ["Residential", "Commercial", "Plot", "Farmhouse", "Industrial"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.projectName || !formData.locality) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setShowSuccess(true);
      } else {
        alert(data.error || "Failed to submit project.");
      }
    } catch (err) {
      console.error("Error submitting project:", err);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      projectName: "",
      city: CITIES[0] || "Gurgaon",
      locality: "",
      propertyType: "Residential",
      minPrice: "",
      maxPrice: "",
    });
    setShowSuccess(false);
  };

  const handleBackToProjects = () => {
    // Reload the page to trigger server component data refetching
    window.location.reload();
  };

  if (showSuccess) {
    return (
      <div className="max-w-xl mx-auto bg-brand-bgCard rounded-3xl border border-brand-border shadow-brand p-8 text-center space-y-6 animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-full bg-brand-emeraldBg text-brand-emerald flex items-center justify-center mx-auto shadow-brand">
          <CheckCircle2 size={36} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-black text-brand-navy">Project Submitted</h3>
          <p className="text-xs sm:text-sm text-brand-slate max-w-sm mx-auto leading-relaxed">
            "{formData.projectName}" has been successfully submitted and registered.
          </p>
        </div>
        <div className="bg-brand-tealBg border border-brand-tealBorder rounded-2xl p-4.5 text-xs text-brand-tealDark font-semibold text-center max-w-md mx-auto">
          Notice: Your project has been saved and is currently pending admin moderation. It will show up in your developer workspace but remains hidden from public listings.
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={handleReset}
            className="w-full sm:w-auto text-xs font-semibold text-brand-slate hover:text-brand-navy bg-brand-bgAlt border border-brand-borderMid cursor-pointer py-2.5 px-5 rounded-lg transition-all"
          >
            Create Another Project
          </button>
          <button
            onClick={handleBackToProjects}
            className="w-full sm:w-auto text-xs font-semibold text-white bg-brand-teal hover:bg-brand-tealDark border-none cursor-pointer py-2.5 px-5 rounded-lg transition-all"
          >
            Back to Project Directory
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center gap-3">
        <button
          onClick={() => onTabChange("projects")}
          className="p-2 rounded-xl bg-brand-bgCard hover:bg-brand-bgAlt border border-brand-border cursor-pointer text-brand-slate hover:text-brand-navy transition-colors flex items-center justify-center"
          title="Back to projects"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h2 className="text-2xl font-black text-brand-navy tracking-tight m-0">
            Add New Project
          </h2>
          <p className="text-xs sm:text-sm text-brand-slate mt-1 m-0">
            Register a new property listing with FollowProperty. Fill out the mockup catalog fields below.
          </p>
        </div>
      </div>

      <div className="bg-brand-bgCard rounded-3xl border border-brand-border shadow-brand p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Project Name */}
            <div className="col-span-1 sm:col-span-2 space-y-1.5">
              <label htmlFor="projectName" className="text-xs font-bold text-brand-navy uppercase tracking-wider">
                Project Name <span className="text-brand-red">*</span>
              </label>
              <input
                id="projectName"
                type="text"
                name="projectName"
                required
                placeholder="e.g. DLF The Camellias"
                value={formData.projectName}
                onChange={handleInputChange}
                className="w-full border border-brand-borderMid focus:border-brand-teal rounded-xl px-4 py-3 text-sm text-brand-navy placeholder:text-brand-slateLight focus:outline-none transition-colors"
              />
            </div>

            {/* Builder Name (Read-Only) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-slate uppercase tracking-wider">
                Developer Entity (Read-Only)
              </label>
              <input
                type="text"
                disabled
                value={builderName}
                className="w-full bg-brand-bgAlt border border-brand-borderMid rounded-xl px-4 py-3 text-sm text-brand-slate select-none cursor-not-allowed font-semibold"
              />
            </div>

            {/* Property Type */}
            <div className="space-y-1.5">
              <label htmlFor="propertyType" className="text-xs font-bold text-brand-navy uppercase tracking-wider">
                Property Type <span className="text-brand-red">*</span>
              </label>
              <select
                id="propertyType"
                name="propertyType"
                value={formData.propertyType}
                onChange={handleInputChange}
                className="w-full border border-brand-borderMid focus:border-brand-teal rounded-xl px-4 py-3 text-sm text-brand-navy bg-brand-bgCard focus:outline-none cursor-pointer transition-colors"
              >
                {PROPERTY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div className="space-y-1.5">
              <label htmlFor="city" className="text-xs font-bold text-brand-navy uppercase tracking-wider">
                City <span className="text-brand-red">*</span>
              </label>
              <select
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full border border-brand-borderMid focus:border-brand-teal rounded-xl px-4 py-3 text-sm text-brand-navy bg-brand-bgCard focus:outline-none cursor-pointer transition-colors"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Locality */}
            <div className="space-y-1.5">
              <label htmlFor="locality" className="text-xs font-bold text-brand-navy uppercase tracking-wider">
                Locality / Sector <span className="text-brand-red">*</span>
              </label>
              <input
                id="locality"
                type="text"
                name="locality"
                required
                placeholder="e.g. Sector 42"
                value={formData.locality}
                onChange={handleInputChange}
                className="w-full border border-brand-borderMid focus:border-brand-teal rounded-xl px-4 py-3 text-sm text-brand-navy placeholder:text-brand-slateLight focus:outline-none transition-colors"
              />
            </div>

            {/* Price Index Min */}
            <div className="space-y-1.5">
              <label htmlFor="minPrice" className="text-xs font-bold text-brand-navy uppercase tracking-wider">
                Minimum Price (INR)
              </label>
              <input
                id="minPrice"
                type="number"
                name="minPrice"
                placeholder="e.g. 50000000"
                value={formData.minPrice}
                onChange={handleInputChange}
                className="w-full border border-brand-borderMid focus:border-brand-teal rounded-xl px-4 py-3 text-sm text-brand-navy placeholder:text-brand-slateLight focus:outline-none transition-colors"
              />
            </div>

            {/* Price Index Max */}
            <div className="space-y-1.5">
              <label htmlFor="maxPrice" className="text-xs font-bold text-brand-navy uppercase tracking-wider">
                Maximum Price (INR)
              </label>
              <input
                id="maxPrice"
                type="number"
                name="maxPrice"
                placeholder="e.g. 120000000"
                value={formData.maxPrice}
                onChange={handleInputChange}
                className="w-full border border-brand-borderMid focus:border-brand-teal rounded-xl px-4 py-3 text-sm text-brand-navy placeholder:text-brand-slateLight focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-brand-border flex items-center justify-between gap-4">
            <span className="text-xs text-brand-slate font-medium hidden sm:inline flex items-center gap-1">
              <Sparkles size={14} className="text-brand-teal" /> Preview submission MVP
            </span>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto text-sm font-semibold text-white bg-brand-teal hover:bg-brand-tealDark disabled:bg-brand-slateLight border-none cursor-pointer py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(13,148,136,0.30)] hover:-translate-y-0.5 disabled:translate-y-0 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>Submit to Ingestion Pipeline</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
