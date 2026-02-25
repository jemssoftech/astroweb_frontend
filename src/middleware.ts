import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check if it's an API route
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const host = request.headers.get("host") || "";
    const origin = request.headers.get("origin") || "";
    const referer = request.headers.get("referer") || "";
    const secFetchSite = request.headers.get("sec-fetch-site") || "";

    // If sec-fetch-site is present and not 'same-origin' or 'same-site', reject
    if (
      secFetchSite &&
      secFetchSite !== "same-origin" &&
      secFetchSite !== "same-site"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Forbidden: API can only be called from within the same application",
        },
        { status: 403 },
      );
    }

    // Reject direct access (e.g. from Postman, curl, or browsers accessing API directly)
    if (!origin && !referer && !secFetchSite) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden: Direct API access is not allowed",
        },
        { status: 403 },
      );
    }

    // Check if origin matches host
    if (origin && !origin.includes(host)) {
      return NextResponse.json(
        { success: false, message: "Forbidden: Origin not allowed" },
        { status: 403 },
      );
    }

    // Check if referer matches host
    if (referer && !referer.includes(host)) {
      return NextResponse.json(
        { success: false, message: "Forbidden: Referer not allowed" },
        { status: 403 },
      );
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/api/:path*",
};
