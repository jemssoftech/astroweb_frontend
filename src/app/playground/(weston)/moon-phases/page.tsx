"use client";

import React, { useState, useCallback } from "react";
import Iconify from "@/src/components/Iconify";
import PersonSelector from "@/src/components/PersonSelector";
import { Person } from "@/src/lib/models";
import Swal from "sweetalert2";
import api from "@/src/lib/api";
import { motion, AnimatePresence } from "framer-motion";

// ============ CONSTANTS ============

const HOUSE_TYPES = [
  { value: "placidus", label: "Placidus", icon: "solar:home-2-bold" },
  { value: "koch", label: "Koch", icon: "solar:home-angle-bold" },
  { value: "topocentric", label: "Topocentric", icon: "solar:home-bold" },
  { value: "poryphry", label: "Porphyry", icon: "solar:buildings-bold" },
  { value: "equal_house", label: "Equal House", icon: "solar:home-smile-bold" },
  { value: "whole_sign", label: "Whole Sign", icon: "solar:home-add-bold" },
] as const;

type HouseType = (typeof HOUSE_TYPES)[number]["value"];

const MOON_PHASE_CONFIG: Record<
  string,
  { icon: string; color: string; gradient: string; bgColor: string }
> = {
  "New Moon": {
    icon: "solar:moon-fog-bold-duotone",
    color: "#1F2937",
    gradient: "from-slate-600 to-gray-800",
    bgColor: "bg-slate-50 dark:bg-slate-900/30",
  },
  "Waxing Crescent": {
    icon: "solar:moon-bold-duotone",
    color: "#6366F1",
    gradient: "from-indigo-500 to-violet-600",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/30",
  },
  "First Quarter": {
    icon: "solar:moon-stars-bold-duotone",
    color: "#8B5CF6",
    gradient: "from-violet-500 to-purple-600",
    bgColor: "bg-violet-50 dark:bg-violet-900/30",
  },
  "Waxing Gibbous": {
    icon: "solar:moon-bold-duotone",
    color: "#A78BFA",
    gradient: "from-purple-400 to-violet-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/30",
  },
  "Full Moon": {
    icon: "solar:moon-bold-duotone",
    color: "#F59E0B",
    gradient: "from-amber-400 to-orange-500",
    bgColor: "bg-amber-50 dark:bg-amber-900/30",
  },
  "Waning Gibbous": {
    icon: "solar:moon-bold-duotone",
    color: "#F97316",
    gradient: "from-orange-500 to-amber-600",
    bgColor: "bg-orange-50 dark:bg-orange-900/30",
  },
  "Last Quarter": {
    icon: "solar:moon-sleep-bold-duotone",
    color: "#EF4444",
    gradient: "from-red-500 to-rose-600",
    bgColor: "bg-red-50 dark:bg-red-900/30",
  },
  "Third Quarter": {
    icon: "solar:moon-sleep-bold-duotone",
    color: "#EF4444",
    gradient: "from-red-500 to-rose-600",
    bgColor: "bg-red-50 dark:bg-red-900/30",
  },
  "Waning Crescent": {
    icon: "solar:moon-fog-bold-duotone",
    color: "#DC2626",
    gradient: "from-rose-500 to-red-600",
    bgColor: "bg-rose-50 dark:bg-rose-900/30",
  },
};

const SIGN_CONFIG: Record<
  string,
  { icon: string; color: string; element: string; gradient: string }
> = {
  Aries: {
    icon: "mdi:zodiac-aries",
    color: "#EF4444",
    element: "Fire",
    gradient: "from-red-500 to-orange-500",
  },
  Taurus: {
    icon: "mdi:zodiac-taurus",
    color: "#22C55E",
    element: "Earth",
    gradient: "from-green-500 to-emerald-500",
  },
  Gemini: {
    icon: "mdi:zodiac-gemini",
    color: "#F59E0B",
    element: "Air",
    gradient: "from-amber-500 to-yellow-500",
  },
  Cancer: {
    icon: "mdi:zodiac-cancer",
    color: "#6B7280",
    element: "Water",
    gradient: "from-gray-500 to-slate-500",
  },
  Leo: {
    icon: "mdi:zodiac-leo",
    color: "#F97316",
    element: "Fire",
    gradient: "from-orange-500 to-amber-500",
  },
  Virgo: {
    icon: "mdi:zodiac-virgo",
    color: "#84CC16",
    element: "Earth",
    gradient: "from-lime-500 to-green-500",
  },
  Libra: {
    icon: "mdi:zodiac-libra",
    color: "#EC4899",
    element: "Air",
    gradient: "from-pink-500 to-rose-500",
  },
  Scorpio: {
    icon: "mdi:zodiac-scorpio",
    color: "#DC2626",
    element: "Water",
    gradient: "from-red-600 to-rose-600",
  },
  Sagittarius: {
    icon: "mdi:zodiac-sagittarius",
    color: "#8B5CF6",
    element: "Fire",
    gradient: "from-violet-500 to-purple-500",
  },
  Capricorn: {
    icon: "mdi:zodiac-capricorn",
    color: "#6366F1",
    element: "Earth",
    gradient: "from-indigo-500 to-blue-500",
  },
  Aquarius: {
    icon: "mdi:zodiac-aquarius",
    color: "#06B6D4",
    element: "Air",
    gradient: "from-cyan-500 to-teal-500",
  },
  Pisces: {
    icon: "mdi:zodiac-pisces",
    color: "#3B82F6",
    element: "Water",
    gradient: "from-blue-500 to-indigo-500",
  },
};

