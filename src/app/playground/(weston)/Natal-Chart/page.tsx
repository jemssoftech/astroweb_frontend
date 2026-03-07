"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Iconify from "@/src/components/Iconify";
import PersonSelector from "@/src/components/PersonSelector";
import { Person } from "@/src/lib/models";
import Swal from "sweetalert2";
import api from "@/src/lib/api";

// ============ CONSTANTS ============

const HOUSE_SYSTEMS = [
  { value: "placidus", label: "Placidus" },
  { value: "koch", label: "Koch" },
  { value: "whole_sign", label: "Whole Sign" },
  { value: "equal_house", label: "Equal House" },
];

const PLANETS_CONFIG: Record<
  string,
  { symbol: string; gradient: string; color: string }
> = {
  Sun: {
    symbol: "☉",
    gradient: "from-amber-500 to-orange-500",
    color: "#F59E0B",
  },
  Moon: {
    symbol: "☽",
    gradient: "from-slate-400 to-gray-500",
    color: "#6B7280",
  },
  Mars: { symbol: "♂", gradient: "from-red-500 to-rose-600", color: "#EF4444" },
  Mercury: {
    symbol: "☿",
    gradient: "from-green-500 to-emerald-600",
    color: "#10B981",
  },
  Jupiter: {
    symbol: "♃",
    gradient: "from-orange-500 to-amber-600",
    color: "#F97316",
  },
  Venus: {
    symbol: "♀",
    gradient: "from-pink-500 to-rose-500",
    color: "#EC4899",
  },
  Saturn: {
    symbol: "♄",
    gradient: "from-purple-500 to-violet-600",
    color: "#8B5CF6",
  },
  Uranus: {
    symbol: "⛢",
    gradient: "from-cyan-500 to-blue-600",
    color: "#06B6D4",
  },
  Neptune: {
    symbol: "♆",
    gradient: "from-blue-500 to-indigo-600",
    color: "#3B82F6",
  },
  Pluto: {
    symbol: "♇",
    gradient: "from-stone-500 to-zinc-600",
    color: "#78716C",
  },
  Node: {
    symbol: "☊",
    gradient: "from-lime-500 to-green-600",
    color: "#84CC16",
  },
  Chiron: {
    symbol: "⚷",
    gradient: "from-violet-500 to-purple-600",
    color: "#A855F7",
  },
  Ascendant: {
    symbol: "AC",
    gradient: "from-red-600 to-rose-700",
    color: "#DC2626",
  },
  Midheaven: {
    symbol: "MC",
    gradient: "from-blue-600 to-indigo-700",
    color: "#2563EB",
  },
};

const ZODIAC_SIGNS: Record<
  string,
  { symbol: string; element: string; color: string; gradient: string }
> = {
  Aries: {
    symbol: "♈",
    element: "Fire",
    color: "#EF4444",
    gradient: "from-red-500 to-orange-500",
  },
  Taurus: {
    symbol: "♉",
    element: "Earth",
    color: "#84CC16",
    gradient: "from-lime-500 to-green-500",
  },
  Gemini: {
    symbol: "♊",
    element: "Air",
    color: "#FBBF24",
    gradient: "from-yellow-400 to-amber-500",
  },
  Cancer: {
    symbol: "♋",
    element: "Water",
    color: "#3B82F6",
    gradient: "from-blue-400 to-indigo-500",
  },
  Leo: {
    symbol: "♌",
    element: "Fire",
    color: "#F97316",
    gradient: "from-orange-500 to-amber-500",
  },
  Virgo: {
    symbol: "♍",
    element: "Earth",
    color: "#22C55E",
    gradient: "from-green-500 to-emerald-500",
  },
  Libra: {
    symbol: "♎",
    element: "Air",
    color: "#EC4899",
    gradient: "from-pink-500 to-rose-500",
  },
  Scorpio: {
    symbol: "♏",
    element: "Water",
    color: "#7C3AED",
    gradient: "from-violet-600 to-purple-700",
  },
  Sagittarius: {
    symbol: "♐",
    element: "Fire",
    color: "#8B5CF6",
    gradient: "from-purple-500 to-indigo-500",
  },
  Capricorn: {
    symbol: "♑",
    element: "Earth",
    color: "#6B7280",
    gradient: "from-gray-500 to-slate-600",
  },
  Aquarius: {
    symbol: "♒",
    element: "Air",
    color: "#06B6D4",
    gradient: "from-cyan-500 to-blue-500",
  },
  Pisces: {
    symbol: "♓",
    element: "Water",
    color: "#14B8A6",
    gradient: "from-teal-500 to-cyan-600",
  },
};

