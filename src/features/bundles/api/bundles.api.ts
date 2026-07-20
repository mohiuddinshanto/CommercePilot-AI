import { post, get, patch, del } from "@/core/api-client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { buildQueryString } from "@/lib/query-string";
import type {
  Bundle,
  CreateBundleInput,
  UpdateBundleInput,
  BundleQueryParams,
  BundleStock,
} from "@/types/bundle";
import type { PaginatedData } from "@/types/api";

export async function getBundleList(params: BundleQueryParams = {}): Promise<PaginatedData<Bundle>> {
  const query = buildQueryString(params);
  return get<PaginatedData<Bundle>>(`${API_ENDPOINTS.V1.BUNDLES}${query}`);
}

export async function getBundleById(id: string): Promise<Bundle> {
  return get<Bundle>(`${API_ENDPOINTS.V1.BUNDLES}/${id}`);
}

export async function createBundle(input: CreateBundleInput): Promise<Bundle> {
  return post<Bundle>(API_ENDPOINTS.V1.BUNDLES, input);
}

export async function updateBundle(id: string, input: UpdateBundleInput): Promise<Bundle> {
  return patch<Bundle>(`${API_ENDPOINTS.V1.BUNDLES}/${id}`, input);
}

export async function deleteBundle(id: string): Promise<void> {
  return del<void>(`${API_ENDPOINTS.V1.BUNDLES}/${id}`);
}

export async function getBundleStock(id: string): Promise<BundleStock> {
  return get<BundleStock>(`${API_ENDPOINTS.V1.BUNDLES}/${id}/stock`);
}
