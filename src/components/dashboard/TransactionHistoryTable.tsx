"use client";

import { useEffect, useState } from "react";
import Iconify from "@/src/components/Iconify";
import api from "@/src/lib/api";

export interface Transaction {
  id: string;
  referenceId: string;
  amount: number;
  type: "credit" | "debit" | "CREDIT" | "DEBIT";
  status: "init" | "pending" | "success" | "failed";
  createdAt: string;
}

interface Props {
  limit?: number;
  showTitle?: boolean;
}

export default function TransactionHistoryTable({
  limit,
  showTitle = false,
}: Props) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get("/api/wallet/history");
        let txns = data.data || [];
        if (limit) {
          txns = txns.slice(0, limit);
        }
        setTransactions(txns);
      } catch (err: unknown) {
        console.error("Failed to fetch transactions", err);
        setError("Failed to load your transaction history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [limit]);

  const getStatusColor = (status: Transaction["status"]) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20";
      case "failed":
        return "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20";
      case "init":
        return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700";
    }
  };

  const getTypeIcon = (type: Transaction["type"]) => {
    if (type === "credit") return "lucide:arrow-down-left";
    return "lucide:arrow-up-right";
  };

  const getAmountColor = (status: Transaction["status"]) => {
    switch (status) {
      case "success":
        return "text-emerald-600 dark:text-emerald-400";
      case "failed":
        return "text-rose-600 dark:text-rose-400";
      case "pending":
        return "text-amber-600 dark:text-amber-400";
      case "init":
        return "text-blue-600 dark:text-blue-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getTypeColor = (
    type: Transaction["type"],
    status: Transaction["status"],
  ) => {
    if (status === "failed")
      return "text-rose-500 bg-rose-50 dark:bg-rose-500/10";
    if (status === "pending")
      return "text-amber-500 bg-amber-50 dark:bg-amber-500/10";
    if (status === "init")
      return "text-blue-500 bg-blue-50 dark:bg-blue-500/10";

    if (type === "credit" || type === "CREDIT")
      return "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10";
    return "text-rose-500 bg-rose-50 dark:bg-rose-500/10";
  };
  return (
    <div className="w-full">
      {showTitle && (
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">
            Recent Transactions
          </h2>
        </div>
      )}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden transition-colors">
        {loading ? (
          <div className="p-8 text-center text-gray-400">
            <Iconify
              icon="lucide:loader-2"
              className="animate-spin text-3xl mx-auto mb-3 text-blue-500"
            />
            <p>Loading transactions...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            <Iconify
              icon="lucide:alert-circle"
              className="text-3xl mx-auto mb-3"
            />
            <p>{error}</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Iconify
                icon="lucide:receipt"
                className="text-2xl text-gray-400 dark:text-gray-500"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              No transactions yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Your wallet history will appear here once you make a transaction.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-white/5">
                  <th className="py-4 px-3 sm:px-6 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                    Transaction
                  </th>
                  <th className="py-4 px-3 sm:px-6 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="py-4 px-3 sm:px-6 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-4 px-3 sm:px-6 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {transactions.map((txn) => (
                  <tr
                    key={txn.id}
                    className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 px-3 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(
                            txn.type,
                            txn.status,
                          )}`}
                        >
                          <Iconify
                            icon={getTypeIcon(txn.type)}
                            className="text-lg sm:text-xl"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {txn.type === "credit" || txn.type === "CREDIT"
                              ? "Top-up"
                              : "Service"}
                          </p>
                          <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate max-w-[80px] sm:max-w-[200px]">
                            {txn.referenceId}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-3 sm:px-6 whitespace-nowrap">
                      <span
                        className={`text-sm font-bold ${getAmountColor(txn.status)}`}
                      >
                        {txn.type === "credit" || txn.type === "CREDIT"
                          ? "+"
                          : "-"}
                        ₹
                        {typeof txn.amount === "number"
                          ? txn.amount.toLocaleString("en-IN")
                          : txn.amount}
                      </span>
                    </td>
                    <td className="py-4 px-3 sm:px-6">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold border whitespace-nowrap ${getStatusColor(
                          txn.status,
                        )}`}
                      >
                        {txn.status}
                      </span>
                    </td>
                    <td className="py-4 px-3 sm:px-6 min-w-[100px]">
                      <div className="text-sm text-gray-600 dark:text-slate-300">
                        {new Date(txn.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {new Date(txn.createdAt).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