const TABS = [
  {
    id: "overview",
    label: "Overview",
    icon: "solar:widget-5-bold-duotone",
    color: "from-indigo-500 to-purple-500",
  },
  {
    id: "metrics",
    label: "Lunar Metrics",
    icon: "solar:chart-2-bold-duotone",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "report",
    label: "Moon Report",
    icon: "solar:document-text-bold-duotone",
    color: "from-amber-500 to-orange-500",
  },
];

// ============ ANIMATIONS ============

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// ============ INTERFACES ============

interface LunarMetrics {
  month: string;
  within_perigee_range: boolean;
  distance: string;
  within_apogee_range: boolean;
  apogee_distance: string;
  moon_sign: string;
  moon_phase: string;
  moon_phase_id: number;
  moon_age_in_days: number;
  moon_day: number;
  moon_illumination: number;
}

interface MoonPhaseReport {
  considered_date: string;
  moon_phase: string;
  significance: string;
  report: string;
}

interface MoonPhasesResponse {
  status: string;
  message?: string;
  data: {
    birth_data: Record<string, unknown>;
    house_type: string;
    lunarMetrics: LunarMetrics;
    moonPhaseReport: MoonPhaseReport;
  };
}

// ============ HELPER FUNCTIONS ============

function getMoonPhaseEnergy(phase: string): "Low" | "Medium" | "High" {
  const highEnergy = ["Full Moon", "First Quarter", "Waxing Gibbous"];
  const lowEnergy = ["New Moon", "Waning Crescent", "Last Quarter"];
  if (highEnergy.includes(phase)) return "High";
  if (lowEnergy.includes(phase)) return "Low";
  return "Medium";
}

function getManifestationPower(phase: string): "Low" | "Medium" | "High" {
  const high = ["New Moon", "Waxing Crescent", "First Quarter"];
  const low = ["Waning Gibbous", "Last Quarter", "Waning Crescent"];
  if (high.includes(phase)) return "High";
  if (low.includes(phase)) return "Low";
  return "Medium";
}

function getIntrospectionLevel(phase: string): "Low" | "Medium" | "High" {
  const high = ["New Moon", "Waning Crescent", "Last Quarter"];
  const low = ["Full Moon", "Waxing Gibbous"];
  if (high.includes(phase)) return "High";
  if (low.includes(phase)) return "Low";
  return "Medium";
}

function getActionLevel(phase: string): "Low" | "Medium" | "High" {
  const high = ["Full Moon", "First Quarter", "Waxing Gibbous"];
  const low = ["New Moon", "Waning Crescent"];
  if (high.includes(phase)) return "High";
  if (low.includes(phase)) return "Low";
  return "Medium";
}

function isWaxingPhase(phase: string): boolean {
  return [
    "New Moon",
    "Waxing Crescent",
    "First Quarter",
    "Waxing Gibbous",
  ].includes(phase);
}

function formatMoonAge(ageInDays: number): string {
  const days = Math.floor(ageInDays);
  const hours = Math.floor((ageInDays - days) * 24);
  return `${days}d ${hours}h`;
}

