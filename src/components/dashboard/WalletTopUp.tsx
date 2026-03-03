"use client";

import { useCallback, useEffect, useState } from "react";
import Iconify from "../Iconify";
import { useRazorpay } from "@/src/utils/useRazorpay";
import api from "@/src/lib/api";

interface WalletBalance {
  balance: number;
  currency: string;
}

const TOP_UP_AMOUNTS = [
  { label: "₹100", value: 10000 },
  { label: "₹500", value: 50000 },
  { label: "₹1,000", value: 100000 },
  { label: "₹2,000", value: 200000 },
];

export default function WalletTopUp() {
  const { isLoaded: razorpayLoaded, error: scriptError } = useRazorpay();
  const [wallet, setWallet] = useState<WalletBalance | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [balanceError, setBalanceError] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(TOP_UP_AMOUNTS[0].value);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // ─── Fetch wallet balance ──────────────────────────────────────────────────
  const fetchBalance = useCallback(async () => {
    try {
      setBalanceError(null);
      const { data } = await api.get("/api/wallet/balance");
      // Store balance directly in rupees, as backend sends remainingBalanceRupees
      setWallet({ balance: data.remainingBalanceRupees || 0, currency: "INR" });
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

  // ─── Add Balance → Create Order → Razorpay Checkout ────────────────────────
  const handleTopUp = async () => {
    if (!razorpayLoaded || !window.Razorpay) {
      alert("Payment gateway is still loading. Please try again.");
      return;
    }

    setPaymentLoading(true);
    setStatusMsg(null);

    try {
      // Step 1 — Add balance request → get receipt
      setStatusMsg("Initiating transaction…");
      const { data: balanceData } = await api.post("/api/wallet/add-balance", {
        amount: selectedAmount,
        currency: "INR",
        transaction_id: `txn_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      });

      if (!balanceData.success) {
        console.error("[WalletTopUp] Validation failed details:", balanceData);
        throw new Error(
          balanceData.error ||
            (balanceData.message
              ? balanceData.message
              : "Failed to initiate add-balance."),
        );
      }

      const { amount, currency, receipt } = balanceData;

      // Step 2 — Create Razorpay order using receipt
      setStatusMsg("Creating payment order…");
      const { data: orderData } = await api.post("/api/payment/create-order", {
        amount,
        currency,
        receipt,
      });

      if (!orderData.order_id) {
        throw new Error(orderData.error || "Failed to create payment order.");
      }

      // Step 3 — Open Razorpay checkout
      setStatusMsg("Opening payment gateway…");
      const options = {
        key: orderData.key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "Astro Web",
        description: "Wallet Top-Up",
        order_id: orderData.order_id,

        handler: function () {
          setStatusMsg("Payment successful! Updating balance…");
          setPaymentLoading(false);
          // Refresh balance after a short delay
          setTimeout(() => {
            setStatusMsg(null);
            fetchBalance();
          }, 3000);
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
          console.error("[WalletTopUp] payment failed:", response.error);
          setStatusMsg(`Payment failed: ${response.error.description}`);
          setPaymentLoading(false);
          setTimeout(() => setStatusMsg(null), 5000);
        },
      );

      rzp.open();
    } catch (err: any) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        (err instanceof Error ? err.message : "An unexpected error occurred.");
      console.error(
        "[WalletTopUp] handleTopUp error details:",
        err.response?.data || err,
      );
      setStatusMsg(msg);
      setPaymentLoading(false);
      setTimeout(() => setStatusMsg(null), 5000);
    }
  };

  // ─── Display helpers ───────────────────────────────────────────────────────
  const displayBalance =
    wallet != null
      ? new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: wallet.currency,
          minimumFractionDigits: 2,
        }).format(wallet.balance)
      : null;

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[16px] shadow-sm p-6 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Iconify
            icon="lucide:wallet"
            className="text-[22px] text-[#3b82f6]"
          />
          <h3 className="text-[14px] font-bold tracking-wider text-[#94a3b8]">
            WALLET BALANCE
          </h3>
        </div>
        <button
          onClick={() => {
            setBalanceLoading(true);
            fetchBalance();
          }}
          title="Refresh balance"
          className="text-[#94a3b8] hover:text-[#3b82f6] transition-colors"
          disabled={balanceLoading}
        >
          <Iconify
            icon="lucide:refresh-cw"
            className={`text-[16px] ${balanceLoading ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {/* Balance Display */}
      <div className="mb-5">
        {balanceLoading ? (
          <div className="h-9 w-32 bg-[#f1f5f9] rounded-lg animate-pulse" />
        ) : balanceError ? (
          <div className="flex items-center gap-2 text-[#ef4444] text-[13px] font-medium">
            <Iconify icon="lucide:alert-circle" className="text-[16px]" />
            {balanceError}
          </div>
        ) : (
          <div className="flex items-baseline gap-1">
            <span className="text-[30px] font-bold text-[#1e293b] leading-none">
              {displayBalance}
            </span>
          </div>
        )}
      </div>

      {/* Amount Selector */}
      <div className="mb-4">
        <p className="text-[12px] font-semibold text-[#94a3b8] mb-2 tracking-wide">
          SELECT AMOUNT
        </p>
        <div className="grid grid-cols-4 gap-2">
          {TOP_UP_AMOUNTS.map((item) => (
            <button
              key={item.value}
              onClick={() => setSelectedAmount(item.value)}
              disabled={paymentLoading}
              className={`py-2 rounded-lg text-[13px] font-bold transition-all border ${
                selectedAmount === item.value
                  ? "bg-[#3b82f6] text-white border-[#3b82f6] shadow-md shadow-blue-500/20"
                  : "bg-[#f8fafc] text-[#475569] border-[#e2e8f0] hover:border-[#3b82f6] hover:text-[#3b82f6]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Script error */}
      {scriptError && (
        <p className="text-[12px] text-[#ef4444] mb-3">{scriptError}</p>
      )}

      {/* Status Message */}
      {statusMsg && (
        <div
          className={`flex items-center gap-2 text-[12px] font-medium mb-3 px-3 py-2 rounded-lg ${
            statusMsg.includes("failed") || statusMsg.includes("Failed")
              ? "bg-red-50 text-red-600"
              : statusMsg.includes("successful")
                ? "bg-green-50 text-green-600"
                : "bg-blue-50 text-blue-600"
          }`}
        >
          <Iconify
            icon={
              statusMsg.includes("failed") || statusMsg.includes("Failed")
                ? "lucide:alert-circle"
                : statusMsg.includes("successful")
                  ? "lucide:check-circle-2"
                  : "lucide:loader-2"
            }
            className={`text-[14px] ${
              !statusMsg.includes("failed") &&
              !statusMsg.includes("Failed") &&
              !statusMsg.includes("successful")
                ? "animate-spin"
                : ""
            }`}
          />
          {statusMsg}
        </div>
      )}

      {/* Add Balance Button */}
      <button
        onClick={handleTopUp}
        disabled={paymentLoading || !!scriptError}
        className="w-full flex items-center justify-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-[14px] px-4 py-3 rounded-[10px] transition-colors shadow-lg shadow-blue-500/15"
      >
        <Iconify icon="lucide:plus-circle" className="text-[17px]" />
        {paymentLoading
          ? "Processing…"
          : `Add ₹${(selectedAmount / 100).toLocaleString("en-IN")}`}
      </button>

      <p className="text-[11px] text-[#94a3b8] mt-3 text-center">
        Payments are secure. Wallet credit is confirmed only after bank
        verification.
      </p>
    </div>
  );
}
