"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Iconify from "@/src/components/Iconify";
import AstroLoader from "@/src/components/ui/AstroLoader";
import { getUser } from "@/src/lib/auth";

// --- Zodiac Data ---
const ZODIAC_SIGNS = [
  {
    name: "aries",
    label: "Aries",
    date: "Mar 21 - Apr 19",
    element: "Fire",
    icon: "mdi:zodiac-aries",
  },
  {
    name: "taurus",
    label: "Taurus",
    date: "Apr 20 - May 20",
    element: "Earth",
    icon: "mdi:zodiac-taurus",
  },
  {
    name: "gemini",
    label: "Gemini",
    date: "May 21 - Jun 20",
    element: "Air",
    icon: "mdi:zodiac-gemini",
  },
  {
    name: "cancer",
    label: "Cancer",
    date: "Jun 21 - Jul 22",
    element: "Water",
    icon: "mdi:zodiac-cancer",
  },
  {
    name: "leo",
    label: "Leo",
    date: "Jul 23 - Aug 22",
    element: "Fire",
    icon: "mdi:zodiac-leo",
  },
  {
    name: "virgo",
    label: "Virgo",
    date: "Aug 23 - Sep 22",
    element: "Earth",
    icon: "mdi:zodiac-virgo",
  },
  {
    name: "libra",
    label: "Libra",
    date: "Sep 23 - Oct 22",
    element: "Air",
    icon: "mdi:zodiac-libra",
  },
  {
    name: "scorpio",
    label: "Scorpio",
    date: "Oct 23 - Nov 21",
    element: "Water",
    icon: "mdi:zodiac-scorpio",
  },
  {
    name: "sagittarius",
    label: "Sagittarius",
    date: "Nov 22 - Dec 21",
    element: "Fire",
    icon: "mdi:zodiac-sagittarius",
  },
  {
    name: "capricorn",
    label: "Capricorn",
    date: "Dec 22 - Jan 19",
    element: "Earth",
    icon: "mdi:zodiac-capricorn",
  },
  {
    name: "aquarius",
    label: "Aquarius",
    date: "Jan 20 - Feb 18",
    element: "Air",
    icon: "mdi:zodiac-aquarius",
  },
  {
    name: "pisces",
    label: "Pisces",
    date: "Feb 19 - Mar 20",
    element: "Water",
    icon: "mdi:zodiac-pisces",
  },
];

const ELEMENT_COLORS = {
  Fire: {
    bg: "bg-red-500/10",
    text: "text-red-500",
    border: "border-red-500/20",
    gradient: "from-red-500 to-orange-500",
  },
  Earth: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-500",
    border: "border-emerald-500/20",
    gradient: "from-emerald-500 to-teal-500",
  },
  Air: {
    bg: "bg-sky-500/10",
    text: "text-sky-500",
    border: "border-sky-500/20",
    gradient: "from-sky-500 to-blue-500",
  },
  Water: {
    bg: "bg-blue-500/10",
    text: "text-blue-500",
    border: "border-blue-500/20",
    gradient: "from-blue-500 to-indigo-500",
  },
};

// --- Types ---
interface NormalizedPrediction {
  personal_life: string | null;
  profession: string | null;
  health: string | null;
  emotions: string | null;
  travel: string | null;
  luck: string | null;
  prediction: string | null;
  personal_life_rating: number | null;
  profession_rating: number | null;
  health_rating: number | null;
  emotions_rating: number | null;
  travel_rating: number | null;
  luck_rating: number | null;
}

interface PredictionsData {
  yesterday: NormalizedPrediction | null;
  today: NormalizedPrediction | null;
  tomorrow: NormalizedPrediction | null;
}

