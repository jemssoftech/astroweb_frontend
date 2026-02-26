"use client";

import Iconify from "@/src/components/Iconify";
import BackgroundCanvas from "../BackgroundCanvas";

export default function LandingHero() {
  return (
    <div className="relative min-h-[95vh] flex items-center justify-center pt-[100px] overflow-hidden bg-[#07080f]">
      {/* Background Starry Pattern (simulated with tiny dots and varied opacity) */}
      <div className="absolute inset-0 z-0">
        <BackgroundCanvas />
      </div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Subtle Purple Background Glows */}
      <div
        className="absolute w-[800px] h-[800px] top-[-20%] right-[-10%] rounded-full pointer-events-none"
        style={{
          filter: "blur(120px)",
          background:
            "radial-gradient(circle, rgba(249, 115, 22, 0.08) 0%, transparent 70%)",
        }}
      ></div>
      <div
        className="absolute w-[600px] h-[600px] bottom-[-10%] left-[-10%] rounded-full pointer-events-none"
        style={{
          filter: "blur(120px)",
          background:
            "radial-gradient(circle, rgba(236, 72, 153, 0.03) 0%, transparent 70%)",
        }}
      ></div>

      <div className="container xl:max-w-[1440px] mx-auto px-6 relative z-10 w-full mb-12">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8  mx-auto">
          {/* Left Column - Content */}
          <div className="flex-1 w-full max-w-[550px] pt-10 lg:pt-0 z-10">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1A1A24]/60 border border-[#2D1B4E]/50 text-[#F97316] text-[9px] font-bold tracking-widest mb-6 backdrop-blur-sm shadow-[0_0_10px_rgba(45,27,78,0.2)]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#F97316] shadow-[0_0_5px_#F97316]"></div>
              ASTROLOGY-AS-A-SERVICE PLATFORM
            </div>

            {/* Headline */}
            <h1 className="text-[3.2rem] sm:text-[4.2rem] lg:text-[68px] font-bold text-white mb-6 tracking-tight leading-[1.05]">
              <span className="bg-clip-text text-transparent bg-gradient-to-br from-orange-400 via-amber-400 to-amber-400 pb-1 inline-block">
                All-in-One <br />
                Astrology
              </span>{" "}
              <br />
              <span className="text-gray-400">Platform for Your</span> <br />
              Business
            </h1>

            {/* Subheadline */}
            <p className="text-[#9CA3AF] max-w-[480px] text-[17px] mb-10 leading-relaxed font-light">
              AstrologyAPI is the{" "}
              <strong className="text-white font-medium">
                leading Astrology-as-a-Service
              </strong>{" "}
              platform offering horoscopes, birth charts, astrology
              calculations, interpretations and much more for your app and
              website.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-14">
              <button className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-br from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400  duration-300 text-white rounded-xl text-[14px] font-bold transition-all shadow-[0_0_20px_rgba(249, 115, 22,0.3)] hover:scale-[1.02]">
                <Iconify icon="ph:sparkle-fill" className="text-lg" />
                Get Early Access
              </button>
              <button className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#1E293B]/80 backdrop-blur-md border border-white/10 text-white rounded-xl text-[14px] font-bold transition-all hover:bg-[#1A1A24] hover:border-white/20 hover:scale-[1.02]">
                <Iconify
                  icon="ph:users-three"
                  className="text-lg text-gray-400"
                />
                Join Community
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center border border-white/5 rounded-2xl bg-[#09090D]/80 backdrop-blur-md max-w-[480px]">
              <div className="flex-1 py-6 px-4 text-center border-r border-white/5">
                <div className="text-2xl font-bold text-[#FBBF24] mb-1.5 tracking-tight">
                  0+
                </div>
                <div className="text-[9px] text-gray-500 font-bold tracking-[0.1em] uppercase">
                  API ENDPOINTS
                </div>
              </div>
              <div className="flex-1 py-6 px-4 text-center border-r border-white/5">
                <div className="text-2xl font-bold text-[#FBBF24] mb-1.5 tracking-tight">
                  0k+
                </div>
                <div className="text-[9px] text-gray-500 font-bold tracking-[0.1em] uppercase">
                  ACTIVE USERS
                </div>
              </div>
              <div className="flex-1 py-6 px-4 text-center">
                <div className="text-2xl font-bold text-[#FBBF24] mb-1.5 tracking-tight">
                  99.9%
                </div>
                <div className="text-[9px] text-gray-500 font-bold tracking-[0.1em] uppercase">
                  UPTIME SLA
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Orbital Graphic */}
          <div className="flex-1 flex justify-center items-center relative w-full h-[500px] lg:h-[700px] mt-10 lg:mt-0">
            <div className="relative w-[400px] h-[400px] lg:w-[500px] lg:h-[500px] flex items-center justify-center">
              {/* Concentric Rings */}
              <div className="absolute w-[110%] h-[110%] rounded-full border border-white/[0.04]"></div>
              <div className="absolute w-[85%] h-[85%] rounded-full border border-white/[0.05]"></div>
              <div className="absolute w-[60%] h-[60%] rounded-full border border-white/[0.06]"></div>
              <div className="absolute w-[35%] h-[35%] rounded-full border border-white/[0.08]"></div>

              {/* Center Glow / Orb */}
              <div className="absolute w-[45%] h-[45%] rounded-full bg-gradient-to-br from-[#E879F9] to-[#7E22CE] blur-[80px] opacity-40"></div>
              <div className="absolute inset-[26%] rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(192,132,252,0.4),rgba(124,58,237,0.25)_40%,rgba(4,5,13,0.9)_80%)] border border-[rgba(249, 115, 22,0.3)] overflow-hidden backdrop-blur-2xl shadow-[0_0_80px_rgba(124,58,237,0.4),0_0_160px_rgba(124,58,237,0.15),inset_0_0_40px_rgba(249, 115, 22,0.1)] ">
                <img
                  src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&q=80"
                  className="w-full h-full object-cover rounded-full opacity-50 mix-blend-lighten"
                  alt=""
                />

                <div className="absolute flex flex-col items-center justify-center inset-0 gap-3">
                  <div className="absolute rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(192,132,252,0.2),transparent_55%),radial-gradient(circle_at_70%_70%,rgba(236,72,153,0.12),transparent_50%)] animate-pulseOpacity">
                    ☽
                  </div>
                  <div className="text-[10px] text-[rgba(249, 115, 22,0.7)] tracking-[0.2em] uppercase mt-6 font-semibold">
                    Oracle
                  </div>
                </div>
              </div>

              {/* Card 1: Birth Charts */}
              <div className="absolute top-[15%] left-[-20%] lg:left-[-15%] bg-[#0F172A]/90 backdrop-blur-xl border border-white/5 p-4 rounded-2xl w-48 shadow-2xl z-20">
                <div className="w-10 h-10 rounded-xl bg-[#1C162A] flex items-center justify-center mb-3">
                  <Iconify
                    icon="mdi:sparkles"
                    className="text-[#F59E0B] text-xl"
                  />
                </div>
                <h3 className="text-white font-bold text-[13px] mb-1">
                  Birth Charts
                </h3>
                <p className="text-gray-500 text-[11px] mb-4">
                  Vedic & Western
                </p>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#022C22] border border-[#059669]/30">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></div>
                  <span className="text-[#10B981] text-[9px] font-bold tracking-widest">
                    LIVE API
                  </span>
                </div>
              </div>

              {/* Card 2: Interpretations */}
              <div className="absolute top-[45%] right-[-25%] lg:right-[-20%] bg-[#0F172A]/90 backdrop-blur-xl border border-white/5 p-4 rounded-2xl w-48 shadow-2xl z-20">
                <div className="w-10 h-10 rounded-xl bg-[#2E162A] flex items-center justify-center mb-3">
                  <Iconify
                    icon="mdi:magic-staff"
                    className="text-[#E879F9] text-xl"
                  />
                </div>
                <h3 className="text-white font-bold text-[13px] mb-1">
                  Interpretations
                </h3>
                <p className="text-gray-500 text-[11px]">AI-powered insights</p>
              </div>

              {/* Card 3: Real-time Data */}
              <div className="absolute bottom-[5%] right-[-10%] lg:right-[-5%] bg-[#0F172A]/90 backdrop-blur-xl border border-white/5 p-4 rounded-2xl w-48 shadow-2xl z-20">
                <div className="w-10 h-10 rounded-xl bg-[#0F221B] flex items-center justify-center mb-3">
                  <Iconify
                    icon="mdi:earth"
                    className="text-[#10B981] text-xl"
                  />
                </div>
                <h3 className="text-white font-bold text-[13px] mb-1">
                  Real-time Data
                </h3>
                <p className="text-gray-500 text-[11px] mb-4">
                  Planetary positions
                </p>
                {/* Audio/Data bars visualization */}
                <div className="flex gap-1.5 items-end h-[16px]">
                  <div className="w-1.5 h-[100%] bg-[#10B981] rounded-sm"></div>
                  <div className="w-1.5 h-[60%] bg-[#10B981] rounded-sm"></div>
                  <div className="w-1.5 h-[80%] bg-[#10B981] rounded-sm"></div>
                  <div className="w-1.5 h-[40%] bg-[#10B981] rounded-sm"></div>
                  <div className="w-1.5 h-[100%] bg-[#10B981] rounded-sm"></div>
                </div>
              </div>

              {/* Orbiting Zodiac Icons & Dots */}
              {/* Ring 1 (outer) */}
              <div className="absolute top-[-5%] right-[20%] w-8 h-8 rounded-lg bg-[#1B112C] border border-white/5 flex items-center justify-center z-10">
                <Iconify
                  icon="mdi:zodiac-sagittarius"
                  className="text-[#F97316] text-[14px]"
                />
              </div>
              <div className="absolute bottom-[20%] left-[-5%] w-8 h-8 rounded-lg bg-[#1B112C] border border-white/5 flex items-center justify-center z-10">
                <Iconify
                  icon="mdi:zodiac-scorpio"
                  className="text-[#F97316] text-[14px]"
                />
              </div>

              {/* Ring 2 */}
              <div className="absolute top-[8%] left-[10%] w-7 h-7 rounded-md bg-[#1B112C] border border-white/5 flex items-center justify-center z-10">
                <Iconify
                  icon="mdi:zodiac-gemini"
                  className="text-white/40 text-[12px]"
                />
              </div>
              <div className="absolute bottom-[0%] right-[15%] w-7 h-7 rounded-md bg-[#1B112C] border border-white/5 flex items-center justify-center z-10">
                <Iconify
                  icon="mdi:zodiac-aquarius"
                  className="text-white/40 text-[12px]"
                />
              </div>

              {/* Ring 3 */}
              <div className="absolute top-[20%] right-[0%] w-6 h-6 rounded-md bg-[#1B112C] border border-white/5 flex items-center justify-center z-10">
                <Iconify
                  icon="mdi:zodiac-pisces"
                  className="text-white/40 text-[10px]"
                />
              </div>
              <div className="absolute bottom-[20%] left-[15%] w-6 h-6 rounded-md bg-[#1B112C] border border-white/5 flex items-center justify-center z-10">
                <Iconify
                  icon="mdi:zodiac-leo"
                  className="text-white/40 text-[10px]"
                />
              </div>

              <div className="absolute top-[35%] left-[0%] w-6 h-6 rounded-md bg-[#1B112C] border border-white/5 flex items-center justify-center z-10">
                <Iconify
                  icon="mdi:zodiac-libra"
                  className="text-[#F97316]/80 text-[10px]"
                />
              </div>

              {/* Floating Glowing Dots */}
              <div className="absolute bottom-[25%] left-[15%] w-3 h-3 rounded-full bg-[#F59E0B] shadow-[0_0_15px_rgba(245,158,11,0.6)] z-10"></div>
              <div className="absolute top-[12%] right-[25%] w-2 h-2 rounded-full bg-white/40 shadow-[0_0_10px_rgba(255,255,255,0.3)] z-10"></div>
            </div>
            <div className="absolute bottom-4 left-0 w-full z-10 flex items-end justify-center pointer-events-none">
              <div className="flex gap-12 lg:gap-20 text-[#4B5563] text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] max-w-full overflow-hidden px-4">
                <div className="flex items-center gap-3">
                  <Iconify
                    icon="mdi:zodiac-taurus"
                    className="text-lg opacity-50"
                  />{" "}
                  TAURUS
                </div>
                <div className="flex items-center gap-3">
                  <Iconify
                    icon="mdi:zodiac-gemini"
                    className="text-lg opacity-50"
                  />{" "}
                  GEMINI
                </div>
                <div className="flex items-center gap-3">
                  <Iconify
                    icon="mdi:zodiac-cancer"
                    className="text-lg opacity-50"
                  />{" "}
                  CANCER
                </div>
                <div className="flex items-center gap-3">
                  <Iconify
                    icon="mdi:zodiac-leo"
                    className="text-lg opacity-50"
                  />{" "}
                  LEO
                </div>
                <div className="hidden sm:flex items-center gap-3">
                  <Iconify
                    icon="mdi:zodiac-virgo"
                    className="text-lg opacity-50"
                  />{" "}
                  VIRGO
                </div>
                <div className="hidden md:flex items-center gap-3">
                  <Iconify
                    icon="mdi:zodiac-libra"
                    className="text-lg opacity-50"
                  />{" "}
                  LIBRA
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Zodiac Ticker Base - Gradient fade out */}
    </div>
  );
}
