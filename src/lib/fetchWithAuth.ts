// lib/fetchWithAuth.ts
// A thin fetch wrapper that transparently handles access-token expiry.
//
// Flow:
//  1. Try the original request.
//  2. If the server returns 401, call /api/auth/refresh to get a new token.
//  3. If refresh succeeds, retry the original request once with the fresh token.
//  4. If refresh fails (token truly expired), call logout() and redirect to /login.

import { logout } from "./auth";

type FetchArgs = Parameters<typeof fetch>;

export async function fetchWithAuth(
  url: FetchArgs[0],
  options: FetchArgs[1] = {},
): Promise<Response> {
  // ── First attempt ──────────────────────────────────────────────────────────
  let response = await fetch(url, options);

  if (response.status !== 401) {
    return response;
  }

  // ── Access token expired — try to refresh ──────────────────────────────────
  const refreshRes = await fetch("/api/auth/refresh", { method: "POST" });

  if (!refreshRes.ok) {
    // Refresh token is also gone/invalid → force logout
    logout();
    return response; // return the original 401 so callers can handle it if needed
  }

  // ── Retry original request (cookies are now updated by the refresh route) ──
  response = await fetch(url, options);
  return response;
}
