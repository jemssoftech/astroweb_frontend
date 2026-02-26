"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Iconify from "../Iconify";
import { logout } from "@/src/lib/auth";
import Image from "next/image";
import DashboardRedirectButton from "../DashboardRedirectButton";

const NavItem = ({
  href,
  label,
  icon,
  active,
  hasAlert,
  onClick,
}: {
  href?: string;
  label: string;
  icon: string;
  active?: boolean;
  hasAlert?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
}) => {
  const content = (
    <>
      <div className="flex items-center justify-center w-6 h-6">
        <Iconify icon={icon} className="text-[20px] opacity-80" />
      </div>
      <span className="flex-1 tracking-wide text-left">{label}</span>
      {hasAlert && (
        <div className="flex items-center pr-2">
          <Iconify
            icon="lucide:circle-alert"
            className="text-[#dc2626] text-[22px]"
          />
        </div>
      )}
    </>
  );

  const className = `relative z-10 flex items-center gap-4 px-5 py-[12px] rounded-lg transition-all font-semibold text-[15.5px] mx-4 ${
    active
      ? "bg-[#F3F4F6] text-[#2c3e50] shadow-sm"
      : "text-[#98b0cf] hover:bg-white/5 hover:text-[#d3e0f0]"
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
      className={className + " w-auto"}
    >
      {content}
    </button>
  );
};

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-[305px] h-screen bg-[#1b202a] flex flex-col relative overflow-hidden shrink-0 border-r border-[#2d3748]/50">
      {/* Decorative Geometric Overlay Backgrounds */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Lighter intersecting polygon on bottom right mimicking the design */}
        <div className="absolute bottom-[0%] right-[-10%] w-[120%] h-[50%] bg-[#222732] transform -skew-y-12 origin-bottom-right" />
        <div className="absolute -bottom-[20%] right-[-20%] w-[150%] h-[50%] bg-[#252a36] transform rotate-25 origin-bottom-right opacity-80" />
      </div>

      {/* Sidebar Content */}
      <div className="relative z-10 flex flex-col h-full pt-10 pb-8 overflow-y-auto overflow-x-hidden">
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-6 pl-8">
          <div className="relative w-[42px] h-[42px] shrink-0">
            <Image
              src="/image/logo.png"
              alt="Astro Web Logo"
              fill
              className="object-contain"
            />
          </div>
          <div className="flex flex-col flex-1">
            <div className="text-[23px] font-bold text-white tracking-wide leading-none">
              Astro Web
            </div>
            <div className="text-right text-[12px] text-gray-300 font-bold mt-1.5 pr-1">
              v{process.env.NEXT_PUBLIC_APP_VERSION}
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="h-px bg-slate-600/30 mt-6 mb-7 mx-8" />

        {/* Nav Links */}
        <div className="flex flex-col flex-1 space-y-1.5 mt-2">
          <NavItem
            href="/dashboard"
            label="Dashboard"
            icon="lucide:layout-dashboard"
            active={pathname === "/dashboard"}
          />
          <NavItem
            href="/dashboard/testing"
            label="Testing"
            icon="lucide:flask-conical"
            active={pathname === "/dashboard/testing"}
          />
          <DashboardRedirectButton />
        </div>

        {/* Bottom Nav Links */}
        <div className="flex flex-col space-y-2 mt-auto pt-6">
          <button
            onClick={logout}
            className="group relative z-10 flex items-center gap-4 px-5 py-[12px] rounded-lg transition-all font-semibold text-[15.5px] mx-4 text-[#98b0cf] hover:bg-white/5 hover:text-[#d3e0f0]"
          >
            <div className="flex items-center justify-center w-6 h-6 text-[#98b0cf] group-hover:text-[#d3e0f0] transition-colors">
              <Iconify
                icon="lucide:log-out"
                className="text-[20px] opacity-80"
              />
            </div>
            <span className="flex-1 tracking-wide text-left">Log out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
