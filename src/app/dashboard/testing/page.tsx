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

// ── Form values: use date+time pickers (single field) instead of DD/MM/YYYY/HH/MM ──
interface FormValues {
  category: string;
  subCategory: string;
  date: string; // "2026-02-11" → auto-split to day/month/year
  time: string; // "10:30" → auto-split to hour/min
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
  // Partner fields (Love Compatibility)
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

// Helper: split "2026-02-11" → { day: "11", month: "2", year: "2026" }
function splitDate(dateStr: string) {
  if (!dateStr) return {};
  const [y, m, d] = dateStr.split("-");
  return { day: String(Number(d)), month: String(Number(m)), year: y };
}

// Helper: split "10:30" → { hour: "10", min: "30" }
function splitTime(timeStr: string) {
  if (!timeStr) return {};
  const [h, m] = timeStr.split(":");
  return { hour: String(Number(h)), min: String(Number(m)) };
}

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

  const currentFields = useMemo(
    () => subCategoryFields[subCategory] || [],
    [subCategory],
  );

  useEffect(() => {
    const subs = apiCategories[category];
    if (subs && subs.length > 0) setValue("subCategory", subs[0]);
  }, [category, setValue]);

  // Build slug (sent to proxy; proxy resolves full URL via WEB_SOKET_LINK env)
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

  // Display URL (for UI only – shows what the proxy will call on the backend)
  const displayUrl = `http://localhost:3000/api/${buildSlug}`;

  // Build params (auto-split date/time into day/month/year/hour/min)
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

    // Numerology: only day/month/year + name
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

