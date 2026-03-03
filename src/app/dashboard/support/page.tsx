"use client";
import React, { useState } from "react";
import Iconify from "@/src/components/Iconify";

const faqs = [
  {
    q: "How do I get my API key?",
    a: "Your API key is available on the Dashboard page. You can also find it in your Profile section. Click the copy button to copy it to your clipboard.",
  },
  {
    q: "What happens when my API call limit is exhausted?",
    a: "When your API call limit is exhausted, further API requests will return an error. You can recharge your wallet or upgrade your plan to continue using the API.",
  },
  {
    q: "How do I reset my API key?",
    a: "Go to your Dashboard and click the 'Reset' button next to your API Key. A new key will be generated and the old key will stop working immediately.",
  },
  {
    q: "How do I add funds to my wallet?",
    a: "Navigate to the Dashboard and use the Wallet Top-Up section. Click 'Top-Up Wallet' and complete the payment through Razorpay. Your balance will update after bank verification.",
  },
  {
    q: "What are Allowed Domains?",
    a: "Allowed Domains restrict your API key usage to specific domains only. This adds a security layer so your key cannot be misused from unauthorized websites.",
  },
  {
    q: "How do I test API endpoints?",
    a: "Use the API Testing Console available in the sidebar. Select an endpoint category, configure the parameters, and click 'Test API' to see the response.",
  },
];

const contactOptions = [
  {
    icon: "lucide:mail",
    title: "Email Support",
    description: "Get a response within 24 hours",
    value: "support@astroweb.com",
    color: "from-blue-500 to-blue-600",
    shadowColor: "shadow-blue-500/30",
  },
  {
    icon: "lucide:message-circle",
    title: "WhatsApp",
    description: "Chat with us directly",
    value: "+91 97271 68583",
    color: "from-emerald-500 to-green-600",
    shadowColor: "shadow-emerald-500/30",
  },
  {
    icon: "lucide:clock",
    title: "Working Hours",
    description: "When we are available",
    value: "Mon–Sat, 10AM–7PM IST",
    color: "from-amber-500 to-orange-500",
    shadowColor: "shadow-amber-500/30",
  },
];

export default function SupportPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="flex-1 w-full bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-100/40 to-purple-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-cyan-100/30 to-emerald-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
      </div>

      <div className="relative z-10 p-4 md:p-6 lg:p-8 max-w-[1000px] mx-auto space-y-6 mt-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Iconify icon="lucide:headphones" className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Help &amp; Support
            </h1>
            <p className="text-sm text-gray-500">
              Find answers or reach out to our team
            </p>
          </div>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {contactOptions.map((c, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${c.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              />
              <div
                className={`inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br ${c.color} mb-3 shadow-lg ${c.shadowColor}`}
              >
                <Iconify icon={c.icon} className="text-white text-xl" />
              </div>
              <h3 className="text-sm font-bold text-gray-800 mb-0.5">
                {c.title}
              </h3>
              <p className="text-xs text-gray-400 mb-2">{c.description}</p>
              <p className="text-sm font-semibold text-gray-700">{c.value}</p>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/20">
              <Iconify
                icon="lucide:help-circle"
                className="text-white text-lg"
              />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-gray-400">
                Quick answers to common questions
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {faqs.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-xl border transition-all duration-300 ${
                    isOpen
                      ? "border-blue-200 bg-blue-50/50 shadow-sm"
                      : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <span
                      className={`text-sm font-semibold ${isOpen ? "text-blue-700" : "text-gray-700"}`}
                    >
                      {faq.q}
                    </span>
                    <Iconify
                      icon={
                        isOpen ? "lucide:chevron-up" : "lucide:chevron-down"
                      }
                      className={`text-lg shrink-0 ml-3 transition-colors ${isOpen ? "text-blue-500" : "text-gray-400"}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4">
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Still need help */}
        <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-2xl p-6 shadow-xl shadow-purple-500/15">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">
                Still need help?
              </h3>
              <p className="text-purple-100/80 text-sm">
                Our team is ready to assist you with any questions.
              </p>
            </div>
            <a
              href="mailto:support@astroweb.com"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-purple-600 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-white/20 transition-all duration-300 shrink-0"
            >
              <Iconify icon="lucide:mail" className="text-lg" />
              Send us an Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
