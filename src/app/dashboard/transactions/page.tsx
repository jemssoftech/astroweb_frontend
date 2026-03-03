"use client";

import TransactionHistoryTable from "@/src/components/dashboard/TransactionHistoryTable";

export default function TransactionsPage() {
  return (
    <div className="w-full max-w-[1000px] mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Transaction History
          </h1>
          <p className="text-sm text-gray-500">
            View all your wallet top-ups and service deductions.
          </p>
        </div>
      </div>

      <TransactionHistoryTable />
    </div>
  );
}
