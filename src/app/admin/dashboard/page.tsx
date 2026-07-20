"use client";

import { useAuth } from "@/providers/auth-provider";
import { useAdminDashboard } from "@/features/admin/hooks/useAdmin";
import { PlatformStats } from "@/features/admin/components/PlatformStats";
import { ErrorPage } from "@/components/common/ErrorPage";
import { Loader } from "@/components/common/Loader";
import { Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { formatDate } from "@/lib/utils";

export default function AdminDashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { data, isLoading, error } = useAdminDashboard();

  useEffect(() => {
    if (!authLoading && user && user.role !== "super_admin") {
      router.push("/dashboard");
    }
  }, [authLoading, user, router]);

  if (authLoading || isLoading) return <Loader />;
  if (user?.role !== "super_admin") return null;

  if (error) {
    return <ErrorPage title="Failed to load dashboard" message="Could not fetch platform data." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Platform overview and statistics.</p>
        </div>
      </div>

      {data && <PlatformStats data={data} />}

      {data?.recentActivity && data.recentActivity.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Recent Activity</h3>
          <div className="space-y-3">
            {data.recentActivity.map((log) => (
              <div
                key={log._id}
                className="flex items-center justify-between rounded-lg border border-gray-100 p-3"
              >
                <div>
                  <p className="text-sm text-gray-900">{log.description}</p>
                  <p className="text-xs text-gray-500">
                    {log.action} &middot; {log.module}
                  </p>
                </div>
                <span className="text-xs text-gray-400">
                  {formatDate(log.createdAt)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
