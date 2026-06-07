import { NextResponse } from "next/server";
import { verifyAuthRequest } from "@/lib/auth-guards";
import connectToDatabase from "@/lib/db";
import Builder from "@/models/Builder";
import MarketProject from "@/models/MarketProject";
import { 
  normalizeTitleCase, 
  normalizeLocality, 
  normalizeCity,
  formatMarketPriceRange
} from "@/utils/admin/normalization";

export async function POST(req) {
  try {
    const authResult = await verifyAuthRequest({ checkRevoked: true });
    if (!authResult.authenticated) {
      const response = NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
      response.cookies.set("token", "", { expires: new Date(0), path: "/" });
      response.cookies.set("user_role", "", { expires: new Date(0), path: "/" });
      response.cookies.set("builder_status", "", { expires: new Date(0), path: "/" });
      return response;
    }

    const { user } = authResult;
    await connectToDatabase();

    // 2. Enforce Builder Role check
    if (user.role !== "builder") {
      return NextResponse.json(
        { success: false, error: "Access Denied: Restricted to builder role" },
        { status: 403 }
      );
    }

    // 3. Validate builderId is linked
    if (!user.builderId) {
      return NextResponse.json(
        { success: false, error: "Profile Link Missing: No builder profile linked to user account" },
        { status: 403 }
      );
    }

    // 4. Fetch Builder profile document
    const builder = await Builder.findById(user.builderId).lean();
    if (!builder) {
      return NextResponse.json(
        { success: false, error: "Builder Profile Offline: Linked profile not found or deactivated" },
        { status: 404 }
      );
    }

    // 5. Parse request body
    const body = await req.json();
    const {
      projectName: rawProjectName,
      city: rawCity,
      locality: rawLocality,
      propertyType,
      minPrice: rawMinPrice,
      maxPrice: rawMaxPrice
    } = body;

    // Validate required fields
    if (!rawProjectName || !rawCity || !rawLocality || !propertyType) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: projectName, city, locality, propertyType" },
        { status: 400 }
      );
    }

    const minPrice = parseInt(rawMinPrice, 10);
    const maxPrice = parseInt(rawMaxPrice, 10);

    if (isNaN(minPrice) || isNaN(maxPrice) || minPrice <= 0 || maxPrice <= 0) {
      return NextResponse.json(
        { success: false, error: "Price indices must be positive numbers" },
        { status: 400 }
      );
    }

    if (maxPrice < minPrice) {
      return NextResponse.json(
        { success: false, error: "Maximum price cannot be less than minimum price" },
        { status: 400 }
      );
    }

    // 6. Normalization pipeline
    const projectName = normalizeTitleCase(rawProjectName);
    const { city, state } = normalizeCity(rawCity);
    const locality = normalizeLocality(rawLocality);
    const marketPrice = formatMarketPriceRange(minPrice, maxPrice);
    const location = `${locality}, ${city}`;

    // 7. Prevent exact duplicate project under this builder
    const duplicate = await MarketProject.findOne({
      projectName,
      builderId: builder._id,
      city
    });

    if (duplicate) {
      return NextResponse.json(
        { success: false, error: `A project named "${projectName}" is already registered under your account in ${city}.` },
        { status: 409 }
      );
    }

    // 8. Create pending project document
    const project = await MarketProject.create({
      projectName,
      builderName: builder.name,
      builderId: builder._id,
      propertyType,
      status: "Under Construction", // Default for newly submitted properties
      city,
      state,
      locality,
      location,
      bhk: [],
      minPrice,
      maxPrice,
      marketPrice,
      possessionYear: 0,
      configuration: "N/A",
      moderationStatus: "pending" // Force pending status (Phase 1)
    });

    console.log(`[Builder Project Ingestion] Saved pending project "${projectName}" (${project._id}) for builder ${builder.name}`);

    return NextResponse.json(
      { success: true, data: project },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/projects:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Server error occurred" },
      { status: 500 }
    );
  }
}
