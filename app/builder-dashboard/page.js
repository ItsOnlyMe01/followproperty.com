import React from "react";
import connectToDatabase from "@/lib/db";
import Builder from "@/models/Builder";
import MarketProject from "@/models/MarketProject";
import BuilderDashboardClient from "@/components/builder/BuilderDashboardClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Builder Workspace Dashboard | FollowProperty",
  description: "Monitor developer profiles, manage active projects, and list launching properties on the FollowProperty directory.",
};

export default async function BuilderDashboardPage() {
  await connectToDatabase();

  // 1. Fetch first active builder, falling back to any builder if no active ones exist
  let builderDoc = await Builder.findOne({ status: "active" }).lean();
  if (!builderDoc) {
    builderDoc = await Builder.findOne({}).lean();
  }

  // 2. Fetch projects matching this builderId relationship
  let projectsDocs = [];
  if (builderDoc) {
    projectsDocs = await MarketProject.find({ builderId: builderDoc._id }).lean();
  }

  // 3. Serialize Mongoose documents safely to pass to client component
  const builder = builderDoc
    ? {
        id: builderDoc._id.toString(),
        name: builderDoc.name,
        slug: builderDoc.slug,
        status: builderDoc.status,
      }
    : null;

  const projects = projectsDocs.map((p) => ({
    id: p._id.toString(),
    projectName: p.projectName,
    city: p.city || "",
    locality: p.locality || "",
    propertyType: p.propertyType || "Residential",
    status: p.status || "Under Construction",
    minPrice: p.minPrice || 0,
    maxPrice: p.maxPrice || 0,
  }));

  return (
    <BuilderDashboardClient
      initialBuilder={builder}
      initialProjects={projects}
    />
  );
}
