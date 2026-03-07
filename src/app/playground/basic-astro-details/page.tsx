"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Iconify from "@/src/components/Iconify";
import PersonSelector from "@/src/components/PersonSelector";
import { Person } from "@/src/lib/models";
import Swal from "sweetalert2";
import { getUser } from "@/src/lib/auth";

// ============ Types matching API Response ============

interface BirthDetails {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  latitude: number;
  longitude: number;
  timezone: number;
  seconds: number;
  ayanamsha: number;
  sunrise: string;
  sunset: string;
}

interface AstroDetails {
  ascendant: string;
  ascendant_lord: string;
  Varna: string;
  Vashya: string;
  Yoni: string;
  Gan: string;
  Nadi: string;
  SignLord: string;
  sign: string;
  Naksahtra: string;
  NaksahtraLord: string;
  Charan: number;
  Yog: string;
  Karan: string;
  Tithi: string;
  yunja: string;
  tatva: string;
  name_alphabet: string;
  paya: string;
}

interface PlanetExtended {
  id: number;
  name: string;
  fullDegree: number;
  normDegree: number;
  speed: number;
  isRetro: string;
  sign: string;
  signLord: string;
  nakshatra: string;
  nakshatraLord: string;
  nakshatra_pad: number;
  house: number;
  is_planet_set: boolean;
  planet_awastha: string;
}

interface BhavMadhya {
  house: number;
  degree: number;
  sign: string;
  norm_degree: number;
  sign_id: number;
}

interface GhatChakra {
  month: string;
  tithi: string;
  day: string;
  nakshatra: string;
  yog: string;
  karan: string;
  pahar: string;
  moon: string;
}

interface BasicAstroData {
  birth_details: BirthDetails;
  astro_details: AstroDetails;
  planets_extended: PlanetExtended[];
  bhav_madhya: {
    ascendant: number;
    midheaven: number;
    ayanamsha: number;
    bhav_madhya: BhavMadhya[];
    bhav_sandhi: BhavMadhya[];
  };
  ghat_chakra: GhatChakra;
}

interface ApiResponse {
  status: "Pass" | "Partial" | "Fail";
  message: string;
  data: BasicAstroData;
  meta: {
    total_apis: number;
    successful: number;
    failed: number;
    success_rate: string;
    timestamp: string;
  };
}

// ============ Constants ============

const ZODIAC_SIGNS = [
  {
    name: "Aries",
    icon: "mdi:zodiac-aries",
    element: "Fire",
    color: "from-red-500 to-orange-500",
  },
  {
    name: "Taurus",
    icon: "mdi:zodiac-taurus",
    element: "Earth",
    color: "from-emerald-500 to-teal-500",
  },
  {
    name: "Gemini",
    icon: "mdi:zodiac-gemini",
    element: "Air",
    color: "from-amber-400 to-yellow-500",
  },
  {
    name: "Cancer",
    icon: "mdi:zodiac-cancer",
    element: "Water",
    color: "from-blue-400 to-cyan-500",
  },
  {
    name: "Leo",
    icon: "mdi:zodiac-leo",
    element: "Fire",
    color: "from-orange-500 to-amber-500",
  },
  {
    name: "Virgo",
    icon: "mdi:zodiac-virgo",
    element: "Earth",
    color: "from-green-500 to-emerald-500",
  },
  {
    name: "Libra",
    icon: "mdi:zodiac-libra",
    element: "Air",
    color: "from-pink-400 to-rose-500",
  },
  {
    name: "Scorpio",
    icon: "mdi:zodiac-scorpio",
    element: "Water",
    color: "from-red-600 to-rose-600",
  },
  {
    name: "Sagittarius",
    icon: "mdi:zodiac-sagittarius",
    element: "Fire",
    color: "from-purple-500 to-indigo-500",
  },
  {
    name: "Capricorn",
    icon: "mdi:zodiac-capricorn",
    element: "Earth",
    color: "from-slate-600 to-gray-700",
  },
  {
    name: "Aquarius",
    icon: "mdi:zodiac-aquarius",
    element: "Air",
    color: "from-cyan-500 to-blue-500",
  },
  {
    name: "Pisces",
    icon: "mdi:zodiac-pisces",
    element: "Water",
    color: "from-violet-400 to-purple-500",
  },
];

