"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Iconify from "../Iconify";
import { logout, getUser } from "@/src/lib/auth";
import Image from "next/image";
import DashboardRedirectButton from "../DashboardRedirectButton";

// Navigation Item Component
const NavItem = ({
  href,
  label,
  icon,
  active,
  hasAlert,
  badge,
  onClick,
}: {
  href?: string;
  label: string;
  icon: string;
  active?: boolean;
  hasAlert?: boolean;
  badge?: string | number;
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
}) => {
  const content = (
    <>
      {/* Active Indicator */}
      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-r-full" />
      )}

      {/* Icon Container */}
      <div
        className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${
          active
            ? "bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-blue-400"
            : "text-slate-400 group-hover:text-slate-200 group-hover:bg-white/5"
        }`}
      >
        <Iconify icon={icon} className="text-xl" />
        {hasAlert && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900 animate-pulse" />
        )}
      </div>

      {/* Label */}
      <span
        className={`flex-1 font-medium text-[14px] transition-colors duration-300 ${
          active ? "text-white" : "text-slate-400 group-hover:text-slate-200"
        }`}
      >
        {label}
      </span>

      {/* Badge */}
      {badge && (
        <span className="px-2 py-0.5 text-[10px] font-bold bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full">
          {badge}
        </span>
      )}

      {/* Arrow for active */}
      {active && (
        <Iconify
          icon="lucide:chevron-right"
          className="text-blue-400 text-lg"
        />
      )}
    </>
  );

  const className = `group relative flex items-center gap-3 px-4 py-2.5 mx-3 rounded-xl transition-all duration-300 ${
    active
      ? "bg-gradient-to-r from-slate-800/80 to-slate-800/40 shadow-lg shadow-black/20"
      : "hover:bg-white/5"
  }`;

  if (href) {
    return (
      <Link
        href={href}
        className={className}
        onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
      className={className + " w-full text-left"}
    >
      {content}
    </button>
  );
};

// Section Header Component
const SectionHeader = ({ title }: { title: string }) => (
  <div className="px-7 pt-6 pb-2">
    <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
      {title}
    </span>
  </div>
);

export default function Sidebar() {
  const pathname = usePathname();
  const user = getUser();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Wallet balance (you can get this from user or API)
  const walletBalance = user?.wallet_balance || 0;

  const mainNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: "lucide:layout-dashboard" },
    {
      href: "/dashboard/testing",
      label: "API Testing",
      icon: "lucide:flask-conical",
    },
    { href: "/dashboard/wallet", label: "Wallet", icon: "lucide:wallet" },
    {
      href: "/dashboard/transactions",
      label: "Transactions",
      icon: "lucide:receipt",
    },
  ];

  const apiNavItems = [
    { href: "/dashboard/api-keys", label: "API Keys", icon: "lucide:key" },
    { href: "/dashboard/usage", label: "API Usage", icon: "lucide:activity" },
    {
      href: "/dashboard/pdf-credits",
      label: "PDF Credits",
      icon: "lucide:file-text",
    },
  ];

  const resourceNavItems = [
    {
      href: "/dashboard/docs",
      label: "Documentation",
      icon: "lucide:book-open",
    },
    {
      href: "/dashboard/support",
      label: "Help & Support",
      icon: "lucide:headphones",
    },
    { href: "/dashboard/settings", label: "Settings", icon: "lucide:settings" },
  ];

  return (
    <aside
      className={`${isCollapsed ? "w-[80px]" : "w-[280px]"} h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 flex flex-col relative overflow-hidden shrink-0 transition-all duration-300`}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-[10%] -left-[20%] w-[200px] h-[200px] bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[20%] -right-[30%] w-[250px] h-[250px] bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute top-[60%] -left-[10%] w-[150px] h-[150px] bg-purple-500/10 rounded-full blur-3xl" />

        {/* Subtle Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Sidebar Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Logo Section */}
        <div className="flex items-center justify-between p-5 pt-6">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 p-0.5 shadow-lg shadow-blue-500/20">
              <div className="w-full h-full rounded-[10px] bg-slate-900 flex items-center justify-center overflow-hidden">
                <Image
                  src="/image/logo.png"
                  alt="Astro Web Logo"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white tracking-wide">
                  Astro Web
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  API Dashboard v{process.env.NEXT_PUBLIC_APP_VERSION}
                </span>
              </div>
            )}
          </div>

          {/* Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
          >
            <Iconify
              icon={
                isCollapsed
                  ? "lucide:panel-right-open"
                  : "lucide:panel-left-close"
              }
              className="text-lg"
            />
          </button>
        </div>

        {/* Wallet Balance Card */}
        {!isCollapsed && (
          <div className="mx-4 mt-2 p-4 rounded-2xl bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border border-emerald-500/20 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <Iconify
                    icon="lucide:wallet"
                    className="text-white text-sm"
                  />
                </div>
                <span className="text-xs font-medium text-slate-400">
                  Wallet Balance
                </span>
              </div>
              <Link
                href="/dashboard/wallet"
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <Iconify icon="lucide:external-link" className="text-sm" />
              </Link>
            </div>

            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-2xl font-bold text-white">
                ₹{walletBalance.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400">.00</span>
            </div>

            <Link
              href="/dashboard/wallet/topup"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300"
            >
              <Iconify icon="lucide:plus-circle" className="text-lg" />
              Top Up Wallet
            </Link>
          </div>
        )}

        {/* Collapsed Wallet Icon */}
        {isCollapsed && (
          <div className="mx-3 mt-2 p-3 rounded-xl bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border border-emerald-500/20">
            <Link
              href="/dashboard/wallet"
              className="flex flex-col items-center gap-1"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Iconify icon="lucide:wallet" className="text-white text-lg" />
              </div>
              <span className="text-[10px] font-bold text-emerald-400">
                ₹{walletBalance}
              </span>
            </Link>
          </div>
        )}

        {/* User Profile Card */}
        {!isCollapsed && (
          <div className="mx-4 mt-3 p-3 rounded-xl bg-slate-800/30 border border-slate-700/30">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-purple-500/20">
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-800" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user?.username || "User"}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {/* Main Section */}
          {!isCollapsed && <SectionHeader title="Main Menu" />}
          <div className="space-y-1 px-1">
            {mainNavItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={pathname === item.href}
              />
            ))}
          </div>

          {/* API Section */}
          {!isCollapsed && <SectionHeader title="API Management" />}
          <div className="space-y-1 px-1">
            {apiNavItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={pathname === item.href}
              />
            ))}
            <DashboardRedirectButton />
          </div>

          {/* Resources Section */}
          {!isCollapsed && <SectionHeader title="Resources" />}
          <div className="space-y-1 px-1">
            {resourceNavItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={pathname === item.href}
              />
            ))}
          </div>
        </nav>

        {/* Quick Stats */}
        {!isCollapsed && (
          <div className="mx-4 mb-3 p-3 rounded-xl bg-slate-800/30 border border-slate-700/30">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-2 rounded-lg bg-slate-800/50">
                <div className="text-lg font-bold text-white">500</div>
                <div className="text-[10px] text-slate-400">API Calls</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-slate-800/50">
                <div className="text-lg font-bold text-amber-400">0</div>
                <div className="text-[10px] text-slate-400">PDF Left</div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-slate-800/50">
          {/* Logout Button */}
          <button
            onClick={logout}
            className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
              <Iconify icon="lucide:log-out" className="text-xl" />
            </div>
            {!isCollapsed && (
              <span className="font-medium text-sm">Log out</span>
            )}
          </button>

          {/* Copyright */}
          {!isCollapsed && (
            <p className="text-center text-[10px] text-slate-600 mt-3">
              © 2024 Astro Web. All rights reserved.
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}
