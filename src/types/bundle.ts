export interface BundleProduct {
  productId: string;
  quantity: number;
}

export interface Bundle {
  _id: string;
  storeId: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  products: BundleProduct[];
  originalPrice: number;
  bundlePrice: number;
  discountAmount: number;
  discountPercentage: number;
  status: string;
  isDeleted: boolean;
  deletedAt: string | null;
  deletedBy: string | null;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBundleInput {
  name: string;
  description?: string;
  image?: string;
  products: BundleProduct[];
  bundlePrice: number;
  status?: string;
}

export interface UpdateBundleInput {
  name?: string;
  description?: string;
  image?: string;
  products?: BundleProduct[];
  bundlePrice?: number;
  status?: string;
}

export interface BundleQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}

export interface BundleStock {
  bundleId: string;
  availableStock: number;
}
