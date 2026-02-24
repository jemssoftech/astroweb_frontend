"use client";

import Iconify from "@/src/components/Iconify";

export default function LandingFeatures() {
  const features = [
    {
      num: "01",
      title: "Quality Code",
      description:
        "Code structure that all developers will easily understand and fall in love with.",
      icon: "ph:code-bold",
      colorClass: "text-[#3B82F6]", // Blue
      bgClass: "bg-[#1E293B]/60", // Dark blueish bg
      numClass: "text-[#3B82F6]/50",
    },
    {
      num: "02",
      title: "Continuous Updates",
      description:
        "Free updates for the next 12 months, including new demos and features.",
      icon: "ph:arrows-clockwise-bold",
      colorClass: "text-[#EC4899]", // Pink
      bgClass: "bg-[#831843]/40",
      numClass: "text-[#EC4899]/50",
    },
    {
      num: "03",
      title: "Starter-Kit",
      description:
        "Start your project quickly without having to remove unnecessary features.",
      icon: "ph:rocket-launch-bold",
      colorClass: "text-[#2DD4BF]", // Cyan
      bgClass: "bg-[#134E4A]/60",
      numClass: "text-[#2DD4BF]/50",
    },
    {
      num: "04",
      title: "API Ready",
      description:
        "Just change the endpoint and see your own data loaded within seconds.",
      icon: "mdi:api",
      colorClass: "text-[#F59E0B]", // Yellow/Orange
      bgClass: "bg-[#78350F]/60",
      numClass: "text-[#F59E0B]/50",
    },
    {
      num: "05",
      title: "Excellent Support",
      description:
        "An easy-to-follow doc with lots of references and code examples.",
      icon: "ph:headset-bold",
      colorClass: "text-[#10B981]", // Green
      bgClass: "bg-[#064E3B]/60",
      numClass: "text-[#10B981]/50",
    },
    {
      num: "06",
      title: "Well Documented",
      description:
        "An easy-to-follow doc with lots of references and code examples.",
      icon: "ph:book-open-text-bold",
      colorClass: "text-[#A855F7]", // Purple
      bgClass: "bg-[#4C1D95]/40",
      numClass: "text-[#A855F7]/50",
    },
  ];

  return (
    <section
      className="relative py-24 bg-[#07080f] overflow-hidden"
      id="features"
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
      <div className="container xl:max-w-[1440px] mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#18112A] border border-[#2D1B4E] mb-6 shadow-[0_0_15px_rgba(45,27,78,0.5)]">
            <Iconify
              icon="ph:star-four-fill"
              className="text-[#A855F7] text-xs"
            />
            <span className="text-[#D8B4FE] text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase">
              USEFUL FEATURES
            </span>
          </div>

          <h2 className="text-[2.5rem] md:text-[3.5rem] font-bold text-white mb-6 tracking-tight leading-[1.1]">
            Everything you need <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F472B6] to-[#A855F7]">
              to start your next project
            </span>
          </h2>

          <p className="text-[#9CA3AF] max-w-2xl text-[1.1rem] font-light leading-relaxed">
            Not just a set of tools — the package includes a{" "}
            <strong className="font-semibold text-gray-300">
              ready-to-deploy
            </strong>
            <br />
            conceptual application.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative bg-[#111116] border border-white/[0.04] rounded-2xl p-8 hover:bg-[#16161D] transition-colors group shadow-lg"
            >
              {/* Number */}
              <span
                className={`absolute top-6 right-6 text-[11px] font-bold tracking-widest ${feature.numClass}`}
              >
                {feature.num}
              </span>

              {/* Icon Box */}
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-inner ${feature.bgClass}`}
              >
                {feature.icon === "mdi:api" ? (
                  <span
                    className={`text-[12px] font-bold tracking-wider ${feature.colorClass}`}
                  >
                    API
                  </span>
                ) : (
                  <Iconify
                    icon={feature.icon}
                    className={`text-xl ${feature.colorClass}`}
                  />
                )}
              </div>

              {/* Content */}
              <h3 className="text-white font-bold text-[15px] mb-2">
                {feature.title}
              </h3>
              <p className="text-[#6B7280] text-[13px] leading-[1.7]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Pill */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#111116] border border-[#2D1B4E] hover:bg-[#16161D] transition-all cursor-pointer shadow-[0_0_20px_rgba(45,27,78,0.2)] hover:shadow-[0_0_25px_rgba(45,27,78,0.4)] hover:scale-[1.02]">
            <div className="w-1.5 h-1.5 rounded-full bg-[#A855F7]"></div>
            <span className="text-gray-400 text-[13px]">
              All features included in every plan —
            </span>
            <span className="text-[#D8B4FE] text-[13px] font-semibold flex items-center gap-1">
              View pricing{" "}
              <Iconify icon="mdi:arrow-right" className="text-sm" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
