import React from "react";
import WalletTopUp from "@/src/components/dashboard/WalletTopUp";
import Link from "next/link";
import Iconify from "@/src/components/Iconify";
import TransactionHistoryTable from "@/src/components/dashboard/TransactionHistoryTable";

export default function WalletPage() {
  return (
    <div className="w-full max-w-[1000px] mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Wallet</h1>
          <p className="text-sm text-gray-500">
            View your balance, top up, and track your transactions.
          </p>
        </div>

        <Link
          href="/dashboard/transactions"
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-xl text-sm font-semibold transition-colors shadow-sm"
        >
          <Iconify icon="lucide:history" className="text-base" />
          Full History
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Top Up */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 sm:p-4">
            <WalletTopUp />
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
            <h3 className="text-blue-900 font-bold mb-2 flex items-center gap-2">
              <Iconify icon="lucide:info" className="text-lg" />
              Quick Tip
            </h3>
            <p className="text-blue-700 text-sm leading-relaxed">
              Your wallet balance can be used for all services on our platform.
              Top up now to enjoy uninterrupted consultations with our top
              astrologers.
            </p>
          </div>
        </div>

        {/* Right Column: Recent Transactions */}
        <div className="lg:col-span-7">
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-xl font-bold text-gray-900">
              Recent Transactions
            </h2>
            <Link
              href="/dashboard/transactions"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View All
              <Iconify icon="lucide:chevron-right" className="text-xs" />
            </Link>
          </div>
          <TransactionHistoryTable limit={5} />
        </div>
      </div>
    </div>
  );
}
