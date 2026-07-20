"use client";

import { DollarSign, RotateCcw, CheckCircle, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { ReturnsSummary } from "@/types/return";

interface ReturnSummaryProps {
  summary: ReturnsSummary;
}

export function ReturnSummaryCard({ summary }: ReturnSummaryProps) {
  const cards = [
    {
      label: "Total Returns",
      value: summary.totalReturns,
      icon: RotateCcw,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Total Refund",
      value: formatCurrency(summary.totalRefundAmount),
      icon: DollarSign,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      label: "Pending",
      value: summary.pendingReturns,
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      label: "Completed",
      value: summary.completedReturns,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-gray-200 bg-white p-4"
        >
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.bg}`}>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className="text-lg font-semibold text-gray-900">{card.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