const PLANET_CONFIG: Record<string, { icon: string; gradient: string }> = {
  SUN: {
    icon: "solar:sun-bold-duotone",
    gradient: "from-orange-500 to-amber-500",
  },
  MOON: {
    icon: "solar:moon-bold-duotone",
    gradient: "from-slate-300 to-slate-400",
  },
  MARS: { icon: "mdi:triangle", gradient: "from-red-500 to-rose-600" },
  MERCURY: { icon: "mdi:atom", gradient: "from-green-500 to-emerald-600" },
  JUPITER: {
    icon: "mdi:circle-outline",
    gradient: "from-yellow-500 to-amber-600",
  },
  VENUS: {
    icon: "solar:heart-bold-duotone",
    gradient: "from-pink-500 to-rose-500",
  },
  SATURN: {
    icon: "mdi:hexagon-outline",
    gradient: "from-indigo-500 to-purple-600",
  },
  RAHU: {
    icon: "mdi:debug-step-over",
    gradient: "from-indigo-600 to-violet-600",
  },
  KETU: {
    icon: "mdi:debug-step-into",
    gradient: "from-purple-600 to-violet-600",
  },
  URANUS: { icon: "mdi:orbit", gradient: "from-cyan-500 to-blue-500" },
  NEPTUNE: { icon: "mdi:waves", gradient: "from-blue-600 to-indigo-600" },
  PLUTO: { icon: "mdi:atom-variant", gradient: "from-gray-600 to-slate-700" },
  Ascendant: {
    icon: "solar:arrow-up-bold",
    gradient: "from-primary to-indigo-600",
  },
};

const ELEMENT_COLORS: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  Fire: {
    bg: "bg-red-500/10",
    text: "text-red-500",
    border: "border-red-500/20",
  },
  Earth: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-500",
    border: "border-emerald-500/20",
  },
  Air: {
    bg: "bg-sky-500/10",
    text: "text-sky-500",
    border: "border-sky-500/20",
  },
  Water: {
    bg: "bg-blue-500/10",
    text: "text-blue-500",
    border: "border-blue-500/20",
  },
};

