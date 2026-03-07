"use client";

import { useState, useMemo, useEffect } from "react";
import PersonSelector from "@/src/components/PersonSelector";
import Iconify from "@/src/components/Iconify";
import { Person } from "@/src/lib/models";
import Swal from "sweetalert2";
import { getUser } from "@/src/lib/auth";
import { motion, AnimatePresence } from "framer-motion";

// ============ Types ============
interface SignAshtakPoints {
  sun: number;
  moon: number;
  mars: number;
  mercury: number;
  jupiter: number;
  venus: number;
  saturn: number;
  ascendant: number;
  total: number;
}

interface AshtakPoints {
  aries: SignAshtakPoints;
  taurus: SignAshtakPoints;
  gemini: SignAshtakPoints;
  cancer: SignAshtakPoints;
  leo: SignAshtakPoints;
  virgo: SignAshtakPoints;
  libra: SignAshtakPoints;
  scorpio: SignAshtakPoints;
  sagittarius: SignAshtakPoints;
  capricorn: SignAshtakPoints;
  aquarius: SignAshtakPoints;
  pisces: SignAshtakPoints;
}

interface PlanetAshtakVarga {
  ashtak_varga: {
    type: string;
    planet: string;
    sign: string;
    sign_id: number;
  };
  ashtak_points: AshtakPoints;
}

interface SarvashtakData {
  ashtak_varga: {
    type: string;
    sign: string;
    sign_id: number;
  };
  ashtak_points: AshtakPoints;
}

interface AshtakvargaData {
  sarvashtakvarga: SarvashtakData | null;
  planet_ashtakvarga: Record<string, PlanetAshtakVarga | null>;
}

interface AshtakvargaResponse {
  status: "Pass" | "Partial" | "Fail";
  message: string;
  data: AshtakvargaData;
  meta: {
    total_apis: number;
    successful: number;
    failed: number;
    success_rate: string;
    timestamp: string;
  };
}

// ============ Constants ============
const SIGN_KEYS = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces",
] as const;

type SignKey = (typeof SIGN_KEYS)[number];

const PLANETS_CONFIG: Record<
  string,
  {
    name: string;
    icon: string;
    color: string;
    gradient: string;
    bgColor: string;
    years: number;
  }
> = {
  sun: {
    name: "Sun",
    icon: "solar:sun-bold-duotone",
    color: "#F59E0B",
    gradient: "from-amber-400 to-orange-500",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    years: 6,
  },
  moon: {
    name: "Moon",
    icon: "solar:moon-bold-duotone",
    color: "#3B82F6",
    gradient: "from-blue-400 to-indigo-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    years: 15,
  },
  mars: {
    name: "Mars",
    icon: "solar:flame-bold-duotone",
    color: "#EF4444",
    gradient: "from-red-400 to-rose-500",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    years: 7,
  },
  mercury: {
    name: "Mercury",
    icon: "solar:wind-bold-duotone",
    color: "#22C55E",
    gradient: "from-green-400 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    years: 17,
  },
  jupiter: {
    name: "Jupiter",
    icon: "solar:crown-bold-duotone",
    color: "#F97316",
    gradient: "from-orange-400 to-amber-500",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    years: 16,
  },
  venus: {
    name: "Venus",
    icon: "solar:heart-bold-duotone",
    color: "#EC4899",
    gradient: "from-pink-400 to-rose-500",
    bgColor: "bg-pink-50 dark:bg-pink-900/20",
    years: 20,
  },
  saturn: {
    name: "Saturn",
    icon: "solar:clock-circle-bold-duotone",
    color: "#6366F1",
    gradient: "from-indigo-400 to-violet-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    years: 19,
  },
};

const SIGNS_CONFIG: Record<
  string,
  {
    name: string;
    short: string;
    icon: string;
    emoji: string;
  }
> = {
  aries: { name: "Aries", short: "Ari", icon: "mdi:zodiac-aries", emoji: "♈" },
  taurus: {
    name: "Taurus",
    short: "Tau",
    icon: "mdi:zodiac-taurus",
    emoji: "♉",
  },
  gemini: {
    name: "Gemini",
    short: "Gem",
    icon: "mdi:zodiac-gemini",
    emoji: "♊",
  },
  cancer: {
    name: "Cancer",
    short: "Can",
    icon: "mdi:zodiac-cancer",
    emoji: "♋",
  },
  leo: { name: "Leo", short: "Leo", icon: "mdi:zodiac-leo", emoji: "♌" },
  virgo: { name: "Virgo", short: "Vir", icon: "mdi:zodiac-virgo", emoji: "♍" },
  libra: { name: "Libra", short: "Lib", icon: "mdi:zodiac-libra", emoji: "♎" },
  scorpio: {
    name: "Scorpio",
    short: "Sco",
    icon: "mdi:zodiac-scorpio",
    emoji: "♏",
  },
  sagittarius: {
    name: "Sagittarius",
    short: "Sag",
    icon: "mdi:zodiac-sagittarius",
    emoji: "♐",
  },
  capricorn: {
    name: "Capricorn",
    short: "Cap",
    icon: "mdi:zodiac-capricorn",
    emoji: "♑",
  },
  aquarius: {
    name: "Aquarius",
    short: "Aqu",
    icon: "mdi:zodiac-aquarius",
    emoji: "♒",
  },
  pisces: {
    name: "Pisces",
    short: "Pis",
    icon: "mdi:zodiac-pisces",
    emoji: "♓",
  },
};

