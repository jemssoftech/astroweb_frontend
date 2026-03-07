"use client";

import { useState } from "react";
import PersonSelector from "@/src/components/PersonSelector";
import Iconify from "@/src/components/Iconify";
import { Person } from "@/src/lib/models";
import Swal from "sweetalert2";
import api from "@/src/lib/api";
import { motion, AnimatePresence } from "framer-motion";

// ============ Types ============
interface ApiMeta {
  api_author: string;
  api_credit: string;
  api_version: string;
}

interface ChartHouse {
  sign: number;
  sign_name: string;
  planet: string[];
  planet_small: string[];
  planet_degree: string[];
}

interface YearChart {
  year_lord: string;
  varshaphal_date: string;
  chart: ChartHouse[];
}

interface MonthChart {
  month_id: number;
  chart: ChartHouse[];
}

interface Panchadhikari {
  muntha_lord: string;
  muntha_lord_id: number;
  birth_ascendant_lord: string;
  birth_ascendant_lord_id: number;
  year_ascendant_lord: string;
  year_ascendant_lord_id: number;
  dinratri_lord: string;
  trirashi_lord: string;
}

interface VarshaphalDetails {
  varshaphala_year: number;
  age_of_native: number;
  ayanamsha_name: string;
  ayanamsha_degree: number;
  varshaphala_timestamp: number;
  native_birth_date: string;
  varshaphala_date: string;
  panchadhikari: Panchadhikari;
  varshaphala_year_lord: string;
  varshaphala_muntha: {
    muntha_sign: string;
    muntha_sign_lord: string;
  };
}

interface PlanetPosition {
  id: number;
  name: string;
  fullDegree: number;
  normDegree: number;
  speed: number;
  isRetro: string | boolean;
  sign: string;
  signLord: string;
  nakshatra: string;
  nakshatraLord: string;
  nakshatra_pad: number;
  house: number;
  is_planet_set: boolean;
  planet_awastha: string;
}

interface MuddaDasha {
  planet: string;
  duration: number;
  dasha_start: string;
  dasha_end: string;
}

interface PanchavargeyaBala {
  kshetra_bala: number[];
  uccha_bala: number[];
  hadda_bala: number[];
  drekkana_bala: number[];
  navmansha_bala: number[];
  total_bala: number[];
  final_bala: number[];
}

interface HarshaBala {
  sthana_bala: number[];
  ucchaswachetri_bala: number[];
  gender_bala: number[];
  dinratri_bala: number[];
  total_bala: number[];
}

interface Yoga {
  yog_name: string;
  yog_description: string;
  is_yog_happening: boolean;
  powerfullness_percentage: string;
  yog_prediction: string;
  planets?: (string | null)[][];
  planets_id?: number[][];
  yog_type?: unknown[];
}

interface SahamPoint {
  saham_id: number;
  saham_name: string;
  saham_degree: number;
}

interface VarshaphalData {
  success: boolean;
  varshaphal_year_chart: YearChart;
  varshaphal_month_chart: MonthChart[];
  varshaphal_details: VarshaphalDetails;
  varshaphal_planets: PlanetPosition[];
  varshaphal_muntha: string;
  varshaphal_mudda_dasha: MuddaDasha[];
  varshaphal_panchavargeeya_bala: PanchavargeyaBala;
  varshaphal_harsha_bala: HarshaBala;
  varshaphal_yoga: Yoga[];
  varshaphal_saham_points: SahamPoint[];
}

interface VarshaphalAPIResponse {
  data: VarshaphalData;

  error?: string;
  message?: string;
  meta?: ApiMeta;
}

type TabKey =
  | "overview"
  | "chart"
  | "monthly"
  | "planets"
  | "dasha"
  | "strength"
  | "yogas"
  | "saham";

// ============ Constants ============
const PLANET_CONFIG: Record<
  string,
  {
    name: string;
    icon: string;
    color: string;
    bgLinearToRing: string;
    bgColor: string;
    short: string;
  }
