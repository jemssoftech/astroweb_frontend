"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import Iconify from "../Iconify";
import { useRazorpay } from "@/src/utils/useRazorpay";
import api from "@/src/lib/api";

interface WalletBalance {
  balance: number;
  currency: string;
}

const TOP_UP_AMOUNTS = [
  { label: "₹100", value: 10000 },
  { label: "₹200", value: 20000 },
  { label: "₹500", value: 50000 },
  { label: "₹1,000", value: 100000 },
  { label: "₹2,000", value: 200000 },
  { label: "₹5,000", value: 500000 },
];

const MIN_AMOUNT = 70; // Minimum ₹70

export default function WalletTopUp() {
  const { isLoaded: razorpayLoaded, error: scriptError } = useRazorpay();
  const [wallet, setWallet] = useState<WalletBalance | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [balanceError, setBalanceError] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Payment result modal state
  const [paymentResult, setPaymentResult] = useState<{
    type: "success" | "failed";
    message: string;
  } | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [customError, setCustomError] = useState<string | null>(null);
  const [isCustomMode, setIsCustomMode] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ─── Fetch wallet balance ──────────────────────────────────────────────────
  const fetchBalance = useCallback(async () => {
    try {
      setBalanceError(null);
      const { data } = await api.get("/api/wallet/balance");
      setWallet({ balance: data.remainingBalanceRupees || 0, currency: "INR" });
      window.dispatchEvent(new Event("wallet:update"));
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Could not load wallet balance.";
      console.error("[WalletTopUp] fetchBalance error:", msg);
      setBalanceError("Could not load wallet balance.");
    } finally {
      setBalanceLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  // ─── Close modal on outside click ──────────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        closeModal();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  // ─── Focus input when switching to custom mode ─────────────────────────────
  useEffect(() => {
    if (isCustomMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCustomMode]);

  // ─── Modal handlers ────────────────────────────────────────────────────────
  const openModal = () => {
    setIsModalOpen(true);
    setSelectedAmount(null);
    setCustomAmount("");
    setCustomError(null);
    setIsCustomMode(false);
  };

  const closeModal = () => {
    if (paymentLoading) return;
    setIsModalOpen(false);
    setSelectedAmount(null);
    setCustomAmount("");
    setCustomError(null);
    setIsCustomMode(false);
  };

  // ─── Custom amount validation ──────────────────────────────────────────────
  const validateCustomAmount = (value: string): boolean => {
    setCustomError(null);

    if (!value.trim()) {
      setCustomError("Please enter an amount");
      return false;
    }

    const numValue = parseFloat(value);

    if (isNaN(numValue)) {
      setCustomError("Please enter a valid number");
      return false;
    }

    if (numValue < MIN_AMOUNT) {
      setCustomError(`Minimum amount is ₹${MIN_AMOUNT}`);
      return false;
    }

    if (numValue > 100000) {
      setCustomError("Maximum amount is ₹1,00,000");
      return false;
    }

    return true;
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimal
    if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
      setCustomAmount(value);
      setCustomError(null);
    }
  };

  // ─── Get final amount in paise ─────────────────────────────────────────────
  const getFinalAmountInPaise = (): number | null => {
    if (isCustomMode) {
      if (!validateCustomAmount(customAmount)) return null;
      return Math.round(parseFloat(customAmount) * 100);
    }
    return selectedAmount;
  };

  // ─── Add Balance → Create Order → Razorpay Checkout ────────────────────────
  const handleTopUp = async () => {
    const amountInPaise = getFinalAmountInPaise();
    if (!amountInPaise) return;

    if (!razorpayLoaded || !window.Razorpay) {
      alert("Payment gateway is still loading. Please try again.");
      return;
    }

    setPaymentLoading(true);
    setStatusMsg(null);

    try {
      setStatusMsg("Initiating transaction…");
      const { data: balanceData } = await api.post("/api/wallet/add-balance", {
        amount: amountInPaise,
        currency: "INR",
        transaction_id: `txn_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      });

      if (!balanceData.success) {
        throw new Error(
          balanceData.error ||
            balanceData.message ||
            "Failed to initiate add-balance.",
        );
      }

      const { amount, currency, receipt } = balanceData;

      setStatusMsg("Creating payment order…");
      const { data: orderData } = await api.post("/api/payment/create-order", {
        amount,
        currency,
        receipt,
      });

      if (!orderData.order_id) {
        throw new Error(orderData.error || "Failed to create payment order.");
      }

      setStatusMsg("Opening payment gateway…");
      closeModal();

      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "Astro Web",
        description: "Wallet Top-Up",
        order_id: orderData.order_id,
        handler: function () {
          setPaymentLoading(false);
          setStatusMsg(null);
          setPaymentResult({
            type: "success",
            message: "Payment Successful! Your wallet has been topped up.",
          });
          fetchBalance();
        },
        modal: {
          ondismiss: function () {
            setPaymentLoading(false);
            setStatusMsg(null);
          },
        },
        theme: { color: "#3b82f6" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on(
        "payment.failed",
        function (response: { error: { description: string } }) {
          setPaymentLoading(false);
          setStatusMsg(null);
          setPaymentResult({
            type: "failed",
            message:
              response.error.description || "Payment failed. Please try again.",
          });
        },
      );
      rzp.open();
    } catch (err: any) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        (err instanceof Error ? err.message : "An unexpected error occurred.");
      setStatusMsg(msg);
      setPaymentLoading(false);
      setTimeout(() => setStatusMsg(null), 5000);
    }
  };

  const displayBalance =
    wallet != null
      ? new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: wallet.currency,
          minimumFractionDigits: 2,
        }).format(wallet.balance)
      : null;

  const getStatusType = (msg: string) => {
    if (msg.includes("failed") || msg.includes("Failed")) return "error";
    if (msg.includes("successful")) return "success";
    return "loading";
  };

  const canProceed = isCustomMode
    ? customAmount.trim() !== "" && !customError
    : selectedAmount !== null;

  return (
    <>
      <div className="space-y-5">
        {/* Balance Card */}
        <div className="relative overflow-hidden rounded-xl bg-linear-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 p-5 text-white">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white" />
            <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white" />
          </div>

          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                  <Iconify icon="lucide:wallet" className="text-lg" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-100">
                  Available Balance
                </span>
              </div>
              <button
                onClick={() => {
                  setBalanceLoading(true);
                  fetchBalance();
                }}
                title="Refresh balance"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                disabled={balanceLoading}
              >
                <Iconify
                  icon="lucide:refresh-cw"
                  className={`text-sm ${balanceLoading ? "animate-spin" : ""}`}
                />
              </button>
            </div>

            {balanceLoading ? (
              <div className="h-10 w-36 animate-pulse rounded-lg bg-white/20" />
            ) : balanceError ? (
              <div className="flex items-center gap-2 text-red-200 text-sm font-medium">
                <Iconify icon="lucide:alert-circle" className="text-base" />
                {balanceError}
              </div>
            ) : (
              <p className="text-3xl sm:text-4xl font-bold tracking-tight">
                {displayBalance}
              </p>
            )}
          </div>
        </div>

        {/* Script Error */}
        {scriptError && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
            <Iconify
              icon="lucide:alert-triangle"
              className="text-base flex-shrink-0"
            />
            <span>{scriptError}</span>
          </div>
        )}

        {/* Status Message */}
        {statusMsg && (
          <div
            className={`
              flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium
              ${
                getStatusType(statusMsg) === "error"
                  ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400"
                  : getStatusType(statusMsg) === "success"
                    ? "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400"
                    : "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
              }
            `}
          >
            <Iconify
              icon={
                getStatusType(statusMsg) === "error"
                  ? "lucide:alert-circle"
                  : getStatusType(statusMsg) === "success"
                    ? "lucide:check-circle-2"
                    : "lucide:loader-2"
              }
              className={`text-base flex-shrink-0 ${
                getStatusType(statusMsg) === "loading" ? "animate-spin" : ""
              }`}
            />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Add Fund Button */}
        <button
          onClick={openModal}
          disabled={!!scriptError}
          className="
            w-full flex items-center justify-center gap-2.5
            bg-linear-to-r from-blue-500 to-blue-600 
            hover:from-blue-600 hover:to-blue-700
            disabled:from-gray-400 disabled:to-gray-500
            disabled:cursor-not-allowed
            text-white font-bold text-sm
            px-6 py-3.5 rounded-xl
            transition-all duration-200
            shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30
            disabled:shadow-none
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900
          "
        >
          <Iconify icon="lucide:plus-circle" className="text-lg" />
          Add Funds
        </button>

        {/* Security Note */}
        <p className="flex items-center justify-center gap-1.5 text-xs text-gray-500 dark:text-slate-400 text-center">
          <Iconify
            icon="lucide:shield-check"
            className="text-green-500 text-sm"
          />
          Secured by Razorpay. Bank verification required.
        </p>
      </div>

      {/* ─── Modal ─────────────────────────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Modal Content */}
          <div
            ref={modalRef}
            className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/20">
                  <Iconify
                    icon="lucide:wallet"
                    className="text-xl text-blue-600 dark:text-blue-400"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Add Funds
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-slate-400">
                    Minimum ₹{MIN_AMOUNT}
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                disabled={paymentLoading}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-slate-300 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                <Iconify icon="lucide:x" className="text-lg" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-5">
              {/* Toggle Buttons */}
              <div className="flex p-1 bg-gray-100 dark:bg-slate-700 rounded-xl">
                <button
                  onClick={() => {
                    setIsCustomMode(false);
                    setCustomError(null);
                  }}
                  className={`
                    flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all
                    ${
                      !isCustomMode
                        ? "bg-white dark:bg-slate-600 text-gray-900 dark:text-white shadow-sm"
                        : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300"
                    }
                  `}
                >
                  Quick Select
                </button>
                <button
                  onClick={() => {
                    setIsCustomMode(true);
                    setSelectedAmount(null);
                  }}
                  className={`
                    flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all
                    ${
                      isCustomMode
                        ? "bg-white dark:bg-slate-600 text-gray-900 dark:text-white shadow-sm"
                        : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300"
                    }
                  `}
                >
                  Custom Amount
                </button>
              </div>

              {/* Quick Select Options */}
              {!isCustomMode && (
                <div className="grid grid-cols-3 gap-3">
                  {TOP_UP_AMOUNTS.map((item) => {
                    const isSelected = selectedAmount === item.value;
                    return (
                      <button
                        key={item.value}
                        onClick={() => setSelectedAmount(item.value)}
                        disabled={paymentLoading}
                        className={`
                          relative py-4 px-3 rounded-xl text-sm font-bold transition-all duration-200
                          border-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20
                          ${
                            isSelected
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
                              : "border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-500/50"
                          }
                          disabled:opacity-50 disabled:cursor-not-allowed
                        `}
                      >
                        {isSelected && (
                          <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white">
                            <Iconify icon="lucide:check" className="text-xs" />
                          </span>
                        )}
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Custom Amount Input */}
              {isCustomMode && (
                <div className="space-y-3">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-400 dark:text-slate-500">
                      ₹
                    </span>
                    <input
                      ref={inputRef}
                      type="text"
                      inputMode="decimal"
                      placeholder={`Enter amount (min ₹${MIN_AMOUNT})`}
                      value={customAmount}
                      onChange={handleCustomAmountChange}
                      onBlur={() =>
                        customAmount && validateCustomAmount(customAmount)
                      }
                      disabled={paymentLoading}
                      className={`
                        w-full pl-10 pr-4 py-4 rounded-xl text-lg font-semibold
                        border-2 transition-colors
                        bg-white dark:bg-slate-700
                        text-gray-900 dark:text-white
                        placeholder:text-gray-400 dark:placeholder:text-slate-500
                        focus:outline-none focus:ring-2 focus:ring-blue-500/20
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${
                          customError
                            ? "border-red-300 dark:border-red-500/50 focus:border-red-500"
                            : "border-gray-200 dark:border-slate-600 focus:border-blue-500"
                        }
                      `}
                    />
                  </div>

                  {/* Error Message */}
                  {customError && (
                    <div className="flex items-center gap-2 text-sm text-red-500 dark:text-red-400">
                      <Iconify
                        icon="lucide:alert-circle"
                        className="text-base flex-shrink-0"
                      />
                      {customError}
                    </div>
                  )}

                  {/* Quick Amount Chips */}
                  <div className="flex flex-wrap gap-2">
                    {[100, 200, 500, 1000].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => {
                          setCustomAmount(amount.toString());
                          setCustomError(null);
                        }}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-slate-600 text-gray-600 dark:text-slate-300 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-500/20 dark:hover:text-blue-400 transition-colors"
                      >
                        +₹{amount}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-5 pt-0 space-y-3">
              {/* Proceed Button */}
              <button
                onClick={handleTopUp}
                disabled={paymentLoading || !canProceed}
                className="
                  w-full flex items-center justify-center gap-2.5
                  bg-linear-to-r from-blue-500 to-blue-600 
                  hover:from-blue-600 hover:to-blue-700
                  disabled:from-gray-300 disabled:to-gray-400
                  dark:disabled:from-slate-600 dark:disabled:to-slate-700
                  disabled:cursor-not-allowed
                  text-white font-bold text-sm
                  px-6 py-3.5 rounded-xl
                  transition-all duration-200
                  shadow-lg shadow-blue-500/25 
                  hover:shadow-xl hover:shadow-blue-500/30
                  disabled:shadow-none
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                "
              >
                {paymentLoading ? (
                  <>
                    <Iconify
                      icon="lucide:loader-2"
                      className="text-lg animate-spin"
                    />
                    Processing…
                  </>
                ) : (
                  <>
                    <Iconify icon="lucide:credit-card" className="text-lg" />
                    {canProceed
                      ? `Pay ₹${(
                          (isCustomMode
                            ? parseFloat(customAmount) * 100
                            : selectedAmount || 0) / 100
                        ).toLocaleString("en-IN")}`
                      : "Select Amount"}
                  </>
                )}
              </button>

              {/* Cancel Button */}
              <button
                onClick={closeModal}
                disabled={paymentLoading}
                className="w-full py-2.5 text-sm font-semibold text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Payment Result Modal ──────────────────────────────────────────────── */}
      {paymentResult && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setPaymentResult(null)}
          />

          {/* Modal Content */}
          <div
            className="relative w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden"
            style={{
              animation:
                "paymentModalIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
            }}
          >
            {/* Top Colored Bar */}
            <div
              className={`h-1.5 ${
                paymentResult.type === "success"
                  ? "bg-linear-to-r from-green-400 to-emerald-500"
                  : "bg-linear-to-r from-red-400 to-rose-500"
              }`}
            />

            <div className="flex flex-col items-center text-center px-6 py-8">
              {/* Animated Icon */}
              <div
                className={`flex items-center justify-center w-20 h-20 rounded-full mb-5 ${
                  paymentResult.type === "success"
                    ? "bg-green-100 dark:bg-green-500/15"
                    : "bg-red-100 dark:bg-red-500/15"
                }`}
                style={{
                  animation:
                    paymentResult.type === "success"
                      ? "successCircle 0.6s ease-out forwards"
                      : "failShake 0.6s ease-out forwards",
                }}
              >
                {paymentResult.type === "success" ? (
                  <svg
                    className="w-10 h-10 text-green-500 dark:text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                      style={{
                        strokeDasharray: 24,
                        strokeDashoffset: 24,
                        animation: "checkDraw 0.5s 0.3s ease-out forwards",
                      }}
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-10 h-10 text-red-500 dark:text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                      style={{
                        strokeDasharray: 34,
                        strokeDashoffset: 34,
                        animation: "crossDraw 0.5s 0.3s ease-out forwards",
                      }}
                    />
                  </svg>
                )}
              </div>

              {/* Title */}
              <h3
                className={`text-xl font-bold mb-2 ${
                  paymentResult.type === "success"
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
                style={{ animation: "fadeUp 0.4s 0.2s ease-out both" }}
              >
                {paymentResult.type === "success"
                  ? "Payment Successful!"
                  : "Payment Failed"}
              </h3>

              {/* Message */}
              <p
                className="text-sm text-gray-500 dark:text-slate-400 mb-6 max-w-[260px]"
                style={{ animation: "fadeUp 0.4s 0.35s ease-out both" }}
              >
                {paymentResult.message}
              </p>

              {/* Button */}
              <button
                onClick={() => setPaymentResult(null)}
                className={`
                  px-8 py-2.5 rounded-xl text-sm font-bold text-white
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800
                  ${
                    paymentResult.type === "success"
                      ? "bg-linear-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg shadow-green-500/25 focus:ring-green-500"
                      : "bg-linear-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 shadow-lg shadow-red-500/25 focus:ring-red-500"
                  }
                `}
                style={{ animation: "fadeUp 0.4s 0.45s ease-out both" }}
              >
                {paymentResult.type === "success" ? "Done" : "Try Again"}
              </button>
            </div>
          </div>

          {/* CSS Keyframe Animations */}
          <style>{`
            @keyframes paymentModalIn {
              0% { opacity: 0; transform: scale(0.85) translateY(20px); }
              100% { opacity: 1; transform: scale(1) translateY(0); }
            }
            @keyframes successCircle {
              0% { transform: scale(0); opacity: 0; }
              50% { transform: scale(1.15); opacity: 1; }
              100% { transform: scale(1); opacity: 1; }
            }
            @keyframes failShake {
              0% { transform: scale(0); opacity: 0; }
              40% { transform: scale(1.1); opacity: 1; }
              55% { transform: scale(1) rotate(3deg); }
              70% { transform: scale(1) rotate(-3deg); }
              85% { transform: scale(1) rotate(1.5deg); }
              100% { transform: scale(1) rotate(0); opacity: 1; }
            }
            @keyframes checkDraw {
              to { stroke-dashoffset: 0; }
            }
            @keyframes crossDraw {
              to { stroke-dashoffset: 0; }
            }
            @keyframes fadeUp {
              0% { opacity: 0; transform: translateY(10px); }
              100% { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