function getPhaseBestActivities(phase: string): string[] {
  const activities: Record<string, string[]> = {
    "New Moon": [
      "Setting intentions & goals",
      "Starting new projects",
      "Meditation & reflection",
      "Journaling & planning",
    ],
    "Waxing Crescent": [
      "Taking initial steps",
      "Building momentum",
      "Networking & connecting",
      "Learning new skills",
    ],
    "First Quarter": [
      "Taking decisive action",
      "Overcoming challenges",
      "Making commitments",
      "Problem-solving",
    ],
    "Waxing Gibbous": [
      "Refining & adjusting plans",
      "Patience & persistence",
      "Reviewing progress",
      "Fine-tuning details",
    ],
    "Full Moon": [
      "Celebrating achievements",
      "Social gatherings",
      "Expressing creativity",
      "Releasing what no longer serves",
    ],
    "Waning Gibbous": [
      "Sharing knowledge",
      "Gratitude practices",
      "Teaching others",
      "Reflecting on lessons",
    ],
    "Last Quarter": [
      "Letting go of old habits",
      "Forgiveness practices",
      "Decluttering & organizing",
      "Tying up loose ends",
    ],
    "Third Quarter": [
      "Letting go of old habits",
      "Forgiveness practices",
      "Decluttering & organizing",
      "Tying up loose ends",
    ],
    "Waning Crescent": [
      "Rest & recuperation",
      "Spiritual practices",
      "Surrender & trust",
      "Preparing for new cycle",
    ],
  };
  return activities[phase] || activities["New Moon"];
}

function getPhaseAvoidActivities(phase: string): string[] {
  const activities: Record<string, string[]> = {
    "New Moon": [
      "Launching major projects publicly",
      "Making hasty decisions",
      "Overexerting yourself",
      "Ignoring your intuition",
    ],
    "Waxing Crescent": [
      "Giving up too quickly",
      "Overcommitting",
      "Comparing to others",
      "Neglecting self-care",
    ],
    "First Quarter": [
      "Avoiding confrontation",
      "Procrastination",
      "Being too rigid",
      "Ignoring obstacles",
    ],
    "Waxing Gibbous": [
      "Starting new ventures",
      "Drastic changes",
      "Being impatient",
      "Overlooking details",
    ],
    "Full Moon": [
      "Making impulsive decisions",
      "Emotional confrontations",
      "Starting new projects",
      "Overindulging",
    ],
    "Waning Gibbous": [
      "Holding onto grudges",
      "Starting new ventures",
      "Being critical of others",
      "Resisting change",
    ],
    "Last Quarter": [
      "Beginning new projects",
      "Making major purchases",
      "Forcing outcomes",
      "Clinging to the past",
    ],
    "Third Quarter": [
      "Beginning new projects",
      "Making major purchases",
      "Forcing outcomes",
      "Clinging to the past",
    ],
    "Waning Crescent": [
      "Pushing too hard",
      "Making big commitments",
      "Ignoring need for rest",
      "Planning aggressively",
    ],
  };
  return activities[phase] || activities["New Moon"];
}

// ============ MAIN COMPONENT ============

