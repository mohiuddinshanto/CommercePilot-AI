export interface Inventory {
  _id: string;
  storeId: string;
  productId: string;
  currentStock: number;
  lowStockLimit: number;
  reservedStock: number;
  availableStock: number;
  costPrice: number;
  lastRestockedAt: string | null;
  lastSoldAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface InventoryMovement {
  _id: string;
  storeId: string;
  inventoryId: string;
  productId: string;
  type: "stock_in" | "stock_out" | "adjustment";
  quantity: number;
  previousStock: number;
  newStock: number;
  reference: string | null;
  notes: string | null;
  createdBy: string;
  createdAt: string;
}

export interface CreateInventoryInput {
  productId: string;
  currentStock: number;
  lowStockLimit?: number;
  costPrice: number;
}

export interface UpdateInventoryInput {
  currentStock?: number;
  lowStockLimit?: number;
  costPrice?: number;
}

export interface StockMovementInput {
  quantity: number;
  reference?: string;
  notes?: string;
}

export interface InventoryQueryParams {
  page?: number;
  limit?: number;
  productId?: string;
  lowStock?: boolean;
  outOfStock?: boolean;
  sortBy?: string;
  order?: "asc" | "desc";
}