// --- Section Config ---
const SECTIONS = [
  {
    key: "personal_life",
    ratingKey: "personal_life_rating",
    label: "Personal Life",
    icon: "solar:heart-bold-duotone",
    gradient: "from-pink-500 to-rose-500",
    bg: "bg-pink-500/10",
    text: "text-pink-500",
  },
  {
    key: "profession",
    ratingKey: "profession_rating",
    label: "Profession",
    icon: "solar:case-bold-duotone",
    gradient: "from-blue-500 to-indigo-500",
    bg: "bg-blue-500/10",
    text: "text-blue-500",
  },
  {
    key: "health",
    ratingKey: "health_rating",
    label: "Health",
    icon: "solar:health-bold-duotone",
    gradient: "from-green-500 to-emerald-500",
    bg: "bg-green-500/10",
    text: "text-green-500",
  },
  {
    key: "emotions",
    ratingKey: "emotions_rating",
    label: "Emotions",
    icon: "solar:emoji-funny-circle-bold-duotone",
    gradient: "from-purple-500 to-violet-500",
    bg: "bg-purple-500/10",
    text: "text-purple-500",
  },
  {
    key: "travel",
    ratingKey: "travel_rating",
    label: "Travel",
    icon: "solar:airplane-bold-duotone",
    gradient: "from-amber-500 to-orange-500",
    bg: "bg-amber-500/10",
    text: "text-amber-500",
  },
  {
    key: "luck",
    ratingKey: "luck_rating",
    label: "Luck",
    icon: "solar:star-bold-duotone",
    gradient: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-500/10",
    text: "text-emerald-500",
  },
] as const;

