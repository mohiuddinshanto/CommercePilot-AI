"use client";

import * as bundlesApi from "@/features/bundles/api/bundles.api";
import type {
  CreateBundleInput,
  UpdateBundleInput,
  BundleQueryParams,
} from "@/types/bundle";

export async function getBundleListAction(params: BundleQueryParams = {}) {
  return bundlesApi.getBundleList(params);
}

export async function getBundleAction(id: string) {
  return bundlesApi.getBundleById(id);
}

export async function createBundleAction(input: CreateBundleInput) {
  return bundlesApi.createBundle(input);
}

export async function updateBundleAction(id: string, input: UpdateBundleInput) {
  return bundlesApi.updateBundle(id, input);
}

export async function deleteBundleAction(id: string) {
  return bundlesApi.deleteBundle(id);
}

export async function getBundleStockAction(id: string) {
  return bundlesApi.getBundleStock(id);
}
