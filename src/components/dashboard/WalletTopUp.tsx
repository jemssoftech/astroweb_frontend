"use client";

import { useCallback, useEffect, useState } from "react";
import Iconify from "../Iconify";
import { useRazorpay } from "@/src/utils/useRazorpay";
import { fetchWithAuth } from "@/src/lib/fetchWithAuth";

interface WalletBalance {
  balance: number;
  currency: string;
}

const TOP_UP_AMOUNT = 1000; // ₹10.00 (Razorpay uses paise — 1000 paise = ₹10)

export default function WalletTopUp() {
  const { isLoaded: razorpayLoaded, error: scriptError } = useRazorpay();
  const [wallet, setWallet] = useState<WalletBalance | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [balanceError, setBalanceError] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // ─── Fetch wallet balance ──────────────────────────────────────────────────
  const fetchBalance = useCallback(async () => {
    try {
      setBalanceError(null);
      const res = await fetchWithAuth("/api/wallet/balance");
      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || "Could not load balance.");

      setWallet({ balance: data.balance, currency: data.currency || "INR" });
    } catch (err) {
      console.error("[WalletTopUp] fetchBalance error:", err);
      setBalanceError("Could not load wallet balance.");
    } finally {
      setBalanceLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  // ─── Top-Up flow ───────────────────────────────────────────────────────────
  const handleTopUp = async () => {
    if (!razorpayLoaded || !window.Razorpay) {
      alert("Payment gateway is still loading. Please try again.");
      return;
    }

    setPaymentLoading(true);

    try {
      // Step 1 — Ask backend to create a Razorpay order
      const res = await fetchWithAuth("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: TOP_UP_AMOUNT }),
      });

      const data = await res.json();

      if (!res.ok || !data.order_id) {
        console.error("[WalletTopUp] create-order failed:", data);
        alert("Could not initiate payment. Please try again.");
        setPaymentLoading(false);
        return;
      }

      // Step 2 — Open Razorpay popup
      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: "INR",
        name: "Astro Web",
        description: "Wallet Top-Up",
        order_id: data.order_id,

        handler: function () {
          // ─── IMPORTANT: No verification here. Backend webhook handles it. ───
          alert("Payment processing. Wallet will update shortly.");

          // Refresh balance after 3 s to reflect webhook-confirmed credit
          setTimeout(() => {
            fetchBalance();
          }, 3000);
        },

        modal: {
          ondismiss: function () {
            // User closed popup without paying — do nothing
            setPaymentLoading(false);
          },
        },

        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);

      rzp.on(
        "payment.failed",
        function (response: { error: { description: string } }) {
          console.error("[WalletTopUp] payment failed:", response.error);
          alert(`Payment failed: ${response.error.description}`);
          setPaymentLoading(false);
        },
      );

      rzp.open();
    } catch (err) {
      console.error("[WalletTopUp] handleTopUp error:", err);
      alert("An unexpected error occurred. Please try again.");
      setPaymentLoading(false);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  const displayBalance =
    wallet != null
      ? new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: wallet.currency,
          minimumFractionDigits: 2,
        }).format(wallet.balance / 100) // convert paise → rupees
      : null;

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[16px] shadow-sm p-6 relative">
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

        {/* Refresh button */}
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

      {/* Balance */}
      <div className="mb-6">
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

      {/* Script error */}
      {scriptError && (
        <p className="text-[12px] text-[#ef4444] mb-3">{scriptError}</p>
      )}

      {/* Top-Up Button */}
      <button
        onClick={handleTopUp}
        disabled={paymentLoading || !!scriptError}
        className="w-full flex items-center justify-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-[14px] px-4 py-3 rounded-[10px] transition-colors"
      >
        <Iconify icon="lucide:plus-circle" className="text-[17px]" />
        {paymentLoading ? "Opening payment..." : "Top-Up Wallet"}
      </button>

      <p className="text-[11px] text-[#94a3b8] mt-3 text-center">
        Payments are secure. Wallet credit is confirmed only after bank
        verification.
      </p>
    </div>
  );
}
