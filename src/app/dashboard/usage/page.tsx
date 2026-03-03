"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Iconify from "@/src/components/Iconify";
import api from "@/src/lib/api";

// --- Types ---
interface HistoryItem {
  id: string;
  amount: number;
  type: "credit" | "debit";
  description: string;
  createdAt: string;
}

interface WalletBalance {
  totalCredits: number;
  usedCredits: number;
  remainingCredits: number;
  remainingBalanceRupees: number;
}

// --- Chart Component ---
const LineChart = ({ data }: { data: { date: string; count: number }[] }) => {
  const width = 800;
  const height = 240;
  const padding = 40;

  const maxCount = Math.max(...data.map((d) => d.count), 10) * 1.2;

  const points = useMemo(() => {
    if (data.length === 0) return [];
    return data.map((d, i) => {
      const x = (i / (data.length - 1 || 1)) * (width - padding * 2) + padding;
      const y =
        height - ((d.count / maxCount) * (height - padding * 2) + padding);
      return { x, y };
    });
  }, [data, width, height, maxCount]);

  if (data.length < 2) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center bg-gray-50 rounded-2xl border border-gray-100">
        <p className="text-gray-400 font-medium">
          Not enough data to generate graph yet
        </p>
      </div>
    );
  }

  const pathD = points
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(" ");
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - 20} L ${points[0].x} ${height - 20} Z`;

  return (
    <div className="w-full bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">
            API Activity
          </h3>
          <p className="text-gray-500 text-sm mt-0.5 font-medium">
            Usage trends from recent transactions
          </p>
        </div>
        <div className="flex gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold border border-blue-100 uppercase tracking-wider">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            Live Sync
          </span>
        </div>
      </div>

      <div className="relative h-[250px] w-full">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
          </defs>

          {/* Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((p) => (
            <line
              key={p}
              x1={padding}
              y1={height - 20 - p * (height - padding * 2)}
              x2={width - padding}
              y2={height - 20 - p * (height - padding * 2)}
              stroke="#F1F5F9"
              strokeWidth="2"
            />
          ))}

          {/* Area Fill */}
          <motion.path
            d={areaD}
            fill="url(#chartGradient)"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: 1.5, ease: "circOut" }}
            style={{ transformOrigin: "bottom" }}
          />

          {/* Line Path */}
          <motion.path
            d={pathD}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          {/* Points */}
          {points.map((p, i) => (
            <motion.circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="5"
              className="fill-white stroke-blue-500 stroke-[3px]"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8 + i * 0.1 }}
            />
          ))}

          {/* X-Axis Labels */}
          {data.map((d, i) => (
            <text
              key={i}
              x={points[i].x}
              y={height + 5}
              textAnchor="middle"
              className="fill-gray-400 text-[11px] font-bold"
            >
              {d.date}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default function ApiUsagePage() {
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"1D" | "1M" | "3M">("1M");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [balanceRes, historyRes] = await Promise.all([
          api.get("/api/wallet/balance"),
          api.get("/api/wallet/history?limit=100"), // Fetch more for better filtering
        ]);

        if (balanceRes.data) setBalance(balanceRes.data);
        if (historyRes.data?.history) setHistory(historyRes.data.history);
      } catch (err) {
        console.error("Failed to fetch usage data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Process history data for chart
  const chartData = useMemo(() => {
    const dailyMap: Record<string, number> = {};
    const now = new Date();
    const daysToScroll = filter === "1D" ? 1 : filter === "1M" ? 30 : 90;

    const labels: string[] = [];

    if (filter === "1D") {
      // Hourly for 1D
      for (let i = 23; i >= 0; i--) {
        const d = new Date(now);
        d.setHours(now.getHours() - i);
        const label = d.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        labels.push(label);
        dailyMap[label] = 0;
      }

      history
        .filter((h) => h.type === "debit")
        .forEach((h) => {
          const hTime = new Date(h.createdAt);
          if (now.getTime() - hTime.getTime() < 24 * 60 * 60 * 1000) {
            // Find closest bucket (simplified to exact hour string match for now or just finding the bucket)
            const bucket = new Date(hTime);
            bucket.setMinutes(0);
            const bucketLabel = bucket.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
            if (dailyMap[bucketLabel] !== undefined) {
              dailyMap[bucketLabel] += Math.abs(h.amount);
            }
          }
        });
    } else {
      // Daily for 1M/3M
      for (let i = daysToScroll - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        const label = d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        labels.push(label);
        dailyMap[label] = 0;
      }

      history
        .filter((h) => h.type === "debit")
        .forEach((h) => {
          const date = new Date(h.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
          if (dailyMap[date] !== undefined) {
            dailyMap[date] += Math.abs(h.amount);
          }
        });
    }

    return labels.map((date) => ({ date, count: Math.round(dailyMap[date]) }));
  }, [history, filter]);

  const statsList = [
    {
      label: "Used Credits",
      value: balance?.usedCredits?.toLocaleString() || "0",
      icon: "lucide:activity",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Remaining",
      value: balance?.remainingCredits?.toLocaleString() || "0",
      icon: "lucide:database",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Total Balance",
      value: `\u20B9${balance?.remainingBalanceRupees?.toLocaleString() || "0"}`,
      icon: "lucide:wallet",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Recent Latency",
      value: "118ms",
      icon: "lucide:zap",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  if (loading) {
    return (
      <div className="flex-1 min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-bold animate-pulse">
            Synchronizing Usage Data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full min-h-screen bg-white">
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-gray-100">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              API Usage
            </h1>
            <p className="text-gray-500 mt-1.5 font-medium">
              Real-time monitoring of your astrological engine metrics.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
              {(["1D", "1M", "3M"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === t ? "bg-white text-blue-600 shadow-sm border border-gray-200" : "text-gray-500 hover:text-gray-700"}`}
                >
                  {t}
                </button>
              ))}
            </div>
            <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-2xl text-sm font-bold text-white transition-all shadow-xl shadow-blue-500/20 active:scale-95">
              Export Analysis
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsList.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div
                className={`p-3 rounded-2xl ${stat.bg} ${stat.color} w-fit mb-4 group-hover:rotate-12 transition-transform`}
              >
                <Iconify icon={stat.icon} className="text-2xl" />
              </div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">
                {stat.label}
              </p>
              <h3 className="text-3xl font-black text-gray-900 tracking-tighter">
                {stat.value}
              </h3>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <LineChart data={chartData} />

            {/* Detailed Usage Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-bold text-gray-900 text-lg">
                  Transaction Activity
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                      <th className="px-8 py-5">Activity</th>
                      <th className="px-8 py-5">Amount</th>
                      <th className="px-8 py-5">Type</th>
                      <th className="px-8 py-5">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-sm text-gray-600">
                    {history.slice(0, 8).map((h) => (
                      <tr
                        key={h.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-8 py-5 font-bold text-gray-800">
                          {h.description}
                        </td>
                        <td className="px-8 py-5 font-black">
                          {Math.abs(h.amount)}
                        </td>
                        <td className="px-8 py-5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${h.type === "credit" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                          >
                            {h.type}
                          </span>
                        </td>
                        <td className="px-8 py-5 font-medium opacity-60">
                          {new Date(h.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    ))}
                    {history.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-8 py-10 text-center text-gray-400 font-bold uppercase tracking-widest"
                        >
                          No recent transactions found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar Section */}
          <div className="space-y-8">
            <div className="bg-linear-to-br from-indigo-500 to-blue-600 p-8 rounded-3xl relative overflow-hidden shadow-2xl shadow-blue-500/20 text-white">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                  <Iconify
                    icon="lucide:rocket"
                    className="text-2xl text-white"
                  />
                </div>
                <h3 className="font-black text-2xl mb-2 tracking-tight">
                  Need More Power?
                </h3>
                <p className="text-blue-50/80 text-sm mb-8 font-medium">
                  Get higher request limits and priority support with our
                  Professional tier.
                </p>
                <button className="w-full py-4 bg-white text-blue-600 rounded-2xl font-black text-sm hover:bg-blue-50 transition-all active:scale-95 shadow-lg">
                  Upgrade Account
                </button>
              </div>
              <Iconify
                icon="lucide:shield-plus"
                className="absolute -right-10 -top-10 text-white/10 text-[200px] transform rotate-12"
              />
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-gray-900 font-black mb-6 text-lg">
                Resource Occupancy
              </h3>
              <div className="space-y-6 text-sm font-bold">
                {[
                  { name: "Horoscope Engine", usage: 68, color: "bg-blue-500" },
                  {
                    name: "Kundli Rendering",
                    usage: 42,
                    color: "bg-purple-500",
                  },
                  {
                    name: "Vastu Computations",
                    usage: 15,
                    color: "bg-amber-500",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-2.5">
                    <div className="flex justify-between items-end">
                      <span className="text-gray-500 text-xs uppercase tracking-widest">
                        {item.name}
                      </span>
                      <span className="text-gray-900 text-base">
                        {item.usage}%
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden p-0.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.usage}%` }}
                        transition={{
                          duration: 1.2,
                          ease: "circOut",
                          delay: 0.5 + idx * 0.1,
                        }}
                        className={`h-full rounded-full ${item.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100">
              <h4 className="text-blue-900 font-black mb-3 text-lg flex items-center gap-2">
                <Iconify icon="lucide:shield-check" className="text-blue-600" />
                Security Watch
              </h4>
              <p className="text-blue-700/70 text-sm mb-6 leading-relaxed font-bold">
                Your API endpoint is protected by DDoS mitigation and IP
                whitening.
              </p>
              <div className="flex items-center gap-2 text-blue-600 text-sm font-black uppercase tracking-tighter hover:underline cursor-pointer group">
                Check Auth Logs{" "}
                <Iconify
                  icon="lucide:arrow-right"
                  className="group-hover:translate-x-1 transition-transform"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
