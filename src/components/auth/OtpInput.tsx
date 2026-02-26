"use client";
import React, { useState, useRef, useEffect } from "react";
import Iconify from "../Iconify";

interface OtpInputProps {
  mobileNumber: string;
  onVerifyOtp: (otp: string) => void;
  loading: boolean;
  onResend: () => void;
  onBack: () => void;
}

export default function OtpInput({
  mobileNumber,
  onVerifyOtp,
  loading,
  onResend,
  onBack,
}: OtpInputProps) {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    setError("");

    // Focus next input
    if (value && index < 3 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const otpString = otp.join("");
    if (otpString.length < 4) {
      setError("Please enter the complete 4-digit OTP.");
      return;
    }
    onVerifyOtp(otpString);
  };

  const maskedNumber = `+91 ${mobileNumber.substring(0, 2)}******${mobileNumber.substring(8)}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-full min-h-[600px] bg-[#0F172A]">
      {/* Left Side: Form */}
      <div className="p-10 flex flex-col justify-center bg-[#0F172A] order-2 md:order-1">
        <div className="max-w-md w-full mx-auto">
          <button
            onClick={onBack}
            className="mb-8 cursor-pointer flex items-center w-fit text-xs font-bold text-slate-400 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-lg border border-white/5"
          >
            <Iconify icon="mdi:arrow-left" className="mr-1.5 text-sm" />
            Back
          </button>

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-6">
              <div className="w-5 h-5 rounded-md bg-[#EA580C] flex items-center justify-center shadow-[0_0_10px_rgba(234,88,12,0.5)]">
                <Iconify
                  icon="ph:shield-check-fill"
                  className="text-white text-[10px]"
                />
              </div>
              <span className="text-xs font-bold text-white tracking-wide">
                Secure Login
              </span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">
              Verify your number
            </h3>
            <p className="text-slate-400 text-sm">
              We&apos;ve sent a 4-digit code to{" "}
              <span className="font-bold text-white">{maskedNumber}</span>
              <button
                type="button"
                onClick={onBack}
                className="ml-2 cursor-pointer text-[#EA580C] hover:text-[#C2410C] font-semibold underline decoration-transparent hover:decoration-[#EA580C] transition-all underline-offset-2"
              >
                Change
              </button>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="flex justify-between gap-2 sm:gap-4 mb-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-14 h-16 sm:w-16 sm:h-20 text-center text-2xl font-bold border rounded-xl focus:ring-4 focus:outline-none transition-all border-white/10 bg-[#1E293B] text-white focus:border-[#EA580C] focus:ring-[#EA580C]/20 hover:border-white/20"
                    maxLength={1}
                  />
                ))}
              </div>
              {error && (
                <p className="mt-2 text-xs text-red-400 text-center">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-[0_0_20px_rgba(234,88,12,0.3)] text-[14px] font-bold text-white bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-[#0F172A] focus:ring-[#EA580C]/50 disabled:opacity-70 disabled:cursor-not-allowed transition-all mt-6"
            >
              {loading ? (
                <Iconify icon="mdi:loading" className="animate-spin text-xl" />
              ) : (
                <span className="flex items-center gap-2">
                  Verify OTP{" "}
                  <Iconify icon="mdi:arrow-right" className="text-sm" />
                </span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs">
            <span className="text-slate-500">
              Didn&apos;t receive the code?{" "}
            </span>
            <button
              type="button"
              onClick={onResend}
              disabled={loading}
              className="font-bold text-white hover:text-[#EA580C] disabled:text-slate-600 focus:outline-none transition-colors ml-1"
            >
              Resend now
            </button>
          </div>
        </div>
      </div>

      {/* Right Side: Info */}
      <div className="bg-[#0A0A0E] p-10 flex flex-col justify-center text-white relative overflow-hidden border-l border-white/5 order-1 md:order-2">
        {/* Decorative elements - stars/universe feel */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#EA580C] opacity-10 blur-[80px]"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-[#F97316] opacity-10 blur-[80px]"></div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
          <div className="w-24 h-24 relative rounded-2xl flex items-center justify-center bg-[#0F172A]/50 shadow-[0_0_30px_rgba(234,88,12,0.1)] border border-white/10 mb-8 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#F97316]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Iconify
              icon="solar:shield-check-bold-duotone"
              className="text-6xl text-[#F97316]"
            />
          </div>

          <h2 className="text-3xl font-extrabold mb-3 leading-tight tracking-tight">
            Secure & Fast <br /> Authentication
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
            Your account security is our top priority. We use industry-standard
            encryption to protect your personal information and astrological
            charts.
          </p>
        </div>
      </div>
    </div>
  );
}
