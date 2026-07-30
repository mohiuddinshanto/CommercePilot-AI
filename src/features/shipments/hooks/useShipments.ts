"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getShipmentList,
  getShipmentById,
  getShipmentsBySaleId,
  createShipment,
  updateShipment,
  deleteShipment,
} from "../api/shipments.api";
import type {
  ShipmentQueryParams,
  CreateShipmentInput,
  UpdateShipmentInput,
} from "@/types/shipment";

export function useShipmentList(params: ShipmentQueryParams = {}) {
  return useQuery({
    queryKey: ["shipments", params],
    queryFn: () => getShipmentList(params),
  });
}

export function useShipment(id: string) {
  return useQuery({
    queryKey: ["shipments", id],
    queryFn: () => getShipmentById(id),
    enabled: !!id,
  });
}

export function useShipmentsBySale(saleId: string) {
  return useQuery({
    queryKey: ["shipments", "sale", saleId],
    queryFn: () => getShipmentsBySaleId(saleId),
    enabled: !!saleId,
  });
}

export function useCreateShipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateShipmentInput) => createShipment(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
    },
  });
}

export function useUpdateShipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateShipmentInput }) =>
      updateShipment(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
    },
  });
}

export function useDeleteShipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteShipment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
    },
  });
}
