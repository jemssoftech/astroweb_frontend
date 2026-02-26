// app/api/auth/refresh/route.ts
// Proxy route: exchanges the refreshToken cookie for a new accessToken.
// The new accessToken is written back as a cookie so all subsequent requests
// automatically carry it — no client-side cookie manipulation needed.

import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.AUTH_BASE_URL || "http://localhost:3000";

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: "No refresh token found." },
        { status: 401 },
      );
    }

    // Call the backend refresh endpoint
    const backendRes = await fetch(
      `${BACKEND_URL}/api/auth.web/refresh-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Some backends expect the token in a header rather than body
          Authorization: `Bearer ${refreshToken}`,
        },
        body: JSON.stringify({ refreshToken }),
      },
    );

    if (!backendRes.ok) {
      // Refresh token is invalid/expired — tell the client to log out
      const errorData = await backendRes.json().catch(() => ({}));
      return NextResponse.json(
        {
          error:
            errorData?.error || "Refresh token expired. Please log in again.",
        },
        { status: 401 },
      );
    }

    const data = await backendRes.json();
    const newAccessToken: string = data.accessToken || data.access_token;

    if (!newAccessToken) {
      return NextResponse.json(
        { error: "Backend did not return a new access token." },
        { status: 502 },
      );
    }

    // Build response and attach the refreshed accessToken as a cookie
    const response = NextResponse.json(
      { accessToken: newAccessToken, success: true },
      { status: 200 },
    );

    // Mirror the same cookie settings used in LoginModule.tsx
    response.cookies.set("accessToken", newAccessToken, {
      path: "/",
      maxAge: 7200, // 2 hours, matching login
      secure: true,
      sameSite: "lax",
      httpOnly: false, // keep false so js-cookie can still read it on the client
    });

    return response;
  } catch (err) {
    console.error("[auth/refresh] error:", err);
    return NextResponse.json(
      { error: "Internal proxy error." },
      { status: 500 },
    );
  }
}
