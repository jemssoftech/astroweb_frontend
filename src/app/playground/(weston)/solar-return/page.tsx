"use client";

import React, { useState, useEffect, useCallback } from "react";
import Iconify from "@/src/components/Iconify";
import PersonSelector from "@/src/components/PersonSelector";
import { Person } from "@/src/lib/models";
import Swal from "sweetalert2";
import api from "@/src/lib/api";
import { motion, AnimatePresence } from "framer-motion";

// ============ CONSTANTS ============

const PLANET_CONFIG: Record<
  string,
  { icon: string; color: string; gradient: string; bgColor: string }
> = {
  Sun: {
    icon: "solar:sun-bold-duotone",
    color: "#F59E0B",
    gradient: "from-amber-400 to-orange-500",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
  },
  Moon: {
    icon: "solar:moon-bold-duotone",
    color: "#6B7280",
    gradient: "from-slate-400 to-gray-500",
    bgColor: "bg-slate-50 dark:bg-slate-800/50",
  },
  Mars: {
    icon: "solar:flame-bold-duotone",
    color: "#EF4444",
    gradient: "from-red-400 to-rose-500",
    bgColor: "bg-red-50 dark:bg-red-900/20",
  },
  Mercury: {
    icon: "solar:wind-bold-duotone",
    color: "#8B5CF6",
    gradient: "from-violet-400 to-purple-500",
    bgColor: "bg-violet-50 dark:bg-violet-900/20",
  },
  Jupiter: {
    icon: "solar:crown-bold-duotone",
    color: "#F97316",
    gradient: "from-orange-400 to-amber-500",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
  },
  Venus: {
    icon: "solar:heart-bold-duotone",
    color: "#EC4899",
    gradient: "from-pink-400 to-rose-500",
    bgColor: "bg-pink-50 dark:bg-pink-900/20",
  },
  Saturn: {
    icon: "solar:clock-circle-bold-duotone",
    color: "#6366F1",
    gradient: "from-indigo-400 to-blue-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
  },
  Uranus: {
    icon: "solar:bolt-bold-duotone",
    color: "#06B6D4",
    gradient: "from-cyan-400 to-teal-500",
    bgColor: "bg-cyan-50 dark:bg-cyan-900/20",
  },
  Neptune: {
    icon: "solar:water-bold-duotone",
    color: "#3B82F6",
    gradient: "from-blue-400 to-indigo-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
  },
  Pluto: {
    icon: "solar:black-hole-bold-duotone",
    color: "#1F2937",
    gradient: "from-gray-600 to-slate-700",
    bgColor: "bg-gray-100 dark:bg-gray-800/50",
  },
  Ascendant: {
    icon: "solar:arrow-up-bold-duotone",
    color: "#22C55E",
    gradient: "from-green-400 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-900/20",
  },
  "North Node": {
    icon: "solar:atom-bold-duotone",
    color: "#84CC16",
    gradient: "from-lime-400 to-green-500",
    bgColor: "bg-lime-50 dark:bg-lime-900/20",
  },
};

const SIGN_CONFIG: Record<
  string,
  { icon: string; color: string; element: string }
> = {
  Aries: { icon: "mdi:zodiac-aries", color: "#EF4444", element: "Fire" },
  Taurus: { icon: "mdi:zodiac-taurus", color: "#84CC16", element: "Earth" },
  Gemini: { icon: "mdi:zodiac-gemini", color: "#FBBF24", element: "Air" },
  Cancer: { icon: "mdi:zodiac-cancer", color: "#3B82F6", element: "Water" },
  Leo: { icon: "mdi:zodiac-leo", color: "#F97316", element: "Fire" },
  Virgo: { icon: "mdi:zodiac-virgo", color: "#22C55E", element: "Earth" },
  Libra: { icon: "mdi:zodiac-libra", color: "#EC4899", element: "Air" },
  Scorpio: { icon: "mdi:zodiac-scorpio", color: "#7C3AED", element: "Water" },
  Sagittarius: {
    icon: "mdi:zodiac-sagittarius",
    color: "#8B5CF6",
    element: "Fire",
  },
  Capricorn: {
    icon: "mdi:zodiac-capricorn",
    color: "#6B7280",
    element: "Earth",
  },
  Aquarius: { icon: "mdi:zodiac-aquarius", color: "#06B6D4", element: "Air" },
  Pisces: { icon: "mdi:zodiac-pisces", color: "#14B8A6", element: "Water" },
};

