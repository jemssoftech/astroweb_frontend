"use client";

import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Iconify from "@/src/components/Iconify";
import { CommonTools } from "@/src/lib/utils";
import { getAuthHeaders } from "@/src/lib/astroweb";

type FormData = {
  name: string;
};

type PredictionSummary = {
  Finance: number;
  Romance: number;
  Education: number;
  Health: number;
  Family: number;
  Growth: number;
  Career: number;
  Reputation: number;
  Spirituality: number;
  Luck: number;
};

type NumerologyResult = {
  number: number;
  planet: string;
  prediction: string;
  summary: PredictionSummary;
};

// Aspect configuration with better icons and colors
const ASPECT_CONFIG: Record<
  string,
  { icon: string; from: string; to: string; label: string }
> = {
  Finance: {
    icon: "solar:wallet-money-bold-duotone",
    from: "#10b981",
    to: "#0d9488",
    label: "Finance",
  },
  Romance: {
    icon: "solar:heart-bold-duotone",
    from: "#ec4899",
    to: "#e11d48",
    label: "Romance",
  },
  Education: {
    icon: "solar:square-academic-cap-bold-duotone",
    from: "#3b82f6",
    to: "#4f46e5",
    label: "Education",
  },
  Health: {
    icon: "solar:heart-pulse-bold-duotone",
    from: "#ef4444",
    to: "#e11d48",
    label: "Health",
  },
  Family: {
    icon: "solar:home-2-bold-duotone",
    from: "#a855f7",
    to: "#7c3aed",
    label: "Family",
  },
  Growth: {
    icon: "solar:graph-up-bold-duotone",
    from: "#22c55e",
    to: "#059669",
    label: "Growth",
  },
  Career: {
    icon: "solar:case-bold-duotone",
    from: "#6366f1",
    to: "#7c3aed",
    label: "Career",
  },
  Reputation: {
    icon: "solar:star-bold-duotone",
    from: "#f59e0b",
    to: "#ea580c",
    label: "Reputation",
  },
  Spirituality: {
    icon: "solar:meditation-round-bold-duotone",
    from: "#06b6d4",
    to: "#2563eb",
    label: "Spirituality",
  },
  Luck: {
    icon: "solar:medal-star-bold-duotone",
    from: "#eab308",
    to: "#d97706",
    label: "Luck",
  },
};

// Famous examples data
const FAMOUS_EXAMPLES = [
  {
    name: "THOMAS ALVA EDISON",
    number: 60,
    prediction:
      "This number signifies peace, prosperity, appreciation of fine arts, a balanced state of mind and wisdom...",
  },
  {
    name: "ADOLF HITLER",
    number: 43,
    prediction: "This number signifies revolutionary life...",
  },
  {
    name: "MICHAEL JACKSON",
    number: 44,
    prediction: "This number helps in earning money easily...",
  },
];

