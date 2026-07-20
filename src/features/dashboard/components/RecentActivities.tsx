"use client";

import { formatDateTime } from "@/lib/utils";
import type { ActivityLog } from "@/types/dashboard";
import { Activity } from "lucide-react";

function getActionColor(action: string): string {
  switch (action) {
    case "LOGIN":
    case "REGISTER":
      return "bg-green-100 text-green-800";
    case "LOGOUT":
      return "bg-gray-100 text-gray-800";
    case "CREATE_PRODUCT":
    case "CREATE_SALE":
    case "CREATE_STORE":
      return "bg-blue-100 text-blue-800";
    case "DELETE_PRODUCT":
    case "DELETE_STAFF":
      return "bg-red-100 text-red-800";
    case "STORE_APPROVED":
      return "bg-green-100 text-green-800";
    case "STORE_REJECTED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function RecentActivities({ activities }: { activities: ActivityLog[] }) {
  if (activities.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Recent Activities
        </h3>
        <div className="mt-8 flex flex-col items-center gap-2 text-gray-400">
          <Activity className="h-10 w-10" />
          <p className="text-sm">No recent activities</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="text-lg font-semibold text-gray-900">
        Recent Activities
      </h3>
      <div className="mt-4 space-y-3">
        {activities.map((log) => (
          <div
            key={log._id}
            className="flex items-start justify-between gap-4 rounded-lg border border-gray-100 p-3"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-700">{log.description}</p>
              <p className="mt-0.5 text-xs text-gray-400">
                {log.module}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getActionColor(log.action)}`}
              >
                {log.action}
              </span>
              <span className="text-xs text-gray-400">
                {formatDateTime(log.createdAt)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RecentActivitiesSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
      <div className="mt-4 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 animate-pulse rounded-lg bg-gray-100" />
        ))}
      </div>
    </div>
  );
}
