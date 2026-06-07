import { NextResponse } from 'next/server';
import { verifyAuthRequest } from '@/lib/auth-guards';
import connectToDatabase from '@/lib/db';
import Portfolio from '@/models/Portfolio';

export async function DELETE(request, { params }) {
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
