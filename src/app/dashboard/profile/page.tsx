"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Iconify from "@/src/components/Iconify";
import { getAuthToken, getUser } from "@/src/lib/auth";
import { useSocket } from "@/src/context/SocketContext";

interface UserProfile {
  id?: string;
  username?: string;
  email?: string;
  phone?: string;
  wallet_balance?: number;
  plan?: string;
  created_at?: string;
  allowedDomains?: string[];
  [key: string]: any;
}

interface EditFormData {
  username: string;
  email: string;
  phone: string;
  allowedDomains: string[];
}

export default function ProfilePage() {
  const { socket, isConnected } = useSocket();
  const token = getAuthToken();
  const localUser = getUser();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState<EditFormData>({
    username: "",
    email: "",
    phone: "",
    allowedDomains: [],
  });
  const [domainInput, setDomainInput] = useState("");
  const [editFeedback, setEditFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // API Key state
  const [copied, setCopied] = useState(false);
  const [showFullKey, setShowFullKey] = useState(false);
  const [refreshingKey, setRefreshingKey] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
  };

  // Copy API key to clipboard
  const handleCopyApiKey = useCallback(() => {
    const apiKey = profile?.apiKey || profile?.api_key;
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [profile]);

  // Refresh / regenerate API key via socket
  const handleRefreshApiKey = useCallback(() => {
    if (!socket || !isConnected || !token) return;
    setRefreshingKey(true);

    const handleRefreshResponse = (response: unknown) => {
      // Changed from any to unknown
      console.log("Received refresh-api-key-response:", response);
      clearTimeout(timeoutId);
      socket.off("refresh-api-key-response", handleRefreshResponse);
      setRefreshingKey(false);

      if (
        response &&
        typeof response === "object" &&
        !("error" in response && response.error)
      ) {
        const newKey =
          ("apiKey" in response && (response.apiKey as string)) ||
          ("api_key" in response && (response.api_key as string)) ||
          ("data" in response &&
            typeof response.data === "object" &&
            response.data &&
            "apiKey" in response.data &&
            (response.data.apiKey as string)) ||
          ("data" in response &&
            typeof response.data === "object" &&
            response.data &&
            "api_key" in response.data &&
            (response.data.api_key as string));
        if (newKey && profile) {
          setProfile({ ...profile, apiKey: newKey });
        }
        setEditFeedback({
          type: "success",
          message:
            ("message" in response && (response.message as string)) ||
            "API key refreshed successfully!",
        });
        setTimeout(() => setEditFeedback(null), 4000);
      } else {
        setEditFeedback({
          type: "error",
          message:
            (typeof response === "object" &&
              response &&
              "message" in response &&
              (response.message as string)) ||
            (typeof response === "object" &&
              response &&
              "error" in response &&
              (response.error as string)) ||
            "Failed to refresh API key",
        });
      }
    };

    socket.on("refresh-api-key-response", handleRefreshResponse);
    socket.emit("refresh-api-key", { token });

    const timeoutId = setTimeout(() => {
      socket.off("refresh-api-key-response", handleRefreshResponse);
      setRefreshingKey(false);
      setEditFeedback({
        type: "error",
        message: "Refresh request timed out. Please try again.",
      });
    }, 10000);
  }, [socket, isConnected, token, profile]);

  // Start editing – populate form with current profile data
  const handleStartEdit = useCallback(() => {
    if (!profile) return;
    let domains = profile.allowedDomains || [];
    if (typeof domains === "string") {
      try {
        domains = JSON.parse(domains);
      } catch {
        domains = [];
      }
    }
    setEditForm({
      username: profile.username || profile.name || "",
      email: profile.email || "",
      phone: profile.phone || profile.mobileNumber || "",
      allowedDomains: Array.isArray(domains) ? domains : [],
    });
    setDomainInput("");
    setEditFeedback(null);
    setIsEditing(true);
  }, [profile]);

  // Add a domain to the list
  const handleAddDomain = (event?: React.FormEvent | React.KeyboardEvent) => {
    if (event) event.preventDefault();
    const trimmed = domainInput.trim();
    if (!trimmed) return;
    if (editForm.allowedDomains.includes(trimmed)) {
      setDomainInput("");
      return;
    }
    setEditForm((prev) => ({
      ...prev,
      allowedDomains: [...prev.allowedDomains, trimmed],
    }));
    setDomainInput("");
  };

  // Remove a domain from the list
  const handleRemoveDomain = useCallback((idx: number) => {
    setEditForm((prev) => ({
      ...prev,
      allowedDomains: prev.allowedDomains.filter((_, i) => i !== idx),
    }));
  }, []);

  // Cancel editing
  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditFeedback(null);
  }, []);

  // Save profile via socket
  const handleSaveProfile = useCallback(() => {
    if (!socket || !isConnected || !token) return;
    setSaving(true);
    setEditFeedback(null);

    // Send token as both `token` and `accessToken` to match backend expectations
    const payload = { token, accessToken: token, ...editForm };
    console.log("Emitting edit-profile", payload);

    // One-shot listener: register before emit, remove after response
    const handleEditResponse = (response: unknown) => {
      // Changed from any to unknown
      console.log("Received edit-profile-response:", response);
      clearTimeout(timeoutId);
      socket.off("edit-profile-response", handleEditResponse);
      setSaving(false);

      if (
        response &&
        typeof response === "object" &&
        !("valid" in response && response.valid === false) &&
        !("error" in response && response.error)
      ) {
        // Update profile with returned data
        let updatedUser: UserProfile | undefined;
        if (
          "data" in response &&
          typeof response.data === "object" &&
          response.data &&
          "user" in response.data &&
          typeof response.data.user === "object"
        ) {
          updatedUser = response.data.user as UserProfile;
        } else if ("user" in response && typeof response.user === "object") {
          updatedUser = response.user as UserProfile;
        } else if ("data" in response && typeof response.data === "object") {
          updatedUser = response.data as UserProfile;
        } else {
          // Fallback: apply form values locally
          updatedUser = { ...profile, ...editForm };
        }

        setProfile(updatedUser as UserProfile);
        setIsEditing(false);
        setEditFeedback({
          type: "success",
          message:
            ("message" in response && (response.message as string)) ||
            "Profile updated successfully!",
        });

        // Auto-hide success message after 4 seconds
        setTimeout(() => setEditFeedback(null), 4000);
      } else {
        setEditFeedback({
          type: "error",
          message:
            (typeof response === "object" &&
              response &&
              "message" in response &&
              (response.message as string)) ||
            (typeof response === "object" &&
              response &&
              "error" in response &&
              (response.error as string)) ||
            "Failed to update profile",
        });
      }
    };

    socket.on("edit-profile-response", handleEditResponse);
    socket.emit("edit-profile", payload);

    // Timeout fallback — stop loading after 10 seconds
    const timeoutId = setTimeout(() => {
      console.log("edit-profile-response timed out");
      socket.off("edit-profile-response", handleEditResponse);
      setSaving(false);
      setEditFeedback({
        type: "error",
        message: "Request timed out. Please try again.",
      });
    }, 10000);
  }, [socket, isConnected, token, editForm, profile]);

  // Fetch profile on mount / when socket becomes ready
  useEffect(() => {
    if (!socket || !isConnected) {
      // Socket not ready — show local user if available
      if (localUser && !profile) {
        setProfile(localUser);
      }
      return;
    }

    if (!token) {
      setLoading(false);
      if (localUser) {
        setProfile(localUser);
      } else {
        setError("No authentication token found");
      }
      return;
    }

    // Fetch from server
    setLoading(true);
    setError(null);

    const handleProfileResponse = (response: {
      valid?: boolean;
      error?: string;
      message?: string;
      user?: UserProfile;
      data?: UserProfile;
      [key: string]: unknown;
    }) => {
      console.log("Received get-profile-response:", response);
      clearTimeout(timeoutId);
      socket.off("get-profile-response", handleProfileResponse);
      setLoading(false);

      if (response && response.valid !== false && !response.error) {
        let userData;
        if (response.data && response.data.user) {
          userData = response.data.user;
        } else if (response.user) {
          userData = response.user;
        } else {
          userData = response.data || response;
        }

        console.log("Setting Profile Data:", userData);
        setProfile(userData as UserProfile);
      } else {
        console.log("Profile Error:", response);
        setError(
          (response?.message as string) ||
            (response?.error as string) ||
            "Failed to load profile",
        );
        if (localUser) setProfile(localUser);
      }
    };

    socket.on("get-profile-response", handleProfileResponse);
    console.log("Emitting get-profile with token");
    socket.emit("get-profile", { token });

    // Timeout fallback
    const timeoutId = setTimeout(() => {
      socket.off("get-profile-response", handleProfileResponse);
      setLoading(false);
      if (localUser) {
        setProfile(localUser);
      } else {
        setError("Profile request timed out");
      }
    }, 10000);

    return () => {
      clearTimeout(timeoutId);
      socket.off("get-profile-response", handleProfileResponse);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, isConnected, token]);
  return (
    <div className="flex-1 w-full transition-colors duration-300">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-linear-to-br from-blue-100/40 to-purple-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-linear-to-tr from-cyan-100/30 to-emerald-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
      </div>

      <div className="relative z-10 container mx-auto space-y-6">
        {/* Header — Premium gradient banner */}
        <div className="relative mb-6 overflow-hidden bg-linear-to-br from-blue-600 to-cyan-600 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl shadow-blue-500/20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white" />
            <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white" />
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-14 h-14 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Iconify
                  icon="lucide:user"
                  className="text-white text-md sm:text-2xl"
                />
              </div>
              <div>
                <h1 className="text-md sm:text-2xl md:text-3xl font-bold text-white mb-1">
                  My Profile
                </h1>
                <p className="text-blue-100/80 text-sm">
                  Manage your account details and preferences
                </p>
              </div>
            </div>

            {!isEditing ? (
              <button
                onClick={handleStartEdit}
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/10 rounded-xl text-sm font-bold text-white transition-all active:scale-95"
              >
                <Iconify icon="lucide:edit-2" className="text-lg" />
                Edit Profile
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCancelEdit}
                  disabled={saving}
                  className="px-4 py-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/10 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="px-4 py-2 bg-white text-blue-600 rounded-xl text-sm font-bold hover:shadow-lg transition-all flex items-center gap-1.5 disabled:opacity-50 active:scale-95"
                >
                  {saving ? (
                    <>
                      <Iconify
                        icon="lucide:loader-2"
                        className="text-sm animate-spin"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Iconify icon="lucide:check" className="text-sm" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Edit Feedback Toast */}
        {editFeedback && (
          <div
            className={`p-4 rounded-xl border flex items-center gap-3 transition-all animate-in fade-in slide-in-from-top-2 ${
              editFeedback.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            <Iconify
              icon={
                editFeedback.type === "success"
                  ? "lucide:check-circle-2"
                  : "lucide:alert-circle"
              }
              className="text-xl shrink-0"
            />
            <span className="text-sm font-medium">{editFeedback.message}</span>
            <button
              onClick={() => setEditFeedback(null)}
              className="ml-auto text-current opacity-60 hover:opacity-100 transition-opacity"
            >
              <Iconify icon="lucide:x" className="text-lg" />
            </button>
          </div>
        )}

        {/* Profile Content */}
        {loading && !profile ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
            <Iconify
              icon="lucide:loader-2"
              className="text-3xl text-blue-500 animate-spin mb-4"
            />
            <p className="text-gray-500 font-medium">Loading profile data...</p>
          </div>
        ) : error && !profile ? (
          <div className="p-6 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <Iconify
                icon="lucide:alert-circle"
                className="text-red-500 text-xl"
              />
            </div>
            <div>
              <h3 className="text-red-800 font-semibold mb-1">
                Failed to load profile
              </h3>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        ) : profile ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Left Column: Avatar & Quick Info */}
            <div className="col-span-1 space-y-4 sm:space-y-6">
              <div className="bg-white dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm p-5 sm:p-6 flex flex-col items-center text-center">
                <div className="relative mb-4 group cursor-pointer">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-linear-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold text-2xl sm:text-3xl shadow-xl shadow-blue-500/20 group-hover:scale-105 transition-transform">
                    {profile.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center shadow-sm">
                    <Iconify
                      icon="lucide:camera"
                      className="text-white text-xs"
                    />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {profile.username || "User"}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {profile.email}
                </p>
                <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full border border-emerald-100 dark:border-emerald-500/20 uppercase tracking-wide transition-colors">
                  {profile.plan || "Free Plan"}
                </span>
              </div>

              <div className="bg-linear-to-br from-slate-800 to-slate-900 rounded-2xl shadow-lg p-5 sm:p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4" />
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Wallet Balance
                </h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-bold">
                    ₹
                    {(
                      profile.remainingBalanceRupees ||
                      profile.wallet ||
                      0
                    ).toLocaleString()}
                  </span>
                  <span className="text-sm text-slate-400">.00</span>
                </div>
                <Link
                  href="/dashboard/wallet"
                  className="w-full py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Iconify icon="lucide:plus" className="text-lg" />
                  Add Funds
                </Link>
              </div>
              {/* API Key Section */}
              <div className="bg-white dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md shadow-orange-500/20">
                      <Iconify
                        icon="lucide:key-round"
                        className="text-white text-lg"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        API Key
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Use this key to authenticate your API requests
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 flex items-center gap-3">
                  <code className="flex-1 text-sm font-mono text-emerald-400 truncate select-all">
                    {(() => {
                      const apiKey = profile.apikey || profile.api_key;
                      if (!apiKey)
                        return (
                          <span className="text-slate-500 italic">
                            No API key generated
                          </span>
                        );
                      if (showFullKey) return apiKey;
                      return (
                        apiKey.substring(0, 8) +
                        "••••••••••••••••" +
                        apiKey.substring(apiKey.length - 4)
                      );
                    })()}
                  </code>

                  {/* Show/Hide toggle */}
                  <button
                    onClick={() => setShowFullKey(!showFullKey)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                    title={showFullKey ? "Hide key" : "Show key"}
                  >
                    <Iconify
                      icon={showFullKey ? "lucide:eye-off" : "lucide:eye"}
                      className="text-lg"
                    />
                  </button>

                  {/* Copy button */}
                  <button
                    onClick={handleCopyApiKey}
                    disabled={!profile.apiKey && !profile.api_key}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Copy to clipboard"
                  >
                    <Iconify
                      icon={copied ? "lucide:check" : "lucide:copy"}
                      className={`text-lg ${copied ? "text-emerald-400" : ""}`}
                    />
                  </button>

                  {/* Refresh button */}
                  <button
                    onClick={handleRefreshApiKey}
                    disabled={refreshingKey}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors disabled:opacity-40"
                    title="Regenerate API key"
                  >
                    <Iconify
                      icon="lucide:refresh-cw"
                      className={`text-lg ${refreshingKey ? "animate-spin" : ""}`}
                    />
                  </button>
                </div>

                {copied && (
                  <p className="text-xs text-emerald-500 font-medium mt-2 flex items-center gap-1">
                    <Iconify icon="lucide:check-circle-2" className="text-sm" />
                    Copied to clipboard!
                  </p>
                )}
              </div>
            </div>

            {/* Right Column: Detailed Info Form */}
            <div className="col-span-1 md:col-span-2 space-y-4 sm:space-y-6">
              <div className="bg-white dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm p-5 sm:p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-5 sm:mb-6">
                  <div className="w-9 h-9 rounded-lg bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/20">
                    <Iconify
                      icon="lucide:user-circle"
                      className="text-white text-base"
                    />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                    Personal Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.username}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            username: e.target.value,
                          }))
                        }
                        className="w-full p-3 bg-white rounded-xl border border-blue-200 text-gray-800 font-medium outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                        placeholder="Enter your name"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-white/5 text-gray-800 dark:text-slate-200 font-medium transition-colors">
                        {profile.name || profile.username || "Not set"}
                      </div>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="w-full p-3 bg-white rounded-xl border border-blue-200 text-gray-800 font-medium outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                        placeholder="Enter your email"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-white/5 text-gray-800 dark:text-slate-200 font-medium flex items-center justify-between transition-colors">
                        <span className="truncate">
                          {profile.email || "Not set"}
                        </span>
                        <Iconify
                          icon="lucide:check-circle-2"
                          className="text-emerald-500 dark:text-emerald-400 text-lg shrink-0"
                        />
                      </div>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        className="w-full p-3 bg-white rounded-xl border border-blue-200 text-gray-800 font-medium outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-white/5 text-gray-800 dark:text-slate-200 font-medium transition-colors">
                        {profile.phone || profile.mobileNumber || "Not set"}
                      </div>
                    )}
                  </div>

                  {/* Allowed Domains Section */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Allowed Domains
                    </label>
                    {isEditing ? (
                      <div className="p-4 bg-white rounded-xl border border-blue-200 space-y-3">
                        {/* Domain chips */}
                        <div className="flex flex-wrap gap-2">
                          {editForm.allowedDomains.length > 0 ? (
                            editForm.allowedDomains.map((domain, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1.5 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg border border-blue-100 flex items-center gap-1.5 group"
                              >
                                <Iconify
                                  icon="lucide:globe"
                                  className="text-blue-400 text-xs"
                                />
                                {domain}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveDomain(idx)}
                                  className="ml-1 text-blue-400 hover:text-red-500 transition-colors"
                                >
                                  <Iconify
                                    icon="lucide:x"
                                    className="text-sm"
                                  />
                                </button>
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-400 italic">
                              No domains added yet
                            </span>
                          )}
                        </div>
                        {/* Add domain input */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={domainInput}
                            onChange={(e) => setDomainInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddDomain();
                              }
                            }}
                            className="flex-1 p-2.5 bg-gray-50 rounded-lg border border-gray-200 text-gray-800 text-sm font-medium outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                            placeholder="e.g. example.com"
                          />
                          <button
                            type="button"
                            onClick={handleAddDomain}
                            className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                          >
                            <Iconify icon="lucide:plus" className="text-sm" />
                            Add
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-white/5 flex flex-wrap gap-2 transition-colors">
                        {(() => {
                          let domains = profile.allowedDomains;
                          if (typeof domains === "string") {
                            try {
                              domains = JSON.parse(domains);
                            } catch (e) {
                              // ignore
                            }
                          }

                          if (
                            domains &&
                            Array.isArray(domains) &&
                            domains.length > 0
                          ) {
                            return domains.map(
                              (domain: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1.5 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg border border-blue-100 flex items-center gap-1.5"
                                >
                                  <Iconify
                                    icon="lucide:globe"
                                    className="text-blue-400 text-xs"
                                  />
                                  {domain}
                                </span>
                              ),
                            );
                          } else {
                            return (
                              <div className="text-sm text-gray-500 italic">
                                No domains configured
                              </div>
                            );
                          }
                        })()}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Member Since
                    </label>
                    <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-white/5 text-gray-800 dark:text-slate-200 font-medium transition-colors">
                      {profile.created_at
                        ? new Date(profile.created_at).toLocaleDateString()
                        : "Feb 2024"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
