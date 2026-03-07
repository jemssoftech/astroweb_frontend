"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Iconify from "@/src/components/Iconify";
import PersonSelector from "@/src/components/PersonSelector";
import Button from "@/src/components/ui/Button";
import { Person } from "@/src/lib/models";
import { CommonTools } from "@/src/lib/utils";
import api from "@/src/lib/api";
import Swal from "sweetalert2";

/* -------------------------------------------
 * Interfaces
 * ------------------------------------------- */
interface PlanetNature {
  GOOD: string[];
  BAD: string[];
  KILLER: string[];
  YOGAKARAKA: string[];
}

interface NakshatraReport {
  physical: string[];
  character: string[];
  education: string[];
  family: string[];
  health: string[];
}

interface AscendantReport {
  ascendant?: string;
  report: string;
}

interface PlanetReport {
  planet: string;
  report: string;
}

interface TimeSlice {
  Index: number;
  StdTime: string;
  Year: number;
  Month: number;
  Date: number;
  Hour: number;
  Events: string[];
}

interface PredictionData {
  ChartId: string;
  TimeSlices: TimeSlice[];
}

interface PredictionResult {
  nature: PlanetNature | null;
  nakshatra: NakshatraReport | null;
  ascendant: AscendantReport | null;
  rashiReports: PlanetReport[];
  houseReports: PlanetReport[];
  prediction: PredictionData | null;
}

// Planet icons mapping
const PLANET_ICONS: Record<string, string> = {
  sun: "solar:sun-bold-duotone",
  moon: "solar:moon-bold-duotone",
  mars: "mdi:zodiac-aries",
  mercury: "mdi:zodiac-virgo",
  jupiter: "mdi:zodiac-sagittarius",
  venus: "mdi:zodiac-taurus",
  saturn: "mdi:zodiac-capricorn",
};

const PLANET_COLORS: Record<
  string,
  { gradient: string; bg: string; text: string }
> = {
  sun: {
    gradient: "from-orange-500 to-amber-500",
    bg: "bg-orange-500/10",
    text: "text-orange-500",
  },
  moon: {
    gradient: "from-slate-400 to-slate-500",
    bg: "bg-slate-500/10",
    text: "text-slate-500",
  },
  mars: {
    gradient: "from-red-500 to-rose-600",
    bg: "bg-red-500/10",
    text: "text-red-500",
  },
  mercury: {
    gradient: "from-green-500 to-emerald-600",
    bg: "bg-green-500/10",
    text: "text-green-500",
  },
  jupiter: {
    gradient: "from-amber-500 to-yellow-600",
    bg: "bg-amber-500/10",
    text: "text-amber-500",
  },
  venus: {
    gradient: "from-pink-500 to-rose-500",
    bg: "bg-pink-500/10",
    text: "text-pink-500",
  },
  saturn: {
    gradient: "from-indigo-500 to-purple-600",
    bg: "bg-indigo-500/10",
    text: "text-indigo-500",
  },
};

