"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import Iconify from "@/src/components/Iconify";
import { getUser, getAuthToken } from "@/src/lib/auth";

// ── Category -> Sub Categories ──
const apiCategories: Record<string, string[]> = {
  "Astrology Systems": [
    "Ashtakvarga",
    "Basic Astro Details",
    "Char Dasha",
    "KP System",
    "Lal Kitab",
    "Varshaphal",
    "Vimshottari Dasha",
    "Yogini Dasha",
  ],
  Predictions: [
    "Daily Horoscope",
    "Daily Nakshatra Prediction",
    "Transits",
    "Personality Report",
    "Remedies",
  ],
  "Life Path Reports": [
    "Planet Nature",
    "General Ascendant Report",
    "General Nakshatra Report",
    "General House Report",
    "General Rashi Report",
    "Life Path Predict",
  ],
  Numerology: ["Vedic Numerology", "Western Numerology"],
  "Match Making": ["Vedic Compatibility", "Love Compatibility"],
  "Western Astrology": ["Natal Chart", "Solar Return", "Lunar"],
  Utilities: ["Hindu Calendar", "List All Routes"],
};

// ── Slug mapping ──
const subCategorySlugs: Record<string, string> = {
  Ashtakvarga: "ashtakvarga",
  "Basic Astro Details": "basic-astro-details",
  "Char Dasha": "char-dasha",
  Calendar: "calendar",
  "KP System": "kp-system",
  "Lal Kitab": "lalkitab",
  Varshaphal: "varshaphal",
  "Vimshottari Dasha": "vimshottari-dasha",
  "Yogini Dasha": "yogini-dasha",
  "Daily Horoscope": "daily-horoscope",
  "Daily Nakshatra Prediction": "daily_nakshatra",
  Transits: "transits",
  "Personality Report": "personality",
  Remedies: "remedies",
  "Planet Nature": "life-path/planet_nature",
  "General Ascendant Report": "life-path/general_ascendant_report",
  "General Nakshatra Report": "life-path/general_nakshatra_report",
  "General House Report": "life-path/general_house_report",
  "General Rashi Report": "life-path/general_rashi_report",
  "Life Path Predict": "life-path/predict",
  "Vedic Numerology": "indian-numerology",
  "Western Numerology": "western_numerology",
  "Vedic Compatibility": "compatibility",
  "Love Compatibility": "love-compatibility",
  "Natal Chart": "natal-chart",
  "Solar Return": "solar-return",
  Lunar: "lunar",
  "Hindu Calendar": "calendar/hindu-calender",
  "List All Routes": "routes",
};

// ── Field types ──
type FieldName =
  | "datetime"
  | "sign"
  | "timezone_only"
  | "query_type"
  | "planet_name"
  | "name"
  | "varshaphal_year"
  | "house_type"
  | "solar_year"
  | "calendar_month"
  | "calendar_year"
  | "calendar_type"
  | "partner";

const subCategoryFields: Record<string, FieldName[]> = {
  Ashtakvarga: ["datetime"],
  "Basic Astro Details": ["datetime"],
  "Char Dasha": ["datetime"],
  "KP System": ["datetime"],
  "Lal Kitab": ["datetime"],
  Varshaphal: ["datetime", "varshaphal_year"],
  "Vimshottari Dasha": ["datetime"],
  "Yogini Dasha": ["datetime"],
  "Daily Horoscope": ["sign", "timezone_only"],
  "Daily Nakshatra Prediction": ["datetime", "query_type"],
  Transits: ["datetime"],
  "Personality Report": ["datetime"],
  Remedies: ["datetime"],
  "Planet Nature": ["datetime"],
  "General Ascendant Report": ["datetime"],
  "General Nakshatra Report": ["datetime"],
  "General House Report": ["datetime", "planet_name"],
  "General Rashi Report": ["datetime", "planet_name"],
  "Life Path Predict": ["datetime"],
  "Vedic Numerology": ["datetime", "name"],
  "Western Numerology": ["datetime", "name"],
  "Vedic Compatibility": ["datetime", "name"],
  "Love Compatibility": ["partner"],
  "Natal Chart": ["datetime", "house_type"],
  "Solar Return": ["datetime", "solar_year", "house_type"],
  Lunar: ["datetime", "house_type"],
  "Hindu Calendar": ["calendar_month", "calendar_year", "calendar_type"],
  "List All Routes": [],
};

