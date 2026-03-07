"use client";

import React, { useState, useEffect } from "react";
import Iconify from "@/src/components/Iconify";
import { getUser } from "@/src/lib/auth";
import { motion, AnimatePresence } from "framer-motion";

// ============ Types ============
interface PanchangInfo {
  tithi: {
    name: string;
    paksha: string;
    completeName: string;
  };
  nakshatra: {
    name: string;
    pada: number;
  };
  yoga: {
    name: string;
  };
  karana: {
    name: string;
  };
  sunrise: string;
  sunset: string;
  vara: {
    name: string;
    lord: string;
  };
}

interface DateInfo {
  date: string;
  day: string;
  dayNumber: number;
  active: boolean;
  isCurrentMonth: boolean;
  panchang?: PanchangInfo;
}

interface CalendarData {
  month: string;
  monthNumber: number;
  year: number;
  currentDate: string;
  totalDays: number;
  firstDayOfWeek: string;
  previousMonth: {
    month: number;
    year: number;
  };
  nextMonth: {
    month: number;
    year: number;
  };
  dates: DateInfo[];
}

interface ApiResponse {
  success: boolean;
  data: CalendarData;
}

// ============ Constants ============
const WEEK_DAYS = [
  {
    short: "Sun",
    full: "Sunday",
    hindi: "रवि",
    icon: "solar:sun-bold-duotone",
    color: "text-red-500",
  },
  {
    short: "Mon",
    full: "Monday",
    hindi: "सोम",
    icon: "solar:moon-bold-duotone",
    color: "text-blue-500",
  },
  {
    short: "Tue",
    full: "Tuesday",
    hindi: "मंगल",
    icon: "solar:flame-bold-duotone",
    color: "text-red-500",
  },
  {
    short: "Wed",
    full: "Wednesday",
    hindi: "बुध",
    icon: "solar:wind-bold-duotone",
    color: "text-green-500",
  },
  {
    short: "Thu",
    full: "Thursday",
    hindi: "गुरु",
    icon: "solar:crown-bold-duotone",
    color: "text-orange-500",
  },
  {
    short: "Fri",
    full: "Friday",
    hindi: "शुक्र",
    icon: "solar:heart-bold-duotone",
    color: "text-pink-500",
  },
  {
    short: "Sat",
    full: "Saturday",
    hindi: "शनि",
    icon: "solar:clock-circle-bold-duotone",
    color: "text-indigo-500",
  },
];

const PANCHANG_ITEMS = [
  {
    key: "tithi",
    label: "Tithi",
    icon: "solar:moon-bold-duotone",
    color: "from-purple-500 to-violet-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
  },
  {
    key: "nakshatra",
    label: "Nakshatra",
    icon: "solar:star-bold-duotone",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    key: "yoga",
    label: "Yoga",
    icon: "solar:meditation-round-bold-duotone",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-900/20",
  },
  {
    key: "karana",
    label: "Karana",
    icon: "solar:widget-5-bold-duotone",
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
  },
];

