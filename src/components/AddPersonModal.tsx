"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { addPerson } from "@/src/lib/astroweb";
import Iconify from "./Iconify";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface LocationSuggestion {
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
}

type FormData = {
  personName: string;
  gender: "Male" | "Female" | "Other";
  birthDate: string;
  birthTime: string;
  locationSearch: string;
  notes: string;
};

const GENDER_CONFIG = {
  Male: {
    icon: "solar:men-bold-duotone",
    color: "#3B82F6",
    gradient: "from-blue-400 to-indigo-500",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-300 dark:border-blue-700",
    ring: "ring-blue-500/20",
  },
  Female: {
    icon: "solar:women-bold-duotone",
    color: "#EC4899",
    gradient: "from-pink-400 to-rose-500",
    bg: "bg-pink-50 dark:bg-pink-900/20",
    border: "border-pink-300 dark:border-pink-700",
    ring: "ring-pink-500/20",
  },
  Other: {
    icon: "solar:user-bold-duotone",
    color: "#8B5CF6",
    gradient: "from-violet-400 to-purple-500",
    bg: "bg-violet-50 dark:bg-violet-900/20",
    border: "border-violet-300 dark:border-violet-700",
    ring: "ring-violet-500/20",
  },
};

export default function AddPersonModal({ show, onClose, onSuccess }: Props) {
  const [selectedLocation, setSelectedLocation] =
    useState<LocationSuggestion | null>(null);
  const [locationSuggestions, setLocationSuggestions] = useState<
    LocationSuggestion[]
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchingLocation, setSearchingLocation] = useState(false);
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
    trigger,
  } = useForm<FormData>({
    defaultValues: {
      personName: "",
      gender: "Male",
      birthDate: "",
      birthTime: "",
      locationSearch: "",
      notes: "",
    },
  });

  const locationSearchValue = watch("locationSearch");
  const genderValue = watch("gender");
  const personName = watch("personName");

  // Location search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (locationSearchValue.length >= 3) {
        searchLocation(locationSearchValue);
      } else {
        setLocationSuggestions([]);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [locationSearchValue]);

  const searchLocation = async (query: string) => {
    setSearchingLocation(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
      );
      const data = await response.json();
      const suggestions: LocationSuggestion[] = data.map(
        (item: NominatimResult) => ({
          name: item.display_name,
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon),
          timezone: "Asia/Kolkata",
        }),
      );
      setLocationSuggestions(suggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Location search error:", error);
    } finally {
      setSearchingLocation(false);
    }
  };

  const selectLocation = (location: LocationSuggestion) => {
    setSelectedLocation(location);
    setValue("locationSearch", location.name.split(",")[0]);
    setShowSuggestions(false);
  };

  const resetForm = () => {
    reset();
    setSelectedLocation(null);
    setLocationSuggestions([]);
    setShowSuggestions(false);
    setStep(1);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const goToNextStep = async () => {
    if (step === 1) {
      const valid = await trigger(["personName", "gender"]);
      if (valid) setStep(2);
    } else if (step === 2) {
      const valid = await trigger(["birthDate", "birthTime"]);
      if (valid) setStep(3);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!selectedLocation) {
      Swal.fire({
        icon: "error",
        title: "Location Required",
        text: "Please select birth location from suggestions",
        background: "#1f2937",
        color: "#f3f4f6",
        confirmButtonColor: "#8b5cf6",
      });
      return;
    }

    setLoading(true);
    try {
      const birthTimeSQL = `${data.birthDate} ${data.birthTime}:00`;
      let offset = "+00:00";
      if (selectedLocation.timezone === "Asia/Kolkata") offset = "+05:30";

      const result = await addPerson({
        personName: data.personName.trim(),
        gender: data.gender,
        birthTime: birthTimeSQL,
        notes: data.notes,
        birthLocation: selectedLocation.name,
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        timezoneOffset: offset,
      });

      if (result.success) {
        await Swal.fire({
          icon: "success",
          title: "Person Added!",
          text: `${data.personName} has been added successfully.`,
          timer: 2000,
          showConfirmButton: false,
          background: "#1f2937",
          color: "#f3f4f6",
        });
        resetForm();
        onSuccess();
        onClose();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: result.error || "Failed to add person",
          background: "#1f2937",
          color: "#f3f4f6",
          confirmButtonColor: "#8b5cf6",
        });
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        background: "#1f2937",
        color: "#f3f4f6",
        confirmButtonColor: "#8b5cf6",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  const genderConfig = GENDER_CONFIG[genderValue];

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="relative px-6 pt-6 pb-4">
              {/* Close Button */}
              <button
                onClick={handleClose}
                disabled={loading}
                className="absolute top-4 right-4 p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <Iconify
                  icon="solar:close-circle-bold"
                  width={20}
                  className="text-gray-500"
                />
              </button>

              {/* Avatar & Title */}
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${genderConfig.gradient} flex items-center justify-center text-white shadow-lg`}
                >
                  {personName ? (
                    <span className="text-2xl font-bold">
                      {personName.charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <Iconify icon="solar:user-plus-bold-duotone" width={28} />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Add New Person
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {personName
                      ? `Adding ${personName}`
                      : "Fill in the details below"}
                  </p>
                </div>
              </div>

              {/* Step Indicator */}
              <div className="flex items-center gap-2 mt-5">
                {[
                  { num: 1, label: "Profile" },
                  { num: 2, label: "Birth" },
                  { num: 3, label: "Location" },
                ].map((s, idx) => (
                  <div key={s.num} className="flex items-center flex-1">
                    <button
                      onClick={() => s.num < step && setStep(s.num)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all w-full ${
                        step === s.num
                          ? `bg-gradient-to-r ${genderConfig.gradient} text-white shadow-lg`
                          : step > s.num
                            ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          step === s.num
                            ? "bg-white/20"
                            : step > s.num
                              ? "bg-green-500 text-white"
                              : "bg-gray-300 dark:bg-gray-600 text-white"
                        }`}
                      >
                        {step > s.num ? (
                          <Iconify icon="solar:check-read-bold" width={12} />
                        ) : (
                          s.num
                        )}
                      </span>
                      <span className="hidden sm:inline">{s.label}</span>
                    </button>
                    {idx < 2 && (
                      <div
                        className={`w-4 h-0.5 mx-1 rounded ${step > s.num ? "bg-green-400" : "bg-gray-200 dark:bg-gray-700"}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="px-6 pb-4 overflow-y-auto max-h-[50vh]">
                <AnimatePresence mode="wait">
                  {/* Step 1: Profile */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-5"
                    >
                      {/* Person Name */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          <Iconify
                            icon="solar:user-rounded-bold-duotone"
                            width={18}
                            style={{ color: genderConfig.color }}
                          />
                          Full Name
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 outline-none transition-all ${
                            errors.personName
                              ? "border-red-400 focus:ring-4 ring-red-500/20"
                              : "border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-4 ring-purple-500/10"
                          }`}
                          placeholder="Enter full name..."
                          {...register("personName", {
                            required: "Name is required",
                            minLength: {
                              value: 2,
                              message: "Name must be at least 2 characters",
                            },
                          })}
                          disabled={loading}
                          autoFocus
                        />
                        {errors.personName && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-1 text-red-500 text-xs mt-1.5"
                          >
                            <Iconify
                              icon="solar:danger-triangle-bold"
                              width={14}
                            />
                            {errors.personName.message}
                          </motion.p>
                        )}
                      </div>

                      {/* Gender */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          <Iconify
                            icon="solar:users-group-rounded-bold-duotone"
                            width={18}
                            className="text-purple-500"
                          />
                          Gender
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {(["Male", "Female", "Other"] as const).map((g) => {
                            const config = GENDER_CONFIG[g];
                            const isSelected = genderValue === g;
                            return (
                              <button
                                key={g}
                                type="button"
                                onClick={() => setValue("gender", g)}
                                disabled={loading}
                                className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                                  isSelected
                                    ? `${config.border} ${config.bg} ring-4 ${config.ring}`
                                    : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
                                }`}
                              >
                                <div
                                  className={`w-10 h-10 rounded-xl ${isSelected ? `bg-gradient-to-br ${config.gradient}` : "bg-gray-200 dark:bg-gray-700"} flex items-center justify-center transition-all`}
                                >
                                  <Iconify
                                    icon={config.icon}
                                    width={22}
                                    style={{
                                      color: isSelected ? "white" : "#9CA3AF",
                                    }}
                                  />
                                </div>
                                <span
                                  className={`text-sm font-medium ${isSelected ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}
                                >
                                  {g}
                                </span>
                                {isSelected && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center"
                                  >
                                    <Iconify
                                      icon="solar:check-read-bold"
                                      width={12}
                                      className="text-white"
                                    />
                                  </motion.div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Birth Details */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-5"
                    >
                      {/* Birth Date */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          <Iconify
                            icon="solar:calendar-bold-duotone"
                            width={18}
                            className="text-orange-500"
                          />
                          Birth Date
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 rounded-xl text-gray-900 dark:text-white outline-none transition-all ${
                            errors.birthDate
                              ? "border-red-400 focus:ring-4 ring-red-500/20"
                              : "border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-4 ring-purple-500/10"
                          }`}
                          {...register("birthDate", {
                            required: "Birth date is required",
                          })}
                          disabled={loading}
                        />
                        {errors.birthDate && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-1 text-red-500 text-xs mt-1.5"
                          >
                            <Iconify
                              icon="solar:danger-triangle-bold"
                              width={14}
                            />
                            {errors.birthDate.message}
                          </motion.p>
                        )}
                      </div>

                      {/* Birth Time */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          <Iconify
                            icon="solar:clock-circle-bold-duotone"
                            width={18}
                            className="text-indigo-500"
                          />
                          Birth Time
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="time"
                          className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 rounded-xl text-gray-900 dark:text-white outline-none transition-all ${
                            errors.birthTime
                              ? "border-red-400 focus:ring-4 ring-red-500/20"
                              : "border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-4 ring-purple-500/10"
                          }`}
                          {...register("birthTime", {
                            required: "Birth time is required",
                          })}
                          disabled={loading}
                        />
                        {errors.birthTime && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-1 text-red-500 text-xs mt-1.5"
                          >
                            <Iconify
                              icon="solar:danger-triangle-bold"
                              width={14}
                            />
                            {errors.birthTime.message}
                          </motion.p>
                        )}
                      </div>

                      {/* Tip Card */}
                      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200/50 dark:border-amber-800/50">
                        <div className="flex items-start gap-3">
                          <Iconify
                            icon="solar:lightbulb-bold-duotone"
                            width={20}
                            className="text-amber-500 flex-shrink-0 mt-0.5"
                          />
                          <div>
                            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                              Accurate Birth Time
                            </p>
                            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                              For precise astrological calculations, use the
                              exact birth time from birth certificate if
                              available.
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Location & Notes */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-5"
                    >
                      {/* Birth Location */}
                      <div className="relative">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          <Iconify
                            icon="solar:map-point-bold-duotone"
                            width={18}
                            className="text-red-500"
                          />
                          Birth Location
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            className="w-full px-4 py-3 pl-11 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-purple-500 focus:ring-4 ring-purple-500/10 transition-all"
                            placeholder="Search city or place..."
                            {...register("locationSearch", {
                              required: "Location is required",
                            })}
                            onFocus={() =>
                              locationSuggestions.length > 0 &&
                              setShowSuggestions(true)
                            }
                            disabled={loading}
                            autoComplete="off"
                          />
                          <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                            {searchingLocation ? (
                              <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Iconify
                                icon="solar:magnifer-bold-duotone"
                                width={18}
                                className="text-gray-400"
                              />
                            )}
                          </div>
                        </div>

                        {/* Location Suggestions */}
                        <AnimatePresence>
                          {showSuggestions &&
                            locationSuggestions.length > 0 && (
                              <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                className="absolute z-20 w-full mt-2 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                              >
                                {locationSuggestions.map((loc, index) => (
                                  <button
                                    key={index}
                                    type="button"
                                    className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    onClick={() => selectLocation(loc)}
                                  >
                                    <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                                      <Iconify
                                        icon="solar:map-point-bold"
                                        width={16}
                                        className="text-red-500"
                                      />
                                    </div>
                                    <span className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                                      {loc.name}
                                    </span>
                                  </button>
                                ))}
                              </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Selected Location Badge */}
                        <AnimatePresence>
                          {selectedLocation && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800/50"
                            >
                              <div className="flex items-center gap-2">
                                <Iconify
                                  icon="solar:check-circle-bold"
                                  width={18}
                                  className="text-green-500"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-green-700 dark:text-green-400 truncate">
                                    {selectedLocation.name
                                      .split(",")
                                      .slice(0, 2)
                                      .join(",")}
                                  </p>
                                  <p className="text-xs text-green-600/60 dark:text-green-400/60">
                                    {selectedLocation.latitude.toFixed(4)}°N,{" "}
                                    {selectedLocation.longitude.toFixed(4)}°E
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedLocation(null);
                                    setValue("locationSearch", "");
                                  }}
                                  className="p-1 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                                >
                                  <Iconify
                                    icon="solar:close-circle-bold"
                                    width={16}
                                    className="text-green-500"
                                  />
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {errors.locationSearch && !selectedLocation && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-1 text-red-500 text-xs mt-1.5"
                          >
                            <Iconify
                              icon="solar:danger-triangle-bold"
                              width={14}
                            />
                            Please select a location from suggestions
                          </motion.p>
                        )}
                      </div>

                      {/* Notes */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          <Iconify
                            icon="solar:document-text-bold-duotone"
                            width={18}
                            className="text-gray-500"
                          />
                          Notes
                          <span className="text-xs font-normal text-gray-400">
                            (Optional)
                          </span>
                        </label>
                        <textarea
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-purple-500 focus:ring-4 ring-purple-500/10 transition-all resize-none"
                          rows={3}
                          placeholder="Any additional notes..."
                          {...register("notes")}
                          disabled={loading}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
                <div>
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      disabled={loading}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                    >
                      <Iconify icon="solar:alt-arrow-left-bold" width={16} />
                      Back
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    className="px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>

                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={goToNextStep}
                      className={`flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r ${genderConfig.gradient} text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5`}
                    >
                      Next
                      <Iconify icon="solar:alt-arrow-right-bold" width={16} />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className={`flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r ${genderConfig.gradient} text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0`}
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Iconify icon="solar:user-plus-bold" width={18} />
                          Add Person
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
