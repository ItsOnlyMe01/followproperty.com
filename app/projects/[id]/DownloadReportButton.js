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
        className="badge-emerald px-3 py-1.5 text-[11px] normal-case cursor-not-allowed select-none"
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
      className={`btn-primary px-3 py-1.5 text-[11px] transition-all border-none select-none active:scale-[0.97] ${
        downloading
          ? "bg-brand-bg-alt text-brand-slate cursor-wait"
          : ""
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
