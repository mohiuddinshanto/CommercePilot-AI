"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBundleList,
  getBundleById,
  createBundle,
  updateBundle,
  deleteBundle,
  getBundleStock,
} from "../api/bundles.api";
import type {
  BundleQueryParams,
  CreateBundleInput,
  UpdateBundleInput,
} from "@/types/bundle";

export function useBundleList(params: BundleQueryParams = {}) {
  return useQuery({
    queryKey: ["bundles", params],
    queryFn: () => getBundleList(params),
  });
}

export function useBundle(id: string) {
  return useQuery({
    queryKey: ["bundles", id],
    queryFn: () => getBundleById(id),
    enabled: !!id,
  });
}

export function useBundleStock(id: string) {
  return useQuery({
    queryKey: ["bundles", id, "stock"],
    queryFn: () => getBundleStock(id),
    enabled: !!id,
  });
}

export function useCreateBundle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateBundleInput) => createBundle(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bundles"] });
    },
  });
}

export function useUpdateBundle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateBundleInput }) =>
      updateBundle(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bundles"] });
    },
  });
}

export function useDeleteBundle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteBundle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bundles"] });
    },
  });
}
