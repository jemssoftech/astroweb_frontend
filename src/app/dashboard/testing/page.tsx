// "use client";
// import React, { useState, useEffect, useMemo } from "react";
// import { useForm, useWatch } from "react-hook-form";
// import Iconify from "@/src/components/Iconify";
// import { getUser, getAuthToken } from "@/src/lib/auth";

// // ── Category -> Sub Categories ──
// const apiCategories: Record<string, string[]> = {
//   "Astrology Systems": [
//     "Ashtakvarga",
//     "Basic Astro Details",
//     "Char Dasha",
//     "KP System",
//     "Lal Kitab",
//     "Varshaphal",
//     "Vimshottari Dasha",
//     "Yogini Dasha",
//   ],
//   Predictions: [
//     "Daily Horoscope",
//     "Daily Nakshatra Prediction",
//     "Transits",
//     "Personality Report",
//     "Remedies",
//   ],
//   "Life Path Reports": [
//     "Planet Nature",
//     "General Ascendant Report",
//     "General Nakshatra Report",
//     "General House Report",
//     "General Rashi Report",
//     "Life Path Predict",
//   ],
//   Numerology: ["Vedic Numerology", "Western Numerology"],
//   "Match Making": ["Vedic Compatibility", "Love Compatibility"],
//   "Western Astrology": ["Natal Chart", "Solar Return", "Lunar"],
//   Utilities: ["Hindu Calendar", "List All Routes"],
// };

// // ── Slug mapping ──
// const subCategorySlugs: Record<string, string> = {
//   Ashtakvarga: "ashtakvarga",
//   "Basic Astro Details": "basic-astro-details",
//   "Char Dasha": "char-dasha",
//   Calendar: "calendar",
//   "KP System": "kp-system",
//   "Lal Kitab": "lalkitab",
//   Varshaphal: "varshaphal",
//   "Vimshottari Dasha": "vimshottari-dasha",
//   "Yogini Dasha": "yogini-dasha",
//   "Daily Horoscope": "daily-horoscope",
//   "Daily Nakshatra Prediction": "daily_nakshatra",
//   Transits: "transits",
//   "Personality Report": "personality",
//   Remedies: "remedies",
//   "Planet Nature": "life-path/planet_nature",
//   "General Ascendant Report": "life-path/general_ascendant_report",
//   "General Nakshatra Report": "life-path/general_nakshatra_report",
//   "General House Report": "life-path/general_house_report",
//   "General Rashi Report": "life-path/general_rashi_report",
//   "Life Path Predict": "life-path/predict",
//   "Vedic Numerology": "indian-numerology",
//   "Western Numerology": "western_numerology",
//   "Vedic Compatibility": "compatibility",
//   "Love Compatibility": "love-compatibility",
//   "Natal Chart": "natal-chart",
//   "Solar Return": "solar-return",
//   Lunar: "lunar",
//   "Hindu Calendar": "calendar/hindu-calender",
//   "List All Routes": "routes",
// };

// // ── Field types ──
// type FieldName =
//   | "datetime"
//   | "sign"
//   | "timezone_only"
//   | "query_type"
//   | "planet_name"
//   | "name"
//   | "varshaphal_year"
//   | "house_type"
//   | "solar_year"
//   | "calendar_month"
//   | "calendar_year"
//   | "calendar_type"
//   | "partner";

// const subCategoryFields: Record<string, FieldName[]> = {
//   Ashtakvarga: ["datetime"],
//   "Basic Astro Details": ["datetime"],
//   "Char Dasha": ["datetime"],
//   "KP System": ["datetime"],
//   "Lal Kitab": ["datetime"],
//   Varshaphal: ["datetime", "varshaphal_year"],
//   "Vimshottari Dasha": ["datetime"],
//   "Yogini Dasha": ["datetime"],
//   "Daily Horoscope": ["sign", "timezone_only"],
//   "Daily Nakshatra Prediction": ["datetime", "query_type"],
//   Transits: ["datetime"],
//   "Personality Report": ["datetime"],
//   Remedies: ["datetime"],
//   "Planet Nature": ["datetime"],
//   "General Ascendant Report": ["datetime"],
//   "General Nakshatra Report": ["datetime"],
//   "General House Report": ["datetime", "planet_name"],
//   "General Rashi Report": ["datetime", "planet_name"],
//   "Life Path Predict": ["datetime"],
//   "Vedic Numerology": ["datetime", "name"],
//   "Western Numerology": ["datetime", "name"],
//   "Vedic Compatibility": ["datetime", "name"],
//   "Love Compatibility": ["partner"],
//   "Natal Chart": ["datetime", "house_type"],
//   "Solar Return": ["datetime", "solar_year", "house_type"],
//   Lunar: ["datetime", "house_type"],
//   "Hindu Calendar": ["calendar_month", "calendar_year", "calendar_type"],
//   "List All Routes": [],
// };

