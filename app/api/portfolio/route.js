import { NextResponse } from 'next/server';
import { verifyAuthRequest } from '@/lib/auth-guards';
import connectToDatabase from '@/lib/db';
import Portfolio from '@/models/Portfolio';

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
    
    // Automatically inject user ownership mapping parameters
    const portfolio = await Portfolio.create({
      ...body,
      userId: user._id,
      firebaseUid
    });
    
    return NextResponse.json(
      { success: true, message: 'Portfolio property added successfully', data: portfolio },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/portfolio:', error);
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

    // Retrieve only portfolio properties belonging to this user
    const portfolios = await Portfolio.find({ firebaseUid }).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: portfolios }, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/portfolio:', error);
    return NextResponse.json(
      { success: false, error: 'Server error occurred' },
      { status: 500 }
    );
  }
}
