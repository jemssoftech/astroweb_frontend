"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Iconify from "@/src/components/Iconify";
import api from "@/src/lib/api";

// --- Types ---
interface HistoryItem {
  id: string;
  amount: number;
  type: "credit" | "debit" | "CREDIT" | "DEBIT";
  description: string;
  createdAt: string;
  transactionId: string;
}

interface WalletBalance {
  totalCredits: number;
  usedCredits: number;
  remainingCredits: number;
  remainingBalanceRupees: number;
}

// --- Chart Component ---
const LineChart = ({
  data,
  filter,
}: {
  data: { date: string; count: number }[];
  filter: "1D" | "1M" | "3M";
}) => {
  const width = 800;
  const height = 280;
  const paddingLeft = 60;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 40;

  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;

  const rawMax = Math.max(...data.map((d) => d.count), 0);
  // Nice Y-axis max: round up to nearest nice number
  const niceMax = useMemo(() => {
    if (rawMax === 0) return 10;
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawMax)));
    const residual = rawMax / magnitude;
    let nice: number;
    if (residual <= 1) nice = magnitude;
    else if (residual <= 2) nice = 2 * magnitude;
    else if (residual <= 5) nice = 5 * magnitude;
    else nice = 10 * magnitude;
    return nice;
  }, [rawMax]);

  // Y-axis ticks (5 ticks including 0)
  const yTicks = useMemo(() => {
    const step = niceMax / 4;
    return [0, step, step * 2, step * 3, niceMax];
  }, [niceMax]);

  // Determine which X labels to show based on filter
  const xLabelIndices = useMemo(() => {
    if (data.length <= 1) return data.map((_, i) => i);
    if (filter === "1D") {
      // Show every 3 hours → indices 0, 3, 6, 9, 12, 15, 18, 21, 23
      const indices: number[] = [];
      for (let i = 0; i < data.length; i += 3) indices.push(i);
      if (indices[indices.length - 1] !== data.length - 1)
        indices.push(data.length - 1);
      return indices;
    }
    if (filter === "1M") {
      // Show every 7 days (weekly)
      const indices: number[] = [];
      for (let i = 0; i < data.length; i += 7) indices.push(i);
      if (indices[indices.length - 1] !== data.length - 1)
        indices.push(data.length - 1);
      return indices;
    }
    // 3M: show every 14 days (bi-weekly)
    const indices: number[] = [];
    for (let i = 0; i < data.length; i += 14) indices.push(i);
    if (indices[indices.length - 1] !== data.length - 1)
      indices.push(data.length - 1);
    return indices;
  }, [data, filter]);

  const points = useMemo(() => {
    if (data.length === 0) return [];
    return data.map((d, i) => {
      const x = (i / (data.length - 1 || 1)) * chartW + paddingLeft;
      const y = paddingTop + chartH - (d.count / niceMax) * chartH;
      return { x, y };
    });
  }, [data, chartW, chartH, niceMax, paddingLeft, paddingTop]);

  if (data.length < 2) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-white/5">
        <p className="text-gray-400 dark:text-gray-500 font-medium transition-colors">
          Not enough data to generate graph yet
        </p>
      </div>
    );
  }

  const pathD = points
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(" ");
  const areaD = `${pathD} L ${points[points.length - 1].x} ${paddingTop + chartH} L ${points[0].x} ${paddingTop + chartH} Z`;

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 lg:p-8 border border-gray-100 dark:border-white/5 shadow-sm relative overflow-hidden transition-colors">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 sm:mb-10">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors">
            API Activity
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5 font-medium transition-colors">
            Usage trends from recent transactions
          </p>
        </div>
        <div className="flex gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold border border-blue-100 dark:border-blue-500/20 uppercase tracking-wider">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            Live Sync
          </span>
        </div>
      </div>

      <div className="relative h-[280px] sm:h-[300px] w-full">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="xMidYMid meet"
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

          {/* Y-axis Grid Lines + Labels */}
          {yTicks.map((tick, i) => {
            const y = paddingTop + chartH - (tick / niceMax) * chartH;
            return (
              <React.Fragment key={`y-${i}`}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="currentColor"
                  className="text-slate-100 dark:text-white/5"
                  strokeWidth="1"
                  strokeDasharray={i === 0 ? "0" : "4 4"}
                />
                <text
                  x={paddingLeft - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-gray-400 dark:fill-gray-500 text-[10px] font-semibold"
                >
                  {tick >= 1000 ? `${(tick / 1000).toFixed(1)}k` : tick}
                </text>
              </React.Fragment>
            );
          })}

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
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          {/* Data Points — only show for visible X labels to avoid clutter */}
          {xLabelIndices.map((idx) => {
            const p = points[idx];
            if (!p) return null;
            return (
              <motion.circle
                key={idx}
                cx={p.x}
                cy={p.y}
                r="4"
                className="fill-white stroke-blue-500 stroke-[2.5px]"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8 + idx * 0.03 }}
              />
            );
          })}

          {/* X-Axis Labels — only at selected intervals */}
          {xLabelIndices.map((idx) => {
            const p = points[idx];
            if (!p) return null;
            return (
              <text
                key={`x-${idx}`}
                x={p.x}
                y={height - 5}
                textAnchor="middle"
                className="fill-gray-400 dark:fill-gray-500 text-[10px] font-semibold"
              >
                {data[idx].date}
              </text>
            );
          })}
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
          api.get("/api/wallet/history?limit=500"),
        ]);

        if (balanceRes.data) setBalance(balanceRes.data);
        if (historyRes.data?.data) setHistory(historyRes.data.data);
        else if (historyRes.data?.history) setHistory(historyRes.data.history);
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
    const now = new Date();

    if (filter === "1D") {
      // 24 hourly buckets
      const buckets: { label: string; count: number }[] = [];
      for (let i = 23; i >= 0; i--) {
        const d = new Date(now);
        d.setHours(now.getHours() - i, 0, 0, 0);
        const label = d.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          hour12: true,
        });
        buckets.push({ label, count: 0 });
      }

      history
        .filter((h) => h.type === "debit" || h.type === ("DEBIT" as string))
        .forEach((h) => {
          const hTime = new Date(h.createdAt);
          const diffMs = now.getTime() - hTime.getTime();
          if (diffMs < 24 * 60 * 60 * 1000 && diffMs >= 0) {
            const hoursAgo = Math.floor(diffMs / (60 * 60 * 1000));
            const bucketIdx = 23 - hoursAgo;
            if (bucketIdx >= 0 && bucketIdx < buckets.length) {
              buckets[bucketIdx].count += Math.abs(h.amount);
            }
          }
        });

      return buckets.map((b) => ({ date: b.label, count: b.count }));
    }

    if (filter === "1M") {
      // 30 daily buckets
      const buckets: { label: string; ts: number; count: number }[] = [];
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        d.setHours(0, 0, 0, 0);
        const label = d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        buckets.push({ label, ts: d.getTime(), count: 0 });
      }

      history
        .filter((h) => h.type === "debit" || h.type === ("DEBIT" as string))
        .forEach((h) => {
          const hDate = new Date(h.createdAt);
          hDate.setHours(0, 0, 0, 0);
          const hTs = hDate.getTime();
          const bucket = buckets.find((b) => b.ts === hTs);
          if (bucket) bucket.count += Math.abs(h.amount);
        });

      return buckets.map((b) => ({ date: b.label, count: b.count }));
    }

    // 3M: 90 daily buckets
    const buckets: { label: string; ts: number; count: number }[] = [];
    for (let i = 89; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const label = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      buckets.push({ label, ts: d.getTime(), count: 0 });
    }

    history
      .filter((h) => h.type === "debit" || h.type === ("DEBIT" as string))
      .forEach((h) => {
        const hDate = new Date(h.createdAt);
        hDate.setHours(0, 0, 0, 0);
        const hTs = hDate.getTime();
        const bucket = buckets.find((b) => b.ts === hTs);
        if (bucket) bucket.count += Math.abs(h.amount);
      });

    return buckets.map((b) => ({ date: b.label, count: b.count }));
  }, [history, filter]);

  const statsList = [
    {
      label: "Used Credits",
      value: balance?.usedCredits?.toLocaleString() || "0",
      icon: "lucide:activity",
      gradient: "from-blue-500 to-indigo-500",
      shadowColor: "shadow-blue-500/20",
    },
    {
      label: "Remaining",
      value: balance?.remainingCredits?.toLocaleString() || "0",
      icon: "lucide:database",
      gradient: "from-emerald-500 to-teal-500",
      shadowColor: "shadow-emerald-500/20",
    },
    {
      label: "Total Balance",
      value: `\u20B9${balance?.remainingBalanceRupees?.toLocaleString() || "0"}`,
      icon: "lucide:wallet",
      gradient: "from-amber-500 to-orange-500",
      shadowColor: "shadow-amber-500/20",
    },
    {
      label: "Recent Latency",
      value: "118ms",
      icon: "lucide:zap",
      gradient: "from-purple-500 to-violet-500",
      shadowColor: "shadow-purple-500/20",
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
    <div className=" w-full transition-colors duration-300">
      <div className="container mx-auto space-y-6 sm:space-y-10">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-violet-100/40 to-purple-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-linear-to-tr from-cyan-100/30 to-blue-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        </div>
        {/* Header Section — Wallet-style gradient banner */}
        <div className="relative mb-6 overflow-hidden bg-linear-to-br from-emerald-600 to-teal-700 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl shadow-emerald-500/20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white" />
            <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white" />
          </div>

          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-14 h-14 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Iconify
                  icon="lucide:activity"
                  className="text-white text-md sm:text-2xl"
                />
              </div>
              <div>
                <h1 className="text-md sm:text-2xl md:text-3xl font-bold text-white mb-1">
                  API Usage
                </h1>
                <p className="text-emerald-100/80 text-sm">
                  Real-time monitoring of your astrological engine metrics.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex bg-white/10 backdrop-blur-sm p-1 rounded-xl border border-white/10">
                {(["1D", "1M", "3M"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilter(t)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === t ? "bg-white text-emerald-700 shadow-sm" : "text-white/80 hover:text-white hover:bg-white/10"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <button className="px-4 sm:px-5 py-2 sm:py-2.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/10 rounded-xl text-sm font-bold text-white transition-all active:scale-95">
                Export Analysis
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {statsList.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-slate-900/80 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
            >
              <div
                className={`absolute inset-0 bg-linear-to-br ${stat.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`}
              />
              <div
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-linear-to-br ${stat.gradient} flex items-center justify-center mb-3 shadow-lg ${stat.shadowColor} group-hover:scale-110 transition-transform duration-300`}
              >
                <Iconify
                  icon={stat.icon}
                  className="text-white text-lg sm:text-xl"
                />
              </div>
              <p className="text-gray-400 dark:text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1 transition-colors">
                {stat.label}
              </p>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight transition-colors">
                {stat.value}
              </h3>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart Section — Full Width */}
          <LineChart data={chartData} filter={filter} />

          {/* Transaction Activity Table */}
          <div className="bg-white dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden transition-colors">
            <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-white/5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-500/20">
                <Iconify icon="lucide:list" className="text-white text-base" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base transition-colors">
                  Recent Activity
                </h3>
                <p className="text-gray-400 dark:text-gray-500 text-xs transition-colors">
                  Latest API deductions and top-ups
                </p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/80 dark:bg-slate-800/50 text-gray-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest transition-colors">
                    <th className="px-4 sm:px-6 py-3.5">transaction Id</th>
                    <th className="px-4 sm:px-6 py-3.5">Amount</th>
                    <th className="px-4 sm:px-6 py-3.5">Type</th>
                    <th className="px-4 sm:px-6 py-3.5">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-white/5 text-sm text-gray-600 dark:text-slate-400 transition-colors">
                  {history.slice(0, 8).map((h) => (
                    <tr
                      key={h.id}
                      className="hover:bg-gray-50/80 dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="px-4 sm:px-6 py-3.5 font-semibold text-gray-800 dark:text-slate-200 text-sm">
                        {h.transactionId}
                      </td>
                      <td className="px-4 sm:px-6 py-3.5 font-bold text-sm">
                        <span
                          className={
                            h.type === "credit" || h.type === "CREDIT"
                              ? "text-emerald-600"
                              : "text-red-500"
                          }
                        >
                          {h.type === "credit" || h.type === "CREDIT"
                            ? "+"
                            : "-"}
                          {Math.abs(h.amount)}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${h.type === "credit" || h.type === "CREDIT" ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20" : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20"}`}
                        >
                          {h.type}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-3.5 font-medium text-gray-400 text-sm whitespace-nowrap">
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
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <Iconify
                          icon="lucide:inbox"
                          className="text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-3"
                        />
                        <p className="text-gray-400 dark:text-gray-500 font-semibold">
                          No recent transactions found
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Bottom Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Resource Occupancy */}
          <div className="bg-white dark:bg-slate-900/80 backdrop-blur-sm p-5 sm:p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm transition-colors">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-linear-to-br from-purple-500 to-violet-500 flex items-center justify-center shadow-md shadow-purple-500/20">
                <Iconify icon="lucide:gauge" className="text-white text-base" />
              </div>
              <h3 className="text-gray-900 dark:text-white font-bold text-sm sm:text-base transition-colors">
                Resource Occupancy
              </h3>
            </div>
            <div className="space-y-4 text-sm">
              {[
                {
                  name: "Horoscope Engine",
                  usage: 68,
                  gradient: "from-blue-500 to-indigo-500",
                },
                {
                  name: "Kundli Rendering",
                  usage: 42,
                  gradient: "from-purple-500 to-violet-500",
                },
                {
                  name: "Vastu Computations",
                  usage: 15,
                  gradient: "from-amber-500 to-orange-500",
                },
              ].map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-slate-400 text-xs font-semibold transition-colors">
                      {item.name}
                    </span>
                    <span className="text-gray-800 dark:text-slate-200 text-xs font-bold transition-colors">
                      {item.usage}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden transition-colors">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.usage}%` }}
                      transition={{
                        duration: 1.2,
                        ease: "circOut",
                        delay: 0.5 + idx * 0.1,
                      }}
                      className={`h-full rounded-full bg-linear-to-r ${item.gradient}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Watch */}
          <div className="bg-linear-to-br from-emerald-50 to-teal-50 dark:from-emerald-500/10 dark:to-teal-500/10 p-5 sm:p-6 rounded-2xl border border-emerald-100 dark:border-emerald-500/20 transition-colors relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-emerald-200/30 dark:bg-emerald-500/10 rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/20">
                  <Iconify
                    icon="lucide:shield-check"
                    className="text-white text-base"
                  />
                </div>
                <h4 className="text-emerald-900 dark:text-emerald-300 font-bold text-sm sm:text-base transition-colors">
                  Security Watch
                </h4>
              </div>
              <p className="text-emerald-700/70 dark:text-emerald-200/60 text-sm mb-5 leading-relaxed font-medium transition-colors">
                Your API endpoint is protected by DDoS mitigation and IP
                whitelisting.
              </p>
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-bold hover:underline cursor-pointer group transition-colors">
                Check Auth Logs
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
