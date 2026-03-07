// components/horoscope/BirthChartSection.tsx

import React, { useState, useEffect, useCallback, useMemo } from "react";

// ============================================
// TYPES
// ============================================
type ChartStyle = "SouthIndianChart" | "NorthIndianChart";

interface ChartOption {
 key: string;
 label: string;
 apiValue: string;
}

interface BirthData {
 location?: string;
 time?: string;
 date?: string;
 offset?: string;
}

interface BirthChartSectionProps {
 birthData: BirthData;
 ayanamsa?: string;
}

// ============================================
// CHART OPTIONS
// ============================================
const CHART_OPTIONS: ChartOption[] = [
 { key: "bhavaCalit", label: "Bhava Chalit", apiValue: "BhavaCalit" },
 { key: "rasiD1", label: "Rasi D1", apiValue: "RasiD1" },
 { key: "horaD2", label: "Hora D2", apiValue: "HoraD2" },
 { key: "drekkanaD3", label: "Drekkana D3", apiValue: "DrekkanaD3" },
 {
 key: "chaturthamshaD4",
 label: "Chaturthamsha D4",
 apiValue: "ChaturthamshaD4",
 },
 { key: "saptamshaD7", label: "Saptamsha D7", apiValue: "SaptamshaD7" },
 { key: "navamshaD9", label: "Navamsha D9", apiValue: "NavamshaD9" },
 { key: "dashamshaD10", label: "Dashamamsha D10", apiValue: "DashamshaD10" },
 {
 key: "dwadashamshaD12",
 label: "Dwadashamsha D12",
 apiValue: "DwadashamshaD12",
 },
 {
 key: "shodashamshaD16",
 label: "Shodashamsha D16",
 apiValue: "ShodashamshaD16",
 },
 { key: "vimsamshaD20", label: "Vimshamsha D20", apiValue: "VimsamshaD20" },
 {
 key: "chaturvimsamshaD24",
 label: "Chaturvimshamsha D24",
 apiValue: "ChaturvimsamshaD24",
 },
 { key: "bhamshaD27", label: "Bhamsha D27", apiValue: "BhamshaD27" },
 { key: "trimsamshaD30", label: "Trimshamsha D30", apiValue: "TrimsamshaD30" },
 {
 key: "khavedamshaD40",
 label: "Khavedamsha D40",
 apiValue: "KhavedamshaD40",
 },
 {
 key: "akshavedamshaD45",
 label: "Akshavedamsha D45",
 apiValue: "AkshavedamshaD45",
 },
 {
 key: "shashtyamshaD60",
 label: "Shashtyamsha D60",
 apiValue: "ShashtyamshaD60",
 },
];

const DEFAULT_SELECTED_CHARTS = ["rasiD1", "navamshaD9"];
const API_BASE_URL = "/api/Calculate";

// ============================================
// CHART DISPLAY COMPONENT
// ============================================
function ChartDisplay({
 svg,
 title,
 loading,
 error,
}: {
 svg?: string;
 title: string;
 loading?: boolean;
 error?: string;
}) {
 if (loading) {
 return (
 <div className="bg-card rounded-lg border border-border overflow-hidden">
 <div className="px-3 py-2">
 <h4 className="text-white font-medium text-sm">{title}</h4>
 </div>
 <div className="p-4 flex flex-col items-center justify-center min-h-[300px]">
 <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary/20 border-t-indigo-600 mb-3"></div>
 <p className="text-foreground/60 text-sm">Loading chart...</p>
 </div>
 </div>
 );
 }

 if (error) {
 return (
 <div className="bg-card rounded-lg border border-red-200 overflow-hidden">
 <div className="px-3 py-2">
 <h4 className="text-white font-medium text-sm">{title}</h4>
 </div>
 <div className="p-4 flex flex-col items-center justify-center min-h-[300px]">
 <svg
 className="w-12 h-12 text-red-300 mb-3"
 fill="none"
 stroke="currentColor"
 viewBox="0 0 24 24"
 >
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={2}
 d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
 />
 </svg>
 <p className="text-red-500 text-sm text-center">{error}</p>
 </div>
 </div>
 );
 }

 if (!svg) {
 return (
 <div className="bg-input rounded-lg border border-border p-8 flex flex-col items-center justify-center w-[300px] h-[300px]">
 <svg
 className="w-12 h-12 text-muted-foreground mb-3"
 fill="none"
 stroke="currentColor"
 viewBox="0 0 24 24"
 >
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={2}
 d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
 />
 </svg>
 <p className="text-foreground/60 text-sm">{title} not available</p>
 </div>
 );
 }

 return (
 <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
 <div className="px-3 py-2">
 <h4 className="text-white font-medium text-sm">{title}</h4>
 </div>
 <div
 className="p-4 flex justify-center max-h-[300px] items-center "
 dangerouslySetInnerHTML={{ __html: svg }}
 />
 </div>
 );
}

