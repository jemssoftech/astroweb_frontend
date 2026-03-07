"use client";

import React, { useState, useEffect, useCallback } from "react";
import Iconify from "@/src/components/Iconify";
import PersonSelector from "@/src/components/PersonSelector";
import PageHeader from "@/src/components/PageHeader";
import { Person } from "@/src/lib/models";
import Swal from "sweetalert2";
import Button from "@/src/components/ui/Button";
import api from "@/src/lib/api";
import { motion, AnimatePresence } from "framer-motion";

// ============ CONSTANTS ============

const ZODIAC_SIGNS: Record<
  string,
  { symbol: string; color: string; gradient: string }
> = {
  Aries: {
    symbol: "♈",
    color: "#EF4444",
    gradient: "from-red-500 to-orange-500",
  },
  Taurus: {
    symbol: "♉",
    color: "#84CC16",
    gradient: "from-lime-500 to-green-500",
  },
  Gemini: {
    symbol: "♊",
    color: "#FBBF24",
    gradient: "from-yellow-400 to-amber-500",
  },
  Cancer: {
    symbol: "♋",
    color: "#3B82F6",
    gradient: "from-blue-400 to-cyan-500",
  },
  Leo: {
    symbol: "♌",
    color: "#F97316",
    gradient: "from-orange-500 to-yellow-500",
  },
  Virgo: {
    symbol: "♍",
    color: "#22C55E",
    gradient: "from-green-500 to-emerald-500",
  },
  Libra: {
    symbol: "♎",
    color: "#EC4899",
    gradient: "from-pink-500 to-rose-500",
  },
  Scorpio: {
    symbol: "♏",
    color: "#7C3AED",
    gradient: "from-violet-600 to-purple-600",
  },
  Sagittarius: {
    symbol: "♐",
    color: "#8B5CF6",
    gradient: "from-purple-500 to-indigo-500",
  },
  Capricorn: {
    symbol: "♑",
    color: "#6B7280",
    gradient: "from-gray-500 to-slate-600",
  },
  Aquarius: {
    symbol: "♒",
    color: "#06B6D4",
    gradient: "from-cyan-500 to-teal-500",
  },
  Pisces: {
    symbol: "♓",
    color: "#14B8A6",
    gradient: "from-teal-500 to-emerald-500",
  },
};

const PLANETS_CONFIG: Record<
  string,
  { symbol: string; color: string; bgColor: string }