> = {
  Sun: {
    name: "Sun",
    icon: "solar:sun-bold-duotone",
    color: "#F59E0B",
    bgLinearToRing: "from-amber-400 to-orange-500",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    short: "Su",
  },
  Moon: {
    name: "Moon",
    icon: "solar:moon-bold-duotone",
    color: "#3B82F6",
    bgLinearToRing: "from-blue-400 to-indigo-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    short: "Mo",
  },
  Mars: {
    name: "Mars",
    icon: "solar:flame-bold-duotone",
    color: "#EF4444",
    bgLinearToRing: "from-red-400 to-rose-500",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    short: "Ma",
  },
  Mercury: {
    name: "Mercury",
    icon: "solar:wind-bold-duotone",
    color: "#22C55E",
    bgLinearToRing: "from-green-400 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    short: "Me",
  },
  Jupiter: {
    name: "Jupiter",
    icon: "solar:crown-bold-duotone",
    color: "#F97316",
    bgLinearToRing: "from-orange-400 to-amber-500",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    short: "Ju",
  },
  Venus: {
    name: "Venus",
    icon: "solar:heart-bold-duotone",
    color: "#EC4899",
    bgLinearToRing: "from-pink-400 to-rose-500",
    bgColor: "bg-pink-50 dark:bg-pink-900/20",
    short: "Ve",
  },
  Saturn: {
    name: "Saturn",
    icon: "solar:clock-circle-bold-duotone",
    color: "#6366F1",
    bgLinearToRing: "from-indigo-400 to-violet-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    short: "Sa",
  },
  Rahu: {
    name: "Rahu",
    icon: "solar:black-hole-bold-duotone",
    color: "#8B5CF6",
    bgLinearToRing: "from-violet-400 to-purple-500",
    bgColor: "bg-violet-50 dark:bg-violet-900/20",
    short: "Ra",
  },
  Ketu: {
    name: "Ketu",
    icon: "solar:star-bold-duotone",
    color: "#D97706",
    bgLinearToRing: "from-amber-400 to-yellow-500",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    short: "Ke",
  },
  Ascendant: {
    name: "Ascendant",
    icon: "solar:arrow-up-bold-duotone",
    color: "#6366F1",
    bgLinearToRing: "from-indigo-400 to-purple-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    short: "As",
  },
};

const SIGN_CONFIG: Record<string, { symbol: string; element: string }> = {
  Aries: { symbol: "♈", element: "Fire" },
  Taurus: { symbol: "♉", element: "Earth" },
  Gemini: { symbol: "♊", element: "Air" },
  Cancer: { symbol: "♋", element: "Water" },
  Leo: { symbol: "♌", element: "Fire" },
  Virgo: { symbol: "♍", element: "Earth" },
  Libra: { symbol: "♎", element: "Air" },
  Scorpio: { symbol: "♏", element: "Water" },
  Sagittarius: { symbol: "♐", element: "Fire" },
  Capricorn: { symbol: "♑", element: "Earth" },
  Aquarius: { symbol: "♒", element: "Air" },
  Pisces: { symbol: "♓", element: "Water" },
};

const MONTHS = [
  "Month 1",
  "Month 2",
  "Month 3",
  "Month 4",
  "Month 5",
  "Month 6",
  "Month 7",
  "Month 8",
  "Month 9",
  "Month 10",
  "Month 11",
  "Month 12",
];

const PLANET_ORDER = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
];

const TABS: {
  key: TabKey;
  label: string;
  icon: string;
  color: string;
}[] = [
  {
    key: "overview",
    label: "Overview",
    icon: "solar:widget-5-bold-duotone",
    color: "from-purple-500 to-violet-500",
  },
  {
    key: "chart",
    label: "Year Chart",
    icon: "solar:chart-square-bold-duotone",
    color: "from-amber-500 to-orange-500",
  },
  {
    key: "monthly",
    label: "Monthly",
    icon: "solar:calendar-bold-duotone",
    color: "from-blue-500 to-cyan-500",
  },
  {
    key: "planets",
    label: "Planets",
    icon: "solar:planet-bold-duotone",
    color: "from-emerald-500 to-teal-500",
  },
  {
    key: "dasha",
    label: "Mudda Dasha",
    icon: "solar:clock-circle-bold-duotone",
    color: "from-pink-500 to-rose-500",
  },
  {
    key: "strength",
    label: "Strength",
    icon: "solar:graph-up-bold-duotone",
    color: "from-indigo-500 to-violet-500",
  },
  {
    key: "yogas",
    label: "Yogas",
    icon: "solar:star-rings-bold-duotone",
    color: "from-yellow-500 to-amber-500",
  },
  {
    key: "saham",
    label: "Saham",
    icon: "solar:map-point-bold-duotone",
    color: "from-red-500 to-rose-500",
  },
];

// ============ Animations ============
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// ============ Helpers ============
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return String((error as { message: unknown }).message);
};

const showErrorAlert = (title: string, text: string) => {
  Swal.fire({
    icon: "error",
    title,
    text,
    background: "#1f2937",
    color: "#f3f4f6",
    confirmButtonColor: "#8b5cf6",
    customClass: {
      popup: "rounded-3xl border border-gray-700 shadow-2xl",
    },
  });
};

const showWarningAlert = (title: string, text: string) => {
  Swal.fire({
    icon: "warning",
    title,
    text,
    background: "#1f2937",
    color: "#f3f4f6",
    confirmButtonColor: "#8b5cf6",
    customClass: {
      popup: "rounded-3xl border border-gray-700 shadow-2xl",
    },
  });
};

const getConfig = (planet: string) =>
  PLANET_CONFIG[planet] || {
    name: planet,
    icon: "solar:planet-bold-duotone",
    color: "#6B7280",
    bgLinearToRing: "from-gray-400 to-gray-500",
    bgColor: "bg-gray-50 dark:bg-gray-800",
    short: planet.substring(0, 2),
  };