const ASPECT_SYMBOLS: Record<
  string,
  { symbol: string; color: string; type: "major" | "minor" }
> = {
  Conjunction: { symbol: "☌", color: "#EF4444", type: "major" },
  Opposition: { symbol: "☍", color: "#3B82F6", type: "major" },
  Trine: { symbol: "△", color: "#22C55E", type: "major" },
  Square: { symbol: "□", color: "#F97316", type: "major" },
  Sextile: { symbol: "⚹", color: "#8B5CF6", type: "major" },
  Quincunx: { symbol: "⚻", color: "#6B7280", type: "minor" },
  "Semi Sextile": { symbol: "⚺", color: "#9CA3AF", type: "minor" },
  "Semi Square": { symbol: "∠", color: "#D97706", type: "minor" },
  Quintile: { symbol: "Q", color: "#14B8A6", type: "minor" },
};

const HOUSE_MEANINGS = [
  "Self & Identity",
  "Money & Values",
  "Communication",
  "Home & Family",
  "Creativity & Romance",
  "Health & Work",
  "Partnerships",
  "Transformation",
  "Philosophy & Travel",
  "Career & Status",
  "Friends & Goals",
  "Spirituality & Secrets",
];

const ELEMENT_COLORS: Record<string, string> = {
  Fire: "#EF4444",
  Earth: "#22C55E",
  Air: "#FBBF24",
  Water: "#3B82F6",
};

// ============ MAIN COMPONENT ============

