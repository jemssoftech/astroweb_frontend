// "use client";
// import React from "react";
// import Iconify from "@/src/components/Iconify";
// import { getAuthToken, getUser } from "@/src/lib/auth";
// import WalletTopUp from "@/src/components/dashboard/WalletTopUp";
// import { fetchWithAuth } from "@/src/lib/fetchWithAuth";

// export default function DashboardPage() {
//   const user = getUser();
//   const userName = user?.username || "ronik";
//   const token = getAuthToken();
//   const [copied, setCopied] = React.useState(false);

//   const handleCopy = async () => {
//     const apiKey = user?.apikey || "1ac21f10-b176-585a-8e6f-de323548b29b";
//     try {
//       await navigator.clipboard.writeText(apiKey);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     } catch {
//       console.error("Failed to copy");
//     }
//   };
//   const handleapi = async (data: unknown) => {
//     try {
//       const response = await fetchWithAuth("/api/api-key-refresh", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       });
//       const res = await response.json();
//       console.log(res);
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   console.log(user?.apikey);
//   return (
//     <div className="flex-1 w-full bg-white relative min-h-screen">
//       {/* Top Banner Decoration */}
//       <div className="absolute top-0 right-0 w-full overflow-hidden h-[180px] pointer-events-none z-0 flex justify-between">
//         <div className="absolute top-[-30px] left-[5%] w-[150px] h-[40px] bg-[#22d3ee]/20 -rotate-12 transform blur-[2px]"></div>
//         <div className="absolute top-[10px] left-[12%] w-[180px] h-[50px] bg-[#c084fc]/20 -rotate-6 transform blur-[2px]"></div>
//         {/* Placeholder bottom decorations */}
//         <div className="absolute bottom-[-50px] right-[-20px] w-[200px] h-[80px] bg-[#c084fc]/10 -rotate-15 transform blur-[2px]"></div>
//         <div className="absolute bottom-[-20px] right-[10%] w-[150px] h-[60px] bg-[#22d3ee]/10 rotate-10 transform blur-[2px]"></div>
//       </div>

//       <div className="p-6 md:p-8 max-w-[1400px] mx-auto relative z-10 space-y-6">
//         {/* Greeting */}
//         <div className="mb-2">
//           <h1 className="text-[28px] font-bold text-[#1e293b] tracking-tight">
//             Hi {userName}!
//           </h1>
//         </div>

//         {/* Main Grid: Left & Right Columns */}
//         <div className="grid grid-cols-1 xl:grid-cols-[1fr_0.85fr] gap-6">
//           {/* LEFT COLUMN */}
//           <div className="space-y-6">
//             {/* API CALLS USED */}
//             <div className="bg-white border border-[#e2e8f0] rounded-[16px] shadow-sm overflow-hidden flex flex-col">
//               <div className="p-5 pb-3 relative">
//                 <div className="absolute top-5 right-5 text-[#cbd5e1]">
//                   <Iconify icon="mdi:cloud-outline" className="text-[28px]" />
//                 </div>
//                 <h3 className="text-[13px] font-bold text-[#94a3b8] tracking-widest mb-1">
//                   API CALLS USED
//                 </h3>
//                 <div className="flex items-baseline gap-1 mt-2">
//                   <span className="text-[26px] font-bold text-[#1e293b] leading-none">
//                     500
//                   </span>
//                   <span className="text-[16px] font-semibold text-[#94a3b8]">
//                     / 500
//                   </span>
//                 </div>
//                 {/* Progress Bar */}
//                 <div className="mt-5 flex items-center gap-3">
//                   <div className="h-[2px] w-full bg-[#f1f5f9] relative">
//                     <div className="absolute top-0 left-0 h-full bg-[#3b82f6] w-[0%]"></div>
//                   </div>
//                   <span className="text-[12px] font-bold text-[#64748b]">
//                     0%
//                   </span>
//                 </div>
//               </div>
//               <div className="bg-[#f8fafc] p-5 border-t border-[#f1f5f9] mt-2 flex justify-between items-end">
//                 <div>
//                   <h3 className="text-[13px] font-bold text-[#94a3b8] tracking-widest mb-1.5">
//                     ONE TIME PLAN
//                   </h3>
//                   <div className="text-[15px] font-bold text-[#334155]">
//                     Freepro
//                   </div>
//                 </div>
//                 <div className="text-[12.5px] font-medium text-[#64748b]">
//                   Valid Till Wed Mar 11 2026
//                 </div>
//               </div>
//             </div>