const formatDate = (dateStr: string): string => {
  if (!dateStr) return "-";
  const parts = dateStr.split(" ")[0].split("-");
  if (parts.length === 3) {
    const [day, month, year] = parts;
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${day} ${months[parseInt(month) - 1]} ${year}`;
  }
  return dateStr;
};

const formatDegree = (degree: number): string => {
  const deg = Math.floor(degree);
  const minFloat = (degree - deg) * 60;
  const min = Math.floor(minFloat);
  const sec = Math.floor((minFloat - min) * 60);
  return `${deg}°${min}'${sec}"`;
};

// ============ Main Component ============
export default function VarshaphalPage() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [varshaphalData, setVarshaphalData] = useState<VarshaphalData | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(1);

  const handlePersonSelected = (person: Person) => {
    setSelectedPerson(person);
    setVarshaphalData(null);
  };

  const getBirthDataPayload = (person: Person) => {
    const birthDate = new Date(person.BirthTime);
    let tzone = 0;
    if (person.TimezoneOffset) {
      const [h, m] = person.TimezoneOffset.replace("+", "").split(":");
      const sign = person.TimezoneOffset.startsWith("-") ? -1 : 1;
      tzone = sign * (parseInt(h) + parseInt(m) / 60);
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
      varshaphal_year: selectedYear,
    };
  };

  const fetchVarshaphal = async () => {
    if (!selectedPerson) {
      showWarningAlert("Select Person", "Please select a person first");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await api.post(
        "/api/mainapi/varshaphal",
        getBirthDataPayload(selectedPerson),
      );

      const resData = response as unknown as VarshaphalAPIResponse;
      console.log(resData);
      if (resData?.data && resData?.data?.success) {
        setVarshaphalData(resData?.data);
      } else {
        const errorMsg =
          resData?.error ||
          resData?.message ||
          "Failed to fetch Varshaphal data";
        setError(errorMsg);
        showErrorAlert("Error", errorMsg);
      }
    } catch (err: unknown) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      showErrorAlert("Error", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const birthYear = selectedPerson
      ? new Date(selectedPerson.BirthTime).getFullYear()
      : currentYear - 50;
    const years = [];
    for (let y = birthYear; y <= currentYear + 10; y++) {
      years.push(y);
    }
    return years;
  };

  // ============ Components ============

  // ============ Reusable Components ============
  const PlanetBadge = ({
    planet,
    size = "md",
  }: {
    planet: string;
    size?: "sm" | "md";
  }) => {
    const config = getConfig(planet);
    const sizeClass =
      size === "sm"
        ? "px-2 py-0.5 text-xs gap-1"
        : "px-2.5 py-1 text-sm gap-1.5";
    return (
      <span
        className={`inline-flex items-center rounded-lg font-medium ${config.bgColor} ${sizeClass}`}
        style={{ color: config.color }}
      >
        <Iconify icon={config.icon} width={size === "sm" ? 12 : 16} />
        {planet}
      </span>
    );
  };

  const StatsCard = ({
    icon,
    label,
    value,
    subValue,
    color,
  }: {
    icon: string;
    label: string;
    value: string | number;
    subValue?: string;
    color: string;
  }) => (
    <motion.div
      variants={itemVariants}
      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-lg"
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-12 h-12 rounded-xl bg-linear-to-br ${color} flex items-center justify-center text-white shadow-lg`}
        >
          <Iconify icon={icon} width={24} />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <div className="flex items-baseline gap-1">
            <p className="text-xl font-bold text-gray-900 dark:text-white truncate">
              {value}
            </p>
            {subValue && (
              <span className="text-sm text-gray-400">{subValue}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const NorthIndianChart = ({
    chartData,
    title,
  }: {
    chartData: ChartHouse[];
    title?: string;
  }) => {
    const getHouseByPosition = (position: number): ChartHouse | undefined => {
      const positionToIndex: Record<number, number> = {
        0: 11,
        1: 0,
        2: 1,
        3: 2,
        4: 3,
        5: 4,
        6: 5,
        7: 6,
        8: 7,
        9: 8,
        10: 9,
        11: 10,
      };
      return chartData[positionToIndex[position]];
    };

    const renderHouseContent = (position: number) => {
      const house = getHouseByPosition(position);
      if (!house) return null;
      return (
        <div className="flex flex-col items-center justify-center h-full p-1">
          <span className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">
            {house.sign_name}
          </span>
          <div className="flex flex-wrap justify-center gap-0.5">
            {house.planet.map((p, i) => {
              const planetName = p.charAt(0) + p.slice(1).toLowerCase();
              const config = getConfig(planetName);
              return (
                <span
                  key={i}
                  className="text-xs font-medium"
                  style={{ color: config.color }}
                >
                  {house.planet_small[i]?.trim()}
                </span>
              );
            })}
          </div>
        </div>
      );
    };

    return (
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-lg"
      >
        {title && (
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-500 to-violet-500 flex items-center justify-center text-white">
              <Iconify icon="solar:chart-square-bold" width={20} />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {title}
            </h4>
          </div>
        )}
        <div className="aspect-square max-w-xs mx-auto">
          <div className="grid grid-cols-4 grid-rows-4 gap-px bg-gray-200 dark:bg-gray-700 h-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            {/* Row 1 */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700">
              {renderHouseContent(0)}
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              {renderHouseContent(1)}
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              {renderHouseContent(2)}
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700">
              {renderHouseContent(3)}
            </div>
            {/* Row 2 */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              {renderHouseContent(11)}
            </div>
            <div className="col-span-2 row-span-2 bg-linear-to-br from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 border border-purple-200 dark:border-purple-700 flex items-center justify-center">
              <span className="text-sm text-purple-600 dark:text-purple-400 font-semibold">
                Varshaphal
              </span>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              {renderHouseContent(4)}
            </div>
            {/* Row 3 */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              {renderHouseContent(10)}
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              {renderHouseContent(5)}
            </div>
            {/* Row 4 */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700">
              {renderHouseContent(9)}
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              {renderHouseContent(8)}
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              {renderHouseContent(7)}
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700">
              {renderHouseContent(6)}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // ============ Tab Content ============

  // ============ Content Components ============
  interface ContentProps {
    data: VarshaphalData;
  }

  const OverviewContent = ({ data }: ContentProps) => {
    const details = data.varshaphal_details;
    const yearChart = data.varshaphal_year_chart;
    const yearLordConfig = getConfig(details.varshaphala_year_lord);

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard
            icon="solar:calendar-bold-duotone"
            label="Year"
            value={details.varshaphala_year}
            color="from-purple-500 to-violet-500"
          />
          <StatsCard
            icon="solar:user-bold-duotone"
            label="Age"
            value={details.age_of_native}
            subValue="years"
            color="from-blue-500 to-cyan-500"
          />
          <StatsCard
            icon={yearLordConfig.icon}
            label="Year Lord"
            value={details.varshaphala_year_lord}
            color={yearLordConfig.bgLinearToRing}
          />
          <StatsCard
            icon="solar:star-bold-duotone"
            label="Muntha"
            value={data.varshaphal_muntha}
            color="from-amber-500 to-orange-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <NorthIndianChart
            chartData={yearChart.chart}
            title="Varshaphal Year Chart"
          />

          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-lg"
          >
            <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white">
                  <Iconify icon="solar:info-circle-bold" width={20} />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Varshaphal Details
                </h3>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    label: "Birth Date",
                    value: formatDate(details.native_birth_date),
                  },
                  {
                    label: "Varshaphal Date",
                    value: formatDate(details.varshaphala_date),
                  },
                  { label: "Ayanamsha", value: `${details.ayanamsha_name}` },
                  {
                    label: "Muntha Lord",
                    value: details.varshaphala_muntha.muntha_sign_lord,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl"
                  >
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.label}
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-lg"
        >
          <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-linear-to-r from-purple-500/10 to-violet-500/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-500 to-violet-500 flex items-center justify-center text-white">
                <Iconify icon="solar:crown-bold" width={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Panchadhikari
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  The five significant lords
                </p>
              </div>
            </div>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                {
                  label: "Muntha Lord",
                  value: details.panchadhikari.muntha_lord,
                },
                {
                  label: "Birth Asc Lord",
                  value: details.panchadhikari.birth_ascendant_lord,
                },
                {
                  label: "Year Asc Lord",
                  value: details.panchadhikari.year_ascendant_lord,
                },
                {
                  label: "Dinratri Lord",
                  value: details.panchadhikari.dinratri_lord,
                },
                {
                  label: "Trirashi Lord",
                  value: details.panchadhikari.trirashi_lord,
                },
              ].map((item) => {
                const config = getConfig(item.value);
                return (
                  <div
                    key={item.label}
                    className={`text-center p-4 rounded-xl ${config.bgColor} border border-gray-200 dark:border-gray-700`}
                  >
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      {item.label}
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <Iconify
                        icon={config.icon}
                        width={20}
                        style={{ color: config.color }}
                      />
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {item.value}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-lg"
        >
          <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white">
                <Iconify icon="solar:clock-circle-bold" width={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Mudda Dasha Timeline
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Annual planetary periods
                </p>
              </div>
            </div>
          </div>
          <div className="p-5">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {data.varshaphal_mudda_dasha.slice(0, 8).map((dasha, idx) => {
                const config = getConfig(dasha.planet);
                const isCurrent = idx === 0;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`shrink-0 w-32 p-4 rounded-xl border-2 transition-all ${
                      isCurrent
                        ? `border-purple-500 bg-linear-to-br ${config.bgLinearToRing} text-white shadow-lg shadow-purple-500/30`
                        : `border-gray-200 dark:border-gray-700 ${config.bgColor}`
                    }`}
                  >
                    {isCurrent && (
                      <span className="text-[10px] font-bold uppercase tracking-wide mb-1 block opacity-80">
                        Current
                      </span>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <Iconify
                        icon={config.icon}
                        width={20}
                        style={{ color: isCurrent ? "white" : config.color }}
                      />
                      <span
                        className={`font-bold ${isCurrent ? "text-white" : "text-gray-900 dark:text-white"}`}
                      >
                        {dasha.planet}
                      </span>
                    </div>
                    <p
                      className={`text-xs ${isCurrent ? "text-white/80" : "text-gray-500 dark:text-gray-400"}`}
                    >
                      {dasha.duration} days
                    </p>
                    <p
                      className={`text-[11px] mt-1 ${isCurrent ? "text-white/70" : "text-gray-400"}`}
                    >
                      {dasha.dasha_start.split(",")[0]}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const YearChartContent = ({ data }: ContentProps) => {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <NorthIndianChart
          chartData={data.varshaphal_year_chart.chart}
          title="Varshaphal Year Chart"
        />

        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-lg"
        >
          <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              House Details
            </h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800">
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                    House
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Sign
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Planets
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {data.varshaphal_year_chart.chart.map((house, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {SIGN_CONFIG[house.sign_name]?.symbol}
                        </span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {house.sign_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {house.planet.length > 0 ? (
                          house.planet.map((p, i) => {
                            const planetName =
                              p.charAt(0) + p.slice(1).toLowerCase();
                            return (
                              <PlanetBadge
                                key={i}
                                planet={planetName}
                                size="sm"
                              />
                            );
                          })
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const MonthlyContent = ({
    data,
    selectedMonth,
    setSelectedMonth,
  }: ContentProps & {
    selectedMonth: number;
    setSelectedMonth: (m: number) => void;
  }) => {
    const monthChart = data.varshaphal_month_chart.find(
      (m) => m.month_id === selectedMonth,
    );

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-lg"
        >
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 font-medium">
            Select Month
          </p>
          <div className="flex flex-wrap gap-2">
            {MONTHS.map((month, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedMonth(idx + 1)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedMonth === idx + 1
                    ? "bg-linear-to-r from-purple-500 to-violet-500 text-white shadow-lg"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {month}
              </button>
            ))}
          </div>
        </motion.div>

        {monthChart && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <NorthIndianChart
              chartData={monthChart.chart}
              title={`Month ${selectedMonth} Chart`}
            />

            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-lg"
            >
              <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Month {selectedMonth} Houses
                </h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full">
                  <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800">
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                        House
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                        Sign
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                        Planets
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {monthChart.chart.map((house, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                          {idx + 1}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                          {house.sign_name}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {house.planet.length > 0 ? (
                              house.planet.map((p, i) => {
                                const planetName =
                                  p.charAt(0) + p.slice(1).toLowerCase();
                                return (
                                  <PlanetBadge
                                    key={i}
                                    planet={planetName}
                                    size="sm"
                                  />
                                );
                              })
                            ) : (
                              <span className="text-xs text-gray-400">-</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    );
  };

  const PlanetsContent = ({ data }: ContentProps) => {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-lg"
        >
          <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-linear-to-r from-emerald-500/10 to-teal-500/10 text-gray-900 dark:text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white">
                <Iconify icon="solar:planet-bold" width={20} />
              </div>
              <div>
                <h3 className="font-semibold">Planet Positions</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Detailed planetary analysis
                </p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  {[
                    "Planet",
                    "Sign",
                    "Degree",
                    "Nakshatra",
                    "House",
                    "Status",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {data.varshaphal_planets.map((planet, idx) => (
                  <motion.tr
                    key={planet.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.03 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="px-4 py-3">
                      <PlanetBadge planet={planet.name} />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {SIGN_CONFIG[planet.sign]?.symbol}
                        </span>
                        {planet.sign}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-700 dark:text-gray-300">
                      {formatDegree(planet.normDegree)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {planet.nakshatra}
                      </p>
                      <p className="text-xs">Pad {planet.nakshatra_pad}</p>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md">
                        H{planet.house}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <div className="flex flex-wrap gap-1">
                        {planet.isRetro && (
                          <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full font-medium">
                            Retro
                          </span>
                        )}
                        {planet.is_planet_set && (
                          <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full font-medium">
                            Combust
                          </span>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const MuddaDashaContent = ({ data }: ContentProps) => {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-lg"
        >
          <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-linear-to-r from-pink-500/10 to-rose-500/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white">
                <Iconify icon="solar:clock-circle-bold" width={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Mudda Dasha
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Annual periods for {data.varshaphal_details.varshaphala_year}
                </p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  {["#", "Planet", "Duration", "Start Date", "End Date"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {data.varshaphal_mudda_dasha.map((dasha, idx) => {
                  const isCurrent = idx === 0;
                  return (
                    <motion.tr
                      key={idx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.03 }}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 ${isCurrent ? "bg-purple-50 dark:bg-purple-900/20" : ""}`}
                    >
                      <td className="px-5 py-3 text-sm text-gray-500">
                        {idx + 1}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <PlanetBadge planet={dasha.planet} />
                          {isCurrent && (
                            <span className="px-2 py-0.5 bg-linear-to-r from-purple-500 to-violet-500 text-white text-xs font-medium rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-sm font-semibold text-purple-600">
                        {dasha.duration} days
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-700 dark:text-gray-300">
                        {dasha.dasha_start.split(",")[0]}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-700 dark:text-gray-300">
                        {dasha.dasha_end.split(",")[0]}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const StrengthContent = ({ data }: ContentProps) => {
    const panchaBala = data.varshaphal_panchavargeeya_bala;
    const harshaBala = data.varshaphal_harsha_bala;

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-lg"
        >
          <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-linear-to-r from-indigo-500/10 to-violet-500/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white">
                <Iconify icon="solar:graph-up-bold" width={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Panchavargeeya Bala
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Five-fold strength analysis
                </p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Bala Type
                  </th>
                  {PLANET_ORDER.map((planet) => {
                    const config = getConfig(planet);
                    return (
                      <th key={planet} className="px-3 py-3 text-center">
                        <Iconify
                          icon={config.icon}
                          width={18}
                          style={{ color: config.color }}
                        />
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {[
                  { label: "Kshetra Bala", data: panchaBala.kshetra_bala },
                  { label: "Uccha Bala", data: panchaBala.uccha_bala },
                  { label: "Hadda Bala", data: panchaBala.hadda_bala },
                  { label: "Drekkana Bala", data: panchaBala.drekkana_bala },
                  { label: "Navmansha Bala", data: panchaBala.navmansha_bala },
                ].map((row) => (
                  <tr
                    key={row.label}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                      {row.label}
                    </td>
                    {row.data.map((val, i) => (
                      <td
                        key={i}
                        className="px-3 py-2 text-center text-sm text-gray-700 dark:text-gray-300"
                      >
                        {val.toFixed(2)}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td className="px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white">
                    Total Bala
                  </td>
                  {panchaBala.total_bala.map((val, i) => (
                    <td
                      key={i}
                      className="px-3 py-2 text-center text-sm font-semibold text-purple-600 dark:text-purple-400"
                    >
                      {val.toFixed(2)}
                    </td>
                  ))}
                </tr>
                <tr className="bg-purple-50 dark:bg-purple-900/20">
                  <td className="px-4 py-2 text-sm font-bold text-purple-900 dark:text-purple-300">
                    Final Bala
                  </td>
                  {panchaBala.final_bala.map((val, i) => (
                    <td
                      key={i}
                      className="px-3 py-2 text-center text-sm font-bold text-purple-700 dark:text-purple-400"
                    >
                      {val.toFixed(2)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-lg"
        >
          <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white">
                <Iconify icon="solar:heart-bold" width={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Harsha Bala
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Happiness strength analysis
                </p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Bala Type
                  </th>
                  {PLANET_ORDER.map((planet) => {
                    const config = getConfig(planet);
                    return (
                      <th key={planet} className="px-3 py-3 text-center">
                        <Iconify
                          icon={config.icon}
                          width={18}
                          style={{ color: config.color }}
                        />
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {[
                  { label: "Sthana Bala", data: harshaBala.sthana_bala },
                  {
                    label: "Ucchaswachetri Bala",
                    data: harshaBala.ucchaswachetri_bala,
                  },
                  { label: "Gender Bala", data: harshaBala.gender_bala },
                  { label: "Dinratri Bala", data: harshaBala.dinratri_bala },
                ].map((row) => (
                  <tr
                    key={row.label}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                      {row.label}
                    </td>
                    {row.data.map((val, i) => (
                      <td
                        key={i}
                        className="px-3 py-2 text-center text-sm text-gray-700 dark:text-gray-300"
                      >
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="bg-amber-50 dark:bg-amber-900/20">
                  <td className="px-4 py-2 text-sm font-bold text-amber-900 dark:text-amber-300">
                    Total Bala
                  </td>
                  {harshaBala.total_bala.map((val, i) => (
                    <td
                      key={i}
                      className="px-3 py-2 text-center text-sm font-bold text-amber-700 dark:text-amber-400"
                    >
                      {val}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const YogasContent = ({ data }: ContentProps) => {
    const yogas = data.varshaphal_yoga;
    const activeYogas = yogas.filter((y) => y.is_yog_happening);
    const inactiveYogas = yogas.filter((y) => !y.is_yog_happening);

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-green-200 dark:border-green-800/50 overflow-hidden shadow-lg"
        >
          <div className="px-5 py-4 border-b border-green-100 dark:border-green-800/50 bg-green-50 dark:bg-green-900/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white">
                <Iconify icon="solar:check-circle-bold" width={20} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Active Yogas ({activeYogas.length})
              </h3>
            </div>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {activeYogas.length > 0 ? (
              activeYogas.map((yoga, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                        {yoga.yog_name}
                      </h4>
                      {yoga.planets && yoga.planets.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {yoga.planets.map((planetPair, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-600 dark:text-gray-400"
                            >
                              {planetPair.filter(Boolean).join(" - ")}
                            </span>
                          ))}
                        </div>
                      )}
                      {yoga.yog_description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 leading-relaxed">
                          {yoga.yog_description}
                        </p>
                      )}
                    </div>
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full font-bold uppercase tracking-wider">
                      Happening
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="px-5 py-12 text-center text-gray-500 dark:text-gray-400">
                <Iconify
                  icon="solar:sleeping-bold-duotone"
                  width={48}
                  className="mx-auto mb-3 opacity-30"
                />
                <p>No active yogas found for this period</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-lg opacity-70"
        >
          <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-400 flex items-center justify-center text-white">
                <Iconify icon="solar:close-circle-bold" width={20} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Inactive Yogas ({inactiveYogas.length})
              </h3>
            </div>
          </div>
          <div className="p-5">
            <div className="flex flex-wrap gap-2">
              {inactiveYogas.map((yoga, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  {yoga.yog_name}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const SahamContent = ({ data }: ContentProps) => {
    const degreeToSign = (degree: number) => {
      const signs = Object.keys(SIGN_CONFIG);
      const signIndex = Math.floor(degree / 30);
      const signDegree = degree % 30;
      return { sign: signs[signIndex], degree: signDegree };
    };

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-lg"
        >
          <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-linear-to-r from-red-500/10 to-rose-500/10 text-gray-900 dark:text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-red-500 to-rose-500 flex items-center justify-center text-white">
                <Iconify icon="solar:map-point-bold" width={20} />
              </div>
              <div>
                <h3 className="font-semibold">Saham Points</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Sensitive points for the year
                </p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800 z-10">
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  {["#", "Saham Name", "Degree", "Sign Position"].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {data.varshaphal_saham_points.map((saham, idx) => {
                  const position = degreeToSign(saham.saham_degree);
                  return (
                    <motion.tr
                      key={saham.saham_id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.01 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <td className="px-5 py-2.5 text-sm text-gray-500">
                        {saham.saham_id}
                      </td>
                      <td className="px-5 py-2.5 text-sm font-semibold text-gray-900 dark:text-white">
                        {saham.saham_name}
                      </td>
                      <td className="px-5 py-2.5 text-sm font-mono text-indigo-600 dark:text-indigo-400">
                        {saham.saham_degree.toFixed(3)}°
                      </td>
                      <td className="px-5 py-2.5">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {SIGN_CONFIG[position.sign]?.symbol}
                          </span>
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {position.sign}
                          </span>
                          <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-md">
                            {position.degree.toFixed(2)}°
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // Render Tab Content
  const renderTabContent = () => {
    if (!varshaphalData) return null;
    switch (activeTab) {
      case "overview":
        return <OverviewContent data={varshaphalData} />;
      case "chart":
        return <YearChartContent data={varshaphalData} />;
      case "monthly":
        return (
          <MonthlyContent
            data={varshaphalData}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
          />
        );
      case "planets":
        return <PlanetsContent data={varshaphalData} />;
      case "dasha":
        return <MuddaDashaContent data={varshaphalData} />;
      case "strength":
        return <StrengthContent data={varshaphalData} />;
      case "yogas":
        return <YogasContent data={varshaphalData} />;
      case "saham":
        return <SahamContent data={varshaphalData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden bg-linear-to-r from-amber-600 via-orange-600 to-red-600 rounded-2xl p-6 md:p-8 text-white shadow-xl mb-8"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>

          <div className="absolute top-4 right-8 opacity-20">
            <Iconify icon="solar:sun-bold-duotone" width={110} height={110} />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Iconify icon="solar:sun-bold-duotone" width={40} height={40} />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium">
                    Varshaphal
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold">
                  Varshaphal System
                </h1>
                <p className="text-white/80 mt-1 max-w-xl">
                  Annual horoscope prediction based on solar return &mdash; your
                  personal yearly forecast
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/20">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Iconify icon="solar:calendar-bold" width={20} />
                </div>
                <div>
                  <p className="font-semibold">Solar Return</p>
                  <p className="text-sm text-white/70">Annual Chart</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/20">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Iconify icon="solar:calendar-minimalistic-bold" width={20} />
                </div>
                <div>
                  <p className="font-semibold">12</p>
                  <p className="text-sm text-white/70">Monthly Charts</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3 space-y-4"
          >
            {/* Person Selector */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white">
                  <Iconify icon="solar:user-rounded-bold" width={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Select Profile
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Choose a person
                  </p>
                </div>
              </div>

              <PersonSelector onPersonSelected={handlePersonSelected} />

              <AnimatePresence>
                {selectedPerson && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold">
                        {selectedPerson.Name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {selectedPerson.Name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(
                            selectedPerson.BirthTime,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Year Selector */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-orange-500 to-red-500 flex items-center justify-center text-white">
                  <Iconify icon="solar:calendar-bold" width={20} />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Varshaphal Year
                </h3>
              </div>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full px-4 py-3 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 dark:text-white"
              >
                {getYearOptions().map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <button
                onClick={fetchVarshaphal}
                disabled={loading || !selectedPerson}
                className={`mt-4 w-full h-12 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                  selectedPerson && !loading
                    ? "bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/30 hover:shadow-xl hover:-translate-y-0.5"
                    : "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Calculating...</span>
                  </>
                ) : (
                  <>
                    <Iconify icon="solar:sun-bold" width={20} />
                    <span>Calculate Varshaphal</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Info */}
            <AnimatePresence>
              {varshaphalData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-linear-to-br from-amber-500 via-orange-500 to-red-500 rounded-2xl p-5 text-white shadow-xl shadow-amber-500/20"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Iconify icon="solar:info-circle-bold" width={20} />
                    <h4 className="font-semibold">Quick Info</h4>
                  </div>
                  <div className="space-y-2">
                    {[
                      {
                        label: "Year",
                        value:
                          varshaphalData.varshaphal_details.varshaphala_year,
                      },
                      {
                        label: "Age",
                        value: varshaphalData.varshaphal_details.age_of_native,
                      },
                      {
                        label: "Year Lord",
                        value:
                          varshaphalData.varshaphal_details
                            .varshaphala_year_lord,
                      },
                      {
                        label: "Muntha",
                        value: varshaphalData.varshaphal_muntha,
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2"
                      >
                        <span className="text-sm text-white/70">
                          {item.label}
                        </span>
                        <span className="font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-9"
          >
            {/* Loading Overlay */}
            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                >
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.9 }}
                    className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-2xl max-w-sm w-full mx-4"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="relative mb-6">
                        <div className="w-24 h-24 rounded-full bg-linear-to-br from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 flex items-center justify-center">
                          <Iconify
                            icon="solar:sun-bold-duotone"
                            width={48}
                            className="text-amber-500 animate-pulse"
                          />
                        </div>
                        <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-transparent border-t-amber-500 border-r-orange-500 animate-spin" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Calculating Varshaphal
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Analyzing your annual horoscope...
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {varshaphalData ? (
              <div className="space-y-6">
                {/* Tabs */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
                  <div className="border-b border-gray-200 dark:border-gray-800">
                    <div className="flex overflow-x-auto scrollbar-hide">
                      {TABS.map((tab) => (
                        <button
                          key={tab.key}
                          onClick={() => setActiveTab(tab.key)}
                          className={`relative flex items-center gap-2 px-4 py-4 text-sm font-medium whitespace-nowrap transition-all ${
                            activeTab === tab.key
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                              activeTab === tab.key
                                ? `bg-linear-to-br ${tab.color} text-white shadow-lg`
                                : "bg-gray-100 dark:bg-gray-800"
                            }`}
                          >
                            <Iconify icon={tab.icon} width={18} />
                          </div>
                          <span className="hidden md:inline">{tab.label}</span>
                          {activeTab === tab.key && (
                            <motion.div
                              layoutId="activeTabVarsha"
                              className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-amber-500 to-orange-500"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-6">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        {renderTabContent()}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Info Footer */}
                <div className="bg-linear-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-5 border border-amber-200/50 dark:border-amber-800/50">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shrink-0">
                      <Iconify icon="solar:info-circle-bold" width={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        About Varshaphal
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Varshaphal (Annual Horoscope) is a solar return chart
                        cast for the exact moment when the Sun returns to its
                        natal position each year. It provides insights into the
                        themes and events likely to unfold during that
                        particular year of life.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <EmptyState />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Empty State Component
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-12"
    >
      <div className="flex flex-col items-center text-center max-w-lg mx-auto">
        <div className="w-28 h-28 rounded-3xl bg-linear-to-br from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 flex items-center justify-center mb-6 shadow-xl">
          <Iconify
            icon="solar:sun-bold-duotone"
            width={56}
            className="text-amber-500"
          />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Varshaphal Analysis
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Select a person, choose a year, and click &quot;Calculate
          Varshaphal&quot; to view your annual horoscope prediction.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            "Year Chart",
            "Monthly Charts",
            "Mudda Dasha",
            "Yogas",
            "Saham Points",
          ].map((item) => (
            <span
              key={item}
              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