// const subCategoryMethod: Record<string, string> = {
//   "Hindu Calendar": "GET",
//   "List All Routes": "GET",
// };

// const signOptions = [
//   "aries",
//   "taurus",
//   "gemini",
//   "cancer",
//   "leo",
//   "virgo",
//   "libra",
//   "scorpio",
//   "sagittarius",
//   "capricorn",
//   "aquarius",
//   "pisces",
// ];
// const planetOptions = [
//   "Sun",
//   "Moon",
//   "Mars",
//   "Mercury",
//   "Jupiter",
//   "Venus",
//   "Saturn",
//   "Rahu",
//   "Ketu",
// ];
// const queryTypeOptions = ["prediction", "next", "previous", "consolidated"];
// const houseTypeOptions = [
//   "placidus",
//   "koch",
//   "topocentric",
//   "poryphry",
//   "equal_house",
//   "whole_sign",
// ];
// const calendarTypeOptions = ["current", "previous", "next"];

// // ── Form values: use date+time pickers (single field) instead of DD/MM/YYYY/HH/MM ──
// interface FormValues {
//   category: string;
//   subCategory: string;
//   date: string; // "2026-02-11" → auto-split to day/month/year
//   time: string; // "10:30" → auto-split to hour/min
//   lat: string;
//   lon: string;
//   tzone: string;
//   sign: string;
//   timezone_only: string;
//   query_type: string;
//   planet_name: string;
//   name: string;
//   varshaphal_year: string;
//   house_type: string;
//   solar_year: string;
//   calendar_month: string;
//   calendar_year: string;
//   calendar_type: string;
//   // Partner fields (Love Compatibility)
//   p_date: string;
//   p_time: string;
//   p_lat: string;
//   p_lon: string;
//   p_tzone: string;
//   s_date: string;
//   s_time: string;
//   s_lat: string;
//   s_lon: string;
//   s_tzone: string;
// }

// // Helper: split "2026-02-11" → { day: "11", month: "2", year: "2026" }
// function splitDate(dateStr: string) {
//   if (!dateStr) return {};
//   const [y, m, d] = dateStr.split("-");
//   return { day: String(Number(d)), month: String(Number(m)), year: y };
// }

// // Helper: split "10:30" → { hour: "10", min: "30" }
// function splitTime(timeStr: string) {
//   if (!timeStr) return {};
//   const [h, m] = timeStr.split(":");
//   return { hour: String(Number(h)), min: String(Number(m)) };
// }

// export default function TestingPage() {
//   const user = getUser();
//   const token = getAuthToken();
//   const apiKey = user?.apikey || "1ac21f10-b176-585a-8e6f-de323548b29b";

//   const { register, control, setValue } = useForm<FormValues>({
//     defaultValues: {
//       category: "Astrology Systems",
//       subCategory: "Ashtakvarga",
//       date: "",
//       time: "",
//       lat: "",
//       lon: "",
//       tzone: "",
//       sign: "",
//       timezone_only: "",
//       query_type: "prediction",
//       planet_name: "Sun",
//       name: "",
//       varshaphal_year: "",
//       house_type: "placidus",
//       solar_year: "",
//       calendar_month: "",
//       calendar_year: "",
//       calendar_type: "current",
//       p_date: "",
//       p_time: "",
//       p_lat: "",
//       p_lon: "",
//       p_tzone: "",
//       s_date: "",
//       s_time: "",
//       s_lat: "",
//       s_lon: "",
//       s_tzone: "",
//     },
//   });

//   const w = useWatch({ control });
//   const category = w.category || "Astrology Systems";
//   const subCategory = w.subCategory || "Ashtakvarga";

//   const [response, setResponse] = useState<unknown>({});
//   const [loading, setLoading] = useState(false);

//   const currentFields = useMemo(
//     () => subCategoryFields[subCategory] || [],
//     [subCategory],
//   );

//   useEffect(() => {
//     const subs = apiCategories[category];
//     if (subs && subs.length > 0) setValue("subCategory", subs[0]);
//   }, [category, setValue]);

//   const buildSlug = useMemo(() => {
//     let slug = subCategorySlugs[subCategory] || "";
//     if (currentFields.includes("planet_name") && w.planet_name)
//       slug += `/${w.planet_name}`;
//     if (currentFields.includes("query_type") && w.query_type)
//       slug += `?type=${w.query_type}`;
//     if (subCategory === "Hindu Calendar") {
//       const qp = new URLSearchParams();
//       if (w.calendar_month) qp.set("month", w.calendar_month);
//       if (w.calendar_year) qp.set("year", w.calendar_year);
//       if (w.calendar_type) qp.set("type", w.calendar_type);
//       const qs = qp.toString();
//       if (qs) slug += `?${qs}`;
//     }
//     return slug;
//   }, [
//     subCategory,
//     currentFields,
//     w.planet_name,
//     w.query_type,
//     w.calendar_month,
//     w.calendar_year,
//     w.calendar_type,
//   ]);

