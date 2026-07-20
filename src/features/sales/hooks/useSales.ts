"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSaleList,
  getSaleById,
  createSale,
  updateSale,
  deleteSale,
  getTodaySales,
  getSalesSummary,
  getSaleByInvoiceNumber,
} from "../api/sales.api";
import type {
  SaleQueryParams,
  CreateSaleInput,
  UpdateSaleInput,
} from "@/types/sale";

export function useSaleList(params: SaleQueryParams = {}) {
  return useQuery({
    queryKey: ["sales", params],
    queryFn: () => getSaleList(params),
  });
}

export function useSale(id: string) {
  return useQuery({
    queryKey: ["sales", id],
    queryFn: () => getSaleById(id),
    enabled: !!id,
  });
}

export function useTodaySales() {
  return useQuery({
    queryKey: ["sales", "today"],
    queryFn: () => getTodaySales(),
  });
}

export function useSalesSummary() {
  return useQuery({
    queryKey: ["sales", "summary"],
    queryFn: () => getSalesSummary(),
  });
}

export function useSaleByInvoice(invoiceNumber: string) {
  return useQuery({
    queryKey: ["sales", "invoice", invoiceNumber],
    queryFn: () => getSaleByInvoiceNumber(invoiceNumber),
    enabled: !!invoiceNumber,
  });
}

export function useCreateSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateSaleInput) => createSale(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
  });
}

export function useUpdateSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateSaleInput }) =>
      updateSale(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
  });
}

export function useDeleteSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSale(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
  });
}