export default function Numerology() {
  const [result, setResult] = useState<NumerologyResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
    },
  });

  const nameValue = watch("name");

  const fetchPrediction = async (name: string) => {
    try {
      setIsLoading(true);
      CommonTools.ShowLoading();

      const res = await fetch(
        `/api/Calculate/NameNumberPrediction/FullName/${encodeURIComponent(name)}`,
        {
          headers: getAuthHeaders(),
        },
      );

      if (!res.ok) throw new Error("API failed");

      const apiResult = await res.json();

      if (
        apiResult.Status === "Pass" &&
        apiResult.Payload?.NameNumberPrediction
      ) {
        const prediction = apiResult.Payload.NameNumberPrediction;
        setResult({
          number: prediction.Number,
          planet: prediction.Planet,
          prediction: prediction.Prediction,
          summary: prediction.PredictionSummary,
        });
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error(err);
      setResult(null);
    } finally {
      setIsLoading(false);
      CommonTools.HideLoading();
    }
  };

  // Auto-fetch when name length >= 4 with debouncing
  useEffect(() => {
    if (nameValue && nameValue.trim().length >= 4) {
      const timeoutId = setTimeout(() => {
        fetchPrediction(nameValue);
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      setResult(null);
    }
  }, [nameValue]);

  // Get score color based on percentage
  const getScoreColors = (value: number): { from: string; to: string } => {
    if (value >= 75) return { from: "#22c55e", to: "#059669" };
    if (value >= 50) return { from: "#f59e0b", to: "#ea580c" };
    if (value >= 25) return { from: "#eab308", to: "#d97706" };
    return { from: "#ef4444", to: "#e11d48" };
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
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>

          <div className="absolute top-4 right-8 opacity-20">
            <Iconify icon="solar:text-bold" width={100} height={100} />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium">
                Name Analysis
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Name Numerology
            </h1>
            <p className="text-white/80 max-w-3xl">
              Discover your life path through the vibration frequency of
              alphabets. Based on ancient Mantra Shastra principles.
            </p>
          </div>
        </motion.div>

        {/* Main Layout */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Input & Result */}
          <div className="lg:col-span-2 space-y-6">
            {/* Input Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-2xl border border-border shadow-sm p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Iconify
                    icon="solar:text-bold-duotone"
                    width={24}
                    height={24}
                    className="text-primary"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Enter Your Name
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Type at least 4 characters to see results
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-muted-foreground">
                    <Iconify
                      icon="solar:user-bold-duotone"
                      width={20}
                      height={20}
                    />
                  </div>
                  <input
                    type="text"
                    className={`w-full pl-12 pr-4 py-3.5 bg-muted border-2 border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none font-medium text-foreground placeholder:text-muted-foreground transition-all ${
                      errors.name ? "border-red-500 focus:ring-red-500/50" : ""
                    }`}
                    placeholder="Enter full name..."
                    {...register("name", {
                      minLength: {
                        value: 4,
                        message: "Name must be at least 4 characters",
                      },
                    })}
                  />
                  {isLoading && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                {errors.name && (
                  <div className="flex items-center gap-2 text-red-500 text-sm bg-red-500/10 px-4 py-2 rounded-lg">
                    <Iconify
                      icon="solar:danger-circle-bold-duotone"
                      width={18}
                      height={18}
                    />
                    {errors.name.message}
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Iconify
                    icon="solar:info-circle-bold-duotone"
                    width={16}
                    height={16}
                  />
                  Results appear automatically as you type
                </div>
              </div>
            </motion.div>

            {/* Result Card */}
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Number & Planet */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                      <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/20 rounded-xl">
                            <Iconify
                              icon="solar:hashtag-bold-duotone"
                              width={24}
                              height={24}
                              className="text-white"
                            />
                          </div>
                          <p className="font-semibold text-white">
                            Your Number
                          </p>
                        </div>
                      </div>
                      <div className="p-6 text-center">
                        <p className="text-6xl font-bold text-foreground">
                          {result.number}
                        </p>
                      </div>
                    </div>

                    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/20 rounded-xl">
                            <Iconify
                              icon="solar:planet-bold-duotone"
                              width={24}
                              height={24}
                              className="text-white"
                            />
                          </div>
                          <p className="font-semibold text-white">
                            Ruling Planet
                          </p>
                        </div>
                      </div>
                      <div className="p-6 text-center">
                        <p className="text-4xl font-bold text-foreground">
                          {result.planet}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Prediction */}
                  <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-xl">
                          <Iconify
                            icon="solar:magic-stick-3-bold-duotone"
                            width={24}
                            height={24}
                            className="text-white"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-lg">
                            Your Prediction
                          </h3>
                          <p className="text-white/70 text-sm">
                            Based on name vibrations
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div
                        className="text-foreground/80 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: result.prediction }}
                      />
                    </div>
                  </div>

                  {/* Life Aspects Analysis */}
                  {result.summary && (
                    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/20 rounded-xl">
                            <Iconify
                              icon="solar:chart-2-bold-duotone"
                              width={24}
                              height={24}
                              className="text-white"
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white text-lg">
                              Life Aspects Analysis
                            </h3>
                            <p className="text-white/70 text-sm">
                              Your strengths across different areas
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                          {Object.entries(result.summary).map(
                            ([key, value], idx) => {
                              const config = ASPECT_CONFIG[key];
                              const scoreColors = getScoreColors(value);

                              return (
                                <motion.div
                                  key={key}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: idx * 0.05 }}
                                  className="relative"
                                >
                                  {/* Circular Progress */}
                                  <div className="relative mx-auto w-20 h-20 mb-3">
                                    <svg
                                      width="80"
                                      height="80"
                                      className="-rotate-90"
                                    >
                                      <circle
                                        cx="40"
                                        cy="40"
                                        r="34"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="6"
                                        className="text-muted"
                                      />
                                      <circle
                                        cx="40"
                                        cy="40"
                                        r="34"
                                        fill="none"
                                        stroke={`url(#gradient-${key})`}
                                        strokeWidth="6"
                                        strokeDasharray={`${(value / 100) * 213.6} 213.6`}
                                        strokeLinecap="round"
                                        className="transition-all duration-500"
                                      />
                                      <defs>
                                        <linearGradient
                                          id={`gradient-${key}`}
                                          x1="0%"
                                          y1="0%"
                                          x2="100%"
                                          y2="0%"
                                        >
                                          <stop
                                            offset="0%"
                                            stopColor={scoreColors.from}
                                          />
                                          <stop
                                            offset="100%"
                                            stopColor={scoreColors.to}
                                          />
                                        </linearGradient>
                                      </defs>
                                    </svg>

                                    {/* Icon in Center */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                      <Iconify
                                        icon={config?.icon || "mdi:star"}
                                        width={32}
                                        height={32}
                                        className="text-foreground"
                                      />
                                    </div>
                                  </div>

                                  {/* Label & Score */}
                                  <div className="text-center">
                                    <p className="text-xs text-muted-foreground mb-1">
                                      {config?.label}
                                    </p>
                                    <p className="text-xl font-bold text-foreground">
                                      {value}%
                                    </p>
                                  </div>
                                </motion.div>
                              );
                            },
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-card rounded-2xl border border-dashed border-border shadow-sm p-12 text-center"
                >
                  <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                    <Iconify
                      icon="solar:text-bold-duotone"
                      width={48}
                      height={48}
                      className="text-muted-foreground/50"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Start Typing Your Name
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    Enter at least 4 characters of your full name to reveal your
                    numerology prediction
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Iconify
                      icon="solar:keyboard-bold-duotone"
                      width={20}
                      height={20}
                    />
                    Waiting for input...
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column - Info & Examples */}
          <div className="lg:col-span-1 space-y-6">
            {/* Famous Examples */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
            >
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <Iconify
                      icon="solar:star-bold-duotone"
                      width={24}
                      height={24}
                      className="text-white"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">
                      Famous Examples
                    </h3>
                    <p className="text-white/70 text-sm">Historical accuracy</p>
                  </div>
                </div>
              </div>
              <div className="divide-y divide-border">
                {FAMOUS_EXAMPLES.map((example, idx) => (
                  <div
                    key={idx}
                    className="p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-semibold text-foreground text-sm">
                        {example.name}
                      </p>
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-lg text-sm font-bold">
                        {example.number}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {example.prediction}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* What is Numerology */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
            >
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <Iconify
                      icon="solar:question-circle-bold-duotone"
                      width={24}
                      height={24}
                      className="text-white"
                    />
                  </div>
                  <h3 className="font-semibold text-white">
                    What is Numerology?
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-foreground/80 text-sm leading-relaxed">
                  Every person is represented by a Number (birth date) and
                  defined by letters in their names. These vibrations influence
                  personality, destiny, and life path.
                </p>
              </div>
            </motion.div>

            {/* Source */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
            >
              <div className="bg-gradient-to-r from-purple-500 to-violet-600 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <Iconify
                      icon="solar:book-bookmark-bold-duotone"
                      width={24}
                      height={24}
                      className="text-white"
                    />
                  </div>
                  <h3 className="font-semibold text-white">
                    Source of Numerology
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-foreground/80 text-sm leading-relaxed">
                  <span className="font-semibold text-foreground">
                    Mantra Sastra
                  </span>{" "}
                  helps us understand the latent powers of nature through sound
                  vibrations.
                  <span className="font-semibold text-foreground">
                    {" "}
                    Tantra Sastra
                  </span>{" "}
                  teaches us to find and use the forms of invisible powers.
                </p>
              </div>
            </motion.div>

            {/* How to Use */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-2xl border border-indigo-200/50 dark:border-indigo-500/20 p-6"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-500/20 rounded-xl">
                  <Iconify
                    icon="solar:lightbulb-bolt-bold-duotone"
                    width={28}
                    height={28}
                    className="text-indigo-600 dark:text-indigo-400"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-indigo-800 dark:text-indigo-300 mb-2">
                    Pro Tip
                  </h4>
                  <p className="text-sm text-indigo-700/80 dark:text-indigo-200/80">
                    Use your full legal name for the most accurate results.
                    Different spellings can produce different numbers and
                    predictions.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
