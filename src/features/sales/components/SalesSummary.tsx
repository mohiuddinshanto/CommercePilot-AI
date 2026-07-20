"use client";

import { DollarSign, TrendingUp, Receipt, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { SalesSummary } from "@/types/sale";

interface SalesSummaryProps {
  summary: SalesSummary;
}

export function SalesSummaryCard({ summary }: SalesSummaryProps) {
  const cards = [
    {
      label: "Total Sales",
      value: summary.totalSales,
      icon: Receipt,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(summary.totalRevenue),
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Total Paid",
      value: formatCurrency(summary.totalPaid),
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Total Due",
      value: formatCurrency(summary.totalDue),
      icon: AlertCircle,
      color: "text-red-600",
      bg: "bg-red-50",
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
