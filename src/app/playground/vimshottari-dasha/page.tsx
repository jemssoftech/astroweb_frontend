"use client";

import { useState, useCallback } from "react";
import PersonSelector from "@/src/components/PersonSelector";
import Iconify from "@/src/components/Iconify";
import { Person } from "@/src/lib/models";
import Swal from "sweetalert2";
import api from "@/src/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { AxiosError } from "axios";

// ============ TYPES ============

interface DashaPeriod {
  planet: string;
  planet_id: number;
  start: string;
  end: string;
}

interface MajorDashaData {
  dasha_period: DashaPeriod[];
}

interface MinorDashaData {
  planet: { major: string };
  dasha_period: DashaPeriod[];
}

interface SubMinorDashaData {
  planet: { major: string; minor: string };
  dasha_period: DashaPeriod[];
}

interface SubSubMinorDashaData {
  planet: { major: string; minor: string; sub_minor: string };
  dasha_period: DashaPeriod[];
}

interface SubSubSubMinorDashaData {
  planet: {
    major: string;
    minor: string;
    sub_minor: string;
    sub_sub_minor: string;
  };
  dasha_period: DashaPeriod[];
}

interface CurrentVdashaAll {
  major: MajorDashaData;
  minor: MinorDashaData;
  sub_minor: SubMinorDashaData;
  sub_sub_minor: SubSubMinorDashaData;
  sub_sub_sub_minor: SubSubSubMinorDashaData;
}

interface CurrentVdasha {
  major: DashaPeriod;
  minor: DashaPeriod;
  sub_minor: DashaPeriod;
  sub_sub_minor: DashaPeriod;
  sub_sub_sub_minor: DashaPeriod;
}

interface VdashaAPIResponse {
  success: boolean;
  current_vdasha_all?: CurrentVdashaAll;
  major_vdasha?: DashaPeriod[];
  current_vdasha?: CurrentVdasha;
  error?: string;
  message?: string;
  [key: string]: unknown;
}

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

// ============ CONSTANTS ============

interface PlanetConfig {
  color: string;
  gradient: string;
  bgColor: string;
  icon: string;
  darkBg: string;
}

const PLANET_CONFIG: Record<string, PlanetConfig> = {
  Sun: {
    color: "#F59E0B",
    gradient: "from-amber-400 to-orange-500",
    bgColor: "bg-amber-50",
    icon: "solar:sun-bold-duotone",
    darkBg: "dark:bg-amber-900/20",
  },
  Moon: {
    color: "#6B7280",
    gradient: "from-slate-400 to-gray-500",
    bgColor: "bg-slate-50",
    icon: "solar:moon-bold-duotone",
    darkBg: "dark:bg-slate-800/50",
  },
  Mars: {
    color: "#EF4444",
    gradient: "from-red-400 to-rose-500",
    bgColor: "bg-red-50",
    icon: "solar:flame-bold-duotone",
    darkBg: "dark:bg-red-900/20",
  },
  Mercury: {
    color: "#22C55E",
    gradient: "from-green-400 to-emerald-500",
    bgColor: "bg-green-50",
    icon: "solar:wind-bold-duotone",
    darkBg: "dark:bg-green-900/20",
  },
  Jupiter: {
    color: "#F97316",
    gradient: "from-orange-400 to-amber-500",
    bgColor: "bg-orange-50",
    icon: "solar:crown-bold-duotone",
    darkBg: "dark:bg-orange-900/20",
  },
  Venus: {
    color: "#EC4899",
    gradient: "from-pink-400 to-rose-500",
    bgColor: "bg-pink-50",
    icon: "solar:heart-bold-duotone",
    darkBg: "dark:bg-pink-900/20",
  },
  Saturn: {
    color: "#6366F1",
    gradient: "from-indigo-400 to-violet-500",
    bgColor: "bg-indigo-50",
    icon: "solar:clock-circle-bold-duotone",
    darkBg: "dark:bg-indigo-900/20",
  },
  Rahu: {
    color: "#8B5CF6",
    gradient: "from-violet-400 to-purple-500",
    bgColor: "bg-violet-50",
    icon: "solar:black-hole-bold-duotone",
    darkBg: "dark:bg-violet-900/20",
  },
  Ketu: {
    color: "#D97706",
    gradient: "from-amber-500 to-yellow-600",
    bgColor: "bg-amber-50",
    icon: "solar:star-bold-duotone",
    darkBg: "dark:bg-amber-900/20",
  },
};

