import { post, get, patch, del } from "@/core/api-client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { buildQueryString } from "@/lib/query-string";
import type {
  Return,
  CreateReturnInput,
  UpdateReturnInput,
  ReturnQueryParams,
  ReturnsSummary,
} from "@/types/return";
import type { PaginatedData } from "@/types/api";

export async function getReturnList(params: ReturnQueryParams = {}): Promise<PaginatedData<Return>> {
  const query = buildQueryString(params);
  return get<PaginatedData<Return>>(`${API_ENDPOINTS.V1.RETURNS}${query}`);
}

export async function getReturnById(id: string): Promise<Return> {
  return get<Return>(`${API_ENDPOINTS.V1.RETURNS}/${id}`);
}

export async function createReturn(input: CreateReturnInput): Promise<Return> {
  return post<Return>(API_ENDPOINTS.V1.RETURNS, input);
}

export async function updateReturn(id: string, input: UpdateReturnInput): Promise<Return> {
  return patch<Return>(`${API_ENDPOINTS.V1.RETURNS}/${id}`, input);
}

export async function deleteReturn(id: string): Promise<void> {
  return del<void>(`${API_ENDPOINTS.V1.RETURNS}/${id}`);
}

export async function getReturnsByInvoiceNumber(invoiceNumber: string): Promise<Return[]> {
  return get<Return[]>(`${API_ENDPOINTS.V1.RETURNS}/invoice/${invoiceNumber}`);
}

export async function getReturnsSummary(): Promise<ReturnsSummary> {
  return get<ReturnsSummary>(`${API_ENDPOINTS.V1.RETURNS}/summary`);
}