    // Love Compatibility
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
    try {
      const res = await fetch("/api/test-proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: buildSlug, // proxy resolves via WEB_SOKET_LINK
          params,
          token,
          method: httpMethod,
        }),
      });
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setResponse({ error: String(err) });
    } finally {
      setLoading(false);
    }
  };

  // ── Styles ──
  const inputCls =
    "border border-[#e2e8f0] rounded-[8px] px-3 py-[8px] text-[14px] text-[#1e293b] bg-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6]";
  const labelCls = "text-[13px] font-medium text-[#64748b] mb-1.5 block";

  const SelectChevron = () => (
    <Iconify
      icon="lucide:chevron-down"
      className="absolute right-3 top-1/2 -translate-y-1/2 text-[14px] text-[#94a3b8] pointer-events-none"
    />
  );

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
      // Estimate timezone from longitude (nearest 0.5)
      const tz = (Math.round((parseFloat(item.lon) / 15) * 2) / 2).toString();

      setValue(latField, lat);
      setValue(lonField, lon);
      setValue(tzField, tz);
      setQuery(item.display_name);
      setShowDropdown(false);
    };

    return (
      <div className="relative">
        <label className={labelCls}>
          <Iconify
            icon="lucide:map-pin"
            className="inline text-[13px] mr-1 text-[#3b82f6]"
          />
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
            className={`w-full ${inputCls} pr-8`}
          />
          {searching && (
            <Iconify
              icon="lucide:loader-2"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[14px] text-[#94a3b8] animate-spin"
            />
          )}
          {!searching && query.length > 0 && (
            <Iconify
              icon="lucide:search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[14px] text-[#94a3b8]"
            />
          )}
        </div>
        {showDropdown && results.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-[#e2e8f0] rounded-[8px] shadow-lg max-h-[200px] overflow-auto">
            {results.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onMouseDown={() => handleSelect(item)}
                className="w-full text-left px-3 py-2 text-[13px] text-[#334155] hover:bg-[#f1f5f9] transition-colors border-b border-[#f1f5f9] last:border-b-0"
              >
                <Iconify
                  icon="lucide:map-pin"
                  className="inline text-[12px] mr-1.5 text-[#94a3b8]"
                />
                {item.display_name}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  // ── DateTimeBlock: date picker + time picker + location search + lat/lon/tz ──
  const DateTimeBlock = ({ prefix = "" }: { prefix?: string }) => {
    const dateField = (prefix ? `${prefix}_date` : "date") as keyof FormValues;
    const timeField = (prefix ? `${prefix}_time` : "time") as keyof FormValues;
    const latField = (prefix ? `${prefix}_lat` : "lat") as keyof FormValues;
    const lonField = (prefix ? `${prefix}_lon` : "lon") as keyof FormValues;
    const tzField = (prefix ? `${prefix}_tzone` : "tzone") as keyof FormValues;
    const label = prefix
      ? ` (${prefix === "p" ? "Primary" : "Secondary"})`
      : "";

    return (
      <div className="space-y-3">
        <div className="flex gap-3">
          <div>
            <label className={labelCls}>Date{label}</label>
            <input
              type="date"
              {...register(dateField)}
              className={`w-[170px] ${inputCls}`}
            />
          </div>
          <div>
            <label className={labelCls}>Time{label}</label>
            <input
              type="time"
              {...register(timeField)}
              className={`w-[130px] ${inputCls}`}
            />
          </div>
        </div>
        {/* Location Search */}
        <LocationSearch
          latField={latField}
          lonField={lonField}
          tzField={tzField}
        />
        {/* Lat / Lon / Timezone (auto-filled, still editable) */}
        <div className="flex gap-3">
          <div>
            <label className={labelCls}>Latitude</label>
            <input
              type="text"
              {...register(latField)}
              placeholder="22.57"
              className={`w-[120px] ${inputCls}`}
            />
          </div>
          <div>
            <label className={labelCls}>Longitude</label>
            <input
              type="text"
              {...register(lonField)}
              placeholder="88.36"
              className={`w-[120px] ${inputCls}`}
            />
          </div>
          <div>
            <label className={labelCls}>Timezone</label>
            <input
              type="text"
              {...register(tzField)}
              placeholder="5.5"
              className={`w-[80px] ${inputCls}`}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 w-full bg-white relative min-h-screen">
      {/* Decoration */}
      <div className="absolute top-0 right-0 w-full overflow-hidden h-[180px] pointer-events-none z-0">
        <div className="absolute top-[-30px] left-[5%] w-[150px] h-[40px] bg-[#22d3ee]/20 -rotate-12 blur-[2px]" />
        <div className="absolute top-[10px] left-[12%] w-[180px] h-[50px] bg-[#c084fc]/20 -rotate-6 blur-[2px]" />
        <div className="absolute bottom-[-50px] right-[-20px] w-[200px] h-[80px] bg-[#c084fc]/10 -rotate-15 blur-[2px]" />
        <div className="absolute bottom-[-20px] right-[10%] w-[150px] h-[60px] bg-[#22d3ee]/10 rotate-10 blur-[2px]" />
      </div>

      <div className="p-6 md:p-8 max-w-[1400px] mx-auto relative z-10 space-y-6">
        <h1 className="text-[28px] font-bold text-[#1e293b] tracking-tight">
          Testing
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6">
          {/* ── LEFT: Params ── */}
          <div className="bg-white border border-[#e2e8f0] rounded-[16px] shadow-sm p-6">
            <h2 className="text-[18px] font-bold text-[#1e293b] mb-5">
              Params
            </h2>

            {/* Category + Sub Category */}
            <div className="flex gap-4 mb-2">
              <div className="flex-1">
                <label className="text-[13px] font-semibold text-[#3b82f6] mb-1.5 block">
                  API Category
                </label>
                <div className="relative">
                  <select
                    {...register("category")}
                    className={`w-full ${inputCls} appearance-none cursor-pointer`}
                  >
                    {Object.keys(apiCategories).map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <SelectChevron />
                </div>
              </div>
              <div className="flex-1">
                <label className="text-[13px] font-semibold text-[#64748b] mb-1.5 block">
                  API Sub Category
                </label>
                <div className="relative">
                  <select
                    {...register("subCategory")}
                    className={`w-full ${inputCls} appearance-none cursor-pointer`}
                  >
                    {(apiCategories[category] || []).map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <SelectChevron />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-5 mt-3">
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded ${httpMethod === "GET" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}
              >
                {httpMethod}
              </span>
              <p className="text-[11px] text-[#94a3b8] italic">
                *Fill all fields to get the correct response
              </p>
            </div>

            {/* ── Dynamic Fields ── */}
            <div className="space-y-4">
              {currentFields.includes("datetime") && <DateTimeBlock />}

              {currentFields.includes("sign") && (
                <div>
                  <label className={labelCls}>Sign</label>
                  <div className="relative w-[160px]">
                    <select
                      {...register("sign")}
                      className={`w-full ${inputCls} appearance-none cursor-pointer`}
                    >
                      <option value=""></option>
                      {signOptions.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <SelectChevron />
                  </div>
                </div>
              )}

              {currentFields.includes("timezone_only") && (
                <div>
                  <label className={labelCls}>Timezone</label>
                  <input
                    type="text"
                    {...register("timezone_only")}
                    placeholder="5.5"
                    className={`w-[100px] ${inputCls}`}
                  />
                </div>
              )}

              {currentFields.includes("query_type") && (
                <div>
                  <label className={labelCls}>Query Type</label>
                  <div className="relative w-[180px]">
                    <select
                      {...register("query_type")}
                      className={`w-full ${inputCls} appearance-none cursor-pointer`}
                    >
                      {queryTypeOptions.map((q) => (
                        <option key={q} value={q}>
                          {q}
                        </option>
                      ))}
                    </select>
                    <SelectChevron />
                  </div>
                </div>
              )}

              {currentFields.includes("planet_name") && (
                <div>
                  <label className={labelCls}>Planet Name</label>
                  <div className="relative w-[160px]">
                    <select
                      {...register("planet_name")}
                      className={`w-full ${inputCls} appearance-none cursor-pointer`}
                    >
                      {planetOptions.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                    <SelectChevron />
                  </div>
                </div>
              )}

              {currentFields.includes("name") && (
                <div>
                  <label className={labelCls}>Name</label>
                  <input
                    type="text"
                    {...register("name")}
                    placeholder="John Doe"
                    className={`w-[200px] ${inputCls}`}
                  />
                </div>
              )}

              {currentFields.includes("varshaphal_year") && (
                <div>
                  <label className={labelCls}>Varshaphal Year</label>
                  <input
                    type="number"
                    {...register("varshaphal_year")}
                    placeholder="2026"
                    className={`w-[120px] ${inputCls}`}
                  />
                </div>
              )}

              {currentFields.includes("house_type") && (
                <div>
                  <label className={labelCls}>House Type</label>
                  <div className="relative w-[180px]">
                    <select
                      {...register("house_type")}
                      className={`w-full ${inputCls} appearance-none cursor-pointer`}
                    >
                      {houseTypeOptions.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                    <SelectChevron />
                  </div>
                </div>
              )}

              {currentFields.includes("solar_year") && (
                <div>
                  <label className={labelCls}>Solar Year</label>
                  <input
                    type="number"
                    {...register("solar_year")}
                    placeholder="2026"
                    className={`w-[120px] ${inputCls}`}
                  />
                </div>
              )}

              {currentFields.includes("calendar_month") && (
                <div className="flex gap-3">
                  <div>
                    <label className={labelCls}>Month</label>
                    <input
                      type="number"
                      {...register("calendar_month")}
                      placeholder="1-12"
                      min={1}
                      max={12}
                      className={`w-[80px] ${inputCls}`}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Year</label>
                    <input
                      type="number"
                      {...register("calendar_year")}
                      placeholder="2026"
                      className={`w-[100px] ${inputCls}`}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Type</label>
                    <div className="relative w-[120px]">
                      <select
                        {...register("calendar_type")}
                        className={`w-full ${inputCls} appearance-none cursor-pointer`}
                      >
                        {calendarTypeOptions.map((ct) => (
                          <option key={ct} value={ct}>
                            {ct}
                          </option>
                        ))}
                      </select>
                      <SelectChevron />
                    </div>
                  </div>
                </div>
              )}

              {currentFields.includes("partner") && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-[14px] font-bold text-[#1e293b] mb-3 border-b border-[#e2e8f0] pb-2">
                      👤 Primary Person
                    </h3>
                    <DateTimeBlock prefix="p" />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-[#1e293b] mb-3 border-b border-[#e2e8f0] pb-2">
                      👤 Secondary Person
                    </h3>
                    <DateTimeBlock prefix="s" />
                  </div>
                </div>
              )}

              {currentFields.length === 0 && (
                <p className="text-[13px] text-[#94a3b8] italic">
                  No parameters required.
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleTestApi}
              disabled={loading}
              className="mt-6 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-[14px] font-bold px-6 py-[10px] rounded-[8px] transition-colors shadow-sm disabled:opacity-60"
            >
              {loading ? "Loading..." : "Test API"}
            </button>
          </div>

          {/* ── RIGHT: API Call ── */}
          <div className="bg-white border border-[#e2e8f0] rounded-[16px] shadow-sm p-6 flex flex-col">
            <h2 className="text-[18px] font-bold text-[#1e293b] mb-5">
              API Call
            </h2>

            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px] p-4 mb-4">
              <span
                className={`text-[12px] font-bold px-2 py-0.5 rounded mr-2 ${httpMethod === "GET" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}
              >
                {httpMethod}
              </span>
              <span className="text-[13px] font-medium text-[#6366f1] break-all">
                {displayUrl}
              </span>
            </div>

            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px] p-4 mb-5">
              <div className="text-[13px] font-bold text-[#1e293b] mb-1">
                {httpMethod === "GET" ? "query params:" : "body:"}
              </div>
              <pre className="text-[13px] font-medium text-[#6366f1] font-mono whitespace-pre-wrap break-all">
                {JSON.stringify(params, null, 2)}
              </pre>
            </div>

            <button
              type="button"
              onClick={handleTestApi}
              disabled={loading}
              className="self-start bg-[#3b82f6] hover:bg-[#2563eb] text-white text-[14px] font-bold px-6 py-[10px] rounded-[8px] transition-colors shadow-sm mb-5 disabled:opacity-60"
            >
              {loading ? "Loading..." : "Test API"}
            </button>

            <div>
              <h3 className="text-[16px] font-bold text-[#1e293b] mb-3">
                Response
              </h3>
              <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px] p-4 min-h-[200px] max-h-[500px] overflow-auto">
                <pre className="text-[13px] font-mono text-[#334155] whitespace-pre-wrap break-all">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
