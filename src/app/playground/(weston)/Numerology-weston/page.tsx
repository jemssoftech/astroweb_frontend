"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Iconify from "@/src/components/Iconify";
import PersonSelector from "@/src/components/PersonSelector";
import { Person } from "@/src/lib/models";
import Swal from "sweetalert2";
import api from "@/src/lib/api";

// ============ CONSTANTS ============

const NUMBER_GRADIENTS: Record<number, string> = {
  1: "from-red-500 to-rose-600",
  2: "from-orange-500 to-amber-600",
  3: "from-yellow-500 to-amber-500",
  4: "from-green-500 to-emerald-600",
  5: "from-cyan-500 to-blue-600",
  6: "from-blue-500 to-indigo-600",
  7: "from-purple-500 to-violet-600",
  8: "from-pink-500 to-rose-600",
  9: "from-gray-500 to-slate-600",
};

const NUMBER_COLORS: Record<number, string> = {
  1: "#EF4444",
  2: "#F97316",
  3: "#FBBF24",
  4: "#22C55E",
  5: "#06B6D4",
  6: "#3B82F6",
  7: "#8B5CF6",
  8: "#EC4899",
  9: "#6B7280",
};

// ============ MAIN COMPONENT ============

function NumerologyPage() {
  // const [user, setUser] = useState(getUser());
  // useEffect(() => {
  //   setUser(getUser());
  // }, []);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");

  const saveResultToServer = useCallback(async (logData: any) => {
    try {
      await fetch("/api/save-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logData),
      });
    } catch (err) {
      console.error("Failed to save result:", err);
    }
  }, []);

  useEffect(() => {
    if (result) saveResultToServer(result);
  }, [result, saveResultToServer]);

  const handleCalculate = async () => {
    if (!selectedPerson) {
      Swal.fire({
        icon: "warning",
        title: "Select Person",
        text: "Please select a person to generate the report.",
        background: "#1e293b",
        color: "#f1f5f9",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const birthDate = new Date(selectedPerson.BirthTime);
      const requestBody = {
        day: birthDate.getDate(),
        month: birthDate.getMonth() + 1,
        year: birthDate.getFullYear(),
        name: selectedPerson.Name,
      };

      const response: any = await api.post(
        "/api/mainapi/indian-numerology",
        requestBody,
      );

      const data = response?.data;

      if (data && (data.status === "Pass" || data.success)) {
        setResult(data);
      } else {
        throw new Error(
          data?.message || response?.error || "No data received from server",
        );
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Something went wrong!",
        background: "#1e293b",
        color: "#f1f5f9",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTable = () => result?.data?.numero_table || null;
  const getReport = () => result?.data?.numero_report || null;
  const getFavTime = () => result?.data?.numero_fav_time || null;
  const getVastu = () => result?.data?.numero_place_vastu || null;
  const getFasts = () => result?.data?.numero_fasts_report || null;
  const getFavLord = () => result?.data?.numero_fav_lord || null;
  const getFavMantra = () => result?.data?.numero_fav_mantra || null;
  const getDailyPrediction = () =>
    result?.data?.numero_daily_prediction || null;

  const tabs = [
    { key: "overview", label: "Overview", icon: "solar:home-2-bold-duotone" },
    { key: "report", label: "About You", icon: "solar:user-bold-duotone" },
    {
      key: "remedies",
      label: "Remedies",
      icon: "solar:hand-heart-bold-duotone",
    },
    {
      key: "prediction",
      label: "Daily",
      icon: "solar:crystal-ball-bold-duotone",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-linear-to-r from-violet-600 via-purple-600 to-indigo-700 rounded-2xl p-6 md:p-8 text-white shadow-xl"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>
          <div className="absolute top-4 right-8 opacity-20">
            <Iconify
              icon="solar:hashtag-circle-bold"
              width={100}
              height={100}
            />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Iconify
                  icon="solar:calculator-bold-duotone"
                  width={40}
                  height={40}
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium">
                    Number Science
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Numerology Analysis
                </h1>
                <p className="text-white/80 mt-1">
                  Discover your destiny through the power of numbers
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Layout */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Person Selector */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-2xl border border-border shadow-sm p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Iconify
                    icon="solar:user-check-bold-duotone"
                    width={24}
                    height={24}
                    className="text-primary"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Select Person
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Choose a profile
                  </p>
                </div>
              </div>

              <PersonSelector onPersonSelected={setSelectedPerson} />

              {selectedPerson && (
                <div className="mt-4 p-4 bg-primary/5 rounded-xl border border-primary/10 space-y-2">
                  <div className="flex items-center gap-2">
                    <Iconify
                      icon="solar:user-bold"
                      width={16}
                      height={16}
                      className="text-muted-foreground"
                    />
                    <span className="text-sm font-medium text-foreground">
                      {selectedPerson.Name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Iconify
                      icon="solar:calendar-bold"
                      width={16}
                      height={16}
                      className="text-muted-foreground"
                    />
                    <span className="text-sm text-muted-foreground">
                      {new Date(selectedPerson.BirthTime).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={handleCalculate}
                disabled={loading || !selectedPerson}
                className="mt-6 w-full py-3.5 px-4 bg-linear-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/25 hover:-translate-y-0.5"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Iconify
                      icon="solar:calculator-bold-duotone"
                      width={20}
                      height={20}
                    />
                    Calculate Numbers
                  </>
                )}
              </button>
            </motion.div>

            {/* Quick Summary (when data loaded) */}
            {result && getTable() && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-linear-to-br from-violet-600 via-purple-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-white/20 rounded-xl">
                      <Iconify
                        icon="solar:star-bold-duotone"
                        width={24}
                        height={24}
                      />
                    </div>
                    <h3 className="font-semibold">Quick Numbers</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: "Destiny", value: getTable().destiny_number },
                      { label: "Radical", value: getTable().radical_number },
                      { label: "Name", value: getTable().name_number },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between p-3 bg-white/10 rounded-xl"
                      >
                        <span className="text-sm text-white/80">
                          {item.label}
                        </span>
                        <span
                          className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-lg bg-white"
                          style={{
                            color: NUMBER_COLORS[item.value] || "#6B7280",
                          }}
                        >
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Tab Navigation */}
                  <div className="bg-card rounded-2xl border border-border shadow-sm p-2">
                    <div className="flex gap-2 overflow-x-auto">
                      {tabs.map((tab) => (
                        <button
                          key={tab.key}
                          onClick={() => setActiveTab(tab.key)}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                            activeTab === tab.key
                              ? "bg-primary text-white shadow-lg shadow-primary/25"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          <Iconify icon={tab.icon} width={18} height={18} />
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tab Content */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.25 }}
                    >
                      {/* ======== OVERVIEW TAB ======== */}
                      {activeTab === "overview" && getTable() && (
                        <div className="space-y-6">
                          {/* Core Numbers */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                              {
                                label: "Destiny Number",
                                number: getTable().destiny_number,
                                sub: "Life Purpose",
                              },
                              {
                                label: "Radical Number",
                                number: getTable().radical_number,
                                sub: `Ruler: ${getTable().radical_ruler}`,
                              },
                              {
                                label: "Name Number",
                                number: getTable().name_number,
                                sub: "Expression",
                              },
                            ].map((item, idx) => (
                              <motion.div
                                key={item.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`relative overflow-hidden bg-linear-to-br ${NUMBER_GRADIENTS[item.number] || "from-gray-500 to-slate-600"} rounded-2xl p-6 text-white shadow-lg text-center`}
                              >
                                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                                <p className="text-white/70 text-xs uppercase tracking-wide mb-3">
                                  {item.label}
                                </p>
                                <p className="text-6xl font-bold mb-2">
                                  {item.number}
                                </p>
                                <p className="text-white/80 text-sm">
                                  {item.sub}
                                </p>
                              </motion.div>
                            ))}
                          </div>

                          {/* Number Compatibility */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
                              <div className="flex items-center gap-2 mb-4">
                                <div className="p-1.5 bg-green-500/10 rounded-lg">
                                  <Iconify
                                    icon="solar:users-group-rounded-bold-duotone"
                                    width={20}
                                    height={20}
                                    className="text-green-500"
                                  />
                                </div>
                                <h4 className="font-semibold text-foreground">
                                  Friendly Numbers
                                </h4>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {getTable()
                                  .friendly_num?.split(",")
                                  .map((num: string) => (
                                    <span
                                      key={num}
                                      className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm"
                                      style={{
                                        backgroundColor: `${NUMBER_COLORS[parseInt(num.trim())] || "#6B7280"}20`,
                                        color:
                                          NUMBER_COLORS[parseInt(num.trim())] ||
                                          "#6B7280",
                                      }}
                                    >
                                      {num.trim()}
                                    </span>
                                  ))}
                              </div>
                            </div>

                            <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
                              <div className="flex items-center gap-2 mb-4">
                                <div className="p-1.5 bg-amber-500/10 rounded-lg">
                                  <Iconify
                                    icon="solar:minus-circle-bold-duotone"
                                    width={20}
                                    height={20}
                                    className="text-amber-500"
                                  />
                                </div>
                                <h4 className="font-semibold text-foreground">
                                  Neutral Numbers
                                </h4>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {getTable()
                                  .neutral_num?.split(",")
                                  .map((num: string) => (
                                    <span
                                      key={num}
                                      className="w-9 h-9 rounded-xl bg-muted text-foreground/70 flex items-center justify-center font-bold text-sm"
                                    >
                                      {num.trim()}
                                    </span>
                                  ))}
                              </div>
                            </div>

                            <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
                              <div className="flex items-center gap-2 mb-4">
                                <div className="p-1.5 bg-red-500/10 rounded-lg">
                                  <Iconify
                                    icon="solar:close-circle-bold-duotone"
                                    width={20}
                                    height={20}
                                    className="text-red-500"
                                  />
                                </div>
                                <h4 className="font-semibold text-foreground">
                                  Evil Numbers
                                </h4>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {getTable()
                                  .evil_num?.split(",")
                                  .map((num: string) => (
                                    <span
                                      key={num}
                                      className="w-9 h-9 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center font-bold text-sm"
                                    >
                                      {num.trim()}
                                    </span>
                                  ))}
                              </div>
                            </div>
                          </div>

                          {/* Favourites Grid */}
                          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                            <div className="bg-linear-to-r from-amber-500 to-orange-600 px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-xl">
                                  <Iconify
                                    icon="solar:star-bold-duotone"
                                    width={24}
                                    height={24}
                                    className="text-white"
                                  />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-white text-lg">
                                    Your Favourites
                                  </h3>
                                  <p className="text-white/70 text-sm">
                                    Lucky elements for your number
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                              {[
                                {
                                  icon: "solar:palette-bold-duotone",
                                  label: "Colour",
                                  value: getTable().fav_color,
                                  hasColor: true,
                                },
                                {
                                  icon: "solar:calendar-mark-bold-duotone",
                                  label: "Days",
                                  value: getTable().fav_day,
                                },
                                {
                                  icon: "solar:gem-bold-duotone",
                                  label: "Stone",
                                  value: `${getTable().fav_stone}${getTable().fav_substone ? ` (${getTable().fav_substone})` : ""}`,
                                },
                                {
                                  icon: "solar:settings-bold-duotone",
                                  label: "Metal",
                                  value: getTable().fav_metal,
                                },
                                {
                                  icon: "solar:user-speak-bold-duotone",
                                  label: "God",
                                  value: getTable().fav_god,
                                },
                                {
                                  icon: "solar:soundwave-bold-duotone",
                                  label: "Mantra",
                                  value: getTable().fav_mantra,
                                  isMantra: true,
                                },
                              ].map((item, idx) => (
                                <div
                                  key={idx}
                                  className="p-4 bg-muted/50 rounded-xl"
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <Iconify
                                      icon={item.icon}
                                      width={18}
                                      height={18}
                                      className="text-muted-foreground"
                                    />
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                                      {item.label}
                                    </p>
                                  </div>
                                  {item.hasColor ? (
                                    <div className="flex items-center gap-2">
                                      <span
                                        className="w-4 h-4 rounded-full border border-border"
                                        style={{
                                          backgroundColor:
                                            item.value?.toLowerCase(),
                                        }}
                                      />
                                      <p className="font-semibold text-foreground">
                                        {item.value}
                                      </p>
                                    </div>
                                  ) : item.isMantra ? (
                                    <p className="font-semibold text-amber-600 dark:text-amber-400 italic text-sm">
                                      {item.value}
                                    </p>
                                  ) : (
                                    <p className="font-semibold text-foreground text-sm">
                                      {item.value}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Personal Info */}
                          <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                              {[
                                {
                                  label: "Name",
                                  value: getTable().name,
                                  icon: "solar:user-bold-duotone",
                                },
                                {
                                  label: "Birth Date",
                                  value: getTable().date,
                                  icon: "solar:calendar-bold-duotone",
                                },
                                {
                                  label: "Radical Ruler",
                                  value: getTable().radical_ruler,
                                  icon: "solar:planet-bold-duotone",
                                },
                                {
                                  label: "Radical Number",
                                  value: getTable().radical_num,
                                  icon: "solar:hashtag-bold-duotone",
                                },
                              ].map((item) => (
                                <div key={item.label}>
                                  <div className="flex items-center gap-2 mb-1">
                                    <Iconify
                                      icon={item.icon}
                                      width={16}
                                      height={16}
                                      className="text-muted-foreground"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                      {item.label}
                                    </p>
                                  </div>
                                  <p className="font-semibold text-foreground capitalize">
                                    {item.value}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ======== REPORT TAB ======== */}
                      {activeTab === "report" && (
                        <div className="space-y-6">
                          {getReport() && (
                            <ModernReportCard
                              title={getReport().title}
                              description={getReport().description}
                              icon="solar:user-speak-bold-duotone"
                              gradient="from-blue-500 to-indigo-600"
                            />
                          )}
                          {getFavTime() && (
                            <ModernReportCard
                              title={getFavTime().title}
                              description={getFavTime().description}
                              icon="solar:clock-circle-bold-duotone"
                              gradient="from-emerald-500 to-teal-600"
                            />
                          )}
                          {getVastu() && (
                            <ModernReportCard
                              title={getVastu().title}
                              description={getVastu().description}
                              icon="solar:home-smile-bold-duotone"
                              gradient="from-purple-500 to-violet-600"
                            />
                          )}
                        </div>
                      )}

                      {/* ======== REMEDIES TAB ======== */}
                      {activeTab === "remedies" && (
                        <div className="space-y-6">
                          {getFasts() && (
                            <ModernReportCard
                              title={getFasts().title}
                              description={getFasts().description}
                              icon="solar:moon-sleep-bold-duotone"
                              gradient="from-amber-500 to-orange-600"
                            />
                          )}
                          {getFavLord() && (
                            <ModernReportCard
                              title={getFavLord().title}
                              description={getFavLord().description}
                              icon="solar:user-speak-bold-duotone"
                              gradient="from-red-500 to-rose-600"
                            />
                          )}
                          {getFavMantra() && (
                            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                              <div className="bg-linear-to-r from-pink-500 to-violet-600 px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-white/20 rounded-xl">
                                    <Iconify
                                      icon="solar:soundwave-bold-duotone"
                                      width={24}
                                      height={24}
                                      className="text-white"
                                    />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-white text-lg">
                                      {getFavMantra().title}
                                    </h3>
                                    <p className="text-white/70 text-sm">
                                      Sacred sound vibrations
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="p-6 space-y-4">
                                <p className="text-foreground/80 leading-relaxed">
                                  {getFavMantra().description}
                                </p>
                                <div className="bg-linear-to-r from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/10 rounded-xl p-5 border border-amber-200/50 dark:border-amber-500/20 text-center">
                                  <p className="text-amber-800 dark:text-amber-300 font-semibold italic text-xl">
                                    {getTable()?.fav_mantra}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* ======== DAILY PREDICTION TAB ======== */}
                      {activeTab === "prediction" && getDailyPrediction() && (
                        <div className="space-y-6">
                          {/* Date & Lucky Info */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div
                              className={`relative overflow-hidden bg-linear-to-br ${NUMBER_GRADIENTS[parseInt(getDailyPrediction().lucky_number)] || "from-gray-500 to-slate-600"} rounded-2xl p-5 text-white shadow-lg text-center`}
                            >
                              <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                              <p className="text-white/70 text-xs uppercase tracking-wide mb-2">
                                Lucky Number
                              </p>
                              <p className="text-5xl font-bold">
                                {getDailyPrediction().lucky_number}
                              </p>
                            </div>

                            <div className="bg-card rounded-2xl border border-border shadow-sm p-5 text-center">
                              <Iconify
                                icon="solar:palette-bold-duotone"
                                width={32}
                                height={32}
                                className="mx-auto mb-2 text-primary"
                              />
                              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                                Lucky Color
                              </p>
                              <p className="text-xl font-bold text-foreground">
                                {getDailyPrediction().lucky_color}
                              </p>
                            </div>

                            <div className="bg-card rounded-2xl border border-border shadow-sm p-5 text-center">
                              <Iconify
                                icon="solar:calendar-bold-duotone"
                                width={32}
                                height={32}
                                className="mx-auto mb-2 text-primary"
                              />
                              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                                Prediction Date
                              </p>
                              <p className="font-bold text-foreground">
                                {getDailyPrediction().prediction_date}
                              </p>
                            </div>
                          </div>

                          {/* Main Prediction */}
                          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-xl">
                                  <Iconify
                                    icon="solar:crystal-ball-bold-duotone"
                                    width={24}
                                    height={24}
                                    className="text-white"
                                  />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-white text-lg">
                                    Today's Forecast
                                  </h3>
                                  <p className="text-white/70 text-sm">
                                    Numerological guidance for today
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="p-6">
                              <p className="text-foreground/80 leading-relaxed">
                                {getDailyPrediction().prediction}
                              </p>
                            </div>
                          </div>

                          {/* Dos & Don'ts */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                              <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-white/20 rounded-xl">
                                    <Iconify
                                      icon="solar:check-circle-bold-duotone"
                                      width={24}
                                      height={24}
                                      className="text-white"
                                    />
                                  </div>
                                  <h3 className="font-semibold text-white">
                                    Do's
                                  </h3>
                                </div>
                              </div>
                              <div className="p-6 space-y-3">
                                {[
                                  `Wear ${getDailyPrediction().lucky_color} color`,
                                  `Focus on number ${getDailyPrediction().lucky_number} activities`,
                                  "Start new ventures today",
                                ].map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-3 p-3 bg-green-500/5 rounded-xl"
                                  >
                                    <Iconify
                                      icon="solar:check-circle-bold"
                                      width={18}
                                      height={18}
                                      className="text-green-500 flex-shrink-0"
                                    />
                                    <p className="text-sm text-foreground/80">
                                      {item}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                              <div className="bg-gradient-to-r from-red-500 to-rose-600 px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-white/20 rounded-xl">
                                    <Iconify
                                      icon="solar:close-circle-bold-duotone"
                                      width={24}
                                      height={24}
                                      className="text-white"
                                    />
                                  </div>
                                  <h3 className="font-semibold text-white">
                                    Don'ts
                                  </h3>
                                </div>
                              </div>
                              <div className="p-6 space-y-3">
                                {[
                                  `Avoid numbers: ${getTable()?.evil_num}`,
                                  "Don't rush important decisions",
                                  "Avoid unnecessary conflicts",
                                ].map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-3 p-3 bg-red-500/5 rounded-xl"
                                  >
                                    <Iconify
                                      icon="solar:close-circle-bold"
                                      width={18}
                                      height={18}
                                      className="text-muted-foreground shrink-0"
                                    />
                                    <p className="text-sm text-foreground/80">
                                      {item}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="bg-card rounded-2xl border border-dashed border-border shadow-sm p-12 flex flex-col items-center justify-center min-h-[500px]">
                    <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                      <Iconify
                        icon="solar:calculator-bold-duotone"
                        width={48}
                        height={48}
                        className="text-muted-foreground/50"
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      No Analysis Generated
                    </h3>
                    <p className="text-muted-foreground text-center max-w-md mb-8">
                      Select a person and click "Calculate Numbers" to generate
                      a detailed numerology report.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
                      {[
                        {
                          icon: "solar:home-2-bold-duotone",
                          label: "Overview",
                          color: "text-violet-500",
                          bg: "bg-violet-500/10",
                        },
                        {
                          icon: "solar:user-bold-duotone",
                          label: "About You",
                          color: "text-blue-500",
                          bg: "bg-blue-500/10",
                        },
                        {
                          icon: "solar:hand-heart-bold-duotone",
                          label: "Remedies",
                          color: "text-emerald-500",
                          bg: "bg-emerald-500/10",
                        },
                        {
                          icon: "solar:crystal-ball-bold-duotone",
                          label: "Daily",
                          color: "text-amber-500",
                          bg: "bg-amber-500/10",
                        },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className={`flex flex-col items-center gap-2 p-4 ${item.bg} rounded-xl`}
                        >
                          <Iconify
                            icon={item.icon}
                            width={32}
                            height={32}
                            className={item.color}
                          />
                          <span className="text-xs text-foreground font-medium">
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ SUB COMPONENTS ============

function ModernReportCard({
  title,
  description,
  icon,
  gradient,
}: {
  title: string;
  description: string;
  icon: string;
  gradient: string;
}) {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
      <div className={`bg-gradient-to-r ${gradient} px-6 py-4`}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl">
            <Iconify
              icon={icon}
              width={24}
              height={24}
              className="text-white"
            />
          </div>
          <h3 className="font-semibold text-white text-lg">{title}</h3>
        </div>
      </div>
      <div className="p-6">
        <p className="text-foreground/80 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export default NumerologyPage;
