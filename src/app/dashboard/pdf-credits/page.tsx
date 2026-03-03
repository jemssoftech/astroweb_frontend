"use client";

import React from "react";
import Iconify from "@/src/components/Iconify";
import Link from "next/link";

export default function PdfCreditsPage() {
  return (
    <div className="flex-1 w-full min-h-[80vh] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-700" />

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Animated Icon Container */}
        <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-linear-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-widest mb-4 shadow-lg shadow-blue-500/20 transform hover:scale-110 transition-transform duration-500 group">
          <Iconify
            icon="lucide:file-text"
            className="text-white text-5xl animate-bounce"
          />
        </div>

        {/* Feature Badge */}
        <div className="mb-6">
          <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100 uppercase tracking-widest animate-pulse">
            Upcoming Feature
          </span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
          PDF Credits are{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Coming Soon
          </span>
        </h1>

        {/* Description */}
        <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-sm mx-auto">
          We&apos;re building a premium experience for managing your PDF report
          credits. Stay tuned!
        </p>

        {/* Progress Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: "lucide:zap",
              label: "Instant Gen",
              desc: "No waiting time",
            },
            {
              icon: "lucide:palette",
              label: "Premium UI",
              desc: "Beautiful designs",
            },
            {
              icon: "lucide:share-2",
              label: "Easy Share",
              desc: "Direct sharing",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-5 bg-white/50 backdrop-blur-md border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mx-auto mb-3">
                <Iconify icon={item.icon} className="text-blue-500 text-xl" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">
                {item.label}
              </h4>
              <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold transition-all hover:scale-105 shadow-xl shadow-slate-900/20 active:scale-95"
        >
          <Iconify icon="lucide:arrow-left" className="text-xl" />
          Back to Dashboard
        </Link>
      </div>

      {/* Decorative Floating Elements */}
      <div className="absolute top-20 right-10 opacity-20 animate-bounce delay-300">
        <Iconify icon="lucide:sparkles" className="text-blue-400 text-4xl" />
      </div>
      <div className="absolute bottom-20 left-10 opacity-20 animate-bounce delay-500">
        <Iconify icon="lucide:star" className="text-indigo-400 text-3xl" />
      </div>
    </div>
  );
}
