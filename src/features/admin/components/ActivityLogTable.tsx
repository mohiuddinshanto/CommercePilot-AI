"use client";

import { formatDateTime } from "@/lib/utils";
import type { ActivityLogItem } from "../types/admin";

interface ActivityLogTableProps {
  items: ActivityLogItem[];
}

function getActionBadge(action: string) {
  if (action.includes("APPROVED") || action.includes("ACTIVATED") || action.includes("CREATED") || action.includes("LOGIN")) {
    return "bg-green-100 text-green-800";
  }
  if (action.includes("REJECTED") || action.includes("SUSPENDED") || action.includes("DELETED") || action.includes("CANCELLED")) {
    return "bg-red-100 text-red-800";
  }
  if (action.includes("UPDATED") || action.includes("MODIFIED")) {
    return "bg-blue-100 text-blue-800";
  }
  return "bg-gray-100 text-gray-800";
}

export function ActivityLogTable({ items }: ActivityLogTableProps) {
  if (!items || items.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
        <p className="text-sm text-gray-500">No activity logs found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              User
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Action
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Module
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Date
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {items.map((log) => (
            <tr key={log._id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-6 py-4">
                <p className="text-sm font-medium text-gray-900">
                  {log.userName || "System"}
                </p>
                <p className="text-xs text-gray-500">{log.userId}</p>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getActionBadge(
                    log.action
                  )}`}
                >
                  {log.action}
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700 capitalize">
                {log.module}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                {log.description}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {formatDateTime(log.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
