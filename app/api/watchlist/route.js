import { NextResponse } from 'next/server';
import { verifyAuthRequest } from '@/lib/auth-guards';
import connectToDatabase from '@/lib/db';
import Watchlist from '@/models/Watchlist';

export async function POST(request) {
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

    const { user, decodedToken } = authResult;
    const firebaseUid = decodedToken.uid;

    await connectToDatabase();
    const body = await request.json();
    
    // Validate budget (strictly greater than zero)
    if (!body.budget || isNaN(Number(body.budget)) || Number(body.budget) <= 0) {
      return NextResponse.json(
        { success: false, error: "Budget must be a positive number greater than zero." },
        { status: 400 }
      );
    }
    
    // Automatically inject user ownership mapping parameters
    const watchlist = await Watchlist.create({
      ...body,
      userId: user._id,
      firebaseUid
    });
    
    return NextResponse.json(
      { success: true, message: 'Watchlist created successfully', data: watchlist },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/watchlist:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error occurred' },
      { status: 500 }
    );
  }
}

export async function GET() {
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

    // Retrieve only watchlist configurations belonging to this user
    const watchlists = await Watchlist.find({ firebaseUid }).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: watchlists }, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/watchlist:', error);
    return NextResponse.json(
      { success: false, error: 'Server error occurred' },
      { status: 500 }
    );
  }
}
