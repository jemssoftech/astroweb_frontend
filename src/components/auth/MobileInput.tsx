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
    <div className="grid grid-cols-1 md:grid-cols-2 h-full min-h-[500px]">
      {/* Left Side: Info */}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 p-10 flex flex-col justify-center text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-5 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-purple-500 opacity-10 blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <Iconify
                icon="mdi:star-four-points"
                className="text-yellow-400 text-xl"
              />
            </div>
            <span className="font-bold text-xl tracking-wider">AstroLearn</span>
          </div>

          <h2 className="text-4xl font-extrabold mb-4 leading-tight">
            Unlock the Secrets <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500">
              Of The Stars
            </span>
          </h2>
          <p className="text-indigo-200 text-lg leading-relaxed max-w-sm mb-8">
            Join our community to discover your cosmic blueprint and explore
            astrology with expert guidance.
          </p>

          <div className="flex items-center gap-4 text-sm text-indigo-300">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-indigo-900 bg-indigo-500 flex items-center justify-center overflow-hidden"
                >
                  <Iconify icon="mdi:user" className="text-indigo-200" />
                </div>
              ))}
            </div>
            <span>Join 10,000+ members</span>
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="p-10 flex flex-col justify-center bg-white">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h3>
            <p className="text-gray-500">Sign in to continue your journey.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="mobile"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm font-medium">
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
                  className={`block w-full pl-12 pr-3 py-3 sm:text-lg border rounded-xl focus:ring-4 focus:outline-none transition-all ${
                    error
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 hover:border-gray-300"
                  }`}
                  placeholder="Enter your 10 digit number"
                />
              </div>
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <Iconify icon="mdi:loading" className="animate-spin text-2xl" />
              ) : (
                "Send OTP"
              )}
            </button>
            <p className="text-center text-sm text-gray-500 mt-4">
              By signing in, you agree to our{" "}
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Privacy Policy
              </a>
              .
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