//             {/* PDF API LEFT */}
//             <div className="bg-white border border-[#e2e8f0] rounded-[16px] shadow-sm p-6 relative">
//               <div className="absolute top-6 right-6 text-[#e2e8f0]">
//                 <Iconify icon="mdi:file-pdf-box" className="text-[34px]" />
//               </div>
//               <h3 className="text-[14px] font-bold tracking-wider text-[#94a3b8] mb-1 flex items-center gap-2">
//                 PDF API LEFT{" "}
//                 <span className="text-[#3b82f6]">- TOPUP PDF API</span>
//               </h3>
//               <p className="text-[11px] font-medium text-[#64748b] italic mb-5">
//                 *PDF is an addon. It is not a part of the pro, limited plan or
//                 developer extensions and needs to be purchased separately
//               </p>

//               <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//                 {/* Sub-cards */}
//                 {[
//                   { title: "SMALL", count: "0", status: "Never Used" },
//                   { title: "MEDIUM", count: "0", status: "Never Used" },
//                   { title: "LARGE", count: "0", status: "Never Used" },
//                   { title: "PREDICTION", count: "0", status: "Never Used" },
//                   {
//                     title: "12 MONTH PREDICTION",
//                     count: "0",
//                     status: "Never Used",
//                   },
//                   { title: "MATCHING", count: "0", status: "Never Used" },
//                 ].map((item, idx) => (
//                   <div
//                     key={idx}
//                     className="bg-[#f8fafc] border border-[#f1f5f9] rounded-[10px] p-4 flex flex-col justify-center"
//                   >
//                     <h4 className="text-[11px] font-extrabold text-[#64748b] tracking-wider mb-1.5">
//                       {item.title}
//                     </h4>
//                     <div className="text-[20px] font-bold text-[#1e293b] leading-none mb-1.5">
//                       {item.count}
//                     </div>
//                     <div className="text-[11px] font-medium text-[#94a3b8]">
//                       {item.status}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* RIGHT COLUMN */}
//           <div className="space-y-6">
//             {/* API KEY */}
//             <div className="bg-white border border-[#e2e8f0] rounded-[16px] shadow-sm p-6">
//               <div className="flex items-center gap-3 mb-6">
//                 <h3 className="text-[14px] font-bold tracking-wider text-[#94a3b8]">
//                   API KEY
//                 </h3>
//                 <button
//                   onClick={() => handleapi({ token })}
//                   className="bg-[#fff7ed] text-[#ea580c] text-[12px] font-bold px-3 py-1.5 rounded-[8px] flex items-center gap-1.5 hover:bg-[#ffedd5] transition-colors border border-[#fed7aa]"
//                 >
//                   <Iconify icon="lucide:refresh-cw" className="text-[12px]" />
//                   Reset API Key
//                 </button>
//               </div>

//               <div className="flex flex-col sm:flex-row sm:items-center gap-4">
//                 <div className="text-[17px] font-medium text-[#334155] break-all font-mono tracking-tight">
//                   {user?.apikey || "1ac21f10-b176-585a-8e6f-de323548b29b"}
//                 </div>
//                 <button
//                   onClick={handleCopy}
//                   className={`text-[12.5px] font-bold px-3.5 py-1.5 rounded-[8px] flex items-center gap-1.5 transition-colors self-start sm:self-auto shrink-0 ${
//                     copied
//                       ? "bg-[#f0fdf4] text-[#16a34a]"
//                       : "bg-[#eff6ff] text-[#3b82f6] hover:bg-[#dbeafe]"
//                   }`}
//                 >
//                   <Iconify
//                     icon={copied ? "lucide:check" : "lucide:copy"}
//                     className="text-[13px]"
//                   />
//                   {copied ? "Copied!" : "Copy"}
//                 </button>
//               </div>
//             </div>

