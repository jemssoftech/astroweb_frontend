import React from "react";
import WalletTopUp from "@/src/components/dashboard/WalletTopUp";
import Link from "next/link";
import Iconify from "@/src/components/Iconify";
import TransactionHistoryTable from "@/src/components/dashboard/TransactionHistoryTable";

export default function WalletPage() {
  return (
    <div className="container mx-auto ">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-violet-100/40 to-purple-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-linear-to-tr from-cyan-100/30 to-blue-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
      </div>
      {/* Header section */}

      <div className="relative mb-6 overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl shadow-blue-500/20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white" />
          <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white" />
        </div>

        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-14 h-14 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <Iconify
                icon="lucide:wallet"
                className="text-white text-md sm:text-2xl"
              />
            </div>
            <div>
              <h1 className="text-md sm:text-2xl md:text-3xl font-bold text-white mb-1">
                My Wallet
              </h1>
              <p className="text-purple-100/80 text-sm">
                View your balance, top up, and track your transactions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/10 overflow-hidden">
              <Link
                href="/dashboard/transactions"
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <Iconify icon="lucide:history" className="text-lg" />
                Full History
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
        {/* Left Column: Top Up */}
        <div className="lg:col-span-5 space-y-4 sm:space-y-6">
          <div className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50 p-4 sm:p-6 transition-colors">
            <WalletTopUp />
          </div>

          {/* Quick Tip Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 border border-blue-100 dark:border-blue-500/20 rounded-2xl p-5 sm:p-6 transition-colors">
            <h3 className="text-blue-900 dark:text-blue-300 font-semibold mb-2 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-500/20">
                <Iconify
                  icon="lucide:lightbulb"
                  className="text-blue-600 dark:text-blue-400 text-sm"
                />
              </span>
              Quick Tip
            </h3>
            <p className="text-blue-700 dark:text-blue-200/80 text-sm leading-relaxed ml-9">
              Your wallet balance can be used for all services on our platform.
              Top up now to enjoy uninterrupted consultations with our top
              astrologers.
            </p>
          </div>
        </div>

        {/* Right Column: Recent Transactions */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-6">
          <div className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50 overflow-hidden transition-colors">
            {/* Section Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 pb-0 sm:pb-0">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white transition-colors">
                Recent Transactions
              </h2>
              <Link
                href="/dashboard/transactions"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 transition-colors"
              >
                View All
                <Iconify icon="lucide:chevron-right" className="text-base" />
              </Link>
            </div>

            {/* Transaction Table */}
            <div className="p-4 sm:p-6 pt-4">
              <TransactionHistoryTable limit={5} />
            </div>
          </div>

          {/* Optional: Help Card */}
          <div className="mt-6 flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-800/30 rounded-xl border border-gray-100 dark:border-slate-700/50">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
              <Iconify
                icon="lucide:help-circle"
                className="text-gray-500 dark:text-gray-400 text-lg"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Need help with transactions?
              </p>
              <Link
                href="/support"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                Contact Support →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
