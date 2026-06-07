import { verifyAuthRequest } from "@/lib/auth-guards";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function PATCH() {
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

    const { decodedToken } = authResult;
    const firebaseUid = decodedToken.uid;
    await connectToDatabase();

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
