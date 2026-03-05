"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Iconify from "../Iconify";

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
            ? "bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-blue-600 dark:text-blue-400"
            : "text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-slate-200 group-hover:bg-blue-50 dark:group-hover:bg-white/5"
        }`}
      >
        <Iconify icon={icon} className="text-xl" />
        {hasAlert && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
        )}
      </div>

      {/* Label */}
      <span
        className={`flex-1 font-medium text-[14px] transition-colors duration-300 ${
          active
            ? "text-slate-900 dark:text-white"
            : "text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-slate-200"
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
      ? "bg-blue-50 dark:bg-gradient-to-r dark:from-slate-800/80 dark:to-slate-800/40 shadow-sm dark:shadow-lg dark:shadow-black/20"
      : "hover:bg-blue-50/50 dark:hover:bg-white/5"
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

export default function Sidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    // { href: "/dashboard/api-keys", label: "API Keys", icon: "lucide:key" },
    { href: "/dashboard/usage", label: "API Usage", icon: "lucide:activity" },
    {
      href: "/dashboard/pdf-credits",
      label: "PDF Credits",
      icon: "lucide:file-text",
    },
  ];

  const resourceNavItems = [
    {
      href: "/dashboard/support",
      label: "Help & Support",
      icon: "lucide:headphones",
    },
  ];

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 
        ${isCollapsed ? " lg:w-[80px]" : " lg:w-[280px]"} 
        h-screen bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 
        border-r border-slate-200 dark:border-white/5 flex flex-col relative overflow-hidden shrink-0 
        transition-all duration-300 transform
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 w-0"}
      `}
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
                <span className="text-lg font-bold text-slate-900 dark:text-white tracking-wide">
                  Astro Web
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  API Dashboard v{process.env.NEXT_PUBLIC_APP_VERSION}
                </span>
              </div>
            )}
          </div>

          {/* Collapse Toggle (Desktop only) */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
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

          {/* Close button (Mobile only) */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <Iconify icon="lucide:x" className="text-2xl" />
          </button>
        </div>

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
                onClick={() => setIsOpen(false)}
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
                onClick={() => setIsOpen(false)}
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
                onClick={() => setIsOpen(false)}
              />
            ))}
          </div>
        </nav>
      </div>
    </aside>
  );
}
