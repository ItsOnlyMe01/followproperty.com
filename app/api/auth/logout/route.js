import { NextResponse } from "next/server";

/**
 * POST /api/auth/logout
 * 
 * Clears the secure HTTP-only Firebase token cookie, logging the user out server-side.
 */
export async function POST() {
  const response = NextResponse.json({ success: true });
  
  response.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  response.cookies.set("user_role", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  response.cookies.set("builder_status", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return response;
}
