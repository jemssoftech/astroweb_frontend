"use client";

import Iconify from "@/src/components/Iconify";

export default function LandingContact() {
  return (
    <section
      className="relative py-[100px] bg-[#07080f] overflow-hidden"
      id="contact"
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
        className="absolute w-[500px] h-[500px] top-[20%] -right-[100px] rounded-full pointer-events-none"
        style={{
          filter: "blur(100px)",
          background:
            "radial-gradient(circle, rgba(124, 58, 237, 0.05) 0%, transparent 70%)",
        }}
      ></div>
      <div
        className="absolute w-[400px] h-[400px] bottom-[10%] -left-[80px] rounded-full pointer-events-none"
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
            <div className="w-[6px] h-[6px] bg-[#a855f7] rounded-full shadow-[0_0_8px_#a855f7] animate-[pulse-dot_2s_ease_infinite]"></div>
            <span className="text-[#A855F7] text-[10px] font-bold tracking-wider uppercase">
              Contact Us
            </span>
          </div>

          <h2 className="text-[2.5rem] md:text-[3.5rem] font-bold text-white mb-4 tracking-tight leading-[1.1]">
            Let&apos;s work <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F472B6] to-[#A855F7]">
              together
            </span>
          </h2>

          <p className="text-[#9CA3AF] text-[13px] font-light leading-relaxed mx-auto max-w-[400px]">
            Any question or remark? Just write us a message.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-6  mx-auto items-stretch">
          {/* Left Side - Info Card */}
          <div className="w-full lg:w-[40%] bg-[#111116] border border-white/5 rounded-3xl p-6 flex flex-col justify-between">
            {/* Illustration */}
            <div className="w-full aspect-square bg-[#1A1A24] rounded-2xl mb-6 relative overflow-hidden flex items-center justify-center border border-white/5">
              {/* Fallback image if illustration isn't available, but keeping it conceptually close */}
              {/* You can replace the src with your actual transparent png vector */}
              <img
                src="https://img.freepik.com/free-vector/telecommuting-concept-illustration_114360-1600.jpg?w=826&t=st=1708846351~exp=1708846951~hmac=a4c330e8c89c89487cd2d23e59714399e525166ac4d9354714da2e8ee1c3905a"
                alt="Contact Support Illustration"
                className="w-full h-full object-cover mix-blend-screen opacity-80 filter contrast-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111116] via-transparent to-transparent"></div>
            </div>

            {/* Contact Details */}
            <div className="flex flex-col gap-3">
              <a
                href="mailto:astrologyservice@gmail.com"
                className="flex items-center gap-4 bg-[#1A1A24] border border-[#2D1B4E]/50 rounded-xl p-4 transition-colors hover:bg-[#20202C]"
              >
                <div className="w-10 h-10 rounded-lg bg-[#2D1B4E] flex items-center justify-center text-[#A855F7] shrink-0">
                  <Iconify icon="ph:envelope-simple-fill" className="text-xl" />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mb-1">
                    Email
                  </span>
                  <span className="text-[13px] text-white font-medium truncate">
                    astrologyservice@gmail.com
                  </span>
                </div>
              </a>

              <a
                href="tel:+1234567890"
                className="flex items-center gap-4 bg-[#1A1A24] border border-[#064E3B]/50 rounded-xl p-4 transition-colors hover:bg-[#20202C]"
              >
                <div className="w-10 h-10 rounded-lg bg-[#064E3B] flex items-center justify-center text-[#10B981] shrink-0">
                  <Iconify icon="ph:phone-call-fill" className="text-xl" />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mb-1">
                    Phone
                  </span>
                  <span className="text-[13px] text-white font-medium truncate">
                    +1234 567 890
                  </span>
                </div>
              </a>
            </div>

            {/* Decorative Get In Touch text */}
            <div className="text-right mt-6">
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#A855F7]/30 uppercase">
                Get in touch
              </span>
            </div>
          </div>

          {/* Right Side - Form Container */}
          <div className="w-full lg:w-[60%] bg-[#111116] border border-white/5 rounded-3xl p-8 lg:p-10 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-2">
              Send a message
            </h3>
            <p className="text-[12px] text-gray-400 mb-8 leading-relaxed">
              If you would like to discuss payments, licensing, partnerships, or
              have pre-sales questions — you&apos;re at the right place.
            </p>

            <form className="flex flex-col gap-6 flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name Input */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="name"
                    className="text-[10px] font-bold tracking-wide text-gray-400 uppercase"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="John Doe"
                    className="w-full bg-[#1A1A24] border border-white/10 rounded-xl px-4 py-3.5 text-[13px] text-white placeholder:text-gray-600 focus:outline-none focus:border-[#A855F7]/50 focus:bg-[#1A1A24] transition-colors"
                  />
                </div>

                {/* Email Input */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="email"
                    className="text-[10px] font-bold tracking-wide text-gray-400 uppercase"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="john@example.com"
                    className="w-full bg-[#1A1A24] border border-white/10 rounded-xl px-4 py-3.5 text-[13px] text-white placeholder:text-gray-600 focus:outline-none focus:border-[#A855F7]/50 focus:bg-[#1A1A24] transition-colors"
                  />
                </div>
              </div>

              {/* Message Input */}
              <div className="flex flex-col gap-2 flex-grow">
                <label
                  htmlFor="message"
                  className="text-[10px] font-bold tracking-wide text-gray-400 uppercase"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  placeholder="Write your message here..."
                  className="w-full h-full min-h-[150px] bg-[#1A1A24] border border-white/10 rounded-xl px-4 py-3.5 text-[13px] text-white placeholder:text-gray-600 focus:outline-none focus:border-[#A855F7]/50 focus:bg-[#1A1A24] transition-colors resize-none"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#8B5CF6] text-white text-[13px] font-bold mt-2 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all flex items-center justify-center gap-2"
              >
                Send Inquiry <Iconify icon="ph:arrow-right-bold" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Small Note */}
        <div className="flex justify-center mt-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1A1A24] border border-[#2D1B4E] shadow-[0_0_15px_rgba(45,27,78,0.2)]">
            <div className="w-[6px] h-[6px] bg-[#A855F7] rounded-full"></div>
            <span className="text-gray-400 text-[11px]">
              We typically respond within 24 hours —{" "}
              <a
                href="mailto:astrologyservice@gmail.com"
                className="text-[#A855F7] hover:underline"
              >
                email us directly{" "}
                <Iconify
                  icon="ph:arrow-right-bold"
                  className="inline text-[9px] ml-0.5"
                />
              </a>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
