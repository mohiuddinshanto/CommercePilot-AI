"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getDashboardSummary as getReportsDashboardSummary,
  getSalesReport,
  getTopProducts,
  getTopCategories,
  getTopCustomers,
  getBestCashiers,
  getSalesByPaymentMethod,
  getSalesByDay,
  getSalesByMonth,
  getInventoryValue,
  getLowStockProducts,
  getDeadStockProducts,
  getProfitReport,
  getMostReturnedProducts,
} from "../api/reports.api";
import type { ReportQueryParams } from "@/types/report";

export function useReportsDashboardSummary() {
  return useQuery({
    queryKey: ["reports", "dashboard-summary"],
    queryFn: getReportsDashboardSummary,
  });
}

export function useSalesReport(params: ReportQueryParams = {}) {
  return useQuery({
    queryKey: ["reports", "sales", params],
    queryFn: () => getSalesReport(params),
  });
}

export function useTopProducts(params: ReportQueryParams = {}) {
  return useQuery({
    queryKey: ["reports", "top-products", params],
    queryFn: () => getTopProducts(params),
  });
}

export function useTopCategories(params: ReportQueryParams = {}) {
  return useQuery({
    queryKey: ["reports", "top-categories", params],
    queryFn: () => getTopCategories(params),
  });
}

export function useTopCustomers(params: ReportQueryParams = {}) {
  return useQuery({
    queryKey: ["reports", "top-customers", params],
    queryFn: () => getTopCustomers(params),
  });
}

export function useBestCashiers(params: ReportQueryParams = {}) {
  return useQuery({
    queryKey: ["reports", "best-cashiers", params],
    queryFn: () => getBestCashiers(params),
  });
}

export function useSalesByPaymentMethod(params: ReportQueryParams = {}) {
  return useQuery({
    queryKey: ["reports", "sales-by-payment-method", params],
    queryFn: () => getSalesByPaymentMethod(params),
  });
}

export function useSalesByDay(params: ReportQueryParams = {}) {
  return useQuery({
    queryKey: ["reports", "sales-by-day", params],
    queryFn: () => getSalesByDay(params),
  });
}

export function useSalesByMonth(params: ReportQueryParams = {}) {
  return useQuery({
    queryKey: ["reports", "sales-by-month", params],
    queryFn: () => getSalesByMonth(params),
  });
}

export function useInventoryValue() {
  return useQuery({
    queryKey: ["reports", "inventory-value"],
    queryFn: getInventoryValue,
  });
}

export function useLowStockProducts(params: ReportQueryParams = {}) {
  return useQuery({
    queryKey: ["reports", "low-stock", params],
    queryFn: () => getLowStockProducts(params),
  });
}

export function useDeadStockProducts(params: ReportQueryParams = {}) {
  return useQuery({
    queryKey: ["reports", "dead-stock", params],
    queryFn: () => getDeadStockProducts(params),
  });
}

export function useProfitReport(params: ReportQueryParams = {}) {
  return useQuery({
    queryKey: ["reports", "profit", params],
    queryFn: () => getProfitReport(params),
  });
}

export function useMostReturnedProducts(params: ReportQueryParams = {}) {
  return useQuery({
    queryKey: ["reports", "most-returned", params],
    queryFn: () => getMostReturnedProducts(params),
  });
}
