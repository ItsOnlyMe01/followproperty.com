"use client";

import React, { useState } from "react";
import { Download, Loader2, Check } from "lucide-react";

export default function DownloadReportButton({ projectId }) {
  const [downloading, setDownloading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDownload = async (e) => {
    e.preventDefault();
    if (downloading) return;

    setDownloading(true);
    try {
      // Trigger PDF report generation & download
      const response = await fetch(`/api/projects/${projectId}/report`);
      if (!response.ok) {
        throw new Error("Failed to generate PDF report");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      
      // Extract clean filename from headers if possible
      const contentDisposition = response.headers.get("content-disposition");
      let filename = "project_report.pdf";
      if (contentDisposition && contentDisposition.includes("filename=")) {
        filename = contentDisposition.split("filename=")[1].replace(/"/g, "").trim();
      }
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error downloading project report PDF:", err);
      alert("An error occurred while generating your report. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  if (success) {
    return (
      <button
        disabled
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold bg-brand-emerald text-white border-none shadow-[0_2px_8px_rgba(16,185,129,0.15)] cursor-not-allowed select-none"
      >
        <Check size={13} strokeWidth={3} />
        Report Downloaded!
      </button>
    );
  }

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border-none select-none active:scale-[0.97] cursor-pointer ${
        downloading
          ? "bg-brand-bgAlt text-brand-slate cursor-wait"
          : "bg-brand-navy text-white hover:bg-brand-navy/90 hover:-translate-y-[0.5px] shadow-[0_2px_8px_rgba(15,22,41,0.12)]"
      }`}
    >
      {downloading ? (
        <>
          <Loader2 size={13} className="animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Download size={13} />
          Download Project Details
        </>
      )}
    </button>
  );
}
