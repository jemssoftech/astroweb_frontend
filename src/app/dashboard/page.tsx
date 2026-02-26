"use client";
import React from "react";
import Iconify from "@/src/components/Iconify";
import { getAuthToken, getUser } from "@/src/lib/auth";
import WalletTopUp from "@/src/components/dashboard/WalletTopUp";
import { fetchWithAuth } from "@/src/lib/fetchWithAuth";

export default function DashboardPage() {
  const user = getUser();
  const userName = user?.username || "ronik";
  const token = getAuthToken();
  const [copied, setCopied] = React.useState(false);

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
    try {
      const response = await fetchWithAuth("/api/api-key-refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const res = await response.json();
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(user?.apikey);
  return (
    <div className="flex-1 w-full bg-white relative min-h-screen">
      {/* Top Banner Decoration */}
      <div className="absolute top-0 right-0 w-full overflow-hidden h-[180px] pointer-events-none z-0 flex justify-between">
        <div className="absolute top-[-30px] left-[5%] w-[150px] h-[40px] bg-[#22d3ee]/20 -rotate-12 transform blur-[2px]"></div>
        <div className="absolute top-[10px] left-[12%] w-[180px] h-[50px] bg-[#c084fc]/20 -rotate-6 transform blur-[2px]"></div>
        {/* Placeholder bottom decorations */}
        <div className="absolute bottom-[-50px] right-[-20px] w-[200px] h-[80px] bg-[#c084fc]/10 -rotate-15 transform blur-[2px]"></div>
        <div className="absolute bottom-[-20px] right-[10%] w-[150px] h-[60px] bg-[#22d3ee]/10 rotate-10 transform blur-[2px]"></div>
      </div>

      <div className="p-6 md:p-8 max-w-[1400px] mx-auto relative z-10 space-y-6">
        {/* Greeting */}
        <div className="mb-2">
          <h1 className="text-[28px] font-bold text-[#1e293b] tracking-tight">
            Hi {userName}!
          </h1>
        </div>

        {/* Main Grid: Left & Right Columns */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_0.85fr] gap-6">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* API CALLS USED */}
            <div className="bg-white border border-[#e2e8f0] rounded-[16px] shadow-sm overflow-hidden flex flex-col">
              <div className="p-5 pb-3 relative">
                <div className="absolute top-5 right-5 text-[#cbd5e1]">
                  <Iconify icon="mdi:cloud-outline" className="text-[28px]" />
                </div>
                <h3 className="text-[13px] font-bold text-[#94a3b8] tracking-widest mb-1">
                  API CALLS USED
                </h3>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-[26px] font-bold text-[#1e293b] leading-none">
                    500
                  </span>
                  <span className="text-[16px] font-semibold text-[#94a3b8]">
                    / 500
                  </span>
                </div>
                {/* Progress Bar */}
                <div className="mt-5 flex items-center gap-3">
                  <div className="h-[2px] w-full bg-[#f1f5f9] relative">
                    <div className="absolute top-0 left-0 h-full bg-[#3b82f6] w-[0%]"></div>
                  </div>
                  <span className="text-[12px] font-bold text-[#64748b]">
                    0%
                  </span>
                </div>
              </div>
              <div className="bg-[#f8fafc] p-5 border-t border-[#f1f5f9] mt-2 flex justify-between items-end">
                <div>
                  <h3 className="text-[13px] font-bold text-[#94a3b8] tracking-widest mb-1.5">
                    ONE TIME PLAN
                  </h3>
                  <div className="text-[15px] font-bold text-[#334155]">
                    Freepro
                  </div>
                </div>
                <div className="text-[12.5px] font-medium text-[#64748b]">
                  Valid Till Wed Mar 11 2026
                </div>
              </div>
            </div>

            {/* PDF API LEFT */}
            <div className="bg-white border border-[#e2e8f0] rounded-[16px] shadow-sm p-6 relative">
              <div className="absolute top-6 right-6 text-[#e2e8f0]">
                <Iconify icon="mdi:file-pdf-box" className="text-[34px]" />
              </div>
              <h3 className="text-[14px] font-bold tracking-wider text-[#94a3b8] mb-1 flex items-center gap-2">
                PDF API LEFT{" "}
                <span className="text-[#3b82f6]">- TOPUP PDF API</span>
              </h3>
              <p className="text-[11px] font-medium text-[#64748b] italic mb-5">
                *PDF is an addon. It is not a part of the pro, limited plan or
                developer extensions and needs to be purchased separately
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {/* Sub-cards */}
                {[
                  { title: "SMALL", count: "0", status: "Never Used" },
                  { title: "MEDIUM", count: "0", status: "Never Used" },
                  { title: "LARGE", count: "0", status: "Never Used" },
                  { title: "PREDICTION", count: "0", status: "Never Used" },
                  {
                    title: "12 MONTH PREDICTION",
                    count: "0",
                    status: "Never Used",
                  },
                  { title: "MATCHING", count: "0", status: "Never Used" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-[#f8fafc] border border-[#f1f5f9] rounded-[10px] p-4 flex flex-col justify-center"
                  >
                    <h4 className="text-[11px] font-extrabold text-[#64748b] tracking-wider mb-1.5">
                      {item.title}
                    </h4>
                    <div className="text-[20px] font-bold text-[#1e293b] leading-none mb-1.5">
                      {item.count}
                    </div>
                    <div className="text-[11px] font-medium text-[#94a3b8]">
                      {item.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            {/* API KEY */}
            <div className="bg-white border border-[#e2e8f0] rounded-[16px] shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <h3 className="text-[14px] font-bold tracking-wider text-[#94a3b8]">
                  API KEY
                </h3>
                <button
                  onClick={() => handleapi({ token })}
                  className="bg-[#fff7ed] text-[#ea580c] text-[12px] font-bold px-3 py-1.5 rounded-[8px] flex items-center gap-1.5 hover:bg-[#ffedd5] transition-colors border border-[#fed7aa]"
                >
                  <Iconify icon="lucide:refresh-cw" className="text-[12px]" />
                  Reset API Key
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="text-[17px] font-medium text-[#334155] break-all font-mono tracking-tight">
                  {user?.apikey || "1ac21f10-b176-585a-8e6f-de323548b29b"}
                </div>
                <button
                  onClick={handleCopy}
                  className={`text-[12.5px] font-bold px-3.5 py-1.5 rounded-[8px] flex items-center gap-1.5 transition-colors self-start sm:self-auto shrink-0 ${
                    copied
                      ? "bg-[#f0fdf4] text-[#16a34a]"
                      : "bg-[#eff6ff] text-[#3b82f6] hover:bg-[#dbeafe]"
                  }`}
                >
                  <Iconify
                    icon={copied ? "lucide:check" : "lucide:copy"}
                    className="text-[13px]"
                  />
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            {/* WALLET TOP-UP */}
            <WalletTopUp />
          </div>
        </div>

        {/* February API Usage Chart Container */}
        <div className="bg-white border border-[#e2e8f0] rounded-[16px] shadow-sm p-6 min-h-[300px]">
          <h3 className="text-[15px] font-bold text-[#334155] mb-2">
            February API Usage
          </h3>
          {/* Chart placeholder */}
          <div className="w-full h-full flex items-center justify-center pt-20">
            {/* The image shows this area is literally blank white with just the title, waiting for a chart */}
          </div>
        </div>
      </div>
    </div>
  );
}
