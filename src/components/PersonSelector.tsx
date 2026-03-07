"use client";

import { useState, useEffect, useRef } from "react";
import { Person } from "@/src/lib/models";
import { getPersonList, deletePersonWithConfirm } from "@/src/lib/astroweb";
import Iconify from "./Iconify";
import AddPersonModal from "./AddPersonModal";
import EditPersonModal from "./EditPersonModal";
import PersonListModal from "./PersonListModal";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onPersonSelected: (person: Person) => void;
  label?: string;
  defaultPersonId?: string;
}

export default function PersonSelector({
  onPersonSelected,
  label = "Select Person",
  defaultPersonId,
}: Props) {
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const fetchPersons = async () => {
    setLoading(true);
    const list = await getPersonList("private");
    if (list) {
      setPersons(list);

      const savedPersonId = localStorage.getItem("global_selected_person_id");
      let personToSelect = null;

      if (savedPersonId) {
        personToSelect = list.find((p) => p.PersonId === savedPersonId);
      }

      if (!personToSelect && defaultPersonId) {
        personToSelect = list.find((p) => p.PersonId === defaultPersonId);
      }

      if (personToSelect) {
        setSelectedPerson(personToSelect);
        onPersonSelected(personToSelect);
      } else if (savedPersonId) {
        localStorage.removeItem("global_selected_person_id");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPersons();
  }, []);

  // Close dropdown/search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearch(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredPersons = persons.filter((p) =>
    p.Name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handlePersonSelect = (person: Person) => {
    setSelectedPerson(person);
    onPersonSelected(person);
    localStorage.setItem("global_selected_person_id", person.PersonId);
    setShowSearch(false);
    setSearchQuery("");
  };

  const handleAddPerson = () => {
    setShowAddModal(true);
    setDropdownOpen(false);
  };

  const handleEditPerson = () => {
    if (selectedPerson) {
      setEditingPerson(selectedPerson);
      setShowEditModal(true);
      setDropdownOpen(false);
    }
  };

  const handlePersonList = () => {
    setShowListModal(true);
    setDropdownOpen(false);
  };

  const handleFixBirthTime = () => {
    if (selectedPerson) {
      window.open(
        `/tools/birth-time-rectification?personId=${selectedPerson.PersonId}`,
        "_blank",
      );
      setDropdownOpen(false);
    }
  };

  const handleDeletePerson = async () => {
    if (!selectedPerson) return;
    const success = await deletePersonWithConfirm(
      selectedPerson.PersonId,
      selectedPerson.Name,
    );
    if (success) {
      if (
        localStorage.getItem("global_selected_person_id") ===
        selectedPerson.PersonId
      ) {
        localStorage.removeItem("global_selected_person_id");
      }
      setSelectedPerson(null);
      await fetchPersons();
    }
    setDropdownOpen(false);
  };

  const handleAddSuccess = () => fetchPersons();
  const handleEditSuccess = () => fetchPersons();

  const handleSelectFromList = (person: Person) => {
    setSelectedPerson(person);
    onPersonSelected(person);
    localStorage.setItem("global_selected_person_id", person.PersonId);
  };

  const handleEditFromList = (person: Person) => {
    setEditingPerson(person);
    setShowEditModal(true);
  };

  const getGenderConfig = (gender: string) => {
    switch (gender) {
      case "Male":
        return {
          icon: "solar:men-bold-duotone",
          color: "#3B82F6",
          gradient: "from-blue-400 to-indigo-500",
          bg: "bg-blue-50 dark:bg-blue-900/20",
        };
      case "Female":
        return {
          icon: "solar:women-bold-duotone",
          color: "#EC4899",
          gradient: "from-pink-400 to-rose-500",
          bg: "bg-pink-50 dark:bg-pink-900/20",
        };
      default:
        return {
          icon: "solar:user-bold-duotone",
          color: "#6B7280",
          gradient: "from-gray-400 to-gray-500",
          bg: "bg-gray-50 dark:bg-gray-800",
        };
    }
  };

  // Menu items config
  const menuItems = [
    {
      label: "Add New Person",
      icon: "solar:user-plus-bold-duotone",
      color: "#22C55E",
      onClick: handleAddPerson,
      disabled: false,
    },
    {
      label: "Edit Person",
      icon: "solar:pen-new-round-bold-duotone",
      color: "#6366F1",
      onClick: handleEditPerson,
      disabled: !selectedPerson,
      hint: "Select first",
    },
    {
      label: "View All Persons",
      icon: "solar:users-group-rounded-bold-duotone",
      color: "#06B6D4",
      onClick: handlePersonList,
      disabled: false,
    },
    { type: "divider" as const },
    {
      label: "Fix Birth Time",
      icon: "solar:clock-circle-bold-duotone",
      color: "#F59E0B",
      onClick: handleFixBirthTime,
      disabled: !selectedPerson,
      hint: "Select first",
    },
    { type: "divider" as const },
    {
      label: "Delete Person",
      icon: "solar:trash-bin-trash-bold-duotone",
      color: "#EF4444",
      onClick: handleDeletePerson,
      disabled: !selectedPerson,
      hint: "Select first",
      danger: true,
    },
  ];

  return (
    <>
      <div className="space-y-3">
        {/* Label */}
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          {label}
        </label>

        {/* Main Selector Area */}
        <div className="relative" ref={searchRef}>
          {/* Selected Person Display / Search Trigger */}
          <div
            onClick={() => !loading && setShowSearch(true)}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all cursor-pointer
              ${
                showSearch
                  ? "border-purple-500 ring-4 ring-purple-500/10 bg-white dark:bg-gray-900"
                  : selectedPerson
                    ? "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-purple-300 dark:hover:border-purple-700"
                    : "border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 hover:border-purple-300 dark:hover:border-purple-700"
              }
            `}
          >
            {loading ? (
              <div className="flex items-center gap-3 w-full">
                <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              </div>
            ) : selectedPerson && !showSearch ? (
              <>
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getGenderConfig(selectedPerson.Gender).gradient} flex items-center justify-center text-white font-bold shadow-lg`}
                >
                  {selectedPerson.Name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white truncate">
                    {selectedPerson.Name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {new Date(
                      selectedPerson.BirthTime || "",
                    ).toLocaleDateString()}{" "}
                    •{" "}
                    {selectedPerson?.BirthLocation?.split(",")[0] || "Unknown"}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`px-2 py-1 text-[10px] font-semibold rounded-lg ${getGenderConfig(selectedPerson.Gender).bg}`}
                    style={{
                      color: getGenderConfig(selectedPerson.Gender).color,
                    }}
                  >
                    {selectedPerson.Gender}
                  </span>
                  <Iconify
                    icon="solar:alt-arrow-down-bold"
                    width={16}
                    className="text-gray-400"
                  />
                </div>
              </>
            ) : showSearch ? (
              <div className="flex items-center gap-3 w-full">
                <Iconify
                  icon="solar:magnifer-bold-duotone"
                  width={20}
                  className="text-purple-500 flex-shrink-0"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type to search..."
                  className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 outline-none text-sm"
                  autoFocus
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSearch(false);
                    setSearchQuery("");
                  }}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Iconify
                    icon="solar:close-circle-bold"
                    width={18}
                    className="text-gray-400"
                  />
                </button>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <Iconify
                    icon="solar:user-plus-bold-duotone"
                    width={20}
                    className="text-gray-400"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Click to select a person...
                  </p>
                </div>
                <Iconify
                  icon="solar:alt-arrow-down-bold"
                  width={16}
                  className="text-gray-400"
                />
              </>
            )}
          </div>

          {/* Search Dropdown */}
          <AnimatePresence>
            {showSearch && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
              >
                <div className="max-h-64 overflow-y-auto">
                  {filteredPersons.length > 0 ? (
                    filteredPersons.map((person) => {
                      const genderConfig = getGenderConfig(person.Gender);
                      const isSelected =
                        selectedPerson?.PersonId === person.PersonId;

                      return (
                        <button
                          key={person.PersonId}
                          onClick={() => handlePersonSelect(person)}
                          className={`w-full flex items-center gap-3 px-4 py-3 transition-all text-left ${
                            isSelected
                              ? "bg-purple-50 dark:bg-purple-900/20"
                              : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                          }`}
                        >
                          <div
                            className={`w-9 h-9 rounded-xl bg-gradient-to-br ${genderConfig.gradient} flex items-center justify-center text-white font-bold text-sm shadow-sm`}
                          >
                            {person.Name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {person.Name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {new Date(person.BirthTime || "").getFullYear() ||
                                "N/A"}{" "}
                              •{" "}
                              {person?.BirthLocation?.split(",")[0] ||
                                "Unknown"}
                            </p>
                          </div>
                          {isSelected && (
                            <Iconify
                              icon="solar:check-circle-bold"
                              width={20}
                              className="text-purple-500 flex-shrink-0"
                            />
                          )}
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-4 py-8 text-center">
                      <Iconify
                        icon="solar:user-cross-bold-duotone"
                        width={32}
                        className="text-gray-300 dark:text-gray-600 mx-auto mb-2"
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No persons found
                      </p>
                      <button
                        onClick={handleAddPerson}
                        className="mt-3 px-4 py-2 bg-gradient-to-r from-purple-500 to-violet-500 text-white text-sm rounded-lg font-medium"
                      >
                        + Add New Person
                      </button>
                    </div>
                  )}
                </div>

                {/* Quick Actions Footer */}
                <div className="border-t border-gray-100 dark:border-gray-800 p-2 bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleAddPerson}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                    >
                      <Iconify icon="solar:user-plus-bold" width={14} />
                      Add New
                    </button>
                    <button
                      onClick={handlePersonList}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      <Iconify
                        icon="solar:users-group-rounded-bold"
                        width={14}
                      />
                      View All
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center gap-2">
          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1.5 flex-1">
            <button
              onClick={handleAddPerson}
              className="flex items-center gap-1.5 px-3 py-2 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl text-xs font-medium transition-all"
              title="Add New Person"
            >
              <Iconify icon="solar:user-plus-bold" width={16} />
              <span className="hidden sm:inline">Add</span>
            </button>

            <button
              onClick={handleEditPerson}
              disabled={!selectedPerson}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              title="Edit Person"
            >
              <Iconify icon="solar:pen-new-round-bold" width={16} />
              <span className="hidden sm:inline">Edit</span>
            </button>

            <button
              onClick={handlePersonList}
              className="flex items-center gap-1.5 px-3 py-2 bg-cyan-50 dark:bg-cyan-900/20 hover:bg-cyan-100 dark:hover:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-xl text-xs font-medium transition-all"
              title="View All"
            >
              <Iconify icon="solar:users-group-rounded-bold" width={16} />
              <span className="hidden sm:inline">All</span>
            </button>
          </div>

          {/* More Options Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`p-2.5 rounded-xl transition-all ${
                dropdownOpen
                  ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
              title="More options"
            >
              <Iconify icon="solar:menu-dots-bold" width={18} />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-60 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
                >
                  <div className="p-1.5">
                    {menuItems.map((item, idx) => {
                      if ("type" in item && item.type === "divider") {
                        return (
                          <div
                            key={`div-${idx}`}
                            className="my-1 border-t border-gray-100 dark:border-gray-800"
                          />
                        );
                      }

                      if (!("label" in item)) return null;

                      return (
                        <button
                          key={item.label}
                          onClick={item.onClick}
                          disabled={item.disabled}
                          className={`
                            flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                            ${
                              item.disabled
                                ? "opacity-40 cursor-not-allowed"
                                : item.danger
                                  ? "hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                                  : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                            }
                          `}
                        >
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              item.disabled
                                ? "bg-gray-100 dark:bg-gray-800"
                                : ""
                            }`}
                            style={{
                              backgroundColor: item.disabled
                                ? undefined
                                : `${item.color}15`,
                            }}
                          >
                            <Iconify
                              icon={item.icon}
                              width={18}
                              style={{
                                color: item.disabled ? "#9CA3AF" : item.color,
                              }}
                            />
                          </div>
                          <div className="flex-1 text-left">
                            <span>{item.label}</span>
                            {item.disabled && item.hint && (
                              <span className="text-[10px] text-gray-400 ml-1">
                                ({item.hint})
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddPersonModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddSuccess}
      />

      <EditPersonModal
        show={showEditModal}
        person={editingPerson}
        onClose={() => {
          setShowEditModal(false);
          setEditingPerson(null);
        }}
        onSuccess={handleEditSuccess}
      />

      <PersonListModal
        show={showListModal}
        onClose={() => setShowListModal(false)}
        onSelect={handleSelectFromList}
        onEdit={handleEditFromList}
        onRefresh={fetchPersons}
      />
    </>
  );
}
