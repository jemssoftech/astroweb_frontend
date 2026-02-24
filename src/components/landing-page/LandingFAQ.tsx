"use client";

import { useState } from "react";
import Iconify from "@/src/components/Iconify";

const faqs = [
  {
    question: "How accurate are the astrology readings?",
    answer:
      "Our readings are highly accurate. We use precise astronomical data and time-tested astrological principles combined with advanced algorithms to provide insights tailored to your unique birth chart.",
    icon: "ph:star-four-fill",
    iconColor: "text-slate-300",
  },
  {
    question: "What information do I need to get my birth chart?",
    answer: (
      <>
        To generate your full natal chart, you&apos;ll need your{" "}
        <strong>date of birth</strong>, <strong>exact time of birth</strong>{" "}
        (even an approximate time helps), and your{" "}
        <strong>place of birth</strong>. The more precise your birth time, the
        more accurate your rising sign (ascendant) and house placements will be.
        If you don&apos;t know your birth time, we can still create a solar
        chart based on your date and location.
      </>
    ),
    icon: "ph:moon-stars-fill",
    iconColor: "text-amber-400",
  },
  {
    question: "What's the difference between Sun, Moon, and Rising signs?",
    answer:
      "Your Sun sign represents your core identity, the Moon sign reflects your inner emotions, and your Rising sign acts as the mask you present to the world. A complete reading integrates all three.",
    icon: "ph:letter-c-bold", // Closest visual match to the purple 'C' icon
    iconColor: "text-purple-400",
  },
  {
    question: "How often are daily horoscopes updated?",
    answer:
      "Our daily horoscopes are updated every midnight, ensuring you start your day with fresh insights tailored to your zodiac sign.",
    icon: "ph:shooting-star-fill",
    iconColor: "text-yellow-500",
  },
  {
    question: "Can I get compatibility readings for relationships?",
    answer:
      "Yes, our compatibility readings compare the birth charts of two individuals to highlight strengths, potential challenges, and deeper relational dynamics.",
    icon: "ph:meteor-fill",
    iconColor: "text-orange-400",
  },
];

