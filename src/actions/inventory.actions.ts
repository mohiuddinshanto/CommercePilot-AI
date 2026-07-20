"use client";

import * as inventoryApi from "@/features/inventory/api/inventory.api";
import type {
  CreateInventoryInput,
  UpdateInventoryInput,
  StockMovementInput,
  InventoryQueryParams,
} from "@/types/inventory";

export async function getInventoryListAction(params: InventoryQueryParams = {}) {
  return inventoryApi.getInventoryList(params);
}

export async function getInventoryAction(id: string) {
  return inventoryApi.getInventoryById(id);
}

export async function createInventoryAction(input: CreateInventoryInput) {
  return inventoryApi.createInventory(input);
}

export async function updateInventoryAction(id: string, input: UpdateInventoryInput) {
  return inventoryApi.updateInventory(id, input);
}

export async function deleteInventoryAction(id: string) {
  return inventoryApi.deleteInventory(id);
}

export async function stockInAction(id: string, input: StockMovementInput) {
  return inventoryApi.stockInInventory(id, input);
}

export async function stockOutAction(id: string, input: StockMovementInput) {
  return inventoryApi.stockOutInventory(id, input);
}

export async function adjustStockAction(id: string, input: StockMovementInput) {
  return inventoryApi.adjustInventory(id, input);
}

export async function getInventoryMovementsAction(id: string) {
  return inventoryApi.getInventoryMovements(id);
}
