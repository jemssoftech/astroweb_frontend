// components/DashboardRedirectButton.jsx (Domain A)
"use client";

import { useState } from "react";
import Iconify from "./Iconify";

export default function DashboardRedirectButton() {
  const [loading, setLoading] = useState(false);

  const handleRedirect = async () => {
    setLoading(true);
    try {
      // 1. Call your Domain A backend to generate a secure, short-lived token
      const response = await fetch("/api/generate-dashboard-token", {
        method: "POST",
        // Note: fetch will automatically include Domain A's session cookies
        // if the user is already logged in.
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // 2. Redirect to Domain B's unauthenticated callback route with the token
        // window.location.href = `http://localhost:3002/auth-callback?token=${data.token}`;
        console.log(data.token);
      } else {
        console.error("Failed to generate token:", data.error);
        alert("Could not redirect to dashboard.");
      }
    } catch (error) {
      console.error("Error during redirect:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleRedirect}
      disabled={loading}
      className="group relative z-10 cursor-pointer flex items-center gap-4 px-5 py-[12px] rounded-lg transition-all font-semibold text-[15.5px] mx-4 text-[#98b0cf] hover:bg-white/5 hover:text-[#d3e0f0]"
    >
      <div className="flex items-center justify-center w-6 h-6 text-[#98b0cf] group-hover:text-[#d3e0f0] transition-colors">
        <Iconify icon="lucide:log-out" className="text-[20px] opacity-80" />
      </div>
      <span className="flex-1 tracking-wide text-left">
        {loading ? "Redirecting safely..." : "View Docs"}
      </span>
    </button>
  );
}
