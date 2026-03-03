"use client";

import { useEffect, useState } from "react";
import Iconify from "@/src/components/Iconify";
import api from "@/src/lib/api";

interface Transaction {
  id: string;
  referenceId: string;
  amount: number;
  type: "CREDIT" | "DEBIT";
  status: "INIT" | "PENDING" | "SUCCESS" | "FAILED";
  createdAt: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get("/api/wallet/history");
        setTransactions(data.data || []);
      } catch (err: any) {
        console.error("Failed to fetch transactions", err);
        setError("Failed to load your transaction history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const getStatusColor = (status: Transaction["status"]) => {
    switch (status) {
      case "SUCCESS":
        return "bg-green-100 text-green-700 border-green-200";
      case "FAILED":
        return "bg-red-100 text-red-700 border-red-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "INIT":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTypeIcon = (type: Transaction["type"]) => {
    if (type === "CREDIT") return "lucide:arrow-down-left";
    return "lucide:arrow-up-right";
  };

  const getTypeColor = (type: Transaction["type"]) => {
    if (type === "CREDIT") return "text-emerald-500 bg-emerald-50";
    return "text-rose-500 bg-rose-50";
  };

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

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Iconify
                icon="lucide:receipt"
                className="text-2xl text-gray-400"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              No transactions yet
            </h3>
            <p className="text-gray-500 text-sm">
              Your wallet history will appear here once you make a transaction.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Transaction
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((txn) => (
                  <tr
                    key={txn.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(
                            txn.type,
                          )}`}
                        >
                          <Iconify
                            icon={getTypeIcon(txn.type)}
                            className="text-xl"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {txn.type === "CREDIT"
                              ? "Wallet Top-up"
                              : "Service Deduction"}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5 max-w-[150px] sm:max-w-[200px] truncate">
                            Ref: {txn.referenceId}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-sm font-bold ${
                          txn.type === "CREDIT"
                            ? "text-emerald-600"
                            : "text-rose-600"
                        }`}
                      >
                        {txn.type === "CREDIT" ? "+" : "-"}₹
                        {typeof txn.amount === "number"
                          ? txn.amount.toLocaleString("en-IN")
                          : txn.amount}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          txn.status,
                        )}`}
                      >
                        {txn.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-600">
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
