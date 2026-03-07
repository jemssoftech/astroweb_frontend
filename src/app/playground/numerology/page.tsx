"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Iconify from "@/src/components/Iconify";
import PersonSelector from "@/src/components/PersonSelector";
import { Person } from "@/src/lib/models";
import Swal from "sweetalert2";
import api from "@/src/lib/api";

// ============ Types ============

interface NumerologyData {
  numero_table?: Record<string, unknown>;
  numero_report?: Record<string, unknown> | string;
  numero_fav_time?: Record<string, unknown> | string;
  numero_place_vastu?: Record<string, unknown> | string;
  numero_fasts_report?: Record<string, unknown> | string;
  numero_fav_lord?: Record<string, unknown> | string;
  numero_fav_mantra?: Record<string, unknown> | string | any[];
  numero_daily_prediction?: Record<string, unknown> | string;
}

interface NumerologyResponse {
  status: "Pass" | "Partial" | "Fail";
  message: string;
  data: NumerologyData;
  errors?: Record<string, string>;
  meta: {
    total_apis: number;
    successful: number;
    failed: number;
    success_rate: string;
    timestamp: string;
  };
}

export default function NumerologyPage() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(false);
  const [numeroData, setNumeroData] = useState<NumerologyResponse | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");

  const handlePersonSelected = (person: Person) => {
    setSelectedPerson(person);
    setNumeroData(null);
  };

  const getPayload = (person: Person) => {
    const birthDate = new Date(person.BirthTime);
    return {
      day: birthDate.getUTCDate(),
      month: birthDate.getUTCMonth() + 1,
      year: birthDate.getUTCFullYear(),
      name: person.Name,
    };
  };

  const fetchNumerology = async () => {
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
      const payload = getPayload(selectedPerson);
      const response = await api.post(
        "/api/mainapi/indian-numerology",
        payload,
      );
      const resData = response as {
        status: number;
        data: NumerologyResponse;
        error?: string;
      };
      if (resData && resData.status === 200 && resData.data) {
        setNumeroData(resData.data);
        if (resData.data.status === "Partial") {
          Swal.fire({
            icon: "warning",
            title: "Partial Data",
            text: resData.data.message,
            timer: 3000,
            showConfirmButton: false,
            background: "#1e293b",
            color: "#f1f5f9",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: resData?.error || "Failed to fetch numerology data",
          background: "#1e293b",
          color: "#f1f5f9",
        });
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while fetching numerology data";
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

  const tabs = [
    { key: "overview", label: "Overview", icon: "solar:home-2-bold-duotone" },
    {
      key: "numero_table",
      label: "Numbers",
      icon: "solar:hashtag-bold-duotone",
    },
    {
      key: "numero_report",
      label: "Report",
      icon: "solar:document-text-bold-duotone",
    },
    {
      key: "numero_fav_time",
      label: "Time",
      icon: "solar:clock-circle-bold-duotone",
    },
    {
      key: "numero_place_vastu",
      label: "Vastu",
      icon: "solar:home-smile-bold-duotone",
    },
    {
      key: "numero_fasts_report",
      label: "Fasts",
      icon: "solar:moon-sleep-bold-duotone",
    },
    { key: "numero_fav_lord", label: "Deity", icon: "solar:user-bold-duotone" },
    {
      key: "numero_fav_mantra",
      label: "Mantras",
      icon: "solar:soundwave-bold-duotone",
    },
    {
      key: "numero_daily_prediction",
      label: "Daily",
      icon: "solar:calendar-mark-bold-duotone",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-linear-to-r from-amber-600 via-orange-600 to-red-600 rounded-2xl p-6 md:p-8 text-white shadow-xl"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>

          <div className="absolute top-4 right-8 opacity-20">
            <Iconify
              icon="solar:hashtag-circle-bold"
              width={100}
              height={100}
            />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Iconify
                  icon="solar:calculator-bold-duotone"
                  width={40}
                  height={40}
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium">
                    Number Science
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Numerology Analysis
                </h1>
                <p className="text-white/80 mt-1">
                  Discover the power of numbers in your life
                </p>
              </div>
            </div>

            {selectedPerson && numeroData && (
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/20">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Iconify icon="solar:user-bold" width={20} height={20} />
                </div>
                <div>
                  <p className="font-semibold">{selectedPerson.Name}</p>
                  <p className="text-sm text-white/70">
                    {new Date(selectedPerson.BirthTime).toLocaleDateString()}
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
                onClick={fetchNumerology}
                disabled={loading || !selectedPerson}
                className="mt-6 w-full py-3.5 px-4 bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-0.5"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Iconify
                      icon="solar:calculator-bold-duotone"
                      width={20}
                      height={20}
                    />
                    Calculate Numbers
                  </>
                )}
              </button>
            </motion.div>

            {/* Info Card */}
            {!numeroData && (
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
                    About Numerology
                  </h3>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      icon: "solar:star-bold-duotone",
                      text: "Destiny Number - Life purpose",
                      color: "text-amber-500",
                    },
                    {
                      icon: "solar:user-bold-duotone",
                      text: "Radical Number - Core personality",
                      color: "text-orange-500",
                    },
                    {
                      icon: "solar:text-bold-duotone",
                      text: "Name Number - Expression",
                      color: "text-red-500",
                    },
                    {
                      icon: "solar:magic-stick-bold-duotone",
                      text: "Lucky numbers & colors",
                      color: "text-yellow-500",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Iconify
                        icon={item.icon}
                        width={18}
                        height={18}
                        className={item.color}
                      />
                      <p className="text-sm text-muted-foreground">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Success Rate Card */}
            {numeroData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-linear-to-br from-amber-600 via-orange-600 to-red-600 rounded-2xl p-6 text-white shadow-xl overflow-hidden relative"
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
                    <h3 className="font-semibold">API Status</h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                      <span className="text-sm text-white/80">
                        Success Rate
                      </span>
                      <span className="font-bold">
                        {numeroData.meta.success_rate}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                      <span className="text-sm text-white/80">APIs Used</span>
                      <span className="font-bold">
                        {numeroData.meta.total_apis}
                      </span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full"
                        style={{ width: numeroData.meta.success_rate }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            <AnimatePresence mode="wait">
              {numeroData ? (
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
                          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl font-medium text-xs transition-all whitespace-nowrap ${
                            activeTab === tab.key
                              ? "bg-primary text-white shadow-lg shadow-primary/25"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          <Iconify icon={tab.icon} width={16} height={16} />
                          <span className="hidden sm:inline">{tab.label}</span>
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
                          data={numeroData}
                          setActiveTab={setActiveTab}
                        />
                      )}
                      {activeTab === "numero_table" && (
                        <NumberTableContent
                          data={numeroData.data.numero_table}
                        />
                      )}
                      {activeTab === "numero_report" && (
                        <ReportContent data={numeroData.data.numero_report} />
                      )}
                      {activeTab === "numero_fav_time" && (
                        <TimeContent data={numeroData.data.numero_fav_time} />
                      )}
                      {activeTab === "numero_place_vastu" && (
                        <VastuContent
                          data={numeroData.data.numero_place_vastu}
                        />
                      )}
                      {activeTab === "numero_fasts_report" && (
                        <FastsContent
                          data={numeroData.data.numero_fasts_report}
                        />
                      )}
                      {activeTab === "numero_fav_lord" && (
                        <DeityContent data={numeroData.data.numero_fav_lord} />
                      )}
                      {activeTab === "numero_fav_mantra" && (
                        <MantraContent
                          data={numeroData.data.numero_fav_mantra}
                        />
                      )}
                      {activeTab === "numero_daily_prediction" && (
                        <DailyContent
                          data={numeroData.data.numero_daily_prediction}
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
                        icon="solar:calculator-bold-duotone"
                        width={48}
                        height={48}
                        className="text-muted-foreground/50"
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Numerology Analysis
                    </h3>
                    <p className="text-muted-foreground text-center max-w-md mb-8">
                      Select a person and click &quot;Calculate Numbers&quot; to
                      discover the power of numerology based on birth date and
                      name.
                    </p>

                    {/* Feature Preview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
                      {[
                        {
                          icon: "solar:hashtag-bold-duotone",
                          label: "Numbers",
                          color: "text-amber-500",
                          bg: "bg-amber-500/10",
                        },
                        {
                          icon: "solar:star-bold-duotone",
                          label: "Destiny",
                          color: "text-orange-500",
                          bg: "bg-orange-500/10",
                        },
                        {
                          icon: "solar:clock-circle-bold-duotone",
                          label: "Timing",
                          color: "text-red-500",
                          bg: "bg-red-500/10",
                        },
                        {
                          icon: "solar:soundwave-bold-duotone",
                          label: "Mantras",
                          color: "text-yellow-500",
                          bg: "bg-yellow-500/10",
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
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ Content Components ============

function OverviewContent({
  data,
  setActiveTab,
}: {
  data: NumerologyResponse;
  setActiveTab: (tab: string) => void;
}) {
  const { numero_table, numero_report, numero_daily_prediction } = data.data;

  const keyNumbers = [
    {
      key: "destiny_number",
      label: "Destiny",
      desc: "Life path",
      gradient: "from-amber-500 to-orange-500",
    },
    {
      key: "radical_number",
      label: "Radical",
      desc: "Birth number",
      gradient: "from-orange-500 to-red-500",
    },
    {
      key: "name_number",
      label: "Name",
      desc: "Expression",
      gradient: "from-red-500 to-rose-500",
    },
    {
      key: "lucky_number",
      label: "Lucky",
      desc: "Fortune",
      gradient: "from-emerald-500 to-teal-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Key Numbers Grid */}
      {numero_table && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {keyNumbers.map((item, idx) => {
            const value = numero_table[item.key];
            if (value === undefined) return null;
            const num =
              typeof value === "number" ? value : parseInt(String(value)) || 1;

            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`relative overflow-hidden bg-linear-to-br ${item.gradient} rounded-2xl p-5 text-white shadow-lg`}
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                  <p className="text-white/70 text-xs uppercase tracking-wide mb-2">
                    {item.label}
                  </p>
                  <p className="text-4xl font-bold mb-1">{num}</p>
                  <p className="text-white/80 text-xs">{item.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Report Preview */}
      {numero_report && (
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="bg-linear-to-r from-indigo-500 to-purple-600 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <Iconify
                  icon="solar:document-text-bold-duotone"
                  width={24}
                  height={24}
                  className="text-white"
                />
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">
                  Numerology Report
                </h3>
                <p className="text-white/70 text-sm">
                  Your personality insights
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab("numero_report")}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-white text-sm font-medium transition-colors"
            >
              View Full
              <Iconify icon="solar:arrow-right-linear" width={16} height={16} />
            </button>
          </div>
          <div className="p-6">
            {typeof numero_report === "object" &&
            !Array.isArray(numero_report) ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(numero_report)
                  .slice(0, 4)
                  .map(([key, value], idx) => (
                    <div key={idx} className="p-4 bg-muted/50 rounded-xl">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                        {key.replace(/_/g, " ")}
                      </p>
                      <p className="text-sm text-foreground line-clamp-3">
                        {String(value)}
                      </p>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-foreground/80">{String(numero_report)}</p>
            )}
          </div>
        </div>
      )}

      {/* Daily Prediction Preview */}
      {numero_daily_prediction && (
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="bg-linear-to-r from-amber-500 to-orange-500 px-6 py-4 flex items-center justify-between">
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
                  Today&apos;s Prediction
                </h3>
                <p className="text-white/70 text-sm">
                  Daily numerological guidance
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab("numero_daily_prediction")}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-white text-sm font-medium transition-all"
            >
              View Full
              <Iconify icon="solar:arrow-right-linear" width={16} height={16} />
            </button>
          </div>
          <div className="p-6">
            {typeof numero_daily_prediction === "object" &&
            !Array.isArray(numero_daily_prediction) ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(numero_daily_prediction)
                  .slice(0, 4)
                  .map(([key, value]) => (
                    <div key={key} className="p-4 bg-muted/50 rounded-xl">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                        {key.replace(/_/g, " ")}
                      </p>
                      <p className="text-sm text-foreground line-clamp-3">
                        {String(value)}
                      </p>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-foreground/80">
                {String(numero_daily_prediction)}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function NumberTableContent({
  data,
}: {
  data: Record<string, unknown> | undefined;
}) {
  if (!data) return <EmptyState message="No number table data available" />;

  const keyNumbers = [
    {
      key: "destiny_number",
      label: "Destiny Number",
      desc: "Life Path",
      gradient: "from-amber-500 to-orange-500",
    },
    {
      key: "radical_number",
      label: "Radical Number",
      desc: "Birth Number",
      gradient: "from-orange-500 to-red-500",
    },
    {
      key: "name_number",
      label: "Name Number",
      desc: "Expression",
      gradient: "from-red-500 to-rose-500",
    },
    {
      key: "evil_number",
      label: "Evil Number",
      desc: "Challenges",
      gradient: "from-slate-500 to-gray-600",
    },
    {
      key: "lucky_number",
      label: "Lucky Number",
      desc: "Fortune",
      gradient: "from-emerald-500 to-teal-500",
    },
  ];

  const compatibilityNumbers = [
    {
      key: "friendly_number",
      label: "Friendly Numbers",
      icon: "solar:users-group-rounded-bold-duotone",
      color: "text-green-500",
    },
    {
      key: "neutral_number",
      label: "Neutral Numbers",
      icon: "solar:minus-circle-bold-duotone",
      color: "text-amber-500",
    },
    {
      key: "enemy_number",
      label: "Enemy Numbers",
      icon: "solar:close-circle-bold-duotone",
      color: "text-red-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Primary Numbers */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {keyNumbers.map((item, idx) => {
          const value = data[item.key];
          if (value === undefined) return null;
          const num =
            typeof value === "number" ? value : parseInt(String(value)) || 1;

          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative overflow-hidden bg-linear-to-br ${item.gradient} rounded-2xl p-5 text-white shadow-lg text-center`}
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <p className="text-white/70 text-xs uppercase tracking-wide mb-2">
                  {item.label}
                </p>
                <p className="text-5xl font-bold mb-2">{num}</p>
                <p className="text-white/80 text-xs">{item.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Compatibility Numbers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {compatibilityNumbers.map((item) => {
          const value = data[item.key as keyof typeof data];
          if (value === undefined) return null;

          return (
            <div
              key={item.key}
              className="bg-card rounded-2xl border border-border shadow-sm p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Iconify
                  icon={item.icon}
                  width={24}
                  height={24}
                  className={item.color}
                />
                <h4 className="font-semibold text-foreground">{item.label}</h4>
              </div>
              <p className="text-foreground/80 text-lg font-medium">
                {String(value)}
              </p>
            </div>
          );
        })}
      </div>

      {/* Full Data Table */}
      <DataTable data={data} title="Complete Number Analysis" />
    </div>
  );
}

function ReportContent({
  data,
}: {
  data: Record<string, unknown> | string | undefined;
}) {
  if (!data) return <EmptyState message="No report data available" />;

  return <DataTable data={data} title="Numerology Report" />;
}

function TimeContent({
  data,
}: {
  data: Record<string, unknown> | string | undefined;
}) {
  if (!data) return <EmptyState message="No favorable time data available" />;

  if (typeof data === "object" && !Array.isArray(data)) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(data).map(([key, value], idx) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-card rounded-2xl border border-border shadow-sm p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Iconify
                  icon="solar:clock-circle-bold-duotone"
                  width={20}
                  height={20}
                  className="text-primary"
                />
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                {key.replace(/_/g, " ")}
              </p>
            </div>
            <p className="font-semibold text-foreground">{String(value)}</p>
          </motion.div>
        ))}
      </div>
    );
  }

  return <DataTable data={data} title="Favorable Time" />;
}

function VastuContent({
  data,
}: {
  data: Record<string, unknown> | string | undefined;
}) {
  if (!data) return <EmptyState message="No vastu data available" />;

  return <DataTable data={data} title="Vastu & Place Recommendations" />;
}

function FastsContent({
  data,
}: {
  data: Record<string, unknown> | string | undefined;
}) {
  if (!data) return <EmptyState message="No fasts data available" />;

  return <DataTable data={data} title="Fasts Report" />;
}

function DeityContent({
  data,
}: {
  data: Record<string, unknown> | string | undefined;
}) {
  if (!data) return <EmptyState message="No deity data available" />;

  return <DataTable data={data} title="Favorable Lord" />;
}

function MantraContent({
  data,
}: {
  data: any[] | Record<string, unknown> | string | undefined;
}) {
  if (!data) return <EmptyState message="No mantra data available" />;

  if (Array.isArray(data)) {
    return (
      <div className="space-y-4">
        {data.map(
          (
            mantra: string | { name?: string; mantra?: string },
            idx: number,
          ) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
            >
              <div className="bg-linear-to-r from-purple-500 to-violet-600 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <Iconify
                      icon="solar:soundwave-bold-duotone"
                      width={24}
                      height={24}
                      className="text-white"
                    />
                  </div>
                  <h4 className="font-semibold text-white">
                    {typeof mantra === "string"
                      ? `Mantra ${idx + 1}`
                      : (mantra as any).name || `Mantra ${idx + 1}`}
                  </h4>
                </div>
              </div>
              <div className="p-6">
                {typeof mantra === "string" ? (
                  <p className="text-foreground/80 text-lg">{mantra}</p>
                ) : (mantra as any).mantra ? (
                  <p className="text-purple-700 dark:text-purple-400 font-semibold bg-purple-500/10 p-4 rounded-xl text-lg">
                    {(mantra as any).mantra}
                  </p>
                ) : (
                  <p className="text-foreground/80">{JSON.stringify(mantra)}</p>
                )}
              </div>
            </motion.div>
          ),
        )}
      </div>
    );
  }

  return <DataTable data={data} title="Mantras" />;
}

function DailyContent({
  data,
}: {
  data: Record<string, unknown> | string | undefined;
}) {
  if (!data) return <EmptyState message="No daily prediction available" />;

  return <DataTable data={data} title="Daily Prediction" />;
}

// ============ Helper Components ============

function EmptyState({ message }: { message: string }) {
  return (
    <div className="bg-card rounded-2xl border border-dashed border-border shadow-sm p-12 text-center">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
        <Iconify
          icon="solar:database-bold-duotone"
          width={32}
          height={32}
          className="text-muted-foreground/50"
        />
      </div>
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}

function DataTable({
  data,
  title,
}: {
  data: Record<string, unknown> | any[] | string | undefined;
  title?: string;
}) {
  if (!data) return <EmptyState message="No data available" />;

  if (Array.isArray(data)) {
    if (data.length === 0) return <EmptyState message="No data available" />;
    const firstItem = data[0];
    const keys =
      typeof firstItem === "object" ? Object.keys(firstItem) : ["Value"];

    return (
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        {title && (
          <div className="bg-linear-to-r from-indigo-500 to-purple-600 px-6 py-4">
            <h4 className="font-semibold text-white">{title}</h4>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {keys.map((key) => (
                  <th
                    key={key}
                    className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                  >
                    {key.replace(/_/g, " ")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.map((item: Record<string, unknown> | any, idx: number) => (
                <tr key={idx} className="hover:bg-muted/30 transition-colors">
                  {keys.map((key) => (
                    <td
                      key={key}
                      className="px-4 py-3 text-sm text-foreground/80"
                    >
                      {typeof item === "object" && item !== null
                        ? String((item as any)[key] || "-")
                        : String(item)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (typeof data === "object") {
    return (
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        {title && (
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
            <h4 className="font-semibold text-white">{title}</h4>
          </div>
        )}
        <div className="divide-y divide-border">
          {Object.entries(data).map(([key, value]) => (
            <div
              key={key}
              className="flex px-6 py-4 hover:bg-muted/30 transition-colors"
            >
              <span className="font-medium text-muted-foreground capitalize min-w-[200px]">
                {key.replace(/_/g, " ")}
              </span>
              <div className="flex-1 text-foreground">{String(value)}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return <p className="text-foreground/80">{String(data)}</p>;
}