function MoonPhasesPage() {
  // const [user, setUser] = useState(getUser());
  // useEffect(() => {
  //   setUser(getUser());
  // }, []);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [houseType, setHouseType] = useState<HouseType>("placidus");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MoonPhasesResponse | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");

  const handleCalculate = async () => {
    if (!selectedPerson) {
      Swal.fire({
        icon: "warning",
        title: "Select Person",
        text: "Please select a person to generate moon phase report.",
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
        house_type: houseType,
      };

      const response: any = await api.post("/api/mainapi/lunar", requestBody);

      if (response && response.status === 200 && response.data) {
        setResult({
          status: "Pass",
          data: response.data?.data || response.data,
        });
      } else {
        throw new Error(
          response?.data?.message ||
            response?.error ||
            "Failed to fetch lunar data",
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

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 ">
        {/* Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden bg-linear-to-r from-indigo-700 via-purple-700 to-violet-700 rounded-2xl p-6 md:p-8 text-white shadow-xl mb-8"
        >
          {/* Soft Glow Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>

          {/* Watermark Moon Icon */}
          <div className="absolute top-4 right-8 opacity-20">
            <Iconify icon="solar:moon-bold-duotone" width={110} height={110} />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Iconify
                  icon="solar:moon-stars-bold-duotone"
                  width={40}
                  height={40}
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium">
                    Lunar Analysis
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold">
                  Moon Phases Report
                </h1>

                <p className="text-white/80 mt-1 max-w-xl">
                  Discover your lunar influences and understand how the
                  moon&apos;s energy affects your life journey.
                </p>
              </div>
            </div>

            {/* Current Phase Badge */}
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/20">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Iconify icon="solar:moon-stars-bold" width={20} height={20} />
              </div>
              <div>
                <p className="font-semibold">
                  {new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <p className="text-sm text-white/70">Current Phase</p>
              </div>
            </div>
          </div>
        </motion.div>
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            {/* Person + Settings Card */}
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
                        className="text-muted-foreground flex-shrink-0"
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
                className="mt-6 w-full py-3.5 px-4 bg-primary text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/25 hover:-translate-y-0.5"
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
                    Generate Chart
                  </>
                )}
              </button>
            </motion.div>
          </div>
          <div className="lg:col-span-3 space-y-6">
            {/* Loading Overlay */}
            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-2xl max-w-sm w-full mx-4"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="relative mb-6">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 flex items-center justify-center">
                          <Iconify
                            icon="solar:moon-stars-bold-duotone"
                            width={48}
                            className="text-indigo-500 animate-pulse"
                          />
                        </div>
                        <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-transparent border-t-indigo-500 border-r-purple-500 animate-spin" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Analyzing Lunar Data
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Calculating moon phases using{" "}
                        {HOUSE_TYPES.find((t) => t.value === houseType)?.label}{" "}
                        system...
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results */}
            <AnimatePresence mode="wait">
              {result && result.data && (
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
                      icon="solar:moon-bold-duotone"
                      label="Moon Phase"
                      value={result.data.lunarMetrics.moon_phase}
                      color="from-indigo-500 to-purple-500"
                    />
                    <StatsCard
                      icon={
                        SIGN_CONFIG[result.data.lunarMetrics.moon_sign]?.icon ||
                        "mdi:zodiac-cancer"
                      }
                      label="Moon Sign"
                      value={result.data.lunarMetrics.moon_sign}
                      color={
                        SIGN_CONFIG[result.data.lunarMetrics.moon_sign]
                          ?.gradient || "from-gray-500 to-slate-500"
                      }
                    />
                    <StatsCard
                      icon="solar:sun-bold-duotone"
                      label="Illumination"
                      value={`${result.data.lunarMetrics.moon_illumination}%`}
                      color="from-amber-500 to-orange-500"
                    />
                    <StatsCard
                      icon="solar:calendar-bold-duotone"
                      label="Lunar Day"
                      value={result.data.lunarMetrics.moon_day.toString()}
                      color="from-emerald-500 to-teal-500"
                    />
                  </motion.div>

                  {/* Tabs Container */}
                  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none overflow-hidden">
                    {/* Tab Navigation */}
                    <div className="border-b border-gray-200 dark:border-gray-800">
                      <div className="flex overflow-x-auto scrollbar-hide">
                        {TABS.map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative flex items-center gap-2.5 px-6 py-4 text-sm font-medium whitespace-nowrap transition-all ${
                              activeTab === tab.id
                                ? "text-indigo-600 dark:text-indigo-400"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                            }`}
                          >
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                                activeTab === tab.id
                                  ? `bg-linear-to-br ${tab.color} text-white shadow-lg`
                                  : "bg-gray-100 dark:bg-gray-800"
                              }`}
                            >
                              <Iconify icon={tab.icon} width={20} />
                            </div>
                            <span className="hidden sm:inline">
                              {tab.label}
                            </span>
                            {activeTab === tab.id && (
                              <motion.div
                                layoutId="activeTabMoon"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"
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
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.2 }}
                        >
                          {activeTab === "overview" && (
                            <OverviewTab
                              metrics={result.data.lunarMetrics}
                              report={result.data.moonPhaseReport}
                            />
                          )}
                          {activeTab === "metrics" && (
                            <MetricsTab metrics={result.data.lunarMetrics} />
                          )}
                          {activeTab === "report" && (
                            <ReportTab report={result.data.moonPhaseReport} />
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
                <div className="flex flex-col items-center text-center max-w-lg mx-auto">
                  <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 flex items-center justify-center mb-6 shadow-xl shadow-indigo-200/50 dark:shadow-none">
                    <Iconify
                      icon="solar:moon-stars-bold-duotone"
                      width={56}
                      className="text-indigo-500"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    Discover Your Lunar Influence
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Select a profile, choose your preferred house system, and
                    reveal your moon phase, lunar metrics, and personalized
                    guidance based on the moon&apos;s position.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400 text-sm">
                      <Iconify icon="solar:moon-bold" width={18} />
                      <span>Moon Phase</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400 text-sm">
                      <Iconify icon="solar:chart-2-bold" width={18} />
                      <span>Lunar Metrics</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-violet-50 dark:bg-violet-900/30 rounded-lg text-violet-600 dark:text-violet-400 text-sm">
                      <Iconify icon="solar:stars-bold" width={18} />
                      <span>Energy Guidance</span>
                    </div>
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

// ============ HERO COMPONENT ============

function MoonPhaseHeroCard({
  metrics,
  report,
  houseType,
}: {
  metrics: LunarMetrics;
  report: MoonPhaseReport;
  houseType: string;
}) {
  const phaseConfig =
    MOON_PHASE_CONFIG[metrics.moon_phase] || MOON_PHASE_CONFIG["New Moon"];
  const signConfig = SIGN_CONFIG[metrics.moon_sign] || SIGN_CONFIG["Cancer"];
  const waxing = isWaxingPhase(metrics.moon_phase);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-2xl"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${phaseConfig.gradient} opacity-90`}
      />
      <div className="absolute inset-0 bg-[url('/images/stars-pattern.png')] opacity-10" />
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

      {/* Large Moon Icon */}
      <div className="absolute top-8 right-8 opacity-20">
        <Iconify icon={phaseConfig.icon} width={160} className="text-white" />
      </div>

      <div className="relative p-8 text-white">
        <div className="flex flex-wrap items-start justify-between gap-8">
          {/* Left Side - Moon Phase Info */}
          <div className="flex items-center gap-6">
            <div className="w-28 h-28 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl">
              <Iconify icon={phaseConfig.icon} width={64} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                  {houseType.charAt(0).toUpperCase() + houseType.slice(1)} House
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                {metrics.moon_phase}
              </h2>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <Iconify icon={signConfig.icon} width={22} />
                  <span className="font-semibold">{metrics.moon_sign}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <Iconify icon="solar:calendar-bold" width={20} />
                  <span className="font-medium">{metrics.month}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <QuickStatCard
              icon="solar:sun-bold"
              label="Illumination"
              value={`${metrics.moon_illumination}%`}
            />
            <QuickStatCard
              icon="solar:calendar-minimalistic-bold"
              label="Moon Age"
              value={formatMoonAge(metrics.moon_age_in_days)}
            />
            <QuickStatCard
              icon="solar:star-bold"
              label="Lunar Day"
              value={metrics.moon_day.toString()}
            />
            <QuickStatCard
              icon={waxing ? "solar:arrow-up-bold" : "solar:arrow-down-bold"}
              label="Direction"
              value={waxing ? "Waxing" : "Waning"}
            />
          </div>
        </div>

        {/* Report Date Badge */}
        {report.considered_date && (
          <div className="mt-6 pt-6 border-t border-white/20">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-xl text-sm">
                <Iconify icon="solar:calendar-date-bold" width={18} />
                Report Date: {report.considered_date}
              </span>
              <span className="flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-xl text-sm">
                <Iconify icon="solar:moon-bold" width={18} />
                Phase: {report.moon_phase}
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function QuickStatCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="text-center bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3">
      <Iconify icon={icon} width={24} className="mx-auto mb-1" />
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs text-white/70">{label}</p>
    </div>
  );
}

// ============ TAB COMPONENTS ============

function OverviewTab({
  metrics,
  report,
}: {
  metrics: LunarMetrics;
  report: MoonPhaseReport;
}) {
  const waxing = isWaxingPhase(metrics.moon_phase);
  const phaseConfig =
    MOON_PHASE_CONFIG[metrics.moon_phase] || MOON_PHASE_CONFIG["New Moon"];
  const signConfig = SIGN_CONFIG[metrics.moon_sign] || SIGN_CONFIG["Cancer"];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Significance */}
      <Section
        title="Moon Phase Significance"
        icon="solar:book-2-bold-duotone"
        color="from-indigo-500 to-purple-500"
      >
        <div
          className={`${phaseConfig.bgColor} rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50`}
        >
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
            {report.significance}
          </p>
        </div>
      </Section>

      {/* Personalized Report */}
      <Section
        title="Your Personalized Report"
        icon="solar:star-shine-bold-duotone"
        color="from-pink-500 to-rose-500"
      >
        <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
            {report.report}
          </p>
        </div>
      </Section>

      {/* Quick Info Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <InfoCard
          label="Moon Sign"
          value={metrics.moon_sign}
          icon={signConfig.icon}
          gradient={signConfig.gradient}
        />
        <InfoCard
          label="Moon Phase"
          value={metrics.moon_phase}
          icon={phaseConfig.icon}
          gradient={phaseConfig.gradient}
        />
        <InfoCard
          label="Illumination"
          value={`${metrics.moon_illumination}%`}
          icon="solar:sun-bold-duotone"
          gradient="from-amber-500 to-orange-500"
        />
        <InfoCard
          label="Direction"
          value={waxing ? "Waxing" : "Waning"}
          icon={
            waxing
              ? "solar:arrow-up-bold-duotone"
              : "solar:arrow-down-bold-duotone"
          }
          gradient={
            waxing
              ? "from-green-500 to-emerald-500"
              : "from-red-500 to-rose-500"
          }
        />
      </div>

      {/* Distance Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DistanceCard
          label="Perigee Range"
          distance={metrics.distance}
          inRange={metrics.within_perigee_range}
          icon="solar:minimize-bold-duotone"
          color="green"
        />
        <DistanceCard
          label="Apogee Range"
          distance={metrics.apogee_distance}
          inRange={metrics.within_apogee_range}
          icon="solar:maximize-bold-duotone"
          color="amber"
        />
      </div>

      {/* Moon Phase Energy Guide */}
      <Section
        title="Energy Levels"
        icon="solar:bolt-bold-duotone"
        color="from-amber-500 to-orange-500"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <EnergyCard
            label="Energy Level"
            value={getMoonPhaseEnergy(metrics.moon_phase)}
            icon="solar:bolt-bold-duotone"
            color="#F59E0B"
          />
          <EnergyCard
            label="Manifestation"
            value={getManifestationPower(metrics.moon_phase)}
            icon="solar:star-rings-bold-duotone"
            color="#8B5CF6"
          />
          <EnergyCard
            label="Introspection"
            value={getIntrospectionLevel(metrics.moon_phase)}
            icon="solar:mind-bold-duotone"
            color="#3B82F6"
          />
          <EnergyCard
            label="Action"
            value={getActionLevel(metrics.moon_phase)}
            icon="solar:running-bold-duotone"
            color="#22C55E"
          />
        </div>
      </Section>
    </motion.div>
  );
}

function MetricsTab({ metrics }: { metrics: LunarMetrics }) {
  const waxing = isWaxingPhase(metrics.moon_phase);
  const phaseConfig =
    MOON_PHASE_CONFIG[metrics.moon_phase] || MOON_PHASE_CONFIG["New Moon"];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Moon Position */}
      <Section
        title="Moon Position"
        icon="solar:moon-bold-duotone"
        color="from-indigo-500 to-purple-500"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            label="Moon Sign"
            value={metrics.moon_sign}
            icon={SIGN_CONFIG[metrics.moon_sign]?.icon || "mdi:zodiac-cancer"}
            color={SIGN_CONFIG[metrics.moon_sign]?.color || "#6B7280"}
          />
          <MetricCard
            label="Moon Phase"
            value={metrics.moon_phase}
            icon={phaseConfig.icon}
            color={phaseConfig.color}
          />
          <MetricCard
            label="Phase ID"
            value={metrics.moon_phase_id.toString()}
            icon="solar:hashtag-bold"
            color="#6366F1"
          />
          <MetricCard
            label="Direction"
            value={waxing ? "Waxing" : "Waning"}
            icon={waxing ? "solar:arrow-up-bold" : "solar:arrow-down-bold"}
            color={waxing ? "#22C55E" : "#EF4444"}
          />
        </div>
      </Section>

      {/* Lunar Timing */}
      <Section
        title="Lunar Timing"
        icon="solar:clock-circle-bold-duotone"
        color="from-blue-500 to-cyan-500"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            label="Birth Date"
            value={metrics.month}
            icon="solar:calendar-bold"
            color="#3B82F6"
          />
          <MetricCard
            label="Moon Age"
            value={formatMoonAge(metrics.moon_age_in_days)}
            icon="solar:hourglass-bold"
            color="#8B5CF6"
          />
          <MetricCard
            label="Moon Day"
            value={metrics.moon_day.toString()}
            icon="solar:calendar-date-bold"
            color="#22C55E"
          />
          <MetricCard
            label="Illumination"
            value={`${metrics.moon_illumination}%`}
            icon="solar:sun-bold"
            color="#F59E0B"
          />
        </div>
      </Section>

      {/* Moon Phase Cycle Visual */}
      <Section
        title="Moon Phase Cycle"
        icon="solar:refresh-circle-bold-duotone"
        color="from-violet-500 to-purple-500"
      >
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
          <div className="flex justify-between items-center overflow-x-auto pb-2 gap-2">
            {Object.entries(MOON_PHASE_CONFIG).map(([phase, config]) => {
              const isActive = metrics.moon_phase === phase;
              return (
                <motion.div
                  key={phase}
                  whileHover={{ scale: 1.05 }}
                  className={`flex flex-col items-center min-w-[90px] p-3 rounded-xl transition-all ${
                    isActive
                      ? `bg-gradient-to-br ${config.gradient} text-white shadow-lg`
                      : "bg-white dark:bg-gray-800 hover:shadow-md"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 ${
                      isActive ? "bg-white/20" : config.bgColor
                    }`}
                  >
                    <Iconify
                      icon={config.icon}
                      width={28}
                      style={{ color: isActive ? "white" : config.color }}
                    />
                  </div>
                  <p
                    className={`text-xs text-center font-medium ${
                      isActive
                        ? "text-white"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {phase}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Progress Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Illumination Progress */}
        <div className="bg-white dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white">
              <Iconify icon="solar:sun-bold" width={20} />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white">
              Moon Illumination
            </h4>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                New Moon (0%)
              </span>
              <span className="font-bold text-amber-600">
                {metrics.moon_illumination}%
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                Full Moon (100%)
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${metrics.moon_illumination}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30"
              />
            </div>
          </div>
        </div>

        {/* Moon Age Progress */}
        <div className="bg-white dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white">
              <Iconify icon="solar:hourglass-bold" width={20} />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white">
              Lunar Cycle Progress
            </h4>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                New Moon (0d)
              </span>
              <span className="font-bold text-indigo-600">
                {formatMoonAge(metrics.moon_age_in_days)}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                Full Cycle (~29.5d)
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min((metrics.moon_age_in_days / 29.53) * 100, 100)}%`,
                }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/30"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ReportTab({ report }: { report: MoonPhaseReport }) {
  const phaseConfig =
    MOON_PHASE_CONFIG[report.moon_phase] || MOON_PHASE_CONFIG["New Moon"];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Report Header */}
      <div
        className={`bg-gradient-to-br ${phaseConfig.gradient} rounded-xl p-6 text-white`}
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Iconify icon={phaseConfig.icon} width={36} />
          </div>
          <div>
            <h3 className="text-2xl font-bold">{report.moon_phase} Report</h3>
            <p className="text-white/80">
              Considered Date: {report.considered_date}
            </p>
          </div>
        </div>
      </div>

      {/* Significance Section */}
      <Section
        title="Phase Significance"
        icon="solar:lightbulb-bold-duotone"
        color="from-indigo-500 to-purple-500"
      >
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-200/50 dark:border-indigo-800/50">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
            {report.significance}
          </p>
        </div>
      </Section>

      {/* Personalized Guidance */}
      <Section
        title="Your Personalized Guidance"
        icon="solar:user-check-bold-duotone"
        color="from-violet-500 to-purple-500"
      >
        <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-violet-200/50 dark:border-violet-800/50">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
            {report.report}
          </p>
        </div>
      </Section>

      {/* Energy Levels */}
      <Section
        title={`${report.moon_phase} Energy Levels`}
        icon="solar:bolt-bold-duotone"
        color="from-amber-500 to-orange-500"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <EnergyCard
            label="Energy Level"
            value={getMoonPhaseEnergy(report.moon_phase)}
            icon="solar:bolt-bold-duotone"
            color="#F59E0B"
          />
          <EnergyCard
            label="Manifestation"
            value={getManifestationPower(report.moon_phase)}
            icon="solar:star-rings-bold-duotone"
            color="#8B5CF6"
          />
          <EnergyCard
            label="Introspection"
            value={getIntrospectionLevel(report.moon_phase)}
            icon="solar:mind-bold-duotone"
            color="#3B82F6"
          />
          <EnergyCard
            label="Action"
            value={getActionLevel(report.moon_phase)}
            icon="solar:running-bold-duotone"
            color="#22C55E"
          />
        </div>
      </Section>

      {/* Activities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ActivityCard
          title="Best Activities"
          activities={getPhaseBestActivities(report.moon_phase)}
          type="positive"
        />
        <ActivityCard
          title="Activities to Avoid"
          activities={getPhaseAvoidActivities(report.moon_phase)}
          type="negative"
        />
      </div>
    </motion.div>
  );
}

// ============ HELPER COMPONENTS ============

function InfoBadge({ icon, value }: { icon: string; value: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200/50 dark:border-gray-700/50">
      <Iconify icon={icon} width={16} className="text-indigo-500" />
      <span className="text-gray-600 dark:text-gray-300 text-sm">{value}</span>
    </div>
  );
}

function StatsCard({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-lg"
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg`}
        >
          <Iconify icon={icon} width={28} />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white truncate">
            {value}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function Section({
  title,
  icon,
  color,
  children,
}: {
  title: string;
  icon: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div variants={itemVariants}>
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg`}
        >
          <Iconify icon={icon} width={20} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          {title}
        </h3>
      </div>
      {children}
    </motion.div>
  );
}

function InfoCard({
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
    <motion.div
      variants={itemVariants}
      className="bg-white dark:bg-gray-800/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700 text-center hover:shadow-lg transition-all"
    >
      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mx-auto mb-3 shadow-lg`}
      >
        <Iconify icon={icon} width={24} />
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className="font-bold text-gray-900 dark:text-white">{value}</p>
    </motion.div>
  );
}

function MetricCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: string;
  color: string;
}) {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-md transition-all"
    >
      <div className="flex items-center gap-2 mb-2">
        <Iconify icon={icon} width={18} style={{ color }} />
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {label}
        </span>
      </div>
      <p className="font-bold text-gray-900 dark:text-white text-lg">{value}</p>
    </motion.div>
  );
}

function DistanceCard({
  label,
  distance,
  inRange,
  icon,
  color,
}: {
  label: string;
  distance: string;
  inRange: boolean;
  icon: string;
  color: "green" | "amber";
}) {
  const colors = {
    green: {
      bg: inRange
        ? "bg-green-50 dark:bg-green-900/20"
        : "bg-gray-50 dark:bg-gray-800/50",
      border: inRange
        ? "border-green-200 dark:border-green-800"
        : "border-gray-200 dark:border-gray-700",
      icon: inRange ? "text-green-600" : "text-gray-400",
      badge:
        "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300",
    },
    amber: {
      bg: inRange
        ? "bg-amber-50 dark:bg-amber-900/20"
        : "bg-gray-50 dark:bg-gray-800/50",
      border: inRange
        ? "border-amber-200 dark:border-amber-800"
        : "border-gray-200 dark:border-gray-700",
      icon: inRange ? "text-amber-600" : "text-gray-400",
      badge:
        "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300",
    },
  };

  const c = colors[color];

  return (
    <motion.div
      variants={itemVariants}
      className={`${c.bg} border ${c.border} rounded-xl p-5`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-xl ${inRange ? `bg-${color}-100 dark:bg-${color}-900/30` : "bg-gray-100 dark:bg-gray-800"} flex items-center justify-center`}
        >
          <Iconify icon={icon} width={24} className={c.icon} />
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">
            {label}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <p className="font-bold text-gray-900 dark:text-white">
              {distance !== "--" && distance !== "__"
                ? distance
                : "Not Available"}
            </p>
            {inRange && (
              <span
                className={`px-2 py-0.5 ${c.badge} text-xs rounded-full font-medium`}
              >
                In Range
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function EnergyCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: "Low" | "Medium" | "High";
  icon: string;
  color: string;
}) {
  const levels = { Low: 1, Medium: 2, High: 3 };
  const level = levels[value] || 1;

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white dark:bg-gray-800/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700 text-center hover:shadow-md transition-all"
    >
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3"
        style={{ backgroundColor: `${color}15` }}
      >
        <Iconify icon={icon} width={28} style={{ color }} />
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{label}</p>
      <div className="flex justify-center gap-2 mb-2">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`w-4 h-4 rounded-full ${i <= level ? "" : "bg-gray-200 dark:bg-gray-700"}`}
            style={{ backgroundColor: i <= level ? color : undefined }}
          />
        ))}
      </div>
      <p className="text-sm font-bold" style={{ color }}>
        {value}
      </p>
    </motion.div>
  );
}

function ActivityCard({
  title,
  activities,
  type,
}: {
  title: string;
  activities: string[];
  type: "positive" | "negative";
}) {
  const isPositive = type === "positive";

  return (
    <motion.div
      variants={itemVariants}
      className={`rounded-xl p-6 border ${
        isPositive
          ? "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-800/50"
          : "bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-200/50 dark:border-red-800/50"
      }`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-10 h-10 rounded-xl ${
            isPositive
              ? "bg-gradient-to-br from-green-500 to-emerald-500"
              : "bg-gradient-to-br from-red-500 to-rose-500"
          } flex items-center justify-center text-white`}
        >
          <Iconify
            icon={
              isPositive ? "solar:check-circle-bold" : "solar:close-circle-bold"
            }
            width={22}
          />
        </div>
        <h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
      </div>
      <ul className="space-y-3">
        {activities.map((activity, idx) => (
          <motion.li
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-start gap-3"
          >
            <Iconify
              icon={
                isPositive
                  ? "solar:check-circle-bold"
                  : "solar:close-circle-bold"
              }
              width={18}
              className={`flex-shrink-0 mt-0.5 ${isPositive ? "text-green-500" : "text-red-500"}`}
            />
            <span className="text-gray-700 dark:text-gray-300">{activity}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

export default MoonPhasesPage;
