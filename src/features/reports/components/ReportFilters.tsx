"use client";

import { useState } from "react";
import type { ReportQueryParams } from "@/types/report";
import { Calendar } from "lucide-react";

const PERIODS = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "thisWeek", label: "This Week" },
  { value: "lastWeek", label: "Last Week" },
  { value: "thisMonth", label: "This Month" },
  { value: "lastMonth", label: "Last Month" },
  { value: "thisYear", label: "This Year" },
  { value: "lastYear", label: "Last Year" },
  { value: "custom", label: "Custom Range" },
] as const;

interface ReportFiltersProps {
  params: ReportQueryParams;
  onChange: (params: ReportQueryParams) => void;
}

export function ReportFilters({ params, onChange }: ReportFiltersProps) {
  const [showCustom, setShowCustom] = useState(params.period === "custom");

  const handlePeriodChange = (period: string) => {
    if (period === "custom") {
      setShowCustom(true);
      onChange({ ...params, period: "custom" });
    } else {
      setShowCustom(false);
      onChange({ period: period as ReportQueryParams["period"] });
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Period:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => handlePeriodChange(p.value)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                params.period === p.value || (!params.period && p.value === "thisMonth")
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {showCustom && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={params.startDate || ""}
              onChange={(e) =>
                onChange({ ...params, startDate: e.target.value })
              }
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-500">to</span>
            <input
              type="date"
              value={params.endDate || ""}
              onChange={(e) =>
                onChange({ ...params, endDate: e.target.value })
              }
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        )}
      </div>
    </div>
  );
}
