"use client";

import Iconify from "@/src/components/Iconify";

export default function LandingPricing() {
  const plans = [
    {
      name: "Basic",
      tagline: "Great for growing astrology businesses",
      price: "2800.00",
      icon: "🌓",
      features: [
        { text: "Numerology AI", active: true },
        { text: "Text Based Version Only", active: true },
        { text: "Long / Short replies", active: true },
        { text: "Query Limit: 7 Lakhs tokens", active: true },
      ],
      buttonText: "Choose Plan",
      isPopular: false,
      theme: {
        borderGroup:
          "border-sky-400/20 hover:border-sky-400/50 hover:shadow-[0_0_60px_rgba(56,189,248,0.12),0_20px_60px_rgba(0,0,0,0.4)]",
        gradientText: "from-sky-500 to-sky-400",
        gradientBg: "from-sky-500 to-sky-400",
        glow: "bg-[radial-gradient(circle,rgba(56,189,248,0.12)_0%,transparent_70%)]",
        iconShadow: "shadow-[0_8px_28px_rgba(56,189,248,0.12)]",
        checkBorder: "border-sky-400/40",
        checkFill: "#38bdf8",
        btnBorder: "border-sky-400/20",
        btnHoverShadow: "hover:shadow-[0_12px_36px_rgba(56,189,248,0.12)]",
      },
    },
    {
      name: "Growth",
      tagline: "per month",
      price: "3600.00",
      icon: "✨",
      features: [
        { text: "Numerology AI", active: true },
        { text: "Astrology AI", active: true },
        { text: "Text Based + Image Upload", active: true },
        { text: "Long / Short replies", active: true },
        { text: "Query Limit: 1 million tokens", active: true },
      ],
      buttonText: "Choose Plan",
      isPopular: false,
      theme: {
        borderGroup:
          "border-orange-400/20 hover:border-orange-400/50 hover:shadow-[0_0_60px_rgba(192,132,252,0.12),0_20px_60px_rgba(0,0,0,0.4)]",
        gradientText: "from-orange-500 to-orange-400",
        gradientBg: "from-orange-500 to-orange-400",
        glow: "bg-[radial-gradient(circle,rgba(192,132,252,0.12)_0%,transparent_70%)]",
        iconShadow: "shadow-[0_8px_28px_rgba(192,132,252,0.12)]",
        checkBorder: "border-orange-400/40",
        checkFill: "#c084fc",
        btnBorder: "border-orange-400/20",
        btnHoverShadow: "hover:shadow-[0_12px_36px_rgba(192,132,252,0.12)]",
      },
    },
    {
      name: "Pro",
      tagline: "Our most popular choice powerhouse",
      price: "4500.00",
      icon: "🌟",
      badge: "Most Popular",
      features: [
        { text: "Numerology AI", active: true },
        { text: "Astrology AI", active: true },
        { text: "Vastu AI", active: true },
        { text: "Text + Image Upload + Audio Upload", active: true },
        { text: "Chat Pdf Generate", active: true },
        {
          text: "Intelligent Product Recommendations Boost Sales",
          active: true,
        },
        { text: "Long / Short replies", active: true },
        { text: "Query Limit: 1 million tokens", active: true },
      ],
      buttonText: "Get Started Now",
      isPopular: true,
      theme: {
        borderGroup:
          "border-amber-500/30 hover:border-amber-500/60 hover:shadow-[0_0_60px_rgba(236,72,153,0.15),0_20px_60px_rgba(0,0,0,0.4)]",
        gradientText: "from-amber-500 to-amber-400",
        gradientBg: "from-amber-500 to-amber-400",
        glow: "bg-[radial-gradient(circle,rgba(236,72,153,0.12)_0%,transparent_70%)]",
        iconShadow: "shadow-[0_8px_28px_rgba(236,72,153,0.2)]",
        checkBorder: "border-amber-500/40",
        checkFill: "#F59E0B",
        btnBorder: "border-amber-500/40",
        btnHoverShadow: "hover:shadow-[0_12px_36px_rgba(236,72,153,0.25)]",
      },
    },
    {
      name: "Premium",
      tagline: "per month",
      price: "5200.00",
      icon: "💫",
      features: [
        { text: "Numerology AI", active: true },
        { text: "Astrology AI", active: true },
        { text: "Vastu AI", active: true },
        { text: "Multiple Profile Communication", active: true },
        { text: "Text + Image Upload + Audio Upload", active: true },
        { text: "Chat Pdf Generate", active: true },
        { text: "Intelligent Product Referrals In Boost Sales", active: true },
        { text: "Long / Short replies", active: true },
        { text: "Query Limit: 1 million tokens", active: true },
      ],
      buttonText: "Choose Plan",
      isPopular: false,
      theme: {
        borderGroup:
          "border-indigo-400/20 hover:border-indigo-400/50 hover:shadow-[0_0_60px_rgba(129,140,248,0.15),0_20px_60px_rgba(0,0,0,0.4)]",
        gradientText: "from-indigo-500 to-indigo-400",
        gradientBg: "from-indigo-500 to-indigo-400",
        glow: "bg-[radial-gradient(circle,rgba(129,140,248,0.12)_0%,transparent_70%)]",
        iconShadow: "shadow-[0_8px_28px_rgba(129,140,248,0.12)]",
        checkBorder: "border-indigo-400/40",
        checkFill: "#818cf8",
        btnBorder: "border-indigo-400/20",
        btnHoverShadow: "hover:shadow-[0_12px_36px_rgba(129,140,248,0.12)]",
      },
    },
  ];

  return (
    <section
      className="relative py-[100px] bg-[#07080f] overflow-hidden"
      id="pricing"
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
        className="absolute w-[500px] h-[500px] -top-[100px] -right-[100px] rounded-full  "
        style={{
          filter: "blur(80px)",
          background:
            "radial-gradient(circle, rgba(124, 58, 237, 0.12) 0%, transparent 70%)",
        }}
      ></div>
      <div
        className="absolute w-[400px] h-[400px] -bottom-[100px] -left-[80px] rounded-full  "
        style={{
          filter: "blur(80px)",
          background:
            "radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, transparent 70%)",
        }}
      ></div>

      <div className="container xl:max-w-[1440px] mx-auto px-6 max-w-[1200px] relative z-10 w-full text-center">
        {/* Section Header */}
        <div className="flex flex-col items-center mb-16">
          <h2 className="text-[2.5rem] md:text-[3.5rem] font-bold text-white mb-4 tracking-tight leading-[1.1]">
            Tailored pricing plans <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FBBF24] to-[#F97316] opacity-80">
              designed for you
            </span>
          </h2>

          <p className="text-[#9CA3AF] max-w-2xl text-[13px] font-light leading-relaxed mx-auto">
            All plans include 40+ advanced astrology tools and features. <br />
            Choose the cosmic plan that fits your journey.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 w-full mx-auto items-start">
          {plans.map((plan, index) => (
            <div key={index} className="w-full h-full">
              <div
                className={`relative h-full rounded-[24px] overflow-hidden 
      bg-white/[0.02] border backdrop-blur-xl 
      transition-all duration-[350ms] hover:-translate-y-[10px] 
      ${plan.theme.borderGroup}`}
              >
                {/* <!-- Top Gradient Line --> */}
                <div
                  className={`absolute top-0 left-0 right-0 h-[1px] 
        bg-gradient-to-br ${plan.theme.gradientText} opacity-50`}
                ></div>

                {/* <!-- Glow Effect --> */}
                <div
                  className={`absolute top-[30px] left-1/2 -translate-x-1/2 
        w-[120px] h-[120px] ${plan.theme.glow} blur-2xl pointer-events-none`}
                ></div>

                <div className="px-[28px] pt-[36px] pb-[32px]">
                  {/* Popular Badge */}
                  {plan.isPopular && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-amber-400 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-[0_0_10px_rgba(236,72,153,0.5)] flex items-center gap-1 z-20">
                      <Iconify icon="ph:star-fill" className="text-[10px]" />{" "}
                      {plan.badge}
                    </div>
                  )}

                  {/* <!-- Icon --> */}
                  <div className="text-center mb-[20px]">
                    <div
                      className={`w-[70px] h-[70px] rounded-[20px] 
            bg-gradient-to-br ${plan.theme.gradientBg} 
            flex items-center justify-center 
            mx-auto text-[30px] 
            ${plan.theme.iconShadow} 
            relative`}
                    >
                      {plan.icon}
                      <div
                        className="absolute inset-0 rounded-[20px] 
              bg-white/10 pointer-events-none"
                      ></div>
                    </div>
                  </div>

                  {/* <!-- Title --> */}
                  <div className="text-center mb-[20px]">
                    <h3 className="text-[20px] font-bold text-slate-100 mb-[6px]">
                      {plan.name}
                    </h3>
                    <p className="text-[13px] text-slate-500 leading-[1.5]">
                      {plan.tagline}
                    </p>
                  </div>

                  {/* <!-- Price --> */}
                  <div className="text-center mb-[24px] pb-[24px] border-b border-white/10">
                    <div
                      className={`text-[52px] font-extrabold leading-none 
            bg-gradient-to-br ${plan.theme.gradientText} 
            bg-clip-text text-transparent`}
                    >
                      {plan.price}
                    </div>
                    <div className="text-[13px] text-slate-600 mt-[4px]">
                      per month
                    </div>
                  </div>

                  {/* <!-- Features --> */}
                  <ul className="mb-[28px] space-y-[12px]">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-[10px]">
                        <div
                          className={`w-[20px] h-[20px] rounded-full 
                bg-white/5 border ${plan.theme.checkBorder} 
                flex items-center justify-center shrink-0 mt-[1px]`}
                        >
                          <svg
                            width="10"
                            height="10"
                            fill={plan.theme.checkFill}
                            viewBox="0 0 16 16"
                          >
                            <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                          </svg>
                        </div>
                        <span className="text-[13px] text-slate-400 leading-[1.5]">
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* <!-- Button --> */}
                  <a
                    href="https://astrologyservice.in/login"
                    className={`flex items-center justify-center gap-[8px] 
         py-[14px] px-[24px] rounded-[14px] 
         text-[14px] font-bold 
         bg-white/5 border ${plan.theme.btnBorder} 
         text-slate-300 
         transition-all duration-[250ms] 
         hover:-translate-y-[2px] 
         ${plan.theme.btnHoverShadow}`}
                  >
                    {plan.buttonText}
                    <svg
                      width="14"
                      height="14"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom 3 Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto border-t border-white/5 pt-12">
          <div className="flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-full bg-[#1E112A] flex items-center justify-center mb-3 text-[#F59E0B]">
              <Iconify icon="mdi:lightning-bolt" className="text-sm" />
            </div>
            <h4 className="text-white text-xs font-bold mb-1">99.9% Uptime</h4>
            <p className="text-gray-500 text-[10px]">Cosmic reliability</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-full bg-[#1E112A] flex items-center justify-center mb-3 text-[#F97316]">
              <Iconify icon="mdi:lock" className="text-sm" />
            </div>
            <h4 className="text-white text-xs font-bold mb-1">Secure & Safe</h4>
            <p className="text-gray-500 text-[10px]">Keep your data quiet</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-full bg-[#1E112A] flex items-center justify-center mb-3 text-[#3B82F6]">
              <Iconify icon="mdi:shield-check" className="text-sm" />
            </div>
            <h4 className="text-white text-xs font-bold mb-1">30-Day Trial</h4>
            <p className="text-gray-500 text-[10px]">Risk-free guarantee</p>
          </div>
        </div>
      </div>
    </section>
  );
}
