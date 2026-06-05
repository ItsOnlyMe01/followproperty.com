"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Check, X, ShieldAlert, FileText, ArrowLeft, RefreshCw } from "lucide-react";

export default function BuilderApplicationsAdminPage() {
  const [statusFilter, setStatusFilter] = useState("pending");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actioningId, setActioningId] = useState(null);

  const fetchApplications = async (statusVal) => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`/api/admin/builder-application?status=${statusVal}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setApplications(json.data);
      } else {
        setError(json.error || "Failed to load builder applications.");
      }
    } catch (err) {
      console.error("Error loading builder applications:", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications(statusFilter);
  }, [statusFilter]);

  const handleAction = async (applicationId, status) => {
    try {
      setActioningId(applicationId);
      setError("");

      const res = await fetch("/api/admin/builder-application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ applicationId, status }),
      });

      const json = await res.json();
      if (json.success) {
        // Refresh current list filter
        await fetchApplications(statusFilter);
      } else {
        setError(json.error || "Failed to update application status.");
      }
    } catch (err) {
      console.error("Error updating application status:", err);
      setError("An unexpected error occurred while updating status.");
    } finally {
      setActioningId(null);
    }
  };

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
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5"
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
                <FileText size={26} className="text-amber-500" /> Builder Applications
              </h1>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Review and manage developer requests to onboarding custom builder workspaces.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-slate-100 p-1.5 rounded-xl self-start md:self-center">
              {["pending", "approved", "rejected", "draft"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg border-none cursor-pointer capitalize transition-all ${
                    statusFilter === status
                      ? "bg-white text-slate-900 shadow-sm"
                      : "bg-transparent text-slate-400 hover:text-slate-700"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold animate-in fade-in duration-200 flex items-center gap-2">
              <ShieldAlert size={16} /> {error}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <RefreshCw size={24} className="text-slate-400 animate-spin" />
              <p className="text-xs text-slate-400 font-semibold">Loading applications queue...</p>
            </div>
          ) : applications.length > 0 ? (
            /* Applications Queue Table */
            <div className="overflow-x-auto w-full border border-slate-100 rounded-2xl">
              <table className="w-full border-collapse text-left text-xs font-medium text-slate-600">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                    <th className="p-4">Builder / Company</th>
                    <th className="p-4">Contact Details</th>
                    <th className="p-4">City</th>
                    <th className="p-4">RERA / Web</th>
                    <th className="p-4">Submitted Date</th>
                    {statusFilter === "pending" && <th className="p-4 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Builder Name & Company */}
                      <td className="p-4">
                        <div className="font-extrabold text-slate-900 text-sm">{app.builderName}</div>
                        <div className="text-slate-400 mt-0.5">{app.companyName}</div>
                      </td>

                      {/* Contact Details */}
                      <td className="p-4">
                        <div className="font-semibold text-slate-800">{app.contactPersonName}</div>
                        <div className="text-slate-500 mt-0.5">{app.phone}</div>
                        <div className="text-slate-400 text-[11px]">{app.email}</div>
                      </td>

                      {/* City */}
                      <td className="p-4">
                        <span className="font-semibold text-slate-700">{app.city}</span>
                      </td>

                      {/* RERA & Web */}
                      <td className="p-4">
                        <div className="text-slate-600">{app.reraNumber || "N/A"}</div>
                        {app.website ? (
                          <a
                            href={app.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-amber-600 hover:underline inline-block mt-0.5"
                          >
                            Visit Website
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-300">No website</span>
                        )}
                      </td>

                      {/* Submitted Date */}
                      <td className="p-4 text-slate-400">
                        {formatDate(app.updatedAt)}
                      </td>

                      {/* Actions for Pending Applications */}
                      {statusFilter === "pending" && (
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              disabled={actioningId !== null}
                              onClick={() => handleAction(app.id, "approved")}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border-none text-white font-bold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 cursor-pointer transition-colors shadow-sm text-[11px]"
                            >
                              <Check size={14} /> Approve
                            </button>
                            <button
                              disabled={actioningId !== null}
                              onClick={() => handleAction(app.id, "rejected")}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border-none text-white font-bold bg-[#DC2626] hover:bg-[#B91C1C] disabled:opacity-50 cursor-pointer transition-colors shadow-sm text-[11px]"
                            >
                              <X size={14} /> Reject
                            </button>
                          </div>
                        </td>
                      )}
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
              <h3 className="font-extrabold text-slate-900 text-sm">No applications found</h3>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                There are no builder onboarding applications currently in the **{statusFilter}** queue.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