const TABS = [
  {
    key: "overview",
    label: "Overview",
    icon: "solar:widget-5-bold-duotone",
    color: "from-purple-500 to-violet-500",
  },
  {
    key: "sarvashtakvarga",
    label: "Sarvashtakvarga",
    icon: "solar:chart-square-bold-duotone",
    color: "from-amber-500 to-orange-500",
  },
  {
    key: "planets",
    label: "Planet Analysis",
    icon: "solar:planet-bold-duotone",
    color: "from-blue-500 to-cyan-500",
  },
  {
    key: "analysis",
    label: "Insights",
    icon: "solar:graph-up-bold-duotone",
    color: "from-emerald-500 to-teal-500",
  },
];

// ============ Animations ============
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// ============ Helpers ============
const getConfig = (key: string) =>
  PLANETS_CONFIG[key] || {
    name: "Unknown",
    icon: "solar:planet-bold-duotone",
    color: "#6B7280",
    gradient: "from-gray-400 to-gray-500",
    bgColor: "bg-gray-50 dark:bg-gray-800",
    years: 0,
  };

const getSignConfig = (key: string) =>
  SIGNS_CONFIG[key] || {
    name: "Unknown",
    short: "?",
    icon: "mdi:help-circle",
    emoji: "?",
  };

const getBinduLevel = (
  points: number,
  max: number = 8,
): "high" | "medium" | "low" => {
  const ratio = points / max;
  if (ratio >= 0.625) return "high";
  if (ratio >= 0.375) return "medium";
  return "low";
};

const getSarvaLevel = (points: number): "high" | "medium" | "low" => {
  if (points >= 28) return "high";
  if (points >= 22) return "medium";
  return "low";
};

const getLevelBadge = (level: "high" | "medium" | "low") => {
  switch (level) {
    case "high":
      return {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-400",
        icon: "solar:check-circle-bold",
        label: "Strong",
      };
    case "medium":
      return {
        bg: "bg-amber-100 dark:bg-amber-900/30",
        text: "text-amber-700 dark:text-amber-400",
        icon: "solar:info-circle-bold",
        label: "Moderate",
      };
    case "low":
      return {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-700 dark:text-red-400",
        icon: "solar:danger-triangle-bold",
        label: "Weak",
      };
  }
};