const PLANETS = [
  { value: "Sun", label: "Sun (Surya)" },
  { value: "Moon", label: "Moon (Chandra)" },
  { value: "Mars", label: "Mars (Mangal)" },
  { value: "Mercury", label: "Mercury (Budh)" },
  { value: "Jupiter", label: "Jupiter (Guru)" },
  { value: "Venus", label: "Venus (Shukra)" },
  { value: "Saturn", label: "Saturn (Shani)" },
  { value: "Rahu", label: "Rahu" },
  { value: "Ketu", label: "Ketu" },
] as const;

const TABS = [
  {
    key: "overview",
    label: "Overview",
    icon: "solar:widget-5-bold-duotone",
    color: "from-indigo-500 to-purple-500",
  },
  {
    key: "mahadasha",
    label: "Mahadasha",
    icon: "solar:ranking-bold-duotone",
    color: "from-amber-500 to-orange-500",
  },
  {
    key: "antardasha",
    label: "Antardasha",
    icon: "solar:layers-bold-duotone",
    color: "from-blue-500 to-cyan-500",
  },
  {
    key: "pratyantardasha",
    label: "Pratyantardasha",
    icon: "solar:layers-minimalistic-bold-duotone",
    color: "from-emerald-500 to-teal-500",
  },
  {
    key: "sukshma",
    label: "Sukshma",
    icon: "solar:tuning-2-bold-duotone",
    color: "from-pink-500 to-rose-500",
  },
  {
    key: "prana",
    label: "Prana",
    icon: "solar:atom-bold-duotone",
    color: "from-violet-500 to-purple-500",
  },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const DASHA_LEVELS = [
  {
    key: "major",
    label: "Mahadasha",
    shortLabel: "MD",
    description: "Major Period",
  },
  {
    key: "minor",
    label: "Antardasha",
    shortLabel: "AD",
    description: "Sub Period",
  },
  {
    key: "sub_minor",
    label: "Pratyantardasha",
    shortLabel: "PD",
    description: "Sub-Sub Period",
  },
  {
    key: "sub_sub_minor",
    label: "Sukshma",
    shortLabel: "SD",
    description: "Micro Period",
  },
  {
    key: "sub_sub_sub_minor",
    label: "Prana",
    shortLabel: "PrD",
    description: "Nano Period",
  },
] as const;

type DashaLevelKey = (typeof DASHA_LEVELS)[number]["key"];

// ============ ANIMATIONS ============

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// ============ HELPER FUNCTIONS ============

const calculateDuration = (start: string, end: string): string => {
  const startParts = start.split(" ")[0].split("-");
  const endParts = end.split(" ")[0].split("-");
  const startDate = new Date(
    +startParts[2],
    +startParts[1] - 1,
    +startParts[0],
  );
  const endDate = new Date(+endParts[2], +endParts[1] - 1, +endParts[0]);
  const diffDays = Math.ceil(
    Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  const years = Math.floor(diffDays / 365);
  const months = Math.floor((diffDays % 365) / 30);
  const days = diffDays % 30;

  if (years > 0) return `${years}y ${months}m`;
  if (months > 0) return `${months}m ${days}d`;
  return `${days}d`;
};

const formatDate = (dateStr: string): string => {
  if (!dateStr) return "-";
  return dateStr.split(" ")[0];
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const responseData = error.response?.data as ApiErrorResponse | undefined;
    return responseData?.message || responseData?.error || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
};

const showErrorAlert = (message: string) => {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: message,
    background: "#1f2937",
    color: "#f3f4f6",
    confirmButtonColor: "#6366f1",
  });
};

const showWarningAlert = (title: string, message: string) => {
  Swal.fire({
    icon: "warning",
    title,
    text: message,
    background: "#1f2937",
    color: "#f3f4f6",
    confirmButtonColor: "#6366f1",
  });
};

// ============ MAIN COMPONENT ============

