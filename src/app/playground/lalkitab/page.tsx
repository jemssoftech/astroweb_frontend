"use client";

import { useState, useCallback, useEffect } from "react";
import PersonSelector from "@/src/components/PersonSelector";
import Iconify from "@/src/components/Iconify";
import { Person } from "@/src/lib/models";
import Swal from "sweetalert2";
import { getUser } from "@/src/lib/auth";
import { motion, AnimatePresence } from "framer-motion";

// ============ TYPES ============

interface LalKitabData {
  horoscope?: any;
  debts?: any;
  houses?: any;
  planets?: any;
  remedies?: Record<string, any>;
}

interface LalKitabResponse {
  status: "Pass" | "Partial" | "Fail";
  message: string;
  data: LalKitabData;
  errors?: Record<string, string>;
  meta: {
    total_apis: number;
    successful: number;
    failed: number;
    success_rate: string;
    timestamp: string;
  };
}

// ============ CONSTANTS ============

const PLANETS = [
  {
    value: "Sun",
    label: "Sun",
    hindi: "सूर्य",
    icon: "solar:sun-bold-duotone",
    color: "#F59E0B",
    gradient: "from-amber-400 to-orange-500",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
  },
  {
    value: "Moon",
    label: "Moon",
    hindi: "चंद्र",
    icon: "solar:moon-bold-duotone",
    color: "#6B7280",
    gradient: "from-slate-400 to-gray-500",
    bgColor: "bg-slate-50 dark:bg-slate-800/50",
  },
  {
    value: "Mars",
    label: "Mars",
    hindi: "मंगल",
    icon: "solar:flame-bold-duotone",
    color: "#EF4444",
    gradient: "from-red-400 to-rose-500",
    bgColor: "bg-red-50 dark:bg-red-900/20",
  },
  {
    value: "Mercury",
    label: "Mercury",
    hindi: "बुध",
    icon: "solar:wind-bold-duotone",
    color: "#22C55E",
    gradient: "from-green-400 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-900/20",
  },
  {
    value: "Jupiter",
    label: "Jupiter",
    hindi: "गुरु",
    icon: "solar:crown-bold-duotone",
    color: "#F97316",
    gradient: "from-orange-400 to-amber-500",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
  },
  {
    value: "Venus",
    label: "Venus",
    hindi: "शुक्र",
    icon: "solar:heart-bold-duotone",
    color: "#EC4899",
    gradient: "from-pink-400 to-rose-500",
    bgColor: "bg-pink-50 dark:bg-pink-900/20",
  },
  {
    value: "Saturn",
    label: "Saturn",
    hindi: "शनि",
    icon: "solar:clock-circle-bold-duotone",
    color: "#6366F1",
    gradient: "from-indigo-400 to-violet-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
  },
  {
    value: "Rahu",
    label: "Rahu",
    hindi: "राहु",
    icon: "solar:black-hole-bold-duotone",
    color: "#8B5CF6",
    gradient: "from-violet-400 to-purple-500",
    bgColor: "bg-violet-50 dark:bg-violet-900/20",
  },
  {
    value: "Ketu",
    label: "Ketu",
    hindi: "केतु",
    icon: "solar:star-bold-duotone",
    color: "#D97706",
    gradient: "from-amber-500 to-yellow-600",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
  },
];

const TABS = [
  {
    key: "overview",
    label: "Overview",
    icon: "solar:widget-5-bold-duotone",
    color: "from-red-500 to-rose-500",
  },
  {
    key: "horoscope",
    label: "Horoscope",
    icon: "solar:chart-2-bold-duotone",
    color: "from-amber-500 to-orange-500",
  },
  {
    key: "houses",
    label: "Houses",
    icon: "solar:home-2-bold-duotone",
    color: "from-blue-500 to-cyan-500",
  },
  {
    key: "planets",
    label: "Planets",
    icon: "solar:planet-bold-duotone",
    color: "from-purple-500 to-violet-500",
  },
  {
    key: "debts",
    label: "Debts (Rin)",
    icon: "solar:scale-bold-duotone",
    color: "from-emerald-500 to-teal-500",
  },
  {
    key: "remedies",
    label: "Remedies",
    icon: "solar:hand-heart-bold-duotone",
    color: "from-pink-500 to-rose-500",
  },
];

