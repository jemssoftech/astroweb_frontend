"use client";

import { useState, useCallback } from "react";
import api from "@/src/lib/api";
import PersonSelector from "@/src/components/PersonSelector";
import Iconify from "@/src/components/Iconify";
import { Person } from "@/src/lib/models";
import Swal from "sweetalert2";
import { getUser } from "@/src/lib/auth";
import { motion, AnimatePresence } from "framer-motion";

// ============ TYPES ============

interface DashaPeriod {
  dasha_id: number;
  dasha_name: string;
  start_date: string;
  end_date: string;
  start_ms?: number;
  end_ms?: number;
  duration?: number | string;
}

interface MajorDashaInfo {
  dasha_id: number;
  dasha_name: string;
  start_date: string;
  end_date: string;
  start_ms: number;
  end_ms: number;
  duration: number;
}

interface SubYoginiDashaEntry {
  major_dasha: MajorDashaInfo;
  sub_dasha: DashaPeriod[];
}

interface CurrentDasha {
  major_dasha: {
    dasha_id: number;
    dasha_name: string;
    duration: string;
    start_date: string;
    end_date: string;
  };
  sub_dasha: {
    dasha_id: number;
    dasha_name: string;
    start_date: string;
    end_date: string;
  };
  sub_sub_dasha?: {
    dasha_id: number;
    dasha_name: string;
    start_date: string;
    end_date: string;
  };
}

interface YoginiDashaAPIResponse {
  success: boolean;
  major_yogini_dasha: MajorDashaInfo[];
  sub_yogini_dasha: SubYoginiDashaEntry[];
  current_yogini_dasha: CurrentDasha;
}

// ============ CONSTANTS ============

const YOGINI_CONFIG: Record<
  string,
  {
    planet: string;
    years: number;
    nature: string;
    icon: string;
    color: string;
    gradient: string;
    bgColor: string;
  }
