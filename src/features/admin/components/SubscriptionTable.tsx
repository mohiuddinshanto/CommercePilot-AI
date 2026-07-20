"use client";

import { formatDate, formatCurrency } from "@/lib/utils";
import { Settings } from "lucide-react";
import type { AdminSubscription } from "../types/admin";
import { PLAN_LABELS, STATUS_LABELS } from "../types/admin";

interface SubscriptionTableProps {
  items: AdminSubscription[];
  onUpdate: (sub: AdminSubscription) => void;
}

function getStatusBadge(status: string) {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "expired":
      return "bg-gray-100 text-gray-800";
    case "trialing":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function SubscriptionTable({ items, onUpdate }: SubscriptionTableProps) {
  if (!items || items.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
        <p className="text-sm text-gray-500">No subscriptions found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Store
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Plan
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Billing
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Expires
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {items.map((sub) => (
            <tr key={sub._id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-6 py-4">
                <p className="text-sm font-medium text-gray-900">
                  {sub.storeName || "Unknown Store"}
                </p>
                <p className="text-xs text-gray-500">{sub.storeId}</p>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <span className="text-sm text-gray-700">
                  {PLAN_LABELS[sub.plan] || sub.plan}
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusBadge(
                    sub.status
                  )}`}
                >
                  {STATUS_LABELS[sub.status] || sub.status}
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700 capitalize">
                {sub.billingCycle}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                {sub.price === 0 ? "Free" : formatCurrency(sub.price)}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {sub.expiresAt ? formatDate(sub.expiresAt) : "N/A"}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <button
                  onClick={() => onUpdate(sub)}
                  className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  title="Update Subscription"
                >
                  <Settings className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
