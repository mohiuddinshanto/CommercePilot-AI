"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminDashboard,
  getAdminStores,
  getAdminStore,
  updateStoreStatus,
  getAdminUsers,
  updateUserStatus,
  getAdminSubscriptions,
  updateAdminSubscription,
  getSystemStats,
  getAdminActivityLogs,
} from "../api/admin.api";
import type {
  AdminQueryParams,
  UpdateStoreStatusInput,
  UpdateUserStatusInput,
  UpdateSubscriptionInput,
} from "../types/admin";

const ADMIN_DASHBOARD_KEY = ["admin", "dashboard"];
const ADMIN_STORES_KEY = ["admin", "stores"];
const ADMIN_USERS_KEY = ["admin", "users"];
const ADMIN_SUBSCRIPTIONS_KEY = ["admin", "subscriptions"];
const ADMIN_SYSTEM_KEY = ["admin", "system"];
const ADMIN_ACTIVITY_KEY = ["admin", "activity"];

export function useAdminDashboard() {
  return useQuery({
    queryKey: ADMIN_DASHBOARD_KEY,
    queryFn: getAdminDashboard,
  });
}

export function useAdminStores(params: AdminQueryParams = {}) {
  return useQuery({
    queryKey: [...ADMIN_STORES_KEY, params],
    queryFn: () => getAdminStores(params),
  });
}

export function useAdminStore(id: string) {
  return useQuery({
    queryKey: [...ADMIN_STORES_KEY, id],
    queryFn: () => getAdminStore(id),
    enabled: !!id,
  });
}

export function useUpdateStoreStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateStoreStatusInput }) =>
      updateStoreStatus(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_STORES_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_KEY });
    },
  });
}

export function useAdminUsers(params: AdminQueryParams = {}) {
  return useQuery({
    queryKey: [...ADMIN_USERS_KEY, params],
    queryFn: () => getAdminUsers(params),
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateUserStatusInput }) =>
      updateUserStatus(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_KEY });
    },
  });
}

export function useAdminSubscriptions(params: AdminQueryParams = {}) {
  return useQuery({
    queryKey: [...ADMIN_SUBSCRIPTIONS_KEY, params],
    queryFn: () => getAdminSubscriptions(params),
  });
}

export function useUpdateAdminSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: UpdateSubscriptionInput;
    }) => updateAdminSubscription(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_SUBSCRIPTIONS_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_KEY });
    },
  });
}

export function useSystemStats() {
  return useQuery({
    queryKey: ADMIN_SYSTEM_KEY,
    queryFn: getSystemStats,
  });
}

export function useAdminActivityLogs(params: AdminQueryParams = {}) {
  return useQuery({
    queryKey: [...ADMIN_ACTIVITY_KEY, params],
    queryFn: () => getAdminActivityLogs(params),
  });
}
