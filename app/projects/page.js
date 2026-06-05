import React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Building, MapPin, ListFilter } from "lucide-react";
import connectToDatabase from "@/lib/db";
import MarketProject from "@/models/MarketProject";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PropertyGrid from "@/components/dashboard/PropertyGrid";
import ProjectsFilterClient from "./ProjectsFilterClient";
import { normalizeBuilder } from "@/utils/admin/normalization";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Browse Real Estate Projects & Properties | FollowProperty",
  description: "Explore our comprehensive directory of real estate developments, residential apartments, plots, and commercial projects. Filter by city, status, and developer.",
};

export default async function ProjectsPage({ searchParams }) {
  // Await page searchParams
  const params = await searchParams;
  const cityParam = params.city || "All";
  const builderParam = params.builder || "All";
  const propertyTypeParam = params.propertyType || "All";
  const statusParam = params.status || "All";
  const pageParam = parseInt(params.page, 10) || 1;

  await connectToDatabase();

  // 1. Fetch metadata lists for filter choices
  const rawCities = await MarketProject.distinct("city");
  const rawBuilders = await MarketProject.distinct("builderName");
  const rawPropertyTypes = await MarketProject.distinct("propertyType");
  const rawStatuses = await MarketProject.distinct("status");

  // Normalize data lists
  const cities = rawCities.filter(Boolean).sort();
  const propertyTypes = rawPropertyTypes.filter(Boolean).sort();
  const statuses = rawStatuses.filter(Boolean).sort();

  // Normalize builders to group casing variations (e.g. DLF vs dlf)
  const normalizedBuildersSet = new Set();
  rawBuilders.forEach((b) => {
    if (b && b.trim()) {
      normalizedBuildersSet.add(normalizeBuilder(b.trim()));
    }
  });
  const buildersList = Array.from(normalizedBuildersSet).sort();

  // 2. Build Mongoose query
  const query = {};

  if (cityParam !== "All") {
    query.city = cityParam;
  }

  if (builderParam !== "All") {
    // Find all raw builder names in DB that match the selected normalized builder name
    const matchingRawNames = rawBuilders.filter(
      (name) => name && normalizeBuilder(name) === builderParam
    );
    query.builderName = { $in: matchingRawNames };
  }

  if (propertyTypeParam !== "All") {
    query.propertyType = propertyTypeParam;
  }

  if (statusParam !== "All") {
    query.status = statusParam;
  }

  // 3. Pagination limits (12 items per page)
  const limit = 12;
  const skip = (pageParam - 1) * limit;

  // 4. Fetch matching projects & total counts
  const dbProjects = await MarketProject.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const totalProjects = await MarketProject.countDocuments(query);
  const totalPages = Math.ceil(totalProjects / limit);

  // 5. Map DB records to clean PropertyCard format
  const mappedProperties = dbProjects.map((p) => {
    const isReady =
      p.status === "Ready" ||
      p.status === "Ready to Move" ||
      p.status === "Completed";

    return {
      id: p._id.toString(),
      _id: p._id.toString(),
      title: p.projectName,
      projectName: p.projectName,
      status: isReady ? "Ready to Move" : "Under Construction",
      specificType:
        p.configuration ||
        (p.bhk && p.bhk.length > 0 ? `${p.bhk.join(", ")} BHK` : p.propertyType || "Residential"),
      locality: p.locality || p.location || "Local",
      city: p.city || "",
      builder: normalizeBuilder(p.builderName),
      possessionYear: p.possessionYear === 0 ? "Ready to Move" : p.possessionYear || p.possessionDate || "TBD",
      superArea: p.superArea ? parseFloat(p.superArea.replace(/,/g, "")) : (p.avgAreaSqft ? parseFloat(p.avgAreaSqft.replace(/,/g, "")) : 0),
      minPrice: p.minPrice || 0,
      maxPrice: p.maxPrice || 0,
      marketPrice: p.marketPrice,
    };
  });

  // Helper function to reconstruct pagination URLs preserving query parameters
  const buildPageLink = (pageNum) => {
    const linkParams = new URLSearchParams();
    if (cityParam !== "All") linkParams.set("city", cityParam);
    if (builderParam !== "All") linkParams.set("builder", builderParam);
    if (propertyTypeParam !== "All") linkParams.set("propertyType", propertyTypeParam);
    if (statusParam !== "All") linkParams.set("status", statusParam);
    linkParams.set("page", pageNum.toString());
    return `/projects?${linkParams.toString()}`;
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto pb-16">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-brand-navy mb-1.5 tracking-tight flex items-center gap-2.5">
            <ListFilter className="text-brand-teal" size={28} /> Projects Directory
          </h1>
          <p className="text-xs sm:text-sm text-brand-slate m-0">
            Explore verified market properties, compare layouts, check construction milestones, and navigate developer profiles.
          </p>
        </div>

        {/* Filter Bar Component */}
        <ProjectsFilterClient
          cities={cities}
          builders={buildersList}
          propertyTypes={propertyTypes}
          statuses={statuses}
          currentFilters={{
            city: cityParam,
            builder: builderParam,
            propertyType: propertyTypeParam,
            status: statusParam,
          }}
        />

        {/* Results Info */}
        <div className="mb-4 text-xs text-brand-slate font-bold flex items-center justify-between">
          <span>
            Showing {mappedProperties.length} of {totalProjects} total properties
          </span>
          {pageParam > 1 && <span>Page {pageParam} of {totalPages}</span>}
        </div>

        {/* Listings Grid */}
        {mappedProperties.length > 0 ? (
          <div>
            <PropertyGrid properties={mappedProperties} />

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-4 border-t border-brand-border pt-6">
                {/* Previous Button */}
                {pageParam > 1 ? (
                  <Link
                    id="prev-page-link"
                    href={buildPageLink(pageParam - 1)}
                    className="inline-flex items-center gap-1 px-4 py-2.5 bg-brand-bgCard text-brand-tealDark border border-brand-tealBorder rounded-xl text-xs font-bold transition-all hover:bg-brand-teal hover:text-white no-underline shadow-brand"
                  >
                    <ChevronLeft size={14} /> Previous
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1 px-4 py-2.5 bg-brand-bgAlt text-brand-slateLight border border-brand-border rounded-xl text-xs font-bold cursor-not-allowed opacity-60">
                    <ChevronLeft size={14} /> Previous
                  </span>
                )}

                {/* Page Indicator */}
                <span className="text-xs text-brand-navy font-extrabold px-3 py-1 bg-brand-bgAlt rounded-lg">
                  Page {pageParam} of {totalPages}
                </span>

                {/* Next Button */}
                {pageParam < totalPages ? (
                  <Link
                    id="next-page-link"
                    href={buildPageLink(pageParam + 1)}
                    className="inline-flex items-center gap-1 px-4 py-2.5 bg-brand-bgCard text-brand-tealDark border border-brand-tealBorder rounded-xl text-xs font-bold transition-all hover:bg-brand-teal hover:text-white no-underline shadow-brand"
                  >
                    Next <ChevronRight size={14} />
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1 px-4 py-2.5 bg-brand-bgAlt text-brand-slateLight border border-brand-border rounded-xl text-xs font-bold cursor-not-allowed opacity-60">
                    Next <ChevronRight size={14} />
                  </span>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-brand-bgCard rounded-3xl border border-brand-border p-12 text-center shadow-brand">
            <Building className="mx-auto text-brand-slateLight mb-4" size={48} />
            <h3 className="text-base font-extrabold text-brand-navy mb-1">No Properties Found</h3>
            <p className="text-xs text-brand-slate max-w-sm mx-auto mb-0">
              There are no matching properties listed under these filter conditions. Try resetting your search parameters.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
