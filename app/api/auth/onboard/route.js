import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function PATCH() {
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

    const user = await User.findOneAndUpdate(
      { firebaseUid },
      { isOnboarded: true },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found in database" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    console.error("Error in PATCH /api/auth/onboard:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Server error occurred during onboarding toggle" },
      { status: 500 }
    );
  }
}
