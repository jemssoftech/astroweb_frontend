"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Iconify from "@/src/components/Iconify";
import { getUser, logout } from "@/src/lib/auth";
import { ThemeToggle } from "../theme-toggle";

export default function DashboardNavbar({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const user = getUser();

  // Fetch true balance from API, fallback to localStorage user object if it fails

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch("/api/wallet/balance");
        if (response.ok) {
          const data = await response.json();
          // Fallback safely to 0 if API is valid but remainingBalanceRupees is undefined
          setBalance(data.remainingBalanceRupees || 0);
        } else {
          setBalance(user?.remainingBalanceRupees || 0);
        }
      } catch (error) {
        console.error("Failed to fetch balance in navbar", error);
        setBalance(user?.remainingBalanceRupees || 0);
      }
    };
    // Initial fetch
    fetchBalance();

    // Listen for custom top-up events
    const handleWalletUpdate = () => {
      fetchBalance();
    };
    window.addEventListener("wallet:update", handleWalletUpdate);

    return () => {
      window.removeEventListener("wallet:update", handleWalletUpdate);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  return (
    <nav className="w-full bg-white dark:bg-[#0F172A] border-b border-slate-200 dark:border-white/5 flex items-center px-3 sm:px-6 py-2.5 lg:px-8 justify-between z-40 sticky top-0 transition-colors duration-300">
      {/* Left side - Hamburger menu for mobile */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5 transition-all"
        >
          <Iconify icon="lucide:menu" className="text-2xl" />
        </button>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white lg:hidden">
          Astro Web
        </h1>
      </div>

      {/* Right side Profile & Wallet Actions */}
      <div className="flex items-center gap-2 sm:gap-4 relative h-full">
        <ThemeToggle />
        <Link
          href="/dashboard/wallet"
          className="hidden items-center lg:flex gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-lg sm:rounded-xl hover:bg-emerald-500/20 transition-colors"
        >
          <Iconify icon="lucide:wallet" className="text-emerald-500 text-sm" />
          <span className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400">
            ₹{balance !== null ? balance.toLocaleString() : "..."}
          </span>
        </Link>

        {/* Profile Dropdown Toggle */}
        <button
          id="dashboard-profile-button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-1.5 sm:gap-2 bg-slate-100 dark:bg-[#1E293B] hover:bg-slate-200 dark:hover:bg-[#334155] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white pl-1.5 sm:pl-2 pr-2 sm:pr-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-sm font-semibold transition-colors focus:ring-2 focus:ring-[#F97316]/50"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-sm border border-white/10">
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
            className="absolute right-0 top-[calc(100%+8px)] w-[calc(100vw-24px)] sm:w-64 max-w-[280px] bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl shadow-black/10 dark:shadow-black/50 overflow-hidden transform origin-top-right transition-all z-50"
          >
            <div className="p-4 border-b border-slate-200 dark:border-white/10 bg-gradient-to-b from-slate-50 dark:from-white/5 to-transparent">
              <p className="text-slate-900 dark:text-white font-bold truncate">
                {user?.username || "Astro User"}
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-xs truncate mt-0.5">
                {user?.email || "user@example.com"}
              </p>
            </div>
            <div className="p-2">
              <Link
                href="/dashboard/profile"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Iconify
                    icon="lucide:user"
                    className="text-purple-600 dark:text-purple-400 text-sm"
                  />
                </div>
                My Profile
              </Link>
              <Link
                href="/dashboard/wallet"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Iconify
                    icon="lucide:wallet"
                    className="text-emerald-600 dark:text-emerald-400 text-sm"
                  />
                </div>
                Wallet Options
              </Link>
            </div>
            <div className="p-2 border-t border-slate-200 dark:border-white/10">
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