//   // Display URL (for UI only – shows what the proxy will call on the backend)
//   const displayUrl = `http://localhost:3000/api/${buildSlug}`;

//   // Build params (auto-split date/time into day/month/year/hour/min)
//   const params = useMemo(() => {
//     const p: Record<string, string> = { api_key: apiKey };
//     const method = subCategoryMethod[subCategory] || "POST";
//     if (method === "GET") return p;

//     if (currentFields.includes("datetime")) {
//       const d = splitDate(w.date || "");
//       const t = splitTime(w.time || "");
//       Object.assign(p, d, t);
//       if (w.lat) p.lat = w.lat;
//       if (w.lon) p.lon = w.lon;
//       if (w.tzone) p.tzone = w.tzone;
//     }

//     // Numerology: only day/month/year + name
//     if (currentFields.includes("name") && w.name) {
//       if (
//         [
//           "Vedic Numerology",
//           "Western Numerology",
//           "Vedic Compatibility",
//         ].includes(subCategory)
//       ) {
//         delete p.hour;
//         delete p.min;
//         delete p.lat;
//         delete p.lon;
//         delete p.tzone;
//       }
//       p.name = w.name;
//     }

//     if (currentFields.includes("sign") && w.sign) p.sign = w.sign;
//     if (currentFields.includes("timezone_only") && w.timezone_only)
//       p.timezone = w.timezone_only;
//     if (currentFields.includes("varshaphal_year") && w.varshaphal_year)
//       p.varshaphal_year = w.varshaphal_year;
//     if (currentFields.includes("house_type") && w.house_type)
//       p.house_type = w.house_type;
//     if (currentFields.includes("solar_year") && w.solar_year)
//       p.solar_year = w.solar_year;

//     // Love Compatibility
//     if (currentFields.includes("partner")) {
//       const pd = splitDate(w.p_date || "");
//       const pt = splitTime(w.p_time || "");
//       if (pd.day) p.p_day = pd.day;
//       if (pd.month) p.p_month = pd.month;
//       if (pd.year) p.p_year = pd.year;
//       if (pt.hour) p.p_hour = pt.hour;
//       if (pt.min) p.p_min = pt.min;
//       if (w.p_lat) p.p_lat = w.p_lat;
//       if (w.p_lon) p.p_lon = w.p_lon;
//       if (w.p_tzone) p.p_tzone = w.p_tzone;

//       const sd = splitDate(w.s_date || "");
//       const st = splitTime(w.s_time || "");
//       if (sd.day) p.s_day = sd.day;
//       if (sd.month) p.s_month = sd.month;
//       if (sd.year) p.s_year = sd.year;
//       if (st.hour) p.s_hour = st.hour;
//       if (st.min) p.s_min = st.min;
//       if (w.s_lat) p.s_lat = w.s_lat;
//       if (w.s_lon) p.s_lon = w.s_lon;
//       if (w.s_tzone) p.s_tzone = w.s_tzone;
//     }

//     return p;
//   }, [apiKey, subCategory, currentFields, w]);

//   const httpMethod = subCategoryMethod[subCategory] || "POST";

//   const handleTestApi = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch("/api/test-proxy", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           slug: buildSlug,
//           params,
//           token,
//           method: httpMethod,
//         }),
//       });
//       const data = await res.json();
//       setResponse(data);
//     } catch (err) {
//       setResponse({ error: String(err) });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── Styles ──
//   const inputCls =
//     "border border-[#e2e8f0] rounded-[8px] px-3 py-[8px] text-[14px] text-[#1e293b] bg-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6]";
//   const labelCls = "text-[13px] font-medium text-[#64748b] mb-1.5 block";

//   const SelectChevron = () => (
//     <Iconify
//       icon="lucide:chevron-down"
//       className="absolute right-3 top-1/2 -translate-y-1/2 text-[14px] text-[#94a3b8] pointer-events-none"
//     />
//   );

//   // ── Location Search Component ──
//   const LocationSearch = ({
//     latField,
//     lonField,
//     tzField,
//   }: {
//     latField: keyof FormValues;
//     lonField: keyof FormValues;
//     tzField: keyof FormValues;
//   }) => {
//     const [query, setQuery] = useState("");
//     const [results, setResults] = useState<
//       { display_name: string; lat: string; lon: string }[]
//     >([]);
//     const [showDropdown, setShowDropdown] = useState(false);
//     const [searching, setSearching] = useState(false);
//     const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(
//       null,
//     );

