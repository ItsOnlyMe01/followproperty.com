import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Builder from "@/models/Builder";
import MarketProject from "@/models/MarketProject";

export async function GET() {
  try {
    await connectToDatabase();

    // 1. Fetch first active builder. Fall back to any builder if no active ones.
    let builder = await Builder.findOne({ status: "active" }).lean();
    if (!builder) {
      builder = await Builder.findOne({}).lean();
    }

    // 2. Fetch projects for this builder if it exists
    let projects = [];
    if (builder) {
      projects = await MarketProject.find({ builderId: builder._id }).lean();
    }

    return NextResponse.json({
      success: true,
      builder: builder
        ? {
            id: builder._id.toString(),
            name: builder.name,
            slug: builder.slug,
            status: builder.status,
          }
        : null,
      projects: projects.map((p) => ({
        id: p._id.toString(),
        projectName: p.projectName,
        city: p.city || "",
        locality: p.locality || "",
        propertyType: p.propertyType || "Residential",
        status: p.status || "Under Construction",
        minPrice: p.minPrice || 0,
        maxPrice: p.maxPrice || 0,
      })),
    });
  } catch (error) {
    console.error("Error in GET /api/builder-dashboard:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Server error occurred" },
      { status: 500 }
    );
  }
}
