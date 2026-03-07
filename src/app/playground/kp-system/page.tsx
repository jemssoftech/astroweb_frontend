"use client";

import { useState, useCallback, useEffect } from "react";
import PersonSelector from "@/src/components/PersonSelector";
import Iconify from "@/src/components/Iconify";
import { Person } from "@/src/lib/models";
import Swal from "sweetalert2";
import BirthChartSection from "@/src/components/horoscope/BirthChartSection";
import { getUser } from "@/src/lib/auth";
import { motion, AnimatePresence } from "framer-motion";

// ============ TYPES ============

interface KPSystemData {
  kp_planets?: any;
  kp_house_cusps?: any;
  kp_birth_chart?: any;
  kp_house_significator?: any;
  kp_planet_significator?: any;
}

interface KPSystemResponse {
  status: "Pass" | "Partial" | "Fail";
  message: string;
  data: KPSystemData;
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
    icon: "solar:sun-bold-duotone",
    color: "#F59E0B",
    gradient: "from-amber-400 to-orange-500",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
  },
  {
    value: "Moon",
    label: "Moon",
    icon: "solar:moon-bold-duotone",
    color: "#6B7280",
    gradient: "from-slate-400 to-gray-500",
    bgColor: "bg-slate-50 dark:bg-slate-800/50",
  },
  {
    value: "Mars",
    label: "Mars",
    icon: "solar:flame-bold-duotone",
    color: "#EF4444",
    gradient: "from-red-400 to-rose-500",
    bgColor: "bg-red-50 dark:bg-red-900/20",
  },
  {
    value: "Mercury",
    label: "Mercury",
    icon: "solar:wind-bold-duotone",
    color: "#22C55E",
    gradient: "from-green-400 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-900/20",
  },
  {
    value: "Jupiter",
    label: "Jupiter",
    icon: "solar:crown-bold-duotone",
    color: "#F97316",
    gradient: "from-orange-400 to-amber-500",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
  },
  {
    value: "Venus",
    label: "Venus",
    icon: "solar:heart-bold-duotone",
    color: "#EC4899",
    gradient: "from-pink-400 to-rose-500",
    bgColor: "bg-pink-50 dark:bg-pink-900/20",
  },
  {
    value: "Saturn",
    label: "Saturn",
    icon: "solar:clock-circle-bold-duotone",
    color: "#6366F1",
    gradient: "from-indigo-400 to-violet-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
  },
  {
    value: "Rahu",
    label: "Rahu",
    icon: "solar:black-hole-bold-duotone",
    color: "#8B5CF6",
    gradient: "from-violet-400 to-purple-500",
    bgColor: "bg-violet-50 dark:bg-violet-900/20",
  },
  {
    value: "Ketu",
    label: "Ketu",
    icon: "solar:star-bold-duotone",
    color: "#D97706",
    gradient: "from-amber-500 to-yellow-600",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
  },
  {
    value: "Ascendant",
    label: "Asc",
    icon: "solar:arrow-up-bold-duotone",
    color: "#3B82F6",
    gradient: "from-blue-400 to-indigo-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
  },
];

