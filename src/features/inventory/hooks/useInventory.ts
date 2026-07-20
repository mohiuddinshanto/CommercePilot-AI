"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getInventoryList,
  getInventoryById,
  createInventory,
  updateInventory,
  deleteInventory,
  stockInInventory,
  stockOutInventory,
  adjustInventory,
  getInventoryMovements,
} from "../api/inventory.api";
import type {
  InventoryQueryParams,
  CreateInventoryInput,
  UpdateInventoryInput,
  StockMovementInput,
} from "@/types/inventory";

export function useInventoryList(params: InventoryQueryParams = {}) {
  return useQuery({
    queryKey: ["inventory", params],
    queryFn: () => getInventoryList(params),
  });
}

export function useInventory(id: string) {
  return useQuery({
    queryKey: ["inventory", id],
    queryFn: () => getInventoryById(id),
    enabled: !!id,
  });
}

export function useInventoryMovements(id: string) {
  return useQuery({
    queryKey: ["inventory", id, "movements"],
    queryFn: () => getInventoryMovements(id),
    enabled: !!id,
  });
}

export function useCreateInventory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateInventoryInput) => createInventory(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
}

export function useUpdateInventory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateInventoryInput }) =>
      updateInventory(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
}

export function useDeleteInventory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteInventory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
}

export function useStockIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: StockMovementInput }) =>
      stockInInventory(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
}

export function useStockOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: StockMovementInput }) =>
      stockOutInventory(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
}

export function useAdjustStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: StockMovementInput }) =>
      adjustInventory(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
}
