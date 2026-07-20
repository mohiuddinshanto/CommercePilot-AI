import { get } from "@/core/api-client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { buildQueryString } from "@/lib/query-string";
import type { Product, ProductQueryParams } from "@/types/product";
import type { PaginatedData } from "@/types/api";

export type PublicProduct = Pick<Product, "_id" | "name" | "slug" | "sku" | "barcode" | "shortDescription" | "description" | "images" | "sellingPrice" | "discountPrice" | "stock" | "categoryId" | "tags" | "availableFrom" | "priority" | "createdAt" | "updatedAt">;

export function getPublicProducts(params: ProductQueryParams = {}) {
  return get<PaginatedData<PublicProduct>>(`${API_ENDPOINTS.V1.PUBLIC_PRODUCTS}${buildQueryString(params)}`);
}
export function getPublicProduct(id: string) { return get<PublicProduct>(`${API_ENDPOINTS.V1.PUBLIC_PRODUCTS}/${id}`); }

export interface PublicCategory {
  _id: string;
  name: string;
}

export function getPublicCategories() {
  return get<{ items: PublicCategory[] } | PublicCategory[]>(`${API_ENDPOINTS.V1.PUBLIC_PRODUCTS}/categories`);
}

