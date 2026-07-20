"use client";

import * as productsApi from "@/features/products/api/products.api";
import type { CreateProductInput, UpdateProductInput, ProductQueryParams } from "@/types/product";

export async function getProductsAction(params: ProductQueryParams = {}) {
  return productsApi.getProducts(params);
}

export async function getProductAction(id: string) {
  return productsApi.getProductById(id);
}

export async function createProductAction(input: CreateProductInput) {
  return productsApi.createProduct(input);
}

export async function updateProductAction(id: string, input: UpdateProductInput) {
  return productsApi.updateProduct(id, input);
}

export async function deleteProductAction(id: string) {
  return productsApi.deleteProduct(id);
}
