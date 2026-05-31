import React from "react";
import { Building2, MapPin, IndianRupee, Tag } from "lucide-react";

export default function StatsCards({ properties = [], filters }) {
  const matchCount = properties.length;
  
  // Format currency helper
  const formatCurrency = (val) => {
    if (!val) return "Any";
    const num = Number(val);
    if (isNaN(num)) return val;
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
    return `₹${num.toLocaleString()}`;
  };

  const stats = [
    {
      label: "Matching Properties",
      value: matchCount.toString(),
      icon: Building2,
      colorClass: "text-brand-teal",
      bgClass: "bg-brand-tealBg",
    },
    {
      label: "Budget Max",
      value: formatCurrency(filters?.budget),
      icon: IndianRupee,
      colorClass: "text-brand-amber",
      bgClass: "bg-brand-amberBg",
    },
    {
      label: "Preferred City",
      value: filters?.city || "Any City",
      icon: MapPin,
      colorClass: "text-brand-purple",
      bgClass: "bg-brand-purpleBg",
    },
    {
      label: "Property Type",
      value: filters?.specificType || "All Types",
      icon: Tag,
      colorClass: "text-brand-emerald",
      bgClass: "bg-brand-emeraldBg",
    },
  ];

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5 mb-8">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className="bg-brand-bgCard p-5 rounded-2xl border border-brand-border flex items-center gap-4 shadow-brand"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bgClass}`}>
              <Icon size={24} className={stat.colorClass} />
            </div>
            <div>
              <p className="text-[12px] font-semibold text-brand-slate mb-1 uppercase tracking-[0.05em]">
                {stat.label}
              </p>
              <h3 className="text-[18px] font-extrabold text-brand-navy tracking-[-0.02em]">
                {stat.value}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}