// ============ Main Component ============
export default function AshtakvargaPage() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(false);
  const [ashtakData, setAshtakData] = useState<AshtakvargaResponse | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [selectedPlanet, setSelectedPlanet] = useState<string>("sun");
  const [user, setUser] = useState(getUser());
  useEffect(() => {
    setUser(getUser());
  }, []);

  const handlePersonSelected = (person: Person) => {
    setSelectedPerson(person);
    setAshtakData(null);
  };

  const getBirthDataPayload = (person: Person) => {
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
  };

  const fetchAshtakvarga = async () => {
    if (!selectedPerson) {
      Swal.fire({
        icon: "warning",
        title: "Select Person",
        text: "Please select a person first",
        background: "#1f2937",
        color: "#f3f4f6",
        confirmButtonColor: "#8b5cf6",
      });
      return;
    }
    const authToken = user?.token;
    const apiKey = (user as any)?.userApiKey || (user as any)?.apikey || "";

    setLoading(true);
    try {
      const payload = getBirthDataPayload(selectedPerson);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NEXT_JS_API_URL}/api/mainapi/ashtakvarga`,
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
      const result: AshtakvargaResponse = await response.json();
      if (result.status === "Fail") {
        throw new Error(result.message || "Failed to fetch Ashtakvarga data");
      }
      setAshtakData(result);
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
        error instanceof Error ? error.message : "Failed to get data";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        background: "#1f2937",
        color: "#f3f4f6",
        confirmButtonColor: "#8b5cf6",
      });
    } finally {
      setLoading(false);
    }
  };

  // ============ Data Helpers ============
  const getPoints = (data: PlanetAshtakVarga | null): number[] => {
    if (!data?.ashtak_points) return Array(12).fill(0);
    return SIGN_KEYS.map(
      (sign) => data.ashtak_points[sign as SignKey]?.total || 0,
    );
  };

  const getTotal = (data: PlanetAshtakVarga | null): number => {
    if (!data?.ashtak_points) return 0;
    return SIGN_KEYS.reduce(
      (sum, sign) => sum + (data.ashtak_points[sign as SignKey]?.total || 0),
      0,
    );
  };

  const getSarvashtakPoints = (): number[] => {
    const sarva = ashtakData?.data?.sarvashtakvarga;
    if (!sarva?.ashtak_points) return Array(12).fill(0);
    return SIGN_KEYS.map(
      (sign) => sarva.ashtak_points[sign as SignKey]?.total || 0,
    );
  };

  const getSarvashtakTotal = (): number => {
    return getSarvashtakPoints().reduce((a, b) => a + b, 0);
  };

  const getDetailedBreakdown = (
    planetKey: string,
    signKey: SignKey,
  ): SignAshtakPoints | null => {
    const planetData = ashtakData?.data?.planet_ashtakvarga?.[planetKey];
    if (!planetData?.ashtak_points) return null;
    return planetData.ashtak_points[signKey];
  };

  const getSarvaBreakdown = (signKey: SignKey): SignAshtakPoints | null => {
    const sarva = ashtakData?.data?.sarvashtakvarga;
    if (!sarva?.ashtak_points) return null;
    return sarva.ashtak_points[signKey];
  };

  const planetTotals = useMemo(() => {
    if (!ashtakData?.data?.planet_ashtakvarga) return [];
    return Object.keys(PLANETS_CONFIG).map((key) => ({
      key,
      ...getConfig(key),
      total: getTotal(ashtakData.data.planet_ashtakvarga[key] || null),
      points: getPoints(ashtakData.data.planet_ashtakvarga[key] || null),
    }));
  }, [ashtakData]);

  const highestPlanet =
    planetTotals.length > 0
      ? planetTotals.reduce((max, p) => (p.total > max.total ? p : max))
      : null;
  const lowestPlanet =
    planetTotals.length > 0
      ? planetTotals.reduce((min, p) => (p.total < min.total ? p : min))
      : null;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden bg-gradient-to-r from-indigo-700 via-purple-700 to-violet-700 rounded-2xl p-6 md:p-8 text-white shadow-xl mb-8"
        >
          {/* Soft Glow Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>

          {/* Watermark Icon */}
          <div className="absolute top-4 right-8 opacity-20">
            <Iconify
              icon="solar:chart-square-bold-duotone"
              width={110}
              height={110}
            />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Iconify
                  icon="solar:chart-square-bold-duotone"
                  width={40}
                  height={40}
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium">
                    Ashtakvarga
                  </span>
                  <span className="px-2 py-0.5 bg-green-500 rounded-full text-xs font-medium flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    Ready
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold">
                  Ashtakvarga System
                </h1>

                <p className="text-white/80 mt-1 max-w-xl">
                  Comprehensive bindu-based planetary strength analysis using
                  the ancient 8-fold division system for precise predictions.
                </p>
              </div>
            </div>

            {/* Info Badges */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/20">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Iconify icon="solar:calculator-bold" width={20} />
                </div>
                <div>
                  <p className="font-semibold">337</p>
                  <p className="text-sm text-white/70">Max Bindus</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/20">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Iconify icon="solar:planet-bold" width={20} />
                </div>
                <div>
                  <p className="font-semibold">7</p>
                  <p className="text-sm text-white/70">Planets</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/20">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Iconify icon="solar:star-bold" width={20} />
                </div>
                <div>
                  <p className="font-semibold">12</p>
                  <p className="text-sm text-white/70">Signs</p>
                </div>
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
            {/* Person Selector */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center text-white">
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
                onClick={fetchAshtakvarga}
                disabled={loading || !selectedPerson}
                className={`mt-4 w-full h-12 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                  selectedPerson && !loading
                    ? "bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:-translate-y-0.5"
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
                    <Iconify icon="solar:calculator-bold" width={20} />
                    <span>Calculate Bindus</span>
                  </>
                )}
              </button>

              <AnimatePresence>
                {selectedPerson && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center text-white font-bold">
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

            {/* 7 Planets Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white">
                  <Iconify icon="solar:planet-bold-duotone" width={20} />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  7 Planets
                </h4>
              </div>
              <div className="space-y-2">
                {Object.entries(PLANETS_CONFIG).map(([key, config]) => {
                  const planetTotal = ashtakData
                    ? getTotal(
                        ashtakData.data?.planet_ashtakvarga?.[key] || null,
                      )
                    : 0;
                  return (
                    <div
                      key={key}
                      className={`flex items-center justify-between p-2 rounded-lg ${config.bgColor}`}
                    >
                      <div className="flex items-center gap-2">
                        <Iconify
                          icon={config.icon}
                          width={18}
                          style={{ color: config.color }}
                        />
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {config.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {ashtakData && (
                          <span
                            className="text-xs font-bold px-1.5 py-0.5 bg-white dark:bg-gray-800 rounded"
                            style={{ color: config.color }}
                          >
                            {planetTotal}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {ashtakData && (
                <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    SAV Total
                  </span>
                  <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                    {getSarvashtakTotal()}
                  </span>
                </div>
              )}
            </div>

            {/* Quick Summary Card */}
            <AnimatePresence>
              {ashtakData && highestPlanet && lowestPlanet && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-gradient-to-br from-purple-500 via-violet-500 to-fuchsia-500 rounded-2xl p-5 text-white shadow-xl shadow-purple-500/20"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Iconify icon="solar:graph-up-bold" width={20} />
                    <h4 className="font-semibold">Quick Summary</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                      <span className="text-sm text-white/70">Strongest</span>
                      <div className="flex items-center gap-2">
                        <Iconify icon={highestPlanet.icon} width={16} />
                        <span className="font-medium">
                          {highestPlanet.name}
                        </span>
                        <span className="text-xs bg-white/20 px-1.5 rounded">
                          {highestPlanet.total}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                      <span className="text-sm text-white/70">Weakest</span>
                      <div className="flex items-center gap-2">
                        <Iconify icon={lowestPlanet.icon} width={16} />
                        <span className="font-medium">{lowestPlanet.name}</span>
                        <span className="text-xs bg-white/20 px-1.5 rounded">
                          {lowestPlanet.total}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                      <span className="text-sm text-white/70">Avg/Sign</span>
                      <span className="font-medium">
                        {(getSarvashtakTotal() / 12).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-900/50 dark:to-violet-900/50 flex items-center justify-center">
                          <Iconify
                            icon="solar:chart-square-bold-duotone"
                            width={48}
                            className="text-purple-500 animate-pulse"
                          />
                        </div>
                        <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-transparent border-t-purple-500 border-r-violet-500 animate-spin" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Calculating Ashtakvarga
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Analyzing bindu points across all planets...
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {ashtakData ? (
              <div className="space-y-6">
                {/* Quick Stats */}
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                  <StatsCard
                    icon="solar:chart-square-bold-duotone"
                    label="SAV Total"
                    value={getSarvashtakTotal().toString()}
                    subValue="/ 337"
                    color="from-purple-500 to-violet-500"
                  />
                  <StatsCard
                    icon="solar:chart-bold-duotone"
                    label="Avg per Sign"
                    value={(getSarvashtakTotal() / 12).toFixed(1)}
                    color="from-amber-500 to-orange-500"
                  />
                  {highestPlanet && (
                    <StatsCard
                      icon={highestPlanet.icon}
                      label="Strongest"
                      value={highestPlanet.name}
                      subValue={`${highestPlanet.total} pts`}
                      color={highestPlanet.gradient}
                    />
                  )}
                  {lowestPlanet && (
                    <StatsCard
                      icon={lowestPlanet.icon}
                      label="Needs Work"
                      value={lowestPlanet.name}
                      subValue={`${lowestPlanet.total} pts`}
                      color={lowestPlanet.gradient}
                    />
                  )}
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
                              ? "text-purple-600 dark:text-purple-400"
                              : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
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
                              layoutId="activeTabAshtak"
                              className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-violet-500"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

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
                            ashtakData={ashtakData}
                            planetTotals={planetTotals}
                            getSarvashtakPoints={getSarvashtakPoints}
                            getSarvashtakTotal={getSarvashtakTotal}
                          />
                        )}
                        {activeTab === "sarvashtakvarga" && (
                          <SarvashtakvargaTab
                            getSarvashtakPoints={getSarvashtakPoints}
                            getSarvashtakTotal={getSarvashtakTotal}
                            getSarvaBreakdown={getSarvaBreakdown}
                          />
                        )}
                        {activeTab === "planets" && (
                          <PlanetTab
                            ashtakData={ashtakData}
                            selectedPlanet={selectedPlanet}
                            setSelectedPlanet={setSelectedPlanet}
                            getPoints={getPoints}
                            getTotal={getTotal}
                            getDetailedBreakdown={getDetailedBreakdown}
                            getSarvashtakPoints={getSarvashtakPoints}
                            getSarvashtakTotal={getSarvashtakTotal}
                          />
                        )}
                        {activeTab === "analysis" && (
                          <AnalysisTab
                            planetTotals={planetTotals}
                            getSarvashtakPoints={getSarvashtakPoints}
                          />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Info Footer */}
                <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl p-5 border border-purple-200/50 dark:border-purple-800/50">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center text-white flex-shrink-0">
                      <Iconify icon="solar:info-circle-bold" width={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        About Ashtakvarga
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Ashtakvarga is a unique Vedic system that quantifies
                        planetary strength through bindus (benefic points). Each
                        planet gets 0-8 bindus per sign, totaling up to 56 per
                        planet and 337 for Sarvashtakvarga. Higher bindus
                        indicate stronger positive results during transits and
                        dashas.
                      </p>
                    </div>
                  </div>
                </div>
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

// ============ Tab Components ============

function OverviewTab({
  ashtakData,
  planetTotals,
  getSarvashtakPoints,
  getSarvashtakTotal,
}: {
  ashtakData: AshtakvargaResponse;
  planetTotals: Array<{
    key: string;
    name: string;
    icon: string;
    color: string;
    gradient: string;
    bgColor: string;
    total: number;
    points: number[];
  }>;
  getSarvashtakPoints: () => number[];
  getSarvashtakTotal: () => number;
}) {
  const sarvaPoints = getSarvashtakPoints();
  const sarvaTotal = getSarvashtakTotal();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Sarvashtakvarga Overview */}
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center text-white">
              <Iconify icon="solar:chart-square-bold" width={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">
                Sarvashtakvarga Overview
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Combined bindus across all signs
              </p>
            </div>
          </div>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
            {SIGN_KEYS.map((signKey, idx) => {
              const config = getSignConfig(signKey);
              const points = sarvaPoints[idx] || 0;
              const level = getSarvaLevel(points);
              const levelBadge = getLevelBadge(level);

              return (
                <motion.div
                  key={signKey}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  className="flex flex-col items-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
                >
                  <span className="text-2xl mb-1">{config.emoji}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    {config.short}
                  </span>
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white ${
                      level === "high"
                        ? "bg-green-500"
                        : level === "medium"
                          ? "bg-amber-500"
                          : "bg-red-500"
                    }`}
                  >
                    {points}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Planet Strength Chart */}
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white">
              <Iconify icon="solar:ranking-bold" width={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">
                Planet Strength
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total bindus per planet
              </p>
            </div>
          </div>
        </div>
        <div className="p-5 space-y-4">
          {[...planetTotals]
            .sort((a, b) => b.total - a.total)
            .map((planet, idx) => {
              const percentage = (planet.total / 56) * 100;
              return (
                <motion.div
                  key={planet.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center gap-4"
                >
                  <span className="w-6 text-center text-sm font-bold text-gray-400">
                    #{idx + 1}
                  </span>
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${planet.gradient} flex items-center justify-center text-white`}
                  >
                    <Iconify icon={planet.icon} width={20} />
                  </div>
                  <span className="w-20 text-sm font-medium text-gray-900 dark:text-white">
                    {planet.name}
                  </span>
                  <div className="flex-1">
                    <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.6, delay: idx * 0.05 }}
                        className={`h-full bg-gradient-to-r ${planet.gradient} rounded-full`}
                      />
                    </div>
                  </div>
                  <span
                    className="w-12 text-right text-sm font-bold"
                    style={{ color: planet.color }}
                  >
                    {planet.total}
                  </span>
                </motion.div>
              );
            })}
        </div>
      </motion.div>
    </motion.div>
  );
}

function SarvashtakvargaTab({
  getSarvashtakPoints,
  getSarvashtakTotal,
  getSarvaBreakdown,
}: {
  getSarvashtakPoints: () => number[];
  getSarvashtakTotal: () => number;
  getSarvaBreakdown: (signKey: SignKey) => SignAshtakPoints | null;
}) {
  const [selectedSign, setSelectedSign] = useState<SignKey | null>(null);
  const sarvaPoints = getSarvashtakPoints();
  const sarvaTotal = getSarvashtakTotal();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Main Grid */}
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-500/10 to-violet-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center text-white shadow-lg">
                <Iconify icon="solar:chart-square-bold" width={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                  Sarvashtakvarga Chart
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Click any sign to see breakdown
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                {sarvaTotal}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Total Bindus
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
            {SIGN_KEYS.map((signKey, idx) => {
              const config = getSignConfig(signKey);
              const points = sarvaPoints[idx] || 0;
              const level = getSarvaLevel(points);
              const isSelected = selectedSign === signKey;

              return (
                <motion.button
                  key={signKey}
                  onClick={() => setSelectedSign(isSelected ? null : signKey)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex flex-col items-center p-4 rounded-xl transition-all cursor-pointer ${
                    isSelected
                      ? "bg-purple-100 dark:bg-purple-900/30 ring-2 ring-purple-500"
                      : "bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800"
                  } border border-gray-200 dark:border-gray-700`}
                >
                  <span className="text-2xl mb-1">{config.emoji}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    {config.short}
                  </span>
                  <div
                    className={`w-11 h-11 rounded-lg flex items-center justify-center font-bold text-white shadow-lg ${
                      level === "high"
                        ? "bg-green-500"
                        : level === "medium"
                          ? "bg-amber-500"
                          : "bg-red-500"
                    }`}
                  >
                    {points}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Breakdown Panel */}
          <AnimatePresence>
            {selectedSign && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 p-5 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl border border-purple-200/50 dark:border-purple-800/50"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">
                    {getSignConfig(selectedSign).emoji}
                  </span>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      {getSignConfig(selectedSign).name} Breakdown
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Contribution from each planet
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                  {Object.entries(PLANETS_CONFIG).map(([key, config]) => {
                    const breakdown = getSarvaBreakdown(selectedSign);
                    const value = breakdown
                      ? breakdown[key as keyof SignAshtakPoints] || 0
                      : 0;

                    return (
                      <div
                        key={key}
                        className={`flex flex-col items-center p-3 rounded-xl bg-white dark:bg-gray-800 border ${
                          value >= 5
                            ? "border-green-300 dark:border-green-700"
                            : "border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        <Iconify
                          icon={config.icon}
                          width={20}
                          style={{ color: config.color }}
                        />
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {config.name}
                        </span>
                        <span
                          className="text-lg font-bold mt-1"
                          style={{ color: config.color }}
                        >
                          {value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Legend */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-wrap items-center gap-6">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Strength Level:
            </span>
            {[
              { label: "Strong (28+)", color: "bg-green-500" },
              { label: "Moderate (22-27)", color: "bg-amber-500" },
              { label: "Weak (<22)", color: "bg-red-500" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function PlanetTab({
  ashtakData,
  selectedPlanet,
  setSelectedPlanet,
  getPoints,
  getTotal,
  getDetailedBreakdown,
  getSarvashtakPoints,
  getSarvashtakTotal,
}: {
  ashtakData: AshtakvargaResponse;
  selectedPlanet: string;
  setSelectedPlanet: (p: string) => void;
  getPoints: (data: PlanetAshtakVarga | null) => number[];
  getTotal: (data: PlanetAshtakVarga | null) => number;
  getDetailedBreakdown: (
    planetKey: string,
    signKey: SignKey,
  ) => SignAshtakPoints | null;
  getSarvashtakPoints: () => number[];
  getSarvashtakTotal: () => number;
}) {
  const [selectedSign, setSelectedSign] = useState<SignKey | null>(null);
  const selectedConfig = getConfig(selectedPlanet);
  const planetData = ashtakData?.data?.planet_ashtakvarga?.[selectedPlanet];
  const points = getPoints(planetData || null);
  const total = getTotal(planetData || null);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Planet Selector */}
      <motion.div
        variants={itemVariants}
        className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
      >
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 font-medium">
          Select Planet
        </p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(PLANETS_CONFIG).map(([key, config]) => {
            const isSelected = selectedPlanet === key;
            const pData = ashtakData?.data?.planet_ashtakvarga?.[key];
            const pTotal = getTotal(pData || null);

            return (
              <button
                key={key}
                onClick={() => {
                  setSelectedPlanet(key);
                  setSelectedSign(null);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isSelected
                    ? `bg-gradient-to-r ${config.gradient} text-white shadow-lg`
                    : `${config.bgColor} text-gray-700 dark:text-gray-300 hover:shadow-md border border-gray-200/50 dark:border-gray-700/50`
                }`}
              >
                <Iconify icon={config.icon} width={18} />
                <span className="hidden sm:inline">{config.name}</span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded ${isSelected ? "bg-white/20" : "bg-white dark:bg-gray-800"}`}
                >
                  {pTotal}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Selected Planet Grid */}
      <motion.div
        variants={itemVariants}
        className={`${selectedConfig.bgColor} rounded-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden`}
      >
        <div
          className={`px-5 py-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r ${selectedConfig.gradient} text-white`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Iconify icon={selectedConfig.icon} width={28} />
              </div>
              <div>
                <h3 className="font-bold text-xl">
                  {selectedConfig.name} Ashtakvarga
                </h3>
                <p className="text-white/80 text-sm">
                  Bindu distribution across signs
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold">{total}</p>
              <p className="text-xs text-white/70">Total Bindus</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
            {SIGN_KEYS.map((signKey, idx) => {
              const config = getSignConfig(signKey);
              const pointValue = points[idx] || 0;
              const level = getBinduLevel(pointValue);
              const isSelected = selectedSign === signKey;

              return (
                <motion.button
                  key={signKey}
                  onClick={() => setSelectedSign(isSelected ? null : signKey)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex flex-col items-center p-3 rounded-xl transition-all cursor-pointer ${
                    isSelected
                      ? `bg-white dark:bg-gray-800 ring-2 shadow-lg`
                      : "bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800"
                  } border border-gray-200/50 dark:border-gray-700/50`}
                  style={{
                    ["--tw-ring-color" as string]: isSelected
                      ? selectedConfig.color
                      : undefined,
                  }}
                >
                  <span className="text-xl mb-1">{config.emoji}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {config.short}
                  </span>
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white ${
                      level === "high"
                        ? "bg-green-500"
                        : level === "medium"
                          ? "bg-amber-500"
                          : "bg-red-500"
                    }`}
                  >
                    {pointValue}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Breakdown Panel */}
          <AnimatePresence>
            {selectedSign && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">
                    {getSignConfig(selectedSign).emoji}
                  </span>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      {selectedConfig.name} in{" "}
                      {getSignConfig(selectedSign).name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Who contributed bindus?
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                  {[
                    ...Object.entries(PLANETS_CONFIG).map(([k, c]) => ({
                      key: k,
                      name: c.name,
                      icon: c.icon,
                      color: c.color,
                    })),
                    {
                      key: "ascendant",
                      name: "Ascendant",
                      icon: "solar:arrow-up-bold",
                      color: "#8B5CF6",
                    },
                  ].map((cont) => {
                    const breakdown = getDetailedBreakdown(
                      selectedPlanet,
                      selectedSign,
                    );
                    const value = breakdown
                      ? breakdown[cont.key as keyof SignAshtakPoints] || 0
                      : 0;

                    return (
                      <div
                        key={cont.key}
                        className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                          value === 1
                            ? "bg-green-100 dark:bg-green-900/30 border-2 border-green-300 dark:border-green-700"
                            : "bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        <Iconify
                          icon={cont.icon}
                          width={18}
                          style={{
                            color: value === 1 ? "#22C55E" : cont.color,
                          }}
                        />
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate w-full text-center">
                          {cont.name}
                        </span>
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mt-2 ${
                            value === 1
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                          }`}
                        >
                          {value}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats */}
          <div className="mt-6 pt-4 border-t border-gray-200/50 dark:border-gray-700/50 grid grid-cols-3 gap-4">
            {[
              {
                label: "Highest",
                value: Math.max(...points),
                sign: getSignConfig(
                  SIGN_KEYS[points.indexOf(Math.max(...points))],
                ).name,
                color: "text-green-500",
              },
              {
                label: "Lowest",
                value: Math.min(...points),
                sign: getSignConfig(
                  SIGN_KEYS[points.indexOf(Math.min(...points))],
                ).name,
                color: "text-red-500",
              },
              {
                label: "Average",
                value: (total / 12).toFixed(1),
                sign: "per sign",
                color: "text-purple-500",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl"
              >
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  {stat.label}
                </p>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {stat.sign}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Complete Matrix */}
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <h3 className="font-bold text-gray-900 dark:text-white">
            Complete Matrix
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            All planets across all signs
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800 z-10">
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase sticky left-0 bg-gray-50 dark:bg-gray-800">
                  Planet
                </th>
                {SIGN_KEYS.map((signKey) => (
                  <th key={signKey} className="px-2 py-3 text-center">
                    <span className="text-lg">
                      {getSignConfig(signKey).emoji}
                    </span>
                  </th>
                ))}
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(PLANETS_CONFIG).map(([key, config]) => {
                const pData = ashtakData?.data?.planet_ashtakvarga?.[key];
                const pPoints = getPoints(pData || null);
                const pTotal = getTotal(pData || null);

                return (
                  <tr
                    key={key}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="px-4 py-3 sticky left-0 bg-white dark:bg-gray-900">
                      <div className="flex items-center gap-2">
                        <Iconify
                          icon={config.icon}
                          width={18}
                          style={{ color: config.color }}
                        />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {config.name}
                        </span>
                      </div>
                    </td>
                    {pPoints.map((point, idx) => {
                      const level = getBinduLevel(point);
                      return (
                        <td key={idx} className="px-2 py-3 text-center">
                          <span
                            className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold text-white ${
                              level === "high"
                                ? "bg-green-500"
                                : level === "medium"
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                            }`}
                          >
                            {point}
                          </span>
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 text-center">
                      <span
                        className="font-bold"
                        style={{ color: config.color }}
                      >
                        {pTotal}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {/* SAV Row */}
              <tr className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 font-semibold">
                <td className="px-4 py-3 sticky left-0 bg-purple-50 dark:bg-purple-900/20">
                  <div className="flex items-center gap-2">
                    <Iconify
                      icon="solar:chart-square-bold"
                      width={18}
                      className="text-purple-500"
                    />
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      SAV
                    </span>
                  </div>
                </td>
                {getSarvashtakPoints().map((point, idx) => {
                  const level = getSarvaLevel(point);
                  return (
                    <td key={idx} className="px-2 py-3 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold text-white ${
                          level === "high"
                            ? "bg-green-500"
                            : level === "medium"
                              ? "bg-amber-500"
                              : "bg-red-500"
                        }`}
                      >
                        {point}
                      </span>
                    </td>
                  );
                })}
                <td className="px-4 py-3 text-center">
                  <span className="font-bold text-purple-600">
                    {getSarvashtakTotal()}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AnalysisTab({
  planetTotals,
  getSarvashtakPoints,
}: {
  planetTotals: Array<{
    key: string;
    name: string;
    icon: string;
    color: string;
    gradient: string;
    bgColor: string;
    total: number;
    points: number[];
  }>;
  getSarvashtakPoints: () => number[];
}) {
  const sarvaPoints = getSarvashtakPoints();
  const strongSigns = sarvaPoints
    .map((points, idx) => ({
      sign: SIGN_KEYS[idx],
      config: getSignConfig(SIGN_KEYS[idx]),
      points,
    }))
    .filter((s) => s.points >= 28)
    .sort((a, b) => b.points - a.points);
  const weakSigns = sarvaPoints
    .map((points, idx) => ({
      sign: SIGN_KEYS[idx],
      config: getSignConfig(SIGN_KEYS[idx]),
      points,
    }))
    .filter((s) => s.points < 22)
    .sort((a, b) => a.points - b.points);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Strong & Weak Signs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strong Signs */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800/50 rounded-xl border border-green-200 dark:border-green-800/50 overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-green-100 dark:border-green-800/50 bg-green-50 dark:bg-green-900/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white shadow-lg">
                <Iconify icon="solar:arrow-up-bold" width={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">
                  Favorable Signs
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  28+ bindus — excellent
                </p>
              </div>
            </div>
          </div>
          <div className="p-5">
            {strongSigns.length > 0 ? (
              <div className="space-y-3">
                {strongSigns.map((item, idx) => (
                  <motion.div
                    key={item.sign}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800/50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-green-500 text-white text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-2xl">{item.config.emoji}</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {item.config.name}
                      </span>
                    </div>
                    <span className="text-xl font-bold text-green-600">
                      {item.points}
                    </span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Iconify
                  icon="solar:check-circle-bold"
                  width={40}
                  className="text-gray-300 dark:text-gray-600 mx-auto mb-2"
                />
                <p className="text-gray-500 dark:text-gray-400">
                  No exceptionally strong signs
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Weak Signs */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800/50 rounded-xl border border-red-200 dark:border-red-800/50 overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-red-100 dark:border-red-800/50 bg-red-50 dark:bg-red-900/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center text-white shadow-lg">
                <Iconify icon="solar:arrow-down-bold" width={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">
                  Challenging Signs
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  &lt;22 bindus — caution
                </p>
              </div>
            </div>
          </div>
          <div className="p-5">
            {weakSigns.length > 0 ? (
              <div className="space-y-3">
                {weakSigns.map((item, idx) => (
                  <motion.div
                    key={item.sign}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800/50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-2xl">{item.config.emoji}</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {item.config.name}
                      </span>
                    </div>
                    <span className="text-xl font-bold text-red-600">
                      {item.points}
                    </span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Iconify
                  icon="solar:confetti-bold"
                  width={40}
                  className="text-green-500 mx-auto mb-2"
                />
                <p className="text-gray-500 dark:text-gray-400">
                  No weak signs — Excellent!
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Planet Ranking */}
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg">
            <Iconify icon="solar:cup-star-bold" width={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">
              Planet Power Ranking
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Sorted by total bindus
            </p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {[...planetTotals]
            .sort((a, b) => b.total - a.total)
            .map((planet, idx) => {
              const percentage = (planet.total / 56) * 100;
              const medals = ["🥇", "🥈", "🥉"];

              return (
                <motion.div
                  key={planet.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center gap-4"
                >
                  <span className="w-10 text-center text-xl">
                    {idx < 3 ? medals[idx] : `#${idx + 1}`}
                  </span>
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${planet.gradient} flex items-center justify-center text-white shadow-lg`}
                  >
                    <Iconify icon={planet.icon} width={20} />
                  </div>
                  <span className="w-20 text-sm font-medium text-gray-900 dark:text-white">
                    {planet.name}
                  </span>
                  <div className="flex-1">
                    <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.6, delay: idx * 0.05 }}
                        className={`h-full bg-gradient-to-r ${planet.gradient} rounded-full`}
                      />
                    </div>
                  </div>
                  <span
                    className="w-12 text-right text-lg font-bold"
                    style={{ color: planet.color }}
                  >
                    {planet.total}
                  </span>
                </motion.div>
              );
            })}
        </div>
      </motion.div>

      {/* Guide */}
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg">
            <Iconify icon="solar:book-bold" width={20} />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white">
            Understanding Ashtakvarga
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200/50 dark:border-purple-800/50">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Iconify
                icon="solar:chart-square-bold"
                className="text-purple-500"
                width={18}
              />
              Sarvashtakvarga (SAV)
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <Iconify
                  icon="solar:check-circle-bold"
                  className="text-purple-500 mt-0.5"
                  width={14}
                />
                <span>Total possible: 337 bindus</span>
              </li>
              <li className="flex items-start gap-2">
                <Iconify
                  icon="solar:check-circle-bold"
                  className="text-purple-500 mt-0.5"
                  width={14}
                />
                <span>Ideal average: 28 per sign</span>
              </li>
              <li className="flex items-start gap-2">
                <Iconify
                  icon="solar:check-circle-bold"
                  className="text-purple-500 mt-0.5"
                  width={14}
                />
                <span>28+ bindus = favorable activities</span>
              </li>
              <li className="flex items-start gap-2">
                <Iconify
                  icon="solar:check-circle-bold"
                  className="text-purple-500 mt-0.5"
                  width={14}
                />
                <span>Great for transit timing</span>
              </li>
            </ul>
          </div>
          <div className="p-4 bg-violet-50 dark:bg-violet-900/20 rounded-xl border border-violet-200/50 dark:border-violet-800/50">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Iconify
                icon="solar:planet-bold"
                className="text-violet-500"
                width={18}
              />
              Bhinna Ashtakvarga (BAV)
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <Iconify
                  icon="solar:check-circle-bold"
                  className="text-violet-500 mt-0.5"
                  width={14}
                />
                <span>Each planet: max 56 bindus</span>
              </li>
              <li className="flex items-start gap-2">
                <Iconify
                  icon="solar:check-circle-bold"
                  className="text-violet-500 mt-0.5"
                  width={14}
                />
                <span>Per sign: 0-8 bindus possible</span>
              </li>
              <li className="flex items-start gap-2">
                <Iconify
                  icon="solar:check-circle-bold"
                  className="text-violet-500 mt-0.5"
                  width={14}
                />
                <span>4+ per sign = beneficial</span>
              </li>
              <li className="flex items-start gap-2">
                <Iconify
                  icon="solar:check-circle-bold"
                  className="text-violet-500 mt-0.5"
                  width={14}
                />
                <span>Essential for muhurta selection</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============ Sub Components ============

function StatsCard({
  icon,
  label,
  value,
  subValue,
  color,
}: {
  icon: string;
  label: string;
  value: string;
  subValue?: string;
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
        <div className="min-w-0">
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <div className="flex items-baseline gap-1">
            <p className="text-xl font-bold text-gray-900 dark:text-white truncate">
              {value}
            </p>
            {subValue && (
              <span className="text-sm text-gray-400">{subValue}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
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
        <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-900/50 dark:to-violet-900/50 flex items-center justify-center mb-6 shadow-xl">
          <Iconify
            icon="solar:chart-square-bold-duotone"
            width={56}
            className="text-purple-500"
          />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Ashtakvarga Analysis
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Select a person and click &quot;Calculate Bindus&quot; to view
          comprehensive Ashtakvarga analysis, planetary strength, and sign-wise
          bindu distribution.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {Object.entries(PLANETS_CONFIG).map(([key, config]) => (
            <span
              key={key}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${config.bgColor}`}
              style={{ color: config.color }}
            >
              {config.name}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
