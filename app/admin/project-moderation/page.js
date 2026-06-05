"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Check, X, ShieldAlert, FileText, ArrowLeft, RefreshCw } from "lucide-react";

export default function ProjectModerationAdminPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [actioningId, setActioningId] = useState(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/admin/project-moderation");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setProjects(json.data);
      } else {
        setError(json.error || "Failed to load pending projects.");
      }
    } catch (err) {
      console.error("Error loading pending projects:", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (projectId, status) => {
    try {
      setActioningId(projectId);
      setError("");
      setSuccessMessage("");

      const res = await fetch("/api/admin/project-moderation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId, status }),
      });

      const json = await res.json();
      if (json.success) {
        setSuccessMessage(`Successfully updated project status to '${status}'.`);
        await fetchProjects();
      } else {
        setError(json.error || "Failed to update project status.");
      }
    } catch (err) {
      console.error("Error updating project status:", err);
      setError("An unexpected error occurred while updating status.");
    } finally {
      setActioningId(null);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex-1 flex flex-col w-full font-sans antialiased">
      {/* Back to Portal Landing Link */}
      <div className="mb-5">
        <Link
          href="/admin"
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5 animate-in fade-in"
        >
          <ArrowLeft size={14} /> Back to Admin Portal
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm flex-grow flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <FileText size={26} className="text-amber-500" /> Project Moderation Queue
              </h1>
              <p className="text-xs text-slate-400 font-medium mt-1">
                View submitted builder properties awaiting content approval.
              </p>
            </div>
            
            <button
              onClick={fetchProjects}
              disabled={loading}
              className="self-start md:self-center text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 border-none cursor-pointer py-2 px-3 rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh
            </button>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold animate-in fade-in duration-200 flex items-center gap-2">
              <ShieldAlert size={16} /> {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-semibold animate-in fade-in duration-200 flex items-center gap-2">
              <Check size={16} /> {successMessage}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <RefreshCw size={24} className="text-slate-400 animate-spin" />
              <p className="text-xs text-slate-400 font-semibold">Loading projects queue...</p>
            </div>
          ) : projects.length > 0 ? (
            /* Projects Queue Table */
            <div className="overflow-x-auto w-full border border-slate-100 rounded-2xl">
              <table className="w-full border-collapse text-left text-xs font-medium text-slate-600">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                    <th className="p-4">Project Name</th>
                    <th className="p-4">Builder Name</th>
                    <th className="p-4">City</th>
                    <th className="p-4">Property Type</th>
                    <th className="p-4">Submitted Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {projects.map((proj) => (
                    <tr key={proj.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Project Name */}
                      <td className="p-4">
                        <div className="font-extrabold text-slate-900 text-sm">{proj.projectName}</div>
                      </td>

                      {/* Builder Name */}
                      <td className="p-4">
                        <div className="font-semibold text-slate-800">{proj.builderName}</div>
                      </td>

                      {/* City */}
                      <td className="p-4">
                        <span className="font-semibold text-slate-700">{proj.city}</span>
                      </td>

                      {/* Property Type */}
                      <td className="p-4">
                        <span className="font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-[10px] uppercase tracking-wide">
                          {proj.propertyType}
                        </span>
                      </td>

                      {/* Created/Submitted Date */}
                      <td className="p-4 text-slate-400">
                        {formatDate(proj.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            disabled={actioningId !== null}
                            onClick={() => handleAction(proj.id, "approved")}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border-none text-white font-bold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 cursor-pointer transition-colors shadow-sm text-[11px]"
                          >
                            <Check size={14} /> Approve
                          </button>
                          <button
                            disabled={actioningId !== null}
                            onClick={() => handleAction(proj.id, "rejected")}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border-none text-white font-bold bg-[#DC2626] hover:bg-[#B91C1C] disabled:opacity-50 cursor-pointer transition-colors shadow-sm text-[11px]"
                          >
                            <X size={14} /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-slate-200 rounded-3xl">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
                <FileText size={24} />
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">No pending projects</h3>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                There are no builder projects currently awaiting content approval in the queue.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
