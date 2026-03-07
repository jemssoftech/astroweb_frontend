import { NextRequest, NextResponse } from "next/server";

const AUTH_BASE_URL = process.env.AUTH_BASE_URL || "http://localhost:3000";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader
      ? authHeader.replace("Bearer ", "")
      : req.cookies.get("accessToken")?.value;

    const url = new URL(req.url);
    const page = url.searchParams.get("page") || "1";
    const limit = url.searchParams.get("limit") || "20";

    const backendRes = await fetch(
      `${AUTH_BASE_URL}/api/wallet/history?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      },
    );

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: data?.error || "Failed to fetch history." },
        { status: backendRes.status },
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("[wallet/history] proxy error:", err);
    return NextResponse.json(
      { error: "Internal proxy error." },
      { status: 500 },
    );
  }
}
