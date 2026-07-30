export interface ReturnItem {
  productId?: string;
  bundleId?: string;
  quantity: number;
  unitPrice: number;
  refundAmount: number;
}

export interface ExchangeItem {
  productId: string;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Return {
  _id: string;
  storeId: string;
  saleId: string;
  invoiceNumber: string;
  customerId: string | null;
  customerName: string;
  customerPhone?: string | null;
  returnType: string;
  items: ReturnItem[];
  subtotal: number;
  refundAmount: number;
  exchangeItems?: ExchangeItem[];
  exchangeTotal?: number;
  adjustmentAmount?: number;
  status: string;
  reason: string;
  notes: string;
  isDeleted: boolean;
  deletedAt: string | null;
  deletedBy: string | null;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReturnInput {
  saleId: string;
  returnType: string;
  items: {
    productId?: string;
    bundleId?: string;
    quantity: number;
    unitPrice: number;
    refundAmount?: number;
  }[];
  exchangeItems?: {
    productId: string;
    name: string;
    sku: string;
    quantity: number;
    unitPrice: number;
  }[];
  reason: string;
  notes?: string;
}

export interface UpdateReturnInput {
  status?: string;
  reason?: string;
  notes?: string;
}

export interface ReturnQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}

export interface ReturnsSummary {
  totalReturns: number;
  totalRefundAmount: number;
  pendingReturns: number;
  completedReturns: number;
}
