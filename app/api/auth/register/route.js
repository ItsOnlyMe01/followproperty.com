import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { firebaseUid, email, firstName, lastName, phoneNumber, city, state } = body;

    if (!firebaseUid || !email) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: firebaseUid and email" },
        { status: 400 }
      );
    }

    // Check if user already exists
    let user = await User.findOne({ firebaseUid });
    if (!user) {
      user = await User.create({
        firebaseUid,
        email,
        firstName: firstName || "",
        lastName: lastName || "",
        phoneNumber: phoneNumber || "",
        city: city || "",
        state: state || "",
        role: "user",
        isOnboarded: false
      });
    }

    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/auth/register:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Server error occurred during user registration" },
      { status: 500 }
    );
  }
}
