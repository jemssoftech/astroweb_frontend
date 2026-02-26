"use client";

import Iconify from "@/src/components/Iconify";

export default function LandingAchievements() {
  const achievements = [
    {
      value: "7.1k+",
      label: "Support Tickets Resolved",
      icon: "mdi:ticket",
      colorClass: "text-[#F97316]", // Purple
      bgClass: "bg-[#2D1B4E]",
      borderColor: "border-[#F97316]",
      glowColor: "shadow-[0_0_20px_rgba(249, 115, 22,0.3)]",
    },
    {
      value: "50k+",
      label: "Cosmic Community Members",
      icon: "mdi:moon-waning-crescent",
      colorClass: "text-[#F59E0B]", // Pink
      bgClass: "bg-[#4A1D3A]",
      borderColor: "border-[#F59E0B]",
      glowColor: "shadow-[0_0_20px_rgba(236,72,153,0.3)]",
    },
    {
      value: "4.8/5",
      label: "Highly Rated Readings",
      icon: "mdi:star",
      colorClass: "text-[#F59E0B]", // Yellow
      bgClass: "bg-[#452D13]",
      borderColor: "border-[#F59E0B]",
      glowColor: "shadow-[0_0_20px_rgba(245,158,11,0.3)]",
      rating: true, // Flag to show stars
    },
    {
      value: "100%",
      label: "Money Back Guarantee",
      icon: "mdi:shield-check",
      colorClass: "text-[#10B981]", // Green
      bgClass: "bg-[#06392B]",
      borderColor: "border-[#10B981]",
      glowColor: "shadow-[0_0_20px_rgba(16,185,129,0.3)]",
    },
  ];

  return (
    <section
      className="relative py-24 bg-[#0F172A] overflow-hidden"
      id="achievements"
    >
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
      <div
        className="absolute w-[500px] h-[500px] -top-[100px] -left-[100px] rounded-full  "
        style={{
          filter: "blur(80px)",
          background:
            "radial-gradient(circle, rgba(124, 58, 237, 0.12) 0%, transparent 70%)",
        }}
      ></div>
      <div
        className="absolute w-[400px] h-[400px] -bottom-[100px] -right-[80px] rounded-full  "
        style={{
          filter: "blur(80px)",
          background:
            "radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, transparent 70%)",
        }}
      ></div>
      {/* Subtle Background Radial Gradients */}
      <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-[#F97316] opacity-[0.02] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-[#F59E0B] opacity-[0.02] blur-[120px] rounded-full pointer-events-none" />

      <div className="container xl:max-w-[1440px] mx-auto px-4 sm:px-6 relative z-10 w-full max-w-full">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16 w-full">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A0B2E]/80 border border-[#F97316]/30 mb-8 backdrop-blur-sm">
            <Iconify
              icon="ph:sparkle-fill"
              className="text-[#E879F9] text-[10px]"
            />
            <span className="text-[#E879F9] text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase">
              OUR ACHIEVEMENTS
            </span>
          </div>

          <h2 className="text-[2.2rem] sm:text-[3rem] md:text-[3.5rem] font-bold text-white mb-6 tracking-tight leading-[1.1]">
            Trusted by thousands of <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FBBF24] to-[#F97316] pb-1 inline-block">
              satisfied customers
            </span>
          </h2>

          <p className="text-[#9CA3AF] max-w-xl text-[1.05rem] font-light leading-relaxed">
            Join our growing cosmic community and experience excellence in every
            interaction. <br className="hidden sm:block" />
            <span className="mt-2 block text-gray-400">
              Real numbers, real impact, real success stories.
            </span>
          </p>
        </div>

        {/* Achievements Cards */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6 lg:gap-8 mb-20 w-full px-4 mx-auto max-w-[1200px]">
          {achievements.map((item, index) => (
            <div
              key={index}
              className="relative bg-[#0F172A] border border-white/5 rounded-2xl p-8 lg:p-10 flex flex-col items-center text-center hover:bg-[#1E293B] transition-all group shadow-xl flex-1 w-full max-w-[280px]"
            >
              {/* Icon Box */}
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${item.bgClass} ${item.glowColor} border border-white/5`}
              >
                <Iconify
                  icon={item.icon}
                  className={`text-2xl ${item.colorClass}`}
                />
              </div>

              {/* Value */}
              <div className="text-4xl md:text-[2.75rem] font-bold text-white mb-3 tracking-tight">
                {item.value}
              </div>

              {/* Label */}
              <p className="text-[#9CA3AF] text-[13px] font-medium mb-8">
                {item.label}
              </p>

              {/* Optional Star Rating for the specific card */}
              {item.rating && (
                <div className="flex gap-1.5 absolute bottom-8">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Iconify
                      key={star}
                      icon="mdi:star"
                      className="text-[#F59E0B] text-sm"
                    />
                  ))}
                </div>
              )}

              {/* Bottom Color Bar */}
              {item.rating ? (
                <div className="absolute bottom-8 w-[60%] h-[3px] rounded-full hidden"></div>
              ) : (
                <div
                  className="absolute bottom-8 w-[60%] h-[3px] rounded-full"
                  style={{
                    backgroundColor: item.colorClass
                      .replace("text-[", "")
                      .replace("]", ""),
                  }}
                ></div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Powered By & Zodiac Row */}
        <div className="w-full border-t border-white/5 pt-10 flex flex-col items-center -mb-8">
          <div className="text-[9px] text-gray-500 font-bold tracking-[0.3em] uppercase mb-8">
            POWERED BY COSMIC PRECISION
          </div>

          <div className="flex gap-4 sm:gap-6 md:gap-8 text-[#F97316]/60 overflow-hidden w-full justify-center flex-wrap">
            <Iconify
              icon="mdi:zodiac-aries"
              className="text-lg hover:text-[#F97316] transition-colors cursor-pointer"
            />
            <Iconify
              icon="mdi:zodiac-taurus"
              className="text-lg hover:text-[#F97316] transition-colors cursor-pointer"
            />
            <Iconify
              icon="mdi:zodiac-gemini"
              className="text-lg hover:text-[#F97316] transition-colors cursor-pointer"
            />
            <Iconify
              icon="mdi:zodiac-cancer"
              className="text-lg hover:text-[#F97316] transition-colors cursor-pointer"
            />
            <Iconify
              icon="mdi:zodiac-leo"
              className="text-lg hover:text-[#F97316] transition-colors cursor-pointer"
            />
            <Iconify
              icon="mdi:zodiac-virgo"
              className="text-lg hover:text-[#F97316] transition-colors cursor-pointer"
            />
            <Iconify
              icon="mdi:zodiac-libra"
              className="text-lg hover:text-[#F97316] transition-colors cursor-pointer"
            />
            <Iconify
              icon="mdi:zodiac-scorpio"
              className="text-lg hover:text-[#F97316] transition-colors cursor-pointer"
            />
            <Iconify
              icon="mdi:zodiac-sagittarius"
              className="text-lg hover:text-[#F97316] transition-colors cursor-pointer"
            />
            <Iconify
              icon="mdi:zodiac-capricorn"
              className="text-lg hover:text-[#F97316] transition-colors cursor-pointer"
            />
            <Iconify
              icon="mdi:zodiac-aquarius"
              className="text-lg hover:text-[#F97316] transition-colors cursor-pointer"
            />
            <Iconify
              icon="mdi:zodiac-pisces"
              className="text-lg hover:text-[#F97316] transition-colors cursor-pointer"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
