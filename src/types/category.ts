export interface Category {
  _id: string;
  storeId: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  status: string;
  sortOrder: number;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
  parentId?: string;
  status?: string;
  sortOrder?: number;
}

export interface UpdateCategoryInput {
  name?: string;
  description?: string;
  parentId?: string;
  status?: string;
  sortOrder?: number;
}

export interface CategoryQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}
