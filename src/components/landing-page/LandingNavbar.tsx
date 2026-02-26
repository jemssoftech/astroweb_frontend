"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Iconify from "@/src/components/Iconify";
import { usePathname, useRouter } from "next/navigation";
import { getAuthToken, getUser } from "@/src/lib/auth";

export default function LandingNavbar() {
  const token = getAuthToken();
  const user = getUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);
  const pathname = usePathname();
  const navLinks = [
    { text: "Home", href: "/" },
    { text: "Kundali Pricing", href: "#pricing" },
    { text: "Features", href: "#features" },
    { text: "FAQ", href: "#faq" },
    { text: "Contact", href: "#contact" },
  ];
  const handleLogin = () => {
    if (token) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };
  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname?.includes("/dashboard")
  ) {
    return null;
  }
  return (
    <nav className="fixed w-full z-50 bg-[#0F172A]/90 backdrop-blur-md border-b border-white/5 top-0 left-0">
      <div className="container xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[76px]">
          {/* Logo */}
          <Link
            href="/"
            className="flex-shrink-0 flex items-center gap-3 text-decoration-none"
          >
            <div className="relative h-[44px] w-[180px] bg-white/95 rounded-[12px] shadow-[0_0_15px_rgba(255,255,255,0.1)] px-2 transition-transform hover:scale-[1.02]">
              <Image
                src="/image/horozontal_logo.png"
                alt="Astrology Service Logo"
                fill
                className="object-contain p-1.5"
                priority
              />
            </div>
          </Link>

          {/* Desktop Nav (Center/Right alignment depending on flex-1) */}
          <div className="hidden lg:flex  items-center justify-end pr-8 ">
            {navLinks.map((link) => (
              <Link
                key={link.text}
                href={link.href}
                className="inline-flex items-center gap-[6px] px-[14px] py-[8px] rounded-[10px] text-[14px] font-medium text-slate-400 no-underline transition-all duration-200 whitespace-nowrap hover:text-[#f1f5f9] hover:bg-[#ea580c1f]"
              >
                {link.text}
              </Link>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {isMounted &&
              (!token ? (
                <button
                  onClick={handleLogin}
                  className="flex items-center cursor-pointer gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-[0_4px_14px_0_rgba(249, 115, 22,0.39)]"
                >
                  <Iconify
                    icon="mdi:account-outline"
                    className="text-white text-lg"
                  />
                  Login / Register
                </button>
              ) : (
                <button
                  onClick={handleLogin}
                  className="flex items-center cursor-pointer gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-[0_4px_14px_0_rgba(249, 115, 22,0.39)]"
                >
                  <Iconify
                    icon="mdi:account-outline"
                    className="text-white text-lg"
                  />
                  {user?.username}
                </button>
              ))}
            {!isMounted && (
              <div className="w-[140px] h-[40px] bg-white/5 rounded-xl animate-pulse"></div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center">
            {isOpen ? (
              <button
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center justify-center p-2 outline-none rounded-xl bg-[#1E293B] hover:bg-[#334155] border border-white/10 transition-all"
                aria-label="Close menu"
              >
                <Iconify icon="mdi:close" className="h-7 w-7 text-[#F97316]" />
              </button>
            ) : (
              <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center justify-center p-2 outline-none rounded-xl text-gray-300 hover:text-white transition-all"
                aria-label="Open menu"
              >
                <Iconify icon="mdi:menu" className="h-8 w-8" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute top-[76px] left-0 w-full bg-[#0F172A] border-b border-white/5 transition-all duration-300 ease-in-out ${
          isOpen
            ? "max-h-[500px] opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-5 pt-4 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.text}
              href={link.href}
              className="text-gray-300 hover:text-white block py-3 text-base font-semibold tracking-wide no-underline"
              onClick={() => setIsOpen(false)}
            >
              {link.text}
            </Link>
          ))}
        </div>

        <div className="pt-5 pb-8 border-t border-white/10 px-5">
          <div className="grid grid-cols-2 gap-3">
            {isMounted && (
              <button
                onClick={handleLogin}
                className="flex justify-center items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white px-4 py-3.5 rounded-xl text-sm font-semibold transition-colors col-span-2"
              >
                <Iconify
                  icon="mdi:account-outline"
                  className="text-white text-lg"
                />
                {!token ? "Login / Register" : user?.username}
              </button>
            )}
            {!isMounted && (
              <div className="w-full h-[48px] bg-white/5 rounded-xl animate-pulse col-span-2"></div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
