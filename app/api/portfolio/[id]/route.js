import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase-admin';
import connectToDatabase from '@/lib/db';
import Portfolio from '@/models/Portfolio';

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();

    // Get authenticated user from session cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access: Please log in." },
        { status: 401 }
      );
    }

    const decodedToken = await adminAuth.verifyIdToken(token);
    const firebaseUid = decodedToken.uid;

    const unwrappedParams = await params;
    const id = unwrappedParams.id;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Property ID is required." },
        { status: 400 }
      );
    }

    // Find the portfolio property and ensure it belongs to the authenticated user
    const portfolio = await Portfolio.findOne({ _id: id, firebaseUid });
    if (!portfolio) {
      return NextResponse.json(
        { success: false, error: "Property not found or access denied." },
        { status: 404 }
      );
    }

    // Perform deletion
    await Portfolio.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Property successfully removed from portfolio tracking."
    }, { status: 200 });

  } catch (error) {
    console.error('Error in DELETE /api/portfolio/[id]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error occurred' },
      { status: 500 }
    );
  }
}