export default function LifePredictor() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<
    "overview" | "nakshatra" | "planets" | "timeline"
  >("overview");
  const [expandedPlanet, setExpandedPlanet] = useState<string | null>(null);

  // Save result to server logs

  const handleMalePersonSelected = (person: Person) => {
    setSelectedPerson(person);
    setResult(null);
  };

  const getBirthDataPayload = (person: Person) => {
    const date = new Date(person.BirthTime);
    let tzone = 0;
    if (person.TimezoneOffset) {
      const [h, m] = person.TimezoneOffset.replace("+", "").split(":");
      const sign = person.TimezoneOffset.startsWith("-") ? -1 : 1;
      tzone = sign * (parseInt(h) + parseInt(m) / 60);
    }

    return {
      day: date.getUTCDate(),
      month: date.getUTCMonth() + 1,
      year: date.getUTCFullYear(),
      hour: date.getUTCHours(),
      min: date.getUTCMinutes(),
      lat: person.Latitude,
      lon: person.Longitude,
      tzone: tzone,
      location: {
        latitude: person.Latitude,
        longitude: person.Longitude,
        timezone: tzone,
      },
    };
  };

  const handleCalculate = async () => {
    if (!selectedPerson) {
      Swal.fire({
        icon: "warning",
        title: "Select Person",
        text: "Please select a person to generate life predictions.",
      });
      return;
    }

    setIsCalculating(true);
    setLoadingProgress(10);
    setResult(null);

    try {
      const payload = getBirthDataPayload(selectedPerson);
      const planets = [
        "sun",
        "moon",
        "mars",
        "mercury",
        "jupiter",
        "venus",
        "saturn",
      ];

      // 1. Single API call — gets nature, nakshatra, ascendant, AND all rashi/house reports
      const baseResponse = await api.post("/api/mainapi/life-path", payload);
      const baseResData = baseResponse as {
        status: number;
        data: Record<string, any>;
        error?: string;
      };

      if (baseResData.status !== 200 || !baseResData.data) {
        throw new Error(baseResData.error || "Failed to fetch life path data");
      }

      const baseData = baseResData.data;
      setLoadingProgress(100);

      // 2. Extract per-planet data from the single response
      const rashiReports: PlanetReport[] = [];
      const houseReports: PlanetReport[] = [];

      for (const planet of planets) {
        // The key names come back without leading slash
        const rashiKey = `general_rashi_report${planet}`;
        const houseKey = `general_house_report${planet}`;

        if (baseData?.[rashiKey]?.rashi_report) {
          rashiReports.push({
            planet,
            report: baseData[rashiKey].rashi_report,
          });
        }
        if (baseData?.[houseKey]?.house_report) {
          houseReports.push({
            planet,
            report: baseData[houseKey].house_report,
          });
        }
      }

      setResult({
        nature: (baseData?.planet_nature as PlanetNature) || null,
        ascendant: baseData?.general_ascendant_report
          ? {
              ascendant:
                (baseData.general_ascendant_report as Record<string, any>)
                  .asc_report?.ascendant ||
                (baseData.general_ascendant_report as Record<string, any>)
                  .ascendant ||
                "Unknown",
              report:
                (baseData.general_ascendant_report as Record<string, any>)
                  ?.asc_report?.report ||
                (baseData.general_ascendant_report as Record<string, any>)
                  ?.report ||
                (typeof baseData.general_ascendant_report === "string"
                  ? baseData.general_ascendant_report
                  : ""),
            }
          : null,
        nakshatra:
          (baseData?.general_nakshatra_report as NakshatraReport) || null,
        rashiReports,
        houseReports,
        prediction: (baseData?.prediction as PredictionData) || null,
      });
    } catch (err: unknown) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err instanceof Error ? err.message : "Something went wrong!",
      });
    } finally {
      setIsCalculating(false);
      CommonTools.HideLoading();
    }
  };
  console.log(result);
  const tabs = [
    { id: "overview", label: "Overview", icon: "solar:chart-bold-duotone" },
    { id: "nakshatra", label: "Nakshatra", icon: "solar:stars-bold-duotone" },
    { id: "planets", label: "Planets", icon: "solar:planet-bold-duotone" },
    {
      id: "timeline",
      label: "Timeline",
      icon: "solar:clock-circle-bold-duotone",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-linear-to-r from-indigo-600 via-purple-600 to-violet-700 rounded-2xl p-6 md:p-8 text-white shadow-xl"
        >
          {/* Background decorations */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>

          {/* Decorative elements */}
          <div className="absolute top-4 right-8 opacity-20">
            <Iconify icon="solar:chart-2-bold" width={100} height={100} />
          </div>
          <div className="absolute bottom-4 right-24 opacity-10">
            <Iconify icon="solar:planet-bold" width={60} height={60} />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Iconify
                  icon="solar:chart-bold-duotone"
                  width={40}
                  height={40}
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium">
                    Life Analysis
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Life Predictor
                </h1>
                <p className="text-white/80 mt-1">
                  Comprehensive life predictions based on planetary positions
                </p>
              </div>
            </div>

            {/* Selected Person Badge */}
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

        {/* Main Layout */}
        <div className="grid lg:grid-cols-4 gap-6">
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
                    Choose a profile to analyze
                  </p>
                </div>
              </div>

              <PersonSelector
                onPersonSelected={handleMalePersonSelected}
                label=""
              />

              {/* Calculate Button */}
              <div className="mt-6">
                <Button
                  handleCalculate={handleCalculate}
                  isCalculating={isCalculating}
                  selectedPerson={selectedPerson}
                  loadingProgress={loadingProgress}
                />
              </div>

              {/* Loading Progress */}
              {isCalculating && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">
                      Analyzing...
                    </span>
                    <span className="text-xs font-medium text-primary">
                      {loadingProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${loadingProgress}%` }}
                      className="bg-linear-to-r from-primary to-purple-500 h-2 rounded-full"
                    />
                  </div>
                </div>
              )}
            </motion.div>

            {/* Quick Guide */}
            {!result && (
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
                    What You&apos;ll Get
                  </h3>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      icon: "solar:yin-yang-bold-duotone",
                      text: "Planetary nature analysis",
                    },
                    {
                      icon: "solar:user-bold-duotone",
                      text: "Ascendant personality report",
                    },
                    {
                      icon: "solar:stars-bold-duotone",
                      text: "Nakshatra life insights",
                    },
                    {
                      icon: "solar:planet-bold-duotone",
                      text: "Planetary house impacts",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Iconify
                        icon={item.icon}
                        width={20}
                        height={20}
                        className="text-primary"
                      />
                      <span className="text-sm text-muted-foreground">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Planet Nature Summary Card */}
            {result?.nature && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-linear-to-br from-indigo-600 via-purple-600 to-violet-700 rounded-2xl p-6 text-white shadow-xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <Iconify
                      icon="solar:yin-yang-bold-duotone"
                      width={24}
                      height={24}
                    />
                  </div>
                  <h3 className="font-semibold">Planet Summary</h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-500/20 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold">
                      {result.nature.GOOD?.length || 0}
                    </p>
                    <p className="text-xs text-white/70">Benefic</p>
                  </div>
                  <div className="bg-red-500/20 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold">
                      {result.nature.BAD?.length || 0}
                    </p>
                    <p className="text-xs text-white/70">Malefic</p>
                  </div>
                  <div className="bg-amber-500/20 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold">
                      {result.nature.KILLER?.length || 0}
                    </p>
                    <p className="text-xs text-white/70">Maraka</p>
                  </div>
                  <div className="bg-blue-500/20 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold">
                      {result.nature.YOGAKARAKA?.length || 0}
                    </p>
                    <p className="text-xs text-white/70">Yogakaraka</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Main Content Area */}
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
                          key={tab.id}
                          onClick={() =>
                            setActiveTab(
                              tab.id as "overview" | "nakshatra" | "planets",
                            )
                          }
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                            activeTab === tab.id
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

                  {/* Overview Tab */}
                  {activeTab === "overview" && (
                    <div className="space-y-6">
                      {/* Planet Nature Grid */}
                      {result.nature && (
                        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                          <div className="bg-linear-to-r from-indigo-500 to-purple-600 px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-white/20 rounded-xl">
                                <Iconify
                                  icon="solar:yin-yang-bold-duotone"
                                  width={24}
                                  height={24}
                                  className="text-white"
                                />
                              </div>
                              <div>
                                <h3 className="font-semibold text-white text-lg">
                                  Planetary Nature
                                </h3>
                                <p className="text-white/70 text-sm">
                                  Classification of planets for your chart
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <NatureCard
                              title="Benefic"
                              subtitle="Positive influence"
                              planets={result.nature.GOOD}
                              gradient="from-green-500 to-emerald-600"
                              icon="solar:check-circle-bold-duotone"
                            />
                            <NatureCard
                              title="Malefic"
                              subtitle="Challenging energy"
                              planets={result.nature.BAD}
                              gradient="from-red-500 to-rose-600"
                              icon="solar:danger-triangle-bold-duotone"
                            />
                            <NatureCard
                              title="Maraka"
                              subtitle="Health signifier"
                              planets={result.nature.KILLER}
                              gradient="from-orange-500 to-amber-600"
                              icon="solar:shield-warning-bold-duotone"
                            />
                            <NatureCard
                              title="Yogakaraka"
                              subtitle="Special benefic"
                              planets={result.nature.YOGAKARAKA}
                              gradient="from-blue-500 to-indigo-600"
                              icon="solar:star-bold-duotone"
                            />
                          </div>
                        </div>
                      )}

                      {/* Ascendant Report */}
                      {result.ascendant && (
                        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                          <div className="bg-linear-to-r from-violet-500 to-purple-600 px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-white/20 rounded-xl">
                                <Iconify
                                  icon="solar:user-speak-bold-duotone"
                                  width={24}
                                  height={24}
                                  className="text-white"
                                />
                              </div>
                              <div>
                                <h3 className="font-semibold text-white text-lg">
                                  Ascendant: {result.ascendant.ascendant}
                                </h3>
                                <p className="text-white/70 text-sm">
                                  Your rising sign personality
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="p-6">
                            <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
                              {result.ascendant.report}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Nakshatra Tab */}
                  {activeTab === "nakshatra" && result.nakshatra && (
                    <div className="space-y-6">
                      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                        <div className="bg-linear-to-r from-amber-500 to-orange-600 px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-xl">
                              <Iconify
                                icon="solar:stars-bold-duotone"
                                width={24}
                                height={24}
                                className="text-white"
                              />
                            </div>
                            <div>
                              <h3 className="font-semibold text-white text-lg">
                                Nakshatra Insights
                              </h3>
                              <p className="text-white/70 text-sm">
                                Birth star life analysis
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <NakshatraCard
                            title="Character"
                            content={result.nakshatra.character}
                            icon="solar:user-bold-duotone"
                            gradient="from-purple-500 to-violet-600"
                          />
                          <NakshatraCard
                            title="Physical"
                            content={result.nakshatra.physical}
                            icon="solar:running-bold-duotone"
                            gradient="from-blue-500 to-indigo-600"
                          />
                          <NakshatraCard
                            title="Education"
                            content={result.nakshatra.education}
                            icon="solar:square-academic-cap-bold-duotone"
                            gradient="from-emerald-500 to-teal-600"
                          />
                          <NakshatraCard
                            title="Family"
                            content={result.nakshatra.family}
                            icon="solar:home-2-bold-duotone"
                            gradient="from-pink-500 to-rose-600"
                          />
                          <NakshatraCard
                            title="Health"
                            content={result.nakshatra.health}
                            icon="solar:heart-pulse-bold-duotone"
                            gradient="from-red-500 to-rose-600"
                            className="md:col-span-2"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Planets Tab */}
                  {activeTab === "planets" && (
                    <div className="space-y-4">
                      {result.rashiReports.map((r, i) => {
                        const houseReport = result.houseReports.find(
                          (h) => h.planet === r.planet,
                        );
                        const colors =
                          PLANET_COLORS[r.planet] || PLANET_COLORS.sun;
                        const isExpanded = expandedPlanet === r.planet;

                        return (
                          <motion.div
                            key={r.planet}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
                          >
                            {/* Planet Header */}
                            <button
                              onClick={() =>
                                setExpandedPlanet(isExpanded ? null : r.planet)
                              }
                              className={`w-full bg-linear-to-r ${colors.gradient} px-6 py-4 flex items-center justify-between`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-xl">
                                  <Iconify
                                    icon={
                                      PLANET_ICONS[r.planet] ||
                                      "solar:planet-bold-duotone"
                                    }
                                    width={24}
                                    height={24}
                                    className="text-white"
                                  />
                                </div>
                                <div className="text-left">
                                  <h3 className="font-semibold text-white text-lg capitalize">
                                    {r.planet}
                                  </h3>
                                  <p className="text-white/70 text-sm">
                                    Rashi & House Impact
                                  </p>
                                </div>
                              </div>
                              <Iconify
                                icon={
                                  isExpanded
                                    ? "solar:alt-arrow-up-linear"
                                    : "solar:alt-arrow-down-linear"
                                }
                                width={24}
                                height={24}
                                className="text-white"
                              />
                            </button>

                            {/* Planet Content */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="overflow-hidden"
                                >
                                  <div className="p-6 space-y-6">
                                    {/* Rashi Impact */}
                                    <div
                                      className={`p-4 rounded-xl ${colors.bg} border ${colors.text.replace("text-", "border-")}/20`}
                                    >
                                      <div className="flex items-center gap-2 mb-3">
                                        <Iconify
                                          icon="solar:chart-square-bold-duotone"
                                          width={20}
                                          height={20}
                                          className={colors.text}
                                        />
                                        <h4
                                          className={`font-semibold ${colors.text}`}
                                        >
                                          Rashi Impact
                                        </h4>
                                      </div>
                                      <p className="text-foreground/80 text-sm leading-relaxed">
                                        {r.report}
                                      </p>
                                    </div>

                                    {/* House Impact */}
                                    {houseReport && (
                                      <div className="p-4 rounded-xl bg-muted/50 border border-border">
                                        <div className="flex items-center gap-2 mb-3">
                                          <Iconify
                                            icon="solar:buildings-bold-duotone"
                                            width={20}
                                            height={20}
                                            className="text-foreground"
                                          />
                                          <h4 className="font-semibold text-foreground">
                                            House Impact
                                          </h4>
                                        </div>
                                        <p className="text-foreground/80 text-sm leading-relaxed">
                                          {houseReport.report}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}

                  {/* Timeline Tab */}
                  {activeTab === "timeline" && result.prediction && (
                    <div className="space-y-6">
                      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                        <div className="bg-linear-to-r from-blue-500 to-indigo-600 px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-xl">
                              <Iconify
                                icon="solar:clock-circle-bold-duotone"
                                width={24}
                                height={24}
                                className="text-white"
                              />
                            </div>
                            <div>
                              <h3 className="font-semibold text-white text-lg">
                                Life Timeline
                              </h3>
                              <p className="text-white/70 text-sm">
                                Future predictions and time slices
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="space-y-4">
                            {result.prediction.TimeSlices.map((slice, idx) => (
                              <TimelineItem key={idx} slice={slice} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Insight Footer */}
                  <div className="bg-linear-to-br from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-2xl border border-indigo-200/50 dark:border-indigo-500/20 p-6">
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
                          Understanding Your Chart
                        </h4>
                        <p className="text-sm text-indigo-700/80 dark:text-indigo-200/80">
                          This analysis provides insights based on Vedic
                          astrology principles. Benefic planets support growth,
                          while malefic planets present challenges that help
                          build strength. Yogakaraka planets bring special
                          blessings when properly activated.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Empty State */}
                  <div className="bg-card rounded-2xl border border-dashed border-border shadow-sm p-12 flex flex-col items-center justify-center min-h-[500px]">
                    <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                      <Iconify
                        icon="solar:chart-bold-duotone"
                        width={48}
                        height={48}
                        className="text-muted-foreground/50"
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      No Analysis Generated
                    </h3>
                    <p className="text-muted-foreground text-center max-w-md mb-8">
                      Select a person and click &quot;Calculate&quot; to
                      generate a comprehensive life prediction analysis.
                    </p>

                    {/* Feature Preview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
                      {[
                        {
                          icon: "solar:yin-yang-bold-duotone",
                          label: "Planet Nature",
                          color: "text-purple-500",
                        },
                        {
                          icon: "solar:user-speak-bold-duotone",
                          label: "Ascendant",
                          color: "text-blue-500",
                        },
                        {
                          icon: "solar:stars-bold-duotone",
                          label: "Nakshatra",
                          color: "text-amber-500",
                        },
                        {
                          icon: "solar:planet-bold-duotone",
                          label: "Planetary Reports",
                          color: "text-indigo-500",
                        },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="flex flex-col items-center gap-2 p-4 bg-muted/50 rounded-xl"
                        >
                          <Iconify
                            icon={item.icon}
                            width={32}
                            height={32}
                            className={item.color}
                          />
                          <span className="text-xs text-muted-foreground text-center">
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

// ----------------------
// Sub-components
// ----------------------

interface NatureCardProps {
  title: string;
  subtitle: string;
  planets: string[];
  gradient: string;
  icon: string;
}

function NatureCard({
  title,
  subtitle,
  planets,
  gradient,
  icon,
}: NatureCardProps) {
  const hasPlanets = planets && planets.length > 0;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${hasPlanets ? `bg-linear-to-br ${gradient}` : "bg-muted"} p-5 ${hasPlanets ? "text-white" : "text-muted-foreground"}`}
    >
      {hasPlanets && (
        <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      )}
      <div className="relative z-10">
        <Iconify
          icon={icon}
          width={28}
          height={28}
          className={hasPlanets ? "text-white/80" : ""}
        />
        <h4 className="font-bold mt-2">{title}</h4>
        <p className={`text-xs ${hasPlanets ? "text-white/70" : ""} mb-3`}>
          {subtitle}
        </p>

        {hasPlanets ? (
          <div className="flex flex-wrap gap-1">
            {planets.map((p) => (
              <span
                key={p}
                className="text-xs font-medium bg-white/20 backdrop-blur-sm px-2 py-1 rounded-lg"
              >
                {p}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs italic">None</p>
        )}
      </div>
    </div>
  );
}

interface NakshatraCardProps {
  title: string;
  content: string[];
  icon: string;
  gradient: string;
  className?: string;
}

function NakshatraCard({
  title,
  content,
  icon,
  gradient,
  className = "",
}: NakshatraCardProps) {
  if (!content || content.length === 0) return null;

  return (
    <div
      className={`bg-card rounded-xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow ${className}`}
    >
      <div
        className={`bg-linear-to-r ${gradient} px-4 py-3 flex items-center gap-2`}
      >
        <Iconify icon={icon} width={20} height={20} className="text-white" />
        <h4 className="font-semibold text-white">{title}</h4>
      </div>
      <div className="p-4 space-y-2">
        {content.map((text, idx) => (
          <p key={idx} className="text-foreground/80 text-sm leading-relaxed">
            {text}
          </p>
        ))}
      </div>
    </div>
  );
}

function TimelineItem({ slice }: { slice: TimeSlice }) {
  const date = new Date(slice.StdTime);
  const formattedDate = date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border group">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
          {slice.Index + 1}
        </div>
        <div className="w-0.5 grow bg-border my-2" />
      </div>
      <div className="pb-4">
        <p className="font-bold text-foreground">{formattedDate}</p>
        <p className="text-sm text-muted-foreground mt-1">
          Time slice prediction for this period.
        </p>
        {slice.Events && slice.Events.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {slice.Events.map((event, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-primary/5 text-primary text-xs rounded-md border border-primary/10"
              >
                {typeof event === "string" ? event : JSON.stringify(event)}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
