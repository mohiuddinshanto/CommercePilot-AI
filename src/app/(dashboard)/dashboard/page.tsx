"use client";

import { useAuth } from "@/providers/auth-provider";
import { useDashboardSummary, useRecentActivities } from "@/features/dashboard/hooks/useDashboard";
import { DashboardCards, DashboardCardsSkeleton } from "@/features/dashboard/components/DashboardCards";
import { RecentActivities, RecentActivitiesSkeleton } from "@/features/dashboard/components/RecentActivities";
import { ErrorPage } from "@/components/common/ErrorPage";
import { Shield, Store } from "lucide-react";

function SuperAdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">
            Welcome back, {user?.name}. Manage the platform from here.
          </p>
        </div>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900">Platform Overview</h3>
        <p className="mt-2 text-sm text-gray-500">
          Admin dashboard for managing all stores, users, and platform settings.
          More features coming in later phases.
        </p>
      </div>
    </div>
  );
}

function StoreDashboard() {
  const { user } = useAuth();
  const { data: summary, isLoading: summaryLoading, error: summaryError } = useDashboardSummary();
  const { data: activitiesData, isLoading: activitiesLoading } = useRecentActivities();

  if (summaryError) {
    return <ErrorPage title="Failed to load dashboard" message="Could not fetch dashboard data." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Store className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">
            Welcome back, {user?.name}. Here is your store overview.
          </p>
        </div>
      </div>

      {summaryLoading ? (
        <DashboardCardsSkeleton />
      ) : summary ? (
        <DashboardCards data={summary} />
      ) : null}

      {activitiesLoading ? (
        <RecentActivitiesSkeleton />
      ) : (
        <RecentActivities activities={activitiesData?.items || []} />
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();

  if (user?.role === "super_admin") {
    return <SuperAdminDashboard />;
  }

  return <StoreDashboard />;
}
