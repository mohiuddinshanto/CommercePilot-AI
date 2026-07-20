"use client";

import * as categoriesApi from "@/features/categories/api/categories.api";
import type { CreateCategoryInput, UpdateCategoryInput, CategoryQueryParams } from "@/types/category";

export async function getCategoriesAction(params: CategoryQueryParams = {}) {
  return categoriesApi.getCategories(params);
}

export async function getCategoryAction(id: string) {
  return categoriesApi.getCategoryById(id);
}

export async function createCategoryAction(input: CreateCategoryInput) {
  return categoriesApi.createCategory(input);
}

export async function updateCategoryAction(id: string, input: UpdateCategoryInput) {
  return categoriesApi.updateCategory(id, input);
}

export async function deleteCategoryAction(id: string) {
  return categoriesApi.deleteCategory(id);
}
