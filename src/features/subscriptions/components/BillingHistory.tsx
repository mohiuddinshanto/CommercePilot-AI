"use client";

import { formatDate, formatCurrency } from "@/lib/utils";
import { EmptyState } from "@/components/common/EmptyState";
import { Receipt } from "lucide-react";
import type { BillingRecord } from "../types/subscription";

interface BillingHistoryProps {
  records: BillingRecord[];
}

function getStatusBadge(status: string) {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "failed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function BillingHistory({ records }: BillingHistoryProps) {
  if (!records || records.length === 0) {
    return (
      <EmptyState
        title="No billing history"
        message="No billing records found for your account."
        icon={Receipt}
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Plan
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Period
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {records.map((record) => (
            <tr key={record.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                {formatDate(record.createdAt)}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 capitalize">
                {record.plan}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {formatDate(record.periodStart)} - {formatDate(record.periodEnd)}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                {formatCurrency(record.amount)}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusBadge(
                    record.status
                  )}`}
                >
                  {record.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
