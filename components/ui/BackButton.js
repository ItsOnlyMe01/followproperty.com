"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton({ className, children }) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={className || "inline-flex items-center gap-2 text-sm font-bold text-brand-blue hover:opacity-85 transition-opacity bg-transparent border-none p-0 cursor-pointer"}
    >
      {children || (
        <>
          <ArrowLeft size={16} /> Back
        </>
      )}
    </button>
  );
}