// ============================================
// MAIN COMPONENT
// ============================================
function BirthChartSection({
 birthData,
 ayanamsa = "RAMAN",
}: BirthChartSectionProps) {
 const [chartStyle, setChartStyle] = useState<ChartStyle>("SouthIndianChart");
 const [selectedCharts, setSelectedCharts] = useState<string[]>(
 DEFAULT_SELECTED_CHARTS,
 );
 const [chartCache, setChartCache] = useState<
 Record<string, { svg?: string; loading: boolean; error?: string }>
 >({});

 // Display-friendly birth info
 const displayInfo = useMemo(
 () => ({
 location: decodeURIComponent(birthData.location || ""),
 time: birthData.time,
 date: birthData.date,
 offset: decodeURIComponent(birthData.offset || ""),
 }),
 [birthData],
 );

 // ============================================
 // BUILD API URL WITH CHARTTYPE
 // ============================================
 const buildChartUrl = useCallback(
 (style: ChartStyle, chartType: string): string => {
 // /api/Calculate/SouthIndianChart/Location/{location}/Time/{time}/{date}/{offset}/ChartType/{chartType}/Ayanamsa/{ayanamsa}
 return `${API_BASE_URL}/${style}/Location/${birthData.location}/Time/${birthData.time}/${birthData.date}/${birthData.offset}/ChartType/${chartType}/Ayanamsa/${ayanamsa}`;
 },
 [birthData, ayanamsa],
 );

 // ============================================
 // FETCH SINGLE CHART
 // ============================================
 const fetchChart = useCallback(
 async (chartKey: string, chartApiValue: string) => {
 const cacheKey = `${chartStyle}_${chartKey}`;

 // Already loaded or loading
 if (chartCache[cacheKey]?.svg || chartCache[cacheKey]?.loading) {
 return;
 }

 setChartCache((prev) => ({
 ...prev,
 [cacheKey]: { loading: true, error: undefined, svg: undefined },
 }));

 try {
 const url = buildChartUrl(chartStyle, chartApiValue);

 const response = await fetch(url);

 if (!response.ok) {
 throw new Error(`HTTP ${response.status}`);
 }

 const data = await response.json();
 const svg =
 data?.message ||
 data?.svg ||
 data?.Payload?.message ||
 data?.Payload?.svg ||
 (typeof data === "string" ? data : undefined);

 setChartCache((prev) => ({
 ...prev,
 [cacheKey]: { loading: false, svg, error: undefined },
 }));
 } catch (err: any) {
 console.error(`❌ Error fetching ${chartKey}:`, err);
 setChartCache((prev) => ({
 ...prev,
 [cacheKey]: { loading: false, error: err.message, svg: undefined },
 }));
 }
 },
 [chartStyle, buildChartUrl, chartCache],
 );

 // ============================================
 // AUTO-FETCH ON SELECTION CHANGE
 // ============================================
 useEffect(() => {
 selectedCharts.forEach((chartKey) => {
 const option = CHART_OPTIONS.find((c) => c.key === chartKey);
 if (option) {
 fetchChart(chartKey, option.apiValue);
 }
 });
 }, [selectedCharts, chartStyle]); // Re-fetch when style changes

 // ============================================
 // HANDLERS
 // ============================================
 const toggleChart = (key: string) => {
 if (selectedCharts.includes(key)) {
 if (selectedCharts.length > 1) {
 setSelectedCharts((prev) => prev.filter((c) => c !== key));
 }
 } else {
 setSelectedCharts((prev) => [...prev, key]);
 }
 };

 const selectAll = () => setSelectedCharts(CHART_OPTIONS.map((c) => c.key));
 const resetDefaults = () => setSelectedCharts(DEFAULT_SELECTED_CHARTS);

 const refreshCharts = () => {
 // Clear cache for current selection
 const newCache = { ...chartCache };
 selectedCharts.forEach((key) => {
 delete newCache[`${chartStyle}_${key}`];
 });
 setChartCache(newCache);
 };

 const getChartData = (key: string) => {
 return chartCache[`${chartStyle}_${key}`] || { loading: false };
 };

 const visibleCharts = CHART_OPTIONS.filter((c) =>
 selectedCharts.includes(c.key),
 );

 return (
 <div className="space-y-4">
 {/* Birth Info Banner */}
 <div className="px-4 py-2 bg-primary/10 border border-indigo-100 rounded-lg flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
 <div className="flex items-center gap-1.5">
 <span className="text-indigo-500">📍</span>
 <span className="text-indigo-700 font-medium">
 {displayInfo.location}
 </span>
 </div>
 <div className="flex items-center gap-1.5">
 <span className="text-indigo-500">📅</span>
 <span className="text-indigo-700">{displayInfo.date}</span>
 </div>
 <div className="flex items-center gap-1.5">
 <span className="text-indigo-500">⏰</span>
 <span className="text-indigo-700">{displayInfo.time}</span>
 </div>
 <div className="flex items-center gap-1.5">
 <span className="text-indigo-500">🌐</span>
 <span className="text-indigo-700">UTC {displayInfo.offset}</span>
 </div>
 </div>

 {/* Controls */}
 <div className="p-4 bg-input border border-border rounded-lg space-y-4">
 {/* Chart Style Radio */}
 <div className="flex flex-wrap items-center gap-4">
 <span className="text-sm font-medium text-foreground/80">
 Chart Style:
 </span>

 <label className="inline-flex items-center cursor-pointer">
 <input
 type="radio"
 name="chartStyle"
 checked={chartStyle === "SouthIndianChart"}
 onChange={() => setChartStyle("SouthIndianChart")}
 className="w-4 h-4 text-primary"
 />
 <span
 className={`ml-2 text-sm ${chartStyle === "SouthIndianChart" ? "text-indigo-700 font-medium" : "text-foreground/80"}`}
 >
 South Indian
 </span>
 </label>

 <label className="inline-flex items-center cursor-pointer">
 <input
 type="radio"
 name="chartStyle"
 checked={chartStyle === "NorthIndianChart"}
 onChange={() => setChartStyle("NorthIndianChart")}
 className="w-4 h-4 text-primary"
 />
 <span
 className={`ml-2 text-sm ${chartStyle === "NorthIndianChart" ? "text-indigo-700 font-medium" : "text-foreground/80"}`}
 >
 North Indian
 </span>
 </label>

 <button
 onClick={refreshCharts}
 className="ml-auto px-3 py-1.5 text-xs font-medium bg-card border border-border text-foreground/80 rounded-lg hover:bg-input"
 >
 🔄 Refresh
 </button>
 </div>

 {/* Chart Checkboxes */}
 <div className="space-y-3">
 <div className="flex items-center justify-between">
 <span className="text-sm font-medium text-foreground/80">
 Select Charts:
 </span>
 <div className="flex gap-2">
 <button
 onClick={selectAll}
 className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
 >
 Select All
 </button>
 <button
 onClick={resetDefaults}
 className="px-2 py-1 text-xs font-medium bg-input text-foreground/80 rounded hover:bg-input"
 >
 Reset
 </button>
 </div>
 </div>

 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
 {CHART_OPTIONS.map((chart) => {
 const isSelected = selectedCharts.includes(chart.key);
 const data = getChartData(chart.key);

 return (
 <label
 key={chart.key}
 className={`
 inline-flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all relative
 ${isSelected ? "bg-primary/10 border-indigo-300 text-indigo-700" : "bg-card border-border text-foreground/70 hover:bg-input"}
 `}
 >
 <input
 type="checkbox"
 checked={isSelected}
 onChange={() => toggleChart(chart.key)}
 className="w-4 h-4 text-primary rounded"
 />
 <span className="text-xs font-medium whitespace-nowrap">
 {chart.label}
 </span>

 {/* Status dots */}
 {isSelected && data.loading && (
 <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
 )}
 {isSelected && data.error && (
 <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
 )}
 {isSelected && data.svg && !data.loading && (
 <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full" />
 )}
 </label>
 );
 })}
 </div>
 </div>

 {/* Count */}
 <div className="flex items-center gap-2 text-sm text-foreground/60">
 <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
 {selectedCharts.length}
 </span>
 <span>chart{selectedCharts.length !== 1 ? "s" : ""} selected</span>
 <span className="text-muted-foreground">•</span>
 <span>
 {chartStyle === "SouthIndianChart" ? "South" : "North"} Indian
 </span>
 </div>
 </div>

 {/* Charts Grid */}
 <div className="p-4 bg-input rounded-lg">
 {visibleCharts.length === 0 ? (
 <div className="text-center py-12 text-foreground/60 bg-card rounded-lg border">
 <p>Select at least one chart type</p>
 </div>
 ) : (
 <div
 className={`grid gap-4 ${
 visibleCharts.length === 1
 ? "grid-cols-1 max-w-2xl mx-auto"
 : visibleCharts.length === 2
 ? "grid-cols-1 md:grid-cols-2"
 : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
 }`}
 >
 {visibleCharts.map((chart) => {
 const data = getChartData(chart.key);
 const styleName =
 chartStyle === "SouthIndianChart" ? "South" : "North";

 return (
 <ChartDisplay
 key={`${chartStyle}_${chart.key}`}
 svg={data.svg}
 title={`${chart.label} (${styleName})`}
 loading={data.loading}
 error={data.error}
 />
 );
 })}
 </div>
 )}
 </div>
 </div>
 );
}

export default BirthChartSection;
