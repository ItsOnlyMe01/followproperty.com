"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import BackButton from "@/components/ui/BackButton";
import { calculateValuation } from "@/utils/calculations/valuation";
import { generateValuationPDF } from "@/utils/pdf/generator";
import PerformanceChart from "@/components/ui/PerformanceChart";
import { 
  Building2, 
  MapPin, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  ArrowLeft,
  Coins,
  Percent,
  Activity,
  Landmark,
  Key,
  Info,
  Download,
  Trash2
} from "lucide-react";
import { deletePortfolioItem } from "@/services/api";


export default function PropertyDetailsPage({ params }) {
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;
  const router = useRouter();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleDeleteProperty = async () => {
    if (deleteConfirmationInput !== "deleteproperty") return;
    try {
      setDeleting(true);
      setDeleteError("");
      const res = await deletePortfolioItem(id);
      if (res.success) {
        setDeleteModalOpen(false);
        router.push("/portfolio");
      } else {
        throw new Error(res.error || "Failed to delete property.");
      }
    } catch (err) {
      console.error("Error deleting property:", err);
      setDeleteError(err.message || "Could not delete property.");
    } finally {
      setDeleting(false);
    }
  };


  useEffect(() => {
    async function fetchProperty() {
      try {
        setLoading(true);
        const res = await fetch("/api/portfolio");
        if (!res.ok) {
          throw new Error("Failed to fetch property details");
        }
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const found = json.data.find(item => item._id === id || item.id === id);
          if (found) {
            setProperty(found);
          } else {
            throw new Error("Property not found in your portfolio.");
          }
        } else {
          throw new Error(json.error || "Failed to load portfolio properties.");
        }
      } catch (err) {
        console.error("Error fetching property:", err);
        setError(err.message || "Failed to load property details.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchProperty();
    }
  }, [id]);

  const formatCurrency = (num) => {
    if (!num) return "₹0";
    const parsedNum = Number(num);
    if (isNaN(parsedNum)) return "₹0";
    if (parsedNum >= 10000000) return `₹${(parsedNum / 10000000).toFixed(2)} Cr`;
    if (parsedNum >= 100000) return `₹${(parsedNum / 100000).toFixed(2)} L`;
    return `₹${parsedNum.toLocaleString()}`;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto animate-pulse py-4">
          <div className="h-6 w-36 bg-brand-bg-alt rounded-lg mb-6" />
          <div className="h-[240px] sm:h-[280px] w-full bg-brand-bg-alt rounded-3xl mb-8" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-brand-bg-alt rounded-2xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-44 bg-brand-bg-alt rounded-2xl" />
              <div className="h-32 bg-brand-bg-alt rounded-2xl" />
              <div className="h-48 bg-brand-bg-alt rounded-2xl" />
            </div>
            <div className="h-[400px] bg-brand-bg-alt rounded-2xl" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !property) {
    return (
      <DashboardLayout>
        <div className="max-w-xl mx-auto mt-12 text-center px-4">
          <div className="w-16 h-16 bg-brand-red-bg border border-brand-red-border text-brand-red rounded-full flex items-center justify-center mx-auto mb-6">
            <Info size={28} />
          </div>
          <h2 className="text-xl font-bold text-brand-navy mb-2">Error Loading Property</h2>
          <p className="text-sm text-brand-slate mb-6">{error || "The property could not be found."}</p>
          <BackButton
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-navy text-white text-sm font-semibold rounded-xl no-underline hover:opacity-90 transition-opacity border-none cursor-pointer"
          />
        </div>
      </DashboardLayout>
    );
  }

  // Calculate market valuations using same logic as PortfolioCard
  const valuation = calculateValuation({
    totalPricePaid: property.totalPricePaid,
    superArea: property.superArea,
    projectType: property.projectType
  });

  const handleDownloadPDF = () => {
    if (!property || !valuation) return;
    generateValuationPDF(property, valuation);
  };

  const getTimelineData = () => {
    if (!property || !valuation) return [];

    const currentYear = new Date().getFullYear();
    let startYear = null;

    if (property.possessionStatus === "Already Taken" && property.possessionDateYear) {
      startYear = parseInt(property.possessionDateYear);
    } else if (property.expectedPossessionYear) {
      startYear = parseInt(property.expectedPossessionYear);
    }

    if (!startYear || startYear > currentYear || startYear < 2000) {
      startYear = currentYear - 4;
    }

    const yearsDiff = currentYear - startYear;

    let points = [];
    if (yearsDiff > 0) {
      for (let i = 0; i <= yearsDiff; i++) {
        const year = startYear + i;
        const ratio = i / yearsDiff;
        const value = Math.round(valuation.price + (valuation.currentMarketValue - valuation.price) * ratio);
        points.push({
          year: year.toString(),
          value: value,
          label: i === 0 ? "Purchase" : i === yearsDiff ? "Current Demo" : "Intermediate"
        });
      }
    } else {
      const pointLabels = ["Purchase", "Interval 1", "Interval 2", "Interval 3", "Current Demo"];
      for (let i = 0; i < 5; i++) {
        const ratio = i / 4;
        const value = Math.round(valuation.price + (valuation.currentMarketValue - valuation.price) * ratio);
        points.push({
          year: pointLabels[i],
          value: value,
          label: i === 0 ? "Purchase" : i === 4 ? "Current Demo" : "Intermediate"
        });
      }
    }

    return points;
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto pb-12 px-2 sm:px-4">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between mb-6">
          <BackButton
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-slate hover:text-brand-navy no-underline transition-colors bg-transparent border-none p-0 cursor-pointer"
          />
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadPDF}
              className="btn-primary px-3.5 py-1.5 text-[11px]"
            >
              <Download size={13} /> Download Report
            </button>
            <div className="badge-translucent bg-brand-navy/5 text-brand-navy-mid border border-brand-border-mid px-3 py-1.5 normal-case rounded-xl font-bold">
              {property.currentUse || "Portfolio Asset"}
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden border border-brand-border bg-brand-bg-card shadow-brand mb-8 transition-all duration-300 hover:shadow-brand-md">
          {/* Main Visual Header Image with overlays or dark gradient placeholder */}
          <div className="relative h-[220px] sm:h-[300px] w-full overflow-hidden">
            {property.image ? (
              <>
                <img 
                  src={property.image} 
                  alt={property.projectName} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/45 to-transparent" />
              </>
            ) : (
              <div className="absolute inset-0 bg-linear-to-br from-brand-navy-deep via-brand-navy to-brand-navy-mid">
                {/* Subtle mesh background grid */}
                <div 
                  className="absolute inset-0 opacity-15 pointer-events-none" 
                  style={{ 
                    backgroundImage: "radial-gradient(var(--color-brand-border) 1.2px, transparent 1.2px)", 
                    backgroundSize: "24px 24px" 
                  }} 
                />
                <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(circle_at_top_right,rgba(50,95,236,0.18),transparent_70%)] pointer-events-none" />
                <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[radial-gradient(circle_at_bottom_left,rgba(81,143,255,0.08),transparent_70%)] pointer-events-none" />
                
                {/* Building icon in background */}
                <Building2 size={120} className="text-white/4 absolute right-10 bottom-4 pointer-events-none" />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
              </div>
            )}
            
            {/* Overlay Info */}
            <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 z-10">
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase bg-black/55 backdrop-blur-xs text-white border border-white/10 px-2.5 py-1 rounded-full mb-2.5 inline-block">
                  {property.projectType || "Residential"}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight m-0 mb-1.5 text-white">
                  {property.projectName}
                </h1>
                <p className="text-xs sm:text-sm text-white/90 flex items-center gap-1.5 font-medium m-0">
                  <MapPin size={16} className="text-white/70" />
                  {property.locality}, {property.city}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-[10px] text-white/60 font-semibold uppercase tracking-wider mb-1 m-0">Est. Appreciation</p>
                  <div className={`inline-flex items-center gap-1 text-sm sm:text-base font-bold px-3 py-1 rounded-lg bg-black/40 backdrop-blur-[4px] border ${
                    valuation.gain >= 0 ? "text-emerald-400 border-emerald-500/30" : "text-rose-400 border-rose-500/30"
                  }`}>
                    {valuation.gain >= 0 ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
                    {valuation.gain >= 0 ? "+" : ""}{valuation.gainPct}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Financial Overview Dashboard */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="card-frame p-4 sm:p-5 hover:transform-none">
            <p className="text-[10px] sm:text-[11px] font-semibold text-brand-slate uppercase tracking-wider mb-1 m-0">Purchase Price</p>
            <p className="text-lg sm:text-2xl font-extrabold text-brand-navy m-0">{formatCurrency(valuation.price)}</p>
            <p className="text-[10px] text-brand-slate-light mt-1 m-0">₹{(valuation.price / property.superArea).toFixed(0)}/sq.ft cost rate</p>
          </div>
          <div className="card-frame p-4 sm:p-5 hover:transform-none">
            <p className="text-[10px] sm:text-[11px] font-semibold text-brand-slate uppercase tracking-wider mb-1 m-0">Demo Valuation Estimate</p>
            <p className="text-lg sm:text-2xl font-extrabold text-brand-navy m-0">{formatCurrency(valuation.currentMarketValue)}</p>
            <p className="text-[10px] text-brand-blue mt-1 m-0 font-medium">₹{valuation.medianRate}/sq.ft current estimate</p>
          </div>
          <div className="card-frame p-4 sm:p-5 hover:transform-none">
            <p className="text-[10px] sm:text-[11px] font-semibold text-brand-slate uppercase tracking-wider mb-1 m-0">Estimated Gain / Loss</p>
            <p className={`text-lg sm:text-2xl font-extrabold m-0 ${valuation.gain >= 0 ? "text-brand-emerald" : "text-brand-red"}`}>
              {valuation.gain >= 0 ? "+" : ""}{formatCurrency(valuation.gain)}
            </p>
            <p className={`text-[10px] font-semibold ${valuation.gain >= 0 ? "text-brand-emerald" : "text-brand-red"} mt-1 m-0 flex items-center gap-0.5`}>
              {valuation.gain >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {valuation.gainPct}% total returns
            </p>
          </div>
          <div className="card-frame p-4 sm:p-5 hover:transform-none">
            <p className="text-[10px] sm:text-[11px] font-semibold text-brand-slate uppercase tracking-wider mb-1 m-0">Yield & Income</p>
            <p className="text-lg sm:text-2xl font-extrabold text-brand-navy m-0">
              {property.rentalIncome === "Yes" ? formatCurrency(property.monthlyRent) : "₹0"}
            </p>
            <p className="text-[10px] text-brand-slate-light mt-1 m-0">
              {property.rentalIncome === "Yes" 
                ? `${((Number(property.monthlyRent) * 12 / valuation.price) * 100).toFixed(2)}% rental yield` 
                : "No rental income configured"}
            </p>
          </div>
        </div>

        {/* Prototype Warning Banner */}
        <div className="alert-blue items-center mb-8">
          <Info size={18} className="text-brand-blue flex-shrink-0" />
          <p className="text-xs text-brand-blue-dark font-semibold m-0 leading-relaxed">
            Prototype valuation based on user-provided purchase data. Real market intelligence integration coming soon.
          </p>
        </div>

        {/* Detailed Grid: Specs + Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details Panel */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Property Performance */}
            <div className="card-frame p-5 sm:p-6 hover:transform-none">
              <h3 className="text-[15px] sm:text-[16px] font-extrabold text-brand-navy mb-4 border-b border-brand-border pb-3 flex items-center gap-2 m-0">
                <Activity size={18} className="text-brand-blue" /> Property Performance
              </h3>
              
              {/* Performance Chart Component */}
              <div className="mb-6">
                <PerformanceChart data={getTimelineData()} />
              </div>

              {/* Grid Statistics Below Chart */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-brand-bg-card shadow-xs border border-brand-border mb-4">
                <div>
                  <p className="text-[10px] text-brand-slate uppercase font-bold m-0 mb-1 tracking-wider">Purchase Price</p>
                  <p className="text-sm sm:text-base font-extrabold text-brand-navy m-0">{formatCurrency(valuation.price)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-brand-slate uppercase font-bold m-0 mb-1 tracking-wider">Demo Valuation</p>
                  <p className="text-sm sm:text-base font-extrabold text-brand-navy m-0">{formatCurrency(valuation.currentMarketValue)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-brand-slate uppercase font-bold m-0 mb-1 tracking-wider">Estimated Gain</p>
                  <p className={`text-sm sm:text-base font-extrabold m-0 ${valuation.gain >= 0 ? "text-brand-emerald" : "text-brand-red"}`}>
                    {valuation.gain >= 0 ? "+" : ""}{formatCurrency(valuation.gain)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-brand-slate uppercase font-bold m-0 mb-1 tracking-wider">Appreciation %</p>
                  <p className={`text-sm sm:text-base font-extrabold m-0 ${valuation.gain >= 0 ? "text-brand-emerald" : "text-brand-red"}`}>
                    {valuation.gain >= 0 ? "+" : ""}{valuation.gainPct}%
                  </p>
                </div>
              </div>

              {/* Small Insight Box */}
              <div className="p-3.5 rounded-xl bg-brand-blue-bg border border-brand-blue-border flex items-start gap-2.5">
                <TrendingUp size={16} className="text-brand-blue mt-0.5 flex-shrink-0" />
                <p className="text-xs text-brand-blue-dark font-semibold m-0 leading-relaxed">
                  Your property has an estimated appreciation of <span className="font-extrabold">{valuation.gainPct}%</span> since acquisition.
                </p>
              </div>
            </div>

            {/* Property Overview */}
            <div className="card-frame p-5 sm:p-6 hover:transform-none">
              <h3 className="text-[15px] sm:text-[16px] font-extrabold text-brand-navy mb-4 border-b border-brand-border pb-3 flex items-center gap-2 m-0">
                <Building2 size={18} className="text-brand-slate" /> Property Overview
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                <div className="flex flex-col gap-0.5 py-2 border-b border-brand-border/60">
                  <span className="text-[10px] text-brand-slate font-medium">Builder / Developer</span>
                  <span className="text-[13px] font-bold text-brand-navy">{property.builderName}</span>
                </div>
                <div className="flex flex-col gap-0.5 py-2 border-b border-brand-border/60">
                  <span className="text-[10px] text-brand-slate font-medium">Project Name</span>
                  <span className="text-[13px] font-bold text-brand-navy">{property.projectName}</span>
                </div>
                <div className="flex flex-col gap-0.5 py-2 border-b border-brand-border/60">
                  <span className="text-[10px] text-brand-slate font-medium">Unit / Apartment</span>
                  <span className="text-[13px] font-bold text-brand-navy">{property.unitName || "Not configured"}</span>
                </div>
                <div className="flex flex-col gap-0.5 py-2 border-b border-brand-border/60">
                  <span className="text-[10px] text-brand-slate font-medium">Property Type</span>
                  <span className="text-[13px] font-bold text-brand-navy">{property.projectType}</span>
                </div>
                <div className="flex flex-col gap-0.5 py-2 border-b border-brand-border/60">
                  <span className="text-[10px] text-brand-slate font-medium">Super Area</span>
                  <span className="text-[13px] font-bold text-brand-navy">{property.superArea} sqft</span>
                </div>
                <div className="flex flex-col gap-0.5 py-2 border-b border-brand-border/60">
                  <span className="text-[10px] text-brand-slate font-medium">Carpet Area</span>
                  <span className="text-[13px] font-bold text-brand-navy">{property.carpetArea} sqft</span>
                </div>
                <div className="flex flex-col gap-0.5 py-2 border-b border-brand-border/60">
                  <span className="text-[10px] text-brand-slate font-medium">Floor Number</span>
                  <span className="text-[13px] font-bold text-brand-navy">{property.floorNumber ? `Floor ${property.floorNumber}` : "Not configured"}</span>
                </div>
                <div className="flex flex-col gap-0.5 py-2 border-b border-brand-border/60">
                  <span className="text-[10px] text-brand-slate font-medium">Parking Spots</span>
                  <span className="text-[13px] font-bold text-brand-navy">{property.parkingSpots ? `${property.parkingSpots} Car parking(s)` : "None"}</span>
                </div>
              </div>
            </div>

            {/* Possession Details */}
            <div className="card-frame p-5 sm:p-6 hover:transform-none">
              <h3 className="text-[15px] sm:text-[16px] font-extrabold text-brand-navy mb-4 border-b border-brand-border pb-3 flex items-center gap-2 m-0">
                <Calendar size={18} className="text-brand-slate" /> Possession & Construction Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                <div className="flex flex-col gap-0.5 py-2 border-b border-brand-border/60">
                  <span className="text-[10px] text-brand-slate font-medium">Possession Status</span>
                  <span className="text-[13px] font-bold text-brand-navy">{property.possessionStatus}</span>
                </div>
                <div className="flex flex-col gap-0.5 py-2 border-b border-brand-border/60">
                  <span className="text-[10px] text-brand-slate font-medium">Date Details</span>
                  <span className="text-[13px] font-bold text-brand-navy">
                    {property.possessionStatus === "Already Taken"
                      ? `${property.possessionDateMonth || ""} ${property.possessionDateYear || "N/A"}`
                      : `${property.expectedPossessionMonth || ""} ${property.expectedPossessionYear || "N/A"}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Financial Details (Rental & Loans) */}
            <div className="card-frame p-5 sm:p-6 hover:transform-none">
              <h3 className="text-[15px] sm:text-[16px] font-extrabold text-brand-navy mb-4 border-b border-brand-border pb-3 flex items-center gap-2 m-0">
                <Landmark size={18} className="text-brand-slate" /> Financials, Rent & Loans
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Loan Column */}
                <div>
                  <h4 className="text-[11px] font-bold text-brand-navy uppercase tracking-wider mb-2.5 flex items-center gap-1.5 m-0">
                    <span className="w-1.5 h-1.5 bg-brand-blue rounded-full" /> Loan Details
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between py-1.5 border-b border-brand-border">
                      <span className="text-xs text-brand-slate">Ongoing Loan</span>
                      <span className="text-xs font-bold text-brand-navy">{property.ongoingLoan}</span>
                    </div>
                    {property.ongoingLoan === "Yes" && (
                      <>
                        <div className="flex justify-between py-1.5 border-b border-brand-border">
                          <span className="text-xs text-brand-slate">Bank Partner</span>
                          <span className="text-xs font-bold text-brand-navy">{property.bankName || "Not configured"}</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-brand-border">
                          <span className="text-xs text-brand-slate">Monthly EMI</span>
                          <span className="text-xs font-bold text-brand-navy">{formatCurrency(property.monthlyEMI)}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Rent Column */}
                <div>
                  <h4 className="text-[11px] font-bold text-brand-navy uppercase tracking-wider mb-2.5 flex items-center gap-1.5 m-0">
                    <span className="w-1.5 h-1.5 bg-brand-blue rounded-full" /> Rental Details
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between py-1.5 border-b border-brand-border">
                      <span className="text-xs text-brand-slate">Generates Rent</span>
                      <span className="text-xs font-bold text-brand-navy">{property.rentalIncome}</span>
                    </div>
                    {property.rentalIncome === "Yes" && (
                      <div className="flex justify-between py-1.5 border-b border-brand-border">
                        <span className="text-xs text-brand-slate">Monthly Rent</span>
                        <span className="text-xs font-bold text-brand-navy">{formatCurrency(property.monthlyRent)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div>
            <div className="sticky top-24 card-frame p-5 sm:p-6 hover:transform-none">
              <h3 className="text-[15px] sm:text-[16px] font-extrabold text-brand-navy mb-4 border-b border-brand-border pb-3 flex items-center gap-2 m-0">
                <Activity size={18} className="text-brand-blue" /> Property Actions
              </h3>
              <p className="text-xs text-brand-slate mb-5 leading-relaxed m-0">
                Take commercial actions, initiate listings, or request financial services backed by your real asset details.
              </p>
              
              {/* Action Buttons */}
              <div className="space-y-4">
                {/* Sell Action */}
                <div className="relative group p-4 rounded-xl border border-brand-border bg-brand-bg-card shadow-xs transition-all duration-200 hover:border-brand-border-mid">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-brand-navy flex items-center gap-1.5">
                      <Coins size={16} className="text-brand-slate" /> I Want To Sell
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-brand-border-mid text-brand-slate px-2 py-0.5 rounded">
                      Coming Soon
                    </span>
                  </div>
                  <p className="text-[11px] text-brand-slate leading-relaxed m-0">
                    Generate premium buyer matching alerts and auto-evaluate estimated capital gains tax liabilities.
                  </p>
                  <button 
                    disabled 
                    className="w-full py-2 bg-brand-bg-alt text-brand-slate-light border border-brand-border rounded-lg text-[12px] font-bold mt-3 cursor-not-allowed"
                  >
                    List Property For Sale
                  </button>
                </div>

                {/* Rent Action */}
                <div className="relative group p-4 rounded-xl border border-brand-border bg-brand-bg-card shadow-xs transition-all duration-200 hover:border-brand-border-mid">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-brand-navy flex items-center gap-1.5">
                      <Key size={16} className="text-brand-slate" /> I Want To Rent
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-brand-border-mid text-brand-slate px-2 py-0.5 rounded">
                      Coming Soon
                    </span>
                  </div>
                  <p className="text-[11px] text-brand-slate leading-relaxed m-0">
                    Instantly post to our verified tenant directory, structure digital leases, and analyze local yield indices.
                  </p>
                  <button 
                    disabled 
                    className="w-full py-2 bg-brand-bg-alt text-brand-slate-light border border-brand-border rounded-lg text-[12px] font-bold mt-3 cursor-not-allowed"
                  >
                    List Property For Rent
                  </button>
                </div>

                {/* Liquidity Action */}
                <div className="relative group p-4 rounded-xl border border-brand-border bg-brand-bg-card shadow-xs transition-all duration-200 hover:border-brand-border-mid">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-brand-navy flex items-center gap-1.5">
                      <Percent size={16} className="text-brand-slate" /> I Want Liquidity
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-brand-border-mid text-brand-slate px-2 py-0.5 rounded">
                      Coming Soon
                    </span>
                  </div>
                  <p className="text-[11px] text-brand-slate leading-relaxed mb-3 m-0">
                    Unlock real asset equity without selling. Borrow dynamically with seamless collateral logs.
                  </p>
                  
                  {/* LAP Informational Block */}
                  <div className="p-3 rounded-lg bg-brand-blue-bg border border-brand-blue-border text-[10px] text-brand-blue-dark leading-relaxed font-semibold">
                    <strong>Future Loan-Against-Property:</strong> Get real-time offers from 12+ premium bank partners. Compare eligible loan amounts (up to 75% LTV), flexible tenures (up to 20 years), and custom EMI insights tailored to your property valuation.
                  </div>

                  <button 
                    disabled 
                    className="w-full py-2 bg-brand-bg-alt text-brand-slate-light border border-brand-border rounded-lg text-[12px] font-bold mt-3 cursor-not-allowed"
                  >
                    Explore Liquidity Options
                  </button>
                </div>

                {/* Remove Property Action */}
                <div className="relative group p-4 rounded-xl border border-brand-red-border bg-brand-red-bg transition-all duration-200 hover:border-red-300">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-brand-navy flex items-center gap-1.5">
                      <Trash2 size={16} className="text-brand-red" /> Remove Property
                    </span>
                  </div>
                  <p className="text-[11px] text-brand-slate leading-relaxed m-0">
                    Stop tracking this asset. This will permanently remove its purchase records, metrics, and history from your dashboard.
                  </p>
                  <button 
                    onClick={() => {
                      setDeleteConfirmationInput("");
                      setDeleteError("");
                      setDeleteModalOpen(true);
                    }}
                    className="w-full py-2.5 bg-brand-red hover:bg-brand-red/90 text-white rounded-lg border-none text-[12px] font-bold mt-3 cursor-pointer transition-colors shadow-sm"
                  >
                    Delete Property
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal Popup */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div 
            className="absolute inset-0 bg-brand-navy/60 backdrop-blur-sm transition-opacity" 
            onClick={() => {
              if (!deleting) setDeleteModalOpen(false);
            }} 
          />
          
          <div className="relative w-full max-w-md bg-brand-bg-card rounded-3xl overflow-hidden shadow-2xl border border-brand-border p-6 sm:p-8 z-10 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-extrabold text-brand-navy mb-2 flex items-center gap-2">
              <Trash2 className="text-brand-red" size={24} /> Remove Property?
            </h3>
            
            <p className="text-xs sm:text-sm text-brand-slate leading-relaxed mb-5">
              You are about to stop tracking <strong className="text-brand-navy font-bold">{property?.projectName || "this property"}</strong>. 
              This action is permanent and cannot be undone. All graphs, valuations, and reports for this asset will be lost.
            </p>
            
            {deleteError && (
              <div className="mb-4 p-3 bg-brand-red-bg border border-brand-red-border text-brand-red text-xs rounded-xl font-medium">
                {deleteError}
              </div>
            )}
            
            <div className="mb-6">
              <label htmlFor="confirmDeleteInput" className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">
                Type <span className="text-brand-red select-all font-mono">deleteproperty</span> to confirm:
              </label>
              <input
                id="confirmDeleteInput"
                type="text"
                autoComplete="off"
                placeholder="type deleteproperty"
                value={deleteConfirmationInput}
                onChange={(e) => setDeleteConfirmationInput(e.target.value.toLowerCase().trim())}
                disabled={deleting}
                className="w-full px-4 py-3 rounded-xl border border-brand-border-mid focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red/20 bg-brand-bg-alt/50 text-brand-navy font-medium text-sm transition-all placeholder:text-brand-slate-light"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                disabled={deleting}
                className="flex-1 py-3 px-4 rounded-xl bg-brand-bg-alt hover:bg-brand-bg-alt/80 border border-brand-border-mid text-brand-navy text-sm font-bold cursor-pointer transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteProperty}
                disabled={deleting || deleteConfirmationInput !== "deleteproperty"}
                className="flex-1 py-3 px-4 rounded-xl bg-brand-red hover:bg-brand-red/90 border-none text-white text-sm font-bold cursor-pointer transition-colors shadow-sm disabled:opacity-50 disabled:bg-brand-slate-light/50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                {deleting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Permanently"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
