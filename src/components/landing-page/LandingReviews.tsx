"use client";

import Iconify from "@/src/components/Iconify";

export default function LandingReviews() {
  const reviews = [
    {
      num: "01",
      logoIcon: "ph:squares-four-fill", // Placeholder icon for logo
      logoColor: "text-white",
      logoBg: "bg-red-500",
      review: `"AstroSahi made our astrology consultation app faster and more reliable than ever. The integration was smooth, and the accuracy is impressive!"`,
      starsColor: "text-[#A855F7]", // Purple
      userName: "Rohit Verma",
      userRole: "Founder, AstroSahi",
      avatarSrc: "https://i.pravatar.cc/150?img=11",
      highlight: false,
    },
    {
      num: "02",
      logoIcon: "ph:star-four-fill",
      logoColor: "text-white",
      logoBg: "bg-orange-500",
      review: `"AstroExpertVoice transformed our astrology consultation platform. Reliable and easy to integrate – the results spoke for themselves from day one!"`,
      starsColor: "text-[#EC4899]", // Pink
      userName: "Rahul Mehta",
      userRole: "Founder, AstroExpertVoice",
      avatarSrc: "https://i.pravatar.cc/150?img=33",
      highlight: false,
    },
    {
      num: "03",
      logoIcon: "ph:sun-dim-fill",
      logoColor: "text-yellow-400",
      logoBg: "bg-white",
      review: `"TalkToAcharyaji's prediction module now runs smoother than ever thanks to this API. Performance gains were visible almost immediately after integration!"`,
      starsColor: "text-[#3B82F6]", // Blue
      userName: "Neha Sharma",
      userRole: "COO, TalkToAcharyaji",
      avatarSrc: "https://i.pravatar.cc/150?img=47",
      highlight: true, // This card has blue glow/border in the image
    },
    {
      num: "04",
      logoIcon: "ph:planet-fill",
      logoColor: "text-white",
      logoBg: "bg-blue-600",
      review: `"AstroVishva saw instant engagement improvement after integrating astrology features using this API. Our users noticed the difference right away!"`,
      starsColor: "text-[#F59E0B]", // Yellow
      userName: "Vikas Rao",
      userRole: "Tech Head, AstroVishva",
      avatarSrc: "https://i.pravatar.cc/150?img=53",
      highlight: false,
    },
    {
      num: "05",
      logoIcon: "ph:shooting-star-fill",
      logoColor: "text-white",
      logoBg: "bg-green-500",
      review: `"AstroAngel's reports became faster and more accurate – we couldn't ask for a better solution! The support team was also incredibly responsive."`,
      starsColor: "text-[#10B981]", // Green
      userName: "Simran Kaur",
      userRole: "CTO, AstroAngel",
      avatarSrc: "https://i.pravatar.cc/150?img=44",
      highlight: false,
    },
    {
      num: "06",
      logoIcon: "ph:moon-stars-fill",
      logoColor: "text-white",
      logoBg: "bg-rose-500",
      review: `"DivineHealingCare has transformed our spiritual consultation process. The integration was smooth, and support was absolutely exceptional!"`,
      starsColor: "text-[#A855F7]", // Purple
      userName: "Priya Sharma",
      userRole: "Founder, DivineHealingCare",
      avatarSrc: "https://i.pravatar.cc/150?img=32",
      highlight: false,
    },
  ];

  return (
    <section
      className="relative py-[100px] bg-[#07080f] overflow-hidden"
      id="reviews"
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
      <div className="container xl:max-w-[1440px] mx-auto px-6 max-w-[1200px] relative z-10 w-full text-center">
        {/* Section Header */}
        <div className="flex flex-col items-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#18112A] border border-[#2D1B4E] mb-6 shadow-[0_0_15px_rgba(45,27,78,0.5)]">
            <Iconify
              icon="ph:star-four-fill"
              className="text-[#A855F7] text-xs"
            />
            <span className="text-[#D8B4FE] text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase">
              REAL CUSTOMER REVIEWS
            </span>
          </div>

          <h2 className="text-[2.5rem] md:text-[3.5rem] font-bold text-white mb-6 tracking-tight leading-[1.1]">
            What our customers <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F472B6] to-[#A855F7]">
              are saying
            </span>
          </h2>

          <p className="text-[#9CA3AF] max-w-2xl text-[1.05rem] font-light leading-relaxed mx-auto">
            See what our customers have to say about their{" "}
            <strong className="font-semibold text-gray-300">experience</strong>{" "}
            with our platform.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mb-16">
          {reviews.map((review, index) => (
            <div
              key={index}
              className={`relative bg-[#0F0F13]/60 backdrop-blur-sm rounded-2xl p-8 flex flex-col text-left transition-all ${review.highlight ? "border border-[#3B82F6]/50 shadow-[0_0_25px_rgba(59,130,246,0.15)] bg-[#10192C]/80" : "border border-white/5 shadow-lg hover:bg-[#15151A]"}`}
            >
              {/* Number */}
              <span
                className={`absolute top-6 right-6 text-[10px] font-bold tracking-widest ${review.starsColor} opacity-50`}
              >
                {review.num}
              </span>

              {/* Logo placeholder */}
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center mb-6 shadow-sm ${review.logoBg}`}
              >
                <Iconify
                  icon={review.logoIcon}
                  className={`text-xl ${review.logoColor}`}
                />
              </div>

              {/* Review Text */}
              <p className="text-[#D1D5DB] text-[13px] leading-[1.8] mb-8 flex-1 italic relative z-10">
                {review.review}
              </p>

              {/* Quote Icon BG */}
              <div className="absolute top-[40%] right-8 opacity-5 pointer-events-none">
                <Iconify
                  icon="fa-solid:quote-right"
                  className="text-8xl text-white"
                />
              </div>

              {/* Rating & User Profile */}
              <div className="mt-auto">
                <div className="flex gap-1 mb-5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Iconify
                      key={star}
                      icon="mdi:star"
                      className={`text-xs ${review.starsColor}`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={review.avatarSrc}
                    alt={review.userName}
                    className="w-10 h-10 rounded-full border border-white/10"
                  />
                  <div>
                    <h4 className="text-white text-[13px] font-bold tracking-wide">
                      {review.userName}
                    </h4>
                    <p className="text-gray-500 text-[11px]">
                      {review.userRole}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Pill */}
        <div className="flex justify-center pb-8 ">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#111116] border border-[#2D1B4E] hover:bg-[#16161D] transition-all cursor-pointer shadow-[0_0_20px_rgba(45,27,78,0.2)] hover:shadow-[0_0_25px_rgba(45,27,78,0.4)] hover:scale-[1.02]">
            <div className="w-1.5 h-1.5 rounded-full bg-[#A855F7] animate-pulse"></div>
            <span className="text-gray-400 text-[13px]">
              Trusted by 500+ astrology platforms worldwide —
            </span>
            <span className="text-[#D8B4FE] text-[13px] font-semibold flex items-center gap-1">
              Start free today{" "}
              <Iconify icon="mdi:arrow-right" className="text-sm" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
