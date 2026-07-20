export interface Product {
  _id: string;
  storeId: string;
  categoryId?: string;
  sku: string;
  barcode?: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  images: string[];
  costPrice: number;
  sellingPrice: number;
  discountPrice?: number;
  stock: number;
  lowStockLimit: number;
  status: string;
  tags: string[];
  availableFrom?: string;
  priority?: "low" | "medium" | "high";
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  categoryId?: string;
  sku: string;
  barcode?: string;
  name: string;
  shortDescription?: string;
  description?: string;
  images?: string[];
  costPrice: number;
  sellingPrice: number;
  discountPrice?: number;
  stock: number;
  lowStockLimit?: number;
  status?: string;
  tags?: string[];
  availableFrom?: string;
  priority?: "low" | "medium" | "high";
}

export interface UpdateProductInput {
  categoryId?: string;
  sku?: string;
  barcode?: string;
  name?: string;
  shortDescription?: string;
  description?: string;
  images?: string[];
  costPrice?: number;
  sellingPrice?: number;
  discountPrice?: number;
  stock?: number;
  lowStockLimit?: number;
  status?: string;
  tags?: string[];
  availableFrom?: string;
  priority?: "low" | "medium" | "high";
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  categoryId?: string;
  sortBy?: string;
  order?: "asc" | "desc";
  minPrice?: number;
  maxPrice?: number;
}