const subCategoryMethod: Record<string, string> = {
  "Hindu Calendar": "GET",
  "List All Routes": "GET",
};

const signOptions = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces",
];
const planetOptions = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
  "Rahu",
  "Ketu",
];
const queryTypeOptions = ["prediction", "next", "previous", "consolidated"];
const houseTypeOptions = [
  "placidus",
  "koch",
  "topocentric",
  "poryphry",
  "equal_house",
  "whole_sign",
];
const calendarTypeOptions = ["current", "previous", "next"];

interface FormValues {
  category: string;
  subCategory: string;
  date: string;
  time: string;
  lat: string;
  lon: string;
  tzone: string;
  sign: string;
  timezone_only: string;
  query_type: string;
  planet_name: string;
  name: string;
  varshaphal_year: string;
  house_type: string;
  solar_year: string;
  calendar_month: string;
  calendar_year: string;
  calendar_type: string;
  p_date: string;
  p_time: string;
  p_lat: string;
  p_lon: string;
  p_tzone: string;
  s_date: string;
  s_time: string;
  s_lat: string;
  s_lon: string;
  s_tzone: string;
}

function splitDate(dateStr: string) {
  if (!dateStr) return {};
  const [y, m, d] = dateStr.split("-");
  return { day: String(Number(d)), month: String(Number(m)), year: y };
}

function splitTime(timeStr: string) {
  if (!timeStr) return {};
  const [h, m] = timeStr.split(":");
  return { hour: String(Number(h)), min: String(Number(m)) };
}

// Category Icons
const categoryIcons: Record<string, string> = {
  "Astrology Systems": "lucide:stars",
  Predictions: "lucide:eye",
  "Life Path Reports": "lucide:compass",
  Numerology: "lucide:hash",
  "Match Making": "lucide:heart",
  "Western Astrology": "lucide:globe",
  Utilities: "lucide:settings",
};