> = {
  Mangla: {
    planet: "Moon",
    years: 1,
    nature: "Auspicious",
    icon: "solar:moon-bold-duotone",
    color: "#3B82F6",
    gradient: "from-blue-400 to-indigo-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
  },
  Pingla: {
    planet: "Sun",
    years: 2,
    nature: "Mixed",
    icon: "solar:sun-bold-duotone",
    color: "#F59E0B",
    gradient: "from-amber-400 to-orange-500",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
  },
  Dhanya: {
    planet: "Jupiter",
    years: 3,
    nature: "Auspicious",
    icon: "solar:crown-bold-duotone",
    color: "#F97316",
    gradient: "from-orange-400 to-amber-500",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
  },
  Bhramari: {
    planet: "Mars",
    years: 4,
    nature: "Malefic",
    icon: "solar:flame-bold-duotone",
    color: "#EF4444",
    gradient: "from-red-400 to-rose-500",
    bgColor: "bg-red-50 dark:bg-red-900/20",
  },
  Bhadrika: {
    planet: "Mercury",
    years: 5,
    nature: "Auspicious",
    icon: "solar:wind-bold-duotone",
    color: "#22C55E",
    gradient: "from-green-400 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-900/20",
  },
  Ulka: {
    planet: "Saturn",
    years: 6,
    nature: "Malefic",
    icon: "solar:clock-circle-bold-duotone",
    color: "#6366F1",
    gradient: "from-indigo-400 to-violet-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
  },
  Siddha: {
    planet: "Venus",
    years: 7,
    nature: "Auspicious",
    icon: "solar:heart-bold-duotone",
    color: "#EC4899",
    gradient: "from-pink-400 to-rose-500",
    bgColor: "bg-pink-50 dark:bg-pink-900/20",
  },
  Sankata: {
    planet: "Rahu",
    years: 8,
    nature: "Malefic",
    icon: "solar:black-hole-bold-duotone",
    color: "#8B5CF6",
    gradient: "from-violet-400 to-purple-500",
    bgColor: "bg-violet-50 dark:bg-violet-900/20",
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
    key: "major",
    label: "Major Dasha",
    icon: "solar:ranking-bold-duotone",
    color: "from-amber-500 to-orange-500",
  },
  {
    key: "sub",
    label: "Sub Dasha",
    icon: "solar:layers-bold-duotone",
    color: "from-blue-500 to-cyan-500",
  },
  {
    key: "current",
    label: "Current",
    icon: "solar:clock-circle-bold-duotone",
    color: "from-emerald-500 to-teal-500",
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

// ============ HELPERS ============

const formatDate = (dateStr: string): string => {
  if (!dateStr) return "-";
  const [datePart] = dateStr.split(" ");
  const [day, month, year] = datePart.split("-");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${day.padStart(2, "0")} ${months[parseInt(month) - 1]} ${year}`;
};

const getConfig = (name: string) =>
  YOGINI_CONFIG[name] || {
    planet: "Unknown",
    years: 0,
    nature: "Unknown",
    icon: "solar:planet-bold-duotone",
    color: "#6B7280",
    gradient: "from-gray-400 to-gray-500",
    bgColor: "bg-gray-50 dark:bg-gray-800",
  };

const isCurrentDasha = (dasha: {
  start_ms?: number;
  end_ms?: number;
}): boolean => {
  if (!dasha.start_ms || !dasha.end_ms) return false;
  const now = Date.now();
  return now >= dasha.start_ms && now <= dasha.end_ms;
};

const getNatureBadge = (nature: string) => {
  switch (nature) {
    case "Auspicious":
      return {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-400",
        icon: "solar:check-circle-bold",
      };
    case "Malefic":
      return {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-700 dark:text-red-400",
        icon: "solar:danger-triangle-bold",
      };
    default:
      return {
        bg: "bg-amber-100 dark:bg-amber-900/30",
        text: "text-amber-700 dark:text-amber-400",
        icon: "solar:info-circle-bold",
      };
  }
};

// ============ MAIN COMPONENT ============

export default function YoginiDashaPage() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(false);
  const [yoginiData, setYoginiData] = useState<YoginiDashaAPIResponse | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState<string>("overview");

  const user = getUser() as { userApiKey?: string; apikey?: string } | null;
  const [selectedMajorDashaIndex, setSelectedMajorDashaIndex] =
    useState<number>(0);

  // No WebSocket lifecycle needed

  const handlePersonSelected = useCallback((person: Person) => {
    setSelectedPerson(person);
    setYoginiData(null);
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

  const fetchYoginiDasha = useCallback(async () => {
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

    setLoading(true);
    try {
      const payload = getBirthDataPayload(selectedPerson);
      const apikey =
        (user as { userApiKey?: string; apikey?: string })?.userApiKey ||
        (user as { userApiKey?: string; apikey?: string })?.apikey ||
        "";
      const res = await api.post("/api/mainapi/yogini-dasha", {
        ...payload,
        apikey,
      });

      const result = res.data;
      setLoading(false);

      if (!result || !result.major_yogini_dasha) {
        throw new Error("Invalid response from server");
      }

      setYoginiData(result);
      if (result.current_yogini_dasha?.major_dasha) {
        const currentDashaName =
          result.current_yogini_dasha.major_dasha.dasha_name;
        const currentIndex = result.sub_yogini_dasha?.findIndex(
          (entry: { major_dasha: { dasha_name: string } }) =>
            entry.major_dasha.dasha_name === currentDashaName,
        );
        if (currentIndex !== undefined && currentIndex >= 0)
          setSelectedMajorDashaIndex(currentIndex);
      }
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setLoading(false);
      console.error("Fetch Yogini Dasha Error:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch Yogini Dasha data",
        background: "#1f2937",
        color: "#f3f4f6",
        confirmButtonColor: "#8b5cf6",
      });
    }
  }, [selectedPerson, getBirthDataPayload, user]);

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 py-8">
        {/* Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden bg-linear-to-r from-purple-700 via-violet-700 to-fuchsia-700 rounded-2xl p-6 md:p-8 text-white shadow-xl mb-8"
        >
          {/* Soft Glow Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>

          {/* Watermark Icon */}
          <div className="absolute top-4 right-8 opacity-20">
            <Iconify icon="solar:stars-bold-duotone" width={110} height={110} />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Iconify
                  icon="solar:stars-bold-duotone"
                  width={40}
                  height={40}
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium">
                    Yogini Dasha
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold">
                  Yogini Dasha System
                </h1>

                <p className="text-white/80 mt-1 max-w-xl">
                  36-year planetary period system based on 8 Yoginis &mdash;
                  known for simplicity and accuracy in timing life events.
                </p>
              </div>
            </div>

            {/* Info Badges */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/20">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Iconify icon="solar:calendar-bold" width={20} />
                </div>
                <div>
                  <p className="font-semibold">36 Years</p>
                  <p className="text-sm text-white/70">Total Cycle</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/20">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Iconify icon="solar:star-bold" width={20} />
                </div>
                <div>
                  <p className="font-semibold">8</p>
                  <p className="text-sm text-white/70">Yoginis</p>
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
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-500 to-violet-500 flex items-center justify-center text-white">
                  <Iconify icon="solar:user-rounded-bold" width={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Select Profile
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Doesn&apos;t apply to everyone
                  </p>
                </div>
              </div>

              <PersonSelector onPersonSelected={handlePersonSelected} />

              <button
                onClick={fetchYoginiDasha}
                disabled={loading || !selectedPerson}
                className={`mt-4 w-full h-12 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                  selectedPerson && !loading
                    ? "bg-linear-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:-translate-y-0.5"
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
                    <Iconify icon="solar:stars-bold" width={20} />
                    <span>Calculate Dasha</span>
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
                      <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-500 to-violet-500 flex items-center justify-center text-white font-bold">
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

            {/* 8 Yoginis Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white">
                  <Iconify icon="solar:star-rings-bold" width={20} />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  8 Yoginis
                </h4>
              </div>
              <div className="space-y-2">
                {Object.entries(YOGINI_CONFIG).map(([name, config]) => (
                  <div
                    key={name}
                    className={`flex items-center justify-between p-2 rounded-lg ${config.bgColor}`}
                  >
                    <div className="flex items-center gap-2">
                      <Iconify
                        icon={config.icon}
                        width={18}
                        style={{ color: config.color }}
                      />
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {config.planet}
                      </span>
                      <span
                        className="text-xs font-bold px-1.5 py-0.5 bg-white dark:bg-gray-800 rounded"
                        style={{ color: config.color }}
                      >
                        {config.years}y
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Cycle
                </span>
                <span className="text-lg font-bold bg-linear-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                  36 Years
                </span>
              </div>
            </div>

            {/* Current Dasha Sidebar Summary */}
            <AnimatePresence>
              {yoginiData?.current_yogini_dasha && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-linear-to-br from-purple-500 via-violet-500 to-fuchsia-500 rounded-2xl p-5 text-white shadow-xl shadow-purple-500/20"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Iconify icon="solar:clock-circle-bold" width={20} />
                    <h4 className="font-semibold">Current Running</h4>
                  </div>
                  <div className="space-y-2">
                    {[
                      {
                        label: "Major",
                        dasha: yoginiData.current_yogini_dasha.major_dasha,
                      },
                      {
                        label: "Sub",
                        dasha: yoginiData.current_yogini_dasha.sub_dasha,
                      },
                      ...(yoginiData.current_yogini_dasha.sub_sub_dasha
                        ? [
                            {
                              label: "PrD",
                              dasha:
                                yoginiData.current_yogini_dasha.sub_sub_dasha,
                            },
                          ]
                        : []),
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2"
                      >
                        <span className="text-sm text-white/70">
                          {item.label}
                        </span>
                        <div className="flex items-center gap-2">
                          <Iconify
                            icon={getConfig(item.dasha.dasha_name).icon}
                            width={16}
                          />
                          <span className="font-medium">
                            {item.dasha.dasha_name}
                          </span>
                        </div>
                      </div>
                    ))}
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
                        <div className="w-24 h-24 rounded-full bg-linear-to-br from-purple-100 to-violet-100 dark:from-purple-900/50 dark:to-violet-900/50 flex items-center justify-center">
                          <Iconify
                            icon="solar:stars-bold-duotone"
                            width={48}
                            className="text-purple-500 animate-pulse"
                          />
                        </div>
                        <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-transparent border-t-purple-500 border-r-violet-500 animate-spin" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Calculating Yogini Dasha
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        It&apos;s time to focus on your inner growth...
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {yoginiData ? (
              <div className="space-y-6">
                {/* Quick Stats */}
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                  <StatsCard
                    icon="solar:refresh-circle-bold-duotone"
                    label="Total Cycle"
                    value="36 Years"
                    color="from-purple-500 to-violet-500"
                  />
                  <StatsCard
                    icon="solar:star-rings-bold-duotone"
                    label="Yoginis"
                    value="8"
                    color="from-amber-500 to-orange-500"
                  />
                  <StatsCard
                    icon={
                      getConfig(
                        yoginiData.current_yogini_dasha.major_dasha.dasha_name,
                      ).icon
                    }
                    label="Current Major"
                    value={
                      yoginiData.current_yogini_dasha.major_dasha.dasha_name
                    }
                    color={
                      getConfig(
                        yoginiData.current_yogini_dasha.major_dasha.dasha_name,
                      ).gradient
                    }
                  />
                  <StatsCard
                    icon={
                      getConfig(
                        yoginiData.current_yogini_dasha.sub_dasha.dasha_name,
                      ).icon
                    }
                    label="Current Sub"
                    value={yoginiData.current_yogini_dasha.sub_dasha.dasha_name}
                    color={
                      getConfig(
                        yoginiData.current_yogini_dasha.sub_dasha.dasha_name,
                      ).gradient
                    }
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
                              ? "text-purple-600 dark:text-purple-400"
                              : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                              activeTab === tab.key
                                ? `bg-linear-to-br ${tab.color} text-white shadow-lg`
                                : "bg-gray-100 dark:bg-gray-800"
                            }`}
                          >
                            <Iconify icon={tab.icon} width={18} />
                          </div>
                          <span className="hidden md:inline">{tab.label}</span>
                          {activeTab === tab.key && (
                            <motion.div
                              layoutId="activeTabYogini"
                              className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-purple-500 to-violet-500"
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
                            yoginiData={yoginiData}
                            setActiveTab={setActiveTab}
                            setSelectedMajorDashaIndex={
                              setSelectedMajorDashaIndex
                            }
                          />
                        )}
                        {activeTab === "major" && (
                          <MajorDashaTab yoginiData={yoginiData} />
                        )}
                        {activeTab === "sub" && (
                          <SubDashaTab
                            yoginiData={yoginiData}
                            selectedIndex={selectedMajorDashaIndex}
                            setSelectedIndex={setSelectedMajorDashaIndex}
                          />
                        )}
                        {activeTab === "current" && (
                          <CurrentDashaTab yoginiData={yoginiData} />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Info Footer */}
                <div className="bg-linear-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl p-5 border border-purple-200/50 dark:border-purple-800/50">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-500 to-violet-500 flex items-center justify-center text-white flex-shrink-0">
                      <Iconify icon="solar:info-circle-bold" width={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        About Yogini Dasha
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Yogini Dasha is a 36-year planetary period system based
                        on 8 Yoginis, each ruled by a planet. It&apos;s known
                        for its simplicity and accuracy in timing events.
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

// ============ TAB COMPONENTS ============

function OverviewTab({
  yoginiData,
  setActiveTab,
  setSelectedMajorDashaIndex,
}: {
  yoginiData: YoginiDashaAPIResponse;
  setActiveTab: (tab: string) => void;
  setSelectedMajorDashaIndex: (idx: number) => void;
}) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <CurrentDashaCard current={yoginiData.current_yogini_dasha} />
      <MahadashaTimeline
        majorDashas={yoginiData.major_yogini_dasha}
        currentMajor={yoginiData.current_yogini_dasha?.major_dasha?.dasha_name}
        subYoginiDasha={yoginiData.sub_yogini_dasha}
        setActiveTab={setActiveTab}
        setSelectedIndex={setSelectedMajorDashaIndex}
      />
    </motion.div>
  );
}

function MajorDashaTab({ yoginiData }: { yoginiData: YoginiDashaAPIResponse }) {
  const majorDashas = yoginiData.major_yogini_dasha;
  const currentMajor = yoginiData.current_yogini_dasha?.major_dasha?.dasha_name;
  if (!majorDashas || majorDashas.length === 0)
    return <EmptyTabState message="No major dasha data" />;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <h3 className="font-bold text-gray-900 dark:text-white">
            Major Yogini Dasha Periods
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {majorDashas.length} periods found
          </p>
        </div>
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800 z-10">
              <tr className="border-b border-gray-200 dark:border-gray-700">
                {[
                  "#",
                  "Yogini",
                  "Planet",
                  "Duration",
                  "Nature",
                  "Start",
                  "End",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {majorDashas.map((dasha, idx) => {
                const config = getConfig(dasha.dasha_name);
                const isCurrent =
                  dasha.dasha_name === currentMajor && isCurrentDasha(dasha);
                const natureBadge = getNatureBadge(config.nature);

                return (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.03 }}
                    className={`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                      isCurrent ? `${config.bgColor}` : ""
                    }`}
                  >
                    <td className="px-5 py-3.5 text-sm text-gray-500">
                      {idx + 1}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <YoginiBadge name={dasha.dasha_name} />
                        {isCurrent && (
                          <span className="px-2 py-0.5 bg-linear-to-r from-purple-500 to-violet-500 text-white text-xs font-medium rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-700 dark:text-gray-300">
                      {config.planet}
                    </td>
                    <td className="px-5 py-3.5 text-sm font-medium text-purple-600 dark:text-purple-400">
                      {dasha.duration} Years
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg ${natureBadge.bg} ${natureBadge.text}`}
                      >
                        <Iconify icon={natureBadge.icon} width={12} />
                        {config.nature}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-700 dark:text-gray-300">
                      {formatDate(dasha.start_date)}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-700 dark:text-gray-300">
                      {formatDate(dasha.end_date)}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

function SubDashaTab({
  yoginiData,
  selectedIndex,
  setSelectedIndex,
}: {
  yoginiData: YoginiDashaAPIResponse;
  selectedIndex: number;
  setSelectedIndex: (idx: number) => void;
}) {
  const subYoginiDasha = yoginiData.sub_yogini_dasha;
  if (!subYoginiDasha || subYoginiDasha.length === 0)
    return <EmptyTabState message="No sub dasha data available" />;

  const currentMajor = yoginiData.current_yogini_dasha?.major_dasha?.dasha_name;
  const selectedEntry = subYoginiDasha[selectedIndex];
  const selectedConfig = selectedEntry
    ? getConfig(selectedEntry.major_dasha.dasha_name)
    : null;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {/* Major Dasha Selector */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 font-medium">
          Select Major Dasha Period ({subYoginiDasha.length} periods)
        </p>
        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
          {subYoginiDasha.map((entry, idx) => {
            const config = getConfig(entry.major_dasha.dasha_name);
            const isSelected = selectedIndex === idx;
            const isCurrent =
              entry.major_dasha.dasha_name === currentMajor &&
              isCurrentDasha(entry.major_dasha);

            return (
              <button
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  isSelected
                    ? `bg-linear-to-r ${config.gradient} text-white shadow-lg`
                    : `${config.bgColor} text-gray-700 dark:text-gray-300 hover:shadow-md border border-gray-200/50 dark:border-gray-700/50`
                }`}
              >
                <Iconify icon={config.icon} width={16} />
                <span>{entry.major_dasha.dasha_name}</span>
                {isCurrent && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded ${isSelected ? "bg-white/20" : "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400"}`}
                  >
                    Now
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub Dasha Table */}
      {selectedEntry && (
        <div
          className={`${selectedConfig?.bgColor} rounded-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden`}
        >
          <div
            className={`px-5 py-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-linear-to-r ${selectedConfig?.gradient} text-white`}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Iconify
                  icon={selectedConfig?.icon || "solar:star-bold-duotone"}
                  width={24}
                />
              </div>
              <div>
                <h3 className="font-bold text-lg">
                  {selectedEntry.major_dasha.dasha_name} Sub Periods
                </h3>
                <p className="text-white/80 text-sm">
                  {formatDate(selectedEntry.major_dasha.start_date)} to{" "}
                  {formatDate(selectedEntry.major_dasha.end_date)} •{" "}
                  {selectedEntry.major_dasha.duration} Years
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50">
                  {["#", "Sub Yogini", "Planet", "Nature", "Start", "End"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {selectedEntry.sub_dasha.map((period, idx) => {
                  const config = getConfig(period.dasha_name);
                  const isCurrent = isCurrentDasha(period);
                  const natureBadge = getNatureBadge(config.nature);

                  return (
                    <motion.tr
                      key={idx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.03 }}
                      className={`border-b border-gray-100 dark:border-gray-800 hover:bg-white/50 dark:hover:bg-gray-800/50 ${isCurrent ? "bg-purple-50 dark:bg-purple-900/20" : ""}`}
                    >
                      <td className="px-5 py-3 text-sm text-gray-500">
                        {idx + 1}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <YoginiBadge name={period.dasha_name} />
                          {isCurrent && (
                            <span className="px-2 py-0.5 bg-linear-to-r from-purple-500 to-violet-500 text-white text-xs font-medium rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-700 dark:text-gray-300">
                        {config.planet}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg ${natureBadge.bg} ${natureBadge.text}`}
                        >
                          <Iconify icon={natureBadge.icon} width={12} />
                          {config.nature}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-700 dark:text-gray-300">
                        {formatDate(period.start_date)}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-700 dark:text-gray-300">
                        {formatDate(period.end_date)}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function CurrentDashaTab({
  yoginiData,
}: {
  yoginiData: YoginiDashaAPIResponse;
}) {
  return <CurrentDashaCard current={yoginiData.current_yogini_dasha} />;
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
  value: string;
  color: string;
}) {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-lg"
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-12 h-12 rounded-xl bg-linear-to-br ${color} flex items-center justify-center text-white shadow-lg`}
        >
          <Iconify icon={icon} width={24} />
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

function YoginiBadge({ name }: { name: string }) {
  const config = getConfig(name);
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-medium ${config.bgColor} border border-gray-200/50 dark:border-gray-700/50`}
      style={{ color: config.color }}
    >
      <Iconify icon={config.icon} width={16} />
      {name}
    </span>
  );
}

function CurrentDashaCard({ current }: { current: CurrentDasha }) {
  if (!current) return null;

  const levels = [
    {
      label: "Major Dasha",
      shortLabel: "MD",
      dasha: current.major_dasha,
      extra: `${getConfig(current.major_dasha.dasha_name).planet} • ${current.major_dasha.duration} • ${getConfig(current.major_dasha.dasha_name).nature}`,
    },
    {
      label: "Sub Dasha (Antardasha)",
      shortLabel: "AD",
      dasha: current.sub_dasha,
      extra: getConfig(current.sub_dasha.dasha_name).planet,
    },
    ...(current.sub_sub_dasha
      ? [
          {
            label: "Pratyantardasha",
            shortLabel: "PD",
            dasha: current.sub_sub_dasha,
            extra: getConfig(current.sub_sub_dasha.dasha_name).planet,
          },
        ]
      : []),
  ];

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-500 to-violet-500 flex items-center justify-center text-white">
            <Iconify icon="solar:clock-circle-bold" width={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">
              Current Running Dasha
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Active periods as of today
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {levels.map((level, idx) => {
          const config = getConfig(level.dasha.dasha_name);
          return (
            <motion.div
              key={level.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-4 rounded-xl ${config.bgColor} border border-gray-200/50 dark:border-gray-700/50`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-linear-to-br ${config.gradient} flex items-center justify-center text-white shadow-lg`}
                  >
                    <Iconify icon={config.icon} width={24} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      {level.label}
                    </p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {level.dasha.dasha_name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {level.extra}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {formatDate(level.dasha.start_date)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    to {formatDate(level.dasha.end_date)}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function MahadashaTimeline({
  majorDashas,
  currentMajor,
  subYoginiDasha,
  setActiveTab,
  setSelectedIndex,
}: {
  majorDashas: MajorDashaInfo[];
  currentMajor?: string;
  subYoginiDasha: SubYoginiDashaEntry[];
  setActiveTab: (tab: string) => void;
  setSelectedIndex: (idx: number) => void;
}) {
  if (!majorDashas || majorDashas.length === 0) return null;

  return (
    <motion.div variants={itemVariants}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white">
          <Iconify icon="solar:timeline-bold" width={20} />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white">
            36-Year Yogini Cycle
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Click to view sub periods
          </p>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
        {majorDashas.slice(0, 10).map((dasha, idx) => {
          const config = getConfig(dasha.dasha_name);
          const isCurrent =
            dasha.dasha_name === currentMajor && isCurrentDasha(dasha);

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => {
                const subIndex = subYoginiDasha?.findIndex(
                  (entry) => entry.major_dasha.start_ms === dasha.start_ms,
                );
                if (subIndex !== undefined && subIndex >= 0) {
                  setSelectedIndex(subIndex);
                  setActiveTab("sub");
                }
              }}
              className={`flex-shrink-0 w-36 p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-lg ${
                isCurrent
                  ? `border-purple-500 bg-linear-to-br ${config.gradient} text-white shadow-lg shadow-purple-500/30`
                  : `border-gray-200 dark:border-gray-700 ${config.bgColor} hover:border-gray-300 dark:hover:border-gray-600`
              }`}
            >
              {isCurrent && (
                <span className="text-[10px] font-bold uppercase tracking-wide mb-2 block opacity-80">
                  Current
                </span>
              )}
              <div className="flex items-center gap-2 mb-2">
                <Iconify
                  icon={config.icon}
                  width={22}
                  style={{ color: isCurrent ? "white" : config.color }}
                />
                <span
                  className={`font-bold ${isCurrent ? "text-white" : "text-gray-900 dark:text-white"}`}
                >
                  {dasha.dasha_name}
                </span>
              </div>
              <p
                className={`text-xs ${isCurrent ? "text-white/80" : "text-gray-500 dark:text-gray-400"}`}
              >
                {config.planet} • {dasha.duration}y
              </p>
              <p
                className={`text-xs mt-2 ${isCurrent ? "text-white/70" : "text-gray-500 dark:text-gray-400"}`}
              >
                {formatDate(dasha.start_date)}
              </p>
              <p
                className={`text-xs ${isCurrent ? "text-white/60" : "text-gray-400 dark:text-gray-500"}`}
              >
                to {formatDate(dasha.end_date)}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function EmptyTabState({ message }: { message: string }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-12 text-center border border-gray-200 dark:border-gray-700">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
        <Iconify
          icon="solar:info-circle-bold-duotone"
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
        <div className="w-28 h-28 rounded-3xl bg-linear-to-br from-purple-100 to-violet-100 dark:from-purple-900/50 dark:to-violet-900/50 flex items-center justify-center mb-6 shadow-xl">
          <Iconify
            icon="solar:stars-bold-duotone"
            width={56}
            className="text-purple-500"
          />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Yogini Dasha Analysis
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Select a person and click &quot;Calculate Dasha&quot; to view Yogini
          Dasha periods, sub-periods, and current running dashas.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {Object.entries(YOGINI_CONFIG).map(([name, config]) => (
            <span
              key={name}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${config.bgColor}`}
              style={{ color: config.color }}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
