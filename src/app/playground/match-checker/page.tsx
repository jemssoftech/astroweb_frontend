"use client";

import { useCallback, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Iconify from "@/src/components/Iconify";
import PageHeader from "@/src/components/PageHeader";
import PersonSelector from "@/src/components/PersonSelector";
import MatchResult from "@/src/components/MatchResult";
import { Person } from "@/src/lib/models";
import { CommonTools } from "@/src/lib/utils";
import { getUser } from "@/src/lib/auth";
import Swal from "sweetalert2";

export default function MatchChecker() {
  const [selectedMalePerson, setSelectedMalePerson] = useState<Person | null>(
    null,
  );
  const [selectedFemalePerson, setSelectedFemalePerson] =
    useState<Person | null>(null);
  const [showOutput, setShowOutput] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    setUser(getUser());
  }, []);

  const handleMalePersonSelected = (person: Person) => {
    setSelectedMalePerson(person);
    setShowOutput(false);
    setResult(null);
  };

  const handleFemalePersonSelected = (person: Person) => {
    setSelectedFemalePerson(person);
    setShowOutput(false);
    setResult(null);
  };

  const parseBirthData = useCallback((person: Person) => {
    const time = person.BirthTime;
    const date = new Date(time);

    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const day = date.getUTCDate().toString().padStart(2, "0");
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = date.getUTCFullYear();

    const offsetMinutes = date.getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
    const offsetMins = Math.abs(offsetMinutes) % 60;
    const offsetSign = offsetMinutes <= 0 ? "+" : "-";
    const rawOffset = `${offsetSign}${offsetHours.toString().padStart(2, "0")}:${offsetMins.toString().padStart(2, "0")}`;

    return {
      location: encodeURIComponent(person.BirthLocation.trim()),
      time: `${hours}:${minutes}`,
      date: `${day}/${month}/${year}`,
      offset: encodeURIComponent(rawOffset),
    };
  }, []);

  const fetchPrediction = async () => {
    if (!selectedMalePerson || !selectedFemalePerson) {
      Swal.fire({
        icon: "warning",
        title: "Missing Selection",
        text: "Please select both male and female profiles",
        background: "#1e293b",
        color: "#f1f5f9",
      });
      return;
    }

    setIsCalculating(true);
    setShowOutput(true);
    setLoadingProgress(0);

    try {
      CommonTools.ShowLoading();
      const maleData = parseBirthData(selectedMalePerson);
      const femaleData = parseBirthData(selectedFemalePerson);

      const authToken = user?.token;
      const apiKey = (user as any)?.userApiKey || (user as any)?.apikey || "";

      // Simulate progress
      const progressInterval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const res = await fetch(
        `/api/Calculate/MatchReport/Location/${maleData.location}/Time/${maleData.time}/${maleData.date}/${maleData.offset}/Location/${femaleData.location}/Time/${femaleData.time}/${femaleData.date}/${femaleData.offset}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken || ""}`,
            "X-API-KEY": apiKey || "",
          },
        },
      );

      clearInterval(progressInterval);

      if (!res.ok) throw new Error("API failed");

      const apiResult = await res.json();

      if (apiResult.Status === "Pass") {
        setLoadingProgress(100);
        setResult(apiResult.Payload);
        setShowOutput(true);

        Swal.fire({
          icon: "success",
          title: "Match Analysis Complete!",
          text: "Compatibility report generated successfully",
          timer: 2000,
          showConfirmButton: false,
          background: "#1e293b",
          color: "#f1f5f9",
        });
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error(err);
      setResult(null);
      setShowOutput(false);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to generate compatibility report. Please try again.",
        background: "#1e293b",
        color: "#f1f5f9",
      });
    } finally {
      setIsCalculating(false);
      CommonTools.HideLoading();
    }
  };

  const bothSelected = selectedMalePerson && selectedFemalePerson;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 rounded-2xl p-6 md:p-8 text-white shadow-xl"
        >
          {/* Background decorations */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>

          {/* Decorative hearts */}
          <div className="absolute top-4 right-8 opacity-20">
            <Iconify icon="solar:hearts-bold" width={100} height={100} />
          </div>
          <div className="absolute bottom-4 right-24 opacity-10">
            <Iconify icon="solar:heart-bold" width={60} height={60} />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Iconify
                  icon="solar:heart-shine-bold-duotone"
                  width={40}
                  height={40}
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium">
                    Compatibility Analysis
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Match Checker
                </h1>
                <p className="text-white/80 mt-1">
                  Discover astrological compatibility between two souls
                </p>
              </div>
            </div>

            {/* Match Score Preview */}
            {bothSelected && result && (
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/20">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Iconify icon="solar:heart-bold" width={24} height={24} />
                </div>
                <div>
                  <p className="text-sm text-white/70">Match Score</p>
                  <p className="text-2xl font-bold">
                    {result?.MatchReport?.TotalPoints || 0}/36
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Main Layout */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Person Selectors */}
          <div className="lg:col-span-1 space-y-6">
            {/* Male Person Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <Iconify
                      icon="solar:user-bold-duotone"
                      width={24}
                      height={24}
                      className="text-white"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Male Person</h3>
                    <p className="text-white/70 text-sm">
                      Select groom's profile
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <PersonSelector
                  onPersonSelected={handleMalePersonSelected}
                  label=""
                />

                {selectedMalePerson && (
                  <div className="mt-4 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <Iconify
                          icon="solar:user-check-bold"
                          width={20}
                          height={20}
                          className="text-blue-500"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {selectedMalePerson.Name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {selectedMalePerson.BirthLocation}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Female Person Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
            >
              <div className="bg-gradient-to-r from-pink-500 to-rose-600 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <Iconify
                      icon="solar:user-bold-duotone"
                      width={24}
                      height={24}
                      className="text-white"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Female Person</h3>
                    <p className="text-white/70 text-sm">
                      Select bride's profile
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <PersonSelector
                  onPersonSelected={handleFemalePersonSelected}
                  label=""
                />

                {selectedFemalePerson && (
                  <div className="mt-4 p-4 bg-pink-500/10 rounded-xl border border-pink-500/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-pink-500/20 rounded-full flex items-center justify-center">
                        <Iconify
                          icon="solar:user-check-bold"
                          width={20}
                          height={20}
                          className="text-pink-500"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {selectedFemalePerson.Name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {selectedFemalePerson.BirthLocation}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Calculate Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <button
                onClick={fetchPrediction}
                disabled={!bothSelected || isCalculating}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/30 hover:-translate-y-0.5"
              >
                {isCalculating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Iconify
                      icon="solar:heart-shine-bold-duotone"
                      width={20}
                      height={20}
                    />
                    Check Compatibility
                  </>
                )}
              </button>

              {/* Progress Bar */}
              {isCalculating && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">
                      Calculating match...
                    </span>
                    <span className="text-xs font-medium text-pink-500">
                      {loadingProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${loadingProgress}%` }}
                      className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full"
                    />
                  </div>
                </div>
              )}
            </motion.div>

            {/* Info Card */}
            {!bothSelected && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
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
                    { step: 1, text: "Select the male person (groom)" },
                    { step: 2, text: "Select the female person (bride)" },
                    { step: 3, text: "Click 'Check Compatibility' to analyze" },
                    { step: 4, text: "View detailed compatibility report" },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-pink-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-pink-500">
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

            {/* Compatibility Factors */}
            {bothSelected && !result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-pink-600 via-rose-600 to-red-600 rounded-2xl p-6 text-white shadow-xl overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-white/20 rounded-xl">
                      <Iconify
                        icon="solar:clipboard-list-bold-duotone"
                        width={24}
                        height={24}
                      />
                    </div>
                    <h3 className="font-semibold">What We Analyze</h3>
                  </div>

                  <div className="space-y-3">
                    {[
                      "Guna Milan (Ashtakoot)",
                      "Varna Compatibility",
                      "Vashya Match",
                      "Tara & Yoni",
                      "Graha Maitri",
                      "Gana & Bhakoot",
                      "Nadi Dosha Check",
                      "Overall Score (36 Points)",
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Iconify
                          icon="solar:check-circle-bold"
                          width={16}
                          height={16}
                          className="text-white/80"
                        />
                        <span className="text-white/90">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {!showOutput || !result ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-card rounded-2xl border border-dashed border-border shadow-sm p-12 flex flex-col items-center justify-center min-h-[600px]"
                >
                  <div className="w-32 h-32 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-full flex items-center justify-center mb-6">
                    <Iconify
                      icon="solar:heart-shine-bold-duotone"
                      width={64}
                      height={64}
                      className="text-pink-500"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    Ready to Find Your Match?
                  </h3>
                  <p className="text-muted-foreground text-center max-w-md mb-8">
                    Select both profiles and click "Check Compatibility" to
                    generate a detailed astrological compatibility report based
                    on Vedic principles.
                  </p>

                  {/* Feature Preview */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
                    {[
                      {
                        icon: "solar:star-bold-duotone",
                        label: "Guna Milan",
                        color: "text-amber-500",
                        bg: "bg-amber-500/10",
                      },
                      {
                        icon: "solar:heart-bold-duotone",
                        label: "Love Match",
                        color: "text-pink-500",
                        bg: "bg-pink-500/10",
                      },
                      {
                        icon: "solar:users-group-rounded-bold-duotone",
                        label: "Family Bond",
                        color: "text-blue-500",
                        bg: "bg-blue-500/10",
                      },
                      {
                        icon: "solar:chart-2-bold-duotone",
                        label: "Score /36",
                        color: "text-purple-500",
                        bg: "bg-purple-500/10",
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className={`flex flex-col items-center gap-2 p-4 ${item.bg} rounded-xl`}
                      >
                        <Iconify
                          icon={item.icon}
                          width={32}
                          height={32}
                          className={item.color}
                        />
                        <span className="text-xs text-foreground font-medium text-center">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Illustration */}
                  <div className="mt-8 opacity-50">
                    <img
                      src="/images/match-making.svg"
                      alt="Match Making"
                      className="w-48 h-48"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Match Score Header */}
                  <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-pink-600 to-rose-600 px-6 py-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                            <Iconify
                              icon="solar:hearts-bold-duotone"
                              width={32}
                              height={32}
                              className="text-white"
                            />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-white">
                              {selectedMalePerson?.Name} &{" "}
                              {selectedFemalePerson?.Name}
                            </h2>
                            <p className="text-white/80">
                              Compatibility Analysis Report
                            </p>
                          </div>
                        </div>

                        {/* Overall Score Circle */}
                        <div className="relative">
                          <svg className="w-24 h-24 transform -rotate-90">
                            <circle
                              cx="48"
                              cy="48"
                              r="40"
                              stroke="currentColor"
                              strokeWidth="6"
                              fill="none"
                              className="text-white/20"
                            />
                            <circle
                              cx="48"
                              cy="48"
                              r="40"
                              stroke="currentColor"
                              strokeWidth="6"
                              fill="none"
                              strokeDasharray={`${((result?.MatchReport?.TotalPoints || 0) / 36) * 251} 251`}
                              strokeLinecap="round"
                              className="text-white"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-bold text-white">
                              {result?.MatchReport?.TotalPoints || 0}
                            </span>
                            <span className="text-xs text-white/70">/ 36</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Score Interpretation */}
                    <div className="p-6 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-500/5 dark:to-rose-500/5">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white dark:bg-card rounded-xl">
                          <Iconify
                            icon={
                              (result?.MatchReport?.TotalPoints || 0) >= 24
                                ? "solar:heart-shine-bold-duotone"
                                : (result?.MatchReport?.TotalPoints || 0) >= 18
                                  ? "solar:heart-bold-duotone"
                                  : "solar:heart-broken-bold-duotone"
                            }
                            width={28}
                            height={28}
                            className={
                              (result?.MatchReport?.TotalPoints || 0) >= 24
                                ? "text-green-500"
                                : (result?.MatchReport?.TotalPoints || 0) >= 18
                                  ? "text-amber-500"
                                  : "text-orange-500"
                            }
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {(result?.MatchReport?.TotalPoints || 0) >= 24
                              ? "Excellent Match!"
                              : (result?.MatchReport?.TotalPoints || 0) >= 18
                                ? "Good Match"
                                : "Fair Match"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {(result?.MatchReport?.TotalPoints || 0) >= 24
                              ? "Highly compatible for marriage"
                              : (result?.MatchReport?.TotalPoints || 0) >= 18
                                ? "Compatible with some considerations"
                                : "May require consultation with astrologer"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Match Report */}
                  <MatchResult
                    maleName={selectedMalePerson?.Name || ""}
                    femaleName={selectedFemalePerson?.Name || ""}
                    result={result?.MatchReport}
                  />

                  {/* Action Buttons */}
                  <div className="mt-6 flex gap-4">
                    <button
                      onClick={() => {
                        setShowOutput(false);
                        setResult(null);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-muted hover:bg-muted/80 text-foreground rounded-xl font-medium transition-colors"
                    >
                      <Iconify
                        icon="solar:refresh-linear"
                        width={20}
                        height={20}
                      />
                      New Analysis
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-colors"
                    >
                      <Iconify
                        icon="solar:printer-bold"
                        width={20}
                        height={20}
                      />
                      Print Report
                    </button>
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
