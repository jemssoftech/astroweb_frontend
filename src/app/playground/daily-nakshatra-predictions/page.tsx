"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PersonSelector from "@/src/components/PersonSelector";
import Iconify from "@/src/components/Iconify";
import { Person } from "@/src/lib/models";
import Swal from "sweetalert2";
import { getUser } from "@/src/lib/auth";

interface PredictionResponse {
  birth_moon_sign: string;
  birth_moon_nakshatra: string;
  prediction: {
    health: string;
    emotions: string;
    profession: string;
    luck: string;
    personal_life: string;
    travel: string;
  };
  prediction_date: string;
}

// Prediction categories configuration
const PREDICTION_CATEGORIES = [
  {
    key: "health",
    label: "Health & Wellness",
    icon: "solar:heart-pulse-bold-duotone",
    gradient: "from-rose-500 to-pink-600",
    bg: "bg-rose-500/10",
    text: "text-rose-500",
    border: "border-rose-500/20",
  },
  {
    key: "emotions",
    label: "Emotions & Mood",
    icon: "solar:emoji-funny-circle-bold-duotone",
    gradient: "from-purple-500 to-violet-600",
    bg: "bg-purple-500/10",
    text: "text-purple-500",
    border: "border-purple-500/20",
  },
  {
    key: "profession",
    label: "Career & Finance",
    icon: "solar:case-bold-duotone",
    gradient: "from-blue-500 to-indigo-600",
    bg: "bg-blue-500/10",
    text: "text-blue-500",
    border: "border-blue-500/20",
  },
  {
    key: "luck",
    label: "Luck & Fortune",
    icon: "solar:star-bold-duotone",
    gradient: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-500/10",
    text: "text-emerald-500",
    border: "border-emerald-500/20",
  },
  {
    key: "personal_life",
    label: "Personal Life",
    icon: "solar:heart-bold-duotone",
    gradient: "from-pink-500 to-rose-600",
    bg: "bg-pink-500/10",
    text: "text-pink-500",
    border: "border-pink-500/20",
  },
  {
    key: "travel",
    label: "Travel & Journey",
    icon: "solar:airplane-bold-duotone",
    gradient: "from-amber-500 to-orange-600",
    bg: "bg-amber-500/10",
    text: "text-amber-500",
    border: "border-amber-500/20",
  },
];