> = {
  Sun: {
    symbol: "☉",
    color: "#F59E0B",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
  },
  Moon: {
    symbol: "☽",
    color: "#6B7280",
    bgColor: "bg-gray-100 dark:bg-gray-800/50",
  },
  Mars: {
    symbol: "♂",
    color: "#EF4444",
    bgColor: "bg-red-100 dark:bg-red-900/30",
  },
  Mercury: {
    symbol: "☿",
    color: "#10B981",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  Jupiter: {
    symbol: "♃",
    color: "#F97316",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
  },
  Venus: {
    symbol: "♀",
    color: "#EC4899",
    bgColor: "bg-pink-100 dark:bg-pink-900/30",
  },
  Saturn: {
    symbol: "♄",
    color: "#8B5CF6",
    bgColor: "bg-violet-100 dark:bg-violet-900/30",
  },
  Uranus: {
    symbol: "⛢",
    color: "#06B6D4",
    bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
  },
  Neptune: {
    symbol: "♆",
    color: "#3B82F6",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
  },
  Pluto: {
    symbol: "♇",
    color: "#78716C",
    bgColor: "bg-stone-100 dark:bg-stone-800/50",
  },
  "North Node": {
    symbol: "☊",
    color: "#84CC16",
    bgColor: "bg-lime-100 dark:bg-lime-900/30",
  },
  Ascendant: {
    symbol: "AC",
    color: "#DC2626",
    bgColor: "bg-red-100 dark:bg-red-900/30",
  },
};

const ASPECT_CONFIG: Record<
  string,
  { symbol: string; color: string; nature: string; bgColor: string }
> = {
  Conjunction: {
    symbol: "☌",
    color: "#EF4444",
    nature: "major",
    bgColor: "bg-red-50 dark:bg-red-900/20",
  },
  Opposition: {
    symbol: "☍",
    color: "#3B82F6",
    nature: "challenging",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
  },
  Trine: {
    symbol: "△",
    color: "#22C55E",
    nature: "harmonious",
    bgColor: "bg-green-50 dark:bg-green-900/20",
  },
  Square: {
    symbol: "□",
    color: "#F97316",
    nature: "challenging",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
  },
  Sextile: {
    symbol: "⚹",
    color: "#8B5CF6",
    nature: "harmonious",
    bgColor: "bg-violet-50 dark:bg-violet-900/20",
  },
  Quincunx: {
    symbol: "⚻",
    color: "#6B7280",
    nature: "minor",
    bgColor: "bg-gray-50 dark:bg-gray-800/50",
  },
};

const TABS = [
  {
    key: "overview",
    label: "Overview",
    icon: "solar:widget-bold-duotone",
    color: "from-indigo-500 to-purple-500",
  },
  {
    key: "daily",
    label: "Daily",
    icon: "solar:calendar-bold-duotone",
    color: "from-blue-500 to-cyan-500",
  },
  {
    key: "weekly",
    label: "Weekly",
    icon: "solar:calendar-minimalistic-bold-duotone",
    color: "from-emerald-500 to-teal-500",
  },
  {
    key: "monthly",
    label: "Monthly",
    icon: "solar:calendar-bold-duotone",
    color: "from-orange-500 to-amber-500",
  },
  {
    key: "forecast",
    label: "Life Forecast",
    icon: "solar:stars-bold-duotone",
    color: "from-purple-500 to-pink-500",
  },
];

// ============ ANIMATIONS ============

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const tabContentVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

// ============ MAIN COMPONENT ============

function TransitsPage() {
  // const [user, setUser] = useState(getUser());
  // useEffect(() => {
  //   setUser(getUser());
  // }, []);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Function to save log to server
  const saveResultToServer = useCallback(async (logData: any) => {
    try {
      await fetch("/api/save-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logData),
      });
      console.log("✅ Result saved to server logs");
    } catch (err) {
      console.error("❌ Failed to save result to server logs:", err);
    }
  }, []);

  useEffect(() => {
    if (result) {
      saveResultToServer(result);
    }
  }, [result, saveResultToServer]);

  const handleCalculate = async () => {
    if (!selectedPerson) {
      Swal.fire({
        icon: "warning",
        title: "Select Person",
        text: "Please select a person to generate transit reports.",
        background: "#1f2937",
        color: "#f3f4f6",
        confirmButtonColor: "#6366f1",
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
        hour: birthDate.getHours(),
        min: birthDate.getMinutes(),
        lat: selectedPerson.Latitude,
        lon: selectedPerson.Longitude,
        tzone: parseFloat(selectedPerson.TimezoneOffset || "5.5"),
        house_type: "placidus",
      };

      const response: any = await api.post(
        "/api/mainapi/transits",
        requestBody,
      );

      if (response && response.status === 200 && response.data?.success) {
        setResult(response.data);
      } else {
        throw new Error(
          response?.data?.message ||
            response?.error ||
            "Failed to fetch transit data",
        );
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Something went wrong!",
        background: "#1f2937",
        color: "#f3f4f6",
        confirmButtonColor: "#6366f1",
      });
    } finally {
      setLoading(false);
    }
  };

  // Data helpers
  const getMonthly = () => result?.data?.monthly?.data || null;
  const getWeekly = () => result?.data?.weekly?.data || null;
  const getDaily = () => result?.data?.daily?.data || null;
  const getLifeForecast = () =>
    result?.data?.life_forecast?.data?.life_forecast || [];
  const getNatalDaily = () => result?.data?.natal_daily?.data || null;
  const getNatalWeekly = () => result?.data?.natal_weekly?.data || null;

  // Stats calculation
  const getStats = () => {
    const daily = getDaily();
    const monthly = getMonthly();
    return {
      totalTransits: daily?.transit_relation?.length || 0,
      monthlyTransits: monthly?.transit_relation?.length || 0,
      activePlanets: daily?.transit_house?.length || 0,
      moonPhases: monthly?.moon_phase?.length || 0,
    };
  };

  const stats = result ? getStats() : null;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 ">
        {/* Header Section */}

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden bg-linear-to-r from-indigo-700 via-purple-700 to-pink-700 rounded-2xl p-6 md:p-8 text-white shadow-xl mb-8"
        >
          {/* Glow Background Shapes */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>

          {/* Watermark Icon */}
          <div className="absolute top-4 right-8 opacity-20">
            <Iconify
              icon="solar:planet-3-bold-duotone"
              width={110}
              height={110}
            />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Iconify
                  icon="solar:planet-3-bold-duotone"
                  width={40}
                  height={40}
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium">
                    Astrology Dashboard
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold">
                  Transit Reports
                </h1>

                <p className="text-white/80 mt-1 max-w-xl">
                  Discover current planetary transits affecting your natal chart
                  and understand cosmic influences in your life.
                </p>
              </div>
            </div>

            {/* Date Badge */}
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/20">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Iconify icon="solar:moon-stars-bold" width={20} height={20} />
              </div>
              <div>
                <p className="font-semibold">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                  })}
                </p>
                <p className="text-sm text-white/70">
                  {new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
        {/* Input Section */}
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
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
                <div className="mt-4 p-4 bg-primary/5 rounded-xl border border-primary/10 space-y-2 text-sm">
                  {[
                    { icon: "solar:user-bold", value: selectedPerson.Name },
                    {
                      icon: "solar:calendar-bold",
                      value: new Date(
                        selectedPerson.BirthTime,
                      ).toLocaleDateString(),
                    },
                    {
                      icon: "solar:clock-circle-bold",
                      value: new Date(
                        selectedPerson.BirthTime,
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      }),
                    },
                    {
                      icon: "solar:map-point-bold",
                      value: selectedPerson.BirthLocation,
                      truncate: true,
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Iconify
                        icon={item.icon}
                        width={14}
                        height={14}
                        className="text-muted-foreground shrink-0"
                      />
                      <span
                        className={`text-foreground/80 ${item.truncate ? "truncate" : ""}`}
                      >
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={handleCalculate}
                disabled={loading || !selectedPerson}
                className="mt-6 w-full py-3.5 px-4 bg-primary text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Iconify
                      icon="solar:chart-2-bold-duotone"
                      width={20}
                      height={20}
                    />
                    Generate Report
                  </>
                )}
              </button>
            </motion.div>
          </div>

          {/* Loading State */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-2xl max-w-sm w-full mx-4"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 rounded-full border-4 border-indigo-100 dark:border-indigo-900 flex items-center justify-center">
                        <Iconify
                          icon="solar:planet-3-bold-duotone"
                          width={40}
                          className="text-indigo-500 animate-pulse"
                        />
                      </div>
                      <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Calculating Transits
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Analyzing planetary positions and aspects...
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="lg:col-span-3 space-y-6">
            {/* Results */}
            <AnimatePresence mode="wait">
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Stats Cards */}
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4"
                  >
                    <StatsCard
                      icon="solar:chart-bold-duotone"
                      label="Today's Transits"
                      value={stats?.totalTransits || 0}
                      color="from-blue-500 to-cyan-500"
                    />
                    <StatsCard
                      icon="solar:calendar-bold-duotone"
                      label="Monthly Transits"
                      value={stats?.monthlyTransits || 0}
                      color="from-purple-500 to-pink-500"
                    />
                    <StatsCard
                      icon="solar:planet-bold-duotone"
                      label="Active Planets"
                      value={stats?.activePlanets || 0}
                      color="from-amber-500 to-orange-500"
                    />
                    <StatsCard
                      icon="solar:moon-bold-duotone"
                      label="Moon Phases"
                      value={stats?.moonPhases || 0}
                      color="from-indigo-500 to-violet-500"
                    />
                  </motion.div>

                  {/* Tabs */}
                  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none overflow-hidden">
                    {/* Tab Navigation */}
                    <div className="border-b border-gray-200 dark:border-gray-800">
                      <div className="flex overflow-x-auto scrollbar-hide">
                        {TABS.map((tab) => (
                          <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`relative flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-all ${
                              activeTab === tab.key
                                ? "text-indigo-600 dark:text-indigo-400"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                            }`}
                          >
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                activeTab === tab.key
                                  ? `bg-linear-to-br ${tab.color} text-white`
                                  : "bg-gray-100 dark:bg-gray-800"
                              }`}
                            >
                              <Iconify icon={tab.icon} width={18} />
                            </div>
                            <span>{tab.label}</span>
                            {activeTab === tab.key && (
                              <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-indigo-500 to-purple-500"
                              />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeTab}
                          variants={tabContentVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          {/* ============ OVERVIEW TAB ============ */}
                          {activeTab === "overview" && (
                            <div className="space-y-8">
                              {/* Quick Stats Grid */}
                              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {getMonthly()?.ascendant && (
                                  <QuickInfoCard
                                    label="Ascendant"
                                    value={getMonthly().ascendant}
                                    icon="solar:arrow-up-bold"
                                    gradient="from-rose-500 to-pink-500"
                                  />
                                )}
                                {getMonthly()?.month_start_date && (
                                  <QuickInfoCard
                                    label="Month Start"
                                    value={getMonthly().month_start_date}
                                    icon="solar:calendar-mark-bold"
                                    gradient="from-blue-500 to-cyan-500"
                                  />
                                )}
                                {getMonthly()?.month_end_date && (
                                  <QuickInfoCard
                                    label="Month End"
                                    value={getMonthly().month_end_date}
                                    icon="solar:calendar-bold"
                                    gradient="from-purple-500 to-violet-500"
                                  />
                                )}
                                {getDaily()?.transit_date && (
                                  <QuickInfoCard
                                    label="Today"
                                    value={getDaily().transit_date}
                                    icon="solar:sun-bold"
                                    gradient="from-amber-500 to-orange-500"
                                  />
                                )}
                              </div>

                              {/* Moon Phases Section */}
                              {getMonthly()?.moon_phase &&
                                getMonthly().moon_phase.length > 0 && (
                                  <Section
                                    title="Moon Phases"
                                    icon="solar:moon-stars-bold-duotone"
                                  >
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                      {getMonthly().moon_phase.map(
                                        (phase: any, idx: number) => (
                                          <MoonPhaseCard
                                            key={idx}
                                            phase={phase}
                                          />
                                        ),
                                      )}
                                    </div>
                                  </Section>
                                )}

                              {/* Transit Houses */}
                              {getDaily()?.transit_house && (
                                <Section
                                  title="Current Planet Positions"
                                  icon="solar:planet-3-bold-duotone"
                                >
                                  <TransitHousesGrid
                                    houses={getDaily().transit_house}
                                  />
                                </Section>
                              )}

                              {/* Active Transits */}
                              {getDaily()?.transit_relation &&
                                getDaily().transit_relation.length > 0 && (
                                  <Section
                                    title="Today's Active Aspects"
                                    icon="solar:star-shine-bold-duotone"
                                  >
                                    <TransitRelationsGrid
                                      relations={getDaily().transit_relation.slice(
                                        0,
                                        8,
                                      )}
                                    />
                                  </Section>
                                )}
                            </div>
                          )}

                          {/* ============ DAILY TAB ============ */}
                          {activeTab === "daily" && (
                            <div className="space-y-8">
                              {/* Today Header */}
                              {getDaily()?.transit_date && (
                                <div className="bg-linear-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
                                  <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                                      <Iconify
                                        icon="solar:sun-2-bold-duotone"
                                        width={36}
                                      />
                                    </div>
                                    <div>
                                      <p className="text-white/70 text-sm">
                                        Transit Date
                                      </p>
                                      <h3 className="text-2xl font-bold">
                                        {getDaily().transit_date}
                                      </h3>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Transit Houses */}
                              {getDaily()?.transit_house && (
                                <Section
                                  title="Planets in Transit Houses"
                                  icon="solar:planet-bold-duotone"
                                >
                                  <TransitHousesTable
                                    houses={getDaily().transit_house}
                                  />
                                </Section>
                              )}

                              {/* Transit Relations */}
                              {getDaily()?.transit_relation && (
                                <Section
                                  title="Transit Aspects"
                                  icon="solar:stars-bold-duotone"
                                >
                                  <TransitRelationsTable
                                    relations={getDaily().transit_relation}
                                  />
                                </Section>
                              )}

                              {/* Natal Daily Transits */}
                              {getNatalDaily()?.transit_relation && (
                                <Section
                                  title="Detailed Natal Transits"
                                  icon="solar:document-text-bold-duotone"
                                >
                                  <NatalTransitsTable
                                    transits={getNatalDaily().transit_relation}
                                  />
                                </Section>
                              )}
                            </div>
                          )}

                          {/* ============ WEEKLY TAB ============ */}
                          {activeTab === "weekly" && (
                            <div className="space-y-8">
                              {/* Week Range Header */}
                              {getWeekly() && (
                                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white">
                                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                                    <div className="flex items-center gap-4">
                                      <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                                        <Iconify
                                          icon="solar:calendar-minimalistic-bold"
                                          width={28}
                                        />
                                      </div>
                                      <div>
                                        <p className="text-white/70 text-sm">
                                          Week Start
                                        </p>
                                        <p className="text-xl font-bold">
                                          {getWeekly().week_start_date}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="hidden md:block">
                                      <Iconify
                                        icon="solar:arrow-right-linear"
                                        width={24}
                                        className="text-white/50"
                                      />
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                                        <Iconify
                                          icon="solar:calendar-bold"
                                          width={28}
                                        />
                                      </div>
                                      <div>
                                        <p className="text-white/70 text-sm">
                                          Week End
                                        </p>
                                        <p className="text-xl font-bold">
                                          {getWeekly().week_end_date}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Weekly Transit Relations */}
                              {getWeekly()?.transit_relation && (
                                <Section
                                  title="This Week's Transits"
                                  icon="solar:chart-square-bold-duotone"
                                >
                                  <TransitRelationsTable
                                    relations={getWeekly().transit_relation}
                                    showDate
                                  />
                                </Section>
                              )}

                              {/* Natal Weekly Transits */}
                              {getNatalWeekly()?.transit_relation && (
                                <Section
                                  title="Weekly Natal Transits"
                                  icon="solar:document-text-bold-duotone"
                                >
                                  <NatalTransitsTable
                                    transits={getNatalWeekly().transit_relation}
                                  />
                                </Section>
                              )}
                            </div>
                          )}

                          {/* ============ MONTHLY TAB ============ */}
                          {activeTab === "monthly" && (
                            <div className="space-y-8">
                              {/* Month Range Header */}
                              {getMonthly() && (
                                <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-6 text-white">
                                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                                    <div className="flex items-center gap-4">
                                      <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                                        <Iconify
                                          icon="solar:calendar-minimalistic-bold"
                                          width={28}
                                        />
                                      </div>
                                      <div>
                                        <p className="text-white/70 text-sm">
                                          Month Start
                                        </p>
                                        <p className="text-xl font-bold">
                                          {getMonthly().month_start_date}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="hidden md:block">
                                      <Iconify
                                        icon="solar:arrow-right-linear"
                                        width={24}
                                        className="text-white/50"
                                      />
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                                        <Iconify
                                          icon="solar:calendar-bold"
                                          width={28}
                                        />
                                      </div>
                                      <div>
                                        <p className="text-white/70 text-sm">
                                          Month End
                                        </p>
                                        <p className="text-xl font-bold">
                                          {getMonthly().month_end_date}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Moon Phases */}
                              {getMonthly()?.moon_phase &&
                                getMonthly().moon_phase.length > 0 && (
                                  <Section
                                    title="Moon Phases"
                                    icon="solar:moon-bold-duotone"
                                  >
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                      {getMonthly().moon_phase.map(
                                        (phase: any, idx: number) => (
                                          <MoonPhaseCard
                                            key={idx}
                                            phase={phase}
                                          />
                                        ),
                                      )}
                                    </div>
                                  </Section>
                                )}

                              {/* Retrogrades */}
                              {getMonthly()?.retrogrades &&
                                getMonthly().retrogrades.length > 0 && (
                                  <Section
                                    title="Retrograde Planets"
                                    icon="solar:refresh-bold-duotone"
                                  >
                                    <div className="flex flex-wrap gap-3">
                                      {getMonthly().retrogrades.map(
                                        (retro: any, idx: number) => (
                                          <div
                                            key={idx}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
                                          >
                                            <span className="text-red-500 text-lg">
                                              ℞
                                            </span>
                                            <span className="font-medium text-red-700 dark:text-red-400">
                                              {retro.planet || retro}
                                            </span>
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  </Section>
                                )}

                              {/* Monthly Transit Relations */}
                              {getMonthly()?.transit_relation && (
                                <Section
                                  title={`Monthly Transits (${getMonthly().transit_relation.length})`}
                                  icon="solar:chart-bold-duotone"
                                >
                                  <TransitRelationsTable
                                    relations={getMonthly().transit_relation}
                                    showDate
                                  />
                                </Section>
                              )}
                            </div>
                          )}

                          {/* ============ FORECAST TAB ============ */}
                          {activeTab === "forecast" && (
                            <div className="space-y-6">
                              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                                <div className="flex items-center gap-3">
                                  <Iconify
                                    icon="solar:info-circle-bold"
                                    width={20}
                                    className="text-purple-500"
                                  />
                                  <p className="text-sm text-purple-700 dark:text-purple-300">
                                    Detailed interpretations of current transits
                                    affecting your natal chart.
                                  </p>
                                </div>
                              </div>

                              {getLifeForecast().length > 0 ? (
                                <div className="grid gap-4">
                                  {getLifeForecast().map(
                                    (item: any, idx: number) => (
                                      <ForecastCard
                                        key={idx}
                                        forecast={item}
                                        index={idx}
                                      />
                                    ),
                                  )}
                                </div>
                              ) : (
                                <EmptyState
                                  icon="solar:stars-bold-duotone"
                                  title="No Forecast Data"
                                  description="Life forecast data is not available for this profile."
                                />
                              )}
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty State */}
            {!result && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-12"
              >
                <div className="flex flex-col items-center text-center max-w-md mx-auto">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 flex items-center justify-center mb-6">
                    <Iconify
                      icon="solar:planet-3-bold-duotone"
                      width={48}
                      className="text-indigo-500"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No Transit Report Generated
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Select a profile from the dropdown above and click "Generate
                    Transit Report" to see current planetary transits affecting
                    your chart.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400">
                    <Iconify icon="solar:arrow-up-bold" width={16} />
                    <span>Start by selecting a profile above</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ SUB COMPONENTS ============

function StatsCard({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-lg shadow-gray-200/50 dark:shadow-none"
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg`}
        >
          <Iconify icon={icon} width={24} />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}

