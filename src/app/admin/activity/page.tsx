"use client";

import { useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { useAdminActivityLogs } from "@/features/admin/hooks/useAdmin";
import { ActivityLogTable } from "@/features/admin/components/ActivityLogTable";
import { ErrorPage } from "@/components/common/ErrorPage";
import { Loader } from "@/components/common/Loader";
import { Shield, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ACTION_OPTIONS = [
  { value: "", label: "All Actions" },
  { value: "store.created", label: "Store Created" },
  { value: "store.approved", label: "Store Approved" },
  { value: "store.rejected", label: "Store Rejected" },
  { value: "store.suspended", label: "Store Suspended" },
  { value: "user.registered", label: "User Registered" },
  { value: "user.approved", label: "User Approved" },
  { value: "user.rejected", label: "User Rejected" },
  { value: "user.suspended", label: "User Suspended" },
  { value: "subscription.updated", label: "Subscription Updated" },
];

export default function AdminActivityPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState("");

  const { data, isLoading, error } = useAdminActivityLogs({
    page,
    limit: 20,
    action: actionFilter || undefined,
  });

  useEffect(() => {
    if (!authLoading && user && user.role !== "super_admin") {
      router.push("/dashboard");
    }
  }, [authLoading, user, router]);

  if (authLoading || isLoading) return <Loader />;
  if (user?.role !== "super_admin") return null;

  if (error) {
    return <ErrorPage title="Failed to load activity logs" message="Could not fetch activity logs." />;
  }

  const items = data?.items || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>
          <p className="text-sm text-gray-500">Platform-wide activity history.</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <select
          value={actionFilter}
          onChange={(e) => {
            setActionFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {ACTION_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <ActivityLogTable items={items} />

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