export default function BasicAstroPage() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(false);
  const [astroData, setAstroData] = useState<ApiResponse | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [user, setUser] = useState(getUser());
  useEffect(() => {
    setUser(getUser());
  }, []);

  const handlePersonSelected = (person: Person) => {
    setSelectedPerson(person);
    setAstroData(null);
  };

  const getBirthDataPayload = (person: Person) => {
    const birthDate = new Date(person.BirthTime);
    let tzone = 5.5;
    if (person.TimezoneOffset) {
      const match = person.TimezoneOffset.match(/([+-]?)(\d+):(\d+)/);
      if (match) {
        const sign = match[1] === "-" ? -1 : 1;
        tzone = sign * (parseInt(match[2]) + parseInt(match[3]) / 60);
      }
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
    };
  };

  const fetchAstroData = async () => {
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
      const payload = getBirthDataPayload(selectedPerson);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NEXT_JS_API_URL}/api/basic-astro-details`,
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

      const result: ApiResponse = await response.json();
      if (result.status === "Fail") {
        throw new Error(result.message || "Failed to fetch data");
      }
      setAstroData(result);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to get data";
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

  const getSignConfig = (signName: string) => {
    return (
      ZODIAC_SIGNS.find(
        (s) => s.name.toLowerCase() === signName?.toLowerCase(),
      ) || ZODIAC_SIGNS[0]
    );
  };

  const getElementColor = (signName: string) => {
    const sign = getSignConfig(signName);
    return ELEMENT_COLORS[sign.element] || ELEMENT_COLORS.Fire;
  };

  const formatDegree = (deg: number) => {
    const d = Math.floor(deg);
    const m = Math.floor((deg - d) * 60);
    const s = Math.round(((deg - d) * 60 - m) * 60);
    return `${d}° ${m}' ${s}"`;
  };

  const tabs = [
    { key: "overview", label: "Overview", icon: "solar:home-2-bold-duotone" },
    { key: "planets", label: "Planets", icon: "solar:planet-bold-duotone" },
    { key: "houses", label: "Houses", icon: "solar:buildings-bold-duotone" },
    {
      key: "panchang",
      label: "Panchang",
      icon: "solar:calendar-mark-bold-duotone",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-700 rounded-2xl p-6 md:p-8 text-white shadow-xl"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>

          <div className="absolute top-4 right-8 opacity-20">
            <Iconify icon="solar:star-ring-bold" width={100} height={100} />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Iconify
                  icon="solar:chart-square-bold-duotone"
                  width={40}
                  height={40}
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium">
                    Vedic Astrology
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Basic Astrology Details
                </h1>
                <p className="text-white/80 mt-1">
                  Complete birth chart analysis with planetary positions
                </p>
              </div>
            </div>

            {selectedPerson && astroData && (
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
                    Choose a profile
                  </p>
                </div>
              </div>

              <PersonSelector
                onPersonSelected={handlePersonSelected}
                label=""
              />

              <button
                onClick={fetchAstroData}
                disabled={loading || !selectedPerson}
                className="mt-6 w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Iconify
                      icon="solar:chart-square-bold-duotone"
                      width={20}
                      height={20}
                    />
                    Get Birth Chart
                  </>
                )}
              </button>
            </motion.div>

            {/* Quick Stats Card */}
            {astroData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700 rounded-2xl p-6 text-white shadow-xl overflow-hidden relative"
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
                    <h3 className="font-semibold">Quick Stats</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                      <span className="text-sm text-white/70">Ascendant</span>
                      <span className="font-bold">
                        {astroData.data.astro_details.ascendant}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                      <span className="text-sm text-white/70">Moon Sign</span>
                      <span className="font-bold">
                        {astroData.data.astro_details.sign}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                      <span className="text-sm text-white/70">Nakshatra</span>
                      <span className="font-bold">
                        {astroData.data.astro_details.Naksahtra}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Success Rate Card */}
            {astroData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card rounded-2xl border border-border shadow-sm p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-500/10 rounded-xl">
                    <Iconify
                      icon="solar:check-circle-bold-duotone"
                      width={24}
                      height={24}
                      className="text-green-500"
                    />
                  </div>
                  <h3 className="font-semibold text-foreground">API Status</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Success Rate
                    </span>
                    <span className="font-bold text-green-500">
                      {astroData.meta.success_rate}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                      style={{ width: astroData.meta.success_rate }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {astroData.meta.successful}/{astroData.meta.total_apis} APIs
                    successful
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            <AnimatePresence mode="wait">
              {astroData ? (
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

                  {/* Tab Content */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {activeTab === "overview" && (
                        <OverviewContent
                          data={astroData}
                          formatDegree={formatDegree}
                          getSignConfig={getSignConfig}
                          getElementColor={getElementColor}
                        />
                      )}
                      {activeTab === "planets" && (
                        <PlanetsContent
                          data={astroData}
                          formatDegree={formatDegree}
                          getSignConfig={getSignConfig}
                        />
                      )}
                      {activeTab === "houses" && (
                        <HousesContent
                          data={astroData}
                          formatDegree={formatDegree}
                          getElementColor={getElementColor}
                        />
                      )}
                      {activeTab === "panchang" && (
                        <PanchangContent
                          data={astroData}
                          getElementColor={getElementColor}
                        />
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
                        icon="solar:chart-square-bold-duotone"
                        width={48}
                        height={48}
                        className="text-muted-foreground/50"
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      No Chart Generated
                    </h3>
                    <p className="text-muted-foreground text-center max-w-md mb-8">
                      Select a person and click "Get Birth Chart" to view
                      complete astrological details.
                    </p>

                    {/* Feature Preview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
                      {[
                        {
                          icon: "solar:home-2-bold-duotone",
                          label: "Overview",
                          color: "text-indigo-500",
                        },
                        {
                          icon: "solar:planet-bold-duotone",
                          label: "Planets",
                          color: "text-purple-500",
                        },
                        {
                          icon: "solar:buildings-bold-duotone",
                          label: "Houses",
                          color: "text-blue-500",
                        },
                        {
                          icon: "solar:calendar-mark-bold-duotone",
                          label: "Panchang",
                          color: "text-amber-500",
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

// ============ Tab Content Components ============

function OverviewContent({
  data,
  formatDegree,
  getSignConfig,
  getElementColor,
}: any) {
  const birth = data.data.birth_details;
  const astro = data.data.astro_details;
  const ascSign = getSignConfig(astro.ascendant);
  const moonSign = getSignConfig(astro.sign);

  return (
    <div className="space-y-6">
      {/* Hero Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div
          className={`relative overflow-hidden bg-gradient-to-br ${ascSign.color} rounded-2xl p-6 text-white shadow-lg`}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <Iconify
              icon={ascSign.icon}
              width={40}
              height={40}
              className="mb-3 opacity-90"
            />
            <p className="text-white/70 text-sm mb-1">Ascendant (Lagna)</p>
            <p className="text-2xl font-bold">{astro.ascendant}</p>
            <p className="text-white/70 text-sm mt-1">
              Lord: {astro.ascendant_lord}
            </p>
          </div>
        </div>

        <div
          className={`relative overflow-hidden bg-gradient-to-br ${moonSign.color} rounded-2xl p-6 text-white shadow-lg`}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <Iconify
              icon={moonSign.icon}
              width={40}
              height={40}
              className="mb-3 opacity-90"
            />
            <p className="text-white/70 text-sm mb-1">Moon Sign (Rashi)</p>
            <p className="text-2xl font-bold">{astro.sign}</p>
            <p className="text-white/70 text-sm mt-1">Lord: {astro.SignLord}</p>
          </div>
        </div>
      </div>

      {/* Birth Details */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Iconify
                icon="solar:calendar-bold-duotone"
                width={24}
                height={24}
                className="text-white"
              />
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">
                Birth Details
              </h3>
              <p className="text-white/70 text-sm">
                Date, time, and location information
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Date",
              value: `${birth.day}/${birth.month}/${birth.year}`,
              icon: "solar:calendar-linear",
            },
            {
              label: "Time",
              value: `${birth.hour}:${String(birth.minute).padStart(2, "0")}`,
              icon: "solar:clock-circle-linear",
            },
            {
              label: "Timezone",
              value: `UTC+${birth.timezone}`,
              icon: "solar:map-point-linear",
            },
            {
              label: "Latitude",
              value: `${birth.latitude.toFixed(4)}°`,
              icon: "solar:compass-linear",
            },
            {
              label: "Longitude",
              value: `${birth.longitude.toFixed(4)}°`,
              icon: "solar:compass-linear",
            },
            {
              label: "Ayanamsha",
              value: formatDegree(birth.ayanamsha),
              icon: "solar:infinity-linear",
            },
            {
              label: "Sunrise",
              value: birth.sunrise,
              icon: "solar:sunrise-linear",
            },
            {
              label: "Sunset",
              value: birth.sunset,
              icon: "solar:sunset-linear",
            },
          ].map((item, idx) => (
            <div key={idx} className="p-4 bg-muted/50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Iconify
                  icon={item.icon}
                  width={16}
                  height={16}
                  className="text-muted-foreground"
                />
                <p className="text-xs text-muted-foreground uppercase">
                  {item.label}
                </p>
              </div>
              <p className="font-semibold text-foreground">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Nakshatra */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
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
                Nakshatra Details
              </h3>
              <p className="text-white/70 text-sm">Birth star information</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-foreground">
                {astro.Naksahtra}
              </p>
              <p className="text-muted-foreground mt-1">
                Lord: {astro.NaksahtraLord} • Pada: {astro.Charan}
              </p>
            </div>
            <div className="text-6xl">{astro.name_alphabet}</div>
          </div>
        </div>
      </div>

      {/* Panchang Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          {
            label: "Tithi",
            value: astro.Tithi,
            icon: "solar:moon-bold-duotone",
            color: "from-blue-500 to-indigo-500",
          },
          {
            label: "Yoga",
            value: astro.Yog,
            icon: "solar:meditation-round-bold-duotone",
            color: "from-purple-500 to-violet-500",
          },
          {
            label: "Karana",
            value: astro.Karan,
            icon: "solar:clock-circle-bold-duotone",
            color: "from-emerald-500 to-teal-500",
          },
          {
            label: "Varna",
            value: astro.Varna,
            icon: "solar:user-speak-bold-duotone",
            color: "from-pink-500 to-rose-500",
          },
          {
            label: "Nadi",
            value: astro.Nadi,
            icon: "solar:wind-bold-duotone",
            color: "from-cyan-500 to-blue-500",
          },
          {
            label: "Yoni",
            value: astro.Yoni,
            icon: "solar:cat-bold-duotone",
            color: "from-amber-500 to-orange-500",
          },
          {
            label: "Gana",
            value: astro.Gan,
            icon: "solar:users-group-rounded-bold-duotone",
            color: "from-red-500 to-rose-500",
          },
          {
            label: "Vashya",
            value: astro.Vashya,
            icon: "solar:magnet-bold-duotone",
            color: "from-indigo-500 to-purple-500",
          },
          {
            label: "Tatva",
            value: astro.tatva,
            icon: "solar:fire-bold-duotone",
            color: "from-orange-500 to-amber-500",
          },
          {
            label: "Paya",
            value: astro.paya,
            icon: "solar:water-sun-bold-duotone",
            color: "from-blue-500 to-cyan-500",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className={`relative overflow-hidden bg-gradient-to-br ${item.color} rounded-xl p-4 text-white`}
          >
            <Iconify
              icon={item.icon}
              width={24}
              height={24}
              className="mb-2 opacity-80"
            />
            <p className="text-xs text-white/70 uppercase">{item.label}</p>
            <p className="font-bold mt-1">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlanetsContent({ data, formatDegree, getSignConfig }: any) {
  const planets = data.data.planets_extended;

  return (
    <div className="space-y-4">
      {planets.map((planet: any, idx: number) => {
        const config = PLANET_CONFIG[planet.name] || {
          icon: "mdi:circle",
          gradient: "from-gray-500 to-slate-500",
        };
        const isRetro = planet.isRetro === "true";
        const signConfig = getSignConfig(planet.sign);

        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div
              className={`bg-gradient-to-r ${config.gradient} px-6 py-4 flex items-center justify-between`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Iconify
                    icon={config.icon}
                    width={24}
                    height={24}
                    className="text-white"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-lg">
                    {planet.name}
                  </h4>
                  <p className="text-white/70 text-sm">
                    {planet.planet_awastha}
                  </p>
                </div>
              </div>
              {isRetro && (
                <span className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs font-bold">
                  ℞ RETRO
                </span>
              )}
            </div>
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase mb-1">
                  Sign
                </p>
                <div className="flex items-center gap-2">
                  <Iconify
                    icon={signConfig.icon}
                    width={20}
                    height={20}
                    className="text-foreground"
                  />
                  <p className="font-semibold text-foreground">{planet.sign}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase mb-1">
                  Degree
                </p>
                <p className="font-semibold text-foreground font-mono">
                  {formatDegree(planet.normDegree)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase mb-1">
                  Nakshatra
                </p>
                <p className="font-semibold text-foreground">
                  {planet.nakshatra} ({planet.nakshatra_pad})
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase mb-1">
                  House
                </p>
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">
                  {planet.house}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function HousesContent({ data, formatDegree, getElementColor }: any) {
  const bhav = data.data.bhav_madhya;

  return (
    <div className="space-y-6">
      {/* Cusp Info */}
      <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-primary/10 rounded-xl">
            <p className="text-sm text-muted-foreground mb-1">Ascendant</p>
            <p className="text-2xl font-bold text-primary">
              {formatDegree(bhav.ascendant)}
            </p>
          </div>
          <div className="p-4 bg-purple-500/10 rounded-xl">
            <p className="text-sm text-muted-foreground mb-1">Midheaven (MC)</p>
            <p className="text-2xl font-bold text-purple-500">
              {formatDegree(bhav.midheaven)}
            </p>
          </div>
        </div>
      </div>

      {/* Houses Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {bhav.bhav_madhya.map((house: any, idx: number) => {
          const sign = ZODIAC_SIGNS.find((s) => s.name === house.sign);

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={`relative overflow-hidden bg-gradient-to-br ${sign?.color || "from-gray-500 to-slate-500"} rounded-2xl p-5 text-white shadow-lg`}
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <p className="text-white/70 text-sm mb-1">
                  House {house.house}
                </p>
                <div className="flex items-center gap-2 mb-3">
                  <Iconify
                    icon={sign?.icon || "mdi:circle"}
                    width={24}
                    height={24}
                  />
                  <p className="font-bold">{house.sign}</p>
                </div>
                <p className="text-white/80 text-sm font-mono">
                  {formatDegree(house.norm_degree)}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function PanchangContent({ data, getElementColor }: any) {
  const ghat = data.data.ghat_chakra;
  const astro = data.data.astro_details;

  return (
    <div className="space-y-6">
      {/* Panchang Summary */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
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
                Panchang Elements
              </h3>
              <p className="text-white/70 text-sm">
                Traditional Hindu calendar components
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            {
              label: "Tithi",
              value: astro.Tithi,
              icon: "solar:moon-stars-bold-duotone",
            },
            {
              label: "Nakshatra",
              value: astro.Naksahtra,
              icon: "solar:stars-bold-duotone",
            },
            {
              label: "Yoga",
              value: astro.Yog,
              icon: "solar:meditation-round-bold-duotone",
            },
            {
              label: "Karana",
              value: astro.Karan,
              icon: "solar:clock-circle-bold-duotone",
            },
            {
              label: "Vara (Day)",
              value: astro.yunja,
              icon: "solar:calendar-bold-duotone",
            },
            { label: "Paksha", value: "—", icon: "solar:moon-bold-duotone" },
          ].map((item, idx) => (
            <div key={idx} className="p-4 bg-muted/50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Iconify
                  icon={item.icon}
                  width={20}
                  height={20}
                  className="text-primary"
                />
                <p className="text-xs text-muted-foreground uppercase">
                  {item.label}
                </p>
              </div>
              <p className="font-semibold text-foreground">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Ghat Chakra Warning */}
      <div className="bg-card rounded-2xl border border-red-200 dark:border-red-500/20 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-rose-600 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Iconify
                icon="solar:danger-triangle-bold-duotone"
                width={24}
                height={24}
                className="text-white"
              />
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">Ghat Chakra</h3>
              <p className="text-white/70 text-sm">
                Inauspicious periods to avoid
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Month",
              value: ghat.month,
              icon: "solar:calendar-bold-duotone",
            },
            {
              label: "Tithi",
              value: ghat.tithi,
              icon: "solar:moon-bold-duotone",
            },
            {
              label: "Day",
              value: ghat.day,
              icon: "solar:calendar-mark-bold-duotone",
            },
            {
              label: "Nakshatra",
              value: ghat.nakshatra,
              icon: "solar:stars-bold-duotone",
            },
            {
              label: "Yoga",
              value: ghat.yog,
              icon: "solar:meditation-round-bold-duotone",
            },
            {
              label: "Karana",
              value: ghat.karan,
              icon: "solar:clock-circle-bold-duotone",
            },
            {
              label: "Pahar",
              value: ghat.pahar,
              icon: "solar:hourglass-bold-duotone",
            },
            {
              label: "Moon",
              value: ghat.moon,
              icon: "solar:moon-stars-bold-duotone",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 bg-red-50/50 dark:bg-red-500/5 rounded-xl border border-red-200/50 dark:border-red-500/10"
            >
              <div className="flex items-center gap-2 mb-2">
                <Iconify
                  icon={item.icon}
                  width={16}
                  height={16}
                  className="text-red-500"
                />
                <p className="text-xs text-red-700 dark:text-red-400 uppercase">
                  {item.label}
                </p>
              </div>
              <p className="font-semibold text-foreground">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Insight */}
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
              Understanding Panchang
            </h4>
            <p className="text-sm text-amber-700/80 dark:text-amber-200/80">
              The Panchang is the Hindu calendar system based on lunar phases.
              It consists of five elements (Pancha means five): Tithi, Vara,
              Nakshatra, Yoga, and Karana. These elements help determine
              auspicious times for various activities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
