"use client";

import Iconify from "@/src/components/Iconify";
import Link from "next/link";

export default function LandingFooter() {
  const currentYear = new Date().getFullYear();

  const zodiacSigns = [
    { name: "Aries", icon: "♈" },
    { name: "Taurus", icon: "♉" },
    { name: "Gemini", icon: "♊" },
    { name: "Cancer", icon: "♋" },
    { name: "Leo", icon: "♌" },
    { name: "Virgo", icon: "♍" },
    { name: "Libra", icon: "♎" },
    { name: "Scorpio", icon: "♏" },
    { name: "Sagittarius", icon: "♐" },
    { name: "Capricorn", icon: "♑" },
    { name: "Aquarius", icon: "♒" },
    { name: "Pisces", icon: "♓" },
  ];

  return (
    <footer className="relative bg-[#07080f] border-t border-[#A855F7]/20 pt-16 pb-6 overflow-hidden">
      {/* Background Grid Pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Subtle purple glow */}
      <div
        className="absolute w-[600px] h-[300px] bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          filter: "blur(120px)",
          background:
            "radial-gradient(ellipse, rgba(168, 85, 247, 0.05) 0%, transparent 70%)",
        }}
      ></div>

      <div className="container xl:max-w-[1440px] mx-auto px-6 max-w-[1200px] relative z-10 w-full">
        {/* Top Section - Main Footer Content */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-8 mb-16">
          {/* Column 1: Brand & Info */}
          <div className="w-full lg:w-4/12 flex flex-col gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#A855F7] to-[#8B5CF6] flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                <Iconify
                  icon="ph:sparkle-fill"
                  className="text-white text-lg"
                />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Astrology{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F472B6] to-[#A855F7]">
                  Service
                </span>
              </span>
            </div>

            <p className="text-gray-400 text-[13px] leading-relaxed max-w-[320px]">
              The leading{" "}
              <span className="text-white">Astrology-as-a-Service</span>{" "}
              platform powering horoscopes, birth charts, and cosmic
              intelligence for your app and website.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-2">
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-[#111116] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#A855F7]/50 hover:bg-[#1A1A24] transition-all"
              >
                <Iconify icon="fa6-brands:twitter" className="text-sm" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-[#111116] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#A855F7]/50 hover:bg-[#1A1A24] transition-all"
              >
                <Iconify icon="fa6-brands:facebook-f" className="text-sm" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-[#111116] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#A855F7]/50 hover:bg-[#1A1A24] transition-all"
              >
                <Iconify icon="fa6-brands:youtube" className="text-sm" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-[#111116] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#A855F7]/50 hover:bg-[#1A1A24] transition-all"
              >
                <Iconify icon="ph:globe" className="text-lg" />
              </a>
            </div>

            {/* Zodiac Signs Row */}
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <span className="text-gray-500 text-[10px] font-bold tracking-widest uppercase mr-2 text-nowrap">
                All Signs:
              </span>
              {zodiacSigns.map((sign, idx) => (
                <div
                  key={idx}
                  className="w-5 h-5 rounded flex items-center justify-center bg-[#A855F7]/10 border border-[#A855F7]/30 text-[#A855F7] text-[10px]"
                  title={sign.name}
                >
                  {sign.icon}
                </div>
              ))}
            </div>
          </div>

          {/* Column 2 & 3 wrapper for desktop layout */}
          <div className="w-full lg:w-7/12 flex flex-col sm:flex-row justify-between gap-12 lg:gap-8">
            {/* Column 2: Quick Links */}
            <div className="flex flex-col gap-5 min-w-[150px]">
              <h4 className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-white uppercase">
                <Iconify icon="ph:sparkle-fill" className="text-[#A855F7]" />{" "}
                Quick Links
              </h4>
              <ul className="flex flex-col gap-3">
                <li>
                  <Link
                    href="#"
                    className="text-[13px] text-gray-400 hover:text-white flex items-center gap-2 transition-colors group"
                  >
                    <span className="text-[#A855F7] opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </span>{" "}
                    Terms & Condition
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-[13px] text-gray-400 hover:text-white flex items-center gap-2 transition-colors group"
                  >
                    <span className="text-[#A855F7] opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </span>{" "}
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-[13px] text-gray-400 hover:text-white flex items-center gap-2 transition-colors group"
                  >
                    <span className="text-[#A855F7] opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </span>{" "}
                    Pricing Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-[13px] text-gray-400 hover:text-white flex items-center gap-2 transition-colors group"
                  >
                    <span className="text-[#A855F7] opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </span>{" "}
                    About Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Pages & Newsletter */}
            <div className="flex flex-col gap-8 flex-grow max-w-[300px]">
              {/* Pages List */}
              <div className="flex flex-col gap-5">
                <h4 className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-[#F472B6] uppercase">
                  <Iconify icon="ph:sparkle-fill" /> Pages
                </h4>
                <ul className="flex flex-col gap-3">
                  <li>
                    <Link
                      href="#"
                      className="text-[13px] text-gray-400 hover:text-white flex items-center gap-2 transition-colors group"
                    >
                      <span className="text-[#F472B6] opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </span>{" "}
                      Kundali Plan
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-[13px] text-gray-400 hover:text-white flex items-center gap-2 transition-colors group"
                    >
                      <span className="text-[#F472B6] opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </span>{" "}
                      Login / Register
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Newsletter */}
              <div className="flex flex-col gap-4">
                <h4 className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-[#38BDF8] uppercase">
                  <Iconify icon="ph:sparkle-fill" /> Newsletter
                </h4>
                <form className="flex flex-col gap-3">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full bg-[#111116] border border-white/10 rounded-xl px-4 py-3 text-[13px] text-white placeholder:text-gray-600 focus:outline-none focus:border-[#A855F7]/50 focus:bg-[#1A1A24] transition-colors"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#8B5CF6] text-white text-[13px] font-bold hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all flex items-center justify-center gap-2"
                  >
                    Subscribe{" "}
                    <Iconify icon="ph:sparkle-fill" className="text-[10px]" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Copyright & Status */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-white/5 gap-4">
          <p className="text-[11px] text-gray-500 font-medium">
            © {currentYear}{" "}
            <span className="text-[#F472B6] font-bold">Astrology Service</span>{" "}
            — Crafted with{" "}
            <Iconify
              icon="ph:heart-fill"
              className="inline text-red-500 text-xs mx-0.5"
            />{" "}
            under the stars.
          </p>

          <div className="flex items-center gap-2 bg-[#1A1A24]/50 rounded-full px-3 py-1 border border-white/5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_5px_#10B981]"></div>
            <span className="text-[10px] text-gray-400 font-medium">
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
