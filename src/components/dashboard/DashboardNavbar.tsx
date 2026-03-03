"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Iconify from "@/src/components/Iconify";
import { getUser, logout } from "@/src/lib/auth";

export default function DashboardNavbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const user = getUser();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById("dashboard-profile-dropdown");
      const button = document.getElementById("dashboard-profile-button");
      if (
        dropdown &&
        !dropdown.contains(event.target as Node) &&
        button &&
        !button.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
  };
  console.log(user);
  return (
    <nav className="w-full bg-[#0F172A] border-b border-white/5  flex items-center px-4 sm:px-6 py-2 sm:py-4 lg:py-6 lg:px-8 justify-between z-40 sticky top-0">
      {/* Left side can be breadcrumbs or page title, leaving blank or simple for now */}
      <div className="flex items-center">
        {/* Mobile menu toggle button could go here if sidebar is hidden on mobile */}
      </div>

      {/* Right side Profile & Wallet Actions */}
      <div className="flex items-center gap-4 relative h-full">
        <Link
          href="/dashboard/wallet"
          className="flex items-center gap-2 px-3 py-2 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/20 transition-colors"
        >
          <Iconify icon="lucide:wallet" className="text-emerald-500 text-sm" />
          <span className="text-sm font-bold text-emerald-400">
            ₹{user?.remainingBalanceRupees?.toLocaleString() || 0}
          </span>
        </Link>

        {/* Profile Dropdown Toggle */}
        <button
          id="dashboard-profile-button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 bg-[#1E293B] hover:bg-[#334155] border border-white/10 text-white pl-2 pr-3 py-1.5 rounded-xl text-sm font-semibold transition-colors focus:ring-2 focus:ring-[#F97316]/50"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm border border-white/10">
            {user?.username?.charAt(0).toUpperCase() || "U"}
          </div>
          <span className="max-w-[100px] truncate hidden sm:block">
            {user?.username || "Menu"}
          </span>
          <Iconify
            icon="mdi:chevron-down"
            className={`text-slate-400 text-lg transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div
            id="dashboard-profile-dropdown"
            className="absolute right-0 top-[calc(100%+12px)] w-64 bg-[#1E293B] border border-white/10 rounded-2xl shadow-xl shadow-black/50 overflow-hidden transform origin-top-right transition-all"
          >
            <div className="p-4 border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
              <p className="text-white font-bold truncate">
                {user?.username || "Astro User"}
              </p>
              <p className="text-slate-400 text-xs truncate mt-0.5">
                {user?.email || "user@example.com"}
              </p>
            </div>
            <div className="p-2">
              <Link
                href="/dashboard/profile"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Iconify
                    icon="lucide:user"
                    className="text-purple-400 text-sm"
                  />
                </div>
                My Profile
              </Link>
              <Link
                href="/dashboard/wallet"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Iconify
                    icon="lucide:wallet"
                    className="text-emerald-400 text-sm"
                  />
                </div>
                Wallet Options
              </Link>
            </div>
            <div className="p-2 border-t border-white/10">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <Iconify
                    icon="lucide:log-out"
                    className="text-red-400 text-sm"
                  />
                </div>
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
