import { post, get, patch, del } from "@/core/api-client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { buildQueryString } from "@/lib/query-string";
import type { Category, CreateCategoryInput, UpdateCategoryInput, CategoryQueryParams } from "@/types/category";
import type { PaginatedData } from "@/types/api";

export async function getCategories(params: CategoryQueryParams = {}): Promise<PaginatedData<Category>> {
  const query = buildQueryString(params);
  return get<PaginatedData<Category>>(`${API_ENDPOINTS.V1.CATEGORIES}${query}`);
}

export async function getCategoryById(id: string): Promise<Category> {
  return get<Category>(`${API_ENDPOINTS.V1.CATEGORIES}/${id}`);
}

export async function createCategory(input: CreateCategoryInput): Promise<Category> {
  return post<Category>(API_ENDPOINTS.V1.CATEGORIES, input);
}

export async function updateCategory(id: string, input: UpdateCategoryInput): Promise<Category> {
  return patch<Category>(`${API_ENDPOINTS.V1.CATEGORIES}/${id}`, input);
}

export async function deleteCategory(id: string): Promise<void> {
  return del<void>(`${API_ENDPOINTS.V1.CATEGORIES}/${id}`);
}