function QuickInfoCard({
  label,
  value,
  icon,
  gradient,
}: {
  label: string;
  value: string;
  icon: string;
  gradient: string;
}) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-white`}
        >
          <Iconify icon={icon} width={20} />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
          <p className="font-semibold text-gray-900 dark:text-white truncate">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
          <Iconify
            icon={icon}
            width={18}
            className="text-indigo-600 dark:text-indigo-400"
          />
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function MoonPhaseCard({ phase }: { phase: any }) {
  const getMoonIcon = (type: string) => {
    if (type.includes("Full")) return "solar:moon-bold";
    if (type.includes("New")) return "solar:moon-fog-bold";
    if (type.includes("First")) return "solar:moon-stars-bold";
    if (type.includes("Last")) return "solar:moon-sleep-bold";
    return "solar:moon-bold-duotone";
  };

  const zodiac = ZODIAC_SIGNS[phase.sign];

  return (
    <div className="bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-gray-800 dark:to-indigo-900/30 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
          <Iconify icon={getMoonIcon(phase.phase_type)} width={28} />
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">
            {phase.phase_type}
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
            <span>{new Date(phase.date).toLocaleDateString()}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <div className="flex items-center gap-1">
              <span style={{ color: zodiac?.color }} className="text-base">
                {zodiac?.symbol}
              </span>
              <span>{phase.sign}</span>
            </div>
          </div>
          {phase.house && (
            <span className="inline-block mt-2 px-2 py-0.5 bg-white dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-300">
              House {phase.house}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function TransitHousesGrid({ houses }: { houses: any[] }) {
  if (!houses || houses.length === 0) {
    return (
      <EmptyState
        icon="solar:planet-bold-duotone"
        title="No Data"
        description="No transit house data available."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {houses.map((item: any, idx: number) => {
        const planetConfig = PLANETS_CONFIG[item.planet];
        const zodiac = ZODIAC_SIGNS[item.natal_sign];

        return (
          <div
            key={idx}
            className={`${planetConfig?.bgColor || "bg-gray-50 dark:bg-gray-800"} rounded-xl p-4 border border-gray-200 dark:border-gray-700`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span style={{ color: planetConfig?.color }} className="text-2xl">
                {planetConfig?.symbol || "•"}
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {item.planet}
              </span>
              {item.is_retrograde && (
                <span className="text-red-500 text-sm font-bold">℞</span>
              )}
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <span style={{ color: zodiac?.color }}>{zodiac?.symbol}</span>
                <span className="text-gray-600 dark:text-gray-400">
                  {item.natal_sign}
                </span>
              </div>
              <span className="px-2 py-0.5 bg-white dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-300">
                H{item.transit_house}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TransitHousesTable({ houses }: { houses: any[] }) {
  if (!houses || houses.length === 0) {
    return (
      <EmptyState
        icon="solar:planet-bold-duotone"
        title="No Data"
        description="No transit house data available."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-300">
              Planet
            </th>
            <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-300">
              Natal Sign
            </th>
            <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-300">
              Transit House
            </th>
            <th className="text-center p-4 font-semibold text-gray-600 dark:text-gray-300">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {houses.map((item: any, idx: number) => {
            const planetConfig = PLANETS_CONFIG[item.planet];
            const zodiac = ZODIAC_SIGNS[item.natal_sign];

            return (
              <tr
                key={idx}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg ${planetConfig?.bgColor || "bg-gray-100"} flex items-center justify-center`}
                    >
                      <span
                        style={{ color: planetConfig?.color }}
                        className="text-xl"
                      >
                        {planetConfig?.symbol || "•"}
                      </span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {item.planet}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span style={{ color: zodiac?.color }} className="text-lg">
                      {zodiac?.symbol}
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {item.natal_sign}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm font-medium">
                    House {item.transit_house}
                  </span>
                </td>
                <td className="p-4 text-center">
                  {item.is_retrograde ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-xs font-medium">
                      <span className="text-sm">℞</span> Retrograde
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg text-xs font-medium">
                      <Iconify icon="solar:check-circle-bold" width={14} />{" "}
                      Direct
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function TransitRelationsGrid({ relations }: { relations: any[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {relations.map((rel: any, idx: number) => {
        const aspectConfig = ASPECT_CONFIG[rel.type];
        const isHarmonious = aspectConfig?.nature === "harmonious";
        const transitPlanet = PLANETS_CONFIG[rel.transit_planet];
        const natalPlanet = PLANETS_CONFIG[rel.natal_planet];

        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className={`${aspectConfig?.bgColor} rounded-xl p-4 border ${
              isHarmonious
                ? "border-green-200 dark:border-green-800"
                : "border-orange-200 dark:border-orange-800"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span style={{ color: aspectConfig?.color }} className="text-2xl">
                {aspectConfig?.symbol || "•"}
              </span>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  isHarmonious
                    ? "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300"
                    : "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300"
                }`}
              >
                {rel.type}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span
                  style={{ color: transitPlanet?.color }}
                  className="text-lg"
                >
                  {transitPlanet?.symbol}
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {rel.transit_planet}
                </span>
              </div>
              <Iconify
                icon="solar:arrow-right-linear"
                width={14}
                className="text-gray-400"
              />
              <div className="flex items-center gap-1">
                <span style={{ color: natalPlanet?.color }} className="text-lg">
                  {natalPlanet?.symbol}
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {rel.natal_planet}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Orb: {rel.orb}°
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}

function TransitRelationsTable({
  relations,
  showDate = false,
}: {
  relations: any[];
  showDate?: boolean;
}) {
  if (!relations || relations.length === 0) {
    return (
      <EmptyState
        icon="solar:stars-bold-duotone"
        title="No Transit Relations"
        description="No transit aspects found."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-300">
              Transit Planet
            </th>
            <th className="text-center p-4 font-semibold text-gray-600 dark:text-gray-300">
              Aspect
            </th>
            <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-300">
              Natal Planet
            </th>
            <th className="text-center p-4 font-semibold text-gray-600 dark:text-gray-300">
              Orb
            </th>
            {showDate && (
              <th className="text-left p-4 font-semibold text-gray-600 dark:text-gray-300">
                Date
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {relations.map((rel: any, idx: number) => {
            const aspectConfig = ASPECT_CONFIG[rel.type];
            const transitPlanet = PLANETS_CONFIG[rel.transit_planet];
            const natalPlanet = PLANETS_CONFIG[rel.natal_planet];
            const isHarmonious = aspectConfig?.nature === "harmonious";

            return (
              <tr
                key={idx}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg ${transitPlanet?.bgColor || "bg-gray-100"} flex items-center justify-center`}
                    >
                      <span
                        style={{ color: transitPlanet?.color }}
                        className="text-xl"
                      >
                        {transitPlanet?.symbol || "•"}
                      </span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {rel.transit_planet}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
                      isHarmonious
                        ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                        : "bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
                    }`}
                  >
                    <span
                      style={{ color: aspectConfig?.color }}
                      className="text-lg"
                    >
                      {aspectConfig?.symbol || "•"}
                    </span>
                    {rel.type}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg ${natalPlanet?.bgColor || "bg-gray-100"} flex items-center justify-center`}
                    >
                      <span
                        style={{ color: natalPlanet?.color }}
                        className="text-xl"
                      >
                        {natalPlanet?.symbol || "•"}
                      </span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {rel.natal_planet}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">
                    {rel.orb}°
                  </span>
                </td>
                {showDate && (
                  <td className="p-4 text-gray-600 dark:text-gray-400">
                    {rel.date}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function NatalTransitsTable({ transits }: { transits: any[] }) {
  if (!transits || transits.length === 0) {
    return (
      <EmptyState
        icon="solar:document-text-bold-duotone"
        title="No Data"
        description="No natal transit data available."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <th className="text-left p-3 font-semibold text-gray-600 dark:text-gray-300">
              Transit
            </th>
            <th className="text-center p-3 font-semibold text-gray-600 dark:text-gray-300">
              Aspect
            </th>
            <th className="text-left p-3 font-semibold text-gray-600 dark:text-gray-300">
              Natal
            </th>
            <th className="text-left p-3 font-semibold text-gray-600 dark:text-gray-300">
              Sign
            </th>
            <th className="text-left p-3 font-semibold text-gray-600 dark:text-gray-300">
              Time Range
            </th>
          </tr>
        </thead>
        <tbody>
          {transits.slice(0, 15).map((t: any, idx: number) => {
            const aspectConfig = ASPECT_CONFIG[t.aspect_type];
            const transitPlanet = PLANETS_CONFIG[t.transit_planet];
            const natalPlanet = PLANETS_CONFIG[t.natal_planet];
            const zodiac = ZODIAC_SIGNS[t.transit_sign];

            return (
              <tr
                key={idx}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <span
                      style={{ color: transitPlanet?.color }}
                      className="text-lg"
                    >
                      {transitPlanet?.symbol || "•"}
                    </span>
                    <span className="text-gray-800 dark:text-gray-200">
                      {t.transit_planet}
                    </span>
                    {t.is_retrograde && (
                      <span className="text-red-500 text-xs font-bold">℞</span>
                    )}
                  </div>
                </td>
                <td className="p-3 text-center">
                  <span
                    style={{ color: aspectConfig?.color }}
                    className="text-xl"
                  >
                    {aspectConfig?.symbol || "•"}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <span
                      style={{ color: natalPlanet?.color }}
                      className="text-lg"
                    >
                      {natalPlanet?.symbol || "•"}
                    </span>
                    <span className="text-gray-800 dark:text-gray-200">
                      {t.natal_planet}
                    </span>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-1">
                    <span style={{ color: zodiac?.color }} className="text-lg">
                      {zodiac?.symbol}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {t.transit_sign}
                    </span>
                  </div>
                </td>
                <td className="p-3">
                  <div className="space-y-1 text-xs">
                    {t.start_time && (
                      <div className="flex items-center gap-1">
                        <span className="text-gray-400">Start:</span>
                        <span className="text-gray-600 dark:text-gray-300">
                          {new Date(t.start_time).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {t.exact_time && t.exact_time !== "-" && (
                      <div className="flex items-center gap-1">
                        <span className="text-green-500">Exact:</span>
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          {new Date(t.exact_time).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ForecastCard({ forecast, index }: { forecast: any; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-gradient-to-br from-white to-purple-50/50 dark:from-gray-800 dark:to-purple-900/20 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div
        className="px-5 py-4 flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
            <Iconify icon="solar:star-bold" width={24} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {forecast.planet_position}
            </h4>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {forecast.date}
            </span>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Iconify
            icon="solar:alt-arrow-down-bold"
            width={20}
            className="text-gray-400"
          />
        </motion.div>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-2">
              <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {forecast.forecast}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
        <Iconify icon={icon} width={32} className="text-gray-400" />
      </div>
      <h4 className="font-medium text-gray-900 dark:text-white mb-1">
        {title}
      </h4>
      <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  );
}

export default TransitsPage;
