"use client";

import React, { useState, useEffect, useCallback } from "react";
import Iconify from "@/src/components/Iconify";
import PersonSelector from "@/src/components/PersonSelector";
import { Person } from "@/src/lib/models";
import Swal from "sweetalert2";
import api from "@/src/lib/api";
import { motion } from "framer-motion";

// ============ CONSTANTS ============

const PERSONALITY_TRAITS = [
  {
    title: "Communication Style",
    icon: "mdi:message-text-outline",
    gradient: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  {
    title: "Emotional Nature",
    icon: "mdi:heart-pulse",
    gradient: "from-rose-500 to-pink-500",
    bgColor: "bg-rose-50 dark:bg-rose-950/30",
    borderColor: "border-rose-200 dark:border-rose-800",
  },
  {
    title: "Sensitivity & Feelings",
    icon: "mdi:emoticon-outline",
    gradient: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    borderColor: "border-amber-200 dark:border-amber-800",
  },
  {
    title: "Relationships & Love",
    icon: "mdi:heart-multiple-outline",
    gradient: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-50 dark:bg-pink-950/30",
    borderColor: "border-pink-200 dark:border-pink-800",
  },
  {
    title: "Work & Efficiency",
    icon: "mdi:briefcase-outline",
    gradient: "from-emerald-500 to-green-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    borderColor: "border-emerald-200 dark:border-emerald-800",
  },
  {
    title: "Intellectual Pursuits",
    icon: "mdi:book-open-page-variant-outline",
    gradient: "from-violet-500 to-purple-500",
    bgColor: "bg-violet-50 dark:bg-violet-950/30",
    borderColor: "border-violet-200 dark:border-violet-800",
  },
  {
    title: "Social Approach",
    icon: "mdi:account-group-outline",
    gradient: "from-indigo-500 to-blue-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
    borderColor: "border-indigo-200 dark:border-indigo-800",
  },
  {
    title: "Material & Financial",
    icon: "mdi:cash-multiple",
    gradient: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    borderColor: "border-green-200 dark:border-green-800",
  },
  {
    title: "Perfectionism & Focus",
    icon: "mdi:target",
    gradient: "from-slate-500 to-gray-600",
    bgColor: "bg-slate-50 dark:bg-slate-950/30",
    borderColor: "border-slate-200 dark:border-slate-800",
  },
];

// ============ INTERFACES ============

interface PersonalityData {
  report: string[];
  spiritual_lesson: string;
  key_quality: string;
}

interface PersonalityResponse {
  success: boolean;
  message?: string;
  data: PersonalityData;
}

// ============ MAIN COMPONENT ============

function PersonalityPage() {
  // const [user, setUser] = useState(getUser());
  // useEffect(() => {
  //   setUser(getUser());
  // }, []);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PersonalityResponse | null>(null);
  const [activeSection, setActiveSection] = useState<number | null>(null);

  // Save log to server
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
    if (result) {
      saveResultToServer(result);
    }
  }, [result, saveResultToServer]);

  const handleCalculate = async () => {
    if (!selectedPerson) {
      Swal.fire({
        icon: "warning",
        title: "Select Person",
        text: "Please select a person to generate personality report.",
        background: "#1f2937",
        color: "#f9fafb",
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
        house_type: "placidus",
      };

      const response: any = await api.post(
        "/api/mainapi/personality",
        requestBody,
      );

      if (response && response.status === 200 && response.data?.success) {
        setResult(response.data);
      } else {
        throw new Error(
          response?.data?.message ||
            response?.error ||
            "Failed to fetch personality data",
        );
      }
    } catch (error: unknown) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: (error as Error).message || "Something went wrong!",
        background: "#1f2937",
        color: "#f9fafb",
      });
    } finally {
      setLoading(false);
    }
  };

  const getReport = () => result?.data?.report || [];
  const getSpiritualLesson = () => result?.data?.spiritual_lesson || null;
  const getKeyQuality = () => result?.data?.key_quality || null;

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 py-6 ">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden bg-linear-to-r from-purple-700 via-violet-700 to-indigo-800 rounded-2xl p-6 md:p-8 text-white shadow-xl mb-8"
        >
          {/* Soft Glow Background Shapes */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>

          {/* Watermark Icon */}
          <div className="absolute top-4 right-8 opacity-20">
            <Iconify icon="mdi:brain" width={110} height={110} />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Left Content */}
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Iconify icon="mdi:account-details" width={40} height={40} />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium">
                    Western Astrology
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold">
                  Personality Report
                </h1>

                <p className="text-white/80 mt-1 max-w-xl">
                  Uncover your unique personality traits, strengths, and growth
                  areas based on your astrological birth chart.
                </p>
              </div>
            </div>

            {/* Optional Selected Person */}
            {selectedPerson && (
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

        {/* Input Card */}
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
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
                        className="text-muted-foreground flex-shrink-0"
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

              <button
                onClick={handleCalculate}
                disabled={loading || !selectedPerson}
                className="mt-6 w-full py-3.5 px-4 bg-primary text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/25 hover:-translate-y-0.5"
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
          </div>
          {/* Results Section */}
          <div className="lg:col-span-3 space-y-6">
            {result && (
              <div className="space-y-6">
                {/* Key Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Key Quality */}
                  {getKeyQuality() && (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 p-6 hover:shadow-xl transition-all">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25">
                          <Iconify
                            icon="mdi:key-variant"
                            width={28}
                            className="text-white"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                            Key Quality
                          </p>
                          <p className="text-xl font-bold text-slate-900 dark:text-white">
                            {getKeyQuality()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Spiritual Lesson */}
                  {getSpiritualLesson() && (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 p-6 hover:shadow-xl transition-all">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                          <Iconify
                            icon="mdi:meditation"
                            width={28}
                            className="text-white"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                            Spiritual Lesson
                          </p>
                          <p className="text-lg font-bold text-slate-900 dark:text-white">
                            {getSpiritualLesson()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Total Traits */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 p-6 hover:shadow-xl transition-all">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                        <Iconify
                          icon="mdi:format-list-checks"
                          width={28}
                          className="text-white"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                          Personality Traits
                        </p>
                        <p className="text-xl font-bold text-slate-900 dark:text-white">
                          {getReport().length} Insights
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Personality Traits Section */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 overflow-hidden">
                  <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-linear-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg">
                          <Iconify
                            icon="mdi:account-details"
                            width={20}
                            className="text-white"
                          />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                            Your Personality Traits
                          </h2>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            Detailed insights based on your birth chart
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 text-sm font-medium rounded-full">
                        {getReport().length} traits
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {getReport().map((trait: string, idx: number) => (
                        <PersonalityTraitCard
                          key={idx}
                          index={idx}
                          trait={trait}
                          config={
                            PERSONALITY_TRAITS[idx % PERSONALITY_TRAITS.length]
                          }
                          isActive={activeSection === idx}
                          onClick={() =>
                            setActiveSection(activeSection === idx ? null : idx)
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Personality Overview */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 overflow-hidden">
                  <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-linear-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg">
                        <Iconify
                          icon="mdi:chart-donut"
                          width={20}
                          className="text-white"
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Personality Overview
                      </h3>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <StatCard
                        label="Total Traits"
                        value={getReport().length}
                        icon="mdi:format-list-bulleted"
                        gradient="from-slate-500 to-gray-600"
                      />
                      <StatCard
                        label="Strengths"
                        value={
                          getReport().filter(
                            (t: string) =>
                              !t.includes("not") && !t.includes("avoid"),
                          ).length
                        }
                        icon="mdi:arm-flex"
                        gradient="from-green-500 to-emerald-500"
                      />
                      <StatCard
                        label="Growth Areas"
                        value={
                          getReport().filter(
                            (t: string) =>
                              t.includes("need") || t.includes("should"),
                          ).length
                        }
                        icon="mdi:trending-up"
                        gradient="from-orange-500 to-amber-500"
                      />
                      <StatCard
                        label="Key Quality"
                        value={1}
                        icon="mdi:key"
                        gradient="from-purple-500 to-violet-500"
                      />
                      <StatCard
                        label="Life Lesson"
                        value={1}
                        icon="mdi:lightbulb-on"
                        gradient="from-cyan-500 to-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Full Report Expandable */}
                <details className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 overflow-hidden group">
                  <summary className="p-6 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-3 font-semibold text-slate-900 dark:text-white transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-slate-500 to-gray-600 flex items-center justify-center">
                      <Iconify
                        icon="mdi:file-document-outline"
                        width={20}
                        className="text-white"
                      />
                    </div>
                    <span>View Full Report Text</span>
                    <Iconify
                      icon="mdi:chevron-down"
                      width={24}
                      className="ml-auto text-slate-400 group-open:rotate-180 transition-transform"
                    />
                  </summary>
                  <div className="px-6 pb-6 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <div className="prose prose-sm max-w-none dark:prose-invert space-y-4">
                      {getReport().map((paragraph: string, idx: number) => (
                        <div
                          key={idx}
                          className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700"
                        >
                          <div className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                              {idx + 1}
                            </span>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                              {paragraph}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </details>
              </div>
            )}

            {/* Empty State */}
            {!result && !loading && <EmptyState />}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ SUB COMPONENTS ============

function PersonalityTraitCard({
  index,
  trait,
  config,
  isActive,
  onClick,
}: {
  index: number;
  trait: string;
  config: (typeof PERSONALITY_TRAITS)[0];
  isActive: boolean;
  onClick: () => void;
}) {
  const previewLength = 120;
  const isLong = trait.length > previewLength;
  const displayText =
    isActive || !isLong ? trait : trait.substring(0, previewLength) + "...";

  return (
    <div
      onClick={onClick}
      className={`${config.bgColor} ${config.borderColor} rounded-xl p-5 border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
        isActive ? "shadow-lg ring-2 ring-purple-500/50" : ""
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 rounded-xl bg-linear-to-br ${config.gradient} flex items-center justify-center shadow-lg flex-shrink-0`}
        >
          <Iconify icon={config.icon} width={24} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`w-6 h-6 rounded-full bg-linear-to-br ${config.gradient} text-white flex items-center justify-center text-xs font-bold`}
            >
              {index + 1}
            </span>
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              {config.title}
            </h4>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {displayText}
          </p>
          {isLong && (
            <button className="mt-2 text-xs text-purple-600 dark:text-purple-400 font-medium hover:underline inline-flex items-center gap-1">
              {isActive ? "Show less" : "Read more"}
              <Iconify
                icon={isActive ? "mdi:chevron-up" : "mdi:chevron-down"}
                width={14}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  gradient,
}: {
  label: string;
  value: number;
  icon: string;
  gradient: string;
}) {
  return (
    <div className="text-center p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all">
      <div
        className={`w-14 h-14 rounded-xl bg-linear-to-br ${gradient} flex items-center justify-center mx-auto mb-3 shadow-lg`}
      >
        <span className="text-2xl font-bold text-white">{value}</span>
      </div>
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
        {label}
      </p>
    </div>
  );
}

function EmptyState() {
  const features = [
    { icon: "mdi:account-heart", label: "Love Style" },
    { icon: "mdi:briefcase", label: "Career" },
    { icon: "mdi:brain", label: "Mind" },
    { icon: "mdi:heart-pulse", label: "Emotions" },
    { icon: "mdi:account-group", label: "Social" },
    { icon: "mdi:star-shooting", label: "Destiny" },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 p-12 text-center">
      <div className="max-w-md mx-auto">
        <div className="relative mb-8">
          <div className="w-28 h-28 rounded-full bg-linear-to-br from-purple-100 to-violet-100 dark:from-purple-950/50 dark:to-violet-950/50 flex items-center justify-center mx-auto">
            <Iconify
              icon="mdi:account-question-outline"
              width={56}
              className="text-purple-400"
            />
          </div>
          <div className="absolute -inset-4 rounded-full bg-linear-to-br from-purple-500/10 to-violet-500/10 blur-xl"></div>
        </div>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          Discover Your Personality
        </h3>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          Select a profile above and click "Analyze" to uncover your unique
          personality traits, strengths, and life lessons based on your birth
          chart.
        </p>

        <div className="flex flex-wrap justify-center gap-2">
          {features.map((feature, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-full text-sm font-medium text-purple-700 dark:text-purple-300"
            >
              <Iconify icon={feature.icon} width={16} />
              {feature.label}
            </span>
          ))}
        </div>

        <div className="mt-8 p-4 bg-linear-to-r from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 rounded-xl border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-center gap-2 text-purple-600 dark:text-purple-400">
            <Iconify icon="mdi:lightbulb-on" width={20} />
            <span className="text-sm font-medium">
              Your birth chart reveals your unique cosmic blueprint
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalityPage;
