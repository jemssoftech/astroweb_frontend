// app/api/generate-dashboard-token/route.ts (Domain A)
// Simplified: sends the existing accessToken directly to Domain B.
// Domain B verifies it with the same JWT_SECRET as the NodeJS backend.
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.AUTH_BASE_URL || "http://localhost:3000";

export async function POST() {
  try {
    const cookieStore = await cookies();
    let accessToken = cookieStore.get("accessToken")?.value;

    const refreshToken = cookieStore.get("refreshToken")?.value;

    // If no accessToken at all, we can't proceed
    if (!accessToken && !refreshToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // If accessToken is missing but refreshToken exists, silently refresh first
    if (!accessToken && refreshToken) {
      const backendRes = await fetch(
        `${BACKEND_URL}/api/auth.web/refresh-token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        },
      );

      if (!backendRes.ok) {
        return NextResponse.json(
          { error: "Session expired. Please log in again." },
          { status: 401 },
        );
      }

      const data = await backendRes.json();
      console.log(data);
      accessToken = data.accessToken || data.access_token;

      if (!accessToken) {
        return NextResponse.json(
          { error: "Session expired. Please log in again." },
          { status: 401 },
        );
      }
    }

    // Return the current accessToken directly — Domain B will verify it
    const response = NextResponse.json({ token: accessToken });

    return response;
  } catch (error) {
    console.error("Token generation error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
