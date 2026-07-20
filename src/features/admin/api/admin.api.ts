import { get, patch } from "@/core/api-client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { buildQueryString } from "@/lib/query-string";
import type {
  PlatformDashboard,
  AdminStore,
  AdminUser,
  AdminSubscription,
  ActivityLogItem,
  SystemStats,
  AdminPaginatedResult,
  AdminQueryParams,
  UpdateStoreStatusInput,
  UpdateUserStatusInput,
  UpdateSubscriptionInput,
} from "../types/admin";

export async function getAdminDashboard(): Promise<PlatformDashboard> {
  return get<PlatformDashboard>(`${API_ENDPOINTS.V1.ADMIN}/dashboard`);
}

export async function getAdminStores(
  params: AdminQueryParams = {}
): Promise<AdminPaginatedResult<AdminStore>> {
  const query = buildQueryString(params);
  return get<AdminPaginatedResult<AdminStore>>(
    `${API_ENDPOINTS.V1.ADMIN}/stores${query}`
  );
}

export async function getAdminStore(id: string): Promise<AdminStore> {
  return get<AdminStore>(`${API_ENDPOINTS.V1.ADMIN}/stores/${id}`);
}

export async function updateStoreStatus(
  id: string,
  input: UpdateStoreStatusInput
): Promise<void> {
  return patch<void>(`${API_ENDPOINTS.V1.ADMIN}/stores/${id}/status`, input);
}

export async function getAdminUsers(
  params: AdminQueryParams = {}
): Promise<AdminPaginatedResult<AdminUser>> {
  const query = buildQueryString(params);
  return get<AdminPaginatedResult<AdminUser>>(
    `${API_ENDPOINTS.V1.ADMIN}/users${query}`
  );
}

export async function updateUserStatus(
  id: string,
  input: UpdateUserStatusInput
): Promise<void> {
  return patch<void>(`${API_ENDPOINTS.V1.ADMIN}/users/${id}/status`, input);
}

export async function getAdminSubscriptions(
  params: AdminQueryParams = {}
): Promise<AdminPaginatedResult<AdminSubscription>> {
  const query = buildQueryString(params);
  return get<AdminPaginatedResult<AdminSubscription>>(
    `${API_ENDPOINTS.V1.ADMIN}/subscriptions${query}`
  );
}

export async function updateAdminSubscription(
  id: string,
  input: UpdateSubscriptionInput
): Promise<void> {
  return patch<void>(`${API_ENDPOINTS.V1.ADMIN}/subscriptions/${id}`, input);
}

export async function getSystemStats(): Promise<SystemStats> {
  return get<SystemStats>(`${API_ENDPOINTS.V1.ADMIN}/system`);
}

export async function getAdminActivityLogs(
  params: AdminQueryParams = {}
): Promise<AdminPaginatedResult<ActivityLogItem>> {
  const query = buildQueryString(params);
  return get<AdminPaginatedResult<ActivityLogItem>>(
    `${API_ENDPOINTS.V1.ADMIN}/activity${query}`
  );
}
