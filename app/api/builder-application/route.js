import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import BuilderApplication from "@/models/BuilderApplication";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectToDatabase();

    // Get authenticated user from session cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const decodedToken = await adminAuth.verifyIdToken(token);
    const firebaseUid = decodedToken.uid;

    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found in database" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const {
      builderName,
      companyName,
      contactPersonName,
      phone,
      email,
      city,
      website,
      reraNumber,
    } = body;

    // Validate required fields
    if (!builderName || !companyName || !contactPersonName || !phone || !email || !city) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Upsert or update BuilderApplication
    const application = await BuilderApplication.findOneAndUpdate(
      { userId: user._id },
      {
        builderName: builderName.trim(),
        companyName: companyName.trim(),
        contactPersonName: contactPersonName.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        city: city.trim(),
        website: website ? website.trim() : "",
        reraNumber: reraNumber ? reraNumber.trim() : "",
        status: "pending",
      },
      { new: true, upsert: true }
    );

    return NextResponse.json(
      { success: true, data: application },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST /api/builder-application:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Server error occurred" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();

    // Get authenticated user from session cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const decodedToken = await adminAuth.verifyIdToken(token);
    const firebaseUid = decodedToken.uid;

    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found in database" },
        { status: 404 }
      );
    }

    const application = await BuilderApplication.findOne({ userId: user._id }).lean();

    return NextResponse.json(
      { success: true, data: application },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET /api/builder-application:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Server error occurred" },
      { status: 500 }
    );
  }
}
