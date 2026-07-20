"use client";

import * as salesApi from "@/features/sales/api/sales.api";
import type {
  CreateSaleInput,
  UpdateSaleInput,
  SaleQueryParams,
} from "@/types/sale";

export async function getSaleListAction(params: SaleQueryParams = {}) {
  return salesApi.getSaleList(params);
}

export async function getSaleAction(id: string) {
  return salesApi.getSaleById(id);
}

export async function createSaleAction(input: CreateSaleInput) {
  return salesApi.createSale(input);
}

export async function updateSaleAction(id: string, input: UpdateSaleInput) {
  return salesApi.updateSale(id, input);
}

export async function deleteSaleAction(id: string) {
  return salesApi.deleteSale(id);
}

export async function getTodaySalesAction() {
  return salesApi.getTodaySales();
}

export async function getSalesSummaryAction() {
  return salesApi.getSalesSummary();
}
