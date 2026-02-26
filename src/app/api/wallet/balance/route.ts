import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.AUTH_BASE_URL || "http://localhost:3000";

export async function GET(req: NextRequest) {
  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/wallet/balance`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(req.headers.get("authorization")
          ? { authorization: req.headers.get("authorization")! }
          : {}),
        ...(req.headers.get("cookie")
          ? { cookie: req.headers.get("cookie")! }
          : {}),
      },
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: data?.error || "Failed to fetch balance." },
        { status: backendRes.status },
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("[wallet/balance] proxy error:", err);
    return NextResponse.json(
      { error: "Internal proxy error." },
      { status: 500 },
    );
  }
}
