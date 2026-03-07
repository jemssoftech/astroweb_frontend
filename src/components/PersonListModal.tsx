"use client";

import { useState, useEffect } from "react";
import { Person } from "@/src/lib/models";
import { getPersonList, deletePersonWithConfirm } from "@/src/lib/astroweb";
import Iconify from "./Iconify";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  show: boolean;
  onClose: () => void;
  onSelect: (person: Person) => void;
  onEdit: (person: Person) => void;
  onRefresh: () => void;
}

const GENDER_CONFIG: Record<
  string,
  { icon: string; color: string; gradient: string; bg: string }
> = {
  Male: {
    icon: "solar:men-bold-duotone",
    color: "#3B82F6",
    gradient: "from-blue-400 to-indigo-500",
    bg: "bg-blue-50 dark:bg-blue-900/20",
  },
  Female: {
    icon: "solar:women-bold-duotone",
    color: "#EC4899",
    gradient: "from-pink-400 to-rose-500",
    bg: "bg-pink-50 dark:bg-pink-900/20",
  },
  Other: {
    icon: "solar:user-bold-duotone",
    color: "#8B5CF6",
    gradient: "from-violet-400 to-purple-500",
    bg: "bg-violet-50 dark:bg-violet-900/20",
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

export default function PersonListModal({
  show,
  onClose,
  onSelect,
  onEdit,
  onRefresh,
}: Props) {
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewType, setViewType] = useState<"private" | "public">("private");
  const [sortBy, setSortBy] = useState<"name" | "date">("name");

  useEffect(() => {
    if (show) {
      fetchPersons();
      setSearchTerm("");
    }
  }, [show, viewType]);

  const fetchPersons = async () => {
    setLoading(true);
    const list = await getPersonList(viewType);
    if (list) setPersons(list);
    setLoading(false);
  };

  const handleSelect = (person: Person) => {
    onSelect(person);
    onClose();
  };

  const handleEdit = (person: Person) => {
    onEdit(person);
    onClose();
  };

  const handleDelete = async (person: Person) => {
    const success = await deletePersonWithConfirm(person.PersonId, person.Name);
    if (success) {
      await fetchPersons();
      onRefresh();
    }
  };

  const filteredPersons = persons
    .filter((p) => p.Name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "name") return a.Name.localeCompare(b.Name);
      return (
        new Date(b.BirthTime || 0).getTime() -
        new Date(a.BirthTime || 0).getTime()
      );
    });

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const getGenderConfig = (gender: string) =>
    GENDER_CONFIG[gender] || GENDER_CONFIG.Other;

  if (!show) return null;

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
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="relative px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <Iconify
                  icon="solar:close-circle-bold"
                  width={20}
                  className="text-gray-500"
                />
              </button>

              {/* Title */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center text-white shadow-lg">
                  <Iconify
                    icon="solar:users-group-rounded-bold-duotone"
                    width={24}
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Person Directory
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {persons.length} profiles available
                  </p>
                </div>
              </div>

              {/* Search & Filters */}
              <div className="mt-5 space-y-3">
                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    className="w-full px-4 py-3 pl-11 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-purple-500 focus:ring-4 ring-purple-500/10 transition-all"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                  />
                  <Iconify
                    icon="solar:magnifer-bold-duotone"
                    width={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Iconify
                        icon="solar:close-circle-bold"
                        width={16}
                        className="text-gray-400"
                      />
                    </button>
                  )}
                </div>

                {/* Filter Row */}
                <div className="flex items-center gap-3">
                  {/* View Type Toggle */}
                  <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 flex-1">
                    <button
                      onClick={() => setViewType("private")}
                      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all flex-1 ${
                        viewType === "private"
                          ? "bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
                      }`}
                    >
                      <Iconify icon="solar:lock-bold-duotone" width={16} />
                      My Profiles
                    </button>
                    <button
                      onClick={() => setViewType("public")}
                      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all flex-1 ${
                        viewType === "public"
                          ? "bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
                      }`}
                    >
                      <Iconify icon="solar:global-bold-duotone" width={16} />
                      Public
                    </button>
                  </div>

                  {/* Sort */}
                  <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                    <button
                      onClick={() => setSortBy("name")}
                      className={`p-2 rounded-lg transition-all ${
                        sortBy === "name"
                          ? "bg-white dark:bg-gray-700 shadow-sm text-purple-600"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                      title="Sort by Name"
                    >
                      <Iconify icon="solar:sort-by-alphabet-bold" width={18} />
                    </button>
                    <button
                      onClick={() => setSortBy("date")}
                      className={`p-2 rounded-lg transition-all ${
                        sortBy === "date"
                          ? "bg-white dark:bg-gray-700 shadow-sm text-purple-600"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                      title="Sort by Date"
                    >
                      <Iconify icon="solar:calendar-bold" width={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-900/50 dark:to-violet-900/50 flex items-center justify-center">
                      <Iconify
                        icon="solar:users-group-rounded-bold-duotone"
                        width={32}
                        className="text-purple-500 animate-pulse"
                      />
                    </div>
                    <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-purple-500 animate-spin" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">
                    Loading profiles...
                  </p>
                </div>
              ) : filteredPersons.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                    <Iconify
                      icon="solar:user-cross-bold-duotone"
                      width={40}
                      className="text-gray-300 dark:text-gray-600"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    No Profiles Found
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {searchTerm
                      ? `No results for "${searchTerm}"`
                      : "No profiles available"}
                  </p>
                </div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-2"
                >
                  {filteredPersons.map((person) => {
                    const genderConfig = getGenderConfig(person.Gender);
                    return (
                      <motion.div
                        key={person.PersonId}
                        variants={itemVariants}
                        className="group relative bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 hover:border-purple-200 dark:hover:border-purple-800 hover:shadow-lg transition-all"
                      >
                        <div className="flex items-center gap-4">
                          {/* Avatar */}
                          <button
                            onClick={() => handleSelect(person)}
                            className="flex-shrink-0"
                          >
                            <div
                              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${genderConfig.gradient} flex items-center justify-center text-white font-bold text-lg shadow-lg`}
                            >
                              {person.Name.charAt(0).toUpperCase()}
                            </div>
                          </button>

                          {/* Info */}
                          <button
                            onClick={() => handleSelect(person)}
                            className="flex-1 min-w-0 text-left"
                          >
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                {person.Name}
                              </h3>
                              <span
                                className={`px-2 py-0.5 text-[10px] font-semibold rounded-md ${genderConfig.bg}`}
                                style={{ color: genderConfig.color }}
                              >
                                {person.Gender}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                <Iconify
                                  icon="solar:calendar-bold"
                                  width={12}
                                />
                                {formatDate(person.BirthTime || "")}
                              </span>
                              <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 truncate">
                                <Iconify
                                  icon="solar:map-point-bold"
                                  width={12}
                                />
                                {person.BirthLocation?.split(",")[0] ||
                                  "Unknown"}
                              </span>
                            </div>
                          </button>

                          {/* Actions */}
                          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                            {/* Select */}
                            <button
                              onClick={() => handleSelect(person)}
                              className="p-2.5 rounded-xl bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                              title="Select Person"
                            >
                              <Iconify
                                icon="solar:check-circle-bold"
                                width={18}
                                className="text-green-500"
                              />
                            </button>

                            {viewType === "private" && (
                              <>
                                {/* Edit */}
                                <button
                                  onClick={() => handleEdit(person)}
                                  className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
                                  title="Edit Person"
                                >
                                  <Iconify
                                    icon="solar:pen-new-round-bold"
                                    width={18}
                                    className="text-indigo-500"
                                  />
                                </button>

                                {/* Delete */}
                                <button
                                  onClick={() => handleDelete(person)}
                                  className="p-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                  title="Delete Person"
                                >
                                  <Iconify
                                    icon="solar:trash-bin-trash-bold"
                                    width={18}
                                    className="text-red-500"
                                  />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {filteredPersons.length}
                  </span>{" "}
                  of {persons.length} profiles
                </span>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                  >
                    <Iconify icon="solar:close-circle-bold" width={14} />
                    Clear filter
                  </button>
                )}
              </div>

              <button
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