const ASPECT_CONFIG: Record<
  string,
  { icon: string; color: string; nature: string; bgColor: string }
> = {
  Conjunction: {
    icon: "solar:link-bold",
    color: "#8B5CF6",
    nature: "major",
    bgColor: "bg-violet-50 dark:bg-violet-900/20",
  },
  Opposition: {
    icon: "solar:arrow-left-right-bold",
    color: "#EF4444",
    nature: "challenging",
    bgColor: "bg-red-50 dark:bg-red-900/20",
  },
  Trine: {
    icon: "solar:star-shine-bold",
    color: "#22C55E",
    nature: "harmonious",
    bgColor: "bg-green-50 dark:bg-green-900/20",
  },
  Square: {
    icon: "solar:square-bold",
    color: "#F97316",
    nature: "challenging",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
  },
  Sextile: {
    icon: "solar:star-bold",
    color: "#3B82F6",
    nature: "harmonious",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
  },
  Quincunx: {
    icon: "solar:question-circle-bold",
    color: "#6B7280",
    nature: "minor",
    bgColor: "bg-gray-50 dark:bg-gray-800/50",
  },
};

const TABS = [
  {
    id: "overview",
    label: "Overview",
    icon: "solar:widget-5-bold-duotone",
    color: "from-violet-500 to-purple-500",
  },
  {
    id: "planets",
    label: "Planets",
    icon: "solar:planet-bold-duotone",
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "houses",
    label: "Houses",
    icon: "solar:home-2-bold-duotone",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "aspects",
    label: "Aspects",
    icon: "solar:graph-bold-duotone",
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "forecasts",
    label: "Forecasts",
    icon: "solar:stars-bold-duotone",
    color: "from-emerald-500 to-teal-500",
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

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

// ============ INTERFACES ============

interface Planet {
  name: string;
  fullDegree: number;
  normDegree: number;
  speed: number;
  isRetro: string;
  sign: string;
  house: number;
}

interface HouseCusp {
  house: number;
  sign: string;
  degree: number;
}

interface PlanetAspect {
  solar_return_planet: string;
  natal_planet: string;
  type: string;
  orb: number;
}

interface PlanetReport {
  name: string;
  isRetro: string;
  sign: string;
  forecast: string[];
}

interface AspectReport {
  solar_return_planet: string;
  natal_planet: string;
  type: string;
  orb: number;
  forecast: string;
}

interface SolarReturnData {
  solar_year: number;
  birth_data: {
    day: number;
    month: number;
    year: number;
    hour: number;
    min: number;
    lat: number;
    lon: number;
    tzone: number;
  };
  details: {
    native_birth_date: string;
    native_age: number;
    solar_return_date: string;
  };
  planets: Planet[];
  houseCusps: {
    houses: HouseCusp[];
    ascendant: number;
    midheaven: number;
    vertex: number;
  };
  planetAspects: PlanetAspect[];
  planetReport: PlanetReport[];
  aspectsReport: AspectReport[];
}

interface SolarReturnResponse {
  status: string;
  message?: string;
  data: SolarReturnData;
}

// ============ MAIN COMPONENT ============

function SolarReturnPage() {
  // const [user, setUser] = useState(getUser());
  // useEffect(() => {
  //   setUser(getUser());
  // }, []);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SolarReturnResponse | null>(null);
  const [solarYear, setSolarYear] = useState<number>(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState<string>("overview");

  const handleCalculate = async () => {
    if (!selectedPerson) {
      Swal.fire({
        icon: "warning",
        title: "Select Person",
        text: "Please select a person to generate solar return report.",
        background: "#1f2937",
        color: "#f3f4f6",
        confirmButtonColor: "#8b5cf6",
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
        solar_year: solarYear,
      };

      const response: any = await api.post(
        "/api/mainapi/solar-return",
        requestBody,
      );

      if (response && response.status === 200 && response.data) {
        setResult({
          status: "Pass",
          data: response.data?.data || response.data,
        });
      } else {
        throw new Error(
          response?.data?.message ||
            response?.error ||
            "Failed to fetch solar return data",
        );
      }
    } catch (error: unknown) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error instanceof Error ? error.message : "Something went wrong!",
        background: "#1f2937",
        color: "#f3f4f6",
        confirmButtonColor: "#8b5cf6",
      });
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  // Stats calculation
  const getStats = () => {
    if (!result?.data) return null;
    return {
      planets: result.data.planets.length,
      aspects: result.data.planetAspects.length,
      retrograde: result.data.planets.filter((p) => p.isRetro === "true")
        .length,
      houses: result.data.houseCusps.houses.length,
    };
  };

  const stats = result ? getStats() : null;

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 py-8 ">
        {/* Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden bg-linear-to-r from-violet-700 via-purple-700 to-fuchsia-700 rounded-2xl p-6 md:p-8 text-white shadow-xl mb-8"
        >
          {/* Soft Glow Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>

          {/* Watermark Icon */}
          <div className="absolute top-4 right-8 opacity-20">
            <Iconify icon="solar:sun-2-bold-duotone" width={110} height={110} />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Iconify
                  icon="solar:sun-2-bold-duotone"
                  width={40}
                  height={40}
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium">
                    Solar Return
                  </span>
                  <span className="px-2 py-0.5 bg-amber-400/30 rounded-full text-xs font-medium">
                    {solarYear}
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold">
                  Solar Return Chart
                </h1>

                <p className="text-white/80 mt-1 max-w-xl">
                  Discover your cosmic birthday blueprint and yearly forecast
                  through the ancient wisdom of Solar Return astrology.
                </p>
              </div>
            </div>

            {/* Date Badge */}
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/20">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Iconify icon="solar:calendar-bold" width={20} height={20} />
              </div>
              <div>
                <p className="font-semibold">
                  {new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <p className="text-sm text-white/70">
                  {new Date().getFullYear()}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Input Section */}
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
                className="mt-6 w-full py-3.5 px-4 bg-primary text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed  hover:-translate-y-0.5"
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
                    Generate
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
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/50 dark:to-purple-900/50 flex items-center justify-center">
                          <Iconify
                            icon="solar:sun-2-bold-duotone"
                            width={48}
                            className="text-violet-500 animate-pulse"
                          />
                        </div>
                        <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-transparent border-t-violet-500 border-r-purple-500 animate-spin" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Calculating Solar Return
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Analyzing planetary positions for your cosmic
                        birthday...
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
                  {/* Solar Return Summary Card */}
                  <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="relative overflow-hidden bg-linear-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-2xl p-6 text-white shadow-xl shadow-purple-500/30"
                  >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative flex flex-wrap items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <Iconify icon="solar:sun-2-bold-duotone" width={36} />
                        </div>
                        <div>
                          <h2 className="text-2xl md:text-3xl font-bold">
                            Solar Return {result.data.solar_year}
                          </h2>
                          <p className="text-white/80">
                            Your cosmic forecast for the year ahead
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-6">
                        <div className="text-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl">
                          <p className="text-3xl font-bold">
                            {result.data.details.native_age}
                          </p>
                          <p className="text-sm text-white/70">Years Old</p>
                        </div>
                        <div className="text-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl">
                          <p className="text-lg font-semibold">
                            {
                              result.data.details.solar_return_date.split(
                                " ",
                              )[0]
                            }
                          </p>
                          <p className="text-sm text-white/70">Return Date</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Stats Cards */}
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4"
                  >
                    <StatsCard
                      icon="solar:planet-bold-duotone"
                      label="Planets"
                      value={stats?.planets || 0}
                      color="from-amber-500 to-orange-500"
                      shadowColor="shadow-amber-500/20"
                    />
                    <StatsCard
                      icon="solar:graph-bold-duotone"
                      label="Aspects"
                      value={stats?.aspects || 0}
                      color="from-blue-500 to-cyan-500"
                      shadowColor="shadow-blue-500/20"
                    />
                    <StatsCard
                      icon="solar:refresh-bold-duotone"
                      label="Retrograde"
                      value={stats?.retrograde || 0}
                      color="from-rose-500 to-pink-500"
                      shadowColor="shadow-rose-500/20"
                    />
                    <StatsCard
                      icon="solar:home-2-bold-duotone"
                      label="Houses"
                      value={stats?.houses || 0}
                      color="from-emerald-500 to-teal-500"
                      shadowColor="shadow-emerald-500/20"
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
                                ? "text-violet-600 dark:text-violet-400"
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
                                layoutId="activeTabSolar"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-purple-500"
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
                            <OverviewTab data={result.data} />
                          )}
                          {activeTab === "planets" && (
                            <PlanetsTab planets={result.data.planets} />
                          )}
                          {activeTab === "houses" && (
                            <HousesTab houseCusps={result.data.houseCusps} />
                          )}
                          {activeTab === "aspects" && (
                            <AspectsTab aspects={result.data.planetAspects} />
                          )}
                          {activeTab === "forecasts" && (
                            <ForecastsTab
                              planetReport={result.data.planetReport}
                              aspectsReport={result.data.aspectsReport}
                            />
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
                  <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/50 dark:to-purple-900/50 flex items-center justify-center mb-6 shadow-xl shadow-violet-200/50 dark:shadow-none">
                    <Iconify
                      icon="solar:sun-2-bold-duotone"
                      width={56}
                      className="text-violet-500"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    Calculate Your Solar Return
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Select a profile and year to generate your Solar Return
                    chart and discover what the cosmic energies have in store
                    for your next birthday year.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-violet-50 dark:bg-violet-900/30 rounded-lg text-violet-600 dark:text-violet-400 text-sm">
                      <Iconify icon="solar:planet-bold" width={18} />
                      <span>Planetary Positions</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400 text-sm">
                      <Iconify icon="solar:home-2-bold" width={18} />
                      <span>House Placements</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-fuchsia-50 dark:bg-fuchsia-900/30 rounded-lg text-fuchsia-600 dark:text-fuchsia-400 text-sm">
                      <Iconify icon="solar:stars-bold" width={18} />
                      <span>Yearly Forecasts</span>
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

// ============ TAB COMPONENTS ============

function OverviewTab({ data }: { data: SolarReturnData }) {
  const ascendant = data.planets.find((p) => p.name === "Ascendant");
  const sun = data.planets.find((p) => p.name === "Sun");
  const moon = data.planets.find((p) => p.name === "Moon");

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Key Placements */}
      <Section title="Key Placements" icon="solar:star-shine-bold-duotone">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ascendant && (
            <KeyPlacementCard planet={ascendant} type="Ascendant" />
          )}
          {sun && <KeyPlacementCard planet={sun} type="Sun" />}
          {moon && <KeyPlacementCard planet={moon} type="Moon" />}
        </div>
      </Section>

      {/* Angular Points */}
      <Section title="Angular Points" icon="solar:compass-bold-duotone">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AngularPointCard
            label="Ascendant"
            value={data.houseCusps.ascendant}
            icon="solar:arrow-up-bold"
            color="from-green-500 to-emerald-500"
          />
          <AngularPointCard
            label="Midheaven (MC)"
            value={data.houseCusps.midheaven}
            icon="solar:crown-bold"
            color="from-amber-500 to-orange-500"
          />
          <AngularPointCard
            label="Vertex"
            value={data.houseCusps.vertex}
            icon="solar:star-bold"
            color="from-violet-500 to-purple-500"
          />
        </div>
      </Section>

      {/* Birth Data */}
      <Section title="Chart Information" icon="solar:info-circle-bold-duotone">
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <InfoItem
              label="Birth Date"
              value={data.details.native_birth_date}
              icon="solar:calendar-bold"
            />
            <InfoItem
              label="Location"
              value={`${data.birth_data.lat.toFixed(2)}°, ${data.birth_data.lon.toFixed(2)}°`}
              icon="solar:map-point-bold"
            />
            <InfoItem
              label="Timezone"
              value={`UTC ${data.birth_data.tzone >= 0 ? "+" : ""}${data.birth_data.tzone}`}
              icon="solar:clock-circle-bold"
            />
            <InfoItem
              label="Solar Return"
              value={data.details.solar_return_date}
              icon="solar:sun-2-bold"
            />
          </div>
        </div>
      </Section>
    </motion.div>
  );
}

