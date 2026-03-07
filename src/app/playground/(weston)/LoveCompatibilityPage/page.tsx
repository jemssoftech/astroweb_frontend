"use client";

import React, { useState } from "react";
import Iconify from "@/src/components/Iconify";
import PersonSelector from "@/src/components/PersonSelector";
import { Person } from "@/src/lib/models";
import Swal from "sweetalert2";
import api from "@/src/lib/api";
import { motion } from "framer-motion";

// ============ CONSTANTS ============

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
    gradient: "from-green-500 to-lime-500",
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
    gradient: "from-blue-400 to-cyan-500",
  },
  Leo: {
    symbol: "♌",
    element: "Fire",
    color: "#F97316",
    gradient: "from-orange-500 to-yellow-500",
  },
  Virgo: {
    symbol: "♍",
    element: "Earth",
    color: "#22C55E",
    gradient: "from-emerald-500 to-green-500",
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
    gradient: "from-violet-500 to-purple-600",
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
    gradient: "from-cyan-500 to-teal-500",
  },
  Pisces: {
    symbol: "♓",
    element: "Water",
    color: "#14B8A6",
    gradient: "from-teal-500 to-emerald-500",
  },
};

const PLANETS_CONFIG: Record<
  string,
  { symbol: string; color: string; label: string }
> = {
  Sun: { symbol: "☉", color: "#F59E0B", label: "Identity" },
  Moon: { symbol: "☽", color: "#6B7280", label: "Emotions" },
  Mars: { symbol: "♂", color: "#EF4444", label: "Energy" },
  Mercury: { symbol: "☿", color: "#10B981", label: "Communication" },
  Jupiter: { symbol: "♃", color: "#F97316", label: "Growth" },
  Venus: { symbol: "♀", color: "#EC4899", label: "Love" },
  Saturn: { symbol: "♄", color: "#8B5CF6", label: "Structure" },
  Uranus: { symbol: "⛢", color: "#06B6D4", label: "Innovation" },
  Neptune: { symbol: "♆", color: "#3B82F6", label: "Dreams" },
  Pluto: { symbol: "♇", color: "#78716C", label: "Transformation" },
  Node: { symbol: "☊", color: "#84CC16", label: "Destiny" },
  Chiron: { symbol: "⚷", color: "#A855F7", label: "Healing" },
  Ascendant: { symbol: "AC", color: "#DC2626", label: "Self Image" },
  Midheaven: { symbol: "MC", color: "#2563EB", label: "Career" },
  "Part of Fortune": { symbol: "⊕", color: "#059669", label: "Luck" },
};

const ASPECT_CONFIG: Record<
  string,
  { symbol: string; color: string; type: string; meaning: string }
> = {
  Conjunction: {
    symbol: "☌",
    color: "#EF4444",
    type: "major",
    meaning: "Unity",
  },
  Opposition: {
    symbol: "☍",
    color: "#3B82F6",
    type: "major",
    meaning: "Balance",
  },
  Trine: { symbol: "△", color: "#22C55E", type: "major", meaning: "Harmony" },
  Square: {
    symbol: "□",
    color: "#F97316",
    type: "major",
    meaning: "Challenge",
  },
  Sextile: {
    symbol: "⚹",
    color: "#8B5CF6",
    type: "major",
    meaning: "Opportunity",
  },
  Quincunx: {
    symbol: "⚻",
    color: "#6B7280",
    type: "minor",
    meaning: "Adjustment",
  },
  "Semi Sextile": {
    symbol: "⚺",
    color: "#9CA3AF",
    type: "minor",
    meaning: "Subtle",
  },
  "Semi Square": {
    symbol: "∠",
    color: "#D97706",
    type: "minor",
    meaning: "Friction",
  },
  Quintile: { symbol: "Q", color: "#14B8A6", type: "minor", meaning: "Talent" },
};

const TABS = [
  {
    key: "overview",
    label: "Overview",
    icon: "mdi:view-dashboard",
    description: "Complete summary",
  },
  {
    key: "synastry",
    label: "Synastry",
    icon: "mdi:vector-intersection",
    description: "Chart comparison",
  },
  {
    key: "composite",
    label: "Composite",
    icon: "mdi:chart-arc",
    description: "Combined chart",
  },
  {
    key: "karma",
    label: "Karma & Destiny",
    icon: "mdi:infinity",
    description: "Soul connection",
  },
  {
    key: "friendship",
    label: "Friendship",
    icon: "mdi:account-group",
    description: "Friendship forecast",
  },
  {
    key: "personality",
    label: "Romantic Profile",
    icon: "mdi:account-heart",
    description: "Love style",
  },
];

// ============ MAIN COMPONENT ============

