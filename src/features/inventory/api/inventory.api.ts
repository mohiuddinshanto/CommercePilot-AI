import { post, get, patch, del } from "@/core/api-client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { buildQueryString } from "@/lib/query-string";
import type {
  Inventory,
  CreateInventoryInput,
  UpdateInventoryInput,
  StockMovementInput,
  InventoryQueryParams,
  InventoryMovement,
} from "@/types/inventory";
import type { PaginatedData } from "@/types/api";

export async function getInventoryList(params: InventoryQueryParams = {}): Promise<PaginatedData<Inventory>> {
  const query = buildQueryString(params);
  return get<PaginatedData<Inventory>>(`${API_ENDPOINTS.V1.INVENTORY}${query}`);
}

export async function getInventoryById(id: string): Promise<Inventory> {
  return get<Inventory>(`${API_ENDPOINTS.V1.INVENTORY}/${id}`);
}

export async function createInventory(input: CreateInventoryInput): Promise<Inventory> {
  return post<Inventory>(API_ENDPOINTS.V1.INVENTORY, input);
}

export async function updateInventory(id: string, input: UpdateInventoryInput): Promise<Inventory> {
  return patch<Inventory>(`${API_ENDPOINTS.V1.INVENTORY}/${id}`, input);
}

export async function deleteInventory(id: string): Promise<void> {
  return del<void>(`${API_ENDPOINTS.V1.INVENTORY}/${id}`);
}

export async function stockInInventory(id: string, input: StockMovementInput): Promise<Inventory> {
  return post<Inventory>(`${API_ENDPOINTS.V1.INVENTORY}/${id}/stock-in`, input);
}

export async function stockOutInventory(id: string, input: StockMovementInput): Promise<Inventory> {
  return post<Inventory>(`${API_ENDPOINTS.V1.INVENTORY}/${id}/stock-out`, input);
}

export async function adjustInventory(id: string, input: StockMovementInput): Promise<Inventory> {
  return post<Inventory>(`${API_ENDPOINTS.V1.INVENTORY}/${id}/adjust`, input);
}

export async function getInventoryMovements(id: string): Promise<InventoryMovement[]> {
  return get<InventoryMovement[]>(`${API_ENDPOINTS.V1.INVENTORY}/${id}/movements`);
}

export async function getLowStock(): Promise<Inventory[]> {
  return get<Inventory[]>(`${API_ENDPOINTS.V1.INVENTORY}/low-stock`);
}

export async function getOutOfStock(): Promise<Inventory[]> {
  return get<Inventory[]>(`${API_ENDPOINTS.V1.INVENTORY}/out-of-stock`);
}