export default function VimshottariDasha() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(false);
  const [dashaData, setDashaData] = useState<VdashaAPIResponse | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [md, setMd] = useState<string>("");
  const [ad, setAd] = useState<string>("");
  const [pd, setPd] = useState<string>("");
  const [sd, setSd] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handlePersonSelected = useCallback((person: Person) => {
    setSelectedPerson(person);
    setDashaData(null);
    setMd("");
    setAd("");
    setPd("");
    setSd("");
  }, []);

  const getBirthDataPayload = useCallback(
    (person: Person) => {
      const birthDate = new Date(person.BirthTime);
      let tzone = 0;

      if (person.TimezoneOffset) {
        const cleanOffset = person.TimezoneOffset.replace("+", "");
        const [h, m] = cleanOffset.split(":");
        const sign = person.TimezoneOffset.startsWith("-") ? -1 : 1;
        tzone = sign * (parseInt(h, 10) + parseInt(m, 10) / 60);
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
        ...(md && { md }),
        ...(md && ad && { ad }),
        ...(md && ad && pd && { pd }),
        ...(md && ad && pd && sd && { sd }),
      };
    },
    [md, ad, pd, sd],
  );

  const fetchDasha = useCallback(async () => {
    if (!selectedPerson) {
      showWarningAlert("Select Person", "Please select a person first");
      return;
    }

    setLoading(true);

    try {
      const payload = getBirthDataPayload(selectedPerson);
      const response = await api.post<VdashaAPIResponse>(
        "/api/mainapi/vimshottari-dasha",
        payload,
      );

      const resData = response.data;

      if (resData?.success) {
        setDashaData(resData);
      } else {
        showErrorAlert(
          resData?.error || resData?.message || "Failed to fetch dasha data",
        );
      }
    } catch (error) {
      console.error("Fetch Dasha Error:", error);
      showErrorAlert(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [selectedPerson, getBirthDataPayload]);

  // Helper functions for sub-dasha data
  const getSubVdasha = useCallback(
    (mdPlanet: string): DashaPeriod[] | null => {
      if (!dashaData || !mdPlanet) return null;
      return (dashaData[`sub_vdasha/${mdPlanet}`] as DashaPeriod[]) || null;
    },
    [dashaData],
  );

  const getSubSubVdasha = useCallback(
    (mdPlanet: string, adPlanet: string): DashaPeriod[] | null => {
      if (!dashaData || !mdPlanet || !adPlanet) return null;
      return (
        (dashaData[
          `sub_sub_vdasha/${mdPlanet}/${adPlanet}`
        ] as DashaPeriod[]) || null
      );
    },
    [dashaData],
  );

  const getSubSubSubVdasha = useCallback(
    (
      mdPlanet: string,
      adPlanet: string,
      pdPlanet: string,
    ): DashaPeriod[] | null => {
      if (!dashaData || !mdPlanet || !adPlanet || !pdPlanet) return null;
      return (
        (dashaData[
          `sub_sub_sub_vdasha/${mdPlanet}/${adPlanet}/${pdPlanet}`
        ] as DashaPeriod[]) || null
      );
    },
    [dashaData],
  );

  const getSubSubSubSubVdasha = useCallback(
    (
      mdPlanet: string,
      adPlanet: string,
      pdPlanet: string,
      sdPlanet: string,
    ): DashaPeriod[] | null => {
      if (!dashaData || !mdPlanet || !adPlanet || !pdPlanet || !sdPlanet)
        return null;
      return (
        (dashaData[
          `sub_sub_sub_sub_vdasha/${mdPlanet}/${adPlanet}/${pdPlanet}/${sdPlanet}`
        ] as DashaPeriod[]) || null
      );
    },
    [dashaData],
  );

  const parameterFields = [
    {
      label: "Mahadasha",
      value: md,
      setter: setMd,
      disabled: false,
      reset: () => {
        setAd("");
        setPd("");
        setSd("");
      },
    },
    {
      label: "Antardasha",
      value: ad,
      setter: setAd,
      disabled: !md,
      reset: () => {
        setPd("");
        setSd("");
      },
    },
    {
      label: "Pratyantardasha",
      value: pd,
      setter: setPd,
      disabled: !ad,
      reset: () => {
        setSd("");
      },
    },
    {
      label: "Sukshma",
      value: sd,
      setter: setSd,
      disabled: !pd,
      reset: () => {},
    },
  ];

  const selectedPath = [md, ad, pd, sd].filter(Boolean);

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
          {/* Background Decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>

          {/* Watermark Icon */}
          <div className="absolute top-4 right-8 opacity-20">
            <Iconify
              icon="solar:clock-circle-bold-duotone"
              width={110}
              height={110}
            />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Iconify
                  icon="solar:clock-circle-bold-duotone"
                  width={40}
                  height={40}
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium">
                    Vedic Astrology
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Vimshottari Dasha
                </h1>
                <p className="text-white/80 mt-1 max-w-xl">
                  120-year planetary period system for precise timing
                  predictions based on Moon&apos;s Nakshatra at birth.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/20">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Iconify icon="solar:calendar-bold" width={20} height={20} />
              </div>
              <div>
                <p className="font-semibold">120 Years</p>
                <p className="text-sm text-white/70">Dasha System</p>
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
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white">
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
                onClick={fetchDasha}
                disabled={loading || !selectedPerson}
                className={`mt-4 w-full h-12 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                  selectedPerson && !loading
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:-translate-y-0.5"
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
                    <span>Calculate Dasha</span>
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
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
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

            {/* Dasha Parameters Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white">
                    <Iconify icon="solar:tuning-2-bold" width={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Parameters
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Optional filters
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
                >
                  <Iconify
                    icon={
                      sidebarOpen
                        ? "solar:alt-arrow-up-bold"
                        : "solar:alt-arrow-down-bold"
                    }
                    width={16}
                    className="text-gray-500"
                  />
                </button>
              </div>

              <AnimatePresence>
                {sidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    {parameterFields.map((field) => (
                      <div key={field.label}>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                          {field.label}
                        </label>
                        <div className="relative">
                          <select
                            value={field.value}
                            onChange={(e) => {
                              field.setter(e.target.value);
                              field.reset();
                            }}
                            disabled={field.disabled}
                            className="w-full h-10 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl px-3 pr-8 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none cursor-pointer disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed disabled:text-gray-400"
                          >
                            <option value="">Select planet</option>
                            {PLANETS.map((p) => (
                              <option key={p.value} value={p.value}>
                                {p.label}
                              </option>
                            ))}
                          </select>
                          <Iconify
                            icon="solar:alt-arrow-down-bold"
                            width={14}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                          />
                        </div>
                      </div>
                    ))}

                    {/* Selected Path */}
                    {selectedPath.length > 0 && (
                      <div className="mt-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200/50 dark:border-indigo-800/50">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                          Selected Path
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {selectedPath.map((planet, idx, arr) => (
                            <span
                              key={idx}
                              className="flex items-center gap-1.5"
                            >
                              <PlanetBadge planet={planet} size="sm" />
                              {idx < arr.length - 1 && (
                                <Iconify
                                  icon="solar:arrow-right-linear"
                                  width={12}
                                  className="text-gray-400"
                                />
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={fetchDasha}
                      disabled={loading || !selectedPerson || !md}
                      className={`w-full h-10 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                        selectedPerson && md && !loading
                          ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:from-violet-600 hover:to-purple-600"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <Iconify icon="solar:refresh-bold" width={16} />
                      Recalculate
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Current Dasha Summary */}
            <AnimatePresence>
              {dashaData?.current_vdasha && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-500 rounded-2xl p-5 text-white shadow-xl shadow-purple-500/20"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Iconify icon="solar:clock-circle-bold" width={20} />
                    <h4 className="font-semibold">Current Running</h4>
                  </div>
                  <div className="space-y-2">
                    {DASHA_LEVELS.map((level) => {
                      const period =
                        dashaData.current_vdasha?.[level.key as DashaLevelKey];
                      if (!period) return null;
                      return (
                        <div
                          key={level.key}
                          className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2"
                        >
                          <span className="text-sm text-white/70">
                            {level.shortLabel}
                          </span>
                          <div className="flex items-center gap-2">
                            <Iconify
                              icon={
                                PLANET_CONFIG[period.planet]?.icon ||
                                "solar:planet-bold-duotone"
                              }
                              width={16}
                            />
                            <span className="font-medium">{period.planet}</span>
                          </div>
                        </div>
                      );
                    })}
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
            <LoadingOverlay loading={loading} />

            {dashaData ? (
              <div className="space-y-6">
                {/* Quick Stats */}
                <QuickStats dashaData={dashaData} />

                {/* Tabs */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
                  <TabNavigation
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                  />

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
                          <OverviewTab dashaData={dashaData} />
                        )}
                        {activeTab === "mahadasha" && (
                          <AllPeriodsSection dashaData={dashaData} />
                        )}
                        {activeTab === "antardasha" && (
                          <AntardashaTab
                            dashaData={dashaData}
                            md={md}
                            getSubVdasha={getSubVdasha}
                          />
                        )}
                        {activeTab === "pratyantardasha" && (
                          <PratyantardashaTab
                            dashaData={dashaData}
                            md={md}
                            ad={ad}
                            getSubSubVdasha={getSubSubVdasha}
                          />
                        )}
                        {activeTab === "sukshma" && (
                          <SukshmaTab
                            dashaData={dashaData}
                            md={md}
                            ad={ad}
                            pd={pd}
                            getSubSubSubVdasha={getSubSubSubVdasha}
                          />
                        )}
                        {activeTab === "prana" && (
                          <PranaTab
                            dashaData={dashaData}
                            md={md}
                            ad={ad}
                            pd={pd}
                            sd={sd}
                            getSubSubSubSubVdasha={getSubSubSubSubVdasha}
                          />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Info Card */}
                <InfoCard />
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

interface PlanetBadgeProps {
  planet: string;
  size?: "sm" | "md" | "lg";
}

function PlanetBadge({ planet, size = "md" }: PlanetBadgeProps) {
  const config = PLANET_CONFIG[planet];

  const sizeClasses = {
    sm: "px-2 py-1 text-xs gap-1",
    md: "px-3 py-1.5 text-sm gap-1.5",
    lg: "px-4 py-2 text-base gap-2",
  };

  const iconSizes = { sm: 12, md: 16, lg: 20 };

  return (
    <span
      className={`inline-flex items-center rounded-lg font-medium ${config?.bgColor || "bg-gray-50"} ${config?.darkBg || "dark:bg-gray-800"} border border-gray-200/50 dark:border-gray-700/50 ${sizeClasses[size]}`}
      style={{ color: config?.color || "#666" }}
    >
      <Iconify
        icon={config?.icon || "solar:planet-bold-duotone"}
        width={iconSizes[size]}
      />
      {planet}
    </span>
  );
}

function LoadingOverlay({ loading }: { loading: boolean }) {
  return (
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
                    icon="solar:clock-circle-bold-duotone"
                    width={48}
                    className="text-indigo-500 animate-pulse"
                  />
                </div>
                <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-transparent border-t-indigo-500 border-r-purple-500 animate-spin" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Calculating Dasha
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Analyzing planetary periods...
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function QuickStats({ dashaData }: { dashaData: VdashaAPIResponse }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 md:grid-cols-5 gap-4"
    >
      {DASHA_LEVELS.map((level) => {
        const period = dashaData.current_vdasha?.[level.key as DashaLevelKey];
        if (!period) return null;
        const config = PLANET_CONFIG[period.planet];

        return (
          <motion.div
            key={level.key}
            variants={itemVariants}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-lg hover:shadow-xl transition-shadow"
          >
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              {level.shortLabel}
            </p>
            <div className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config?.gradient || "from-gray-400 to-gray-500"} flex items-center justify-center text-white shadow-lg`}
              >
                <Iconify
                  icon={config?.icon || "solar:planet-bold-duotone"}
                  width={20}
                />
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {period.planet}
              </span>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

interface TabNavigationProps {
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
}

function TabNavigation({ activeTab, setActiveTab }: TabNavigationProps) {
  return (
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
                layoutId="activeTabDasha"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function OverviewTab({ dashaData }: { dashaData: VdashaAPIResponse }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <CurrentDashaSection dashaData={dashaData} />
      <MahadashaTimeline dashaData={dashaData} />
    </motion.div>
  );
}

function CurrentDashaSection({ dashaData }: { dashaData: VdashaAPIResponse }) {
  const current = dashaData?.current_vdasha;
  if (!current) return null;

  return (
    <motion.div
      variants={itemVariants}
      className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white">
          <Iconify icon="solar:clock-circle-bold" width={20} />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white">
            Current Running Dasha
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Active planetary periods as of today
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {DASHA_LEVELS.map((level, idx) => {
          const period = current[level.key as DashaLevelKey];
          if (!period) return null;
          const config = PLANET_CONFIG[period.planet];

          return (
            <motion.div
              key={level.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`${config?.bgColor || "bg-gray-50"} ${config?.darkBg || "dark:bg-gray-800"} rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-400">
                  {idx + 1}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                  {level.shortLabel}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Iconify
                  icon={config?.icon || "solar:planet-bold-duotone"}
                  width={24}
                  style={{ color: config?.color || "#666" }}
                />
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {period.planet}
                </span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <p>{formatDate(period.start)}</p>
                <p>to {formatDate(period.end)}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function MahadashaTimeline({ dashaData }: { dashaData: VdashaAPIResponse }) {
  const majorVdasha = dashaData?.major_vdasha;
  if (!majorVdasha) return null;

  return (
    <motion.div variants={itemVariants}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white">
          <Iconify icon="solar:timeline-bold" width={20} />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white">
            Mahadasha Timeline
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Complete 120-year planetary cycle
          </p>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
        {majorVdasha.map((period, idx) => {
          const config = PLANET_CONFIG[period.planet];
          const isCurrent =
            dashaData?.current_vdasha?.major.planet === period.planet;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={`shrink-0 w-32 p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-lg ${
                isCurrent
                  ? `border-indigo-500 bg-gradient-to-br ${config?.gradient || "from-gray-400 to-gray-500"} text-white shadow-lg shadow-indigo-500/30`
                  : `border-gray-200 dark:border-gray-700 ${config?.bgColor || "bg-gray-50"} ${config?.darkBg || "dark:bg-gray-800"} hover:border-gray-300 dark:hover:border-gray-600`
              }`}
            >
              {isCurrent && (
                <span className="text-[10px] font-bold uppercase tracking-wide mb-2 block opacity-80">
                  Current
                </span>
              )}
              <div className="flex items-center gap-2 mb-2">
                <Iconify
                  icon={config?.icon || "solar:planet-bold-duotone"}
                  width={22}
                  style={{
                    color: isCurrent ? "white" : config?.color || "#666",
                  }}
                />
                <span
                  className={`font-bold ${isCurrent ? "text-white" : "text-gray-900 dark:text-white"}`}
                >
                  {period.planet}
                </span>
              </div>
              <p
                className={`text-xs ${isCurrent ? "text-white/80" : "text-gray-500 dark:text-gray-400"}`}
              >
                {formatDate(period.start)}
              </p>
              <p
                className={`text-xs ${isCurrent ? "text-white/60" : "text-gray-400 dark:text-gray-500"}`}
              >
                to {formatDate(period.end)}
              </p>
              <p
                className={`text-xs font-medium mt-2 ${isCurrent ? "text-white" : "text-indigo-600 dark:text-indigo-400"}`}
              >
                {calculateDuration(period.start, period.end)}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function AllPeriodsSection({ dashaData }: { dashaData: VdashaAPIResponse }) {
  const all = dashaData?.current_vdasha_all;
  if (!all) return null;

  const sections = [
    {
      key: "major",
      label: "Mahadasha Periods",
      data: all.major.dasha_period,
      subtitle: "Full 120-year cycle",
      currentPlanet: dashaData.current_vdasha?.major.planet,
    },
    {
      key: "minor",
      label: "Antardasha Periods",
      data: all.minor.dasha_period,
      subtitle: `Under ${all.minor.planet.major} Mahadasha`,
      currentPlanet: dashaData.current_vdasha?.minor.planet,
    },
    {
      key: "sub_minor",
      label: "Pratyantardasha Periods",
      data: all.sub_minor.dasha_period,
      subtitle: `${all.sub_minor.planet.major} → ${all.sub_minor.planet.minor}`,
      currentPlanet: dashaData.current_vdasha?.sub_minor.planet,
    },
    {
      key: "sub_sub_minor",
      label: "Sukshma Periods",
      data: all.sub_sub_minor.dasha_period,
      subtitle: `${all.sub_sub_minor.planet.major} → ${all.sub_sub_minor.planet.minor} → ${all.sub_sub_minor.planet.sub_minor}`,
      currentPlanet: dashaData.current_vdasha?.sub_sub_minor.planet,
    },
    {
      key: "sub_sub_sub_minor",
      label: "Prana Periods",
      data: all.sub_sub_sub_minor.dasha_period,
      subtitle: `${all.sub_sub_sub_minor.planet.major} → ${all.sub_sub_sub_minor.planet.minor} → ${all.sub_sub_sub_minor.planet.sub_minor} → ${all.sub_sub_sub_minor.planet.sub_sub_minor}`,
      currentPlanet: dashaData.current_vdasha?.sub_sub_sub_minor.planet,
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {sections.map((section) => (
        <DashaTable
          key={section.key}
          periods={section.data}
          title={section.label}
          subtitle={section.subtitle}
          currentPlanet={section.currentPlanet}
        />
      ))}
    </motion.div>
  );
}

interface DashaTableProps {
  periods: DashaPeriod[];
  title: string;
  subtitle?: string;
  currentPlanet?: string;
}

function DashaTable({
  periods,
  title,
  subtitle,
  currentPlanet,
}: DashaTableProps) {
  if (!periods || periods.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-8 text-center">
        <Iconify
          icon="solar:database-bold-duotone"
          width={40}
          className="text-gray-400 mx-auto mb-3"
        />
        <p className="text-gray-500 dark:text-gray-400">No data available</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                #
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                Planet
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                Start
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                End
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                Duration
              </th>
            </tr>
          </thead>
          <tbody>
            {periods.map((period, idx) => {
              const isCurrent = currentPlanet === period.planet;
              return (
                <motion.tr
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  className={`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                    isCurrent ? "bg-indigo-50 dark:bg-indigo-900/20" : ""
                  }`}
                >
                  <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400">
                    {idx + 1}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <PlanetBadge planet={period.planet} />
                      {isCurrent && (
                        <span className="px-2 py-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-medium rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-700 dark:text-gray-300">
                    {formatDate(period.start)}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-700 dark:text-gray-300">
                    {formatDate(period.end)}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                      {calculateDuration(period.start, period.end)}
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

interface AntardashaTabProps {
  dashaData: VdashaAPIResponse;
  md: string;
  getSubVdasha: (mdPlanet: string) => DashaPeriod[] | null;
}

function AntardashaTab({ dashaData, md, getSubVdasha }: AntardashaTabProps) {
  const majorPlanet = md || dashaData.current_vdasha?.major.planet;
  const subVdasha = majorPlanet ? getSubVdasha(majorPlanet) : null;
  const periods = subVdasha || dashaData.current_vdasha_all?.minor.dasha_period;

  return periods ? (
    <DashaTable
      periods={periods}
      title="Antardasha Periods"
      subtitle={`Under ${majorPlanet || dashaData.current_vdasha_all?.minor.planet.major} Mahadasha`}
      currentPlanet={dashaData.current_vdasha?.minor.planet}
    />
  ) : (
    <EmptyTabState message="Select a Mahadasha planet to view Antardasha periods" />
  );
}

interface PratyantardashaTabProps {
  dashaData: VdashaAPIResponse;
  md: string;
  ad: string;
  getSubSubVdasha: (mdPlanet: string, adPlanet: string) => DashaPeriod[] | null;
}

function PratyantardashaTab({
  dashaData,
  md,
  ad,
  getSubSubVdasha,
}: PratyantardashaTabProps) {
  const majorPlanet = md || dashaData.current_vdasha?.major.planet;
  const minorPlanet = ad || dashaData.current_vdasha?.minor.planet;
  const subSubVdasha =
    majorPlanet && minorPlanet
      ? getSubSubVdasha(majorPlanet, minorPlanet)
      : null;
  const periods =
    subSubVdasha || dashaData.current_vdasha_all?.sub_minor.dasha_period;

  const subtitle =
    majorPlanet && minorPlanet
      ? `${majorPlanet} → ${minorPlanet}`
      : `${dashaData.current_vdasha_all?.sub_minor.planet.major} → ${dashaData.current_vdasha_all?.sub_minor.planet.minor}`;

  return periods ? (
    <DashaTable
      periods={periods}
      title="Pratyantardasha Periods"
      subtitle={subtitle}
      currentPlanet={dashaData.current_vdasha?.sub_minor.planet}
    />
  ) : (
    <EmptyTabState message="Select MD and AD planets to view Pratyantardasha" />
  );
}

interface SukshmaTabProps {
  dashaData: VdashaAPIResponse;
  md: string;
  ad: string;
  pd: string;
  getSubSubSubVdasha: (
    mdPlanet: string,
    adPlanet: string,
    pdPlanet: string,
  ) => DashaPeriod[] | null;
}

function SukshmaTab({
  dashaData,
  md,
  ad,
  pd,
  getSubSubSubVdasha,
}: SukshmaTabProps) {
  const majorPlanet = md || dashaData.current_vdasha?.major.planet;
  const minorPlanet = ad || dashaData.current_vdasha?.minor.planet;
  const subMinorPlanet = pd || dashaData.current_vdasha?.sub_minor.planet;

  const subSubSubVdasha =
    majorPlanet && minorPlanet && subMinorPlanet
      ? getSubSubSubVdasha(majorPlanet, minorPlanet, subMinorPlanet)
      : null;

  const periods =
    subSubSubVdasha || dashaData.current_vdasha_all?.sub_sub_minor.dasha_period;

  const subtitle =
    majorPlanet && minorPlanet && subMinorPlanet
      ? `${majorPlanet} → ${minorPlanet} → ${subMinorPlanet}`
      : `${dashaData.current_vdasha_all?.sub_sub_minor.planet.major} → ${dashaData.current_vdasha_all?.sub_sub_minor.planet.minor} → ${dashaData.current_vdasha_all?.sub_sub_minor.planet.sub_minor}`;

  return periods ? (
    <DashaTable
      periods={periods}
      title="Sukshma Dasha Periods"
      subtitle={subtitle}
      currentPlanet={dashaData.current_vdasha?.sub_sub_minor.planet}
    />
  ) : (
    <EmptyTabState message="Select MD, AD, and PD planets to view Sukshma Dasha" />
  );
}

interface PranaTabProps {
  dashaData: VdashaAPIResponse;
  md: string;
  ad: string;
  pd: string;
  sd: string;
  getSubSubSubSubVdasha: (
    mdPlanet: string,
    adPlanet: string,
    pdPlanet: string,
    sdPlanet: string,
  ) => DashaPeriod[] | null;
}

function PranaTab({
  dashaData,
  md,
  ad,
  pd,
  sd,
  getSubSubSubSubVdasha,
}: PranaTabProps) {
  const majorPlanet = md || dashaData.current_vdasha?.major.planet;
  const minorPlanet = ad || dashaData.current_vdasha?.minor.planet;
  const subMinorPlanet = pd || dashaData.current_vdasha?.sub_minor.planet;
  const subSubMinorPlanet =
    sd || dashaData.current_vdasha?.sub_sub_minor.planet;

  const subSubSubSubVdasha =
    majorPlanet && minorPlanet && subMinorPlanet && subSubMinorPlanet
      ? getSubSubSubSubVdasha(
          majorPlanet,
          minorPlanet,
          subMinorPlanet,
          subSubMinorPlanet,
        )
      : null;

  const periods =
    subSubSubSubVdasha ||
    dashaData.current_vdasha_all?.sub_sub_sub_minor.dasha_period;

  const subtitle =
    majorPlanet && minorPlanet && subMinorPlanet && subSubMinorPlanet
      ? `${majorPlanet} → ${minorPlanet} → ${subMinorPlanet} → ${subSubMinorPlanet}`
      : `${dashaData.current_vdasha_all?.sub_sub_sub_minor.planet.major} → ${dashaData.current_vdasha_all?.sub_sub_sub_minor.planet.minor} → ${dashaData.current_vdasha_all?.sub_sub_sub_minor.planet.sub_minor} → ${dashaData.current_vdasha_all?.sub_sub_sub_minor.planet.sub_sub_minor}`;

  return periods ? (
    <DashaTable
      periods={periods}
      title="Prana Dasha Periods"
      subtitle={subtitle}
      currentPlanet={dashaData.current_vdasha?.sub_sub_sub_minor.planet}
    />
  ) : (
    <EmptyTabState message="Select all four planets to view Prana Dasha" />
  );
}

function EmptyTabState({ message }: { message: string }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
        <Iconify
          icon="solar:info-circle-bold-duotone"
          width={32}
          className="text-gray-400"
        />
      </div>
      <p className="text-gray-600 dark:text-gray-400">{message}</p>
      <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
        Use the sidebar to select planets
      </p>
    </div>
  );
}

function InfoCard() {
  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-5 border border-indigo-200/50 dark:border-indigo-800/50">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shrink-0">
          <Iconify icon="solar:info-circle-bold" width={20} />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
            About Vimshottari Dasha
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            The Vimshottari Dasha is a 120-year planetary period system based on
            the Moon&apos;s Nakshatra at birth. It divides life into planetary
            periods (Mahadasha) which are further subdivided into Antardasha,
            Pratyantardasha, Sukshma, and Prana levels for precise timing of
            events.
          </p>
        </div>
      </div>
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
        <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 flex items-center justify-center mb-6 shadow-xl">
          <Iconify
            icon="solar:clock-circle-bold-duotone"
            width={56}
            className="text-indigo-500"
          />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Calculate Vimshottari Dasha
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Select a person from the sidebar and click &quot;Calculate Dasha&quot;
          to view the complete planetary period analysis.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {[
            "Mahadasha",
            "Antardasha",
            "Pratyantardasha",
            "Sukshma",
            "Prana",
          ].map((level) => (
            <span
              key={level}
              className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm rounded-lg"
            >
              {level}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
