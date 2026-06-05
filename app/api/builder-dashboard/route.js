import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Builder from "@/models/Builder";
import MarketProject from "@/models/MarketProject";

export async function GET() {
  try {
    await connectToDatabase();

    // 1. Authenticate user from session token cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Token missing" },
        { status: 401 }
      );
    }

    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (err) {
      console.error("Invalid token on API builder dashboard:", err);
      return NextResponse.json(
        { success: false, error: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    const firebaseUid = decodedToken.uid;
    const user = await User.findOne({ firebaseUid }).lean();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found in database" },
        { status: 404 }
      );
    }

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

    // 5. Fetch projects matching this builderId relationship
    const projects = await MarketProject.find({ builderId: builder._id }).lean();

    return NextResponse.json({
      success: true,
      builder: {
        id: builder._id.toString(),
        name: builder.name,
        slug: builder.slug,
        status: builder.status,
      },
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

