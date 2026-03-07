"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Iconify from "@/src/components/Iconify";
import PersonSelector from "@/src/components/PersonSelector";
import { Person } from "@/src/lib/models";
import Swal from "sweetalert2";
import { getUser } from "@/src/lib/auth";
import api from "@/src/lib/api";
import { AxiosError } from "axios";

// ============ Types ============

interface PujaSuggestion {
  status: boolean;
  priority: number;
  title: string;
  puja_id: string;
  summary: string;
  one_line: string;
}

interface PujaSuggestionData {
  summary: string;
  suggestions: PujaSuggestion[];
}

interface GemDetails {
  name: string;
  gem_key: string;
  semi_gem: string;
  wear_finger: string;
  weight_caret: string;
  wear_metal: string;
  wear_day: string;
  gem_deity: string;
}

interface GemSuggestionData {
  LIFE: GemDetails;
  BENEFIC: GemDetails;
  LUCKY: GemDetails;
}

interface RudrakshaSuggestionData {
  img_url: string;
  rudraksha_key: string;
  name: string;
  recommend: string;
  detail: string;
}

interface SadhesatiRemediesData {
  what_is_sadhesati: string;
  remedies: string[];
}

interface RemediesData {
  puja_suggestion: PujaSuggestionData | null;
  gem_suggestion: GemSuggestionData | null;
  rudraksha_suggestion: RudrakshaSuggestionData | null;
  sadhesati_remedies: SadhesatiRemediesData | null;
}

interface ApiMeta {
  total_apis: number;
  successful: number;
  failed: number;
  failed_endpoints?: string[];
  success_rate: string;
  timestamp: string;
}

interface RemediesResponse {
  status: "Pass" | "Partial" | "Fail";
  message: string;
  data: RemediesData;
  meta: ApiMeta;
}

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

// ============ Constants ============

const GEM_TYPE_CONFIG: Record<
  string,
  { label: string; description: string; gradient: string; icon: string }
> = {
  LIFE: {
    label: "Life Stone",
    description: "Primary gemstone based on your Lagna lord",
    gradient: "from-emerald-500 to-teal-600",
    icon: "solar:heart-pulse-bold-duotone",
  },
  BENEFIC: {
    label: "Benefic Stone",
    description: "Gemstone for overall beneficial effects",
    gradient: "from-blue-500 to-indigo-600",
    icon: "solar:star-bold-duotone",
  },
  LUCKY: {
    label: "Lucky Stone",
    description: "Gemstone to enhance luck and fortune",
    gradient: "from-purple-500 to-violet-600",
    icon: "solar:medal-star-bold-duotone",
  },
};

const PLANET_GRADIENTS: Record<string, string> = {
  Sun: "from-orange-500 to-amber-500",
  Moon: "from-slate-300 to-slate-400",
  Mars: "from-red-500 to-rose-600",
  Mercury: "from-green-500 to-emerald-600",
  Jupiter: "from-yellow-500 to-amber-600",
  Venus: "from-pink-500 to-rose-500",
  Saturn: "from-indigo-600 to-purple-700",
  Rahu: "from-slate-600 to-gray-700",
  Ketu: "from-amber-600 to-orange-700",
};

const GEM_IMAGES: Record<string, string> = {
  emerald: "💚",
  blue_sapphire: "💙",
  diamond: "💎",
  ruby: "❤️",
  pearl: "🤍",
  yellow_sapphire: "💛",
  hessonite: "🧡",
  cats_eye: "🟢",
  coral: "🔴",
  red_coral: "🔴",
  gomed: "🧡",
  pukhraj: "💛",
  panna: "💚",
  moti: "🤍",
  manik: "❤️",
};

const TABS = [
  { key: "overview", label: "Overview", icon: "solar:home-2-bold-duotone" },
  { key: "gemstones", label: "Gemstones", icon: "solar:gem-bold-duotone" },
  {
    key: "rudraksha",
    label: "Rudraksha",
    icon: "solar:star-ring-bold-duotone",
  },
  { key: "puja", label: "Puja", icon: "solar:hand-heart-bold-duotone" },
  {
    key: "sadhesati",
    label: "Sade Sati",
    icon: "solar:shield-check-bold-duotone",
  },
] as const;

type TabKey = (typeof TABS)[number]["key"];

// ============ Helper Functions ============