function WesternAstrologyPage() {
  // const [user, setUser] = useState(getUser());
  // useEffect(() => {
  //   setUser(getUser());
  // }, []);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [houseSystem, setHouseSystem] = useState<string>("placidus");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [selectedPlanet, setSelectedPlanet] = useState<string>("Sun");

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
        hour: birthDate.getHours(),
        min: birthDate.getMinutes(),
        lat: selectedPerson.Latitude,
        lon: selectedPerson.Longitude,
        tzone: parseFloat(selectedPerson.TimezoneOffset || "5.5"),
        house_type: houseSystem,
      };

      const response: any = await api.post(
        "/api/mainapi/natal-chart",
        requestBody,
      );

      if (response && response.status === 200 && response.data?.success) {
        setResult(response.data);
      } else {
        throw new Error(
          response?.data?.message ||
            response?.error ||
            "Failed to fetch natal chart data",
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

  const getPlanets = () =>
    result?.data?.basic?.planets?.data?.planets ||
    result?.data?.basic?.horoscope?.data?.planets ||
    [];
  const getHouses = () =>
    result?.data?.basic?.house_cusps?.data?.houses ||
    result?.data?.basic?.horoscope?.data?.houses ||
    [];
  const getAspects = () =>
    result?.data?.basic?.horoscope?.data?.aspects ||
    result?.data?.basic?.chart_data?.data?.aspects ||
    [];
  const getChartUrl = () =>
    result?.data?.basic?.natal_wheel?.data?.chart_url || null;

  const getSignFromDegree = (degree: number) => {
    const signIndex = Math.floor(degree / 30);
    return Object.keys(ZODIAC_SIGNS)[signIndex] || "—";
  };

  const getAscendant = () => {
    const horoscope = result?.data?.basic?.horoscope?.data;
    return horoscope?.ascendant ? getSignFromDegree(horoscope.ascendant) : "—";
  };

  const getMidheaven = () => {
    const horoscope = result?.data?.basic?.horoscope?.data;
    return horoscope?.midheaven ? getSignFromDegree(horoscope.midheaven) : "—";
  };

  const getMoonPhase = () =>
    result?.data?.basic?.horoscope?.data?.moon_phase || null;
  const getElements = () =>
    result?.data?.basic?.horoscope?.data?.elements || null;
  const getModes = () => result?.data?.basic?.horoscope?.data?.modes || null;
  const getDominantSign = () =>
    result?.data?.basic?.horoscope?.data?.dominant_sign || null;

  const tabs = [
    { key: "overview", label: "Overview", icon: "solar:home-2-bold-duotone" },
    { key: "planets", label: "Planets", icon: "solar:planet-bold-duotone" },
    { key: "houses", label: "Houses", icon: "solar:buildings-bold-duotone" },
    { key: "aspects", label: "Aspects", icon: "solar:graph-bold-duotone" },
    {
      key: "reports",
      label: "Reports",
      icon: "solar:document-text-bold-duotone",
    },
  ];

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-linear-to-r from-blue-700 via-indigo-700 to-violet-800 rounded-2xl p-6 md:p-8 text-white shadow-xl"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>

          <div className="absolute top-4 right-8 opacity-20">
            <Iconify icon="solar:chart-square-bold" width={100} height={100} />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Iconify
                  icon="solar:chart-2-bold-duotone"
                  width={40}
                  height={40}
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium">
                    Western Astrology
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Western Natal Chart
                </h1>
                <p className="text-white/80 mt-1">
                  Complete Western astrology analysis with planetary positions
                </p>
              </div>
            </div>

            {selectedPerson && result && (
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/20">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Iconify icon="solar:user-bold" width={20} height={20} />
                </div>
                <div>
                  <p className="font-semibold">{selectedPerson.Name}</p>
                  <p className="text-sm text-white/70">
                    {selectedPerson.BirthLocation}
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Main Layout */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
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

              {/* House System */}
              <div className="mt-5">
                <label className="block text-sm font-medium text-foreground mb-2">
                  House System
                </label>
                <select
                  value={houseSystem}
                  onChange={(e) => setHouseSystem(e.target.value)}
                  className="w-full p-3 bg-muted border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-foreground"
                >
                  {HOUSE_SYSTEMS.map((hs) => (
                    <option key={hs.value} value={hs.value}>
                      {hs.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleCalculate}
                disabled={loading || !selectedPerson}
                className="mt-6 w-full py-3.5 px-4 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 hover:-translate-y-0.5"
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

            {/* Quick Stats */}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-800 rounded-2xl p-6 text-white shadow-xl overflow-hidden relative"
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
                    <h3 className="font-semibold">Core Placements</h3>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        label: "Sun Sign",
                        value:
                          getPlanets().find((p: any) => p.name === "Sun")
                            ?.sign || "—",
                      },
                      {
                        label: "Moon Sign",
                        value:
                          getPlanets().find((p: any) => p.name === "Moon")
                            ?.sign || "—",
                      },
                      { label: "Ascendant", value: getAscendant() },
                      { label: "Midheaven", value: getMidheaven() },
                    ].map((item) => {
                      const zodiac = ZODIAC_SIGNS[item.value];
                      return (
                        <div
                          key={item.label}
                          className="flex items-center justify-between p-3 bg-white/10 rounded-xl"
                        >
                          <span className="text-sm text-white/80">
                            {item.label}
                          </span>
                          <div className="flex items-center gap-2">
                            {zodiac && (
                              <span style={{ color: zodiac.color }}>
                                {zodiac.symbol}
                              </span>
                            )}
                            <span className="font-semibold">{item.value}</span>
                          </div>
                        </div>
                      );
                    })}
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

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.25 }}
                    >
                      {/* ======== OVERVIEW TAB ======== */}
                      {activeTab === "overview" && (
                        <div className="space-y-6">
                          {/* Core Sign Cards */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                              {
                                label: "Sun Sign",
                                planet: "Sun",
                                value:
                                  getPlanets().find(
                                    (p: any) => p.name === "Sun",
                                  )?.sign || "—",
                              },
                              {
                                label: "Moon Sign",
                                planet: "Moon",
                                value:
                                  getPlanets().find(
                                    (p: any) => p.name === "Moon",
                                  )?.sign || "—",
                              },
                              {
                                label: "Ascendant",
                                planet: "Ascendant",
                                value: getAscendant(),
                              },
                              {
                                label: "Midheaven",
                                planet: "Midheaven",
                                value: getMidheaven(),
                              },
                            ].map((item, idx) => {
                              const zodiac = ZODIAC_SIGNS[item.value];
                              const config = PLANETS_CONFIG[item.planet];
                              return (
                                <motion.div
                                  key={item.label}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: idx * 0.1 }}
                                  className={`relative overflow-hidden bg-gradient-to-br ${zodiac?.gradient || config?.gradient || "from-gray-500 to-slate-600"} rounded-2xl p-5 text-white shadow-lg`}
                                >
                                  <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                                  <div className="relative z-10">
                                    <p className="text-white/70 text-xs uppercase tracking-wide mb-2">
                                      {item.label}
                                    </p>
                                    <div className="flex items-center gap-2 mb-1">
                                      {zodiac && (
                                        <span className="text-2xl">
                                          {zodiac.symbol}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xl font-bold">
                                      {item.value}
                                    </p>
                                    {zodiac && (
                                      <p className="text-white/70 text-xs mt-1">
                                        {zodiac.element}
                                      </p>
                                    )}
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>

                          {/* Chart & Stats Grid */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Natal Wheel */}
                            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-white/20 rounded-xl">
                                    <Iconify
                                      icon="solar:chart-square-bold-duotone"
                                      width={24}
                                      height={24}
                                      className="text-white"
                                    />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-white">
                                      Natal Wheel Chart
                                    </h3>
                                    <p className="text-white/70 text-sm">
                                      {houseSystem} house system
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="p-4">
                                {getChartUrl() ? (
                                  <img
                                    src={getChartUrl()}
                                    alt="Natal Wheel Chart"
                                    className="w-full max-w-sm mx-auto"
                                  />
                                ) : (
                                  <div className="aspect-square bg-muted rounded-xl flex items-center justify-center">
                                    <div className="text-center">
                                      <Iconify
                                        icon="solar:chart-square-bold-duotone"
                                        width={48}
                                        height={48}
                                        className="text-muted-foreground/40 mx-auto mb-2"
                                      />
                                      <p className="text-muted-foreground text-sm">
                                        Chart not available
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Stats Panel */}
                            <div className="space-y-4">
                              {/* Moon Phase */}
                              {getMoonPhase() && (
                                <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
                                  <div className="flex items-center gap-3">
                                    <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-3xl">
                                      🌓
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                                        Moon Phase
                                      </p>
                                      <p className="font-semibold text-foreground">
                                        {getMoonPhase().moon_phase_name}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {getMoonPhase().moon_phase_calc}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Dominant Sign */}
                              {getDominantSign() && (
                                <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
                                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">
                                    Dominant Sign
                                  </p>
                                  <div className="flex items-center gap-3">
                                    <div
                                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                                      style={{
                                        backgroundColor: `${ZODIAC_SIGNS[getDominantSign().sign_name]?.color}20`,
                                        color:
                                          ZODIAC_SIGNS[
                                            getDominantSign().sign_name
                                          ]?.color,
                                      }}
                                    >
                                      {
                                        ZODIAC_SIGNS[
                                          getDominantSign().sign_name
                                        ]?.symbol
                                      }
                                    </div>
                                    <div>
                                      <p className="font-bold text-foreground text-lg">
                                        {getDominantSign().sign_name}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {getDominantSign().percentage?.toFixed(
                                          1,
                                        )}
                                        % dominance
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Elements */}
                              {getElements() && (
                                <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
                                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-4">
                                    Elements
                                  </p>
                                  <div className="space-y-3">
                                    {getElements().elements?.map((el: any) => (
                                      <div key={el.name}>
                                        <div className="flex justify-between mb-1">
                                          <span className="text-sm text-foreground/80">
                                            {el.name}
                                          </span>
                                          <span className="text-sm font-medium text-foreground">
                                            {el.percentage?.toFixed(0)}%
                                          </span>
                                        </div>
                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                          <div
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{
                                              width: `${el.percentage}%`,
                                              backgroundColor:
                                                ELEMENT_COLORS[el.name],
                                            }}
                                          />
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Modes */}
                              {getModes() && (
                                <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
                                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-4">
                                    Modalities
                                  </p>
                                  <div className="space-y-3">
                                    {getModes().modes?.map((mode: any) => (
                                      <div key={mode.name}>
                                        <div className="flex justify-between mb-1">
                                          <span className="text-sm text-foreground/80">
                                            {mode.name}
                                          </span>
                                          <span className="text-sm font-medium text-foreground">
                                            {mode.percentage?.toFixed(0)}%
                                          </span>
                                        </div>
                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                          <div
                                            className="h-full rounded-full bg-linear-to-r from-primary to-blue-500 transition-all duration-500"
                                            style={{
                                              width: `${mode.percentage}%`,
                                            }}
                                          />
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Planets Quick Table */}
                          <ModernPlanetsTable planets={getPlanets()} />
                        </div>
                      )}

                      {/* ======== PLANETS TAB ======== */}
                      {activeTab === "planets" && (
                        <div className="space-y-6">
                          <ModernPlanetsTable
                            planets={getPlanets()}
                            showDetails
                          />

                          {/* Planet Reports */}
                          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                            <div className="bg-linear-to-r from-amber-500 to-orange-600 px-6 py-4">
                              <h3 className="font-semibold text-white text-lg">
                                Planet Reports
                              </h3>
                              <p className="text-white/70 text-sm">
                                Detailed interpretation for each planet
                              </p>
                            </div>
                            <div className="p-6">
                              <div className="flex flex-wrap gap-2 mb-6">
                                {[
                                  "Sun",
                                  "Moon",
                                  "Mars",
                                  "Mercury",
                                  "Jupiter",
                                  "Venus",
                                  "Saturn",
                                ].map((planet) => {
                                  const config = PLANETS_CONFIG[planet];
                                  return (
                                    <button
                                      key={planet}
                                      onClick={() => setSelectedPlanet(planet)}
                                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                        selectedPlanet === planet
                                          ? "text-white shadow-lg"
                                          : "bg-muted text-foreground/70 hover:bg-muted/80"
                                      }`}
                                      style={
                                        selectedPlanet === planet
                                          ? { backgroundColor: config?.color }
                                          : {}
                                      }
                                    >
                                      <span>{config?.symbol}</span>
                                      {planet}
                                    </button>
                                  );
                                })}
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {["sign_report", "house_report"].map(
                                  (reportType) => (
                                    <div
                                      key={reportType}
                                      className="bg-muted/50 rounded-xl p-5"
                                    >
                                      <div className="flex items-center gap-2 mb-3">
                                        <span
                                          style={{
                                            color:
                                              PLANETS_CONFIG[selectedPlanet]
                                                ?.color,
                                          }}
                                        >
                                          {
                                            PLANETS_CONFIG[selectedPlanet]
                                              ?.symbol
                                          }
                                        </span>
                                        <h4 className="font-semibold text-foreground">
                                          &quot;{selectedPlanet}&quot; in{" "}
                                          {reportType === "sign_report"
                                            ? "Sign"
                                            : "House"}
                                        </h4>
                                      </div>
                                      <p className="text-sm text-foreground/70 leading-relaxed">
                                        {result?.data?.planets?.[
                                          selectedPlanet.toLowerCase()
                                        ]?.[reportType]?.report ||
                                          "Report not available"}
                                      </p>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ======== HOUSES TAB ======== */}
                      {activeTab === "houses" && (
                        <div className="space-y-6">
                          <ModernHousesTable houses={getHouses()} />

                          {/* Houses Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {getHouses().map((house: any, idx: number) => {
                              const zodiac = ZODIAC_SIGNS[house.sign];
                              return (
                                <motion.div
                                  key={idx}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: idx * 0.05 }}
                                  className={`relative overflow-hidden rounded-xl p-4 text-white shadow-lg`}
                                  style={{
                                    background: `linear-gradient(135deg, ${zodiac?.color}CC, ${zodiac?.color}99)`,
                                  }}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center font-bold text-sm">
                                      {house.house || idx + 1}
                                    </span>
                                    <span className="text-2xl">
                                      {zodiac?.symbol}
                                    </span>
                                  </div>
                                  <p className="font-bold">{house.sign}</p>
                                  <p className="text-white/70 text-xs mt-1">
                                    {HOUSE_MEANINGS[idx]}
                                  </p>
                                  <p className="text-white/60 text-xs">
                                    {house.degree?.toFixed(2)}°
                                  </p>
                                </motion.div>
                              );
                            })}
                          </div>

                          {/* House Interpretations */}
                          {result?.data?.basic?.house_cusps_report?.data
                            ?.houses && (
                            <div className="space-y-4">
                              <h3 className="font-semibold text-foreground flex items-center gap-2">
                                <Iconify
                                  icon="solar:document-text-bold-duotone"
                                  width={20}
                                  height={20}
                                  className="text-primary"
                                />
                                House Interpretations
                              </h3>
                              {result.data.basic.house_cusps_report.data.houses.map(
                                (house: any, idx: number) => (
                                  <div
                                    key={idx}
                                    className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
                                  >
                                    <div className="flex items-center gap-3 p-4 border-b border-border bg-muted/30">
                                      <span className="w-9 h-9 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold">
                                        {house.house || idx + 1}
                                      </span>
                                      <div>
                                        <p className="font-semibold text-foreground">
                                          House {house.house || idx + 1} —{" "}
                                          {house.sign}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                          {HOUSE_MEANINGS[idx]}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="p-5">
                                      <p className="text-sm text-foreground/80 leading-relaxed">
                                        {house.report}
                                      </p>
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* ======== ASPECTS TAB ======== */}
                      {activeTab === "aspects" && (
                        <div className="space-y-6">
                          {/* Aspect Summary Badges */}
                          <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
                            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                              <Iconify
                                icon="solar:graph-bold-duotone"
                                width={20}
                                height={20}
                                className="text-primary"
                              />
                              Aspect Overview
                            </h3>
                            <div className="flex flex-wrap gap-3">
                              {Object.entries(ASPECT_SYMBOLS).map(
                                ([name, { symbol, color }]) => {
                                  const count = getAspects().filter(
                                    (a: any) =>
                                      a.type?.toLowerCase() ===
                                      name.toLowerCase(),
                                  ).length;
                                  if (count === 0) return null;
                                  return (
                                    <div
                                      key={name}
                                      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-muted/50"
                                    >
                                      <span
                                        style={{ color }}
                                        className="text-xl font-bold"
                                      >
                                        {symbol}
                                      </span>
                                      <span className="text-sm text-foreground/80">
                                        {name}
                                      </span>
                                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                                        {count}
                                      </span>
                                    </div>
                                  );
                                },
                              )}
                            </div>
                          </div>

                          <ModernAspectsTable aspects={getAspects()} />
                        </div>
                      )}

                      {/* ======== REPORTS TAB ======== */}
                      {activeTab === "reports" && (
                        <div className="space-y-6">
                          {result?.data?.basic?.ascendant_report?.data && (
                            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                              <div className="bg-linear-to-r from-red-600 to-rose-700 px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-white/20 rounded-xl">
                                    <Iconify
                                      icon="solar:arrow-up-bold-duotone"
                                      width={24}
                                      height={24}
                                      className="text-white"
                                    />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-white text-lg">
                                      Ascendant Report
                                    </h3>
                                    <p className="text-white/70">
                                      {
                                        result.data.basic.ascendant_report.data
                                          .ascendant
                                      }{" "}
                                      Rising
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="p-6">
                                <p className="text-foreground/80 leading-relaxed">
                                  {
                                    result.data.basic.ascendant_report.data
                                      .report
                                  }
                                </p>
                              </div>
                            </div>
                          )}

                          {result?.data?.basic?.horoscope?.data?.hemisphere && (
                            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                              <div className="bg-linear-to-r from-indigo-600 to-violet-700 px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-white/20 rounded-xl">
                                    <Iconify
                                      icon="solar:planet-bold-duotone"
                                      width={24}
                                      height={24}
                                      className="text-white"
                                    />
                                  </div>
                                  <h3 className="font-semibold text-white text-lg">
                                    Hemisphere Emphasis
                                  </h3>
                                </div>
                              </div>
                              <div className="p-6 grid md:grid-cols-2 gap-4">
                                {[
                                  { key: "east_west", label: "East-West" },
                                  { key: "north_south", label: "North-South" },
                                ].map(({ key, label }) => (
                                  <div
                                    key={key}
                                    className="p-4 bg-muted/50 rounded-xl"
                                  >
                                    <p className="font-semibold text-foreground mb-2">
                                      {label}
                                    </p>
                                    <p className="text-sm text-foreground/70">
                                      {
                                        result.data.basic.horoscope.data
                                          .hemisphere[key]?.description
                                      }
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {getMoonPhase()?.moon_phase_description && (
                            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                              <div className="bg-linear-to-r from-slate-600 to-gray-700 px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-white/20 rounded-xl">
                                    <Iconify
                                      icon="solar:moon-bold-duotone"
                                      width={24}
                                      height={24}
                                      className="text-white"
                                    />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-white text-lg">
                                      Moon Phase Report
                                    </h3>
                                    <p className="text-white/70 text-sm">
                                      {getMoonPhase().moon_phase_name}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="p-6">
                                <p className="text-foreground/80 leading-relaxed">
                                  {getMoonPhase().moon_phase_description}
                                </p>
                              </div>
                            </div>
                          )}

                          {result?.data?.basic?.interpretation?.data && (
                            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                              <div className="bg-linear-to-r from-emerald-600 to-teal-700 px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-white/20 rounded-xl">
                                    <Iconify
                                      icon="solar:document-text-bold-duotone"
                                      width={24}
                                      height={24}
                                      className="text-white"
                                    />
                                  </div>
                                  <h3 className="font-semibold text-white text-lg">
                                    Chart Interpretation
                                  </h3>
                                </div>
                              </div>
                              <div className="p-6">
                                <DataRenderer
                                  data={result.data.basic.interpretation.data}
                                />
                              </div>
                            </div>
                          )}
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
                        icon="solar:chart-2-bold-duotone"
                        width={48}
                        height={48}
                        className="text-muted-foreground/50"
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      No Chart Generated
                    </h3>
                    <p className="text-muted-foreground text-center max-w-md mb-8">
                      Select a person and click "Generate Chart" to view your
                      complete Western astrology natal chart analysis.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full max-w-2xl">
                      {tabs.map((tab) => (
                        <div
                          key={tab.key}
                          className="flex flex-col items-center gap-2 p-4 bg-muted/50 rounded-xl"
                        >
                          <Iconify
                            icon={tab.icon}
                            width={28}
                            height={28}
                            className="text-muted-foreground"
                          />
                          <span className="text-xs text-muted-foreground text-center">
                            {tab.label}
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

// ============ TABLE COMPONENTS ============

function ModernPlanetsTable({
  planets,
  showDetails = false,
}: {
  planets: any[];
  showDetails?: boolean;
}) {
  if (!planets || planets.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border shadow-sm p-8 text-center">
        <p className="text-muted-foreground">No planetary data available</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 px-6 py-4">
        <h3 className="font-semibold text-white text-lg">
          Planetary Positions
        </h3>
        <p className="text-white/70 text-sm">
          Sidereal positions of all planets
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {[
                "Planet",
                "Sign",
                "Degree",
                "House",
                ...(showDetails ? ["Speed"] : []),
                "Status",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {planets.map((planet: any, idx: number) => {
              const config = PLANETS_CONFIG[planet.name] || {
                symbol: "•",
                gradient: "from-gray-500 to-slate-600",
                color: "#6B7280",
              };
              const zodiac = ZODIAC_SIGNS[planet.sign];
              const isRetro =
                planet.is_retro === "true" || planet.isRetro === "true";

              return (
                <tr key={idx} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                        style={{
                          background: `linear-gradient(135deg, ${config.color}CC, ${config.color}99)`,
                        }}
                      >
                        {config.symbol}
                      </div>
                      <span className="font-medium text-foreground">
                        {planet.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {zodiac && (
                        <span
                          style={{ color: zodiac.color }}
                          className="text-lg"
                        >
                          {zodiac.symbol}
                        </span>
                      )}
                      <span className="text-foreground/80">{planet.sign}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-foreground/70">
                    {(
                      planet.norm_degree ||
                      planet.normDegree ||
                      planet.full_degree
                    )?.toFixed(2)}
                    °
                  </td>
                  <td className="px-4 py-3">
                    <span className="w-7 h-7 bg-primary/10 text-primary rounded-lg inline-flex items-center justify-center font-semibold text-xs">
                      {planet.house || "—"}
                    </span>
                  </td>
                  {showDetails && (
                    <td className="px-4 py-3 font-mono text-foreground/60 text-xs">
                      {planet.speed?.toFixed(4) || "—"}
                    </td>
                  )}
                  <td className="px-4 py-3">
                    {isRetro ? (
                      <span className="inline-flex items-center gap-1 text-red-500 bg-red-500/10 text-xs font-semibold px-2 py-1 rounded-lg">
                        ℞ Retro
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-green-500 bg-green-500/10 text-xs font-semibold px-2 py-1 rounded-lg">
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
    </div>
  );
}

function ModernHousesTable({ houses }: { houses: any[] }) {
  if (!houses || houses.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border shadow-sm p-8 text-center">
        <p className="text-muted-foreground">No house data available</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="bg-linear-to-r from-emerald-600 to-teal-700 px-6 py-4">
        <h3 className="font-semibold text-white text-lg">House Cusps</h3>
        <p className="text-white/70 text-sm">
          Zodiac positions at house boundaries
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {["House", "Sign", "Cusp Degree", "Area of Life"].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {houses.map((house: any, idx: number) => {
              const zodiac = ZODIAC_SIGNS[house.sign];
              return (
                <tr key={idx} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <span className="w-8 h-8 bg-primary/10 text-primary rounded-xl inline-flex items-center justify-center font-bold text-sm">
                      {house.house || idx + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {zodiac && (
                        <span
                          style={{ color: zodiac.color }}
                          className="text-xl"
                        >
                          {zodiac.symbol}
                        </span>
                      )}
                      <span className="font-medium text-foreground">
                        {house.sign}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-foreground/70">
                    {house.degree?.toFixed(2)}°
                  </td>
                  <td className="px-4 py-3 text-foreground/60 text-xs">
                    {HOUSE_MEANINGS[idx]}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ModernAspectsTable({ aspects }: { aspects: any[] }) {
  if (!aspects || aspects.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border shadow-sm p-8 text-center">
        <p className="text-muted-foreground">No aspect data available</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="bg-linear-to-r from-violet-600 to-purple-700 px-6 py-4">
        <h3 className="font-semibold text-white text-lg">Planetary Aspects</h3>
        <p className="text-white/70 text-sm">
          {aspects.length} total aspects found
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {["Planet 1", "Aspect", "Planet 2", "Orb"].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {aspects.map((aspect: any, idx: number) => {
              const aspectConfig = ASPECT_SYMBOLS[aspect.type] || {
                symbol: "•",
                color: "#6B7280",
              };
              const p1 = PLANETS_CONFIG[aspect.aspecting_planet] || {
                symbol: "•",
                color: "#6B7280",
              };
              const p2 = PLANETS_CONFIG[aspect.aspected_planet] || {
                symbol: "•",
                color: "#6B7280",
              };

              return (
                <tr key={idx} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span style={{ color: p1.color }} className="text-lg">
                        {p1.symbol}
                      </span>
                      <span className="font-medium text-foreground">
                        {aspect.aspecting_planet}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-white"
                      style={{ backgroundColor: aspectConfig.color }}
                    >
                      <span className="text-base">{aspectConfig.symbol}</span>
                      {aspect.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span style={{ color: p2.color }} className="text-lg">
                        {p2.symbol}
                      </span>
                      <span className="font-medium text-foreground">
                        {aspect.aspected_planet}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-foreground/70">
                    {aspect.orb?.toFixed(2)}°
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DataRenderer({ data }: { data: any }) {
  if (data === null || data === undefined)
    return <span className="text-muted-foreground">—</span>;
  if (typeof data !== "object")
    return <span className="text-foreground/80">{String(data)}</span>;

  if (Array.isArray(data)) {
    return (
      <div className="space-y-2">
        {data.map((item, idx) => (
          <div key={idx} className="pl-4 border-l-2 border-primary/30">
            <DataRenderer data={item} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="p-3 bg-muted/50 rounded-xl">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
            {key.replace(/_/g, " ")}
          </p>
          <DataRenderer data={value} />
        </div>
      ))}
    </div>
  );
}

export default WesternAstrologyPage;
