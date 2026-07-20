import { get } from "@/core/api-client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type { DashboardSummary, ActivityLog } from "@/types/dashboard";
import type { PaginatedData } from "@/types/api";

export async function getDashboardSummary(): Promise<DashboardSummary> {
  return get<DashboardSummary>(API_ENDPOINTS.V1.DASHBOARD_SUMMARY);
}

export async function getRecentActivities(): Promise<PaginatedData<ActivityLog>> {
  return get<PaginatedData<ActivityLog>>(API_ENDPOINTS.V1.DASHBOARD_ACTIVITIES);
}