const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const responseData = error.response?.data as ApiErrorResponse | undefined;
    return responseData?.message || responseData?.error || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
};

const showErrorAlert = (message: string) => {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: message,
    background: "#1e293b",
    color: "#f1f5f9",
  });
};

const showWarningAlert = (message: string) => {
  Swal.fire({
    icon: "warning",
    title: "Partial Data",
    text: message,
    timer: 3000,
    showConfirmButton: false,
    background: "#1e293b",
    color: "#f1f5f9",
  });
};

// ============ Main Component ============

export default function RemediesPage() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [remediesData, setRemediesData] = useState<RemediesResponse | null>(
    null,
  );
  const [imageLoadError, setImageLoadError] = useState(false);

  const user = getUser() as { userApiKey?: string; apikey?: string } | null;
  const apikey = user?.userApiKey || user?.apikey || "";

  const handlePersonSelected = (person: Person) => {
    setSelectedPerson(person);
    setActiveTab("overview");
    setRemediesData(null);
    setImageLoadError(false);
  };

  const getBirthDataPayload = (person: Person) => {
    const birthDate = new Date(person.BirthTime);
    let tzone = 0;

    if (person.TimezoneOffset) {
      const cleanOffset = person.TimezoneOffset.replace("+", "");
      const [h, m] = cleanOffset.split(":");
      const sign = person.TimezoneOffset.startsWith("-") ? -1 : 1;
      tzone = sign * (parseInt(h, 10) + parseInt(m, 10) / 60);
    }

    return {
      day: birthDate.getUTCDate(),
      month: birthDate.getUTCMonth() + 1,
      year: birthDate.getUTCFullYear(),
      hour: birthDate.getUTCHours(),
      min: birthDate.getUTCMinutes(),
      lat: person.Latitude,
      lon: person.Longitude,
      tzone,
    };
  };

  const fetchRemedies = async () => {
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

    setLoading(true);

    try {
      const payload = getBirthDataPayload(selectedPerson);
      const res = await api.post<RemediesResponse>("/api/mainapi/remedies", {
        ...payload,
        apikey,
      });

      const response = res.data;
      console.log("API Response:", response);

      if (response.status === "Pass" || response.status === "Partial") {
        setRemediesData(response);

        if (response.status === "Partial") {
          showWarningAlert(response.message);
        }
      } else {
        showErrorAlert(response.message || "Failed to fetch remedies");
      }
    } catch (error) {
      console.error("Fetch Remedies Error:", error);
      showErrorAlert(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-700 rounded-2xl p-6 md:p-8 text-white shadow-xl"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>

          <div className="absolute top-4 right-8 opacity-20">
            <Iconify icon="solar:star-rings-bold" width={100} height={100} />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Iconify
                  icon="solar:magic-stick-3-bold-duotone"
                  width={40}
                  height={40}
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium">
                    Vedic Solutions
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Astrological Remedies
                </h1>
                <p className="text-white/80 mt-1">
                  Personalized gemstone, rudraksha, and ritual recommendations
                </p>
              </div>
            </div>

            {selectedPerson && remediesData && (
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
                onClick={fetchRemedies}
                disabled={loading || !selectedPerson}
                className="mt-6 w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 hover:-translate-y-0.5"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Iconify
                      icon="solar:magic-stick-3-bold-duotone"
                      width={20}
                      height={20}
                    />
                    Get Remedies
                  </>
                )}
              </button>
            </motion.div>

            {/* Quick Stats */}
            {remediesData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-white/20 rounded-xl">
                      <Iconify
                        icon="solar:chart-2-bold-duotone"
                        width={24}
                        height={24}
                      />
                    </div>
                    <h3 className="font-semibold">Remedy Summary</h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                      <span className="text-sm text-white/80">
                        Success Rate
                      </span>
                      <span className="font-bold">
                        {remediesData.meta.success_rate}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                      <span className="text-sm text-white/80">APIs Used</span>
                      <span className="font-bold">
                        {remediesData.meta.total_apis}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                      <span className="text-sm text-white/80">Suggestions</span>
                      <span className="font-bold">
                        {remediesData.data.puja_suggestion?.suggestions
                          ?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Remedy Types Info */}
            {!remediesData && (
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
                      icon: "solar:gem-bold-duotone",
                      label: "Gemstones",
                      desc: "3 powerful stones",
                      color: "text-emerald-500",
                    },
                    {
                      icon: "solar:star-ring-bold-duotone",
                      label: "Rudraksha",
                      desc: "Sacred bead",
                      color: "text-amber-500",
                    },
                    {
                      icon: "solar:hand-heart-bold-duotone",
                      label: "Puja",
                      desc: "Ritual suggestions",
                      color: "text-purple-500",
                    },
                    {
                      icon: "solar:shield-check-bold-duotone",
                      label: "Sade Sati",
                      desc: "Saturn remedies",
                      color: "text-indigo-500",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Iconify
                        icon={item.icon}
                        width={20}
                        height={20}
                        className={item.color}
                      />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {item.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            <AnimatePresence mode="wait">
              {remediesData ? (
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
                      {TABS.map((tab) => (
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
                          data={remediesData.data}
                          setActiveTab={setActiveTab}
                        />
                      )}
                      {activeTab === "gemstones" && (
                        <GemstonesContent data={remediesData.data} />
                      )}
                      {activeTab === "rudraksha" && (
                        <RudrakshaContent
                          data={remediesData.data}
                          imageLoadError={imageLoadError}
                          setImageLoadError={setImageLoadError}
                        />
                      )}
                      {activeTab === "puja" && (
                        <PujaContent data={remediesData.data} />
                      )}
                      {activeTab === "sadhesati" && (
                        <SadhesatiContent data={remediesData.data} />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              ) : (
                <EmptyState />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ Empty State Component ============

function EmptyState() {
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-card rounded-2xl border border-dashed border-border shadow-sm p-12 flex flex-col items-center justify-center min-h-[500px]">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <Iconify
            icon="solar:magic-stick-3-bold-duotone"
            width={48}
            height={48}
            className="text-muted-foreground/50"
          />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Discover Your Remedies
        </h3>
        <p className="text-muted-foreground text-center max-w-md mb-8">
          Select a person and click &quot;Get Remedies&quot; to receive
          personalized astrological solutions based on your birth chart.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
          {[
            {
              icon: "solar:gem-bold-duotone",
              label: "Gemstones",
              color: "text-emerald-500",
              bg: "bg-emerald-500/10",
            },
            {
              icon: "solar:star-ring-bold-duotone",
              label: "Rudraksha",
              color: "text-amber-500",
              bg: "bg-amber-500/10",
            },
            {
              icon: "solar:hand-heart-bold-duotone",
              label: "Puja",
              color: "text-purple-500",
              bg: "bg-purple-500/10",
            },
            {
              icon: "solar:shield-check-bold-duotone",
              label: "Sade Sati",
              color: "text-indigo-500",
              bg: "bg-indigo-500/10",
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
              <span className="text-xs text-foreground font-medium">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ============ Tab Content Components ============

interface TabContentProps {
  data: RemediesData;
}

function OverviewContent({
  data,
  setActiveTab,
}: TabContentProps & { setActiveTab: (tab: TabKey) => void }) {
  const {
    gem_suggestion: gems,
    rudraksha_suggestion: rudraksha,
    puja_suggestion: puja,
  } = data;

  const statsItems = [
    {
      label: "Life Stone",
      value: gems?.LIFE?.name,
      icon: "solar:gem-bold-duotone",
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      label: "Benefic Stone",
      value: gems?.BENEFIC?.name,
      icon: "solar:star-bold-duotone",
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      label: "Rudraksha",
      value: rudraksha?.name?.replace(" Rudraksha", "").split(" ")[0],
      icon: "solar:star-ring-bold-duotone",
      gradient: "from-amber-500 to-orange-600",
    },
    {
      label: "Puja Count",
      value: `${puja?.suggestions?.length || 0} Suggested`,
      icon: "solar:hand-heart-bold-duotone",
      gradient: "from-purple-500 to-violet-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsItems.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`relative overflow-hidden bg-gradient-to-br ${item.gradient} rounded-2xl p-5 text-white shadow-lg`}
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <Iconify
                icon={item.icon}
                width={28}
                height={28}
                className="mb-3 opacity-90"
              />
              <p className="text-white/70 text-sm mb-1">{item.label}</p>
              <p className="font-bold text-lg">{item.value || "—"}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Gemstones Preview */}
      {gems && (
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <Iconify
                  icon="solar:gem-bold-duotone"
                  width={24}
                  height={24}
                  className="text-white"
                />
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">
                  Gemstone Recommendations
                </h3>
                <p className="text-white/70 text-sm">
                  Based on your planetary positions
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab("gemstones")}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-white text-sm font-medium transition-colors"
            >
              View Details
              <Iconify icon="solar:arrow-right-linear" width={16} height={16} />
            </button>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {(
              Object.entries(gems) as [keyof GemSuggestionData, GemDetails][]
            ).map(([type, gem]) => {
              const config = GEM_TYPE_CONFIG[type];
              return (
                <div key={type} className="p-4 bg-muted/50 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">
                      {GEM_IMAGES[gem.gem_key] || "💎"}
                    </span>
                    <div>
                      <p className="font-semibold text-foreground">
                        {gem.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {config?.label}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Wear on:</span>
                    <span className="font-medium text-foreground">
                      {gem.wear_day}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Rudraksha & Puja Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rudraksha && (
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Iconify
                    icon="solar:star-ring-bold-duotone"
                    width={24}
                    height={24}
                    className="text-white"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Rudraksha</h3>
                  <p className="text-white/70 text-sm">Sacred bead</p>
                </div>
              </div>
            </div>
            <div className="p-6 text-center">
              <span className="text-6xl mb-4 block">📿</span>
              <p className="text-xl font-bold text-foreground mb-2">
                {rudraksha.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {rudraksha.recommend}
              </p>
            </div>
          </div>
        )}

        {puja && (
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-violet-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Iconify
                    icon="solar:hand-heart-bold-duotone"
                    width={24}
                    height={24}
                    className="text-white"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    Puja Recommendations
                  </h3>
                  <p className="text-white/70 text-sm">
                    {puja.suggestions.length} suggested
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-muted-foreground text-sm mb-4">
                {puja.summary}
              </p>
              <div className="space-y-2">
                {puja.suggestions.slice(0, 2).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-purple-500/10 rounded-xl"
                  >
                    <Iconify
                      icon="solar:check-circle-bold-duotone"
                      width={20}
                      height={20}
                      className="text-purple-500"
                    />
                    <p className="text-sm font-medium text-foreground">
                      {item.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function GemstonesContent({ data }: TabContentProps) {
  const gems = data.gem_suggestion;

  if (!gems) {
    return <NoDataMessage message="No gemstone data available" />;
  }

  const guidelines = [
    {
      icon: "solar:check-circle-bold-duotone",
      title: "Natural & Untreated",
      desc: "Use only natural, untreated gemstones",
    },
    {
      icon: "solar:check-circle-bold-duotone",
      title: "Proper Weight",
      desc: "Follow recommended carat weight",
    },
    {
      icon: "solar:check-circle-bold-duotone",
      title: "Skin Contact",
      desc: "Gem should touch your skin from bottom",
    },
    {
      icon: "solar:check-circle-bold-duotone",
      title: "Regular Cleansing",
      desc: "Clean with water and energize in sunlight",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <Iconify
              icon="solar:lightbulb-bolt-bold-duotone"
              width={28}
              height={28}
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">
              How to Wear Gemstones
            </h3>
            <p className="text-white/90 text-sm">
              Wear your gemstone on the recommended day during morning hours
              (Shubh Muhurat). Ensure the gem touches your skin for maximum
              benefit. Chant the planet&apos;s mantra before wearing.
            </p>
          </div>
        </div>
      </div>

      {/* Gemstone Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(Object.entries(gems) as [keyof GemSuggestionData, GemDetails][]).map(
          ([type, gem], idx) => {
            const config = GEM_TYPE_CONFIG[type];
            const planetGradient =
              PLANET_GRADIENTS[gem.gem_deity] || "from-gray-500 to-slate-500";

            return (
              <motion.div
                key={type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div
                  className={`bg-gradient-to-r ${config.gradient} px-5 py-4`}
                >
                  <div className="flex items-center justify-between">
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
                        <p className="font-semibold text-white">
                          {config.label}
                        </p>
                        <p className="text-white/70 text-xs">
                          {config.description}
                        </p>
                      </div>
                    </div>
                    <span className="text-3xl">
                      {GEM_IMAGES[gem.gem_key] || "💎"}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div className="text-center pb-4 border-b border-border">
                    <h4 className="text-2xl font-bold text-foreground">
                      {gem.name}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Alt: {gem.semi_gem}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${planetGradient} text-white`}
                    >
                      <p className="text-xs text-white/70 mb-1">
                        Ruling Planet
                      </p>
                      <p className="font-semibold">{gem.gem_deity}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-muted">
                      <p className="text-xs text-muted-foreground mb-1">
                        Wear Day
                      </p>
                      <p className="font-semibold text-foreground">
                        {gem.wear_day}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-muted">
                      <p className="text-xs text-muted-foreground mb-1">
                        Finger
                      </p>
                      <p className="font-semibold text-foreground">
                        {gem.wear_finger}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-muted">
                      <p className="text-xs text-muted-foreground mb-1">
                        Metal
                      </p>
                      <p className="font-semibold text-foreground">
                        {gem.wear_metal}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${config.gradient} text-white text-center`}
                  >
                    <p className="text-xs text-white/70 mb-1">
                      Recommended Weight
                    </p>
                    <p className="font-bold text-lg">
                      {gem.weight_caret} Carats
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          },
        )}
      </div>

      {/* Guidelines */}
      <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Iconify
            icon="solar:list-check-bold-duotone"
            width={20}
            height={20}
            className="text-primary"
          />
          Wearing Guidelines
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {guidelines.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 rounded-xl bg-muted/50"
            >
              <Iconify
                icon={item.icon}
                width={20}
                height={20}
                className="text-green-500 flex-shrink-0 mt-0.5"
              />
              <div>
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface RudrakshaContentProps extends TabContentProps {
  imageLoadError: boolean;
  setImageLoadError: (error: boolean) => void;
}

function RudrakshaContent({
  data,
  imageLoadError,
  setImageLoadError,
}: RudrakshaContentProps) {
  const rudraksha = data.rudraksha_suggestion;

  if (!rudraksha) {
    return <NoDataMessage message="No rudraksha data available" />;
  }

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-2xl">
            <Iconify
              icon="solar:star-ring-bold-duotone"
              width={32}
              height={32}
              className="text-white"
            />
          </div>
          <div>
            <h3 className="font-semibold text-white text-2xl">
              Rudraksha Recommendation
            </h3>
            <p className="text-white/80">
              Sacred bead for spiritual protection and blessings
            </p>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="text-center mb-8">
          <div className="w-32 h-32 mx-auto mb-6 rounded-2xl overflow-hidden bg-amber-500/10 flex items-center justify-center border-4 border-amber-500/20">
            {rudraksha.img_url && !imageLoadError ? (
              <img
                src={rudraksha.img_url}
                alt={rudraksha.name}
                className="w-full h-full object-cover"
                onError={() => setImageLoadError(true)}
              />
            ) : (
              <span className="text-7xl">📿</span>
            )}
          </div>
          <h4 className="text-3xl font-bold text-foreground mb-2">
            {rudraksha.name}
          </h4>
          <p className="text-muted-foreground">Sacred Rudraksha Bead</p>
        </div>

        <div className="space-y-6">
          <div className="bg-amber-500/10 rounded-xl p-6 border border-amber-500/20">
            <div className="flex items-start gap-3">
              <Iconify
                icon="solar:check-circle-bold-duotone"
                width={24}
                height={24}
                className="text-amber-600 flex-shrink-0 mt-0.5"
              />
              <div>
                <h5 className="font-semibold text-foreground mb-2">
                  Recommendation
                </h5>
                <p className="text-foreground/80">{rudraksha.recommend}</p>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 rounded-xl p-6">
            <h5 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Iconify
                icon="solar:document-text-bold-duotone"
                width={20}
                height={20}
                className="text-primary"
              />
              Detailed Information
            </h5>
            <p className="text-foreground/80 leading-relaxed">
              {rudraksha.detail}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PujaContent({ data }: TabContentProps) {
  const puja = data.puja_suggestion;

  if (!puja) {
    return <NoDataMessage message="No puja data available" />;
  }

  const priorityConfig: Record<
    number,
    { label: string; color: string; bg: string; text: string }
  > = {
    1: {
      label: "Very High Priority",
      color: "from-red-600 to-rose-700",
      bg: "bg-red-500/10",
      text: "text-red-600",
    },
    2: {
      label: "High Priority",
      color: "from-red-500 to-rose-600",
      bg: "bg-red-500/10",
      text: "text-red-500",
    },
    3: {
      label: "Medium Priority",
      color: "from-orange-500 to-amber-600",
      bg: "bg-orange-500/10",
      text: "text-orange-500",
    },
    4: {
      label: "Recommended",
      color: "from-blue-500 to-indigo-600",
      bg: "bg-blue-500/10",
      text: "text-blue-500",
    },
    5: {
      label: "Suggested",
      color: "from-emerald-500 to-teal-600",
      bg: "bg-emerald-500/10",
      text: "text-emerald-500",
    },
  };

  const defaultPriority = priorityConfig[4];

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-violet-600 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Iconify
                icon="solar:hand-heart-bold-duotone"
                width={24}
                height={24}
                className="text-white"
              />
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">
                Puja Recommendations
              </h3>
              <p className="text-white/70 text-sm">
                Vedic rituals for planetary harmony
              </p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <p className="text-foreground/80 leading-relaxed">{puja.summary}</p>
        </div>
      </div>

      {/* Puja List */}
      <div className="grid gap-4">
        {puja.suggestions.map((item, idx) => {
          const config = priorityConfig[item.priority] || defaultPriority;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
            >
              <div
                className={`bg-gradient-to-r ${config.color} px-6 py-4 flex items-center justify-between`}
              >
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-white/20 rounded-lg text-white text-xs font-bold">
                    {config.label}
                  </span>
                  <h4 className="font-semibold text-white">{item.title}</h4>
                </div>
                {item.status && (
                  <Iconify
                    icon="solar:check-circle-bold-duotone"
                    width={24}
                    height={24}
                    className="text-white"
                  />
                )}
              </div>
              <div className="p-6 space-y-3">
                <div className={`p-4 rounded-xl ${config.bg}`}>
                  <p className={`font-medium ${config.text}`}>
                    {item.one_line}
                  </p>
                </div>
                <p className="text-foreground/80 leading-relaxed">
                  {item.summary}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function SadhesatiContent({ data }: TabContentProps) {
  const sadhesati = data.sadhesati_remedies;

  if (!sadhesati) {
    return <NoDataMessage message="No Sade Sati data available" />;
  }

  return (
    <div className="space-y-6">
      {/* What is Sade Sati */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Iconify
                icon="solar:info-circle-bold-duotone"
                width={24}
                height={24}
                className="text-white"
              />
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">
                What is Sade Sati?
              </h3>
              <p className="text-white/70 text-sm">
                Understanding Saturn&apos;s 7.5 year transit
              </p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <p className="text-foreground/80 leading-relaxed">
            {sadhesati.what_is_sadhesati}
          </p>
        </div>
      </div>

      {/* Remedies */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Iconify
                icon="solar:shield-check-bold-duotone"
                width={24}
                height={24}
                className="text-white"
              />
            </div>
            <h3 className="font-semibold text-white text-lg">
              Recommended Remedies
            </h3>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {sadhesati.remedies.map((remedy, idx) => {
            const isIntroText =
              remedy.toLowerCase().includes("following are") ||
              remedy.trim().endsWith("-");

            if (isIntroText) {
              return (
                <p
                  key={idx}
                  className="text-muted-foreground text-sm italic pb-2 border-b border-border/50"
                >
                  {remedy}
                </p>
              );
            }

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-start gap-4 p-4 rounded-xl bg-indigo-500/5 hover:bg-indigo-500/10 border border-indigo-500/10 transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 group-hover:bg-indigo-500 text-indigo-500 group-hover:text-white flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors font-bold text-sm">
                  {idx}
                </div>
                <p className="text-foreground/90 leading-relaxed">{remedy}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/10 rounded-2xl border border-amber-200/50 dark:border-amber-500/20 p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-500/20 rounded-xl">
            <Iconify
              icon="solar:danger-triangle-bold-duotone"
              width={28}
              height={28}
              className="text-amber-600 dark:text-amber-400"
            />
          </div>
          <div>
            <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">
              Important Note
            </h4>
            <p className="text-sm text-amber-700/80 dark:text-amber-200/80">
              These remedies are based on Vedic astrological principles. Please
              consult with a qualified astrologer before performing any remedy
              or wearing any gemstone. Individual results may vary based on
              planetary positions and karmic patterns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ Utility Components ============

function NoDataMessage({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <Iconify
          icon="solar:info-circle-bold-duotone"
          width={32}
          height={32}
          className="text-muted-foreground"
        />
      </div>
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}