// ============ Animations ============
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// ============ Main Component ============
const IndianCalendar = () => {
  const [calendarData, setCalendarData] = useState<CalendarData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState<number>(
    new Date().getMonth() + 1,
  );
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [selectedDate, setSelectedDate] = useState<DateInfo | null>(null);
  const [user, setUser] = useState(getUser());
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setUser(getUser());
    setMounted(true);
  }, []);

  // Fetch calendar data
  const fetchCalendar = async (
    month: number,
    year: number,
    type: string = "current",
    authToken?: string | null,
    apiKey?: string | null,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NEXT_JS_API_URL}/api/mainapi/calendar/hindu-calender?month=${month}&year=${year}&type=${type}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken || ""}`,
            "X-API-KEY": apiKey || "",
          },
        },
      );

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          (data as ApiResponse & { error?: string })?.error ||
            `HTTP error! status: ${response.status}`,
        );
      }

      if (data.success) {
        setCalendarData(data.data);
        setCurrentMonth(data.data.monthNumber);
        setCurrentYear(data.data.year);
        // Set today as selected by default
        const today = data.data.dates.find((d) => d.active);
        if (today) setSelectedDate(today);
      } else {
        setError("Failed to fetch calendar data");
      }
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Network or Server error";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!mounted) return;
    if (calendarData) return;
    fetchCalendar(
      currentMonth,
      currentYear,
      "current",
      user?.token,
      (user as any)?.userApiKey || (user as any)?.apikey || "",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  const handlePrevious = () =>
    fetchCalendar(
      currentMonth,
      currentYear,
      "previous",
      user?.token,
      user?.apikey,
    );
  const handleNext = () =>
    fetchCalendar(currentMonth, currentYear, "next", user?.token, user?.apikey);
  const handleToday = () => {
    const today = new Date();
    fetchCalendar(
      today.getMonth() + 1,
      today.getFullYear(),
      "current",
      user?.token,
      user?.apikey,
    );
  };

  const getEmptyCells = (): number => {
    if (!calendarData) return 0;
    const dayIndex = WEEK_DAYS.findIndex(
      (d) => d.short === calendarData.firstDayOfWeek.slice(0, 3),
    );
    return dayIndex >= 0 ? dayIndex : 0;
  };

  // Get today's panchang for header
  const getTodayPanchang = () => {
    if (!calendarData) return null;
    return calendarData.dates.find((d) => d.active)?.panchang || null;
  };

  const todayPanchang = getTodayPanchang();

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 rounded-2xl p-6 md:p-8 text-white shadow-xl mb-8"
        >
          {/* Soft Glow Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>

          {/* Watermark Icon */}
          <div className="absolute top-4 right-8 opacity-20">
            <Iconify
              icon="solar:calendar-bold-duotone"
              width={110}
              height={110}
            />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Iconify
                  icon="solar:calendar-bold-duotone"
                  width={40}
                  height={40}
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium">
                    Hindu Panchang
                  </span>
                  <span className="px-2 py-0.5 bg-green-500 rounded-full text-xs font-medium flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    Live
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold">
                  पंचांग कैलेंडर
                </h1>
                <p className="text-white/80 mt-1 max-w-xl">
                  Traditional Hindu Calendar with Tithi, Nakshatra, Yoga & more
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            {todayPanchang && (
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20">
                  <Iconify icon="solar:moon-bold-duotone" width={20} />
                  <div>
                    <p className="text-xs text-white/70">Tithi</p>
                    <p className="font-semibold text-sm">
                      {todayPanchang.tithi.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20">
                  <Iconify icon="solar:star-bold-duotone" width={20} />
                  <div>
                    <p className="text-xs text-white/70">Nakshatra</p>
                    <p className="font-semibold text-sm">
                      {todayPanchang.nakshatra.name}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
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
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/50 dark:to-amber-900/50 flex items-center justify-center">
                          <Iconify
                            icon="solar:calendar-bold-duotone"
                            width={48}
                            className="text-orange-500 animate-pulse"
                          />
                        </div>
                        <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-transparent border-t-orange-500 border-r-amber-500 animate-spin" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Loading Calendar
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Fetching Panchang data...
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error State */}
            {error && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-dashed border-red-300 dark:border-red-700 p-12"
              >
                <div className="flex flex-col items-center text-center max-w-lg mx-auto">
                  <div className="w-20 h-20 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6">
                    <Iconify
                      icon="solar:danger-triangle-bold-duotone"
                      width={40}
                      className="text-red-500"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    Failed to Load
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    {error}
                  </p>
                  <button
                    onClick={() =>
                      fetchCalendar(
                        currentMonth,
                        currentYear,
                        "current",
                        user?.token || "",
                        user?.apikey || "",
                      )
                    }
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Try Again
                  </button>
                </div>
              </motion.div>
            )}

            {/* Calendar Content */}
            {calendarData && !loading && !error && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
                {/* Month Navigation */}
                <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-orange-500/10 to-amber-500/10">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={handlePrevious}
                      className="p-3 bg-white dark:bg-gray-800 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-xl transition-all hover:scale-105 shadow-sm border border-gray-200 dark:border-gray-700"
                    >
                      <Iconify
                        icon="solar:alt-arrow-left-bold"
                        width={24}
                        className="text-gray-700 dark:text-gray-300"
                      />
                    </button>

                    <div className="text-center">
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                        {calendarData.month} {calendarData.year}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {calendarData.totalDays} Days
                      </p>
                      <button
                        onClick={handleToday}
                        className="mt-2 px-4 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm rounded-full font-medium shadow-lg shadow-orange-500/25 hover:shadow-xl transition-all"
                      >
                        📅 Go to Today
                      </button>
                    </div>

                    <button
                      onClick={handleNext}
                      className="p-3 bg-white dark:bg-gray-800 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-xl transition-all hover:scale-105 shadow-sm border border-gray-200 dark:border-gray-700"
                    >
                      <Iconify
                        icon="solar:alt-arrow-right-bold"
                        width={24}
                        className="text-gray-700 dark:text-gray-300"
                      />
                    </button>
                  </div>
                </div>

                {/* Week Days Header */}
                <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                  {WEEK_DAYS.map((day, index) => (
                    <div
                      key={day.short}
                      className={`py-3 text-center ${index === 0 ? "bg-red-50 dark:bg-red-900/20" : ""}`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <Iconify
                          icon={day.icon}
                          width={18}
                          className={day.color}
                        />
                        <span
                          className={`text-sm font-semibold ${index === 0 ? "text-red-600 dark:text-red-400" : "text-gray-700 dark:text-gray-300"}`}
                        >
                          <span className="hidden md:inline">{day.full}</span>
                          <span className="md:hidden">{day.short}</span>
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {day.hindi}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-7"
                >
                  {/* Empty cells */}
                  {Array.from({ length: getEmptyCells() }).map((_, index) => (
                    <div
                      key={`empty-${index}`}
                      className="min-h-[100px] md:min-h-[120px] bg-gray-50 dark:bg-gray-800/30 border-b border-r border-gray-100 dark:border-gray-800"
                    />
                  ))}

                  {/* Date cells */}
                  {calendarData.dates.map((dateInfo) => (
                    <DateCell
                      key={dateInfo.date}
                      dateInfo={dateInfo}
                      isSelected={selectedDate?.date === dateInfo.date}
                      onSelect={() => setSelectedDate(dateInfo)}
                    />
                  ))}
                </motion.div>
              </div>
            )}

            {/* Legend */}
            {calendarData && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-lg"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white">
                    <Iconify icon="solar:book-bold" width={20} />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Legend
                  </h3>
                </div>
                <div className="flex flex-wrap gap-4">
                  {[
                    {
                      icon: "solar:star-bold-duotone",
                      color: "text-orange-500",
                      bg: "bg-orange-100 dark:bg-orange-900/30",
                      label: "Today",
                    },
                    {
                      icon: "solar:moon-bold-duotone",
                      color: "text-purple-500",
                      bg: "bg-purple-100 dark:bg-purple-900/30",
                      label: "Tithi",
                    },
                    {
                      icon: "solar:star-bold-duotone",
                      color: "text-blue-500",
                      bg: "bg-blue-100 dark:bg-blue-900/30",
                      label: "Nakshatra",
                    },
                    {
                      icon: "solar:meditation-round-bold-duotone",
                      color: "text-green-500",
                      bg: "bg-green-100 dark:bg-green-900/30",
                      label: "Yoga",
                    },
                    {
                      icon: "solar:sunrise-bold-duotone",
                      color: "text-amber-500",
                      bg: "bg-amber-100 dark:bg-amber-900/30",
                      label: "Sunrise",
                    },
                    {
                      icon: "solar:sunset-bold-duotone",
                      color: "text-rose-500",
                      bg: "bg-rose-100 dark:bg-rose-900/30",
                      label: "Sunset",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl ${item.bg}`}
                    >
                      <Iconify
                        icon={item.icon}
                        width={16}
                        className={item.color}
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Sidebar - Selected Date Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3 space-y-4"
          >
            {/* Selected Date Card */}
            <AnimatePresence mode="wait">
              {selectedDate && selectedDate.panchang && (
                <motion.div
                  key={selectedDate.date}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 rounded-2xl p-5 text-white shadow-xl shadow-orange-500/20"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-white/70 text-sm">
                        {selectedDate.day}
                      </p>
                      <p className="text-4xl font-bold">
                        {selectedDate.dayNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/70 text-sm">Paksha</p>
                      <p className="font-semibold">
                        {selectedDate.panchang.tithi.paksha}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Vara (Day Lord) */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                      <p className="text-xs text-white/70 mb-1">
                        Day Lord (वार)
                      </p>
                      <p className="font-semibold">
                        {selectedDate.panchang.vara.name}
                      </p>
                    </div>

                    {/* Sunrise/Sunset */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 text-center">
                        <Iconify
                          icon="solar:sunrise-bold-duotone"
                          width={20}
                          className="mx-auto mb-1"
                        />
                        <p className="text-xs text-white/70">Sunrise</p>
                        <p className="font-semibold text-sm">
                          {selectedDate.panchang.sunrise}
                        </p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 text-center">
                        <Iconify
                          icon="solar:sunset-bold-duotone"
                          width={20}
                          className="mx-auto mb-1"
                        />
                        <p className="text-xs text-white/70">Sunset</p>
                        <p className="font-semibold text-sm">
                          {selectedDate.panchang.sunset}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Panchang Details Cards */}
            <AnimatePresence>
              {selectedDate && selectedDate.panchang && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-3"
                >
                  {PANCHANG_ITEMS.map((item) => {
                    const panchang = selectedDate.panchang!;
                    let value = "";
                    let subValue = "";

                    switch (item.key) {
                      case "tithi":
                        value = panchang.tithi.completeName;
                        break;
                      case "nakshatra":
                        value = panchang.nakshatra.name;
                        subValue = `Pada ${panchang.nakshatra.pada}`;
                        break;
                      case "yoga":
                        value = panchang.yoga.name;
                        break;
                      case "karana":
                        value = panchang.karana.name;
                        break;
                    }

                    return (
                      <motion.div
                        key={item.key}
                        variants={itemVariants}
                        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg`}
                          >
                            <Iconify icon={item.icon} width={24} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              {item.label}
                            </p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white truncate">
                              {value}
                            </p>
                            {subValue && (
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {subValue}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Info Card */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl border border-orange-200/50 dark:border-orange-800/50 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Iconify
                  icon="solar:info-circle-bold-duotone"
                  width={20}
                  className="text-orange-500"
                />
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  About Panchang
                </h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Panchang consists of five elements: Tithi (lunar day), Nakshatra
                (constellation), Yoga (auspicious combination), Karana
                (half-tithi), and Vara (weekday).
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// ============ Date Cell Component ============
const DateCell = ({
  dateInfo,
  isSelected,
  onSelect,
}: {
  dateInfo: DateInfo;
  isSelected: boolean;
  onSelect: () => void;
}) => {
  const isSunday = dateInfo.day === "Sunday";

  return (
    <motion.div
      variants={itemVariants}
      onClick={onSelect}
      className={`
        min-h-[100px] md:min-h-[120px] p-2 border-b border-r border-gray-100 dark:border-gray-800
        transition-all cursor-pointer group relative
        ${dateInfo.active ? "bg-orange-50 dark:bg-orange-900/20 ring-2 ring-orange-500 ring-inset" : "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50"}
        ${isSunday && !dateInfo.active ? "bg-red-50/50 dark:bg-red-900/10" : ""}
        ${isSelected && !dateInfo.active ? "bg-amber-50 dark:bg-amber-900/20 ring-2 ring-amber-400" : ""}
      `}
    >
      {/* Date Number */}
      <div className="flex items-start justify-between mb-1">
        <span
          className={`
            text-lg md:text-xl font-bold
            ${dateInfo.active ? "text-orange-600 dark:text-orange-400" : isSunday ? "text-red-500" : "text-gray-900 dark:text-white"}
          `}
        >
          {dateInfo.dayNumber}
        </span>
        {dateInfo.active && (
          <span className="text-[9px] bg-gradient-to-r from-orange-500 to-amber-500 text-white px-2 py-0.5 rounded-full font-medium shadow-sm">
            Today
          </span>
        )}
      </div>

      {/* Panchang Mini Info */}
      {dateInfo.panchang && (
        <div className="space-y-1">
          {/* Tithi */}
          <div className="flex items-center gap-1 text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 rounded px-1.5 py-0.5">
            <Iconify icon="solar:moon-bold-duotone" width={10} />
            <span className="text-[9px] md:text-[10px] truncate font-medium">
              {dateInfo.panchang.tithi.name}
            </span>
          </div>

          {/* Nakshatra */}
          <div className="flex items-center gap-1 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded px-1.5 py-0.5">
            <Iconify icon="solar:star-bold-duotone" width={10} />
            <span className="text-[9px] md:text-[10px] truncate font-medium">
              {dateInfo.panchang.nakshatra.name}
            </span>
          </div>

          {/* Yoga - Hidden on small screens */}
          <div className="hidden md:flex items-center gap-1 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 rounded px-1.5 py-0.5">
            <Iconify icon="solar:meditation-round-bold-duotone" width={10} />
            <span className="text-[10px] truncate font-medium">
              {dateInfo.panchang.yoga.name}
            </span>
          </div>
        </div>
      )}

      {/* Hover Indicator */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-orange-300 dark:group-hover:border-orange-700 rounded-lg pointer-events-none transition-all" />
    </motion.div>
  );
};

export default IndianCalendar;