function LoveCompatibilityPage() {
  const [partner1, setPartner1] = useState<Person | null>(null);
  const [partner2, setPartner2] = useState<Person | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");
  // const [user, setUser] = useState(getUser());
  // useEffect(() => {
  //   setUser(getUser());
  // }, []);

  const handleCalculate = async () => {
    if (!partner1 || !partner2) {
      Swal.fire({
        icon: "warning",
        title: "Select Both Partners",
        text: "Please select both partners to check compatibility.",
        background: "#1f2937",
        color: "#f9fafb",
      });
      return;
    }

    if (partner1.PersonId === partner2.PersonId) {
      Swal.fire({
        icon: "warning",
        title: "Different Partners Required",
        text: "Please select two different persons.",
        background: "#1f2937",
        color: "#f9fafb",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const p1Date = new Date(partner1.BirthTime);
      const p2Date = new Date(partner2.BirthTime);

      const requestBody = {
        p_day: p1Date.getDate(),
        p_month: p1Date.getMonth() + 1,
        p_year: p1Date.getFullYear(),
        p_hour: p1Date.getHours(),
        p_min: p1Date.getMinutes(),
        p_lat: partner1.Latitude,
        p_lon: partner1.Longitude,
        p_tzone: parseFloat(partner1.TimezoneOffset || "5.5"),
        s_day: p2Date.getDate(),
        s_month: p2Date.getMonth() + 1,
        s_year: p2Date.getFullYear(),
        s_hour: p2Date.getHours(),
        s_min: p2Date.getMinutes(),
        s_lat: partner2.Latitude,
        s_lon: partner2.Longitude,
        s_tzone: parseFloat(partner2.TimezoneOffset || "5.5"),
      };

      const response: any = await api.post(
        "/api/mainapi/love-compatibility",
        requestBody,
      );

      if (response && response.status === 200 && response.data?.success) {
        setResult(response.data);
      } else {
        throw new Error(
          response?.data?.message ||
            response?.error ||
            "Failed to fetch compatibility data",
        );
      }
    } catch (error: any) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Something went wrong!",
        background: "#1f2937",
        color: "#f9fafb",
      });
    } finally {
      setLoading(false);
    }
  };

  const getSynastry = () => result?.data?.synastry || null;
  const getComposite = () => result?.data?.composite || null;
  const getKarmaDestiny = () => result?.data?.karma_destiny || null;
  const getFriendshipForecast = () => result?.data?.friendship || null;
  const getRomanticPersonality = () =>
    result?.data?.romantic_personality || null;
  const getPartners = () => result?.partners || null;

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-linear-to-r from-pink-600 via-purple-700 to-indigo-800 rounded-2xl p-6 md:p-8 text-white shadow-xl"
        >
          {/* Background glow shapes */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>

          {/* Background watermark icon */}
          <div className="absolute top-4 right-8 opacity-20">
            <Iconify icon="mdi:heart-multiple" width={100} height={100} />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Left Content */}
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Iconify icon="mdi:heart-multiple" width={40} height={40} />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium">
                    Western Astrology
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold">
                  Complete Compatibility Analysis
                </h1>

                <p className="text-white/80 mt-1 max-w-xl">
                  Discover deep insights about your relationship through
                  synastry, composite charts, karma patterns, and romantic
                  profiles.
                </p>
              </div>
            </div>

            {/* Optional Couple Info Section */}
            {partner1 && partner2 && (
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/20">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Iconify icon="solar:user-bold" width={20} height={20} />
                  </div>
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Iconify icon="solar:user-bold" width={20} height={20} />
                  </div>
                </div>
                <div>
                  <p className="font-semibold">
                    {partner1?.Name} ❤️ {partner2?.Name}
                  </p>
                  <p className="text-sm text-white/70">
                    Synastry & Composite Report
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Partner Selection Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 overflow-hidden mb-8">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-linear-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                <Iconify
                  icon="mdi:account-multiple-plus"
                  width={20}
                  className="text-white"
                />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Select Partners
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Choose two people to analyze compatibility
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-11 gap-6 items-center">
              {/* Partner 1 */}
              <div className="lg:col-span-5">
                <div className="relative">
                  <div className="absolute -top-3 left-4 z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-linear-to-r from-blue-500 to-cyan-500 text-white text-xs font-semibold rounded-full shadow-lg">
                      <Iconify icon="mdi:account" width={14} />
                      Partner 1
                    </span>
                  </div>
                  <div className="pt-4 p-4 bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                    <PersonSelector onPersonSelected={setPartner1} />
                    {partner1 && (
                      <PartnerSelectedCard partner={partner1} color="blue" />
                    )}
                  </div>
                </div>
              </div>

              {/* Heart Connector */}
              <div className="lg:col-span-1 flex justify-center">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-linear-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/30 animate-pulse">
                    <Iconify
                      icon="mdi:heart"
                      width={28}
                      className="text-white"
                    />
                  </div>
                  <div className="absolute -inset-2 rounded-full bg-pink-500/20 blur-md"></div>
                </div>
              </div>

              {/* Partner 2 */}
              <div className="lg:col-span-5">
                <div className="relative">
                  <div className="absolute -top-3 left-4 z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-linear-to-r from-pink-500 to-rose-500 text-white text-xs font-semibold rounded-full shadow-lg">
                      <Iconify icon="mdi:account" width={14} />
                      Partner 2
                    </span>
                  </div>
                  <div className="pt-4 p-4 bg-linear-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 rounded-xl border-2 border-pink-200 dark:border-pink-800">
                    <PersonSelector onPersonSelected={setPartner2} />
                    {partner2 && (
                      <PartnerSelectedCard partner={partner2} color="pink" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Calculate Button */}
            <div className="mt-8">
              <button
                onClick={handleCalculate}
                disabled={loading || !partner1 || !partner2}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-300 ${
                  loading || !partner1 || !partner2
                    ? "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                    : "bg-linear-to-r from-pink-500 via-purple-500 to-indigo-500 text-white hover:shadow-xl hover:shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98]"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Analyzing Compatibility...</span>
                  </>
                ) : (
                  <>
                    <Iconify icon="mdi:heart-multiple" width={24} />
                    <span>You&apos;re both attracted to beauty</span>
                    <Iconify icon="mdi:arrow-right" width={20} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <QuickStatsBar
              synastry={getSynastry()}
              partners={getPartners()}
              partner1={partner1}
              partner2={partner2}
            />

            {/* Tabs Navigation */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 overflow-hidden">
              <div className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-2">
                <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                  {TABS.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                        activeTab === tab.key
                          ? "bg-linear-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-purple-500/25"
                          : "text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <Iconify icon={tab.icon} width={18} />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "overview" && (
                  <OverviewTab
                    partner1={partner1}
                    partner2={partner2}
                    synastry={getSynastry()}
                    composite={getComposite()}
                    partners={getPartners()}
                    karmaDestiny={getKarmaDestiny()}
                    romanticPersonality={getRomanticPersonality()}
                  />
                )}

                {activeTab === "synastry" && (
                  <SynastryTab
                    synastry={getSynastry()}
                    partner1={partner1}
                    partner2={partner2}
                  />
                )}

                {activeTab === "composite" && (
                  <CompositeTab composite={getComposite()} />
                )}

                {activeTab === "karma" && (
                  <KarmaDestinyTab data={getKarmaDestiny()} />
                )}

                {activeTab === "friendship" && (
                  <FriendshipForecastTab data={getFriendshipForecast()} />
                )}

                {activeTab === "personality" && (
                  <RomanticPersonalityTab
                    data={getRomanticPersonality()}
                    partner1={partner1}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!result && !loading && <EmptyStateCard />}
      </div>
    </div>
  );
}

// ============ QUICK STATS BAR ============

function QuickStatsBar({
  synastry,
  partners,
  partner1,
  partner2,
}: {
  synastry: any;
  partners: any;
  partner1: Person | null;
  partner2: Person | null;
}) {
  const p1Sun = synastry?.first?.find((p: any) => p.name === "Sun");
  const p2Sun = synastry?.second?.find((p: any) => p.name === "Sun");
  const p1Moon = synastry?.first?.find((p: any) => p.name === "Moon");
  const p2Moon = synastry?.second?.find((p: any) => p.name === "Moon");
  const p1Venus = synastry?.first?.find((p: any) => p.name === "Venus");
  const p2Venus = synastry?.second?.find((p: any) => p.name === "Venus");
  const aspectCount = synastry?.synastry?.aspects?.length || 0;

  const stats = [
    {
      icon: "mdi:white-balance-sunny",
      label: "Sun Signs",
      value: `${p1Sun?.sign || "?"} + ${p2Sun?.sign || "?"}`,
      gradient: "from-amber-400 to-orange-500",
      bgColor: "bg-amber-50 dark:bg-amber-950/30",
    },
    {
      icon: "mdi:moon-waning-crescent",
      label: "Moon Signs",
      value: `${p1Moon?.sign || "?"} + ${p2Moon?.sign || "?"}`,
      gradient: "from-slate-400 to-slate-600",
      bgColor: "bg-slate-50 dark:bg-slate-950/30",
    },
    {
      icon: "mdi:heart",
      label: "Venus Signs",
      value: `${p1Venus?.sign || "?"} + ${p2Venus?.sign || "?"}`,
      gradient: "from-pink-400 to-rose-500",
      bgColor: "bg-pink-50 dark:bg-pink-950/30",
    },
    {
      icon: "mdi:vector-triangle",
      label: "Total Aspects",
      value: `${aspectCount} connections`,
      gradient: "from-purple-400 to-indigo-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className={`${stat.bgColor} rounded-xl p-4 border border-slate-200/60 dark:border-slate-700/60 transition-transform hover:scale-[1.02]`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`w-10 h-10 rounded-lg bg-linear-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}
            >
              <Iconify icon={stat.icon} width={20} className="text-white" />
            </div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              {stat.label}
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}

// ============ PARTNER SELECTED CARD ============

function PartnerSelectedCard({
  partner,
  color,
}: {
  partner: Person;
  color: "blue" | "pink";
}) {
  const gradientColor =
    color === "blue"
      ? "from-blue-500 to-cyan-500"
      : "from-pink-500 to-rose-500";

  return (
    <div className="mt-4 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full bg-linear-to-br ${gradientColor} flex items-center justify-center`}
        >
          <span className="text-white font-bold text-sm">
            {partner.Name?.charAt(0)?.toUpperCase()}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-slate-900 dark:text-white truncate">
            {partner.Name}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
            {new Date(partner.BirthTime).toLocaleDateString()} •{" "}
            {partner.BirthLocation}
          </p>
        </div>
        <Iconify
          icon="mdi:check-circle"
          width={20}
          className="text-green-500 flex-shrink-0"
        />
      </div>
    </div>
  );
}

// ============ EMPTY STATE ============

function EmptyStateCard() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 p-12 text-center">
      <div className="max-w-md mx-auto">
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-linear-to-br from-pink-100 to-purple-100 dark:from-pink-950/50 dark:to-purple-950/50 flex items-center justify-center mx-auto">
            <Iconify
              icon="mdi:heart-multiple-outline"
              width={48}
              className="text-pink-400"
            />
          </div>
          <div className="absolute -inset-4 rounded-full bg-linear-to-br from-pink-500/10 to-purple-500/10 blur-xl"></div>
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Discover Your Compatibility
        </h3>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          Select two people above to reveal deep astrological insights about
          your relationship potential.
        </p>

        <div className="flex flex-wrap justify-center gap-2">
          {TABS.map((tab) => (
            <span
              key={tab.key}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300"
            >
              <Iconify icon={tab.icon} width={14} />
              {tab.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============ OVERVIEW TAB ============

function OverviewTab({
  partner1,
  partner2,
  synastry,
  composite,
  partners,
  karmaDestiny,
  romanticPersonality,
}: {
  partner1: Person | null;
  partner2: Person | null;
  synastry: any;
  composite: any;
  partners: any;
  karmaDestiny: any;
  romanticPersonality: any;
}) {
  return (
    <div className="space-y-8">
      {/* Partners Comparison Header */}
      <div className="flex items-center justify-center gap-6 py-6">
        <PartnerZodiacCircle
          partner={partner1}
          planets={synastry?.first}
          color="blue"
        />
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-linear-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-xl">
            <Iconify icon="mdi:heart" width={32} className="text-white" />
          </div>
          <div className="absolute -inset-2 rounded-full bg-pink-500/20 blur-lg animate-pulse"></div>
        </div>
        <PartnerZodiacCircle
          partner={partner2}
          planets={synastry?.second}
          color="pink"
        />
      </div>

      {/* Key Planets Comparison */}
      {synastry && (
        <DashboardSection
          title="Planetary Alignment"
          subtitle="How your key planets interact"
          icon="mdi:planet"
          iconColor="from-purple-500 to-indigo-500"
        >
          <ModernPlanetsComparison
            first={synastry.first}
            second={synastry.second}
            partner1Name={partner1?.Name || "Partner 1"}
            partner2Name={partner2?.Name || "Partner 2"}
          />
        </DashboardSection>
      )}

      {/* Composite Quick View */}
      {composite?.composite?.planets && (
        <DashboardSection
          title="Relationship Energy"
          subtitle="Your combined chart essence"
          icon="mdi:chart-arc"
          iconColor="from-cyan-500 to-blue-500"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Sun", "Moon", "Venus", "Mars"].map((planet) => {
              const p = composite.composite.planets?.find(
                (pl: any) => pl.name === planet,
              );
              if (!p) return null;
              const zodiac = ZODIAC_SIGNS[p.sign];
              const planetConfig = PLANETS_CONFIG[planet];

              return (
                <div
                  key={planet}
                  className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-700 rounded-xl p-4 border border-slate-200 dark:border-slate-600 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="text-2xl"
                      style={{ color: planetConfig?.color }}
                    >
                      {planetConfig?.symbol}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-slate-200 dark:bg-slate-600 rounded-full text-slate-600 dark:text-slate-300">
                      H{p.house}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                    {planet}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg" style={{ color: zodiac?.color }}>
                      {zodiac?.symbol}
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {p.sign}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </DashboardSection>
      )}

      {/* Key Aspects */}
      {synastry?.synastry?.aspects && (
        <DashboardSection
          title="Key Relationship Aspects"
          subtitle="Important planetary connections"
          icon="mdi:vector-intersection"
          iconColor="from-green-500 to-emerald-500"
        >
          <ModernAspectsGrid aspects={synastry.synastry.aspects} />
        </DashboardSection>
      )}

      {/* Karma Preview */}
      {karmaDestiny?.karma_destiny_report && !karmaDestiny.error && (
        <DashboardSection
          title="Karmic Connection"
          subtitle="Your soul-level bond"
          icon="mdi:infinity"
          iconColor="from-violet-500 to-purple-600"
        >
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 rounded-xl p-5 border border-purple-200 dark:border-purple-800">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {karmaDestiny.karma_destiny_report[0]?.substring(0, 300)}...
            </p>
            <button className="mt-3 text-purple-600 dark:text-purple-400 text-sm font-medium hover:underline inline-flex items-center gap-1">
              Read full analysis
              <Iconify icon="mdi:arrow-right" width={16} />
            </button>
          </div>
        </DashboardSection>
      )}
    </div>
  );
}

// ============ SYNASTRY TAB ============

function SynastryTab({
  synastry,
  partner1,
  partner2,
}: {
  synastry: any;
  partner1: Person | null;
  partner2: Person | null;
}) {
  const [showAllAspects, setShowAllAspects] = useState(false);

  if (!synastry) {
    return <NoDataMessage message="Synastry data not available" />;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
        <Iconify
          icon="mdi:information"
          width={20}
          className="text-blue-600 dark:text-blue-400"
        />
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Synastry compares both birth charts to reveal how your planets
          interact with each other.
        </p>
      </div>

      {/* Partner Charts Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ModernPlanetsCard
          title={`${partner1?.Name}'s Planets`}
          planets={synastry.first}
          color="blue"
        />
        <ModernPlanetsCard
          title={`${partner2?.Name}'s Planets`}
          planets={synastry.second}
          color="pink"
        />
      </div>

      {/* House Overlays */}
      {synastry.synastry?.house_1 && (
        <DashboardSection
          title="House Overlays"
          subtitle={`${partner1?.Name}'s planets in ${partner2?.Name}'s houses`}
          icon="mdi:home-group"
          iconColor="from-amber-500 to-orange-500"
        >
          <ModernHouseOverlay houses={synastry.synastry.house_1} />
        </DashboardSection>
      )}

      {/* Aspects */}
      {synastry.synastry?.aspects && (
        <DashboardSection
          title="Cross-Chart Aspects"
          subtitle={`${synastry.synastry.aspects.length} total connections`}
          icon="mdi:vector-polyline"
          iconColor="from-teal-500 to-cyan-500"
          action={
            <button
              onClick={() => setShowAllAspects(!showAllAspects)}
              className="text-sm text-pink-600 dark:text-pink-400 hover:underline"
            >
              {showAllAspects ? "Show Major Only" : "Show All"}
            </button>
          }
        >
          <ModernAspectsTable
            aspects={synastry.synastry.aspects}
            showAll={showAllAspects}
          />
        </DashboardSection>
      )}
    </div>
  );
}

// ============ COMPOSITE TAB ============

function CompositeTab({ composite }: { composite: any }) {
  if (!composite?.composite) {
    return <NoDataMessage message="Composite chart data not available" />;
  }

  const comp = composite.composite;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-800">
        <Iconify
          icon="mdi:information"
          width={20}
          className="text-purple-600 dark:text-purple-400"
        />
        <p className="text-sm text-purple-700 dark:text-purple-300">
          The composite chart represents your relationship as a single entity -
          the energy you create together.
        </p>
      </div>

      {/* Ascendant & Midheaven */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 rounded-xl p-5 border border-red-200 dark:border-red-800 text-center">
          <span
            className="text-3xl"
            style={{ color: PLANETS_CONFIG.Ascendant.color }}
          >
            {PLANETS_CONFIG.Ascendant.symbol}
          </span>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Ascendant
          </p>
          <p className="text-lg font-bold text-slate-900 dark:text-white">
            {comp.houses?.find((h: any) => h.house === 1)?.sign || "N/A"}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {comp.ascendant?.toFixed(2)}°
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-5 border border-blue-200 dark:border-blue-800 text-center">
          <span
            className="text-3xl"
            style={{ color: PLANETS_CONFIG.Midheaven.color }}
          >
            {PLANETS_CONFIG.Midheaven.symbol}
          </span>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Midheaven
          </p>
          <p className="text-lg font-bold text-slate-900 dark:text-white">
            {comp.houses?.find((h: any) => h.house === 10)?.sign || "N/A"}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {comp.midheaven?.toFixed(2)}°
          </p>
        </div>
      </div>

      {/* Composite Planets */}
      <DashboardSection
        title="Composite Planets"
        subtitle="Your combined planetary positions"
        icon="mdi:planet"
        iconColor="from-violet-500 to-purple-500"
      >
        <ModernPlanetsTable planets={comp.planets} />
      </DashboardSection>

      {/* Houses */}
      {comp.houses && (
        <DashboardSection
          title="Composite Houses"
          subtitle="Areas of life for your relationship"
          icon="mdi:home-group"
          iconColor="from-emerald-500 to-green-500"
        >
          <ModernHousesGrid houses={comp.houses} />
        </DashboardSection>
      )}

      {/* Aspects */}
      {comp.aspects && (
        <DashboardSection
          title="Composite Aspects"
          subtitle="Internal relationship dynamics"
          icon="mdi:vector-triangle"
          iconColor="from-cyan-500 to-teal-500"
        >
          <ModernCompositeAspects aspects={comp.aspects} />
        </DashboardSection>
      )}
    </div>
  );
}

// ============ KARMA DESTINY TAB ============

function KarmaDestinyTab({ data }: { data: any }) {
  if (!data || data.error) {
    return <NoDataMessage message="Karma & Destiny data not available" />;
  }

  const reports = data.karma_destiny_report || [];
  const karmaTitles = [
    {
      title: "Hidden Dynamics",
      icon: "mdi:eye-off",
      color: "from-purple-500 to-violet-600",
    },
    {
      title: "Past-Life Connection",
      icon: "mdi:history",
      color: "from-indigo-500 to-blue-600",
    },
    {
      title: "Soul Growth Path",
      icon: "mdi:trending-up",
      color: "from-teal-500 to-emerald-600",
    },
    {
      title: "Trust & Freedom",
      icon: "mdi:key-chain",
      color: "from-amber-500 to-orange-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 p-4 bg-violet-50 dark:bg-violet-950/30 rounded-xl border border-violet-200 dark:border-violet-800">
        <Iconify
          icon="mdi:sparkles"
          width={20}
          className="text-violet-600 dark:text-violet-400"
        />
        <p className="text-sm text-violet-700 dark:text-violet-300">
          Discover the deeper karmic patterns and destiny connections in your
          relationship.
        </p>
      </div>

      {reports.length > 0 ? (
        <div className="space-y-4">
          {reports.map((report: string, idx: number) => (
            <ModernKarmaCard
              key={idx}
              report={report}
              index={idx}
              title={karmaTitles[idx]?.title || `Insight ${idx + 1}`}
              icon={karmaTitles[idx]?.icon || "mdi:star"}
              gradient={
                karmaTitles[idx]?.color || "from-purple-500 to-indigo-500"
              }
            />
          ))}
        </div>
      ) : (
        <NoDataMessage message="No karma insights available" />
      )}

      {reports.length > 0 && (
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl p-5 text-white">
          <div className="flex items-start gap-3">
            <Iconify icon="mdi:lightbulb-on" width={24} />
            <div>
              <h4 className="font-semibold mb-1">Key Takeaway</h4>
              <p className="text-white/90 text-sm">
                Your karmic connection reveals {reports.length} significant
                areas of soul growth. These patterns indicate a relationship
                with deep spiritual purpose.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============ FRIENDSHIP FORECAST TAB ============

function FriendshipForecastTab({ data }: { data: any }) {
  if (!data || data.error) {
    return <NoDataMessage message="Friendship forecast data not available" />;
  }

  const forecasts = data.friendship_report || [];

  const forecastMeta = [
    {
      title: "Creative Connection",
      icon: "mdi:palette",
      color: "from-pink-500 to-rose-500",
    },
    {
      title: "Growth Challenges",
      icon: "mdi:trending-up",
      color: "from-orange-500 to-amber-500",
    },
    {
      title: "Communication",
      icon: "mdi:message-text",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Shared Learning",
      icon: "mdi:school",
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Mystery & Depth",
      icon: "mdi:water",
      color: "from-violet-500 to-purple-500",
    },
    {
      title: "Emotional Dynamics",
      icon: "mdi:heart-pulse",
      color: "from-red-500 to-pink-500",
    },
    {
      title: "Practical Balance",
      icon: "mdi:scale-balance",
      color: "from-teal-500 to-cyan-500",
    },
    {
      title: "Creative Partnership",
      icon: "mdi:brush",
      color: "from-amber-500 to-yellow-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 p-4 bg-pink-50 dark:bg-pink-950/30 rounded-xl border border-pink-200 dark:border-pink-800">
        <Iconify
          icon="mdi:account-group"
          width={20}
          className="text-pink-600 dark:text-pink-400"
        />
        <p className="text-sm text-pink-700 dark:text-pink-300">
          Discover how your energies complement each other in friendship and
          collaboration.
        </p>
      </div>

      {forecasts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {forecasts.map((forecast: string, idx: number) => (
            <ModernForecastCard
              key={idx}
              forecast={forecast}
              index={idx}
              title={forecastMeta[idx]?.title || `Insight ${idx + 1}`}
              icon={forecastMeta[idx]?.icon || "mdi:star"}
              gradient={forecastMeta[idx]?.color || "from-pink-500 to-rose-500"}
            />
          ))}
        </div>
      ) : (
        <NoDataMessage message="No forecast data available" />
      )}
    </div>
  );
}

// ============ ROMANTIC PERSONALITY TAB ============

function RomanticPersonalityTab({
  data,
  partner1,
}: {
  data: any;
  partner1: Person | null;
}) {
  if (!data || data.error) {
    return <NoDataMessage message="Romantic personality data not available" />;
  }

  const reports = data.report || [];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-2xl font-bold">
              {partner1?.Name?.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-bold">
              {partner1?.Name}'s Love Profile
            </h3>
            <p className="text-white/80">
              Romantic personality based on natal chart
            </p>
          </div>
        </div>
      </div>

      {reports.length > 0 ? (
        <div className="space-y-4">
          {reports.map((report: string, idx: number) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <Iconify icon="mdi:heart" width={20} className="text-white" />
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {report}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <NoDataMessage message="No romantic personality insights available" />
      )}

      {reports.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <Iconify
              icon="mdi:star-shooting"
              width={24}
              className="text-amber-600 dark:text-amber-400 flex-shrink-0"
            />
            <div>
              <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-1">
                Relationship Summary
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                {partner1?.Name} brings {reports.length} unique romantic
                qualities to relationships. Understanding these traits fosters
                deeper connection and harmony.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============ REUSABLE COMPONENTS ============

function DashboardSection({
  title,
  subtitle,
  icon,
  iconColor,
  children,
  action,
}: {
  title: string;
  subtitle?: string;
  icon: string;
  iconColor: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${iconColor} flex items-center justify-center shadow-lg`}
          >
            <Iconify icon={icon} width={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function PartnerZodiacCircle({
  partner,
  planets,
  color,
}: {
  partner: Person | null;
  planets: any[] | null;
  color: "blue" | "pink";
}) {
  const sunSign = planets?.find((p) => p.name === "Sun")?.sign;
  const zodiacData = sunSign ? ZODIAC_SIGNS[sunSign] : null;
  const gradient =
    color === "blue"
      ? "from-blue-500 to-cyan-500"
      : "from-pink-500 to-rose-500";

  return (
    <div className="text-center">
      <div
        className={`w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br ${gradient} p-1 shadow-xl`}
      >
        <div className="w-full h-full rounded-full bg-white dark:bg-slate-800 flex flex-col items-center justify-center">
          {zodiacData ? (
            <span className="text-4xl" style={{ color: zodiacData.color }}>
              {zodiacData.symbol}
            </span>
          ) : (
            <Iconify icon="mdi:account" width={40} className="text-slate-400" />
          )}
        </div>
      </div>
      <p className="font-semibold text-slate-900 dark:text-white mt-3">
        {partner?.Name}
      </p>
      {sunSign && (
        <p className="text-sm text-slate-500 dark:text-slate-400">{sunSign}</p>
      )}
    </div>
  );
}

function ModernPlanetsComparison({
  first,
  second,
  partner1Name,
  partner2Name,
}: {
  first: any[];
  second: any[];
  partner1Name: string;
  partner2Name: string;
}) {
  const keyPlanets = ["Sun", "Moon", "Venus", "Mars", "Mercury", "Jupiter"];

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            <th className="text-left py-3 px-4 font-semibold text-slate-500 dark:text-slate-400">
              Planet
            </th>
            <th className="text-left py-3 px-4 font-semibold text-blue-600 dark:text-blue-400">
              {partner1Name}
            </th>
            <th className="text-left py-3 px-4 font-semibold text-pink-600 dark:text-pink-400">
              {partner2Name}
            </th>
          </tr>
        </thead>
        <tbody>
          {keyPlanets.map((planetName) => {
            const p1 = first?.find((p) => p.name === planetName);
            const p2 = second?.find((p) => p.name === planetName);
            const planetConfig = PLANETS_CONFIG[planetName];

            return (
              <tr
                key={planetName}
                className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xl"
                      style={{ color: planetConfig?.color }}
                    >
                      {planetConfig?.symbol}
                    </span>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {planetName}
                      </p>
                      <p className="text-xs text-slate-400">
                        {planetConfig?.label}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  {p1 && (
                    <div className="flex items-center gap-2">
                      <span
                        className="text-lg"
                        style={{ color: ZODIAC_SIGNS[p1.sign]?.color }}
                      >
                        {ZODIAC_SIGNS[p1.sign]?.symbol}
                      </span>
                      <div>
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {p1.sign}
                        </span>
                        <span className="text-xs text-slate-400 ml-1">
                          H{p1.house}
                        </span>
                      </div>
                    </div>
                  )}
                </td>
                <td className="py-3 px-4">
                  {p2 && (
                    <div className="flex items-center gap-2">
                      <span
                        className="text-lg"
                        style={{ color: ZODIAC_SIGNS[p2.sign]?.color }}
                      >
                        {ZODIAC_SIGNS[p2.sign]?.symbol}
                      </span>
                      <div>
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {p2.sign}
                        </span>
                        <span className="text-xs text-slate-400 ml-1">
                          H{p2.house}
                        </span>
                      </div>
                    </div>
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

function ModernPlanetsCard({
  title,
  planets,
  color,
}: {
  title: string;
  planets: any[];
  color: "blue" | "pink";
}) {
  const gradient =
    color === "blue"
      ? "from-blue-500 to-cyan-500"
      : "from-pink-500 to-rose-500";
  const bgColor =
    color === "blue"
      ? "bg-blue-50 dark:bg-blue-950/30"
      : "bg-pink-50 dark:bg-pink-950/30";

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div
        className={`px-4 py-3 ${bgColor} border-b border-slate-200 dark:border-slate-700`}
      >
        <h4 className="font-semibold text-slate-900 dark:text-white">
          {title}
        </h4>
      </div>
      <div className="p-4">
        <ModernPlanetsTable planets={planets} />
      </div>
    </div>
  );
}

function ModernPlanetsTable({ planets }: { planets: any[] }) {
  if (!planets || planets.length === 0) {
    return <p className="text-center text-slate-400 py-4">No data</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            <th className="text-left py-2 px-3 font-semibold text-slate-500 dark:text-slate-400">
              Planet
            </th>
            <th className="text-left py-2 px-3 font-semibold text-slate-500 dark:text-slate-400">
              Sign
            </th>
            <th className="text-left py-2 px-3 font-semibold text-slate-500 dark:text-slate-400">
              Deg
            </th>
            <th className="text-center py-2 px-3 font-semibold text-slate-500 dark:text-slate-400">
              H
            </th>
            <th className="text-center py-2 px-3 font-semibold text-slate-500 dark:text-slate-400">
              R
            </th>
          </tr>
        </thead>
        <tbody>
          {planets.map((planet: any, idx: number) => {
            const config = PLANETS_CONFIG[planet.name];
            const zodiac = ZODIAC_SIGNS[planet.sign];
            const isRetro =
              planet.is_retro === "true" || planet.is_retro === true;

            return (
              <tr
                key={idx}
                className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <td className="py-2 px-3">
                  <div className="flex items-center gap-2">
                    <span style={{ color: config?.color }}>
                      {config?.symbol || "•"}
                    </span>
                    <span className="text-slate-700 dark:text-slate-300">
                      {planet.name}
                    </span>
                  </div>
                </td>
                <td className="py-2 px-3">
                  <div className="flex items-center gap-1">
                    <span style={{ color: zodiac?.color }}>
                      {zodiac?.symbol}
                    </span>
                    <span className="text-slate-700 dark:text-slate-300">
                      {planet.sign}
                    </span>
                  </div>
                </td>
                <td className="py-2 px-3 text-slate-500 dark:text-slate-400">
                  {(planet.norm_degree || planet.full_degree)?.toFixed(1)}°
                </td>
                <td className="py-2 px-3 text-center text-slate-500 dark:text-slate-400">
                  {planet.house}
                </td>
                <td className="py-2 px-3 text-center">
                  {isRetro && <span className="text-red-500 font-bold">R</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ModernAspectsGrid({ aspects }: { aspects: any[] }) {
  const importantAspects = aspects
    .filter((a) => ASPECT_CONFIG[a.type]?.type === "major" && a.orb < 5)
    .slice(0, 6);

  if (importantAspects.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {importantAspects.map((aspect: any, idx: number) => {
        const aspectConfig = ASPECT_CONFIG[aspect.type];
        const isHarmonious = ["Trine", "Sextile", "Conjunction"].includes(
          aspect.type,
        );

        return (
          <div
            key={idx}
            className={`rounded-xl p-4 border ${
              isHarmonious
                ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
                : "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl" style={{ color: aspectConfig?.color }}>
                {aspectConfig?.symbol}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  isHarmonious
                    ? "bg-green-200 text-green-700"
                    : "bg-orange-200 text-orange-700"
                }`}
              >
                {aspectConfig?.meaning}
              </span>
            </div>
            <p className="font-medium text-slate-900 dark:text-white text-sm">
              {aspect.first} {aspectConfig?.symbol} {aspect.second}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {aspect.type} • Orb: {aspect.orb?.toFixed(1)}°
            </p>
          </div>
        );
      })}
    </div>
  );
}

function ModernAspectsTable({
  aspects,
  showAll,
}: {
  aspects: any[];
  showAll: boolean;
}) {
  if (!aspects || aspects.length === 0) return null;

  const filteredAspects = showAll
    ? aspects
    : aspects.filter(
        (a) => ASPECT_CONFIG[a.type]?.type === "major" && a.orb < 8,
      );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            <th className="text-left py-3 px-4 font-semibold text-slate-500 dark:text-slate-400">
              Planet 1
            </th>
            <th className="text-center py-3 px-4 font-semibold text-slate-500 dark:text-slate-400">
              Aspect
            </th>
            <th className="text-left py-3 px-4 font-semibold text-slate-500 dark:text-slate-400">
              Planet 2
            </th>
            <th className="text-left py-3 px-4 font-semibold text-slate-500 dark:text-slate-400">
              Orb
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredAspects
            .slice(0, showAll ? 100 : 15)
            .map((aspect: any, idx: number) => {
              const aspectConfig = ASPECT_CONFIG[aspect.type];
              const p1Config = PLANETS_CONFIG[aspect.first];
              const p2Config = PLANETS_CONFIG[aspect.second];
              const isHarmonious = ["Trine", "Sextile", "Conjunction"].includes(
                aspect.type,
              );

              return (
                <tr
                  key={idx}
                  className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span style={{ color: p1Config?.color }}>
                        {p1Config?.symbol || "•"}
                      </span>
                      <span className="text-slate-700 dark:text-slate-300">
                        {aspect.first}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
                        isHarmonious
                          ? "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300"
                          : "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300"
                      }`}
                    >
                      <span style={{ color: aspectConfig?.color }}>
                        {aspectConfig?.symbol}
                      </span>
                      {aspect.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span style={{ color: p2Config?.color }}>
                        {p2Config?.symbol || "•"}
                      </span>
                      <span className="text-slate-700 dark:text-slate-300">
                        {aspect.second}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                    {aspect.orb?.toFixed(2)}°
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

function ModernHouseOverlay({ houses }: { houses: any[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {houses.map((item: any, idx: number) => {
        const config = PLANETS_CONFIG[item.name];
        return (
          <div
            key={idx}
            className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700 text-center hover:shadow-md transition-all"
          >
            <span className="text-xl" style={{ color: config?.color }}>
              {config?.symbol || "•"}
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {item.name}
            </p>
            <p className="font-semibold text-slate-900 dark:text-white text-sm mt-1">
              House {item.synastry_house}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function ModernHousesGrid({ houses }: { houses: any[] }) {
  if (!houses || houses.length === 0) return null;

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {houses.map((house: any, idx: number) => {
        const zodiac = ZODIAC_SIGNS[house.sign];
        return (
          <div
            key={idx}
            className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-700 rounded-xl p-3 border border-slate-200 dark:border-slate-600 text-center hover:shadow-lg transition-all"
          >
            <span className="text-xs font-bold text-slate-400">
              House {house.house}
            </span>
            <div className="my-2">
              <span className="text-2xl" style={{ color: zodiac?.color }}>
                {zodiac?.symbol}
              </span>
            </div>
            <p className="font-medium text-slate-900 dark:text-white text-sm">
              {house.sign}
            </p>
            <p className="text-xs text-slate-400">
              {house.degree?.toFixed(1)}°
            </p>
          </div>
        );
      })}
    </div>
  );
}

function ModernCompositeAspects({ aspects }: { aspects: any[] }) {
  const majorAspects = aspects
    .filter((a) => ASPECT_CONFIG[a.type]?.type === "major")
    .slice(0, 12);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {majorAspects.map((aspect: any, idx: number) => {
        const aspectConfig = ASPECT_CONFIG[aspect.type];
        const p1Config = PLANETS_CONFIG[aspect.aspecting_planet];
        const p2Config = PLANETS_CONFIG[aspect.aspected_planet];
        const isHarmonious = ["Trine", "Sextile", "Conjunction"].includes(
          aspect.type,
        );

        return (
          <div
            key={idx}
            className={`rounded-lg p-3 border flex items-center gap-3 ${
              isHarmonious
                ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
                : "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800"
            }`}
          >
            <span className="text-xl" style={{ color: p1Config?.color }}>
              {p1Config?.symbol}
            </span>
            <span className="text-lg" style={{ color: aspectConfig?.color }}>
              {aspectConfig?.symbol}
            </span>
            <span className="text-xl" style={{ color: p2Config?.color }}>
              {p2Config?.symbol}
            </span>
            <div className="ml-auto text-right">
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {aspect.type}
              </p>
              <p className="text-xs text-slate-500">
                {aspect.orb?.toFixed(1)}°
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ModernKarmaCard({
  report,
  index,
  title,
  icon,
  gradient,
}: {
  report: string;
  index: number;
  title: string;
  icon: string;
  gradient: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const isLong = report.length > 200;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all">
      <div
        className="p-4 flex items-center justify-between cursor-pointer"
        onClick={() => isLong && setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center`}
          >
            <Iconify icon={icon} width={20} className="text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white">
              {title}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Insight {index + 1}
            </p>
          </div>
        </div>
        {isLong && (
          <Iconify
            icon={expanded ? "mdi:chevron-up" : "mdi:chevron-down"}
            width={20}
            className="text-slate-400"
          />
        )}
      </div>
      <div className="px-4 pb-4">
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {expanded || !isLong ? report : report.substring(0, 200) + "..."}
        </p>
      </div>
    </div>
  );
}

function ModernForecastCard({
  forecast,
  index,
  title,
  icon,
  gradient,
}: {
  forecast: string;
  index: number;
  title: string;
  icon: string;
  gradient: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const isLong = forecast.length > 150;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all">
      <div
        className="p-4 flex items-center justify-between cursor-pointer"
        onClick={() => isLong && setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center`}
          >
            <Iconify icon={icon} width={20} className="text-white" />
          </div>
          <h4 className="font-semibold text-slate-900 dark:text-white">
            {title}
          </h4>
        </div>
        {isLong && (
          <Iconify
            icon={expanded ? "mdi:chevron-up" : "mdi:chevron-down"}
            width={20}
            className="text-slate-400"
          />
        )}
      </div>
      <div className="px-4 pb-4">
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {expanded || !isLong ? forecast : forecast.substring(0, 150) + "..."}
        </p>
      </div>
    </div>
  );
}

function NoDataMessage({ message }: { message: string }) {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
        <Iconify
          icon="mdi:database-off"
          width={32}
          className="text-slate-400"
        />
      </div>
      <p className="text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  );
}

// Utility
function capitalize(str: string | undefined): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export default LoveCompatibilityPage;
