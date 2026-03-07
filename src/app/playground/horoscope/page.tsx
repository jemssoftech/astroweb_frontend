"use client";

import { useState, useCallback } from "react";
import PageHeader from "@/src/components/PageHeader";
import { motion, AnimatePresence } from "framer-motion";
import PersonSelector from "@/src/components/PersonSelector";
import Iconify from "@/src/components/Iconify";
import { Person } from "@/src/lib/models";
import Swal from "sweetalert2";
import { fetchAllHoroscopeData, HoroscopeData } from "@/src/lib/horoscopeApi";
import { formatValue } from "@/src/utils/formatevalue";
import PlanetDataTable from "@/src/components/horoscope/PlanetDataTable";
import HouseDataTable from "@/src/components/horoscope/HouseDataTable";
import BirthChartSection from "@/src/components/horoscope/BirthChartSection";
import Button from "@/src/components/ui/Button";

type BirthData = {
  location: string;
  time: string;
  date: string;
  offset: string;
};

export default function Horoscope() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [horoscopeData, setHoroscopeData] = useState<HoroscopeData | null>(
    null,
  );
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [birthData, setBirthData] = useState<BirthData | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "planets" | "houses" | "predictions"
  >("overview");

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

  const handleCalculate = async () => {
    if (!selectedPerson) {
      Swal.fire({
        icon: "warning",
        title: "No Person Selected",
        text: "Please select a person first!",
        background: "#1e293b",
        color: "#f1f5f9",
      });
      return;
    }

    setIsCalculating(true);
    setShowOutput(true);
    setLoadingProgress(0);

    try {
      const parsedBirthData = parseBirthData(selectedPerson);
      setBirthData(parsedBirthData);
      setLoadingProgress(10);

      const data = await fetchAllHoroscopeData(
        parsedBirthData.location,
        parsedBirthData.time,
        parsedBirthData.date,
        parsedBirthData.offset,
      );

      setLoadingProgress(70);
      setHoroscopeData(data);
      setLoadingProgress(100);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Horoscope generated successfully",
        timer: 2000,
        showConfirmButton: false,
        background: "#1e293b",
        color: "#f1f5f9",
      });
    } catch (err: unknown) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          err instanceof Error
            ? err.message
            : "An error occurred. Please try again.",
        background: "#1e293b",
        color: "#f1f5f9",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const handlePersonSelected = (person: Person) => {
    setSelectedPerson(person);
    setShowOutput(false);
    setHoroscopeData(null);
  };

  const getValue = (data: unknown, defaultValue: string = "N/A"): string => {
    if (!data) return defaultValue;
    if (typeof data === "object" && data !== null) {
      const val = data as { Payload?: unknown; payload?: unknown };
      if (val.Payload) return String(val.Payload);
      if (val.payload) return String(val.payload);
    }
    return String(data);
  };

  const formatTime = (iso?: string): string => {
    if (!iso) return "-";
    const date = new Date(iso);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  type LocalMeanTime = {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
  };

  const formatLMT = (lmt: LocalMeanTime) => {
    if (!lmt) return "-";
    const date = new Date(
      lmt.year,
      lmt.month - 1,
      lmt.day,
      lmt.hour,
      lmt.minute,
      lmt.second,
    );
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  type DMS = { degrees: number; minutes: number; seconds: number };
  const formatDMS = (val: DMS) => {
    if (!val) return "-";
    return `${val.degrees}° ${val.minutes}′ ${val.seconds}″`;
  };

  const lunarDay = horoscopeData?.lunarDay?.Payload?.LunarDay;
  const yoga = horoscopeData?.nithyaYoga?.Payload?.NithyaYoga;
  const isDayBirth = horoscopeData?.isDayBirth?.Payload?.IsDayBirth;
  const weekdayLord = horoscopeData?.lordOfWeekday?.Payload?.LordOfWeekday;
  const hora = horoscopeData?.horaAtBirth?.Payload?.HoraAtBirth;
  const sunsetTime = horoscopeData?.sunsetTime?.Payload?.SunsetTime;
  const marakaPlanetList =
    horoscopeData?.marakaPlanetList?.Payload?.MarakaPlanetList
      ?.MarakaPlanetList;
  const lmt = horoscopeData?.localMeanTime?.Payload?.LocalMeanTime;
  const ayanamsa = horoscopeData?.ayanamsaDegree?.Payload?.AyanamsaDegree;

  const tabs = [
    { id: "overview", label: "Overview", icon: "solar:home-2-bold-duotone" },
    { id: "planets", label: "Planets", icon: "solar:planet-bold-duotone" },
    { id: "houses", label: "Houses", icon: "solar:buildings-bold-duotone" },
    {
      id: "predictions",
      label: "Predictions",
      icon: "solar:magic-stick-3-bold-duotone",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-2xl p-6 md:p-8 text-white shadow-xl">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Iconify icon="solar:sun-bold-duotone" width={40} height={40} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Horoscope Analysis
                </h1>
                <p className="text-white/80 mt-1">
                  Generate detailed Vedic birth charts and planetary positions
                </p>
              </div>
            </div>

            {selectedPerson && (
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/20">
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
        </div>

        {/* Controls Section */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Person Selector Card */}
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
                disabled={isCalculating || !selectedPerson}
                className="mt-6 w-full py-3.5 px-4 bg-primary text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/25 hover:-translate-y-0.5"
              >
                {isCalculating ? (
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
          <div className="lg:col-span-2">
            {/* Output Section */}
            {showOutput && horoscopeData && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Tab Navigation */}
                <div className="bg-card rounded-2xl border border-border shadow-sm p-2">
                  <div className="flex gap-2 overflow-x-auto">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
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
                    {/* Core Info Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <GlassCard
                        icon="mdi:zodiac-aries"
                        label="Lagna (Ascendant)"
                        value={getValue(
                          horoscopeData?.lagnaSignName?.Payload?.LagnaSignName,
                        )}
                        gradient="from-purple-500 to-indigo-600"
                      />
                      <GlassCard
                        icon="solar:moon-bold-duotone"
                        label="Moon Sign"
                        value={getValue(
                          horoscopeData?.moonSignName?.Payload?.MoonSignName,
                        )}
                        gradient="from-blue-500 to-cyan-600"
                      />
                      <GlassCard
                        icon="solar:stars-bold-duotone"
                        label="Nakshatra"
                        value={
                          horoscopeData?.moonConstellation?.Payload
                            ?.MoonConstellation?.name || "-"
                        }
                        subValue={
                          horoscopeData?.moonConstellation?.Payload
                            ?.MoonConstellation
                            ? `Pada ${horoscopeData.moonConstellation.Payload.MoonConstellation.pada} • Lord: ${horoscopeData.moonConstellation.Payload.MoonConstellation.lord}`
                            : ""
                        }
                        gradient="from-indigo-500 to-purple-600"
                      />
                      <GlassCard
                        icon="solar:calendar-bold-duotone"
                        label="Day of Week"
                        value={getValue(
                          horoscopeData?.dayOfWeek?.Payload?.DayOfWeek,
                        )}
                        gradient="from-emerald-500 to-teal-600"
                      />
                    </div>

                    {/* Panchang Section */}
                    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                      <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/20 rounded-xl">
                            <Iconify
                              icon="solar:calendar-mark-bold-duotone"
                              width={24}
                              height={24}
                              className="text-white"
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white text-lg">
                              Panchang Details
                            </h3>
                            <p className="text-white/70 text-sm">
                              Traditional Hindu calendar elements
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <PanchangCard
                          label="Tithi (Lunar Day)"
                          value={lunarDay ? `${lunarDay.name}` : "-"}
                          subValue={
                            lunarDay
                              ? `Day ${lunarDay.number} • ${lunarDay.percentage.toFixed(1)}%`
                              : ""
                          }
                          icon="solar:moon-stars-bold-duotone"
                        />
                        <PanchangCard
                          label="Yoga"
                          value={yoga?.Name || "-"}
                          subValue={yoga?.Description || ""}
                          icon="solar:meditation-round-bold-duotone"
                        />
                        <PanchangCard
                          label="Karana"
                          value={getValue(
                            horoscopeData?.karana?.Payload?.Karana,
                          )}
                          icon="solar:clock-circle-bold-duotone"
                        />
                        <PanchangCard
                          label="Hora Lord"
                          value={hora?.horaPlanet || "-"}
                          subValue={hora ? `${hora.duration} min` : ""}
                          icon="solar:sun-bold-duotone"
                        />
                        <PanchangCard
                          label="Birth Time"
                          value={
                            isDayBirth === true || isDayBirth === "true"
                              ? "Day Birth ☀️"
                              : "Night Birth 🌙"
                          }
                          icon="solar:sunrise-bold-duotone"
                        />
                        <PanchangCard
                          label="Weekday Lord"
                          value={weekdayLord?.Name || "-"}
                          icon="solar:crown-bold-duotone"
                        />
                        <PanchangCard
                          label="Birth Varna"
                          value={getValue(
                            horoscopeData?.birthVarna?.Payload?.BirthVarna,
                          )}
                          icon="solar:user-speak-bold-duotone"
                        />
                        <PanchangCard
                          label="Sunset Time"
                          value={formatTime(sunsetTime)}
                          icon="solar:sunset-bold-duotone"
                        />
                      </div>
                    </div>

                    {/* Yoni & Bird Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FeatureCard
                        icon="solar:cat-bold-duotone"
                        title="Yoni Kuta Animal"
                        value={getValue(
                          horoscopeData?.yoniKutaAnimal?.Payload
                            ?.YoniKutaAnimal,
                        )}
                        description="Animal symbol for marriage compatibility"
                        color="amber"
                      />
                      <FeatureCard
                        icon="solar:bird-bold-duotone"
                        title="Pancha Pakshi Bird"
                        value={getValue(
                          horoscopeData?.panchaPakshiBirthBird?.Payload
                            ?.PanchaPakshiBirthBird,
                        )}
                        description="Birth bird for activity timing"
                        color="sky"
                      />
                    </div>

                    {/* Kuja Dosha */}
                    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                      <div className="bg-gradient-to-r from-red-500 to-rose-600 px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/20 rounded-xl">
                            <Iconify
                              icon="solar:danger-circle-bold-duotone"
                              width={24}
                              height={24}
                              className="text-white"
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white text-lg">
                              Manglik / Kuja Dosha Analysis
                            </h3>
                            <p className="text-white/70 text-sm">
                              Mars affliction assessment
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-6">
                          <div className="relative">
                            <svg className="w-32 h-32 transform -rotate-90">
                              <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="currentColor"
                                strokeWidth="12"
                                fill="none"
                                className="text-muted"
                              />
                              <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="url(#gradient)"
                                strokeWidth="12"
                                fill="none"
                                strokeDasharray={`${(horoscopeData?.kujaDosaScore?.Payload?.KujaDosaScore || 0) * 3.52} 352`}
                                strokeLinecap="round"
                              />
                              <defs>
                                <linearGradient
                                  id="gradient"
                                  x1="0%"
                                  y1="0%"
                                  x2="100%"
                                  y2="0%"
                                >
                                  <stop offset="0%" stopColor="#ef4444" />
                                  <stop offset="100%" stopColor="#f97316" />
                                </linearGradient>
                              </defs>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-3xl font-bold text-foreground">
                                {horoscopeData?.kujaDosaScore?.Payload
                                  ?.KujaDosaScore || 0}
                                %
                              </span>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-xl font-semibold text-foreground mb-2">
                              Kuja Dosha Score
                            </h4>
                            <p className="text-muted-foreground">
                              Higher score indicates stronger Mars affliction.
                              This affects marriage compatibility and timing.
                            </p>
                            <div className="mt-4 flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                <span className="text-sm text-muted-foreground">
                                  0-25% Low
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <span className="text-sm text-muted-foreground">
                                  26-50% Medium
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <span className="text-sm text-muted-foreground">
                                  51%+ High
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Kartari Yogas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {horoscopeData?.shubKartariPlanets?.Payload
                        ?.ShubKartariPlanets?.length > 0 && (
                        <KartariCard
                          type="shubh"
                          planets={getValue(
                            horoscopeData?.shubKartariPlanets?.Payload
                              ?.ShubKartariPlanets,
                            "None",
                          )}
                          houses={getValue(
                            horoscopeData?.shubKartariHouses?.Payload
                              ?.ShubKartariHouses,
                            "None",
                          )}
                        />
                      )}
                      {horoscopeData?.paapaKartariPlanets?.Payload
                        ?.PaapaKartariPlanets?.length > 0 && (
                        <KartariCard
                          type="paapa"
                          planets={getValue(
                            horoscopeData?.paapaKartariPlanets?.Payload
                              ?.PaapaKartariPlanets,
                            "None",
                          )}
                          houses={getValue(
                            horoscopeData?.paapaKartariHouses?.Payload
                              ?.PaapaKartariHouses,
                            "None",
                          )}
                        />
                      )}
                    </div>

                    {/* Maraka Planets */}
                    {marakaPlanetList && (
                      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-slate-600 to-slate-700 px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-xl">
                              <Iconify
                                icon="solar:shield-warning-bold-duotone"
                                width={24}
                                height={24}
                                className="text-white"
                              />
                            </div>
                            <div>
                              <h3 className="font-semibold text-white text-lg">
                                Maraka Planets
                              </h3>
                              <p className="text-white/70 text-sm">
                                Associated with 2nd and 7th houses
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="flex flex-wrap gap-2">
                            {marakaPlanetList.map(
                              (item: string, index: number) => (
                                <span
                                  key={index}
                                  className="px-4 py-2 bg-muted rounded-xl text-foreground font-medium"
                                >
                                  {item}
                                </span>
                              ),
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Technical Details */}
                    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                      <div className="px-6 py-4 border-b border-border">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-xl">
                            <Iconify
                              icon="solar:settings-bold-duotone"
                              width={24}
                              height={24}
                              className="text-primary"
                            />
                          </div>
                          <h3 className="font-semibold text-foreground text-lg">
                            Technical Details
                          </h3>
                        </div>
                      </div>
                      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <TechDetail
                          icon="solar:clock-circle-bold-duotone"
                          label="Local Mean Time"
                          value={formatLMT(lmt)}
                        />
                        <TechDetail
                          icon="solar:compass-bold-duotone"
                          label="Ayanamsa"
                          value={formatDMS(ayanamsa)}
                        />
                        <TechDetail
                          icon="solar:sun-2-bold-duotone"
                          label="Day Duration"
                          value={`${horoscopeData?.dayDurationHours?.Payload?.DayDurationHours} hours`}
                        />
                      </div>
                    </div>

                    {/* Strength Charts */}
                    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                      <div className="px-6 py-4 border-b border-border">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-xl">
                            <Iconify
                              icon="solar:chart-bold-duotone"
                              width={24}
                              height={24}
                              className="text-primary"
                            />
                          </div>
                          <h3 className="font-semibold text-foreground text-lg">
                            Strength Analysis
                          </h3>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
                        <div className="p-6">
                          <h4 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
                            <Iconify
                              icon="solar:planet-bold"
                              width={18}
                              height={18}
                            />
                            Planet Strength (Shadbala)
                          </h4>
                          <StrengthChart
                            data={
                              horoscopeData?.planetShadbalaPinda?.Payload
                                ?.PlanetShadbalaPinda
                            }
                            type="planet"
                          />
                        </div>
                        <div className="p-6">
                          <h4 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
                            <Iconify
                              icon="solar:buildings-bold"
                              width={18}
                              height={18}
                            />
                            House Strength
                          </h4>
                          <StrengthChart
                            data={
                              horoscopeData?.houseStrength?.Payload
                                ?.HouseStrength
                            }
                            type="house"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Birth Chart */}
                    {birthData && (
                      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-border">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-xl">
                              <Iconify
                                icon="solar:chart-square-bold-duotone"
                                width={24}
                                height={24}
                                className="text-primary"
                              />
                            </div>
                            <h3 className="font-semibold text-foreground text-lg">
                              Birth Chart (Kundli)
                            </h3>
                          </div>
                        </div>
                        <BirthChartSection
                          birthData={birthData}
                          ayanamsa="RAMAN"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Planets Tab */}
                {activeTab === "planets" &&
                  horoscopeData?.allPlanetData?.Payload?.AllPlanetData
                    ?.AllPlanetData && (
                    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                      <div className="px-6 py-4 border-b border-border">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-500/10 rounded-xl">
                            <Iconify
                              icon="solar:planet-bold-duotone"
                              width={24}
                              height={24}
                              className="text-purple-500"
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground text-lg">
                              All Planet Data
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Detailed planetary positions and states
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="overflow-x-auto p-4">
                        <PlanetDataTable
                          data={
                            horoscopeData?.allPlanetData?.Payload?.AllPlanetData
                              ?.AllPlanetData
                          }
                        />
                      </div>
                    </div>
                  )}

                {/* Houses Tab */}
                {activeTab === "houses" &&
                  horoscopeData?.allHouseData?.Payload?.AllHouseData && (
                    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                      <div className="px-6 py-4 border-b border-border">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-500/10 rounded-xl">
                            <Iconify
                              icon="solar:buildings-bold-duotone"
                              width={24}
                              height={24}
                              className="text-blue-500"
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground text-lg">
                              All House Data
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              House cusps and significations
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="overflow-x-auto p-4">
                        <HouseDataTable
                          data={
                            horoscopeData?.allHouseData?.Payload?.AllHouseData
                              ?.AllHouseData
                          }
                        />
                      </div>
                    </div>
                  )}

                {/* Predictions Tab */}
                {activeTab === "predictions" &&
                  horoscopeData?.horoscopePredictions?.Payload
                    ?.HoroscopePredictions && (
                    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                      <div className="px-6 py-4 border-b border-border">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-amber-500/10 rounded-xl">
                            <Iconify
                              icon="solar:magic-stick-3-bold-duotone"
                              width={24}
                              height={24}
                              className="text-amber-500"
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground text-lg">
                              Horoscope Predictions
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Detailed life predictions based on your chart
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <PredictionsList
                          data={
                            horoscopeData?.horoscopePredictions?.Payload
                              ?.HoroscopePredictions
                          }
                        />
                      </div>
                    </div>
                  )}
              </div>
            )}

            {/* Empty State */}
            {!showOutput && (
              <div className="bg-card rounded-2xl border border-border shadow-sm p-12 text-center">
                <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center mb-6">
                  <Iconify
                    icon="solar:sun-bold-duotone"
                    width={40}
                    height={40}
                    className="text-muted-foreground"
                  />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No Horoscope Generated
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Select a person and click "Calculate" to generate a detailed
                  Vedic horoscope analysis.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ SUB-COMPONENTS ============

function GlassCard({
  icon,
  label,
  value,
  subValue,
  gradient,
}: {
  icon: string;
  label: string;
  value: string;
  subValue?: string;
  gradient: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-5 text-white shadow-lg`}
    >
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <Iconify icon={icon} width={28} height={28} className="mb-3 opacity-90" />
      <p className="text-white/70 text-sm mb-1">{label}</p>
      <p className="text-xl font-bold">{value}</p>
      {subValue && <p className="text-white/70 text-xs mt-1">{subValue}</p>}
    </div>
  );
}

function PanchangCard({
  label,
  value,
  subValue,
  icon,
}: {
  label: string;
  value: string;
  subValue?: string;
  icon: string;
}) {
  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-500/10 dark:to-amber-500/10 p-4 rounded-xl border border-orange-200/50 dark:border-orange-500/20">
      <div className="flex items-center gap-2 mb-2">
        <Iconify
          icon={icon}
          width={18}
          height={18}
          className="text-orange-600 dark:text-orange-400"
        />
        <p className="text-xs font-medium text-orange-600 dark:text-orange-400">
          {label}
        </p>
      </div>
      <p className="font-semibold text-orange-800 dark:text-orange-200">
        {formatValue(value)}
      </p>
      {subValue && (
        <p className="text-xs text-orange-600/70 dark:text-orange-300/70 mt-1">
          {subValue}
        </p>
      )}
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  value,
  description,
  color,
}: {
  icon: string;
  title: string;
  value: string;
  description: string;
  color: "amber" | "sky";
}) {
  const colorClasses = {
    amber: {
      bg: "bg-amber-500/10",
      text: "text-amber-600 dark:text-amber-400",
      value: "text-amber-600 dark:text-amber-400",
    },
    sky: {
      bg: "bg-sky-500/10",
      text: "text-sky-600 dark:text-sky-400",
      value: "text-sky-600 dark:text-sky-400",
    },
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-3 rounded-xl ${colorClasses[color].bg}`}>
          <Iconify
            icon={icon}
            width={28}
            height={28}
            className={colorClasses[color].text}
          />
        </div>
        <div>
          <h4 className="font-semibold text-foreground">{title}</h4>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <p className={`text-3xl font-bold ${colorClasses[color].value}`}>
        {value}
      </p>
    </div>
  );
}

function KartariCard({
  type,
  planets,
  houses,
}: {
  type: "shubh" | "paapa";
  planets: string;
  houses: string;
}) {
  const isShubh = type === "shubh";

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      <div
        className={`px-6 py-4 ${isShubh ? "bg-gradient-to-r from-green-500 to-emerald-600" : "bg-gradient-to-r from-red-500 to-rose-600"}`}
      >
        <div className="flex items-center gap-3">
          <Iconify
            icon={
              isShubh
                ? "solar:check-circle-bold-duotone"
                : "solar:close-circle-bold-duotone"
            }
            width={24}
            height={24}
            className="text-white"
          />
          <h3 className="font-semibold text-white">
            {isShubh ? "Shubh Kartari (Benefic)" : "Paapa Kartari (Malefic)"}
          </h3>
        </div>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Affected Planets</p>
          <p className="font-medium text-foreground">{planets}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Affected Houses</p>
          <p className="font-medium text-foreground">{houses}</p>
        </div>
      </div>
    </div>
  );
}

function TechDetail({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 bg-muted rounded-lg">
        <Iconify
          icon={icon}
          width={20}
          height={20}
          className="text-muted-foreground"
        />
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className="font-mono font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

type StrengthItem = {
  Name?: string;
  name?: string;
  Strength?: number | string;
  strength?: number | string;
};

type StrengthData = StrengthItem[] | Record<string, number | string>;

function StrengthChart({
  data,
  type,
}: {
  data: StrengthData | null | undefined;
  type: "planet" | "house";
}) {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-48 bg-muted/50 rounded-xl">
        <p className="text-muted-foreground text-sm">
          No strength data available
        </p>
      </div>
    );
  }

  const items = Array.isArray(data)
    ? data.map((item, i) => ({
        name:
          item.Name ||
          item.name ||
          (type === "house" ? `House ${i + 1}` : `Planet ${i + 1}`),
        strength: Number(item.Strength ?? item.strength ?? 0),
      }))
    : Object.entries(data).map(([key, value]) => ({
        name: key,
        strength: Number(value),
      }));

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 bg-muted/50 rounded-xl">
        <p className="text-muted-foreground text-sm">
          No strength data available
        </p>
      </div>
    );
  }

  const maxStrength = Math.max(...items.map((i) => i.strength));

  const colors = [
    "from-red-400 to-red-500",
    "from-orange-400 to-orange-500",
    "from-amber-400 to-amber-500",
    "from-emerald-400 to-emerald-500",
    "from-blue-400 to-blue-500",
    "from-purple-400 to-purple-500",
    "from-pink-400 to-pink-500",
    "from-indigo-400 to-indigo-500",
    "from-cyan-400 to-cyan-500",
    "from-teal-400 to-teal-500",
    "from-lime-400 to-lime-500",
    "from-rose-400 to-rose-500",
  ];

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const percentage = (item.strength / maxStrength) * 100;
        return (
          <div key={i} className="group">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-foreground">
                {item.name}
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                {item.strength.toFixed(1)}
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${colors[i % colors.length]} rounded-full transition-all duration-500`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

type Prediction = {
  title?: string;
  description?: string;
  category?: string;
  weight?: number;
};

const getPredictionText = (pred: any) => {
  if (typeof pred === "string") {
    return { title: "Prediction", description: pred };
  }
  return {
    title: pred.title || pred.Title || "Prediction",
    description: pred.description || pred.Description || "-",
    category: pred.category,
    weight: pred.weight,
  };
};

function PredictionsList({ data }: { data: Prediction[] }) {
  const predictions = Array.isArray(data) ? data : [];

  if (predictions.length === 0) {
    return (
      <div className="text-center py-12">
        <Iconify
          icon="solar:magic-stick-3-bold-duotone"
          width={48}
          height={48}
          className="mx-auto text-muted-foreground/50 mb-4"
        />
        <p className="text-muted-foreground">No predictions available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {predictions.map((pred, i) => {
        const p = getPredictionText(pred);
        return (
          <div
            key={i}
            className="p-5 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-xl border-l-4 border-indigo-500 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <h4 className="font-semibold text-indigo-800 dark:text-indigo-300">
                {p.title}
              </h4>
              {p.category && (
                <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-medium">
                  {p.category}
                </span>
              )}
            </div>
            <p className="text-foreground/80">{p.description}</p>
            {typeof p.weight === "number" && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Strength:</span>
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden max-w-32">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${Math.min(p.weight * 10, 100)}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-indigo-600">
                  {p.weight}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
