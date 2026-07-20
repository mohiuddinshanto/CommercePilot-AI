import { get } from "@/core/api-client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { buildQueryString } from "@/lib/query-string";
import type {
  DashboardSummary,
  SalesReport,
  TopProduct,
  TopCategory,
  TopCustomer,
  BestCashier,
  SalesByPaymentMethod,
  InventoryValue,
  LowStockProduct,
  DeadStockProduct,
  ProfitReport,
  MostReturnedProduct,
  ReportQueryParams,
} from "@/types/report";

export async function getDashboardSummary(): Promise<DashboardSummary> {
  return get<DashboardSummary>(`${API_ENDPOINTS.V1.REPORTS}/dashboard-summary`);
}

export async function getSalesReport(params: ReportQueryParams = {}): Promise<SalesReport> {
  const query = buildQueryString(params);
  return get<SalesReport>(`${API_ENDPOINTS.V1.REPORTS}/sales${query}`);
}

export async function getTopProducts(params: ReportQueryParams = {}): Promise<TopProduct[]> {
  const query = buildQueryString(params);
  return get<TopProduct[]>(`${API_ENDPOINTS.V1.REPORTS}/top-products${query}`);
}

export async function getTopCategories(params: ReportQueryParams = {}): Promise<TopCategory[]> {
  const query = buildQueryString(params);
  return get<TopCategory[]>(`${API_ENDPOINTS.V1.REPORTS}/top-categories${query}`);
}

export async function getTopCustomers(params: ReportQueryParams = {}): Promise<TopCustomer[]> {
  const query = buildQueryString(params);
  return get<TopCustomer[]>(`${API_ENDPOINTS.V1.REPORTS}/top-customers${query}`);
}

export async function getBestCashiers(params: ReportQueryParams = {}): Promise<BestCashier[]> {
  const query = buildQueryString(params);
  return get<BestCashier[]>(`${API_ENDPOINTS.V1.REPORTS}/best-cashiers${query}`);
}

export async function getSalesByPaymentMethod(params: ReportQueryParams = {}): Promise<SalesByPaymentMethod[]> {
  const query = buildQueryString(params);
  return get<SalesByPaymentMethod[]>(`${API_ENDPOINTS.V1.REPORTS}/sales-by-payment-method${query}`);
}

export async function getSalesByDay(params: ReportQueryParams = {}): Promise<SalesReport["dailyBreakdown"]> {
  const query = buildQueryString(params);
  return get<SalesReport["dailyBreakdown"]>(`${API_ENDPOINTS.V1.REPORTS}/sales-by-day${query}`);
}

export async function getSalesByMonth(params: ReportQueryParams = {}): Promise<SalesReport["dailyBreakdown"]> {
  const query = buildQueryString(params);
  return get<SalesReport["dailyBreakdown"]>(`${API_ENDPOINTS.V1.REPORTS}/sales-by-month${query}`);
}

export async function getInventoryValue(): Promise<InventoryValue> {
  return get<InventoryValue>(`${API_ENDPOINTS.V1.REPORTS}/inventory-value`);
}

export async function getLowStockProducts(params: ReportQueryParams = {}): Promise<LowStockProduct[]> {
  const query = buildQueryString(params);
  return get<LowStockProduct[]>(`${API_ENDPOINTS.V1.REPORTS}/low-stock${query}`);
}

export async function getDeadStockProducts(params: ReportQueryParams = {}): Promise<DeadStockProduct[]> {
  const query = buildQueryString(params);
  return get<DeadStockProduct[]>(`${API_ENDPOINTS.V1.REPORTS}/dead-stock${query}`);
}

export async function getProfitReport(params: ReportQueryParams = {}): Promise<ProfitReport> {
  const query = buildQueryString(params);
  return get<ProfitReport>(`${API_ENDPOINTS.V1.REPORTS}/profit${query}`);
}

export async function getMostReturnedProducts(params: ReportQueryParams = {}): Promise<MostReturnedProduct[]> {
  const query = buildQueryString(params);
  return get<MostReturnedProduct[]>(`${API_ENDPOINTS.V1.REPORTS}/most-returned${query}`);
}