export default function DailyNakshatraPage() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(false);
  const [predictionData, setPredictionData] =
    useState<PredictionResponse | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [user, setUser] = useState(getUser());
  useEffect(() => {
    setUser(getUser());
  }, []);

  const handlePersonSelected = (person: Person) => {
    setSelectedPerson(person);
    setPredictionData(null);
  };

  const getBirthDataPayload = (person: Person, date: Date) => {
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
      location: {
        latitude: person.Latitude,
        longitude: person.Longitude,
        timezone: tzone,
      },
      predictionDate: {
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        hour: date.getHours(),
        min: date.getMinutes(),
      },
    };
  };

  const fetchPrediction = async (
    type: string = "prediction",
    date: Date = currentDate,
  ) => {
    if (!selectedPerson) {
      Swal.fire({
        icon: "warning",
        title: "No Person Selected",
        text: "Please select a person first",
        background: "#1e293b",
        color: "#f1f5f9",
      });
      return;
    }
    const authToken = user?.token;
    const apiKey = (user as any)?.userApiKey || (user as any)?.apikey || "";

    setLoading(true);
    try {
      const payload = getBirthDataPayload(selectedPerson, date);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NEXT_JS_API_URL}/api/daily_nakshatra?type=${type}`,
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

      const result = await response.json();

      if (
        result.status === "Fail" ||
        (result.success === false && result.status !== "Pass")
      ) {
        throw new Error(
          result.message || result.error || "Failed to fetch prediction",
        );
      }

      setPredictionData(result.data);

      if (type === "next") {
        const nextDate = new Date(date);
        nextDate.setDate(date.getDate() + 1);
        setCurrentDate(nextDate);
      } else if (type === "previous") {
        const prevDate = new Date(date);
        prevDate.setDate(date.getDate() - 1);
        setCurrentDate(prevDate);
      }
    } catch (error: unknown) {
      console.error("Prediction error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to get prediction";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        background: "#1e293b",
        color: "#f1f5f9",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCalculate = () => {
    fetchPrediction("prediction", currentDate);
  };

  const handlePrevious = () => {
    const prevDate = new Date(currentDate);
    prevDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(prevDate);
    fetchPrediction("previous", prevDate);
  };

  const handleNext = () => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(nextDate);
    fetchPrediction("next", nextDate);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-700 rounded-2xl p-6 md:p-8 text-white shadow-xl"
        >
          {/* Background decorations */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>

          {/* Decorative stars */}
          <div className="absolute top-4 right-8 opacity-20">
            <Iconify icon="solar:stars-bold" width={100} height={100} />
          </div>
          <div className="absolute bottom-4 right-24 opacity-10">
            <Iconify icon="solar:moon-stars-bold" width={60} height={60} />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Iconify
                  icon="solar:star-ring-bold-duotone"
                  width={40}
                  height={40}
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium">
                    Nakshatra Based
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Daily Nakshatra Predictions
                </h1>
                <p className="text-white/80 mt-1">
                  Personalized daily insights based on your birth Nakshatra
                </p>
              </div>
            </div>

            {/* Current Date Display */}
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/20">
              <Iconify
                icon="solar:calendar-bold-duotone"
                width={24}
                height={24}
              />
              <div>
                <p className="text-sm text-white/70">Selected Date</p>
                <p className="font-semibold">{formatDate(currentDate)}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Layout */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Person Selector Card */}
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

              <PersonSelector
                onPersonSelected={handlePersonSelected}
                label=""
              />

              {/* Selected Person Info */}
              {selectedPerson && (
                <div className="mt-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <Iconify
                        icon="solar:user-bold"
                        width={20}
                        height={20}
                        className="text-primary"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {selectedPerson.Name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {selectedPerson.BirthLocation}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Date Picker */}
              <div className="mt-6 pt-6 border-t border-border">
                <label className="block text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <Iconify
                    icon="solar:calendar-bold-duotone"
                    width={18}
                    height={18}
                    className="text-muted-foreground"
                  />
                  Prediction Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={currentDate.toISOString().split("T")[0]}
                    onChange={(e) => setCurrentDate(new Date(e.target.value))}
                    className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground font-medium focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Calculate Button */}
              <button
                onClick={handleCalculate}
                disabled={loading || !selectedPerson}
                className="mt-6 w-full py-3.5 px-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5"
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Iconify
                      icon="solar:magic-stick-3-bold-duotone"
                      width={20}
                      height={20}
                    />
                    Generate Predictions
                  </>
                )}
              </button>
            </motion.div>

            {/* Lunar Profile Card */}
            <AnimatePresence>
              {predictionData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700 rounded-2xl p-6 text-white shadow-xl overflow-hidden relative"
                >
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-white/20 rounded-xl">
                        <Iconify
                          icon="solar:moon-stars-bold-duotone"
                          width={24}
                          height={24}
                        />
                      </div>
                      <h3 className="font-semibold text-lg">
                        Your Lunar Profile
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {/* Moon Sign */}
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-amber-500/30 rounded-xl flex items-center justify-center">
                            <Iconify
                              icon="solar:moon-bold-duotone"
                              width={28}
                              height={28}
                              className="text-amber-300"
                            />
                          </div>
                          <div>
                            <p className="text-white/70 text-sm">
                              Moon Sign (Rashi)
                            </p>
                            <p className="text-xl font-bold">
                              {predictionData.birth_moon_sign}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Nakshatra */}
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-cyan-500/30 rounded-xl flex items-center justify-center">
                            <Iconify
                              icon="solar:stars-bold-duotone"
                              width={28}
                              height={28}
                              className="text-cyan-300"
                            />
                          </div>
                          <div>
                            <p className="text-white/70 text-sm">
                              Birth Nakshatra
                            </p>
                            <p className="text-xl font-bold">
                              {predictionData.birth_moon_nakshatra}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Guide */}
            {!predictionData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card rounded-2xl border border-border shadow-sm p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-amber-500/10 rounded-xl">
                    <Iconify
                      icon="solar:lightbulb-bolt-bold-duotone"
                      width={24}
                      height={24}
                      className="text-amber-500"
                    />
                  </div>
                  <h3 className="font-semibold text-foreground">
                    How It Works
                  </h3>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      step: 1,
                      text: "Select a person from your saved profiles",
                    },
                    { step: 2, text: "Choose the date for prediction" },
                    {
                      step: 3,
                      text: "Click 'Generate Predictions' to see results",
                    },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">
                          {item.step}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              {predictionData ? (
                <motion.div
                  key="predictions"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Date Navigation */}
                  <div className="bg-card rounded-2xl border border-border shadow-sm p-4">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={handlePrevious}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2.5 text-foreground hover:bg-muted rounded-xl transition-all disabled:opacity-50 group"
                      >
                        <Iconify
                          icon="solar:arrow-left-linear"
                          width={20}
                          height={20}
                          className="group-hover:-translate-x-1 transition-transform"
                        />
                        <span className="hidden sm:inline font-medium">
                          Previous
                        </span>
                      </button>

                      <div className="flex items-center gap-3 px-6 py-2 bg-muted rounded-xl">
                        <Iconify
                          icon="solar:calendar-bold-duotone"
                          width={20}
                          height={20}
                          className="text-primary"
                        />
                        <span className="font-bold text-foreground">
                          {predictionData.prediction_date}
                        </span>
                      </div>

                      <button
                        onClick={handleNext}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2.5 text-foreground hover:bg-muted rounded-xl transition-all disabled:opacity-50 group"
                      >
                        <span className="hidden sm:inline font-medium">
                          Next
                        </span>
                        <Iconify
                          icon="solar:arrow-right-linear"
                          width={20}
                          height={20}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </button>
                    </div>
                  </div>

                  {/* Prediction Header */}
                  <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />

                    <div className="relative z-10 flex items-center gap-4">
                      <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                        <Iconify
                          icon="solar:magic-stick-3-bold-duotone"
                          width={32}
                          height={32}
                        />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">
                          Daily Predictions
                        </h2>
                        <p className="text-white/80 mt-1 flex items-center gap-2">
                          <Iconify
                            icon="solar:stars-linear"
                            width={16}
                            height={16}
                          />
                          Based on {predictionData.birth_moon_nakshatra}{" "}
                          Nakshatra in {predictionData.birth_moon_sign}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Prediction Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {PREDICTION_CATEGORIES.map((category, index) => {
                      const predictionText =
                        predictionData.prediction[
                          category.key as keyof typeof predictionData.prediction
                        ];

                      if (!predictionText) return null;

                      return (
                        <motion.div
                          key={category.key}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden hover:shadow-lg transition-all group"
                        >
                          {/* Card Header */}
                          <div
                            className={`bg-gradient-to-r ${category.gradient} px-5 py-4`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-white/20 rounded-xl">
                                <Iconify
                                  icon={category.icon}
                                  width={24}
                                  height={24}
                                  className="text-white"
                                />
                              </div>
                              <h4 className="font-semibold text-white">
                                {category.label}
                              </h4>
                            </div>
                          </div>

                          {/* Card Content */}
                          <div className="p-5">
                            <p className="text-foreground/80 leading-relaxed text-sm">
                              {predictionText.replace(/\\'/g, "'")}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Summary Insight */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/10 rounded-2xl border border-amber-200/50 dark:border-amber-500/20 p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-amber-500/20 rounded-xl">
                        <Iconify
                          icon="solar:lightbulb-bolt-bold-duotone"
                          width={28}
                          height={28}
                          className="text-amber-600 dark:text-amber-400"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">
                          Daily Insight
                        </h4>
                        <p className="text-sm text-amber-700/80 dark:text-amber-200/80">
                          These predictions are based on your Moon Nakshatra.
                          For best results, focus on areas with positive energy
                          and take necessary precautions in challenging areas.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Disclaimer */}
                  <div className="bg-muted/50 rounded-xl p-4 border border-border">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                      <Iconify
                        icon="solar:info-circle-bold-duotone"
                        width={18}
                        height={18}
                      />
                      <p>
                        These predictions are for guidance only. Your actions
                        shape your destiny.
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  {/* Empty State */}
                  <div className="bg-card rounded-2xl border border-dashed border-border shadow-sm p-12 flex flex-col items-center justify-center min-h-[500px]">
                    <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                      <Iconify
                        icon="solar:stars-bold-duotone"
                        width={48}
                        height={48}
                        className="text-muted-foreground/50"
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      No Predictions Generated
                    </h3>
                    <p className="text-muted-foreground text-center max-w-md mb-6">
                      Select a person and click "Generate Predictions" to see
                      your personalized daily Nakshatra predictions.
                    </p>

                    {/* Feature highlights */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-lg">
                      {[
                        {
                          icon: "solar:heart-pulse-bold-duotone",
                          label: "Health",
                        },
                        { icon: "solar:case-bold-duotone", label: "Career" },
                        { icon: "solar:star-bold-duotone", label: "Luck" },
                        { icon: "solar:heart-bold-duotone", label: "Love" },
                        {
                          icon: "solar:airplane-bold-duotone",
                          label: "Travel",
                        },
                        {
                          icon: "solar:emoji-funny-circle-bold-duotone",
                          label: "Emotions",
                        },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="flex flex-col items-center gap-2 p-4 bg-muted/50 rounded-xl"
                        >
                          <Iconify
                            icon={item.icon}
                            width={24}
                            height={24}
                            className="text-muted-foreground"
                          />
                          <span className="text-xs text-muted-foreground">
                            {item.label}
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
