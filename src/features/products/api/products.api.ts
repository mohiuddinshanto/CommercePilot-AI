import { post, get, patch, del } from "@/core/api-client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { buildQueryString } from "@/lib/query-string";
import type { Product, CreateProductInput, UpdateProductInput, ProductQueryParams } from "@/types/product";
import type { PaginatedData } from "@/types/api";

export async function getProducts(params: ProductQueryParams = {}): Promise<PaginatedData<Product>> {
  const query = buildQueryString(params);
  return get<PaginatedData<Product>>(`${API_ENDPOINTS.V1.PRODUCTS}${query}`);
}

export async function getProductById(id: string): Promise<Product> {
  return get<Product>(`${API_ENDPOINTS.V1.PRODUCTS}/${id}`);
}

export async function createProduct(input: CreateProductInput): Promise<Product> {
  return post<Product>(API_ENDPOINTS.V1.PRODUCTS, input);
}

export async function updateProduct(id: string, input: UpdateProductInput): Promise<Product> {
  return patch<Product>(`${API_ENDPOINTS.V1.PRODUCTS}/${id}`, input);
}

export async function deleteProduct(id: string): Promise<void> {
  return del<void>(`${API_ENDPOINTS.V1.PRODUCTS}/${id}`);
}
