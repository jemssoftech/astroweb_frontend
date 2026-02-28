"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Iconify from "@/src/components/Iconify";

// Animated Particle Component
const Particle = ({
  delay,
  duration,
  size,
  left,
  top,
}: {
  delay: number;
  duration: number;
  size: number;
  left: string;
  top: string;
}) => (
  <div
    className="absolute rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 animate-pulse"
    style={{
      width: size,
      height: size,
      left,
      top,
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`,
    }}
  />
);

// Floating Icon Component
const FloatingIcon = ({
  icon,
  className,
  delay,
}: {
  icon: string;
  className: string;
  delay: number;
}) => (
  <div
    className={`absolute ${className} animate-bounce`}
    style={{ animationDelay: `${delay}s`, animationDuration: "3s" }}
  >
    <div className="w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center">
      <Iconify icon={icon} className="text-2xl text-white/40" />
    </div>
  </div>
);

export default function ComingSoonPage() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Countdown Timer - Set your launch date here
  useEffect(() => {
    const launchDate = new Date("2024-04-01T00:00:00").getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = launchDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Add your subscription logic here
      console.log("Subscribed:", email);
      setIsSubscribed(true);
      setEmail("");
    }
  };

  const particles = [
    { delay: 0, duration: 4, size: 100, left: "10%", top: "20%" },
    { delay: 1, duration: 5, size: 60, left: "80%", top: "10%" },
    { delay: 2, duration: 6, size: 80, left: "70%", top: "60%" },
    { delay: 0.5, duration: 4.5, size: 50, left: "20%", top: "70%" },
    { delay: 1.5, duration: 5.5, size: 70, left: "85%", top: "80%" },
    { delay: 2.5, duration: 3.5, size: 40, left: "5%", top: "50%" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[80px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />

        {/* Particles */}
        {particles.map((particle, index) => (
          <Particle key={index} {...particle} />
        ))}

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Floating Icons */}
        <FloatingIcon
          icon="lucide:stars"
          className="top-[15%] left-[10%]"
          delay={0}
        />
        <FloatingIcon
          icon="lucide:rocket"
          className="top-[20%] right-[15%]"
          delay={0.5}
        />
        <FloatingIcon
          icon="lucide:zap"
          className="bottom-[25%] left-[8%]"
          delay={1}
        />
        <FloatingIcon
          icon="lucide:sparkles"
          className="bottom-[20%] right-[10%]"
          delay={1.5}
        />
        <FloatingIcon
          icon="lucide:code-2"
          className="top-[50%] left-[5%]"
          delay={2}
        />
        <FloatingIcon
          icon="lucide:globe"
          className="top-[40%] right-[5%]"
          delay={2.5}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 p-1 shadow-2xl shadow-blue-500/30 animate-pulse">
            <div className="w-full h-full rounded-[20px] bg-slate-900 flex items-center justify-center">
              <Image
                src="/image/logo.png"
                alt="Astro Web Logo"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-medium text-slate-300">
            Under Development
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-white">
            Coming
          </span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400">
            Soon
          </span>
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-xl mx-auto leading-relaxed">
          We&apos;re working hard to bring you something amazing. Stay tuned for
          updates and be the first to know when we launch!
        </p>

        {/* Countdown Timer */}
        <div className="grid grid-cols-4 gap-3 md:gap-6 max-w-lg mx-auto mb-12">
          {[
            { value: timeLeft.days, label: "Days" },
            { value: timeLeft.hours, label: "Hours" },
            { value: timeLeft.minutes, label: "Minutes" },
            { value: timeLeft.seconds, label: "Seconds" },
          ].map((item, index) => (
            <div key={index} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-6 hover:border-blue-500/30 transition-colors duration-300">
                <div className="text-3xl md:text-5xl font-bold text-white mb-1">
                  {String(item.value).padStart(2, "0")}
                </div>
                <div className="text-xs md:text-sm text-slate-400 font-medium uppercase tracking-wider">
                  {item.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Email Subscription */}
        {!isSubscribed ? (
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto mb-10">
            <div className="relative flex items-center">
              <div className="absolute left-4 text-slate-400">
                <Iconify icon="lucide:mail" className="text-xl" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email for updates"
                className="w-full h-14 pl-12 pr-36 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                required
              />
              <button
                type="submit"
                className="absolute right-2 h-10 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
              >
                Notify Me
              </button>
            </div>
          </form>
        ) : (
          <div className="max-w-md mx-auto mb-10 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center justify-center gap-2 text-emerald-400">
              <Iconify icon="lucide:check-circle" className="text-2xl" />
              <span className="font-semibold">
                Thanks! We&apos;ll notify you when we launch.
              </span>
            </div>
          </div>
        )}

        {/* Back to Dashboard */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
        >
          <Iconify icon="lucide:arrow-left" className="text-lg" />
          <span className="font-medium">Back to Dashboard</span>
        </Link>

        {/* Social Links */}
        <div className="mt-12 flex items-center justify-center gap-4">
          {[
            { icon: "lucide:twitter", href: "#", label: "Twitter" },
            { icon: "lucide:github", href: "#", label: "GitHub" },
            { icon: "lucide:linkedin", href: "#", label: "LinkedIn" },
            { icon: "lucide:instagram", href: "#", label: "Instagram" },
          ].map((social, index) => (
            <a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 hover:scale-110 transition-all duration-300"
              title={social.label}
            >
              <Iconify icon={social.icon} className="text-xl" />
            </a>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-sm text-slate-500">
          <p>© 2024 Astro Web. All rights reserved.</p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
    </div>
  );
}