const TABS = [
  {
    key: "overview",
    label: "Overview",
    icon: "solar:widget-5-bold-duotone",
    color: "from-indigo-500 to-blue-500",
  },
  {
    key: "kp_planets",
    label: "Planets",
    icon: "solar:planet-bold-duotone",
    color: "from-purple-500 to-violet-500",
  },
  {
    key: "kp_house_cusps",
    label: "House Cusps",
    icon: "solar:home-2-bold-duotone",
    color: "from-blue-500 to-cyan-500",
  },
  {
    key: "kp_birth_chart",
    label: "Birth Chart",
    icon: "solar:chart-2-bold-duotone",
    color: "from-amber-500 to-orange-500",
  },
  {
    key: "kp_house_significator",
    label: "House Sig.",
    icon: "solar:home-smile-bold-duotone",
    color: "from-emerald-500 to-teal-500",
  },
  {
    key: "kp_planet_significator",
    label: "Planet Sig.",
    icon: "solar:star-rings-bold-duotone",
    color: "from-pink-500 to-rose-500",
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

// ============ HELPER ============

const formatCellValue = (value: any): React.ReactNode => {
  if (value === null || value === undefined) return "-";
  if (Array.isArray(value)) {
    if (value.length === 0) return "-";
    if (value.length === 1) return String(value[0]);
    return (
      <div className="flex flex-wrap gap-1">
        {value.map((item, idx) => (
          <span
            key={idx}
            className="inline-block bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs px-2 py-0.5 rounded-lg"
          >
            {String(item)}
          </span>
        ))}
      </div>
    );
  }
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};

const getPlanetConfig = (name: string) =>
  PLANETS.find((p) => p.value === name || p.label === name);

// ============ MAIN COMPONENT ============

export default function KPSystemPage() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(false);
  const [kpData, setKpData] = useState<KPSystemResponse | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [user, setUser] = useState(getUser());
  useEffect(() => {
    setUser(getUser());
  }, []);

  const handlePersonSelected = useCallback((person: Person) => {
    setSelectedPerson(person);
    setKpData(null);
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
      tzone,
    };
  }, []);

  const fetchKPSystem = async () => {
    if (!selectedPerson) {
      Swal.fire({
        icon: "warning",
        title: "Select Person",
        text: "Please select a person first",
        background: "#1f2937",
        color: "#f3f4f6",
        confirmButtonColor: "#4f46e5",
      });
      return;
    }
    const authToken = user?.token;
    const apiKey = (user as any)?.userApiKey || (user as any)?.apikey || "";

    setLoading(true);
    try {
      const payload = getBirthDataPayload(selectedPerson);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NEXT_JS_API_URL}/api/mainapi/kp-system`,
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
      const result: KPSystemResponse = await response.json();
      if (result.status === "Fail")
        throw new Error(result.message || "Failed to fetch KP System data");
      setKpData(result);
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
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error instanceof Error
            ? error.message
            : "Failed to get KP System data",
        background: "#1f2937",
        color: "#f3f4f6",
        confirmButtonColor: "#4f46e5",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStats = () => {
    if (!kpData?.data) return null;
    return {
      planets: Array.isArray(kpData.data.kp_planets)
        ? kpData.data.kp_planets.length
        : kpData.data.kp_planets
          ? "✓"
          : "-",
      houses: Array.isArray(kpData.data.kp_house_cusps)
        ? kpData.data.kp_house_cusps.length
        : "12",
      birthChart: kpData.data.kp_birth_chart ? "✓" : "-",
      houseSig: kpData.data.kp_house_significator ? "✓" : "-",
      planetSig: kpData.data.kp_planet_significator ? "✓" : "-",
    };
  };

  const stats = kpData ? getStats() : null;

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 py-8 ">
        {/* Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden bg-gradient-to-r from-indigo-700 via-blue-700 to-cyan-700 rounded-2xl p-6 md:p-8 text-white shadow-xl mb-8"
        >
          {/* Soft Glow Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>

          {/* Watermark Icon */}
          <div className="absolute top-4 right-8 opacity-20">
            <Iconify
              icon="solar:chart-2-bold-duotone"
              width={110}
              height={110}
            />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Iconify
                  icon="solar:chart-2-bold-duotone"
                  width={40}
                  height={40}
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium">
                    KP System
                  </span>
                  <span className="px-2 py-0.5 bg-cyan-400/30 rounded-full text-xs font-medium">
                    Sub-Lord Theory
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold">
                  Krishnamurti Paddhati
                </h1>

                <p className="text-white/80 mt-1 max-w-xl">
                  Advanced stellar astrology system with sub-lord theory for
                  precise predictions using 249 sub-divisions.
                </p>
              </div>
            </div>

            {/* Info Badge */}
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/20">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Iconify icon="solar:layers-bold" width={20} height={20} />
              </div>
              <div>
                <p className="font-semibold">249</p>
                <p className="text-sm text-white/70">Sub-Divisions</p>
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
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white">
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
                onClick={fetchKPSystem}
                disabled={loading || !selectedPerson}
                className={`mt-4 w-full h-12 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                  selectedPerson && !loading
                    ? "bg-primary  hover:shadow-xl hover:-translate-y-0.5"
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
                    <Iconify icon="solar:chart-2-bold" width={20} />
                    <span>Analyze KP Chart</span>
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
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white font-bold">
                        {selectedPerson.Name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {selectedPerson.Name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Selected Profile
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-sm">
                      <InfoRow
                        icon="solar:calendar-bold"
                        label="Date"
                        value={new Date(
                          selectedPerson.BirthTime,
                        ).toLocaleDateString()}
                      />
                      <InfoRow
                        icon="solar:clock-circle-bold"
                        label="Time"
                        value={new Date(
                          selectedPerson.BirthTime,
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      />
                      <InfoRow
                        icon="solar:map-point-bold"
                        label="Place"
                        value={selectedPerson.BirthLocation}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Info Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-2xl border border-indigo-200/50 dark:border-indigo-800/50 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white">
                  <Iconify icon="solar:info-circle-bold" width={20} />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  About KP System
                </h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Krishnamurti Paddhati (KP) is a modern stellar astrology system
                developed by Prof. K.S. Krishnamurti for precise predictions.
              </p>
              <div className="space-y-2">
                {[
                  {
                    icon: "solar:star-bold",
                    text: "The stars above us, govern our conditions.",
                  },
                  {
                    icon: "solar:graph-bold",
                    text: "249 Sub divisions (Nakshatra Pada)",
                  },
                  { icon: "solar:home-2-bold", text: "Cuspal Sub-Lord theory" },
                  {
                    icon: "solar:planet-bold",
                    text: "House & Planet Significators",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <Iconify
                      icon={item.icon}
                      width={14}
                      className="text-indigo-500 flex-shrink-0"
                    />
                    <span className="text-gray-600 dark:text-gray-400">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Planets Mini Grid */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg p-5">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Iconify
                  icon="solar:planet-bold-duotone"
                  width={20}
                  className="text-indigo-500"
                />
                Navagraha
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {PLANETS.slice(0, 9).map((planet) => (
                  <div
                    key={planet.value}
                    className={`${planet.bgColor} rounded-xl p-2.5 text-center`}
                  >
                    <Iconify
                      icon={planet.icon}
                      width={22}
                      style={{ color: planet.color }}
                      className="mx-auto mb-1"
                    />
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {planet.label}
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
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.9 }}
                    className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-2xl max-w-sm w-full mx-4"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="relative mb-6">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/50 dark:to-blue-900/50 flex items-center justify-center">
                          <Iconify
                            icon="solar:chart-2-bold-duotone"
                            width={48}
                            className="text-indigo-500 animate-pulse"
                          />
                        </div>
                        <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-transparent border-t-indigo-500 border-r-blue-500 animate-spin" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Analyzing KP Chart
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Computing sub-lords, cusps & significators...
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {kpData ? (
              <div className="space-y-6">
                {/* Stats Cards */}
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-2 md:grid-cols-5 gap-4"
                >
                  <StatsCard
                    icon="solar:planet-bold-duotone"
                    label="Planets"
                    value={stats?.planets || "-"}
                    color="from-purple-500 to-violet-500"
                  />
                  <StatsCard
                    icon="solar:home-2-bold-duotone"
                    label="Houses"
                    value={stats?.houses || "-"}
                    color="from-blue-500 to-cyan-500"
                  />
                  <StatsCard
                    icon="solar:chart-2-bold-duotone"
                    label="Chart"
                    value={stats?.birthChart || "-"}
                    color="from-amber-500 to-orange-500"
                  />
                  <StatsCard
                    icon="solar:home-smile-bold-duotone"
                    label="House Sig."
                    value={stats?.houseSig || "-"}
                    color="from-emerald-500 to-teal-500"
                  />
                  <StatsCard
                    icon="solar:star-rings-bold-duotone"
                    label="Planet Sig."
                    value={stats?.planetSig || "-"}
                    color="from-pink-500 to-rose-500"
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
                              ? "text-indigo-600 dark:text-indigo-400"
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
                              layoutId="activeTabKP"
                              className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-blue-500"
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
                            data={kpData.data}
                            setActiveTab={setActiveTab}
                          />
                        )}
                        {activeTab === "kp_planets" && (
                          <PlanetsSection data={kpData.data.kp_planets} />
                        )}
                        {activeTab === "kp_house_cusps" && (
                          <HouseCuspsSection
                            data={kpData.data.kp_house_cusps}
                          />
                        )}
                        {activeTab === "kp_birth_chart" && (
                          <BirthChartTab selectedPerson={selectedPerson} />
                        )}
                        {activeTab === "kp_house_significator" && (
                          <SignificatorsSection
                            data={kpData.data.kp_house_significator}
                            type="house"
                          />
                        )}
                        {activeTab === "kp_planet_significator" && (
                          <SignificatorsSection
                            data={kpData.data.kp_planet_significator}
                            type="planet"
                          />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Errors */}
                {kpData.errors && Object.keys(kpData.errors).length > 0 && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Iconify
                        icon="solar:danger-triangle-bold"
                        width={20}
                        className="text-red-500"
                      />
                      <h4 className="font-semibold text-red-700 dark:text-red-400">
                        API Errors
                      </h4>
                    </div>
                    <div className="space-y-1">
                      {Object.entries(kpData.errors).map(([key, error]) => (
                        <p
                          key={key}
                          className="text-sm text-red-600 dark:text-red-400"
                        >
                          <span className="font-medium capitalize">
                            {key.replace(/_/g, " ")}:
                          </span>{" "}
                          {error}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Meta Info */}
                {kpData.meta && (
                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl p-4 border border-indigo-200/50 dark:border-indigo-800/50">
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Iconify
                          icon="solar:server-bold"
                          width={16}
                          className="text-indigo-500"
                        />
                        <span className="text-gray-600 dark:text-gray-400">
                          APIs: {kpData.meta.successful}/
                          {kpData.meta.total_apis}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Iconify
                          icon="solar:chart-bold"
                          width={16}
                          className="text-green-500"
                        />
                        <span className="text-gray-600 dark:text-gray-400">
                          Success: {kpData.meta.success_rate}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Iconify
                          icon="solar:clock-circle-bold"
                          width={16}
                          className="text-blue-500"
                        />
                        <span className="text-gray-600 dark:text-gray-400">
                          {new Date(kpData.meta.timestamp).toLocaleTimeString()}
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

// ============ SECTION COMPONENTS ============

function OverviewSection({
  data,
  setActiveTab,
}: {
  data: KPSystemData;
  setActiveTab: (tab: string) => void;
}) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Planets Quick View */}
      {data.kp_planets && Array.isArray(data.kp_planets) && (
        <Section
          title="KP Planets Overview"
          icon="solar:planet-bold-duotone"
          color="from-purple-500 to-violet-500"
          action={{
            label: "View All",
            onClick: () => setActiveTab("kp_planets"),
          }}
        >
          <div className="flex flex-wrap gap-3">
            {data.kp_planets.slice(0, 10).map((planet: any, idx: number) => {
              const planetName =
                planet.name || planet.planet || planet.planet_name;
              const config = getPlanetConfig(planetName);

              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl ${config?.bgColor || "bg-gray-50 dark:bg-gray-800"} border border-gray-200/50 dark:border-gray-700/50`}
                >
                  <Iconify
                    icon={config?.icon || "solar:planet-bold-duotone"}
                    width={20}
                    style={{ color: config?.color || "#6B7280" }}
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {planetName}
                    </span>
                    {planet.sign && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                        ({planet.sign})
                      </span>
                    )}
                  </div>
                  {planet.nakshatra && (
                    <span className="text-xs bg-white dark:bg-gray-800 px-2 py-0.5 rounded-lg text-gray-600 dark:text-gray-400 border border-gray-200/50 dark:border-gray-700/50">
                      {planet.nakshatra}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </Section>
      )}

      {/* House Cusps Quick View */}
      {data.kp_house_cusps && Array.isArray(data.kp_house_cusps) && (
        <Section
          title="House Cusps Overview"
          icon="solar:home-2-bold-duotone"
          color="from-blue-500 to-cyan-500"
          action={{
            label: "View All",
            onClick: () => setActiveTab("kp_house_cusps"),
          }}
        >
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
            {data.kp_house_cusps.slice(0, 12).map((cusp: any, idx: number) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="text-center p-3 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl border border-indigo-200/50 dark:border-indigo-800/50"
              >
                <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                  {cusp.house || idx + 1}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate mt-1">
                  {cusp.sign || cusp.cusp_sign || "-"}
                </p>
              </motion.div>
            ))}
          </div>
        </Section>
      )}

      {/* Significators Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.kp_house_significator && (
          <QuickViewCard
            title="House Significators"
            icon="solar:home-smile-bold-duotone"
            color="from-emerald-500 to-teal-500"
            available={true}
            onClick={() => setActiveTab("kp_house_significator")}
          />
        )}
        {data.kp_planet_significator && (
          <QuickViewCard
            title="Planet Significators"
            icon="solar:star-rings-bold-duotone"
            color="from-pink-500 to-rose-500"
            available={true}
            onClick={() => setActiveTab("kp_planet_significator")}
          />
        )}
      </div>
    </motion.div>
  );
}

function PlanetsSection({ data }: { data: any }) {
  if (!data) return <EmptyTabState message="No planets data available" />;
  if (!Array.isArray(data)) return <DataTable data={data} title="KP Planets" />;
  if (data.length === 0) return <EmptyTabState message="No planets data" />;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {data.map((planet: any, idx: number) => {
        const planetName =
          planet.name ||
          planet.planet ||
          planet.planet_name ||
          `Planet ${idx + 1}`;
        const config = getPlanetConfig(planetName);

        return (
          <motion.div
            key={idx}
            variants={itemVariants}
            className={`${config?.bgColor || "bg-gray-50 dark:bg-gray-800/50"} rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-5 hover:shadow-lg transition-all`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config?.gradient || "from-gray-400 to-gray-500"} flex items-center justify-center text-white shadow-lg`}
              >
                <Iconify
                  icon={config?.icon || "solar:planet-bold-duotone"}
                  width={24}
                />
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">
                  {planetName}
                </p>
                {planet.sign && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {planet.sign}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2 text-sm">
              {Object.entries(planet).map(([key, value]) => {
                if (["name", "planet", "planet_name"].includes(key))
                  return null;
                return (
                  <div key={key} className="flex justify-between items-start">
                    <span className="text-gray-500 dark:text-gray-400 capitalize">
                      {key.replace(/_/g, " ")}
                    </span>
                    <span className="text-gray-900 dark:text-white text-right max-w-[60%]">
                      {formatCellValue(value)}
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

function HouseCuspsSection({ data }: { data: any }) {
  if (!data) return <EmptyTabState message="No house cusps data available" />;
  if (!Array.isArray(data))
    return <DataTable data={data} title="House Cusps" />;
  if (data.length === 0) return <EmptyTabState message="No house cusps data" />;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      {data.map((cusp: any, idx: number) => {
        const houseNum = cusp.house || cusp.house_number || idx + 1;
        return (
          <motion.div
            key={idx}
            variants={itemVariants}
            className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg">
                {houseNum}
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">
                House {houseNum}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              {Object.entries(cusp).map(([key, value]) => {
                if (["house", "house_number"].includes(key)) return null;
                return (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400 capitalize">
                      {key.replace(/_/g, " ")}
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {formatCellValue(value)}
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

function BirthChartTab({ selectedPerson }: { selectedPerson: Person | null }) {
  if (!selectedPerson)
    return <EmptyTabState message="Select a person to view birth chart" />;

  const chartBirthData = {
    location: encodeURIComponent(selectedPerson.BirthLocation.trim()),
    time: new Date(selectedPerson.BirthTime).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    date: new Date(selectedPerson.BirthTime).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
    offset: encodeURIComponent(selectedPerson.TimezoneOffset || "+05:30"),
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <BirthChartSection birthData={chartBirthData} ayanamsa="KP" />
    </div>
  );
}

function SignificatorsSection({
  data,
  type,
}: {
  data: any;
  type: "house" | "planet";
}) {
  if (!data) return <EmptyTabState message="No significators data available" />;
  if (!Array.isArray(data))
    return (
      <DataTable
        data={data}
        title={`${type === "house" ? "House" : "Planet"} Significators`}
      />
    );
  if (data.length === 0)
    return <EmptyTabState message="No significators data" />;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {data.map((item: any, idx: number) => {
        const title =
          type === "house"
            ? `House ${item.house || item.house_number || idx + 1}`
            : item.planet || item.name || `Planet ${idx + 1}`;
        const config = type === "planet" ? getPlanetConfig(title) : null;

        return (
          <motion.div
            key={idx}
            variants={itemVariants}
            className={`${config?.bgColor || "bg-white dark:bg-gray-800/50"} rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-5 hover:shadow-lg transition-all`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config?.gradient || "from-indigo-500 to-blue-500"} flex items-center justify-center text-white shadow-lg`}
              >
                {type === "house" ? (
                  <span className="font-bold text-lg">
                    {item.house || idx + 1}
                  </span>
                ) : (
                  <Iconify
                    icon={config?.icon || "solar:planet-bold-duotone"}
                    width={24}
                  />
                )}
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">
                  {title}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {type === "house" ? "Significator" : "Significances"}
                </p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              {Object.entries(item).map(([key, value]) => {
                if (["house", "house_number", "planet", "name"].includes(key))
                  return null;
                return (
                  <div key={key} className="flex justify-between items-start">
                    <span className="text-gray-500 dark:text-gray-400 capitalize">
                      {key.replace(/_/g, " ")}
                    </span>
                    <span className="text-gray-900 dark:text-white text-right max-w-[60%]">
                      {formatCellValue(value)}
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

// ============ HELPER COMPONENTS ============

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
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-medium flex items-center gap-1"
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

function QuickViewCard({
  title,
  icon,
  color,
  available,
  onClick,
}: {
  title: string;
  icon: string;
  color: string;
  available: boolean;
  onClick: () => void;
}) {
  return (
    <motion.div variants={itemVariants}>
      <button
        onClick={onClick}
        className="w-full bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg transition-all text-left group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg`}
            >
              <Iconify icon={icon} width={24} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white">
                {title}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {available ? "Data Available" : "No Data"}
              </p>
            </div>
          </div>
          <Iconify
            icon="solar:arrow-right-bold"
            width={20}
            className="text-gray-400 group-hover:text-indigo-500 transition-colors"
          />
        </div>
      </button>
    </motion.div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Iconify
        icon={icon}
        width={14}
        className="text-indigo-500 flex-shrink-0"
      />
      <span className="text-gray-500 dark:text-gray-400 text-xs">{label}:</span>
      <span className="text-gray-800 dark:text-gray-200 text-xs font-medium truncate">
        {value}
      </span>
    </div>
  );
}

function DataTable({ data, title }: { data: any; title?: string }) {
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
                <tr
                  key={idx}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  {keys.map((key) => (
                    <td
                      key={key}
                      className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 align-top"
                    >
                      {formatCellValue(item[key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (typeof data === "object" && data !== null) {
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
          {Object.entries(data).map(([key, value]) => (
            <div
              key={key}
              className="flex px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize min-w-[180px]">
                {key.replace(/_/g, " ")}
              </span>
              <div className="flex-1 text-sm text-gray-900 dark:text-white">
                {formatCellValue(value)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return <p className="text-gray-700 dark:text-gray-300">{String(data)}</p>;
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
        <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/50 dark:to-blue-900/50 flex items-center justify-center mb-6 shadow-xl">
          <Iconify
            icon="solar:chart-2-bold-duotone"
            width={56}
            className="text-indigo-500"
          />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          KP System Analysis
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Select a person and click "Analyze KP Chart" to view KP System
          analysis including planets, house cusps, and significators.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {[
            "Planets",
            "House Cusps",
            "Birth Chart",
            "House Sig.",
            "Planet Sig.",
          ].map((item) => (
            <span
              key={item}
              className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm rounded-lg"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
