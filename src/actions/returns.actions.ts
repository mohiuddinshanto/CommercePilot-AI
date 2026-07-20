"use client";

import * as returnsApi from "@/features/returns/api/returns.api";
import type {
  CreateReturnInput,
  UpdateReturnInput,
  ReturnQueryParams,
} from "@/types/return";

export async function getReturnListAction(params: ReturnQueryParams = {}) {
  return returnsApi.getReturnList(params);
}

export async function getReturnAction(id: string) {
  return returnsApi.getReturnById(id);
}

export async function createReturnAction(input: CreateReturnInput) {
  return returnsApi.createReturn(input);
}

export async function updateReturnAction(id: string, input: UpdateReturnInput) {
  return returnsApi.updateReturn(id, input);
}

export async function deleteReturnAction(id: string) {
  return returnsApi.deleteReturn(id);
}

export async function getReturnsByInvoiceAction(invoiceNumber: string) {
  return returnsApi.getReturnsByInvoiceNumber(invoiceNumber);
}

export async function getReturnsSummaryAction() {
  return returnsApi.getReturnsSummary();
}
