"use client";

import React from "react";
import Iconify from "@/src/components/Iconify";
import { motion } from "framer-motion";

interface MatchResultProps {
  maleName: string;
  femaleName: string;
  result: any;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

const MatchResult: React.FC<MatchResultProps> = ({
  maleName,
  femaleName,
  result,
}) => {
  const score = result?.KutaScore ?? result?.Score ?? 0;
  const summary =
    result?.Summary?.ScoreSummary || result?.Notes || "Compatibility Report";
  const predictionList = result?.PredictionList || [];

  const getScoreColor = (scoreVal: number) => {
    if (scoreVal >= 25) return "#22C55E";
    if (scoreVal >= 18) return "#F59E0B";
    return "#EF4444";
  };

  const getScoreConfig = (scoreVal: number) => {
    if (scoreVal >= 25)
      return {
        label: "Excellent",
        gradient: "from-green-400 to-emerald-500",
        bg: "bg-green-50 dark:bg-green-900/20",
      };
    if (scoreVal >= 18)
      return {
        label: "Good",
        gradient: "from-amber-400 to-orange-500",
        bg: "bg-amber-50 dark:bg-amber-900/20",
      };
    return {
      label: "Needs Attention",
      gradient: "from-red-400 to-rose-500",
      bg: "bg-red-50 dark:bg-red-900/20",
    };
  };

  const scoreConfig = getScoreConfig(Number(score));
  const scorePercentage = (Number(score) / 36) * 100;

  return (
    <div className="w-full max-w-[764px] mx-auto">
      {/* EASY REPORT HEADER */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
          <Iconify
            icon="solar:star-bold-duotone"
            width={22}
            className="text-white"
          />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Easy
        </h3>
      </div>
      <hr className="mb-6 border-gray-200 dark:border-gray-800" />

      {/* EASY REPORT CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[600px] mx-auto mb-10"
      >
        <div className="relative overflow-hidden bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl">
          {/* Top Gradient Accent */}
          <div className={`h-1.5 bg-gradient-to-r ${scoreConfig.gradient}`} />

          {/* Background Decoration */}
          <div className="absolute top-8 right-8 w-40 h-40 opacity-5 pointer-events-none">
            <Iconify icon="solar:heart-bold-duotone" width={160} />
          </div>

          <div className="relative p-6">
            {/* Names Section */}
            <div className="text-center mb-6">
              <p className="text-[11px] text-gray-400 dark:text-gray-500 font-semibold tracking-widest uppercase mb-3">
                Couple
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/25">
                    {maleName.charAt(0).toUpperCase()}
                  </div>
                  <h5 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                    {maleName}
                  </h5>
                </div>

                <div className="w-9 h-9 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                  <Iconify
                    icon="solar:heart-bold-duotone"
                    width={20}
                    className="text-pink-500"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <h5 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                    {femaleName}
                  </h5>
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-bold shadow-lg shadow-pink-500/25">
                    {femaleName.charAt(0).toUpperCase()}
                  </div>
                </div>
              </div>
            </div>

            <hr className="my-5 border-gray-100 dark:border-gray-800" />

            {/* Score & Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center items-center">
              {/* Score */}
              <div className="py-4 md:border-r border-gray-100 dark:border-gray-800">
                <p className="text-[11px] text-gray-400 dark:text-gray-500 font-semibold tracking-widest uppercase mb-4">
                  Score (Out of 36)
                </p>

                {/* Circular Progress */}
                <div className="relative w-28 h-28 mx-auto mb-3">
                  <svg
                    className="w-full h-full -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-gray-200 dark:text-gray-700"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke={getScoreColor(Number(score))}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${scorePercentage * 2.51} 251`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                      className="text-4xl font-bold"
                      style={{ color: getScoreColor(Number(score)) }}
                    >
                      {score}
                    </span>
                  </div>
                </div>

                {/* Level Badge */}
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${scoreConfig.bg}`}
                >
                  <span
                    className="text-sm font-semibold"
                    style={{ color: getScoreColor(Number(score)) }}
                  >
                    {scoreConfig.label}
                  </span>
                </div>
              </div>

              {/* AI Summary */}
              <div className="py-4">
                <p className="text-[11px] text-gray-400 dark:text-gray-500 font-semibold tracking-widest uppercase mb-3">
                  ✨ AI Summary
                </p>
                <p className="text-base text-gray-700 dark:text-gray-200 leading-relaxed font-medium">
                  {summary}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ADVANCED REPORT HEADER */}
      <div className="flex items-center gap-3 mb-4 mt-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25">
          <Iconify
            icon="solar:layers-bold-duotone"
            width={22}
            className="text-white"
          />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Advanced
        </h3>
      </div>

      {/* ADVANCED TABLE */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl"
      >
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <th className="p-5 w-1/3 md:w-[412px] text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="p-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Result
              </th>
            </tr>
          </thead>
          {predictionList.length > 0 ? (
            <motion.tbody
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {predictionList.map((item: any, idx: number) => (
                <AdvancedRow key={idx} item={item} />
              ))}
            </motion.tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan={2} className="p-12 text-center">
                  <Iconify
                    icon="solar:document-text-bold-duotone"
                    width={40}
                    className="text-gray-300 dark:text-gray-600 mx-auto mb-3"
                  />
                  <p className="text-gray-500 dark:text-gray-400">
                    No advanced details available.
                  </p>
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </motion.div>
    </div>
  );
};

// Sub-component for a table row
const AdvancedRow = ({ item }: { item: any }) => {
  const name = item.Name || "Unknown";
  const Description = item.Description || "Unknown";
  const resultText = item.Info || "";
  const status = item.Nature || "Neutral";
  const maleInfo = item.MaleInfo;
  const femaleInfo = item.FemaleInfo;

  const getStatusConfig = (s: string) => {
    const lower = String(s).toLowerCase();
    if (lower === "good" || lower === "pass" || lower === "excellent") {
      return {
        color: "#22C55E",
        bg: "bg-green-50 dark:bg-green-900/20",
        icon: "solar:check-circle-bold",
        gradient: "from-green-400 to-emerald-500",
      };
    }
    if (lower === "bad" || lower === "fail" || lower === "poor") {
      return {
        color: "#EF4444",
        bg: "bg-red-50 dark:bg-red-900/20",
        icon: "solar:close-circle-bold",
        gradient: "from-red-400 to-rose-500",
      };
    }
    return {
      color: "#F59E0B",
      bg: "bg-amber-50 dark:bg-amber-900/20",
      icon: "solar:minus-circle-bold",
      gradient: "from-amber-400 to-orange-500",
    };
  };

  const config = getStatusConfig(status);

  return (
    <motion.tr
      variants={itemVariants}
      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
    >
      {/* Name Column */}
      <td className="p-5 align-top">
        <div className="flex items-start gap-3">
          <div
            className={`w-9 h-9 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5`}
          >
            <Iconify icon={config.icon} width={16} className="text-white" />
          </div>
          <div>
            <b className="block text-lg md:text-xl text-gray-900 dark:text-white font-bold leading-tight mb-1">
              {name}
            </b>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {Description}
            </p>
          </div>
        </div>
      </td>

      {/* Result Column */}
      <td className="p-5 align-top">
        <div className="flex flex-col gap-2">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-base font-bold ${config.bg}`}
              style={{ color: config.color }}
            >
              <Iconify icon={config.icon} width={16} />
              {status}
            </span>
          </div>

          {/* Result Text */}
          {resultText && (
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {resultText}
            </p>
          )}

          {/* Male/Female Info */}
          {(maleInfo !== undefined || femaleInfo !== undefined) && (
            <div className="flex flex-wrap gap-2 mt-1">
              {maleInfo !== undefined && (
                <span className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                    <Iconify
                      icon="solar:men-bold"
                      width={12}
                      className="text-white"
                    />
                  </div>
                  <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                    M: {maleInfo}
                  </span>
                </span>
              )}
              {femaleInfo !== undefined && (
                <span className="inline-flex items-center gap-2 px-3 py-2 bg-pink-50 dark:bg-pink-900/20 rounded-xl border border-pink-200 dark:border-pink-800">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center">
                    <Iconify
                      icon="solar:women-bold"
                      width={12}
                      className="text-white"
                    />
                  </div>
                  <span className="text-xs font-medium text-pink-700 dark:text-pink-300">
                    F: {femaleInfo}
                  </span>
                </span>
              )}
            </div>
          )}
        </div>
      </td>
    </motion.tr>
  );
};

export default MatchResult;
