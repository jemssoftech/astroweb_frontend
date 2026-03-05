"use client";

import Link from "next/link";
import Iconify from "@/src/components/Iconify";
import TransactionHistoryTable from "@/src/components/dashboard/TransactionHistoryTable";

export default function TransactionsPage() {
  return (
    <div className="container mx-auto">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-violet-100/40 to-purple-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-linear-to-tr from-cyan-100/30 to-blue-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
      </div>
      {/* Header section — matches Wallet page style */}
      <div className="relative mb-6 overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl shadow-blue-500/20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white" />
          <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white" />
        </div>

        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-14 h-14 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <Iconify
                icon="lucide:history"
                className="text-white text-md sm:text-2xl"
              />
            </div>
            <div>
              <h1 className="text-md sm:text-2xl md:text-3xl font-bold text-white mb-1">
                Transaction History
              </h1>
              <p className="text-purple-100/80 text-sm">
                View all your wallet top-ups and service deductions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/10 overflow-hidden">
              <Link
                href="/dashboard/wallet"
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <Iconify icon="lucide:wallet" className="text-lg" />
                My Wallet
              </Link>
            </div>
          </div>
        </div>
      </div>

      <TransactionHistoryTable />
    </div>
  );
}
