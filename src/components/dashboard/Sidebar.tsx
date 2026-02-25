"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Iconify from "../Iconify";
import { logout } from "@/src/lib/auth";

const NavIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    className="shrink-0"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="6" stroke="#5d7b9a" strokeWidth="1.8" />
    <path
      d="M12 2v4M12 18v4M2 12h4M18 12h4"
      stroke="#5d7b9a"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <circle cx="12" cy="12" r="2" stroke="#dc2626" strokeWidth="1.8" />
    <path
      d="M13 11l2 -2"
      stroke="#dc2626"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const NavItem = ({
  href,
  label,
  active,
  hasAlert,
  onClick,
}: {
  href?: string;
  label: string;
  active?: boolean;
  hasAlert?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
}) => {
  const content = (
    <>
      <div className="flex items-center justify-center w-6 h-6">
        <NavIcon />
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
        <div className="flex items-center gap-3 px-8 pl-9">
          <div className="relative w-[48px] h-[38px] shrink-0">
            <svg
              viewBox="0 0 48 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              {/* V (Purple) */}
              <path d="M2 4 L12 4 L22 32 L12 32 Z" fill="#9b51e0" />
              <path d="M12 32 L26 4 L36 4 L22 32 Z" fill="#9b51e0" />
              {/* A (Teal) */}
              <path d="M16 36 L30 8 L40 8 L26 36 Z" fill="#06B6D4" />
              <path d="M30 8 L44 36 L34 36 L26 20 L16 36 Z" fill="#06B6D4" />
              {/* Bar for A */}
              <path d="M20 26 L38 26 L36 32 L18 32 Z" fill="#06B6D4" />
            </svg>
          </div>
          <div className="flex flex-col flex-1">
            <div className="text-[23px] font-bold text-white tracking-wide leading-none">
              Astro Web
            </div>
            <div className="text-right text-[12px] text-gray-300 font-bold mt-1.5 pr-1">
              v4.0.1
            </div>
          </div>
        </div>

        {/* 'Now with' Badge Section */}
        <div className="flex items-center gap-[7px] mt-8 px-8 pl-10">
          <span className="text-[17px] font-bold text-white tracking-wide">
            Now with
          </span>
          <span className="bg-[#FFEFE5] text-[#EA580C] text-[12px] font-extrabold px-[12px] py-[3.5px] rounded-full shadow-sm ml-1">
            Western
          </span>
          <span className="text-[17px] font-bold text-white ml-0.5">&amp;</span>
          <span className="bg-[#E0FAFC] text-[#0D9488] text-[12px] font-extrabold px-[14px] py-[3.5px] rounded-full shadow-sm">
            Tarot
          </span>
        </div>

        {/* Separator */}
        <div className="h-px bg-slate-600/30 mt-6 mb-7 mx-8" />

        {/* Nav Links */}
        <div className="flex flex-col flex-1 space-y-1.5 mt-2">
          <NavItem
            href="/dashboard"
            label="Dashboard"
            active={pathname === "/dashboard"}
          />

          <NavItem
            href="/dashboard/account"
            label="Account"
            active={pathname === "/dashboard/account"}
            hasAlert
          />

          <NavItem
            href="/dashboard/testing"
            label="Testing"
            active={pathname === "/dashboard/testing"}
          />
        </div>

        {/* Bottom Nav Links */}
        <div className="flex flex-col space-y-2 mt-auto pt-6">
          <NavItem href="/" label="Back To Website" />
          <button
            onClick={logout}
            className="relative z-10 flex items-center gap-4 px-5 py-[12px] rounded-lg transition-all font-semibold text-[15.5px] mx-4 text-[#98b0cf] hover:bg-white/5 hover:text-[#d3e0f0]"
          >
            <div className="flex items-center justify-center w-6 h-6">
              <NavIcon />
            </div>
            <span className="flex-1 tracking-wide">Log out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