// --- Rating Component ---
const RatingBar = ({
  rating,
  label,
}: {
  rating: number | null;
  label?: string;
}) => {
  if (!rating) return null;

  const getColor = (value: number) => {
    if (value >= 8) return "from-green-500 to-emerald-500";
    if (value >= 5) return "from-amber-500 to-orange-500";
    return "from-red-500 to-rose-500";
  };

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-muted-foreground">
          {label || "Rating"}
        </span>
        <span className="text-xs font-semibold text-foreground">
          {rating}/10
        </span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${rating * 10}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full bg-gradient-to-r ${getColor(rating)} rounded-full`}
        />
      </div>
    </div>
  );
};

// --- Main Page Component ---
export default function DailyHoroscopePage() {
  const [selectedSign, setSelectedSign] = useState<string>("aries");
  const [activeTab, setActiveTab] = useState<
    "yesterday" | "today" | "tomorrow"
  >("today");
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState<PredictionsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState(getUser());
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setUser(getUser());
    setMounted(true);
  }, []);

  const selectedZodiac = ZODIAC_SIGNS.find((z) => z.name === selectedSign)!;
  const elementColor =
    ELEMENT_COLORS[selectedZodiac.element as keyof typeof ELEMENT_COLORS];
  useEffect(() => {
    if (!mounted) return;

    const authToken = user?.token;
    const apiKey = (user as any)?.userApiKey || (user as any)?.apikey || "";

    const fetchHoroscope = async () => {
      setLoading(true);
      setError(null);
      setPredictions(null);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_NEXT_JS_API_URL}/api/daily-horoscope`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken || ""}`,
              "X-API-KEY": apiKey || "",
            },
            body: JSON.stringify({
              sign: selectedSign,
              timezone: 5.5,
            }),
          },
        );

        const result = await res.json();

        if (result.success) {
          setPredictions(result.data.predictions);
        } else {
          setError(result.error || "Failed to fetch horoscope");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchHoroscope();
  }, [selectedSign, mounted, user?.token]);

  const tabs = [
    {
      id: "yesterday",
      label: "Yesterday",
      icon: "solar:moon-bold-duotone",
      desc: "Past insights",
    },
    {
      id: "today",
      label: "Today",
      icon: "solar:sun-bold-duotone",
      desc: "Current energies",
    },
    {
      id: "tomorrow",
      label: "Tomorrow",
      icon: "solar:calendar-bold-duotone",
      desc: "Future outlook",
    },
  ] as const;

  const currentPrediction = predictions ? predictions[activeTab] : null;

  // Calculate overall rating average
  const getOverallRating = (pred: NormalizedPrediction | null) => {
    if (!pred) return null;
    const ratings = [
      pred.personal_life_rating,
      pred.profession_rating,
      pred.health_rating,
      pred.emotions_rating,
      pred.travel_rating,
      pred.luck_rating,
    ].filter((r) => r !== null) as number[];
    if (ratings.length === 0) return null;
    return (
      Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) /
      10
    );
  };

  const overallRating = getOverallRating(currentPrediction);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-2xl p-6 md:p-8 text-white shadow-xl"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
            {/* Decorative stars */}
            <Iconify
              icon="solar:stars-bold"
              width={120}
              className="absolute top-4 right-8 opacity-20"
            />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Iconify icon="solar:sun-bold-duotone" width={40} height={40} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium">
                    Daily Insights
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Daily Horoscope
                </h1>
                <p className="text-white/80 mt-1">
                  Discover what the stars have in store for you
                </p>
              </div>
            </div>

            {/* Current Date */}
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/20">
              <Iconify
                icon="solar:calendar-bold-duotone"
                width={24}
                height={24}
              />
              <div>
                <p className="text-sm text-white/70">Today</p>
                <p className="font-semibold">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Layout */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Zodiac Selector - Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-card rounded-2xl border border-border shadow-sm p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Iconify
                    icon="solar:star-ring-bold-duotone"
                    width={20}
                    height={20}
                    className="text-primary"
                  />
                </div>
                <h2 className="font-semibold text-foreground">
                  Select Your Sign
                </h2>
              </div>

              <div className="grid grid-cols-3 lg:grid-cols-2 gap-2">
                {ZODIAC_SIGNS.map((sign) => {
                  const isSelected = selectedSign === sign.name;
                  const colors =
                    ELEMENT_COLORS[sign.element as keyof typeof ELEMENT_COLORS];

                  return (
                    <motion.button
                      key={sign.name}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedSign(sign.name)}
                      className={`relative p-3 rounded-xl transition-all duration-200 text-center group ${
                        isSelected
                          ? `bg-gradient-to-br ${colors.gradient} text-white shadow-lg`
                          : "bg-muted/50 hover:bg-muted text-foreground"
                      }`}
                    >
                      <Iconify
                        icon={sign.icon}
                        width={28}
                        height={28}
                        className={`mx-auto mb-1 ${isSelected ? "text-white" : colors.text}`}
                      />
                      <p
                        className={`text-xs font-medium ${isSelected ? "text-white" : "text-foreground"}`}
                      >
                        {sign.label}
                      </p>
                      {isSelected && (
                        <motion.div
                          layoutId="selectedIndicator"
                          className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full shadow-md"
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Element Info Card */}
            <div
              className={`bg-card rounded-2xl border border-border shadow-sm p-4 ${elementColor.bg}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-xl ${elementColor.bg}`}>
                  <Iconify
                    icon={
                      selectedZodiac.element === "Fire"
                        ? "noto:fire"
                        : selectedZodiac.element === "Earth"
                          ? "noto:globe-showing-americas"
                          : selectedZodiac.element === "Air"
                            ? "noto:wind-face"
                            : "noto:water-wave"
                    }
                    width={24}
                    height={24}
                  />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Element</p>
                  <p className={`font-semibold ${elementColor.text}`}>
                    {selectedZodiac.element}
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedZodiac.element === "Fire" &&
                  "Passionate, dynamic, and temperamental"}
                {selectedZodiac.element === "Earth" &&
                  "Grounded, practical, and dependable"}
                {selectedZodiac.element === "Air" &&
                  "Intellectual, social, and communicative"}
                {selectedZodiac.element === "Water" &&
                  "Intuitive, emotional, and sensitive"}
              </p>
            </div>

            {/* Quick Stats */}
            {overallRating && (
              <div className="bg-card rounded-2xl border border-border shadow-sm p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Overall Energy
                </h3>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="none"
                        className="text-muted"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="url(#ratingGradient)"
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={`${overallRating * 17.6} 176`}
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient
                          id="ratingGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop offset="0%" stopColor="#f97316" />
                          <stop offset="100%" stopColor="#eab308" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-foreground">
                        {overallRating}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {overallRating >= 8
                        ? "Excellent"
                        : overallRating >= 6
                          ? "Good"
                          : overallRating >= 4
                            ? "Mixed"
                            : "Challenging"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {tabs.find((t) => t.id === activeTab)?.label}'s forecast
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Selected Sign Header */}
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div
                className={`bg-gradient-to-r ${elementColor.gradient} p-6 text-white`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                      <Iconify
                        icon={selectedZodiac.icon}
                        width={48}
                        height={48}
                      />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold">
                        {selectedZodiac.label}
                      </h2>
                      <p className="text-white/80 flex items-center gap-2 mt-1">
                        <Iconify
                          icon="solar:calendar-linear"
                          width={16}
                          height={16}
                        />
                        {selectedZodiac.date}
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:block text-right">
                    <p className="text-white/70 text-sm">Element</p>
                    <p className="font-semibold text-lg">
                      {selectedZodiac.element}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex border-b border-border bg-muted/30 p-2 gap-2">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-300 ${
                        isActive
                          ? "bg-card text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      <Iconify
                        icon={tab.icon}
                        width={20}
                        height={20}
                        className={isActive ? "text-orange-500" : ""}
                      />
                      <span className="hidden sm:inline">{tab.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-4 right-4 h-0.5 bg-orange-500 rounded-full"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Prediction Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedSign}-${activeTab}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {loading ? (
                  <div className="bg-card rounded-2xl border border-border shadow-sm p-12 flex flex-col items-center justify-center min-h-[400px]">
                    <AstroLoader />
                    <p className="mt-4 text-muted-foreground">
                      Reading the stars...
                    </p>
                  </div>
                ) : error ? (
                  <div className="bg-card rounded-2xl border border-border shadow-sm p-8">
                    <div className="flex items-center gap-4 p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                      <div className="p-3 bg-red-500/20 rounded-xl">
                        <Iconify
                          icon="solar:danger-triangle-bold-duotone"
                          width={24}
                          height={24}
                          className="text-red-500"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-red-600 dark:text-red-400">
                          Error Loading Horoscope
                        </p>
                        <p className="text-sm text-red-500/80">{error}</p>
                      </div>
                    </div>
                  </div>
                ) : currentPrediction ? (
                  <PredictionDisplay data={currentPrediction} />
                ) : (
                  <div className="bg-card rounded-2xl border border-border shadow-sm p-12 text-center">
                    <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center mb-6">
                      <Iconify
                        icon="solar:star-bold-duotone"
                        width={40}
                        height={40}
                        className="text-muted-foreground"
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      No Data Available
                    </h3>
                    <p className="text-muted-foreground">
                      Prediction data for this period is not available yet.
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Action Footer */}
            <div className="bg-card rounded-2xl border border-border shadow-sm p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Iconify
                    icon="solar:calendar-mark-bold-duotone"
                    width={20}
                    height={20}
                    className="text-primary"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Want more insights for{" "}
                  <span className="font-medium text-foreground">
                    {selectedZodiac.label}
                  </span>
                  ?
                </p>
              </div>
              <div className="flex gap-2">
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-xl text-sm font-medium transition-colors">
                  <Iconify icon="solar:calendar-bold" width={18} height={18} />
                  Weekly Forecast
                </button>
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-medium transition-colors">
                  <Iconify icon="solar:share-bold" width={18} height={18} />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Prediction Display Component ---
function PredictionDisplay({ data }: { data: NormalizedPrediction }) {
  const isPlainPrediction =
    data.prediction && !data.personal_life && !data.profession && !data.health;

  if (isPlainPrediction) {
    return (
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Iconify
                icon="solar:star-bold-duotone"
                width={24}
                height={24}
                className="text-white"
              />
            </div>
            <h3 className="font-semibold text-white text-lg">
              Daily Prediction
            </h3>
          </div>
        </div>
        <div className="p-6">
          <p className="text-lg leading-relaxed text-foreground/80">
            {data.prediction}
          </p>
        </div>
      </div>
    );
  }

  const availableSections = SECTIONS.filter(
    (section) => data[section.key as keyof NormalizedPrediction],
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availableSections.map((section, index) => {
          const content = data[
            section.key as keyof NormalizedPrediction
          ] as string;
          const rating = data[
            section.ratingKey as keyof NormalizedPrediction
          ] as number | null;

          return (
            <motion.div
              key={section.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className={`bg-gradient-to-r ${section.gradient} px-4 py-3`}>
                <div className="flex items-center gap-2">
                  <Iconify
                    icon={section.icon}
                    width={20}
                    height={20}
                    className="text-white"
                  />
                  <h4 className="font-semibold text-white">{section.label}</h4>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {content}
                </p>
                <RatingBar rating={rating} label="Energy Level" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {availableSections.length === 0 && (
        <div className="bg-card rounded-2xl border border-border shadow-sm p-8 text-center">
          <Iconify
            icon="solar:ghost-bold-duotone"
            width={48}
            height={48}
            className="mx-auto text-muted-foreground/50 mb-4"
          />
          <p className="text-muted-foreground">
            No detailed predictions available for this day.
          </p>
        </div>
      )}

      {/* Summary Card */}
      {availableSections.length > 0 && (
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-500/10 dark:to-amber-500/10 rounded-2xl border border-orange-200/50 dark:border-orange-500/20 p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-orange-500/20 rounded-xl">
              <Iconify
                icon="solar:lightbulb-bolt-bold-duotone"
                width={28}
                height={28}
                className="text-orange-600 dark:text-orange-400"
              />
            </div>
            <div>
              <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">
                Today's Insight
              </h4>
              <p className="text-sm text-orange-700/80 dark:text-orange-200/80">
                Focus on the areas with higher energy ratings for maximum
                benefit. Balance your activities according to the cosmic
                guidance above.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
