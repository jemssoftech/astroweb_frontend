"use client";

import { useState } from "react";
import Link from "next/link";
import Iconify from "@/src/components/Iconify";
import { useRouter } from "next/navigation";

export default function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const navLinks = [
    { text: "Home", href: "/" },
    { text: "Kundali Pricing", href: "#pricing" },
    { text: "Features", href: "#features" },
    { text: "FAQ", href: "#faq" },
    { text: "Contact", href: "#contact" },
  ];
  const handleLogin = () => {
    router.push("/login");
  };
  return (
    <nav className="fixed w-full z-50 bg-[#0A0A0E]/90 backdrop-blur-md border-b border-white/5 top-0 left-0">
      <div className="container xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[76px]">
          {/* Logo */}
          <Link
            href="/"
            className="flex-shrink-0 flex items-center gap-3 text-decoration-none"
          >
            <div className="w-[38px] h-[38px] rounded-xl bg-[#9b51e0] flex items-center justify-center shadow-[0_0_15px_rgba(155,81,224,0.3)]">
              <Iconify
                icon="ph:star-four-fill"
                className="text-cyan-200 text-xl opacity-90"
              />
            </div>
            <div className="text-xl font-bold tracking-wide">
              <span className="text-white">Astrology </span>
              <span className="text-[#f472b6]">Service</span>
            </div>
          </Link>

          {/* Desktop Nav (Center/Right alignment depending on flex-1) */}
          <div className="hidden lg:flex  items-center justify-end pr-8 ">
            {navLinks.map((link) => (
              <Link
                key={link.text}
                href={link.href}
                className="inline-flex items-center gap-[6px] px-[14px] py-[8px] rounded-[10px] text-[14px] font-medium text-slate-400 no-underline transition-all duration-200 whitespace-nowrap hover:text-[#f1f5f9] hover:bg-[#7c3aed1f]"
              >
                {link.text}
              </Link>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={handleLogin}
              className="flex items-center cursor-pointer gap-2 bg-[#9b51e0] hover:bg-[#8e44d2] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-[0_4px_14px_0_rgba(155,81,224,0.39)]"
            >
              <Iconify
                icon="mdi:account-outline"
                className="text-white text-lg"
              />
              Login / Register
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center">
            {isOpen ? (
              <button
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center justify-center p-2 outline-none rounded-xl bg-[#111111] hover:bg-[#1a1a1a] border border-white/10 transition-all"
                aria-label="Close menu"
              >
                <Iconify icon="mdi:close" className="h-7 w-7 text-[#9b51e0]" />
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
        className={`lg:hidden absolute top-[76px] left-0 w-full bg-[#0A0A0E] border-b border-white/5 transition-all duration-300 ease-in-out ${
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
            <button
              onClick={handleLogin}
              className="flex justify-center items-center gap-2 bg-[#9b51e0] hover:bg-[#8e44d2] text-white px-4 py-3.5 rounded-xl text-sm font-semibold transition-colors"
            >
              Login / Register
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
