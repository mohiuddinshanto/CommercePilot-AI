import { post, get, patch, del } from "@/core/api-client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { buildQueryString } from "@/lib/query-string";
import type {
  Sale,
  CreateSaleInput,
  UpdateSaleInput,
  SaleQueryParams,
  SalesSummary,
} from "@/types/sale";
import type { PaginatedData } from "@/types/api";

export async function getSaleList(params: SaleQueryParams = {}): Promise<PaginatedData<Sale>> {
  const query = buildQueryString(params);
  return get<PaginatedData<Sale>>(`${API_ENDPOINTS.V1.SALES}${query}`);
}

export async function getSaleById(id: string): Promise<Sale> {
  return get<Sale>(`${API_ENDPOINTS.V1.SALES}/${id}`);
}

export async function createSale(input: CreateSaleInput): Promise<Sale> {
  return post<Sale>(API_ENDPOINTS.V1.SALES, input);
}

export async function updateSale(id: string, input: UpdateSaleInput): Promise<Sale> {
  return patch<Sale>(`${API_ENDPOINTS.V1.SALES}/${id}`, input);
}

export async function deleteSale(id: string): Promise<void> {
  return del<void>(`${API_ENDPOINTS.V1.SALES}/${id}`);
}

export async function getSaleByInvoiceNumber(invoiceNumber: string): Promise<Sale> {
  return get<Sale>(`${API_ENDPOINTS.V1.SALES}/invoice/${invoiceNumber}`);
}

export async function getTodaySales(): Promise<Sale[]> {
  return get<Sale[]>(`${API_ENDPOINTS.V1.SALES}/today`);
}

export async function getSalesSummary(): Promise<SalesSummary> {
  return get<SalesSummary>(`${API_ENDPOINTS.V1.SALES}/summary`);
}
