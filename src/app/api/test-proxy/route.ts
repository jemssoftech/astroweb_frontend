import { NextRequest, NextResponse } from "next/server";

// Backend base URL from .env.local  →  AUTH_BASE_URL=http://localhost:3000
const BACKEND_BASE_URL =
  process.env.AUTH_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Accept `slug`  (e.g. "ashtakvarga")  OR a full `url`
    const { url, slug, params, method = "POST" } = body;

    // Build the full backend URL
    const resolvedUrl = slug ? `${BACKEND_BASE_URL}/api/${slug}` : (url ?? "");

    if (!resolvedUrl) {
      return NextResponse.json(
        { error: "url or slug is required" },
        { status: 400 },
      );
    }

    const { api_key, ...bodyParams } = params ?? {};

    let fullUrl: string;
    let fetchOptions: RequestInit;

    if (method === "GET") {
      const queryParams = new URLSearchParams(bodyParams);
      const separator = resolvedUrl.includes("?") ? "&" : "?";
      fullUrl = `${resolvedUrl}${separator}${queryParams.toString()}`;
      fetchOptions = {
        method: "GET",
        headers: { "x-api-key": api_key ?? "" },
      };
    } else {
      fullUrl = resolvedUrl;
      fetchOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": api_key ?? "",
        },
        body: JSON.stringify(bodyParams),
      };
    }

    const response = await fetch(fullUrl, fetchOptions);
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } else {
      const rawText = await response.text();
      return NextResponse.json(
        { error: "API returned non-JSON response", raw: rawText },
        { status: response.status },
      );
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Test Proxy Error:", message);
    return NextResponse.json(
      { error: "Internal Server Error", details: message },
      { status: 500 },
    );
  }
}
