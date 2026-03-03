import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.AUTH_BASE_URL || "http://localhost:3000";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Get token from Authorization header or fall back to accessToken cookie
    const authHeader = req.headers.get("authorization");
    const token = authHeader
      ? authHeader.replace("Bearer ", "")
      : req.cookies.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 },
      );
    }

    // Send token in multiple formats — backend may read from any of these
    const backendRes = await fetch(`${BACKEND_URL}/api/razorpay/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "x-access-token": token,
        token: token,
      },
      body: JSON.stringify({ ...body, token, accessToken: token }),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: data?.error || "Failed to create order." },
        { status: backendRes.status },
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("[razorpay/create-order] proxy error:", err);
    return NextResponse.json(
      { error: "Internal proxy error." },
      { status: 500 },
    );
  }
}