const DEBT_TYPES = [
  {
    key: "pitra_rin",
    label: "Pitra Rin",
    desc: "Ancestral Debt",
    icon: "solar:users-group-rounded-bold-duotone",
    gradient: "from-red-500 to-rose-500",
  },
  {
    key: "stri_rin",
    label: "Stri Rin",
    desc: "Spouse Debt",
    icon: "solar:heart-bold-duotone",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    key: "mata_rin",
    label: "Mata Rin",
    desc: "Mother's Debt",
    icon: "solar:user-heart-bold-duotone",
    gradient: "from-purple-500 to-violet-500",
  },
  {
    key: "swayam_rin",
    label: "Swayam Rin",
    desc: "Self Debt",
    icon: "solar:user-bold-duotone",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    key: "bhratri_rin",
    label: "Bhratri Rin",
    desc: "Sibling Debt",
    icon: "solar:users-group-two-rounded-bold-duotone",
    gradient: "from-green-500 to-emerald-500",
  },
];

// ============ ANIMATIONS ============

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// ============ MAIN COMPONENT ============

export default function LalKitabPage() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(false);
  const [lalKitabData, setLalKitabData] = useState<LalKitabResponse | null>(
    null,
  );
  const [user, setUser] = useState(getUser());
  useEffect(() => {
    setUser(getUser());
  }, []);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [selectedRemedyPlanet, setSelectedRemedyPlanet] =
    useState<string>("Sun");

  const handlePersonSelected = useCallback((person: Person) => {
    setSelectedPerson(person);
    setLalKitabData(null);
  }, []);

  const getBirthDataPayload = useCallback((person: Person) => {
    const birthDate = new Date(person.BirthTime);
    let tzone = 0;
    if (person.TimezoneOffset) {
      const [h, m] = person.TimezoneOffset.replace("+", "").split(":");
      const sign = person.TimezoneOffset.startsWith("-") ? -1 : 1;
      tzone = sign * (parseInt(h) + parseInt(m) / 60);
    }

    return {
      day: birthDate.getUTCDate(),
      month: birthDate.getUTCMonth() + 1,
      year: birthDate.getUTCFullYear(),
      hour: birthDate.getUTCHours(),
      min: birthDate.getUTCMinutes(),
      lat: person.Latitude,
      lon: person.Longitude,
      tzone: tzone,
    };
  }, []);

  const fetchLalKitab = async () => {
    if (!selectedPerson) {
      Swal.fire({
        icon: "warning",
        title: "Select Person",
        text: "Please select a person first",
        background: "#1f2937",
        color: "#f3f4f6",
        confirmButtonColor: "#dc2626",
      });
      return;
    }
    const authToken = user?.token;
    const apiKey = (user as any)?.userApiKey || (user as any)?.apikey || "";

    setLoading(true);
    try {
      const payload = getBirthDataPayload(selectedPerson);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NEXT_JS_API_URL}/api/mainapi/lalkitab`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken || ""}`,
            "X-API-KEY": apiKey || "",
          },
          body: JSON.stringify(payload),
        },
      );

      const result: LalKitabResponse = await response.json();
      if (result.status === "Fail") {
        throw new Error(result.message || "Failed to fetch Lal Kitab data");
      }
      setLalKitabData(result);

      if (result.status === "Partial") {
        Swal.fire({
          icon: "warning",
          title: "Partial Data",
          text: result.message,
          timer: 3000,
          showConfirmButton: false,
          background: "#1f2937",
          color: "#f3f4f6",
        });
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to get Lal Kitab data";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        background: "#1f2937",
        color: "#f3f4f6",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };

  // Get stats
  const getStats = () => {
    if (!lalKitabData?.data) return null;
    const remediesCount = lalKitabData.data.remedies
      ? Object.values(lalKitabData.data.remedies).reduce(
          (acc: number, val: any) => {
            return acc + (Array.isArray(val) ? val.length : val ? 1 : 0);
          },
          0,
        )
      : 0;

    return {
      horoscope: lalKitabData.data.horoscope ? true : false,
      houses: Array.isArray(lalKitabData.data.houses)
        ? lalKitabData.data.houses.length
        : 12,
      planets: Array.isArray(lalKitabData.data.planets)
        ? lalKitabData.data.planets.length
        : 9,
      debts: lalKitabData.data.debts ? true : false,
      remedies: remediesCount,
    };
  };

  const stats = lalKitabData ? getStats() : null;

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 py-8 ">
        {/* Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden bg-gradient-to-r from-red-700 via-rose-700 to-orange-700 rounded-2xl p-6 md:p-8 text-white shadow-xl mb-8"
        >
          {/* Soft Glow Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>

          {/* Watermark Icon */}
          <div className="absolute top-4 right-8 opacity-20">
            <Iconify
              icon="solar:book-2-bold-duotone"
              width={110}
              height={110}
            />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Iconify
                  icon="solar:book-2-bold-duotone"
                  width={40}
                  height={40}
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium">
                    लाल किताब
                  </span>
                  <span className="px-2 py-0.5 bg-amber-400/30 rounded-full text-xs font-medium">
                    Vedic Remedies
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold">
                  Lal Kitab Analysis
                </h1>

                <p className="text-white/80 mt-1 max-w-xl">
                  Traditional Vedic astrology with powerful remedies (उपाय) for
                  all nine planets to mitigate karmic afflictions.
                </p>
              </div>
            </div>

            {/* API Info Badge */}
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/20">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Iconify icon="solar:code-bold" width={20} height={20} />
              </div>
              <div>
                <p className="font-semibold">13 Calls</p>
                <p className="text-sm text-white/70">Total APIs</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3 space-y-4"
          >
            {/* Person Selector Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center text-white">
                  <Iconify icon="solar:user-rounded-bold" width={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Select Profile
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Choose a person
                  </p>
                </div>
              </div>

              <PersonSelector onPersonSelected={handlePersonSelected} />

              <button
                onClick={fetchLalKitab}
                disabled={loading || !selectedPerson}
                className={`mt-4 w-full h-12 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                  selectedPerson && !loading
                    ? "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-lg shadow-red-500/30 hover:shadow-xl hover:-translate-y-0.5"
                    : "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Calculating...</span>
                  </>
                ) : (
                  <>
                    <Iconify icon="solar:book-2-bold" width={20} />
                    <span>Generate Analysis</span>
                  </>
                )}
              </button>

              {/* Selected Person Info */}
              <AnimatePresence>
                {selectedPerson && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center text-white font-bold">
                        {selectedPerson.Name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {selectedPerson.Name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(
                            selectedPerson.BirthTime,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Info Card */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl border border-red-200/50 dark:border-red-800/50 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center text-white">
                  <Iconify icon="solar:info-circle-bold" width={20} />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  About Lal Kitab
                </h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Lal Kitab is renowned for its simple and powerful remedies
                (उपाय) to mitigate planetary afflictions and karmic debts.
              </p>
              <div className="space-y-2">
                {[
                  {
                    icon: "solar:chart-2-bold",
                    label: "4 Base APIs",
                    desc: "Core Analysis",
                  },
                  {
                    icon: "solar:hand-heart-bold",
                    label: "9 Remedy APIs",
                    desc: "All Planets",
                  },
                  {
                    icon: "solar:database-bold",
                    label: "13 Total Calls",
                    desc: "Complete Data",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <Iconify
                      icon={item.icon}
                      width={16}
                      className="text-red-500"
                    />
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {item.label}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {item.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Planets */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg p-5">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Iconify
                  icon="solar:planet-bold-duotone"
                  width={20}
                  className="text-red-500"
                />
                Nine Planets
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {PLANETS.map((planet) => (
                  <div
                    key={planet.value}
                    className={`${planet.bgColor} rounded-xl p-2 text-center`}
                  >
                    <Iconify
                      icon={planet.icon}
                      width={24}
                      style={{ color: planet.color }}
                      className="mx-auto mb-1"
                    />
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {planet.label}
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">
                      {planet.hindi}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-9"
          >
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
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/50 dark:to-orange-900/50 flex items-center justify-center">
                          <Iconify
                            icon="solar:book-2-bold-duotone"
                            width={48}
                            className="text-red-500 animate-pulse"
                          />
                        </div>
                        <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-transparent border-t-red-500 border-r-rose-500 animate-spin" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Analyzing Lal Kitab
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Fetching horoscope, planets, debts & remedies...
                      </p>
                      <div className="mt-4 flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.1}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {lalKitabData ? (
              <div className="space-y-6">
                {/* Stats Cards */}
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-2 md:grid-cols-5 gap-4"
                >
                  <StatsCard
                    icon="solar:chart-2-bold-duotone"
                    label="Horoscope"
                    value={stats?.horoscope ? "✓" : "-"}
                    color="from-red-500 to-rose-500"
                  />
                  <StatsCard
                    icon="solar:home-2-bold-duotone"
                    label="Houses"
                    value={stats?.houses || 0}
                    color="from-blue-500 to-cyan-500"
                  />
                  <StatsCard
                    icon="solar:planet-bold-duotone"
                    label="Planets"
                    value={stats?.planets || 0}
                    color="from-purple-500 to-violet-500"
                  />
                  <StatsCard
                    icon="solar:scale-bold-duotone"
                    label="Debts"
                    value={stats?.debts ? "✓" : "-"}
                    color="from-amber-500 to-orange-500"
                  />
                  <StatsCard
                    icon="solar:hand-heart-bold-duotone"
                    label="Remedies"
                    value={stats?.remedies || 0}
                    color="from-green-500 to-emerald-500"
                  />
                </motion.div>

                {/* Tabs */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
                  <div className="border-b border-gray-200 dark:border-gray-800">
                    <div className="flex overflow-x-auto scrollbar-hide">
                      {TABS.map((tab) => (
                        <button
                          key={tab.key}
                          onClick={() => setActiveTab(tab.key)}
                          className={`relative flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap transition-all ${
                            activeTab === tab.key
                              ? "text-red-600 dark:text-red-400"
                              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                              activeTab === tab.key
                                ? `bg-gradient-to-br ${tab.color} text-white shadow-lg`
                                : "bg-gray-100 dark:bg-gray-800"
                            }`}
                          >
                            <Iconify icon={tab.icon} width={18} />
                          </div>
                          <span className="hidden md:inline">{tab.label}</span>
                          {activeTab === tab.key && (
                            <motion.div
                              layoutId="activeTabLalKitab"
                              className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 to-rose-500"
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
                          <OverviewSection
                            data={lalKitabData.data}
                            setActiveTab={setActiveTab}
                          />
                        )}
                        {activeTab === "horoscope" && (
                          <DataSection
                            data={lalKitabData.data.horoscope}
                            title="Lal Kitab Horoscope"
                          />
                        )}
                        {activeTab === "houses" && (
                          <HousesSection houses={lalKitabData.data.houses} />
                        )}
                        {activeTab === "planets" && (
                          <PlanetsSection planets={lalKitabData.data.planets} />
                        )}
                        {activeTab === "debts" && (
                          <DebtsSection debts={lalKitabData.data.debts} />
                        )}
                        {activeTab === "remedies" && (
                          <>
                            {/* "Remedies are not just rituals; they are shifts in energy." */}
                            <RemediesSection
                              remedies={lalKitabData.data.remedies}
                              selectedPlanet={selectedRemedyPlanet}
                              setSelectedPlanet={setSelectedRemedyPlanet}
                            />
                          </>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* API Meta Info */}
                {lalKitabData.meta && (
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-red-200/50 dark:border-red-800/50">
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Iconify
                          icon="solar:server-bold"
                          width={16}
                          className="text-red-500"
                        />
                        <span className="text-gray-600 dark:text-gray-400">
                          APIs: {lalKitabData.meta.successful}/
                          {lalKitabData.meta.total_apis}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Iconify
                          icon="solar:chart-bold"
                          width={16}
                          className="text-green-500"
                        />
                        <span className="text-gray-600 dark:text-gray-400">
                          Success: {lalKitabData.meta.success_rate}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Iconify
                          icon="solar:clock-circle-bold"
                          width={16}
                          className="text-blue-500"
                        />
                        <span className="text-gray-600 dark:text-gray-400">
                          {new Date(
                            lalKitabData.meta.timestamp,
                          ).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <EmptyState />
            )}
          </motion.div>
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
  value: string | number;
  color: string;
}) {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-lg"
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg`}
        >
          <Iconify icon={icon} width={24} />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}

function OverviewSection({
  data,
  setActiveTab,
}: {
  data: LalKitabData;
  setActiveTab: (tab: string) => void;
}) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Horoscope Summary */}
      {data.horoscope && (
        <Section
          title="Horoscope Overview"
          icon="solar:chart-2-bold-duotone"
          color="from-red-500 to-rose-500"
        >
          <DataTable data={data.horoscope} />
        </Section>
      )}

      {/* Planets Quick View */}
      {data.planets && Array.isArray(data.planets) && (
        <Section
          title="Planetary Positions"
          icon="solar:planet-bold-duotone"
          color="from-purple-500 to-violet-500"
          action={{ label: "View All", onClick: () => setActiveTab("planets") }}
        >
          <div className="flex flex-wrap gap-2">
            {data.planets.slice(0, 9).map((planet: any, idx: number) => {
              const planetName = planet.name || planet.planet;
              const planetConfig = PLANETS.find((p) => p.value === planetName);

              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl ${planetConfig?.bgColor} border border-gray-200/50 dark:border-gray-700/50`}
                >
                  <Iconify
                    icon={planetConfig?.icon || "solar:planet-bold-duotone"}
                    width={20}
                    style={{ color: planetConfig?.color }}
                  />
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {planetName}
                  </span>
                  {planet.house && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-0.5 rounded">
                      H{planet.house}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </Section>
      )}

      {/* Quick Remedies Count */}
      {data.remedies && (
        <Section
          title="Remedies Available"
          icon="solar:hand-heart-bold-duotone"
          color="from-green-500 to-emerald-500"
          action={{
            label: "View All",
            onClick: () => setActiveTab("remedies"),
          }}
        >
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
            {PLANETS.map((planet) => {
              const hasData = data.remedies?.[planet.value];
              const count = Array.isArray(hasData)
                ? hasData.length
                : hasData
                  ? 1
                  : 0;

              return (
                <div
                  key={planet.value}
                  className={`text-center p-3 rounded-xl ${hasData ? planet.bgColor : "bg-gray-50 dark:bg-gray-800/50"} border border-gray-200/50 dark:border-gray-700/50`}
                >
                  <Iconify
                    icon={planet.icon}
                    width={24}
                    style={{ color: hasData ? planet.color : "#9CA3AF" }}
                    className="mx-auto mb-1"
                  />
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {planet.label}
                  </p>
                  <p
                    className="text-lg font-bold"
                    style={{ color: hasData ? planet.color : "#9CA3AF" }}
                  >
                    {count}
                  </p>
                </div>
              );
            })}
          </div>
        </Section>
      )}
    </motion.div>
  );
}

function Section({
  title,
  icon,
  color,
  action,
  children,
}: {
  title: string;
  icon: string;
  color: string;
  action?: { label: string; onClick: () => void };
  children: React.ReactNode;
}) {
  return (
    <motion.div variants={itemVariants}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg`}
          >
            <Iconify icon={icon} width={20} />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
        </div>
        {action && (
          <button
            onClick={action.onClick}
            className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium flex items-center gap-1"
          >
            {action.label}
            <Iconify icon="solar:arrow-right-linear" width={16} />
          </button>
        )}
      </div>
      {children}
    </motion.div>
  );
}

function DataSection({ data, title }: { data: any; title: string }) {
  if (!data) return <EmptyTabState message="No data available" />;
  return <DataTable data={data} title={title} />;
}

function DataTable({ data, title }: { data: any; title?: string }) {
  const formatCellValue = (value: any): string => {
    if (value === null || value === undefined) return "-";
    if (Array.isArray(value))
      return value.length === 0 ? "-" : value.join(", ");
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  if (Array.isArray(data)) {
    if (data.length === 0) return <EmptyTabState message="No data available" />;
    const keys = [...new Set(data.flatMap((item) => Object.keys(item)))];

    return (
      <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {title && (
          <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {title}
            </h4>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                {keys.map((key) => (
                  <th
                    key={key}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase"
                  >
                    {key.replace(/_/g, " ")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item: any, idx: number) => (
                <motion.tr
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  {keys.map((key) => (
                    <td
                      key={key}
                      className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300"
                    >
                      {formatCellValue(item[key])}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (typeof data === "object") {
    return (
      <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {title && (
          <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {title}
            </h4>
          </div>
        )}
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {Object.entries(data).map(([key, value], idx) => (
            <motion.div
              key={key}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.03 }}
              className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
                {key.replace(/_/g, " ")}
              </span>
              <span className="text-sm text-gray-900 dark:text-white">
                {formatCellValue(value)}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return <p className="text-gray-700 dark:text-gray-300">{String(data)}</p>;
}

function HousesSection({ houses }: { houses: any[] }) {
  if (!houses || houses.length === 0)
    return <EmptyTabState message="No houses data available" />;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      {houses.map((house: any, idx: number) => (
        <motion.div
          key={idx}
          variants={itemVariants}
          className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-all"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center text-white font-bold shadow-lg">
              {house.house_number || idx + 1}
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">
              House {house.house_number || idx + 1}
            </span>
          </div>
          <div className="space-y-2 text-sm">
            {Object.entries(house).map(([key, value]) => {
              if (key === "house_number") return null;
              return (
                <div key={key} className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400 capitalize">
                    {key.replace(/_/g, " ")}
                  </span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {String(value) || "-"}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

function PlanetsSection({ planets }: { planets: any[] }) {
  if (!planets || planets.length === 0)
    return <EmptyTabState message="No planets data available" />;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {planets.map((planet: any, idx: number) => {
        const planetName = planet.name || planet.planet || `Planet ${idx + 1}`;
        const planetConfig = PLANETS.find((p) => p.value === planetName);

        return (
          <motion.div
            key={idx}
            variants={itemVariants}
            className={`${planetConfig?.bgColor || "bg-gray-50 dark:bg-gray-800/50"} rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-5 hover:shadow-lg transition-all`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${planetConfig?.gradient || "from-gray-400 to-gray-500"} flex items-center justify-center text-white shadow-lg`}
              >
                <Iconify
                  icon={planetConfig?.icon || "solar:planet-bold-duotone"}
                  width={24}
                />
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">
                  {planetName}
                </p>
                {planetConfig?.hindi && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {planetConfig.hindi}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2 text-sm">
              {Object.entries(planet).map(([key, value]) => {
                if (key === "name" || key === "planet") return null;
                return (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400 capitalize">
                      {key.replace(/_/g, " ")}
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {value === null ? "-" : String(value)}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

function DebtsSection({ debts }: { debts: any }) {
  if (!debts) return <EmptyTabState message="No debts data available" />;

  if (Array.isArray(debts)) {
    return <DataTable data={debts} title="Karmic Debts (Rin)" />;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {DEBT_TYPES.map((debt) => {
        const debtData = debts[debt.key];

        return (
          <motion.div
            key={debt.key}
            variants={itemVariants}
            className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${debt.gradient} flex items-center justify-center text-white shadow-lg`}
              >
                <Iconify icon={debt.icon} width={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">
                  {debt.label}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {debt.desc}
                </p>
              </div>
            </div>
            {debtData ? (
              typeof debtData === "object" ? (
                <div className="space-y-2 text-sm">
                  {Object.entries(debtData).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400 capitalize">
                        {key.replace(/_/g, " ")}
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {String(debtData)}
                </p>
              )
            ) : (
              <p className="text-sm text-gray-400 dark:text-gray-500">
                No data available
              </p>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

function RemediesSection({
  remedies,
  selectedPlanet,
  setSelectedPlanet,
}: {
  remedies: Record<string, any> | undefined;
  selectedPlanet: string;
  setSelectedPlanet: (planet: string) => void;
}) {
  if (!remedies || Object.keys(remedies).length === 0) {
    return <EmptyTabState message="No remedies data available" />;
  }

  const currentPlanetConfig = PLANETS.find((p) => p.value === selectedPlanet);
  const currentRemedies = remedies[selectedPlanet];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Planet Selector */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 font-medium">
          Select Planet for Remedies
        </p>
        <div className="flex flex-wrap gap-2">
          {PLANETS.map((planet) => {
            const hasData = remedies[planet.value];
            const isSelected = selectedPlanet === planet.value;

            return (
              <button
                key={planet.value}
                onClick={() => setSelectedPlanet(planet.value)}
                disabled={!hasData}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isSelected
                    ? `bg-gradient-to-r ${planet.gradient} text-white shadow-lg`
                    : hasData
                      ? `${planet.bgColor} text-gray-700 dark:text-gray-300 hover:shadow-md border border-gray-200/50 dark:border-gray-700/50`
                      : "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed border border-gray-200 dark:border-gray-700"
                }`}
              >
                <Iconify icon={planet.icon} width={18} />
                {planet.label}
                {!hasData && (
                  <Iconify
                    icon="solar:close-circle-bold"
                    width={14}
                    className="opacity-50"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Planet Remedies */}
      <div
        className={`${currentPlanetConfig?.bgColor} rounded-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden`}
      >
        <div
          className={`px-5 py-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r ${currentPlanetConfig?.gradient} text-white`}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Iconify
                icon={currentPlanetConfig?.icon || "solar:planet-bold-duotone"}
                width={28}
              />
            </div>
            <div>
              <h3 className="font-bold text-lg">{selectedPlanet} Remedies</h3>
              <p className="text-white/80 text-sm">
                {currentPlanetConfig?.hindi} के उपाय
              </p>
            </div>
          </div>
        </div>

        <div className="p-5">
          {currentRemedies ? (
            Array.isArray(currentRemedies) ? (
              <div className="space-y-3">
                {currentRemedies.map((remedy: any, idx: number) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200/50 dark:border-gray-700/50"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg bg-gradient-to-br ${currentPlanetConfig?.gradient} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
                    >
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      {typeof remedy === "string" ? (
                        <p className="text-gray-700 dark:text-gray-300">
                          {remedy}
                        </p>
                      ) : (
                        <div className="space-y-1">
                          {Object.entries(remedy).map(([key, value]) => (
                            <div key={key}>
                              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize">
                                {key.replace(/_/g, " ")}:{" "}
                              </span>
                              <span className="text-sm text-gray-900 dark:text-white">
                                {String(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : typeof currentRemedies === "object" ? (
              <div className="space-y-3">
                {Object.entries(currentRemedies).map(([key, value], idx) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200/50 dark:border-gray-700/50"
                  >
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 capitalize block mb-2">
                      {key.replace(/_/g, " ")}
                    </span>
                    {Array.isArray(value) ? (
                      value.length > 0 ? (
                        <div className="space-y-2">
                          {value.map((item, idx) => (
                            <p
                              key={idx}
                              className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2"
                            >
                              <span
                                className={`inline-flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br ${currentPlanetConfig?.gradient} text-white text-xs font-medium flex-shrink-0 mt-0.5`}
                              >
                                {idx + 1}
                              </span>
                              <span>{String(item)}</span>
                            </p>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )
                    ) : (
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {String(value) || "-"}
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-700 dark:text-gray-300">
                {String(currentRemedies)}
              </p>
            )
          ) : (
            <div className="text-center py-8">
              <Iconify
                icon="solar:hand-heart-bold-duotone"
                width={40}
                className="text-gray-300 mx-auto mb-3"
              />
              <p className="text-gray-500 dark:text-gray-400">
                No remedies available for {selectedPlanet}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Remedies Summary Grid */}
      <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <h4 className="font-semibold text-gray-900 dark:text-white">
            All Planets Remedies Summary
          </h4>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 divide-x divide-gray-100 dark:divide-gray-800">
          {PLANETS.map((planet) => {
            const hasData = remedies[planet.value];
            const remedyCount = Array.isArray(hasData)
              ? hasData.length
              : hasData
                ? 1
                : 0;

            return (
              <button
                key={planet.value}
                onClick={() => hasData && setSelectedPlanet(planet.value)}
                className={`p-4 text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                  selectedPlanet === planet.value ? planet.bgColor : ""
                }`}
              >
                <Iconify
                  icon={planet.icon}
                  width={28}
                  style={{ color: hasData ? planet.color : "#9CA3AF" }}
                  className="mx-auto mb-1"
                />
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {planet.label}
                </p>
                <p
                  className="text-xl font-bold"
                  style={{ color: hasData ? planet.color : "#9CA3AF" }}
                >
                  {remedyCount}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

function EmptyTabState({ message }: { message: string }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-12 text-center border border-gray-200 dark:border-gray-700">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
        <Iconify
          icon="solar:database-bold-duotone"
          width={32}
          className="text-gray-400"
        />
      </div>
      <p className="text-gray-600 dark:text-gray-400">{message}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-12"
    >
      <div className="flex flex-col items-center text-center max-w-lg mx-auto">
        <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/50 dark:to-orange-900/50 flex items-center justify-center mb-6 shadow-xl">
          <Iconify
            icon="solar:book-2-bold-duotone"
            width={56}
            className="text-red-500"
          />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Lal Kitab Analysis
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Select a person and click "Generate Analysis" to view complete Lal
          Kitab horoscope with remedies for all 9 planets.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {["Horoscope", "Houses", "Planets", "Debts", "Remedies"].map(
            (item) => (
              <span
                key={item}
                className="px-3 py-1.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-lg"
              >
                {item}
              </span>
            ),
          )}
        </div>
      </div>
    </motion.div>
  );
}
