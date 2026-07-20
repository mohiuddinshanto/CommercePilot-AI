"use client";
import { useQuery } from "@tanstack/react-query";
import { getPublicProduct, getPublicProducts, getPublicCategories } from "../api/public-products.api";
import type { ProductQueryParams } from "@/types/product";
export function usePublicProducts(params: ProductQueryParams = {}) { return useQuery({ queryKey: ["public-products", params], queryFn: () => getPublicProducts(params) }); }
export function usePublicProduct(id: string) { return useQuery({ queryKey: ["public-products", id], queryFn: () => getPublicProduct(id), enabled: Boolean(id) }); }
export function usePublicCategories() { return useQuery({ queryKey: ["public-categories"], queryFn: getPublicCategories }); }
