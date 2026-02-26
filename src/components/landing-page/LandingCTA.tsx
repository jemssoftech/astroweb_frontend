"use client";

import Iconify from "@/src/components/Iconify";

export default function LandingCTA() {
  return (
    <section
      className="relative py-[100px] bg-[#07080f] overflow-hidden"
      id="cta"
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

      {/* Background Glows */}
      <div
        className="absolute w-[600px] h-[600px] -top-[150px] -left-[150px] rounded-full pointer-events-none"
        style={{
          filter: "blur(80px)",
          background:
            "radial-gradient(circle, rgba(124,58,237,0.13) 0%, transparent 70%)",
        }}
      ></div>
      <div
        className="absolute w-[450px] h-[450px] -bottom-[100px] -right-[100px] rounded-full pointer-events-none"
        style={{
          filter: "blur(80px)",
          background:
            "radial-gradient(circle, rgba(236,72,153,0.09) 0%, transparent 70%)",
        }}
      ></div>

      <div className="container xl:max-w-[1440px] mx-auto px-6  relative z-10 w-full">
        {/* Two Column Layout (CTA Content / Graphic) */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-8  mx-auto">
          {/* Left Side - Content */}
          <div className="w-full lg:w-[45%] flex flex-col items-start text-left">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1A24] border border-[#2D1B4E] mb-6 shadow-[0_0_15px_rgba(45,27,78,0.3)]">
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#F97316",
                  boxShadow: "0 0 8px #F97316",
                  animation: "pulse-dot 2s ease infinite",
                }}
              ></div>
              <span className="text-[#F97316] text-[10px] font-bold tracking-wider uppercase">
                Limited Time Offer
              </span>
            </div>

            {/* Title */}
            <h2 className="text-[2.5rem] md:text-[3.5rem] font-bold text-white mb-4 tracking-tight leading-[1.1]">
              Ready to get <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FBBF24] to-[#F97316]">
                started?
              </span>
            </h2>

            {/* Subtext */}
            <p className="text-[#9CA3AF] text-[13px] font-light leading-relaxed mb-8 max-w-[400px]">
              Start your project with a <strong>14-day free trial.</strong> No
              credit card required.
            </p>

            {/* Checklist */}
            <ul className="flex flex-col gap-3 mb-10">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#F97316]/10 flex items-center justify-center border border-[#F97316]/30">
                  <Iconify
                    icon="ph:check-bold"
                    className="text-[#F97316] text-[10px]"
                  />
                </div>
                <span className="text-gray-300 text-[13px]">
                  Full access to all features
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#F97316]/10 flex items-center justify-center border border-[#F97316]/30">
                  <Iconify
                    icon="ph:check-bold"
                    className="text-[#F97316] text-[10px]"
                  />
                </div>
                <span className="text-gray-300 text-[13px]">
                  Cancel anytime, no strings attached
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#F97316]/10 flex items-center justify-center border border-[#F97316]/30">
                  <Iconify
                    icon="ph:check-bold"
                    className="text-[#F97316] text-[10px]"
                  />
                </div>
                <span className="text-gray-300 text-[13px]">
                  24/7 customer support
                </span>
              </li>
            </ul>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-12">
              <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white text-[13px] font-bold flex items-center gap-2 hover:shadow-[0_0_20px_rgba(249, 115, 22,0.4)] transition-all">
                Get Started Free <Iconify icon="ph:arrow-right-bold" />
              </button>
              <button className="px-6 py-3 rounded-xl bg-[#1E293B] border border-white/10 text-gray-300 text-[13px] font-bold flex items-center gap-2 hover:bg-[#1A1A24] transition-all">
                <Iconify icon="ph:play-circle" className="text-lg" /> Watch Demo
              </button>
            </div>

            {/* Bottom Stats Line */}
            <div className="flex items-center justify-between w-full max-w-[450px] border-t border-white/5 pt-8">
              <div className="flex flex-col">
                <span className="text-white font-bold text-xl mb-1">
                  10,000+
                </span>
                <span className="text-gray-500 text-[9px] font-bold tracking-widest uppercase">
                  Active Users
                </span>
              </div>
              <div className="w-[1px] h-10 bg-white/5"></div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-xl mb-1 text-center">
                  4.9/5
                </span>
                <span className="text-gray-500 text-[9px] font-bold tracking-widest uppercase">
                  User Rating
                </span>
              </div>
              <div className="w-[1px] h-10 bg-white/5"></div>
              <div className="flex flex-col text-right">
                <span className="text-[#10B981] font-bold text-xl mb-1">
                  99.9%
                </span>
                <span className="text-gray-500 text-[9px] font-bold tracking-widest uppercase">
                  Uptime
                </span>
              </div>
            </div>
          </div>

          {/* Right Side - Visual Saturn Graphic */}
          <div className="w-full lg:w-[50%] relative">
            {/* The container for the Saturn image and glass effects */}
            <div className="relative rounded-3xl overflow-hidden bg-[#0F172A] border border-white/5 aspect-[4/3] w-full shadow-2xl group flex items-center justify-center">
              {/* Purple ambient back glow behind Saturn */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-[#F97316] opacity-20 blur-[80px] rounded-full pointer-events-none z-0"></div>

              {/* Saturn Image placeholder (We will use an unsplash space image for now, user can change if needed) */}
              <div className="relative w-[350px] h-[350px] lg:w-[450px] lg:h-[450px] z-10 transition-transform duration-700 ease-in-out group-hover:scale-105">
                <img
                  src="https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=1000&auto=format&fit=crop"
                  alt="Saturn"
                  className="w-full h-full object-contain filter contrast-125 brightness-90 drop-shadow-[0_0_30px_rgba(249, 115, 22,0.3)] mix-blend-screen"
                />
              </div>

              {/* Floating Glass Badges */}

              {/* Top Left Floating Badge (Growth) */}
              <div className="absolute top-[20%] -left-8 md:-left-12 lg:-left-6 bg-[#1E293B]/80 backdrop-blur-md border border-[#F97316]/30 rounded-xl p-3 flex items-center gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-20 animate-[float_6s_ease-in-out_infinite]">
                <div className="w-8 h-8 rounded-lg bg-[#2D1B4E] flex items-center justify-center text-[#F97316]">
                  <Iconify icon="ph:chart-line-up-bold" />
                </div>
                <div className="pr-2">
                  <div className="text-white text-sm font-bold">+127%</div>
                  <div className="text-gray-400 text-[9px] uppercase tracking-wider">
                    Growth Rate
                  </div>
                </div>
              </div>

              {/* Middle Right Floating Badge (Uptime) */}
              <div className="absolute top-[45%] -right-8 md:-right-12 lg:-right-6 bg-[#1E293B]/80 backdrop-blur-md border border-[#10B981]/30 rounded-xl p-3 flex items-center gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-20 animate-[float_8s_ease-in-out_infinite_reverse]">
                <div className="w-8 h-8 rounded-lg bg-[#064E3B] flex items-center justify-center text-[#10B981]">
                  <Iconify icon="ph:check-circle-fill" />
                </div>
                <div className="pr-2">
                  <div className="text-white text-sm font-bold">99.9%</div>
                  <div className="text-gray-400 text-[9px] uppercase tracking-wider">
                    Uptime SLA
                  </div>
                </div>
              </div>

              {/* Bottom Right Floating Badge (Rating) */}
              <div className="absolute bottom-[20%] -right-4 md:-right-8 lg:right-4 bg-[#1E293B]/80 backdrop-blur-md border border-[#F59E0B]/30 rounded-xl p-3 flex items-center gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-20 animate-[float_7s_ease-in-out_infinite_1s]">
                <div className="w-8 h-8 rounded-lg bg-[#831843] flex items-center justify-center text-[#F59E0B]">
                  <Iconify icon="ph:star-fill" />
                </div>
                <div className="pr-2">
                  <div className="text-white text-sm font-bold">4.9 ★</div>
                  <div className="text-gray-400 text-[9px] uppercase tracking-wider">
                    User Rating
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