//     const handleSearch = (value: string) => {
//       setQuery(value);
//       if (debounceRef.current) clearTimeout(debounceRef.current);
//       if (value.length < 2) {
//         setResults([]);
//         setShowDropdown(false);
//         return;
//       }
//       debounceRef.current = setTimeout(async () => {
//         setSearching(true);
//         try {
//           const res = await fetch(
//             `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=5`,
//           );
//           const data = await res.json();
//           setResults(data);
//           setShowDropdown(data.length > 0);
//         } catch {
//           setResults([]);
//         } finally {
//           setSearching(false);
//         }
//       }, 400);
//     };

//     const handleSelect = (item: {
//       display_name: string;
//       lat: string;
//       lon: string;
//     }) => {
//       const lat = parseFloat(item.lat).toFixed(4);
//       const lon = parseFloat(item.lon).toFixed(4);
//       // Estimate timezone from longitude (nearest 0.5)
//       const tz = (Math.round((parseFloat(item.lon) / 15) * 2) / 2).toString();

//       setValue(latField, lat);
//       setValue(lonField, lon);
//       setValue(tzField, tz);
//       setQuery(item.display_name);
//       setShowDropdown(false);
//     };

//     return (
//       <div className="relative">
//         <label className={labelCls}>
//           <Iconify
//             icon="lucide:map-pin"
//             className="inline text-[13px] mr-1 text-[#3b82f6]"
//           />
//           Search Location
//         </label>
//         <div className="relative">
//           <input
//             type="text"
//             value={query}
//             onChange={(e) => handleSearch(e.target.value)}
//             onFocus={() => results.length > 0 && setShowDropdown(true)}
//             onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
//             placeholder="Type city or place name..."
//             className={`w-full ${inputCls} pr-8`}
//           />
//           {searching && (
//             <Iconify
//               icon="lucide:loader-2"
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-[14px] text-[#94a3b8] animate-spin"
//             />
//           )}
//           {!searching && query.length > 0 && (
//             <Iconify
//               icon="lucide:search"
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-[14px] text-[#94a3b8]"
//             />
//           )}
//         </div>
//         {showDropdown && results.length > 0 && (
//           <div className="absolute z-50 w-full mt-1 bg-white border border-[#e2e8f0] rounded-[8px] shadow-lg max-h-[200px] overflow-auto">
//             {results.map((item, idx) => (
//               <button
//                 key={idx}
//                 type="button"
//                 onMouseDown={() => handleSelect(item)}
//                 className="w-full text-left px-3 py-2 text-[13px] text-[#334155] hover:bg-[#f1f5f9] transition-colors border-b border-[#f1f5f9] last:border-b-0"
//               >
//                 <Iconify
//                   icon="lucide:map-pin"
//                   className="inline text-[12px] mr-1.5 text-[#94a3b8]"
//                 />
//                 {item.display_name}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   // ── DateTimeBlock: date picker + time picker + location search + lat/lon/tz ──
//   const DateTimeBlock = ({ prefix = "" }: { prefix?: string }) => {
//     const dateField = (prefix ? `${prefix}_date` : "date") as keyof FormValues;
//     const timeField = (prefix ? `${prefix}_time` : "time") as keyof FormValues;
//     const latField = (prefix ? `${prefix}_lat` : "lat") as keyof FormValues;
//     const lonField = (prefix ? `${prefix}_lon` : "lon") as keyof FormValues;
//     const tzField = (prefix ? `${prefix}_tzone` : "tzone") as keyof FormValues;
//     const label = prefix
//       ? ` (${prefix === "p" ? "Primary" : "Secondary"})`
//       : "";

//     return (
//       <div className="space-y-3">
//         <div className="flex gap-3">
//           <div>
//             <label className={labelCls}>Date{label}</label>
//             <input
//               type="date"
//               {...register(dateField)}
//               className={`w-[170px] ${inputCls}`}
//             />
//           </div>
//           <div>
//             <label className={labelCls}>Time{label}</label>
//             <input
//               type="time"
//               {...register(timeField)}
//               className={`w-[130px] ${inputCls}`}
//             />
//           </div>
//         </div>
//         {/* Location Search */}
//         <LocationSearch
//           latField={latField}
//           lonField={lonField}
//           tzField={tzField}
//         />
//         {/* Lat / Lon / Timezone (auto-filled, still editable) */}
//         <div className="flex gap-3">
//           <div>
//             <label className={labelCls}>Latitude</label>
//             <input
//               type="text"
//               {...register(latField)}
//               placeholder="22.57"
//               className={`w-[120px] ${inputCls}`}
//             />
//           </div>
//           <div>
//             <label className={labelCls}>Longitude</label>
//             <input
//               type="text"
//               {...register(lonField)}
//               placeholder="88.36"
//               className={`w-[120px] ${inputCls}`}
//             />
//           </div>
//           <div>
//             <label className={labelCls}>Timezone</label>
//             <input
//               type="text"
//               {...register(tzField)}
//               placeholder="5.5"
//               className={`w-[80px] ${inputCls}`}
//             />
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="flex-1 w-full bg-white relative min-h-screen">
//       {/* Decoration */}
//       <div className="absolute top-0 right-0 w-full overflow-hidden h-[180px] pointer-events-none z-0">
//         <div className="absolute top-[-30px] left-[5%] w-[150px] h-[40px] bg-[#22d3ee]/20 -rotate-12 blur-[2px]" />
//         <div className="absolute top-[10px] left-[12%] w-[180px] h-[50px] bg-[#c084fc]/20 -rotate-6 blur-[2px]" />
//         <div className="absolute bottom-[-50px] right-[-20px] w-[200px] h-[80px] bg-[#c084fc]/10 -rotate-15 blur-[2px]" />
//         <div className="absolute bottom-[-20px] right-[10%] w-[150px] h-[60px] bg-[#22d3ee]/10 rotate-10 blur-[2px]" />
//       </div>

//       <div className="p-6 md:p-8 max-w-[1400px] mx-auto relative z-10 space-y-6">
//         <h1 className="text-[28px] font-bold text-[#1e293b] tracking-tight">
//           Testing
//         </h1>

//         <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6">
//           {/* ── LEFT: Params ── */}
//           <div className="bg-white border border-[#e2e8f0] rounded-[16px] shadow-sm p-6">
//             <h2 className="text-[18px] font-bold text-[#1e293b] mb-5">
//               Params
//             </h2>

//             {/* Category + Sub Category */}
//             <div className="flex gap-4 mb-2">
//               <div className="flex-1">
//                 <label className="text-[13px] font-semibold text-[#3b82f6] mb-1.5 block">
//                   API Category
//                 </label>
//                 <div className="relative">
//                   <select
//                     {...register("category")}
//                     className={`w-full ${inputCls} appearance-none cursor-pointer`}
//                   >
//                     {Object.keys(apiCategories).map((c) => (
//                       <option key={c} value={c}>
//                         {c}
//                       </option>
//                     ))}
//                   </select>
//                   <SelectChevron />
//                 </div>
//               </div>
//               <div className="flex-1">
//                 <label className="text-[13px] font-semibold text-[#64748b] mb-1.5 block">
//                   API Sub Category
//                 </label>
//                 <div className="relative">
//                   <select
//                     {...register("subCategory")}
//                     className={`w-full ${inputCls} appearance-none cursor-pointer`}
//                   >
//                     {(apiCategories[category] || []).map((s) => (
//                       <option key={s} value={s}>
//                         {s}
//                       </option>
//                     ))}
//                   </select>
//                   <SelectChevron />
//                 </div>
//               </div>
//             </div>

//             <div className="flex items-center gap-2 mb-5 mt-3">
//               <span
//                 className={`text-[11px] font-bold px-2 py-0.5 rounded ${httpMethod === "GET" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}
//               >
//                 {httpMethod}
//               </span>
//               <p className="text-[11px] text-[#94a3b8] italic">
//                 *Fill all fields to get the correct response
//               </p>
//             </div>

//             {/* ── Dynamic Fields ── */}
//             <div className="space-y-4">
//               {currentFields.includes("datetime") && <DateTimeBlock />}

//               {currentFields.includes("sign") && (
//                 <div>
//                   <label className={labelCls}>Sign</label>
//                   <div className="relative w-[160px]">
//                     <select
//                       {...register("sign")}
//                       className={`w-full ${inputCls} appearance-none cursor-pointer`}
//                     >
//                       <option value=""></option>
//                       {signOptions.map((s) => (
//                         <option key={s} value={s}>
//                           {s}
//                         </option>
//                       ))}
//                     </select>
//                     <SelectChevron />
//                   </div>
//                 </div>
//               )}

//               {currentFields.includes("timezone_only") && (
//                 <div>
//                   <label className={labelCls}>Timezone</label>
//                   <input
//                     type="text"
//                     {...register("timezone_only")}
//                     placeholder="5.5"
//                     className={`w-[100px] ${inputCls}`}
//                   />
//                 </div>
//               )}

//               {currentFields.includes("query_type") && (
//                 <div>
//                   <label className={labelCls}>Query Type</label>
//                   <div className="relative w-[180px]">
//                     <select
//                       {...register("query_type")}
//                       className={`w-full ${inputCls} appearance-none cursor-pointer`}
//                     >
//                       {queryTypeOptions.map((q) => (
//                         <option key={q} value={q}>
//                           {q}
//                         </option>
//                       ))}
//                     </select>
//                     <SelectChevron />
//                   </div>
//                 </div>
//               )}

//               {currentFields.includes("planet_name") && (
//                 <div>
//                   <label className={labelCls}>Planet Name</label>
//                   <div className="relative w-[160px]">
//                     <select
//                       {...register("planet_name")}
//                       className={`w-full ${inputCls} appearance-none cursor-pointer`}
//                     >
//                       {planetOptions.map((p) => (
//                         <option key={p} value={p}>
//                           {p}
//                         </option>
//                       ))}
//                     </select>
//                     <SelectChevron />
//                   </div>
//                 </div>
//               )}

//               {currentFields.includes("name") && (
//                 <div>
//                   <label className={labelCls}>Name</label>
//                   <input
//                     type="text"
//                     {...register("name")}
//                     placeholder="John Doe"
//                     className={`w-[200px] ${inputCls}`}
//                   />
//                 </div>
//               )}

//               {currentFields.includes("varshaphal_year") && (
//                 <div>
//                   <label className={labelCls}>Varshaphal Year</label>
//                   <input
//                     type="number"
//                     {...register("varshaphal_year")}
//                     placeholder="2026"
//                     className={`w-[120px] ${inputCls}`}
//                   />
//                 </div>
//               )}

//               {currentFields.includes("house_type") && (
//                 <div>
//                   <label className={labelCls}>House Type</label>
//                   <div className="relative w-[180px]">
//                     <select
//                       {...register("house_type")}
//                       className={`w-full ${inputCls} appearance-none cursor-pointer`}
//                     >
//                       {houseTypeOptions.map((h) => (
//                         <option key={h} value={h}>
//                           {h}
//                         </option>
//                       ))}
//                     </select>
//                     <SelectChevron />
//                   </div>
//                 </div>
//               )}

//               {currentFields.includes("solar_year") && (
//                 <div>
//                   <label className={labelCls}>Solar Year</label>
//                   <input
//                     type="number"
//                     {...register("solar_year")}
//                     placeholder="2026"
//                     className={`w-[120px] ${inputCls}`}
//                   />
//                 </div>
//               )}

//               {currentFields.includes("calendar_month") && (
//                 <div className="flex gap-3">
//                   <div>
//                     <label className={labelCls}>Month</label>
//                     <input
//                       type="number"
//                       {...register("calendar_month")}
//                       placeholder="1-12"
//                       min={1}
//                       max={12}
//                       className={`w-[80px] ${inputCls}`}
//                     />
//                   </div>
//                   <div>
//                     <label className={labelCls}>Year</label>
//                     <input
//                       type="number"
//                       {...register("calendar_year")}
//                       placeholder="2026"
//                       className={`w-[100px] ${inputCls}`}
//                     />
//                   </div>
//                   <div>
//                     <label className={labelCls}>Type</label>
//                     <div className="relative w-[120px]">
//                       <select
//                         {...register("calendar_type")}
//                         className={`w-full ${inputCls} appearance-none cursor-pointer`}
//                       >
//                         {calendarTypeOptions.map((ct) => (
//                           <option key={ct} value={ct}>
//                             {ct}
//                           </option>
//                         ))}
//                       </select>
//                       <SelectChevron />
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {currentFields.includes("partner") && (
//                 <div className="space-y-5">
//                   <div>
//                     <h3 className="text-[14px] font-bold text-[#1e293b] mb-3 border-b border-[#e2e8f0] pb-2">
//                       👤 Primary Person
//                     </h3>
//                     <DateTimeBlock prefix="p" />
//                   </div>
//                   <div>
//                     <h3 className="text-[14px] font-bold text-[#1e293b] mb-3 border-b border-[#e2e8f0] pb-2">
//                       👤 Secondary Person
//                     </h3>
//                     <DateTimeBlock prefix="s" />
//                   </div>
//                 </div>
//               )}

//               {currentFields.length === 0 && (
//                 <p className="text-[13px] text-[#94a3b8] italic">
//                   No parameters required.
//                 </p>
//               )}
//             </div>

//             <button
//               type="button"
//               onClick={handleTestApi}
//               disabled={loading}
//               className="mt-6 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-[14px] font-bold px-6 py-[10px] rounded-[8px] transition-colors shadow-sm disabled:opacity-60"
//             >
//               {loading ? "Loading..." : "Test API"}
//             </button>
//           </div>

//           {/* ── RIGHT: API Call ── */}
//           <div className="bg-white border border-[#e2e8f0] rounded-[16px] shadow-sm p-6 flex flex-col">
//             <h2 className="text-[18px] font-bold text-[#1e293b] mb-5">
//               API Call
//             </h2>

//             <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px] p-4 mb-4">
//               <span
//                 className={`text-[12px] font-bold px-2 py-0.5 rounded mr-2 ${httpMethod === "GET" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}
//               >
//                 {httpMethod}
//               </span>
//               <span className="text-[13px] font-medium text-[#6366f1] break-all">
//                 {displayUrl}
//               </span>
//             </div>

//             <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px] p-4 mb-5">
//               <div className="text-[13px] font-bold text-[#1e293b] mb-1">
//                 {httpMethod === "GET" ? "query params:" : "body:"}
//               </div>
//               <pre className="text-[13px] font-medium text-[#6366f1] font-mono whitespace-pre-wrap break-all">
//                 {JSON.stringify(params, null, 2)}
//               </pre>
//             </div>

//             <button
//               type="button"
//               onClick={handleTestApi}
//               disabled={loading}
//               className="self-start bg-[#3b82f6] hover:bg-[#2563eb] text-white text-[14px] font-bold px-6 py-[10px] rounded-[8px] transition-colors shadow-sm mb-5 disabled:opacity-60"
//             >
//               {loading ? "Loading..." : "Test API"}
//             </button>

//             <div>
//               <h3 className="text-[16px] font-bold text-[#1e293b] mb-3">
//                 Response
//               </h3>
//               <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px] p-4 min-h-[200px] max-h-[500px] overflow-auto">
//                 <pre className="text-[13px] font-mono text-[#334155] whitespace-pre-wrap break-all">
//                   {JSON.stringify(response, null, 2)}
//                 </pre>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
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

  const displayUrl = `http://localhost:3000/api/${buildSlug}`;

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
            className="w-full h-10 px-4 pr-10 text-sm border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
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
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-xl max-h-[200px] overflow-auto">
            {results.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onMouseDown={() => handleSelect(item)}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-b-0 flex items-start gap-2"
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
              className="w-full h-10 px-3 text-sm border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
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
              className="w-full h-10 px-3 text-sm border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
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
              className="w-full h-10 px-3 text-sm border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
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
              className="w-full h-10 px-3 text-sm border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
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
              className="w-full h-10 px-3 text-sm border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
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
          className="w-full h-10 px-3 pr-10 text-sm border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all appearance-none cursor-pointer"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-violet-100/40 to-purple-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-100/30 to-blue-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
      </div>

      <div className="relative z-10 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-3xl p-6 md:p-8 shadow-2xl shadow-purple-500/20">
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
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Iconify
                  icon="lucide:terminal"
                  className="text-white text-2xl"
                />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                  API Testing Console
                </h1>
                <p className="text-purple-100/80 text-sm">
                  Test and explore all available API endpoints
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
                <span className="text-xs text-purple-200">API Key:</span>
                <code className="text-white text-xs ml-2 font-mono">
                  {apiKey.slice(0, 8)}...{apiKey.slice(-4)}
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* LEFT: Parameters Panel */}
          <div className="space-y-6">
            {/* Category Selection Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Iconify
                      icon="lucide:layers"
                      className="text-white text-lg"
                    />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-800">
                      Select API Endpoint
                    </h2>
                    <p className="text-xs text-gray-500">
                      Choose category and endpoint to test
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* Category Selection */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-2 block">
                    Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {Object.keys(apiCategories).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setValue("category", cat)}
                        className={`p-3 rounded-xl border-2 transition-all duration-300 text-left ${
                          category === cat
                            ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/10"
                            : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <Iconify
                          icon={categoryIcons[cat] || "lucide:folder"}
                          className={`text-xl mb-1.5 ${category === cat ? "text-blue-500" : "text-gray-400"}`}
                        />
                        <p
                          className={`text-xs font-semibold truncate ${category === cat ? "text-blue-600" : "text-gray-600"}`}
                        >
                          {cat}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sub Category Selection */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-2 block">
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
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Method Badge */}
                <div className="flex items-center gap-3 pt-2">
                  <span
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                      httpMethod === "GET"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {httpMethod}
                  </span>
                  <code className="text-xs text-gray-500 font-mono">
                    /{buildSlug}
                  </code>
                </div>
              </div>
            </div>

            {/* Parameters Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-slate-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                      <Iconify
                        icon="lucide:sliders"
                        className="text-white text-lg"
                      />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-gray-800">
                        Parameters
                      </h2>
                      <p className="text-xs text-gray-500">
                        Configure request parameters
                      </p>
                    </div>
                  </div>
                  {currentFields.length > 0 && (
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-lg">
                      {currentFields.length} fields required
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5 space-y-5">
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
                      className="w-full h-10 px-3 text-sm border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
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
                      className="w-full h-10 px-3 text-sm border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
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
                      className="w-full h-10 px-3 text-sm border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
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
                      className="w-full h-10 px-3 text-sm border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
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
                        className="w-full h-10 px-3 text-sm border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
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
                        className="w-full h-10 px-3 text-sm border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
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

          {/* RIGHT: Request & Response Panel */}
          <div className="space-y-6">
            {/* Request Preview Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <Iconify
                      icon="lucide:send"
                      className="text-white text-lg"
                    />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-800">
                      Request Preview
                    </h2>
                    <p className="text-xs text-gray-500">
                      Review your API request before sending
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* URL Preview */}
                <div className="p-4 bg-gray-900 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        httpMethod === "GET"
                          ? "bg-emerald-500 text-white"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      {httpMethod}
                    </span>
                    <span className="text-xs text-gray-400">Request URL</span>
                  </div>
                  <code className="text-sm text-emerald-400 font-mono break-all">
                    {displayUrl}
                  </code>
                </div>

                {/* Request Body */}
                <div className="p-4 bg-gray-900 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400">
                      {httpMethod === "GET"
                        ? "Query Parameters"
                        : "Request Body"}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm text-blue-400 font-mono whitespace-pre-wrap break-all max-h-[200px] overflow-auto">
                    {JSON.stringify(params, null, 2)}
                  </pre>
                </div>
              </div>
            </div>

            {/* Response Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-slate-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
                        requestStatus === "success"
                          ? "bg-gradient-to-br from-emerald-500 to-green-500 shadow-emerald-500/30"
                          : requestStatus === "error"
                            ? "bg-gradient-to-br from-red-500 to-rose-500 shadow-red-500/30"
                            : "bg-gradient-to-br from-gray-400 to-gray-500 shadow-gray-500/30"
                      }`}
                    >
                      <Iconify
                        icon={
                          requestStatus === "success"
                            ? "lucide:check"
                            : requestStatus === "error"
                              ? "lucide:x"
                              : "lucide:code"
                        }
                        className="text-white text-lg"
                      />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-gray-800">
                        Response
                      </h2>
                      <div className="flex items-center gap-2">
                        {requestStatus !== "idle" && (
                          <>
                            <span
                              className={`text-xs font-semibold ${
                                requestStatus === "success"
                                  ? "text-emerald-600"
                                  : "text-red-600"
                              }`}
                            >
                              {requestStatus === "success"
                                ? "Success"
                                : "Error"}
                            </span>
                            {responseTime && (
                              <span className="text-xs text-gray-400">
                                • {responseTime}ms
                              </span>
                            )}
                          </>
                        )}
                        {requestStatus === "idle" && (
                          <span className="text-xs text-gray-500">
                            Waiting for request...
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleCopyResponse}
                    disabled={requestStatus === "idle"}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      copied
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    } disabled:opacity-50`}
                  >
                    <Iconify icon={copied ? "lucide:check" : "lucide:copy"} />
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              <div className="p-5">
                <div className="bg-gray-900 rounded-xl p-4 min-h-[300px] max-h-[500px] overflow-auto">
                  {requestStatus === "idle" ? (
                    <div className="flex flex-col items-center justify-center h-[250px] text-gray-500">
                      <Iconify
                        icon="lucide:terminal"
                        className="text-4xl mb-3 text-gray-600"
                      />
                      <p className="text-sm">
                        Click &quot;Test API&quot; to see response
                      </p>
                    </div>
                  ) : loading ? (
                    <div className="flex flex-col items-center justify-center h-[250px]">
                      <div className="relative w-16 h-16">
                        <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full" />
                        <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin" />
                      </div>
                      <p className="text-sm text-gray-400 mt-4">
                        Processing request...
                      </p>
                    </div>
                  ) : (
                    <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap break-all">
                      <code>
                        {JSON.stringify(response, null, 2)
                          .replace(
                            /"([^"]+)":/g,
                            '<span class="text-purple-400">"$1"</span>:',
                          )
                          .replace(
                            /: "([^"]+)"/g,
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
                          )}
                      </code>
                    </pre>
                  )}
                </div>

                {/* Response Stats */}
                {requestStatus !== "idle" && !loading && (
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Iconify icon="lucide:clock" className="text-gray-400" />
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
                  <Iconify icon="lucide:lightbulb" className="text-amber-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-amber-800 mb-1">
                    Quick Tips
                  </h3>
                  <ul className="text-xs text-amber-700 space-y-1">
                    <li>
                      • Search for location to auto-fill lat, lon, and timezone
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
  );
}
