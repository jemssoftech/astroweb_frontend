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
    <div className="grid grid-cols-1 md:grid-cols-2 h-full min-h-[500px]">
      {/* Left Side: Form */}
      <div className="p-10 flex flex-col justify-center bg-white order-2 md:order-1">
        <div className="max-w-md w-full mx-auto">
          <button
            onClick={onBack}
            className="mb-6 flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            <Iconify icon="mdi:arrow-left" className="mr-1 text-lg" />
            Back
          </button>

          <div className="mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              Verify Mobile
            </h3>
            <p className="text-gray-500 text-sm">
              We&apos;ve sent a 4-digit OTP to{" "}
              <span className="font-semibold text-gray-900">
                {maskedNumber}
              </span>
              <button
                type="button"
                onClick={onBack}
                className="ml-2 text-indigo-600 hover:text-indigo-800 underline"
              >
                Edit
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
                    className="w-14 h-16 sm:w-16 sm:h-20 text-center text-2xl font-bold border rounded-xl focus:ring-4 focus:outline-none transition-all border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 hover:border-gray-300"
                    maxLength={1}
                  />
                ))}
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all mt-6"
            >
              {loading ? (
                <Iconify icon="mdi:loading" className="animate-spin text-2xl" />
              ) : (
                "Verify OTP"
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-gray-500">Didn&apos;t receive the OTP? </span>
            <button
              type="button"
              onClick={onResend}
              disabled={loading}
              className="font-semibold text-indigo-600 hover:text-indigo-500 disabled:text-gray-400 focus:outline-none"
            >
              Resend OTP
            </button>
          </div>
        </div>
      </div>

      {/* Right Side: Info */}
      <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-indigo-950 p-10 flex flex-col justify-center text-white relative overflow-hidden order-1 md:order-2">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 -ml-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-5 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 -mr-16 -mb-16 w-64 h-64 rounded-full bg-indigo-500 opacity-10 blur-3xl"></div>

        <div className="relative z-10">
          <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md mb-8 shadow-lg border border-white/20">
            <Iconify
              icon="mdi:shield-check"
              className="text-5xl text-indigo-300"
            />
          </div>

          <h2 className="text-3xl font-bold mb-4">
            Secure & Fast <br /> Authentication
          </h2>
          <p className="text-indigo-200 text-lg leading-relaxed max-w-sm">
            Your account security is our top priority. We use industry-standard
            encryption to protect your personal information and astrological
            charts.
          </p>
        </div>
      </div>
    </div>
  );
}
