"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getReturnList,
  getReturnById,
  createReturn,
  updateReturn,
  deleteReturn,
  getReturnsByInvoiceNumber,
  getReturnsSummary,
} from "../api/returns.api";
import type {
  ReturnQueryParams,
  CreateReturnInput,
  UpdateReturnInput,
} from "@/types/return";

export function useReturnList(params: ReturnQueryParams = {}) {
  return useQuery({
    queryKey: ["returns", params],
    queryFn: () => getReturnList(params),
  });
}

export function useReturn(id: string) {
  return useQuery({
    queryKey: ["returns", id],
    queryFn: () => getReturnById(id),
    enabled: !!id,
  });
}

export function useReturnsByInvoice(invoiceNumber: string) {
  return useQuery({
    queryKey: ["returns", "invoice", invoiceNumber],
    queryFn: () => getReturnsByInvoiceNumber(invoiceNumber),
    enabled: !!invoiceNumber,
  });
}

export function useReturnsSummary() {
  return useQuery({
    queryKey: ["returns", "summary"],
    queryFn: () => getReturnsSummary(),
  });
}

export function useCreateReturn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateReturnInput) => createReturn(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["returns"] });
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
  });
}

export function useUpdateReturn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateReturnInput }) =>
      updateReturn(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["returns"] });
    },
  });
}

export function useDeleteReturn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteReturn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["returns"] });
    },
  });
}
