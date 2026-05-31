"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatsCards from "@/components/dashboard/StatsCards";
import PropertyGrid from "@/components/dashboard/PropertyGrid";
import EmptyState from "@/components/dashboard/EmptyState";
import PortfolioCard from "@/components/dashboard/PortfolioCard";
import { filterProperties } from "@/utils/filterProperties";

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState(null);
  const [portfolios, setPortfolios] = useState([]);
  const [loadingPortfolios, setLoadingPortfolios] = useState(true);
  const [portfolioError, setPortfolioError] = useState("");

  const [watchlists, setWatchlists] = useState([]);
  const [loadingWatchlists, setLoadingWatchlists] = useState(true);
  const [watchlistError, setWatchlistError] = useState("");

  useEffect(() => {
    setMounted(true);

    // Fetch portfolio properties from GET /api/portfolio
    async function fetchPortfolios() {
      try {
        setLoadingPortfolios(true);
        const res = await fetch("/api/portfolio");
        if (!res.ok) {
          throw new Error("Failed to fetch portfolios");
        }
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const formatted = json.data.map((item) => ({
            ...item,
            id: item._id || item.id,
          }));
          setPortfolios(formatted);
        } else {
          throw new Error(json.error || "Failed to load portfolios");
        }
      } catch (err) {
        console.error("Error loading portfolio properties:", err);
        setPortfolioError(err.message || "Could not fetch portfolios.");
      } finally {
        setLoadingPortfolios(false);
      }
    }

    // Fetch watchlists from GET /api/watchlist (MongoDB source of truth)
    async function fetchWatchlists() {
      try {
        setLoadingWatchlists(true);
        const res = await fetch("/api/watchlist");
        if (!res.ok) {
          throw new Error("Failed to fetch watchlists");
        }
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setWatchlists(json.data);
          
          if (json.data.length > 0) {
            const latestWatchlist = json.data[0];
            setFilters(latestWatchlist);
            
            // Sync to sessionStorage as optional cache layer
            sessionStorage.setItem("watchlistFilters", JSON.stringify(latestWatchlist));
            
            // Populate matching recommendations
            const matched = filterProperties(latestWatchlist);
            setProperties(matched);
          } else {
            // No watchlist exists in database
            setFilters(null);
            setProperties([]);
            sessionStorage.removeItem("watchlistFilters");
          }
        } else {
          throw new Error(json.error || "Failed to load watchlists.");
        }
      } catch (err) {
        console.error("Error loading watchlists:", err);
        setWatchlistError(err.message || "Could not fetch watchlist.");
        
        // Fallback to sessionStorage optional cache layer if server API fails
        const cachedFilters = sessionStorage.getItem("watchlistFilters");
        if (cachedFilters) {
          try {
            const parsed = JSON.parse(cachedFilters);
            setFilters(parsed);
            const matched = filterProperties(parsed);
            setProperties(matched);
          } catch (e) {
            console.error("Failed to parse cached filters", e);
          }
        }
      } finally {
        setLoadingWatchlists(false);
      }
    }

    fetchPortfolios();
    fetchWatchlists();
  }, []);

  if (!mounted) {
    // Return minimal skeleton shell during server rendering to prevent hydration mismatches
    return (
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-brand-navy mb-2 tracking-tight">
            Overview
          </h1>
          <p className="text-sm text-brand-slate mb-4">
            Loading dashboard...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Top Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-brand-navy mb-2 tracking-tight">
          Overview
        </h1>
        <p className="text-sm text-brand-slate mb-4">
          Welcome to your FollowProperty dashboard. Manage your portfolio and watchlists here.
        </p>
        
        {/* Watchlist match badge */}
        {!loadingWatchlists && watchlists.length > 0 && (
          <div className="inline-block bg-brand-tealBg px-3 py-1.5 rounded-lg border border-brand-tealBorder">
            <span className="text-xs font-semibold text-brand-tealDark">
              Showing {properties.length} matching propert{properties.length === 1 ? 'y' : 'ies'}
            </span>
          </div>
        )}
      </div>

      {/* Stats Cards - Only visible if watchlist is loaded and user has at least one watchlist */}
      {!loadingWatchlists && watchlists.length > 0 && (
        <StatsCards properties={properties} filters={filters} />
      )}

      {/* Portfolio Area */}
      {loadingPortfolios ? (
        <div className="mt-8">
          <h2 className="text-lg font-bold text-brand-navy mb-5">
            Your Portfolio
          </h2>
          <div className="py-4 text-xs text-brand-slate">
            Loading your portfolio from database...
          </div>
        </div>
      ) : portfolioError ? (
        <div className="mt-8">
          <h2 className="text-lg font-bold text-brand-navy mb-5">
            Your Portfolio
          </h2>
          <div className="py-3 px-4 rounded-xl bg-brand-redBg border border-brand-redBorder text-xs text-brand-red font-medium">
            {portfolioError}
          </div>
        </div>
      ) : portfolios.length > 0 ? (
        <div className="mt-8">
          <div className="flex flex-col gap-1.5 mb-5">
            <h2 className="text-lg font-bold text-brand-navy m-0">
              Your Portfolio
            </h2>
            <p className="text-[11px] text-brand-amber font-medium m-0">
              ⚠️ Prototype valuation based on user-provided purchase data. Real market intelligence integration coming soon.
            </p>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
            {portfolios.map((portfolio) => (
              <PortfolioCard key={portfolio.id} property={portfolio} />
            ))}
          </div>
        </div>
      ) : null}

      {/* Watchlist Setup / Recommended Matches Section */}
      {loadingWatchlists ? (
        <div className="mt-8 py-8 text-xs text-brand-slate">
          Loading buying requirements and matches...
        </div>
      ) : watchlists.length === 0 ? (
        /* Empty Watchlist State with CTA */
        <div className="bg-brand-bgCard rounded-3xl border border-brand-border p-8 sm:p-12 shadow-brand flex flex-col items-center text-center mt-8">
          <div className="w-16 h-16 rounded-2xl bg-brand-tealBg border border-brand-tealBorder/40 flex items-center justify-center mb-6">
            <Search className="text-brand-tealDark" size={32} />
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-brand-navy mb-3 tracking-tight">
            Set Up Your Target Watchlist
          </h3>
          <p className="text-sm text-brand-slate max-w-[460px] leading-relaxed mb-8">
            Tell us what kind of properties you are looking to buy. We will track builder progress, alert you on local price drops, and highlight locality risks.
          </p>
          <Link
            href="/watchlist"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-brand-teal text-white rounded-xl text-sm font-bold no-underline transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(13,148,136,0.3)] cursor-pointer"
          >
            Create Buying Requirement →
          </Link>
        </div>
      ) : (
        /* Recommended Matches Section */
        <div className="mt-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-brand-navy">
              Recommended Matches
            </h2>
            {filters && (
              <button
                onClick={() => {
                  sessionStorage.removeItem("watchlistFilters");
                  window.location.reload();
                }}
                className="bg-transparent border-none text-xs font-semibold text-brand-slate cursor-pointer underline hover:text-brand-navy transition-colors"
              >
                Reset Cache Filter
              </button>
            )}
          </div>

          {properties.length > 0 ? (
            <PropertyGrid properties={properties} />
          ) : (
            <EmptyState />
          )}
        </div>
      )}

      {/* Recent Alerts Section */}
      <div className="mt-8 mb-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-brand-navy">
            Recent alerts
          </h2>
          <button className="bg-transparent border-none text-xs font-semibold text-brand-navy cursor-pointer hover:underline">
            View all →
          </button>
        </div>
        <div className="bg-brand-redBg border border-brand-redBorder rounded-xl p-4 flex items-start gap-4">
          <div className="w-8 h-8 rounded-lg bg-brand-red text-white flex items-center justify-center font-bold flex-shrink-0">
            !
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-bold text-brand-navy">
                Builder delay reported in nearby project
              </h4>
              <span className="text-[10px] font-bold bg-brand-red text-white px-1.5 py-0.5 rounded uppercase">
                Negative
              </span>
            </div>
            <p className="text-xs text-brand-slate mb-2">
              Skyline Residency · 2 days ago
            </p>
            <p className="text-xs text-brand-navyMid">
              Prestige Lakeside Habitat shows 6-month possession delay; may impact resale sentiment in Whitefield.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