//             {/* WALLET TOP-UP */}
//             <WalletTopUp />
//           </div>
//         </div>

//         {/* February API Usage Chart Container */}
//         <div className="bg-white border border-[#e2e8f0] rounded-[16px] shadow-sm p-6 min-h-[300px]">
//           <h3 className="text-[15px] font-bold text-[#334155] mb-2">
//             February API Usage
//           </h3>
//           {/* Chart placeholder */}
//           <div className="w-full h-full flex items-center justify-center pt-20">
//             {/* The image shows this area is literally blank white with just the title, waiting for a chart */}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";
import React, { useState, useEffect } from "react";
import Iconify from "@/src/components/Iconify";
import { getAuthToken, getUser } from "@/src/lib/auth";
import WalletTopUp from "@/src/components/dashboard/WalletTopUp";
import { fetchWithAuth } from "@/src/lib/fetchWithAuth";

// Animated Counter Component
const AnimatedCounter = ({
  value,
  duration = 1000,
}: {
  value: number;
  duration?: number;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);

  return <>{count}</>;
};

// Stat Card Component
const StatCard = ({
  icon,
  title,
  value,
  subtitle,
  color,
  trend,
}: {
  icon: string;
  title: string;
  value: string;
  subtitle: string;
  color: string;
  trend?: { value: string; positive: boolean };
}) => (
  <div className="group relative bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 overflow-hidden">
    {/* Background Gradient */}
    <div
      className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
    />

    {/* Icon */}
    <div
      className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${color} mb-4 shadow-lg`}
    >
      <Iconify icon={icon} className="text-white text-xl" />
    </div>

    {/* Content */}
    <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
    <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-400">{subtitle}</span>
      {trend && (
        <span
          className={`text-xs font-semibold flex items-center gap-0.5 ${trend.positive ? "text-emerald-500" : "text-red-500"}`}
        >
          <Iconify
            icon={
              trend.positive ? "lucide:trending-up" : "lucide:trending-down"
            }
            className="text-sm"
          />
          {trend.value}
        </span>
      )}
    </div>
  </div>
);

// PDF Card Component
const PDFCard = ({
  title,
  count,
  status,
  delay,
}: {
  title: string;
  count: string;
  status: string;
  delay: number;
}) => (
  <div
    className="group bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl p-4 hover:border-blue-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-center justify-between mb-3">
      <h4 className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">
        {title}
      </h4>
      <div className="w-2 h-2 rounded-full bg-gray-300 group-hover:bg-blue-400 transition-colors" />
    </div>
    <div className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
      {count}
    </div>
    <div className="text-[11px] font-medium text-gray-400 flex items-center gap-1">
      <span
        className={`w-1.5 h-1.5 rounded-full ${status === "Never Used" ? "bg-gray-300" : "bg-emerald-400"}`}
      />
      {status}
    </div>
  </div>
);

// Mini Chart Component
const MiniChart = () => {
  const data = [40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88];
  const maxValue = Math.max(...data);

  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((value, index) => (
        <div
          key={index}
          className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-sm opacity-80 hover:opacity-100 transition-all duration-200 hover:scale-110 cursor-pointer"
          style={{
            height: `${(value / maxValue) * 100}%`,
            animationDelay: `${index * 50}ms`,
          }}
          title={`Day ${index + 1}: ${value} calls`}
        />
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const user = getUser();
  const userName = user?.username || "Ronik";
  const token = getAuthToken();
  const [copied, setCopied] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  const handleCopy = async () => {
    const apiKey = user?.apikey || "1ac21f10-b176-585a-8e6f-de323548b29b";
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("Failed to copy");
    }
  };

  const handleapi = async (data: unknown) => {
    setIsLoading(true);
    try {
      const response = await fetchWithAuth("/api/api-key-refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const res = await response.json();
      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const pdfItems = [
    { title: "SMALL", count: "0", status: "Never Used" },
    { title: "MEDIUM", count: "0", status: "Never Used" },
    { title: "LARGE", count: "0", status: "Never Used" },
    { title: "PREDICTION", count: "0", status: "Never Used" },
    { title: "12 MONTH", count: "0", status: "Never Used" },
    { title: "MATCHING", count: "0", status: "Never Used" },
  ];

  return (
    <div className="flex-1 w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-100/40 to-purple-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-cyan-100/30 to-emerald-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-gradient-to-r from-pink-100/20 to-orange-100/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative z-10 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
        {/* Welcome Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-3xl p-6 md:p-8 shadow-2xl shadow-blue-500/20">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-white/5 rounded-full blur-2xl translate-y-1/2" />

          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern
                  id="grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="white"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-blue-200 text-sm font-medium">
                  {greeting}
                </span>
                <Iconify icon="twemoji:waving-hand" className="text-xl" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Welcome back,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">
                  {userName}
                </span>
                !
              </h1>
              <p className="text-blue-100/80 text-sm md:text-base">
                Here's what's happening with your API usage today.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl text-white text-sm font-medium transition-all duration-300 border border-white/10">
                <Iconify icon="lucide:download" className="text-lg" />
                Export Data
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white text-blue-600 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-white/20 transition-all duration-300">
                <Iconify icon="lucide:plus" className="text-lg" />
                Upgrade Plan
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon="lucide:cloud"
            title="Total API Calls"
            value="500"
            subtitle="This month"
            color="from-blue-500 to-blue-600"
            trend={{ value: "+12.5%", positive: true }}
          />
          <StatCard
            icon="lucide:activity"
            title="Active Endpoints"
            value="8"
            subtitle="Out of 12"
            color="from-emerald-500 to-emerald-600"
          />
          <StatCard
            icon="lucide:clock"
            title="Avg Response Time"
            value="124ms"
            subtitle="Last 24 hours"
            color="from-amber-500 to-orange-500"
            trend={{ value: "-8ms", positive: true }}
          />
          <StatCard
            icon="lucide:shield-check"
            title="Uptime"
            value="99.9%"
            subtitle="Last 30 days"
            color="from-purple-500 to-purple-600"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - 2 cols wide */}
          <div className="xl:col-span-2 space-y-6">
            {/* API Usage Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-2">
                      API CALLS USAGE
                    </h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-gray-900">
                        <AnimatedCounter value={500} />
                      </span>
                      <span className="text-lg font-semibold text-gray-400">
                        / 500
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-xs font-semibold text-amber-600">
                      Limit Reached
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out relative"
                      style={{ width: "100%" }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs font-medium text-gray-400">
                    <span>0 calls</span>
                    <span>500 calls</span>
                  </div>
                </div>
              </div>

              {/* Plan Info Footer */}
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-5 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                      <Iconify
                        icon="lucide:crown"
                        className="text-white text-lg"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-700">
                        Freepro Plan
                      </h4>
                      <p className="text-xs text-gray-400">One-time purchase</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Valid Until</p>
                      <p className="text-sm font-semibold text-gray-700">
                        Mar 11, 2026
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300">
                      Upgrade
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* PDF API Section */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/30">
                    <Iconify
                      icon="lucide:file-text"
                      className="text-white text-lg"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-700">
                      PDF API Credits
                    </h3>
                    <p className="text-xs text-gray-400">Addon service</p>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300">
                  <Iconify icon="lucide:plus" className="text-sm" />
                  Top Up Credits
                </button>
              </div>

              {/* Info Banner */}
              <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-100 rounded-xl mb-6">
                <Iconify
                  icon="lucide:info"
                  className="text-amber-500 text-lg shrink-0 mt-0.5"
                />
                <p className="text-xs text-amber-700">
                  PDF is an addon service and needs to be purchased separately
                  from Pro, Limited, or Developer plans.
                </p>
              </div>

              {/* PDF Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {pdfItems.map((item, idx) => (
                  <PDFCard key={idx} {...item} delay={idx * 100} />
                ))}
              </div>
            </div>

            {/* Usage Chart */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-700">
                    API Usage Analytics
                  </h3>
                  <p className="text-xs text-gray-400">February 2024</p>
                </div>
                <div className="flex items-center gap-2">
                  {["7D", "30D", "90D"].map((period, idx) => (
                    <button
                      key={period}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-300 ${
                        idx === 1
                          ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                          : "text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart Area */}
              <div className="h-64 relative">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-400 font-medium">
                  <span>100</span>
                  <span>75</span>
                  <span>50</span>
                  <span>25</span>
                  <span>0</span>
                </div>

                {/* Chart */}
                <div className="ml-8 h-full flex flex-col">
                  <div className="flex-1 flex items-end gap-1 border-b border-gray-100 pb-2">
                    {Array.from({ length: 28 }, (_, i) => {
                      const height = Math.random() * 80 + 20;
                      return (
                        <div
                          key={i}
                          className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t hover:from-blue-600 hover:to-blue-500 transition-all duration-200 cursor-pointer group relative"
                          style={{ height: `${height}%` }}
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {Math.floor(height)} calls
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* X-axis labels */}
                  <div className="flex justify-between text-xs text-gray-400 font-medium pt-2">
                    <span>Feb 1</span>
                    <span>Feb 7</span>
                    <span>Feb 14</span>
                    <span>Feb 21</span>
                    <span>Feb 28</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* API Key Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-lg">
                    <Iconify icon="lucide:key" className="text-white text-lg" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-700">API Key</h3>
                    <p className="text-xs text-gray-400">Keep it secret!</p>
                  </div>
                </div>
                <button
                  onClick={() => handleapi({ token })}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-600 text-xs font-semibold rounded-lg hover:bg-amber-100 transition-all duration-300 disabled:opacity-50"
                >
                  <Iconify
                    icon="lucide:refresh-cw"
                    className={`text-xs ${isLoading ? "animate-spin" : ""}`}
                  />
                  Reset
                </button>
              </div>

              {/* API Key Display */}
              <div className="space-y-3">
                <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-100 rounded-xl">
                  <code className="text-sm font-mono text-gray-700 break-all leading-relaxed">
                    {user?.apikey || "1ac21f10-b176-585a-8e6f-de323548b29b"}
                  </code>
                </div>
                <button
                  onClick={handleCopy}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    copied
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                      : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/30"
                  }`}
                >
                  <Iconify
                    icon={copied ? "lucide:check" : "lucide:copy"}
                    className="text-lg"
                  />
                  {copied ? "Copied to Clipboard!" : "Copy API Key"}
                </button>
              </div>
            </div>

            {/* Wallet Top-Up */}
            <WalletTopUp />

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-sm font-bold text-gray-700 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                {[
                  {
                    icon: "lucide:book-open",
                    label: "View Documentation",
                    color: "text-blue-500",
                  },
                  {
                    icon: "lucide:message-circle",
                    label: "Contact Support",
                    color: "text-emerald-500",
                  },
                  {
                    icon: "lucide:settings",
                    label: "Account Settings",
                    color: "text-gray-500",
                  },
                  {
                    icon: "lucide:shield",
                    label: "Security Center",
                    color: "text-amber-500",
                  },
                ].map((action, idx) => (
                  <button
                    key={idx}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-300 group"
                  >
                    <div className={`${action.color}`}>
                      <Iconify icon={action.icon} className="text-xl" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      {action.label}
                    </span>
                    <Iconify
                      icon="lucide:chevron-right"
                      className="text-gray-300 ml-auto group-hover:text-gray-500 group-hover:translate-x-1 transition-all"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-700">
                  Recent Activity
                </h3>
                <button className="text-xs font-semibold text-blue-500 hover:text-blue-600">
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {[
                  {
                    action: "API Key Reset",
                    time: "2 hours ago",
                    icon: "lucide:key",
                    status: "success",
                  },
                  {
                    action: "Plan Upgraded",
                    time: "5 hours ago",
                    icon: "lucide:crown",
                    status: "success",
                  },
                  {
                    action: "500 API Calls",
                    time: "1 day ago",
                    icon: "lucide:cloud",
                    status: "warning",
                  },
                ].map((activity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        activity.status === "success"
                          ? "bg-emerald-100 text-emerald-500"
                          : "bg-amber-100 text-amber-500"
                      }`}
                    >
                      <Iconify icon={activity.icon} className="text-sm" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
