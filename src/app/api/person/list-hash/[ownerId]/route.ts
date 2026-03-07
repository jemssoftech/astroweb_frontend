// app/api/person/list-hash/[ownerId]/route.ts
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BASE_URL = process.env.NEXT_PUBLIC_NEXT_JS_API_URL;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ ownerId: string }> },
) {
  if (!BASE_URL) {
    return NextResponse.json(
      { error: "Backend URL not configured" },
      { status: 500 },
    );
  }

  try {
    const { ownerId } = await params;
    const authHeader = req.headers.get("authorization");
    const visitorId = req.nextUrl.searchParams.get("visitorId");

    const url = new URL(`${BASE_URL}/api/person/list-hash/${ownerId}`);
    if (visitorId) {
      url.searchParams.set("visitorId", visitorId);
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader && { Authorization: authHeader }),
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: unknown) {
    console.error("Person list-hash error:", error);
    return NextResponse.json(
      { error: "Failed to get person list hash", Status: "Fail" },
      { status: 500 },
    );
  }
}
