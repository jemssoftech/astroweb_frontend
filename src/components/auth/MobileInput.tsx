"use client";
import React, { useState } from "react";
import Iconify from "../Iconify";

interface MobileInputProps {
  onSendOtp: (mobileNumber: string) => void;
  loading: boolean;
  initialNumber?: string;
}

export default function MobileInput({
  onSendOtp,
  loading,
  initialNumber = "",
}: MobileInputProps) {
  const [number, setNumber] = useState(initialNumber);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!number || number.length < 10) {
      setError("Please enter a valid mobile number.");
      return;
    }

    onSendOtp(number);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-full min-h-[600px] bg-[#0F172A]">
      {/* Left Side: Info */}
      <div className="bg-[#0A0A0E] p-10 flex flex-col justify-center text-white relative overflow-hidden border-r border-white/5 order-1">
        {/* Decorative elements - stars/universe feel */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#EA580C] opacity-10 blur-[80px]"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-[#F97316] opacity-10 blur-[80px]"></div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
          <div className="w-[280px] h-[280px] mb-8 relative rounded-full border border-white/10 flex items-center justify-center bg-[#0F172A]/50 shadow-[0_0_50px_rgba(234,88,12,0.1)]">
            {/* Simulated astrology wheel */}
            <div className="absolute inset-0 rounded-full border border-dashed border-white/20 animate-[spin_60s_linear_infinite]" />
            <div className="absolute inset-4 rounded-full border border-white/5 animate-[spin_40s_linear_infinite_reverse]" />
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#EA580C] to-[#FBBF24] flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.4)] z-10">
              <Iconify
                icon="mdi:crystal-ball"
                className="text-3xl text-white"
              />
            </div>
          </div>

          <h2 className="text-3xl font-extrabold mb-3 leading-tight tracking-tight">
            Begin Your <br />
            Cosmic Journey
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-8">
            Join thousands of seekers exploring the universe through astrology,
            birth charts, and planetary wisdom.
          </p>

          <div className="flex flex-col gap-3 w-full max-w-[280px]">
            <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-xl px-4 py-3">
              <div className="w-8 h-8 rounded-lg bg-[#EA580C]/20 flex items-center justify-center shrink-0">
                <Iconify
                  icon="ph:sparkle-fill"
                  className="text-[#F97316] text-sm"
                />
              </div>
              <span className="text-xs text-slate-300 font-medium text-left">
                Personalized birth chart analysis
              </span>
            </div>
            <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-xl px-4 py-3">
              <div className="w-8 h-8 rounded-lg bg-[#FBBF24]/20 flex items-center justify-center shrink-0">
                <Iconify
                  icon="ph:moon-stars-fill"
                  className="text-[#FBBF24] text-sm"
                />
              </div>
              <span className="text-xs text-slate-300 font-medium text-left">
                Daily horoscope & moon readings
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="p-10 flex flex-col justify-center bg-[#0F172A] order-2">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-6">
              <div className="w-5 h-5 rounded-md bg-[#EA580C] flex items-center justify-center shadow-[0_0_10px_rgba(234,88,12,0.5)]">
                <Iconify
                  icon="ph:sparkle-fill"
                  className="text-white text-[10px]"
                />
              </div>
              <span className="text-xs font-bold text-white tracking-wide">
                Astrology API
              </span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">
              Create your account 🚀
            </h3>
            <p className="text-slate-400 text-sm">
              Start your astrological journey today — it&apos;s free!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="mobile"
                className="block text-xs font-bold text-white mb-2"
              >
                Mobile Number <span className="text-[#EA580C]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 w-[60px] flex items-center justify-center border-r border-white/10">
                  <span className="text-slate-400 sm:text-sm font-bold text-[13px]">
                    +91
                  </span>
                </div>
                <input
                  type="tel"
                  id="mobile"
                  value={number}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    if (val.length <= 10) setNumber(val);
                  }}
                  className={`block w-full pl-[76px] pr-4 py-3.5 sm:text-sm bg-[#1E293B] text-white border rounded-xl focus:ring-4 focus:outline-none transition-all placeholder:text-slate-500 ${
                    error
                      ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                      : "border-white/10 focus:border-[#EA580C] focus:ring-[#EA580C]/20 hover:border-white/20"
                  }`}
                  placeholder="Enter mobile number"
                />
              </div>
              {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-[0_0_20px_rgba(234,88,12,0.3)] text-[14px] font-bold text-white bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-[#0F172A] focus:ring-[#EA580C]/50 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <Iconify icon="mdi:loading" className="animate-spin text-xl" />
              ) : (
                <span className="flex items-center gap-2">
                  <Iconify icon="ph:sparkle-fill" className="text-xs" /> Next
                  Step
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