export default function TestingPage() {
  const user = getUser();
  const token = getAuthToken();
  const apiKey = user?.apikey || "1ac21f10-b176-585a-8e6f-de323548b29b";

  const { register, control, setValue } = useForm<FormValues>({
    defaultValues: {
      category: "Astrology Systems",
      subCategory: "Ashtakvarga",
      date: "",
      time: "",
      lat: "",
      lon: "",
      tzone: "",
      sign: "",
      timezone_only: "",
      query_type: "prediction",
      planet_name: "Sun",
      name: "",
      varshaphal_year: "",
      house_type: "placidus",
      solar_year: "",
      calendar_month: "",
      calendar_year: "",
      calendar_type: "current",
      p_date: "",
      p_time: "",
      p_lat: "",
      p_lon: "",
      p_tzone: "",
      s_date: "",
      s_time: "",
      s_lat: "",
      s_lon: "",
      s_tzone: "",
    },
  });

  const w = useWatch({ control });
  const category = w.category || "Astrology Systems";
  const subCategory = w.subCategory || "Ashtakvarga";

  const [response, setResponse] = useState<unknown>({});
  const [loading, setLoading] = useState(false);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [requestStatus, setRequestStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [copied, setCopied] = useState(false);

  const currentFields = useMemo(
    () => subCategoryFields[subCategory] || [],
    [subCategory],
  );

  useEffect(() => {
    const subs = apiCategories[category];
    if (subs && subs.length > 0) setValue("subCategory", subs[0]);
  }, [category, setValue]);

  const buildSlug = useMemo(() => {
    let slug = subCategorySlugs[subCategory] || "";
    if (currentFields.includes("planet_name") && w.planet_name)
      slug += `/${w.planet_name}`;
    if (currentFields.includes("query_type") && w.query_type)
      slug += `?type=${w.query_type}`;
    if (subCategory === "Hindu Calendar") {
      const qp = new URLSearchParams();
      if (w.calendar_month) qp.set("month", w.calendar_month);
      if (w.calendar_year) qp.set("year", w.calendar_year);
      if (w.calendar_type) qp.set("type", w.calendar_type);
      const qs = qp.toString();
      if (qs) slug += `?${qs}`;
    }
    return slug;
  }, [
    subCategory,
    currentFields,
    w.planet_name,
    w.query_type,
    w.calendar_month,
    w.calendar_year,
    w.calendar_type,
  ]);
  const AUTH_BASE_URL = process.env.NEXT_PUBLIC_NEXT_JS_API_URL;
  const displayUrl = `${AUTH_BASE_URL}/api/${buildSlug}`;

  const params = useMemo(() => {
    const p: Record<string, string> = { api_key: apiKey };
    const method = subCategoryMethod[subCategory] || "POST";
    if (method === "GET") return p;

    if (currentFields.includes("datetime")) {
      const d = splitDate(w.date || "");
      const t = splitTime(w.time || "");
      Object.assign(p, d, t);
      if (w.lat) p.lat = w.lat;
      if (w.lon) p.lon = w.lon;
      if (w.tzone) p.tzone = w.tzone;
    }

    if (currentFields.includes("name") && w.name) {
      if (
        [
          "Vedic Numerology",
          "Western Numerology",
          "Vedic Compatibility",
        ].includes(subCategory)
      ) {
        delete p.hour;
        delete p.min;
        delete p.lat;
        delete p.lon;
        delete p.tzone;
      }
      p.name = w.name;
    }

    if (currentFields.includes("sign") && w.sign) p.sign = w.sign;
    if (currentFields.includes("timezone_only") && w.timezone_only)
      p.timezone = w.timezone_only;
    if (currentFields.includes("varshaphal_year") && w.varshaphal_year)
      p.varshaphal_year = w.varshaphal_year;
    if (currentFields.includes("house_type") && w.house_type)
      p.house_type = w.house_type;
    if (currentFields.includes("solar_year") && w.solar_year)
      p.solar_year = w.solar_year;

    if (currentFields.includes("partner")) {
      const pd = splitDate(w.p_date || "");
      const pt = splitTime(w.p_time || "");
      if (pd.day) p.p_day = pd.day;
      if (pd.month) p.p_month = pd.month;
      if (pd.year) p.p_year = pd.year;
      if (pt.hour) p.p_hour = pt.hour;
      if (pt.min) p.p_min = pt.min;
      if (w.p_lat) p.p_lat = w.p_lat;
      if (w.p_lon) p.p_lon = w.p_lon;
      if (w.p_tzone) p.p_tzone = w.p_tzone;

      const sd = splitDate(w.s_date || "");
      const st = splitTime(w.s_time || "");
      if (sd.day) p.s_day = sd.day;
      if (sd.month) p.s_month = sd.month;
      if (sd.year) p.s_year = sd.year;
      if (st.hour) p.s_hour = st.hour;
      if (st.min) p.s_min = st.min;
      if (w.s_lat) p.s_lat = w.s_lat;
      if (w.s_lon) p.s_lon = w.s_lon;
      if (w.s_tzone) p.s_tzone = w.s_tzone;
    }

    return p;
  }, [apiKey, subCategory, currentFields, w]);

  const httpMethod = subCategoryMethod[subCategory] || "POST";

  const handleTestApi = async () => {
    setLoading(true);
    setRequestStatus("idle");
    const startTime = Date.now();
    try {
      const res = await fetch("/api/test-proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: buildSlug,
          params,
          token,
          method: httpMethod,
        }),
      });
      const data = await res.json();
      setResponse(data);
      setResponseTime(Date.now() - startTime);
      setRequestStatus(res.ok ? "success" : "error");
    } catch (err) {
      setResponse({ error: String(err) });
      setResponseTime(Date.now() - startTime);
      setRequestStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyResponse = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(response, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("Failed to copy");
    }
  };

  // ── Location Search Component ──
  const LocationSearch = ({
    latField,
    lonField,
    tzField,
  }: {
    latField: keyof FormValues;
    lonField: keyof FormValues;
    tzField: keyof FormValues;
  }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<
      { display_name: string; lat: string; lon: string }[]
    >([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [searching, setSearching] = useState(false);
    const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(
      null,
    );

    const handleSearch = (value: string) => {
      setQuery(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (value.length < 2) {
        setResults([]);
        setShowDropdown(false);
        return;
      }
      debounceRef.current = setTimeout(async () => {
        setSearching(true);
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=5`,
          );
          const data = await res.json();
          setResults(data);
          setShowDropdown(data.length > 0);
        } catch {
          setResults([]);
        } finally {
          setSearching(false);
        }
      }, 400);
    };

    const handleSelect = (item: {
      display_name: string;
      lat: string;
      lon: string;
    }) => {
      const lat = parseFloat(item.lat).toFixed(4);
      const lon = parseFloat(item.lon).toFixed(4);
      const tz = (Math.round((parseFloat(item.lon) / 15) * 2) / 2).toString();
      setValue(latField, lat);
      setValue(lonField, lon);
      setValue(tzField, tz);
      setQuery(item.display_name);
      setShowDropdown(false);
    };

    return (
      <div className="relative">
        <label className="text-xs font-semibold text-gray-500 mb-1.5 flex items-center gap-1.5">
          <Iconify icon="lucide:map-pin" className="text-blue-500" />
          Search Location
        </label>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => results.length > 0 && setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            placeholder="Type city or place name..."
            className="w-full h-10 px-4 pr-10 text-sm text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-xl bg-gray-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none transition-all"
          />
          {searching ? (
            <Iconify
              icon="lucide:loader-2"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin"
            />
          ) : (
            <Iconify
              icon="lucide:search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          )}
        </div>
        {showDropdown && results.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-gray-100 dark:border-white/10 rounded-xl shadow-lg max-h-[200px] overflow-auto">
            {results.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onMouseDown={() => handleSelect(item)}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors border-b border-gray-50 dark:border-white/5 last:border-b-0 flex items-start gap-2"
              >
                <Iconify
                  icon="lucide:map-pin"
                  className="text-gray-400 mt-0.5 shrink-0"
                />
                <span className="line-clamp-2">{item.display_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  // ── DateTimeBlock Component ──
  const DateTimeBlock = ({ prefix = "" }: { prefix?: string }) => {
    const dateField = (prefix ? `${prefix}_date` : "date") as keyof FormValues;
    const timeField = (prefix ? `${prefix}_time` : "time") as keyof FormValues;
    const latField = (prefix ? `${prefix}_lat` : "lat") as keyof FormValues;
    const lonField = (prefix ? `${prefix}_lon` : "lon") as keyof FormValues;
    const tzField = (prefix ? `${prefix}_tzone` : "tzone") as keyof FormValues;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 flex items-center gap-1.5">
              <Iconify icon="lucide:calendar" className="text-violet-500" />
              Date
            </label>
            <input
              type="date"
              {...register(dateField)}
              className="w-full h-10 px-3 text-sm text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-xl bg-gray-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 flex items-center gap-1.5">
              <Iconify icon="lucide:clock" className="text-emerald-500" />
              Time
            </label>
            <input
              type="time"
              {...register(timeField)}
              className="w-full h-10 px-3 text-sm text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-xl bg-gray-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none transition-all"
            />
          </div>
        </div>
        <LocationSearch
          latField={latField}
          lonField={lonField}
          tzField={tzField}
        />
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
              Latitude
            </label>
            <input
              type="text"
              {...register(latField)}
              placeholder="22.57"
              className="w-full h-10 px-3 text-sm text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-xl bg-gray-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
              Longitude
            </label>
            <input
              type="text"
              {...register(lonField)}
              placeholder="88.36"
              className="w-full h-10 px-3 text-sm text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-xl bg-gray-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
              Timezone
            </label>
            <input
              type="text"
              {...register(tzField)}
              placeholder="5.5"
              className="w-full h-10 px-3 text-sm text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-xl bg-gray-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none transition-all"
            />
          </div>
        </div>
      </div>
    );
  };

  // ── Select Input Component ──
  const SelectInput = ({
    label,
    icon,
    iconColor,
    options,
    field,
    placeholder,
  }: {
    label: string;
    icon: string;
    iconColor: string;
    options: string[];
    field: keyof FormValues;
    placeholder?: string;
  }) => (
    <div>
      <label className="text-xs font-semibold text-gray-500 mb-1.5 flex items-center gap-1.5">
        <Iconify icon={icon} className={iconColor} />
        {label}
      </label>
      <div className="relative">
        <select
          {...register(field)}
          className="w-full h-10 px-3 pr-10 text-sm text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-xl bg-gray-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none transition-all appearance-none cursor-pointer"
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </option>
          ))}
        </select>
        <Iconify
          icon="lucide:chevron-down"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
      </div>
    </div>
  );

  return (
    <div className=" transition-colors duration-300">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-violet-100/40 to-purple-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-100/30 to-blue-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
      </div>

      <div className="relative z-10  max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden bg-linear-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl shadow-purple-500/20">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern
                  id="grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="white"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Iconify
                  icon="lucide:terminal"
                  className="text-white text-xl sm:text-2xl"
                />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">
                  API Testing Console
                </h1>
                <p className="text-purple-100/80 text-sm">
                  Test and explore all available API endpoints
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/10">
                <span className="text-[10px] sm:text-xs text-purple-200">
                  API Key:
                </span>
                <code className="text-white text-[10px] sm:text-xs ml-1 sm:ml-2 font-mono">
                  {apiKey.slice(0, 8)}...{apiKey.slice(-4)}
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Categories Sidebar */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-gray-100 dark:border-white/5 p-3 sm:p-4 shadow-sm transition-colors">
              <h2 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest px-4 mb-4 transition-colors">
                Categories
              </h2>
              <div className="space-y-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ">
                {Object.keys(apiCategories).map((c) => (
                  <button
                    key={c}
                    onClick={() => setValue("category", c)}
                    className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl transition-all ${
                      category === c
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                        : "text-gray-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        category === c
                          ? "bg-white/20"
                          : "bg-gray-100 dark:bg-slate-700"
                      }`}
                    >
                      <Iconify
                        icon={categoryIcons[c] || "lucide:folder"}
                        className={`text-lg ${
                          category === c
                            ? "text-white"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      />
                    </div>
                    <span className="text-sm font-semibold">{c}</span>
                  </button>
                ))}
              </div>
            </div>
            {/* Params Panel */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm p-4 sm:p-6 lg:p-8 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8 pb-4 border-b border-gray-50 dark:border-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center transition-colors">
                    <Iconify
                      icon={categoryIcons[category]}
                      className="text-blue-600 dark:text-blue-400 text-xl"
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white transition-colors">
                      Parameters
                    </h2>
                    <p className="text-xs text-gray-400 dark:text-gray-500 leading-tight transition-colors">
                      Configure {subCategory} details
                    </p>
                  </div>
                </div>
                {currentFields.length > 0 && (
                  <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-lg">
                    {currentFields.length} fields required
                  </span>
                )}
              </div>

              {/* Sub Category Selection */}
              <div className="mb-8 pb-4 border-b border-gray-50 dark:border-white/5 transition-colors">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 block">
                  Endpoint
                </label>
                <div className="flex flex-wrap gap-2">
                  {(apiCategories[category] || []).map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => setValue("subCategory", sub)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
                        subCategory === sub
                          ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-purple-500/30"
                          : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                {currentFields.includes("datetime") && <DateTimeBlock />}

                {currentFields.includes("sign") && (
                  <SelectInput
                    label="Zodiac Sign"
                    icon="lucide:sparkles"
                    iconColor="text-amber-500"
                    options={signOptions}
                    field="sign"
                    placeholder="Select sign..."
                  />
                )}

                {currentFields.includes("timezone_only") && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1.5 flex items-center gap-1.5">
                      <Iconify icon="lucide:globe" className="text-blue-500" />
                      Timezone
                    </label>
                    <input
                      type="text"
                      {...register("timezone_only")}
                      placeholder="e.g., 5.5"
                      className="w-full h-10 px-3 text-sm text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-xl bg-gray-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none transition-all"
                    />
                  </div>
                )}

                {currentFields.includes("query_type") && (
                  <SelectInput
                    label="Query Type"
                    icon="lucide:filter"
                    iconColor="text-cyan-500"
                    options={queryTypeOptions}
                    field="query_type"
                  />
                )}

                {currentFields.includes("planet_name") && (
                  <SelectInput
                    label="Planet"
                    icon="lucide:orbit"
                    iconColor="text-purple-500"
                    options={planetOptions}
                    field="planet_name"
                  />
                )}

                {currentFields.includes("name") && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1.5 flex items-center gap-1.5">
                      <Iconify icon="lucide:user" className="text-rose-500" />
                      Name
                    </label>
                    <input
                      type="text"
                      {...register("name")}
                      placeholder="Enter name..."
                      className="w-full h-10 px-3 text-sm text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-xl bg-gray-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none transition-all"
                    />
                  </div>
                )}

                {currentFields.includes("varshaphal_year") && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1.5 flex items-center gap-1.5">
                      <Iconify
                        icon="lucide:calendar-range"
                        className="text-indigo-500"
                      />
                      Varshaphal Year
                    </label>
                    <input
                      type="number"
                      {...register("varshaphal_year")}
                      placeholder="2026"
                      className="w-full h-10 px-3 text-sm text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-xl bg-gray-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none transition-all"
                    />
                  </div>
                )}

                {currentFields.includes("house_type") && (
                  <SelectInput
                    label="House Type"
                    icon="lucide:home"
                    iconColor="text-teal-500"
                    options={houseTypeOptions}
                    field="house_type"
                  />
                )}

                {currentFields.includes("solar_year") && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1.5 flex items-center gap-1.5">
                      <Iconify icon="lucide:sun" className="text-yellow-500" />
                      Solar Year
                    </label>
                    <input
                      type="number"
                      {...register("solar_year")}
                      placeholder="2026"
                      className="w-full h-10 px-3 text-sm text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-xl bg-gray-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none transition-all"
                    />
                  </div>
                )}

                {currentFields.includes("calendar_month") && (
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
                        Month
                      </label>
                      <input
                        type="number"
                        {...register("calendar_month")}
                        placeholder="1-12"
                        min={1}
                        max={12}
                        className="w-full h-10 px-3 text-sm text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-xl bg-gray-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
                        Year
                      </label>
                      <input
                        type="number"
                        {...register("calendar_year")}
                        placeholder="2026"
                        className="w-full h-10 px-3 text-sm text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-xl bg-gray-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none transition-all"
                      />
                    </div>
                    <SelectInput
                      label="Type"
                      icon="lucide:list"
                      iconColor="text-gray-500"
                      options={calendarTypeOptions}
                      field="calendar_type"
                    />
                  </div>
                )}

                {currentFields.includes("partner") && (
                  <div className="space-y-6">
                    <div className="p-4 rounded-xl bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-100">
                      <h3 className="text-sm font-bold text-pink-700 mb-4 flex items-center gap-2">
                        <Iconify icon="lucide:user" className="text-lg" />
                        Primary Person
                      </h3>
                      <DateTimeBlock prefix="p" />
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
                      <h3 className="text-sm font-bold text-blue-700 mb-4 flex items-center gap-2">
                        <Iconify icon="lucide:user" className="text-lg" />
                        Secondary Person
                      </h3>
                      <DateTimeBlock prefix="s" />
                    </div>
                  </div>
                )}

                {currentFields.length === 0 && (
                  <div className="text-center py-8">
                    <Iconify
                      icon="lucide:check-circle-2"
                      className="text-4xl text-emerald-400 mx-auto mb-3"
                    />
                    <p className="text-sm text-gray-500">
                      No parameters required for this endpoint
                    </p>
                  </div>
                )}

                {/* Test Button */}
                <button
                  type="button"
                  onClick={handleTestApi}
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 text-white text-sm font-bold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Iconify
                        icon="lucide:loader-2"
                        className="text-lg animate-spin"
                      />
                      Testing...
                    </>
                  ) : (
                    <>
                      <Iconify icon="lucide:play" className="text-lg" />
                      Test API
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Main Workspace */}
          <div className="lg:col-span-2 space-y-6">
            {/* RIGHT: Request & Response Panel */}
            <div className="space-y-6">
              {/* API Call Preview Panel */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm p-4 sm:p-6 lg:p-8 flex flex-col transition-colors">
                <div className="flex items-center justify-between mb-6 sm:mb-8 pb-4 border-b border-gray-50 dark:border-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center transition-colors text-emerald-600 dark:text-emerald-400">
                      <Iconify icon="lucide:globe" className="text-xl" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white transition-colors">
                        API Call
                      </h2>
                      <p className="text-xs text-gray-400 dark:text-gray-500 transition-colors">
                        Preview request structure
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 flex-1">
                  <div className="group relative">
                    <div className="bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-white/5 rounded-2xl p-4 transition-all hover:border-blue-200 dark:hover:border-blue-900/40">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-lg transition-colors">
                          Endpoint
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-lg transition-colors">
                          {httpMethod}
                        </span>
                      </div>
                      <div className="text-sm font-mono text-gray-600 dark:text-slate-300 break-all leading-relaxed transition-colors">
                        {displayUrl}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-white/5 rounded-2xl p-4 transition-colors">
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 transition-colors">
                      {httpMethod === "GET" ? "Query Params" : "JSON Body"}
                    </div>
                    <pre className="text-xs font-mono text-indigo-600 dark:text-indigo-400 whitespace-pre-wrap break-all transition-colors">
                      {JSON.stringify(params, null, 2)}
                    </pre>
                  </div>

                  <button
                    type="button"
                    onClick={handleTestApi}
                    disabled={loading}
                    className="w-full h-12 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 text-white text-sm font-bold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Iconify
                          icon="lucide:loader-2"
                          className="text-lg animate-spin"
                        />
                        Testing...
                      </>
                    ) : (
                      <>
                        <Iconify icon="lucide:play" className="text-lg" />
                        Test API
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Response Section */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden transition-colors">
                <div className="p-4 sm:p-6 lg:px-8 border-b border-gray-50 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/30 dark:bg-slate-800/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 transition-colors">
                      <Iconify icon="lucide:code" className="text-xl" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white transition-colors">
                        Server Response
                      </h2>
                      {requestStatus !== "idle" && (
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 transition-colors">
                            <Iconify icon="lucide:clock" className="text-xs" />
                            {responseTime}ms
                          </span>
                          <span
                            className={`text-[10px] font-black uppercase tracking-widest transition-colors ${requestStatus === "success" ? "text-emerald-500" : "text-red-500"}`}
                          >
                            • {requestStatus}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handleCopyResponse}
                    disabled={requestStatus === "idle"}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      copied
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                    } disabled:opacity-50`}
                  >
                    <Iconify icon={copied ? "lucide:check" : "lucide:copy"} />
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>

                <div className="relative group">
                  <div className="bg-gray-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-8 min-h-[200px] sm:min-h-[300px] max-h-[600px] overflow-auto transition-colors">
                    {loading ? (
                      <div className="h-[200px] flex flex-col items-center justify-center gap-4">
                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm font-bold text-blue-600 dark:text-blue-400 animate-pulse transition-colors">
                          Waiting for server...
                        </p>
                      </div>
                    ) : requestStatus === "idle" ? (
                      <div className="h-[200px] flex flex-col items-center justify-center text-center opacity-40">
                        <Iconify
                          icon="lucide:terminal"
                          className="text-5xl mb-4 text-gray-300 dark:text-gray-600 transition-colors"
                        />
                        <p className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest transition-colors">
                          Enter parameters and test
                        </p>
                      </div>
                    ) : (
                      <pre className="text-xs md:text-sm font-mono text-gray-600 dark:text-slate-300 leading-relaxed transition-colors">
                        <code
                          dangerouslySetInnerHTML={{
                            __html: JSON.stringify(response, null, 2)
                              .replace(/&/g, "&amp;")
                              .replace(/</g, "&lt;")
                              .replace(/>/g, "&gt;")
                              .replace(
                                /&quot;([^&]+?)&quot;:/g,
                                '<span class="text-purple-400">"$1"</span>:',
                              )
                              .replace(
                                /: &quot;([^&]*?)&quot;/g,
                                ': <span class="text-emerald-400">"$1"</span>',
                              )
                              .replace(
                                /: (\d+)/g,
                                ': <span class="text-amber-400">$1</span>',
                              )
                              .replace(
                                /: (true|false)/g,
                                ': <span class="text-blue-400">$1</span>',
                              )
                              .replace(
                                /: (null)/g,
                                ': <span class="text-red-400">$1</span>',
                              ),
                          }}
                        />
                      </pre>
                    )}
                  </div>

                  {/* Response Stats */}
                  {requestStatus !== "idle" && !loading && (
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <Iconify
                          icon="lucide:clock"
                          className="text-gray-400"
                        />
                        <span className="text-xs text-gray-500">
                          Response Time:{" "}
                          <span className="font-semibold text-gray-700">
                            {responseTime}ms
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Iconify
                          icon="lucide:file-json"
                          className="text-gray-400"
                        />
                        <span className="text-xs text-gray-500">
                          Size:{" "}
                          <span className="font-semibold text-gray-700">
                            {(
                              new Blob([JSON.stringify(response)]).size / 1024
                            ).toFixed(2)}{" "}
                            KB
                          </span>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Tips Card */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-100 p-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                    <Iconify
                      icon="lucide:lightbulb"
                      className="text-amber-600"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-amber-800 mb-1">
                      Quick Tips
                    </h3>
                    <ul className="text-xs text-amber-700 space-y-1">
                      <li>
                        • Search for location to auto-fill lat, lon, and
                        timezone
                      </li>
                      <li>• All datetime fields use your local time format</li>
                      <li>
                        • Response times may vary based on endpoint complexity
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
