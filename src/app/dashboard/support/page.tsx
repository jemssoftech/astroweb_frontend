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
    gradient: "from-blue-500 to-indigo-500",
    shadowColor: "shadow-blue-500/20",
  },
  {
    icon: "lucide:message-circle",
    title: "WhatsApp",
    description: "Chat with us directly",
    value: "+91 97271 68583",
    gradient: "from-emerald-500 to-teal-500",
    shadowColor: "shadow-emerald-500/20",
  },
  {
    icon: "lucide:clock",
    title: "Working Hours",
    description: "When we are available",
    value: "Mon–Sat, 10AM–7PM IST",
    gradient: "from-amber-500 to-orange-500",
    shadowColor: "shadow-amber-500/20",
  },
];

export default function SupportPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="flex-1 w-full transition-colors duration-300">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-linear-to-br from-violet-100/40 to-purple-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-linear-to-tr from-cyan-100/30 to-blue-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
      </div>

      <div className="relative z-10 container mx-auto space-y-6">
        {/* Header — Premium gradient banner */}
        <div className="relative mb-2 overflow-hidden bg-linear-to-br from-violet-600 to-purple-700 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl shadow-purple-500/20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white" />
            <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white" />
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-14 h-14 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Iconify
                  icon="lucide:headphones"
                  className="text-white text-md sm:text-2xl"
                />
              </div>
              <div>
                <h1 className="text-md sm:text-2xl md:text-3xl font-bold text-white mb-1">
                  Help &amp; Support
                </h1>
                <p className="text-purple-100/80 text-sm">
                  Find answers or reach out to our team
                </p>
              </div>
            </div>

            <a
              href="mailto:support@astroweb.com"
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/10 rounded-xl text-sm font-bold text-white transition-all active:scale-95"
            >
              <Iconify icon="lucide:mail" className="text-lg" />
              Contact Us
            </a>
          </div>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {contactOptions.map((c, idx) => (
            <div
              key={idx}
              className="group bg-white dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-white/5 p-4 sm:p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden relative"
            >
              <div
                className={`absolute inset-0 bg-linear-to-br ${c.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`}
              />
              <div
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-linear-to-br ${c.gradient} flex items-center justify-center mb-3 shadow-lg ${c.shadowColor} group-hover:scale-110 transition-transform duration-300`}
              >
                <Iconify
                  icon={c.icon}
                  className="text-white text-lg sm:text-xl"
                />
              </div>
              <h3 className="text-sm font-bold text-gray-800 dark:text-slate-200 mb-0.5 transition-colors">
                {c.title}
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-2 transition-colors">
                {c.description}
              </p>
              <p className="text-sm font-semibold text-gray-700 dark:text-slate-300 transition-colors">
                {c.value}
              </p>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="bg-white dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm p-4 sm:p-6 lg:p-8 transition-colors">
          <div className="flex items-center gap-3 mb-5 sm:mb-6">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md shadow-purple-500/20">
              <Iconify
                icon="lucide:help-circle"
                className="text-white text-base sm:text-lg"
              />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white transition-colors">
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 transition-colors">
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
                      ? "border-purple-200 dark:border-purple-500/30 bg-purple-50/50 dark:bg-purple-500/10 shadow-sm"
                      : "border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10 hover:bg-gray-50/80 dark:hover:bg-white/5"
                  }`}
                >
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left"
                  >
                    <span
                      className={`text-sm font-semibold transition-colors ${isOpen ? "text-purple-700 dark:text-purple-400" : "text-gray-700 dark:text-slate-300"}`}
                    >
                      {faq.q}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ml-3 transition-all ${isOpen ? "bg-purple-100 dark:bg-purple-500/20 rotate-180" : "bg-gray-100 dark:bg-white/5"}`}
                    >
                      <Iconify
                        icon="lucide:chevron-down"
                        className={`text-base transition-colors ${isOpen ? "text-purple-500" : "text-gray-400"}`}
                      />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-3.5 sm:px-4 pb-3.5 sm:pb-4">
                      <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed transition-colors">
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Still need help — CTA */}
        <div className="relative overflow-hidden bg-linear-to-br from-slate-800 to-slate-900 rounded-2xl p-5 sm:p-6 shadow-xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Iconify
                  icon="lucide:message-square"
                  className="text-white text-lg"
                />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-0.5">
                  Still need help?
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm">
                  Our team is ready to assist you with any questions.
                </p>
              </div>
            </div>
            <a
              href="mailto:support@astroweb.com"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-linear-to-r from-violet-500 to-purple-600 text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 active:scale-95 shrink-0"
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
