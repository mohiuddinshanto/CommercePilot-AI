"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardSummary, getRecentActivities } from "../api/dashboard.api";

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: getDashboardSummary,
  });
}

export function useRecentActivities() {
  return useQuery({
    queryKey: ["dashboard", "activities"],
    queryFn: getRecentActivities,
  });
}