function PlanetsTab({ planets }: { planets: Planet[] }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {planets.map((planet, idx) => (
          <motion.div
            key={planet.name}
            variants={itemVariants}
            className={`${PLANET_CONFIG[planet.name]?.bgColor || "bg-gray-50 dark:bg-gray-800"} rounded-xl p-5 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${PLANET_CONFIG[planet.name]?.gradient || "from-gray-400 to-gray-500"} flex items-center justify-center text-white shadow-lg flex-shrink-0`}
              >
                <Iconify
                  icon={
                    PLANET_CONFIG[planet.name]?.icon ||
                    "solar:planet-bold-duotone"
                  }
                  width={28}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                    {planet.name}
                  </h4>
                  {planet.isRetro === "true" && (
                    <span className="px-2.5 py-1 bg-gradient-to-r from-orange-500 to-rose-500 text-white text-xs font-medium rounded-full shadow-sm">
                      ℞ Retrograde
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                    <Iconify
                      icon={
                        SIGN_CONFIG[planet.sign]?.icon || "mdi:zodiac-aries"
                      }
                      width={20}
                      style={{ color: SIGN_CONFIG[planet.sign]?.color }}
                    />
                    <span className="font-medium">{planet.sign}</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {planet.normDegree.toFixed(2)}°
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-gray-800 rounded-lg">
                    <Iconify
                      icon="solar:home-2-bold"
                      width={14}
                      className="text-gray-400"
                    />
                    <span className="text-gray-600 dark:text-gray-400">
                      House {planet.house}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-gray-800 rounded-lg">
                    <Iconify
                      icon="solar:speedometer-bold"
                      width={14}
                      className="text-gray-400"
                    />
                    <span className="text-gray-600 dark:text-gray-400">
                      {planet.speed.toFixed(3)}°/day
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function HousesTab({
  houseCusps,
}: {
  houseCusps: SolarReturnData["houseCusps"];
}) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Angular Points */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-5 text-center border border-green-200/50 dark:border-green-800/50"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-green-500/30">
            <Iconify icon="solar:arrow-up-bold" width={24} />
          </div>
          <p className="text-xs text-green-600 dark:text-green-400 uppercase font-medium mb-1">
            Ascendant
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {houseCusps.ascendant.toFixed(2)}°
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-5 text-center border border-amber-200/50 dark:border-amber-800/50"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-amber-500/30">
            <Iconify icon="solar:crown-bold" width={24} />
          </div>
          <p className="text-xs text-amber-600 dark:text-amber-400 uppercase font-medium mb-1">
            Midheaven (MC)
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {houseCusps.midheaven.toFixed(2)}°
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl p-5 text-center border border-violet-200/50 dark:border-violet-800/50"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-violet-500/30">
            <Iconify icon="solar:star-bold" width={24} />
          </div>
          <p className="text-xs text-violet-600 dark:text-violet-400 uppercase font-medium mb-1">
            Vertex
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {houseCusps.vertex.toFixed(2)}°
          </p>
        </motion.div>
      </div>

      {/* Houses Grid */}
      <Section title="House Cusps" icon="solar:home-2-bold-duotone">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {houseCusps.houses.map((house, idx) => (
            <motion.div
              key={house.house}
              variants={itemVariants}
              className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg shadow-violet-500/20">
                  {house.house}
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    House {house.house}
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {house.sign}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Iconify
                  icon={SIGN_CONFIG[house.sign]?.icon || "mdi:zodiac-aries"}
                  width={18}
                  style={{ color: SIGN_CONFIG[house.sign]?.color }}
                />
                <span className="text-gray-600 dark:text-gray-400">
                  {house.degree.toFixed(2)}°
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>
    </motion.div>
  );
}

function AspectsTab({ aspects }: { aspects: PlanetAspect[] }) {
  const groupedAspects = aspects.reduce(
    (acc, aspect) => {
      if (!acc[aspect.type]) acc[aspect.type] = [];
      acc[aspect.type].push(aspect);
      return acc;
    },
    {} as Record<string, PlanetAspect[]>,
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Aspect Summary */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(groupedAspects).map(([type, aspectList]) => (
          <div
            key={type}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border ${ASPECT_CONFIG[type]?.bgColor} border-gray-200/50 dark:border-gray-700/50`}
          >
            <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">
              <Iconify
                icon={ASPECT_CONFIG[type]?.icon || "solar:circle-bold"}
                width={18}
                style={{ color: ASPECT_CONFIG[type]?.color }}
              />
            </div>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {type}
            </span>
            <span
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-sm font-bold"
              style={{ backgroundColor: ASPECT_CONFIG[type]?.color }}
            >
              {aspectList.length}
            </span>
          </div>
        ))}
      </div>

      {/* Aspects List */}
      <div className="space-y-3">
        {aspects.map((aspect, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl hover:shadow-md transition-all"
          >
            {/* Solar Return Planet */}
            <div className="flex items-center gap-3 min-w-[140px]">
              <div
                className={`w-10 h-10 rounded-xl ${PLANET_CONFIG[aspect.solar_return_planet]?.bgColor} flex items-center justify-center`}
              >
                <Iconify
                  icon={
                    PLANET_CONFIG[aspect.solar_return_planet]?.icon ||
                    "solar:planet-bold-duotone"
                  }
                  width={22}
                  style={{
                    color: PLANET_CONFIG[aspect.solar_return_planet]?.color,
                  }}
                />
              </div>
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {aspect.solar_return_planet}
              </span>
            </div>

            {/* Aspect Type */}
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-xl ${ASPECT_CONFIG[aspect.type]?.bgColor}`}
            >
              <Iconify
                icon={ASPECT_CONFIG[aspect.type]?.icon || "solar:circle-bold"}
                width={18}
                style={{ color: ASPECT_CONFIG[aspect.type]?.color }}
              />
              <span
                className="text-sm font-semibold"
                style={{ color: ASPECT_CONFIG[aspect.type]?.color }}
              >
                {aspect.type}
              </span>
            </div>

            {/* Natal Planet */}
            <div className="flex items-center gap-3 min-w-[140px]">
              <div
                className={`w-10 h-10 rounded-xl ${PLANET_CONFIG[aspect.natal_planet]?.bgColor} flex items-center justify-center`}
              >
                <Iconify
                  icon={
                    PLANET_CONFIG[aspect.natal_planet]?.icon ||
                    "solar:planet-bold-duotone"
                  }
                  width={22}
                  style={{ color: PLANET_CONFIG[aspect.natal_planet]?.color }}
                />
              </div>
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {aspect.natal_planet}
              </span>
            </div>

            {/* Orb */}
            <div className="ml-auto px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Orb: {aspect.orb.toFixed(2)}°
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function ForecastsTab({
  planetReport,
  aspectsReport,
}: {
  planetReport: PlanetReport[];
  aspectsReport: AspectReport[];
}) {
  const [expandedPlanet, setExpandedPlanet] = useState<string | null>(null);
  const [expandedAspect, setExpandedAspect] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<"planets" | "aspects">(
    "planets",
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Section Toggle */}
      <div className="flex gap-2 p-1.5 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit">
        <button
          onClick={() => setActiveSection("planets")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeSection === "planets"
              ? "bg-white dark:bg-gray-700 text-violet-600 dark:text-violet-400 shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          }`}
        >
          <Iconify icon="solar:planet-bold-duotone" width={18} />
          Planet Forecasts
          <span className="px-2 py-0.5 bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400 text-xs rounded-full">
            {planetReport.length}
          </span>
        </button>
        <button
          onClick={() => setActiveSection("aspects")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeSection === "aspects"
              ? "bg-white dark:bg-gray-700 text-violet-600 dark:text-violet-400 shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          }`}
        >
          <Iconify icon="solar:graph-bold-duotone" width={18} />
          Aspect Forecasts
          <span className="px-2 py-0.5 bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400 text-xs rounded-full">
            {aspectsReport.length}
          </span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeSection === "planets" ? (
          <motion.div
            key="planets"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {planetReport.map((report) => (
              <motion.div
                key={report.name}
                variants={itemVariants}
                className="bg-white dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl overflow-hidden hover:shadow-lg transition-all"
              >
                <button
                  onClick={() =>
                    setExpandedPlanet(
                      expandedPlanet === report.name ? null : report.name,
                    )
                  }
                  className="w-full flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${PLANET_CONFIG[report.name]?.gradient || "from-gray-400 to-gray-500"} flex items-center justify-center text-white shadow-lg`}
                    >
                      <Iconify
                        icon={
                          PLANET_CONFIG[report.name]?.icon ||
                          "solar:planet-bold-duotone"
                        }
                        width={24}
                      />
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                        {report.name}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Iconify
                          icon={
                            SIGN_CONFIG[report.sign]?.icon || "mdi:zodiac-aries"
                          }
                          width={16}
                          style={{ color: SIGN_CONFIG[report.sign]?.color }}
                        />
                        <span>{report.sign}</span>
                        {report.isRetro === "true" && (
                          <span className="px-2 py-0.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white text-xs rounded-full">
                            ℞
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <motion.div
                    animate={{
                      rotate: expandedPlanet === report.name ? 180 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                    className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
                  >
                    <Iconify
                      icon="solar:alt-arrow-down-bold"
                      width={20}
                      className="text-gray-400"
                    />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {expandedPlanet === report.name && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-2 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-900/50">
                        <div className="space-y-3">
                          {report.forecast
                            .filter((f) => f.trim() !== "")
                            .map((paragraph, idx) => (
                              <p
                                key={idx}
                                className="text-gray-600 dark:text-gray-300 leading-relaxed"
                              >
                                {paragraph}
                              </p>
                            ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="aspects"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {aspectsReport.map((report, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="bg-white dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl overflow-hidden hover:shadow-lg transition-all"
              >
                <button
                  onClick={() =>
                    setExpandedAspect(expandedAspect === idx ? null : idx)
                  }
                  className="w-full flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-10 h-10 rounded-xl ${PLANET_CONFIG[report.solar_return_planet]?.bgColor} flex items-center justify-center`}
                      >
                        <Iconify
                          icon={
                            PLANET_CONFIG[report.solar_return_planet]?.icon ||
                            "solar:planet-bold-duotone"
                          }
                          width={20}
                          style={{
                            color:
                              PLANET_CONFIG[report.solar_return_planet]?.color,
                          }}
                        />
                      </div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {report.solar_return_planet}
                      </span>
                    </div>

                    <div
                      className={`px-3 py-1.5 rounded-lg ${ASPECT_CONFIG[report.type]?.bgColor}`}
                    >
                      <span
                        className="text-sm font-semibold"
                        style={{ color: ASPECT_CONFIG[report.type]?.color }}
                      >
                        {report.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div
                        className={`w-10 h-10 rounded-xl ${PLANET_CONFIG[report.natal_planet]?.bgColor} flex items-center justify-center`}
                      >
                        <Iconify
                          icon={
                            PLANET_CONFIG[report.natal_planet]?.icon ||
                            "solar:planet-bold-duotone"
                          }
                          width={20}
                          style={{
                            color: PLANET_CONFIG[report.natal_planet]?.color,
                          }}
                        />
                      </div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {report.natal_planet}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      Orb: {report.orb}°
                    </span>
                    <motion.div
                      animate={{ rotate: expandedAspect === idx ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
                    >
                      <Iconify
                        icon="solar:alt-arrow-down-bold"
                        width={20}
                        className="text-gray-400"
                      />
                    </motion.div>
                  </div>
                </button>

                <AnimatePresence>
                  {expandedAspect === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-2 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-900/50">
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {report.forecast}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ============ HELPER COMPONENTS ============

function InfoBadge({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200/50 dark:border-gray-700/50">
      <Iconify icon={icon} width={16} className="text-violet-500" />
      <span className="text-gray-600 dark:text-gray-300 text-sm">{value}</span>
    </div>
  );
}

function StatsCard({
  icon,
  label,
  value,
  color,
  shadowColor,
}: {
  icon: string;
  label: string;
  value: number;
  color: string;
  shadowColor: string;
}) {
  return (
    <motion.div
      variants={itemVariants}
      className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-lg ${shadowColor}`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg`}
        >
          <Iconify icon={icon} width={28} />
        </div>
        <div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        </div>
      </div>
    </motion.div>
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
    <motion.div variants={itemVariants}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-violet-500/20">
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

function KeyPlacementCard({ planet, type }: { planet: Planet; type: string }) {
  const config = PLANET_CONFIG[type];

  return (
    <motion.div
      variants={itemVariants}
      className={`${config?.bgColor} rounded-xl p-5 border border-gray-200/50 dark:border-gray-700/50`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${config?.gradient} flex items-center justify-center text-white shadow-lg`}
        >
          <Iconify
            icon={config?.icon || "solar:planet-bold-duotone"}
            width={28}
          />
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium mb-1">
            {type}
          </p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {planet.sign}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {planet.normDegree.toFixed(2)}° • House {planet.house}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function AngularPointCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: string;
  color: string;
}) {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 text-center border border-gray-200/50 dark:border-gray-700/50"
    >
      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white mx-auto mb-3 shadow-lg`}
      >
        <Iconify icon={icon} width={24} />
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium mb-1">
        {label}
      </p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {value.toFixed(2)}°
      </p>
    </motion.div>
  );
}

function InfoItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
        <Iconify icon={icon} width={16} />
        <span className="text-xs uppercase font-medium">{label}</span>
      </div>
      <p className="font-semibold text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}

export default SolarReturnPage;