export default function LandingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(1); // 2nd item open by default like the image

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      className="relative py-[100px] bg-[#07080f] overflow-hidden"
      id="faq"
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
        className="absolute w-[500px] h-[500px] top-[20%] -left-[100px] rounded-full pointer-events-none"
        style={{
          filter: "blur(100px)",
          background:
            "radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, transparent 70%)",
        }}
      ></div>
      <div
        className="absolute w-[400px] h-[400px] bottom-[10%] -right-[80px] rounded-full pointer-events-none"
        style={{
          filter: "blur(100px)",
          background:
            "radial-gradient(circle, rgba(236, 72, 153, 0.05) 0%, transparent 70%)",
        }}
      ></div>

      <div className="container xl:max-w-[1440px] mx-auto px-6  relative z-10 w-full">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1A24] border border-[#2D1B4E] mb-6 shadow-[0_0_15px_rgba(45,27,78,0.3)]">
            <Iconify
              icon="ph:star-four-fill"
              className="text-[#A855F7] text-xs"
            />
            <span className="text-[#A855F7] text-[10px] font-bold tracking-wider uppercase">
              Cosmic Questions
            </span>
          </div>

          <h2 className="text-[2.5rem] md:text-[3.5rem] font-bold text-white mb-4 tracking-tight leading-[1.1]">
            Frequently Asked <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F472B6] to-[#A855F7]">
              Questions
            </span>
          </h2>

          <p className="text-[#9CA3AF] max-w-2xl text-[13px] font-light leading-relaxed mx-auto">
            Everything you need to know about your cosmic journey and astrology{" "}
            <br />
            readings.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-8 mx-auto mt-20">
          {/* Left Side - Visual Component */}
          <div className="w-full lg:w-[45%] flex justify-center lg:justify-start relative min-h-[400px]">
            {/* The Orbital Element */}
            <div className="relative w-[300px] h-[300px] lg:w-[350px] lg:h-[350px]">
              {/* Outer Orbit */}
              <div className="absolute inset-0 rounded-full border border-purple-500/20 animate-[spin_40s_linear_infinite]" />

              {/* Middle Orbit */}
              <div className="absolute inset-[40px] rounded-full border border-dashed border-purple-500/30 animate-[spin_30s_linear_infinite_reverse]" />

              {/* Inner Orbit */}
              <div className="absolute inset-[80px] rounded-full border border-purple-500/10" />

              {/* Center Glow / Orb */}
              <div className="absolute inset-0 m-auto w-[120px] h-[120px] rounded-full bg-gradient-to-br from-purple-800 to-[#1e0a29] shadow-[0_0_60px_rgba(168,85,247,0.4)] flex flex-col items-center justify-center p-4 border border-purple-500/30 font-semibold z-10">
                <div className="text-2xl mb-1">🔮</div>
                <div className="text-[9px] text-purple-300 tracking-widest text-center mt-1">
                  COSMIC ORACLE
                </div>
              </div>

              {/* Orbiting Icons (Static positions for visual representation, in a real app these would be animated along the path) */}
              <div className="absolute top-[5%] right-[20%] w-8 h-8 rounded-lg bg-[#16161D] border border-white/5 flex items-center justify-center shadow-lg z-20">
                ♈
              </div>
              <div className="absolute top-[30%] -right-[5%] w-8 h-8 rounded-lg bg-[#16161D] border border-white/5 flex items-center justify-center shadow-lg z-20 text-purple-400">
                ♓
              </div>
              <div className="absolute bottom-[20%] left-[0%] w-8 h-8 rounded-lg bg-[#16161D] border border-white/5 flex items-center justify-center shadow-lg z-20 text-pink-400">
                ♏
              </div>
              <div className="absolute top-[20%] left-[5%] w-6 h-6 rounded-md bg-[#16161D] border border-white/5 flex items-center justify-center shadow-lg z-20 opacity-70">
                ♊
              </div>

              {/* Additional small floating symbols */}
              <div className="absolute top-[5%] left-[30%] text-[10px] text-purple-500 opacity-60">
                ♋
              </div>
              <div className="absolute bottom-[10%] left-[25%] text-[12px] text-indigo-400 opacity-80">
                ♑
              </div>
              <div className="absolute bottom-[30%] right-[10%] text-[10px] text-pink-500 opacity-70">
                ♍
              </div>

              {/* Data Card floating on bottom right */}
              <div className="absolute -bottom-4 right-0 bg-[#0F0F13]/90 backdrop-blur-md border border-white/10 rounded-xl p-3 flex items-center gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-30">
                <div className="w-8 h-8 rounded-md bg-[#1E112A] flex items-center justify-center text-amber-400">
                  <Iconify icon="ph:calendar-blank-fill" />
                </div>
                <div>
                  <div className="text-white text-xs font-bold">
                    Daily Reading
                  </div>
                  <div className="text-gray-500 text-[9px]">
                    Updated at midnight
                  </div>
                </div>
              </div>
            </div>

            {/* Ambient Backlight */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-purple-600/20 blur-[80px] rounded-full pointer-events-none z-0"></div>
          </div>

          {/* Right Side - FAQ Accordion */}
          <div className="w-full lg:w-[55%] flex flex-col gap-3">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className={`overflow-hidden rounded-xl border transition-all duration-300 ${
                    isOpen
                      ? "bg-[#111116] border-[#3B1963] shadow-[0_0_20px_rgba(59,25,99,0.2)]"
                      : "bg-[#0A0A0E] border-white/5 hover:border-white/10"
                  }`}
                >
                  {/* Question Header */}
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 outline-none"
                  >
                    <div className="flex items-center gap-3">
                      <Iconify
                        icon={faq.icon}
                        className={`text-lg ${faq.iconColor}`}
                      />
                      <span
                        className={`text-[13px] font-semibold ${isOpen ? "text-white" : "text-gray-300"}`}
                      >
                        {faq.question}
                      </span>
                    </div>
                    <div
                      className={`transition-transform duration-300 text-gray-500 ${isOpen ? "rotate-180 text-purple-400" : ""}`}
                    >
                      <Iconify icon="ph:caret-down-bold" className="text-xs" />
                    </div>
                  </button>

                  {/* Answer Body */}
                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      isOpen
                        ? "max-h-[500px] opacity-100 pb-5"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="px-5 pt-1 text-[12px] leading-[1.8] text-gray-400 pl-[44px]">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
